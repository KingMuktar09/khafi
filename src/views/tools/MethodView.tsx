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
      eyebrow="How It Works"
      subtitle="Where the numbers come from, how letters are counted, what was tested, and the limits of these tools."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What these tools do</h2>
        <p className="ms-body">
          These tools are for study and calculation only. They add up letter values, keep reading notes,
          count taps, and save items you choose to keep. They do not promise any outcome, protection,
          healing or provision, and they give no religious rulings. Never use them to harm anyone.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Data sources</h2>
        <ul className="list-disc pl-5 space-y-2 ms-body">
          <li>
            <span className="font-medium ms-ink">Abjad table: </span>
            standard Abjad values (mashriqi/maghribi), checked against Wikipedia’s “Abjad numerals” and
            the OpenArabic and WiserWork abjad calculators. The two schools agree on 22 letters and differ
            on six (sad, dad, sin, shin, za, ghayn). Kabir is the full value of each letter; Saghir is the
            same value reduced to a single digit.
          </li>
          <li>
            <span className="font-medium ms-ink">The 99 Names: </span>
            {ASMA_SOURCE}
          </li>
          <li>
            <span className="font-medium ms-ink">Astronomy and time: </span>
            the maintained Astronomy Engine library (astronomy-engine) works out sunrise, sunset,
            the Moon&apos;s phase and longitude, and the Sun&apos;s longitude. No astronomy formulas
            are hand-written here.
          </li>
          <li>
            <span className="font-medium ms-ink">Lunar mansions: </span>
            Wikipedia, “Lunar mansion” (the manazil al-qamar table, 28 stations starting with
            al-Sharatayn at 0°), checked 18 Nov 2026.
          </li>
          <li>
            <span className="font-medium ms-ink">The twelve signs: </span>
            Wikipedia, “Astrological sign” (the Western zodiac table, tropical signs and element
            triplicities), checked 18 Nov 2026.
          </li>
          <li>
            <span className="font-medium ms-ink">Planets and day rulers: </span>
            Wikipedia, “Planetary hours” (Chaldean order and which planet rules each weekday).
            Arabic planet names: Wiktionary, “Appendix:Planets”, and the al-Biruni list quoted there.
          </li>
          <li>
            <span className="font-medium ms-ink">Magic squares: </span>
            Wikipedia, “Magic square” and “Conway&apos;s LUX method for magic squares”
            (constructions checked 18 Nov 2026).
          </li>
          <li>
            <span className="font-medium ms-ink">Your notes, counts and saved items: </span>
            written by you, kept in this device’s storage only. Nothing is sent anywhere.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How time is worked out (Phase 2)</h2>
        <p className="ms-body">
          Planetary hours are unequal. The day starts at sunrise: the 12 day hours divide sunrise
          to sunset into 12 equal parts, and the 12 night hours divide sunset to next sunrise into
          12 equal parts. An instant before sunrise belongs to the previous day, whose ruler still
          applies. The first hour of a day is ruled by that day&apos;s planet, and after that the
          rulers cycle in Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">Library: </span>
            Astronomy Engine (astronomy-engine), a maintained astronomy library. Time zones are
            handled with Intl and the place&apos;s IANA zone, so daylight saving is followed. No
            external geocoding or timezone service is used.
          </li>
          <li>
            <span className="font-medium ms-ink">No location set: </span>
            the hours fall back to a fixed 06:00–18:00 split, labelled clearly as “approximate,
            not real hours”.
          </li>
          <li>
            <span className="font-medium ms-ink">Polar day or night: </span>
            where the Sun does not rise or set, the hours are shown as unavailable with the reason
            — they are never invented.
          </li>
          <li>
            <span className="font-medium ms-ink">Location: </span>
            picked from a bundled city list, typed as a latitude and longitude, or shared from the
            browser — on this device only, never sent anywhere.
          </li>
          <li>
            <span className="font-medium ms-ink">Hijri date: </span>
            the Islamic civil calendar (Intl, Kuwaiti algorithm). It is approximate: real months
            depend on moon sighting and can differ by a day or two.
          </li>
          <li>
            <span className="font-medium ms-ink">Lunar mansions: </span>
            28 equal parts of about 12.857°, starting at 0° with al-Sharatayn. That is a
            convention, not a universal fact — other traditions start the count elsewhere, and the
            Mansions page lets you move the start point. The Moon&apos;s position comes from the
            Astronomy Engine.
          </li>
          <li>
            <span className="font-medium ms-ink">The twelve signs: </span>
            the tropical zodiac, measured from the March equinox, so the signs no longer line up
            with the constellations of the same names. The date ranges are approximate and shift
            slightly year to year.
          </li>
          <li>
            <span className="font-medium ms-ink">Moon phase and lunar day: </span>
            from the Astronomy Engine; the lunar day is the phase angle&apos;s share of a
            29.53-day month, counted from 1.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How the squares are built and checked (Phase 3)</h2>
        <p className="ms-body">
          The Wafq Forge builds a base square holding the numbers 1 to n squared, then shifts every
          cell by the same whole number to reach the target sum. Which construction is used depends
          on the order type: the Siamese method (de la Loubère) for odd orders, the complement
          method for doubly even orders (divisible by 4), and the LUX method (Conway) for singly
          even orders (even but not divisible by 4). Orders 3 to 20 are supported. The full rules
          are on the Qawa&apos;id page.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">Reachability rule: </span>
            a target can be reached exactly when it differs from the base constant by a multiple of
            the order, and the shift is not negative. Otherwise the Forge refuses in plain words —
            it never rounds, patches a cell, or repeats a number to force a result.
          </li>
          <li>
            <span className="font-medium ms-ink">Separate validator: </span>
            the checker is separate code from the generator. It adds up the grid it is given —
            every row, every column, both diagonals — and checks that every cell is a different
            positive whole number. It works on hand-made grids too. The result is shown as PASS or
            FAIL, with every line sum listed.
          </li>
          <li>
            <span className="font-medium ms-ink">Export and print: </span>
            the framed SVG download and the A2 plate print open only after the square passes
            validation.
          </li>
          <li>
            <span className="font-medium ms-ink">Modes not built: </span>
            multiplied, cycling, hollow-centre and “grand wafq” squares are listed as “source
            needed” — no rule and worked example has been supplied for them, so they are not
            guessed at.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How letters are counted</h2>
        <p className="ms-body">
          Before any counting, the text is normalised — cleaned up into a standard form — so the same
          letter written in different ways is counted once. The rules used are:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="ms-body">
          A name’s “bare” value counts the name without “al-”; the “with al-” value counts it with “al-”
          added. Both use the same Abjad table, in the system and school you pick.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What was tested</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            Storage helpers: 10 automated tests pass — journal, wird and grimoire save/load round-trips,
            export/import of valid JSON, and bad files being rejected without wiping existing data.
          </li>
          <li>
            The Abjad arithmetic itself (letter values, Kabir/Saghir, text totals) is tested by the
            team that owns the Abjad table, not here.
          </li>
          <li>
            Time and squares are tested by their own suites: planetary hours (including midnight
            and polar cases), moon and mansion boundaries, and square generation plus the separate
            validator (known constants, shifted sums, and cases that must be refused).
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Known limits</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            Element groups, luminous and dark letters, and letter-to-planet links are not shown anywhere:
            no source has been named for those mappings yet, so nothing is guessed.
          </li>
          <li>
            The Maghribi values come from the table’s named sources (Wikipedia’s “Abjad numerals”,
            OpenArabic, WiserWork): six letters differ from the Mashriqi values, the other 22 agree.
          </li>
          <li>
            The Hijri date shown on the Today page is approximate — it is the calculated (civil)
            date, which can differ from the moon-sighting date by a day or two.
          </li>
          <li>There are no prayer times here.</li>
          <li>
            Notes, counts and saved items live only on this device. Clearing this browser’s site data, or
            moving to another device, loses them unless you exported a JSON backup first.
          </li>
        </ul>
      </section>
    </ToolsLayout>
  );
};
