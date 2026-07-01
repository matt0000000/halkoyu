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

<div class="max-w-xl mx-auto px-5 py-12">
  <a href="/sonuclar" class="text-[13px] transition-colors mb-7 inline-block" style="color: #666680;">
    ← Geçmiş Sonuçlar
  </a>

  <div class="flex items-start justify-between gap-4 mb-5">
    <h1 class="text-[22px] font-semibold text-white leading-snug">{data.anket.soru}</h1>
    <span class="text-[11px] px-2.5 py-1 rounded font-medium shrink-0 border"
      style="{data.anket.aktif
        ? 'color: #b6e84a; border-color: #b6e84a33; background: #b6e84a11;'
        : 'color: #666680; border-color: #2a2a34; background: #2a2a3499;'}">
      {data.anket.aktif ? 'Aktif' : 'Kapalı'}
    </span>
  </div>

  <div class="rounded-2xl p-5 space-y-2" style="background: #2a2a34;">
    <SonucBar secenek={data.anket.secenek_a} oy={oyA} {toplamOy} />
    <SonucBar secenek={data.anket.secenek_b} oy={oyB} {toplamOy} />
  </div>
</div>
