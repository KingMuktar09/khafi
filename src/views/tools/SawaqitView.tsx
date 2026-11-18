import React, { useMemo, useState } from 'react';
import { computeSawaqit, FATIHA_TRANSLITERATION, FATIHA_VERSES, QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE } from '../../data/quranTexts';
import { ABJAD_LETTERS, saghirOf, letterValue } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { ToolsLayout } from './ToolsLayout';

/**
 * The Sawaqit: the seven letters that do not appear in al-Fatiha.
 * The letters are COMPUTED by counting which of the 28 letters appear
 * in the Fatiha text (see computeSawaqit in src/data/quranTexts.ts).
 * The traditional names attached to the seven absent letters ARE shown
 * below, with their source: John Friend Shams, Ch. 13.
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
          The books give a Name of God for each absent letter. The seven names, in the order the
          books give them, are Fa, Jim, Shin, Tha, Za, Kha, Zay. Remember them by the first
          sounds: Fa-Ja-Sha-Tha-Za-Kha-Za. The two letters that sound like &ldquo;z&rdquo; are
          different letters: Za&rsquo; (ظ) and Zay (ز).
        </p>
        <div className="ms-surface ms-table-wrap">
          <table className="ms-table">
            <thead>
              <tr className="text-left">
                <th scope="col" className="px-4 py-3 font-medium">Letter</th>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Also given as</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ف</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الفرد</span> al-Fard, the Unique, the Singular</td>
                <td className="px-4 py-2.5 ms-ink">al-Fatir</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ج</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الجبار</span> al-Jabbar, the Compeller, the Restorer</td>
                <td className="px-4 py-2.5 ms-ink">al-Jalil (جليل)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ش</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الشهيد</span> al-Shahid, the Witness</td>
                <td className="px-4 py-2.5 ms-ink">al-Shakur (شكور)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ث</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الثابت</span> al-Thabit, the Firm, the Constant</td>
                <td className="px-4 py-2.5 ms-ink">al-Ba&rsquo;ith (باعث), al-Warith (وارث)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ظ</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الظاهر</span> al-Zahir, the Manifest, the Helper</td>
                <td className="px-4 py-2.5 ms-ink">al-Zahir, pp. 88-89</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">خ</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الخبير</span> al-Khabir, the All-Aware</td>
                <td className="px-4 py-2.5 ms-ink">al-Khayyar, al-Khayr</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5"><span className="ms-arabic ms-ink" dir="rtl" lang="ar">ز</span></td>
                <td className="px-4 py-2.5 ms-ink"><span className="ms-arabic" dir="rtl" lang="ar">الزكي</span> al-Zaki, the Pure</td>
                <td className="px-4 py-2.5 ms-ink">al-&rsquo;Aziz (عزيز)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="ms-body">
          Source: John Friend, Shams al-Ma&rsquo;arif al-Kubra, Ch. 13, &ldquo;On the Omitted Letters
          of the Fatiha and What Belongs to Them of Magic Squares and Invocations&rdquo;, section
          &ldquo;The Seven Wafqs of the Omitted Letters of al-Fatiha&rdquo;. Cross-check: Suns of Lights, p. 75, gives the same sequence, Fard, Jabbar, Shakur, Thabit, Zahir, Khabir, Zaki, with the seven planetary days.
        </p>
      </section>

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. The count is computed from that text at run
        time; the test suite checks the result is the seven letters shown above.
      </p>
    </ToolsLayout>
  );
};
