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

<div class="min-h-[calc(100vh-64px)] flex flex-col justify-center px-5 py-12 max-w-lg mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-lg font-medium text-[#5f6368] mb-3">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[#1a73e8] text-[15px] hover:underline">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <!-- Label -->
    <p class="text-[12px] font-medium uppercase tracking-[0.1em] text-[#1a73e8] mb-3">Günün Sorusu</p>

    <!-- Soru -->
    <h1 class="text-[26px] sm:text-[32px] font-medium text-[#202124] leading-snug mb-8">
      {data.anket.soru}
    </h1>

    <!-- Kart -->
    <div class="bg-white rounded-2xl shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_rgba(60,64,67,0.15)] overflow-hidden mb-3">
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

    <!-- Footer -->
    {#if secilenSecim}
      <div class="flex justify-end px-1">
        <span class="text-[12px] font-medium text-[#1e8e3e] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Oyunuz kaydedildi
        </span>
      </div>
    {/if}
  {/if}
</div>
