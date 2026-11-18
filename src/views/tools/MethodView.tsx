import React from 'react';
import { ASMA_SOURCE } from '../../data/asmaNames';
import { NORMALIZATION_RULES } from '../../utils/abjad';
import { ToolsLayout } from './ToolsLayout';

/**
 * How these tools work: where the numbers come from, how letters are
 * counted, what was tested, and what the tools cannot do.
 * Plain words; nothing copied from any other site.
 */
export const MethodView: React.FC = () => {
  return (
    <ToolsLayout
      title="Method — How These Tools Work"
      subtitle="Where the numbers come from, how letters are counted, what was tested, and the limits of these tools."
    >
      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">What these tools do</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          These tools are for study and calculation only. They add up letter values, keep reading notes,
          count taps, and save items you choose to keep. They do not promise any outcome, protection,
          healing or provision, and they give no religious rulings. Never use them to harm anyone.
        </p>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Data sources</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
          <li>
            <span className="font-medium text-[var(--text-main)]">Abjad table: </span>
            standard Abjad values (mashriqi/maghribi), checked against Wikipedia’s “Abjad numerals” and
            the OpenArabic and WiserWork abjad calculators. The two schools agree on 22 letters and differ
            on six (sad, dad, sin, shin, za, ghayn). Kabir is the full value of each letter; Saghir is the
            same value reduced to a single digit.
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">The 99 Names: </span>
            {ASMA_SOURCE}
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">Your notes, counts and saved items: </span>
            written by you, kept in this device’s storage only. Nothing is sent anywhere.
          </li>
        </ul>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">How letters are counted</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Before any counting, the text is normalised — cleaned up into a standard form — so the same
          letter written in different ways is counted once. The rules used are:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          A name’s “bare” value counts the name without “al-”; the “with al-” value counts it with “al-”
          added. Both use the same Abjad table, in the system and school you pick.
        </p>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">What was tested</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          <li>
            Storage helpers: 10 automated tests pass — journal, wird and grimoire save/load round-trips,
            export/import of valid JSON, and bad files being rejected without wiping existing data.
          </li>
          <li>
            The Abjad arithmetic itself (letter values, Kabir/Saghir, text totals) is tested by the
            team that owns the Abjad table, not here.
          </li>
        </ul>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Known limits</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-muted)] leading-relaxed">
          <li>
            Element groups, luminous and dark letters, and letter-to-planet links are not shown anywhere:
            no source has been named for those mappings yet, so nothing is guessed.
          </li>
          <li>
            The Maghribi values come from the table’s named sources (Wikipedia’s “Abjad numerals”,
            OpenArabic, WiserWork): six letters differ from the Mashriqi values, the other 22 agree.
          </li>
          <li>
            There are no astronomy or time tools yet — planetary hours, the moon and mansions, and the sky
            come in Phase 2. There are no prayer times here.
          </li>
          <li>
            Notes, counts and saved items live only on this device. Clearing this browser’s site data, or
            moving to another device, loses them unless you exported a JSON backup first.
          </li>
          <li>
            The Hijri date is not shown by these tools. Any date shown elsewhere in the library is the
            calculated (tabular) date, which can differ from the moon-sighting date by a day or two.
          </li>
        </ul>
      </section>
    </ToolsLayout>
  );
};
