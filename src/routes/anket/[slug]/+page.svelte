<script lang="ts">
  import SonucBar from '$lib/components/SonucBar.svelte';
  import OyFormu from '$lib/components/OyFormu.svelte';
  import type { PageData } from './$types';

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
  <title>{data.anket.soru} — Halk Oylaması</title>
</svelte:head>

<div class="max-w-xl mx-auto px-4 py-8">
  <a href="/" class="text-sm text-blue-600 mb-6 inline-block">← Tüm anketler</a>

  <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
    <div class="flex justify-between items-start mb-6">
      <h1 class="text-xl font-bold text-gray-900 leading-snug">{data.anket.soru}</h1>
      <span class="text-xs px-2 py-1 rounded-full ml-2 shrink-0 {data.anket.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
        {data.anket.aktif ? 'Aktif' : 'Kapalı'}
      </span>
    </div>

    <div class="mb-4">
      <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} />
      <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} />
      <p class="text-xs text-gray-400 mt-2 text-right">{toplamOy} toplam oy</p>
    </div>
  </div>

  {#if data.anket.aktif}
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="font-semibold mb-4">Oy Kullan</h2>
      <OyFormu
        anketId={data.anket.id}
        secenekA={data.anket.secenek_a}
        secenekB={data.anket.secenek_b}
        onOyKaydedildi={oyKaydedildi}
      />
    </div>
  {:else}
    <p class="text-center text-gray-500 text-sm">Bu anket kapatılmıştır.</p>
  {/if}
</div>
