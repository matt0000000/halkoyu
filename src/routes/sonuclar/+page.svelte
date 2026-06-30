<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — referandoom</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-5 py-14">
  <h1 class="text-2xl font-bold text-white mb-8">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <div class="text-center py-20 text-white/30">
      <p>Henüz tamamlanmış anket bulunmuyor.</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        {@const aKazandi = anket.oy_a >= anket.oy_b}
        <div class="border border-white/10 rounded-lg overflow-hidden">
          <h2 class="font-semibold text-white px-5 pt-4 pb-3">{anket.soru}</h2>
          <div class="h-px bg-white/10"></div>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} kazanan={aKazandi} />
          <div class="h-px bg-white/10"></div>
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} kazanan={!aKazandi} />
          <div class="h-px bg-white/10"></div>
          <p class="text-[11px] text-white/25 px-5 py-2 text-right">{toplam.toLocaleString('tr-TR')} toplam oy</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
