<script lang="ts">
  let { anketId, secenekA, secenekB, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    onOyKaydedildi?: (oylar: { a: number; b: number }) => void;
  } = $props();

  let tamam = $state(false);
  let secilen = $state<'A' | 'B' | null>(null);
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
    secilen = secim;
    tamam = true;
    onOyKaydedildi?.(data.oylar);
  }
</script>

{#if tamam}
  <div class="col-span-3 text-center py-6">
    <p class="text-indigo-400 font-bold text-xl mb-1">Oyunuz kaydedildi!</p>
    <p class="text-zinc-500 text-sm">"{secilen === 'A' ? secenekA : secenekB}" için oy kullandınız</p>
  </div>
{:else}
  <!-- Sol buton -->
  <button
    onclick={() => oyKullan('A')}
    disabled={yukleniyor}
    class="group relative flex items-center justify-center min-h-36 px-6 py-8 rounded-2xl border-2 border-zinc-800 bg-zinc-900 hover:border-indigo-500 hover:bg-indigo-950/40 disabled:opacity-40 transition-all duration-200 active:scale-[0.98]"
  >
    <span class="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors text-center">{secenekA}</span>
    <span class="absolute inset-0 rounded-2xl ring-indigo-500/0 group-hover:ring-indigo-500/20 ring-4 transition-all duration-200"></span>
  </button>

  <!-- VS -->
  <div class="flex items-center justify-center px-1">
    <span class="text-2xl font-black text-zinc-600 select-none">VS</span>
  </div>

  <!-- Sağ buton -->
  <button
    onclick={() => oyKullan('B')}
    disabled={yukleniyor}
    class="group relative flex items-center justify-center min-h-36 px-6 py-8 rounded-2xl border-2 border-zinc-800 bg-zinc-900 hover:border-indigo-500 hover:bg-indigo-950/40 disabled:opacity-40 transition-all duration-200 active:scale-[0.98]"
  >
    <span class="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors text-center">{secenekB}</span>
    <span class="absolute inset-0 rounded-2xl ring-indigo-500/0 group-hover:ring-indigo-500/20 ring-4 transition-all duration-200"></span>
  </button>

  {#if hata}
    <p class="col-span-3 text-red-400 text-sm text-center mt-1">{hata}</p>
  {/if}
{/if}
