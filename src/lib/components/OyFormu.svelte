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

  const RENK_A = '#00C896';
  const RENK_B = '#FF4B6E';

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

  function stil(secim: 'A' | 'B') {
    const renk = secim === 'A' ? RENK_A : RENK_B;
    if (!secilen) {
      return `background: ${renk}1A; color: ${renk}; border: 1px solid ${renk}40;`;
    }
    if (secilen === secim) {
      return `background: ${renk}; color: #08110d; border: 1px solid ${renk};`;
    }
    return `background: transparent; color: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.08);`;
  }
</script>

<button
  onclick={() => oyKullan('A')}
  disabled={yukleniyor || !!secilen}
  class="flex items-center justify-center min-h-14 px-4 py-3 rounded-xl font-bold text-[15px] transition-all duration-200 active:scale-[0.96] disabled:cursor-default {!secilen ? 'hover:brightness-125' : ''} {secilen === 'A' ? 'scale-[1.02]' : ''}"
  style={stil('A')}
>
  {secenekA}
</button>

<button
  onclick={() => oyKullan('B')}
  disabled={yukleniyor || !!secilen}
  class="flex items-center justify-center min-h-14 px-4 py-3 rounded-xl font-bold text-[15px] transition-all duration-200 active:scale-[0.96] disabled:cursor-default {!secilen ? 'hover:brightness-125' : ''} {secilen === 'B' ? 'scale-[1.02]' : ''}"
  style={stil('B')}
>
  {secenekB}
</button>

{#if hata}
  <p class="col-span-2 text-red-400/80 text-[13px] text-center mt-1">{hata}</p>
{/if}
