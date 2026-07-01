// GitHub Actions cron'u ile calisir. Iki is yapar:
//   1) Yeni oy zinciri "root hash"i degismis her anket icin yeni bir OpenTimestamps
//      damgasi al (Bitcoin calendar sunucularina gonder, "bekliyor" durumunda kaydet).
//   2) "bekliyor" durumundaki eski damgalari yukselt -- eger o arada ilgili Bitcoin
//      blogu kazilip onaylandiysa durumu "onaylandi" yap ve kaniti guncelle.
import { createClient } from '@supabase/supabase-js';
import OpenTimestamps from 'opentimestamps';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL ve SUPABASE_SERVICE_KEY ortam degiskenleri gerekli');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function yeniAnkorlar() {
  const { data: anketler, error: anketError } = await supabase
    .from('anketler')
    .select('id, slug');

  if (anketError) {
    console.error('anketler sorgusu basarisiz:', anketError.message);
    return;
  }

  for (const anket of anketler ?? []) {
    const { data: sonOy } = await supabase
      .from('oylar')
      .select('chain_hash')
      .eq('anket_id', anket.id)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sonOy?.chain_hash) continue; // henuz oy yok

    const { count: oySayisi } = await supabase
      .from('oylar')
      .select('*', { count: 'exact', head: true })
      .eq('anket_id', anket.id);

    const { data: mevcutAnkor } = await supabase
      .from('zaman_damgalari')
      .select('id')
      .eq('anket_id', anket.id)
      .eq('root_hash', sonOy.chain_hash)
      .maybeSingle();

    if (mevcutAnkor) {
      console.log(`[${anket.slug}] root hash zaten damgalanmis, atlaniyor`);
      continue;
    }

    try {
      const hashBytes = Buffer.from(sonOy.chain_hash, 'hex');
      const detached = OpenTimestamps.DetachedTimestampFile.fromHash(
        new OpenTimestamps.Ops.OpSHA256(),
        hashBytes
      );
      await OpenTimestamps.stamp(detached);
      const otsBase64 = Buffer.from(detached.serializeToBytes()).toString('base64');

      const { error: insertError } = await supabase.from('zaman_damgalari').insert({
        anket_id: anket.id,
        root_hash: sonOy.chain_hash,
        oy_sayisi: oySayisi ?? 0,
        ots_proof: otsBase64,
        durum: 'bekliyor'
      });

      if (insertError) throw insertError;
      console.log(`[${anket.slug}] yeni damga alindi: ${sonOy.chain_hash.slice(0, 16)}...`);
    } catch (e) {
      console.error(`[${anket.slug}] damgalama basarisiz:`, e.message);
      await supabase.from('zaman_damgalari').insert({
        anket_id: anket.id,
        root_hash: sonOy.chain_hash,
        oy_sayisi: oySayisi ?? 0,
        durum: 'hata',
        hata_mesaji: e.message
      });
    }
  }
}

async function bekleyenleriYukselt() {
  const { data: bekleyenler, error: bekleyenError } = await supabase
    .from('zaman_damgalari')
    .select('id, ots_proof')
    .eq('durum', 'bekliyor');

  if (bekleyenError) {
    console.error('bekleyen damgalar sorgusu basarisiz:', bekleyenError.message);
    return;
  }

  for (const damga of bekleyenler ?? []) {
    if (!damga.ots_proof) continue;
    try {
      const bytes = Buffer.from(damga.ots_proof, 'base64');
      const detached = OpenTimestamps.DetachedTimestampFile.deserialize(bytes);
      await OpenTimestamps.upgrade(detached);

      const tamamlandi = detached.timestamp.isTimestampComplete();
      const yeniBytes = Buffer.from(detached.serializeToBytes()).toString('base64');

      await supabase
        .from('zaman_damgalari')
        .update({
          ots_proof: yeniBytes,
          durum: tamamlandi ? 'onaylandi' : 'bekliyor',
          guncellendi_at: new Date().toISOString()
        })
        .eq('id', damga.id);

      console.log(`damga ${damga.id} guncellendi: ${tamamlandi ? 'onaylandi' : 'hala bekliyor'}`);
    } catch (e) {
      console.error(`damga ${damga.id} yukseltilemedi:`, e.message);
    }
  }
}

await yeniAnkorlar();
await bekleyenleriYukselt();
console.log('bitti.');
