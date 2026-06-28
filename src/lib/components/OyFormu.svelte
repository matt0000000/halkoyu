<script lang="ts">
  let { anketId, secenekA, secenekB, onOyKaydedildi }: {
    anketId: string;
    secenekA: string;
    secenekB: string;
    onOyKaydedildi?: (oylar: { a: number; b: number }) => void;
  } = $props();

  let adim = $state<'secim' | 'eposta' | 'kod' | 'tamam'>('secim');
  let secilenSecim = $state<'A' | 'B' | null>(null);
  let eposta = $state('');
  let kod = $state('');
  let hata = $state('');
  let yukleniyor = $state(false);

  async function otpGonder() {
    hata = '';
    yukleniyor = true;
    const res = await fetch('/api/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: eposta, anketId })
    });
    const data = await res.json();
    yukleniyor = false;
    if (!res.ok) { hata = data.error; return; }
    adim = 'kod';
  }

  async function oyKullan() {
    hata = '';
    yukleniyor = true;
    const res = await fetch('/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: eposta, anketId, kod, secim: secilenSecim })
    });
    const data = await res.json();
    yukleniyor = false;
    if (!res.ok) { hata = data.error; return; }
    adim = 'tamam';
    onOyKaydedildi?.(data.oylar);
  }
</script>

{#if adim === 'secim'}
  <div class="space-y-2">
    <p class="text-sm text-gray-600 mb-3">Oyunuzu kullanmak için bir seçenek seçin:</p>
    <button
      class="w-full py-2 px-4 rounded border-2 {secilenSecim === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}"
      onclick={() => { secilenSecim = 'A'; adim = 'eposta'; }}
    >{secenekA}</button>
    <button
      class="w-full py-2 px-4 rounded border-2 {secilenSecim === 'B' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}"
      onclick={() => { secilenSecim = 'B'; adim = 'eposta'; }}
    >{secenekB}</button>
  </div>

{:else if adim === 'eposta'}
  <div class="space-y-3">
    <p class="text-sm text-gray-600">E-posta adresinize doğrulama kodu gönderilecek:</p>
    <input
      type="email"
      bind:value={eposta}
      placeholder="ornek@eposta.com"
      class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
    />
    {#if hata}<p class="text-red-500 text-sm">{hata}</p>{/if}
    <button
      onclick={otpGonder}
      disabled={yukleniyor || !eposta}
      class="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
    >{yukleniyor ? 'Gönderiliyor...' : 'Kod Gönder'}</button>
  </div>

{:else if adim === 'kod'}
  <div class="space-y-3">
    <p class="text-sm text-gray-600">E-postanıza gelen 6 haneli kodu girin:</p>
    <input
      type="text"
      bind:value={kod}
      placeholder="123456"
      maxlength="6"
      class="w-full border border-gray-300 rounded px-3 py-2 text-sm tracking-widest text-center text-lg"
    />
    {#if hata}<p class="text-red-500 text-sm">{hata}</p>{/if}
    <button
      onclick={oyKullan}
      disabled={yukleniyor || kod.length !== 6}
      class="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
    >{yukleniyor ? 'Doğrulanıyor...' : 'Onayla ve Oy Ver'}</button>
  </div>

{:else}
  <p class="text-green-600 font-medium text-center py-4">Oyunuz kaydedildi!</p>
{/if}
