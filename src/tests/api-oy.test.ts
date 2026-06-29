import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}));

vi.mock('$lib/supabase', () => ({
  supabaseServer: { from: mockFrom }
}));

vi.mock('$lib/hash', () => ({
  emailHash: vi.fn().mockResolvedValue('test-ip-hash'),
}));

vi.mock('$env/static/public', () => ({
  PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
}));

vi.mock('$env/static/private', () => ({
  SUPABASE_SERVICE_KEY: 'test-service-key'
}));

import { POST } from '../routes/api/oy/+server';

const mockGetClientAddress = vi.fn().mockReturnValue('127.0.0.1');

function makeRequest(body: object) {
  return {
    request: new Request('http://localhost/api/oy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),
    getClientAddress: mockGetClientAddress
  } as any;
}

function makeAnketChain() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'anket-uuid', aktif: true }, error: null }),
  };
}

function makeCountChain(count = 5) {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    then: (resolve: (v: any) => any) => Promise.resolve({ count, error: null }).then(resolve),
    catch: (reject: (e: any) => any) => Promise.resolve({ count, error: null }).catch(reject),
  };
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  return chain;
}

describe('POST /api/oy', () => {
  beforeEach(() => { mockFrom.mockReset(); });

  it('geçerli istek için oy kaydeder ve sonuçları döner', async () => {
    let oylarCallCount = 0;
    mockFrom.mockImplementation((table: string) => {
      if (table === 'anketler') return makeAnketChain();
      oylarCallCount++;
      if (oylarCallCount === 1) return { insert: vi.fn().mockResolvedValue({ error: null }) };
      return makeCountChain(5);
    });

    const res = await POST(makeRequest({ anketId: 'anket-uuid', secim: 'A' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.oylar).toEqual({ a: 5, b: 5 });
  });

  it('geçersiz secim için 400 döner', async () => {
    const res = await POST(makeRequest({ anketId: 'anket-uuid', secim: 'C' }));
    expect(res.status).toBe(400);
  });

  it('mükerrer IP için 409 ve Türkçe hata mesajı döner', async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === 'anketler') return makeAnketChain();
      return { insert: vi.fn().mockResolvedValue({ error: { code: '23505' } }) };
    });

    const res = await POST(makeRequest({ anketId: 'anket-uuid', secim: 'B' }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('Bu anket için bu cihazdan zaten oy kullandınız');
  });
});
