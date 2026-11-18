import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { router } from '../../router/router';
import { TOOLS_INDEX } from '../../data/toolsIndex';
import { ASMA_NAMES } from '../../data/asmaNames';
import type { ViewName } from '../../types';

interface ToolsSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface SearchHit {
  key: string;
  title: string;
  detail: string;
  arabic?: string;
  route: ViewName;
}

const MAX_NAME_HITS = 8;

/**
 * Ctrl+K search overlay: searches the tool pages and the 99 Names
 * (by Arabic, transliteration or meaning). Enter or a tap navigates;
 * a Name result opens the Asma page. Escape closes.
 */
export const ToolsSearchOverlay: React.FC<ToolsSearchOverlayProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      // Focus after the overlay mounts.
      const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open ]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const hits: SearchHit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const toolHits: SearchHit[] = TOOLS_INDEX.filter((tool) =>
      [tool.title, tool.blurb, ...tool.keywords].some((field) => field.toLowerCase().includes(q)),
    ).map((tool) => ({
      key: `tool-${tool.id}`,
      title: tool.title,
      detail: tool.blurb,
      route: tool.route,
    }));
    const nameHits: SearchHit[] = ASMA_NAMES.filter((name) =>
      [name.arabic, name.transliteration, name.meaning].some((field) => field.toLowerCase().includes(q)),
    )
      .slice(0, MAX_NAME_HITS)
      .map((name) => ({
        key: `name-${name.bare}`,
        title: name.transliteration,
        detail: name.meaning,
        arabic: name.arabic,
        route: 'tools-asma',
      }));
    return [...toolHits, ...nameHits];
  }, [query]);

  if (!open) return null;

  const go = (route: ViewName) => {
    onClose();
    router.navigate(route);
  };

  const onEnter = () => {
    if (hits.length > 0) go(hits[0].route);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search study tools"
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onEnter();
            }}
            placeholder="Search tools and the 99 Names…"
            aria-label="Search tools and the 99 Names"
            className="flex-1 min-w-0 bg-transparent text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <p className="px-4 py-5 text-sm text-[var(--text-muted)]">
              Try “letters”, “counter”, “notes”, or a Name such as “Rahman”.
            </p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-5 text-sm text-[var(--text-muted)]">
              No matches for “{query.trim()}”.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {hits.map((hit) => (
                <li key={hit.key}>
                  <button
                    type="button"
                    onClick={() => go(hit.route)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--gold)]"
                  >
                    {hit.arabic ? (
                      <span className="font-arabic text-xl text-[var(--gold)] shrink-0" dir="rtl" lang="ar">
                        {hit.arabic}
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[var(--text-main)]">{hit.title}</span>
                      <span className="block text-xs text-[var(--text-muted)] truncate">{hit.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
