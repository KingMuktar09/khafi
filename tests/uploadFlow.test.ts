import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import {
  isRetryableUploadError,
  chunkRanges,
  parseResumableRange,
  uploadDriveResumable,
} from '../src/utils/uploader';
import { resolveUploadInitMode } from '../server/app';
import { createDriveResumableSession } from '../server/drive';
import { handleCloudflareApiRequest } from '../server/cf-api-handler';

vi.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: class MockJWT {
        constructor(_opts: any) {}
        async getAccessToken() {
          return { token: 'test-access-token' };
        }
      },
    },
  },
}));

const SESSION_URI = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=TESTSESSION';

describe('upload retry discipline', () => {
  it('retries only transient failures, never permanent ones', () => {
    // Network drops and bad-gateway 5xx: retry.
    expect(isRetryableUploadError(new Error('Network error during file upload'))).toBe(true);
    expect(isRetryableUploadError(new TypeError('Failed to fetch'))).toBe(true);
    expect(isRetryableUploadError(Object.assign(new Error('x'), { status: 429 }))).toBe(true);
    expect(isRetryableUploadError(Object.assign(new Error('x'), { status: 502 }))).toBe(true);
    expect(isRetryableUploadError(Object.assign(new Error('x'), { status: 504 }))).toBe(true);
    expect(isRetryableUploadError(Object.assign(new Error('Upload timed out.'), { status: undefined }))).toBe(true);
    // A 503 that says Drive is not configured is permanent: retrying it
    // is what made one failed book load for minutes before failing.
    expect(
      isRetryableUploadError(
        Object.assign(new Error('Google Drive storage is not set up yet'), { status: 503 })
      )
    ).toBe(false);
    // Other 503s (overloaded function) are transient.
    expect(isRetryableUploadError(Object.assign(new Error('Service unavailable'), { status: 503 }))).toBe(true);
    // Permanent client/server errors: fail fast, no retry.
    for (const status of [400, 401, 403, 404, 413, 500]) {
      expect(isRetryableUploadError(Object.assign(new Error(`HTTP ${status}`), { status }))).toBe(false);
    }
    expect(isRetryableUploadError(new Error('Upload cancelled by user.'))).toBe(false);
  });
});

describe('upload chunk math', () => {
  it('splits a 30 MB file into 8 MiB Drive chunks', () => {
    const ranges = chunkRanges(30 * 1024 * 1024, 8 * 1024 * 1024);
    expect(ranges).toHaveLength(4);
    expect(ranges[0]).toEqual({ start: 0, end: 8 * 1024 * 1024 });
    expect(ranges[3]).toEqual({ start: 24 * 1024 * 1024, end: 30 * 1024 * 1024 });
    // Every chunk except the last is a multiple of Drive's 256 KiB unit.
    for (const r of ranges.slice(0, -1)) {
      expect((r.end - r.start) % (256 * 1024)).toBe(0);
    }
  });

  it('handles an exact multiple and a tiny file', () => {
    expect(chunkRanges(16 * 1024 * 1024, 8 * 1024 * 1024)).toHaveLength(2);
    expect(chunkRanges(100, 8 * 1024 * 1024)).toEqual([{ start: 0, end: 100 }]);
    expect(chunkRanges(0, 8 * 1024 * 1024)).toEqual([]);
  });

  it('parses Drive resumable Range headers', () => {
    expect(parseResumableRange('bytes=0-8388607')).toBe(8388608);
    expect(parseResumableRange('bytes=0-0')).toBe(1);
    expect(parseResumableRange(null)).toBe(null);
    expect(parseResumableRange('')).toBe(null);
    expect(parseResumableRange('bytes=0-abc')).toBe(null);
  });
});

describe('upload init mode', () => {
  it('picks direct-to-Drive when Drive is configured', () => {
    expect(resolveUploadInitMode({ driveConfigured: true, serverless: true })).toBe('drive-resumable');
    expect(resolveUploadInitMode({ driveConfigured: true, serverless: false })).toBe('drive-resumable');
  });

  it('refuses on serverless without Drive, keeps disk sessions locally', () => {
    expect(resolveUploadInitMode({ driveConfigured: false, serverless: true })).toBe('unavailable');
    expect(resolveUploadInitMode({ driveConfigured: false, serverless: false })).toBe('local-disk');
  });
});

describe('Drive resumable session creation', () => {
  const OLD_ENV = { ...process.env };
  let privateKeyPem: string;

  beforeEach(() => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID = '0SHARED123';
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@project.iam.gserviceaccount.com';
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = privateKeyPem;
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
    vi.unstubAllGlobals();
  });

  it('creates a session with the right URL, auth and metadata', async () => {
    const calls: Array<{ url: string; init: any }> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: any) => {
        calls.push({ url, init });
        return new Response('', {
          status: 200,
          headers: { location: SESSION_URI },
        });
      })
    );

    const { sessionUri } = await createDriveResumableSession({
      filename: 'test-book.pdf',
      mimeType: 'application/pdf',
      folderId: 'FOLDER1',
    });
    expect(sessionUri).toBe(SESSION_URI);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toContain('uploadType=resumable');
    expect(calls[0].url).toContain('supportsAllDrives=true');
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.headers.Authorization).toBe('Bearer test-access-token');
    const body = JSON.parse(calls[0].init.body);
    expect(body.name).toBe('test-book.pdf');
    expect(body.parents).toEqual(['FOLDER1']);
    expect(body.mimeType).toBe('application/pdf');
  });

  it('fails clearly when Google refuses the session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('forbidden', { status: 403 }))
    );
    await expect(
      createDriveResumableSession({ filename: 'test-book.pdf' })
    ).rejects.toThrow('403');
  });

  it('refuses without a Shared Drive', async () => {
    delete process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID;
    await expect(createDriveResumableSession({ filename: 'test-book.pdf' })).rejects.toThrow(
      'Shared Drive'
    );
  });
});

describe('direct-to-Drive resumable upload (fake Google)', () => {
  function makeFakeGoogle(totalBytes: number) {
    let storedBytes = 0;
    let failNextPutOnce = false;
    const calls: string[] = [];
    const handler = async (url: string, init: any) => {
      const range = (init?.headers?.['Content-Range'] as string | undefined) || '';
      calls.push(range);
      if (range.startsWith('bytes */')) {
        // Status query: what does Google have?
        if (storedBytes >= totalBytes) {
          return new Response(JSON.stringify({ id: 'drive-file-123' }), { status: 200 });
        }
        const headers: Record<string, string> =
          storedBytes > 0 ? { Range: `bytes=0-${storedBytes - 1}` } : {};
        return new Response('', { status: 308, headers });
      }
      const m = /bytes (\d+)-(\d+)\/(\d+)/.exec(range);
      if (!m) return new Response('bad range', { status: 400 });
      const start = Number(m[1]);
      const end = Number(m[2]);
      const total = Number(m[3]);
      if (failNextPutOnce) {
        failNextPutOnce = false;
        throw new TypeError('Network error');
      }
      if (start !== storedBytes) {
        // Out-of-order chunk: Google answers with what it has.
        return new Response('', {
          status: 308,
          headers: storedBytes > 0 ? { Range: `bytes=0-${storedBytes - 1}` } : {},
        });
      }
      storedBytes = end + 1;
      if (storedBytes >= total) {
        return new Response(JSON.stringify({ id: 'drive-file-123', name: 'book.pdf', size: total }), {
          status: 200,
        });
      }
      return new Response('', { status: 308, headers: { Range: `bytes=0-${storedBytes - 1}` } });
    };
    return {
      handler,
      calls,
      get storedBytes() {
        return storedBytes;
      },
      armFailOnce() {
        failNextPutOnce = true;
      },
    };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads a 30 MB file in 8 MiB chunks and returns the Drive file id', async () => {
    const total = 30 * 1024 * 1024;
    const fake = makeFakeGoogle(total);
    vi.stubGlobal('fetch', vi.fn(fake.handler));
    const file = new File([new Uint8Array(total)], 'book.pdf', { type: 'application/pdf' });
    const seen: number[] = [];
    const { driveFileId } = await uploadDriveResumable(file, SESSION_URI, (p) => {
      seen.push(p.percentage);
    });
    expect(driveFileId).toBe('drive-file-123');
    expect(fake.storedBytes).toBe(total);
    // 4 chunk PUTs, all in order, each 8 MiB except the last.
    const puts = fake.calls.filter((c) => !c.startsWith('bytes */'));
    expect(puts).toHaveLength(4);
    expect(puts[0]).toBe(`bytes 0-${8 * 1024 * 1024 - 1}/${total}`);
    expect(puts[3]).toBe(`bytes ${24 * 1024 * 1024}-${total - 1}/${total}`);
    expect(seen[seen.length - 1]).toBe(100);
  });

  it('resumes from Google-confirmed bytes after a dropped chunk', async () => {
    const total = 20 * 1024 * 1024;
    const fake = makeFakeGoogle(total);
    vi.stubGlobal('fetch', vi.fn(fake.handler));
    // Fail the second chunk's first attempt with a network drop.
    let putCount = 0;
    const origHandler = fake.handler;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: any) => {
        const range = (init?.headers?.['Content-Range'] as string | undefined) || '';
        if (!range.startsWith('bytes */')) {
          putCount++;
          if (putCount === 2) fake.armFailOnce();
        }
        return origHandler(url, init);
      })
    );
    const file = new File([new Uint8Array(total)], 'book.pdf', { type: 'application/pdf' });
    const { driveFileId } = await uploadDriveResumable(file, SESSION_URI);
    expect(driveFileId).toBe('drive-file-123');
    expect(fake.storedBytes).toBe(total);
    // A status query (bytes */total) ran to find the resume point.
    expect(fake.calls.some((c) => c.startsWith('bytes */'))).toBe(true);
  });
});

describe('Cloudflare upload routes (pages.dev)', () => {
  const ADMIN_ENV = {
    ADMIN_USERNAME: 'Khafi',
    ADMIN_PASSWORD: 'test-admin-password',
    SESSION_SECRET: 'test-session-secret-1234567890abcdef',
  };

  async function call(path: string, init?: RequestInit, env: any = {}) {
    const res = await handleCloudflareApiRequest(new Request(`https://example.com${path}`, init), env);
    return { status: res.status, body: (await res.json().catch(() => null)) as any, headers: res.headers };
  }

  async function loginAdmin() {
    const { headers } = await call(
      '/api/admin/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Khafi', password: 'test-admin-password' }),
      },
      ADMIN_ENV
    );
    const setCookie = headers.get('set-cookie') || '';
    return (setCookie.match(/khafi_admin_session=([^;]+)/) || [])[1] || '';
  }

  it('init fails fast with 503 (not a hanging session) when Drive is not configured', async () => {
    const token = await loginAdmin();
    const { status, body } = await call(
      '/api/admin/upload/init',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: `khafi_admin_session=${token}` },
        body: JSON.stringify({ filename: 'book.pdf', fileSize: 1024 * 1024, mimeType: 'application/pdf' }),
      },
      ADMIN_ENV
    );
    expect(status).toBe(503);
    expect(String(body?.error || '')).toMatch(/Drive/);
    expect(String(body?.error || '')).toMatch(/Drive link/);
  });

  it('chunk fails fast with 503 when Drive is not configured', async () => {
    const token = await loginAdmin();
    const form = new FormData();
    form.append('sessionId', 'nope');
    form.append('chunkIndex', '0');
    form.append('chunk', new Blob(['x']), 'part-0');
    const { status, body } = await call(
      '/api/admin/upload/chunk',
      {
        method: 'POST',
        headers: { Cookie: `khafi_admin_session=${token}` },
        body: form,
      },
      ADMIN_ENV
    );
    expect(status).toBe(503);
    expect(String(body?.error || '')).toMatch(/Drive/);
  });

  it('complete with a driveFileId fails clearly when Drive cannot confirm it', async () => {
    const token = await loginAdmin();
    const { status, body } = await call(
      '/api/admin/upload/complete',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: `khafi_admin_session=${token}` },
        body: JSON.stringify({ uploadId: 'drv-1', driveFileId: 'nonexistent-file' }),
      },
      ADMIN_ENV
    );
    expect(status).toBe(400);
    expect(String(body?.error || '')).toMatch(/could not confirm/);
  });
});
