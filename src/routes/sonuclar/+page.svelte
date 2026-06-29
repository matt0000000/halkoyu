<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — Halk Oylaması</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-10">
  <h1 class="text-2xl font-bold mb-8">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <p class="text-gray-500 text-center py-10">Henüz tamamlanmış anket bulunmuyor.</p>
  {:else}
    <div class="space-y-6">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="font-semibold text-lg text-gray-900 mb-4">{anket.soru}</h2>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} />
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} />
          <p class="text-xs text-gray-400 mt-3 text-right">{toplam} toplam oy</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
