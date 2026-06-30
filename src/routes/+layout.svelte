<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-black text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;">
  <header class="sticky top-0 z-10 backdrop-blur-xl bg-black/70 border-b border-white/[0.08] px-6 py-3">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <a href="/" class="flex items-center gap-2.5 group">
        <span class="flex items-center justify-center w-7 h-7 rounded bg-[#00D964]">
          <span class="text-black font-black text-sm leading-none">r</span>
        </span>
        <span class="text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors">referandoom</span>
      </a>
      <a href="/sonuclar" class="text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors">
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
