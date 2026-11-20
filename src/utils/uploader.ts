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
// One chunk PUT to Google at a time (Drive resumable sessions take
// ranges in order — parallel PUTs to one session corrupt it), 8 MiB each
// (a multiple of Drive's 256 KiB resumable unit). No request ever goes
// through this site's server, so Vercel's 4.5 MB cap does not apply.
const DRIVE_CHUNK_SIZE = 8 * 1024 * 1024;
// A hung part must fail instead of spinning forever: 2 minutes per
// request, then a clear timeout error the admin can act on.
const REQUEST_TIMEOUT_MS = 120_000;

/** An Error carrying the HTTP status it came from, for retry decisions. */
function httpError(message: string, status?: number): Error & { status?: number } {
  const err = new Error(message) as Error & { status?: number };
  if (status !== undefined) err.status = status;
  return err;
}

/**
 * Which upload failures are worth retrying. A 404 "session not found",
 * a 400/413, a 500, or a 503 that says Drive is not configured will
 * never get better by trying again — retrying those is what made one
 * failed book load for minutes before failing. Only transient problems
 * are retried: network drops, rate limits, and bad-gateway style 5xx.
 */
export function isRetryableUploadError(err: any): boolean {
  const message = String(err?.message || '');
  // "Google Drive storage is not set up yet" / "not configured": the
  // permanent Drive-missing answer. Never retry it.
  if (/not configured|not set up yet/i.test(message)) return false;
  if (/cancelled/i.test(message)) return false;
  const status = typeof err?.status === 'number' ? err.status : undefined;
  if (status !== undefined) {
    return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
  }
  // No HTTP status: a network-level failure (fetch TypeError, XHR status 0).
  return /network error|failed to fetch|load failed|timed? ?out/i.test(message);
}

/** Byte ranges for splitting a file into chunks (tested). */
export function chunkRanges(totalBytes: number, chunkSize: number): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  for (let start = 0; start < totalBytes; start += chunkSize) {
    ranges.push({ start, end: Math.min(start + chunkSize, totalBytes) });
  }
  return ranges;
}

/**
 * Next byte to send, from a Drive resumable-upload `Range` header
 * (`bytes=0-8388607` means Google has bytes 0..8388607, so send from
 * 8388608). Returns null when the header is missing or unparseable.
 */
export function parseResumableRange(rangeHeader: string | null): number | null {
  if (!rangeHeader) return null;
  const m = /bytes=0-(\d+)/.exec(rangeHeader);
  if (!m) return null;
  const last = Number(m[1]);
  return Number.isFinite(last) && last >= 0 ? last + 1 : null;
}

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
      if (signal?.aborted || attempt > retries || !isRetryableUploadError(err)) {
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
    xhr.timeout = REQUEST_TIMEOUT_MS;

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
            reject(httpError(res.error || 'Upload failed', xhr.status));
          }
        } catch {
          reject(httpError('Invalid response from server', xhr.status));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(httpError(res.error || `HTTP ${xhr.status} upload error`, xhr.status));
        } catch {
          reject(httpError(`Server error (${xhr.status})`, xhr.status));
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
    xhr.timeout = REQUEST_TIMEOUT_MS;

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
            reject(httpError(res.error || `Failed uploading part ${partNumber}`, xhr.status));
          }
        } catch {
          reject(httpError(`Invalid response uploading part ${partNumber}`, xhr.status));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(httpError(res.error || `HTTP ${xhr.status} uploading part ${partNumber}`, xhr.status));
        } catch {
          reject(httpError(`Server error (${xhr.status}) uploading part ${partNumber}`, xhr.status));
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
/**
 * Combine the caller's abort signal with a timeout, without
 * AbortSignal.any (too new for some browsers). The returned cancel()
 * clears the timer; timedOut() tells a timeout apart from a user cancel.
 */
function withTimeout(
  signal: AbortSignal | undefined,
  ms: number
): { signal: AbortSignal; cancel: () => void; timedOut: () => boolean } {
  const controller = new AbortController();
  let expired = false;
  const timer = setTimeout(() => {
    expired = true;
    controller.abort();
  }, ms);
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }
  return {
    signal: controller.signal,
    cancel: () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', onAbort);
    },
    timedOut: () => expired,
  };
}

/**
 * Ask Google how much of a resumable upload it already has, so a failed
 * chunk resumes instead of restarting. PUT with an empty body and
 * `Content-Range: bytes *\/total`: Google answers 308 with a `Range`
 * header, or 200/201 with the finished file when the upload already
 * completed. Returns null when the session is gone (fail, don't loop).
 */
async function queryResumableOffset(
  sessionUri: string,
  totalBytes: number,
  signal?: AbortSignal
): Promise<{ nextOffset: number; finishedFileId?: string } | null> {
  const t = withTimeout(signal, REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(sessionUri, {
      method: 'PUT',
      headers: {
        'Content-Length': '0',
        'Content-Range': `bytes */${totalBytes}`,
      },
      signal: t.signal,
    });
  } catch {
    t.cancel();
    return null;
  }
  t.cancel();
  if (res.status === 200 || res.status === 201) {
    const data = await res.json().catch(() => null);
    return { nextOffset: totalBytes, finishedFileId: data?.id };
  }
  if (res.status === 308) {
    const next = parseResumableRange(res.headers.get('Range'));
    return { nextOffset: next ?? 0 };
  }
  return null;
}

/**
 * PUT one chunk to a Drive resumable session. Returns the next byte
 * Google expects, and the finished file id when this was the last chunk.
 */
async function putResumableChunk(
  sessionUri: string,
  chunk: Blob,
  start: number,
  end: number,
  totalBytes: number,
  signal?: AbortSignal
): Promise<{ nextOffset: number; finishedFileId?: string }> {
  const t = withTimeout(signal, REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(sessionUri, {
      method: 'PUT',
      headers: {
        'Content-Length': String(end - start),
        'Content-Range': `bytes ${start}-${end - 1}/${totalBytes}`,
      },
      body: chunk,
      signal: t.signal,
    });
  } catch (err: any) {
    t.cancel();
    if (signal?.aborted) throw new Error('Upload cancelled by user.');
    if (t.timedOut()) throw httpError('Upload timed out. Please check the connection and try again.');
    throw err;
  }
  t.cancel();
  if (res.status === 200 || res.status === 201) {
    const data = await res.json().catch(() => null);
    return { nextOffset: totalBytes, finishedFileId: data?.id };
  }
  if (res.status === 308) {
    // A 308 without a Range header means Google stored nothing of this
    // chunk yet — resume from the chunk start, never skip past it.
    const next = parseResumableRange(res.headers.get('Range'));
    return { nextOffset: next ?? start };
  }
  const text = await res.text().catch(() => '');
  throw httpError(
    `Google Drive upload failed (${res.status})${text ? `: ${text.slice(0, 120)}` : ''}`,
    res.status
  );
}

/**
 * Upload a file straight to Google Drive through a resumable session.
 * Ranges go up in order — Drive sessions reject out-of-order chunks, so
 * this path is sequential on purpose, one 8 MB PUT at a time, resumed
 * from wherever Google confirms it has data. Nothing goes through this
 * site's server: no 4.5 MB cap, no per-instance session to lose.
 */
export async function uploadDriveResumable(
  file: File,
  sessionUri: string,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
): Promise<{ driveFileId: string }> {
  const total = file.size;
  const trackSpeed = createSpeedTracker();
  let offset = 0;
  let finishedFileId: string | undefined;

  while (offset < total) {
    if (signal?.aborted) throw new Error('Upload cancelled by user.');
    const end = Math.min(offset + DRIVE_CHUNK_SIZE, total);
    const chunk = file.slice(offset, end);
    const result = await retryWithBackoff(async () => {
      try {
        return await putResumableChunk(sessionUri, chunk, offset, end, total, signal);
      } catch (err: any) {
        // The PUT may have stored a prefix of this chunk before failing.
        // Ask Google what it has and resume from there instead of
        // resending (and possibly re-failing) the same range.
        if (isRetryableUploadError(err)) {
          const queried = await queryResumableOffset(sessionUri, total, signal).catch(() => null);
          if (queried === null) throw err;
          if (queried.finishedFileId) return { nextOffset: total, finishedFileId: queried.finishedFileId };
          if (queried.nextOffset > offset) return { nextOffset: queried.nextOffset };
        }
        throw err;
      }
    }, MAX_RETRIES, signal);
    offset = result.nextOffset;
    if (result.finishedFileId) {
      finishedFileId = result.finishedFileId;
      break;
    }
    onProgress?.({
      loadedBytes: offset,
      totalBytes: total,
      percentage: Math.min(99, Math.round((offset / total) * 100)),
      speedBytesPerSec: trackSpeed(offset),
    });
  }

  if (!finishedFileId) {
    // The loop ended without a finished file id (should not happen: the
    // last chunk's 200/201 carries it). Ask Google for the final state.
    const queried = await queryResumableOffset(sessionUri, total, signal).catch(() => null);
    finishedFileId = queried?.finishedFileId;
  }
  if (!finishedFileId) {
    throw new Error('Google Drive did not confirm the finished file. Please try the upload again.');
  }
  onProgress?.({ loadedBytes: total, totalBytes: total, percentage: 100 });
  return { driveFileId: finishedFileId };
}

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
    if (!res.ok) throw httpError(data.error || 'Failed to initialize multipart upload session', res.status);
    return data;
  }, MAX_RETRIES, signal);

  const uploadId: string = initRes.uploadId;

  // Direct-to-Drive: the browser PUTs the bytes straight to Google.
  // Nothing goes through this site's server, so there is no 4.5 MB cap,
  // no per-instance session to lose, and no local disk involved.
  if (initRes.driveResumable && initRes.sessionUri) {
    const done = await uploadDriveResumable(file, initRes.sessionUri, onProgress, signal);
    const completeRes = await retryWithBackoff(async () => {
      const res = await fetch('/api/admin/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, driveFileId: done.driveFileId }),
        signal,
      });
      const data = await res.json();
      if (!res.ok) throw httpError(data.error || 'Failed to confirm the uploaded file', res.status);
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
  }

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
      if (!res.ok) throw httpError(data.error || 'Failed to assemble completed file', res.status);
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
