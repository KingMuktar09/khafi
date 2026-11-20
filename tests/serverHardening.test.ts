import { describe, it, expect } from 'vitest';
import {
  generateSessionToken,
  verifySessionToken,
  revokeSessionToken,
  isAuthRateLimited,
  recordAuthFailure,
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
