import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const email: string = body?.email?.trim() ?? '';
  const anketId: string = body?.anketId?.trim() ?? '';

  if (!email || !anketId) {
    return json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  // Anketin var olup olmadığını ve aktif olduğunu kontrol et
  const { data: anket, error: anketError } = await supabaseServer
    .from('anketler')
    .select('id, aktif')
    .eq('id', anketId)
    .single();

  if (anketError || !anket) {
    return json({ error: 'Anket bulunamadı' }, { status: 404 });
  }

  if (!anket.aktif) {
    return json({ error: 'Bu anket kapalı' }, { status: 403 });
  }

  const { error } = await supabaseServer.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false }
  });

  if (error) {
    return json({ error: 'Kod gönderilemedi, lütfen tekrar deneyin' }, { status: 500 });
  }

  return json({ ok: true });
};
