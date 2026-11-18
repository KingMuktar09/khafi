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
    <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
    <div className="flex gap-2" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={current === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 min-h-11 px-3 rounded-xl border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
            current === option.value
              ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)]'
              : 'bg-[var(--bg-surface)] border-[var(--border-main)] text-[var(--text-muted)]'
          }`}
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

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-main)] text-left text-[var(--text-muted)]">
              <th scope="col" className="px-4 py-3 font-medium">Letter</th>
              <th scope="col" className="px-4 py-3 font-medium">Name</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {ABJAD_LETTERS.map((entry) => {
              const kabir = letterValue(entry.letter, 'kabir', school) ?? 0;
              const value = system === 'kabir' ? kabir : saghirOf(kabir);
              return (
                <tr key={entry.letter}>
                  <td className="px-4 py-2.5">
                    <span className="font-arabic text-2xl text-[var(--text-main)]" dir="rtl" lang="ar">
                      {entry.letter}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-main)]">{entry.name}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-[var(--gold)] tabular-nums">
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-[var(--text-muted)]">
        Table: standard Abjad values (mashriqi/maghribi). Kabir is the full value; Saghir is the same value
        reduced to a single digit. Values checked against Wikipedia’s “Abjad numerals” and the OpenArabic
        and WiserWork abjad calculators — the two schools agree on 22 letters and differ on six
        (sad, dad, sin, shin, za, ghayn).
      </p>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">How letters are counted</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Mappings we do not show yet</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="font-medium text-[var(--text-main)]">Element groups</h3>
            <p className="text-[var(--text-muted)]">Source needed — no source has been named for this mapping yet.</p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-main)]">Luminous and dark letters</h3>
            <p className="text-[var(--text-muted)]">Source needed — no source has been named for this mapping yet.</p>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-main)]">Letter-to-planet links</h3>
            <p className="text-[var(--text-muted)]">Source needed — no source has been named for this mapping yet.</p>
          </div>
        </div>
      </section>
    </ToolsLayout>
  );
};
