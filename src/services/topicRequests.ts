/**
 * Topic requests, questions and comments, stored in Supabase
 * (table `topic_requests`) when the project is configured, using
 * plain fetch against the Supabase REST API — no extra library.
 *
 * New rows go in with no status sent, so the table default applies
 * ('new'). They are NOT shown on the site. Only rows with status
 * 'approved' are listed, so nothing a visitor writes appears in
 * public until it is approved.
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

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${SUPABASE_ANON_KEY as string}`,
    'Content-Type': 'application/json',
  };
}

/** Save one note. Returns stored: true only when Supabase kept it. */
export async function submitTopicRequest(input: TopicRequestInput): Promise<{ stored: boolean }> {
  if (!isSupabaseConfigured()) return { stored: false };
  try {
    const res = await fetch(`${SUPABASE_URL as string}/rest/v1/topic_requests`, {
      method: 'POST',
      headers: { ...supabaseHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({
        instagram_name: input.instagramName,
        kind: input.kind,
        topic: input.topic,
        message: input.message,
      }),
    });
    return { stored: res.ok };
  } catch {
    return { stored: false };
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

/** Approved comments for one topic, newest first, with the admin reply
 *  under each one when there is one. Empty when not configured. */
export async function fetchVisibleTopicRequests(topic: string): Promise<TopicRequestRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const params = new URLSearchParams({
      select: 'id,instagram_name,kind,topic,message,created_at,status',
      topic: `eq.${topic}`,
      kind: 'eq.comment',
      status: 'eq.approved',
      order: 'created_at.desc',
      limit: '50',
    });
    const res = await fetch(`${SUPABASE_URL as string}/rest/v1/topic_requests?${params.toString()}`, {
      headers: supabaseHeaders(),
    });
    if (!res.ok) return [];
    const rows: unknown = await res.json();
    const comments = Array.isArray(rows) ? (rows as TopicRequestRow[]) : [];
    if (comments.length === 0) return [];
    // Latest reply per comment wins (replies come back newest first).
    const replies = await fetchTopicReplies(comments.map((c) => c.id));
    const latestByRequest = new Map<string, TopicReply>();
    for (const reply of replies) {
      const key = String(reply.request_id);
      if (!latestByRequest.has(key)) latestByRequest.set(key, reply);
    }
    return comments.map((comment) => ({
      ...comment,
      reply: latestByRequest.get(String(comment.id)) || null,
    }));
  } catch {
    return [];
  }
}

/** A visitor name that can be messaged on Instagram. "Anonymous" and
 *  "Guest" are not real handles, and anything outside Instagram's own
 *  handle shape is never turned into a link. Pure helper. */
export function instagramDmUrl(name: string): string | null {
  const handle = name.trim().replace(/^@/, '');
  if (!handle || handle.toLowerCase() === 'anonymous' || handle.toLowerCase() === 'guest') return null;
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}`;
}

/** How many inbox items are still new (unapproved). Pure helper. */
export function countUnreadTopicRequests(items: { status: string }[]): number {
  return items.filter((item) => item.status === 'new').length;
}
