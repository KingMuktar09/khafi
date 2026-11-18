// Build step: copy the repo-root vercel.json into dist/ so a Vercel Drop
// (drag-and-drop / prebuilt) deploy applies the SPA rewrites from it.
//
// Why: the Drop deploy uploads only the dist/ folder, and the root
// vercel.json never reaches Vercel. Without it, direct links to SPA
// routes (/shelf, /finder, /wafq, /amals, /journeys, /timeline, ...) return
// Vercel 404 NOT_FOUND — the pages only worked when reached by clicking
// inside the app. The vercel.json rewrite sends every non-file, non-API
// path to /index.html, so a pasted or refreshed deep link loads the app
// and the router opens the right view. Cloudflare Pages already handles
// this (wrangler.jsonc: not_found_handling single-page-application).
// Run at build time (npm run build), after vite build.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'vercel.json');
const dest = path.join(root, 'dist', 'vercel.json');

if (!existsSync(src)) {
  console.error('spa config: vercel.json not found at repo root');
  process.exit(1);
}
// Drop deploys upload only dist/, which has no api/ folder, so a vercel.json
// with "functions": {"api/index.ts": ...} makes Vercel fail with
// "[unused_function] The pattern api/index.ts doesn't match any Serverless
// Functions". Strip functions/crons and the /api rewrite for the Drop copy;
// the static app uses the embedded /catalog.json fallback instead.
const cfg = JSON.parse(readFileSync(src, 'utf8'));
delete cfg.functions;
delete cfg.crons;
cfg.rewrites = (cfg.rewrites || []).filter((r) => !(r.source || '').startsWith('/api/'));
writeFileSync(dest, JSON.stringify(cfg, null, 2));
console.log('spa config: vercel.json -> dist/vercel.json (SPA fallback, no api functions)');
