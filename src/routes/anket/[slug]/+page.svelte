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

<div class="max-w-2xl mx-auto px-5 py-14">
  <a href="/sonuclar" class="text-[13px] text-white/35 hover:text-white/70 transition-colors mb-8 inline-block">
    ← Geçmiş Sonuçlar
  </a>

  <div class="mb-4 flex items-start justify-between gap-4">
    <h1 class="text-2xl font-bold text-white leading-snug">{data.anket.soru}</h1>
    <span class="text-[11px] px-3 py-1 rounded-full shrink-0 font-medium border
      {data.anket.aktif ? 'bg-[#00D964]/10 text-[#00D964] border-[#00D964]/30' : 'bg-white/[0.04] text-white/30 border-white/10'}">
      {data.anket.aktif ? 'Aktif' : 'Kapalı'}
    </span>
  </div>

  <div class="border border-white/10 rounded-lg overflow-hidden">
    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} kazanan={aKazandi} />
    <div class="h-px bg-white/10"></div>
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} kazanan={!aKazandi} />
    <div class="h-px bg-white/10"></div>
    <p class="text-[11px] text-white/25 px-5 py-2 text-right">{toplamOy.toLocaleString('tr-TR')} toplam oy</p>
  </div>
</div>
