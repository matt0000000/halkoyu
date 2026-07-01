<script lang="ts">
  const LIME = '#b6e84a';

  let { secenek, oy, toplamOy }: {
    secenek: string;
    oy: number;
    toplamOy: number;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="relative rounded-xl overflow-hidden" style="height: 60px; background: #2a2a34;">
  <div
    class="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
    style="width: {yuzde}%; background: {LIME}; opacity: 0.3;"
  ></div>
  <div class="relative flex items-center justify-between px-5 h-full">
    <span class="font-semibold text-[14px] text-white">{secenek}</span>
    <span class="font-bold tabular-nums text-[14px]" style="color: {LIME};">{yuzde}%</span>
  </div>
</div>
