import React, { useMemo, useState } from 'react';
import { computeSawaqit, FATIHA_TRANSLITERATION, FATIHA_VERSES, QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE } from '../../data/quranTexts';
import { ABJAD_LETTERS, saghirOf, letterValue } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { ToolsLayout } from './ToolsLayout';

/**
 * The Sawaqit: the seven letters that do not appear in al-Fatiha.
 * The letters are COMPUTED by counting which of the 28 letters appear
 * in the Fatiha text (see computeSawaqit in src/data/quranTexts.ts).
 * The traditional names attached to the seven absent letters are NOT
 * shown with values here: no source has been named for them yet.
 */
export const SawaqitView: React.FC = () => {
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  const { present, absent } = useMemo(() => computeSawaqit(), []);
  // The footer total is the sum of the values shown in the rows above:
  // in Saghir it is the sum of the single-digit values, not the digit
  // reduction of the Kabir total.
  const absentTotal = absent.reduce((sum, entry) => {
    const kabir = letterValue(entry.letter, 'kabir', school) ?? 0;
    return sum + (system === 'kabir' ? kabir : saghirOf(kabir));
  }, 0);

  return (
    <ToolsLayout
      title="Sawaqit (The Seven Absent Letters)"
      eyebrow="Letters & Numbers"
      subtitle="Seven letters of the alphabet do not appear anywhere in al-Fatiha. The letters below are found by counting which letters the Fatiha uses. They are computed from the text, not typed in."
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
        <h2 className="ms-h2">The text counted</h2>
        <p className="ms-body">
          al-Fatiha, Qur&apos;an 1:1–7. The whole surah, including the Basmalah, which is its first
          verse. It has 29 words and 139 letters as written in the Uthmani text. The Latin lines
          under the Arabic read it out, so you can follow it without knowing Arabic.
        </p>
        <div className="ms-arabic ms-ink text-right leading-loose" dir="rtl" lang="ar">
          {FATIHA_VERSES.join(' ')}
        </div>
        <div className="ms-body ms-muted space-y-1" lang="en">
          {FATIHA_TRANSLITERATION.map((verse, index) => (
            <p key={index}>{verse.join(' ')}</p>
          ))}
        </div>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">The 21 letters the Fatiha uses</h2>
        <p className="ms-body">
          In Abjad order. Every other letter of the alphabet appears at least once in the surah.
        </p>
        <div className="flex flex-wrap gap-2" dir="rtl" lang="ar">
          {present.map((letter) => (
            <span key={letter} className="text-center px-3 py-1.5 rounded border border-[var(--ms-line)]">
              <span className="ms-arabic ms-ink block">{letter}</span>
              <span className="ms-muted block text-xs" lang="en">
                {ABJAD_LETTERS.find((entry) => entry.letter === letter)?.name ?? ''}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">Absent letter</th>
              <th scope="col" className="px-4 py-3 font-medium">Name</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {absent.map((entry) => {
              const kabir = letterValue(entry.letter, 'kabir', school) ?? 0;
              const value = system === 'kabir' ? kabir : saghirOf(kabir);
              return (
                <tr key={entry.letter}>
                  <td className="px-4 py-2.5">
                    <span className="ms-arabic ms-ink" dir="rtl" lang="ar">
                      {entry.letter}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 ms-ink">{entry.name}</td>
                  <td className="px-4 py-2.5 text-right font-semibold ms-gold ms-num">{value}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="px-4 py-3 font-medium ms-ink">
                The seven absent letters together
              </td>
              <td className="px-4 py-3 text-right font-bold ms-gold ms-num">
                {absentTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      <p className="ms-body">
        The seven absent letters add up to <span className="font-semibold ms-ink">2,390</span> in Kabir
        Mashriqi and <span className="font-semibold ms-ink">2,990</span> in Kabir Maghribi. The
        difference is the letter Shin: 300 in the eastern table, 1,000 in the western table.
      </p>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Names for the seven letters</h2>
        <p className="ms-body">
          Source needed. The traditional names attached to the seven absent letters are not shown
          here, because no source has been named for them yet. The Inloes translation of Shams
          al-Ma&apos;arif was checked and does not give them. If a named source is supplied, the
          names will be added with that source shown.
        </p>
      </section>

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. The count is computed from that text at run
        time; the test suite checks the result is the seven letters shown above.
      </p>
    </ToolsLayout>
  );
};
