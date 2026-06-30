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

<div class="max-w-2xl mx-auto px-5 py-12">
  <a href="/sonuclar" class="text-[13px] text-[#9b9bb4] hover:text-white transition-colors mb-7 inline-block">
    ← Geçmiş Sonuçlar
  </a>

  <div class="flex items-start justify-between gap-4 mb-5">
    <h1 class="text-[22px] font-semibold text-white leading-snug">{data.anket.soru}</h1>
    <span class="text-[11px] px-2.5 py-1 rounded font-medium shrink-0 border
      {data.anket.aktif ? 'text-[#00C805] border-[#00C805]/30 bg-[#00C805]/10' : 'text-[#9b9bb4] border-[#2d2f45] bg-[#2d2f45]/50'}">
      {data.anket.aktif ? 'Aktif' : 'Kapalı'}
    </span>
  </div>

  <div class="bg-[#1e1f2e] border border-[#2d2f45] rounded-xl overflow-hidden">
    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} taraf="A" />
    <div class="h-px bg-[#2d2f45]"></div>
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} taraf="B" />
  </div>
</div>
