# Security Policy

## How to report a problem

If you find a security problem, please report it privately. Do not open a public issue with the details.

Use GitHub's private vulnerability reporting on this repo: go to the **Security** tab, then **Report a vulnerability**. If that is not available to you, open an issue titled "Security report - please contact me" with no details in it, and the maintainer will get in touch.

Please include, in the private report:

- What the problem is, in simple words.
- Where it is (file name, page, or API path).
- Steps to see it, if you can show them safely.
- What you think the impact is.

We will reply as soon as we can. Please give us time to fix it before you talk about it in public.

## Rules for this project

- Never commit a real `.env` file, a password, a private key, or a Google service account key.
- Admin login (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`) and Drive access are set with environment variables only.
- The admin area uses a httpOnly, Secure session cookie.
- Paid books are admin-only. Do not add payment details, UPI IDs, or QR codes in code or in pull requests.
- The URL importer blocks private, loopback, link-local, and reserved IP ranges. Do not try to work around that check.
- Do not test a suspected problem against the live site with real user data. Use a local copy (`npm run dev`) instead.

## Supported versions

Only the code on the `main` branch is supported. Older copies and forks are not patched here.

---

## Security model (how this site protects things)

Plain words, no jargon where it can be helped.

### What the server enforces (real boundaries)

- **Paid books.** A paid book's links and files are served only to the
  admin or to a visitor holding that book's own unlock. The raw key is
  typed once on the lock screen, checked by `POST /api/book-keys/verify`
  (with a per-browser device id, so one use is counted per device), and
  never stored or sent again. The server returns a short-lived unlock
  token; the browser stores only the token and sends it in the
  `x-book-unlock` header. The 100-use limit is counted on verify, per
  device. Old raw keys sent in headers are not accepted.
- **Admin area.** Admin login is checked server-side against the
  password in the `ADMIN_PASSWORD` env var (Vercel only). A successful
  login sets an httpOnly, Secure, SameSite=Lax session cookie; the
  token is never returned in JSON and never kept in `localStorage`.
  Admin calls send the cookie (`credentials: 'same-origin'`). Login
  attempts are rate-limited, and session tokens expire.
- **Rate limits.** Book-key checks, gate unlocks, and admin logins are
  all rate-limited per client IP (10 failures in 15 minutes is the
  shape; check the server code for the exact numbers).
- **Gate key.** The follow-gate key is stored as a hash, never in plain
  text, and is never committed to the repo. It must be at least 12
  characters. The key is checked server-side, never in the browser.
- **Comments.** Visitor comments, requests and questions go into
  Supabase table `topic_requests` with Row Level Security
  (`supabase/migrations/002_topic_requests_policies.sql`): anyone may
  insert, but only with status `new`; anyone may read only rows with
  status `approved`. There is no anon update or delete. Admin replies
  (table `topic_replies`) are readable only when their request is
  approved, and are written only through the server with the
  service-role key. The client also enforces a 2000-character message
  limit, a 30-character name limit, a 30-second cooldown between
  submits, and a honeypot field.
- **Uploads and file serving.** Only the listed document, image and
  book file types may be uploaded, and uploads are served as downloads,
  not as pages that run code. DOCX files are rendered through DOMPurify
  before they reach the page. JSON request bodies are capped at 1 MB.
- **Secrets.** No password, key, or token is hardcoded anywhere in
  code, tests, data, or logs. Env vars (`ADMIN_PASSWORD`,
  `SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_SYNC_TOKEN`,
  `CRON_SECRET`) are set in the Vercel/Cloudflare dashboards only.

### What is trust-based by design (not a bug)

- **The follow gate is social, not a lock.** It asks visitors to follow
  @ghayb.chronicles and enter the key the admin shares in the Instagram
  broadcast channel. It is not enforced on free books server-side: free
  books are public by design, and anyone can read them without the key.
  Only paid books and the admin area are real boundaries.
- **Free books' Drive links are public by design.** The library folder
  is shared anyone-with-link, and free books carry their Drive links in
  the public catalog. Restricting that needs a Drive sharing change
  (see "Still to do" below), not a code change.

### Fixes from the Nov 2026 security round

- Gate settings are never committed to GitHub, and the gate key is
  stored hashed, so setting a key with GitHub sync on cannot leak it.
- Admin login, gate unlock, and book-key verify are rate-limited, and
  the client IP is read correctly behind the Vercel proxy.
- Session tokens expire and logout revokes them.
- Raw book keys are no longer bearer credentials (unlock tokens
  instead, per device).
- Admin auth is cookie-only; nothing admin-related lives in
  `localStorage` any more.
- CORS is restricted to the two site origins, and state-changing admin
  calls check the origin.
- The admin catalog is never cached in a shared cache.
- CSP and HSTS headers are set. The admin password hash is a salted
  slow hash. Uploads have a type allowlist.
- DOCX HTML is sanitised with DOMPurify.
- The `topic_requests` RLS policies and the replies policy are now
  versioned in `supabase/migrations/002_topic_requests_policies.sql`.

### Still to do (the maintainer's own steps)

- **Set the gate key AFTER this lands**, in the admin panel: a phrase
  of 12 or more characters, not a single word. Never set it while an
  old build is live.
- **GITHUB_SYNC_TOKEN**: when adding it in Vercel, use a fine-grained
  personal access token with Contents read and write on this repo only.
  Treat it like a deploy key: anyone with it can push to `main`, and
  Vercel auto-deploys.
- **Verify `topic_requests` RLS in the Supabase dashboard** and run
  migration `002_topic_requests_policies.sql` in the SQL Editor (see
  `supabase/migrations/README.md`).
- **SUPABASE_SERVICE_ROLE_KEY + migration 001**: add the service-role
  key in Vercel (Production) and run `001_topic_replies.sql` in the
  dashboard SQL Editor, or the inbox stays in "not set up yet" state.
- **Rotate SESSION_SECRET** once after the token-format change lands,
  in Vercel and Cloudflare, to kill tokens issued under the old
  never-expiring scheme.
- **Drive sharing**: restrict the "All Islamic History Books" folder
  so free-book links are not anyone-with-link any more, and remove the
  folder id from the public `/api/library-status` response, once
  service-account-only access is in place.
