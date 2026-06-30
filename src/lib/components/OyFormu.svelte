<script lang="ts">
  let { anketId, secenekA, secenekB, oyA, oyB, toplamOy, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    oyA: number;
    oyB: number;
    toplamOy: number;
    onOyKaydedildi?: (secim: 'A' | 'B', oylar: { a: number; b: number }) => void;
  } = $props();

  let secilen = $state<'A' | 'B' | null>(null);
  let hata = $state('');
  let yukleniyor = $state(false);

  let yuzdeA = $derived(toplamOy === 0 ? 50 : Math.round((oyA / toplamOy) * 100));
  let yuzdeB = $derived(100 - yuzdeA);

  async function oyKullan(secim: 'A' | 'B') {
    if (secilen) return;
    hata = '';
    yukleniyor = true;
    const res = await fetch('/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anketId, secim })
    });
    const data = await res.json();
    yukleniyor = false;
    if (!res.ok) { hata = data.error; return; }
    secilen = secim;
    onOyKaydedildi?.(secim, data.oylar);
  }

  function satirClass(secim: 'A' | 'B') {
    if (secilen === secim) {
      return 'bg-[#00D964] text-black';
    }
    if (secilen) {
      return 'bg-transparent text-white/25';
    }
    return 'bg-transparent text-white hover:bg-white/[0.04]';
  }
</script>

<button
  onclick={() => oyKullan('A')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-4 transition-colors duration-200 disabled:cursor-default {satirClass('A')}"
>
  <span class="font-semibold text-[16px] flex items-center gap-2">
    {#if secilen === 'A'}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    {/if}
    {secenekA}
  </span>
  <span class="font-bold tabular-nums text-[16px]">{yuzdeA}%</span>
</button>

<div class="h-px bg-white/10"></div>

<button
  onclick={() => oyKullan('B')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-4 transition-colors duration-200 disabled:cursor-default {satirClass('B')}"
>
  <span class="font-semibold text-[16px] flex items-center gap-2">
    {#if secilen === 'B'}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    {/if}
    {secenekB}
  </span>
  <span class="font-bold tabular-nums text-[16px]">{yuzdeB}%</span>
</button>

{#if hata}
  <p class="text-red-400/80 text-[13px] text-center py-2 bg-red-950/20">{hata}</p>
{/if}
