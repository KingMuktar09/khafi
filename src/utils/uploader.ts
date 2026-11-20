import { ItemType } from '../types';

// Admin auth is cookie-only (H-7): the httpOnly session cookie is sent
// automatically on same-origin requests, so no token header is needed
// here. There used to be a localStorage token (`khafi_admin_token`) —
// it is gone, and this file must not bring it back.

export interface UploadProgress {
  loadedBytes: number;
  totalBytes: number;
  percentage: number;
  /** Smoothed upload speed in bytes per second, when it can be measured. */
  speedBytesPerSec?: number;
}

export interface UploadOptions {
  file: File;
  folderId?: string;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

/**
 * Smoothed upload-speed tracker: call with the total bytes sent so far
 * and get back bytes/second (exponential moving average, so the number
 * shown in the UI is steady instead of jumping every progress event).
 */
function createSpeedTracker() {
  let lastAt = 0;
  let lastLoaded = 0;
  let speed = 0;
  return (loadedBytes: number): number | undefined => {
    const now = performance.now();
    if (lastAt === 0) {
      lastAt = now;
      lastLoaded = loadedBytes;
      return undefined;
    }
    const dt = (now - lastAt) / 1000;
    if (dt <= 0) return speed > 0 ? speed : undefined;
    const instant = (loadedBytes - lastLoaded) / dt;
    lastAt = now;
    lastLoaded = loadedBytes;
    if (instant < 0) return speed > 0 ? speed : undefined;
    speed = speed === 0 ? instant : speed * 0.7 + instant * 0.3;
    return speed;
  };
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
 * Uploads a single file using standard XHR POST (for files under 4 MB —
 * anything bigger goes the chunked way, because Vercel caps a request
 * body at 4.5 MB).
 */
function uploadSingleXhr(
  file: File,
  folderId?: string,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled by user.'));
      });
    }

    const trackSpeed = createSpeedTracker();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentage = Math.min(99, Math.round((e.loaded / e.total) * 100));
        onProgress({ loadedBytes: e.loaded, totalBytes: e.total, percentage, speedBytesPerSec: trackSpeed(e.loaded) });
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
 *
 * Progress is reported per part (bytes sent for THIS part only) through
 * onPartProgress. The caller adds the parts together — the old code
 * passed a "completed bytes" base captured when the part started, so
 * parallel parts double-counted and the bar jumped backwards.
 */
function uploadPartXhr(
  uploadId: string,
  partNumber: number,
  chunkBlob: Blob,
  onPartProgress?: (loadedBytes: number) => void,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload/part');

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('Upload cancelled by user.'));
      });
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onPartProgress) {
        onPartProgress(e.loaded);
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
 * Performs a resumable multipart chunked upload for files >= 4 MB.
 *
 * Speed notes (measured on the live site, India → Mumbai/bom1):
 * - Browsers allow ~6 connections per host. With 3 parallel parts a
 *   single large book used only half of them, so half the pipe sat idle.
 *   5 parallel parts fills the pipe for one big file without drowning
 *   a phone uplink; the modal still caps whole files at 2 at once.
 * - No extra round trip before the first part: the old code fetched
 *   /api/admin/upload/status for a session that was just created, so
 *   its completed-parts list was always empty.
 * - Progress is summed from each part's own bytes (see uploadPartXhr),
 *   so the bar and the MB counter never jump backwards.
 */
async function uploadMultipart(
  file: File,
  folderId?: string,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
): Promise<UploadResult> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // 1. Initialize upload session
  const initRes = await retryWithBackoff(async () => {
    const res = await fetch('/api/admin/upload/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    // 2. Upload chunks in parallel with retries. Small (4 MB) parts mean
    // a slow connection still finishes each part quickly, and a failed
    // part is retried on its own instead of restarting the file.
    const PARALLEL_PARTS = 5;
    const trackSpeed = createSpeedTracker();

    // Bytes sent per part still in flight; finished parts move into
    // completedBytes. Total loaded = completed + sum of in-flight parts.
    const partLoaded = new Map<number, number>();
    let completedBytes = 0;
    const reportProgress = () => {
      let inFlight = 0;
      for (const n of partLoaded.values()) inFlight += n;
      const loaded = Math.min(completedBytes + inFlight, file.size);
      onProgress?.({
        loadedBytes: loaded,
        totalBytes: file.size,
        percentage: Math.min(99, Math.round((loaded / file.size) * 100)),
        speedBytesPerSec: trackSpeed(loaded),
      });
    };

    let nextPartIdx = 0;

    const partWorker = async () => {
      while (nextPartIdx < totalChunks) {
        if (signal?.aborted) throw new Error('Upload cancelled by user.');

        const partNumber = nextPartIdx;
        nextPartIdx++;

        const start = partNumber * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);
        partLoaded.set(partNumber, 0);

        await retryWithBackoff(
          () =>
            uploadPartXhr(uploadId, partNumber, chunkBlob, (loaded) => {
              partLoaded.set(partNumber, loaded);
              reportProgress();
            }, signal),
          MAX_RETRIES,
          signal
        );

        partLoaded.delete(partNumber);
        completedBytes += end - start;
        reportProgress();
      }
    };

    const workers: Promise<void>[] = [];
    for (let i = 0; i < Math.min(PARALLEL_PARTS, totalChunks); i++) {
      workers.push(partWorker());
    }

    await Promise.all(workers);

    // 3. Complete upload session
    const completeRes = await retryWithBackoff(async () => {
      const res = await fetch('/api/admin/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
 * Chooses standard single XHR for files under 4 MB, or resumable
 * multipart (4 MB chunks, 5 in parallel) for anything bigger.
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
