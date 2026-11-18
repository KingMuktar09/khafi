import React, { useMemo, useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import { QURAN_TEXT_SOURCE, SHIELD_TEXTS, SHIELD_TRANSLITERATION, TRANSLITERATION_SOURCE, shieldTransliterationWords, shieldWordTotals } from '../../data/quranTexts';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
import { addGrimoireItem } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

/**
 * Shields: running letter sums for five short Qur'anic texts (al-Fatiha,
 * al-Ikhlas, al-Falaq, al-Nas and Ayat al-Kursi). Each word is shown with
 * its value and the running total, so the arithmetic can be followed.
 * The sums are COMPUTED from the verified text (see shieldWordTotals
 * in src/data/quranTexts.ts). They are not typed in.
 */
export const ShieldsView: React.FC = () => {
  const lang = appState.settings.language;
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  const shields = useMemo(
    () =>
      SHIELD_TEXTS.map((text) => ({
        ...text,
        ...shieldWordTotals(text.verses.join(' '), system, school),
        translitWords: shieldTransliterationWords(text.id),
      })),
    [system, school],
  );

  const saveShield = (title: string, reference: string, total: number) => {
    addGrimoireItem({
      kind: 'bast',
      title: `${title} (running total)`,
      detail: `${reference}: total ${total} (${system}, ${school}).`,
    });
    appState.showToast(tTools('tools.common.savedToGrimoire', lang), 'success');
  };

  return (
    <ToolsLayout
      title={tTools('tools.shields.title', lang)}
      eyebrow={tTools('tools.shields.eyebrow', lang)}
      subtitle={tTools('tools.shields.subtitle', lang)}
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
        <h2 className="ms-h2">{tTools('tools.shields.spellingTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.shields.spellingBody1', lang)}</p>
        <p className="ms-body">{tTools('tools.shields.spellingBody2', lang)}</p>
      </section>

      {shields.map((shield) => (
        <section key={shield.id} className="ms-card space-y-4">
          <div className="space-y-1">
            <h2 className="ms-h2">
              {shield.title} <span className="ms-muted font-normal">({shield.reference})</span>
            </h2>
            <p className="ms-note">{shield.sourceNote}</p>
          </div>

          <div className="ms-arabic ms-ink text-right leading-loose" dir="rtl" lang="ar">
            {shield.verses.join(' ')}
          </div>
          <div className="ms-body ms-muted space-y-1" lang="en">
            {(SHIELD_TRANSLITERATION[shield.id] ?? []).map((verse, index) => (
              <p key={index}>{verse.join(' ')}</p>
            ))}
          </div>

          <div className="ms-surface ms-table-wrap">
            <table className="ms-table">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.shields.thHash', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.shields.thWord', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.shields.thSayIt', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.shields.thValue', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.shields.thRunning', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {shield.words.map((item, index) => (
                  <tr key={`${item.word}-${index}`}>
                    <td className="px-4 py-2.5 ms-muted ms-num">{index + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="ms-arabic ms-ink" dir="rtl" lang="ar">
                        {item.word}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 ms-ink" lang="en">{shield.translitWords[index] ?? ''}</td>
                    <td className="px-4 py-2.5 text-right ms-ink ms-num">{item.value}</td>
                    <td className="px-4 py-2.5 text-right font-semibold ms-gold ms-num">{item.runningTotal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-4 py-3 font-medium ms-ink">
                    {tfTools('tools.shields.grandTotalWords', lang, { n: shield.words.length })}
                  </td>
                  <td className="px-4 py-3 text-right font-bold ms-gold ms-num">{shield.total}</td>
                </tr>
              </tfoot>
            </table>
            <div className="px-4 py-3 ms-rule-top">
              <button
                type="button"
                onClick={() => saveShield(shield.title, shield.reference, shield.total)}
                className="ms-btn-gold"
              >
                <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
                {tTools('tools.shields.saveTotal', lang)}
              </button>
            </div>
          </div>
        </section>
      ))}

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. {tTools('tools.shields.sourceTail', lang)}
      </p>
    </ToolsLayout>
  );
};
