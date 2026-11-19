-- Admin replies to topic requests (comments, requests, questions).
--
-- RUN THIS ONCE in the Supabase dashboard:
--   1. Open https://supabase.com/dashboard/project/icbqkqvlonjzqokxljpg
--   2. Left menu > SQL Editor > New query
--   3. Paste this whole file > Run
--
-- What it does:
--   - Adds table public.topic_replies: one admin reply per row, linked to
--     the comment/request it answers. Deleting a request deletes its replies.
--   - Turns on Row Level Security. Everyone (anon key) can READ replies,
--     so the public site can show them under the comment. Nobody can
--     insert, update or delete through the anon key — writes go only
--     through the server, with the service_role key.
--
-- The service_role key itself is NEVER put in this repo or in the site.
-- Add it in Vercel only: project ilmeghayb > Settings > Environment
-- Variables > SUPABASE_SERVICE_ROLE_KEY = the service_role key from
-- Supabase dashboard > Settings > API. Then redeploy. Until then the
-- admin inbox answers 503 "Replies are not set up yet".

create table if not exists public.topic_replies (
  id bigint generated always as identity primary key,
  request_id bigint not null references public.topic_requests(id) on delete cascade,
  reply text not null,
  created_at timestamptz not null default now()
);

alter table public.topic_replies enable row level security;

-- Everyone can read replies (the site shows them under the comment).
-- No anon insert / update / delete policies on purpose: only the server
-- writes, with the service_role key.
drop policy if exists "Anyone can view replies" on public.topic_replies;
create policy "Anyone can view replies"
  on public.topic_replies
  for select
  to anon
  using (true);
