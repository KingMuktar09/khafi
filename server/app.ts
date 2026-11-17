import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import multer from "multer";
import crypto from "crypto";
import {
  isGoogleDriveConfigured,
  getSharedDriveId,
  isSharedDriveConfigured,
  hasServiceAccountCredentials,
  runDriveDiagnostic,
  getDriveFolderId,
  isValidPrivateKey,
  getDriveClient,
  uploadFileToDrive,
  deleteFileFromDrive,
  syncCatalogWithDrive,
  pullCatalogFromDrive,
  testDriveConnection,
  fetchLiveDriveCatalog,
  createDriveFolder,
  renameDriveFolder,
  invalidateDriveCache,
} from "./drive";
import { initialCatalog } from "./initial-catalog";
import {
  probeRemoteUrl,
  downloadRemoteFileStream,
  sanitizeFilename,
  detectItemTypeFromExtAndMime,
  formatBytes,
} from "./url-importer";
import {
  isNvidiaConfigured,
  isNvidiaMuseConfigured,
  isNvidiaEmbeddingConfigured,
  getNvidiaOrganizerModel,
  getNvidiaMuseModel,
  getNvidiaEmbeddingModel,
  extractDocumentText,
  generateNemotronEmbedding,
  createOrganizationProposal,
  getPendingProposals,
  getAllProposals,
  rejectProposal,
  rejectMultipleProposals,
  applyApprovedProposal,
  calculateCosineSimilarity,
  runNvidiaDiagnostic,
} from "./ai-organizer";

export const app = express();
export const PORT = 3000;

// Security & Credentials config (Server-Side ONLY - mapped directly to environment secrets)
export function getAdminUsername(): string {
  return (process.env.ADMIN_USERNAME || "Khafi").trim();
}

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || "Alaliyy").trim();
}

export function getAdminPasswordHash(): string {
  return (process.env.ADMIN_PASSWORD_HASH || "").trim();
}

export function getSessionSecret(): string {
  return (process.env.SESSION_SECRET || "bIxUXZwpXKAdyZaqlVjqsOUQIG5vVxPV3tT2F4TFIvelgr4p/SoQlXPyLg9vTH8k").trim();
}

// Store active admin sessions in server memory
const activeSessions = new Set<string>();

export function generateSessionToken(): string {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(randomBytes).digest("hex");
  return `${randomBytes}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  if (activeSessions.has(token)) return true;

  try {
    const parts = token.split(".");
    if (parts.length === 2) {
      const [randomBytes, signature] = parts;
      const expectedSignature = crypto.createHmac("sha256", getSessionSecret()).update(randomBytes).digest("hex");
      if (signature.length === expectedSignature.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        activeSessions.add(token);
        return true;
      }
    }
  } catch (err) {
    // ignore malformed tokens
  }
  return false;
}

export function extractAdminToken(req: express.Request): string | undefined {
  const headerToken = req.headers["x-admin-token"];
  if (typeof headerToken === "string" && headerToken) return headerToken;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return req.cookies?.khafi_admin_session;
}

export function verifyAdminRequest(req: express.Request): boolean {
  const token = extractAdminToken(req);
  return verifySessionToken(token);
}

// Ensure data and uploads directories exist (using /tmp on serverless environments like Vercel)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const baseDataDir = isServerless ? "/tmp" : process.cwd();

export const dataDir = isServerless ? path.join(baseDataDir, "khafi-data") : path.join(process.cwd(), "data");
export const catalogFilePath = path.join(dataDir, "catalog.json");
export const paymentSettingsFilePath = path.join(dataDir, "payment-settings.json");
export const uploadsDir = isServerless ? path.join(baseDataDir, "khafi-uploads") : path.join(process.cwd(), "public", "uploads");
export const samplePdfDir = path.join(process.cwd(), "public", "sample-pdfs");
export const uploadSessionsDir = path.join(dataDir, "upload-sessions");

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(uploadSessionsDir)) {
    fs.mkdirSync(uploadSessionsDir, { recursive: true });
  }
  if (!isServerless && !fs.existsSync(samplePdfDir)) {
    fs.mkdirSync(samplePdfDir, { recursive: true });
  }
} catch (dirErr) {
  console.warn("Notice initializing storage directories:", dirErr);
}

// Generate a valid minimal PDF file for sample reading if missing
const samplePdfPath = path.join(samplePdfDir, "sample-reading.pdf");
try {
  if (!fs.existsSync(samplePdfPath) && fs.existsSync(samplePdfDir)) {
    const minimalPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length 215 >>
stream
BT
/F1 24 Tf
50 720 Td
(Ilm-e-Ghayb Library) Tj
0 -36 Td
/F1 14 Tf
(A Private Space for Ilm) Tj
0 -40 Td
/F1 12 Tf
(Welcome to the digital preservation of classical knowledge.) Tj
0 -20 Td
(This is a clean, readable PDF document rendered inside the reader.) Tj
0 -20 Td
(Knowledge is light, and reading is the key to understanding.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000222 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
572
%%EOF`;
    fs.writeFileSync(samplePdfPath, minimalPdf, "utf8");
  }
} catch (sampleErr) {
  // Read-only filesystem in some serverless environments
}

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
});

// Helper to read catalog
export function readCatalog() {
  try {
    if (fs.existsSync(catalogFilePath)) {
      const content = fs.readFileSync(catalogFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        const books = Array.isArray(parsed.books) ? parsed.books : [];
        const folders = Array.isArray(parsed.folders) ? parsed.folders : [];
        if (books.length > 0 || folders.length > 0) {
          return { folders, books };
        }
      }
    }
  } catch (err) {
    console.error("Error reading catalog from primary path:", err);
  }

  // Fallback: check project root data/catalog.json if catalogFilePath in /tmp didn't have data
  try {
    const rootCatalogPath = path.join(process.cwd(), "data", "catalog.json");
    if (fs.existsSync(rootCatalogPath)) {
      const content = fs.readFileSync(rootCatalogPath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        const books = Array.isArray(parsed.books) ? parsed.books : [];
        const folders = Array.isArray(parsed.folders) ? parsed.folders : [];
        if (books.length > 0 || folders.length > 0) {
          return { folders, books };
        }
      }
    }
  } catch (err) {
    console.error("Error reading fallback root catalog:", err);
  }

  // Fallback: initialCatalog if available
  if (initialCatalog && (initialCatalog.folders?.length > 0 || initialCatalog.books?.length > 0)) {
    return initialCatalog;
  }

  return { folders: [], books: [] };
}

// Helper to write catalog
export function writeCatalog(data: any) {
  try {
    fs.writeFileSync(catalogFilePath, JSON.stringify(data, null, 2), "utf8");
    if (isGoogleDriveConfigured()) {
      syncCatalogWithDrive(data, catalogFilePath).catch((err) => {
        console.warn("Async Google Drive catalog sync notice:", err?.message || err);
      });
    }
    return true;
  } catch (err) {
    console.error("Error writing catalog:", err);
    return false;
  }
}

// UPI payment settings (admin-only writes, public reads of the three fields).
// Stored in data/payment-settings.json. All fields are empty by default; the
// admin fills in their own UPI ID / QR. No gateway, no keys, no auto check.
// Note: on serverless (Vercel) writes go to /tmp and do not survive a
// redeploy, so the durable copy is the file committed in the repo.
export const EMPTY_PAYMENT_SETTINGS = { upiId: "", upiQrUrl: "", displayName: "" };

export function readPaymentSettings() {
  const pick = (filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (err) {
      console.error("Error reading payment settings:", err);
    }
    return null;
  };
  const fromDataDir = pick(paymentSettingsFilePath);
  if (fromDataDir) {
    return {
      upiId: typeof fromDataDir.upiId === "string" ? fromDataDir.upiId.trim() : "",
      upiQrUrl: typeof fromDataDir.upiQrUrl === "string" ? fromDataDir.upiQrUrl.trim() : "",
      displayName: typeof fromDataDir.displayName === "string" ? fromDataDir.displayName.trim() : "",
    };
  }
  const fromRoot = pick(path.join(process.cwd(), "data", "payment-settings.json"));
  if (fromRoot) {
    return {
      upiId: typeof fromRoot.upiId === "string" ? fromRoot.upiId.trim() : "",
      upiQrUrl: typeof fromRoot.upiQrUrl === "string" ? fromRoot.upiQrUrl.trim() : "",
      displayName: typeof fromRoot.displayName === "string" ? fromRoot.displayName.trim() : "",
    };
  }
  return { ...EMPTY_PAYMENT_SETTINGS };
}

export function writePaymentSettings(data: any) {
  const clean = {
    upiId: typeof data?.upiId === "string" ? data.upiId.trim().slice(0, 100) : "",
    upiQrUrl: typeof data?.upiQrUrl === "string" ? data.upiQrUrl.trim().slice(0, 500) : "",
    displayName: typeof data?.displayName === "string" ? data.displayName.trim().slice(0, 100) : "",
  };
  try {
    fs.writeFileSync(paymentSettingsFilePath, JSON.stringify(clean, null, 2), "utf8");
    return clean;
  } catch (err) {
    console.error("Error writing payment settings:", err);
    return null;
  }
}

// Helper to extract Google Drive file ID
export function extractDriveFileId(urlOrId?: string): string | null {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const clean = urlOrId.split("?")[0].replace(/\/(preview|stream|pdf|file|download)$/i, "").trim();
  if (clean.startsWith("/api/drive/file/")) return clean.replace("/api/drive/file/", "");
  if (clean.startsWith("/drive/file/")) return clean.replace("/drive/file/", "");
  if (clean.startsWith("/api/files/")) return clean.replace("/api/files/", "");
  if (clean.startsWith("/files/")) return clean.replace("/files/", "");
  if (clean.startsWith("/api/pdf/")) return clean.replace("/api/pdf/", "");
  if (clean.startsWith("/pdf/")) return clean.replace("/pdf/", "");
  const match = urlOrId.match(/\/d\/([a-zA-Z0-9_-]+)/) || urlOrId.match(/id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(clean)) return clean;
  return null;
}

// Express setup
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cookieParser());

// Global CORS & OPTIONS Preflight handler
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range, Authorization, Content-Type, Accept, Origin, x-admin-token");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type"
  );
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    res.sendStatus(204);
    return;
  }
  next();
});

// Vercel & Serverless Request Path Normalization Middleware
// ONLY rewrites if invoked via Vercel's rewrite query param (?__path=...) or direct serverless handler entry
app.use((req, res, next) => {
  try {
    const rawUrl = req.url || "/";
    const parsed = new URL(rawUrl, "http://localhost");

    // Check if original path was passed as a query param from Vercel rewrite (e.g. /api/index?__path=catalog)
    const qPath =
      parsed.searchParams.get("__path") ||
      (req as any).query?.__path;

    if (qPath && typeof qPath === "string") {
      let subpath = qPath.startsWith("/") ? qPath : `/${qPath}`;
      parsed.searchParams.delete("__path");
      parsed.searchParams.delete("path");
      const targetApi = subpath.startsWith("/api") ? subpath : `/api${subpath}`;
      const newSearch = parsed.searchParams.toString();
      req.url = targetApi + (newSearch ? `?${newSearch}` : "");
      return next();
    }

    // Handle direct Vercel serverless /api/index or /api/index.ts calls
    if (parsed.pathname === "/api/index" || parsed.pathname === "/api/index.ts" || parsed.pathname === "/api/index.js") {
      const newSearch = parsed.searchParams.toString();
      req.url = "/api/health" + (newSearch ? `?${newSearch}` : "");
      return next();
    }
  } catch (err) {
    console.error("Vercel path normalization error:", err);
  }
  next();
});

// Handle JSON parsing syntax errors gracefully - ALWAYS return valid JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ success: false, error: "Invalid JSON format in request body." });
    return;
  }
  next(err);
});

// Helper to determine exact MIME type for binary files
export function getMimeType(filePath: string, catalogMime?: string): string {
  if (catalogMime && catalogMime.includes("/")) return catalogMime;
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  switch (ext) {
    case "pdf": return "application/pdf";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc": return "application/msword";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls": return "application/vnd.ms-excel";
    case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "ppt": return "application/vnd.ms-powerpoint";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "webp": return "image/webp";
    case "gif": return "image/gif";
    case "svg": return "image/svg+xml";
    case "mp4": return "video/mp4";
    case "webm": return "video/webm";
    case "mp3": return "audio/mpeg";
    case "wav": return "audio/wav";
    case "zip": return "application/zip";
    case "rar": return "application/vnd.rar";
    case "7z": return "application/x-7z-compressed";
    case "txt": return "text/plain";
    case "epub": return "application/epub+zip";
    default: return "application/octet-stream";
  }
}

// Serve static public assets (uploads & sample pdfs)
const servePdfOptions: Parameters<typeof express.static>[1] = {
  setHeaders: (res, filePath) => {
    const mime = getMimeType(filePath);
    res.setHeader("Content-Type", mime);
    if (filePath.toLowerCase().endsWith(".pdf")) {
      res.setHeader("Content-Disposition", "inline");
    }
  },
};

app.use("/uploads", express.static(uploadsDir, servePdfOptions));
app.use("/sample-pdfs", express.static(samplePdfDir, servePdfOptions));

// 404 JSON handler for missing static upload files (prevents falling through to index.html SPA)
app.use(["/uploads/*", "/sample-pdfs/*"], (req, res) => {
  res.status(404).json({ error: "File not found on server" });
});

// API Routes
// 1. Check health
app.get(["/api/health", "/api"], (req, res) => {
  res.json({
    status: "ok",
    app: "Ilm-e-Ghayb Library",
    runtime: isServerless ? "vercel-serverless" : "node-express",
  });
});

// Public library status: honest, no secrets. Reports whether the live Drive
// sync is configured, and that the catalog served is the Islamic Library
// collection only (Drive links, no files stored here).
app.get(["/api/library-status", "/library-status"], (req, res) => {
  const catalog = readCatalog();
  const folders = catalog.folders || [];
  const books = catalog.books || [];
  const driveConfigured = isGoogleDriveConfigured();
  res.json({
    status: "ok",
    library: "Ilm-e-Ghayb Library",
    brand: "Ghayb Chronicles",
    driveFolder: "Islamic Library only",
    driveFolderId: getDriveFolderId(),
    driveConfigured,
    mode: driveConfigured ? "drive-sync" : "catalog-links",
    modeNote: driveConfigured
      ? "Live Google Drive sync is configured."
      : "Drive sync is not configured. The library serves its saved catalog and books open in Google Drive.",
    categories: folders.filter((f: any) => {
      const roots = new Set(folders.filter((r: any) => !r.parentId).map((r: any) => r.id));
      return f.parentId && roots.has(f.parentId);
    }).length,
    folders: folders.length,
    books: books.length,
    paidBooks: books.filter((b: any) => b.isPaid).length,
  });
});

// Public UPI payment settings (the three admin-set fields only, may be empty).
app.get(["/api/payment-settings", "/payment-settings"], (req, res) => {
  res.json(readPaymentSettings());
});

// Admin-only: save UPI payment settings.
app.post(["/api/admin/payment-settings", "/admin/payment-settings"], requireAdmin, (req, res) => {
  const saved = writePaymentSettings(req.body || {});
  if (!saved) {
    res.status(500).json({ error: "Failed to save payment settings." });
    return;
  }
  res.json({ success: true, settings: saved });
});

// 1.1 Diagnostics endpoint
app.get(["/api/diagnostics", "/diagnostics"], async (req, res) => {
  const isAdmin = verifyAdminRequest(req);
  if (!isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const isConfigured = isGoogleDriveConfigured();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "";
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || "";

  let driveTest: any = null;
  if (isConfigured) {
    driveTest = await testDriveConnection();
  }

  res.json({
    status: "ok",
    runtime: isServerless ? "vercel-serverless" : "node-express",
    timestamp: new Date().toISOString(),
    environment: {
      hasEmail: Boolean(email),
      hasPrivateKey: Boolean(rawKey),
      isPrivateKeyValid: isValidPrivateKey(rawKey),
      hasFolderId: Boolean(getDriveFolderId()),
      hasAdminUsername: Boolean(process.env.ADMIN_USERNAME),
      hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
      hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    },
    drive: driveTest,
  });
});

// 1.1b Dedicated Google Drive Shared Drive Diagnostic Endpoint
app.get(["/api/admin/drive/diagnostic", "/admin/drive/diagnostic"], requireAdmin, async (req, res) => {
  try {
    const diagnostic = await runDriveDiagnostic();
    res.json({
      success: true,
      ...diagnostic,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || "Failed to execute Google Drive diagnostic test.",
    });
  }
});

// 1.2 Google Drive Streaming & Reading Endpoint
export const handleDriveFileStream = async (req: express.Request, res: express.Response) => {
  const rawParam = req.params.fileId || req.params.id || req.params[0] || req.path || "";
  
  // Clean rawParam to strip route prefixes and trailing action tokens like /preview, /stream, /pdf, /file, /download
  let cleanId = rawParam
    .split("?")[0]
    .replace(/^.*\/api\/(files|drive\/file|pdf|books)\//i, "")
    .replace(/^.*\/(files|drive\/file|pdf|books)\//i, "")
    .replace(/\/(preview|stream|pdf|file|download)$/i, "")
    .replace(/^\//, "")
    .trim();

  let localFilePath: string | null = null;
  let customFilename = "";
  let driveFileId: string | null = null;

  const catalog = readCatalog();
  
  // 1. Look up catalog book by ID, cleanId, or driveFileId
  let book = (catalog.books || []).find(
    (b: any) =>
      b.id === cleanId ||
      b.id === req.params.id ||
      b.id === req.params.fileId ||
      b.driveFileId === cleanId
  );

  if (!book && isGoogleDriveConfigured()) {
    try {
      const liveCatalog = await fetchLiveDriveCatalog(catalog);
      book = (liveCatalog.books || []).find(
        (b: any) =>
          b.id === cleanId ||
          b.id === req.params.id ||
          b.id === req.params.fileId ||
          b.driveFileId === cleanId
      );
    } catch {}
  }

  // Fallback lookup by title or original filename if exact ID match failed
  if (!book) {
    book = (catalog.books || []).find(
      (b: any) =>
        (b.title && b.title.toLowerCase() === cleanId.toLowerCase()) ||
        (b.originalFilename && b.originalFilename.toLowerCase() === cleanId.toLowerCase())
    );
  }

  if (book) {
    driveFileId = book.driveFileId || extractDriveFileId(book.fileUrl || book.pdfUrl || book.driveUrl);
    customFilename = book.originalFilename || `${book.title || "book"}.pdf`;
    if (!driveFileId && book.fileUrl) {
      if (book.fileUrl.startsWith("/sample-pdfs/")) {
        localFilePath = path.join(samplePdfDir, path.basename(book.fileUrl));
      } else if (book.fileUrl.startsWith("/uploads/")) {
        localFilePath = path.join(uploadsDir, path.basename(book.fileUrl));
      } else if (fs.existsSync(book.fileUrl)) {
        localFilePath = book.fileUrl;
      }
    }
  }

  if (!driveFileId && !localFilePath) {
    if (/^[a-zA-Z0-9_-]{20,}$/.test(cleanId)) {
      driveFileId = cleanId;
    } else if (cleanId.includes("sample-pdfs") || cleanId.includes("sample-reading")) {
      localFilePath = path.join(samplePdfDir, path.basename(cleanId));
    } else if (cleanId.includes("uploads/")) {
      localFilePath = path.join(uploadsDir, path.basename(cleanId));
    }
  }

  // 2. Stream local file if localFilePath exists on disk
  if (localFilePath && fs.existsSync(localFilePath)) {
    const stat = fs.statSync(localFilePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const mime = getMimeType(localFilePath);

    const headers: Record<string, string> = {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=86400",
      "Accept-Ranges": "bytes",
      "Content-Disposition": "inline",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Authorization, Content-Type, Accept, Origin, x-admin-token",
      "Access-Control-Expose-Headers": "Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type",
    };

    if (req.method === "HEAD") {
      headers["Content-Length"] = String(fileSize);
      res.set(headers);
      res.status(200).end();
      return;
    }

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      headers["Content-Range"] = `bytes ${start}-${end}/${fileSize}`;
      headers["Content-Length"] = String(chunksize);
      res.set(headers);
      res.status(206);
      fs.createReadStream(localFilePath, { start, end }).pipe(res);
      console.log(`[LocalStream] path=${localFilePath} rangeRequested=true contentType=${mime} contentLength=${chunksize} returnedStatus=206`);
    } else {
      headers["Content-Length"] = String(fileSize);
      res.set(headers);
      res.status(200);
      fs.createReadStream(localFilePath).pipe(res);
      console.log(`[LocalStream] path=${localFilePath} rangeRequested=false contentType=${mime} contentLength=${fileSize} returnedStatus=200`);
    }
    return;
  }

  // 3. Stream Google Drive file if driveFileId is resolved
  if (driveFileId) {
    const drive = getDriveClient();
    if (!drive) {
      res.status(503).json({ error: "Google Drive is not configured on this server." });
      return;
    }

    try {
      const metaRes = await drive.files.get({
        fileId: driveFileId,
        fields: "id, name, mimeType, size",
        supportsAllDrives: true,
      });
      const { name, mimeType, size } = metaRes.data;

      let computedMime = mimeType || getMimeType(name || "");
      if (!computedMime || computedMime.includes("octet-stream") || (name && name.toLowerCase().endsWith(".pdf"))) {
        computedMime = "application/pdf";
      }

      const headers: Record<string, string> = {
        "Content-Type": computedMime,
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
        "Content-Disposition": "inline",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Authorization, Content-Type, Accept, Origin, x-admin-token",
        "Access-Control-Expose-Headers":
          "Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type",
      };

      if (req.method === "HEAD") {
        if (size) {
          headers["Content-Length"] = String(size);
        }
        res.set(headers);
        res.status(200).end();
        console.log(`[DriveStream] fileId=${driveFileId} method=HEAD contentType=${computedMime} contentLength=${size}`);
        return;
      }

      // Handle Google Workspace native documents by exporting as PDF
      if (mimeType?.startsWith("application/vnd.google-apps.")) {
        computedMime = "application/pdf";
        headers["Content-Type"] = "application/pdf";
        const exportRes = await drive.files.export(
          { fileId: driveFileId, mimeType: "application/pdf" },
          { responseType: "stream" }
        );
        res.set(headers);
        res.status(200);
        exportRes.data.pipe(res);
        return;
      }

      const range = req.headers.range;
      if (range && size) {
        const streamRes = await drive.files.get(
          { fileId: driveFileId, alt: "media", supportsAllDrives: true },
          { responseType: "stream", headers: { Range: range } }
        );

        const returnedStatus = streamRes.status || 206;
        const contentRange = (streamRes.headers as any)?.["content-range"] || (streamRes.headers as any)?.["Content-Range"];
        const contentLength = (streamRes.headers as any)?.["content-length"] || (streamRes.headers as any)?.["Content-Length"];

        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10) || 0;
        const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
        const computedChunkSize = Math.max(0, end - start + 1);

        headers["Content-Range"] = contentRange || `bytes ${start}-${end}/${size}`;
        headers["Content-Length"] = contentLength ? String(contentLength) : String(computedChunkSize);

        res.set(headers);
        res.status(returnedStatus);
        console.log(`[DriveStream] fileId=${driveFileId} rangeRequested=true driveStatus=${returnedStatus} contentType=${computedMime}`);
        streamRes.data.pipe(res);
      } else {
        if (size) {
          headers["Content-Length"] = String(size);
        }
        const streamRes = await drive.files.get(
          { fileId: driveFileId, alt: "media", supportsAllDrives: true },
          { responseType: "stream" }
        );

        const returnedStatus = streamRes.status || 200;
        res.set(headers);
        res.status(returnedStatus);
        console.log(`[DriveStream] fileId=${driveFileId} rangeRequested=false driveStatus=${returnedStatus} contentType=${computedMime}`);
        streamRes.data.pipe(res);
      }
      return;
    } catch (err: any) {
      const errorStatus = err?.status || err?.code || 500;
      console.error(`[DriveStream] Error streaming Drive file ${driveFileId}: status=${errorStatus} message=${err?.message || err}`);
      if (!res.headersSent) {
        res.status(typeof errorStatus === "number" && errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500).json({
          error: `Failed to stream file from Google Drive: ${err?.message || err}`,
          status: errorStatus,
        });
      }
      return;
    }
  }

  res.status(404).json({ error: "Requested PDF file or document could not be located." });
};

const pdfStreamRoutes = [
  "/api/drive/file/:fileId",
  "/api/drive/file/:fileId/*",
  "/drive/file/:fileId",
  "/drive/file/:fileId/*",
  "/api/files/:fileId",
  "/api/files/:fileId/*",
  "/files/:fileId",
  "/files/:fileId/*",
  "/api/pdf/:fileId",
  "/api/pdf/:fileId/*",
  "/pdf/:fileId",
  "/pdf/:fileId/*",
  "/api/books/:id/file",
  "/api/books/:id/preview",
  "/api/books/:id/pdf",
  "/api/books/:id/stream",
  "/books/:id/file",
  "/books/:id/preview",
  "/books/:id/pdf",
  "/books/:id/stream",
];

app.get(pdfStreamRoutes, handleDriveFileStream);
app.head(pdfStreamRoutes, handleDriveFileStream);

// 1.5. Download Binary File Routes
const pdfDownloadRoutes = [
  "/api/books/:id/download",
  "/books/:id/download",
  "/api/files/:fileId/download",
  "/files/:fileId/download",
  "/api/drive/file/:fileId/download",
  "/drive/file/:fileId/download",
];

app.get(pdfDownloadRoutes, async (req, res) => {
  const rawId = req.params.id || req.params.fileId || "";
  const cleanId = rawId.replace(/\/download$/i, "").trim();

  const catalog = readCatalog();
  let book = (catalog.books || []).find(
    (b: any) => b.id === cleanId || b.id === rawId || b.driveFileId === cleanId
  );

  let driveFileId = book?.driveFileId || extractDriveFileId(book?.fileUrl || book?.pdfUrl || book?.driveUrl || cleanId);
  if (!driveFileId && (/^[a-zA-Z0-9_-]{20,}$/.test(cleanId) || cleanId.startsWith("1"))) {
    driveFileId = cleanId;
  }

  // If file is stored on Google Drive, stream download directly
  if (driveFileId && isGoogleDriveConfigured()) {
    const drive = getDriveClient();
    try {
      const meta = await drive.files.get({
        fileId: driveFileId,
        fields: "id, name, mimeType, size",
        supportsAllDrives: true,
      });

      const fileName = meta.data.name || book?.originalFilename || `${book?.title || "book"}.pdf`;
      const ext = path.extname(fileName) || ".pdf";
      let downloadName = book?.originalFilename || "";
      if (!downloadName) {
        let cleanTitle = (book?.title || fileName).replace(/[/\\?%*:|"<>]/g, "_").trim();
        if (cleanTitle.toLowerCase().endsWith(ext.toLowerCase())) {
          downloadName = cleanTitle;
        } else {
          downloadName = `${cleanTitle}${ext}`;
        }
      }

      const mimeType = meta.data.mimeType || getMimeType(fileName, book?.mimeType);
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
      );
      if (meta.data.size) {
        res.setHeader("Content-Length", String(meta.data.size));
      }

      const streamRes = await drive.files.get(
        { fileId: driveFileId, alt: "media", supportsAllDrives: true },
        { responseType: "stream" }
      );
      streamRes.data.pipe(res);
      console.log(`[DriveDownload] fileId=${driveFileId} name="${downloadName}" size=${meta.data.size}`);
      return;
    } catch (driveErr) {
      console.warn(`Drive download stream fallback for ${driveFileId}:`, driveErr);
    }
  }

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  const rawUrl = book.fileUrl || book.pdfUrl || book.driveUrl || "";

  // Local fallback
  let filePath = "";
  if (rawUrl.startsWith("/uploads/")) {
    filePath = path.join(uploadsDir, path.basename(rawUrl));
  } else if (rawUrl.startsWith("/sample-pdfs/")) {
    filePath = path.join(samplePdfDir, path.basename(rawUrl));
  } else {
    filePath = path.join(process.cwd(), "public", rawUrl.replace(/^\//, ""));
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File does not exist on server" });
    return;
  }

  const ext = path.extname(filePath) || ".pdf";
  let downloadName = book.originalFilename || "";
  if (!downloadName) {
    let cleanTitle = (book.title || "download").replace(/[/\\?%*:|"<>]/g, "_").trim();
    if (cleanTitle.toLowerCase().endsWith(ext.toLowerCase())) {
      downloadName = cleanTitle;
    } else {
      downloadName = `${cleanTitle}${ext}`;
    }
  }

  const mimeType = getMimeType(filePath, book.mimeType);
  res.setHeader("Content-Type", mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
  );

  res.sendFile(filePath);
});

app.get(["/api/download", "/download"], async (req, res) => {
  const fileParam = (req.query.file || req.query.path || req.query.url || "") as string;
  const idParam = req.query.id as string;

  const catalog = readCatalog();
  let book: any = null;

  if (idParam) {
    book = (catalog.books || []).find((b: any) => b.id === idParam);
  } else if (fileParam) {
    book = (catalog.books || []).find(
      (b: any) => (b.fileUrl && b.fileUrl.includes(fileParam)) || (b.pdfUrl && b.pdfUrl.includes(fileParam))
    );
  }

  let relPath = fileParam;
  if (!relPath && book) {
    relPath = book.fileUrl || book.pdfUrl || book.driveUrl || "";
  }

  if (!relPath) {
    res.status(400).json({ error: "File path or ID is required" });
    return;
  }

  const driveFileId = book?.driveFileId || extractDriveFileId(relPath);
  if (driveFileId && isGoogleDriveConfigured()) {
    const drive = getDriveClient();
    try {
      const meta = await drive.files.get({
        fileId: driveFileId,
        fields: "id, name, mimeType, size",
        supportsAllDrives: true,
      });

      const fileName = meta.data.name || book?.originalFilename || `${book?.title || "download"}.pdf`;
      const ext = path.extname(fileName) || ".pdf";
      let downloadName = book?.originalFilename || "";
      if (!downloadName) {
        let titleStr = book?.title || fileName;
        titleStr = titleStr.replace(/[/\\?%*:|"<>]/g, "_").trim();
        if (titleStr.toLowerCase().endsWith(ext.toLowerCase())) {
          downloadName = titleStr;
        } else {
          downloadName = `${titleStr}${ext}`;
        }
      }

      const mimeType = meta.data.mimeType || getMimeType(fileName, book?.mimeType);
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
      );
      if (meta.data.size) {
        res.setHeader("Content-Length", String(meta.data.size));
      }

      const streamRes = await drive.files.get(
        { fileId: driveFileId, alt: "media", supportsAllDrives: true },
        { responseType: "stream" }
      );
      streamRes.data.pipe(res);
      return;
    } catch (driveErr) {
      console.warn(`Drive download stream fallback for ${driveFileId}:`, driveErr);
    }
  }

  const fileName = path.basename(relPath);
  let filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(samplePdfDir, fileName);
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "public", relPath.replace(/^\//, ""));
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const ext = path.extname(filePath) || ".pdf";
  let downloadName = book?.originalFilename || "";
  if (!downloadName) {
    let titleStr = book?.title || fileName;
    titleStr = titleStr.replace(/[/\\?%*:|"<>]/g, "_").trim();
    if (titleStr.toLowerCase().endsWith(ext.toLowerCase())) {
      downloadName = titleStr;
    } else {
      downloadName = `${titleStr}${ext}`;
    }
  }

  const mimeType = getMimeType(filePath, book?.mimeType);
  res.setHeader("Content-Type", mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(downloadName)}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`
  );

  res.sendFile(filePath);
});

export function sanitizeBook(book: any) {
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

export function sanitizeFolder(folder: any) {
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

export function sanitizeCatalog(catalog: any) {
  if (!catalog) return { folders: [], books: [] };
  const safeFolders = (catalog.folders || []).map(sanitizeFolder);
  const safeBooks = (catalog.books || []).map(sanitizeBook);
  return {
    folders: safeFolders,
    books: safeBooks,
  };
}

// 2. Public / Guest Catalog endpoint
app.get(["/api/catalog", "/catalog"], async (req, res) => {
  const isAdmin = verifyAdminRequest(req);
  let catalog: any = { folders: [], books: [] };

  if (isGoogleDriveConfigured()) {
    try {
      const local = readCatalog();
      catalog = await fetchLiveDriveCatalog(local);
    } catch (err) {
      console.warn("Live Drive catalog fetch warning, falling back to local:", err);
      catalog = readCatalog();
    }
  } else {
    catalog = readCatalog();
  }

  const safeCatalog = sanitizeCatalog(catalog);

  if (isAdmin) {
    res.json(safeCatalog);
  } else {
    // Filter visible folders & books for normal readers
    const visibleFolders = (safeCatalog.folders || []).filter((f: any) => f.visible !== false);
    const visibleBooks = (safeCatalog.books || []).filter((b: any) => b.visible !== false);
    res.json({
      folders: visibleFolders,
      books: visibleBooks,
    });
  }
});

// 3. Admin Authentication routes
app.post(["/api/admin/login", "/admin/login"], (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, error: "Username and password are required." });
    return;
  }

  const cleanUsername = (username || "").trim();
  const cleanPassword = (password || "").trim();
  const adminUser = getAdminUsername();
  const adminPass = getAdminPassword();
  const adminPassHash = getAdminPasswordHash();
  const passwordHash = crypto.createHash("sha256").update(cleanPassword).digest("hex");

  const isUserValid = cleanUsername.toLowerCase() === adminUser.toLowerCase();
  const isPasswordValid =
    cleanPassword === adminPass ||
    (adminPassHash && (cleanPassword === adminPassHash || passwordHash === adminPassHash.toLowerCase()));

  if (isUserValid && isPasswordValid) {
    const sessionToken = generateSessionToken();
    activeSessions.add(sessionToken);

    res.cookie("khafi_admin_session", sessionToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({ success: true, token: sessionToken, username: adminUser });
  } else {
    res.status(401).json({ success: false, error: "Invalid administrator credentials." });
  }
});

app.post(["/api/admin/logout", "/admin/logout"], (req, res) => {
  const sessionToken = extractAdminToken(req);
  if (sessionToken) {
    activeSessions.delete(sessionToken);
  }
  res.clearCookie("khafi_admin_session");
  res.json({ success: true });
});

app.get(["/api/admin/me", "/admin/me"], (req, res) => {
  const authenticated = verifyAdminRequest(req);
  if (authenticated) {
    res.json({ authenticated: true, username: getAdminUsername() });
  } else {
    res.json({ authenticated: false });
  }
});

// Admin Middleware for protected endpoints
export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (verifyAdminRequest(req)) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access. Administrator login required." });
  }
}

// 4. Admin Book Operations
app.post(["/api/admin/books", "/admin/books"], requireAdmin, (req, res) => {
  const catalog = readCatalog();
  const newBook = req.body;

  if (!newBook.title || !newBook.folderId) {
    res.status(400).json({ error: "Title and folder/category are required." });
    return;
  }

  const bookId = newBook.id || `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const bookToSave = {
    ...newBook,
    id: bookId,
    author: (newBook.author && newBook.author.trim()) ? newBook.author.trim() : "Unspecified Author",
    addedDate: newBook.addedDate || now,
    updatedDate: now,
    featured: Boolean(newBook.featured),
    visible: newBook.visible !== undefined ? Boolean(newBook.visible) : true,
    tags: Array.isArray(newBook.tags) ? newBook.tags : (newBook.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
  };

  catalog.books = catalog.books || [];
  catalog.books.unshift(bookToSave);

  if (writeCatalog(catalog)) {
    res.json({ success: true, book: sanitizeBook(bookToSave) });
  } else {
    res.status(500).json({ error: "Failed to save book to storage." });
  }
});

app.put(["/api/admin/books/:id", "/admin/books/:id"], requireAdmin, (req, res) => {
  const catalog = readCatalog();
  const bookId = req.params.id;
  const index = (catalog.books || []).findIndex((b: any) => b.id === bookId);

  if (index === -1) {
    res.status(404).json({ error: "Book not found." });
    return;
  }

  const updatedBook = {
    ...catalog.books[index],
    ...req.body,
    updatedDate: new Date().toISOString(),
    tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
  };

  catalog.books[index] = updatedBook;

  if (writeCatalog(catalog)) {
    res.json({ success: true, book: sanitizeBook(updatedBook) });
  } else {
    res.status(500).json({ error: "Failed to update book." });
  }
});

app.delete(["/api/admin/books/:id", "/admin/books/:id"], requireAdmin, (req, res) => {
  const catalog = readCatalog();
  const bookId = req.params.id;
  const bookToDelete = (catalog.books || []).find((b: any) => b.id === bookId);

  if (!bookToDelete) {
    res.status(404).json({ error: "Book not found." });
    return;
  }

  // Catalog-only delete, by design. Removing a book here removes it from
  // the library catalog ONLY. The file in Google Drive is never deleted by
  // this endpoint, so an admin cannot wipe a Drive book by accident. To
  // remove the Drive file itself, delete it separately in Google Drive.
  catalog.books = (catalog.books || []).filter((b: any) => b.id !== bookId);

  if (writeCatalog(catalog)) {
    res.json({ success: true, id: bookId });
  } else {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

// 4.5 Admin Google Drive Diagnostics Endpoint
app.get(["/api/admin/drive/status", "/admin/drive/status"], requireAdmin, async (req, res) => {
  try {
    const status = await testDriveConnection();
    res.json({ success: true, ...status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to check Drive status." });
  }
});

// 5. Admin Folder Operations
app.post(["/api/admin/folders", "/admin/folders"], requireAdmin, async (req, res) => {
  const { name, description, parentId, type, sortOrder, visible } = req.body;

  if (!name) {
    res.status(400).json({ error: "Folder name is required." });
    return;
  }

  let folderId = req.body.id || `f-${Date.now()}`;
  let finalParentId = parentId || null;

  if (isGoogleDriveConfigured()) {
    try {
      const driveFolder = await createDriveFolder(name, parentId, description);
      folderId = driveFolder.id;
      finalParentId = driveFolder.parentId;
    } catch (err: any) {
      console.error("Failed to create folder in Drive:", err);
      res.status(500).json({ error: `Failed to create folder in Google Drive: ${err?.message || err}` });
      return;
    }
  }

  const catalog = readCatalog();
  const now = new Date().toISOString();
  const folderOrder = sortOrder !== undefined ? Number(sortOrder) : (catalog.folders || []).length + 1;

  const newFolder = {
    id: folderId,
    name,
    description: description || "",
    parentId: finalParentId,
    type: type || (finalParentId ? "subfolder" : "category"),
    sortOrder: folderOrder,
    order: folderOrder,
    visible: visible !== undefined ? Boolean(visible) : true,
    createdAt: now,
    updatedAt: now,
  };

  catalog.folders = catalog.folders || [];
  const existingIdx = catalog.folders.findIndex((f: any) => f.id === folderId);
  if (existingIdx >= 0) {
    catalog.folders[existingIdx] = newFolder;
  } else {
    catalog.folders.push(newFolder);
  }

  if (writeCatalog(catalog)) {
    invalidateDriveCache();
    res.json({ success: true, folder: sanitizeFolder(newFolder) });
  } else {
    res.status(500).json({ error: "Failed to save folder." });
  }
});

app.put(["/api/admin/folders/:id", "/admin/folders/:id"], requireAdmin, async (req, res) => {
  const folderId = req.params.id;
  const { name, description } = req.body;

  if (isGoogleDriveConfigured() && name) {
    try {
      await renameDriveFolder(folderId, name, description);
    } catch (err) {
      console.warn("Drive rename warning:", err);
    }
  }

  const catalog = readCatalog();
  const index = (catalog.folders || []).findIndex((f: any) => f.id === folderId);
  const now = new Date().toISOString();

  let updatedFolder: any;
  if (index >= 0) {
    const current = catalog.folders[index];
    updatedFolder = {
      ...current,
      ...req.body,
      name: req.body.name !== undefined ? req.body.name : current.name,
      description: req.body.description !== undefined ? req.body.description : current.description,
      parentId: req.body.parentId !== undefined ? req.body.parentId : current.parentId,
      type: req.body.type !== undefined ? req.body.type : (current.type || (req.body.parentId ? "subfolder" : "category")),
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : (current.sortOrder ?? current.order ?? 1),
      order: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : (current.order ?? current.sortOrder ?? 1),
      visible: req.body.visible !== undefined ? Boolean(req.body.visible) : (current.visible ?? true),
      updatedAt: now,
    };
    catalog.folders[index] = updatedFolder;
  } else {
    updatedFolder = {
      id: folderId,
      name: name || "Folder",
      description: description || "",
      ...req.body,
      updatedAt: now,
    };
    catalog.folders = catalog.folders || [];
    catalog.folders.push(updatedFolder);
  }

  if (writeCatalog(catalog)) {
    invalidateDriveCache();
    res.json({ success: true, folder: sanitizeFolder(updatedFolder) });
  } else {
    res.status(500).json({ error: "Failed to update folder." });
  }
});

app.delete(["/api/admin/folders/:id", "/admin/folders/:id"], requireAdmin, async (req, res) => {
  const folderId = req.params.id;

  if (isGoogleDriveConfigured()) {
    try {
      const liveCatalog = await fetchLiveDriveCatalog(readCatalog());
      const childFolders = (liveCatalog.folders || []).filter((f: any) => f.parentId === folderId);
      const childBooks = (liveCatalog.books || []).filter(
        (b: any) => b.folderId === folderId || b.subfolderId === folderId
      );
      const totalItems = childFolders.length + childBooks.length;

      if (totalItems > 0) {
        res.status(400).json({
          error: "This folder is not empty in Google Drive. Move or delete its contents before deleting the folder.",
          itemCount: totalItems,
        });
        return;
      }

      await deleteFileFromDrive(folderId);
    } catch (err: any) {
      console.warn("Drive folder deletion error:", err);
    }
  }

  const catalog = readCatalog();
  catalog.folders = (catalog.folders || []).filter((f: any) => f.id !== folderId);

  if (writeCatalog(catalog)) {
    invalidateDriveCache();
    res.json({ success: true, id: folderId });
  } else {
    res.status(500).json({ error: "Failed to delete folder." });
  }
});

// 6. Admin File Upload (PDFs or Covers)
app.post(["/api/admin/upload", "/admin/upload"], requireAdmin, (req, res) => {
  upload.single("file")(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({ error: "File is too large. Maximum file size is 500 MB." });
        return;
      }
      res.status(400).json({ error: err.message || "File upload failed." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file was uploaded." });
      return;
    }

    const localFilePath = req.file.path;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype || getMimeType(originalName);
    const sizeBytes = req.file.size;
    const targetFolderId = req.body.folderId || req.query.folderId;

    // If Google Drive is configured, upload directly to Drive for persistent storage
    if (isGoogleDriveConfigured()) {
      try {
        const driveResult = await uploadFileToDrive({
          filename: originalName,
          mimeType,
          streamOrBuffer: fs.createReadStream(localFilePath),
          folderId: typeof targetFolderId === "string" ? targetFolderId : undefined,
        });

        const fileUrl = `/api/drive/file/${driveResult.fileId}`;
        res.json({
          success: true,
          fileUrl,
          driveFileId: driveResult.fileId,
          filename: originalName,
          mimeType,
          sizeBytes,
          size: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
        });
        return;
      } catch (driveErr: any) {
        console.error("Google Drive upload error, falling back to local file storage:", driveErr);
      }
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      filename: originalName,
      mimeType,
      sizeBytes,
      size: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
    });
  });
});

// 6.1 Multipart Resumable Upload Endpoints
app.post(["/api/admin/upload/init", "/admin/upload/init"], requireAdmin, (req, res) => {
  const { filename, fileSize, mimeType, chunkSize, totalChunks, folderId } = req.body;
  if (!filename || !fileSize) {
    res.status(400).json({ error: "Filename and fileSize are required." });
    return;
  }
  const ext = path.extname(filename);
  const uploadId = `up-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const sessionDir = path.join(uploadSessionsDir, uploadId);
  fs.mkdirSync(sessionDir, { recursive: true });

  const metadata = {
    uploadId,
    originalFilename: filename,
    storedFilename: `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
    fileSize: Number(fileSize),
    mimeType: mimeType || getMimeType(filename),
    chunkSize: Number(chunkSize) || 10 * 1024 * 1024,
    totalChunks: Number(totalChunks) || 1,
    folderId: folderId || undefined,
    completedParts: [],
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(sessionDir, "metadata.json"), JSON.stringify(metadata, null, 2), "utf8");
  res.json({ success: true, uploadId, chunkSize: metadata.chunkSize, totalChunks: metadata.totalChunks });
});

app.get(["/api/admin/upload/status", "/admin/upload/status"], requireAdmin, (req, res) => {
  const uploadId = req.query.uploadId as string;
  if (!uploadId) {
    res.status(400).json({ error: "uploadId is required." });
    return;
  }
  const sessionDir = path.join(uploadSessionsDir, path.basename(uploadId));
  const metaPath = path.join(sessionDir, "metadata.json");
  if (!fs.existsSync(metaPath)) {
    res.status(404).json({ error: "Upload session not found." });
    return;
  }
  try {
    const metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    res.json({ success: true, uploadId, completedParts: metadata.completedParts || [] });
  } catch {
    res.status(500).json({ error: "Failed to read upload session." });
  }
});

const chunkUploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadId = req.body.uploadId || req.query.uploadId;
    if (!uploadId) return cb(new Error("Missing uploadId"), "");
    const sessionDir = path.join(uploadSessionsDir, path.basename(uploadId));
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    cb(null, sessionDir);
  },
  filename: (req, file, cb) => {
    const partNumber = req.body.partNumber ?? req.query.partNumber ?? "0";
    cb(null, `part-${partNumber}`);
  },
});
const chunkUpload = multer({
  storage: chunkUploadStorage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB chunk max
});

app.post(["/api/admin/upload/part", "/admin/upload/part"], requireAdmin, (req, res) => {
  chunkUpload.single("chunk")(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ error: err.message || "Part upload failed." });
      return;
    }
    const uploadId = req.body.uploadId;
    const partNumber = Number(req.body.partNumber);

    if (!uploadId || isNaN(partNumber)) {
      res.status(400).json({ error: "uploadId and valid partNumber required." });
      return;
    }

    const sessionDir = path.join(uploadSessionsDir, path.basename(uploadId));
    const metaPath = path.join(sessionDir, "metadata.json");

    if (!fs.existsSync(metaPath)) {
      res.status(404).json({ error: "Upload session not found." });
      return;
    }

    try {
      const metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      if (!metadata.completedParts.includes(partNumber)) {
        metadata.completedParts.push(partNumber);
        metadata.completedParts.sort((a: number, b: number) => a - b);
        fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), "utf8");
      }
      res.json({ success: true, uploadId, partNumber });
    } catch {
      res.status(500).json({ error: "Failed to update upload session." });
    }
  });
});

app.post(["/api/admin/upload/complete", "/admin/upload/complete"], requireAdmin, async (req, res) => {
  const { uploadId } = req.body;
  if (!uploadId) {
    res.status(400).json({ error: "uploadId is required." });
    return;
  }

  const sessionDir = path.join(uploadSessionsDir, path.basename(uploadId));
  const metaPath = path.join(sessionDir, "metadata.json");

  if (!fs.existsSync(metaPath)) {
    res.status(404).json({ error: "Upload session not found." });
    return;
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    const { storedFilename, originalFilename, totalChunks } = metadata;
    const destPath = path.join(uploadsDir, storedFilename);

    for (let i = 0; i < totalChunks; i++) {
      const partPath = path.join(sessionDir, `part-${i}`);
      if (!fs.existsSync(partPath)) {
        res.status(400).json({ error: `Missing upload chunk part ${i}` });
        return;
      }
    }

    const writeStream = fs.createWriteStream(destPath);
    for (let i = 0; i < totalChunks; i++) {
      const partPath = path.join(sessionDir, `part-${i}`);
      const chunkBuffer = fs.readFileSync(partPath);
      writeStream.write(chunkBuffer);
    }
    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", () => resolve(true));
      writeStream.on("error", reject);
    });

    try {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }

    const actualStats = fs.statSync(destPath);

    // If Google Drive is configured, upload assembled file to Drive for persistent storage
    if (isGoogleDriveConfigured()) {
      try {
        const driveResult = await uploadFileToDrive({
          filename: originalFilename,
          mimeType: getMimeType(destPath, metadata.mimeType),
          streamOrBuffer: fs.createReadStream(destPath),
          folderId: metadata.folderId || undefined,
        });

        const fileUrl = `/api/drive/file/${driveResult.fileId}`;
        res.json({
          success: true,
          fileUrl,
          driveFileId: driveResult.fileId,
          filename: originalFilename,
          mimeType: getMimeType(destPath, metadata.mimeType),
          sizeBytes: actualStats.size,
          size: `${(actualStats.size / (1024 * 1024)).toFixed(2)} MB`,
        });
        return;
      } catch (driveErr: any) {
        console.error("Google Drive upload error on chunk completion, falling back to local file storage:", driveErr);
      }
    }

    const fileUrl = `/uploads/${storedFilename}`;
    res.json({
      success: true,
      fileUrl,
      filename: originalFilename,
      mimeType: getMimeType(destPath, metadata.mimeType),
      sizeBytes: actualStats.size,
      size: `${(actualStats.size / (1024 * 1024)).toFixed(2)} MB`,
    });
  } catch (err: any) {
    console.error("Error completing chunked upload:", err);
    res.status(500).json({ error: "Failed to assemble uploaded file." });
  }
});

app.post(["/api/admin/upload/abort", "/admin/upload/abort"], requireAdmin, (req, res) => {
  const { uploadId } = req.body;
  if (uploadId) {
    const sessionDir = path.join(uploadSessionsDir, path.basename(uploadId));
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }
  }
  res.json({ success: true });
});

// 7. Admin Import From Remote URL (Probe & Streamed Upload with SSRF Protection)
app.post(["/api/admin/import-url/probe", "/admin/import-url/probe"], requireAdmin, async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string" || !url.trim()) {
    res.status(400).json({ success: false, error: "A valid URL starting with http:// or https:// is required." });
    return;
  }

  try {
    const probe = await probeRemoteUrl(url.trim());
    res.json({
      success: true,
      ...probe,
    });
  } catch (err: any) {
    console.error("Probe URL error:", err?.message || err);
    res.status(400).json({ success: false, error: err?.message || "Failed to inspect remote URL." });
  }
});

app.post(["/api/admin/import-url", "/admin/import-url"], requireAdmin, async (req, res) => {
  const { url, filename, title, author, description, folderId, subfolderId, tags, visible } = req.body;

  if (!url || typeof url !== "string" || !url.trim()) {
    res.status(400).json({ success: false, error: "A valid URL starting with http:// or https:// is required." });
    return;
  }

  if (!isSharedDriveConfigured()) {
    res.status(400).json({
      success: false,
      error: "Ilm-e-Ghayb Library storage is not configured with a Shared Drive.",
    });
    return;
  }

  try {
    const streamResult = await downloadRemoteFileStream(url.trim());
    const originalName = streamResult.detectedFilename;
    const finalFilename = sanitizeFilename(filename ? String(filename).trim() : originalName);
    const mimeType = streamResult.mimeType || getMimeType(finalFilename);
    const targetFolderId = folderId || req.body.categoryId || undefined;
    const targetSubfolderId = subfolderId || undefined;

    let fileUrl = "";
    let driveFileId: string | undefined = undefined;

    try {
      const driveResult = await uploadFileToDrive({
        filename: finalFilename,
        mimeType,
        streamOrBuffer: streamResult.stream,
        folderId: typeof targetFolderId === "string" ? targetFolderId : undefined,
        description: description || `Imported from remote URL via Ilm-e-Ghayb Library`,
      });

      driveFileId = driveResult.fileId;
      fileUrl = `/api/drive/file/${driveResult.fileId}`;
    } catch (driveErr: any) {
      console.error("Google Drive upload error during URL import:", driveErr);
      res.status(400).json({
        success: false,
        error: driveErr?.message || "Google Drive upload failed.",
      });
      return;
    }

    const catalog = readCatalog();
    const targetFolder = (catalog.folders || []).find((f: any) => f.id === targetFolderId);

    const bookId = `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const cleanTitle =
      (title && String(title).trim()) ||
      path.basename(finalFilename, path.extname(finalFilename)).replace(/[-_]/g, " ").trim() ||
      "Untitled";
    const cleanAuthor = (author && String(author).trim()) || "Unspecified Author";
    const detectedItemType = detectItemTypeFromExtAndMime(finalFilename, mimeType);

    const bookToSave: any = {
      id: bookId,
      title: cleanTitle,
      originalFilename: finalFilename,
      author: cleanAuthor,
      description: (description && String(description).trim()) || "",
      folderId: targetFolderId || (catalog.folders?.[0]?.id || "f-general"),
      subfolderId: targetSubfolderId || null,
      category: targetFolder ? targetFolder.name : "General",
      tags: Array.isArray(tags) ? tags : tags ? String(tags).split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      fileType: detectedItemType,
      mimeType,
      fileSize: formatBytes(streamResult.sizeBytes),
      fileUrl,
      pdfUrl: detectedItemType === "pdf" || detectedItemType === "image" ? fileUrl : undefined,
      driveFileId,
      addedDate: now,
      updatedDate: now,
      visible: visible !== undefined ? Boolean(visible) : true,
      featured: false,
    };

    catalog.books = catalog.books || [];
    catalog.books.unshift(bookToSave);

    if (writeCatalog(catalog)) {
      invalidateDriveCache();
      res.json({
        success: true,
        book: sanitizeBook(bookToSave),
        folderName: targetFolder ? targetFolder.name : "Library",
      });
    } else {
      res.status(500).json({ success: false, error: "Failed to update catalog after file import." });
    }
  } catch (err: any) {
    console.error("Import from URL error:", err?.message || err);
    res.status(500).json({ success: false, error: err?.message || "Failed to import file from URL." });
  }
});

// ==========================================
// 8. AI Library Organizer Endpoints (NVIDIA NIM Muse Glimmer 30B & Nemotron Embed 1B)
// ==========================================

// 8.1 Status Check
app.get(["/api/admin/ai/status", "/admin/ai/status"], requireAdmin, (req, res) => {
  const museConfigured = isNvidiaMuseConfigured();
  const embeddingConfigured = isNvidiaEmbeddingConfigured();
  const configured = isNvidiaConfigured();
  const pending = getPendingProposals();
  res.json({
    success: true,
    configured,
    museConfigured,
    embeddingConfigured,
    organizerModel: getNvidiaOrganizerModel(),
    embeddingModel: getNvidiaEmbeddingModel(),
    pendingCount: pending.length,
    message: configured
      ? "NVIDIA NIM AI Organizer models active."
      : "AI Organizer requires NVIDIA_MUSE_API_KEY (for meta/muse-glimmer-30b) and NVIDIA_EMBEDDING_API_KEY (for nvidia/nemotron-3-embed-1b).",
  });
});

// 8.1b NVIDIA API Diagnostics
app.get(["/api/admin/ai/diagnostic", "/admin/ai/diagnostic"], requireAdmin, async (req, res) => {
  try {
    const report = await runNvidiaDiagnostic();
    res.json({
      success: report.NVIDIA_MUSE_API.success && report.NVIDIA_EMBEDDING_API.success,
      ...report,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || "Diagnostic test execution failed.",
    });
  }
});

// 8.2 Get Pending Proposals
app.get(["/api/admin/ai/pending", "/admin/ai/pending"], requireAdmin, (req, res) => {
  const proposals = getPendingProposals();
  res.json({
    success: true,
    proposals,
    count: proposals.length,
  });
});

// 8.3 Get All Proposals (including history)
app.get(["/api/admin/ai/proposals", "/admin/ai/proposals"], requireAdmin, (req, res) => {
  const proposals = getAllProposals();
  res.json({
    success: true,
    proposals,
    count: proposals.length,
  });
});

// 8.4 Analyze File(s) or Book(s)
app.post(["/api/admin/ai/analyze", "/admin/ai/analyze"], requireAdmin, async (req, res) => {
  if (!isNvidiaMuseConfigured()) {
    res.status(503).json({
      success: false,
      error: "AI Organizer temporarily unavailable. Please configure NVIDIA_MUSE_API_KEY.",
    });
    return;
  }

  const { bookIds, bookId, driveFileIds, driveFileId, unorganizedOnly } = req.body;
  const catalog = readCatalog();
  const targetBookIds: string[] = [];

  if (Array.isArray(bookIds)) {
    targetBookIds.push(...bookIds);
  } else if (bookId) {
    targetBookIds.push(bookId);
  }

  if (unorganizedOnly) {
    // Find books in root or without subfolder or in general
    const unorganized = (catalog.books || []).filter(
      (b: any) => !b.folderId || b.folderId === "f-general" || !b.subfolderId
    );
    unorganized.forEach((b: any) => {
      if (!targetBookIds.includes(b.id)) targetBookIds.push(b.id);
    });
  }

  // Handle direct drive file IDs if passed
  const targetDriveIds: string[] = [];
  if (Array.isArray(driveFileIds)) {
    targetDriveIds.push(...driveFileIds);
  } else if (driveFileId) {
    targetDriveIds.push(driveFileId);
  }

  if (targetBookIds.length === 0 && targetDriveIds.length === 0) {
    res.status(400).json({
      success: false,
      error: "No books or file IDs provided for AI analysis.",
    });
    return;
  }

  const generatedProposals = [];
  const errors = [];

  // Cap max items per single batch to prevent gateway timeouts (20 items max)
  const maxBatch = 20;
  const itemsToProcess = targetBookIds.slice(0, maxBatch);
  const pendingProps = getPendingProposals();
  const pendingBookIds = new Set(pendingProps.map((p) => p.bookId).filter(Boolean));

  // Process books with controlled concurrency (2 at a time)
  const processBook = async (bId: string) => {
    const book = (catalog.books || []).find((b: any) => b.id === bId);
    if (!book) return null;

    // Skip if pending proposal already exists
    if (!req.body.force && pendingBookIds.has(bId)) {
      const existing = pendingProps.find((p) => p.bookId === bId);
      if (existing) return existing;
    }

    try {
      let buffer: Buffer | null = null;
      let filename = book.originalFilename || `${book.title}.pdf`;
      let mimeType = book.mimeType || "application/pdf";

      // 1. Try reading from Google Drive
      const fileId = book.driveFileId || extractDriveFileId(book.fileUrl || book.pdfUrl);
      if (fileId && isGoogleDriveConfigured()) {
        const drive = getDriveClient();
        if (drive) {
          try {
            const streamRes = await drive.files.get(
              { fileId, alt: "media", supportsAllDrives: true },
              { responseType: "arraybuffer" }
            );
            buffer = Buffer.from(streamRes.data as ArrayBuffer);
          } catch (dErr: any) {
            console.warn(`Drive fetch notice for AI analysis of book ${bId}:`, dErr?.message || dErr);
          }
        }
      }

      // 2. Try reading from local uploads if not fetched from Drive
      if (!buffer && book.fileUrl && book.fileUrl.startsWith("/uploads/")) {
        const localPath = path.join(uploadsDir, path.basename(book.fileUrl));
        if (fs.existsSync(localPath)) {
          buffer = fs.readFileSync(localPath);
        }
      }

      // If buffer unavailable, create a virtual text sample from book title and metadata
      let docInfo;
      if (buffer) {
        docInfo = await extractDocumentText(buffer, filename, mimeType);
      } else {
        docInfo = {
          filename,
          fileSize: book.fileSize || "1 MB",
          sizeBytes: 1024 * 1024,
          mimeType,
          titleCue: book.title,
          authorCue: book.author !== "Unspecified Author" ? book.author : undefined,
          textSample: `Title: ${book.title}\nAuthor: ${book.author}\nCategory: ${book.category}\nDescription: ${book.description || ""}\nTags: ${(book.tags || []).join(", ")}`,
        };
      }

      return await createOrganizationProposal(docInfo, catalog, {
        bookId: book.id,
        driveFileId: fileId || book.driveFileId,
        currentFolderId: book.folderId,
        currentSubfolderId: book.subfolderId,
      });
    } catch (err: any) {
      console.error(`AI analysis failed for book ${bId}:`, err);
      errors.push({ id: bId, error: err?.message || "Analysis failed" });
      return null;
    }
  };

  // Run in chunks of 2
  const chunkSize = 2;
  for (let i = 0; i < itemsToProcess.length; i += chunkSize) {
    const chunk = itemsToProcess.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map((bId) => processBook(bId)));
    results.forEach((resProp) => {
      if (resProp) generatedProposals.push(resProp);
    });
  }

  // Analyze targeted Drive file IDs
  for (const dId of targetDriveIds) {
    try {
      if (!isGoogleDriveConfigured()) continue;
      const drive = getDriveClient();
      if (!drive) continue;

      const metaRes = await drive.files.get({
        fileId: dId,
        fields: "id, name, mimeType, size, parents, description",
        supportsAllDrives: true,
      });

      const fileName = metaRes.data.name || `drive-file-${dId}.pdf`;
      const mimeType = metaRes.data.mimeType || "application/pdf";

      const streamRes = await drive.files.get(
        { fileId: dId, alt: "media", supportsAllDrives: true },
        { responseType: "arraybuffer" }
      );
      const buffer = Buffer.from(streamRes.data as ArrayBuffer);

      const docInfo = await extractDocumentText(buffer, fileName, mimeType);
      const proposal = await createOrganizationProposal(docInfo, catalog, {
        driveFileId: dId,
        currentFolderId: metaRes.data.parents?.[0] || null,
      });

      generatedProposals.push(proposal);
    } catch (err: any) {
      console.error(`AI analysis failed for Drive file ${dId}:`, err);
      errors.push({ id: dId, error: err?.message || "Analysis failed" });
    }
  }

  res.json({
    success: true,
    proposals: generatedProposals,
    errors: errors.length > 0 ? errors : undefined,
    count: generatedProposals.length,
  });
});

// 8.5 Semantic Similarity Endpoint (Nemotron Embeddings)
app.post(["/api/admin/ai/similarity", "/admin/ai/similarity"], requireAdmin, async (req, res) => {
  if (!isNvidiaEmbeddingConfigured()) {
    res.status(503).json({
      success: false,
      error: "Semantic similarity temporarily unavailable (NVIDIA_EMBEDDING_API_KEY is missing).",
    });
    return;
  }

  const { textA, textB, compareWithFolders, compareWithBooks } = req.body;
  if (!textA || typeof textA !== "string" || !textA.trim()) {
    res.status(400).json({ success: false, error: "textA is required for similarity calculation." });
    return;
  }

  try {
    const embedA = await generateNemotronEmbedding(textA.trim());
    if (!embedA) {
      res.status(500).json({ success: false, error: "Failed to generate embedding for textA." });
      return;
    }

    let directSimilarity: number | undefined = undefined;
    if (textB && typeof textB === "string") {
      const embedB = await generateNemotronEmbedding(textB.trim());
      if (embedB) {
        directSimilarity = Math.round(calculateCosineSimilarity(embedA, embedB) * 100);
      }
    }

    const catalog = readCatalog();
    const folderRankings = [];
    const bookRankings = [];

    if (compareWithFolders) {
      for (const folder of catalog.folders || []) {
        const folderText = `Folder: ${folder.name}. Description: ${folder.description || ""}`;
        const fEmbed = await generateNemotronEmbedding(folderText);
        if (fEmbed) {
          const sim = Math.round(calculateCosineSimilarity(embedA, fEmbed) * 100);
          folderRankings.push({
            id: folder.id,
            name: folder.name,
            parentId: folder.parentId,
            similarity: sim,
          });
        }
      }
      folderRankings.sort((a, b) => b.similarity - a.similarity);
    }

    if (compareWithBooks) {
      for (const book of (catalog.books || []).slice(0, 50)) {
        const bText = `Title: ${book.title}. Author: ${book.author}. Category: ${book.category}`;
        const bEmbed = await generateNemotronEmbedding(bText);
        if (bEmbed) {
          const sim = Math.round(calculateCosineSimilarity(embedA, bEmbed) * 100);
          bookRankings.push({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            similarity: sim,
          });
        }
      }
      bookRankings.sort((a, b) => b.similarity - a.similarity);
    }

    res.json({
      success: true,
      similarity: directSimilarity,
      folderRankings: folderRankings.length > 0 ? folderRankings.slice(0, 10) : undefined,
      bookRankings: bookRankings.length > 0 ? bookRankings.slice(0, 10) : undefined,
    });
  } catch (err: any) {
    console.error("Semantic similarity error:", err);
    res.status(500).json({ success: false, error: err?.message || "Similarity calculation failed." });
  }
});

// 8.6 Approve AI Organization Proposal
app.post(["/api/admin/ai/approve", "/admin/ai/approve"], requireAdmin, async (req, res) => {
  const { proposalId, edits, proposalIds } = req.body;

  if (proposalIds && Array.isArray(proposalIds)) {
    const results = [];
    for (const pid of proposalIds) {
      const result = await applyApprovedProposal(pid, undefined, readCatalog, writeCatalog);
      results.push({ id: pid, ...result });
    }
    res.json({ success: true, results });
    return;
  }

  if (!proposalId) {
    res.status(400).json({ success: false, error: "proposalId is required." });
    return;
  }

  const result = await applyApprovedProposal(proposalId, edits, readCatalog, writeCatalog);
  if (result.success) {
    res.json({ success: true, book: result.book });
  } else {
    res.status(500).json({ success: false, error: result.error || "Failed to apply proposal." });
  }
});

// 8.7 Reject AI Organization Proposal
app.post(["/api/admin/ai/reject", "/admin/ai/reject"], requireAdmin, (req, res) => {
  const { proposalId, proposalIds } = req.body;

  if (proposalIds && Array.isArray(proposalIds)) {
    const count = rejectMultipleProposals(proposalIds);
    res.json({ success: true, count });
    return;
  }

  if (!proposalId) {
    res.status(400).json({ success: false, error: "proposalId is required." });
    return;
  }

  const success = rejectProposal(proposalId);
  if (success) {
    res.json({ success: true, id: proposalId });
  } else {
    res.status(404).json({ success: false, error: "Proposal not found." });
  }
});

// 8.8 Bulk Actions (Approve Selected, Reject Selected, Approve All High Confidence)
app.post(["/api/admin/ai/bulk-action", "/admin/ai/bulk-action"], requireAdmin, async (req, res) => {
  const { action, proposalIds, minConfidence = 0.85 } = req.body;

  if (!action) {
    res.status(400).json({ success: false, error: "action is required." });
    return;
  }

  const pending = getPendingProposals();

  if (action === "approve-all-high-confidence") {
    const highConfidenceProposals = pending.filter((p) => (p.confidence || 0) >= minConfidence);
    const results = [];
    for (const prop of highConfidenceProposals) {
      const resApply = await applyApprovedProposal(prop.id, undefined, readCatalog, writeCatalog);
      results.push({ id: prop.id, title: prop.suggestedTitle, success: resApply.success });
    }
    res.json({
      success: true,
      action,
      processed: results.length,
      results,
    });
    return;
  }

  if (action === "approve-selected" && Array.isArray(proposalIds)) {
    const results = [];
    for (const pid of proposalIds) {
      const resApply = await applyApprovedProposal(pid, undefined, readCatalog, writeCatalog);
      results.push({ id: pid, success: resApply.success });
    }
    res.json({ success: true, action, processed: results.length, results });
    return;
  }

  if (action === "reject-selected" && Array.isArray(proposalIds)) {
    const count = rejectMultipleProposals(proposalIds);
    res.json({ success: true, action, processed: count });
    return;
  }

  res.status(400).json({ success: false, error: `Unsupported bulk action: ${action}` });
});

// Catch-all for any unknown API route - ensure it ALWAYS returns JSON, never HTML
app.all("/api/*", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(404).json({ success: false, error: `API endpoint not found: ${req.method} ${req.path}` });
});

// Global unhandled error handler for API requests
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API error:", err);
  if (!res.headersSent) {
    res.setHeader("Content-Type", "application/json");
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
});

export default app;
