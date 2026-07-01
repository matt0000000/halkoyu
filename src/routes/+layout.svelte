<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen text-white" style="background: #18181f; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;">
  <header class="px-6 h-[56px] flex items-center border-b" style="border-color: #2a2a34;">
    <div class="max-w-xl mx-auto w-full flex justify-between items-center">
      <a href="/" class="flex items-center gap-2.5">
        <span class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-[14px]" style="background: #b6e84a; color: #18181f;">r</span>
        <span class="text-[15px] font-semibold text-white">referandoom</span>
      </a>
      <a href="/sonuclar" class="text-[13px] font-medium transition-colors" style="color: #666680;" onmouseenter={e => (e.currentTarget as HTMLElement).style.color='#b6e84a'} onmouseleave={e => (e.currentTarget as HTMLElement).style.color='#666680'}>
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
