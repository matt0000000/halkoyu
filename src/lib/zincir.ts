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
