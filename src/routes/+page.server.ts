import type { PageServerLoad } from './$types';
import { supabaseServer } from '$lib/supabase';
import { emailHash } from '$lib/hash';

export const load: PageServerLoad = async ({ getClientAddress }) => {
  const { data: anket } = await supabaseServer
    .from('anketler')
    .select('id, slug, soru, secenek_a, secenek_b')
    .eq('aktif', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!anket) return { anket: null, oy_a: 0, oy_b: 0, oncekiSecim: null };

  const [{ count: oy_a }, { count: oy_b }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anket.id).eq('secim', 'B')
  ]);

  // Kullanıcının daha önce oy kullanıp kullanmadığını kontrol et (IP tabanlı)
  let oncekiSecim: 'A' | 'B' | null = null;
  const ip = getClientAddress();
  const visitorHash = await emailHash(ip, anket.id);
  const { data: mevcutOy } = await supabaseServer
    .from('oylar')
    .select('secim')
    .eq('anket_id', anket.id)
    .eq('email_hash', visitorHash)
    .single();
  if (mevcutOy?.secim === 'A' || mevcutOy?.secim === 'B') {
    oncekiSecim = mevcutOy.secim;
  }

  return { anket, oy_a: oy_a ?? 0, oy_b: oy_b ?? 0, oncekiSecim };
};
