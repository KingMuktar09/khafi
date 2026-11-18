/**
 * Qur'anic text for the Fawatih, Sawaqit and Shields tools.
 *
 * SOURCE — Tanzil Project, Uthmani text (Madina Mushaf), Version 1.1, February 2021.
 * Downloaded from https://tanzil.net/download/ (the site's own download form) on 18 Nov 2026.
 * Tanzil Terms of Use (https://tanzil.net/download/): 'Permission is granted to copy and
 * distribute verbatim copies of the Quran text provided here, but changing the text is not
 * allowed. The text can be used in any website or application, provided that its source
 * (Tanzil Project) is clearly indicated, and a link is made to tanzil.net to enable users
 * to keep track of changes.' This file follows those terms: the strings below are verbatim
 * copies, the source is named here and on every page that shows them, and the pages link
 * to https://tanzil.net.
 *
 * HOW EACH STRING WAS CHECKED (18 Nov 2026):
 * - The downloaded file holds 6,236 verses across 114 surahs; every surah's verse count
 *   was checked against the standard counts (e.g. 1:7, 2:286, 112:4, 113:5, 114:6).
 * - The strings used here were cross-checked against a second source serving the same
 *   Tanzil Uthmani text (AlQuranCloud API, api.alquran.cloud): Qur'an 2:255 is
 *   letter-identical after normalisation; 112:1, 1:2, 2:1 and 42:2 are identical.
 * - Every string in this file is stored in Unicode NFC form, as the brief requires.
 *   NFC only reorders the vowel/shadda marks (e.g. shadda before fatha becomes fatha
 *   before shadda); it changes no letter in any string here — verified by comparing
 *   the letter sequence of each string before and after NFC (0 differences).
 * - The Basmalah is verse 1 of Surah al-Fatiha, so it is kept in the Fatiha text. For
 *   al-Ikhlas, al-Falaq and al-Nas the Basmalah is a prefix in the Tanzil file, not a
 *   verse of those surahs, so it is removed from their first verse (see below).
 * - Surah names and meanings: AlQuranCloud surah list (api.alquran.cloud/v1/surah),
 *   checked 18 Nov 2026.
 *
 * WHAT IS COMPUTED, NOT TYPED:
 * - The Fawatih forms are found by a rule run over all 114 opening verses (see
 *   computeFawatih): the first word of the opening verse is a 'bare' word — its only
 *   combining marks are maddah (U+0653) — and it is 1 to 5 letters long. That rule finds
 *   exactly 29 surahs and 14 distinct forms, which is the known count, verified
 *   independently against the full Tanzil text before this file was written.
 * - The Sawaqit letters are found by counting which of the 28 letters appear in
 *   al-Fatiha (see computeSawaqit): 21 appear, 7 do not.
 * - The Shields totals are computed from the texts below with the single shared
 *   normalisation routine in src/utils/abjad.ts (see shieldWordTotals).
 *
 * The traditional names attached to the seven Sawaqit letters, and any interpretation
 * of what the Fawatih letters mean, are NOT in this file: no source has been named
 * for them yet, so the pages show 'source needed' instead of guessing.
 *
 * TRANSLITERATION (Latin reading of the Arabic), added 18 Nov 2026:
 * - Source: Tanzil Project, English Transliteration (https://tanzil.net/trans/),
 *   the same project as the Uthmani text above. Downloaded 18 Nov 2026 from
 *   https://tanzil.net/trans/en.transliteration (6,236 verses, same numbering).
 * - Terms (https://tanzil.net/trans/): the translations there are for
 *   non-commercial use only, and redistributing the list needs the project's
 *   permission. This site is free and non-commercial, uses only this one
 *   transliteration, and links back to tanzil.net/trans/ as the terms ask.
 * - The file marks some letters with HTML tags (<u>, <b>, <i>). Only the tags
 *   are removed; the letters are kept exactly as the file writes them. So the
 *   l of 'al' stays written before sun letters (alrrahmani), AA is the letter
 *   ayn, and th is the letter tha. The pages say this in plain words.
 * - One fix: the file's line for Qur'an 114:6 reads 'Mina aljinnati wa
 *   alnnasm' — four tokens, ending in 'm'. That cannot be right: the Arabic
 *   verse has three words, and the same file writes 'alnnasi' for 114:1-3.
 *   It is stored here as 'Mina aljinnati waalnnasi', and the test pins both
 *   the fix and the file's raw reading so the change stays visible.
 * - Every transliteration verse was checked word by word against the Arabic
 *   verse it belongs to: 29 + 15 + 23 + 20 + 50 = 137 words, all matching.
 */

import { ABJAD_LETTERS, normalizeArabic, valueOfText } from '../utils/abjad';
import type { AbjadSchool, AbjadSystem } from '../utils/abjad';

/** Short source line shown on every page that displays Qur'anic text. */
export const QURAN_TEXT_SOURCE =
  'Qur\'an text: Tanzil Project, Uthmani text (Madina Mushaf), Version 1.1 (Feb 2021), https://tanzil.net';

/** Short source line shown on every page that displays transliteration. */
export const TRANSLITERATION_SOURCE =
  'Transliteration: Tanzil Project, English Transliteration, https://tanzil.net/trans/';

/** The Fatiha, Qur'an 1:1–7. Verse 1 is the Basmalah, which is a verse of this surah. */
export const FATIHA_VERSES: string[] = [
  "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", // 1:1
  "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", // 1:2
  "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", // 1:3
  "مَٰلِكِ يَوْمِ ٱلدِّينِ", // 1:4
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", // 1:5
  "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", // 1:6
  "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", // 1:7
];

/** al-Ikhlas, Qur'an 112:1–4. The Basmalah prefix in the Tanzil file is removed from verse 1 — it is not a verse of this surah. */
export const IKHLAS_VERSES: string[] = [
  "قُلْ هُوَ ٱللَّهُ أَحَدٌ", // 112:1
  "ٱللَّهُ ٱلصَّمَدُ", // 112:2
  "لَمْ يَلِدْ وَلَمْ يُولَدْ", // 112:3
  "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", // 112:4
];

/** al-Falaq, Qur'an 113:1–5. The Basmalah prefix in the Tanzil file is removed from verse 1 — it is not a verse of this surah. */
export const FALAQ_VERSES: string[] = [
  "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", // 113:1
  "مِن شَرِّ مَا خَلَقَ", // 113:2
  "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", // 113:3
  "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ", // 113:4
  "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", // 113:5
];

/** al-Nas, Qur'an 114:1–6. The Basmalah prefix in the Tanzil file is removed from verse 1 — it is not a verse of this surah. */
export const NAS_VERSES: string[] = [
  "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", // 114:1
  "مَلِكِ ٱلنَّاسِ", // 114:2
  "إِلَٰهِ ٱلنَّاسِ", // 114:3
  "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", // 114:4
  "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", // 114:5
  "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", // 114:6
];

/** Ayat al-Kursi, Qur'an 2:255, the whole verse. */
export const AYAT_AL_KURSI: string = "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ"; // 2:255

/**
 * Latin transliteration of the verses above, word for word, from the Tanzil
 * English Transliteration (see the header note). Each inner array is one
 * verse, in the same order as the Arabic verses. The word counts match the
 * Arabic verse by verse (29 + 15 + 23 + 20 + 50 = 137 words).
 * One fix, documented in the header: 114:6 is stored as
 * 'Mina aljinnati waalnnasi'; the file reads 'wa alnnasm', which is a typo.
 */
export const FATIHA_TRANSLITERATION: string[][] = [
  ['Bismi', 'Allahi', 'alrrahmani', 'alrraheemi'],
  ['Alhamdu', 'lillahi', 'rabbi', 'alAAalameena'],
  ['Alrrahmani', 'alrraheemi'],
  ['Maliki', 'yawmi', 'alddeeni'],
  ['Iyyaka', 'naAAbudu', 'waiyyaka', 'nastaAAeenu'],
  ['Ihdina', 'alssirata', 'almustaqeema'],
  ['Sirata', 'allatheena', 'anAAamta', 'AAalayhim', 'ghayri', 'almaghdoobi', 'AAalayhim', 'wala', 'alddalleena'],
];

export const IKHLAS_TRANSLITERATION: string[][] = [
  ['Qul', 'huwa', 'Allahu', 'ahadun'],
  ['Allahu', 'alssamadu'],
  ['Lam', 'yalid', 'walam', 'yooladu'],
  ['Walam', 'yakun', 'lahu', 'kufuwan', 'ahadun'],
];

export const FALAQ_TRANSLITERATION: string[][] = [
  ['Qul', 'aAAoothu', 'birabbi', 'alfalaqi'],
  ['Min', 'sharri', 'ma', 'khalaqa'],
  ['Wamin', 'sharri', 'ghasiqin', 'itha', 'waqaba'],
  ['Wamin', 'sharri', 'alnnaffathati', 'fee', 'alAAuqadi'],
  ['Wamin', 'sharri', 'hasidin', 'itha', 'hasada'],
];

export const NAS_TRANSLITERATION: string[][] = [
  ['Qul', 'aAAoothu', 'birabbi', 'alnnasi'],
  ['Maliki', 'alnnasi'],
  ['Ilahi', 'alnnasi'],
  ['Min', 'sharri', 'alwaswasi', 'alkhannasi'],
  ['Allathee', 'yuwaswisu', 'fee', 'sudoori', 'alnnasi'],
  ['Mina', 'aljinnati', 'waalnnasi'],
];

export const AYAT_AL_KURSI_TRANSLITERATION: string[] = [
  'Allahu', 'la', 'ilaha', 'illa', 'huwa', 'alhayyu', 'alqayyoomu', 'la', 'takhuthuhu', 'sinatun', 'wala', 'nawmun', 'lahu', 'ma', 'fee', 'alssamawati', 'wama', 'fee', 'alardi', 'man', 'tha', 'allathee', 'yashfaAAu', 'AAindahu', 'illa', 'biithnihi', 'yaAAlamu', 'ma', 'bayna', 'aydeehim', 'wama', 'khalfahum', 'wala', 'yuheetoona', 'bishayin', 'min', 'AAilmihi', 'illa', 'bima', 'shaa', 'wasiAAa', 'kursiyyuhu', 'alssamawati', 'waalarda', 'wala', 'yaooduhu', 'hifthuhuma', 'wahuwa', 'alAAaliyyu', 'alAAatheemu',
];

/**
 * The opening verse of every surah, exactly as printed in the Tanzil Uthmani text
 * (NFC form). For surahs other than 1 and 9 this starts with the Basmalah prefix;
 * computeFawatih strips that prefix using the Fatiha's first verse (the Basmalah
 * itself, taken from the same text). `secondVerse` is set only for Surah 42: it is
 * the only surah whose opening letters run over two verses (Ha Mim, then Ayn Sin Qaf).
 */
export interface SurahOpening {
  number: number;
  name: string;
  meaning: string;
  opening: string;
  secondVerse?: string;
}

export const SURAH_OPENINGS: SurahOpening[] = [
  { number: 1, name: "Al-Faatiha", meaning: "The Opening", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" },
  { number: 2, name: "Al-Baqara", meaning: "The Cow", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 3, name: "Aal-i-Imraan", meaning: "The Family of Imraan", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 4, name: "An-Nisaa", meaning: "The Women", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ ٱلَّذِى خَلَقَكُم مِّن نَّفْسٍ وَٰحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَآءً وَٱتَّقُوا۟ ٱللَّهَ ٱلَّذِى تَسَآءَلُونَ بِهِۦ وَٱلْأَرْحَامَ إِنَّ ٱللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا" },
  { number: 5, name: "Al-Maaida", meaning: "The Table", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَوْفُوا۟ بِٱلْعُقُودِ أُحِلَّتْ لَكُم بَهِيمَةُ ٱلْأَنْعَٰمِ إِلَّا مَا يُتْلَىٰ عَلَيْكُمْ غَيْرَ مُحِلِّى ٱلصَّيْدِ وَأَنتُمْ حُرُمٌ إِنَّ ٱللَّهَ يَحْكُمُ مَا يُرِيدُ" },
  { number: 6, name: "Al-An'aam", meaning: "The Cattle", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ وَجَعَلَ ٱلظُّلُمَٰتِ وَٱلنُّورَ ثُمَّ ٱلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ يَعْدِلُونَ" },
  { number: 7, name: "Al-A'raaf", meaning: "The Heights", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓصٓ" },
  { number: 8, name: "Al-Anfaal", meaning: "The Spoils of War", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَسْـَٔلُونَكَ عَنِ ٱلْأَنفَالِ قُلِ ٱلْأَنفَالُ لِلَّهِ وَٱلرَّسُولِ فَٱتَّقُوا۟ ٱللَّهَ وَأَصْلِحُوا۟ ذَاتَ بَيْنِكُمْ وَأَطِيعُوا۟ ٱللَّهَ وَرَسُولَهُۥٓ إِن كُنتُم مُّؤْمِنِينَ" },
  { number: 9, name: "At-Tawba", meaning: "The Repentance", opening: "بَرَآءَةٌ مِّنَ ٱللَّهِ وَرَسُولِهِۦٓ إِلَى ٱلَّذِينَ عَٰهَدتُّم مِّنَ ٱلْمُشْرِكِينَ" },
  { number: 10, name: "Yunus", meaning: "Jonas", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓر تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ" },
  { number: 11, name: "Hud", meaning: "Hud", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓر كِتَٰبٌ أُحْكِمَتْ ءَايَٰتُهُۥ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ" },
  { number: 12, name: "Yusuf", meaning: "Joseph", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓر تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْمُبِينِ" },
  { number: 13, name: "Ar-Ra'd", meaning: "The Thunder", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓر تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ وَٱلَّذِىٓ أُنزِلَ إِلَيْكَ مِن رَّبِّكَ ٱلْحَقُّ وَلَٰكِنَّ أَكْثَرَ ٱلنَّاسِ لَا يُؤْمِنُونَ" },
  { number: 14, name: "Ibrahim", meaning: "Abraham", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓر كِتَٰبٌ أَنزَلْنَٰهُ إِلَيْكَ لِتُخْرِجَ ٱلنَّاسَ مِنَ ٱلظُّلُمَٰتِ إِلَى ٱلنُّورِ بِإِذْنِ رَبِّهِمْ إِلَىٰ صِرَٰطِ ٱلْعَزِيزِ ٱلْحَمِيدِ" },
  { number: 15, name: "Al-Hijr", meaning: "The Rock", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓر تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ وَقُرْءَانٍ مُّبِينٍ" },
  { number: 16, name: "An-Nahl", meaning: "The Bee", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ أَتَىٰٓ أَمْرُ ٱللَّهِ فَلَا تَسْتَعْجِلُوهُ سُبْحَٰنَهُۥ وَتَعَٰلَىٰ عَمَّا يُشْرِكُونَ" },
  { number: 17, name: "Al-Israa", meaning: "The Night Journey", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سُبْحَٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا ٱلَّذِى بَٰرَكْنَا حَوْلَهُۥ لِنُرِيَهُۥ مِنْ ءَايَٰتِنَآ إِنَّهُۥ هُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ" },
  { number: 18, name: "Al-Kahf", meaning: "The Cave", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا" },
  { number: 19, name: "Maryam", meaning: "Mary", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ كٓهيعٓصٓ" },
  { number: 20, name: "Taa-Haa", meaning: "Taa-Haa", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ طه" },
  { number: 21, name: "Al-Anbiyaa", meaning: "The Prophets", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ وَهُمْ فِى غَفْلَةٍ مُّعْرِضُونَ" },
  { number: 22, name: "Al-Hajj", meaning: "The Pilgrimage", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمْ إِنَّ زَلْزَلَةَ ٱلسَّاعَةِ شَىْءٌ عَظِيمٌ" },
  { number: 23, name: "Al-Muminoon", meaning: "The Believers", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ" },
  { number: 24, name: "An-Noor", meaning: "The Light", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سُورَةٌ أَنزَلْنَٰهَا وَفَرَضْنَٰهَا وَأَنزَلْنَا فِيهَآ ءَايَٰتٍۭ بَيِّنَٰتٍ لَّعَلَّكُمْ تَذَكَّرُونَ" },
  { number: 25, name: "Al-Furqaan", meaning: "The Criterion", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ تَبَارَكَ ٱلَّذِى نَزَّلَ ٱلْفُرْقَانَ عَلَىٰ عَبْدِهِۦ لِيَكُونَ لِلْعَٰلَمِينَ نَذِيرًا" },
  { number: 26, name: "Ash-Shu'araa", meaning: "The Poets", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ طسٓمٓ" },
  { number: 27, name: "An-Naml", meaning: "The Ant", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ طسٓ تِلْكَ ءَايَٰتُ ٱلْقُرْءَانِ وَكِتَابٍ مُّبِينٍ" },
  { number: 28, name: "Al-Qasas", meaning: "The Stories", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ طسٓمٓ" },
  { number: 29, name: "Al-Ankaboot", meaning: "The Spider", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 30, name: "Ar-Room", meaning: "The Romans", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 31, name: "Luqman", meaning: "Luqman", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 32, name: "As-Sajda", meaning: "The Prostration", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ" },
  { number: 33, name: "Al-Ahzaab", meaning: "The Clans", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلنَّبِىُّ ٱتَّقِ ٱللَّهَ وَلَا تُطِعِ ٱلْكَٰفِرِينَ وَٱلْمُنَٰفِقِينَ إِنَّ ٱللَّهَ كَانَ عَلِيمًا حَكِيمًا" },
  { number: 34, name: "Saba", meaning: "Sheba", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ ٱلَّذِى لَهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ وَلَهُ ٱلْحَمْدُ فِى ٱلْـَٔاخِرَةِ وَهُوَ ٱلْحَكِيمُ ٱلْخَبِيرُ" },
  { number: 35, name: "Faatir", meaning: "The Originator", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ فَاطِرِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ جَاعِلِ ٱلْمَلَٰٓئِكَةِ رُسُلًا أُو۟لِىٓ أَجْنِحَةٍ مَّثْنَىٰ وَثُلَٰثَ وَرُبَٰعَ يَزِيدُ فِى ٱلْخَلْقِ مَا يَشَآءُ إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ" },
  { number: 36, name: "Yaseen", meaning: "Yaseen", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يسٓ" },
  { number: 37, name: "As-Saaffaat", meaning: "Those drawn up in Ranks", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلصَّٰٓفَّٰتِ صَفًّا" },
  { number: 38, name: "Saad", meaning: "The letter Saad", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ صٓ وَٱلْقُرْءَانِ ذِى ٱلذِّكْرِ" },
  { number: 39, name: "Az-Zumar", meaning: "The Groups", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ تَنزِيلُ ٱلْكِتَٰبِ مِنَ ٱللَّهِ ٱلْعَزِيزِ ٱلْحَكِيمِ" },
  { number: 40, name: "Ghafir", meaning: "The Forgiver", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 41, name: "Fussilat", meaning: "Explained in detail", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 42, name: "Ash-Shura", meaning: "Consultation", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ", secondVerse: "عٓسٓقٓ" },
  { number: 43, name: "Az-Zukhruf", meaning: "Ornaments of gold", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 44, name: "Ad-Dukhaan", meaning: "The Smoke", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 45, name: "Al-Jaathiya", meaning: "Crouching", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 46, name: "Al-Ahqaf", meaning: "The Dunes", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ حمٓ" },
  { number: 47, name: "Muhammad", meaning: "Muhammad", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلَّذِينَ كَفَرُوا۟ وَصَدُّوا۟ عَن سَبِيلِ ٱللَّهِ أَضَلَّ أَعْمَٰلَهُمْ" },
  { number: 48, name: "Al-Fath", meaning: "The Victory", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا" },
  { number: 49, name: "Al-Hujuraat", meaning: "The Inner Apartments", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تُقَدِّمُوا۟ بَيْنَ يَدَىِ ٱللَّهِ وَرَسُولِهِۦ وَٱتَّقُوا۟ ٱللَّهَ إِنَّ ٱللَّهَ سَمِيعٌ عَلِيمٌ" },
  { number: 50, name: "Qaaf", meaning: "The letter Qaaf", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قٓ وَٱلْقُرْءَانِ ٱلْمَجِيدِ" },
  { number: 51, name: "Adh-Dhaariyat", meaning: "The Winnowing Winds", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلذَّٰرِيَٰتِ ذَرْوًا" },
  { number: 52, name: "At-Tur", meaning: "The Mount", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلطُّورِ" },
  { number: 53, name: "An-Najm", meaning: "The Star", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلنَّجْمِ إِذَا هَوَىٰ" },
  { number: 54, name: "Al-Qamar", meaning: "The Moon", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱقْتَرَبَتِ ٱلسَّاعَةُ وَٱنشَقَّ ٱلْقَمَرُ" },
  { number: 55, name: "Ar-Rahmaan", meaning: "The Beneficent", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلرَّحْمَٰنُ" },
  { number: 56, name: "Al-Waaqia", meaning: "The Inevitable", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا وَقَعَتِ ٱلْوَاقِعَةُ" },
  { number: 57, name: "Al-Hadid", meaning: "The Iron", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سَبَّحَ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ" },
  { number: 58, name: "Al-Mujaadila", meaning: "The Pleading Woman", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قَدْ سَمِعَ ٱللَّهُ قَوْلَ ٱلَّتِى تُجَٰدِلُكَ فِى زَوْجِهَا وَتَشْتَكِىٓ إِلَى ٱللَّهِ وَٱللَّهُ يَسْمَعُ تَحَاوُرَكُمَآ إِنَّ ٱللَّهَ سَمِيعٌۢ بَصِيرٌ" },
  { number: 59, name: "Al-Hashr", meaning: "The Exile", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سَبَّحَ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ" },
  { number: 60, name: "Al-Mumtahana", meaning: "She that is to be examined", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تَتَّخِذُوا۟ عَدُوِّى وَعَدُوَّكُمْ أَوْلِيَآءَ تُلْقُونَ إِلَيْهِم بِٱلْمَوَدَّةِ وَقَدْ كَفَرُوا۟ بِمَا جَآءَكُم مِّنَ ٱلْحَقِّ يُخْرِجُونَ ٱلرَّسُولَ وَإِيَّاكُمْ أَن تُؤْمِنُوا۟ بِٱللَّهِ رَبِّكُمْ إِن كُنتُمْ خَرَجْتُمْ جِهَٰدًا فِى سَبِيلِى وَٱبْتِغَآءَ مَرْضَاتِى تُسِرُّونَ إِلَيْهِم بِٱلْمَوَدَّةِ وَأَنَا۠ أَعْلَمُ بِمَآ أَخْفَيْتُمْ وَمَآ أَعْلَنتُمْ وَمَن يَفْعَلْهُ مِنكُمْ فَقَدْ ضَلَّ سَوَآءَ ٱلسَّبِيلِ" },
  { number: 61, name: "As-Saff", meaning: "The Ranks", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سَبَّحَ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ" },
  { number: 62, name: "Al-Jumu'a", meaning: "Friday", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يُسَبِّحُ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ٱلْمَلِكِ ٱلْقُدُّوسِ ٱلْعَزِيزِ ٱلْحَكِيمِ" },
  { number: 63, name: "Al-Munaafiqoon", meaning: "The Hypocrites", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا جَآءَكَ ٱلْمُنَٰفِقُونَ قَالُوا۟ نَشْهَدُ إِنَّكَ لَرَسُولُ ٱللَّهِ وَٱللَّهُ يَعْلَمُ إِنَّكَ لَرَسُولُهُۥ وَٱللَّهُ يَشْهَدُ إِنَّ ٱلْمُنَٰفِقِينَ لَكَٰذِبُونَ" },
  { number: 64, name: "At-Taghaabun", meaning: "Mutual Disillusion", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يُسَبِّحُ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ" },
  { number: 65, name: "At-Talaaq", meaning: "Divorce", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلنَّبِىُّ إِذَا طَلَّقْتُمُ ٱلنِّسَآءَ فَطَلِّقُوهُنَّ لِعِدَّتِهِنَّ وَأَحْصُوا۟ ٱلْعِدَّةَ وَٱتَّقُوا۟ ٱللَّهَ رَبَّكُمْ لَا تُخْرِجُوهُنَّ مِنۢ بُيُوتِهِنَّ وَلَا يَخْرُجْنَ إِلَّآ أَن يَأْتِينَ بِفَٰحِشَةٍ مُّبَيِّنَةٍ وَتِلْكَ حُدُودُ ٱللَّهِ وَمَن يَتَعَدَّ حُدُودَ ٱللَّهِ فَقَدْ ظَلَمَ نَفْسَهُۥ لَا تَدْرِى لَعَلَّ ٱللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا" },
  { number: 66, name: "At-Tahrim", meaning: "The Prohibition", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلنَّبِىُّ لِمَ تُحَرِّمُ مَآ أَحَلَّ ٱللَّهُ لَكَ تَبْتَغِى مَرْضَاتَ أَزْوَٰجِكَ وَٱللَّهُ غَفُورٌ رَّحِيمٌ" },
  { number: 67, name: "Al-Mulk", meaning: "The Sovereignty", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ" },
  { number: 68, name: "Al-Qalam", meaning: "The Pen", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ نٓ وَٱلْقَلَمِ وَمَا يَسْطُرُونَ" },
  { number: 69, name: "Al-Haaqqa", meaning: "The Reality", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْحَآقَّةُ" },
  { number: 70, name: "Al-Ma'aarij", meaning: "The Ascending Stairways", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سَأَلَ سَآئِلٌۢ بِعَذَابٍ وَاقِعٍ" },
  { number: 71, name: "Nooh", meaning: "Noah", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِنَّآ أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِۦٓ أَنْ أَنذِرْ قَوْمَكَ مِن قَبْلِ أَن يَأْتِيَهُمْ عَذَابٌ أَلِيمٌ" },
  { number: 72, name: "Al-Jinn", meaning: "The Jinn", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أُوحِىَ إِلَىَّ أَنَّهُ ٱسْتَمَعَ نَفَرٌ مِّنَ ٱلْجِنِّ فَقَالُوٓا۟ إِنَّا سَمِعْنَا قُرْءَانًا عَجَبًا" },
  { number: 73, name: "Al-Muzzammil", meaning: "The Enshrouded One", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلْمُزَّمِّلُ" },
  { number: 74, name: "Al-Muddaththir", meaning: "The Cloaked One", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ يَٰٓأَيُّهَا ٱلْمُدَّثِّرُ" },
  { number: 75, name: "Al-Qiyaama", meaning: "The Resurrection", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ لَآ أُقْسِمُ بِيَوْمِ ٱلْقِيَٰمَةِ" },
  { number: 76, name: "Al-Insaan", meaning: "Man", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ هَلْ أَتَىٰ عَلَى ٱلْإِنسَٰنِ حِينٌ مِّنَ ٱلدَّهْرِ لَمْ يَكُن شَيْـًٔا مَّذْكُورًا" },
  { number: 77, name: "Al-Mursalaat", meaning: "The Emissaries", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلْمُرْسَلَٰتِ عُرْفًا" },
  { number: 78, name: "An-Naba", meaning: "The Announcement", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ عَمَّ يَتَسَآءَلُونَ" },
  { number: 79, name: "An-Naazi'aat", meaning: "Those who drag forth", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلنَّٰزِعَٰتِ غَرْقًا" },
  { number: 80, name: "Abasa", meaning: "He frowned", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ عَبَسَ وَتَوَلَّىٰٓ" },
  { number: 81, name: "At-Takwir", meaning: "The Overthrowing", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا ٱلشَّمْسُ كُوِّرَتْ" },
  { number: 82, name: "Al-Infitaar", meaning: "The Cleaving", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا ٱلسَّمَآءُ ٱنفَطَرَتْ" },
  { number: 83, name: "Al-Mutaffifin", meaning: "Defrauding", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَيْلٌ لِّلْمُطَفِّفِينَ" },
  { number: 84, name: "Al-Inshiqaaq", meaning: "The Splitting Open", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا ٱلسَّمَآءُ ٱنشَقَّتْ" },
  { number: 85, name: "Al-Burooj", meaning: "The Constellations", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلسَّمَآءِ ذَاتِ ٱلْبُرُوجِ" },
  { number: 86, name: "At-Taariq", meaning: "The Morning Star", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلسَّمَآءِ وَٱلطَّارِقِ" },
  { number: 87, name: "Al-A'laa", meaning: "The Most High", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى" },
  { number: 88, name: "Al-Ghaashiya", meaning: "The Overwhelming", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ هَلْ أَتَىٰكَ حَدِيثُ ٱلْغَٰشِيَةِ" },
  { number: 89, name: "Al-Fajr", meaning: "The Dawn", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلْفَجْرِ" },
  { number: 90, name: "Al-Balad", meaning: "The City", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ لَآ أُقْسِمُ بِهَٰذَا ٱلْبَلَدِ" },
  { number: 91, name: "Ash-Shams", meaning: "The Sun", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلشَّمْسِ وَضُحَىٰهَا" },
  { number: 92, name: "Al-Lail", meaning: "The Night", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلَّيْلِ إِذَا يَغْشَىٰ" },
  { number: 93, name: "Ad-Dhuhaa", meaning: "The Morning Hours", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلضُّحَىٰ" },
  { number: 94, name: "Ash-Sharh", meaning: "The Consolation", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ" },
  { number: 95, name: "At-Tin", meaning: "The Fig", opening: "بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلتِّينِ وَٱلزَّيْتُونِ" },
  { number: 96, name: "Al-Alaq", meaning: "The Clot", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ" },
  { number: 97, name: "Al-Qadr", meaning: "The Power, Fate", opening: "بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ" },
  { number: 98, name: "Al-Bayyina", meaning: "The Evidence", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ لَمْ يَكُنِ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ وَٱلْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ ٱلْبَيِّنَةُ" },
  { number: 99, name: "Az-Zalzala", meaning: "The Earthquake", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا زُلْزِلَتِ ٱلْأَرْضُ زِلْزَالَهَا" },
  { number: 100, name: "Al-Aadiyaat", meaning: "The Chargers", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلْعَٰدِيَٰتِ ضَبْحًا" },
  { number: 101, name: "Al-Qaari'a", meaning: "The Calamity", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ٱلْقَارِعَةُ" },
  { number: 102, name: "At-Takaathur", meaning: "Competition", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ أَلْهَىٰكُمُ ٱلتَّكَاثُرُ" },
  { number: 103, name: "Al-Asr", meaning: "The Declining Day, Epoch", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَٱلْعَصْرِ" },
  { number: 104, name: "Al-Humaza", meaning: "The Traducer", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ" },
  { number: 105, name: "Al-Fil", meaning: "The Elephant", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ" },
  { number: 106, name: "Quraish", meaning: "Quraysh", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ لِإِيلَٰفِ قُرَيْشٍ" },
  { number: 107, name: "Al-Maa'un", meaning: "Almsgiving", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ" },
  { number: 108, name: "Al-Kawthar", meaning: "Abundance", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ" },
  { number: 109, name: "Al-Kaafiroon", meaning: "The Disbelievers", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ" },
  { number: 110, name: "An-Nasr", meaning: "Divine Support", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ" },
  { number: 111, name: "Al-Masad", meaning: "The Palm Fibre", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ" },
  { number: 112, name: "Al-Ikhlaas", meaning: "Sincerity", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ هُوَ ٱللَّهُ أَحَدٌ" },
  { number: 113, name: "Al-Falaq", meaning: "The Dawn", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ" },
  { number: 114, name: "An-Naas", meaning: "Mankind", opening: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ" },
];

/**
 * A word is 'bare' when it carries no vowel marks at all — its only combining marks
 * are maddah (U+0653), or it has no marks — and it is 1 to 5 letters long. In the fully
 * vocalised Uthmani text every ordinary word carries vowel marks, so a bare first word
 * at the start of a surah is a string of disjointed letters. Words such as 'qul' or
 * 'inna' carry vowel marks and are not bare, so they are never picked up.
 */
function isBareWord(word: string): boolean {
  if (!word) return false;
  let bases = 0;
  for (const ch of word) {
    const code = ch.codePointAt(0) ?? 0;
    const isMark =
      (code >= 0x064b && code <= 0x065f) ||
      (code >= 0x06d6 && code <= 0x06dc) ||
      code === 0x0670 ||
      code === 0x0640;
    if (isMark) {
      if (code !== 0x0653) return false; // only maddah may appear
    } else {
      bases += 1;
    }
  }
  return bases >= 1 && bases <= 5;
}

export interface FawatihForm {
  /** The letter string, e.g. 'الم' — computed from the opening verses, not typed in. */
  form: string;
  surahs: Array<{ number: number; name: string; meaning: string }>;
}

/**
 * Find the disjointed-letter openings (Fawatih) by running the bare-word rule over
 * all 114 opening verses, then group the surahs by their letter string. The result
 * is 29 surahs in 14 forms. The rule is the computation; the test suite pins the
 * result (29 surahs, 14 forms, exact mapping) as a regression check.
 */
export function computeFawatih(): FawatihForm[] {
  const basmalah = FATIHA_VERSES[0];
  const byForm = new Map<string, FawatihForm>();
  for (const opening of SURAH_OPENINGS) {
    let text = opening.opening;
    if (text.startsWith(basmalah)) text = text.slice(basmalah.length).trimStart();
    const firstWord = text.split(' ')[0] ?? '';
    if (!isBareWord(firstWord)) continue;
    const words = [normalizeArabic(firstWord)];
    if (opening.secondVerse) {
      const secondWord = opening.secondVerse.split(' ')[0] ?? '';
      const onlyWord = opening.secondVerse.trim().split(' ').length === 1;
      if (onlyWord && isBareWord(secondWord)) words.push(normalizeArabic(secondWord));
    }
    const form = words.join(' ');
    const entry = byForm.get(form) ?? { form, surahs: [] };
    entry.surahs.push({ number: opening.number, name: opening.name, meaning: opening.meaning });
    byForm.set(form, entry);
  }
  return [...byForm.values()].sort((a, b) => a.surahs[0].number - b.surahs[0].number);
}

/**
 * Say a Fawatih form out loud: the name of each letter, from the same
 * letter table the values come from. A two-word form keeps its two parts
 * apart with a comma: 'حم عسق' reads 'Ha Mim, Ayn Sin Qaf'.
 */
export function transliterateForm(form: string): string {
  const byLetter = new Map(ABJAD_LETTERS.map((entry) => [entry.letter, entry.name]));
  return form
    .split(' ')
    .map((word) =>
      [...normalizeArabic(word)]
        .map((letter) => byLetter.get(letter) ?? letter)
        .join(' '),
    )
    .join(', ');
}

export interface SawaqitResult {
  /** The 21 letters that appear in al-Fatiha, in Abjad order. */
  present: string[];
  /** The 7 letters absent from al-Fatiha, in Abjad order, with their letter entries. */
  absent: typeof ABJAD_LETTERS;
}

/**
 * The Sawaqit: the letters absent from al-Fatiha, found by counting which of the
 * 28 letters appear in the Fatiha text. 21 appear, 7 do not. The traditional names
 * attached to the seven absent letters are NOT supplied here — no source has been
 * named for them yet, so the page shows 'source needed' instead of guessing.
 */
export function computeSawaqit(): SawaqitResult {
  const present = new Set(normalizeArabic(FATIHA_VERSES.join(' ')));
  return {
    present: ABJAD_LETTERS.filter((entry) => present.has(entry.letter)).map((entry) => entry.letter),
    absent: ABJAD_LETTERS.filter((entry) => !present.has(entry.letter)),
  };
}

export interface ShieldText {
  id: string;
  title: string;
  reference: string;
  verses: string[];
  sourceNote: string;
}

/** The five texts whose running letter sums the Shields page shows. */
export const SHIELD_TEXTS: ShieldText[] = [
  {
    id: 'fatiha',
    title: 'al-Fatiha',
    reference: 'Qur\'an 1:1–7',
    verses: FATIHA_VERSES,
    sourceNote: 'Tanzil Uthmani v1.1, Qur\'an 1:1–7 (7 verses). Verse 1 is the Basmalah, which is a verse of this surah.',
  },
  {
    id: 'ikhlas',
    title: 'al-Ikhlas',
    reference: 'Qur\'an 112:1–4',
    verses: IKHLAS_VERSES,
    sourceNote: 'Tanzil Uthmani v1.1, Qur\'an 112:1–4 (4 verses). The Basmalah prefix is removed: it is not a verse of this surah.',
  },
  {
    id: 'falaq',
    title: 'al-Falaq',
    reference: 'Qur\'an 113:1–5',
    verses: FALAQ_VERSES,
    sourceNote: 'Tanzil Uthmani v1.1, Qur\'an 113:1–5 (5 verses). The Basmalah prefix is removed: it is not a verse of this surah.',
  },
  {
    id: 'nas',
    title: 'al-Nas',
    reference: 'Qur\'an 114:1–6',
    verses: NAS_VERSES,
    sourceNote: 'Tanzil Uthmani v1.1, Qur\'an 114:1–6 (6 verses). The Basmalah prefix is removed: it is not a verse of this surah.',
  },
  {
    id: 'kursi',
    title: 'Ayat al-Kursi',
    reference: 'Qur\'an 2:255',
    verses: [AYAT_AL_KURSI],
    sourceNote: 'Tanzil Uthmani v1.1, Qur\'an 2:255 (the whole verse, 50 words).',
  },
];

/** Transliteration of each shield text, verse by verse, in the same order as its Arabic verses. */
export const SHIELD_TRANSLITERATION: Record<string, string[][]> = {
  fatiha: FATIHA_TRANSLITERATION,
  ikhlas: IKHLAS_TRANSLITERATION,
  falaq: FALAQ_TRANSLITERATION,
  nas: NAS_TRANSLITERATION,
  kursi: [AYAT_AL_KURSI_TRANSLITERATION],
};

/** Flat word-by-word transliteration for a shield text, in the same order as its Arabic words. */
export function shieldTransliterationWords(id: string): string[] {
  return (SHIELD_TRANSLITERATION[id] ?? []).flat();
}

export interface ShieldWord {
  word: string;
  value: number;
  runningTotal: number;
}

/**
 * Word-by-word running letter sums for a text, using the single shared Abjad
 * routine (valueOfText). The words are the text's own words, split on spaces,
 * shown as written in the Uthmani text. The grand total is the last running total.
 *
 * Note on shadda: the shared routine counts a shadda as a doubling of its letter,
 * so the Uthmani spelling counts, for example, al-Rahman as 529 here, while the plain
 * spelling (no shadda) counts 329 on the Asma page. Both use the same rules; the
 * difference is the spelling of the input text, and the Shields page says so.
 */
export function shieldWordTotals(
  text: string,
  system: AbjadSystem,
  school: AbjadSchool,
): { words: ShieldWord[]; total: number } {
  const words: ShieldWord[] = [];
  let runningTotal = 0;
  for (const word of text.split(' ').filter((w) => w.length > 0)) {
    const { total } = valueOfText(word, system, school);
    runningTotal += total;
    words.push({ word, value: total, runningTotal });
  }
  return { words, total: runningTotal };
}

