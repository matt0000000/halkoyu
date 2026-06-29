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

<div class="max-w-2xl mx-auto px-4 py-16">
  {#if !data.anket}
    <div class="text-center text-gray-500">
      <p class="text-xl">Şu an aktif anket bulunmuyor.</p>
      <a href="/sonuclar" class="text-blue-600 hover:underline mt-4 inline-block">Geçmiş sonuçlara bak →</a>
    </div>
  {:else}
    <h1 class="text-3xl font-bold text-gray-900 text-center mb-10 leading-snug">
      {data.anket.soru}
    </h1>

    <div class="grid grid-cols-2 gap-4 mb-10">
      <OyFormu
        anketId={data.anket.id}
        secenekA={data.anket.secenek_a}
        secenekB={data.anket.secenek_b}
        onOyKaydedildi={oyKaydedildi}
      />
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <p class="text-sm text-gray-500 mb-4 text-right">{toplamOy} toplam oy</p>
      <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} />
      <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} />
    </div>
  {/if}
</div>
