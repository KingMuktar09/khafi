// Build step: copy data/catalog.json to public/catalog.json so the frontend
// can still show all books when /api/catalog is down (e.g. a static-only
// Vercel Drop deploy with no serverless function). The copy is sanitised
// exactly like the server's non-admin catalog: paid books lose their open /
// download links (driveFileId, externalUrl, fileUrl, pdfUrl) and oversized
// inline covers are dropped. Today the catalog has 0 paid books, so nothing
// is stripped in practice; this guard matters if a book is marked paid later.
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
