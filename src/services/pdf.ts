import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Extracts the first page of a PDF file/URL and returns a Data URL image.
 */
export async function extractPdfCover(pdfSource: string | File | ArrayBuffer): Promise<string | null> {
  try {
    let loadingTask;
    if (typeof pdfSource === 'string') {
      loadingTask = pdfjsLib.getDocument({ url: pdfSource });
    } else if (pdfSource instanceof File) {
      const buffer = await pdfSource.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({ data: buffer });
    } else {
      loadingTask = pdfjsLib.getDocument({ data: pdfSource });
    }

    const pdf = await loadingTask.promise;
    if (pdf.numPages < 1) return null;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.2 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (err) {
    console.warn('First-page PDF cover extraction fallback:', err);
    return null;
  }
}

/**
 * Generates an elegant SVG Data URL book cover fallback with scholarly Khafi Library gold typography.
 */
export function generateFallbackCoverSvg(title: string, author: string, category?: string): string {
  const safeTitle = (title || 'PDF DOCUMENT').substring(0, 50);
  const safeAuthor = (author || 'KHAFI LIBRARY').substring(0, 35);
  const safeCat = (category || 'ILM COLLECTION').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 440" width="300" height="440">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e17"/>
      <stop offset="100%" stop-color="#121826"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="300" height="440" fill="url(#bg)"/>
  
  <!-- Outer Gold Frame -->
  <rect x="14" y="14" width="272" height="412" fill="none" stroke="#c5a059" stroke-opacity="0.3" stroke-width="1"/>
  <rect x="18" y="18" width="264" height="404" fill="none" stroke="#c5a059" stroke-opacity="0.15" stroke-width="1"/>
  
  <!-- Top Header -->
  <text x="30" y="42" font-family="monospace" font-size="9" fill="#c5a059" font-weight="bold" letter-spacing="1.5">KHAFI LIBRARY // ILM</text>
  <line x1="30" y1="50" x2="270" y2="50" stroke="#c5a059" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Category Tag -->
  <text x="30" y="74" font-family="monospace" font-size="9" fill="#a39e93" font-weight="bold" letter-spacing="1">/ ${escapeXml(safeCat)}</text>

  <!-- Title Frame Box -->
  <rect x="30" y="94" width="240" height="220" fill="rgba(197, 160, 89, 0.04)" stroke="#c5a059" stroke-opacity="0.25" stroke-width="1"/>

  <!-- Book Title in Serif -->
  <foreignObject x="38" y="102" width="224" height="204">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; align-items:center; justify-content:center; height:100%; text-align:center; padding:8px;">
      <h1 style="color:#f4f1ea; font-family:Georgia, serif; font-size:19px; line-height:1.3; font-weight:600; margin:0; letter-spacing:0.01em;">
        ${escapeXml(safeTitle)}
      </h1>
    </div>
  </foreignObject>

  <!-- Divider Line -->
  <line x1="30" y1="334" x2="270" y2="334" stroke="#c5a059" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Author Name -->
  <text x="30" y="362" font-family="monospace" font-size="10" fill="#c5a059">BY ${escapeXml(safeAuthor.toUpperCase())}</text>
  
  <!-- Footer Tag -->
  <text x="30" y="402" font-family="monospace" font-size="8" fill="#686358" letter-spacing="1">[ CATALOG VOLUME ]</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
