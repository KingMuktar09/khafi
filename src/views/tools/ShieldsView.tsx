import React, { useMemo, useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import { QURAN_TEXT_SOURCE, SHIELD_TEXTS, SHIELD_TRANSLITERATION, TRANSLITERATION_SOURCE, shieldTransliterationWords, shieldWordTotals } from '../../data/quranTexts';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
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
    appState.showToast('Saved to Grimoire', 'success');
  };

  return (
    <ToolsLayout
      title="Shields (Running Letter Sums)"
      eyebrow="Letters & Numbers"
      subtitle="Five short texts, counted word by word. Each row shows a word, its value, and the running total, so you can follow the arithmetic to the grand total."
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
        <h2 className="ms-h2">A note on the spelling</h2>
        <p className="ms-body">
          The totals count the Uthmani text as written, including the shadda: a shadda doubles its
          letter, so al-Rahman counts <span className="font-semibold ms-ink">529</span> here, while
          the plain spelling without the shadda counts 329 on the Asma page. Both use the same
          counting rules. The difference is the spelling of the text, not a different rule. The
          Basmalah is verse 1 of al-Fatiha, so it is counted in the Fatiha. For al-Ikhlas, al-Falaq
          and al-Nas the Basmalah is not a verse of those surahs, so it is not counted in them.
        </p>
        <p className="ms-body">
          The Latin lines read each text out, so you can follow it without knowing Arabic. In this
          reading, AA is the letter ayn, and th is the letter tha. The l of “al” stays written
          before sun letters, so ar-Rahman reads alrrahman.
        </p>
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
                  <th scope="col" className="px-4 py-3 font-medium">#</th>
                  <th scope="col" className="px-4 py-3 font-medium">Word</th>
                  <th scope="col" className="px-4 py-3 font-medium">Say it</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Value</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Running total</th>
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
                    Grand total ({shield.words.length} words)
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
                Save this total to Grimoire
              </button>
            </div>
          </div>
        </section>
      ))}

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. The totals are computed from that text at run
        time; the test suite checks all five totals in both systems and both schools.
      </p>
    </ToolsLayout>
  );
};
