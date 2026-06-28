-- Anketler tablosu
CREATE TABLE anketler (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  soru        text NOT NULL,
  secenek_a   text NOT NULL,
  secenek_b   text NOT NULL,
  aktif       boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Oylar tablosu (e-posta saklanmaz, sadece hash)
CREATE TABLE oylar (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anket_id    uuid NOT NULL REFERENCES anketler(id),
  email_hash  text NOT NULL,
  secim       char(1) NOT NULL CHECK (secim IN ('A', 'B')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(anket_id, email_hash)
);

-- OTP oturumları (10 dakika geçerli)
CREATE TABLE otp_oturumlari (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash  text NOT NULL,
  anket_id    uuid NOT NULL REFERENCES anketler(id),
  dogrulandi  boolean NOT NULL DEFAULT false,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Anketler herkese okunabilir (RLS)
ALTER TABLE anketler ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anketler_public_read" ON anketler
  FOR SELECT TO anon USING (true);

-- Oylar sayısı herkese okunabilir, yazma yasak (server key ile yapılır)
ALTER TABLE oylar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oylar_public_read" ON oylar
  FOR SELECT TO anon USING (true);

-- otp_oturumlari sadece service key ile erişilebilir
ALTER TABLE otp_oturumlari ENABLE ROW LEVEL SECURITY;
