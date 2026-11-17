import type { IncomingMessage, ServerResponse } from "http";
// NOTE: the ".js" extension is required. Vercel compiles each .ts file to
// .js individually (no bundling) and Node's ESM loader refuses extensionless
// imports — "../server/app" throws ERR_MODULE_NOT_FOUND and 500s every
// /api/* endpoint (FUNCTION_INVOCATION_FAILED). tsx, esbuild and tsc all
// resolve "./x.js" back to "./x.ts", so local dev and build are unaffected.
import { app } from "../server/app.js";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.url) {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const subPath = urlObj.searchParams.get("__path");

      if (subPath !== null) {
        const cleanSub = subPath.startsWith("/") ? subPath.substring(1) : subPath;
        req.url = `/api/${cleanSub}`;
      } else if (req.url.startsWith("/api/index")) {
        const rewritten = req.url.replace(/^\/api\/index\/?/, "/api/");
        req.url = rewritten === "/api/" || rewritten === "/api" ? "/api/health" : rewritten;
      }
    } catch {
      if (req.url.startsWith("/api/index")) {
        const rewritten = req.url.replace(/^\/api\/index\/?/, "/api/");
        req.url = rewritten === "/api/" || rewritten === "/api" ? "/api/health" : rewritten;
      }
    }
  }

  return app(req as any, res as any);
}
