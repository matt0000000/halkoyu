<script lang="ts">
  import type { PageData } from './$types';
  import OyFormu from '$lib/components/OyFormu.svelte';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);
  let yuzdeA = $derived(toplamOy === 0 ? 50 : Math.round((oyA / toplamOy) * 100));
  let yuzdeB = $derived(100 - yuzdeA);
  let secilenSecim = $state<'A' | 'B' | null>(null);

  function oyKaydedildi(secim: 'A' | 'B', oylar: { a: number; b: number }) {
    oyA = oylar.a;
    oyB = oylar.b;
    secilenSecim = secim;
  }
</script>

<svelte:head>
  <title>referandoom</title>
</svelte:head>

<div class="min-h-[calc(100vh-49px)] flex flex-col justify-center px-5 py-12 max-w-xl mx-auto w-full">
  {#if !data.anket}
    <div class="text-center">
      <p class="text-xl font-semibold text-white/60 mb-3">Şu an aktif anket yok.</p>
      <a href="/sonuclar" class="text-[#0A84FF] text-[15px] hover:opacity-80 transition-opacity">
        Geçmiş sonuçlara bak →
      </a>
    </div>
  {:else}
    <div class="rounded-2xl border border-white/10 bg-[#15161a] overflow-hidden">
      <!-- Soru -->
      <div class="px-6 pt-6 pb-5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35 mb-2">Günün Sorusu</p>
        <h1 class="text-[22px] sm:text-[26px] font-bold text-white leading-snug tracking-tight">
          {data.anket.soru}
        </h1>
      </div>

      <!-- Split yüzde barı -->
      <div class="px-6 mb-5">
        <div class="flex justify-between items-baseline mb-2">
          <span class="text-2xl font-extrabold tabular-nums" style="color: #00C896;">{yuzdeA}%</span>
          <span class="text-2xl font-extrabold tabular-nums" style="color: #FF4B6E;">{yuzdeB}%</span>
        </div>
        <div class="w-full h-2 rounded-full overflow-hidden flex bg-white/[0.06]">
          <div class="h-full transition-all duration-700" style="width: {yuzdeA}%; background: #00C896;"></div>
          <div class="h-full transition-all duration-700" style="width: {yuzdeB}%; background: #FF4B6E;"></div>
        </div>
        <div class="flex justify-between mt-1.5">
          <span class="text-[12px] font-medium text-white/40 truncate max-w-[45%]">{data.anket.secenek_a}</span>
          <span class="text-[12px] font-medium text-white/40 truncate max-w-[45%] text-right">{data.anket.secenek_b}</span>
        </div>
      </div>

      <!-- Oy butonları -->
      <div class="grid grid-cols-2 gap-2 px-6 pb-5">
        <OyFormu
          anketId={data.anket.id}
          secenekA={data.anket.secenek_a}
          secenekB={data.anket.secenek_b}
          onOyKaydedildi={oyKaydedildi}
        />
      </div>

      <!-- Footer: hacim -->
      <div class="border-t border-white/[0.06] px-6 py-3 flex justify-between items-center">
        <span class="text-[11px] text-white/30">{toplamOy.toLocaleString('tr-TR')} oy</span>
        {#if secilenSecim}
          <span class="text-[11px] font-medium" style="color: {secilenSecim === 'A' ? '#00C896' : '#FF4B6E'};">
            "{secilenSecim === 'A' ? data.anket.secenek_a : data.anket.secenek_b}" seçtiniz
          </span>
        {/if}
      </div>
    </div>
  {/if}
</div>
