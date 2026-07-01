<script lang="ts">
  import type { PageData } from './$types';
  import OyFormu from '$lib/components/OyFormu.svelte';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);

  function oyKaydedildi(_secim: 'A' | 'B', oylar: { a: number; b: number }) {
    oyA = oylar.a;
    oyB = oylar.b;
  }
</script>

<svelte:head>
  <title>referandoom</title>
</svelte:head>

<div class="min-h-[calc(100vh-56px)] flex flex-col justify-center px-5 py-12 max-w-xl mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-[15px] mb-3" style="color: #666680;">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[14px] hover:opacity-80 transition-opacity" style="color: #b6e84a;">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <p class="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3" style="color: #666680;">Günün Sorusu</p>

    <h1 class="text-[24px] sm:text-[28px] font-semibold text-white leading-snug mb-6">
      {data.anket.soru}
    </h1>

    <OyFormu
      anketId={data.anket.id}
      secenekA={data.anket.secenek_a}
      secenekB={data.anket.secenek_b}
      {oyA}
      {oyB}
      {toplamOy}
      onOyKaydedildi={oyKaydedildi}
    />
  {/if}
</div>
