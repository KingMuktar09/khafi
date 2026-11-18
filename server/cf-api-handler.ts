import {
  GoogleDriveConfig,
  isDriveConfigured,
  isValidPrivateKey,
  extractDriveFolderId,
  getGoogleDriveAccessToken,
  testDriveConnectionCf,
  syncCatalogWithDriveCf,
  fetchLiveDriveCatalogCf,
  createDriveFolderCf,
  renameDriveFolderCf,
  uploadBinaryToDriveCf,
  invalidateDriveCacheCf,
} from "./cf-drive";
// Bundled saved catalog (36 folders, 173 books: All Islamic History Books
// incl. Hidden Wisdoms + the Book of Wonders notes). The worker has no disk,
// so this is the catalog served when Drive is not configured — the same
// catalog-links mode as the Vercel deploy.
import bundledCatalog from "../data/catalog.json" with { type: "json" };
import bundledPaymentSettings from "../data/payment-settings.json" with { type: "json" };
import bundledGateSettings from "../data/gate-settings.json" with { type: "json" };
// Paid-book keys (hashes only — never plain keys) and site settings
// (maintenance mode), bundled at build time. The worker has no disk, so
// admin-generated keys and usage counts live only in this isolate's
// memory; the durable copy is data/book-keys.json in the repo, and the
// Vercel/Express totals are the authoritative usage monitor.
import bundledBookKeys from "../data/book-keys.json" with { type: "json" };
import bundledSiteSettings from "../data/site-settings.json" with { type: "json" };
import type { Book, Folder } from "../src/types";

// In-memory catalog state for edge worker runtime
let runtimeCatalog: any = null;
const activeTokens = new Set<string>();

// UPI payment settings in memory (per isolate). The durable copy is the
// bundled data/payment-settings.json in the repo; admin edits here do not
// survive a redeploy or a different isolate, same as Vercel /tmp writes.
let runtimePaymentSettings: any = null;

// Paid-book keys in memory (per isolate), seeded from the bundled
// data/book-keys.json (hashes only). Same key rules as server/app.ts —
// keep in sync: one key unlocks ONE paid book, maxUses set by the admin
// (default 100), revoked keys never unlock. Usage counts here reset when
// the isolate recycles; the Vercel totals are authoritative.
let runtimeBookKeys: any[] | null = null;

function getBookKeys(): any[] {
  if (!runtimeBookKeys) {
    const src: any = bundledBookKeys || {};
    const keys = Array.isArray(src.keys) ? src.keys : [];
    runtimeBookKeys = keys
      .filter((k: any) => k && typeof k.id === "string" && typeof k.bookId === "string" && typeof k.keyHash === "string")
      .map((k: any) => ({
        id: k.id,
        bookId: k.bookId,
        label: typeof k.label === "string" ? k.label : undefined,
        salt: typeof k.salt === "string" ? k.salt : "",
        keyHash: k.keyHash,
        maxUses: Number.isFinite(k.maxUses) ? k.maxUses : 100,
        uses: Number.isFinite(k.uses) ? k.uses : 0,
        createdAt: typeof k.createdAt === "string" ? k.createdAt : new Date().toISOString(),
        lastUsedAt: typeof k.lastUsedAt === "string" ? k.lastUsedAt : null,
        revoked: Boolean(k.revoked),
      }));
  }
  return runtimeBookKeys;
}

function publicKeyViewCf(record: any): Record<string, unknown> {
  return {
    id: record.id,
    bookId: record.bookId,
    label: record.label || "",
    maxUses: record.maxUses,
    uses: record.uses,
    usesLeft: Math.max(0, record.maxUses - record.uses),
    createdAt: record.createdAt,
    lastUsedAt: record.lastUsedAt,
    revoked: record.revoked,
    usable: !record.revoked && record.uses < record.maxUses,
  };
}

function keyMonitorTotalsCf(keys: any[]): any {
  const byBook: Record<string, { keys: number; uses: number; usesLeft: number }> = {};
  let totalUses = 0;
  let totalUsesLeft = 0;
  let activeKeys = 0;
  let revokedKeys = 0;
  for (const k of keys) {
    if (k.revoked) revokedKeys++;
    else activeKeys++;
    totalUses += k.uses;
    totalUsesLeft += Math.max(0, k.maxUses - k.uses);
    const e = byBook[k.bookId] || { keys: 0, uses: 0, usesLeft: 0 };
    e.keys++;
    e.uses += k.uses;
    e.usesLeft += Math.max(0, k.maxUses - k.uses);
    byBook[k.bookId] = e;
  }
  return { totalKeys: keys.length, activeKeys, revokedKeys, totalUses, totalUsesLeft, byBook };
}

function normalizeBookKeyCf(raw: unknown): string {
  return String(raw ?? "").replace(/[\s-]/g, "").trim();
}

async function hashBookKeyCf(key: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${normalizeBookKeyCf(key)}`));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyBookKeyCf(record: any, candidate: unknown): Promise<boolean> {
  const normalized = normalizeBookKeyCf(candidate);
  if (!normalized || !record?.keyHash || !record?.salt) return false;
  const candidateHash = await hashBookKeyCf(normalized, record.salt);
  // Constant-time-ish compare via double SHA-256 (same helper as passwords).
  return (await safeEqualSecretCf(candidateHash, record.keyHash)) === true;
}

function generateBookKeyCf(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  return [0, 1, 2, 3].map((g) => chars.slice(g * 5, g * 5 + 5).join("")).join("-");
}

/** Which book ids in this request carry a valid, usable key? Parses the
 *  `x-book-keys` header (base64url JSON of { bookId: plainKey }). */
async function keyUnlockedBookIdsCf(request: Request): Promise<Set<string>> {
  const out = new Set<string>();
  try {
    const raw = (request.headers.get("x-book-keys") || "").trim();
    if (!raw) return out;
    const json = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const supplied = JSON.parse(json);
    if (!supplied || typeof supplied !== "object") return out;
    const keys = getBookKeys();
    for (const [bookId, key] of Object.entries(supplied)) {
      if (typeof key !== "string" || !key.trim()) continue;
      const record = keys.find((k: any) => k.bookId === bookId && !k.revoked && k.uses < k.maxUses);
      if (record && (await verifyBookKeyCf(record, key))) out.add(bookId);
    }
  } catch {}
  return out;
}

// Wrong-key attempts, rate-limited per IP + book: 10 failed tries in
// 15 minutes, then 429. In-memory per isolate.
const keyAttemptLogCf = new Map<string, number[]>();

function isKeyVerifyRateLimitedCf(ip: string, bookId: string): boolean {
  const now = Date.now();
  const key = `${ip}::${bookId}`;
  const attempts = (keyAttemptLogCf.get(key) || []).filter((t) => now - t < 15 * 60 * 1000);
  keyAttemptLogCf.set(key, attempts);
  return attempts.length >= 10;
}

function recordKeyVerifyFailureCf(ip: string, bookId: string): void {
  const key = `${ip}::${bookId}`;
  const attempts = keyAttemptLogCf.get(key) || [];
  attempts.push(Date.now());
  keyAttemptLogCf.set(key, attempts);
}

// Site settings (maintenance mode) in memory (per isolate), seeded from
// the bundled data/site-settings.json. Same shape as server/app.ts.
let runtimeSiteSettings: any = null;

function getSiteSettingsCf(): { maintenance: { enabled: boolean; message: string } } {
  if (!runtimeSiteSettings) {
    const src: any = bundledSiteSettings || {};
    const m = src?.maintenance || {};
    runtimeSiteSettings = {
      maintenance: {
        enabled: Boolean(m.enabled),
        message: typeof m.message === "string" ? m.message.slice(0, 500) : "",
      },
    };
  }
  return runtimeSiteSettings;
}

// Gate key settings in memory (per isolate). The durable copy is the
// bundled data/gate-settings.json in the repo; admin edits here do not
// survive a redeploy or a different isolate, same as payment settings
// above. The key is never returned by any route.
const DEFAULT_BROADCAST_CHANNEL_URL = "https://www.instagram.com/channel/ZKdxHLW9r2VpKow7/";
let runtimeGateSettings: any = null;

function getGateSettings(): { gateKey: string; channelUrl: string } {
  if (!runtimeGateSettings) {
    const src: any = bundledGateSettings || {};
    runtimeGateSettings = {
      gateKey: typeof src.gateKey === "string" ? src.gateKey.trim().slice(0, 200) : "",
      channelUrl:
        typeof src.channelUrl === "string" && src.channelUrl.trim()
          ? src.channelUrl.trim().slice(0, 500)
          : DEFAULT_BROADCAST_CHANNEL_URL,
    };
  }
  return {
    gateKey: runtimeGateSettings.gateKey,
    // An empty stored link falls back to the default broadcast channel.
    channelUrl: runtimeGateSettings.channelUrl || DEFAULT_BROADCAST_CHANNEL_URL,
  };
}

// Upload session state for chunked uploads
const chunkSessions = new Map<string, { chunks: Map<number, Uint8Array>; metadata: any }>();

// SECURITY: no default admin password and no default session secret. A
// hardcoded fallback in a public repo is a standing admin backdoor (and a
// forgeable HMAC key). When unset, login is impossible and sessions use an
// ephemeral per-isolate random secret.
let cachedEphemeralSecret = "";
function ephemeralSessionSecret(): string {
  if (!cachedEphemeralSecret) {
    cachedEphemeralSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return cachedEphemeralSecret;
}

function getEnvConfig(env: any) {
  const getVar = (name: string, fallback = ""): string => {
    const val =
      env?.[name] ??
      (typeof process !== "undefined" && (process as any)?.env?.[name]) ??
      (typeof globalThis !== "undefined" && (globalThis as any)?.[name]) ??
      fallback;
    return typeof val === "string" ? val.trim() : String(val || "").trim();
  };

  const adminUsername = getVar("ADMIN_USERNAME", "Khafi");
  const adminPassword = getVar("ADMIN_PASSWORD", "");
  const adminPasswordHash = getVar("ADMIN_PASSWORD_HASH", "");
  const sessionSecret = getVar("SESSION_SECRET", "") || ephemeralSessionSecret();

  // SECURITY: no hardcoded service-account email and no hardcoded folder.
  // A literal service-account email in a public repo tells anyone which
  // account can read the library's Drive, and the old default pointed at
  // the whole "KHAFI LIBRARY" root. When unset, Drive is simply not
  // configured and the bundled catalog is served. The default folder is
  // the "All Islamic History Books" folder only.
  let email = getVar("GOOGLE_SERVICE_ACCOUNT_EMAIL") || getVar("GOOGLE_CLIENT_EMAIL") || getVar("GCP_SERVICE_ACCOUNT_EMAIL") || "";
  let rawKey = getVar("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY") || getVar("GOOGLE_PRIVATE_KEY") || getVar("GCP_SERVICE_ACCOUNT_PRIVATE_KEY");
  let folderId = getVar("GOOGLE_DRIVE_FOLDER_ID") || getVar("DRIVE_FOLDER_ID") || getVar("GOOGLE_DRIVE_FOLDER") || "1MAFF2F5pK1HJMoQFSZ6IXoZT9D2LpyIB";

  // Check if entire credentials JSON was passed in an alias or in private key
  const fullJson = getVar("GOOGLE_APPLICATION_CREDENTIALS") || getVar("GOOGLE_SERVICE_ACCOUNT_KEY") || getVar("GCP_SERVICE_ACCOUNT_KEY") || rawKey;
  if (fullJson && fullJson.startsWith("{") && fullJson.endsWith("}")) {
    try {
      const parsed = JSON.parse(fullJson);
      if (parsed.client_email && typeof parsed.client_email === "string") {
        email = parsed.client_email.trim();
      }
      if (parsed.private_key && typeof parsed.private_key === "string") {
        rawKey = parsed.private_key.trim();
      }
    } catch {}
  }

  const driveConfig: GoogleDriveConfig = {
    email: email.trim(),
    privateKey: rawKey.trim(),
    folderId: extractDriveFolderId(folderId),
  };

  return {
    adminUsername,
    adminPassword,
    adminPasswordHash,
    sessionSecret,
    driveConfig,
  };
}

// Helper: json response
function jsonResponse(data: any, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-token, x-follow-unlocked, Range",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
      ...extraHeaders,
    },
  });
}

// Helper: generate session token
async function generateSessionToken(secret: string): Promise<string> {
  const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(randomBytes));
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const token = `${randomBytes}.${signature}`;
  activeTokens.add(token);
  return token;
}

// Helper: verify session token
async function verifySessionToken(token: string | undefined | null, secret: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  if (activeTokens.has(token)) return true;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [randomBytes, signature] = parts;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(randomBytes));
    const expectedSig = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature.toLowerCase() === expectedSig.toLowerCase()) {
      activeTokens.add(token);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

// Helper: get admin token from request
function getAdminTokenFromRequest(req: Request): string | null {
  const headerToken = req.headers.get("x-admin-token");
  if (headerToken) return headerToken;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/khafi_admin_session=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

// Paid books are FREE for followers, and they can also be opened with
// their own per-book key. A visitor who unlocked the library gate (follow
// tap or gate key) sends `x-follow-unlocked: 1` with catalog and file
// requests, and the server believes it. TRUST-BASED, exactly like the gate
// itself. That flag opens the library, all FREE books, and paid books
// too — no money anywhere. A paid book ALSO opens for a visitor who
// entered that book's own key (see the `x-book-keys` header), even if
// they never unlocked the gate. The admin always opens paid books. No
// payment step exists anywhere in this flow. Same rule as server/app.ts.
const FOLLOW_UNLOCK_HEADER = "x-follow-unlocked";

function isFollowUnlocked(request: Request): boolean {
  return request.headers.get(FOLLOW_UNLOCK_HEADER) === "1";
}

// One predicate for the paid-book rule, used by sanitizeBook and by the
// stream/download guards: a paid book is locked for everyone except the
// admin, a gate-unlocked follower (free for followers), and a visitor
// holding that book's own unlock key. `hasKeyUnlock` is per-book. Same
// rule as server/app.ts — keep in sync.
export function isPaidBookLocked(book: any, isAdmin: boolean, hasKeyUnlock: boolean, isFollowUnlocked = false): boolean {
  return Boolean(book?.isPaid) && !isAdmin && !isFollowUnlocked && !hasKeyUnlock;
}

export function sanitizeBook(book: any, isAdmin = false, hasKeyUnlock = false, isFollowUnlocked = false) {
  if (!book) return book;
  const {
    driveUrl,
    webViewLink,
    webContentLink,
    accessToken,
    clientEmail,
    serviceAccountEmail,
    privateKey,
    googleDriveFolderId,
    GOOGLE_DRIVE_FOLDER_ID,
    driveFolderId,
    ...rest
  } = book;

  // Paid books: a locked visitor must never be handed a working open or
  // download link. Admins keep the links (they read paid books directly),
  // and so does a gate-unlocked follower (paid books are free for
  // followers) and a visitor holding that book's own unlock key. The lock
  // screen is the only thing a locked visitor sees for a paid book. (Same
  // rule as server/app.ts — keep in sync.)
  if (isPaidBookLocked(rest, isAdmin, hasKeyUnlock, isFollowUnlocked)) {
    const { driveFileId, externalUrl, fileUrl, pdfUrl, ...paidRest } = rest;
    return { ...paidRest, fileUrl: '', pdfUrl: '' };
  }

  let fileUrl = rest.fileUrl;
  let pdfUrl = rest.pdfUrl;

  if (fileUrl && (fileUrl.includes("drive.google.com") || fileUrl.includes("googleusercontent.com"))) {
    const driveId = rest.driveFileId || rest.id;
    fileUrl = driveId ? `/api/files/${driveId}/preview` : `/api/books/${rest.id}/stream`;
  }
  if (pdfUrl && (pdfUrl.includes("drive.google.com") || pdfUrl.includes("googleusercontent.com"))) {
    const driveId = rest.driveFileId || rest.id;
    pdfUrl = driveId ? `/api/files/${driveId}/preview` : `/api/books/${rest.id}/stream`;
  }

  if (!fileUrl && rest.id) {
    fileUrl = `/api/files/${rest.driveFileId || rest.id}/preview`;
  }
  if (!pdfUrl && rest.id) {
    pdfUrl = `/api/files/${rest.driveFileId || rest.id}/preview`;
  }

  return {
    ...rest,
    fileUrl,
    pdfUrl,
  };
}

function sanitizeFolder(folder: any) {
  if (!folder) return folder;
  const {
    webViewLink,
    webContentLink,
    driveUrl,
    googleDriveFolderId,
    GOOGLE_DRIVE_FOLDER_ID,
    driveFolderId,
    ...folderRest
  } = folder;
  return folderRest;
}

function sanitizeCatalog(catalog: any, isAdmin = false, keyUnlocked: Set<string> | boolean = false, isFollowUnlocked = false) {
  if (!catalog) return { folders: [], books: [] };
  const safeFolders = (catalog.folders || []).map(sanitizeFolder);
  const safeBooks = (catalog.books || []).map((b: any) =>
    sanitizeBook(b, isAdmin, keyUnlocked instanceof Set ? keyUnlocked.has(b?.id) : keyUnlocked, isFollowUnlocked)
  );
  const categoryOrder = Array.isArray(catalog.categoryOrder)
    ? catalog.categoryOrder.filter((n: any) => typeof n === 'string')
    : undefined;
  const topicOrder = Array.isArray(catalog.topicOrder)
    ? catalog.topicOrder.filter((n: any) => typeof n === 'string')
    : undefined;
  return {
    folders: safeFolders,
    books: safeBooks,
    ...(categoryOrder ? { categoryOrder } : {}),
    ...(topicOrder ? { topicOrder } : {}),
  };
}

async function sha256Hex(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time secret comparison (via SHA-256 digests) so password checks
// do not leak how much of the guess matched through timing.
async function safeEqualSecretCf(a: string, b: string): Promise<boolean> {
  const ha = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(a)));
  const hb = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(b)));
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

function getMimeType(fileName: string, override?: string): string {
  if (override && override !== "application/octet-stream") return override;
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "epub":
      return "application/epub+zip";
    case "mp3":
      return "audio/mpeg";
    case "mp4":
      return "video/mp4";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}

function extractDriveFileId(urlOrId?: string): string | null {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  if (urlOrId.startsWith("/api/drive/file/")) {
    return urlOrId.replace("/api/drive/file/", "").split("?")[0];
  }
  const match = urlOrId.match(/\/d\/([a-zA-Z0-9_-]+)/) || urlOrId.match(/id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{25,}$/.test(urlOrId)) return urlOrId;
  return null;
}

/**
 * Get catalog data (from live Google Drive hierarchy if configured, or in-memory / initial catalog)
 */
async function getCatalogData(driveConfig: GoogleDriveConfig): Promise<any> {
  const configured = isDriveConfigured(driveConfig);
  if (configured) {
    try {
      console.log(`[Drive Diagnostic] Fetching live catalog from Google Drive for folder: ${driveConfig.folderId}...`);
      const liveCatalog = await fetchLiveDriveCatalogCf(driveConfig, runtimeCatalog);
      if (liveCatalog && (liveCatalog.folders?.length > 0 || liveCatalog.books?.length > 0)) {
        runtimeCatalog = liveCatalog;
        return liveCatalog;
      }
      if (liveCatalog) {
        return liveCatalog;
      }
    } catch (err: any) {
      console.error("[Drive Diagnostic] getCatalogData failed against Google Drive:", err?.message || err);
    }
  } else {
    console.warn(`[Drive Diagnostic] Google Drive is not fully configured (email=${Boolean(driveConfig.email)}, validPrivateKey=${Boolean(isValidPrivateKey(driveConfig.privateKey))}, folderId=${driveConfig.folderId || "MISSING"}).`);
  }

  if (runtimeCatalog) {
    return runtimeCatalog;
  }

  // Fallback to a clone of the bundled saved catalog when Drive is not
  // configured. This is the 173-book All Islamic History Books catalog.
  runtimeCatalog = JSON.parse(JSON.stringify(bundledCatalog));
  return runtimeCatalog;
}

/**
 * Save catalog data (updates memory and syncs to Google Drive)
 */
async function saveCatalogData(data: any, driveConfig: GoogleDriveConfig): Promise<void> {
  runtimeCatalog = data;
  if (isDriveConfigured(driveConfig)) {
    try {
      await syncCatalogWithDriveCf(data, driveConfig);
    } catch (err) {
      console.warn("Async Drive catalog sync warning:", err);
    }
  }
}

/**
 * Rebuild the saved catalog from a fresh live listing of the Drive folder.
 * Shared by POST /api/admin/sync and GET /api/cron/sync. Never overwrites
 * the saved catalog with an empty live result (e.g. a Drive timeout), so a
 * failed sync can never wipe the library.
 */
async function runDriveSyncCf(driveConfig: GoogleDriveConfig): Promise<any> {
  if (!isDriveConfigured(driveConfig)) {
    return {
      ok: false,
      configured: false,
      error:
        "Google Drive is not configured on this server. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Cloudflare, and share the All Islamic History Books folder with that service account, then sync again.",
    };
  }
  const previous = runtimeCatalog || JSON.parse(JSON.stringify(bundledCatalog));
  const prevBookIds = new Set((previous.books || []).map((b: any) => b.id));
  const prevFolderIds = new Set((previous.folders || []).map((f: any) => f.id));
  invalidateDriveCacheCf();
  let live: any;
  try {
    live = await fetchLiveDriveCatalogCf(driveConfig, previous);
  } catch (err: any) {
    return { ok: false, configured: true, error: `Drive sync failed: ${err?.message || err}` };
  }
  const folders = live?.folders || [];
  const books = live?.books || [];
  if (folders.length === 0 && books.length === 0) {
    return { ok: false, configured: true, error: "Drive returned an empty catalog; the saved catalog was kept unchanged." };
  }
  const newBookIds = new Set(books.map((b: any) => b.id));
  const newFolderIds = new Set(folders.map((f: any) => f.id));
  const roots = new Set(folders.filter((r: any) => !r.parentId).map((r: any) => r.id));
  const result = {
    ok: true,
    configured: true,
    folders: folders.length,
    books: books.length,
    categories: folders.filter((f: any) => f.parentId && roots.has(f.parentId)).length,
    addedBooks: books.filter((b: any) => !prevBookIds.has(b.id)).length,
    removedBooks: (previous.books || []).filter((b: any) => !newBookIds.has(b.id)).length,
    addedFolders: folders.filter((f: any) => !prevFolderIds.has(f.id)).length,
    removedFolders: (previous.folders || []).filter((f: any) => !newFolderIds.has(f.id)).length,
    syncedAt: new Date().toISOString(),
  };
  // A Drive sync rebuilds books from Drive — the admin's topic/category
  // order is the library's own arrangement, so it is carried over.
  runtimeCatalog = {
    folders,
    books,
    ...(Array.isArray(previous.categoryOrder) ? { categoryOrder: previous.categoryOrder } : {}),
    ...(Array.isArray(previous.topicOrder) ? { topicOrder: previous.topicOrder } : {}),
  };
  try {
    await syncCatalogWithDriveCf(runtimeCatalog, driveConfig);
  } catch (err) {
    console.warn("Drive catalog.json backup warning:", err);
  }
  return result;
}

/**
 * Main Cloudflare Worker / Pages Function API Request Handler
 */
export async function handleCloudflareApiRequest(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // 1. CORS Preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-token, x-follow-unlocked, Range, Accept, Origin",
        "Access-Control-Expose-Headers": "Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const { adminUsername, adminPassword, adminPasswordHash, sessionSecret, driveConfig } = getEnvConfig(env);

  // 2. Health check
  if ((path === "/api/health" || path === "/api") && method === "GET") {
    return jsonResponse({
      status: "ok",
      app: "Ilm-e-Ghayb Library",
      runtime: "cloudflare-edge",
    });
  }

  // 2b. Diagnostics Check: GET /api/diagnostics
  if (path === "/api/diagnostics" && method === "GET") {
    const token = getAdminTokenFromRequest(request);
    const isAdmin = await verifySessionToken(token, sessionSecret);
    if (!isAdmin) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const isConfigured = isDriveConfigured(driveConfig);
    const isKeyValid = isValidPrivateKey(driveConfig.privateKey);
    let driveTest: any = null;

    if (isConfigured) {
      driveTest = await testDriveConnectionCf(driveConfig);
    }

    return jsonResponse({
      status: "ok",
      runtime: "cloudflare-edge",
      timestamp: new Date().toISOString(),
      environment: {
        hasEmail: Boolean(driveConfig.email),
        hasPrivateKey: Boolean(driveConfig.privateKey),
        isPrivateKeyValid: isKeyValid,
        hasFolderId: Boolean(driveConfig.folderId),
        hasAdminUsername: Boolean(adminUsername),
        hasAdminPassword: Boolean(adminPassword),
        hasSessionSecret: Boolean(sessionSecret),
      },
      drive: driveTest,
    });
  }

  // 3. Admin Authentication: POST /api/admin/login
  if (path === "/api/admin/login" && method === "POST") {
    try {
      let body: any = {};
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ success: false, error: "Invalid JSON body provided." }, 400);
      }

      const username = (body.username || "").trim();
      const password = (body.password || "").trim();

      if (!username || !password) {
        return jsonResponse({ success: false, error: "Username and password are required." }, 400);
      }

      const inputPasswordHash = await sha256Hex(password);
      const isPasswordMatch =
        (await safeEqualSecretCf(password, adminPassword)) ||
        (adminPasswordHash &&
          ((await safeEqualSecretCf(password, adminPasswordHash)) ||
            (await safeEqualSecretCf(inputPasswordHash, adminPasswordHash.toLowerCase()))));

      if (username === adminUsername && isPasswordMatch) {
        const token = await generateSessionToken(sessionSecret);
        const cookieHeader = `khafi_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${
          url.protocol === "https:" ? "; Secure" : ""
        }`;

        return jsonResponse(
          { success: true, token, username },
          200,
          { "Set-Cookie": cookieHeader }
        );
      } else {
        return jsonResponse({ success: false, error: "Invalid username or password." }, 401);
      }
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Internal login error." }, 500);
    }
  }

  // 4. Admin Session Check: GET /api/admin/me
  if (path === "/api/admin/me" && method === "GET") {
    const token = getAdminTokenFromRequest(request);
    const isValid = await verifySessionToken(token, sessionSecret);
    return jsonResponse({ authenticated: isValid, username: isValid ? adminUsername : undefined });
  }

  // 5. Admin Logout: POST /api/admin/logout
  if (path === "/api/admin/logout" && method === "POST") {
    const token = getAdminTokenFromRequest(request);
    if (token) activeTokens.delete(token);

    const clearCookie = "khafi_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
    return jsonResponse({ success: true }, 200, { "Set-Cookie": clearCookie });
  }

  // 6. Admin Drive Status: GET /api/admin/drive/status
  if (path === "/api/admin/drive/status" && method === "GET") {
    const token = getAdminTokenFromRequest(request);
    if (!(await verifySessionToken(token, sessionSecret))) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    const status = await testDriveConnectionCf(driveConfig);
    return jsonResponse({ success: true, ...status });
  }

  // sanitizeBook / sanitizeFolder / sanitizeCatalog live at module
  // level now (below isPaidBookLocked), so tests can import them.

  // 7. Catalog Fetch: GET /api/catalog
  if (path === "/api/catalog" && method === "GET") {
    const token = getAdminTokenFromRequest(request);
    const isAdmin = await verifySessionToken(token, sessionSecret);
    const keyUnlocked = await keyUnlockedBookIdsCf(request);
    const catalog = await getCatalogData(driveConfig);
    const safeCatalog = sanitizeCatalog(catalog, isAdmin, keyUnlocked, isFollowUnlocked(request));

    const totalFolders = (safeCatalog.folders || []).length;
    const totalBooks = (safeCatalog.books || []).length;
    console.log(`[API /api/catalog] Returning catalog: ${totalFolders} folders, ${totalBooks} books (isAdmin=${isAdmin})`);

    // Vary on the admin token and the book-keys flag so an admin or
    // key-unlocked response is never served to a locked visitor (and vice
    // versa). Same rule as server/app.ts — keep in sync.
    const varyHeaders = { Vary: "x-admin-token, x-follow-unlocked, x-book-keys" };
    if (isAdmin) {
      return jsonResponse(safeCatalog, 200, { "Cache-Control": "public, max-age=10", ...varyHeaders });
    } else {
      const visibleFolders = (safeCatalog.folders || []).filter((f: any) => f.visible !== false);
      const visibleBooks = (safeCatalog.books || []).filter((b: any) => b.visible !== false);
      return jsonResponse(
        {
          folders: visibleFolders,
          books: visibleBooks,
          ...(safeCatalog.categoryOrder ? { categoryOrder: safeCatalog.categoryOrder } : {}),
          ...(safeCatalog.topicOrder ? { topicOrder: safeCatalog.topicOrder } : {}),
        },
        200,
        { 'Cache-Control': 'public, max-age=10', ...varyHeaders }
      );
    }
  }

  // 7b. Public library status: honest, no secrets. Mirrors the Vercel
  // /api/library-status shape so the same frontend works on both hosts.
  if (path === "/api/library-status" && method === "GET") {
    const catalog = await getCatalogData(driveConfig);
    const folders = catalog.folders || [];
    const books = catalog.books || [];
    const configured = isDriveConfigured(driveConfig);
    const roots = new Set(folders.filter((r: any) => !r.parentId).map((r: any) => r.id));
    return jsonResponse({
      status: "ok",
      library: "Ilm-e-Ghayb Library",
      brand: "Ghayb Chronicles",
      driveFolder: "All Islamic History Books only",
      driveFolderId: driveConfig.folderId,
      driveConfigured: configured,
      mode: configured ? "drive-sync" : "catalog-links",
      modeNote: configured
        ? "Live Google Drive sync is configured."
        : "Drive sync is not configured. The library serves its saved catalog and books open in Google Drive.",
      categories: folders.filter((f: any) => f.parentId && roots.has(f.parentId)).length,
      folders: folders.length,
      books: books.length,
      paidBooks: books.filter((b: any) => b.isPaid).length,
    });
  }

  // 7c. Public UPI payment settings (the three admin-set fields only).
  // On a Worker there is no disk: the bundled repo file is the durable
  // copy and admin edits live only in this isolate's memory.
  if (path === "/api/payment-settings" && method === "GET") {
    if (!runtimePaymentSettings) {
      const src: any = bundledPaymentSettings || {};
      runtimePaymentSettings = {
        upiId: typeof src.upiId === "string" ? src.upiId.trim() : "",
        upiQrUrl: typeof src.upiQrUrl === "string" ? src.upiQrUrl.trim() : "",
        displayName: typeof src.displayName === "string" ? src.displayName.trim() : "",
      };
    }
    return jsonResponse({ ...runtimePaymentSettings });
  }

  // 7c2. Public gate status: only whether a key is set, plus the broadcast
  // channel link. The key itself is never returned here. Mirrors the
  // Express twin in server/app.ts.
  if (path === "/api/gate/status" && method === "GET") {
    const settings = getGateSettings();
    return jsonResponse({ keySet: settings.gateKey.length > 0, channelUrl: settings.channelUrl });
  }

  // 7c3. Public gate unlock: checks the key server-side, constant-time.
  // The key is never logged and never returned. Mirrors server/app.ts:
  // no key set -> 404, wrong key -> 401 after a ~600ms delay, right key
  // -> { ok: true }.
  if (path === "/api/gate/unlock" && method === "POST") {
    const settings = getGateSettings();
    if (!settings.gateKey) {
      return jsonResponse({ error: "Gate key is not set." }, 404);
    }
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const guess = typeof body?.key === "string" ? body.key : "";
    if (!(await safeEqualSecretCf(guess, settings.gateKey))) {
      await new Promise((r) => setTimeout(r, 600));
      return jsonResponse({ error: "Wrong key. Check the key in the broadcast channel and try again." }, 401);
    }
    return jsonResponse({ ok: true });
  }

  // 7c4. Public site settings: maintenance flag + message only. Mirrors
  // the Express twin in server/app.ts.
  if (path === "/api/site-settings" && method === "GET") {
    const settings = getSiteSettingsCf();
    return jsonResponse({ maintenance: settings.maintenance });
  }

  // 7c5. Key unlock: enter the key the admin shared for ONE paid book.
  // A successful entry counts one use of that key (maxUses, default 100)
  // and unlocks that book — and only that book. A wrong key, a key for
  // another book, a revoked key, or a used-up key all get the same generic
  // answer. Usage counts here are per-isolate; the Vercel totals are
  // authoritative. Mirrors server/app.ts. No money is involved: the key
  // is free, shared by the admin with a follower.
  if (path === "/api/book-keys/verify" && method === "POST") {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";
    const key = typeof body?.key === "string" ? body.key : "";
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    if (!bookId || !key) {
      return jsonResponse({ ok: false, error: "Book and key are required." }, 400);
    }
    const catalog = await getCatalogData(driveConfig);
    const book = (catalog.books || []).find((b: any) => b.id === bookId);
    if (!book || !book.isPaid) {
      return jsonResponse({ ok: false, error: "Wrong key. Check the key and try again." }, 400);
    }
    if (isKeyVerifyRateLimitedCf(ip, bookId)) {
      return jsonResponse({ ok: false, error: "Too many wrong tries. Wait 15 minutes and try again." }, 429);
    }
    const keys = getBookKeys();
    const candidates = keys.filter((k: any) => k.bookId === bookId);
    let record: any = null;
    for (const candidate of candidates) {
      if (await verifyBookKeyCf(candidate, key)) {
        record = candidate;
        break;
      }
    }
    if (!record || record.revoked || record.uses >= record.maxUses) {
      recordKeyVerifyFailureCf(ip, bookId);
      return jsonResponse({ ok: false, error: "Wrong key. Check the key and try again." }, 400);
    }
    record.uses += 1;
    record.lastUsedAt = new Date().toISOString();
    return jsonResponse({
      ok: true,
      bookId,
      uses: record.uses,
      usesLeft: Math.max(0, record.maxUses - record.uses),
      maxUses: record.maxUses,
    });
  }

  // 7d. Daily auto-sync for Cron Triggers (wrangler.jsonc triggers.crons,
  // 02:00 UTC). Requires CRON_SECRET as a secret; an unprotected trigger
  // would let anyone rebuild the catalog.
  if (path === "/api/cron/sync" && method === "GET") {
    const cronSecret = typeof env?.CRON_SECRET === "string" ? env.CRON_SECRET.trim() : "";
    if (!cronSecret) {
      return jsonResponse(
        { success: false, error: "CRON_SECRET is not set, so the daily auto-sync is disabled. Add any long random value as CRON_SECRET in the Cloudflare dashboard." },
        503
      );
    }
    const auth = request.headers.get("authorization") || "";
    if (auth !== `Bearer ${cronSecret}`) {
      return jsonResponse({ success: false, error: "Unauthorized cron request." }, 401);
    }
    const result = await runDriveSyncCf(driveConfig);
    if (!result.ok) {
      return jsonResponse({ success: false, configured: result.configured, error: result.error || "Drive sync failed." }, 503);
    }
    return jsonResponse({ success: true, ...result });
  }

  // 8. Stream / Preview Google Drive File: GET or HEAD /api/drive/file/:fileId, /api/files/:fileId, /api/pdf/:fileId, /api/books/:id/file
  const isFileStreamPath =
    path.startsWith("/api/drive/file/") ||
    path.startsWith("/api/files/") ||
    path.startsWith("/api/pdf/") ||
    (path.startsWith("/api/books/") && (path.endsWith("/file") || path.endsWith("/preview") || path.endsWith("/pdf") || path.endsWith("/stream")));

  if (isFileStreamPath && (method === "GET" || method === "HEAD")) {
    let targetFileId = "";

    let rawId = "";
    if (path.startsWith("/api/drive/file/")) {
      rawId = path.replace("/api/drive/file/", "").split("?")[0];
    } else if (path.startsWith("/api/files/")) {
      rawId = path.replace("/api/files/", "").split("?")[0];
    } else if (path.startsWith("/api/pdf/")) {
      rawId = path.replace("/api/pdf/", "").split("?")[0];
    } else if (path.startsWith("/api/books/")) {
      rawId = path.split("/")[3] || "";
    }

    rawId = rawId.replace(/\/(preview|stream|pdf|file|download)$/i, "").trim();

    const catalog = await getCatalogData(driveConfig);
    const book = (catalog.books || []).find(
      (b: any) => b.id === rawId || b.driveFileId === rawId
    );

    if (book) {
      targetFileId = book.driveFileId || extractDriveFileId(book.fileUrl || book.pdfUrl || book.driveUrl) || rawId;
    } else {
      targetFileId = rawId;
    }

    if (!targetFileId) {
      return jsonResponse({ error: "File ID could not be identified." }, 400);
    }

    // Paid gate (same rule as server/app.ts — keep in sync): a paid book
    // is never streamed to a locked visitor. Admins stream it directly,
    // and so does a gate-unlocked follower (paid books are free for
    // followers) and a visitor holding that book's own unlock key.
    {
      const streamToken = getAdminTokenFromRequest(request);
      const streamIsAdmin = await verifySessionToken(streamToken, sessionSecret);
      const streamKeyUnlocked = await keyUnlockedBookIdsCf(request);
      if (isPaidBookLocked(book, streamIsAdmin, streamKeyUnlocked.has(book?.id), isFollowUnlocked(request))) {
        return jsonResponse({ error: "This is a paid book. It is free for followers — follow @ghayb.chronicles to open it, or enter the book key shared by the admin." }, 402);
      }
    }

    if (!isDriveConfigured(driveConfig)) {
      return jsonResponse({ error: "Google Drive is not configured on this server." }, 503);
    }

    try {
      const accessToken = await getGoogleDriveAccessToken(driveConfig);
      const rangeHeader = request.headers.get("range");

      const driveHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
      };
      if (rangeHeader) {
        driveHeaders["Range"] = rangeHeader;
      }

      const driveUrl = `https://www.googleapis.com/drive/v3/files/${targetFileId}?alt=media&supportsAllDrives=true`;
      const driveRes = await fetch(driveUrl, {
        method: method === "HEAD" ? "HEAD" : "GET",
        headers: driveHeaders,
      });

      if (!driveRes.ok && driveRes.status !== 206 && driveRes.status !== 304) {
        const errText = await driveRes.text().catch(() => "Unknown error");
        console.warn(`Drive streaming failed for ${targetFileId}: ${driveRes.status} ${errText}`);
        return jsonResponse({ error: `Drive streaming failed: ${errText}` }, driveRes.status);
      }

      const responseHeaders = new Headers();

      // Determine content type
      const driveMime = driveRes.headers.get("content-type");
      if (driveMime && !driveMime.includes("octet-stream")) {
        responseHeaders.set("Content-Type", driveMime);
      } else {
        responseHeaders.set("Content-Type", "application/pdf");
      }

      // Pass content length & range headers for PDF.js streaming
      const contentLength = driveRes.headers.get("content-length");
      if (contentLength) {
        responseHeaders.set("Content-Length", contentLength);
      }

      const contentRange = driveRes.headers.get("content-range");
      if (contentRange) {
        responseHeaders.set("Content-Range", contentRange);
      }

      const etag = driveRes.headers.get("etag");
      if (etag) {
        responseHeaders.set("ETag", etag);
      }

      const lastModified = driveRes.headers.get("last-modified");
      if (lastModified) {
        responseHeaders.set("Last-Modified", lastModified);
      }

      // Crucial streaming & preview headers
      responseHeaders.set("Accept-Ranges", "bytes");
      responseHeaders.set("Content-Disposition", "inline");
      responseHeaders.set("Cache-Control", "public, max-age=86400");
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      responseHeaders.set("Access-Control-Allow-Headers", "Range, Authorization, Content-Type, Accept, Origin, x-admin-token, x-follow-unlocked");
      responseHeaders.set(
        "Access-Control-Expose-Headers",
        "Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type"
      );

      console.log(`[DriveStream] fileId=${targetFileId} rangeRequested=${Boolean(rangeHeader)} driveStatus=${driveRes.status} contentType=${responseHeaders.get("Content-Type")} contentLength=${responseHeaders.get("Content-Length") || "unknown"} returnedStatus=${driveRes.status}`);

      return new Response(method === "HEAD" ? null : driveRes.body, {
        status: driveRes.status,
        headers: responseHeaders,
      });
    } catch (err: any) {
      console.error(`[DriveStream] Error streaming Drive file ${targetFileId}:`, err?.message || err);
      return jsonResponse({ error: err.message || "Failed to stream file from Google Drive" }, 500);
    }
  }

  // 9. Book Download: GET /api/books/:id/download, /api/files/:fileId/download, or GET /api/download
  if (
    (path.startsWith("/api/books/") && path.endsWith("/download") && method === "GET") ||
    (path.startsWith("/api/files/") && path.endsWith("/download") && method === "GET") ||
    (path === "/api/download" && method === "GET")
  ) {
    const catalog = await getCatalogData(driveConfig);
    let book: any = null;
    let fileIdFromPath = "";

    if (path.startsWith("/api/files/") && path.endsWith("/download")) {
      fileIdFromPath = path.split("/")[3];
      book = (catalog.books || []).find((b: any) => b.id === fileIdFromPath || b.driveFileId === fileIdFromPath);
    } else if (path.startsWith("/api/books/")) {
      const parts = path.split("/");
      const bookId = parts[3];
      book = (catalog.books || []).find((b: any) => b.id === bookId);
    } else {
      const idParam = url.searchParams.get("id");
      const fileParam = url.searchParams.get("file") || url.searchParams.get("path") || url.searchParams.get("url");
      if (idParam) {
        book = (catalog.books || []).find((b: any) => b.id === idParam);
      } else if (fileParam) {
        book = (catalog.books || []).find((b: any) => b.fileUrl === fileParam || b.pdfUrl === fileParam);
      }
    }

    const driveFileId = book?.driveFileId || fileIdFromPath || extractDriveFileId(book?.fileUrl || book?.pdfUrl);
    // Paid gate (same rule as server/app.ts — keep in sync): a paid book
    // is never downloadable by a locked visitor. Admins download it
    // directly, and so does a gate-unlocked follower (paid books are free
    // for followers) and a visitor holding that book's own unlock key.
    {
      const dlToken = getAdminTokenFromRequest(request);
      const dlIsAdmin = await verifySessionToken(dlToken, sessionSecret);
      const dlKeyUnlocked = await keyUnlockedBookIdsCf(request);
      if (isPaidBookLocked(book, dlIsAdmin, dlKeyUnlocked.has(book?.id), isFollowUnlocked(request))) {
        return jsonResponse({ error: "This is a paid book. It is free for followers — follow @ghayb.chronicles to open it, or enter the book key shared by the admin." }, 402);
      }
    }
    if (driveFileId && isDriveConfigured(driveConfig)) {
      try {
        const accessToken = await getGoogleDriveAccessToken(driveConfig);
        const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media&supportsAllDrives=true`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (driveRes.ok) {
          const downloadName = book?.originalFilename || `${(book?.title || "book").replace(/[/\\?%*:|"<>]/g, "_")}.pdf`;
          const headers = new Headers(driveRes.headers);
          headers.set("Content-Type", book?.mimeType || "application/pdf");
          headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadName)}"`);
          headers.set("Access-Control-Allow-Origin", "*");
          return new Response(driveRes.body, { status: 200, headers });
        }
      } catch (err) {
        console.warn("Drive download stream error:", err);
      }
    }

    // Only redirect if targetUrl is relative local file path (like /sample-pdfs/ or /uploads/)
    const targetUrl = book?.fileUrl || book?.pdfUrl;
    if (targetUrl && (targetUrl.startsWith("/sample-pdfs/") || targetUrl.startsWith("/uploads/"))) {
      return Response.redirect(new URL(targetUrl, request.url).toString(), 302);
    }

    return jsonResponse({ error: "No download file available for this book" }, 404);
  }

  // --- ADMIN RESTRICTED ROUTES ---
  const token = getAdminTokenFromRequest(request);
  const isAuth = await verifySessionToken(token, sessionSecret);

  if (!isAuth) {
    return jsonResponse({ success: false, error: "Unauthorized: Admin session required." }, 401);
  }

  // 10. Admin Book Operations
  // POST /api/admin/books (Add)
  if (path === "/api/admin/books" && method === "POST") {
    try {
      const bookData = (await request.json()) as Partial<Book>;
      const catalog = await getCatalogData(driveConfig);

      const newBook = {
        ...bookData,
        id: bookData.id || `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      catalog.books = [newBook, ...(catalog.books || [])];
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, book: sanitizeBook(newBook, true) });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to add book." }, 500);
    }
  }

  // PUT /api/admin/books/:id (Update)
  if (path.startsWith("/api/admin/books/") && method === "PUT") {
    const bookId = path.replace("/api/admin/books/", "").split("?")[0];
    try {
      const updates = (await request.json()) as Partial<Book>;
      const catalog = await getCatalogData(driveConfig);
      const index = (catalog.books || []).findIndex((b: any) => b.id === bookId);

      if (index === -1) {
        return jsonResponse({ success: false, error: "Book not found" }, 404);
      }

      const updatedBook = {
        ...catalog.books[index],
        ...updates,
        updatedDate: new Date().toISOString(),
      };

      catalog.books[index] = updatedBook;
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, book: sanitizeBook(updatedBook, true) });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to update book." }, 500);
    }
  }

  // DELETE /api/admin/books/:id (Delete)
  if (path.startsWith("/api/admin/books/") && method === "DELETE") {
    const bookId = path.replace("/api/admin/books/", "").split("?")[0];
    try {
      const catalog = await getCatalogData(driveConfig);
      const book = (catalog.books || []).find((b: any) => b.id === bookId);

      if (!book) {
        return jsonResponse({ success: false, error: "Book not found" }, 404);
      }

      // Delete removes the catalog entry only, never the Drive file.
      // The book stays in Google Drive; only the library listing loses it.
      catalog.books = (catalog.books || []).filter((b: any) => b.id !== bookId);
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, message: "Book deleted successfully." });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to delete book." }, 500);
    }
  }

  // 11. Admin Folder Operations
  // POST /api/admin/folders (Add)
  if (path === "/api/admin/folders" && method === "POST") {
    try {
      const folderData = (await request.json()) as Partial<Folder>;
      let folderId = folderData.id || `f-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      let finalParentId = folderData.parentId || null;

      if (isDriveConfigured(driveConfig)) {
        try {
          const driveFolder = await createDriveFolderCf(
            folderData.name,
            folderData.parentId,
            folderData.description,
            driveConfig
          );
          folderId = driveFolder.id;
          finalParentId = driveFolder.parentId;
        } catch (err: any) {
          console.error("Drive folder creation error:", err);
          return jsonResponse({ success: false, error: `Drive error: ${err?.message || err}` }, 500);
        }
      }

      const catalog = await getCatalogData(driveConfig);
      const newFolder = {
        ...folderData,
        id: folderId,
        parentId: finalParentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: folderData.sortOrder || (catalog.folders?.length || 0) + 1,
        visible: folderData.visible !== false,
      };

      catalog.folders = [...(catalog.folders || []), newFolder];
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, folder: sanitizeFolder(newFolder) });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to create folder." }, 500);
    }
  }

  // PUT /api/admin/folders/:id (Update)
  if (path.startsWith("/api/admin/folders/") && method === "PUT") {
    const folderId = path.replace("/api/admin/folders/", "").split("?")[0];
    try {
      const updates = (await request.json()) as Partial<Folder>;
      if (isDriveConfigured(driveConfig) && updates.name) {
        renameDriveFolderCf(folderId, updates.name, updates.description, driveConfig).catch((err) => {
          console.warn("Drive folder rename error:", err);
        });
      }

      const catalog = await getCatalogData(driveConfig);
      const index = (catalog.folders || []).findIndex((f: any) => f.id === folderId);

      if (index === -1) {
        return jsonResponse({ success: false, error: "Folder not found" }, 404);
      }

      const updatedFolder = {
        ...catalog.folders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      catalog.folders[index] = updatedFolder;
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, folder: sanitizeFolder(updatedFolder) });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to update folder." }, 500);
    }
  }

  // DELETE /api/admin/folders/:id (Delete)
  if (path.startsWith("/api/admin/folders/") && method === "DELETE") {
    const folderId = path.replace("/api/admin/folders/", "").split("?")[0];
    try {
      const catalog = await getCatalogData(driveConfig);
      const index = (catalog.folders || []).findIndex((f: any) => f.id === folderId);

      if (index === -1) {
        return jsonResponse({ success: false, error: "Folder not found" }, 404);
      }

      // Delete removes the catalog entry only, never the Drive folder.
      catalog.folders = (catalog.folders || []).filter((f: any) => f.id !== folderId);
      await saveCatalogData(catalog, driveConfig);

      return jsonResponse({ success: true, message: "Folder deleted successfully." });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to delete folder." }, 500);
    }
  }

  // 11b. Admin UPI payment settings: POST /api/admin/payment-settings.
  // Updates this isolate's in-memory copy only — Workers have no durable
  // disk, so the durable copy is data/payment-settings.json in the repo.
  if (path === "/api/admin/payment-settings" && method === "POST") {
    try {
      const body: any = await request.json();
      runtimePaymentSettings = {
        upiId: typeof body?.upiId === "string" ? body.upiId.trim().slice(0, 100) : "",
        upiQrUrl: typeof body?.upiQrUrl === "string" ? body.upiQrUrl.trim().slice(0, 500) : "",
        displayName: typeof body?.displayName === "string" ? body.displayName.trim().slice(0, 100) : "",
      };
      return jsonResponse({ success: true, settings: { ...runtimePaymentSettings } });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to save payment settings." }, 500);
    }
  }

  // 11b2. Admin gate settings: GET /api/admin/gate-settings (keySet only,
  // never the key) and POST to save. Workers have no durable disk, so a
  // save lives only in this isolate's memory — the durable copy is
  // data/gate-settings.json in the repo, same as payment settings above.
  // Mirrors server/app.ts; removeKey clears the key, a non-empty gateKey
  // sets a new one, an absent/empty gateKey keeps the existing key.
  if (path === "/api/admin/gate-settings" && method === "GET") {
    const settings = getGateSettings();
    return jsonResponse({ keySet: settings.gateKey.length > 0, channelUrl: settings.channelUrl });
  }

  if (path === "/api/admin/gate-settings" && method === "POST") {
    try {
      const body: any = await request.json();
      const current = getGateSettings();
      const next = { gateKey: current.gateKey, channelUrl: current.channelUrl };
      if (body?.removeKey === true) {
        next.gateKey = "";
      } else if (typeof body?.gateKey === "string" && body.gateKey.trim() !== "") {
        next.gateKey = body.gateKey.trim().slice(0, 200);
      }
      if (typeof body?.channelUrl === "string") {
        next.channelUrl = body.channelUrl.trim().slice(0, 500);
      }
      runtimeGateSettings = next;
      const stored = getGateSettings();
      return jsonResponse({
        success: true,
        keySet: stored.gateKey.length > 0,
        channelUrl: stored.channelUrl,
        durable: false,
        durableWarning:
          "Saved for now only — Cloudflare Workers have no disk, so this key will not survive a redeploy. The durable copy is data/gate-settings.json in the repo.",
      });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to save gate settings." }, 500);
    }
  }

  // 11b3. Admin site settings (maintenance mode): POST
  // /api/admin/site-settings. Lives only in this isolate's memory — the
  // durable copy is data/site-settings.json in the repo. Mirrors
  // server/app.ts.
  if (path === "/api/admin/site-settings" && method === "POST") {
    try {
      const body: any = await request.json();
      const m = body?.maintenance || {};
      runtimeSiteSettings = {
        maintenance: {
          enabled: Boolean(m.enabled),
          message: typeof m.message === "string" ? m.message.trim().slice(0, 500) : "",
        },
      };
      return jsonResponse({
        success: true,
        maintenance: runtimeSiteSettings.maintenance,
        durable: false,
        durableWarning:
          "Saved for now only — Cloudflare Workers have no disk, so this will not survive a redeploy. The durable copy is data/site-settings.json in the repo.",
      });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to save site settings." }, 500);
    }
  }

  // 11b4. Admin book keys: list (monitor), generate, revoke, delete.
  // Plain keys and hashes are NEVER returned by the list — only counts,
  // limits and last-used times. The plain key is returned ONCE, in the
  // generate response. Keys generated here live only in this isolate's
  // memory; the durable copy is data/book-keys.json in the repo, and the
  // Vercel totals are the authoritative usage monitor. Mirrors
  // server/app.ts.
  if (path === "/api/admin/book-keys" && method === "GET") {
    const keys = getBookKeys();
    const catalog = await getCatalogData(driveConfig);
    const titleById = new Map((catalog.books || []).map((b: any) => [b.id, b.title]));
    return jsonResponse({
      keys: keys.map((k: any) => ({ ...publicKeyViewCf(k), bookTitle: titleById.get(k.bookId) || k.bookId })),
      totals: keyMonitorTotalsCf(keys),
    });
  }

  if (path === "/api/admin/book-keys" && method === "POST") {
    try {
      const body: any = await request.json();
      const bookId = typeof body?.bookId === "string" ? body.bookId.trim() : "";
      const label = typeof body?.label === "string" ? body.label : "";
      const maxUses =
        body?.maxUses === undefined ? 100 : Math.min(10000, Math.max(1, Math.floor(Number(body.maxUses)) || 100));
      const catalog = await getCatalogData(driveConfig);
      const book = (catalog.books || []).find((b: any) => b.id === bookId);
      if (!book) {
        return jsonResponse({ error: "Book not found." }, 404);
      }
      if (!book.isPaid) {
        return jsonResponse({ error: "Keys are only for paid books. This book is free and needs no key." }, 400);
      }
      const plainKey = generateBookKeyCf();
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const keyHash = await hashBookKeyCf(plainKey, salt);
      const record: any = {
        id: `k_${Array.from(crypto.getRandomValues(new Uint8Array(8)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")}`,
        bookId,
        label: label.trim().slice(0, 120) || undefined,
        salt,
        keyHash,
        maxUses,
        uses: 0,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        revoked: false,
      };
      getBookKeys().push(record);
      return jsonResponse({
        success: true,
        key: { ...publicKeyViewCf(record), bookTitle: book.title },
        plainKey,
        durable: false,
        durableWarning:
          "Saved for now only — Cloudflare Workers have no disk, so this key will not survive a redeploy. Generate keys on the Vercel site for durable keys, or add the hash to data/book-keys.json in the repo.",
      });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to generate key." }, 500);
    }
  }

  if (path.startsWith("/api/admin/book-keys/") && path.endsWith("/revoke") && method === "POST") {
    const keyId = path.split("/")[4];
    const record = getBookKeys().find((k: any) => k.id === keyId);
    if (!record) {
      return jsonResponse({ error: "Key not found." }, 404);
    }
    record.revoked = true;
    return jsonResponse({ success: true, key: publicKeyViewCf(record) });
  }

  if (path.startsWith("/api/admin/book-keys/") && method === "DELETE") {
    const keyId = path.split("/")[4];
    const keys = getBookKeys();
    const before = keys.length;
    const remaining = keys.filter((k: any) => k.id !== keyId);
    if (remaining.length === before) {
      return jsonResponse({ error: "Key not found." }, 404);
    }
    runtimeBookKeys = remaining;
    return jsonResponse({ success: true });
  }

  // 11c. Admin "Sync now": POST /api/admin/sync. Rebuilds the saved
  // catalog from a fresh live listing of the Drive folder. When Drive is
  // not configured this returns a clear 503, never a crash.
  if (path === "/api/admin/sync" && method === "POST") {
    try {
      const result = await runDriveSyncCf(driveConfig);
      if (!result.ok) {
        return jsonResponse({ success: false, configured: result.configured, error: result.error || "Drive sync failed." }, 503);
      }
      return jsonResponse({ success: true, ...result });
    } catch (err: any) {
      return jsonResponse({ success: false, error: `Drive sync failed: ${err?.message || err}` }, 500);
    }
  }

  // 11d. Admin reorder: arrange books by topic/category in one call.
  // Same shape as the Express twin in server/app.ts. Folders untouched.
  if (path === '/api/admin/reorder' && method === 'POST') {
    try {
      const token = getAdminTokenFromRequest(request);
      const isAdmin = await verifySessionToken(token, sessionSecret);
      if (!isAdmin) {
        return jsonResponse({ success: false, error: 'Unauthorized access. Administrator login required.' }, 401);
      }
      const body = (await request.json()) as any;
      const catalog = await getCatalogData(driveConfig);
      const bookOrders = Array.isArray(body?.bookOrders) ? body.bookOrders : [];
      const byId = new Map((catalog.books || []).map((b: any) => [b.id, b]));
      let updated = 0;
      for (const order of bookOrders) {
        const book: any = order && byId.get(order.id);
        if (!book) continue;
        if (typeof order.sortOrder === 'number') book.sortOrder = order.sortOrder;
        if (typeof order.topic === 'string') book.topic = order.topic.trim();
        if (typeof order.category === 'string' && order.category.trim()) book.category = order.category.trim();
        if (typeof order.isAuthentic === 'boolean') book.isAuthentic = order.isAuthentic;
        book.updatedDate = new Date().toISOString();
        updated++;
      }
      if (Array.isArray(body?.categoryOrder)) {
        catalog.categoryOrder = body.categoryOrder.filter((n: any) => typeof n === 'string');
      }
      if (Array.isArray(body?.topicOrder)) {
        catalog.topicOrder = body.topicOrder.filter((n: any) => typeof n === 'string');
      }
      await saveCatalogData(catalog, driveConfig);
      return jsonResponse({ success: true, updated });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || 'Failed to save the new order.' }, 500);
    }
  }

  // 12. Admin File Upload: POST /api/admin/upload
  if (path === "/api/admin/upload" && method === "POST") {
    try {
      const contentType = request.headers.get("content-type") || "";

      let filename = "uploaded-file.pdf";
      let mimeType = "application/pdf";
      let fileBytes: Uint8Array;
      let targetFolderId: string | undefined = undefined;

      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
          return jsonResponse({ success: false, error: "No file uploaded in form data." }, 400);
        }
        targetFolderId = (formData.get("folderId") as string) || undefined;
        filename = file.name || filename;
        mimeType = file.type || getMimeType(filename);
        const arrayBuffer = await file.arrayBuffer();
        fileBytes = new Uint8Array(arrayBuffer);
      } else {
        const jsonBody = (await request.json()) as {
          filename?: string;
          mimeType?: string;
          folderId?: string;
          base64Data?: string;
        };
        filename = jsonBody.filename || filename;
        mimeType = jsonBody.mimeType || getMimeType(filename);
        targetFolderId = jsonBody.folderId || undefined;
        if (jsonBody.base64Data) {
          const base64Clean = jsonBody.base64Data.replace(/^data:[^;]+;base64,/, "");
          const binaryStr = atob(base64Clean);
          fileBytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            fileBytes[i] = binaryStr.charCodeAt(i);
          }
        } else {
          return jsonResponse({ success: false, error: "No file or base64Data provided." }, 400);
        }
      }

      if (isDriveConfigured(driveConfig)) {
        const driveResult = await uploadBinaryToDriveCf(filename, mimeType, fileBytes, driveConfig, targetFolderId);
        const fileUrl = `/api/drive/file/${driveResult.fileId}`;
        return jsonResponse({
          success: true,
          fileUrl,
          driveFileId: driveResult.fileId,
          filename,
          mimeType,
          sizeBytes: fileBytes.length,
          size: `${(fileBytes.length / (1024 * 1024)).toFixed(2)} MB`,
        });
      }

      // Fallback if Drive is not configured
      return jsonResponse({
        success: false,
        error: "Google Drive is not configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID in Cloudflare secrets.",
      }, 503);
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Upload failed." }, 500);
    }
  }

  // 13. Admin Chunk Upload: POST /api/admin/upload/chunk
  if (path === "/api/admin/upload/chunk" && method === "POST") {
    try {
      const formData = await request.formData();
      const sessionId = formData.get("sessionId") as string;
      const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10);
      const totalChunks = parseInt(formData.get("totalChunks") as string, 10);
      const chunkFile = formData.get("chunk") as File | null;
      const metadataStr = formData.get("metadata") as string;

      if (!sessionId || isNaN(chunkIndex) || !chunkFile) {
        return jsonResponse({ success: false, error: "Invalid chunk upload payload." }, 400);
      }

      let session = chunkSessions.get(sessionId);
      if (!session) {
        session = {
          chunks: new Map(),
          metadata: metadataStr ? JSON.parse(metadataStr) : {},
        };
        chunkSessions.set(sessionId, session);
      }

      const chunkBuffer = await chunkFile.arrayBuffer();
      session.chunks.set(chunkIndex, new Uint8Array(chunkBuffer));

      return jsonResponse({
        success: true,
        sessionId,
        chunkIndex,
        receivedChunks: session.chunks.size,
        totalChunks,
      });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Chunk upload failed." }, 500);
    }
  }

  // 14. Admin Chunk Complete: POST /api/admin/upload/complete
  if (path === "/api/admin/upload/complete" && method === "POST") {
    try {
      const body = (await request.json()) as {
        sessionId: string;
        filename?: string;
        mimeType?: string;
        folderId?: string;
      };
      const sessionId = body.sessionId;
      const session = chunkSessions.get(sessionId);

      if (!session) {
        return jsonResponse({ success: false, error: "Upload session not found or expired." }, 404);
      }

      const totalChunks = session.chunks.size;
      let totalLength = 0;
      for (let i = 0; i < totalChunks; i++) {
        const chunk = session.chunks.get(i);
        if (!chunk) {
          return jsonResponse({ success: false, error: `Missing chunk index ${i}` }, 400);
        }
        totalLength += chunk.length;
      }

      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (let i = 0; i < totalChunks; i++) {
        const chunk = session.chunks.get(i)!;
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      chunkSessions.delete(sessionId);

      const filename = session.metadata?.filename || body.filename || "file.pdf";
      const mimeType = session.metadata?.mimeType || body.mimeType || getMimeType(filename);
      const targetFolderId = session.metadata?.folderId || body.folderId || undefined;

      if (isDriveConfigured(driveConfig)) {
        const driveResult = await uploadBinaryToDriveCf(filename, mimeType, combined, driveConfig, targetFolderId);
        const fileUrl = `/api/drive/file/${driveResult.fileId}`;
        return jsonResponse({
          success: true,
          fileUrl,
          driveFileId: driveResult.fileId,
          filename,
          mimeType,
          sizeBytes: combined.length,
          size: `${(combined.length / (1024 * 1024)).toFixed(2)} MB`,
        });
      }

      return jsonResponse({
        success: false,
        error: "Google Drive is not configured for persistent chunk assembly.",
      }, 503);
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Complete assembly failed." }, 500);
    }
  }

  // 14.1 Admin URL Import Probe: POST /api/admin/import-url/probe
  if (path === "/api/admin/import-url/probe" && method === "POST") {
    try {
      const body = (await request.json()) as { url?: string };
      const rawUrl = (body.url || "").trim();
      if (!rawUrl) {
        return jsonResponse({ success: false, error: "A valid URL is required." }, 400);
      }

      let currentUrl = rawUrl;
      let redirectCount = 0;
      let finalHeaders: Record<string, string> = {};
      let finalStatus = 0;
      let finalUrl = currentUrl;

      while (redirectCount <= 5) {
        let parsed: URL;
        try {
          parsed = new URL(currentUrl);
        } catch {
          return jsonResponse({ success: false, error: "Invalid URL format." }, 400);
        }

        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return jsonResponse({ success: false, error: "Only HTTP and HTTPS URLs are allowed." }, 400);
        }

        const host = parsed.hostname.toLowerCase();
        if (
          ["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal", "169.254.169.254"].includes(host) ||
          host.endsWith(".local") ||
          host.endsWith(".internal") ||
          host.endsWith(".localhost") ||
          /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|169\.254\.|100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\.)/.test(host)
        ) {
          return jsonResponse({ success: false, error: "Access to private or local addresses is prohibited." }, 403);
        }

        finalUrl = currentUrl;
        const res = await fetch(currentUrl, {
          method: "HEAD",
          headers: { "User-Agent": "KhafiLibrary/2.0", Accept: "*/*" },
          redirect: "manual",
        });

        finalStatus = res.status;
        res.headers.forEach((val, key) => {
          finalHeaders[key.toLowerCase()] = val;
        });

        if ([301, 302, 303, 307, 308].includes(finalStatus)) {
          const loc = res.headers.get("location");
          if (!loc) {
            return jsonResponse({ success: false, error: "Redirect without Location header." }, 400);
          }
          currentUrl = new URL(loc, currentUrl).href;
          redirectCount++;
          continue;
        }

        break;
      }

      if (finalStatus < 200 || finalStatus >= 400) {
        return jsonResponse({ success: false, error: `Remote server returned HTTP ${finalStatus}.` }, 400);
      }

      const cd = finalHeaders["content-disposition"] || "";
      const ct = (finalHeaders["content-type"] || "application/octet-stream").split(";")[0].toLowerCase().trim();
      const cl = finalHeaders["content-length"] ? parseInt(finalHeaders["content-length"], 10) : 0;

      let detectedFilename = "file.pdf";
      const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
      if (match && match[1]) {
        detectedFilename = decodeURIComponent(match[1].trim());
      } else {
        const parsedPath = new URL(finalUrl).pathname;
        const base = parsedPath.split("/").pop();
        if (base) detectedFilename = decodeURIComponent(base);
      }

      detectedFilename = detectedFilename.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "imported_file.pdf";
      const rawTitle = detectedFilename.replace(/\.[^/.]+$/, "");
      const title = rawTitle.replace(/[-_]/g, " ").trim() || detectedFilename;

      return jsonResponse({
        success: true,
        url: rawUrl,
        finalUrl,
        filename: detectedFilename,
        title,
        mimeType: ct,
        fileType: getMimeType(detectedFilename, ct).includes("pdf") ? "pdf" : "document",
        sizeBytes: cl,
        fileSize: cl > 0 ? `${(cl / (1024 * 1024)).toFixed(2)} MB` : "Unknown size",
      });
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Failed to inspect URL." }, 500);
    }
  }

  // 14.2 Admin URL Import Download: POST /api/admin/import-url
  if (path === "/api/admin/import-url" && method === "POST") {
    try {
      const body = (await request.json()) as {
        url?: string;
        filename?: string;
        folderId?: string;
        categoryId?: string;
        subfolderId?: string;
        title?: string;
        author?: string;
        description?: string;
        tags?: string[] | string;
        visible?: boolean;
      };
      const rawUrl = (body.url || "").trim();
      if (!rawUrl) {
        return jsonResponse({ success: false, error: "A valid URL is required." }, 400);
      }

      let currentUrl = rawUrl;
      let redirectCount = 0;
      let finalRes: Response | null = null;
      let finalUrl = currentUrl;

      while (redirectCount <= 5) {
        let parsed: URL;
        try {
          parsed = new URL(currentUrl);
        } catch {
          return jsonResponse({ success: false, error: "Invalid URL format." }, 400);
        }

        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return jsonResponse({ success: false, error: "Only HTTP and HTTPS URLs are allowed." }, 400);
        }

        const host = parsed.hostname.toLowerCase();
        if (
          ["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal", "169.254.169.254"].includes(host) ||
          host.endsWith(".local") ||
          host.endsWith(".internal") ||
          host.endsWith(".localhost") ||
          /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|169\.254\.|100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\.)/.test(host)
        ) {
          return jsonResponse({ success: false, error: "Access to private or local addresses is prohibited." }, 403);
        }

        finalUrl = currentUrl;
        const res = await fetch(currentUrl, {
          method: "GET",
          headers: { "User-Agent": "KhafiLibrary/2.0", Accept: "*/*" },
          redirect: "manual",
        });

        if ([301, 302, 303, 307, 308].includes(res.status)) {
          const loc = res.headers.get("location");
          if (!loc) {
            return jsonResponse({ success: false, error: "Redirect without Location header." }, 400);
          }
          currentUrl = new URL(loc, currentUrl).href;
          redirectCount++;
          continue;
        }

        if (!res.ok) {
          return jsonResponse({ success: false, error: `Remote server returned HTTP ${res.status}.` }, 400);
        }

        finalRes = res;
        break;
      }

      if (!finalRes) {
        return jsonResponse({ success: false, error: "Failed to download remote file." }, 400);
      }

      const arrayBuffer = await finalRes.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);
      const ct = (finalRes.headers.get("content-type") || "application/octet-stream").split(";")[0].toLowerCase().trim();

      let filename = body.filename ? String(body.filename).trim() : "";
      if (!filename) {
        const cd = finalRes.headers.get("content-disposition") || "";
        const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1].trim());
        } else {
          const parsedPath = new URL(finalUrl).pathname;
          const base = parsedPath.split("/").pop();
          if (base) filename = decodeURIComponent(base);
        }
      }
      filename = (filename || "file.pdf").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim();

      const mimeType = ct || getMimeType(filename);
      const targetFolderId = body.folderId || body.categoryId || undefined;
      const targetSubfolderId = body.subfolderId || undefined;

      if (isDriveConfigured(driveConfig)) {
        const driveResult = await uploadBinaryToDriveCf(filename, mimeType, fileBytes, driveConfig, targetFolderId);
        const fileUrl = `/api/drive/file/${driveResult.fileId}`;

        const catalog = await getCatalogData(driveConfig);
        const targetFolder = (catalog.folders || []).find((f: any) => f.id === targetFolderId);

        const bookId = `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const rawTitle = filename.replace(/\.[^/.]+$/, "");
        const cleanTitle = (body.title || "").trim() || rawTitle.replace(/[-_]/g, " ").trim() || filename;
        const cleanAuthor = (body.author || "").trim() || "Unspecified Author";

        const bookToSave: any = {
          id: bookId,
          title: cleanTitle,
          originalFilename: filename,
          author: cleanAuthor,
          description: (body.description || "").trim(),
          folderId: targetFolderId || (catalog.folders?.[0]?.id || "f-general"),
          subfolderId: targetSubfolderId || null,
          category: targetFolder ? targetFolder.name : "General",
          tags: Array.isArray(body.tags) ? body.tags : body.tags ? String(body.tags).split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          fileType: mimeType.includes("pdf") ? "pdf" : "document",
          mimeType,
          fileSize: `${(fileBytes.length / (1024 * 1024)).toFixed(2)} MB`,
          fileUrl,
          pdfUrl: mimeType.includes("pdf") ? fileUrl : undefined,
          driveFileId: driveResult.fileId,
          addedDate: now,
          updatedDate: now,
          visible: body.visible !== undefined ? Boolean(body.visible) : true,
          featured: false,
        };

        catalog.books = [bookToSave, ...(catalog.books || [])];
        await saveCatalogData(catalog, driveConfig);

        return jsonResponse({
          success: true,
          book: sanitizeBook(bookToSave, true),
          folderName: targetFolder ? targetFolder.name : "Library",
        });
      }

      return jsonResponse({
        success: false,
        error: "Google Drive is not configured for persistent file storage.",
      }, 503);
    } catch (err: any) {
      return jsonResponse({ success: false, error: err.message || "Import failed." }, 500);
    }
  }

  // 15. Unknown API route: return JSON 404 (never HTML / 405)
  return jsonResponse({ success: false, error: `API endpoint not found: ${method} ${path}` }, 404);
}
