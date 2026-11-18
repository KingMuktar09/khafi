/**
 * Supabase project used to store topic requests, questions and
 * comments (table `topic_requests`).
 *
 * The project URL and anon key come from VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY when they are set (Vercel env vars). The
 * fallback values below are the same public values, so the boxes
 * also work on hosts without env vars (Cloudflare Pages builds the
 * site with no env vars set). The anon key is public by design: it
 * is safe to ship in client code, and the table is guarded by Row
 * Level Security — anon may insert new rows, and anon may read only
 * rows with status = 'approved'. The service_role key is never used
 * here, and must never be put in client code.
 *
 * Table `topic_requests` columns (project "ilmeghayb", Singapore):
 *   id, instagram_name (not null), kind (comment | request | question),
 *   topic, message (not null), created_at, status (default 'new').
 * Anonymous posts store instagram_name = 'Anonymous' and are shown
 * that way. New rows are status 'new' until approved in the dashboard.
 */
const FALLBACK_SUPABASE_URL = 'https://icbqkqvlonjzqokxljpg.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljYnFrcXZsb25qenFva3hsanBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMDEwNzYsImV4cCI6MjExMDU3NzA3Nn0.bE-RYsMSqAZ7NF86OuMGMU-tMEIVHCemYVQpHIbr3pw';

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? FALLBACK_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? FALLBACK_SUPABASE_ANON_KEY;

/** True when a URL and an anon key are available (env vars or fallback). */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
