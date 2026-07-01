-- Oy zinciri: her oy, kendinden önceki oyun hash'ini içerir (tamper-evident chain).
-- Geçmişte bir satır değiştirilir/silinirse zincirin geri kalanı artık tutmaz.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE oylar ADD COLUMN chain_hash text;

-- Mevcut oyları geriye dönük olarak zincirle (varsa)
DO $$
DECLARE
  r record;
  onceki_hash text;
  cur_anket uuid;
  epoch_ms bigint;
BEGIN
  cur_anket := NULL;
  FOR r IN SELECT * FROM oylar ORDER BY anket_id, created_at ASC, id ASC LOOP
    IF r.anket_id IS DISTINCT FROM cur_anket THEN
      cur_anket := r.anket_id;
      onceki_hash := encode(digest('GENESIS:' || cur_anket::text, 'sha256'), 'hex');
    END IF;
    epoch_ms := floor(extract(epoch FROM r.created_at) * 1000);
    onceki_hash := encode(
      digest(onceki_hash || '|' || r.id::text || '|' || r.anket_id::text || '|' || r.secim || '|' || r.email_hash || '|' || epoch_ms::text, 'sha256'),
      'hex'
    );
    UPDATE oylar SET chain_hash = onceki_hash WHERE id = r.id;
  END LOOP;
END $$;

-- Bundan sonraki her oy trigger ile otomatik zincirlenir
CREATE OR REPLACE FUNCTION oy_zincir_hesapla()
RETURNS trigger AS $$
DECLARE
  onceki_hash text;
  epoch_ms bigint;
BEGIN
  -- Aynı ankete eşzamanlı gelen oylar sıraya girsin (zincir çatallanmasın)
  PERFORM pg_advisory_xact_lock(hashtext(new.anket_id::text));

  SELECT chain_hash INTO onceki_hash
  FROM oylar
  WHERE anket_id = new.anket_id
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  IF onceki_hash IS NULL THEN
    onceki_hash := encode(digest('GENESIS:' || new.anket_id::text, 'sha256'), 'hex');
  END IF;

  epoch_ms := floor(extract(epoch FROM new.created_at) * 1000);

  new.chain_hash := encode(
    digest(onceki_hash || '|' || new.id::text || '|' || new.anket_id::text || '|' || new.secim || '|' || new.email_hash || '|' || epoch_ms::text, 'sha256'),
    'hex'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS oy_zincir_trigger ON oylar;
CREATE TRIGGER oy_zincir_trigger
  BEFORE INSERT ON oylar
  FOR EACH ROW EXECUTE FUNCTION oy_zincir_hesapla();

ALTER TABLE oylar ALTER COLUMN chain_hash SET NOT NULL;

-- Zaman damgaları: zincirin belirli anlardaki "root hash"i Bitcoin blockchain'ine
-- (OpenTimestamps aracılığıyla) periyodik olarak damgalanır. Bu sayede geçmiş bir
-- oyun sessizce değiştirilmesi -- sadece bizim değil, bağımsız üçüncü bir tarafça
-- (Bitcoin ağı) da tespit edilebilir hale gelir.
CREATE TABLE zaman_damgalari (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anket_id        uuid NOT NULL REFERENCES anketler(id),
  root_hash       text NOT NULL,
  oy_sayisi       integer NOT NULL,
  ots_proof       text,
  durum           text NOT NULL DEFAULT 'bekliyor' CHECK (durum IN ('bekliyor', 'onaylandi', 'hata')),
  hata_mesaji     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  guncellendi_at  timestamptz
);

ALTER TABLE zaman_damgalari ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zaman_damgalari_public_read" ON zaman_damgalari
  FOR SELECT TO anon USING (true);
