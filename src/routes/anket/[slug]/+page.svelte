<script lang="ts">
  import SonucBar from '$lib/components/SonucBar.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);
  let aKazandi = $derived(oyA >= oyB);
</script>

<svelte:head>
  <title>{data.anket.soru} — referandoom</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-5 py-12">
  <a href="/sonuclar" class="text-[14px] font-medium text-[#1a73e8] hover:bg-[#1a73e8]/[0.08] px-3 py-2 rounded-full transition-colors mb-6 inline-flex items-center gap-1">
    ← Geçmiş Sonuçlar
  </a>

  <div class="flex items-start justify-between gap-4 mb-6 mt-2">
    <h1 class="text-[24px] font-medium text-[#202124] leading-snug">{data.anket.soru}</h1>
    <span class="text-[12px] px-3 py-1 rounded-full shrink-0 font-medium
      {data.anket.aktif ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#f1f3f4] text-[#80868b]'}">
      {data.anket.aktif ? 'Aktif' : 'Kapalı'}
    </span>
  </div>

  <div class="bg-white rounded-2xl shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_rgba(60,64,67,0.15)] overflow-hidden">
    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} kazanan={aKazandi} />
    <div class="h-px bg-[#e8eaed]"></div>
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} kazanan={!aKazandi} />
    <div class="h-px bg-[#e8eaed]"></div>
    <p class="text-[12px] text-[#80868b] px-5 py-3 text-right">{toplamOy.toLocaleString('tr-TR')} toplam oy</p>
  </div>
</div>
