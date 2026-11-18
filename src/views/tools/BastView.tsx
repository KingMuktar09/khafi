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
import { localizeNormalizationRule, tTools } from '../../data/i18n-tools';
import { addGrimoireItem } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

const EXAMPLE_TEXT = 'بسم الله الرحمن الرحيم';

/**
 * Unfold any text into its letters: each letter with its Kabir and
 * Saghir values, the running total, and the grand total.
 */
export const BastView: React.FC = () => {
  const lang = appState.settings.language;
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
    appState.showToast(tTools('tools.common.savedToGrimoire', lang), 'success');
  };



  let running = 0;

  return (
    <ToolsLayout
      title={tTools('tools.bast.title', lang)}
      eyebrow={tTools('tools.bast.eyebrow', lang)}
      subtitle={tTools('tools.bast.subtitle', lang)}
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

      <div className="space-y-2">
        <label className="ms-label block" htmlFor="bast-input">
          {tTools('tools.bast.yourText', lang)}
        </label>
        <textarea
          id="bast-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          dir="auto"
          placeholder={tTools('tools.bast.placeholder', lang)}
          className="ms-field w-full px-3.5 py-3 text-base resize-y"
        />
        {normalized.trim() && normalized !== text ? (
          <p className="ms-note">
            {tTools('tools.bast.countedAs', lang)} <span className="font-arabic text-sm ms-ink" dir="rtl" lang="ar">{normalized}</span>
          </p>
        ) : null}
      </div>

      {!result ? (
        <div className="ms-card space-y-3 text-center">
          <p className="ms-body">
            {tTools('tools.bast.empty', lang)}
          </p>
          <button
            type="button"
            onClick={() => setText(EXAMPLE_TEXT)}
            className="ms-btn-gold"
          >
            {tTools('tools.bast.tryExample', lang)} <span className="font-arabic" dir="rtl" lang="ar">{EXAMPLE_TEXT}</span>
          </button>
        </div>
      ) : (
        <section className="ms-surface ms-table-wrap">
          <table className="ms-table">
            <thead>
              <tr className="text-left">
                <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.bast.thHash', lang)}</th>
                <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.bast.thLetter', lang)}</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.bast.thKabir', lang)}</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.bast.thSaghir', lang)}</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.bast.thRunning', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {result.letters.map((item, index) => {
                const kabir = letterValue(item.letter, 'kabir', school) ?? 0;
                running += item.value;
                return (
                  <tr key={`${item.letter}-${index}`}>
                    <td className="px-4 py-2.5 ms-muted ms-num">{index + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="ms-arabic ms-ink" dir="rtl" lang="ar">
                        {item.letter}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right ms-ink ms-num">{kabir}</td>
                    <td className="px-4 py-2.5 text-right ms-muted ms-num">{saghirOf(kabir)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold ms-gold ms-num">{running}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-4 py-3 font-medium ms-ink">{tTools('tools.common.grandTotal', lang)}</td>
                <td className="px-4 py-3 text-right font-bold ms-gold ms-num">{result.total}</td>
              </tr>
            </tfoot>
          </table>
          <div className="px-4 py-3 ms-rule-top">
            <button
              type="button"
              onClick={saveResult}
              className="ms-btn-gold"
            >
              <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
              {tTools('tools.bast.saveUnfolding', lang)}
            </button>
          </div>
        </section>
      )}

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.bast.howCounted', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{localizeNormalizationRule(rule, lang)}</li>
          ))}
        </ul>
      </section>
    </ToolsLayout>
  );
};
