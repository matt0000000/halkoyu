// Bir kerelik calistirilir. Oy imzalama icin bir ECDSA (P-256) anahtar cifti uretir.
//
// ONEMLI: Bu script'i KENDI bilgisayarinda calistir (Claude'a veya baska
// kimseye ozel anahtari GOSTERME/PAYLASMA). Ozel anahtar sadece Cloudflare
// Pages'in "Encrypted" ortam degiskenine girilmeli -- baska hicbir yere
// yazilmamali (git'e commit etme, kimseyle paylasma).
//
// Kullanim: node scripts/anahtar-uret.mjs
const kp = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,
  ['sign', 'verify']
);

const pub = await crypto.subtle.exportKey('spki', kp.publicKey);
const priv = await crypto.subtle.exportKey('pkcs8', kp.privateKey);

console.log('');
console.log('=== OZEL ANAHTAR (GIZLI -- sadece Cloudflare "Encrypted" degiskenine gir) ===');
console.log('CHAIN_PRIVATE_KEY=' + Buffer.from(priv).toString('base64'));
console.log('');
console.log('=== ACIK ANAHTAR (herkese acik -- normal ortam degiskeni olarak girilebilir) ===');
console.log('PUBLIC_CHAIN_PUBLIC_KEY=' + Buffer.from(pub).toString('base64'));
console.log('');
console.log('Cloudflare Pages > Settings > Environment Variables:');
console.log('  - CHAIN_PRIVATE_KEY        -> "Encrypt" isaretli olarak ekle');
console.log('  - PUBLIC_CHAIN_PUBLIC_KEY  -> normal (encrypt gerekmez) ekle');
console.log('');
