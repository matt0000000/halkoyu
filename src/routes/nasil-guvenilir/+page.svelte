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
  <p style="margin: 0 0 32px; font-size: 15px; color: oklch(0.65 0.01 260); line-height: 1.6;">
    Kısa cevap: bize güvenmene gerek yok. Sisteme güvenmen yeterli — çünkü sonuçları biz istesek bile fark ettirmeden değiştiremeyiz.
  </p>

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
    <p style="margin: 0; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Ama tek başına bu yeterli değil — çünkü "zincir bende duruyor, ben de bozulmadığını söylüyorum" demek yine bize güvenmeni gerektirir. Bunun için zincirin belirli anlardaki durumunu, bizim kontrolümüzde olmayan, herkese açık bir sisteme kaydediyoruz: <strong style="color: {LIME};">Bitcoin ağı</strong>. Bu ağ üzerinden "bu zincir şu tarihte, tam olarak bu haliyle var olmuş" diye bağımsız bir kanıt oluşuyor — bunu biz üretmiyoruz, dünya çapında binlerce bağımsız bilgisayar üretiyor.
    </p>
  </div>

  <!-- What it means for you -->
  <div style="margin-bottom: 28px;">
    <h3 style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 17px; margin: 0 0 8px; color: oklch(0.9 0.005 260);">Bunun sana faydası ne?</h3>
    <p style="margin: 0; font-size: 14px; color: oklch(0.65 0.01 260); line-height: 1.7;">
      Herhangi bir anketin sonuç sayfasında "zinciri doğrula" linkine tıklayarak, o anketin tüm oy kayıtlarını indirebilir ve kendi tarayıcında zincirin gerçekten tutarlı olup olmadığını kontrol edebilirsin. İstersen daha da ileri gidip, Bitcoin'e yapılan damgalamayı bizden tamamen bağımsız bir araçla (opentimestamps.org) da doğrulayabilirsin. Hiçbir aşamada bize güvenmen gerekmiyor — sadece matematiği ve Bitcoin ağını kontrol ediyorsun.
    </p>
  </div>

  <!-- Honest limitation -->
  <div style="padding: 16px 20px; background: oklch(0.16 0.012 265); border-radius: 10px; margin-bottom: 32px;">
    <p style="margin: 0; font-size: 13px; color: oklch(0.6 0.01 260); line-height: 1.6;">
      <strong style="color: oklch(0.8 0.01 260);">Dürüst olalım:</strong> Bu sistem, bir oy kaydedildikten sonra sessizce değiştirilemeyeceğini garanti eder. Oy kullanma sırasında kişi başı tek oy kısıtlamasını da ayrıca (çerez tabanlı) uyguluyoruz — bu iki önlem birlikte sonuçların hem doğru sayıldığını hem de sonradan bozulamayacağını sağlıyor.
    </p>
  </div>

  <a href="/sonuclar" style="display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: {LIME}; text-decoration: underline;">
    Geçmiş anketlerden birini doğrula →
  </a>
</div>
