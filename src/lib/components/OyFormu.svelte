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
  <p class="text-green-600 font-semibold text-center py-6 text-lg col-span-2">Oyunuz kaydedildi!</p>
{:else}
  <button
    onclick={() => oyKullan('A')}
    disabled={yukleniyor}
    class="py-6 px-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors text-lg font-medium"
  >{secenekA}</button>
  <button
    onclick={() => oyKullan('B')}
    disabled={yukleniyor}
    class="py-6 px-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors text-lg font-medium"
  >{secenekB}</button>
  {#if hata}
    <p class="text-red-500 text-sm text-center col-span-2 mt-2">{hata}</p>
  {/if}
{/if}
