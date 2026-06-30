<script lang="ts">
  import SonucBar from '$lib/components/SonucBar.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);
</script>

<svelte:head>
  <title>{data.anket.soru} — referandoom</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-14">
  <a href="/sonuclar" class="text-sm text-zinc-500 hover:text-indigo-400 transition-colors mb-8 inline-block">
    ← Geçmiş Sonuçlar
  </a>

  <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
    <div class="flex justify-between items-start mb-8">
      <h1 class="text-2xl font-bold text-white leading-snug">{data.anket.soru}</h1>
      <span class="text-xs px-3 py-1 rounded-full ml-4 shrink-0 font-medium
        {data.anket.aktif ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}">
        {data.anket.aktif ? 'Aktif' : 'Kapalı'}
      </span>
    </div>

    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} />
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} />
    <p class="text-xs text-zinc-600 mt-4 text-right">{toplamOy} toplam oy</p>
  </div>
</div>
