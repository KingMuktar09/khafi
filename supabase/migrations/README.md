# Supabase migrations — Ilm-e-Ghayb Library

## What lives here

- `001_topic_replies.sql` — table `public.topic_replies` for admin replies
  to visitor comments, requests and questions. Run it once (steps below).
- `002_topic_requests_policies.sql` — table `public.topic_requests` plus
  its Row Level Security policies (anon insert only, anon read only
  approved rows), and the fixed replies policy (a reply is readable
  only when its request is approved). Run it once in the dashboard SQL
  Editor, same way as 001: paste the whole file and press **Run**, then
  check in Table Editor that `topic_requests` still lists, and that an
  unapproved row is not readable with the anon key. Until 002 is run,
  the unapproved-row protection lives only in the dashboard policies
  set by hand, not in this repo.

## Step 1 — Run the migration (dashboard, one time)

1. Open the Supabase dashboard for project **ilmeghayb**:
   https://supabase.com/dashboard/project/icbqkqvlonjzqokxljpg
2. Left menu > **SQL Editor** > **New query**.
3. Paste the whole contents of `001_topic_replies.sql` and press **Run**.
4. Check it worked: left menu > **Table Editor** — `topic_replies` should
   now be listed next to `topic_requests`.

## Step 2 — Add the service key in Vercel (dashboard, one time)

The admin inbox reads and writes through the server, with the
**service_role** key. The anon key in the site code cannot update rows,
so without this step the inbox answers 503 "Replies are not set up yet".

1. In Supabase: **Settings > API** — copy the **service_role** key
   (the long secret one, NOT the anon key).
2. In Vercel: project **ilmeghayb** > **Settings > Environment
   Variables** — add `SUPABASE_SERVICE_ROLE_KEY` with that value,
   scope **Production**, then **redeploy**.
3. The service_role key is never written into this repo, the site code,
   tests or logs. If it ever leaks, roll it from Supabase Settings > API.

## Step 3 — Use the inbox

Sign in to the admin panel on the site. The bell in the header shows how
many new (unapproved) messages there are. The **Messages from visitors**
section lists each one on its own: name, type, topic, message, date,
status, your reply if you sent one, an **Approve** button, a reply box,
and a **DM on Instagram** link when the visitor gave a name.

Approving a comment makes it show on the public Topics pages, with your
reply under it. New messages stay hidden from the public site until you
approve them.
