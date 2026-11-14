import React, { useState } from 'react';
import { Download, FileSpreadsheet, Presentation, FileText } from 'lucide-react';

interface OfficeEmbedViewerProps {
  fileUrl: string;
  title: string;
  ext: string;
  onDownload?: () => void;
}

export const OfficeEmbedViewer: React.FC<OfficeEmbedViewerProps> = ({
  fileUrl,
  title,
  ext,
  onDownload,
}) => {
  const [provider, setProvider] = useState<'google' | 'office'>('google');

  const absoluteUrl = fileUrl.startsWith('http')
    ? fileUrl
    : typeof window !== 'undefined'
    ? `${window.location.origin}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
    : fileUrl;

  const isSpreadsheet = ['xls', 'xlsx', 'csv'].includes(ext.toLowerCase());
  const isPresentation = ['ppt', 'pptx'].includes(ext.toLowerCase());

  const IconComponent = isSpreadsheet
    ? FileSpreadsheet
    : isPresentation
    ? Presentation
    : FileText;

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-main)] overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-main)] p-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <IconComponent className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span className="font-semibold text-[var(--text-main)] truncate max-w-xs">{title}</span>
          <span className="px-2 py-0.5 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded text-[10px] font-bold uppercase">
            .{ext}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Provider Selector */}
          <div className="flex items-center gap-1 bg-[var(--bg-main)] p-1 rounded border border-[var(--border-main)]">
            <button
              type="button"
              onClick={() => setProvider('google')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                provider === 'google'
                  ? 'bg-[var(--gold)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Google Viewer
            </button>
            <button
              type="button"
              onClick={() => setProvider('office')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                provider === 'office'
                  ? 'bg-[var(--gold)] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Office Online
            </button>
          </div>

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="px-3.5 py-1 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {ext.toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Iframe Player */}
      <div className="flex-1 overflow-hidden relative bg-[#1c1f26]">
        {provider === 'google' ? (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`}
            className="w-full h-full border-0 min-h-[600px]"
            title={`Google Preview - ${title}`}
          />
        ) : (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`}
            className="w-full h-full border-0 min-h-[600px]"
            title={`Office Online Preview - ${title}`}
          />
        )}
      </div>
    </div>
  );
};
