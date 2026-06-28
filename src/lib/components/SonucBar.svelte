<script lang="ts">
  let { secenek, oy, toplamOy }: {
    secenek: string;
    oy: number;
    toplamOy: number;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="mb-2">
  <div class="flex justify-between text-sm mb-1">
    <span class="font-medium">{secenek}</span>
    <span class="text-gray-500">{yuzde}% ({oy} oy)</span>
  </div>
  <div class="w-full bg-gray-200 rounded-full h-4">
    <div
      class="bg-blue-500 h-4 rounded-full transition-all duration-300"
      style="width: {yuzde}%"
    ></div>
  </div>
</div>
