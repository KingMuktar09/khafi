import dns from "dns";
import net from "net";
import http from "http";
import https from "https";
import { Readable, PassThrough } from "stream";
import path from "path";
import fs from "fs";

export const MAX_IMPORT_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const PROBE_TIMEOUT_MS = 15 * 1000; // 15 seconds
const DOWNLOAD_TIMEOUT_MS = 180 * 1000; // 3 minutes for large downloads
const MAX_REDIRECTS = 5;

// Blocked hostnames / patterns
const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.google",
  "metadata",
  "instance-data",
  "169.254.169.254",
];

const BLOCKED_HOST_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".lan",
  ".home",
  ".corp",
  ".intranet",
  ".onion",
];

/**
 * Check whether an IPv4 address is private, loopback, link-local, or reserved
 */
export function isPrivateOrReservedIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Invalid IPv4 is considered unsafe
  }

  const [a, b, c, d] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private)
  if (a === 10) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local / Cloud metadata)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (a === 192 && b === 0 && c === 0) return true;
  // 192.0.2.0/24 (TEST-NET-1)
  if (a === 192 && b === 0 && c === 2) return true;
  // 192.88.99.0/24 (6to4 Relay Anycast)
  if (a === 192 && b === 88 && c === 99) return true;
  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if (a === 198 && b === 51 && c === 100) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if (a === 203 && b === 0 && c === 113) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 (Reserved) & 255.255.255.255 (Broadcast)
  if (a >= 240) return true;

  return false;
}

/**
 * Check whether an IPv6 address is private, loopback, link-local, or reserved
 */
export function isPrivateOrReservedIpv6(ip: string): boolean {
  const cleanIp = ip.toLowerCase().trim();

  // Loopback / Unspecified
  if (cleanIp === "::1" || cleanIp === "::" || cleanIp === "0:0:0:0:0:0:0:1" || cleanIp === "0:0:0:0:0:0:0:0") {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:192.168.1.1)
  if (cleanIp.startsWith("::ffff:") || cleanIp.includes("::ffff:")) {
    const lastPart = cleanIp.split(":").pop() || "";
    if (net.isIPv4(lastPart)) {
      return isPrivateOrReservedIpv4(lastPart);
    }
  }

  // Unique Local Address (fc00::/7 -> fc00:: to fdff::)
  if (cleanIp.startsWith("fc") || cleanIp.startsWith("fd")) {
    return true;
  }

  // Link-Local (fe80::/10 -> fe80:: to febf::)
  if (
    cleanIp.startsWith("fe8") ||
    cleanIp.startsWith("fe9") ||
    cleanIp.startsWith("fea") ||
    cleanIp.startsWith("feb")
  ) {
    return true;
  }

  // Discard prefix (100::/64)
  if (cleanIp.startsWith("100::")) {
    return true;
  }

  return false;
}

/**
 * Validate URL string and resolve DNS to ensure it is not targeting internal or private IP spaces (SSRF protection)
 */
export async function validateUrlForSsrf(
  rawUrl: string
): Promise<{ valid: boolean; error?: string; parsedUrl?: URL }> {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return { valid: false, error: "URL cannot be empty." };
  }

  const trimmed = rawUrl.trim();

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format. Please provide a full URL including https:// or http://." };
  }

  // Enforce http/https only
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      valid: false,
      error: `Unsupported protocol "${parsedUrl.protocol}". Only HTTP and HTTPS file URLs are allowed.`,
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase().trim();

  if (!hostname) {
    return { valid: false, error: "URL is missing a valid hostname." };
  }

  // Reject blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return {
      valid: false,
      error: "Access to localhost, cloud metadata, or internal addresses is blocked for security.",
    };
  }

  // Reject blocked suffixes (.local, .internal, etc.)
  for (const suffix of BLOCKED_HOST_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return {
        valid: false,
        error: `Access to internal hostnames (${suffix}) is blocked for security.`,
      };
    }
  }

  // If the hostname is already an IP address directly
  if (net.isIPv4(hostname)) {
    if (isPrivateOrReservedIpv4(hostname)) {
      return {
        valid: false,
        error: "Direct access to private or reserved IP addresses is prohibited.",
      };
    }
  } else if (net.isIPv6(hostname)) {
    if (isPrivateOrReservedIpv6(hostname)) {
      return {
        valid: false,
        error: "Direct access to private or reserved IPv6 addresses is prohibited.",
      };
    }
  } else {
    // Resolve DNS lookups to check all resolved IP addresses
    try {
      const records = await dns.promises.lookup(hostname, { all: true });
      if (!records || records.length === 0) {
        return { valid: false, error: `Could not resolve hostname "${hostname}".` };
      }

      for (const record of records) {
        if (record.family === 4) {
          if (isPrivateOrReservedIpv4(record.address)) {
            return {
              valid: false,
              error: `Host "${hostname}" resolved to prohibited private IP address ${record.address}.`,
            };
          }
        } else if (record.family === 6) {
          if (isPrivateOrReservedIpv6(record.address)) {
            return {
              valid: false,
              error: `Host "${hostname}" resolved to prohibited IPv6 address ${record.address}.`,
            };
          }
        }
      }
    } catch (dnsErr: any) {
      return {
        valid: false,
        error: `DNS lookup failed for "${hostname}": ${dnsErr.message || "Hostname not found."}`,
      };
    }
  }

  return { valid: true, parsedUrl };
}

/**
 * Sanitize filename to prevent directory traversal, invalid characters, and code execution
 */
export function sanitizeFilename(filename: string, fallbackExt?: string): string {
  if (!filename) filename = "imported_file";

  let clean = filename
    .replace(/[\x00-\x1f\x80-\x9f]/g, "") // Remove control characters
    .replace(/[\/\\]/g, "") // Strip slashes
    .replace(/\.\.+/g, ".") // Collapse double dots
    .replace(/[<>:"|?*]/g, "_") // Replace filesystem forbidden characters
    .trim();

  // Strip leading dots or underscores
  clean = clean.replace(/^[._]+/, "");

  if (!clean || clean === ".") {
    clean = `imported_file_${Date.now()}`;
  }

  // Ensure file has an extension if fallbackExt is provided and clean doesn't have one
  if (fallbackExt && !clean.includes(".")) {
    const ext = fallbackExt.replace(/^\./, "").toLowerCase();
    if (ext) clean = `${clean}.${ext}`;
  }

  // Limit max filename length to 200 characters
  if (clean.length > 200) {
    const ext = path.extname(clean);
    const base = path.basename(clean, ext);
    clean = `${base.substring(0, 190)}${ext}`;
  }

  return clean;
}

/**
 * Detect extension and ItemType from Content-Type and/or filename
 */
export function detectExtensionFromMime(mimeType?: string): string {
  if (!mimeType) return "";
  const cleanMime = mimeType.split(";")[0].toLowerCase().trim();

  const mimeMap: Record<string, string> = {
    "application/pdf": "pdf",
    "application/epub+zip": "epub",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "text/plain": "txt",
    "text/markdown": "md",
    "text/html": "html",
    "text/csv": "csv",
    "application/rtf": "rtf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/flac": "flac",
    "audio/x-m4a": "m4a",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/x-matroska": "mkv",
    "video/quicktime": "mov",
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
    "application/x-rar-compressed": "rar",
    "application/vnd.rar": "rar",
    "application/x-7z-compressed": "7z",
    "application/gzip": "gz",
    "application/x-tar": "tar",
  };

  return mimeMap[cleanMime] || "";
}

export function detectItemTypeFromExtAndMime(
  filename?: string,
  mimeType?: string
): "pdf" | "document" | "image" | "video" | "audio" | "archive" | "other" {
  const ext = filename ? path.extname(filename).replace(".", "").toLowerCase() : "";
  const mime = (mimeType || "").toLowerCase();

  if (ext === "pdf" || mime.includes("pdf")) return "pdf";
  if (
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md", "rtf", "csv", "odt", "ods", "odp", "epub"].includes(
      ext
    ) ||
    mime.includes("document") ||
    mime.includes("word") ||
    mime.includes("text/") ||
    mime.includes("epub")
  ) {
    return "document";
  }
  if (
    ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "tiff", "ico"].includes(ext) ||
    mime.startsWith("image/")
  ) {
    return "image";
  }
  if (
    ["mp4", "webm", "mov", "mkv", "avi", "m4v", "flv", "wmv", "3gp"].includes(ext) ||
    mime.startsWith("video/")
  ) {
    return "video";
  }
  if (
    ["mp3", "wav", "m4a", "ogg", "flac", "aac", "wma", "opus"].includes(ext) ||
    mime.startsWith("audio/")
  ) {
    return "audio";
  }
  if (
    ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(ext) ||
    mime.includes("zip") ||
    mime.includes("compressed") ||
    mime.includes("archive")
  ) {
    return "archive";
  }
  return "other";
}

/**
 * Format bytes to readable size (e.g., "14.5 MB")
 */
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

/**
 * Extract filename from Content-Disposition header
 */
export function extractFilenameFromContentDisposition(header?: string | null): string | null {
  if (!header) return null;

  // 1. Check filename*=UTF-8''encoded_name
  const utf8Match = header.match(/filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/['"]/g, ""));
    } catch {
      return utf8Match[1].trim().replace(/['"]/g, "");
    }
  }

  // 2. Check filename="name" or filename=name
  const match = header.match(/filename\s*=\s*("([^"]+)"|([^;]+))/i);
  if (match) {
    const raw = match[2] || match[3];
    if (raw) return raw.trim().replace(/^['"]|['"]$/g, "");
  }

  return null;
}

export interface ProbeResult {
  url: string;
  finalUrl: string;
  filename: string;
  title: string;
  author?: string;
  mimeType: string;
  fileType: "pdf" | "document" | "image" | "video" | "audio" | "archive" | "other";
  sizeBytes: number;
  fileSize: string;
  supportsRanges: boolean;
}

/**
 * Probe a remote URL with full SSRF validation & redirect following
 */
export async function probeRemoteUrl(initialUrl: string): Promise<ProbeResult> {
  let currentUrl = initialUrl.trim();
  let redirectCount = 0;
  let finalHeaders: Record<string, string> = {};
  let finalStatus = 0;
  let finalUrl = currentUrl;

  while (redirectCount <= MAX_REDIRECTS) {
    const ssrfCheck = await validateUrlForSsrf(currentUrl);
    if (!ssrfCheck.valid || !ssrfCheck.parsedUrl) {
      throw new Error(ssrfCheck.error || "URL failed security validation.");
    }

    finalUrl = currentUrl;

    const response = await fetchWithTimeout(
      currentUrl,
      {
        method: "HEAD",
        headers: {
          "User-Agent": "KhafiLibrary/2.0 (+https://github.com/khafi-library)",
          Accept: "*/*",
        },
      },
      PROBE_TIMEOUT_MS
    );

    finalStatus = response.status;
    const headersObj: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headersObj[key.toLowerCase()] = val;
    });

    // Handle redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(finalStatus)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`Server returned redirect status ${finalStatus} without a Location header.`);
      }

      currentUrl = new URL(location, currentUrl).href;
      redirectCount++;
      continue;
    }

    // If HEAD method not allowed (405) or unsupported (403), retry with a range GET request
    if (finalStatus === 405 || finalStatus === 403 || finalStatus === 501) {
      const getResponse = await fetchWithTimeout(
        currentUrl,
        {
          method: "GET",
          headers: {
            "User-Agent": "KhafiLibrary/2.0 (+https://github.com/khafi-library)",
            Range: "bytes=0-1024",
            Accept: "*/*",
          },
        },
        PROBE_TIMEOUT_MS
      );

      finalStatus = getResponse.status;
      getResponse.headers.forEach((val, key) => {
        headersObj[key.toLowerCase()] = val;
      });

      // Cancel GET body stream immediately to avoid downloading the rest
      try {
        if (getResponse.body) {
          const reader = getResponse.body.getReader();
          reader.cancel();
        }
      } catch {
        // ignore
      }
    }

    finalHeaders = headersObj;
    break;
  }

  if (redirectCount > MAX_REDIRECTS) {
    throw new Error("Too many redirects (maximum 5 redirects allowed).");
  }

  if (finalStatus < 200 || finalStatus >= 400) {
    throw new Error(`Remote server returned HTTP error status ${finalStatus}.`);
  }

  const contentDisposition = finalHeaders["content-disposition"] || "";
  const contentType = (finalHeaders["content-type"] || "application/octet-stream").split(";")[0].toLowerCase().trim();
  const contentLengthHeader = finalHeaders["content-length"];
  const acceptRanges = finalHeaders["accept-ranges"] === "bytes";

  let sizeBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
  if (isNaN(sizeBytes) || sizeBytes < 0) sizeBytes = 0;

  if (sizeBytes > MAX_IMPORT_FILE_SIZE) {
    throw new Error(
      `File size (${formatBytes(sizeBytes)}) exceeds the maximum allowed import limit of 500 MB.`
    );
  }

  // Extract filename
  let detectedFilename = extractFilenameFromContentDisposition(contentDisposition);
  if (!detectedFilename) {
    try {
      const parsedPath = new URL(finalUrl).pathname;
      const basename = path.basename(decodeURIComponent(parsedPath));
      if (basename && basename !== "/" && basename.length > 0) {
        detectedFilename = basename;
      }
    } catch {
      // fallback
    }
  }

  const fallbackExt = detectExtensionFromMime(contentType);
  detectedFilename = sanitizeFilename(detectedFilename || `file_${Date.now()}`, fallbackExt);

  const fileType = detectItemTypeFromExtAndMime(detectedFilename, contentType);

  // Auto clean title
  const rawTitle = path.basename(detectedFilename, path.extname(detectedFilename));
  let title = rawTitle.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  let author: string | undefined = undefined;

  // If formatted as "Author - Title"
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
      author = parts[0].trim();
      title = parts[1].trim();
    }
  }

  if (!title) title = detectedFilename;

  return {
    url: initialUrl,
    finalUrl,
    filename: detectedFilename,
    title,
    author,
    mimeType: contentType,
    fileType,
    sizeBytes,
    fileSize: sizeBytes > 0 ? formatBytes(sizeBytes) : "Unknown size",
    supportsRanges: acceptRanges,
  };
}

/**
 * Fetch a remote URL as a readable stream with strict size and timeout enforcement
 */
export async function downloadRemoteFileStream(
  initialUrl: string
): Promise<{
  stream: Readable;
  finalUrl: string;
  detectedFilename: string;
  mimeType: string;
  sizeBytes: number;
}> {
  let currentUrl = initialUrl.trim();
  let redirectCount = 0;
  let finalResponse: Response | null = null;
  let finalUrl = currentUrl;

  while (redirectCount <= MAX_REDIRECTS) {
    const ssrfCheck = await validateUrlForSsrf(currentUrl);
    if (!ssrfCheck.valid || !ssrfCheck.parsedUrl) {
      throw new Error(ssrfCheck.error || "URL failed security validation.");
    }

    finalUrl = currentUrl;

    const response = await fetchWithTimeout(
      currentUrl,
      {
        method: "GET",
        headers: {
          "User-Agent": "KhafiLibrary/2.0 (+https://github.com/khafi-library)",
          Accept: "*/*",
        },
      },
      DOWNLOAD_TIMEOUT_MS
    );

    // Handle redirects
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`Server returned redirect status ${response.status} without a Location header.`);
      }

      currentUrl = new URL(location, currentUrl).href;
      redirectCount++;
      continue;
    }

    if (!response.ok) {
      throw new Error(`Failed to download remote file. Server returned HTTP ${response.status} ${response.statusText}`);
    }

    finalResponse = response;
    break;
  }

  if (!finalResponse || !finalResponse.body) {
    throw new Error("Remote server returned an empty or invalid response body.");
  }

  const contentDisposition = finalResponse.headers.get("content-disposition");
  const contentType = (finalResponse.headers.get("content-type") || "application/octet-stream")
    .split(";")[0]
    .toLowerCase()
    .trim();
  const contentLength = finalResponse.headers.get("content-length");

  let sizeBytes = contentLength ? parseInt(contentLength, 10) : 0;
  if (isNaN(sizeBytes) || sizeBytes < 0) sizeBytes = 0;

  if (sizeBytes > MAX_IMPORT_FILE_SIZE) {
    throw new Error(
      `File size (${formatBytes(sizeBytes)}) exceeds the maximum allowed import limit of 500 MB.`
    );
  }

  let detectedFilename = extractFilenameFromContentDisposition(contentDisposition);
  if (!detectedFilename) {
    try {
      const parsedPath = new URL(finalUrl).pathname;
      const basename = path.basename(decodeURIComponent(parsedPath));
      if (basename && basename !== "/" && basename.length > 0) {
        detectedFilename = basename;
      }
    } catch {
      // fallback
    }
  }

  const fallbackExt = detectExtensionFromMime(contentType);
  detectedFilename = sanitizeFilename(detectedFilename || `file_${Date.now()}`, fallbackExt);

  // Convert Web ReadableStream to Node Readable while enforcing size limit
  const webStream = finalResponse.body;
  const reader = webStream.getReader();
  const passThrough = new PassThrough();
  let downloadedBytes = 0;

  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          passThrough.end();
          break;
        }

        downloadedBytes += value.length;
        if (downloadedBytes > MAX_IMPORT_FILE_SIZE) {
          reader.cancel();
          passThrough.destroy(
            new Error(`Downloaded stream exceeded maximum allowed size of 500 MB.`)
          );
          break;
        }

        passThrough.write(Buffer.from(value));
      }
    } catch (err: any) {
      passThrough.destroy(err);
    }
  })();

  return {
    stream: passThrough,
    finalUrl,
    detectedFilename,
    mimeType: contentType,
    sizeBytes: sizeBytes || downloadedBytes,
  };
}

/**
 * Fetch wrapper with timeout signal
 */
async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs: number = 15000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: "manual", // We validate and follow redirects manually
    });
    return response;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
