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
  <p class="text-green-600 font-medium text-center py-4">Oyunuz kaydedildi!</p>
{:else}
  <div class="space-y-2">
    <p class="text-sm text-gray-600 mb-3">Oyunuzu kullanmak için bir seçenek seçin:</p>
    <button
      onclick={() => oyKullan('A')}
      disabled={yukleniyor}
      class="w-full py-2 px-4 rounded border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors"
    >{yukleniyor ? '...' : secenekA}</button>
    <button
      onclick={() => oyKullan('B')}
      disabled={yukleniyor}
      class="w-full py-2 px-4 rounded border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors"
    >{yukleniyor ? '...' : secenekB}</button>
    {#if hata}<p class="text-red-500 text-sm mt-2">{hata}</p>{/if}
  </div>
{/if}
