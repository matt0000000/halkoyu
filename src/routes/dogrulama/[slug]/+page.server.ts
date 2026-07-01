import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseServer } from '$lib/supabase';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { data: anket } = await supabaseServer
    .from('anketler')
    .select('id, slug, soru, secenek_a, secenek_b')
    .eq('slug', params.slug)
    .single();

  if (!anket) throw error(404, 'Anket bulunamadı');

  const res = await fetch(`/api/zincir/${params.slug}`);
  const zincir = await res.json();

  return { anket, zincir };
};
