<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-[#161721] text-white" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
  <header class="bg-[#1e1f2e] border-b border-[#2d2f45] px-6 h-[56px] flex items-center">
    <div class="max-w-4xl mx-auto w-full flex justify-between items-center">
      <a href="/" class="flex items-center gap-2.5 group">
        <span class="flex items-center justify-center w-7 h-7 rounded bg-[#00C805]">
          <span class="text-black font-bold text-[13px] leading-none">r</span>
        </span>
        <span class="text-[15px] font-semibold text-white">referandoom</span>
      </a>
      <a href="/sonuclar" class="text-[13px] font-medium text-[#9b9bb4] hover:text-white transition-colors">
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
