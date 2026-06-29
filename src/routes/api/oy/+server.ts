import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';
import { emailHash } from '$lib/hash';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const body = await request.json().catch(() => null);
  const anketId: string = body?.anketId?.trim() ?? '';
  const secim: string = body?.secim ?? '';

  if (!anketId || !['A', 'B'].includes(secim)) {
    return json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  // Anketin aktif olduğunu doğrula
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

  // IP adresini al ve hash'le
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? getClientAddress();
  const ipHash = await emailHash(ip, anketId);

  // Oyu kaydet (UNIQUE constraint duplicate'ı engeller)
  const { error: insertError } = await supabaseServer
    .from('oylar')
    .insert({ anket_id: anketId, email_hash: ipHash, secim });

  if (insertError) {
    if (insertError.code === '23505') {
      return json({ error: 'Bu anket için bu cihazdan zaten oy kullandınız' }, { status: 409 });
    }
    return json({ error: 'Oy kaydedilemedi, tekrar deneyin' }, { status: 500 });
  }

  // Güncel sonuçları döndür
  const [{ count: oyA }, { count: oyB }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'B')
  ]);

  return json({ ok: true, oylar: { a: oyA ?? 0, b: oyB ?? 0 } });
};
