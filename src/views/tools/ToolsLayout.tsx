import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { router } from '../../router/router';
import { ToolDisclaimer } from '../../components/tools/ToolDisclaimer';
import { ToolsSearchOverlay } from './ToolsSearchOverlay';

interface ToolsLayoutProps {
  title: string;
  subtitle?: string;
  /** Small caps label above the title, e.g. "Letters & Numbers". */
  eyebrow?: string;
  children: React.ReactNode;
}

/**
 * Shared wrapper for every study-tools page: back link to the hub,
 * eyebrow + title + subtitle, a search button (Ctrl+K / Cmd+K opens
 * the overlay), the study-only disclaimer, then the page content.
 * The ms-tools class scopes the manuscript design system to the
 * tools section only; the rest of the site is untouched.
 */
export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ title, subtitle, eyebrow = 'Study Tools', children }) => {
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in ms-tools">
      <button
        type="button"
        onClick={() => router.navigate('tools')}
        className="inline-flex items-center gap-1.5 text-sm ms-muted hover:text-[var(--ms-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Study Tools
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <span className="ms-eyebrow block">{eyebrow}</span>
          <h1 className="ms-title">{title}</h1>
          {subtitle ? <p className="ms-subtitle">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search tools (Ctrl+K)"
          className="ms-btn shrink-0"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="ms-kbd hidden sm:inline">Ctrl K</kbd>
        </button>
      </div>

      <ToolDisclaimer />

      <ToolsSearchOverlay open={searchOpen} onClose={closeSearch} />

      {children}
    </div>
  );
};
