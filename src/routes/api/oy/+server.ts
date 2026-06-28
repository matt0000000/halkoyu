import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseServer } from '$lib/supabase';
import { emailHash } from '$lib/hash';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const email: string = body?.email?.trim() ?? '';
  const anketId: string = body?.anketId?.trim() ?? '';
  const kod: string = body?.kod?.trim() ?? '';
  const secim: string = body?.secim ?? '';

  if (!email || !anketId || !kod || !['A', 'B'].includes(secim)) {
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

  // OTP'yi doğrula
  const { data: verifyData, error: otpError } = await supabaseServer.auth.verifyOtp({
    email,
    token: kod,
    type: 'email'
  });

  if (otpError) {
    return json({ error: 'Kod geçersiz veya süresi dolmuş' }, { status: 401 });
  }

  const hash = await emailHash(email, anketId);

  // Oyu kaydet (UNIQUE constraint duplicate'ı engeller)
  const { error: insertError } = await supabaseServer
    .from('oylar')
    .insert({ anket_id: anketId, email_hash: hash, secim });

  if (insertError) {
    if (insertError.code === '23505') {
      return json({ error: 'Bu anket için zaten oy kullandınız' }, { status: 409 });
    }
    return json({ error: 'Oy kaydedilemedi, tekrar deneyin' }, { status: 500 });
  }

  // Oturum tek kullanımlık — oyu kaydettikten sonra kapat
  if (verifyData?.session) {
    await supabaseServer.auth.admin.signOut(verifyData.session.access_token, 'local');
  }

  // Güncel sonuçları döndür
  const [{ count: oyA }, { count: oyB }] = await Promise.all([
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'A'),
    supabaseServer.from('oylar').select('*', { count: 'exact', head: true }).eq('anket_id', anketId).eq('secim', 'B')
  ]);

  return json({ ok: true, oylar: { a: oyA ?? 0, b: oyB ?? 0 } });
};
