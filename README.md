# KHAFI LIBRARY

**A Private Space for Ilm** — a self-hosted digital library for discovering, organizing, reading, and preserving knowledge. Built with a particular interest in Islamic knowledge: Quran, Sunnah, spirituality, history, and philosophy — but structured to hold any collection of books and documents.

> Some knowledge is everywhere.
> Some knowledge is hidden.
> This is a place to seek both.

## Features

**Library**
- Nested folders and subfolders with per-folder visibility and ordering
- Books and documents with rich metadata: author, description, tags, publisher, year, language, ISBN, edition, notes
- Favorites, reading-progress tracking, search, grid/list views, dark and light themes

**Reading**
- Built-in PDF reader (pdf.js) with zoom overlay
- Viewers for DOCX (mammoth), Office documents, plain text, images and other file types

**Uploads and import**
- Direct uploads plus chunked, resumable uploads for large files
- Import from a URL with redirect following, Content-Disposition filename detection, and SSRF protection (blocks private, loopback, link-local and reserved IP ranges, including IPv4-mapped IPv6)

**Storage**
- Google Drive backend (service account, Shared Drive support): files and `catalog.json` sync
- Works unconfigured for local development

**AI organizer (optional, server-side only)**
- Analyzes incoming files and proposes title, author, language, category, tags, filename and target folder
- Duplicate detection through embedding similarity
- Proposals are reviewed and approved/rejected from the admin dashboard — nothing is reorganized without approval
- Uses NVIDIA NIM: `meta/muse-glimmer-30b` for reasoning/classification and `nvidia/nemotron-3-embed-1b` for embeddings (two separate API keys)

**Admin**
- Password-protected admin area (env-configured credentials, session-cookie auth)
- Library stats dashboard, drive diagnostics, AI organizer review queue
- Quick rename/description, move, context actions per item

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion, pdf.js, lucide-react
- **Backend:** Express (Node), with twin serverless handlers for Cloudflare Workers (`_worker.ts`, `functions/`) and Vercel (`api/`)
- **Storage:** Google Drive API (service account)
- **AI:** NVIDIA NIM via the OpenAI-compatible API

## Getting started

```bash
npm install
cp .env.example .env   # fill in what you use; everything is optional for local dev
npm run dev            # Express + Vite dev server
```

Build and run the production server:

```bash
npm run build
npm start
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Express + Vite middleware) |
| `npm run build` | Build frontend, Node server bundle, and Cloudflare worker |
| `npm start` | Run the built Node server from `dist/` |
| `npm test` | Run the unit tests (vitest) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run clean` | Remove `dist/` |

## Configuration

All configuration is through environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `SESSION_SECRET` | Admin login and session signing |
| `GOOGLE_DRIVE_SHARED_DRIVE_ID` / `GOOGLE_DRIVE_FOLDER_ID` | Drive storage location |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Drive credentials |
| `NVIDIA_MUSE_API_KEY` / `NVIDIA_EMBEDDING_API_KEY` | AI organizer keys (reasoning vs embeddings) |
| `NVIDIA_API_BASE_URL` / `NVIDIA_MUSE_MODEL` / `NVIDIA_EMBEDDING_MODEL` | AI organizer endpoints/models |

Never commit a real `.env`. Keys and credentials are server-side only.

## Deployment

- **Node:** `npm run build && npm start` (any host with Node 20+)
- **Vercel:** `vercel.json` routes `/api/*` to the serverless handler in `api/`
- **Cloudflare Workers:** `wrangler.jsonc` serves `dist/` assets and `dist/_worker.js`

## Project structure

```
api/                 Vercel serverless entry
functions/           Cloudflare Pages Functions entry
server/              Express app, Drive integration, URL importer, AI organizer
  cf-*.ts            Cloudflare Workers twins of the API handlers
src/
  components/        UI, layout, books, folders, pdf, viewers, admin
  views/             Home, Library, Book details, Reader, Favorites, Info, Admin
  state/             Client app state
  services/          API client, pdf, storage
  utils/             File/type helpers
  config/            Site config, accent palettes
tests/               Vitest unit tests
```

## License

MIT — see [LICENSE](LICENSE).
