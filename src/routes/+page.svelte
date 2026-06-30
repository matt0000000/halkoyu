<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';
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

<div class="min-h-[calc(100vh-49px)] flex flex-col justify-center px-5 py-12 max-w-2xl mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-xl font-semibold text-white/60 mb-3">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[#0A84FF] text-[15px] hover:opacity-80 transition-opacity">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <!-- Soru -->
    <div class="text-center mb-10">
      <p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">Günün Sorusu</p>
      <h1 class="text-[28px] sm:text-[38px] font-bold text-white leading-snug tracking-tight">
        {data.anket.soru}
      </h1>
    </div>

    <!-- Oy butonları -->
    <div class="grid grid-cols-[1fr_40px_1fr] items-stretch gap-3 mb-6">
      <OyFormu
        anketId={data.anket.id}
        secenekA={data.anket.secenek_a}
        secenekB={data.anket.secenek_b}
        onOyKaydedildi={oyKaydedildi}
      />
    </div>

    <!-- Sonuçlar -->
    <div class="rounded-2xl bg-white/[0.05] backdrop-blur-sm p-5">
      <div class="flex justify-between items-center mb-4">
        <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/25">Anlık Sonuçlar</p>
        <p class="text-[12px] text-white/25">{toplamOy.toLocaleString('tr-TR')} oy</p>
      </div>
      <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} aktif={secilenSecim === 'A'} sonucGosteriliyor={secilenSecim !== null} />
      <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} aktif={secilenSecim === 'B'} sonucGosteriliyor={secilenSecim !== null} />
    </div>
  {/if}
</div>
