<script lang="ts">
  let { secenek, oy, toplamOy }: {
    secenek: string;
    oy: number;
    toplamOy: number;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="mb-4 last:mb-0">
  <div class="flex justify-between text-[13px] mb-1.5">
    <span class="font-medium text-white/70">{secenek}</span>
    <span class="tabular-nums text-white/30">{yuzde}% <span class="text-white/20">({oy.toLocaleString('tr-TR')})</span></span>
  </div>
  <div class="w-full bg-white/[0.08] rounded-full h-1.5">
    <div
      class="h-1.5 rounded-full transition-all duration-700"
      style="width: {yuzde}%; background: #0A84FF;"
    ></div>
  </div>
</div>
