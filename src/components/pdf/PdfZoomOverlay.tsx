import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  ChevronUp,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export type FitMode = 'width' | 'page' | 'custom';

interface PdfZoomOverlayProps {
  zoomLevel: number;
  fitMode: FitMode;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  onSetZoom: (zoom: number) => void;
  onResetZoom: () => void;
  className?: string;
}

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200, 250];

export const PdfZoomOverlay: React.FC<PdfZoomOverlayProps> = ({
  zoomLevel,
  fitMode,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  onFitPage,
  onSetZoom,
  onResetZoom,
  className = '',
}) => {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const presetsRef = useRef<HTMLDivElement | null>(null);

  // Close preset dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) {
        setIsPresetsOpen(false);
      }
    };
    if (isPresetsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPresetsOpen]);

  // Determine current mode label
  const getDisplayLabel = () => {
    if (fitMode === 'page') return 'Fit Page';
    if (fitMode === 'width') return 'Fit Width';
    return `${zoomLevel}%`;
  };

  return (
    <div
      id="pdf-zoom-control-overlay"
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-auto select-none ${
        isCollapsed ? 'opacity-80 hover:opacity-100' : 'opacity-95 hover:opacity-100'
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preset Dropdown Popup */}
      {isPresetsOpen && !isCollapsed && (
        <div
          ref={presetsRef}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-main)] rounded-xl shadow-2xl p-2 min-w-[170px] flex flex-col gap-1 font-mono text-xs z-40 animate-fade-in"
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-main)]/60 mb-1">
            Display & Zoom Presets
          </div>

          <button
            type="button"
            onClick={() => {
              onFitPage();
              setIsPresetsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              fitMode === 'page'
                ? 'bg-[var(--gold)] text-black font-bold'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Fit to Page</span>
            </div>
            {fitMode === 'page' && <Check className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              onFitWidth();
              setIsPresetsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
              fitMode === 'width'
                ? 'bg-[var(--gold)] text-black font-bold'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fit to Width</span>
            </div>
            {fitMode === 'width' && <Check className="w-3.5 h-3.5" />}
          </button>

          <div className="h-px bg-[var(--border-main)]/60 my-1" />

          <div className="grid grid-cols-2 gap-1">
            {ZOOM_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => {
                  onSetZoom(pct);
                  setIsPresetsOpen(false);
                }}
                className={`px-2 py-1.5 rounded-lg text-center font-bold text-xs transition-colors cursor-pointer ${
                  fitMode === 'custom' && zoomLevel === pct
                    ? 'bg-[var(--gold)] text-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating HUD Bar */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-[var(--bg-surface)]/90 dark:bg-slate-900/90 backdrop-blur-md border border-[var(--border-main)] shadow-xl shadow-black/30 rounded-full px-2 sm:px-3 py-1.5 text-[var(--text-main)]">
        
        {/* Toggle Collapse Button on mobile */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 sm:p-1.5 text-[var(--text-muted)] hover:text-[var(--gold)] rounded-full hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Zoom Controls' : 'Minimize Controls'}
        >
          {isCollapsed ? <Sliders className="w-3.5 h-3.5 text-[var(--gold)]" /> : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Collapsed State: Shows quick toggle badge */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1.5 px-2 py-0.5 font-mono text-xs font-bold text-[var(--gold)] cursor-pointer"
          >
            <span>{getDisplayLabel()}</span>
            <ChevronUp className="w-3 h-3 text-[var(--gold)]" />
          </button>
        ) : (
          <>
            {/* Divider */}
            <div className="w-px h-4 bg-[var(--border-main)] mx-0.5" />

            {/* Fit to Page Button */}
            <button
              type="button"
              id="pdf-fit-page-btn"
              onClick={onFitPage}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                fitMode === 'page'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
              title="Fit Entire Page on Screen"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Fit Page</span>
            </button>

            {/* Fit to Width Button */}
            <button
              type="button"
              id="pdf-fit-width-btn"
              onClick={onFitWidth}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                fitMode === 'width'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
              title="Fit Page Width to Screen Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Fit Width</span>
            </button>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--border-main)] mx-0.5" />

            {/* Zoom Out (-) Button */}
            <button
              type="button"
              id="pdf-zoom-out-btn"
              onClick={onZoomOut}
              disabled={fitMode === 'custom' && zoomLevel <= 50}
              className="p-1 sm:p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed rounded-full hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Zoom Out (Ctrl -)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Preset Selector Dropdown Trigger */}
            <button
              type="button"
              id="pdf-zoom-preset-btn"
              onClick={() => setIsPresetsOpen(!isPresetsOpen)}
              className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer min-w-[58px] justify-center ${
                isPresetsOpen
                  ? 'bg-[var(--bg-hover)] text-[var(--gold)]'
                  : fitMode !== 'custom'
                  ? 'text-[var(--gold)] hover:bg-[var(--bg-hover)]'
                  : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
              title="Select Zoom Preset"
            >
              <span>{getDisplayLabel()}</span>
              <ChevronUp className={`w-3 h-3 transition-transform ${isPresetsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Zoom In (+) Button */}
            <button
              type="button"
              id="pdf-zoom-in-btn"
              onClick={onZoomIn}
              disabled={fitMode === 'custom' && zoomLevel >= 300}
              className="p-1 sm:p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed rounded-full hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              title="Zoom In (Ctrl +)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            {/* 100% Reset Button */}
            <button
              type="button"
              id="pdf-zoom-reset-btn"
              onClick={onResetZoom}
              className={`p-1 sm:p-1.5 rounded-full transition-colors cursor-pointer ${
                fitMode === 'custom' && zoomLevel === 100
                  ? 'text-[var(--gold)] bg-[var(--gold-faint)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
