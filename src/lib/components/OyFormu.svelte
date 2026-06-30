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

  function butonBg(secim: 'A' | 'B') {
    if (secilen === secim) return 'bg-[#e8f0fe]';
    if (secilen) return 'bg-white';
    return 'bg-white hover:bg-[#f8f9fa] active:bg-[#f1f3f4]';
  }

  function butonText(secim: 'A' | 'B') {
    if (secilen === secim) return 'text-[#1a73e8]';
    if (secilen) return 'text-[#bdc1c6]';
    return 'text-[#202124]';
  }
</script>

<div class="grid grid-cols-2 divide-x divide-[#e8eaed]">
  <!-- Seçenek A -->
  <button
    onclick={() => oyKullan('A')}
    disabled={yukleniyor || !!secilen}
    class="flex flex-col items-center justify-center gap-3 px-5 py-7 transition-colors duration-150 disabled:cursor-default {butonBg('A')} {butonText('A')}"
  >
    {#if secilen === 'A'}
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" class="shrink-0">
        <circle cx="10" cy="10" r="9" fill="#1a73e8" stroke="#1a73e8" stroke-width="2"/>
        <path d="M6 10.5l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else}
      <span class="w-[22px] h-[22px] rounded-full border-2 border-[#dadce0] shrink-0"></span>
    {/if}
    <span class="font-medium text-[16px] text-center leading-snug">{secenekA}</span>
    {#if secilen}
      <span class="font-medium tabular-nums text-[15px] {secilen === 'A' ? 'text-[#1a73e8]' : 'text-[#bdc1c6]'}">{yuzdeA}%</span>
    {/if}
  </button>

  <!-- Seçenek B -->
  <button
    onclick={() => oyKullan('B')}
    disabled={yukleniyor || !!secilen}
    class="flex flex-col items-center justify-center gap-3 px-5 py-7 transition-colors duration-150 disabled:cursor-default {butonBg('B')} {butonText('B')}"
  >
    {#if secilen === 'B'}
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" class="shrink-0">
        <circle cx="10" cy="10" r="9" fill="#1a73e8" stroke="#1a73e8" stroke-width="2"/>
        <path d="M6 10.5l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else}
      <span class="w-[22px] h-[22px] rounded-full border-2 border-[#dadce0] shrink-0"></span>
    {/if}
    <span class="font-medium text-[16px] text-center leading-snug">{secenekB}</span>
    {#if secilen}
      <span class="font-medium tabular-nums text-[14px] {secilen === 'B' ? 'text-[#1a73e8]' : 'text-[#bdc1c6]'}">{yuzdeB}%</span>
    {/if}
  </button>
</div>

{#if hata}
  <div class="h-px bg-[#e8eaed]"></div>
  <p class="text-[#c5221f] text-[13px] text-center py-3 px-5 bg-[#fce8e6]">{hata}</p>
{/if}
