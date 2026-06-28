# Halkoyu — Tasarım Dökümanı

**Tarih:** 2026-06-28  
**Durum:** Onaylandı

## Özet

Türkçe, halk oylaması sitesi. Ziyaretçiler güncel konulardaki anketlere e-posta OTP doğrulamasıyla oy kullanır. Anketler admin tarafından Supabase Studio üzerinden oluşturulur. Sonuçlar her zaman herkese açıktır.

## Mimari

**Stack:** SvelteKit + Supabase + Tailwind CSS  
**Deploy:** Vercel veya Cloudflare Pages  
**Admin:** Supabase Studio (ayrı admin arayüzü yok)

```
halkoyu/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Ana sayfa — aktif anketler listesi
│   │   ├── anket/[slug]/
│   │   │   └── +page.svelte          # Anket detay + oy formu + sonuçlar
│   │   └── api/
│   │       ├── oy/+server.ts         # POST: oy kaydetme (sunucu tarafı)
│   │       └── otp/+server.ts        # POST: OTP gönder / doğrula
│   └── lib/
│       ├── supabase.ts               # Supabase client (server + client)
│       └── components/
│           ├── AnketKarti.svelte     # Anket liste kartı
│           ├── SonucBar.svelte       # Sonuç bar chart
│           └── OyFormu.svelte        # E-posta + OTP inline formu
├── supabase/
│   └── migrations/
│       └── 001_initial.sql           # Tablo şemaları
└── .env                              # SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
```

## Veritabanı Şeması

```sql
-- Anketler
CREATE TABLE anketler (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  soru        text NOT NULL,
  secenek_a   text NOT NULL,
  secenek_b   text NOT NULL,
  aktif       boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Oylar
CREATE TABLE oylar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anket_id    uuid NOT NULL REFERENCES anketler(id),
  email_hash  text NOT NULL,        -- SHA-256(email + anket_id), e-posta saklanmaz
  secim       char(1) NOT NULL CHECK (secim IN ('A', 'B')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(anket_id, email_hash)
);

-- OTP oturumları (kısa ömürlü, 10 dakika)
CREATE TABLE otp_oturumlari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash  text NOT NULL,
  anket_id    uuid NOT NULL REFERENCES anketler(id),
  dogrulandi  boolean NOT NULL DEFAULT false,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

**Kararlar:**
- E-posta adresi hiçbir tabloda saklanmaz — `SHA-256(email + anket_id)` hash'i tutulur (KVKK uyumlu)
- `UNIQUE(anket_id, email_hash)` ile aynı e-posta aynı ankete 2 kez oy kullanamaz (DB seviyesinde garanti)
- Supabase Auth OTP geçici olarak e-postayı işler, bizim DB'ye yazmayız

## Oy Kullanma Akışı

1. Kullanıcı `/anket/[slug]` sayfasını açar → soru + seçenekler + anlık sonuçlar görünür
2. Seçeneği seçer (A veya B) → e-posta giriş alanı açılır
3. E-posta girer → `/api/otp` Supabase Auth OTP'yi tetikler
4. 6 haneli kodu girer → `/api/oy` endpoint'i:
   - OTP'yi Supabase ile doğrular
   - `SHA-256(email + anket_id)` hesaplar
   - Duplicate kontrolü yapar
   - Oyu `oylar` tablosuna yazar
5. "Oyunuz kaydedildi!" + güncel sonuçlar

**Hata durumları:**
- Zaten oy kullanılmışsa: "Bu anket için zaten oy kullandınız"
- OTP süresi dolmuşsa: "Kodun süresi doldu, tekrar gönderin"
- Anket kapalıysa: Oy formu gizlenir

## Güvenlik

| Tehdit | Önlem |
|--------|-------|
| Bot kitlesel oy | E-posta OTP zorunlu |
| Aynı e-posta tekrar oy | `UNIQUE(anket_id, email_hash)` DB constraint |
| OTP brute force | Supabase rate limiting (built-in) |
| Sahte API isteği | Oy kaydı server-side endpoint'te, client DB'ye direkt yazamaz |
| E-posta veri sızıntısı | Plain e-posta asla DB'ye yazılmaz, sadece hash |

## Sayfalar & UI

**Ana Sayfa (`/`)**
- Aktif anketler listesi: soru + toplam oy + "Katıl" butonu
- Tamamlanan anketler ayrı bölümde

**Anket Sayfası (`/anket/[slug]`)**
- Büyük soru metni
- 2 seçenek butonu — seçilince highlight
- Sonuç bar chart'ı (her zaman görünür, yüzde + oy sayısı)
- Oy formu: aynı sayfada inline/modal (yönlendirme yok)
- Anket kapalıysa form gizlenir

**UI Kararları:**
- Tailwind CSS, minimal ve sade
- Mobil öncelikli (responsive)
- Türkçe arayüz
- Animasyon yok, performans öncelikli

## Kapsam Dışı

- Kullanıcı kayıt/profil sistemi
- Yorum/tartışma özelliği
- Anket önerme (kullanıcı tarafından)
- Çoklu seçenek (ikiden fazla şık)
- Çok dilli destek
- Özel admin paneli (Supabase Studio yeterli)
