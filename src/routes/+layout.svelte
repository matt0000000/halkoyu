<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
  <header class="border-b border-zinc-800 px-6 py-4">
    <div class="max-w-3xl mx-auto flex justify-between items-center">
      <a href="/" class="text-base font-semibold tracking-tight text-white hover:text-indigo-400 transition-colors">
        referandoom
      </a>
      <a href="/sonuclar" class="text-sm text-zinc-400 hover:text-indigo-400 transition-colors">
        Geçmiş Sonuçlar
      </a>
    </div>
  </header>
  {@render children()}
</div>
