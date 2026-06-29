import type { PageServerLoad } from './$types';
import { supabaseServer } from '$lib/supabase';

export const load: PageServerLoad = async () => {
  const { data: anketler } = await supabaseServer
    .from('anketler')
    .select('id, slug, soru, secenek_a, secenek_b, created_at')
    .eq('aktif', false)
    .order('created_at', { ascending: false });

  if (!anketler || anketler.length === 0) return { anketler: [] };

  const anketlerOylu = await Promise.all(
    anketler.map(async (anket) => {
      const [{ count: oy_a }, { count: oy_b }] = await Promise.all([
        supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'A'),
        supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'B')
      ]);
      return { ...anket, oy_a: oy_a ?? 0, oy_b: oy_b ?? 0 };
    })
  );

  return { anketler: anketlerOylu };
};
