<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  function winnerOf(anket: typeof data.anketler[0]) {
    return anket.oy_a >= anket.oy_b
      ? { label: anket.secenek_a, oy: anket.oy_a }
      : { label: anket.secenek_b, oy: anket.oy_b };
  }

  function pctOf(oy: number, toplam: number): number {
    return toplam === 0 ? 0 : Math.round((oy / toplam) * 100);
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  }

  function formatN(n: number): string {
    return n.toLocaleString();
  }
</script>

<svelte:head>
  <title>Archive — referandoom</title>
</svelte:head>

<div style="padding-top: 28px;">
  <h2 style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 28px; letter-spacing: -0.02em; margin: 0 0 4px; color: oklch(0.96 0.005 260);">Past referendums</h2>
  <p style="margin: 0 0 20px; font-size: 14px; color: oklch(0.6 0.01 260);">Every verdict, settled by the people.</p>

  {#if data.anketler.length === 0}
    <div style="padding: 40px 0; text-align: center; color: oklch(0.6 0.01 260); font-family: 'JetBrains Mono', monospace; font-size: 13px;">
      No past polls yet.
    </div>
  {:else}
    {#each data.anketler as anket (anket.id)}
      {@const toplam = anket.oy_a + anket.oy_b}
      {@const winner = winnerOf(anket)}
      {@const pct = pctOf(winner.oy, toplam)}
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 0; border-top: 1px solid oklch(0.28 0.02 265);">
        <div style="flex: 1; min-width: 0;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: oklch(0.6 0.01 260); margin-bottom: 4px; text-transform: uppercase;">{formatDate(anket.created_at)}</div>
          <div style="font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 19px; color: oklch(0.92 0.005 260);">{anket.soru}</div>
        </div>
        <div style="width: 180px; flex-shrink: 0;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
            <span style="font-family: 'Space Grotesk', sans-serif; font-weight: 600; color: oklch(0.82 0.17 145);">{winner.label}</span>
            <span style="font-family: 'JetBrains Mono', monospace; color: oklch(0.6 0.01 260);">{pct}%</span>
          </div>
          <div style="height: 6px; background: oklch(0.26 0.02 265); border-radius: 999px; overflow: hidden;">
            <div style="height: 100%; background: oklch(0.82 0.17 145); border-radius: 999px; width: {pct}%;"></div>
          </div>
          <div style="margin-top: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: oklch(0.55 0.01 260);">{formatN(toplam)} votes</div>
        </div>
      </div>
    {/each}
  {/if}
</div>
