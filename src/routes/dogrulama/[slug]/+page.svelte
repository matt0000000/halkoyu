<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { zinciriDogrula, imzalariDogrula, type ZincirDogrulamaSonucu, type ImzaDogrulamaSonucu } from '$lib/zincir';

  let { data }: { data: PageData } = $props();

  const LIME = 'oklch(0.82 0.17 145)';
  const KIRMIZI = 'oklch(0.6 0.2 25)';
  const SARI = 'oklch(0.75 0.15 80)';

  let durum = $state<'kontrol-ediliyor' | 'gecerli' | 'gecersiz'>('kontrol-ediliyor');
  let sonuc = $state<ZincirDogrulamaSonucu | null>(null);
  let imzaSonuc = $state<ImzaDogrulamaSonucu | null>(null);

  onMount(async () => {
    const [r, i] = await Promise.all([
      zinciriDogrula(data.anket.id, data.zincir.oylar),
      imzalariDogrula(data.zincir.oylar, data.zincir.acik_anahtar)
    ]);
    sonuc = r;
    imzaSonuc = i;
    durum = r.gecerli ? 'gecerli' : 'gecersiz';
  });

  function formatDurum(d: string): { label: string; color: string } {
    if (d === 'onaylandi') return { label: 'Bitcoin\'de onaylandı', color: LIME };
    if (d === 'bekliyor') return { label: 'Onay bekliyor (Bitcoin)', color: 'oklch(0.75 0.15 80)' };
    return { label: 'Hata', color: KIRMIZI };
  }

  function indirJson() {
    const blob = new Blob([JSON.stringify(data.zincir, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.anket.slug}-zincir.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function indirOts(otsBase64: string, index: number) {
    const bytes = Uint8Array.from(atob(otsBase64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.anket.slug}-${index}.ots`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Doğrulama — {data.anket.soru} — referandoom</title>
</svelte:head>

<div style="padding-top: 28px;">
  <a href="/sonuclar" style="display: inline-block; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; color: oklch(0.6 0.01 260); text-decoration: none;">← Arşiv</a>

  <h2 style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -0.02em; margin: 0 0 6px; color: oklch(0.96 0.005 260);">Zincir Doğrulaması</h2>
  <p style="margin: 0 0 6px; font-size: 14px; color: oklch(0.6 0.01 260);">{data.anket.soru}</p>
  <p style="margin: 0 0 28px; font-size: 13px; color: oklch(0.55 0.01 260); line-height: 1.6;">
    Bu sayfa, bu anketin oy kayıtlarının sonradan değiştirilip değiştirilmediğini <strong>senin tarayıcında</strong> kontrol eder — bize güvenmene gerek yok.
    Bu sistemin nasıl çalıştığını sade bir dille anlatan <a href="/nasil-guvenilir" style="color: oklch(0.82 0.17 145); text-decoration: underline;">bu sayfayı</a> önce okuyabilirsin.
  </p>

  <!-- Verification status -->
  <div style="padding: 22px 24px; border-radius: 12px; margin-bottom: 28px; background: oklch(0.22 0.015 265); border: 1.5px solid {durum === 'gecersiz' ? KIRMIZI : durum === 'gecerli' ? LIME : 'oklch(0.34 0.02 265)'};">
    {#if durum === 'kontrol-ediliyor'}
      <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: oklch(0.7 0.01 260);">Tarayıcınızda zincir yeniden hesaplanıyor…</p>
    {:else if durum === 'gecerli'}
      <p style="margin: 0 0 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: {LIME};">✓ Zincir tutarlı</p>
      <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">{data.zincir.oylar.length} oy kaydı, tarayıcınızda yeniden hesaplandı ve tümü eşleşti. Bu hesaplama sizin cihazınızda yapıldı — bize güvenmenize gerek yok.</p>
    {:else}
      <p style="margin: 0 0 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: {KIRMIZI};">✗ Tutarsızlık tespit edildi</p>
      <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">Kayıt #{sonuc?.hataIndex} zincirdeki beklenen hash ile eşleşmiyor. Bu, o kayıttan sonraki verinin değiştirilmiş olabileceği anlamına gelir.</p>
    {/if}
  </div>

  <!-- Signature verification -->
  {#if imzaSonuc}
    {@const supheli = imzaSonuc.gecersizImzaSayisi > 0}
    <div style="padding: 22px 24px; border-radius: 12px; margin-bottom: 28px; background: oklch(0.22 0.015 265); border: 1.5px solid {supheli ? KIRMIZI : LIME};">
      {#if supheli}
        <p style="margin: 0 0 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: {KIRMIZI};">⚠ {imzaSonuc.gecersizImzaSayisi} kayıtta geçersiz imza tespit edildi</p>
        <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">Bu kayıtlar, uygulamanın gerçek imzalama anahtarı olmadan eklenmiş olabilir — yani doğrudan veritabanına yazılmış sahte oy olma ihtimali yüksek.</p>
      {:else if data.zincir.acik_anahtar}
        <p style="margin: 0 0 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; color: {LIME};">✓ Tüm imzalar geçerli</p>
        <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">
          {imzaSonuc.imzaliSayisi} kayıt, uygulamanın özel anahtarıyla imzalanmış ve açık anahtarla doğrulandı.
          {#if imzaSonuc.imzasizSayisi > 0}{imzaSonuc.imzasizSayisi} kayıt imzalama özelliğinden önce oluşturulmuş, imzasız.{/if}
          Bu imza veritabanına doğrudan erişimi olan biri tarafından üretilemez — sadece gerçek oy verme akışından geçen kayıtlarda bulunur.
        </p>
      {:else}
        <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: {SARI};">Açık anahtar henüz yayınlanmamış — imza doğrulaması yapılamıyor.</p>
      {/if}
    </div>
  {/if}

  <!-- Bitcoin anchors -->
  <h3 style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 16px; margin: 0 0 12px; color: oklch(0.9 0.005 260);">Bitcoin Zaman Damgaları</h3>
  {#if data.zincir.zaman_damgalari.length === 0}
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.55 0.01 260); margin: 0 0 24px;">Henüz zaman damgası oluşturulmadı — ilk damgalama birkaç dakika içinde otomatik olarak yapılacak.</p>
  {:else}
    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
      {#each data.zincir.zaman_damgalari as d, i}
        {@const st = formatDurum(d.durum)}
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; background: oklch(0.22 0.015 265); border: 1px solid oklch(0.34 0.02 265); border-radius: 10px;">
          <div style="min-width: 0;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: {st.color}; margin-bottom: 4px;">{st.label}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: oklch(0.55 0.01 260); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{d.root_hash.slice(0, 24)}… · {d.oy_sayisi} oy · {new Date(d.created_at).toLocaleString('tr-TR')}</div>
          </div>
          {#if d.ots_proof}
            <button onclick={() => indirOts(d.ots_proof, i)} style="flex-shrink: 0; background: none; border: 1px solid oklch(0.45 0.02 265); border-radius: 6px; padding: 6px 12px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: oklch(0.8 0.01 260);">.ots indir</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Independent verification instructions -->
  <div style="padding: 18px 20px; background: oklch(0.16 0.012 265); border-radius: 10px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; color: oklch(0.9 0.005 260);">Bize hiç güvenmeden kontrol etmek ister misiniz?</p>
    <ol style="margin: 0; padding-left: 20px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.65 0.01 260); line-height: 1.8;">
      <li>Aşağıdan ham veriyi (JSON) ve bir <code>.ots</code> dosyasını indirin</li>
      <li><a href="https://opentimestamps.org" target="_blank" rel="noopener" style="color: {LIME};">opentimestamps.org</a> adresine gidip <code>.ots</code> dosyasını yükleyin — bu, hash'in belirtilen tarihte gerçekten var olduğunu Bitcoin ağı üzerinden bağımsız olarak doğrular</li>
      <li>JSON'daki oy kayıtlarını kendi SHA-256 aracınızla zincirleyip son hash'in damga ile eşleştiğini kontrol edin</li>
    </ol>
  </div>

  <button onclick={indirJson} style="background: none; border: 1.5px solid oklch(0.45 0.02 265); border-radius: 10px; padding: 12px 20px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.04em; color: oklch(0.85 0.01 260);">
    Ham veriyi indir (JSON)
  </button>
</div>
