import { describe, it, expect } from 'vitest';
import { handleCloudflareApiRequest } from '../server/cf-api-handler';

const CHANNEL_URL = 'https://www.instagram.com/channel/ZKdxHLW9r2VpKow7/';
const ENV = {};

async function call(path: string, init?: RequestInit) {
  const res = await handleCloudflareApiRequest(
    new Request(`https://example.com${path}`, init),
    ENV
  );
  return { status: res.status, body: await res.json().catch(() => null) as any };
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
