// The 99 Names (al-Asma ul-Husna).
//
// Source: the traditional enumeration of the 99 Names as transmitted in the
// hadith collections, commonly cited from Jami` at-Tirmidhi (no. 3507).
// Arabic spellings verified 18 Nov 2026 against the full list at
// https://openarabic.org/99-names-of-allah/ (which gives the same order and
// spellings, and notes the enumeration comes from the narration recorded by
// at-Tirmidhi), cross-checked against https://www.mizaan.org/99-names-of-allah
// and https://getlivingquran.com/names-of-allah, which follow the same
// Tirmidhi order.
//
// Note worth showing to users: the hadith affirms that there are ninety-nine
// names; the list itself comes from the at-Tirmidhi narration, and scholars
// have long noted slightly different lists circulate. Allah's own name is
// not counted among the ninety-nine here; the list runs from Ar-Rahman to
// As-Sabur.
//
// Arabic is stored WITHOUT diacritics (plain letters only). Values are
// computed at runtime from the abjad table, never hardcoded.

import { valueOfText } from '../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../utils/abjad';

export interface AsmaName {
  /** Name with the article, e.g. الرحمن. */
  arabic: string;
  /** Name without the article, e.g. رحمن. */
  bare: string;
  transliteration: string;
  /** One short plain-English gloss. */
  meaning: string;
}

export const ASMA_SOURCE =
  'The traditional enumeration of the 99 Names as transmitted in the hadith collections, commonly cited from Jami` at-Tirmidhi (no. 3507)';

export const ASMA_NAMES: AsmaName[] = [
  { arabic: 'الرحمن', bare: 'رحمن', transliteration: 'Ar-Rahman', meaning: 'The Most Gracious' },
  { arabic: 'الرحيم', bare: 'رحيم', transliteration: 'Ar-Rahim', meaning: 'The Most Merciful' },
  { arabic: 'الملك', bare: 'ملك', transliteration: 'Al-Malik', meaning: 'The King' },
  { arabic: 'القدوس', bare: 'قدوس', transliteration: 'Al-Quddus', meaning: 'The Most Holy' },
  { arabic: 'السلام', bare: 'سلام', transliteration: 'As-Salam', meaning: 'The Source of Peace' },
  { arabic: 'المؤمن', bare: 'مؤمن', transliteration: 'Al-Mumin', meaning: 'The Giver of Security' },
  { arabic: 'المهيمن', bare: 'مهيمن', transliteration: 'Al-Muhaymin', meaning: 'The Guardian over All' },
  { arabic: 'العزيز', bare: 'عزيز', transliteration: 'Al-Aziz', meaning: 'The Mighty' },
  { arabic: 'الجبار', bare: 'جبار', transliteration: 'Al-Jabbar', meaning: 'The Compeller' },
  { arabic: 'المتكبر', bare: 'متكبر', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme in Greatness' },
  { arabic: 'الخالق', bare: 'خالق', transliteration: 'Al-Khaliq', meaning: 'The Creator' },
  { arabic: 'البارئ', bare: 'بارئ', transliteration: 'Al-Bari', meaning: 'The Maker' },
  { arabic: 'المصور', bare: 'مصور', transliteration: 'Al-Musawwir', meaning: 'The Fashioner of Forms' },
  { arabic: 'الغفار', bare: 'غفار', transliteration: 'Al-Ghaffar', meaning: 'The Repeatedly Forgiving' },
  { arabic: 'القهار', bare: 'قهار', transliteration: 'Al-Qahhar', meaning: 'The Subduer' },
  { arabic: 'الوهاب', bare: 'وهاب', transliteration: 'Al-Wahhab', meaning: 'The Bestower' },
  { arabic: 'الرزاق', bare: 'رزاق', transliteration: 'Ar-Razzaq', meaning: 'The Provider' },
  { arabic: 'الفتاح', bare: 'فتاح', transliteration: 'Al-Fattah', meaning: 'The Opener' },
  { arabic: 'العليم', bare: 'عليم', transliteration: 'Al-Alim', meaning: 'The All-Knowing' },
  { arabic: 'القابض', bare: 'قابض', transliteration: 'Al-Qabid', meaning: 'The Withholder' },
  { arabic: 'الباسط', bare: 'باسط', transliteration: 'Al-Basit', meaning: 'The Extender' },
  { arabic: 'الخافض', bare: 'خافض', transliteration: 'Al-Khafid', meaning: 'The One Who Lowers' },
  { arabic: 'الرافع', bare: 'رافع', transliteration: 'Ar-Rafi', meaning: 'The One Who Raises' },
  { arabic: 'المعز', bare: 'معز', transliteration: 'Al-Muizz', meaning: 'The Giver of Honour' },
  { arabic: 'المذل', bare: 'مذل', transliteration: 'Al-Mudhill', meaning: 'The Giver of Dishonour' },
  { arabic: 'السميع', bare: 'سميع', transliteration: 'As-Sami', meaning: 'The All-Hearing' },
  { arabic: 'البصير', bare: 'بصير', transliteration: 'Al-Basir', meaning: 'The All-Seeing' },
  { arabic: 'الحكم', bare: 'حكم', transliteration: 'Al-Hakam', meaning: 'The Judge' },
  { arabic: 'العدل', bare: 'عدل', transliteration: 'Al-Adl', meaning: 'The Utterly Just' },
  { arabic: 'اللطيف', bare: 'لطيف', transliteration: 'Al-Latif', meaning: 'The Subtle and Kind' },
  { arabic: 'الخبير', bare: 'خبير', transliteration: 'Al-Khabir', meaning: 'The All-Aware' },
  { arabic: 'الحليم', bare: 'حليم', transliteration: 'Al-Halim', meaning: 'The Forbearing' },
  { arabic: 'العظيم', bare: 'عظيم', transliteration: 'Al-Azim', meaning: 'The Magnificent' },
  { arabic: 'الغفور', bare: 'غفور', transliteration: 'Al-Ghafur', meaning: 'The All-Forgiving' },
  { arabic: 'الشكور', bare: 'شكور', transliteration: 'Ash-Shakur', meaning: 'The Most Appreciative' },
  { arabic: 'العلي', bare: 'علي', transliteration: 'Al-Ali', meaning: 'The Most High' },
  { arabic: 'الكبير', bare: 'كبير', transliteration: 'Al-Kabir', meaning: 'The Most Great' },
  { arabic: 'الحفيظ', bare: 'حفيظ', transliteration: 'Al-Hafiz', meaning: 'The Preserver' },
  { arabic: 'المقيت', bare: 'مقيت', transliteration: 'Al-Muqit', meaning: 'The Nourisher' },
  { arabic: 'الحسيب', bare: 'حسيب', transliteration: 'Al-Hasib', meaning: 'The Reckoner' },
  { arabic: 'الجليل', bare: 'جليل', transliteration: 'Al-Jalil', meaning: 'The Majestic' },
  { arabic: 'الكريم', bare: 'كريم', transliteration: 'Al-Karim', meaning: 'The Most Generous' },
  { arabic: 'الرقيب', bare: 'رقيب', transliteration: 'Ar-Raqib', meaning: 'The Watchful' },
  { arabic: 'المجيب', bare: 'مجيب', transliteration: 'Al-Mujib', meaning: 'The Answerer of Prayer' },
  { arabic: 'الواسع', bare: 'واسع', transliteration: 'Al-Wasi', meaning: 'The All-Encompassing' },
  { arabic: 'الحكيم', bare: 'حكيم', transliteration: 'Al-Hakim', meaning: 'The All-Wise' },
  { arabic: 'الودود', bare: 'ودود', transliteration: 'Al-Wadud', meaning: 'The Most Loving' },
  { arabic: 'المجيد', bare: 'مجيد', transliteration: 'Al-Majid', meaning: 'The All-Glorious' },
  { arabic: 'الباعث', bare: 'باعث', transliteration: 'Al-Baith', meaning: 'The Resurrector' },
  { arabic: 'الشهيد', bare: 'شهيد', transliteration: 'Ash-Shahid', meaning: 'The Witness' },
  { arabic: 'الحق', bare: 'حق', transliteration: 'Al-Haqq', meaning: 'The Truth' },
  { arabic: 'الوكيل', bare: 'وكيل', transliteration: 'Al-Wakil', meaning: 'The Trustee' },
  { arabic: 'القوي', bare: 'قوي', transliteration: 'Al-Qawi', meaning: 'The All-Strong' },
  { arabic: 'المتين', bare: 'متين', transliteration: 'Al-Matin', meaning: 'The Firm' },
  { arabic: 'الولي', bare: 'ولي', transliteration: 'Al-Wali', meaning: 'The Protecting Friend' },
  { arabic: 'الحميد', bare: 'حميد', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy' },
  { arabic: 'المحصي', bare: 'محصي', transliteration: 'Al-Muhsi', meaning: 'The One Who Counts All Things' },
  { arabic: 'المبدئ', bare: 'مبدئ', transliteration: 'Al-Mubdi', meaning: 'The Originator of Creation' },
  { arabic: 'المعيد', bare: 'معيد', transliteration: 'Al-Muid', meaning: 'The Restorer' },
  { arabic: 'المحيي', bare: 'محيي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life' },
  { arabic: 'المميت', bare: 'مميت', transliteration: 'Al-Mumit', meaning: 'The Bringer of Death' },
  { arabic: 'الحي', bare: 'حي', transliteration: 'Al-Hayy', meaning: 'The Ever-Living' },
  { arabic: 'القيوم', bare: 'قيوم', transliteration: 'Al-Qayyum', meaning: 'The Self-Subsisting' },
  { arabic: 'الواجد', bare: 'واجد', transliteration: 'Al-Wajid', meaning: 'The Finder' },
  { arabic: 'الماجد', bare: 'ماجد', transliteration: 'Al-Majid', meaning: 'The Illustrious' },
  { arabic: 'الواحد', bare: 'واحد', transliteration: 'Al-Wahid', meaning: 'The One' },
  { arabic: 'الأحد', bare: 'أحد', transliteration: 'Al-Ahad', meaning: 'The Indivisible One' },
  { arabic: 'الصمد', bare: 'صمد', transliteration: 'As-Samad', meaning: 'The Eternal Refuge' },
  { arabic: 'القادر', bare: 'قادر', transliteration: 'Al-Qadir', meaning: 'The Able' },
  { arabic: 'المقتدر', bare: 'مقتدر', transliteration: 'Al-Muqtadir', meaning: 'The Omnipotent' },
  { arabic: 'المقدم', bare: 'مقدم', transliteration: 'Al-Muqaddim', meaning: 'The One Who Brings Forward' },
  { arabic: 'المؤخر', bare: 'مؤخر', transliteration: 'Al-Muakhkhir', meaning: 'The One Who Delays' },
  { arabic: 'الأول', bare: 'أول', transliteration: 'Al-Awwal', meaning: 'The First' },
  { arabic: 'الآخر', bare: 'آخر', transliteration: 'Al-Akhir', meaning: 'The Last' },
  { arabic: 'الظاهر', bare: 'ظاهر', transliteration: 'Az-Zahir', meaning: 'The Manifest' },
  { arabic: 'الباطن', bare: 'باطن', transliteration: 'Al-Batin', meaning: 'The Hidden' },
  { arabic: 'الوالي', bare: 'والي', transliteration: 'Al-Wali', meaning: 'The Patron' },
  { arabic: 'المتعالي', bare: 'متعالي', transliteration: 'Al-Mutaali', meaning: 'The Most Exalted' },
  { arabic: 'البر', bare: 'بر', transliteration: 'Al-Barr', meaning: 'The Source of Goodness' },
  { arabic: 'التواب', bare: 'تواب', transliteration: 'At-Tawwab', meaning: 'The Ever-Accepting of Repentance' },
  { arabic: 'المنتقم', bare: 'منتقم', transliteration: 'Al-Muntaqim', meaning: 'The Avenger' },
  { arabic: 'العفو', bare: 'عفو', transliteration: 'Al-Afuww', meaning: 'The Pardoner' },
  { arabic: 'الرؤوف', bare: 'رؤوف', transliteration: 'Ar-Rauf', meaning: 'The Most Kind' },
  // Malik al-Mulk and Dhu al-Jalal wa-l-Ikram have no separable "al-"
  // article, so arabic and bare are the same phrase for these two.
  { arabic: 'مالك الملك', bare: 'مالك الملك', transliteration: 'Malik al-Mulk', meaning: 'Owner of All Sovereignty' },
  { arabic: 'ذو الجلال والإكرام', bare: 'ذو الجلال والإكرام', transliteration: 'Dhu al-Jalal wa-l-Ikram', meaning: 'Owner of Majesty and Honour' },
  { arabic: 'المقسط', bare: 'مقسط', transliteration: 'Al-Muqsit', meaning: 'The Equitable' },
  { arabic: 'الجامع', bare: 'جامع', transliteration: 'Al-Jami', meaning: 'The Gatherer' },
  { arabic: 'الغني', bare: 'غني', transliteration: 'Al-Ghani', meaning: 'The Self-Sufficient' },
  { arabic: 'المغني', bare: 'مغني', transliteration: 'Al-Mughni', meaning: 'The Enricher' },
  { arabic: 'المانع', bare: 'مانع', transliteration: 'Al-Mani', meaning: 'The Preventer' },
  { arabic: 'الضار', bare: 'ضار', transliteration: 'Ad-Darr', meaning: 'The Bringer of Adversity' },
  { arabic: 'النافع', bare: 'نافع', transliteration: 'An-Nafi', meaning: 'The Bringer of Benefit' },
  { arabic: 'النور', bare: 'نور', transliteration: 'An-Nur', meaning: 'The Light' },
  { arabic: 'الهادي', bare: 'هادي', transliteration: 'Al-Hadi', meaning: 'The Guide' },
  { arabic: 'البديع', bare: 'بديع', transliteration: 'Al-Badi', meaning: 'The Incomparable Originator' },
  { arabic: 'الباقي', bare: 'باقي', transliteration: 'Al-Baqi', meaning: 'The Everlasting' },
  { arabic: 'الوارث', bare: 'وارث', transliteration: 'Al-Warith', meaning: 'The Inheritor' },
  { arabic: 'الرشيد', bare: 'رشيد', transliteration: 'Ar-Rashid', meaning: 'The Guide to the Right Path' },
  { arabic: 'الصبور', bare: 'صبور', transliteration: 'As-Sabur', meaning: 'The Most Patient' },
];

/**
 * Abjad values of a Name, computed at runtime from the abjad table.
 * `bare` is the value of the name without the article; `withAl` is the
 * value of the full form with the article (alif + lam add 31 in kabir).
 */
export function nameValues(
  entry: AsmaName,
  system: AbjadSystem,
  school: AbjadSchool,
): { bare: number; withAl: number } {
  return {
    bare: valueOfText(entry.bare, system, school).total,
    withAl: valueOfText(entry.arabic, system, school).total,
  };
}
