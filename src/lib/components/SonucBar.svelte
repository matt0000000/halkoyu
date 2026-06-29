<script lang="ts">
  let { secenek, oy, toplamOy }: {
    secenek: string;
    oy: number;
    toplamOy: number;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="mb-4">
  <div class="flex justify-between text-sm mb-2">
    <span class="font-medium text-zinc-200">{secenek}</span>
    <span class="text-zinc-400 tabular-nums">{yuzde}% <span class="text-zinc-600">({oy} oy)</span></span>
  </div>
  <div class="w-full bg-zinc-800 rounded-full h-2.5">
    <div
      class="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
      style="width: {yuzde}%"
    ></div>
  </div>
</div>
