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
        <div class="rounded-2xl border border-white/10 bg-[#15161a] p-6">
          <h2 class="font-semibold text-white mb-5">{anket.soru}</h2>
          <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} taraf="A" />
          <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} taraf="B" />
          <p class="text-[11px] text-white/25 mt-3 text-right">{toplam.toLocaleString('tr-TR')} toplam oy</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
