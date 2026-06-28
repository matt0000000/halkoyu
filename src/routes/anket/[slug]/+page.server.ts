import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseServer } from '$lib/supabase';

export const load: PageServerLoad = async ({ params }) => {
  const { data: anket, error: dbError } = await supabaseServer
    .from('anketler')
    .select('id, slug, soru, secenek_a, secenek_b, aktif')
    .eq('slug', params.slug)
    .single();

  if (dbError || !anket) {
    throw error(404, 'Anket bulunamadı');
  }

  const [{ count: oy_a }, { count: oy_b }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'B')
  ]);

  return { anket, oy_a: oy_a ?? 0, oy_b: oy_b ?? 0 };
};
