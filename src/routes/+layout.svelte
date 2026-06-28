<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<main class="min-h-screen bg-gray-50 text-gray-900">
  <header class="bg-white border-b border-gray-200 px-4 py-3">
    <a href="/" class="text-xl font-bold text-blue-600">Halk Oylaması</a>
  </header>
  {@render children()}
</main>
