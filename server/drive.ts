// NOTE: no "dotenv" import here — see server/app.ts. dotenv's CommonJS
// dynamic require("fs") crashes the Vercel ESM serverless bundle at import
// time. Env vars come from the Vercel dashboard; local dev loads .env
// via server.ts.
import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

export function extractDriveFolderId(rawId?: string): string {
  if (!rawId || typeof rawId !== "string") return "";
  let id = rawId.trim();

  // Strip wrapping quotes
  while (
    (id.startsWith('"') && id.endsWith('"')) ||
    (id.startsWith("'") && id.endsWith("'")) ||
    (id.startsWith("`") && id.endsWith("`"))
  ) {
    id = id.substring(1, id.length - 1).trim();
  }

  // Extract from Google Drive URL if URL was pasted
  const urlMatch = id.match(/\/folders\/([a-zA-Z0-9_-]+)/) || id.match(/id=([a-zA-Z0-9_-]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  return id;
}

export function parsePrivateKey(rawKey?: string): string {
  if (!rawKey || typeof rawKey !== "string") return "";
  let key = rawKey.trim();

  // Strip wrapping quotes
  while (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'")) ||
    (key.startsWith("`") && key.endsWith("`"))
  ) {
    key = key.substring(1, key.length - 1).trim();
  }

  // Handle JSON service account key if entire credentials JSON was provided
  if (key.startsWith("{") && key.endsWith("}")) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key && typeof parsed.private_key === "string") {
        key = parsed.private_key.trim();
      }
    } catch {
      // not JSON, continue
    }
  }

  // Handle Base64-encoded private key if provided that way
  if (key.startsWith("LS0t") || (!key.includes("BEGIN PRIVATE KEY") && !key.includes("BEGIN RSA PRIVATE KEY") && !key.includes("\n") && key.length > 200)) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY") || decoded.includes("BEGIN RSA PRIVATE KEY")) {
        key = decoded.trim();
      }
    } catch {
      // Not base64, proceed
    }
  }

  // Convert all escaped literal \n, \r\n, \r sequences into actual newline characters
  key = key
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  return key.trim();
}

export function isValidPrivateKey(rawKey?: string): boolean {
  if (!rawKey) return false;
  const normalized = parsePrivateKey(rawKey);
  return (
    (normalized.includes("-----BEGIN PRIVATE KEY-----") &&
      normalized.includes("-----END PRIVATE KEY-----")) ||
    (normalized.includes("-----BEGIN RSA PRIVATE KEY-----") &&
      normalized.includes("-----END RSA PRIVATE KEY-----"))
  );
}

// Extract Server-Side environment secrets
function getServiceAccountEmail(): string {
  const rawKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").trim();
  if (rawKey.startsWith("{") && rawKey.endsWith("}")) {
    try {
      const parsed = JSON.parse(rawKey);
      if (parsed.client_email && typeof parsed.client_email === "string") {
        return parsed.client_email.trim();
      }
    } catch {}
  }
  return (
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL ||
    "khafi-library-storage@gen-lang-client-0661184713.iam.gserviceaccount.com"
  ).trim();
}

function getServiceAccountPrivateKey(): string {
  const rawKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "").trim();
  return parsePrivateKey(rawKey);
}

export function getDriveFolderId(): string {
  // Default root is the "All Islamic History Books" Drive folder ONLY.
  // The wider "KHAFI LIBRARY" folder (11XFqHOjiDj6ChlBX65XFR0p9SOqjpHX5) also
  // holds "Islamic Library" and "Hidden Wisdoms (The Truth)" — those
  // are deliberately NOT linked here. Override with GOOGLE_DRIVE_FOLDER_ID.
  const rawId = process.env.GOOGLE_DRIVE_FOLDER_ID || process.env.DRIVE_FOLDER_ID || "1MAFF2F5pK1HJMoQFSZ6IXoZT9D2LpyIB";
  return extractDriveFolderId(rawId);
}

export function getSharedDriveId(): string {
  const rawId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || process.env.SHARED_DRIVE_ID || "";
  return extractDriveFolderId(rawId);
}

export function isSharedDriveConfigured(): boolean {
  return Boolean(getSharedDriveId());
}

export function hasServiceAccountCredentials(): boolean {
  const email = getServiceAccountEmail();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "";
  const folderId = getDriveFolderId();
  return Boolean(email && isValidPrivateKey(rawKey) && folderId);
}

/**
 * Check whether Google Drive credentials and Shared Drive are fully provided and valid
 */
export function isGoogleDriveConfigured(): boolean {
  return hasServiceAccountCredentials();
}

let driveClientInstance: any = null;

/**
 * Get or initialize authenticated Google Drive v3 client
 */
export function getDriveClient() {
  if (!hasServiceAccountCredentials()) {
    return null;
  }

  if (!driveClientInstance) {
    try {
      const email = getServiceAccountEmail();
      const key = getServiceAccountPrivateKey();

      const auth = new google.auth.JWT({
        email,
        key,
        scopes: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
        ],
      });

      driveClientInstance = google.drive({ version: "v3", auth });
    } catch (err) {
      console.error("Failed to initialize Google Drive client:", err);
      driveClientInstance = null;
    }
  }

  return driveClientInstance;
}

export interface DriveDiagnosticResult {
  googleDriveConfigured: boolean;
  sharedDriveConfigured: boolean;
  rootFolderConfigured: boolean;
  sharedDriveAccessible: boolean;
  rootFolderAccessible: boolean;
  serviceAccountAuthenticated: boolean;
  error?: string;
  sharedDriveName?: string;
  rootFolderName?: string;
}

export async function runDriveDiagnostic(): Promise<DriveDiagnosticResult> {
  const email = getServiceAccountEmail();
  const rawKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "").trim();
  const folderId = getDriveFolderId();
  const sharedDriveId = getSharedDriveId();

  const isKeyValid = isValidPrivateKey(rawKey);
  const rootFolderConfigured = Boolean(folderId);
  const sharedDriveConfigured = Boolean(sharedDriveId);
  const googleDriveConfigured = Boolean(email && isKeyValid && rootFolderConfigured && sharedDriveConfigured);

  let serviceAccountAuthenticated = false;
  let sharedDriveAccessible = false;
  let rootFolderAccessible = false;
  let errorMsg: string | undefined = undefined;
  let sharedDriveName: string | undefined = undefined;
  let rootFolderName: string | undefined = undefined;

  if (!email || !rawKey || !isKeyValid) {
    return {
      googleDriveConfigured: false,
      sharedDriveConfigured,
      rootFolderConfigured,
      sharedDriveAccessible: false,
      rootFolderAccessible: false,
      serviceAccountAuthenticated: false,
      error: !email
        ? "GOOGLE_SERVICE_ACCOUNT_EMAIL is missing."
        : !isKeyValid
        ? "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is invalid PEM format."
        : "Google Drive service account credentials are not configured.",
    };
  }

  const drive = getDriveClient();
  if (!drive) {
    return {
      googleDriveConfigured,
      sharedDriveConfigured,
      rootFolderConfigured,
      sharedDriveAccessible: false,
      rootFolderAccessible: false,
      serviceAccountAuthenticated: false,
      error: "Failed to initialize Google Drive API client.",
    };
  }

  // 1. Authenticate check
  try {
    await drive.about.get({ fields: "user", supportsAllDrives: true });
    serviceAccountAuthenticated = true;
  } catch (authErr: any) {
    console.error("Diagnostic: Service Account auth test failed:", authErr?.message || authErr);
    errorMsg = `Authentication failed: ${authErr?.message || authErr}`;
  }

  // 2. Shared Drive Access check
  if (sharedDriveConfigured && serviceAccountAuthenticated) {
    try {
      const driveRes = await drive.drives.get({
        driveId: sharedDriveId,
      });
      sharedDriveAccessible = true;
      sharedDriveName = driveRes.data.name || "Shared Drive";
    } catch (sdErr: any) {
      try {
        const fileRes = await drive.files.get({
          fileId: sharedDriveId,
          fields: "id, name, mimeType, trashed",
          supportsAllDrives: true,
        });
        if (!fileRes.data.trashed) {
          sharedDriveAccessible = true;
          sharedDriveName = fileRes.data.name || "Shared Drive Root";
        } else {
          errorMsg = errorMsg || "Shared Drive is in trash.";
        }
      } catch (fallbackErr: any) {
        console.error("Diagnostic: Shared Drive access test failed:", sdErr?.message || fallbackErr?.message);
        errorMsg = errorMsg || `Shared Drive access failed: ${sdErr?.message || fallbackErr?.message}`;
      }
    }
  } else if (!sharedDriveConfigured) {
    errorMsg = "Ilm-e-Ghayb Library storage is not configured with a Shared Drive (GOOGLE_DRIVE_SHARED_DRIVE_ID).";
  }

  // 3. Root Folder Access check
  if (rootFolderConfigured && serviceAccountAuthenticated) {
    try {
      const folderRes = await drive.files.get({
        fileId: folderId,
        fields: "id, name, mimeType, trashed",
        supportsAllDrives: true,
      });
      if (!folderRes.data.trashed) {
        rootFolderAccessible = true;
        rootFolderName = folderRes.data.name || "Library Root Folder";
      } else {
        errorMsg = errorMsg || "Root folder is in trash.";
      }
    } catch (fErr: any) {
      console.error("Diagnostic: Root folder access test failed:", fErr?.message || fErr);
      errorMsg = errorMsg || `Root folder access failed: ${fErr?.message || fErr}`;
    }
  }

  return {
    googleDriveConfigured,
    sharedDriveConfigured,
    rootFolderConfigured,
    sharedDriveAccessible,
    rootFolderAccessible,
    serviceAccountAuthenticated,
    error: errorMsg,
    sharedDriveName,
    rootFolderName,
  };
}

/**
 * Test Drive connection and verify access to configured folder
 */
export async function testDriveConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  folderName?: string;
  error?: string;
}> {
  const email = getServiceAccountEmail();
  const rawKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").trim();
  const folderId = getDriveFolderId();
  const isKeyValid = isValidPrivateKey(rawKey);

  if (!email || !folderId || !rawKey) {
    return {
      configured: false,
      connected: false,
      error: "Google Drive secrets (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID) are not all configured.",
    };
  }

  if (!isKeyValid) {
    return {
      configured: true,
      connected: false,
      error: "Invalid private key format: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must be a PEM-formatted RSA private key (starting with '-----BEGIN PRIVATE KEY-----') from your Google Service Account JSON credentials file, not just a Key ID.",
    };
  }

  const drive = getDriveClient();
  if (!drive) {
    return {
      configured: true,
      connected: false,
      error: "Unable to instantiate Google Drive client.",
    };
  }

  try {
    const res = await drive.files.get({
      fileId: folderId,
      fields: "id, name, mimeType, trashed",
      supportsAllDrives: true,
    });

    return {
      configured: true,
      connected: true,
      folderName: res.data.name || "Drive Root",
    };
  } catch (err: any) {
    console.error("Google Drive connection test failed:", err?.message || err);
    return {
      configured: true,
      connected: false,
      error: err?.message || "Failed to access specified Google Drive folder.",
    };
  }
}

export interface DriveUploadOptions {
  filename: string;
  mimeType: string;
  streamOrBuffer: Readable | Buffer;
  description?: string;
  folderId?: string; // target Drive folder (defaults to root)
}

export interface DriveUploadResult {
  fileId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  webViewLink?: string;
  webContentLink?: string;
}

/**
 * Upload a file stream or buffer directly to a Google Drive folder inside a Shared Drive
 */
export async function uploadFileToDrive(options: DriveUploadOptions): Promise<DriveUploadResult> {
  if (!isSharedDriveConfigured()) {
    throw new Error("Ilm-e-Ghayb Library storage is not configured with a Shared Drive.");
  }

  const drive = getDriveClient();
  if (!drive) {
    throw new Error("Google Drive credentials are not configured.");
  }

  const rootFolderId = getDriveFolderId();
  const targetFolderId = options.folderId || rootFolderId;
  let bodyStream: Readable;

  if (Buffer.isBuffer(options.streamOrBuffer)) {
    bodyStream = Readable.from(options.streamOrBuffer);
  } else {
    bodyStream = options.streamOrBuffer;
  }

  const fileMetadata: any = {
    name: options.filename,
    parents: targetFolderId ? [targetFolderId] : undefined,
    description: options.description || "Uploaded via Ilm-e-Ghayb Library",
  };

  const media = {
    mimeType: options.mimeType || "application/octet-stream",
    body: bodyStream,
  };

  try {
    const createRes = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, mimeType, size, webViewLink, webContentLink",
      supportsAllDrives: true,
    });

    const fileData = createRes.data;
    if (!fileData.id) {
      throw new Error("Google Drive upload completed without returning a file ID.");
    }

    // Attempt to grant readable permission
    try {
      await drive.permissions.create({
        fileId: fileData.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
        supportsAllDrives: true,
      });
    } catch (permErr) {
      console.warn("Drive public permission note (file remains accessible via library streaming):", permErr);
    }

    invalidateDriveCache();

    return {
      fileId: fileData.id,
      filename: fileData.name || options.filename,
      mimeType: fileData.mimeType || options.mimeType,
      sizeBytes: fileData.size ? Number(fileData.size) : 0,
      webViewLink: fileData.webViewLink || undefined,
      webContentLink: fileData.webContentLink || undefined,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes("storage quota") || msg.includes("quota") || err?.status === 403) {
      throw new Error(
        "Google Drive upload failed: Service Accounts do not have personal storage quota. A Google Shared Drive (GOOGLE_DRIVE_SHARED_DRIVE_ID) is required for storage."
      );
    }
    throw err;
  }
}

/**
 * Create a folder directly in Google Drive inside a Shared Drive
 */
export async function createDriveFolder(
  name: string,
  parentId?: string | null,
  description?: string
): Promise<{ id: string; name: string; parentId: string | null }> {
  if (!isSharedDriveConfigured()) {
    throw new Error("Ilm-e-Ghayb Library storage is not configured with a Shared Drive.");
  }

  const drive = getDriveClient();
  if (!drive) {
    throw new Error("Google Drive credentials are not configured.");
  }

  const rootFolderId = getDriveFolderId();
  const targetParent = parentId || rootFolderId;

  try {
    const res = await drive.files.create({
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: targetParent ? [targetParent] : undefined,
        description: description || "",
      },
      fields: "id, name, mimeType, parents, createdTime, modifiedTime",
      supportsAllDrives: true,
    });

    if (!res.data?.id) {
      throw new Error("Failed to create folder in Google Drive.");
    }

    invalidateDriveCache();

    return {
      id: res.data.id,
      name: res.data.name || name,
      parentId: parentId || null,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes("storage quota") || msg.includes("quota") || err?.status === 403) {
      throw new Error(
        "Google Drive folder creation failed: Service Accounts do not have personal storage quota. A Google Shared Drive (GOOGLE_DRIVE_SHARED_DRIVE_ID) is required for storage."
      );
    }
    throw err;
  }
}

/**
 * Rename/update folder in Google Drive
 */
export async function renameDriveFolder(
  folderId: string,
  newName: string,
  newDescription?: string
): Promise<boolean> {
  const drive = getDriveClient();
  if (!drive || !folderId) return false;

  try {
    const updateBody: any = { name: newName };
    if (newDescription !== undefined) {
      updateBody.description = newDescription;
    }

    await drive.files.update({
      fileId: folderId,
      requestBody: updateBody,
      supportsAllDrives: true,
    });

    invalidateDriveCache();
    return true;
  } catch (err: any) {
    console.error(`Failed to rename Drive folder ${folderId}:`, err?.message || err);
    return false;
  }
}

/**
 * Delete a file or folder from Google Drive
 */
export async function deleteFileFromDrive(fileId: string): Promise<boolean> {
  const drive = getDriveClient();
  if (!drive || !fileId) return false;

  try {
    await drive.files.delete({
      fileId,
      supportsAllDrives: true,
    });
    invalidateDriveCache();
    return true;
  } catch (err: any) {
    console.error(`Failed to delete file/folder ${fileId} from Google Drive:`, err?.message || err);
    return false;
  }
}

/**
 * Fetch metadata for a file in Google Drive
 */
export async function getDriveFileMetadata(fileId: string): Promise<{
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink?: string;
  webContentLink?: string;
} | null> {
  const drive = getDriveClient();
  if (!drive || !fileId) return null;

  try {
    const res = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, size, webViewLink, webContentLink",
      supportsAllDrives: true,
    });
    return {
      id: res.data.id || fileId,
      name: res.data.name || "file",
      mimeType: res.data.mimeType || "application/octet-stream",
      size: res.data.size ? Number(res.data.size) : 0,
      webViewLink: res.data.webViewLink || undefined,
      webContentLink: res.data.webContentLink || undefined,
    };
  } catch (err) {
    console.error(`Failed to get Drive metadata for ${fileId}:`, err);
    return null;
  }
}

// In-memory cache for live Google Drive catalog listing
interface CachedHierarchy {
  data: { folders: any[]; books: any[] };
  expiresAt: number;
}
let driveHierarchyCache: CachedHierarchy | null = null;
let inFlightCatalogPromise: Promise<{ folders: any[]; books: any[] }> | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache for snappy navigation

export function invalidateDriveCache(): void {
  driveHierarchyCache = null;
}

/**
 * Execute a Google Drive API call with exponential backoff on 429 (rate limit) and 5xx errors.
 */
export async function callDriveWithRetry<T>(fn: () => Promise<T>, opName = "Drive API"): Promise<T> {
  let lastError: any = null;
  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.response?.status || err?.code;
      const errMsg = err?.message || "";
      const isRateLimit = status === 429 || /rate|quota|exceeded|429/i.test(errMsg);
      const isTransient = status === 500 || status === 502 || status === 503 || status === 504;

      if ((isRateLimit || isTransient) && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 5000);
        console.warn(`[Drive Diagnostic] ${opName} hit ${isRateLimit ? "429 Rate Limit" : `HTTP ${status}`} (attempt ${attempt + 1}/${maxRetries}). Backing off for ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

function detectItemType(ext: string, mime?: string): string {
  const cleanExt = ext.toLowerCase().replace(".", "");
  if (cleanExt === "pdf" || mime === "application/pdf") return "pdf";
  if (cleanExt === "epub" || mime?.includes("epub")) return "epub";
  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(cleanExt) || mime?.startsWith("image/")) return "image";
  if (["mp3", "wav", "m4a", "ogg", "flac", "aac"].includes(cleanExt) || mime?.startsWith("audio/")) return "audio";
  if (["mp4", "webm", "mkv", "mov", "avi"].includes(cleanExt) || mime?.startsWith("video/")) return "video";
  if (["zip", "rar", "7z", "tar", "gz"].includes(cleanExt) || mime?.includes("zip") || mime?.includes("tar")) return "archive";
  if (["doc", "docx", "txt", "rtf", "odt"].includes(cleanExt)) return "document";
  return "pdf";
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function cleanFilenameToTitle(name: string): { title: string; author?: string } {
  // Strip file extension
  let base = name.replace(/\.[^/.]+$/, "").trim();

  // If formatted as "Author - Title", extract both
  if (base.includes(" - ")) {
    const parts = base.split(" - ");
    if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
      return {
        author: parts[0].trim(),
        title: parts[1].trim(),
      };
    }
  }

  // Clean underscore and dash separators for readable display
  const title = base.replace(/[_]/g, " ").replace(/\s+/g, " ").trim();
  return { title: title || name };
}

/**
 * Dynamically queries Google Drive for the complete folder hierarchy and all files
 * inside the configured root folder. Merges with any custom metadata in catalog.json.
 */
export async function fetchLiveDriveCatalog(storedCatalogMetadata?: any): Promise<{ folders: any[]; books: any[] }> {
  const now = Date.now();
  if (driveHierarchyCache && driveHierarchyCache.expiresAt > now) {
    return driveHierarchyCache.data;
  }

  if (inFlightCatalogPromise) {
    return inFlightCatalogPromise;
  }

  const emptyResult = { folders: [], books: [] };

  if (!isGoogleDriveConfigured()) {
    return emptyResult;
  }

  const drive = getDriveClient();
  if (!drive) {
    return emptyResult;
  }

  const rootFolderId = getDriveFolderId();
  if (!rootFolderId) {
    return emptyResult;
  }

  inFlightCatalogPromise = (async () => {
    try {
      // 8-second safety timeout guard to prevent hanging HTTP requests
      const timeoutPromise = new Promise<{ folders: any[]; books: any[] }>((_, reject) =>
        setTimeout(() => reject(new Error("Google Drive query timed out after 8s")), 8000)
      );

      const fetchPromise = (async () => {
        const allDriveItemsMap = new Map<string, any>();
        let pageToken: string | undefined = undefined;
        let pageCount = 0;

        // Fetch all non-trashed files/folders in 1-2 rapid bulk requests (pageSize 1000)
        const sharedDriveId = getSharedDriveId();
        do {
          pageCount++;
          const listParams: any = {
            q: "trashed = false",
            fields: "nextPageToken, files(id, name, mimeType, parents, size, modifiedTime, createdTime, description, webViewLink, webContentLink)",
            pageSize: 1000,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            pageToken,
          };
          if (sharedDriveId) {
            listParams.corpora = "drive";
            listParams.driveId = sharedDriveId;
          }

          let listRes: any;
          try {
            listRes = await callDriveWithRetry(
              () => drive.files.list(listParams),
              `Fetch catalog page ${pageCount}`
            );
          } catch (listErr) {
            if (listParams.corpora) {
              delete listParams.corpora;
              delete listParams.driveId;
              listRes = await callDriveWithRetry(
                () => drive.files.list(listParams),
                `Fetch catalog page ${pageCount} (fallback)`
              );
            } else {
              throw listErr;
            }
          }

          const items = listRes?.data?.files || [];
          for (const item of items) {
            allDriveItemsMap.set(item.id, item);
          }
          pageToken = listRes?.data?.nextPageToken || undefined;
        } while (pageToken && pageCount < 10);

        const allDriveItems = Array.from(allDriveItemsMap.values());

        // 2. Discover all folders belonging to rootFolderId tree
        const driveFolderMap = new Map<string, any>();
        allDriveItems
          .filter((item) => item.mimeType === "application/vnd.google-apps.folder")
          .forEach((folder) => driveFolderMap.set(folder.id, folder));

        const treeFolderMap = new Map<string, any>();

        // Step 2a: Find direct children of rootFolderId (Root Categories)
        let sortOrder = 1;
        for (const [folderId, folderItem] of driveFolderMap.entries()) {
          const parents = folderItem.parents || [];
          if (parents.includes(rootFolderId)) {
            treeFolderMap.set(folderId, {
              id: folderId,
              name: folderItem.name || "Untitled Folder",
              description: folderItem.description || "",
              parentId: null,
              type: "category",
              createdAt: folderItem.createdTime || new Date().toISOString(),
              updatedAt: folderItem.modifiedTime || new Date().toISOString(),
              sortOrder: sortOrder,
              order: sortOrder,
              visible: true,
            });
            sortOrder++;
          }
        }

        // Step 2b: Iteratively find subfolders of discovered folders
        let addedNew = true;
        while (addedNew) {
          addedNew = false;
          for (const [folderId, folderItem] of driveFolderMap.entries()) {
            if (treeFolderMap.has(folderId)) continue;
            const parents = folderItem.parents || [];
            for (const p of parents) {
              if (treeFolderMap.has(p)) {
                treeFolderMap.set(folderId, {
                  id: folderId,
                  name: folderItem.name || "Untitled Subfolder",
                  description: folderItem.description || "",
                  parentId: p,
                  type: "subfolder",
                  createdAt: folderItem.createdTime || new Date().toISOString(),
                  updatedAt: folderItem.modifiedTime || new Date().toISOString(),
                  sortOrder: sortOrder,
                  order: sortOrder,
                  visible: true,
                });
                sortOrder++;
                addedNew = true;
                break;
              }
            }
          }
        }

        // 3. Map stored metadata from catalog.json (for custom folder titles/descriptions/sortOrder)
        const storedFolderMeta = new Map<string, any>();
        if (storedCatalogMetadata?.folders && Array.isArray(storedCatalogMetadata.folders)) {
          storedCatalogMetadata.folders.forEach((f: any) => {
            if (f.id) storedFolderMeta.set(f.id, f);
            if (f.name) storedFolderMeta.set(`name:${f.name.toLowerCase()}`, f);
          });
        }

        const finalFolders: any[] = [];
        for (const folder of treeFolderMap.values()) {
          const meta = storedFolderMeta.get(folder.id) || storedFolderMeta.get(`name:${folder.name.toLowerCase()}`);
          if (meta) {
            folder.description = meta.description !== undefined ? meta.description : folder.description;
            folder.sortOrder = meta.sortOrder !== undefined ? meta.sortOrder : (meta.order !== undefined ? meta.order : folder.sortOrder);
            folder.order = folder.sortOrder;
            folder.visible = meta.visible !== undefined ? meta.visible : folder.visible;
          }
          finalFolders.push(folder);
        }

        finalFolders.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));

        // 4. Discover all files belonging to the tree (in root folder or any subfolder)
        const storedBookMeta = new Map<string, any>();
        if (storedCatalogMetadata?.books && Array.isArray(storedCatalogMetadata.books)) {
          storedCatalogMetadata.books.forEach((b: any) => {
            if (b.id) storedBookMeta.set(b.id, b);
            if (b.driveFileId) storedBookMeta.set(b.driveFileId, b);
            if (b.originalFilename) storedBookMeta.set(`fn:${b.originalFilename.toLowerCase()}`, b);
          });
        }

        const finalBooks: any[] = [];
        const nonFolderFiles = allDriveItems.filter((item) => item.mimeType !== "application/vnd.google-apps.folder");

        for (const file of nonFolderFiles) {
          if (file.name === "catalog.json" || file.name?.startsWith(".")) {
            continue;
          }

          const parents = file.parents || [];
          let parentFolderId: string | null = null;
          let isInTree = false;

          if (parents.includes(rootFolderId)) {
            isInTree = true;
            parentFolderId = null;
          } else {
            for (const p of parents) {
              if (treeFolderMap.has(p)) {
                isInTree = true;
                parentFolderId = p;
                break;
              }
            }
          }

          if (!isInTree) {
            continue;
          }

          const ext = path.extname(file.name || "").toLowerCase().replace(".", "");
          const { title: autoTitle, author: autoAuthor } = cleanFilenameToTitle(file.name || "Untitled");
          const parentFolder = parentFolderId ? treeFolderMap.get(parentFolderId) : null;

          let folderId: string | undefined = undefined;
          let subfolderId: string | undefined = undefined;
          let categoryName = "General";

          if (parentFolder) {
            categoryName = parentFolder.name;
            if (parentFolder.parentId) {
              folderId = parentFolder.parentId;
              subfolderId = parentFolder.id;
            } else {
              folderId = parentFolder.id;
              subfolderId = undefined;
            }
          }

          const fileType = detectItemType(ext, file.mimeType);
          const sizeBytes = file.size ? Number(file.size) : 0;
          const meta = storedBookMeta.get(file.id) || storedBookMeta.get(`fn:${(file.name || "").toLowerCase()}`);

          const bookObj: any = {
            id: file.id,
            driveFileId: file.id,
            title: meta?.title || autoTitle,
            originalFilename: file.name || autoTitle,
            author: meta?.author || autoAuthor || "Scholastic Archive",
            description: meta?.description || file.description || "",
            folderId: meta?.folderId || folderId,
            subfolderId: meta?.subfolderId || subfolderId,
            category: meta?.category || categoryName,
            topic: meta?.topic || undefined,
            pdfUrl: `/api/files/${file.id}/preview`,
            fileUrl: `/api/files/${file.id}/preview`,
            fileType: meta?.fileType || fileType,
            mimeType: file.mimeType || "application/pdf",
            fileSize: formatBytes(sizeBytes),
            sizeBytes: sizeBytes,
            sortOrder: meta?.sortOrder ?? undefined,
            isAuthentic: meta?.isAuthentic === true,
            addedDate: file.createdTime || file.modifiedTime || new Date().toISOString(),
            updatedDate: file.modifiedTime || new Date().toISOString(),
            visible: meta?.visible !== undefined ? meta.visible : true,
            featured: meta?.featured !== undefined ? meta.featured : false,
            coverUrl: meta?.coverUrl || undefined,
            tags: meta?.tags || [categoryName].filter(Boolean),
          };

          finalBooks.push(bookObj);
        }

        const result = { folders: finalFolders, books: finalBooks };
        driveHierarchyCache = {
          data: result,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };
        return result;
      })();

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err: any) {
      console.warn("[Drive Diagnostic] Live Drive sync notice:", err?.message || err);
      if (driveHierarchyCache) {
        return driveHierarchyCache.data;
      }
      return emptyResult;
    } finally {
      inFlightCatalogPromise = null;
    }
  })();

  return inFlightCatalogPromise;
}

/**
 * Synchronize catalog.json with Google Drive
 */
export async function syncCatalogWithDrive(catalogData: any, catalogFilePath?: string): Promise<boolean> {
  const drive = getDriveClient();
  if (!drive) return false;

  const folderId = getDriveFolderId();
  const sharedDriveId = getSharedDriveId();
  const catalogJsonString = JSON.stringify(catalogData, null, 2);

  try {
    const listParams: any = {
      q: `'${folderId}' in parents and name = 'catalog.json' and trashed = false`,
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    };
    if (sharedDriveId) {
      listParams.corpora = "drive";
      listParams.driveId = sharedDriveId;
    }

    let listRes: any;
    try {
      listRes = await drive.files.list(listParams);
    } catch {
      delete listParams.corpora;
      delete listParams.driveId;
      listRes = await drive.files.list(listParams);
    }

    const existingFile = listRes.data.files?.[0];

    const media = {
      mimeType: "application/json",
      body: Readable.from(Buffer.from(catalogJsonString, "utf8")),
    };

    if (existingFile?.id) {
      await drive.files.update({
        fileId: existingFile.id,
        media: media,
        supportsAllDrives: true,
      });
      console.log(`Updated catalog.json on Google Drive (fileId: ${existingFile.id})`);
    } else {
      const createRes = await drive.files.create({
        requestBody: {
          name: "catalog.json",
          parents: folderId ? [folderId] : undefined,
          description: "Ilm-e-Ghayb Library persistent catalog index",
        },
        media: media,
        supportsAllDrives: true,
      });
      console.log(`Created catalog.json on Google Drive (fileId: ${createRes.data.id})`);
    }

    invalidateDriveCache();
    return true;
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes("storage quota") || msg.includes("quota") || err?.status === 403) {
      console.warn("Notice: Google Drive service account storage quota limit reached. Catalog persisted locally in data/catalog.json.");
    } else {
      console.warn("Notice: Syncing catalog.json to Google Drive skipped or deferred:", msg);
    }
    return false;
  }
}

/**
 * Pull catalog.json from Google Drive on startup if local file is missing or empty
 */
export async function pullCatalogFromDrive(catalogFilePath: string): Promise<any | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  const folderId = getDriveFolderId();
  const sharedDriveId = getSharedDriveId();
  try {
    const listParams: any = {
      q: `'${folderId}' in parents and name = 'catalog.json' and trashed = false`,
      fields: "files(id, name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    };
    if (sharedDriveId) {
      listParams.corpora = "drive";
      listParams.driveId = sharedDriveId;
    }

    let listRes: any;
    try {
      listRes = await drive.files.list(listParams);
    } catch {
      delete listParams.corpora;
      delete listParams.driveId;
      listRes = await drive.files.list(listParams);
    }

    const file = listRes.data.files?.[0];
    if (!file?.id) return null;

    const res = await drive.files.get(
      { fileId: file.id, alt: "media", supportsAllDrives: true },
      { responseType: "text" }
    );

    if (res.data) {
      const parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (parsed && Array.isArray(parsed.folders) && Array.isArray(parsed.books)) {
        if (catalogFilePath) {
          try {
            fs.writeFileSync(catalogFilePath, JSON.stringify(parsed, null, 2), "utf8");
          } catch {
            // ignore fs write error if readonly
          }
        }
        return parsed;
      }
    }
  } catch (err: any) {
    console.warn("Could not pull catalog from Google Drive:", err?.message || err);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Real-time Drive sync: rebuild the saved catalog from a live Drive listing.
// ---------------------------------------------------------------------------

const SYNC_ROOT_FOLDER_ID = "f-all-islamic-history-books";
const SYNC_ROOT_NAME = "All Islamic History Books";

/** File types the library keeps as books. Anything else (app config, canvas
 *  files, images, audio, archives) is skipped so the catalog stays clean. */
const SYNC_INCLUDE_EXTS = new Set(["pdf", "doc", "docx", "epub", "md", "txt", "rtf"]);

function syncCleanTitle(name: string): string {
  const base = name.replace(/\.(pdf|docx?|epub|md|txt|rtf)$/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
  return base || name;
}

function syncExt(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Convert a live Drive listing (raw Drive ids, /api/files preview URLs)
 * into the saved-catalog schema (f-<id> folders, b-<id> books, Drive
 * externalUrl links). Custom admin metadata (paid flag, price, custom
 * titles, visibility) is preserved from the stored catalog, matched by
 * driveFileId, so a sync never wipes an admin's paid-book settings.
 * Folders whose name starts with "." (e.g. Obsidian's .obsidian config
 * folder) and their contents are skipped.
 */
export function normalizeLiveCatalogToSaved(live: { folders: any[]; books: any[] }, stored: any): { folders: any[]; books: any[]; categoryOrder?: string[]; topicOrder?: string[] } {
  const storedFolders: any[] = Array.isArray(stored?.folders) ? stored.folders : [];
  const storedBooks: any[] = Array.isArray(stored?.books) ? stored.books : [];
  const storedFolderById = new Map<string, any>(storedFolders.map((f: any) => [f.id, f]));
  const storedBookByDriveId = new Map<string, any>();
  for (const b of storedBooks) {
    if (b?.driveFileId) storedBookByDriveId.set(b.driveFileId, b);
  }

  const rootFolder =
    storedFolders.find((f: any) => !f.parentId) || {
      id: SYNC_ROOT_FOLDER_ID,
      name: SYNC_ROOT_NAME,
      description: "Seerah, Tareekh, biographies and Islamic history, from the All Islamic History Books collection on Google Drive. Books open in Drive.",
      parentId: null,
      type: "category",
      externalUrl: `https://drive.google.com/drive/folders/${getDriveFolderId()}`,
      sortOrder: 0,
      order: 0,
      visible: true,
    };

  // Drop hidden folders (".obsidian" etc.) and anything below them.
  const hiddenFolderIds = new Set<string>();
  const liveFolders = (live.folders || []).filter((f: any) => {
    if (typeof f?.name === "string" && f.name.trim().startsWith(".")) {
      hiddenFolderIds.add(f.id);
      return false;
    }
    return true;
  });
  const isInHiddenTree = (folderId: string | null | undefined, byId: Map<string, any>): boolean => {
    let cur = folderId;
    const seen = new Set<string>();
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      if (hiddenFolderIds.has(cur)) return true;
      cur = byId.get(cur)?.parentId || null;
    }
    return false;
  };
  const liveFolderById = new Map<string, any>(liveFolders.map((f: any) => [f.id, f]));
  const folders: any[] = [rootFolder];
  let sortOrder = 1;
  for (const f of liveFolders) {
    if (isInHiddenTree(f.id, liveFolderById)) continue;
    const saved = storedFolderById.get(`f-${f.id}`);
    folders.push({
      id: `f-${f.id}`,
      name: f.name || "Untitled Folder",
      description: saved?.description ?? f.description ?? "",
      parentId: f.parentId ? `f-${f.parentId}` : SYNC_ROOT_FOLDER_ID,
      type: f.parentId ? "subfolder" : "category",
      externalUrl: `https://drive.google.com/drive/folders/${f.id}`,
      createdAt: f.createdTime || saved?.createdAt || new Date().toISOString(),
      updatedAt: f.modifiedTime || saved?.updatedAt || new Date().toISOString(),
      sortOrder: saved?.sortOrder ?? saved?.order ?? sortOrder,
      order: saved?.order ?? saved?.sortOrder ?? sortOrder,
      visible: saved?.visible !== undefined ? saved.visible : true,
    });
    sortOrder++;
  }

  const books: any[] = [];
  for (const file of live.books || []) {
    const ext = syncExt(file.name || "");
    if (!SYNC_INCLUDE_EXTS.has(ext)) continue;
    const parentFolder = file.subfolderId ? liveFolderById.get(file.subfolderId) : null;
    if (parentFolder && isInHiddenTree(parentFolder.id, liveFolderById)) continue;
    const saved = storedBookByDriveId.get(file.id);
    const isPdf = ext === "pdf";
    const isMd = ext === "md";
    books.push({
      id: `b-${file.id}`,
      title: saved?.title || file.title || syncCleanTitle(file.name || "Untitled"),
      originalFilename: file.originalFilename || file.name || "",
      author: saved?.author || file.author || "",
      description: saved?.description || file.description || "",
      category: saved?.category || file.category || SYNC_ROOT_NAME,
      topic: saved?.topic || undefined,
      folderId: file.folderId ? `f-${file.folderId}` : SYNC_ROOT_FOLDER_ID,
      subfolderId: file.subfolderId ? `f-${file.subfolderId}` : null,
      tags: saved?.tags || file.tags || [],
      fileType: isPdf ? "pdf" : "document",
      mimeType: file.mimeType || (isPdf ? "application/pdf" : isMd ? "text/markdown" : "application/octet-stream"),
      fileExtension: ext,
      fileSize: file.fileSize || "",
      driveFileId: file.id,
      externalUrl: `https://drive.google.com/file/d/${file.id}/view?usp=drivesdk`,
      isPaid: saved?.isPaid === true,
      price: saved?.price ?? undefined,
      sortOrder: saved?.sortOrder ?? undefined,
      isAuthentic: saved?.isAuthentic === true,
      addedDate: saved?.addedDate || file.addedDate || new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      featured: saved?.featured === true,
      visible: saved?.visible !== undefined ? saved.visible : true,
    });
  }

  // Admin-chosen topic/category order survives a Drive sync — it is not
  // a Drive fact, it is the library's own arrangement.
  const categoryOrder = Array.isArray(stored?.categoryOrder)
    ? stored.categoryOrder.filter((n: any) => typeof n === "string")
    : undefined;
  const topicOrder = Array.isArray(stored?.topicOrder)
    ? stored.topicOrder.filter((n: any) => typeof n === "string")
    : undefined;
  return {
    folders,
    books,
    ...(categoryOrder ? { categoryOrder } : {}),
    ...(topicOrder ? { topicOrder } : {}),
  };
}

export interface DriveSyncResult {
  ok: boolean;
  configured: boolean;
  error?: string;
  folders?: number;
  books?: number;
  categories?: number;
  addedBooks?: number;
  removedBooks?: number;
  addedFolders?: number;
  removedFolders?: number;
  savedToDrive?: boolean;
  syncedAt?: string;
  /** The rebuilt catalog (only when ok is true). The caller persists it. */
  catalog?: { folders: any[]; books: any[] };
}

/**
 * Rebuild the saved catalog from a fresh live listing of the Drive folder.
 * Returns a clear not-configured error (never a crash) when no service
 * account is set. Refuses to overwrite the stored catalog with an empty
 * live result (e.g. a Drive timeout), so a failed sync never wipes the
 * library. The rebuilt catalog is returned; the caller persists it with
 * writeCatalog(), which also saves a copy into the Drive folder.
 */
export async function syncCatalogFromDrive(storedCatalog: any): Promise<DriveSyncResult> {
  if (!isGoogleDriveConfigured()) {
    return {
      ok: false,
      configured: false,
      error:
        "Google Drive is not configured on this server. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel, and share the All Islamic History Books folder with that service account, then sync again.",
    };
  }

  invalidateDriveCache();
  let live: { folders: any[]; books: any[] };
  try {
    live = await fetchLiveDriveCatalog(storedCatalog);
  } catch (err: any) {
    return {
      ok: false,
      configured: true,
      error: `Live Drive listing failed: ${err?.message || err}`,
    };
  }

  if ((!live.folders || live.folders.length === 0) && (!live.books || live.books.length === 0)) {
    return {
      ok: false,
      configured: true,
      error: "Live Drive listing returned nothing. The saved catalog was kept unchanged.",
    };
  }

  const normalized = normalizeLiveCatalogToSaved(live, storedCatalog);
  const oldBooks: any[] = Array.isArray(storedCatalog?.books) ? storedCatalog.books : [];
  const oldFolders: any[] = Array.isArray(storedCatalog?.folders) ? storedCatalog.folders : [];
  const oldBookIds = new Set(oldBooks.map((b: any) => b.driveFileId || b.id));
  const newBookIds = new Set(normalized.books.map((b: any) => b.driveFileId));
  const oldFolderIds = new Set(oldFolders.map((f: any) => f.id));
  const newFolderIds = new Set(normalized.folders.map((f: any) => f.id));
  const categories = normalized.folders.filter((f: any) => f.parentId === SYNC_ROOT_FOLDER_ID).length;

  return {
    ok: true,
    configured: true,
    folders: normalized.folders.length,
    books: normalized.books.length,
    categories,
    addedBooks: normalized.books.filter((b: any) => !oldBookIds.has(b.driveFileId)).length,
    removedBooks: oldBooks.filter((b: any) => !newBookIds.has(b.driveFileId || b.id)).length,
    addedFolders: normalized.folders.filter((f: any) => !oldFolderIds.has(f.id)).length,
    removedFolders: oldFolders.filter((f: any) => !newFolderIds.has(f.id)).length,
    syncedAt: new Date().toISOString(),
    catalog: normalized,
  };
}


