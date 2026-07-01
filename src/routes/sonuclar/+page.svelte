<script lang="ts">
  import type { PageData } from './$types';
  import SonucBar from '$lib/components/SonucBar.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Geçmiş Sonuçlar — referandoom</title>
</svelte:head>

<div class="max-w-xl mx-auto px-5 py-12">
  <h1 class="text-[22px] font-semibold text-white mb-7">Geçmiş Anket Sonuçları</h1>

  {#if data.anketler.length === 0}
    <div class="text-center py-20" style="color: #666680;">
      <p>Henüz tamamlanmış anket bulunmuyor.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.anketler as anket (anket.id)}
        {@const toplam = anket.oy_a + anket.oy_b}
        <div class="rounded-2xl p-5 space-y-3" style="background: #2a2a34;">
          <h2 class="font-semibold text-[15px] text-white">{anket.soru}</h2>
          <div class="space-y-2">
            <SonucBar secenek={anket.secenek_a} oy={anket.oy_a} toplamOy={toplam} />
            <SonucBar secenek={anket.secenek_b} oy={anket.oy_b} toplamOy={toplam} />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
