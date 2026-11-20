import { describe, it, expect } from 'vitest';
import { createHmac, randomBytes } from 'node:crypto';
import { handleCloudflareApiRequest } from '../server/cf-api-handler';

const CHANNEL_URL = 'https://www.instagram.com/channel/ZKdxHLW9r2VpKow7/';
const ENV = {};

async function call(path: string, init?: RequestInit, env: any = ENV) {
  const res = await handleCloudflareApiRequest(
    new Request(`https://example.com${path}`, init),
    env
  );
  return { status: res.status, body: await res.json().catch(() => null) as any, headers: res.headers };
}

async function callRaw(path: string, init?: RequestInit, env: any = ENV) {
  return handleCloudflareApiRequest(new Request(`https://example.com${path}`, init), env);
}

// Admin env for the login/session tests. Distinct usernames per test
// keep the per-IP+username login buckets independent (all test
// requests share the "unknown" IP — no cf-connecting-ip header).
const ADMIN_ENV = {
  ADMIN_USERNAME: 'Khafi',
  ADMIN_PASSWORD: 'test-admin-password',
  SESSION_SECRET: 'test-session-secret-1234567890abcdef',
};

async function loginAdmin(env: any = ADMIN_ENV, username = 'Khafi', password = 'test-admin-password') {
  const { status, body, headers } = await call('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }, env);
  // H-7: the token is no longer in the login JSON (cookie-only auth).
  // Tests read it back from the Set-Cookie header.
  const setCookie = headers.get('set-cookie') || '';
  const token = (setCookie.match(/khafi_admin_session=([^;]+)/) || [])[1] || '';
  return { status, body, token };
}

describe('Cloudflare gate routes (pages.dev)', () => {
  it('GET /api/gate/status returns keySet false and the channel link, never the key', async () => {
    const { status, body } = await call('/api/gate/status');
    expect(status).toBe(200);
    expect(body.keySet).toBe(false);
    expect(body.channelUrl).toBe(CHANNEL_URL);
    expect(JSON.stringify(body)).not.toContain('gateKey');
  });

  it('POST /api/gate/unlock with no key set returns 404, same as Vercel', async () => {
    const { status, body } = await call('/api/gate/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'wrong' }),
    });
    expect(status).toBe(404);
    expect(body.error).toBe('Gate key is not set.');
  });

  it('POST /api/gate/unlock with an empty body returns 404, same as Vercel', async () => {
    const { status } = await call('/api/gate/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(status).toBe(404);
  });

  it('GET /api/admin/gate-settings without an admin session returns 401', async () => {
    const { status } = await call('/api/admin/gate-settings');
    expect(status).toBe(401);
  });

  it('POST /api/admin/gate-settings without an admin session returns 401', async () => {
    const { status } = await call('/api/admin/gate-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelUrl: CHANNEL_URL }),
    });
    expect(status).toBe(401);
  });
});

describe('Cloudflare CORS + security headers (M-1 / M-3)', () => {
  it('sets ACAO only for an allowlisted origin, never *', async () => {
    const good = await callRaw('/api/catalog', { headers: { Origin: 'https://ilmeghayb.vercel.app' } });
    expect(good.headers.get('access-control-allow-origin')).toBe('https://ilmeghayb.vercel.app');
    expect(good.headers.get('vary')).toMatch(/Origin/);

    const evil = await callRaw('/api/catalog', { headers: { Origin: 'https://evil.example.com' } });
    expect(evil.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('sends CSP + HSTS on API responses', async () => {
    const res = await callRaw('/api/health');
    expect(res.headers.get('content-security-policy') || '').toContain("script-src 'self'");
    expect(res.headers.get('strict-transport-security') || '').toContain('max-age=31536000');
  });

  it('rejects a cross-origin POST to an admin route with 403, before auth', async () => {
    const { status } = await call('/api/admin/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example.com' },
      body: JSON.stringify({ title: 'x' }),
    });
    expect(status).toBe(403);
  });
});

describe('Cloudflare stream guard (H-2)', () => {
  it('a fake uncatalogued Drive ID without admin returns 404, not a proxy', async () => {
    const fakeId = '1aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567';
    const { status, body } = await call(`/api/files/${fakeId}/preview`);
    expect(status).toBe(404);
    expect(body.error).toBe('File not found.');
  });
});

describe('Cloudflare admin sessions (H-3 / L-5)', () => {
  it('login works case-insensitively, sets a 24h cookie, and me/logout round-trips', async () => {
    const { status, body, headers } = await call('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'khafi', password: 'test-admin-password' }),
    }, ADMIN_ENV);
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(headers.get('set-cookie') || '').toMatch(/Max-Age=86400/);
    // H-7: the token is no longer in the login JSON (cookie-only auth).
    // Tests read it back from the Set-Cookie header.
    const setCookie = headers.get('set-cookie') || '';
    const token = (setCookie.match(/khafi_admin_session=([^;]+)/) || [])[1] || '';
    expect(token.split('.')).toHaveLength(3); // random.exp.hmac

    const me = await call('/api/admin/me', { headers: { 'x-admin-token': token } }, ADMIN_ENV);
    expect(me.body.authenticated).toBe(true);

    // Admin catalog is never shared-cached (M-2).
    const catalog = await callRaw('/api/catalog', { headers: { 'x-admin-token': token } }, ADMIN_ENV);
    expect(catalog.headers.get('cache-control')).toBe('no-store');

    const out = await call('/api/admin/logout', {
      method: 'POST',
      headers: { 'x-admin-token': token },
    }, ADMIN_ENV);
    expect(out.status).toBe(200);
    const meAfter = await call('/api/admin/me', { headers: { 'x-admin-token': token } }, ADMIN_ENV);
    expect(meAfter.body.authenticated).toBe(false);
  });

  it('rejects expired tokens and old 2-part tokens', async () => {
    const secret = ADMIN_ENV.SESSION_SECRET;
    const random = randomBytes(32).toString('hex');
    const expired = Date.now() - 60_000;
    const sig = createHmac('sha256', secret).update(`${random}.${expired}`).digest('hex');
    const expiredToken = `${random}.${expired}.${sig}`;
    const me = await call('/api/admin/me', { headers: { 'x-admin-token': expiredToken } }, ADMIN_ENV);
    expect(me.body.authenticated).toBe(false);

    const oldSig = createHmac('sha256', secret).update(random).digest('hex');
    const oldToken = `${random}.${oldSig}`;
    const meOld = await call('/api/admin/me', { headers: { 'x-admin-token': oldToken } }, ADMIN_ENV);
    expect(meOld.body.authenticated).toBe(false);
  });
});

describe('Cloudflare login rate limit (H-1: 5 tries, then 429)', () => {
  it('blocks the 6th wrong login for one username', async () => {
    const env = { ...ADMIN_ENV, ADMIN_USERNAME: 'LockoutAdmin' };
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const { status } = await loginAdmin(env, 'LockoutAdmin', 'wrong-password');
      statuses.push(status);
    }
    expect(statuses.slice(0, 5)).toEqual([401, 401, 401, 401, 401]);
    expect(statuses[5]).toBe(429);
  });
});

describe('Cloudflare gate key (C-1 hash + H-5 limit, runs last: sets the key)', () => {
  it('refuses a short gate key, accepts a long one, then rate-limits wrong unlocks', async () => {
    const { status, token } = await loginAdmin();
    expect(status).toBe(200);
    const auth = { 'Content-Type': 'application/json', 'x-admin-token': token };

    const short = await call('/api/admin/gate-settings', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ gateKey: 'short' }),
    }, ADMIN_ENV);
    expect(short.status).toBe(400);

    const saved = await call('/api/admin/gate-settings', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ gateKey: 'correct horse battery staple' }),
    }, ADMIN_ENV);
    expect(saved.status).toBe(200);
    expect(saved.body.keySet).toBe(true);

    const statusRes = await call('/api/gate/status');
    expect(statusRes.body.keySet).toBe(true);

    // The right key still unlocks (hash verification works).
    const ok = await call('/api/gate/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'correct horse battery staple' }),
    });
    expect(ok.status).toBe(200);
    expect(ok.body.ok).toBe(true);

    // 10 wrong guesses -> 401, the 11th -> 429.
    const statuses: number[] = [];
    for (let i = 0; i < 11; i++) {
      const r = await call('/api/gate/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `wrong-guess-${i}` }),
      });
      statuses.push(r.status);
    }
    expect(statuses.slice(0, 10)).toEqual(Array(10).fill(401));
    expect(statuses[10]).toBe(429);
  }, 20000);
});
