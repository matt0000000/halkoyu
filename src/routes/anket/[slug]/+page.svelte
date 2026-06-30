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

<div class="max-w-2xl mx-auto px-5 py-14">
  <a href="/sonuclar" class="text-[13px] text-white/35 hover:text-white/70 transition-colors mb-8 inline-block">
    ← Geçmiş Sonuçlar
  </a>

  <div class="rounded-2xl border border-white/10 bg-[#15161a] p-7">
    <div class="flex justify-between items-start mb-7">
      <h1 class="text-2xl font-bold text-white leading-snug">{data.anket.soru}</h1>
      <span class="text-[11px] px-3 py-1 rounded-full ml-4 shrink-0 font-medium border
        {data.anket.aktif ? 'bg-[#00C896]/10 text-[#00C896] border-[#00C896]/30' : 'bg-white/[0.04] text-white/30 border-white/10'}">
        {data.anket.aktif ? 'Aktif' : 'Kapalı'}
      </span>
    </div>

    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} taraf="A" />
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} taraf="B" />
    <p class="text-[11px] text-white/25 mt-4 text-right">{toplamOy.toLocaleString('tr-TR')} toplam oy</p>
  </div>
</div>
