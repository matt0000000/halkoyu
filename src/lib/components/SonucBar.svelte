<script lang="ts">
  const LIME = 'oklch(0.82 0.17 145)';

  let { secenek, oy, toplamOy }: {
    secenek: string;
    oy: number;
    toplamOy: number;
  } = $props();

  let yuzde = $derived(toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100));
</script>

<div>
  <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
    <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: {LIME};">{secenek}</span>
    <span style="font-family: 'JetBrains Mono', monospace; color: oklch(0.6 0.01 260);">{yuzde}%</span>
  </div>
  <div style="height: 6px; background: oklch(0.26 0.02 265); border-radius: 999px; overflow: hidden;">
    <div style="height: 100%; background: {LIME}; border-radius: 999px; width: {yuzde}%;"></div>
  </div>
</div>
