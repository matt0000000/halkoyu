<script lang="ts">
  import type { PageData } from './$types';
  import OyFormu from '$lib/components/OyFormu.svelte';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);
  let secilenSecim = $state<'A' | 'B' | null>(null);

  function oyKaydedildi(secim: 'A' | 'B', oylar: { a: number; b: number }) {
    oyA = oylar.a;
    oyB = oylar.b;
    secilenSecim = secim;
  }
</script>

<svelte:head>
  <title>referandoom</title>
</svelte:head>

<div class="min-h-[calc(100vh-49px)] flex flex-col justify-center px-5 py-12 max-w-xl mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-xl font-semibold text-white/60 mb-3">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[#00D964] text-[15px] hover:opacity-80 transition-opacity">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <!-- Soru -->
    <div class="mb-6">
      <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35 mb-2">Günün Sorusu</p>
      <h1 class="text-[24px] sm:text-[30px] font-bold text-white leading-snug tracking-tight">
        {data.anket.soru}
      </h1>
    </div>

    <!-- Oy satırları -->
    <div class="border border-white/[0.15] rounded-lg overflow-hidden mb-3">
      <OyFormu
        anketId={data.anket.id}
        secenekA={data.anket.secenek_a}
        secenekB={data.anket.secenek_b}
        oyA={oyA}
        oyB={oyB}
        {toplamOy}
        onOyKaydedildi={oyKaydedildi}
      />
    </div>

    <div class="flex justify-between items-center px-1">
      <span class="text-[12px] text-white/30 tabular-nums">{toplamOy.toLocaleString('tr-TR')} oy</span>
      {#if secilenSecim}
        <span class="text-[12px] font-medium text-[#00D964] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Oyunuz kaydedildi
        </span>
      {/if}
    </div>
  {/if}
</div>
