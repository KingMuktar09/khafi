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
