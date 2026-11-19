import { describe, it, expect, vi } from 'vitest';
import {
  getSupabaseAdminConfig,
  listTopicRequestsWithReplies,
  approveTopicRequest,
  insertTopicReply,
  attachReplies,
  countUnread,
  SUPABASE_PROJECT_URL,
  SERVICE_KEY_MISSING_MESSAGE,
  SupabaseAdminError,
  type SupabaseAdminConfig,
} from '../server/topicInbox';

// Admin inbox (bell + replies): Supabase calls behind the service key.
// The fetch implementation is injected, so no real Supabase is touched.

const CONFIG: SupabaseAdminConfig = { url: SUPABASE_PROJECT_URL, serviceKey: 'service-key-for-tests' };

type MockResponse = { ok: boolean; status: number; body: unknown };

function mockFetch(handler: (url: string, init?: Record<string, unknown>) => MockResponse | null) {
  const calls: { url: string; init?: Record<string, unknown> }[] = [];
  const fn = vi.fn(async (url: string, init?: Record<string, unknown>) => {
    calls.push({ url, init });
    const res = handler(url, init);
    if (!res) throw new Error(`Unexpected fetch: ${url}`);
    return { ok: res.ok, status: res.status, json: async () => res.body };
  });
  return { fetch: fn, calls };
}

const REQUESTS = [
  { id: 2, instagram_name: 'someone', kind: 'question', topic: 'general', message: 'Hello', created_at: '2026-11-18T17:41:03Z', status: 'new' },
  { id: 1, instagram_name: 'Anonymous', kind: 'comment', topic: 'ibn-arabi-40-day-retreat', message: 'Hello', created_at: '2026-11-18T13:47:19Z', status: 'new' },
];

const REPLIES = [
  { id: 10, request_id: 2, reply: 'First reply', created_at: '2026-11-18T18:00:00Z' },
  { id: 11, request_id: 2, reply: 'Latest reply', created_at: '2026-11-18T19:00:00Z' },
];

function listHandler() {
  return mockFetch((url) => {
    if (url.includes('/topic_requests')) return { ok: true, status: 200, body: REQUESTS };
    if (url.includes('/topic_replies')) return { ok: true, status: 200, body: REPLIES };
    return null;
  });
}

describe('getSupabaseAdminConfig', () => {
  it('returns null without the service key — the route then answers 503', () => {
    expect(getSupabaseAdminConfig({})).toBeNull();
    expect(getSupabaseAdminConfig({ SUPABASE_SERVICE_ROLE_KEY: '   ' })).toBeNull();
  });

  it('returns the project URL by default and honours SUPABASE_URL', () => {
    const cfg = getSupabaseAdminConfig({ SUPABASE_SERVICE_ROLE_KEY: 'k' });
    expect(cfg?.url).toBe(SUPABASE_PROJECT_URL);
    const custom = getSupabaseAdminConfig({ SUPABASE_SERVICE_ROLE_KEY: 'k', SUPABASE_URL: 'https://example.supabase.co' });
    expect(custom?.url).toBe('https://example.supabase.co');
  });

  it('names the missing-key message in plain words', () => {
    expect(SERVICE_KEY_MISSING_MESSAGE).toContain('Supabase service key');
  });
});

describe('listTopicRequestsWithReplies', () => {
  it('lists requests newest first with the latest reply attached', async () => {
    const { fetch } = listHandler();
    const items = await listTopicRequestsWithReplies(fetch as never, CONFIG);
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe(2);
    expect(items[0].reply?.reply).toBe('Latest reply');
    expect(items[1].reply).toBeNull();
  });

  it('sends the service key as apikey + Bearer, never in the URL', async () => {
    const { fetch, calls } = listHandler();
    await listTopicRequestsWithReplies(fetch as never, CONFIG);
    expect(calls.length).toBe(2);
    for (const call of calls) {
      expect(call.url).not.toContain('service-key-for-tests');
      const headers = call.init?.headers as Record<string, string>;
      expect(headers.apikey).toBe('service-key-for-tests');
      expect(headers.Authorization).toBe('Bearer service-key-for-tests');
    }
  });

  it('throws a SupabaseAdminError when Supabase answers badly', async () => {
    const { fetch } = mockFetch(() => ({ ok: false, status: 500, body: { message: 'boom' } }));
    await expect(listTopicRequestsWithReplies(fetch as never, CONFIG)).rejects.toBeInstanceOf(SupabaseAdminError);
  });
});

describe('attachReplies', () => {
  it('latest reply wins when a request has more than one', () => {
    const items = attachReplies(REQUESTS as never, REPLIES);
    expect(items[0].reply?.reply).toBe('Latest reply');
    expect(items[1].reply).toBeNull();
  });
});

describe('countUnread', () => {
  it('counts only status new — the bell badge number', () => {
    expect(countUnread([{ status: 'new' }, { status: 'approved' }, { status: 'new' }])).toBe(2);
    expect(countUnread([])).toBe(0);
  });
});

describe('approveTopicRequest', () => {
  it('PATCHes status approved and reports found', async () => {
    const { fetch, calls } = mockFetch((url, init) => {
      expect(url).toContain('id=eq.2');
      expect((init?.method as string) || 'GET').toBe('PATCH');
      expect(JSON.parse(String(init?.body))).toEqual({ status: 'approved' });
      return { ok: true, status: 200, body: [{ id: 2, status: 'approved' }] };
    });
    const result = await approveTopicRequest(fetch as never, CONFIG, 2);
    expect(result).toEqual({ found: true });
    expect(calls).toHaveLength(1);
  });

  it('reports not found when no row matches the id', async () => {
    const { fetch } = mockFetch(() => ({ ok: true, status: 200, body: [] }));
    const result = await approveTopicRequest(fetch as never, CONFIG, 999);
    expect(result).toEqual({ found: false });
  });
});

describe('insertTopicReply', () => {
  it('refuses an empty reply without touching Supabase', async () => {
    const { fetch, calls } = mockFetch(() => ({ ok: true, status: 200, body: [] }));
    const result = await insertTopicReply(fetch as never, CONFIG, 2, '   ');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Write a reply/);
    expect(calls).toHaveLength(0);
  });

  it('refuses a reply over the length limit', async () => {
    const { fetch } = mockFetch(() => ({ ok: true, status: 200, body: [] }));
    const result = await insertTopicReply(fetch as never, CONFIG, 2, 'x'.repeat(2001));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/too long/);
  });

  it('reports not found when the request id does not exist', async () => {
    const { fetch } = mockFetch((url) => {
      if (url.includes('/topic_requests')) return { ok: true, status: 200, body: [] };
      return { ok: true, status: 200, body: [] };
    });
    const result = await insertTopicReply(fetch as never, CONFIG, 999, 'Hello');
    expect(result).toEqual({ ok: false, error: 'Message not found.' });
  });

  it('saves the reply and returns the saved row', async () => {
    const saved = { id: 20, request_id: 2, reply: 'Walaikum salaam', created_at: '2026-11-19T05:00:00Z' };
    const { fetch, calls } = mockFetch((url, init) => {
      if (url.includes('/topic_requests')) return { ok: true, status: 200, body: [{ id: 2 }] };
      if (url.includes('/topic_replies')) {
        expect(init?.method).toBe('POST');
        expect(JSON.parse(String(init?.body))).toEqual({ request_id: 2, reply: 'Walaikum salaam' });
        return { ok: true, status: 201, body: [saved] };
      }
      return null;
    });
    const result = await insertTopicReply(fetch as never, CONFIG, 2, '  Walaikum salaam  ');
    expect(result.ok).toBe(true);
    expect(result.reply).toEqual(saved);
    expect(calls).toHaveLength(2);
  });
});
