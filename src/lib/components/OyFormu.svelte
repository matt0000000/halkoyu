<script lang="ts">
  const LIME = 'oklch(0.82 0.17 145)';

  let { anketId, secenekA, secenekB, oyA, oyB, toplamOy, countdown, oncekiSecim = null, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    oyA: number;
    oyB: number;
    toplamOy: number;
    countdown: string;
    oncekiSecim?: 'A' | 'B' | null;
    onOyKaydedildi?: (secim: 'A' | 'B', oylar: { a: number; b: number }) => void;
  } = $props();

  let secilen = $state<'A' | 'B' | null>(oncekiSecim);
  let hata = $state('');
  let yukleniyor = $state(false);

  let yuzdeA = $derived(toplamOy === 0 ? 50 : Math.round((oyA / toplamOy) * 100));
  let yuzdeB = $derived(100 - yuzdeA);

  async function oyKullan(secim: 'A' | 'B') {
    if (secilen || yukleniyor) return;
    hata = '';
    yukleniyor = true;
    const res = await fetch('/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anketId, secim })
    });
    const data = await res.json();
    yukleniyor = false;
    if (!res.ok) {
      if (res.status === 409 && data.oylar) {
        // Daha önce oy kullanmış — sonuç ekranını göster
        secilen = data.oncekiSecim ?? secim;
        onOyKaydedildi?.(secilen, data.oylar);
      } else {
        hata = data.error;
      }
      return;
    }
    secilen = secim;
    onOyKaydedildi?.(secim, data.oylar);
  }

  function formatN(n: number): string {
    return n.toLocaleString();
  }

  let results = $derived([
    { id: 'A', label: secenekA, pct: yuzdeA, votes: oyA, isChoice: secilen === 'A' },
    { id: 'B', label: secenekB, pct: yuzdeB, votes: oyB, isChoice: secilen === 'B' },
  ]);
</script>

{#if !secilen}
  <!-- Pre-vote: option buttons -->
  <div style="display: flex; flex-direction: column; gap: 14px;">
    <button class="poll-option" onclick={() => oyKullan('A')} disabled={yukleniyor}>
      <span>{secenekA}</span>
      <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid oklch(0.45 0.02 265); flex-shrink: 0;"></span>
    </button>
    <button class="poll-option" onclick={() => oyKullan('B')} disabled={yukleniyor}>
      <span>{secenekB}</span>
      <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid oklch(0.45 0.02 265); flex-shrink: 0;"></span>
    </button>
  </div>

  {#if hata}
    <p style="margin: 12px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e84a4a;">{hata}</p>
  {/if}

  <!-- Countdown -->
  <div style="display: flex; align-items: center; gap: 10px; margin-top: 28px; padding-top: 22px; border-top: 1px solid oklch(0.28 0.02 265); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">
    <span style="text-transform: uppercase; letter-spacing: 0.08em;">Next referendum in</span>
    <span style="font-size: 16px; color: {LIME}; font-weight: 500;">{countdown}</span>
  </div>

{:else}
  <!-- Post-vote: result bars -->
  <div style="display: flex; flex-direction: column; gap: 22px;">
    {#each results as r}
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 9px;">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 21px; color: oklch(0.94 0.005 260);">{r.label}</span>
            {#if r.isChoice}
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: {LIME}; border: 1px solid oklch(0.5 0.12 145); border-radius: 999px; padding: 2px 8px; white-space: nowrap;">Your vote</span>
            {/if}
          </div>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; color: {LIME}; flex-shrink: 0; margin-left: 12px;">{r.pct}%</span>
        </div>
        <div style="height: 12px; background: oklch(0.26 0.02 265); border-radius: 999px; overflow: hidden;">
          <div style="height: 100%; border-radius: 999px; background: {LIME}; width: {r.pct}%; animation: grow 0.9s cubic-bezier(0.2,0.8,0.2,1);"></div>
        </div>
        <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: oklch(0.6 0.01 260);">{formatN(r.votes)} votes</div>
      </div>
    {/each}
  </div>

  <!-- Post-vote footer -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 22px; border-top: 1px solid oklch(0.28 0.02 265);">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">
      {formatN(toplamOy)} total votes ·
      <button onclick={() => { secilen = null; hata = ''; }} style="background: none; border: none; padding: 0; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: {LIME}; text-decoration: underline;">vote again</button>
    </div>
    <div style="text-align: right; flex-shrink: 0; margin-left: 16px;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: oklch(0.6 0.01 260); margin-bottom: 3px;">Next referendum in</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 500; color: {LIME};">{countdown}</div>
    </div>
  </div>
{/if}
