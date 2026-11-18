import React, { useState } from 'react';
import {
  ABJAD_LETTERS,
  NORMALIZATION_RULES,
  letterValue,
  saghirOf,
} from '../../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../../utils/abjad';
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
  const [system, setSystem] = useState<AbjadSystem>('kabir');
  const [school, setSchool] = useState<AbjadSchool>('mashriqi');

  return (
    <ToolsLayout
      title="Huruf — Letters & Numbers"
      eyebrow="Letters & Numbers"
      subtitle="The 28 Arabic letters and their Abjad values. Pick a system and a school; the table updates."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="System"
          options={[
            { value: 'kabir', label: 'Kabir (large)' },
            { value: 'saghir', label: 'Saghir (small)' },
          ]}
          current={system}
          onChange={(value) => setSystem(value as AbjadSystem)}
        />
        <Toggle
          label="School"
          options={[
            { value: 'mashriqi', label: 'Mashriqi (eastern)' },
            { value: 'maghribi', label: 'Maghribi (western)' },
          ]}
          current={school}
          onChange={(value) => setSchool(value as AbjadSchool)}
        />
      </div>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">Letter</th>
              <th scope="col" className="px-4 py-3 font-medium">Name</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Value</th>
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

      <p className="ms-note">
        Table: standard Abjad values (mashriqi/maghribi). Kabir is the full value; Saghir is the same value
        reduced to a single digit. Values checked against Wikipedia’s “Abjad numerals” and the OpenArabic
        and WiserWork abjad calculators — the two schools agree on 22 letters and differ on six
        (sad, dad, sin, shin, za, ghayn).
      </p>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How letters are counted</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="ms-card space-y-4">
        <h2 className="ms-h2">Mappings we do not show yet</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="ms-h3">Element groups</h3>
            <p className="ms-body">Source needed — no source has been named for this mapping yet.</p>
          </div>
          <div>
            <h3 className="ms-h3">Luminous and dark letters</h3>
            <p className="ms-body">Source needed — no source has been named for this mapping yet.</p>
          </div>
          <div>
            <h3 className="ms-h3">Letter-to-planet links</h3>
            <p className="ms-body">Source needed — no source has been named for this mapping yet.</p>
          </div>
        </div>
      </section>
    </ToolsLayout>
  );
};
