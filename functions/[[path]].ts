import { handleCloudflareApiRequest } from "../server/cf-api-handler";

export interface EventContext<Env = any> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  data: Record<string, any>;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
}

export type PagesFunction<Env = any> = (context: EventContext<Env>) => Promise<Response> | Response;

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    return handleCloudflareApiRequest(context.request, context.env);
  }
  return context.next();
};
