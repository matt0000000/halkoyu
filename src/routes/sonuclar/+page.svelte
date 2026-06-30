<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — referandoom</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-5 py-12">
  <h1 class="text-[28px] font-medium text-[#202124] mb-8">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <div class="text-center py-20 text-[#80868b]">
      <p>Henüz tamamlanmış anket bulunmuyor.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        {@const aKazandi = anket.oy_a >= anket.oy_b}
        <div class="bg-white rounded-2xl shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_rgba(60,64,67,0.15)] overflow-hidden">
          <h2 class="font-medium text-[16px] text-[#202124] px-5 pt-5 pb-4">{anket.soru}</h2>
          <div class="h-px bg-[#e8eaed]"></div>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} kazanan={aKazandi} />
          <div class="h-px bg-[#e8eaed]"></div>
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} kazanan={!aKazandi} />
          <div class="h-px bg-[#e8eaed]"></div>
          <p class="text-[12px] text-[#80868b] px-5 py-3 text-right">{toplam.toLocaleString('tr-TR')} toplam oy</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
