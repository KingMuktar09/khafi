import { describe, it, expect, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Maintenance mode (admin toggle) + SPA deep-link fallback.

// The router is a singleton that touches `window` on import, so the
// MaintenancePage is loaded with a dynamic import after stubbing window.
let MaintenancePage: any;
beforeAll(async () => {
  (globalThis as any).window = {
    location: { pathname: '/', search: '' },
    addEventListener: () => {},
  };
  ({ MaintenancePage } = await import('../src/components/ui/MaintenancePage'));
});

describe('MaintenancePage', () => {
  it('shows the admin message, Instagram link and admin sign-in', () => {
    const html = renderToStaticMarkup(
      React.createElement(MaintenancePage, { message: 'We are adding new books. Back soon.' })
    );
    expect(html).toContain('Under maintenance');
    expect(html).toContain('We are adding new books. Back soon.');
    expect(html).toContain('instagram.com/ghayb.chronicles');
    expect(html).toContain('Admin sign in');
    expect(html).not.toContain('All Books');
  });

  it('shows a default message when the admin wrote none', () => {
    const html = renderToStaticMarkup(React.createElement(MaintenancePage, { message: '' }));
    expect(html).toContain('Back soon');
  });
});

describe('Vercel SPA fallback (vercel.json in dist)', () => {
  const vercelJson = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'));
  const rewrite = (vercelJson.rewrites || []).find((r: any) => r.destination === '/index.html');
  expect(rewrite, 'vercel.json must have a rewrite to /index.html').toBeTruthy();

  // The rewrite source is a regex (without the leading/trailing slashes).
  const sourcePattern = rewrite.source as string;
  const re = new RegExp(`^${sourcePattern}$`);

  it('rewrites SPA deep links to index.html', () => {
    for (const path of ['/shelf', '/finder', '/wafq', '/amals', '/journeys', '/timeline', '/library', '/book', '/admin']) {
      expect(re.test(path), `${path} should rewrite to /index.html`).toBe(true);
    }
  });

  it('does NOT rewrite API, assets, uploads or real files', () => {
    for (const path of ['/api/catalog', '/api/book-keys/verify', '/assets/index-abc.js', '/uploads/manba.pdf', '/favicon.ico', '/logo.jpg', '/catalog.json']) {
      expect(re.test(path), `${path} must NOT rewrite to /index.html`).toBe(false);
    }
  });

  it('the build copies vercel.json into dist/', () => {
    const distVercel = readFileSync(join(process.cwd(), 'dist', 'vercel.json'), 'utf8');
    const distJson = JSON.parse(distVercel);
    expect(distJson.rewrites).toEqual(vercelJson.rewrites);
  });
});

describe('copy-spa-config build step', () => {
  it('exists and is wired into the build script', () => {
    const script = readFileSync(join(process.cwd(), 'scripts', 'copy-spa-config.mjs'), 'utf8');
    expect(script).toContain('vercel.json');
    expect(script).toContain('dist');
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts.build).toContain('copy-spa-config.mjs');
  });
});
