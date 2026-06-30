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
    if (secilen === secim) return 'bg-[#00D964] text-black';
    if (secilen) return 'text-white/20';
    return 'text-white hover:bg-white/[0.06] active:bg-white/[0.1]';
  }
</script>

<!-- Seçenek A -->
<button
  onclick={() => oyKullan('A')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-5 transition-all duration-200 disabled:cursor-default {satirClass('A')}"
>
  <span class="font-semibold text-[17px] flex items-center gap-2.5 text-left">
    {#if secilen === 'A'}
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" class="shrink-0">
        <path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else if !secilen}
      <span class="w-5 h-5 rounded-full border-2 border-white/20 shrink-0"></span>
    {/if}
    {secenekA}
  </span>
  {#if secilen}
    <span class="font-bold tabular-nums text-[16px] shrink-0 ml-4">{yuzdeA}%</span>
  {/if}
</button>

<div class="h-px bg-white/[0.07]"></div>

<!-- Seçenek B -->
<button
  onclick={() => oyKullan('B')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-5 transition-all duration-200 disabled:cursor-default {satirClass('B')}"
>
  <span class="font-semibold text-[17px] flex items-center gap-2.5 text-left">
    {#if secilen === 'B'}
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" class="shrink-0">
        <path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else if !secilen}
      <span class="w-5 h-5 rounded-full border-2 border-white/20 shrink-0"></span>
    {/if}
    {secenekB}
  </span>
  {#if secilen}
    <span class="font-bold tabular-nums text-[16px] shrink-0 ml-4">{yuzdeB}%</span>
  {/if}
</button>

{#if hata}
  <div class="h-px bg-white/[0.07]"></div>
  <p class="text-red-400/80 text-[13px] text-center py-3 px-5">{hata}</p>
{/if}
