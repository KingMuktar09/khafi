# Cloudflare for Ilm-e-Ghayb Library

The site lives on Vercel at https://ilmeghayb.vercel.app/. Cloudflare is a
**second, free home** for the same site, not a move. Nothing about Vercel
changes unless the owner decides to switch.

## What Cloudflare adds (free plan)

- A global edge copy of the site at `https://ilmeghayb.<your-subdomain>.workers.dev`
- The same API the Vercel site has: catalog, library-status, payment
  settings, admin login, Drive file reading, admin add/edit/delete,
  Sync now (`POST /api/admin/sync`) and a daily auto-sync (02:00 UTC).
- Free: Workers free tier covers 100,000 requests a day, static assets,
  and one daily cron trigger. No custom domain is needed for the
  `workers.dev` URL. A custom domain is only needed if you want the
  Cloudflare copy on your own domain name, which is a separate step.

## How it is set up in this repo

- `wrangler.jsonc` — the deploy config. Worker name `ilmeghayb`, static
  assets from `dist/`, the worker entry `dist/_worker.js`, daily cron.
- `_worker.ts` — the Worker entry: `/api/*` goes to the edge API handler,
  everything else is served as static files, with an SPA fallback.
  It also runs the daily auto-sync on its cron trigger.
- `server/cf-api-handler.ts` — the full edge API (same features as the
  Vercel Express app). It serves the bundled saved catalog
  (`data/catalog.json`, 36 folders, 173 books) when Drive is not
  configured, and live Drive data when it is.
- `server/cf-drive.ts` — the Drive client for Workers.
- `functions/` — Cloudflare Pages Functions that call the same handler.
  They are only used by a Pages deploy; the supported path is
  `wrangler deploy` (Workers), which ignores them.

## Deploy it (free Cloudflare account)

1. `npm run build`
2. `npx wrangler login` (opens Cloudflare in the browser, free account)
3. `npx wrangler deploy`
4. Open the `workers.dev` URL it prints and check the library loads.

## Secrets (never in code or in this repo)

Set them in the Cloudflare dashboard (Workers & Pages > ilmeghayb >
Settings > Variables) or with `npx wrangler secret put NAME`:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` — admin login. Without them,
  admin login is impossible by design (there is no default password).
- `SESSION_SECRET` — any long random value; it signs admin sessions.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
  — needed only for live Drive sync and in-app Drive reading. Share the
  "All Islamic History Books" Drive folder with that service account as
  Viewer. Without them the worker serves the bundled catalog and books
  open in Google Drive.
- `GOOGLE_DRIVE_FOLDER_ID` — leave unset to use the "All Islamic History
  Books" folder.
- `CRON_SECRET` — any long random value; needed for the daily auto-sync.

## Honest limits

- Admin edits on a Worker live only in that isolate's memory and do not
  survive a redeploy. The durable copies are the repo files
  (`data/catalog.json`, `data/payment-settings.json`) and the `catalog.json`
  copy the sync writes into the Drive folder.
- The daily cron runs only after a deploy, and only when `CRON_SECRET`
  is set.
- Vercel stays the main live site until the owner says otherwise.
