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
  const num = typeof bytes === 'number' ? bytes : parseFloat(bytes);
  if (isNaN(num)) return typeof bytes === 'string' ? bytes : '';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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


