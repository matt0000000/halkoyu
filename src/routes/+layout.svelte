<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
  <header class="border-b border-zinc-800 px-6 py-4">
    <div class="max-w-3xl mx-auto flex justify-between items-center">
      <a href="/" class="flex items-center gap-2 hover:text-indigo-400 transition-colors group">
        <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors">
          <span class="text-white font-black text-sm leading-none">r</span>
        </span>
        <span class="text-base font-semibold tracking-tight text-white group-hover:text-indigo-400 transition-colors">referandoom</span>
      </a>
      <a href="/sonuclar" class="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
