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

  function satirBg(secim: 'A' | 'B') {
    if (secilen === secim) return 'bg-[#e8f0fe]';
    if (secilen) return 'bg-white';
    return 'bg-white hover:bg-[#f8f9fa] active:bg-[#f1f3f4]';
  }

  function satirText(secim: 'A' | 'B') {
    if (secilen === secim) return 'text-[#1a73e8]';
    if (secilen) return 'text-[#bdc1c6]';
    return 'text-[#202124]';
  }
</script>

<!-- Seçenek A -->
<button
  onclick={() => oyKullan('A')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-5 transition-colors duration-150 disabled:cursor-default {satirBg('A')} {satirText('A')}"
>
  <span class="font-medium text-[16px] flex items-center gap-3 text-left">
    {#if secilen === 'A'}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="shrink-0">
        <circle cx="10" cy="10" r="9" fill="#1a73e8" stroke="#1a73e8" stroke-width="2"/>
        <path d="M6 10.5l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else if secilen}
      <span class="w-5 h-5 rounded-full border-2 border-[#dadce0] shrink-0"></span>
    {:else}
      <span class="w-5 h-5 rounded-full border-2 border-[#dadce0] shrink-0"></span>
    {/if}
    {secenekA}
  </span>
  {#if secilen}
    <span class="font-medium tabular-nums text-[15px] shrink-0 ml-4 {secilen === 'A' ? 'text-[#1a73e8]' : 'text-[#bdc1c6]'}">{yuzdeA}%</span>
  {/if}
</button>

<div class="h-px bg-[#e8eaed]"></div>

<!-- Seçenek B -->
<button
  onclick={() => oyKullan('B')}
  disabled={yukleniyor || !!secilen}
  class="w-full flex items-center justify-between px-5 py-5 transition-colors duration-150 disabled:cursor-default {satirBg('B')} {satirText('B')}"
>
  <span class="font-medium text-[16px] flex items-center gap-3 text-left">
    {#if secilen === 'B'}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="shrink-0">
        <circle cx="10" cy="10" r="9" fill="#1a73e8" stroke="#1a73e8" stroke-width="2"/>
        <path d="M6 10.5l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else}
      <span class="w-5 h-5 rounded-full border-2 border-[#dadce0] shrink-0"></span>
    {/if}
    {secenekB}
  </span>
  {#if secilen}
    <span class="font-medium tabular-nums text-[15px] shrink-0 ml-4 {secilen === 'B' ? 'text-[#1a73e8]' : 'text-[#bdc1c6]'}">{yuzdeB}%</span>
  {/if}
</button>

{#if hata}
  <div class="h-px bg-[#e8eaed]"></div>
  <p class="text-[#c5221f] text-[13px] text-center py-3 px-5 bg-[#fce8e6]">{hata}</p>
{/if}
