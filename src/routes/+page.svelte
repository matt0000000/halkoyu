<script lang="ts">
  import AnketKarti from '$lib/components/AnketKarti.svelte';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Halk Oylaması</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Güncel Anketler</h1>

  {#if data.aktif.length === 0}
    <p class="text-gray-500">Şu an aktif anket bulunmuyor.</p>
  {:else}
    <div class="space-y-3 mb-10">
      {#each data.aktif as anket (anket.id)}
        <AnketKarti {anket} />
      {/each}
    </div>
  {/if}

  {#if data.kapali.length > 0}
    <h2 class="text-lg font-semibold text-gray-600 mb-3">Tamamlanan Anketler</h2>
    <div class="space-y-3">
      {#each data.kapali as anket (anket.id)}
        <AnketKarti {anket} />
      {/each}
    </div>
  {/if}
</div>
