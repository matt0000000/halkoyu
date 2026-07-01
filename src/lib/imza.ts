// ECDSA (P-256) ile oy imzalama/dogrulama. Ozel anahtar sadece /api/oy
// tarafinda (Cloudflare'in gizli ortam degiskeninden) kullanilir. Acik anahtar
// herkese acik oldugu icin tarayicida da (dogrulama sayfasinda) calisir --
// bu fonksiyonlar isomorphic (Web Crypto API, hem sunucu hem tarayici).

function base64ToBytes(b64: string): BufferSource {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)) as BufferSource;
}

function bytesToBase64(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function importOzelAnahtar(privateKeyBase64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    base64ToBytes(privateKeyBase64),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

export async function importAcikAnahtar(publicKeyBase64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'spki',
    base64ToBytes(publicKeyBase64),
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify']
  );
}

export async function imzala(privateKeyBase64: string, mesaj: string): Promise<string> {
  const key = await importOzelAnahtar(privateKeyBase64);
  const data = new TextEncoder().encode(mesaj);
  const imza = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, data);
  return bytesToBase64(imza);
}

export async function imzaDogrula(acikAnahtar: CryptoKey, mesaj: string, imzaBase64: string): Promise<boolean> {
  try {
    const sig = base64ToBytes(imzaBase64);
    const data = new TextEncoder().encode(mesaj);
    return await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, acikAnahtar, sig as BufferSource, data);
  } catch {
    return false;
  }
}
