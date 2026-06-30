<script lang="ts">
  let { anketId, secenekA, secenekB, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    onOyKaydedildi?: (secim: 'A' | 'B', oylar: { a: number; b: number }) => void;
  } = $props();

  let secilen = $state<'A' | 'B' | null>(null);
  let hata = $state('');
  let yukleniyor = $state(false);

  async function oyKullan(secim: 'A' | 'B') {
    if (secilen) return;
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
    onOyKaydedildi?.(secim, data.oylar);
  }

  function butonClass(secim: 'A' | 'B') {
    if (!secilen) {
      return 'bg-white/[0.07] hover:bg-white/[0.12] active:scale-[0.97]';
    }
    if (secilen === secim) {
      return 'bg-[#0A84FF] shadow-lg shadow-[#0A84FF]/30 scale-[1.02]';
    }
    return 'bg-white/[0.04] opacity-40';
  }
</script>

<!-- Sol buton -->
<button
  onclick={() => oyKullan('A')}
  disabled={yukleniyor || !!secilen}
  class="flex items-center justify-center min-h-32 px-5 py-7 rounded-2xl transition-all duration-300 shadow-lg shadow-black/20 disabled:cursor-default {butonClass('A')}"
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
  disabled={yukleniyor || !!secilen}
  class="flex items-center justify-center min-h-32 px-5 py-7 rounded-2xl transition-all duration-300 shadow-lg shadow-black/20 disabled:cursor-default {butonClass('B')}"
>
  <span class="text-xl sm:text-2xl font-bold text-white text-center leading-tight">{secenekB}</span>
</button>

{#if hata}
  <p class="col-span-3 text-red-400/80 text-[13px] text-center mt-2">{hata}</p>
{/if}
