import React, { useState } from 'react';
import {
  ABJAD_LETTERS,
  NORMALIZATION_RULES,
  letterValue,
  saghirOf,
} from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { localizeNormalizationRule, tTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

type ToggleProps = {
  label: string;
  options: { value: string; label: string }[];
  current: string;
  onChange: (value: string) => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, options, current, onChange }) => (
  <div className="space-y-1.5">
    <span className="ms-label">{label}</span>
    <div className="flex gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={current === option.value}
          onClick={() => onChange(option.value)}
          className="ms-toggle"
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

/**
 * The 28 Arabic letters and their Abjad values.
 * The element, luminous/dark and planet mappings have NO named source
 * yet, so they are shown as "source needed" and nothing is invented.
 */
export const HurufView: React.FC = () => {
  const lang = appState.settings.language;
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  return (
    <ToolsLayout
      title={tTools('tools.huruf.title', lang)}
      eyebrow={tTools('tools.huruf.eyebrow', lang)}
      subtitle={tTools('tools.huruf.subtitle', lang)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label={tTools('tools.common.system', lang)}
          options={[
            { value: 'kabir', label: tTools('tools.common.kabir', lang) },
            { value: 'saghir', label: tTools('tools.common.saghir', lang) },
          ]}
          current={system}
          onChange={(value) => setSystem(value as AbjadSystem)}
        />
        <Toggle
          label={tTools('tools.common.school', lang)}
          options={[
            { value: 'mashriqi', label: tTools('tools.common.mashriqi', lang) },
            { value: 'maghribi', label: tTools('tools.common.maghribi', lang) },
          ]}
          current={school}
          onChange={(value) => setSchool(value as AbjadSchool)}
        />
      </div>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.huruf.thLetter', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.huruf.thName', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.huruf.thValue', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {ABJAD_LETTERS.map((entry) => {
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
                  <td className="px-4 py-2.5 text-right font-semibold ms-gold ms-num">
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="ms-note">{tTools('tools.huruf.tableNote', lang)}</p>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.huruf.howCounted', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{localizeNormalizationRule(rule, lang)}</li>
          ))}
        </ul>
      </section>

      <section className="ms-card space-y-4">
        <h2 className="ms-h2">{tTools('tools.huruf.mappingsTitle', lang)}</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="ms-h3">{tTools('tools.huruf.elementGroups', lang)}</h3>
            <p className="ms-body">{tTools('tools.huruf.sourceNeeded', lang)}</p>
          </div>
          <div>
            <h3 className="ms-h3">{tTools('tools.huruf.luminous', lang)}</h3>
            <p className="ms-body">{tTools('tools.huruf.sourceNeeded', lang)}</p>
          </div>
          <div>
            <h3 className="ms-h3">{tTools('tools.huruf.planetLinks', lang)}</h3>
            <p className="ms-body">{tTools('tools.huruf.sourceNeeded', lang)}</p>
          </div>
        </div>
      </section>
    </ToolsLayout>
  );
};
