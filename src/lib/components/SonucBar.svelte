<script lang="ts">
  let { secenek, oy, toplamOy, kazanan = false }: {
    secenek: string;
    oy: number;
    toplamOy: number;
    kazanan?: boolean;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div class="flex items-center justify-between px-5 py-4 {kazanan ? 'bg-[#00D964]/10' : ''}">
  <span class="font-semibold text-[15px] {kazanan ? 'text-[#00D964]' : 'text-white/60'}">{secenek}</span>
  <span class="font-bold tabular-nums text-[15px] {kazanan ? 'text-[#00D964]' : 'text-white/40'}">{yuzde}% <span class="font-normal text-white/25">({oy.toLocaleString('tr-TR')})</span></span>
</div>
