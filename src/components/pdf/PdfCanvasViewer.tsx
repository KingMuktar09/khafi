import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, RefreshCw, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { downloadFileFromUrl } from '../../utils/fileUtils';
import { getFollowUnlockHeaders } from '../../services/api';

// Configure PDF.js worker using Vite asset URL or CDN fallback
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  if (pdfjsWorkerUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

export type FitMode = 'width' | 'page' | 'custom';

interface PdfCanvasViewerProps {
  pdfUrl: string;
  zoomLevel: number;
  isFitWidth?: boolean;
  fitMode?: FitMode;
  initialPage?: number;
  onZoomChange?: (zoomLevel: number, isFitWidth: boolean, fitMode?: FitMode) => void;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: string) => void;
  onRetry?: () => void;
}

interface PageCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  displayWidth: number;
  isVisible: boolean;
  aspectRatio: number;
  priorityTrigger: number;
  isGestureActive?: boolean;
  onRenderSuccess?: (pageNumber: number) => void;
}

const PageCanvas: React.FC<PageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  displayWidth,
  isVisible,
  aspectRatio,
  priorityTrigger,
  isGestureActive = false,
  onRenderSuccess,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderStatus, setRenderStatus] = useState<'idle' | 'rendering' | 'rendered' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const renderedKeyRef = useRef<string>('');
  const renderStatusRef = useRef<'idle' | 'rendering' | 'rendered' | 'error'>('idle');
  const renderGenerationRef = useRef<number>(0);

  renderStatusRef.current = renderStatus;

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const renderKey = `${pageNumber}-${displayWidth}-${dpr}`;

    if (renderedKeyRef.current === renderKey && renderStatusRef.current === 'rendered') {
      return;
    }

    const generation = ++renderGenerationRef.current;

    try {
      // If a render task is already in flight on this canvas, cancel it and wait for it to settle
      if (renderTaskRef.current) {
        const previousTask = renderTaskRef.current;
        renderTaskRef.current = null;
        try {
          previousTask.cancel();
          await previousTask.promise.catch(() => {});
        } catch {
          // Ignore cancellation error
        }
      }

      // Check if a newer render was requested while awaiting cancellation
      if (generation !== renderGenerationRef.current) {
        return;
      }

      setRenderStatus('rendering');
      setErrorMessage(null);

      const page = await pdfDoc.getPage(pageNumber);
      if (generation !== renderGenerationRef.current) return;

      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const pageAspectRatio = unscaledViewport.width / unscaledViewport.height;
      const displayHeight = Math.round(displayWidth / pageAspectRatio);

      const renderScale = (displayWidth / unscaledViewport.width) * dpr;
      const viewport = page.getViewport({ scale: renderScale });

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context is unavailable');
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        canvas: canvas,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      await task.promise;

      if (generation === renderGenerationRef.current) {
        renderTaskRef.current = null;
        renderedKeyRef.current = renderKey;
        setRenderStatus('rendered');
        onRenderSuccess?.(pageNumber);
      }
    } catch (err: any) {
      if (generation === renderGenerationRef.current) {
        renderTaskRef.current = null;
        if (err?.name === 'RenderingCancelledException' || err?.message?.includes('cancelled')) {
          return;
        }
        console.error(`Error rendering PDF page ${pageNumber}:`, err);
        setRenderStatus('error');
        setErrorMessage(err?.message || 'Failed to render page');
      }
    }
  }, [pdfDoc, pageNumber, displayWidth, onRenderSuccess]);

  // Clean up render task on unmount
  useEffect(() => {
    return () => {
      renderGenerationRef.current++;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isGestureActive && (isVisible || priorityTrigger > 0) && renderStatus === 'idle') {
      renderPage();
    }
  }, [isVisible, priorityTrigger, renderStatus, renderPage, isGestureActive]);

  useEffect(() => {
    if (!isGestureActive) {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const expectedKey = `${pageNumber}-${displayWidth}-${dpr}`;
      if (renderedKeyRef.current !== expectedKey) {
        renderedKeyRef.current = '';
        setRenderStatus('idle');
      }
    }
  }, [displayWidth, pdfDoc, isGestureActive, pageNumber]);

  const containerMinHeight = Math.round(displayWidth / (aspectRatio || 0.707));

  return (
    <div
      data-page-number={pageNumber}
      className="pdf-page-wrapper relative bg-white dark:bg-slate-100 shadow-md sm:shadow-2xl rounded-xs overflow-hidden flex flex-col items-center justify-center shrink-0 transition-shadow duration-150"
      style={{
        width: `${displayWidth}px`,
        minHeight: `${containerMinHeight}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="block mx-auto"
        style={{
          display: renderStatus === 'error' ? 'none' : 'block',
        }}
      />

      {renderStatus === 'rendering' && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center font-mono text-xs text-slate-700 dark:text-slate-300 z-10">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
            <span>Rendering Page {pageNumber}...</span>
          </div>
        </div>
      )}

      {renderStatus === 'error' && (
        <div className="p-6 text-center space-y-2 font-mono text-xs text-rose-500 z-10">
          <p className="font-semibold">Unable to render page {pageNumber}.</p>
          {errorMessage && <p className="text-[10px] text-slate-500">{errorMessage}</p>}
          <button
            type="button"
            onClick={() => {
              renderedKeyRef.current = '';
              setRenderStatus('idle');
              renderPage();
            }}
            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold rounded text-[11px] cursor-pointer transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono rounded pointer-events-none z-20">
        Page {pageNumber}
      </div>
    </div>
  );
};

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfUrl,
  zoomLevel,
  isFitWidth = true,
  fitMode: propFitMode,
  initialPage = 1,
  onZoomChange,
  onPageChange,
  onLoadSuccess,
  onLoadError,
  onRetry,
}) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0.707); // Default A4
  const [unscaledWidth, setUnscaledWidth] = useState<number>(612); // Default US Letter width
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  const [priorityQueueIndex, setPriorityQueueIndex] = useState(1);
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 800;
  });
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 600;
  });

  const [displayWidth, setDisplayWidth] = useState<number>(360);
  const [panX, setPanX] = useState<number>(0);
  const [isGestureActive, setIsGestureActive] = useState<boolean>(false);

  const effectiveFitMode: FitMode = propFitMode !== undefined
    ? propFitMode
    : isFitWidth
    ? 'width'
    : 'custom';

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasScrolledToInitialRef = useRef(false);

  const isMouseDownRef = useRef(false);
  const mouseDownStartRef = useRef({ x: 0, y: 0, panX: 0, scrollTop: 0 });

  const viewportWidthRef = useRef(viewportWidth);
  viewportWidthRef.current = viewportWidth;

  const viewportHeightRef = useRef(viewportHeight);
  viewportHeightRef.current = viewportHeight;

  const displayWidthRef = useRef(displayWidth);
  displayWidthRef.current = displayWidth;

  const panXRef = useRef(panX);
  panXRef.current = panX;

  const unscaledWidthRef = useRef(unscaledWidth);
  unscaledWidthRef.current = unscaledWidth;

  // Helper to calculate target width
  const calculateWidth = useCallback(
    (vWidth: number, vHeight: number, mode: FitMode, zLevel: number, uWidth: number, aRatio: number) => {
      const isMobile = vWidth < 768;
      const fitWidthVal = isMobile ? Math.max(260, vWidth - 16) : Math.min(960, Math.max(320, vWidth - 64));

      if (mode === 'width') {
        return fitWidthVal;
      } else if (mode === 'page') {
        // Fit to Page: fits the whole page vertically and horizontally inside viewport
        const availableHeight = Math.max(260, vHeight - (isMobile ? 24 : 48));
        const targetWidthFromHeight = Math.round(availableHeight * (aRatio || 0.707));
        const maxAllowedWidth = isMobile ? Math.max(240, vWidth - 16) : Math.max(300, vWidth - 64);
        return Math.max(200, Math.min(targetWidthFromHeight, maxAllowedWidth));
      } else {
        const baseUnscaled = uWidth > 0 ? uWidth : (isMobile ? fitWidthVal * 1.35 : 750);
        return Math.round(baseUnscaled * (zLevel / 100));
      }
    },
    []
  );

  // Update width and pan bounds when props change
  useEffect(() => {
    if (isGestureActive) return;

    const targetW = calculateWidth(viewportWidth, viewportHeight, effectiveFitMode, zoomLevel, unscaledWidth, aspectRatio);
    setDisplayWidth(targetW);

    const halfOverflow = Math.max(0, (targetW - viewportWidth) / 2);
    if (effectiveFitMode === 'width' || effectiveFitMode === 'page') {
      setPanX(0);
    } else {
      setPanX((prev) => Math.max(-halfOverflow, Math.min(halfOverflow, prev)));
    }
  }, [viewportWidth, viewportHeight, effectiveFitMode, zoomLevel, unscaledWidth, aspectRatio, isGestureActive, calculateWidth]);

  // Resize and Orientation Listener
  useEffect(() => {
    const handleResize = () => {
      let newVWidth = window.innerWidth;
      let newVHeight = window.innerHeight;
      if (scrollContainerRef.current) {
        newVWidth = scrollContainerRef.current.clientWidth || window.innerWidth;
        newVHeight = scrollContainerRef.current.clientHeight || window.innerHeight;
      }
      setViewportWidth(newVWidth);
      setViewportHeight(newVHeight);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (scrollContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    let activeTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    setIsLoading(true);
    setIsSlowLoading(false);
    setError(null);
    setPdfDoc(null);
    hasScrolledToInitialRef.current = false;
    setPriorityQueueIndex(1);

    const slowTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsSlowLoading(true);
      }
    }, 2500);

    const loadPdfDoc = async (): Promise<pdfjsLib.PDFDocumentProxy> => {
      // Primary Attempt: Direct URL loading with range chunks enabled
      try {
        activeTask = pdfjsLib.getDocument({
          url: pdfUrl,
          // Paid books are free for followers: send the unlock flag so
          // the server streams a paid file instead of 402.
          httpHeaders: getFollowUnlockHeaders(),
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/cmaps/`,
          cMapPacked: true,
          enableXfa: true,
          rangeChunkSize: 262144,
          disableAutoFetch: false,
          disableStream: false,
          disableRange: false,
        });
        return await activeTask.promise;
      } catch (primaryErr: any) {
        console.warn('Primary PDF range-stream loading failed, trying direct arrayBuffer fetch fallback:', primaryErr);
        
        if (isCancelled) throw primaryErr;

        // Secondary Fallback: Direct fetch -> ArrayBuffer -> Uint8Array
        const response = await fetch(pdfUrl, {
          credentials: 'same-origin',
          headers: getFollowUnlockHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText || 'Failed to fetch PDF file'}`);
        }

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        if (contentType.includes('text/html') || contentType.includes('application/json')) {
          const text = await response.text();
          let serverMsg = 'Server returned invalid PDF format.';
          try {
            const parsed = JSON.parse(text);
            if (parsed.error) serverMsg = parsed.error;
          } catch {}
          throw new Error(serverMsg);
        }

        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength < 10) {
          throw new Error('Received empty or corrupted PDF data');
        }

        activeTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/cmaps/`,
          cMapPacked: true,
          enableXfa: true,
        });
        return await activeTask.promise;
      }
    };

    loadPdfDoc()
      .then(async (doc) => {
        clearTimeout(slowTimer);
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        onLoadSuccess?.(doc.numPages);

        // Determine Page 1 Aspect Ratio & Unscaled Width
        try {
          const page1 = await doc.getPage(1);
          const vp = page1.getViewport({ scale: 1.0 });
          if (vp.width && vp.height) {
            setAspectRatio(vp.width / vp.height);
            setUnscaledWidth(vp.width);
          }
        } catch {
          // Use defaults
        }

        setIsLoading(false);
      })
      .catch((err: any) => {
        clearTimeout(slowTimer);
        if (isCancelled) return;
        console.error('PDF loading error:', err);
        const displayMsg = err?.message || 'Unable to open this PDF.';
        setError(displayMsg.includes('PDF') || displayMsg.includes('HTTP') ? displayMsg : 'Unable to open this PDF.');
        setIsLoading(false);
        onLoadError?.(err?.message || 'Failed to load PDF');
      });

    return () => {
      isCancelled = true;
      clearTimeout(slowTimer);
      if (activeTask) {
        activeTask.destroy().catch(() => {});
      }
    };
  }, [pdfUrl, onLoadSuccess, onLoadError]);

  // Touch Gesture Controller (Pinch-Zoom + 1-Finger Pan)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartPanX = 0;
    let touchStartScrollTop = 0;
    let touchStartPinchDist = 0;
    let touchStartWidth = 0;
    let gestureMode: 'none' | 'pan' | 'pinch' = 'none';
    let pinchCenter = { x: 0, y: 0 };

    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    const getDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const currentWidth = displayWidthRef.current;
      const currentViewportWidth = viewportWidthRef.current;
      const isZoomed = currentWidth > currentViewportWidth + 2;

      // Prevent parent containers (like swipe drawers) from hijacking touch when multi-touch or zoomed
      if (e.touches.length > 1 || isZoomed) {
        e.stopPropagation();
      }

      if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();

        gestureMode = 'pinch';
        touchStartPinchDist = getDistance(e.touches[0], e.touches[1]);
        touchStartWidth = displayWidthRef.current;
        touchStartPanX = panXRef.current;
        touchStartScrollTop = container.scrollTop;

        const rect = container.getBoundingClientRect();
        pinchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        };
        setIsGestureActive(true);
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const tapX = touch.clientX - rect.left;
        const tapY = touch.clientY - rect.top;
        const now = Date.now();

        // Double-tap zoom toggle detection
        if (now - lastTapTime < 280 && Math.abs(tapX - lastTapX) < 30 && Math.abs(tapY - lastTapY) < 30) {
          if (e.cancelable) e.preventDefault();
          lastTapTime = 0;

          const fitWidthVal = currentViewportWidth < 768 ? Math.max(260, currentViewportWidth - 16) : Math.min(850, currentViewportWidth - 64);
          if (isFitWidth || Math.abs(currentWidth - fitWidthVal) < 15) {
            // Toggle to 160% Zoom
            const newWidth = Math.round(fitWidthVal * 1.6);
            const halfOverflow = Math.max(0, (newWidth - currentViewportWidth) / 2);
            
            const dxDocOld = tapX - (currentViewportWidth / 2);
            const dxDocNew = dxDocOld * (newWidth / currentWidth);
            let newPanX = tapX - dxDocNew - currentViewportWidth / 2;
            newPanX = Math.max(-halfOverflow, Math.min(halfOverflow, newPanX));

            const yDocOld = container.scrollTop + tapY;
            const yDocNew = yDocOld * (newWidth / currentWidth);
            const newScrollTop = Math.max(0, yDocNew - tapY);

            setDisplayWidth(newWidth);
            setPanX(newPanX);
            container.scrollTop = newScrollTop;

            const baseUnscaled = unscaledWidthRef.current || (currentViewportWidth < 768 ? fitWidthVal * 1.35 : 750);
            const newZoomLevel = Math.max(50, Math.min(300, Math.round((newWidth / baseUnscaled) * 100)));
            onZoomChange?.(newZoomLevel, false);
          } else {
            // Toggle back to Fit Width
            setDisplayWidth(fitWidthVal);
            setPanX(0);
            onZoomChange?.(100, true);
          }
          return;
        }

        lastTapTime = now;
        lastTapX = tapX;
        lastTapY = tapY;

        gestureMode = 'pan';
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartPanX = panXRef.current;
        touchStartScrollTop = container.scrollTop;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentWidth = displayWidthRef.current;
      const currentViewportWidth = viewportWidthRef.current;
      const isZoomed = currentWidth > currentViewportWidth + 2;

      if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        // Seamless transition to pinch if user added 2nd finger mid-drag
        if (gestureMode !== 'pinch') {
          gestureMode = 'pinch';
          touchStartPinchDist = getDistance(e.touches[0], e.touches[1]);
          touchStartWidth = displayWidthRef.current;
          touchStartPanX = panXRef.current;
          touchStartScrollTop = container.scrollTop;

          const rect = container.getBoundingClientRect();
          pinchCenter = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
          };
        }

        const currentDist = getDistance(e.touches[0], e.touches[1]);
        if (touchStartPinchDist > 0) {
          const ratio = currentDist / touchStartPinchDist;
          let newWidth = Math.round(touchStartWidth * ratio);

          const fitWidthVal = currentViewportWidth < 768 ? Math.max(260, currentViewportWidth - 16) : Math.min(850, currentViewportWidth - 64);
          const minW = Math.round(fitWidthVal * 0.75);
          const maxW = Math.round(fitWidthVal * 4.5);
          newWidth = Math.max(minW, Math.min(maxW, newWidth));

          const vWidth = currentViewportWidth;
          const dxDocOld = pinchCenter.x - (vWidth / 2 + touchStartPanX);
          const dxDocNew = dxDocOld * (newWidth / touchStartWidth);
          let newPanX = pinchCenter.x - dxDocNew - vWidth / 2;

          const halfOverflow = Math.max(0, (newWidth - vWidth) / 2);
          newPanX = Math.max(-halfOverflow, Math.min(halfOverflow, newPanX));

          const yDocOld = touchStartScrollTop + pinchCenter.y;
          const yDocNew = yDocOld * (newWidth / touchStartWidth);
          const newScrollTop = Math.max(0, yDocNew - pinchCenter.y);

          container.scrollTop = newScrollTop;
          setPanX(newPanX);
          setDisplayWidth(newWidth);
          setIsGestureActive(true);
        }
      } else if (e.touches.length === 1) {
        // Seamless transition to 1-finger pan if 1 finger lifted mid-pinch
        if (gestureMode === 'pinch') {
          gestureMode = 'pan';
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartPanX = panXRef.current;
          touchStartScrollTop = container.scrollTop;
        }

        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;

        if (isZoomed) {
          // Prevent outer browser page scrolling, rubber banding, pull-to-refresh
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();

          const halfOverflow = Math.max(0, (currentWidth - currentViewportWidth) / 2);
          let newPanX = touchStartPanX + deltaX;
          newPanX = Math.max(-halfOverflow, Math.min(halfOverflow, newPanX));

          container.scrollTop = touchStartScrollTop - deltaY;
          setPanX(newPanX);
          setIsGestureActive(true);
        } else {
          // Prevent accidental browser history back/forward swipe
          if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 8) {
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Seamless transition: 1 touch remains on screen
        gestureMode = 'pan';
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartPanX = panXRef.current;
        touchStartScrollTop = container.scrollTop;
      } else if (e.touches.length === 0) {
        if (gestureMode === 'pinch' || isGestureActive) {
          setIsGestureActive(false);

          const currentWidth = displayWidthRef.current;
          const currentViewportWidth = viewportWidthRef.current;
          const fitWidthVal = currentViewportWidth < 768 ? Math.max(260, currentViewportWidth - 16) : Math.min(850, currentViewportWidth - 64);

          if (Math.abs(currentWidth - fitWidthVal) < 12) {
            setPanX(0);
            onZoomChange?.(100, true, 'width');
          } else {
            const baseUnscaled = unscaledWidthRef.current || (currentViewportWidth < 768 ? fitWidthVal * 1.35 : 750);
            const newZoomLevel = Math.max(50, Math.min(300, Math.round((currentWidth / baseUnscaled) * 100)));
            onZoomChange?.(newZoomLevel, false, 'custom');
          }
        }
        gestureMode = 'none';
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onZoomChange]);

  // Desktop Mouse Drag Panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (displayWidth <= viewportWidth) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    isMouseDownRef.current = true;
    mouseDownStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panXRef.current,
      scrollTop: container.scrollTop,
    };
    setIsGestureActive(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaX = e.clientX - mouseDownStartRef.current.x;
    const deltaY = e.clientY - mouseDownStartRef.current.y;

    const halfOverflow = Math.max(0, (displayWidthRef.current - viewportWidthRef.current) / 2);
    let newPanX = mouseDownStartRef.current.panX + deltaX;
    newPanX = Math.max(-halfOverflow, Math.min(halfOverflow, newPanX));

    container.scrollTop = mouseDownStartRef.current.scrollTop - deltaY;
    setPanX(newPanX);
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsGestureActive(false);
    }
  };

  // Setup IntersectionObserver for Visible Pages
  useEffect(() => {
    if (!pdfDoc || numPages === 0 || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisiblePages((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const pageAttr = entry.target.getAttribute('data-page-number');
            if (pageAttr) {
              const pNum = parseInt(pageAttr, 10);
              if (entry.isIntersecting) {
                next.add(pNum);
              }
            }
          });
          return next;
        });
      },
      {
        root: container,
        rootMargin: '600px 0px 600px 0px',
        threshold: 0.01,
      }
    );

    const pageElements = container.querySelectorAll('.pdf-page-wrapper');
    pageElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [pdfDoc, numPages]);

  // Scroll to initial page
  useEffect(() => {
    if (!pdfDoc || numPages === 0 || hasScrolledToInitialRef.current || !scrollContainerRef.current) return;

    if (initialPage > 1 && initialPage <= numPages) {
      setTimeout(() => {
        const pageEl = scrollContainerRef.current?.querySelector(`[data-page-number="${initialPage}"]`);
        if (pageEl) {
          pageEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        hasScrolledToInitialRef.current = true;
      }, 150);
    } else {
      hasScrolledToInitialRef.current = true;
    }
  }, [pdfDoc, numPages, initialPage]);

  // Background queue advances after each page finishes rendering
  const handlePageRenderSuccess = useCallback((finishedPageNumber: number) => {
    setPriorityQueueIndex((prev) => {
      if (finishedPageNumber >= prev && finishedPageNumber < numPages) {
        return finishedPageNumber + 1;
      }
      return prev;
    });
  }, [numPages]);

  // Center scroll tracking for reading progress
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || numPages === 0) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const pageElements = Array.from(container.querySelectorAll('.pdf-page-wrapper')) as HTMLElement[];
    let closestPage = 1;
    let minDistance = Infinity;

    pageElements.forEach((el) => {
      const pageNumAttr = el.getAttribute('data-page-number');
      if (!pageNumAttr) return;

      const rect = el.getBoundingClientRect();
      const pageCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(pageCenterY - containerCenterY);

      if (distance < minDistance) {
        minDistance = distance;
        closestPage = parseInt(pageNumAttr, 10);
      }
    });

    onPageChange?.(closestPage, numPages);
  }, [numPages, onPageChange]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0806] space-y-4 font-mono text-xs text-[var(--text-muted)] p-6">
        <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin" />
        <p className="text-[var(--gold)] font-semibold tracking-wider uppercase text-sm">
          {isSlowLoading ? 'Loading PDF... Please wait.' : 'Loading document...'}
        </p>
      </div>
    );
  }

  if (error || !pdfDoc) {
    return (
      <div className="p-8 text-center max-w-md space-y-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded m-4 font-mono">
        <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded inline-block">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
          Unable to open this PDF.
        </h3>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          The document could not be loaded directly. You can try again or download the file to view locally.
        </p>

        <div className="flex justify-center gap-3 pt-2 text-xs">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] rounded font-bold uppercase flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[var(--gold)]" />
              <span>Retry</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => downloadFileFromUrl(pdfUrl)}
            className="px-4 py-2 bg-[var(--gold)] text-black font-bold uppercase rounded flex items-center gap-2 cursor-pointer transition-colors hover:bg-[var(--gold-light)]"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    );
  }

  const pagesArray = Array.from({ length: numPages }, (_, i) => i + 1);
  const isZoomedIn = displayWidth > viewportWidth;

  return (
    <div
      className="pdf-viewer-outer relative w-full h-full overflow-hidden flex flex-col bg-[#0a0806]"
      style={{ overscrollBehavior: 'contain' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Floating gesture zoom status badge */}
      {(isGestureActive || isZoomedIn) && (
        <div className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[var(--gold)] font-mono text-[11px] rounded border border-[var(--border-main)] shadow-xl pointer-events-none transition-opacity duration-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
          <span>
            {isFitWidth
              ? 'Fit Width'
              : `${Math.round(
                  (displayWidth /
                    (viewportWidth < 768
                      ? Math.max(260, viewportWidth - 16)
                      : Math.min(850, viewportWidth - 64))) *
                    100
                )}%`}
          </span>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="pdf-viewport w-full h-full overflow-y-auto overflow-x-hidden relative flex flex-col items-center bg-[#0a0806] select-none"
        style={{
          touchAction: isZoomedIn ? 'none' : 'pan-y',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          className="pdf-content-wrapper flex flex-col items-center gap-2.5 sm:gap-6 py-2.5 sm:py-6"
          style={{
            width: `${displayWidth}px`,
            transform: `translateX(${panX}px)`,
            transition: isGestureActive ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform',
          }}
        >
          {pagesArray.map((pageNum) => (
            <PageCanvas
              key={pageNum}
              pdfDoc={pdfDoc}
              pageNumber={pageNum}
              displayWidth={displayWidth}
              isVisible={visiblePages.has(pageNum)}
              priorityTrigger={pageNum === priorityQueueIndex ? priorityQueueIndex : 0}
              aspectRatio={aspectRatio}
              isGestureActive={isGestureActive}
              onRenderSuccess={handlePageRenderSuccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
