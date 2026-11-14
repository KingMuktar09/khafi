import type { IncomingMessage, ServerResponse } from "http";
import { app } from "../server/app";

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
