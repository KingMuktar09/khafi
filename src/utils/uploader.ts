import { ItemType } from '../types';

const ADMIN_TOKEN_KEY = 'khafi_admin_token';

function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['x-admin-token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface UploadOptions {
  file: File;
  folderId?: string;
  onProgress?: (progress: { loadedBytes: number; totalBytes: number; percentage: number }) => void;
  signal?: AbortSignal;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  driveFileId?: string;
  driveUrl?: string;
  fileType?: ItemType;
  mimeType?: string;
  sizeBytes?: number;
  size?: string;
  error?: string;
}

// Vercel caps EVERY serverless request body at 4.5 MB (all plans —
// a bigger body fails with 413 FUNCTION_PAYLOAD_TOO_LARGE). So a chunk
// must stay under that, multipart overhead included, and any file bigger
// than one safe request must go the chunked way. The old values (10 MB
// chunks, chunked only above 100 MB) meant a normal 5–100 MB book PDF was
// sent in ONE request, failed with 413, and was then retried whole from
// zero three times — the endless "Uploading..." spinner. A 100 MB+ file
// fared no better: every 10 MB part was over the same 4.5 MB cap.
const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MiB per chunk — safely under 4.5 MB
const MULTIPART_THRESHOLD = 4 * 1024 * 1024; // files above 4 MB go chunked
const MAX_RETRIES = 3;

/**
 * Helper to execute a fetch or XHR operation with exponential backoff retries for transient errors.
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  signal?: AbortSignal
): Promise<T> {
  let attempt = 0;
  while (true) {
    if (signal?.aborted) {
      throw new Error('Upload cancelled by user.');
    }
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (signal?.aborted || attempt > retries) {
        throw err;
      }
      const delay = Math.pow(2, attempt - 1) * 500 + Math.random() * 200; // 500ms, 1200ms, 2200ms
      console.warn(`Transient upload error (attempt ${attempt}/${retries}). Retrying in ${Math.round(delay)}ms...`, err);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, delay);
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('Upload cancelled by user.'));
          });
        }
      });
    }
  }
}

/**
 * Uploads a single file using standard XHR POST (for files < 100 MB).
 */
function uploadSingleXhr(
  file: File,
  folderId?: string,
  onProgress?: (progress: { loadedBytes: number; totalBytes: number; percentage: number }) => void,
  signal?: AbortSignal
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');

    const headers = getAuthHeaders();
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled by user.'));
      });
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentage = Math.min(99, Math.round((e.loaded / e.total) * 100));
        onProgress({ loadedBytes: e.loaded, totalBytes: e.total, percentage });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            onProgress?.({ loadedBytes: file.size, totalBytes: file.size, percentage: 100 });
            resolve(res);
          } else {
            reject(new Error(res.error || 'Upload failed'));
          }
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || `HTTP ${xhr.status} upload error`));
        } catch {
          reject(new Error(`Server error (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during file upload'));
    xhr.ontimeout = () => reject(new Error('Upload request timed out'));

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }
    xhr.send(formData);
  });
}

/**
 * Uploads a chunk/part via XHR.
 */
function uploadPartXhr(
  uploadId: string,
  partNumber: number,
  chunkBlob: Blob,
  fileSize: number,
  completedChunkBytes: number,
  onProgress?: (progress: { loadedBytes: number; totalBytes: number; percentage: number }) => void,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload/part');

    const headers = getAuthHeaders();
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled by user.'));
      });
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const currentLoaded = completedChunkBytes + e.loaded;
        const percentage = Math.min(99, Math.round((currentLoaded / fileSize) * 100));
        onProgress({ loadedBytes: Math.min(currentLoaded, fileSize), totalBytes: fileSize, percentage });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            resolve();
          } else {
            reject(new Error(res.error || `Failed uploading part ${partNumber}`));
          }
        } catch {
          reject(new Error(`Invalid response uploading part ${partNumber}`));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || `HTTP ${xhr.status} uploading part ${partNumber}`));
        } catch {
          reject(new Error(`Server error (${xhr.status}) uploading part ${partNumber}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error(`Network error uploading part ${partNumber}`));
    xhr.ontimeout = () => reject(new Error(`Timeout uploading part ${partNumber}`));

    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('partNumber', String(partNumber));
    formData.append('chunk', chunkBlob, `part-${partNumber}`);
    xhr.send(formData);
  });
}

/**
 * Performs a resumable multipart chunked upload for files >= 100 MB.
 */
async function uploadMultipart(
  file: File,
  folderId?: string,
  onProgress?: (progress: { loadedBytes: number; totalBytes: number; percentage: number }) => void,
  signal?: AbortSignal
): Promise<UploadResult> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // 1. Initialize upload session
  const initRes = await retryWithBackoff(async () => {
    const res = await fetch('/api/admin/upload/init', {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        chunkSize: CHUNK_SIZE,
        totalChunks,
        folderId: folderId || undefined,
      }),
      signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initialize multipart upload session');
    return data;
  }, MAX_RETRIES, signal);

  const uploadId: string = initRes.uploadId;

  try {
    // 2. Check for existing completed parts (for session resumption if retrying)
    let completedPartsSet = new Set<number>();
    try {
      const statusRes = await fetch(`/api/admin/upload/status?uploadId=${encodeURIComponent(uploadId)}`, {
        headers: getAuthHeaders(),
        signal,
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (Array.isArray(statusData.completedParts)) {
          completedPartsSet = new Set(statusData.completedParts);
        }
      }
    } catch {
      // ignore
    }

    // Calculate initial byte progress from already completed parts
    let completedBytes = 0;
    for (let p = 0; p < totalChunks; p++) {
      if (completedPartsSet.has(p)) {
        const start = p * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        completedBytes += end - start;
      }
    }

    onProgress?.({
      loadedBytes: completedBytes,
      totalBytes: file.size,
      percentage: Math.min(99, Math.round((completedBytes / file.size) * 100)),
    });

    // 3. Upload missing chunks in parallel with retries. Small (4 MB)
    // parts mean a slow connection still finishes each part quickly, and a
    // failed part is retried on its own instead of restarting the file.
    const PARALLEL_PARTS = 3;
    const missingPartIndices: number[] = [];
    for (let p = 0; p < totalChunks; p++) {
      if (!completedPartsSet.has(p)) {
        missingPartIndices.push(p);
      }
    }

    let nextPartIdx = 0;
    let bytesUploadedSoFar = completedBytes;

    const partWorker = async () => {
      while (nextPartIdx < missingPartIndices.length) {
        if (signal?.aborted) throw new Error('Upload cancelled by user.');

        const partNumber = missingPartIndices[nextPartIdx];
        nextPartIdx++;

        const start = partNumber * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        await retryWithBackoff(
          () => uploadPartXhr(uploadId, partNumber, chunkBlob, file.size, bytesUploadedSoFar, onProgress, signal),
          MAX_RETRIES,
          signal
        );

        bytesUploadedSoFar += (end - start);
        onProgress?.({
          loadedBytes: Math.min(bytesUploadedSoFar, file.size),
          totalBytes: file.size,
          percentage: Math.min(99, Math.round((bytesUploadedSoFar / file.size) * 100)),
        });
      }
    };

    const workers: Promise<void>[] = [];
    for (let i = 0; i < Math.min(PARALLEL_PARTS, missingPartIndices.length); i++) {
      workers.push(partWorker());
    }

    await Promise.all(workers);

    // 4. Complete upload session
    const completeRes = await retryWithBackoff(async () => {
      const res = await fetch('/api/admin/upload/complete', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId }),
        signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assemble completed file');
      return data;
    }, MAX_RETRIES, signal);

    onProgress?.({ loadedBytes: file.size, totalBytes: file.size, percentage: 100 });

    return {
      success: true,
      fileUrl: completeRes.fileUrl,
      driveFileId: completeRes.driveFileId,
      driveUrl: completeRes.driveUrl,
      fileType: completeRes.fileType,
      mimeType: completeRes.mimeType,
      sizeBytes: completeRes.sizeBytes,
      size: completeRes.size,
    };
  } catch (err: any) {
    // If cancelled or failed permanently, send abort request to clean up temp files
    try {
      fetch('/api/admin/upload/abort', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId }),
      }).catch(() => {});
    } catch {
      // ignore
    }
    throw err;
  }
}

/**
 * Optimized file uploader entry point.
 * Chooses standard single XHR for files < 100 MB or Resumable Multipart for files >= 100 MB.
 */
export async function uploadFileOptimized(options: UploadOptions): Promise<UploadResult> {
  const { file, folderId, onProgress, signal } = options;

  if (file.size >= MULTIPART_THRESHOLD) {
    return await uploadMultipart(file, folderId, onProgress, signal);
  } else {
    return await retryWithBackoff(
      () => uploadSingleXhr(file, folderId, onProgress, signal),
      MAX_RETRIES,
      signal
    );
  }
}
