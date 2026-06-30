<script lang="ts">
  let { anketId, secenekA, secenekB, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    onOyKaydedildi?: (oylar: { a: number; b: number }) => void;
  } = $props();

  let tamam = $state(false);
  let hata = $state('');
  let yukleniyor = $state(false);

  async function oyKullan(secim: 'A' | 'B') {
    hata = '';
    yukleniyor = true;
    const res = await fetch('/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anketId, secim })
    });
    const data = await res.json();
    yukleniyor = false;
    if (!res.ok) { hata = data.error; return; }
    tamam = true;
    onOyKaydedildi?.(data.oylar);
  }
</script>

{#if tamam}
  <div class="col-span-2 text-center py-8">
    <p class="text-indigo-400 font-semibold text-lg">Oyunuz kaydedildi!</p>
  </div>
{:else}
  <button
    onclick={() => oyKullan('A')}
    disabled={yukleniyor}
    class="group py-8 px-6 rounded-2xl border border-zinc-700 bg-zinc-900 hover:border-indigo-500 hover:bg-indigo-950 disabled:opacity-40 transition-all duration-200 text-center"
  >
    <span class="block text-xl font-bold text-white">{secenekA}</span>
  </button>
  <button
    onclick={() => oyKullan('B')}
    disabled={yukleniyor}
    class="group py-8 px-6 rounded-2xl border border-zinc-700 bg-zinc-900 hover:border-indigo-500 hover:bg-indigo-950 disabled:opacity-40 transition-all duration-200 text-center"
  >
    <span class="block text-xl font-bold text-white">{secenekB}</span>
  </button>
  {#if hata}
    <p class="col-span-2 text-red-400 text-sm text-center mt-1">{hata}</p>
  {/if}
{/if}
