import { describe, it, expect, vi, beforeEach } from 'vitest';

// Supabase mock
const { mockSignInWithOtp } = vi.hoisted(() => ({ mockSignInWithOtp: vi.fn() }));
vi.mock('$lib/supabase', () => ({
  supabaseServer: {
    auth: { signInWithOtp: mockSignInWithOtp },
    from: vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn(() => ({ data: { id: 'anket-123', aktif: true }, error: null })) })) }))
    }))
  }
}));

vi.mock('$env/static/public', () => ({
  PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
}));

vi.mock('$env/static/private', () => ({
  SUPABASE_SERVICE_KEY: 'test-service-key'
}));

import { POST } from '../routes/api/otp/+server';

describe('POST /api/otp', () => {
  beforeEach(() => { mockSignInWithOtp.mockReset(); });

  it('geçerli istek için OTP gönderir', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const req = new Request('http://localhost/api/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', anketId: 'anket-123' })
    });
    const res = await POST({ request: req } as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it('eksik alan için 400 döner', async () => {
    const req = new Request('http://localhost/api/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' })
    });
    const res = await POST({ request: req } as any);
    expect(res.status).toBe(400);
  });
});
