<script lang="ts">
  const LIME = 'oklch(0.82 0.17 145)';
</script>

<svelte:head>
  <title>Bu sonuçlara neden güvenebilirsin? — referandoom</title>
</svelte:head>

<div style="padding-top: 28px;">
  <h2 style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.02em; margin: 0 0 8px; color: oklch(0.96 0.005 260);">
    Bu sonuçlara neden güvenebilirsin?
  </h2>
  <p style="margin: 0 0 20px; font-size: 15px; color: oklch(0.65 0.01 260); line-height: 1.6;">
    Kısa cevap: bize güvenmene gerek yok. Sisteme güvenmen yeterli — çünkü sonuçları biz istesek bile fark ettirmeden değiştiremeyiz.
  </p>

  <!-- Quick-scan summary -->
  <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px;">
    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: oklch(0.22 0.015 265); border-radius: 10px;">
      <span style="font-size: 18px; flex-shrink: 0;">🔗</span>
      <span style="font-size: 13px; color: oklch(0.8 0.01 260);"><strong style="color: oklch(0.94 0.005 260);">Zincir:</strong> her oy, öncekinin izini taşır — geçmiş sessizce değiştirilemez</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: oklch(0.22 0.015 265); border-radius: 10px;">
      <span style="font-size: 18px; flex-shrink: 0;">✍️</span>
      <span style="font-size: 13px; color: oklch(0.8 0.01 260);"><strong style="color: oklch(0.94 0.005 260);">İmza:</strong> her oy gizli bir anahtarla imzalanır — veritabanına sahte oy eklenemez</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: oklch(0.22 0.015 265); border-radius: 10px;">
      <span style="font-size: 18px; flex-shrink: 0;">₿</span>
      <span style="font-size: 13px; color: oklch(0.8 0.01 260);"><strong style="color: oklch(0.94 0.005 260);">Bitcoin:</strong> zincirin durumu periyodik olarak bağımsız bir ağa damgalanır</span>
    </div>
  </div>

  <!-- The problem -->
  <div style="margin-bottom: 28px;">
    <h3 style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin: 0 0 8px; color: oklch(0.9 0.005 260);">Normalde bir anket sitesinde ne sorun olur?</h3>
    <p style="margin: 0; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Çoğu anket sitesinde sonuçlar bir veritabanında tutulur ve siteyi işleten kişi o veritabanına dilediği gibi müdahale edebilir. Yani teoride, kimse fark etmeden bir sayıyı değiştirebilir. Bunun tek çaresi "bana güven" demektir — ki bu hiçbir şey garanti etmez.
    </p>
  </div>

  <!-- The solution -->
  <div style="margin-bottom: 28px;">
    <h3 style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin: 0 0 8px; color: oklch(0.9 0.005 260);">Biz ne yapıyoruz?</h3>
    <p style="margin: 0 0 14px; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Her oy, kendisinden önce verilmiş oyun bir "izini" taşıyacak şekilde kaydediliyor — tıpkı bir zincirin halkaları gibi. Bir halkayı sonradan değiştirmeye çalışırsan, ona bağlı bütün halkalar da bozulur. Yani geçmişte bir oyu değiştirmek, zincirin geri kalanını da matematiksel olarak tutarsız hale getirir — bu her zaman tespit edilebilir.
    </p>
    <p style="margin: 0 0 14px; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Ama tek başına bu yeterli değil — çünkü "zincir bende duruyor, ben de bozulmadığını söylüyorum" demek yine bize güvenmeni gerektirir. Bunun için zincirin belirli anlardaki durumunu, bizim kontrolümüzde olmayan, herkese açık bir sisteme kaydediyoruz: <strong style="color: {LIME};">Bitcoin ağı</strong>. Bu ağ üzerinden "bu zincir şu tarihte, tam olarak bu haliyle var olmuş" diye bağımsız bir kanıt oluşuyor — bunu biz üretmiyoruz, dünya çapında binlerce bağımsız bilgisayar üretiyor.
    </p>
    <p style="margin: 0; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Ayrıca her oy, sadece uygulamanın kendisinde bulunan <strong style="color: {LIME};">gizli bir anahtarla imzalanıyor</strong> — bu anahtar veritabanında hiç durmuyor. Yani veritabanına doğrudan erişimi olan biri (biz dahil) yeni bir sahte oy eklese bile, o satırın geçerli bir imzası olmaz — bu da herkes tarafından anında fark edilebilir. Bu, "geçmişi değiştiremem" garantisine ek olarak "yeni sahte oy da ekleyemem" garantisini getiriyor.
    </p>
  </div>

  <!-- What it means for you -->
  <div style="margin-bottom: 28px;">
    <h3 style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin: 0 0 8px; color: oklch(0.9 0.005 260);">Bunun sana faydası ne?</h3>
    <p style="margin: 0; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Herhangi bir anketin sonuç sayfasında "🔒 sonucu doğrula" linkine tıklayarak, o anketin tüm oy kayıtlarını indirebilir ve kendi tarayıcında zincirin gerçekten tutarlı olup olmadığını kontrol edebilirsin. İstersen daha da ileri gidip, Bitcoin'e yapılan damgalamayı bizden tamamen bağımsız bir araçla (opentimestamps.org) da doğrulayabilirsin. Hiçbir aşamada bize güvenmen gerekmiyor — sadece matematiği ve Bitcoin ağını kontrol ediyorsun.
    </p>
  </div>

  <!-- Honest limitation -->
  <div style="padding: 16px 20px; background: oklch(0.16 0.012 265); border-radius: 10px; margin-bottom: 32px;">
    <p style="margin: 0; font-size: 13px; color: oklch(0.6 0.01 260); line-height: 1.6;">
      <strong style="color: oklch(0.8 0.01 260);">Dürüst olalım:</strong> Bu sistem, bir oyun sessizce değiştirilmesini ve doğrudan veritabanına sahte oy eklenmesini pratikte imkansız hale getirir. Ama mutlak bir garanti değil — imzalama anahtarını üreten ve saklayan taraf olduğumuz için, bilinçli olarak o anahtarı çalıp sahte imza üretmemiz teorik olarak mümkün. Bu, "tek bir SQL sorgusuyla saniyeler içinde" değil, kasıtlı ve iz bırakan bir sahtecilik girişimi gerektirir. Oy kullanma sırasında kişi başı tek oy kısıtlamasını da ayrıca (çerez tabanlı) uyguluyoruz.
    </p>
  </div>

  <a href="/sonuclar" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: {LIME}; text-decoration: underline;">
    Geçmiş anketlerden birini doğrula →
  </a>
</div>
