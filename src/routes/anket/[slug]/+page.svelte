<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);

  const LIME = 'oklch(0.82 0.17 145)';

  function yuzde(oy: number): number {
    return toplamOy === 0 ? 0 : Math.round((oy / toplamOy) * 100);
  }

  function formatN(n: number): string {
    return n.toLocaleString();
  }
</script>

<svelte:head>
  <title>{data.anket.soru} — referandoom</title>
</svelte:head>

<div style="padding-top: 28px;">
  <a href="/sonuclar" style="display: inline-block; margin-bottom: 24px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; color: oklch(0.6 0.01 260); text-decoration: none;">← Archive</a>

  <h2 style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 28px; letter-spacing: -0.02em; margin: 0 0 24px; color: oklch(0.96 0.005 260);">{data.anket.soru}</h2>

  <div style="display: flex; flex-direction: column; gap: 22px;">
    {#each [{ label: data.anket.secenek_a, oy: oyA }, { label: data.anket.secenek_b, oy: oyB }] as r}
      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 9px;">
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 21px; color: oklch(0.94 0.005 260);">{r.label}</span>
          <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 26px; color: {LIME};">{yuzde(r.oy)}%</span>
        </div>
        <div style="height: 12px; background: oklch(0.26 0.02 265); border-radius: 999px; overflow: hidden;">
          <div style="height: 100%; border-radius: 999px; background: {LIME}; width: {yuzde(r.oy)}%;"></div>
        </div>
        <div style="margin-top: 7px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: oklch(0.6 0.01 260);">{formatN(r.oy)} votes</div>
      </div>
    {/each}
  </div>

  <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid oklch(0.28 0.02 265); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">
    {formatN(toplamOy)} total votes
  </div>
</div>
