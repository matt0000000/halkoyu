import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';

export const GET: RequestHandler = async ({ params }) => {
  const { data: anket } = await supabaseServer
    .from('anketler')
    .select('id, slug, soru, secenek_a, secenek_b, created_at')
    .eq('slug', params.slug)
    .single();

  if (!anket) throw error(404, 'Anket bulunamadı');

  const { data: oylar } = await supabaseServer
    .from('oylar')
    .select('id, secim, email_hash, created_at, chain_hash')
    .eq('anket_id', anket.id)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  const { data: damgalar } = await supabaseServer
    .from('zaman_damgalari')
    .select('root_hash, oy_sayisi, ots_proof, durum, created_at, guncellendi_at')
    .eq('anket_id', anket.id)
    .order('created_at', { ascending: false });

  return json({
    anket,
    oylar: (oylar ?? []).map((o) => ({
      id: o.id,
      secim: o.secim,
      email_hash: o.email_hash,
      created_at_ms: new Date(o.created_at).getTime(),
      chain_hash: o.chain_hash
    })),
    zaman_damgalari: damgalar ?? []
  });
};
