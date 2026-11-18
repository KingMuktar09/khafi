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

/** Approved comments for one topic, newest first. Empty when not configured. */
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
    return Array.isArray(rows) ? (rows as TopicRequestRow[]) : [];
  } catch {
    return [];
  }
}
