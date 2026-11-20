import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import {
  generateSessionToken,
  verifySessionToken,
  revokeSessionToken,
  isAuthRateLimited,
  recordAuthFailure,
  isLoginRateLimited,
  recordLoginFailure,
  clearLoginFailures,
  getClientIp,
  requireSameOrigin,
  parseRangeHeader,
  hashAdminPasswordPbkdf2,
  verifyPbkdf2Password,
  isAdminPasswordValid,
  ALLOWED_UPLOAD_EXTS,
  wasKeyDeviceCounted,
  markKeyDeviceCounted,
  isKeyVerifyRateLimited,
  recordKeyVerifyFailure,
} from '../server/app';

// Server hardening (fix-all, 20 Nov 2026): logout must actually kill a
// session, and admin login / gate-key unlock must be rate-limited like
// book-key verify (10 failures per IP in 15 minutes, then 429).

describe('admin session logout', () => {
  it('a generated token verifies, then stops verifying after revoke', () => {
    const token = generateSessionToken();
    expect(verifySessionToken(token)).toBe(true);
    revokeSessionToken(token);
    expect(verifySessionToken(token)).toBe(false);
    // Revoked stays revoked: the HMAC fallback must not resurrect it.
    expect(verifySessionToken(token)).toBe(false);
  });

  it('rejects malformed and empty tokens', () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken('')).toBe(false);
    expect(verifySessionToken('not-a-token')).toBe(false);
    expect(verifySessionToken('abc.def')).toBe(false);
  });

  it('revoking one token does not kill another', () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    revokeSessionToken(a);
    expect(verifySessionToken(a)).toBe(false);
    expect(verifySessionToken(b)).toBe(true);
  });
});

describe('auth rate limiting (admin login / gate unlock)', () => {
  it('allows fewer than 10 failures, then blocks at 10', () => {
    const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
    const scope = `test-scope-${Date.now()}`;
    for (let i = 0; i < 9; i++) {
      expect(isAuthRateLimited(ip, scope)).toBe(false);
      recordAuthFailure(ip, scope);
    }
    expect(isAuthRateLimited(ip, scope)).toBe(false);
    recordAuthFailure(ip, scope);
    expect(isAuthRateLimited(ip, scope)).toBe(true);
  });

  it('limits are per IP + scope, not global', () => {
    const scope = `test-scope-${Date.now()}-b`;
    for (let i = 0; i < 10; i++) recordAuthFailure('198.51.100.1', scope);
    expect(isAuthRateLimited('198.51.100.1', scope)).toBe(true);
    expect(isAuthRateLimited('198.51.100.2', scope)).toBe(false);
    expect(isAuthRateLimited('198.51.100.1', `${scope}-other`)).toBe(false);
  });
});

describe('admin session tokens carry expiry (H-3)', () => {
  it('a fresh token verifies and embeds a 24h expiry', () => {
    const before = Date.now();
    const token = generateSessionToken();
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toMatch(/^[0-9a-f]{64}$/); // 32 random bytes, hex
    const exp = Number(parts[1]);
    expect(exp - before).toBeGreaterThan(24 * 60 * 60 * 1000 - 60_000);
    expect(exp - before).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
    expect(verifySessionToken(token)).toBe(true);
  });

  it('a token generated 25 hours ago is already expired', () => {
    const token = generateSessionToken(Date.now() - 25 * 60 * 60 * 1000);
    expect(verifySessionToken(token)).toBe(false);
  });

  it('old 2-part tokens (no expiry) stop working on deploy', () => {
    expect(verifySessionToken('abcdef.0123456789abcdef')).toBe(false);
    expect(verifySessionToken('abc.def.ghi.jkl')).toBe(false);
  });
});

describe('admin login limiter (H-1: 5 tries per IP + username)', () => {
  it('allows 5 failures, then blocks the 6th check', () => {
    const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
    const user = `lockout-user-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect(isLoginRateLimited(ip, user)).toBe(false);
      recordLoginFailure(ip, user);
    }
    expect(isLoginRateLimited(ip, user)).toBe(true);
  });

  it('is per username (case-insensitive) and clears on success', () => {
    const ip = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
    const user = `ClearUser-${Date.now()}`;
    for (let i = 0; i < 5; i++) recordLoginFailure(ip, user);
    expect(isLoginRateLimited(ip, user)).toBe(true);
    expect(isLoginRateLimited(ip, user.toLowerCase())).toBe(true); // same bucket
    expect(isLoginRateLimited(ip, `other-${Date.now()}`)).toBe(false);
    clearLoginFailures(ip, user);
    expect(isLoginRateLimited(ip, user)).toBe(false);
  });
});

describe('getClientIp (H-6: first X-Forwarded-For entry, validated)', () => {
  const req = (headers: Record<string, unknown>, ip = '10.0.0.9') =>
    ({ headers, ip, socket: { remoteAddress: ip } }) as any;

  it('takes the first X-Forwarded-For entry', () => {
    expect(getClientIp(req({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1, 10.0.0.2' }))).toBe('203.0.113.5');
    expect(getClientIp(req({ 'x-forwarded-for': '2001:db8::1, 10.0.0.1' }))).toBe('2001:db8::1');
  });

  it('falls back to req.ip for a missing or junk header', () => {
    expect(getClientIp(req({}))).toBe('10.0.0.9');
    expect(getClientIp(req({ 'x-forwarded-for': 'not-an-ip' }))).toBe('10.0.0.9');
    expect(getClientIp(req({ 'x-forwarded-for': '' }))).toBe('10.0.0.9');
  });

  it('two different X-Forwarded-For values get independent book-key buckets', () => {
    const bookId = `b-xff-${Date.now()}`;
    const ipA = getClientIp(req({ 'x-forwarded-for': '203.0.113.11' }));
    const ipB = getClientIp(req({ 'x-forwarded-for': '203.0.113.22' }));
    for (let i = 0; i < 10; i++) recordKeyVerifyFailure(ipA, bookId);
    expect(isKeyVerifyRateLimited(ipA, bookId)).toBe(true);
    expect(isKeyVerifyRateLimited(ipB, bookId)).toBe(false);
  });
});

describe('Range validation (L-6)', () => {
  const SIZE = 1000;

  it('accepts plain, open-ended and suffix ranges', () => {
    expect(parseRangeHeader('bytes=0-99', SIZE)).toEqual({ start: 0, end: 99 });
    expect(parseRangeHeader('bytes=500-', SIZE)).toEqual({ start: 500, end: 999 });
    expect(parseRangeHeader('bytes=-100', SIZE)).toEqual({ start: 900, end: 999 });
  });

  it('rejects junk, out-of-range and reversed ranges', () => {
    expect(parseRangeHeader('bytes=abc-def', SIZE)).toBeNull();
    expect(parseRangeHeader('bytes=1000-1001', SIZE)).toBeNull(); // start >= size
    expect(parseRangeHeader('bytes=500-499', SIZE)).toBeNull(); // end < start
    expect(parseRangeHeader('bytes=0-1000', SIZE)).toBeNull(); // end >= size
    expect(parseRangeHeader('bytes=-0', SIZE)).toBeNull();
    expect(parseRangeHeader(undefined, SIZE)).toBeNull();
    expect(parseRangeHeader('items=0-99', SIZE)).toBeNull();
  });
});

describe('admin password hashing (M-4: salted pbkdf2)', () => {
  it('hashes and verifies, and rejects wrong passwords', () => {
    const stored = hashAdminPasswordPbkdf2('correct horse battery staple');
    expect(stored).toMatch(/^pbkdf2:210000:[0-9a-f]{32}:[0-9a-f]{64}$/);
    expect(stored).not.toContain('correct horse');
    expect(verifyPbkdf2Password('correct horse battery staple', stored)).toBe(true);
    expect(verifyPbkdf2Password('wrong password', stored)).toBe(false);
    expect(verifyPbkdf2Password('correct horse battery staple', 'pbkdf2:210000:00:00')).toBe(false);
  });

  it('isAdminPasswordValid accepts a pbkdf2 ADMIN_PASSWORD_HASH from env', () => {
    const savedHash = process.env.ADMIN_PASSWORD_HASH;
    const savedPass = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD = '';
    process.env.ADMIN_PASSWORD_HASH = hashAdminPasswordPbkdf2('env-hash-password');
    try {
      expect(isAdminPasswordValid('env-hash-password')).toBe(true);
      expect(isAdminPasswordValid('not-the-password')).toBe(false);
    } finally {
      if (savedHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
      else process.env.ADMIN_PASSWORD_HASH = savedHash;
      if (savedPass === undefined) delete process.env.ADMIN_PASSWORD;
      else process.env.ADMIN_PASSWORD = savedPass;
    }
  });

  it('the deprecated unsalted SHA-256 shim still verifies (migration only)', () => {
    const savedHash = process.env.ADMIN_PASSWORD_HASH;
    const savedPass = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD = '';
    process.env.ADMIN_PASSWORD_HASH = createHash('sha256').update('legacy-password').digest('hex');
    try {
      expect(isAdminPasswordValid('legacy-password')).toBe(true);
      expect(isAdminPasswordValid('wrong')).toBe(false);
    } finally {
      if (savedHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
      else process.env.ADMIN_PASSWORD_HASH = savedHash;
      if (savedPass === undefined) delete process.env.ADMIN_PASSWORD;
      else process.env.ADMIN_PASSWORD = savedPass;
    }
  });
});

describe('requireSameOrigin (M-1)', () => {
  const run = (method: string, path: string, origin?: string) => {
    let status = 0;
    let body: any = null;
    let nextCalled = false;
    const res: any = {
      status: (code: number) => {
        status = code;
        return { json: (b: any) => { body = b; } };
      },
    };
    requireSameOrigin({ method, path, headers: origin ? { origin } : {} } as any, res, () => { nextCalled = true; });
    return { status, body, nextCalled };
  };

  it('rejects a cross-origin POST to an admin route with 403', () => {
    const r = run('POST', '/api/admin/books', 'https://evil.example.com');
    expect(r.nextCalled).toBe(false);
    expect(r.status).toBe(403);
  });

  it('allows an allowlisted origin, a missing origin, and GETs', () => {
    expect(run('POST', '/api/admin/books', 'https://ilmeghayb.vercel.app').nextCalled).toBe(true);
    expect(run('DELETE', '/api/admin/books/x', undefined).nextCalled).toBe(true);
    expect(run('GET', '/api/admin/books', 'https://evil.example.com').nextCalled).toBe(true);
    expect(run('POST', '/api/gate/unlock', 'https://evil.example.com').nextCalled).toBe(true);
  });
});

describe('upload allowlist (M-5)', () => {
  it('allows library types and refuses scripts, svg and html', () => {
    for (const ext of ['.pdf', '.docx', '.doc', '.epub', '.txt', '.png', '.jpg', '.jpeg', '.webp']) {
      expect(ALLOWED_UPLOAD_EXTS.has(ext)).toBe(true);
    }
    for (const ext of ['.svg', '.html', '.htm', '.js', '.exe', '.zip', '']) {
      expect(ALLOWED_UPLOAD_EXTS.has(ext)).toBe(false);
    }
  });
});

describe('per-device use counting (H-4 / L-4)', () => {
  it('marks a (keyId, deviceId) pair once and remembers it', () => {
    const keyId = `k-test-${Date.now()}`;
    const device = '550e8400-e29b-41d4-a716-446655440000';
    expect(wasKeyDeviceCounted(keyId, device)).toBe(false);
    markKeyDeviceCounted(keyId, device);
    expect(wasKeyDeviceCounted(keyId, device)).toBe(true);
    expect(wasKeyDeviceCounted(keyId, 'another-device')).toBe(false);
    expect(wasKeyDeviceCounted(`other-${Date.now()}`, device)).toBe(false);
  });
});
