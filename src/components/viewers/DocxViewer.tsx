import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { Download, ExternalLink, RefreshCw, ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react';
import { getFollowUnlockHeaders } from '../../services/api';

interface DocxViewerProps {
  fileUrl: string;
  title: string;
  onDownload?: () => void;
}

export const DocxViewer: React.FC<DocxViewerProps> = ({ fileUrl, title, onDownload }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(15);
  const [viewMode, setViewMode] = useState<'mammoth' | 'office' | 'google'>('mammoth');

  const absoluteUrl = fileUrl.startsWith('http')
    ? fileUrl
    : typeof window !== 'undefined'
    ? `${window.location.origin}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
    : fileUrl;

  const loadDocx = async () => {
    setLoading(true);
    setError(null);
    try {
      // Paid books are free for followers: send the unlock flag so the
      // server serves a paid file instead of 402 (see services/api).
      const response = await fetch(fileUrl, { headers: getFollowUnlockHeaders() });
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err: any) {
      console.warn('Mammoth conversion error, falling back to embedded viewer:', err);
      setError(err.message || 'Could not parse DOCX natively.');
      setViewMode('google');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocx();
  }, [fileUrl]);

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-main)] overflow-hidden font-sans">
      {/* Document Controls Toolbar */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-main)] p-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[var(--gold)] flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>DOCX Document Viewer</span>
          </span>

          {/* View Mode Toggle Tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-main)] p-1 rounded border border-[var(--border-main)]">
            <button
              type="button"
              onClick={() => setViewMode('mammoth')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                viewMode === 'mammoth'
                  ? 'bg-[var(--gold)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Native Reader
            </button>
            <button
              type="button"
              onClick={() => setViewMode('google')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                viewMode === 'google'
                  ? 'bg-[var(--gold)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Google Viewer
            </button>
            <button
              type="button"
              onClick={() => setViewMode('office')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                viewMode === 'office'
                  ? 'bg-[var(--gold)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Office Online
            </button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {viewMode === 'mammoth' && (
            <div className="flex items-center gap-1 bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border-main)] text-xs">
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.max(12, f - 1))}
                className="p-1 hover:text-[var(--gold)] cursor-pointer"
                title="Decrease font size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1">{fontSize}px</span>
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.min(28, f + 1))}
                className="p-1 hover:text-[var(--gold)] cursor-pointer"
                title="Increase font size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-1 bg-[var(--gold)] text-black font-bold text-xs rounded hover:bg-[var(--gold-light)] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download DOCX</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#181a20]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3 text-[var(--gold)]">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-semibold">Converting DOCX for Native Viewing...</p>
          </div>
        ) : viewMode === 'mammoth' && !error ? (
          /* Native HTML rendering sheet */
          <div className="w-full max-w-4xl bg-[#ffffff] text-[#1a1a1a] p-8 sm:p-14 rounded-lg shadow-2xl border border-gray-300 min-h-[80vh] font-serif leading-relaxed space-y-4">
            <h1 className="font-bold text-2xl text-gray-900 border-b pb-3 mb-6 font-serif">
              {title}
            </h1>
            <div
              className="docx-content space-y-4 prose max-w-none text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        ) : viewMode === 'google' ? (
          /* Google Docs Embedded Viewer Iframe */
          <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-[var(--border-main)] bg-[var(--bg-surface)]">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`}
              className="w-full h-full border-0 min-h-[650px]"
              title={`Google Docs Preview - ${title}`}
            />
          </div>
        ) : (
          /* Microsoft Office Online Viewer Iframe */
          <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-[var(--border-main)] bg-[var(--bg-surface)]">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`}
              className="w-full h-full border-0 min-h-[650px]"
              title={`Office Online Preview - ${title}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
