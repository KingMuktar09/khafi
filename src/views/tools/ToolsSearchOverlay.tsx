import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { router } from '../../router/router';
import { TOOLS_INDEX } from '../../data/toolsIndex';
import { TOPICS, topicRouteFor } from '../../data/topicsContent';
import { TOPIC_QUESTIONS } from '../../data/topicsQuestions';
import { STUDY_GUIDES } from '../../data/studyGuides';
import { ASMA_NAMES } from '../../data/asmaNames';
import type { ViewName } from '../../types';
import { appState } from '../../state/appState';
import { localizeAsmaMeaning, localizeTool, tTools, tfTools } from '../../data/i18n-tools';

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
 * Ctrl+K search overlay: searches the tool pages, the Topics, the Study
 * Guides and the 99 Names (by Arabic, transliteration or meaning). Enter
 * or a tap navigates; a Name result opens the Asma page, a Guide result
 * opens the Guides page. Escape closes.
 */
export const ToolsSearchOverlay: React.FC<ToolsSearchOverlayProps> = ({ open, onClose }) => {
  const lang = appState.settings.language;
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
    const toolHits: SearchHit[] = TOOLS_INDEX.filter((tool) => {
      const localized = localizeTool(tool, lang);
      return [tool.title, tool.blurb, localized.title, localized.blurb, ...tool.keywords].some((field) =>
        field.toLowerCase().includes(q),
      );
    }).map((tool) => {
      const localized = localizeTool(tool, lang);
      return {
        key: `tool-${tool.id}`,
        title: localized.title,
        detail: localized.blurb,
        route: tool.route,
      };
    });
    const nameHits: SearchHit[] = ASMA_NAMES.filter((name) =>
      [name.arabic, name.transliteration, name.meaning, localizeAsmaMeaning(name.bare, name.meaning, lang)].some(
        (field) => field.toLowerCase().includes(q),
      ),
    )
      .slice(0, MAX_NAME_HITS)
      .map((name) => ({
        key: `name-${name.bare}`,
        title: name.transliteration,
        detail: localizeAsmaMeaning(name.bare, name.meaning, lang),
        arabic: name.arabic,
        route: 'tools-asma',
      }));
    const topicHits: SearchHit[] = TOPICS.filter((topic) =>
      [
        topic.title,
        topic.subtitle,
        ...topic.terms.map((term) => term.transliteration),
        ...topic.terms.map((term) => term.meaning),
        ...topic.sections.map((section) => section.heading),
      ].some((field) => field.toLowerCase().includes(q)),
    ).map((topic) => ({
      key: `topic-${topic.id}`,
      title: topic.title,
      detail: topic.subtitle,
      route: topicRouteFor(topic.id),
    }));
    const questionHits: SearchHit[] = TOPIC_QUESTIONS.filter((item) =>
      [item.question, ...item.answer].some((field) => field.toLowerCase().includes(q)),
    ).map((item) => ({
      key: `question-${item.id}`,
      title: item.question,
      detail: item.answer[0],
      route: 'topics-questions' as ViewName,
    }));
    const guideHits: SearchHit[] = STUDY_GUIDES.filter((guide) =>
      [
        guide.title,
        guide.subtitle,
        ...guide.terms.map((term) => term.transliteration),
        ...guide.terms.map((term) => term.meaning),
        ...guide.sections.map((section) => section.heading),
      ].some((field) => field.toLowerCase().includes(q)),
    ).map((guide) => ({
      key: `guide-${guide.id}`,
      title: guide.title,
      detail: guide.subtitle,
      route: 'topics-guides' as ViewName,
    }));
    return [...toolHits, ...topicHits, ...guideHits, ...questionHits, ...nameHits];
  }, [query, lang]);

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
      aria-label={tTools('tools.search.dialogLabel', lang)}
    >
      <div
        className="ms-search-panel w-full max-w-lg overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 ms-rule-bottom">
          <Search className="w-5 h-5 ms-muted shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onEnter();
            }}
            placeholder={tTools('tools.search.placeholder', lang)}
            aria-label={tTools('tools.search.aria', lang)}
            className="ms-search-input flex-1 min-w-0 bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={tTools('tools.common.closeSearch', lang)}
            className="p-1.5 rounded-lg ms-muted hover:text-[var(--ms-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <p className="px-4 py-5 ms-body">
              {tTools('tools.search.hint', lang)}
            </p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-5 ms-body">
              {tfTools('tools.common.noMatchesFor', lang, { q: query.trim() })}
            </p>
          ) : (
            <ul className="ms-search-results">
              {hits.map((hit) => (
                <li key={hit.key}>
                  <button
                    type="button"
                    onClick={() => go(hit.route)}
                    className="ms-search-row w-full flex items-center gap-3 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ms-gold)]"
                  >
                    {hit.arabic ? (
                      <span className="ms-arabic-sm ms-gold shrink-0" dir="rtl" lang="ar">
                        {hit.arabic}
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block text-sm font-medium ms-ink">{hit.title}</span>
                      <span className="block text-xs ms-muted truncate">{hit.detail}</span>
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
