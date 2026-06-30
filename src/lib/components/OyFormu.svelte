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
    <p class="text-[#0A84FF] font-semibold text-lg mb-1">Oyunuz kaydedildi</p>
    <p class="text-white/30 text-sm">"{secilen === 'A' ? secenekA : secenekB}" için oy kullandınız</p>
  </div>
{:else}
  <!-- Sol buton -->
  <button
    onclick={() => oyKullan('A')}
    disabled={yukleniyor}
    class="group flex items-center justify-center min-h-32 px-5 py-7 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] active:scale-[0.97] disabled:opacity-40 transition-all duration-150 shadow-lg shadow-black/20"
  >
    <span class="text-xl sm:text-2xl font-bold text-white text-center leading-tight">{secenekA}</span>
  </button>

  <!-- VS -->
  <div class="flex items-center justify-center">
    <span class="text-[13px] font-bold text-white/20 tracking-widest select-none">VS</span>
  </div>

  <!-- Sağ buton -->
  <button
    onclick={() => oyKullan('B')}
    disabled={yukleniyor}
    class="group flex items-center justify-center min-h-32 px-5 py-7 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] active:scale-[0.97] disabled:opacity-40 transition-all duration-150 shadow-lg shadow-black/20"
  >
    <span class="text-xl sm:text-2xl font-bold text-white text-center leading-tight">{secenekB}</span>
  </button>

  {#if hata}
    <p class="col-span-3 text-red-400/80 text-[13px] text-center mt-2">{hata}</p>
  {/if}
{/if}
