/**
 * Topic requests, questions and comments, stored in Supabase
 * (table `topic_requests`) when the project is configured, using
 * plain fetch against the Supabase REST API — no extra library.
 *
 * New rows go in with no status sent, so the table default applies
 * ('new'). They are NOT shown on the site. Only rows with status
 * 'approved' are listed, so nothing a visitor writes appears in
 * public until it is approved. The database enforces that too
 * (supabase/migrations/002_topic_requests_policies.sql): anon may
 * insert only, and may read only approved rows.
 *
 * When Supabase is not configured (no env keys yet), submit returns
 * stored: false and the caller falls back to copy + Instagram DM.
 * Reads return an empty list. Nothing throws.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from '../config/supabase';

export type TopicRequestKind = 'comment' | 'request' | 'question';

export interface TopicRequestInput {
  instagramName: string;
  kind: TopicRequestKind;
  /** Topic slug the note is about, or 'general' for hub and Questions page notes. */
  topic: string;
  message: string;
  /** True when the visitor ticked "Post as anonymous". */
  anonymous?: boolean;
}

export interface TopicRequestRow {
  id: number | string;
  instagram_name: string;
  kind: string;
  topic: string;
  message: string;
  created_at: string;
  status: string;
  /** The admin reply, when one has been sent. Null when there is none. */
  reply?: TopicReply | null;
}

/** One admin reply to a topic request, from table `topic_replies`. */
export interface TopicReply {
  id: number | string;
  request_id: number | string;
  reply: string;
  created_at: string;
}

/** A topic request with its latest admin reply attached (admin inbox). */
export interface TopicRequestWithReply extends TopicRequestRow {
  reply: TopicReply | null;
}

/** Limits enforced here AND on the form (never silently trim). */
export const MAX_TOPIC_MESSAGE_LENGTH = 2000;
export const MAX_INSTAGRAM_NAME_LENGTH = 30;
/** One submit per device per 30 seconds (spam control, F2). */
export const TOPIC_SUBMIT_COOLDOWN_MS = 30000;
const LAST_SUBMIT_KEY = 'ilmeghayb_last_topic_submit';

/** Names nobody may claim as a handle: they mean "no name given". */
export const RESERVED_INSTAGRAM_NAMES = ['anonymous', 'guest'] as const;

const HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${SUPABASE_ANON_KEY as string}`,
    'Content-Type': 'application/json',
  };
}

function readLastSubmitAt(): number {
  try {
    if (typeof localStorage === 'undefined') return 0;
    return Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

function markSubmittedNow(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/** True when the name is a real Instagram handle shape (F6, F11). */
export function isInstagramHandle(name: string): boolean {
  const handle = name.trim().replace(/^@/, '');
  if (!handle || RESERVED_INSTAGRAM_NAMES.includes(handle.toLowerCase() as 'anonymous' | 'guest')) return false;
  return HANDLE_RE.test(handle);
}

export interface SubmitTopicRequestResult {
  stored: boolean;
  /** HTTP status when the save was attempted (0 = no network). */
  status?: number;
  /** Plain-word reason when stored is false. */
  error?: string;
  /** True when Supabase is not set up at all (caller may offer the DM fallback). */
  notConfigured?: boolean;
  /** True when the 30-second per-device cooldown blocked the submit. */
  cooldown?: boolean;
}

/** Save one note. Returns stored: true only when Supabase kept it. */
export async function submitTopicRequest(input: TopicRequestInput): Promise<SubmitTopicRequestResult> {
  if (!isSupabaseConfigured()) {
    return { stored: false, notConfigured: true, error: 'Saving is not set up yet.' };
  }
  const message = input.message.trim();
  const rawName = input.instagramName.trim().replace(/^@/, '');
  // An anonymous post stores the literal name "Anonymous". A named post
  // may not claim that word (or "guest") as its handle (F6).
  const isAnonymousPost =
    input.anonymous === true || (input.anonymous === undefined && input.instagramName === 'Anonymous');
  if (message.length === 0) {
    return { stored: false, error: 'Write something first.' };
  }
  if (message.length > MAX_TOPIC_MESSAGE_LENGTH) {
    return { stored: false, error: `Your note is too long. Keep it under ${MAX_TOPIC_MESSAGE_LENGTH} characters.` };
  }
  if (!isAnonymousPost) {
    if (rawName.length === 0) {
      return { stored: false, error: 'Add your Instagram name, or post as anonymous.' };
    }
    if (rawName.length > MAX_INSTAGRAM_NAME_LENGTH) {
      return { stored: false, error: `That name is too long. Instagram names are at most ${MAX_INSTAGRAM_NAME_LENGTH} characters.` };
    }
    if (RESERVED_INSTAGRAM_NAMES.includes(rawName.toLowerCase() as 'anonymous' | 'guest')) {
      return { stored: false, error: 'That name is reserved. Use your Instagram name, or post as anonymous.' };
    }
  }
  if (!['comment', 'request', 'question'].includes(input.kind)) {
    return { stored: false, error: 'That kind of note is not known.' };
  }
  const lastSubmit = readLastSubmitAt();
  if (lastSubmit > 0 && Date.now() - lastSubmit < TOPIC_SUBMIT_COOLDOWN_MS) {
    return { stored: false, cooldown: true, error: 'Please wait a few seconds before sending another note.' };
  }
  markSubmittedNow();
  try {
    const res = await fetch(`${SUPABASE_URL as string}/rest/v1/topic_requests`, {
      method: 'POST',
      headers: { ...supabaseHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({
        instagram_name: isAnonymousPost ? 'Anonymous' : rawName,
        kind: input.kind,
        topic: input.topic,
        message,
      }),
    });
    if (!res.ok) {
      return { stored: false, status: res.status, error: `Could not save (HTTP ${res.status}). Check your connection and try again.` };
    }
    return { stored: true, status: res.status };
  } catch {
    return { stored: false, status: 0, error: 'Could not save. Check your connection and try again.' };
  }
}

/** Admin replies for a list of request ids, newest first. Empty when not configured. */
export async function fetchTopicReplies(requestIds: (number | string)[]): Promise<TopicReply[]> {
  if (!isSupabaseConfigured() || requestIds.length === 0) return [];
  try {
    const params = new URLSearchParams({
      select: 'id,request_id,reply,created_at',
      request_id: `in.(${requestIds.map((id) => String(id)).join(',')})`,
      order: 'created_at.desc',
      limit: '200',
    });
    const res = await fetch(`${SUPABASE_URL as string}/rest/v1/topic_replies?${params.toString()}`, {
      headers: supabaseHeaders(),
    });
    if (!res.ok) return [];
    const rows: unknown = await res.json();
    return Array.isArray(rows) ? (rows as TopicReply[]) : [];
  } catch {
    return [];
  }
}

export interface VisibleTopicRequestsPage {
  comments: TopicRequestRow[];
  /** Set when the list could not be loaded (caller keeps the last good list). */
  error?: string;
}

/** One page of approved comments for one topic, newest first, with the
 *  admin reply under each one when there is one. Empty + error when the
 *  list could not be loaded (F5 read path). */
export async function fetchVisibleTopicRequestsPage(
  topic: string,
  options: { limit?: number; offset?: number } = {},
): Promise<VisibleTopicRequestsPage> {
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;
  if (!isSupabaseConfigured()) return { comments: [] };
  try {
    const params = new URLSearchParams({
      select: 'id,instagram_name,kind,topic,message,created_at,status',
      topic: `eq.${topic}`,
      kind: 'eq.comment',
      status: 'eq.approved',
      order: 'created_at.desc',
      limit: String(limit),
      offset: String(offset),
    });
    const res = await fetch(`${SUPABASE_URL as string}/rest/v1/topic_requests?${params.toString()}`, {
      headers: supabaseHeaders(),
    });
    if (!res.ok) return { comments: [], error: `HTTP ${res.status}` };
    const rows: unknown = await res.json();
    const comments = Array.isArray(rows) ? (rows as TopicRequestRow[]) : [];
    if (comments.length === 0) return { comments: [] };
    // Latest reply per comment wins (replies come back newest first).
    const replies = await fetchTopicReplies(comments.map((c) => c.id));
    const latestByRequest = new Map<string, TopicReply>();
    for (const reply of replies) {
      const key = String(reply.request_id);
      if (!latestByRequest.has(key)) latestByRequest.set(key, reply);
    }
    return {
      comments: comments.map((comment) => ({
        ...comment,
        reply: latestByRequest.get(String(comment.id)) || null,
      })),
    };
  } catch {
    return { comments: [], error: 'network' };
  }
}

/** Approved comments for one topic, newest first, with the admin reply
 *  under each one when there is one. Empty when not configured or when
 *  the list could not be loaded (use fetchVisibleTopicRequestsPage
 *  when the caller needs to tell those apart). */
export async function fetchVisibleTopicRequests(topic: string): Promise<TopicRequestRow[]> {
  const page = await fetchVisibleTopicRequestsPage(topic, { limit: 50, offset: 0 });
  return page.comments;
}

/** A visitor name that can be messaged on Instagram. "Anonymous" and
 *  "Guest" are not real handles, and anything outside Instagram's own
 *  handle shape is never turned into a link. Pure helper. The link
 *  opens a DM thread (ig.me), not the public profile page (F11). */
export function instagramDmUrl(name: string): string | null {
  const handle = name.trim().replace(/^@/, '');
  if (!handle || handle.toLowerCase() === 'anonymous' || handle.toLowerCase() === 'guest') return null;
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;
  return `https://ig.me/m/${handle}`;
}

/** How many inbox items are still new (unapproved). Pure helper. */
export function countUnreadTopicRequests(items: { status: string }[]): number {
  return items.filter((item) => item.status === 'new').length;
}
