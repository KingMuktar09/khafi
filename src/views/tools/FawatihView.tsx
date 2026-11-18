import React, { useMemo, useState } from 'react';
import { computeFawatih, QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE, transliterateForm } from '../../data/quranTexts';
import { saghirOf, valueOfText } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { ToolsLayout } from './ToolsLayout';

/**
 * The Fawatih: the 14 disjointed-letter forms that open 29 surahs.
 * The forms are COMPUTED from the opening verse of every surah (see
 * computeFawatih in src/data/quranTexts.ts). They are not typed in.
 * What the letters mean is not said here: no source has been named
 * for an interpretation, so nothing is invented.
 */
export const FawatihView: React.FC = () => {
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  const forms = useMemo(() => computeFawatih(), []);
  const totalSurahs = forms.reduce((sum, form) => sum + form.surahs.length, 0);

  return (
    <ToolsLayout
      title="Fawatih (The Opening Letters)"
      eyebrow="Letters & Numbers"
      subtitle="Fourteen letter forms open twenty-nine surahs. The forms below are found by a rule run over the opening verse of every surah. They are computed from the text, not typed in."
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

      <p className="ms-body">
        <span className="font-semibold ms-ink">{totalSurahs} surahs</span> open with disjointed letters, in{' '}
        <span className="font-semibold ms-ink">{forms.length} distinct forms</span>. Pick a system and a
        school; the values update. The “Say it” column reads each form in Latin letters, so you can
        sound it out without knowing Arabic.
      </p>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">Form</th>
              <th scope="col" className="px-4 py-3 font-medium">Say it</th>
              <th scope="col" className="px-4 py-3 font-medium">Surahs it opens</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => {
              // The form's value is the sum of its letters; a two-word form
              // (Ha Mim, Ayn Sin Qaf) counts both words together.
              const formTotal = valueOfText(form.form, 'kabir', school).total;
              const value = system === 'kabir' ? formTotal : saghirOf(formTotal);
              return (
                <tr key={form.form}>
                  <td className="px-4 py-2.5">
                    <span className="ms-arabic ms-ink" dir="rtl" lang="ar">
                      {form.form}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 ms-ink">{transliterateForm(form.form)}</td>
                  <td className="px-4 py-2.5 ms-ink">
                    {form.surahs.map((surah) => `${surah.number} ${surah.name}`).join(', ')}
                    <span className="ms-muted block text-sm">
                      {form.surahs.map((surah) => surah.meaning).join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold ms-gold ms-num">
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How these were found</h2>
        <p className="ms-body">
          The Qur&apos;an text used here is fully vocalised: every ordinary word carries vowel marks. A
          word with no vowel marks at all stands out at the start of a surah. It may carry only the
          lengthening mark (maddah), or no mark. And it is one to five letters long. The rule is:
          take the first word of each surah&apos;s opening verse (after the Basmalah, where the
          Basmalah is a prefix and not a verse), and keep it only if it is such a bare word. That
          rule finds exactly 29 surahs and 14 forms. Ordinary first words, like “inna” in Surah 71
          or “la” in Surah 75, carry vowel marks and are not picked up. Surah 42 is the one case
          where the letters run over two verses: Ha Mim opens verse 1, and Ayn Sin Qaf is the whole
          of verse 2.
        </p>
        <p className="ms-body">
          The Basmalah is verse 1 of Surah al-Fatiha, so it stays in that surah&apos;s text. For the
          other surahs it is a prefix in the printed text, not a verse, so the rule strips it first.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this page does not say</h2>
        <p className="ms-body">
          This page shows which letters open which surahs and what the letters add up to. It does not
          say what the letters mean. No source has been named for an interpretation yet, so none is
          offered. The forms are shown as they appear at the start of the surahs, nothing more.
        </p>
      </section>

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. The forms and values are computed from that
        text at run time; the test suite checks the result is 29 surahs in 14 forms with the exact
        mapping shown above.
      </p>
    </ToolsLayout>
  );
};
