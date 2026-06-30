<script lang="ts">
  let { secenek, oy, toplamOy, taraf = 'A' }: {
    secenek: string;
    oy: number;
    toplamOy: number;
    taraf?: 'A' | 'B';
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
  let renk = $derived(taraf === 'A' ? '#00C896' : '#FF4B6E');
</script>

<div class="mb-4 last:mb-0">
  <div class="flex justify-between text-[13px] mb-1.5">
    <span class="font-medium text-white/70">{secenek}</span>
    <span class="font-bold tabular-nums" style="color: {renk};">{yuzde}% <span class="text-white/25 font-normal">({oy.toLocaleString('tr-TR')})</span></span>
  </div>
  <div class="w-full bg-white/[0.08] rounded-full h-1.5">
    <div
      class="h-1.5 rounded-full transition-all duration-700"
      style="width: {yuzde}%; background: {renk};"
    ></div>
  </div>
</div>
