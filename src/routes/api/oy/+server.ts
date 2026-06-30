import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';
import { emailHash } from '$lib/hash';

const COOKIE_NAME = 'visitor_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

export const POST: RequestHandler = async ({ request, cookies }) => {
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

  // Visitor ID cookie'sini al veya yeni oluştur
  let visitorId = cookies.get(COOKIE_NAME);
  const isNewVisitor = !visitorId;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }

  const visitorHash = await emailHash(visitorId, anketId);

  // Oyu kaydet (UNIQUE constraint duplicate'ı engeller)
  const { error: insertError } = await supabaseServer
    .from('oylar')
    .insert({ anket_id: anketId, email_hash: visitorHash, secim });

  if (insertError) {
    if (insertError.code === '23505') {
      return json({ error: 'Bu ankette zaten oy kullandınız' }, { status: 409 });
    }
    return json({ error: 'Oy kaydedilemedi, tekrar deneyin' }, { status: 500 });
  }

  // Cookie'yi set et
  if (isNewVisitor) {
    cookies.set(COOKIE_NAME, visitorId, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: true
    });
  }

  // Güncel sonuçları döndür
  const [{ count: oyA }, { count: oyB }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'B')
  ]);

  return json({ ok: true, oylar: { a: oyA ?? 0, b: oyB ?? 0 } });
};
