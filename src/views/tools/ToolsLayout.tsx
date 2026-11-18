import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { router } from '../../router/router';
import { ToolDisclaimer } from '../../components/tools/ToolDisclaimer';
import { ToolsSearchOverlay } from './ToolsSearchOverlay';

interface ToolsLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Shared wrapper for every study-tools page: back link to the hub,
 * title + subtitle, a search button (Ctrl+K / Cmd+K opens the overlay),
 * the study-only disclaimer, then the page content.
 */
export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ title, subtitle, children }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in py-2 font-sans">
      <button
        type="button"
        onClick={() => router.navigate('tools')}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded px-1 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Study Tools
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
            {title}
          </h1>
          {subtitle ? <p className="text-sm text-[var(--text-muted)] leading-relaxed">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search tools (Ctrl+K)"
          className="shrink-0 inline-flex items-center gap-2 min-h-11 px-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-xs border border-[var(--border-main)] rounded px-1.5 py-0.5">Ctrl K</kbd>
        </button>
      </div>

      <ToolDisclaimer />

      <ToolsSearchOverlay open={searchOpen} onClose={closeSearch} />

      {children}
    </div>
  );
};
