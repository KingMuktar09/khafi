/**
 * PDF cover extraction. pdf.js is loaded lazily, inside
 * extractPdfCover, so merely importing this module (admin upload,
 * cover extraction) never pulls the ~500 KB pdf.js chunk into the
 * first-load bundle. The generated title cover lives in
 * ./fallbackCover (no pdf.js at all) — that is what book cards use.
 */

let workerConfigured = false;

async function loadPdfjs() {
  const pdfjsLib = await import('pdfjs-dist');
  if (!workerConfigured && typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch (e) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
    workerConfigured = true;
  }
  return pdfjsLib;
}

/**
 * Extracts the first page of a PDF file/URL and returns a Data URL image.
 */
export async function extractPdfCover(pdfSource: string | File | ArrayBuffer): Promise<string | null> {
  try {
    const pdfjsLib = await loadPdfjs();
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
    // Small thumbnail on purpose: the cover is embedded in the public
    // catalog as a data URI, and a full-page JPEG at scale 1.2 / quality
    // 0.85 is ~60 KB per book — three such books were half of the whole
    // 368 KB catalog payload. Cap at 480 px wide, JPEG 0.75 (~15-25 KB).
    const viewport = page.getViewport({ scale: 1.0 });
    const scale = Math.min(1, 480 / viewport.width);
    const thumbViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.height = thumbViewport.height;
    canvas.width = thumbViewport.width;

    await page.render({
      canvasContext: context,
      viewport: thumbViewport,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.75);
  } catch (err) {
    console.warn('First-page PDF cover extraction fallback:', err);
    return null;
  }
}
