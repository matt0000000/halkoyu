import { importAcikAnahtar, imzaDogrula } from './imza';

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function genesisHash(anketId: string): Promise<string> {
  return sha256Hex('GENESIS:' + anketId);
}

export async function zincirAdimHesapla(params: {
  oncekiHash: string;
  id: string;
  anketId: string;
  secim: string;
  emailHash: string;
  epochMs: number;
}): Promise<string> {
  const { oncekiHash, id, anketId, secim, emailHash, epochMs } = params;
  return sha256Hex(`${oncekiHash}|${id}|${anketId}|${secim}|${emailHash}|${epochMs}`);
}

export interface ZincirOyu {
  id: string;
  secim: string;
  email_hash: string;
  created_at_ms: number;
  chain_hash: string;
  imza: string | null;
}

export interface ZincirDogrulamaSonucu {
  gecerli: boolean;
  hataIndex: number | null;
  sonHash: string | null;
}

/**
 * Bu ayni algoritma Postgres trigger'inda (oy_zincir_hesapla) da calisir.
 * Iki taraf da bagimsiz olarak ayni sonuca varmali; tutmuyorsa zincir bozulmus demektir.
 */
export async function zinciriDogrula(anketId: string, oylar: ZincirOyu[]): Promise<ZincirDogrulamaSonucu> {
  let onceki = await genesisHash(anketId);
  for (let i = 0; i < oylar.length; i++) {
    const o = oylar[i];
    const hesaplanan = await zincirAdimHesapla({
      oncekiHash: onceki,
      id: o.id,
      anketId,
      secim: o.secim,
      emailHash: o.email_hash,
      epochMs: o.created_at_ms
    });
    if (hesaplanan !== o.chain_hash) {
      return { gecerli: false, hataIndex: i, sonHash: null };
    }
    onceki = hesaplanan;
  }
  return { gecerli: true, hataIndex: null, sonHash: onceki };
}

export interface ImzaDogrulamaSonucu {
  imzaliSayisi: number;
  imzasizSayisi: number;
  gecersizImzaSayisi: number;
  gecersizImzaIndexleri: number[];
}

/**
 * Her oyun imzasini (varsa) acik anahtarla dogrular. imza=null olan satirlar
 * "imzasiz" sayilir (imzalama ozelligi eklenmeden once kaydedilmis olabilir).
 * imza var ama dogrulanamayan satirlar "gecersiz" sayilir -- bu, dogrudan
 * veritabanina yazilmis (uygulamadan gecmemis) sahte bir satir oldugunun
 * guclu bir isaretidir, cunku ozel anahtar veritabaninda hic bulunmaz.
 */
export async function imzalariDogrula(
  oylar: ZincirOyu[],
  acikAnahtarBase64: string | null
): Promise<ImzaDogrulamaSonucu> {
  const sonuc: ImzaDogrulamaSonucu = {
    imzaliSayisi: 0,
    imzasizSayisi: 0,
    gecersizImzaSayisi: 0,
    gecersizImzaIndexleri: []
  };

  if (!acikAnahtarBase64) {
    sonuc.imzasizSayisi = oylar.length;
    return sonuc;
  }

  const acikAnahtar = await importAcikAnahtar(acikAnahtarBase64);

  for (let i = 0; i < oylar.length; i++) {
    const o = oylar[i];
    if (!o.imza) {
      sonuc.imzasizSayisi++;
      continue;
    }
    const gecerli = await imzaDogrula(acikAnahtar, o.chain_hash, o.imza);
    if (gecerli) {
      sonuc.imzaliSayisi++;
    } else {
      sonuc.gecersizImzaSayisi++;
      sonuc.gecersizImzaIndexleri.push(i);
    }
  }

  return sonuc;
}
