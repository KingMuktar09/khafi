import React, { useMemo, useState } from 'react';
import { BookmarkPlus, Search } from 'lucide-react';
import { ASMA_NAMES, ASMA_SOURCE, nameValues } from '../../data/asmaNames';
import { valueOfText } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { addGrimoireItem } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

/**
 * The 99 Names: searchable, with each name's Abjad value (bare and
 * with "al-"), a box to reckon any name or text, and a Save button
 * that keeps a name in the Grimoire on this device.
 */
export const AsmaView: React.FC = () => {
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
    appState.showToast('Saved to Grimoire', 'success');
  };



  return (
    <ToolsLayout
      title="Asma — The 99 Names"
      eyebrow="The 99 Names"
      subtitle="Search the Names by Arabic, transliteration or meaning. Values use Kabir Mashriqi by default — change the system or school below and they recompute."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <span className="ms-label">System</span>
          <div className="flex gap-2" role="group" aria-label="System">
            <button type="button" aria-pressed={system === 'kabir'} onClick={() => setSystem('kabir')} className="ms-toggle">
              Kabir (large)
            </button>
            <button type="button" aria-pressed={system === 'saghir'} onClick={() => setSystem('saghir')} className="ms-toggle">
              Saghir (small)
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="ms-label">School</span>
          <div className="flex gap-2" role="group" aria-label="School">
            <button type="button" aria-pressed={school === 'mashriqi'} onClick={() => setSchool('mashriqi')} className="ms-toggle">
              Mashriqi (eastern)
            </button>
            <button type="button" aria-pressed={school === 'maghribi'} onClick={() => setSchool('maghribi')} className="ms-toggle">
              Maghribi (western)
            </button>
          </div>
        </div>
      </div>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Reckon a name</h2>
        <label className="ms-label block" htmlFor="reckon-input">
          Type any name or text
        </label>
        <input
          id="reckon-input"
          type="text"
          value={reckonText}
          onChange={(event) => setReckonText(event.target.value)}
          placeholder="e.g. Rahman"
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
              Total: <span className="font-semibold ms-gold ms-num">{reckoned.total}</span>
              <span className="ms-muted"> ({system}, {school})</span>
            </p>
          </div>
        ) : reckonText.trim() ? (
          <p className="ms-body">No Arabic letters found in that text.</p>
        ) : null}
      </section>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ms-muted" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by Arabic, transliteration or meaning…"
          aria-label="Search the 99 Names"
          className="ms-field w-full min-h-12 pl-10 pr-3.5 text-base"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="ms-body ms-surface px-4 py-5 text-center">
          No names match “{query.trim()}”.
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
                  <span className="block text-xs ms-muted truncate">{entry.meaning}</span>
                  <span className="block text-xs ms-muted ms-num mt-0.5">
                    Bare: <span className="ms-gold font-semibold">{values.bare}</span>
                    {' · '}with “al-”: <span className="ms-gold font-semibold">{values.withAl}</span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => saveName(entry)}
                  aria-label={`Save ${entry.transliteration} to Grimoire`}
                  className="ms-btn shrink-0"
                >
                  <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
                  Save
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="ms-note">
        Source: {ASMA_SOURCE}. The list runs from Ar-Rahman to As-Sabur; Allah’s own name is not counted
        among the ninety-nine here.
      </p>
    </ToolsLayout>
  );
};
