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

<div class="min-h-[calc(100vh-56px)] flex flex-col justify-center px-5 py-12 max-w-lg mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-[15px] text-[#9b9bb4] mb-3">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[#00C805] text-[14px] hover:opacity-80 transition-opacity">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b9bb4] mb-3">Günün Sorusu</p>

    <h1 class="text-[24px] sm:text-[30px] font-semibold text-white leading-snug mb-7">
      {data.anket.soru}
    </h1>

    <div class="bg-[#1e1f2e] border border-[#2d2f45] rounded-xl overflow-hidden mb-3">
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

    {#if secilenSecim}
      <div class="flex justify-end px-1">
        <span class="text-[12px] font-medium text-[#00C805] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6 12l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Oyunuz kaydedildi
        </span>
      </div>
    {/if}
  {/if}
</div>
