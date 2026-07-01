<script lang="ts">
  const LIME = '#b6e84a';

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
    if (!res.ok) { hata = data.error; return; }
    secilen = secim;
    onOyKaydedildi?.(secim, data.oylar);
  }
</script>

<div class="space-y-2">
  {#each (['A', 'B'] as const) as secim}
    {@const isA = secim === 'A'}
    {@const secenek = isA ? secenekA : secenekB}
    {@const yuzde = isA ? yuzdeA : yuzdeB}
    {@const secildi = secilen === secim}
    {@const oylandiMi = secilen !== null}

    <button
      onclick={() => oyKullan(secim)}
      disabled={yukleniyor || oylandiMi}
      class="relative w-full rounded-xl overflow-hidden text-left transition-all duration-200 disabled:cursor-default"
      style="height: 68px; background: #2a2a34;"
    >
      {#if oylandiMi}
        <!-- Lime fill bar -->
        <div
          class="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
          style="width: {yuzde}%; background: {LIME}; opacity: {secildi ? 1 : 0.22};"
        ></div>
      {/if}

      <!-- Content -->
      <div class="relative flex items-center justify-between px-5 h-full">
        <div class="flex items-center gap-3">
          {#if oylandiMi}
            {#if secildi}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="shrink-0">
                <circle cx="10" cy="10" r="9" fill="#18181f"/>
                <path d="M6 10.5l3 3 5-6" stroke={LIME} stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else}
              <span class="w-5 h-5 rounded-full shrink-0" style="border: 2px solid #3a3a48;"></span>
            {/if}
          {:else}
            <span class="w-5 h-5 rounded-full shrink-0" style="border: 2px solid {LIME}44;"></span>
          {/if}

          <span class="font-semibold text-[15px]" style="color: {oylandiMi && !secildi ? '#4a4a5a' : 'white'};">
            {secenek}
          </span>
        </div>

        {#if oylandiMi}
          <span class="font-bold tabular-nums text-[16px]" style="color: {secildi ? '#18181f' : '#4a4a5a'};">
            {yuzde}%
          </span>
        {:else if yukleniyor}
          <span class="text-[12px]" style="color: #4a4a5a;">...</span>
        {/if}
      </div>
    </button>
  {/each}
</div>

{#if hata}
  <p class="text-[13px] text-center pt-2" style="color: #e84a4a;">{hata}</p>
{/if}
