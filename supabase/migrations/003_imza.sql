-- Her oyun, sadece uygulamanin (Cloudflare'deki gizli ozel anahtarin) sahip
-- oldugu bir imzasi olur. chain_hash formulu herkese acik oldugu icin
-- veritabanina dogrudan erisimi olan biri (service key / SQL Editor) gecerli
-- bir chain_hash uretebilir -- ama imza icin ozel anahtar gerekir, o da
-- veritabaninda hic bulunmaz. Bu yuzden dogrudan SQL ile eklenen sahte
-- satirlarin imzasi olmaz veya gecersiz olur; bu /dogrulama sayfasinda
-- herkes tarafindan tespit edilebilir.
ALTER TABLE oylar ADD COLUMN imza text;
