import React, { useMemo, useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import {
  NORMALIZATION_RULES,
  letterValue,
  normalizeArabic,
  saghirOf,
  valueOfText,
} from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { addGrimoireItem } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

const EXAMPLE_TEXT = 'بسم الله الرحمن الرحيم';

/**
 * Unfold any text into its letters: each letter with its Kabir and
 * Saghir values, the running total, and the grand total.
 */
export const BastView: React.FC = () => {
  const [text, setText] = useState('');
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  const normalized = useMemo(() => normalizeArabic(text), [text]);

  const result = useMemo(() => {
    if (!normalized.trim()) return null;
    return valueOfText(normalized, system, school);
  }, [normalized, system, school]);

  const saveResult = () => {
    if (!result) return;
    addGrimoireItem({
      kind: 'bast',
      title: text.trim().slice(0, 80),
      detail: `Unfolded total: ${result.total} (${system}, ${school}). Letters: ${result.letters
        .map((item) => `${item.letter} ${item.value}`)
        .join(', ')}.`,
    });
    appState.showToast('Saved to Grimoire', 'success');
  };

  const toggleButton = (active: boolean) =>
    `flex-1 min-h-11 px-3 rounded-xl border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
      active
        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)]'
        : 'bg-[var(--bg-surface)] border-[var(--border-main)] text-[var(--text-muted)]'
    }`;

  let running = 0;

  return (
    <ToolsLayout
      title="Bast — Unfold a Text"
      subtitle="Type any text and see it unfolded letter by letter, with each letter’s value and the running total."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-[var(--text-muted)]">System</span>
          <div className="flex gap-2" role="group" aria-label="System">
            <button type="button" aria-pressed={system === 'kabir'} onClick={() => setSystem('kabir')} className={toggleButton(system === 'kabir')}>
              Kabir (large)
            </button>
            <button type="button" aria-pressed={system === 'saghir'} onClick={() => setSystem('saghir')} className={toggleButton(system === 'saghir')}>
              Saghir (small)
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-[var(--text-muted)]">School</span>
          <div className="flex gap-2" role="group" aria-label="School">
            <button type="button" aria-pressed={school === 'mashriqi'} onClick={() => setSchool('mashriqi')} className={toggleButton(school === 'mashriqi')}>
              Mashriqi (eastern)
            </button>
            <button type="button" aria-pressed={school === 'maghribi'} onClick={() => setSchool('maghribi')} className={toggleButton(school === 'maghribi')}>
              Maghribi (western)
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor="bast-input">
          Your text
        </label>
        <textarea
          id="bast-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          dir="auto"
          placeholder="Type Arabic text here…"
          className="w-full px-3.5 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] resize-y"
        />
        {normalized.trim() && normalized !== text ? (
          <p className="text-xs text-[var(--text-muted)]">
            Counted as: <span className="font-arabic text-sm text-[var(--text-main)]" dir="rtl" lang="ar">{normalized}</span>
          </p>
        ) : null}
      </div>

      {!result ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Nothing to unfold yet. Type some text above, or try the example.
          </p>
          <button
            type="button"
            onClick={() => setText(EXAMPLE_TEXT)}
            className="min-h-11 px-4 rounded-xl bg-[var(--gold-faint)] border border-[var(--gold)] text-sm font-medium text-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            Try an example: <span className="font-arabic" dir="rtl" lang="ar">{EXAMPLE_TEXT}</span>
          </button>
        </div>
      ) : (
        <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-main)] text-left text-[var(--text-muted)]">
                <th scope="col" className="px-4 py-3 font-medium">#</th>
                <th scope="col" className="px-4 py-3 font-medium">Letter</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Kabir</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Saghir</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Running total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {result.letters.map((item, index) => {
                const kabir = letterValue(item.letter, 'kabir', school) ?? 0;
                running += item.value;
                return (
                  <tr key={`${item.letter}-${index}`}>
                    <td className="px-4 py-2.5 text-[var(--text-muted)] tabular-nums">{index + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-arabic text-2xl text-[var(--text-main)]" dir="rtl" lang="ar">
                        {item.letter}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-main)] tabular-nums">{kabir}</td>
                    <td className="px-4 py-2.5 text-right text-[var(--text-muted)] tabular-nums">{saghirOf(kabir)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[var(--gold)] tabular-nums">{running}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--border-main)]">
                <td colSpan={4} className="px-4 py-3 font-medium text-[var(--text-main)]">Grand total</td>
                <td className="px-4 py-3 text-right font-bold text-[var(--gold)] tabular-nums">{result.total}</td>
              </tr>
            </tfoot>
          </table>
          <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={saveResult}
              className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--gold-faint)] border border-[var(--gold)] text-sm font-medium text-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
              Save this unfolding to Grimoire
            </button>
          </div>
        </section>
      )}

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">How the text is counted</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </ToolsLayout>
  );
};
