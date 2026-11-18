// Build step: copy data/catalog.json to public/catalog.json so the frontend
// can still show all books when /api/catalog is down (e.g. a static-only
// Vercel Drop deploy with no serverless function). The copy is sanitised
// exactly like the server's locked-visitor catalog: paid books lose their
// open / download links (driveFileId, externalUrl, fileUrl, pdfUrl) and
// oversized inline covers are dropped. The static copy is ALWAYS the
// fully-stripped version — it can never tell whether a visitor unlocked
// the gate, so an unlocked follower on this fallback sees paid books
// without links and the book page says so honestly with a retry; the
// client never "fixes up" links from the static file.
// Run at build time (npm run build) and committed as public/catalog.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'data', 'catalog.json');
const dest = path.join(root, 'public', 'catalog.json');

const catalog = JSON.parse(readFileSync(src, 'utf8'));
const books = (catalog.books || []).map((book) => {
  const { driveUrl, webViewLink, webContentLink, ...rest } = book;
  if (rest.isPaid) {
    const { driveFileId, externalUrl, fileUrl, pdfUrl, ...paidRest } = rest;
    return { ...paidRest, fileUrl: '', pdfUrl: '' };
  }
  if (typeof rest.coverUrl === 'string' && rest.coverUrl.startsWith('data:') && rest.coverUrl.length > 24576) {
    rest.coverUrl = '';
  }
  return rest;
});
const out = { ...catalog, books };
writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log(`catalog: ${books.length} books, ${(catalog.folders || []).length} folders -> public/catalog.json (${books.filter((b) => b.isPaid).length} paid, links stripped)`);
