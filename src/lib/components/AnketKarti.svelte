<script lang="ts">
  let { anket }: {
    anket: {
      id: string;
      slug: string;
      soru: string;
      aktif: boolean;
      oy_a: number;
      oy_b: number;
    };
  } = $props();

  let toplam = $derived(anket.oy_a + anket.oy_b);
</script>

<a href="/anket/{anket.slug}" class="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
  <div class="flex justify-between items-start mb-2">
    <h2 class="font-semibold text-gray-900">{anket.soru}</h2>
    <span class="text-xs px-2 py-1 rounded-full ml-2 shrink-0 {anket.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
      {anket.aktif ? 'Aktif' : 'Kapalı'}
    </span>
  </div>
  <p class="text-sm text-gray-500">{toplam} oy</p>
</a>
