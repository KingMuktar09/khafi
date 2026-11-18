import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  File as GenericFileIcon,
  BookOpen,
} from 'lucide-react';
import { Book, ItemType } from '../types';
import { getFollowUnlockHeaders } from '../services/api';

export function getFileExtension(filename?: string): string {
  if (!filename) return '';
  const clean = filename.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1].toLowerCase();
}

export function detectFileType(filename?: string, mimeType?: string): ItemType {
  const ext = getFileExtension(filename);
  const mime = (mimeType || '').toLowerCase();

  if (ext === 'pdf' || mime.includes('pdf')) return 'pdf';

  if (
    ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf', 'csv', 'odt', 'ods', 'odp'].includes(ext) ||
    mime.includes('document') ||
    mime.includes('word') ||
    mime.includes('spreadsheet') ||
    mime.includes('presentation') ||
    mime.includes('text/')
  ) {
    return 'document';
  }

  if (
    ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'tiff', 'ico', 'heic'].includes(ext) ||
    mime.startsWith('image/')
  ) {
    return 'image';
  }

  if (
    ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'flv', 'wmv', '3gp'].includes(ext) ||
    mime.startsWith('video/')
  ) {
    return 'video';
  }

  if (
    ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac', 'wma', 'opus'].includes(ext) ||
    mime.startsWith('audio/')
  ) {
    return 'audio';
  }

  if (
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext) ||
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('archive')
  ) {
    return 'archive';
  }

  return 'other';
}

export function getItemType(item: Partial<Book>): ItemType {
  if (item.fileType) return item.fileType;
  const target = item.fileUrl || item.pdfUrl || item.title || '';
  return detectFileType(target, item.mimeType);
}

export function extractDriveId(url?: string): string | null {
  if (!url) return null;
  const clean = url.split('?')[0].replace(/\/(preview|stream|pdf|file|download)$/i, '').trim();
  if (clean.startsWith('/api/drive/file/')) return clean.replace('/api/drive/file/', '');
  if (clean.startsWith('/api/files/')) return clean.replace('/api/files/', '');
  if (clean.startsWith('/files/')) return clean.replace('/files/', '');
  if (clean.startsWith('/drive/file/')) return clean.replace('/drive/file/', '');
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(clean)) return clean;
  return null;
}

export function getDriveFileId(item: Partial<Book>): string | null {
  if (!item) return null;
  if (item.driveFileId) return item.driveFileId;
  return (
    extractDriveId(item.fileUrl) ||
    extractDriveId(item.pdfUrl) ||
    extractDriveId(item.externalUrl) ||
    extractDriveId((item as any).driveUrl)
  );
}

/**
 * Google Drive preview embed URL for in-app reading.
 * Drive's own viewer renders the PDF, so the app never has to fetch the
 * file bytes itself (the /api/files stream needs a Drive service account,
 * which this free deployment does not have).
 */
export function getDrivePreviewUrl(item: Partial<Book>): string | null {
  const driveId = getDriveFileId(item);
  if (!driveId) return null;
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

/** Google Drive viewer page for the file (opens in a new tab). */
export function getDriveViewUrl(item: Partial<Book>): string | null {
  if (item.externalUrl && item.externalUrl.includes('drive.google.com')) {
    return item.externalUrl;
  }
  const driveId = getDriveFileId(item);
  if (!driveId) return null;
  return `https://drive.google.com/file/d/${driveId}/view`;
}

/** Direct Drive download link for the file. */
export function getDriveDownloadUrl(item: Partial<Book>): string | null {
  const driveId = getDriveFileId(item);
  if (!driveId) return null;
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}

/**
 * Drive files whose thumbnail is NOT a usable cover, checked 18 Nov 2026
 * against every book in the catalog (all 173 thumbnail URLs fetched):
 * their first page renders blank white (or, for the docx, a junk web-page
 * export), so the generated title cover looks better. Files Drive has no
 * thumbnail for at all (the 36 Markdown notes, a few PDFs) are NOT listed
 * here — the <img> onError already falls back for those, because Drive
 * answers those with an HTML 404 the browser refuses to render as an image.
 */
const BLANK_COVER_FILE_IDS = new Set([
  '1ligTUyI9gQIG_vb5MFLdiIi5f0BZLOev', // The Book Of The Thousand Nights And A Night, Vol 9
  '1EV8e9zoIt4b0HQ3UUuKnhtrQpZ-sZH6E', // The Book Of The Thousand Nights And One Night, Vol 5
  '19P9vcgsn3kfgbqzjLbeCy1C6EA-sGBWa', // The Book Of The Thousand Nights And One Night, Vol 6
  '1TrImmeAtsGrrg_THonBNMwc_15746sFt', // Thousand Nights And A Night, Vol 8
  '1vmxvAHKMpMX_jroWuU38tIYcLSiJn2qz', // The Thousand Nights And One Night, Vol 7
  '1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5', // Kitab Al Bulhan (docx — Drive renders a web-page export)
  '1H9ot2gZvWC2jYdDmKPXcx764Jnp9pC8T', // Imam Nawawis 40 Hadith (near-blank first page)
]);

/**
 * Google Drive thumbnail: Drive renders the real first page of a PDF as an
 * image. Free, no bytes through our server, and it loads anonymously because
 * the library folder is shared "Anyone with the link can view". The visitor
 * catalog strips big data-URI covers (see server sanitizeBook), so without
 * this the grid shows only the generated title cover.
 * Only PDFs and images get one: Drive has no thumbnail for Markdown notes
 * (404) and renders junk for docx, so those fall back to the title cover
 * without a doomed request.
 */
export function getDriveThumbnailUrl(item: Partial<Book>, width = 400): string | null {
  const driveId = getDriveFileId(item);
  if (!driveId || BLANK_COVER_FILE_IDS.has(driveId)) return null;
  const type = getItemType(item);
  if (type !== 'pdf' && type !== 'image') return null;
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
}

/**
 * Best cover image for a book card. Drive books get their real first page
 * (the thumbnail); anything else falls back to the stored cover, then
 * undefined (the UI draws its generated title cover). Paid books get no
 * Drive id for visitors, so they never leak a thumbnail here.
 */
export function getBookCoverUrl(book: Partial<Book> | null | undefined): string | undefined {
  if (!book) return undefined;
  return getDriveThumbnailUrl(book) || book.thumbnailUrl || book.coverUrl || undefined;
}

export function getItemUrl(item: Partial<Book>): string {
  if (!item) return '';

  // 1. If driveFileId exists, use server stream/preview endpoint
  if (item.driveFileId) {
    return `/api/files/${item.driveFileId}/preview`;
  }

  const url = item.fileUrl || item.pdfUrl || '';

  // 2. If url is a Google Drive URL, extract Drive ID
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    const driveId = extractDriveId(url) || item.id;
    if (driveId) {
      return `/api/files/${driveId}/preview`;
    }
  }

  // 3. Local relative URL or sample path (/uploads/... or /sample-pdfs/...)
  if (url) return url;

  // 4. Fallback to book ID endpoint
  if (item.id) {
    return `/api/files/${item.id}/preview`;
  }

  return item.externalUrl || '';
}

/**
 * Badge text for a paid book on cards and rows. Paid books are FREE for
 * followers, so the badge never shows a price — there is no price anymore.
 * Returns 'Paid' for a paid book, null otherwise.
 */
export function getPaidBadgeLabel(book: Partial<Book> | null | undefined): string | null {
  return book?.isPaid ? 'Paid' : null;
}

export function getTypeLabel(itemOrType: Partial<Book> | ItemType, extension?: string): string {
  const type = typeof itemOrType === 'string' ? itemOrType : getItemType(itemOrType);
  const ext = extension || (typeof itemOrType !== 'string' ? getFileExtension(getItemUrl(itemOrType) || itemOrType.title) : '');

  if (ext) {
    const upperExt = ext.toUpperCase();
    if (['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'MD', 'JPG', 'PNG', 'WEBP', 'GIF', 'SVG', 'MP4', 'WEBM', 'MOV', 'MP3', 'WAV', 'M4A', 'OGG', 'ZIP', 'RAR', '7Z'].includes(upperExt)) {
      return upperExt;
    }
  }

  switch (type) {
    case 'pdf': return 'PDF';
    case 'document': return 'Document';
    case 'image': return 'Image';
    case 'video': return 'Video';
    case 'audio': return 'Audio';
    case 'archive': return 'Archive';
    default: return 'File';
  }
}

export function getTypeBadgeColor(type: ItemType): { bg: string; text: string; border: string } {
  switch (type) {
    case 'pdf':
      return { bg: 'bg-red-500/10', text: 'text-red-500 dark:text-red-400', border: 'border-red-500/20' };
    case 'document':
      return { bg: 'bg-blue-500/10', text: 'text-blue-500 dark:text-blue-400', border: 'border-blue-500/20' };
    case 'image':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-500/20' };
    case 'video':
      return { bg: 'bg-purple-500/10', text: 'text-purple-500 dark:text-purple-400', border: 'border-purple-500/20' };
    case 'audio':
      return { bg: 'bg-amber-500/10', text: 'text-amber-500 dark:text-amber-400', border: 'border-amber-500/20' };
    case 'archive':
      return { bg: 'bg-orange-500/10', text: 'text-orange-500 dark:text-orange-400', border: 'border-orange-500/20' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-500/20' };
  }
}

export function formatFileSize(bytes?: number | string): string {
  if (bytes === undefined || bytes === null || bytes === '') return '';
  // Catalog stores sizes as suffixed strings ("2.3 MB", "932.7 KB").
  // parseFloat("2.3 MB") is 2.3, which the old code then printed as "2.3 B".
  // Normalise suffixed strings through parseSizeBytes first.
  if (typeof bytes === 'string' && /[KMG]B/i.test(bytes)) {
    const parsed = parseSizeBytes(bytes);
    if (!parsed) return '';
    return formatFileSize(parsed);
  }
  const num = typeof bytes === 'number' ? bytes : parseFloat(bytes);
  if (isNaN(num)) return typeof bytes === 'string' ? bytes : '';
  if (num <= 0) return '';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Date for a catalog item. The catalog rebuild stamps every book/folder
 * with the same addedDate and updatedDate (the build date), which is not
 * a real per-item date — showing it as "Today" for every row is wrong.
 * Returns '' when added and updated are the same stamp, so callers show
 * '—' / hide the date instead of inventing one. A real per-item date
 * needs the sync/build step to store each Drive file's modifiedTime.
 */
const CATALOG_BUILD_STAMP = '2026-11-17T00:00:00.000Z';
export function formatCatalogDate(added?: string, updated?: string): string {
  const a = added || '';
  const u = updated || '';
  if (a && u && a === u && a === CATALOG_BUILD_STAMP) return '';
  return formatReadableDate(u || a);
}

export function extractTitleFromFilename(rawTitle?: string): string {
  if (!rawTitle) return 'Untitled';
  let title = rawTitle.trim();
  // Strip trailing extension ONLY (e.g. .pdf, .docx, .mp4, etc.)
  const withoutExt = title.replace(/\.[^/.]+$/, '');
  return withoutExt.trim() || title;
}

export function formatCleanTitle(rawTitle?: string): string {
  return extractTitleFromFilename(rawTitle);
}

export function formatReadableDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0 && now.getDate() === date.getDate()) {
      return 'Today';
    }
    if (diffDays === 1 || (diffDays === 0 && now.getDate() - date.getDate() === 1)) {
      return 'Yesterday';
    }
    if (diffDays >= 2 && diffDays <= 6) {
      return `${diffDays} days ago`;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function parseSizeBytes(sizeVal?: number | string): number {
  if (sizeVal === undefined || sizeVal === null || sizeVal === '') return 0;
  if (typeof sizeVal === 'number') return sizeVal;
  const str = String(sizeVal).trim().toUpperCase();
  const num = parseFloat(str);
  if (isNaN(num)) return 0;

  if (str.includes('GB')) return num * 1024 * 1024 * 1024;
  if (str.includes('MB')) return num * 1024 * 1024;
  if (str.includes('KB')) return num * 1024;
  if (str.includes('B')) return num;
  return num;
}

/**
 * Safely downloads a file from the server using fetch + blob verification.
 * Prevents saving HTML responses (e.g. __cookie_check.html or 404/index.html) as binary files.
 */
export async function downloadBookFile(
  book: Partial<Book>,
  onProgress?: (status: 'starting' | 'downloading' | 'done' | 'error', message?: string) => void
): Promise<boolean> {
  const fileUrl = getItemUrl(book);

  if (!fileUrl && !book.id && !book.driveFileId) {
    alert("No file URL available for this item.");
    return false;
  }

  // Drive books: download straight from Google Drive. The /api/files
  // stream needs a Drive service account, which this free deployment does
  // not have, so fetching it from our own server would fail with 503.
  const driveDownloadUrl = getDriveDownloadUrl(book);
  if (driveDownloadUrl) {
    window.open(driveDownloadUrl, '_blank', 'noopener,noreferrer');
    onProgress?.('done');
    return true;
  }

  // Construct target download API URL
  let fetchUrl = '';
  if (book.id || book.driveFileId) {
    fetchUrl = `/api/files/${encodeURIComponent((book.driveFileId || book.id)!)}/download`;
  } else if (fileUrl.startsWith('/uploads/')) {
    fetchUrl = `/api/download?file=${encodeURIComponent(fileUrl)}`;
  } else if (fileUrl.startsWith('/sample-pdfs/')) {
    fetchUrl = `/api/download?file=${encodeURIComponent(fileUrl)}`;
  } else if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    const driveId = extractDriveId(fileUrl);
    if (driveId) {
      fetchUrl = `/api/files/${encodeURIComponent(driveId)}/download`;
    } else {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return true;
    }
  } else {
    fetchUrl = fileUrl;
  }

  // Derive target download filename with correct extension
  const ext = getFileExtension(fileUrl || book.originalFilename || book.title) || 'pdf';
  let targetFilename = book.originalFilename || '';

  if (!targetFilename) {
    const cleanTitle = extractTitleFromFilename(book.title || 'download');
    if (cleanTitle.toLowerCase().endsWith(`.${ext}`)) {
      targetFilename = cleanTitle;
    } else {
      targetFilename = `${cleanTitle}.${ext}`;
    }
  }

  // Clean filename for safety
  targetFilename = targetFilename.replace(/[/\\?%*:|"<>]/g, '_');

  try {
    onProgress?.('starting');

    const response = await fetch(fetchUrl, {
      method: 'GET',
      credentials: 'same-origin',
      // Paid books are free for followers: send the unlock flag so the
      // server serves a paid file instead of 402 (see services/api).
      headers: getFollowUnlockHeaders(),
    });

    if (!response.ok) {
      console.error(`Download failed with status: ${response.status}`);
      alert(`Unable to download the file. The server returned error ${response.status}.`);
      onProgress?.('error', `HTTP ${response.status}`);
      return false;
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // CRITICAL: Verify response is NOT HTML!
    if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
      console.error("Download blocked: Server returned HTML instead of a binary file.", contentType);
      alert("Unable to download the file. The server returned an invalid response.");
      onProgress?.('error', 'HTML response received');
      return false;
    }

    onProgress?.('downloading');
    const blob = await response.blob();

    // Double check blob type isn't text/html
    if (blob.type && (blob.type.includes('text/html') || blob.type.includes('application/xhtml+xml'))) {
      console.error("Download blocked: Blob type is HTML.", blob.type);
      alert("Unable to download the file. The server returned an invalid response.");
      onProgress?.('error', 'HTML blob received');
      return false;
    }

    // Extract filename from Content-Disposition header if provided
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
      if (match && match[1]) {
        try {
          targetFilename = decodeURIComponent(match[1]);
        } catch {
          targetFilename = match[1];
        }
      }
    }

    // Trigger browser download via Blob URL
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = targetFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 5000);

    onProgress?.('done');
    return true;
  } catch (err: any) {
    console.error("Error during file download:", err);
    alert("Unable to download the file due to a network or connection error.");
    onProgress?.('error', err.message);
    return false;
  }
}

export async function downloadFileFromUrl(url: string, filename?: string): Promise<boolean> {
  return downloadBookFile({ fileUrl: url, title: filename || 'file' });
}


