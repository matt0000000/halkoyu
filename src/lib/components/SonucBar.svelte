<script lang="ts">
  let { secenek, oy, toplamOy, kazanan = false }: {
    secenek: string;
    oy: number;
    toplamOy: number;
    kazanan?: boolean;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="px-5 py-4 {kazanan ? 'bg-[#e8f0fe]' : 'bg-white'}">
  <div class="flex justify-between items-center mb-2">
    <span class="font-medium text-[15px] {kazanan ? 'text-[#1a73e8]' : 'text-[#5f6368]'}">{secenek}</span>
    <span class="font-medium tabular-nums text-[14px] {kazanan ? 'text-[#1a73e8]' : 'text-[#80868b]'}">{yuzde}%</span>
  </div>
  <div class="w-full bg-[#e8eaed] rounded-full h-1.5">
    <div
      class="h-1.5 rounded-full transition-all duration-700"
      style="width: {yuzde}%; background: {kazanan ? '#1a73e8' : '#bdc1c6'};"
    ></div>
  </div>
</div>
