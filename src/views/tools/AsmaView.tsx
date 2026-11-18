import React, { useMemo, useState } from 'react';
import { BookmarkPlus, Search } from 'lucide-react';
import { ASMA_NAMES, ASMA_SOURCE, nameValues } from '../../data/asmaNames';
import { valueOfText } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { localizeAsmaMeaning, tTools, tfTools } from '../../data/i18n-tools';
import { addGrimoireItem } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

/**
 * The 99 Names: searchable, with each name's Abjad value (bare and
 * with "al-"), a box to reckon any name or text, and a Save button
 * that keeps a name in the Grimoire on this device.
 */
export const AsmaView: React.FC = () => {
  const lang = appState.settings.language;
  const [query, setQuery] = useState('');
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');
  const [reckonText, setReckonText] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ASMA_NAMES;
    return ASMA_NAMES.filter((name) =>
      [name.arabic, name.transliteration, name.meaning].some((field) => field.toLowerCase().includes(q)),
    );
  }, [query]);

  const reckoned = useMemo(() => {
    const text = reckonText.trim();
    if (!text) return null;
    return valueOfText(text, system, school);
  }, [reckonText, system, school]);

  const saveName = (entry: (typeof ASMA_NAMES)[number]) => {
    const values = nameValues(entry, system, school);
    addGrimoireItem({
      kind: 'name',
      title: `${entry.transliteration} — ${entry.arabic}`,
      detail: `${entry.meaning}. Value bare: ${values.bare}; with "al-": ${values.withAl} (${system}, ${school}).`,
    });
    appState.showToast(tTools('tools.common.savedToGrimoire', lang), 'success');
  };



  return (
    <ToolsLayout
      title={tTools('tools.asma.title', lang)}
      eyebrow={tTools('tools.asma.eyebrow', lang)}
      subtitle={tTools('tools.asma.subtitle', lang)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <span className="ms-label">{tTools('tools.common.system', lang)}</span>
          <div className="flex gap-2" role="group" aria-label={tTools('tools.common.system', lang)}>
            <button type="button" aria-pressed={system === 'kabir'} onClick={() => setSystem('kabir')} className="ms-toggle">
              {tTools('tools.common.kabir', lang)}
            </button>
            <button type="button" aria-pressed={system === 'saghir'} onClick={() => setSystem('saghir')} className="ms-toggle">
              {tTools('tools.common.saghir', lang)}
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="ms-label">{tTools('tools.common.school', lang)}</span>
          <div className="flex gap-2" role="group" aria-label={tTools('tools.common.school', lang)}>
            <button type="button" aria-pressed={school === 'mashriqi'} onClick={() => setSchool('mashriqi')} className="ms-toggle">
              {tTools('tools.common.mashriqi', lang)}
            </button>
            <button type="button" aria-pressed={school === 'maghribi'} onClick={() => setSchool('maghribi')} className="ms-toggle">
              {tTools('tools.common.maghribi', lang)}
            </button>
          </div>
        </div>
      </div>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.asma.reckonTitle', lang)}</h2>
        <label className="ms-label block" htmlFor="reckon-input">
          {tTools('tools.asma.reckonLabel', lang)}
        </label>
        <input
          id="reckon-input"
          type="text"
          value={reckonText}
          onChange={(event) => setReckonText(event.target.value)}
          placeholder={tTools('tools.asma.reckonPlaceholder', lang)}
          dir="auto"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
        {reckoned && reckoned.letters.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5" dir="rtl">
              {reckoned.letters.map((item, index) => (
                <span
                  key={`${item.letter}-${index}`}
                  className="ms-chip inline-flex flex-col items-center px-2.5 py-1.5"
                >
                  <span className="ms-arabic-sm leading-none ms-ink" lang="ar">
                    {item.letter}
                  </span>
                  <span className="text-xs ms-gold ms-num">{item.value}</span>
                </span>
              ))}
            </div>
            <p className="ms-body">
              {tTools('tools.common.total', lang)}: <span className="font-semibold ms-gold ms-num">{reckoned.total}</span>
              <span className="ms-muted"> ({system}, {school})</span>
            </p>
          </div>
        ) : reckonText.trim() ? (
          <p className="ms-body">{tTools('tools.asma.noArabic', lang)}</p>
        ) : null}
      </section>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ms-muted" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.asma.searchPlaceholder', lang)}
          aria-label={tTools('tools.asma.searchAria', lang)}
          className="ms-field w-full min-h-12 pl-10 pr-3.5 text-base"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="ms-body ms-surface px-4 py-5 text-center">
          {tfTools('tools.asma.noNames', lang, { q: query.trim() })}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((entry) => {
            const values = nameValues(entry, system, school);
            return (
              <li
                key={entry.bare}
                className="ms-surface ms-card-hover px-4 py-3.5 flex items-center gap-3"
              >
                <span className="ms-arabic-lg ms-gold shrink-0" dir="rtl" lang="ar">
                  {entry.arabic}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium ms-ink">{entry.transliteration}</span>
                  <span className="block text-xs ms-muted truncate">{localizeAsmaMeaning(entry.bare, entry.meaning, lang)}</span>
                  <span className="block text-xs ms-muted ms-num mt-0.5">
                    {tTools('tools.asma.bare', lang)}: <span className="ms-gold font-semibold">{values.bare}</span>
                    {' · '}{tTools('tools.asma.withAl', lang)}: <span className="ms-gold font-semibold">{values.withAl}</span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => saveName(entry)}
                  aria-label={tfTools('tools.asma.saveAria', lang, { name: entry.transliteration })}
                  className="ms-btn shrink-0"
                >
                  <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
                  {tTools('tools.common.save', lang)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="ms-note">
        {tTools('tools.common.source', lang)}: {ASMA_SOURCE}. {tTools('tools.asma.sourceNote', lang)}
      </p>
    </ToolsLayout>
  );
};
