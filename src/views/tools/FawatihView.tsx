import React, { useMemo, useState } from 'react';
import { computeFawatih, QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE, transliterateForm } from '../../data/quranTexts';
import { saghirOf, valueOfText } from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * The Fawatih: the 14 disjointed-letter forms that open 29 surahs.
 * The forms are COMPUTED from the opening verse of every surah (see
 * computeFawatih in src/data/quranTexts.ts). They are not typed in.
 * What the letters mean is not said here: no source has been named
 * for an interpretation, so nothing is invented.
 */
export const FawatihView: React.FC = () => {
  const lang = appState.settings.language;
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  const forms = useMemo(() => computeFawatih(), []);
  const totalSurahs = forms.reduce((sum, form) => sum + form.surahs.length, 0);

  return (
    <ToolsLayout
      title={tTools('tools.fawatih.title', lang)}
      eyebrow={tTools('tools.fawatih.eyebrow', lang)}
      subtitle={tTools('tools.fawatih.subtitle', lang)}
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

      <p className="ms-body">
        {tfTools('tools.fawatih.summary', lang, { total: totalSurahs, forms: forms.length })}
      </p>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.fawatih.thForm', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.fawatih.thSayIt', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.fawatih.thSurahs', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.fawatih.thValue', lang)}</th>
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
        <h2 className="ms-h2">{tTools('tools.fawatih.howFound', lang)}</h2>
        <p className="ms-body">{tTools('tools.fawatih.howFoundBody', lang)}</p>
        <p className="ms-body">{tTools('tools.fawatih.basmalahBody', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.fawatih.notSay', lang)}</h2>
        <p className="ms-body">{tTools('tools.fawatih.notSayBody', lang)}</p>
      </section>

      <p className="ms-note">
        {QURAN_TEXT_SOURCE}. {TRANSLITERATION_SOURCE}. {tTools('tools.fawatih.sourceTail', lang)}
      </p>
    </ToolsLayout>
  );
};
