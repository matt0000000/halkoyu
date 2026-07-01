<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  let { children } = $props();

  let isToday = $derived(page.url.pathname === '/');
  let isArchive = $derived(page.url.pathname.startsWith('/sonuclar'));
</script>

<div style="min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 48px 24px 64px; background: oklch(0.13 0.012 265);">
  <div style="width: 100%; max-width: 720px; background: oklch(0.18 0.015 265); border-radius: 20px; overflow: hidden; border: 1px solid oklch(0.28 0.02 265); box-shadow: 0 40px 90px -40px rgba(0,0,0,0.7); color: oklch(0.95 0.005 260);">
    <div style="padding: 40px 48px 48px;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 26px; border-bottom: 1px solid oklch(0.28 0.02 265);">
        <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
          <div style="width: 11px; height: 11px; border-radius: 50%; background: oklch(0.82 0.17 145); flex-shrink: 0;"></div>
          <span style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: oklch(0.97 0.005 260);">REFERANDOOM</span>
        </a>
        <nav style="display: flex; gap: 28px;">
          <a href="/" style="position: relative; background: none; border: none; padding: 4px 0; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: oklch(0.7 0.01 260);">
            Bugün
            {#if isToday}
              <div style="position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: oklch(0.82 0.17 145); border-radius: 2px;"></div>
            {/if}
          </a>
          <a href="/sonuclar" style="position: relative; background: none; border: none; padding: 4px 0; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: oklch(0.7 0.01 260);">
            Arşiv
            {#if isArchive}
              <div style="position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: oklch(0.82 0.17 145); border-radius: 2px;"></div>
            {/if}
          </a>
        </nav>
      </div>

      <!-- Page content -->
      {@render children()}

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid oklch(0.28 0.02 265); text-align: center;">
        <a href="/nasil-guvenilir" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; background: oklch(0.82 0.17 145 / 0.08); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: oklch(0.82 0.17 145); text-decoration: none;">
          🔒 Bu sonuçlara neden güvenebilirsin?
        </a>
      </div>

    </div>
  </div>
</div>

<style>
  @media (max-width: 600px) {
    div[style*="padding: 40px 48px"] {
      padding: 28px 24px 32px !important;
    }
  }
</style>
