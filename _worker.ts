import { handleCloudflareApiRequest } from "./server/cf-api-handler.js";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Intercept all /api/* requests with Cloudflare edge API handler
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleCloudflareApiRequest(request, env);
    }

    // 2. Serve static frontend assets (HTML, JS, CSS, images) via Cloudflare env.ASSETS
    if (env?.ASSETS && typeof env.ASSETS.fetch === "function") {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status !== 404) {
        return assetRes;
      }
      // SPA Fallback: for client-side routing, serve index.html if request is for HTML navigation
      if (request.method === "GET" && !url.pathname.includes(".")) {
        const indexRequest = new Request(new URL("/index.html", request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      return assetRes;
    }

    return new Response("Not Found", { status: 404 });
  },

  // Daily auto-sync (wrangler.jsonc triggers.crons, 02:00 UTC). Runs only
  // when CRON_SECRET is set as a secret; the handler calls the worker's own
  // /api/cron/sync endpoint with that secret, so the sync logic and its
  // empty-result guard live in one place (server/cf-api-handler.ts).
  async scheduled(event: any, env: any, ctx: any): Promise<void> {
    const secret = (env?.CRON_SECRET || "").trim();
    if (!secret) {
      console.warn("[Cron] CRON_SECRET is not set; daily auto-sync is disabled.");
      return;
    }
    const req = new Request("https://worker.local/api/cron/sync", {
      headers: { Authorization: `Bearer ${secret}` },
    });
    await handleCloudflareApiRequest(req, env);
  },
};
