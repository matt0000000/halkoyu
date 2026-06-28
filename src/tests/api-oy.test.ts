import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockVerifyOtp, mockAdminSignOut, mockFrom } = vi.hoisted(() => ({
  mockVerifyOtp: vi.fn(),
  mockAdminSignOut: vi.fn().mockResolvedValue({}),
  mockFrom: vi.fn(),
}));

vi.mock('$lib/supabase', () => ({
  supabaseServer: {
    auth: {
      verifyOtp: mockVerifyOtp,
      admin: { signOut: mockAdminSignOut },
    },
    from: mockFrom,
  }
}));

vi.mock('$lib/hash', () => ({
  emailHash: vi.fn().mockResolvedValue('test-hash-value'),
}));

vi.mock('$env/static/public', () => ({
  PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
}));

vi.mock('$env/static/private', () => ({
  SUPABASE_SERVICE_KEY: 'test-service-key'
}));

import { POST } from '../routes/api/oy/+server';

function makeAnketChain() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'anket-uuid', aktif: true }, error: null }),
  };
}

describe('POST /api/oy', () => {
  beforeEach(() => {
    mockVerifyOtp.mockReset();
    mockFrom.mockReset();
  });

  it('geçerli istek için oy kaydeder ve sonuçları döner', async () => {
    mockVerifyOtp.mockResolvedValue({ data: { session: { access_token: 'tok' }, user: {} }, error: null });

    let callCount = 0;
    mockFrom.mockImplementation((table: string) => {
      callCount++;
      if (table === 'anketler') return makeAnketChain();
      if (table === 'oylar' && callCount === 2) {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
      // count queries for oylar — must be thenable so await resolves correctly
      const countResult = { count: 5, error: null };
      const thenableChain: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: (resolve: (v: any) => any) => Promise.resolve(countResult).then(resolve),
        catch: (reject: (e: any) => any) => Promise.resolve(countResult).catch(reject),
      };
      thenableChain.select.mockReturnValue(thenableChain);
      thenableChain.eq.mockReturnValue(thenableChain);
      return thenableChain;
    });

    const req = new Request('http://localhost/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', anketId: 'anket-uuid', kod: '123456', secim: 'A' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(200);
  });

  it('geçersiz secim için 400 döner', async () => {
    const req = new Request('http://localhost/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', anketId: 'anket-uuid', kod: '123456', secim: 'C' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });

  it('yanlış OTP için 401 döner', async () => {
    mockVerifyOtp.mockResolvedValue({ error: { message: 'Invalid OTP' } });
    mockFrom.mockImplementation(() => makeAnketChain());

    const req = new Request('http://localhost/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', anketId: 'anket-uuid', kod: '000000', secim: 'A' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(401);
  });

  it('mükerrer oy için 409 ve Türkçe hata mesajı döner', async () => {
    mockVerifyOtp.mockResolvedValue({ data: { session: null }, error: null });

    let callCount = 0;
    mockFrom.mockImplementation((table: string) => {
      callCount++;
      if (table === 'anketler') return makeAnketChain();
      // insert returns duplicate key error
      return { insert: vi.fn().mockResolvedValue({ error: { code: '23505' } }) };
    });

    const req = new Request('http://localhost/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', anketId: 'anket-uuid', kod: '123456', secim: 'B' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('Bu anket için zaten oy kullandınız');
  });
});
