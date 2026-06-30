<script lang="ts">
  let { secenek, oy, toplamOy, taraf = 'A' }: {
    secenek: string;
    oy: number;
    toplamOy: number;
    taraf?: 'A' | 'B';
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
  let renk = $derived(taraf === 'A' ? '#00C805' : '#FF4B4B');
</script>

<div class="px-5 py-4" style="background: {renk}12;">
  <div class="flex justify-between items-center mb-2">
    <span class="font-semibold text-[14px]" style="color: {renk};">{secenek}</span>
    <span class="font-bold tabular-nums text-[14px]" style="color: {renk};">{yuzde}%</span>
  </div>
  <div class="w-full rounded-full h-1" style="background: #2d2f45;">
    <div class="h-1 rounded-full transition-all duration-700" style="width: {yuzde}%; background: {renk};"></div>
  </div>
</div>
