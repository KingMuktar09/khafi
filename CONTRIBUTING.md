# Contributing to Ilm-e-Ghayb Library

Thank you for helping. This is a small project. Keep changes small and simple.

## What this project is

A self-hosted digital library for discovering, organizing, reading, and preserving knowledge. It is built with React 19, TypeScript, Vite, Tailwind CSS, and an Express server. Books stay in Google Drive and open there. The live site is https://ilmeghayb.vercel.app/.

The library serves one collection only: the "All Islamic History Books" Google Drive folder (13 collections, 173 books at the last catalog build). Please do not link any other Drive folder.

## Run it locally

You need Node 20 or newer.

```bash
npm install
cp .env.example .env   # fill in only what you use; everything is optional for local dev
npm run dev            # Express + Vite dev server
```

Before you open a pull request, run:

```bash
npm run typecheck      # tsc --noEmit
npm test               # vitest
```

Both should pass. If a test fails, say so in the pull request. Do not hide a failing test.

## How to contribute

1. Fork the repo and make a branch with a short, clear name, for example `fix-search-case` or `add-dark-theme-toggle`.
2. Make one change per pull request. Do not mix a bug fix with a new feature.
3. Write a short description of what changed and how you tested it. See `.github/pull_request_template.md`.
4. Keep the style of the code around your change. Use simple English in comments and commit messages.

## Adding a book

Books are added by the admin, not by code changes:

- Add the book file to the "All Islamic History Books" Drive folder, or paste a Drive link in the admin area.
- Fill in the title, author, and folder. Add tags and a short description when you know them.
- Do not add a book you do not have the right to share.
- Do not mark a book Paid. Only the admin marks books Paid, and only with the admin's own approval. Paid books use a UPI checkout with no payment gateway and no automatic check. Never commit a UPI ID, QR code, or payment detail.

## Secrets

Never commit a real `.env` file, a password, a private key, or a service account key. Admin login and Drive access are set with environment variables only. See `.env.example` for the variable names.

## What we do not accept

- Changes that add a login wall, tracking, ads, or a payment gateway.
- Changes that link a different Drive folder or a different collection.
- Large rewrites with no issue or discussion first. Open an issue before a big change.
