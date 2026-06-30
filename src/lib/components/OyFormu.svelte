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
</script>

<div class="grid grid-cols-2 divide-x divide-[#2d2f45]">
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
      class="flex flex-col items-center justify-center gap-3 px-5 py-7 transition-all duration-200 disabled:cursor-default"
      style="background: {secildi ? r + '18' : 'transparent'};"
      onmouseenter={e => { if (!secilen) (e.currentTarget as HTMLElement).style.background = r + '0d'; }}
      onmouseleave={e => { if (!secilen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {#if secildi}
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" class="shrink-0">
          <circle cx="10" cy="10" r="9" fill={r} stroke={r} stroke-width="2"/>
          <path d="M6 10.5l3 3 5-6" stroke="black" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else}
        <span class="w-[22px] h-[22px] rounded-full border-2 shrink-0 transition-colors"
          style="border-color: {diger ? '#2d2f45' : r + '60'};"></span>
      {/if}

      <span class="font-semibold text-[16px] text-center leading-snug transition-colors"
        style="color: {secildi ? r : diger ? '#3d3f55' : 'white'};">
        {secenek}
      </span>

      {#if secilen}
        <span class="font-bold tabular-nums text-[16px]"
          style="color: {secildi ? r : '#3d3f55'};">
          {yuzde}%
        </span>
      {/if}
    </button>
  {/each}
</div>

{#if hata}
  <div class="h-px bg-[#2d2f45]"></div>
  <p class="text-[#FF4B4B] text-[13px] text-center py-3 px-5">{hata}</p>
{/if}
