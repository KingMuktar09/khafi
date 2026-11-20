/**
 * Cloudflare Edge / Web Crypto compliant Google Drive integration
 * Works seamlessly in Cloudflare Workers, Pages Functions, and Node.js
 */

export interface GoogleDriveConfig {
  email: string;
  privateKey: string;
  folderId: string;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

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

  if (key.startsWith("LS0t") || (!key.includes("BEGIN PRIVATE KEY") && !key.includes("BEGIN RSA PRIVATE KEY") && !key.includes("\n") && key.length > 200)) {
    try {
      let decoded = "";
      if (typeof Buffer !== "undefined") {
        decoded = Buffer.from(key, "base64").toString("utf8");
      } else if (typeof atob === "function") {
        decoded = atob(key);
      }
      if (decoded.includes("BEGIN PRIVATE KEY") || decoded.includes("BEGIN RSA PRIVATE KEY")) {
        key = decoded.trim();
      }
    } catch {
      // not base64
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

function base64url(input: string | Uint8Array): string {
  let str = "";
  if (typeof input === "string") {
    str = btoa(unescape(encodeURIComponent(input)));
  } else {
    let binary = "";
    const len = input.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(input[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeDerLength(length: number): number[] {
  if (length < 128) {
    return [length];
  } else if (length < 256) {
    return [0x81, length];
  } else if (length < 65536) {
    return [0x82, (length >> 8) & 0xff, length & 0xff];
  } else {
    return [0x83, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff];
  }
}

function wrapPkcs1InPkcs8(pkcs1Bytes: Uint8Array): ArrayBuffer {
  // AlgorithmIdentifier: SEQUENCE { OID 1.2.840.113549.1.1.1, NULL }
  const rsaAlgorithmIdentifier = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
  ];
  const version = [0x02, 0x01, 0x00];
  const octetStringHeader = [0x04, ...encodeDerLength(pkcs1Bytes.length)];
  const innerPayload = [
    ...version,
    ...rsaAlgorithmIdentifier,
    ...octetStringHeader,
    ...pkcs1Bytes,
  ];
  const sequenceHeader = [0x30, ...encodeDerLength(innerPayload.length)];
  const pkcs8Bytes = new Uint8Array([...sequenceHeader, ...innerPayload]);
  return pkcs8Bytes.buffer;
}

function pemToDer(pem: string): ArrayBuffer {
  const lines = pem.split(/\r?\n/);
  const base64Lines = lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith("-----");
  });
  let cleanBase64 = base64Lines.join("").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (cleanBase64.length % 4) cleanBase64 += "=";

  let bytes: Uint8Array;
  if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(cleanBase64, "base64");
    bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  } else if (typeof atob === "function") {
    const binary = atob(cleanBase64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } else {
    throw new Error("No base64 decoder available");
  }

  if (pem.includes("BEGIN RSA PRIVATE KEY")) {
    return wrapPkcs1InPkcs8(bytes);
  }

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

export function isDriveConfigured(config?: GoogleDriveConfig): boolean {
  if (!config) return false;
  const cleanFolderId = extractDriveFolderId(config.folderId);
  return Boolean(config.email && isValidPrivateKey(config.privateKey) && cleanFolderId);
}

/**
 * Mask an email for safe logging (e.g. "kh***@gen-lang-client-0661184713.iam.gserviceaccount.com")
 */
export function maskEmail(email?: string): string {
  if (!email) return "MISSING";
  const parts = email.split("@");
  if (parts.length === 2) {
    const user = parts[0];
    const maskedUser = user.length > 2 ? `${user.substring(0, 2)}***` : `${user}***`;
    return `${maskedUser}@${parts[1]}`;
  }
  return `${email.substring(0, 3)}***`;
}

/**
 * Get OAuth2 Access Token for Google Drive using RS256 signed JWT
 */
export async function getGoogleDriveAccessToken(config: GoogleDriveConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.token;
  }

  const email = (config.email || "").trim();
  const rawKey = parsePrivateKey(config.privateKey);

  if (!email) {
    throw new Error("Google Service Account email is missing.");
  }
  if (!rawKey || !isValidPrivateKey(rawKey)) {
    throw new Error("Google Service Account private key is missing or not a valid RSA PEM key.");
  }

  try {
    const derBuffer = pemToDer(rawKey);
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      derBuffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      false,
      ["sign"]
    );

    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
      iss: email,
      scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedClaims = base64url(JSON.stringify(claims));
    const dataToSign = new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`);

    const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, dataToSign);
    const encodedSignature = base64url(new Uint8Array(signatureBuffer));
    const assertion = `${encodedHeader}.${encodedClaims}.${encodedSignature}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text().catch(() => "");
      console.error(`[Drive Diagnostic] Google OAuth token request failed (${tokenRes.status}) for ${maskEmail(email)}:`, errText);
      throw new Error(`Failed to obtain Google access token (${tokenRes.status}): ${errText}`);
    }

    const tokenData: any = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error("Google OAuth2 response did not contain access_token.");
    }

    cachedAccessToken = {
      token: tokenData.access_token,
      expiresAt: now + (tokenData.expires_in || 3600),
    };

    console.log(`[Drive Diagnostic] Google OAuth2 access token acquired successfully for ${maskEmail(email)}.`);
    return tokenData.access_token;
  } catch (err: any) {
    console.error(`[Drive Diagnostic] Google OAuth2 token error for ${maskEmail(email)}:`, err?.message || err);
    throw err;
  }
}

/**
 * Test Google Drive folder connection
 */
export async function testDriveConnectionCf(config: GoogleDriveConfig): Promise<{
  configured: boolean;
  connected: boolean;
  folderName?: string;
  error?: string;
}> {
  const cleanFolderId = extractDriveFolderId(config.folderId);
  const isKeyValid = isValidPrivateKey(config.privateKey);

  if (!config.email || !cleanFolderId || !config.privateKey) {
    return {
      configured: false,
      connected: false,
      error: "Google Drive environment variables not configured (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID).",
    };
  }

  if (!isKeyValid) {
    return {
      configured: true,
      connected: false,
      error: "Invalid private key format: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must be a PEM-formatted RSA private key (starting with '-----BEGIN PRIVATE KEY-----') from your Google Service Account JSON credentials file.",
    };
  }

  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const folderRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${cleanFolderId}?fields=id,name,mimeType,trashed&supportsAllDrives=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!folderRes.ok) {
      const errText = await folderRes.text().catch(() => "");
      console.error(`[Drive Diagnostic] Drive test failed for folder (${folderRes.status}):`, errText);
      return {
        configured: true,
        connected: false,
        error: `Drive API error (${folderRes.status}): ${errText}`,
      };
    }

    const data: any = await folderRes.json();
    console.log(`[Drive Diagnostic] Drive test SUCCESS: Connected to folder "${data.name || "Drive Root"}"`);
    return {
      configured: true,
      connected: true,
      folderName: data.name || "Drive Root",
    };
  } catch (err: any) {
    console.error(`[Drive Diagnostic] Drive test exception:`, err?.message || err);
    return {
      configured: true,
      connected: false,
      error: err.message || "Failed to connect to Google Drive.",
    };
  }
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
  let base = name.replace(/\.[^/.]+$/, "").trim();
  if (base.includes(" - ")) {
    const parts = base.split(" - ");
    if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
      return {
        author: parts[0].trim(),
        title: parts[1].trim(),
      };
    }
  }
  const title = base.replace(/[_]/g, " ").replace(/\s+/g, " ").trim();
  return { title: title || name };
}

// In-memory cache for live Google Drive catalog listing on edge
interface CachedHierarchy {
  data: { folders: any[]; books: any[] };
  expiresAt: number;
}
let edgeHierarchyCache: CachedHierarchy | null = null;
let inFlightCfCatalogPromise: Promise<{ folders: any[]; books: any[] }> | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

export function invalidateDriveCacheCf(): void {
  edgeHierarchyCache = null;
}

export async function callDriveFetchWithRetry(
  url: string,
  options: RequestInit,
  opName = "Edge Drive Fetch"
): Promise<Response> {
  let lastRes: Response | null = null;
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      lastRes = res;

      if (res.status === 429 || res.status >= 500) {
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 5000);
          console.warn(`[Drive Diagnostic] ${opName} returned status ${res.status} (attempt ${attempt + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
      return res;
    } catch (err: any) {
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 5000);
        console.warn(`[Drive Diagnostic] ${opName} fetch error (attempt ${attempt + 1}/${maxRetries}): ${err?.message || err}. Retrying in ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }

  return lastRes!;
}

/**
 * Dynamically queries Google Drive for all folders and files under the configured root folder.
 */
export async function fetchLiveDriveCatalogCf(
  config: GoogleDriveConfig,
  storedCatalogMetadata?: any
): Promise<{ folders: any[]; books: any[] }> {
  const now = Date.now();
  if (edgeHierarchyCache && edgeHierarchyCache.expiresAt > now) {
    return edgeHierarchyCache.data;
  }

  if (inFlightCfCatalogPromise) {
    return inFlightCfCatalogPromise;
  }

  const emptyResult = { folders: [], books: [] };

  if (!isDriveConfigured(config)) {
    return emptyResult;
  }

  inFlightCfCatalogPromise = (async () => {
    try {
      const timeoutPromise = new Promise<{ folders: any[]; books: any[] }>((_, reject) =>
        setTimeout(() => reject(new Error("CF Google Drive query timed out after 8s")), 8000)
      );

      const fetchPromise = (async () => {
        const accessToken = await getGoogleDriveAccessToken(config);
        const rootFolderId = extractDriveFolderId(config.folderId);
        if (!rootFolderId) {
          console.warn("[Drive Diagnostic] No valid rootFolderId found in config.");
          return emptyResult;
        }

        console.log(`[Drive Diagnostic] Querying Google Drive hierarchy for root folder ID: ${rootFolderId}...`);
        const allDriveItemsMap = new Map<string, any>();
        let pageToken: string | undefined = undefined;
        let pageCount = 0;

        // Bulk single-query traversal (pageSize 1000)
        do {
          pageCount++;
          const q = "trashed = false";
          let fetchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            q
          )}&fields=nextPageToken,files(id,name,mimeType,parents,size,modifiedTime,createdTime,description,webViewLink)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true`;
          if (pageToken) {
            fetchUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
          }

          const listRes = await callDriveFetchWithRetry(
            fetchUrl,
            { headers: { Authorization: `Bearer ${accessToken}` } },
            `CF Catalog Page ${pageCount}`
          );

          if (!listRes.ok) {
            const errText = await listRes.text().catch(() => "");
            console.warn(`[Drive Diagnostic] Query returned status ${listRes.status}:`, errText);
            break;
          }

          const listData: any = await listRes.json();
          const files = listData.files || [];
          for (const item of files) {
            allDriveItemsMap.set(item.id, item);
          }
          pageToken = listData.nextPageToken || undefined;
        } while (pageToken && pageCount < 10);

        const allDriveItems = Array.from(allDriveItemsMap.values());
        const driveFolderMap = new Map<string, any>();
        allDriveItems
          .filter((item) => item.mimeType === "application/vnd.google-apps.folder")
          .forEach((f) => driveFolderMap.set(f.id, f));

        const treeFolderMap = new Map<string, any>();
        let sortOrder = 1;

        // Direct children of root (categories)
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

        // Iteratively discover subfolders
        let added = true;
        while (added) {
          added = false;
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
                added = true;
                break;
              }
            }
          }
        }

        // Merge stored folder metadata
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

        // Discover books/files
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
          if (file.name === "catalog.json" || file.name?.startsWith(".")) continue;

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

          if (!isInTree) continue;

          const ext = file.name?.split(".").pop()?.toLowerCase() || "";
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

        console.log(`[Drive Diagnostic] Live Drive fetch complete: ${finalFolders.length} folders, ${finalBooks.length} items (root: ${rootFolderId}).`);
        const result = { folders: finalFolders, books: finalBooks };
        edgeHierarchyCache = {
          data: result,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };
        return result;
      })();

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err: any) {
      console.error("[Drive Diagnostic] fetchLiveDriveCatalogCf failed:", err?.message || err);
      if (edgeHierarchyCache) return edgeHierarchyCache.data;
      return emptyResult;
    } finally {
      inFlightCfCatalogPromise = null;
    }
  })();

  return inFlightCfCatalogPromise;
}

/**
 * Create folder directly in Google Drive
 */
export async function createDriveFolderCf(
  name: string,
  parentId: string | null | undefined,
  description: string | undefined,
  config: GoogleDriveConfig
): Promise<{ id: string; name: string; parentId: string | null }> {
  const accessToken = await getGoogleDriveAccessToken(config);
  const targetParent = parentId || config.folderId;

  const res = await fetch("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: targetParent ? [targetParent] : undefined,
      description: description || "",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create Drive folder (${res.status}): ${errText}`);
  }

  const data: any = await res.json();
  invalidateDriveCacheCf();

  return {
    id: data.id,
    name: data.name || name,
    parentId: parentId || null,
  };
}

/**
 * Rename/update folder in Google Drive
 */
export async function renameDriveFolderCf(
  folderId: string,
  newName: string,
  newDescription: string | undefined,
  config: GoogleDriveConfig
): Promise<boolean> {
  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const body: any = { name: newName };
    if (newDescription !== undefined) {
      body.description = newDescription;
    }

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}?supportsAllDrives=true`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    invalidateDriveCacheCf();
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch catalog.json from Google Drive folder
 */
export async function pullCatalogFromDriveCf(config: GoogleDriveConfig): Promise<any | null> {
  if (!isDriveConfigured(config)) return null;

  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const query = encodeURIComponent(`'${config.folderId}' in parents and name = 'catalog.json' and trashed = false`);
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listRes.ok) return null;
    const listData: any = await listRes.json();
    const file = listData.files?.[0];
    if (!file?.id) return null;

    const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&supportsAllDrives=true`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!fileRes.ok) return null;
    const catalogJson = (await fileRes.json()) as { folders?: unknown[]; books?: unknown[] } | null;
    if (catalogJson && Array.isArray(catalogJson.folders) && Array.isArray(catalogJson.books)) {
      return catalogJson;
    }
  } catch (err) {
    console.warn("Could not pull catalog from Google Drive:", err);
  }
  return null;
}

/**
 * Save / Sync catalog.json to Google Drive folder
 */
export async function syncCatalogWithDriveCf(catalogData: any, config: GoogleDriveConfig): Promise<boolean> {
  if (!isDriveConfigured(config)) return false;

  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const query = encodeURIComponent(`'${config.folderId}' in parents and name = 'catalog.json' and trashed = false`);
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    let existingFileId: string | null = null;
    if (listRes.ok) {
      const listData: any = await listRes.json();
      existingFileId = listData.files?.[0]?.id || null;
    }

    const catalogString = JSON.stringify(catalogData, null, 2);

    if (existingFileId) {
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media&supportsAllDrives=true`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: catalogString,
        }
      );
      invalidateDriveCacheCf();
      return updateRes.ok;
    } else {
      const boundary = "-------314159265358979323846";
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelim = `\r\n--${boundary}--`;

      const metadata = {
        name: "catalog.json",
        parents: [config.folderId],
        mimeType: "application/json",
      };

      const multipartBody =
        delimiter +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        catalogString +
        closeDelim;

      const createRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: multipartBody,
        }
      );
      invalidateDriveCacheCf();
      return createRes.ok;
    }
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes("storage quota") || msg.includes("quota")) {
      console.warn("Notice: Google Drive service account storage quota limit reached. Catalog persisted locally.");
    } else {
      console.warn("Notice: Failed to sync catalog.json with Google Drive:", msg);
    }
    return false;
  }
}

/**
 * Upload binary file buffer / Uint8Array to Google Drive
 */
export async function uploadBinaryToDriveCf(
  filename: string,
  mimeType: string,
  data: Uint8Array | ArrayBuffer,
  config: GoogleDriveConfig,
  parentFolderId?: string
): Promise<{
  fileId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  webViewLink?: string;
}> {
  const accessToken = await getGoogleDriveAccessToken(config);
  const targetParent = parentFolderId || config.folderId;

  const boundary = "-------khafi_drive_upload_boundary";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = {
    name: filename,
    parents: [targetParent],
    mimeType: mimeType || "application/octet-stream",
    description: "Uploaded via Ilm-e-Ghayb Library",
  };

  const metadataPart = new TextEncoder().encode(
    delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType || "application/octet-stream"}\r\n\r\n`
  );

  const dataBytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const closePart = new TextEncoder().encode(closeDelim);

  const fullBody = new Uint8Array(metadataPart.length + dataBytes.length + closePart.length);
  fullBody.set(metadataPart, 0);
  fullBody.set(dataBytes, metadataPart.length);
  fullBody.set(closePart, metadataPart.length + dataBytes.length);

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: fullBody,
    }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Drive upload failed (${uploadRes.status}): ${errText}`);
  }

  const fileData: any = await uploadRes.json();
  if (!fileData.id) {
    throw new Error("Upload completed but no file ID returned from Google Drive.");
  }

  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions?supportsAllDrives=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "reader", type: "anyone" }),
    });
  } catch {
    // ignore
  }

  invalidateDriveCacheCf();

  return {
    fileId: fileData.id,
    filename: fileData.name || filename,
    mimeType: fileData.mimeType || mimeType,
    sizeBytes: fileData.size ? Number(fileData.size) : dataBytes.length,
    webViewLink: fileData.webViewLink,
  };
}

/**
 * Delete a file or folder from Google Drive
 */
export async function deleteDriveFileCf(fileId: string, config: GoogleDriveConfig): Promise<boolean> {
  if (!isDriveConfigured(config) || !fileId) return false;

  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    invalidateDriveCacheCf();
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

// Direct-to-Drive resumable upload sessions (same reason as the Express
// side: Workers have no shared disk, so chunked uploads assembled from
// per-isolate memory can never work — parts land on different isolates
// and the session is gone. The server only creates the session; the
// admin's browser PUTs the chunks straight to Google. The session URI is
// a capability for this one upload only: returned only to an
// authenticated admin, over HTTPS, never logged.
export async function createDriveResumableSessionCf(
  config: GoogleDriveConfig,
  options: { filename: string; mimeType?: string; folderId?: string }
): Promise<{ sessionUri: string }> {
  const accessToken = await getGoogleDriveAccessToken(config);
  const targetParent = options.folderId || config.folderId;
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": options.mimeType || "application/octet-stream",
      },
      body: JSON.stringify({
        name: options.filename,
        parents: targetParent ? [targetParent] : undefined,
        mimeType: options.mimeType || "application/octet-stream",
        description: "Uploaded via Ilm-e-Ghayb Library",
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Drive resumable session failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const sessionUri = res.headers.get("location");
  if (!sessionUri) {
    throw new Error("Google Drive did not return an upload session.");
  }
  return { sessionUri };
}

/** Confirm a Drive file exists and read its metadata (complete step). */
export async function getDriveFileMetadataCf(
  fileId: string,
  config: GoogleDriveConfig
): Promise<{ id: string; name: string; mimeType: string; size: number } | null> {
  if (!isDriveConfigured(config) || !fileId) return null;
  try {
    const accessToken = await getGoogleDriveAccessToken(config);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,size&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data?.id) return null;
    return {
      id: data.id,
      name: data.name || "file",
      mimeType: data.mimeType || "application/octet-stream",
      size: data.size ? Number(data.size) : 0,
    };
  } catch {
    return null;
  }
}
