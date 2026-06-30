<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — referandoom</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-14">
  <h1 class="text-2xl font-bold text-white mb-10">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <div class="text-center py-20 text-zinc-500">
      <p>Henüz tamamlanmış anket bulunmuyor.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 class="font-semibold text-white mb-5">{anket.soru}</h2>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} />
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} />
          <p class="text-xs text-zinc-600 mt-3 text-right">{toplam} toplam oy</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
