<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';
  import OyFormu from '$lib/components/OyFormu.svelte';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);

  function oyKaydedildi(oylar: { a: number; b: number }) {
    oyA = oylar.a;
    oyB = oylar.b;
  }
</script>

<svelte:head>
  <title>Halk Oylaması</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-20">
  {#if !data.anket}
    <div class="text-center text-zinc-500 py-20">
      <p class="text-2xl font-medium text-zinc-300 mb-4">Şu an aktif anket bulunmuyor.</p>
      <a href="/sonuclar" class="text-indigo-400 hover:text-indigo-300 transition-colors">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <div class="text-center mb-12">
      <p class="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Günün Sorusu</p>
      <h1 class="text-4xl font-bold text-white leading-tight">
        {data.anket.soru}
      </h1>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-12">
      <OyFormu
        anketId={data.anket.id}
        secenekA={data.anket.secenek_a}
        secenekB={data.anket.secenek_b}
        onOyKaydedildi={oyKaydedildi}
      />
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div class="flex justify-between items-center mb-5">
        <p class="text-sm font-medium text-zinc-400">Anlık Sonuçlar</p>
        <p class="text-sm text-zinc-500">{toplamOy} oy</p>
      </div>
      <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} />
      <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} />
    </div>
  {/if}
</div>
