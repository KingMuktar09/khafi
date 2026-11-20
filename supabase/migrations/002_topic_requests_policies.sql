-- Topic requests, comments and questions (table public.topic_requests).
--
-- RUN THIS ONCE in the Supabase dashboard (after 001_topic_replies.sql):
--   1. Open https://supabase.com/dashboard/project/icbqkqvlonjzqokxljpg
--   2. Left menu > SQL Editor > New query
--   3. Paste this whole file > Run
--
-- What it does (audit fixes F1 and F9):
--   - Makes sure the table exists with the shape the site expects:
--     kind is only 'comment' | 'request' | 'question', status defaults
--     to 'new', so a direct API caller cannot insert a row that is
--     already approved or of an unknown kind.
--   - Turns on Row Level Security and writes the policies down, so
--     they live in the repo instead of only in the dashboard:
--       anon INSERT only, and only with status 'new' (or no status,
--         so the default applies). No anon UPDATE / DELETE at all.
--       anon SELECT only where status = 'approved'. Unapproved rows
--         are invisible to the anon key, even when the caller skips
--         the status filter the site normally sends.
--   - Fixes the replies policy from 001 (which was using (true)):
--     anon may read a reply only when its request is approved, so a
--     reply to a not-yet-approved comment is not readable via the
--     direct API.
--
-- Verify after running (unauthenticated, with the anon key):
--   - A row with status = 'new' must NOT come back from a plain
--     select on topic_requests.
--   - An insert with status = 'approved' must be rejected.
--   - A reply whose request is still 'new' must NOT come back from
--     a plain select on topic_replies.

create table if not exists public.topic_requests (
  id bigint generated always as identity primary key,
  instagram_name text not null,
  kind text not null check (kind in ('comment', 'request', 'question')),
  topic text not null,
  message text not null,
  created_at timestamptz not null default now(),
  status text not null default 'new'
);

-- If the table already existed, make sure the default and the kind
-- check are in place anyway (both statements are safe to re-run).
alter table public.topic_requests alter column status set default 'new';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'topic_requests_kind_check'
      and conrelid = 'public.topic_requests'::regclass
  ) then
    alter table public.topic_requests
      add constraint topic_requests_kind_check
      check (kind in ('comment', 'request', 'question'));
  end if;
end $$;

alter table public.topic_requests enable row level security;

-- Anon may insert new rows only. The with check stops a direct API
-- caller from inserting status = 'approved' (or any other status) and
-- skipping moderation; omitting status lets the 'new' default apply.
drop policy if exists "Anyone can insert requests" on public.topic_requests;
create policy "Anyone can insert requests"
  on public.topic_requests
  for insert
  to anon
  with check (status = 'new');

-- Anon may read only approved rows. There is deliberately no anon
-- UPDATE or DELETE policy: without one, RLS denies those outright.
drop policy if exists "Anyone can view approved requests" on public.topic_requests;
create policy "Anyone can view approved requests"
  on public.topic_requests
  for select
  to anon
  using (status = 'approved');

grant select, insert on public.topic_requests to anon;

-- F9: replies are readable only when their request is approved.
-- This replaces the using (true) policy from 001_topic_replies.sql.
-- (No anon insert / update / delete policies on purpose: only the
-- server writes replies, with the service_role key.)
drop policy if exists "Anyone can view replies" on public.topic_replies;
create policy "Anyone can view replies"
  on public.topic_replies
  for select
  to anon
  using (
    exists (
      select 1 from public.topic_requests r
      where r.id = topic_replies.request_id
        and r.status = 'approved'
    )
  );
