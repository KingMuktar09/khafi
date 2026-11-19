/**
 * Admin inbox for topic requests (comments, requests, questions) — the
 * server side of the bell + inbox + reply feature.
 *
 * Reads and writes go through the Supabase REST API with the SERVICE_ROLE
 * key. That key lives ONLY in the server environment
 * (SUPABASE_SERVICE_ROLE_KEY in Vercel) — it is never in client code,
 * never in this repo, and never written to a log. The anon key in the site
 * cannot update rows, so the server must do every write.
 *
 * This module is platform-neutral (no Node imports, only global fetch) so
 * both the Express server (server/app.ts) and the Cloudflare worker
 * (server/cf-api-handler.ts) use it. `fetchImpl` is injectable so unit
 * tests can pass a mock Supabase.
 */

export const SUPABASE_PROJECT_URL = 'https://icbqkqvlonjzqokxljpg.supabase.co';

/** Plain-English answer when the service key is not set up yet. */
export const SERVICE_KEY_MISSING_MESSAGE =
  'Replies are not set up yet — add the Supabase service key in Vercel';

export const MAX_REPLY_LENGTH = 2000;

export interface TopicRequestWithReply {
  id: number | string;
  instagram_name: string;
  kind: string;
  topic: string;
  message: string;
  created_at: string;
  status: string;
  /** The latest admin reply, or null when no reply has been sent yet. */
  reply: { id: number | string; reply: string; created_at: string } | null;
}

export interface SupabaseAdminConfig {
  url: string;
  serviceKey: string;
}

export interface TopicReplyRow {
  id: number | string;
  request_id: number | string;
  reply: string;
  created_at: string;
}

/** Error from a Supabase call. `status` is the HTTP status from Supabase. */
export class SupabaseAdminError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'SupabaseAdminError';
    this.status = status;
  }
}

type FetchFn = (
  url: string,
  init?: Record<string, unknown>
) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

/**
 * Read the server-side Supabase config. Returns null when the service key
 * is missing — the caller answers 503 with SERVICE_KEY_MISSING_MESSAGE.
 * `env` defaults to process.env on Node; the Cloudflare worker passes its
 * own env object. The key value is never logged or put in an error.
 */
export function getSupabaseAdminConfig(
  env: Record<string, string | undefined> = (typeof process !== 'undefined'
    ? (process as unknown as { env: Record<string, string | undefined> }).env
    : {}) as Record<string, string | undefined>
): SupabaseAdminConfig | null {
  const url = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || SUPABASE_PROJECT_URL).trim();
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!serviceKey) return null;
  return { url, serviceKey };
}

function supabaseAdminHeaders(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };
}

async function readJson(res: { ok: boolean; status: number; json: () => Promise<unknown> }): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function toArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

/**
 * Attach replies to their requests. When a request has more than one
 * reply, the latest one wins. Pure function — used by the list call and
 * by the unit tests.
 */
export function attachReplies(
  requests: Record<string, unknown>[],
  replies: TopicReplyRow[]
): TopicRequestWithReply[] {
  const latestByRequest = new Map<string, TopicReplyRow>();
  for (const reply of replies) {
    const key = String(reply.request_id);
    const prev = latestByRequest.get(key);
    if (!prev || String(reply.created_at) >= String(prev.created_at)) {
      latestByRequest.set(key, reply);
    }
  }
  return requests.map((row) => {
    const reply = latestByRequest.get(String(row.id));
    return {
      id: row.id as number | string,
      instagram_name: typeof row.instagram_name === 'string' ? row.instagram_name : '',
      kind: typeof row.kind === 'string' ? row.kind : '',
      topic: typeof row.topic === 'string' ? row.topic : '',
      message: typeof row.message === 'string' ? row.message : '',
      created_at: typeof row.created_at === 'string' ? row.created_at : '',
      status: typeof row.status === 'string' ? row.status : 'new',
      reply: reply
        ? { id: reply.id, reply: reply.reply, created_at: reply.created_at }
        : null,
    };
  });
}

/** How many inbox items are still new (unapproved). Pure function. */
export function countUnread(items: { status: string }[]): number {
  return items.filter((item) => item.status === 'new').length;
}

/**
 * List every topic request, newest first, each with its latest admin
 * reply (or null). Throws SupabaseAdminError when Supabase answers badly.
 */
export async function listTopicRequestsWithReplies(
  fetchImpl: FetchFn,
  config: SupabaseAdminConfig
): Promise<TopicRequestWithReply[]> {
  const headers = supabaseAdminHeaders(config.serviceKey);
  const requestsRes = await fetchImpl(
    `${config.url}/rest/v1/topic_requests?select=id,instagram_name,kind,topic,message,created_at,status&order=created_at.desc&limit=200`,
    { headers }
  );
  if (!requestsRes.ok) {
    throw new SupabaseAdminError('Could not load messages from Supabase.', requestsRes.status);
  }
  const requests = toArray(await readJson(requestsRes));
  const repliesRes = await fetchImpl(
    `${config.url}/rest/v1/topic_replies?select=id,request_id,reply,created_at&order=created_at.asc&limit=500`,
    { headers }
  );
  if (!repliesRes.ok) {
    throw new SupabaseAdminError('Could not load replies from Supabase.', repliesRes.status);
  }
  const replies = toArray(await readJson(repliesRes)) as unknown as TopicReplyRow[];
  return attachReplies(requests, replies);
}

/**
 * Approve one request (status 'new' -> 'approved'). Approved comments
 * show on the public Topics pages. Returns { found: false } when no row
 * with that id exists.
 */
export async function approveTopicRequest(
  fetchImpl: FetchFn,
  config: SupabaseAdminConfig,
  id: string | number
): Promise<{ found: boolean }> {
  const res = await fetchImpl(
    `${config.url}/rest/v1/topic_requests?id=eq.${encodeURIComponent(String(id))}`,
    {
      method: 'PATCH',
      headers: { ...supabaseAdminHeaders(config.serviceKey), Prefer: 'return=representation' },
      body: JSON.stringify({ status: 'approved' }),
    }
  );
  if (!res.ok) {
    throw new SupabaseAdminError('Could not approve this message.', res.status);
  }
  return { found: toArray(await readJson(res)).length > 0 };
}

/**
 * Save one admin reply for a request. Returns { ok, error?, reply? } —
 * never throws for a bad reply text or a missing request, so the route
 * can answer 400 / 404 in plain words. Supabase failures throw.
 */
export async function insertTopicReply(
  fetchImpl: FetchFn,
  config: SupabaseAdminConfig,
  requestId: string | number,
  replyText: string
): Promise<{ ok: boolean; error?: string; reply?: TopicReplyRow }> {
  const reply = replyText.trim();
  if (!reply) return { ok: false, error: 'Write a reply first.' };
  if (reply.length > MAX_REPLY_LENGTH) {
    return { ok: false, error: `Reply is too long — keep it under ${MAX_REPLY_LENGTH} characters.` };
  }
  const headers = supabaseAdminHeaders(config.serviceKey);
  // The request must exist first: a reply to a missing id would fail on
  // the foreign key, and a plain "not found" is clearer than that error.
  const checkRes = await fetchImpl(
    `${config.url}/rest/v1/topic_requests?select=id&id=eq.${encodeURIComponent(String(requestId))}`,
    { headers }
  );
  if (!checkRes.ok) {
    throw new SupabaseAdminError('Could not load messages from Supabase.', checkRes.status);
  }
  if (toArray(await readJson(checkRes)).length === 0) {
    return { ok: false, error: 'Message not found.' };
  }
  const res = await fetchImpl(`${config.url}/rest/v1/topic_replies`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ request_id: Number(requestId), reply }),
  });
  if (!res.ok) {
    throw new SupabaseAdminError('Could not save the reply.', res.status);
  }
  const rows = toArray(await readJson(res)) as unknown as TopicReplyRow[];
  const saved = rows[0];
  if (!saved) return { ok: false, error: 'Could not save the reply.' };
  return { ok: true, reply: saved };
}
