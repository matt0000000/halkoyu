import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';
import { emailHash } from '$lib/hash';
import { imzala } from '$lib/imza';
import { CHAIN_PRIVATE_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const body = await request.json().catch(() => null);
  const anketId: string = body?.anketId?.trim() ?? '';
  const secim: string = body?.secim ?? '';

  if (!anketId || !['A', 'B'].includes(secim)) {
    return json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  // Anketin aktif olduğunu doğrula
  const { data: anket, error: anketError } = await supabaseServer
    .from('anketler')
    .select('id, aktif')
    .eq('id', anketId)
    .single();

  if (anketError || !anket) {
    return json({ error: 'Anket bulunamadı' }, { status: 404 });
  }

  if (!anket.aktif) {
    return json({ error: 'Bu anket kapalı' }, { status: 403 });
  }

  const ip = getClientAddress();
  const visitorHash = await emailHash(ip, anketId);

  // Oyu kaydet (UNIQUE constraint duplicate'ı engeller)
  const { data: yeniOy, error: insertError } = await supabaseServer
    .from('oylar')
    .insert({ anket_id: anketId, email_hash: visitorHash, secim })
    .select('id, chain_hash')
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      // Önceki seçimi ve güncel sayıları döndür
      const [{ data: mevcutOy }, [{ count: oyA }, { count: oyB }]] = await Promise.all([
        supabaseServer.from('oylar').select('secim').eq('anket_id', anketId).eq('email_hash', visitorHash).single(),
        Promise.all([
          supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'A'),
          supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'B')
        ])
      ]);
      return json({
        error: 'Bu ankette zaten oy kullandınız',
        oncekiSecim: mevcutOy?.secim ?? null,
        oylar: { a: oyA ?? 0, b: oyB ?? 0 }
      }, { status: 409 });
    }
    return json({ error: 'Oy kaydedilemedi, tekrar deneyin' }, { status: 500 });
  }

  // Oyu ozel anahtarla imzala -- bu imzayi sadece bu sunucu uretebilir,
  // veritabanina dogrudan erisimi olan biri (service key/SQL Editor) uretemez.
  try {
    const imza = await imzala(CHAIN_PRIVATE_KEY, yeniOy.chain_hash);
    await supabaseServer.from('oylar').update({ imza }).eq('id', yeniOy.id);
  } catch (e) {
    console.error('imzalama basarisiz:', e);
  }

  // Güncel sonuçları döndür
  const [{ count: oyA }, { count: oyB }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'B')
  ]);

  return json({ ok: true, oylar: { a: oyA ?? 0, b: oyB ?? 0 } });
};
