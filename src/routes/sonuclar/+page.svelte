<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — referandoom</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-5 py-12">
  <h1 class="text-[22px] font-semibold text-white mb-7">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <div class="text-center py-20 text-[#9b9bb4]">
      <p>Henüz tamamlanmış anket bulunmuyor.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        <div class="bg-[#1e1f2e] border border-[#2d2f45] rounded-xl overflow-hidden">
          <h2 class="font-semibold text-[15px] text-white px-5 pt-4 pb-3">{anket.soru}</h2>
          <div class="h-px bg-[#2d2f45]"></div>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} taraf="A" />
          <div class="h-px bg-[#2d2f45]"></div>
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} taraf="B" />
        </div>
      {/each}
    </div>
  {/if}
</div>
