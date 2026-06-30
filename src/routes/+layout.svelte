<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-[#f8f9fa] text-[#202124]" style="font-family: 'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <header class="bg-white border-b border-[#e8eaed] px-6 py-0 h-[64px] flex items-center">
    <div class="max-w-4xl mx-auto w-full flex justify-between items-center">
      <a href="/" class="flex items-center gap-2.5 group">
        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a73e8]">
          <span class="text-white font-bold text-[15px] leading-none">r</span>
        </span>
        <span class="text-[16px] font-medium text-[#202124]">referandoom</span>
      </a>
      <a href="/sonuclar" class="text-[14px] font-medium text-[#1a73e8] hover:bg-[#1a73e8]/[0.08] px-3 py-2 rounded-full transition-colors">
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
