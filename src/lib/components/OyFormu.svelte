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

  const YESIL = '#00C805';
  const KIRMIZI = '#FF4B4B';

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

  function renk(secim: 'A' | 'B') {
    return secim === 'A' ? YESIL : KIRMIZI;
  }

  function butonStyle(secim: 'A' | 'B') {
    const r = renk(secim);
    if (secilen === secim) return `background: ${r}18;`;
    return '';
  }
</script>

<div class="grid grid-cols-2 divide-x divide-[#e8eaed]">
  {#each (['A', 'B'] as const) as secim}
    {@const isA = secim === 'A'}
    {@const secenek = isA ? secenekA : secenekB}
    {@const yuzde = isA ? yuzdeA : yuzdeB}
    {@const r = renk(secim)}
    {@const secildi = secilen === secim}
    {@const diger = !!secilen && !secildi}

    <button
      onclick={() => oyKullan(secim)}
      disabled={yukleniyor || !!secilen}
      class="flex flex-col items-center justify-center gap-3 px-5 py-7 transition-all duration-200 disabled:cursor-default
        {!secilen ? 'hover:bg-[#f8f9fa] active:bg-[#f1f3f4]' : ''}"
      style={butonStyle(secim)}
    >
      {#if secildi}
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" class="shrink-0">
          <circle cx="10" cy="10" r="9" fill={r} stroke={r} stroke-width="2"/>
          <path d="M6 10.5l3 3 5-6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else}
        <span class="w-[22px] h-[22px] rounded-full border-2 shrink-0 transition-colors"
          style="border-color: {!secilen ? r + '60' : '#e8eaed'};"></span>
      {/if}

      <span class="font-medium text-[16px] text-center leading-snug transition-colors"
        style="color: {secildi ? r : diger ? '#bdc1c6' : '#202124'};">
        {secenek}
      </span>

      {#if secilen}
        <span class="font-semibold tabular-nums text-[15px] transition-colors"
          style="color: {secildi ? r : '#bdc1c6'};">
          {yuzde}%
        </span>
      {/if}
    </button>
  {/each}
</div>

{#if hata}
  <div class="h-px bg-[#e8eaed]"></div>
  <p class="text-[#c5221f] text-[13px] text-center py-3 px-5 bg-[#fce8e6]">{hata}</p>
{/if}
