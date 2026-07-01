<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import OyFormu from '$lib/components/OyFormu.svelte';

  let { data }: { data: PageData } = $props();

  let oyA = $state(data.oy_a);
  let oyB = $state(data.oy_b);
  let toplamOy = $derived(oyA + oyB);

  let now = $state(Date.now());
  let countdown = $derived(computeCountdown(now));
  let dateStr = $derived(formatDate(new Date(now)));

  function computeCountdown(ts: number): string {
    const d = new Date(ts);
    const end = new Date(d);
    end.setHours(24, 0, 0, 0);
    let s = Math.max(0, Math.floor((end.getTime() - ts) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  function formatDate(d: Date): string {
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const rest = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `${weekday} · ${rest}`;
  }

  onMount(() => {
    const t = setInterval(() => { now = Date.now(); }, 1000);
    return () => clearInterval(t);
  });

  function oyKaydedildi(_secim: 'A' | 'B', oylar: { a: number; b: number }) {
    oyA = oylar.a;
    oyB = oylar.b;
  }
</script>

<svelte:head>
  <title>referandoom</title>
</svelte:head>

<div style="padding-top: 32px;">
  {#if !data.anket}
    <div style="text-align: center; padding: 60px 0; color: oklch(0.6 0.01 260);">
      <p style="font-size: 16px; margin: 0 0 12px;">No active poll today.</p>
      <a href="/sonuclar" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: oklch(0.82 0.17 145); text-decoration: underline;">View past results →</a>
    </div>
  {:else}
    <!-- Meta row -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
      <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: oklch(0.6 0.01 260);">{dateStr}</span>
    </div>

    <!-- Question -->
    <h1 style="font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(32px, 6vw, 48px); line-height: 1.02; letter-spacing: -0.03em; margin: 0 0 12px; color: oklch(0.97 0.005 260); text-wrap: balance;">
      {data.anket.soru}
    </h1>

    <p style="margin: 0 0 30px; font-size: 15px; color: oklch(0.62 0.01 260);">
      Poll of the day. One vote each — cast yours below.
    </p>

    <OyFormu
      anketId={data.anket.id}
      anketSlug={data.anket.slug}
      secenekA={data.anket.secenek_a}
      secenekB={data.anket.secenek_b}
      {oyA}
      {oyB}
      {toplamOy}
      {countdown}
      oncekiSecim={data.oncekiSecim}
      onOyKaydedildi={oyKaydedildi}
    />
  {/if}
</div>
