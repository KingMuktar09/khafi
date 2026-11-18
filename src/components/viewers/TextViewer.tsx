import React, { useEffect, useState } from 'react';
import { Download, Copy, Check, ZoomIn, ZoomOut, FileCode, AlignLeft, RefreshCw } from 'lucide-react';
import { getFollowUnlockHeaders } from '../../services/api';

interface TextViewerProps {
  fileUrl: string;
  title: string;
  ext: string;
  onDownload?: () => void;
}

export const TextViewer: React.FC<TextViewerProps> = ({ fileUrl, title, ext, onDownload }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchText = async () => {
      setLoading(true);
      setError(null);
      try {
        // Paid books are free for followers: send the unlock flag so the
        // server serves a paid file instead of 402 (see services/api).
        const response = await fetch(fileUrl, { headers: getFollowUnlockHeaders() });
        if (!response.ok) {
          throw new Error(`Failed to load text file (${response.status})`);
        }
        const content = await response.text();
        setText(content);
      } catch (err: any) {
        setError(err.message || 'Error loading text content.');
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [fileUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d1117] text-[#c9d1d9] overflow-hidden font-mono">
      {/* Header Toolbar */}
      <div className="bg-[#161b22] border-b border-[#30363d] p-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0 z-10">
        <div className="flex items-center gap-2 text-xs">
          <FileCode className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span className="font-semibold text-white truncate max-w-xs">{title}</span>
          <span className="px-2 py-0.5 rounded bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] text-[10px] font-bold uppercase">
            .{ext}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#21262d] px-2 py-1 rounded border border-[#30363d]">
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.max(10, f - 1))}
              className="p-1 hover:text-white cursor-pointer"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-white">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
              className="p-1 hover:text-white cursor-pointer"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Word Wrap Toggle */}
          <button
            type="button"
            onClick={() => setWordWrap(!wordWrap)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
              wordWrap ? 'bg-[var(--gold)] text-black border-[var(--gold)]' : 'bg-[#21262d] border-[#30363d] text-gray-300'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Wrap</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 rounded text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-1 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Code / Text Body */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#0d1117]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[var(--gold)] space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-semibold">Loading text content...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs">
            {error}
          </div>
        ) : (
          <pre
            style={{ fontSize: `${fontSize}px` }}
            className={`font-mono text-gray-200 leading-relaxed font-normal ${
              wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
            }`}
          >
            {text}
          </pre>
        )}
      </div>
    </div>
  );
};
