import { describe, it, expect } from 'vitest';
import { emailHash } from '$lib/hash';

describe('emailHash', () => {
  it('aynı girdi için aynı hash üretir', async () => {
    const h1 = await emailHash('test@example.com', 'anket-123');
    const h2 = await emailHash('test@example.com', 'anket-123');
    expect(h1).toBe(h2);
  });

  it('farklı e-posta için farklı hash üretir', async () => {
    const h1 = await emailHash('a@example.com', 'anket-123');
    const h2 = await emailHash('b@example.com', 'anket-123');
    expect(h1).not.toBe(h2);
  });

  it('farklı anket için farklı hash üretir', async () => {
    const h1 = await emailHash('test@example.com', 'anket-1');
    const h2 = await emailHash('test@example.com', 'anket-2');
    expect(h1).not.toBe(h2);
  });

  it('64 karakterlik hex string döner', async () => {
    const h = await emailHash('test@example.com', 'anket-123');
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });
});
