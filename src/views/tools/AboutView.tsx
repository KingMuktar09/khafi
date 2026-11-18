import React from 'react';
import { ASMA_SOURCE } from '../../data/asmaNames';
import { QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE } from '../../data/quranTexts';
import { ToolsLayout } from './ToolsLayout';

/**
 * About the study-tools section, written from what was actually built:
 * what the tools are, where their numbers come from, what was tested,
 * and what they cannot do. Nothing copied from any other site.
 */
export const AboutView: React.FC = () => {
  return (
    <ToolsLayout
      title="About (The Study Tools)"
      eyebrow="About"
      subtitle="What this section is, where its numbers come from, what was tested, and what it cannot do."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section is</h2>
        <p className="ms-body">
          A set of small tools for studying letters, numbers, time and your own reading notes. They
          add up letter values, work out the facts of the day, build and check magic squares, and
          keep notes you choose to save. They are for study and calculation only. They do not
          promise any outcome, protection, healing or provision, and they give no religious rulings.
          Never use them to harm anyone.
        </p>
        <p className="ms-body">
          Everything here runs in your browser. Your notes, counts and saved items stay on this
          device. Nothing is sent anywhere. The library and these tools sit behind the follow gate:
          they open when you tap “I followed” or enter the key from the Ghayb Chronicles broadcast
          channel. The site itself is free; there is no payment anywhere.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What is built</h2>
        <p className="ms-body">
          Nineteen tools are built and working. The rest of the cards on the hub are shells: they hold
          only content supplied with its source and page, so they stay empty until that arrives.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">Letters &amp; numbers: </span>
            Huruf (the 28 letters and their values), Asma (the 99 Names), Bast (unfold any text),
            Fawatih (the 14 opening-letter forms across 29 surahs), Sawaqit (the seven letters
            absent from al-Fatiha), Shields (running letter sums for five short texts).
          </li>
          <li>
            <span className="font-medium ms-ink">Time &amp; sky: </span>
            Today, Planetary Hours, Moon, Lunar Mansions, Falak (the twelve signs), Majlis (the
            facts of the moment).
          </li>
          <li>
            <span className="font-medium ms-ink">Squares: </span>
            Wafq Forge (build a magic square) and Qawa&apos;id (the rules of the squares).
          </li>
          <li>
            <span className="font-medium ms-ink">Notes &amp; memory: </span>
            Journal (reading notes), Wird (a remembrance counter), Grimoire (saved items).
          </li>
          <li>
            <span className="font-medium ms-ink">This section itself: </span>
            Method (how the tools work) and this About page.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What is not built</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>No AI teacher. Questions about the material are for a person, not this section.</li>
          <li>
            Nothing that harms, compels or binds anyone. The tools index only; they never build
            workings aimed at a person.
          </li>
          <li>No incense recipes with quantities, and no preparation instructions of any kind.</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Data sources</h2>
        <ul className="list-disc pl-5 space-y-2 ms-body">
          <li>
            <span className="font-medium ms-ink">Abjad table: </span>
            standard Abjad values (mashriqi/maghribi), checked against Wikipedia’s “Abjad numerals”
            and the OpenArabic and WiserWork abjad calculators. The two schools agree on 22 letters
            and differ on six (sad, dad, sin, shin, za, ghayn). Kabir is the full value of each
            letter; Saghir is the same value reduced to a single digit.
          </li>
          <li>
            <span className="font-medium ms-ink">Qur&apos;anic text: </span>
            {QURAN_TEXT_SOURCE}. The Fawatih forms, the Sawaqit letters and the Shields totals are
            computed from that text at run time, not typed in. The text is used under the Tanzil
            terms: verbatim copies, source named, link to tanzil.net. Surah names and meanings come
            from the AlQuranCloud surah list, checked 18 Nov 2026.
          </li>
          <li>
            <span className="font-medium ms-ink">Transliteration: </span>
            {TRANSLITERATION_SOURCE}. The Latin reading of the Arabic on the Fawatih, Sawaqit and
            Shields pages comes from the same project. It is used for non-commercial use with a link
            back, as the terms ask. Every verse was checked word by word against the Arabic.
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
        <h2 className="ms-h2">Conventions chosen</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">Two schools, two systems: </span>
            Mashriqi (eastern) and Maghribi (western) letter tables; Kabir (full value) and Saghir
            (each letter reduced to a single digit, then added). The pages let you switch, and the
            numbers update.
          </li>
          <li>
            <span className="font-medium ms-ink">Counting rules: </span>
            one shared normalisation routine for all letter counting. Unicode NFC, hamza forms
            unified, ta marbuta read as ha, alif maqsura read as ya, a shadda doubling its letter
            (except where the letter is already written twice, as in Allah). The Uthmani spelling
            counts as written, so al-Rahman is 529 in the Shields and 329 in its plain spelling.
          </li>
          <li>
            <span className="font-medium ms-ink">Planetary hours: </span>
            unequal hours. The day runs sunrise to sunset, the night sunset to next sunrise. With
            no location set, the hours fall back to a fixed 06:00–18:00 split, labelled clearly as
            approximate. Where the Sun does not rise or set, the hours are shown as unavailable.
          </li>
          <li>
            <span className="font-medium ms-ink">Hijri date: </span>
            the Islamic civil calendar (Intl, Kuwaiti algorithm). It is approximate: real months
            depend on moon sighting and can differ by a day or two.
          </li>
          <li>
            <span className="font-medium ms-ink">Lunar mansions: </span>
            28 equal parts of about 12.857°, starting at 0° with al-Sharatayn. That is a convention,
            not a universal fact. Other traditions start the count elsewhere, and the Mansions page
            lets you move the start point.
          </li>
          <li>
            <span className="font-medium ms-ink">The twelve signs: </span>
            the tropical zodiac, measured from the March equinox, so the signs no longer line up with
            the constellations of the same names.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What was tested</h2>
        <p className="ms-body">
          The whole site is covered by automated tests. The full suite is green, and it runs before
          every change is shipped. The tests that matter for this section:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">Abjad arithmetic: </span>
            letter values in both schools and both systems, normalisation (hamza forms, shadda,
            tatweel, decomposed letters), and text totals, including the plain checks “Allah 66”
            and “bism Allah 168”.
          </li>
          <li>
            <span className="font-medium ms-ink">Qur&apos;anic text: </span>
            verse counts for the five shield texts, Unicode NFC form of every stored string, the
            Basmalah kept in al-Fatiha and stripped from the other three surahs, the Fawatih rule
            finding exactly 29 surahs in 14 forms with the exact mapping, the seven Sawaqit letters,
            and all five Shields totals in both systems and both schools. The expected numbers were
            worked out independently against the source text, not from the code under test. The
            transliteration is checked the same way: every verse matches its Arabic verse word for
            word (137 words), and the 114:6 fix is pinned in the test.
          </li>
          <li>
            <span className="font-medium ms-ink">Time and squares: </span>
            planetary hours (including midnight and polar cases), moon and mansion boundaries, and
            square generation plus the separate validator (known constants, shifted sums, and cases
            that must be refused).
          </li>
          <li>
            <span className="font-medium ms-ink">Storage and wiring: </span>
            journal, wird and grimoire save/load round-trips, export/import of valid JSON, bad files
            rejected without wiping existing data, and every tool in the hub having a matching route,
            URL and page.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Known limits</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            The Fawatih page does not say what the opening letters mean: no source has been named
            for an interpretation yet.
          </li>
          <li>
            The Sawaqit page does not give the traditional names attached to the seven absent
            letters: no source has been named for them yet. The Inloes translation of Shams
            al-Ma&apos;arif was checked and does not give them.
          </li>
          <li>
            Element groups, luminous and dark letters, and letter-to-planet links are not shown
            anywhere: no source has been named for those mappings yet, so nothing is guessed.
          </li>
          <li>
            The Maghribi values come from the table’s named sources: six letters differ from the
            Mashriqi values, the other 22 agree.
          </li>
          <li>
            The Hijri date shown on the Today page is approximate. It is the calculated (civil)
            date, which can differ from the moon-sighting date by a day or two.
          </li>
          <li>There are no prayer times here.</li>
          <li>
            Notes, counts and saved items live only on this device. Clearing this browser’s site
            data, or moving to another device, loses them unless you exported a JSON backup first.
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Who made this</h2>
        <p className="ms-body">
          The Study Tools are part of the Ilm-e-Ghayb Library, from Ghayb Chronicles
          (@ghayb.chronicles). Islamic esoteric knowledge, mysticism and Sufi wisdom, with sources
          in every caption. The library is free; the tools and the books sit behind the follow gate
          for followers of the channel.
        </p>
      </section>
    </ToolsLayout>
  );
};
