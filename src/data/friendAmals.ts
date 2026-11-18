/**
 * Amals from the John Friend edition of Shams al-Ma'arif al-Kubra:
 * "Shams al-Ma'arif al-Kubra: The Complete Sun of Divine Knowledge",
 * translated by John Friend (John Friend Publishing, 2026).
 *
 * This edition is NOT in the library's catalog. It lives in the
 * Al Asrar notebook ("Al-Asrār: The Master Grimoire", 98 sources),
 * file "Shams Al Marif Al Kubra- Al Ahmad al buni.pdf", as identified
 * by the notebook's own Gemini chat. The notebook delivered all 25
 * amals from Chapter Two: The Divine Names. Amals 1-19 are printed
 * pp. 37-42. Amals 20-25 are printed pp. 42-50.
 *
 * Each amal is a short Name recitation with quiet reflection. The
 * notebook's closing warning is shown with the set: these are
 * historical curiosities from an ancient medieval grimoire, do them
 * entirely at your own risk, and they do not replace professional
 * medical, mental health or financial care.
 *
 * The Arabic names and their meanings match the site's own 99 Names
 * data (src/data/asmaNames.ts): al-Rahman the Most Gracious,
 * al-Quddus the Most Holy, al-Salam the Source of Peace, al-'Aziz
 * the Mighty, al-Wahhab the Bestower, al-Razzaq the Provider,
 * al-Fattah the Opener, al-'Alim the All-Knowing, al-Qabid the
 * Withholder, al-Basit the Extender, al-Rafi' the One Who Raises,
 * al-Halim the Forbearing, al-'Azim the Magnificent, al-Shakur the
 * Most Appreciative, al-Wadud the Most Loving, al-Ba'ith the
 * Resurrector, al-Haqq the Truth, al-Qawi the All-Strong, al-Matin
 * the Firm, al-Wali the Protecting Friend, al-Mubdi the Originator
 * of Creation, al-Muhyi the Giver of Life, al-Mumit the Bringer of
 * Death, al-Qayyum the Self-Subsisting, al-Sabur the Most Patient.
 */

export interface FriendAmal {
  id: string;
  /** Number in the notebook's Chapter Two set, 1-25. */
  number: number;
  title: string;
  purpose: string;
  how: string;
  /** The exact words to say, where the notebook gives them. */
  words?: string;
  /** Honest note where the material is incomplete. */
  note?: string;
  /** Section name in Chapter Two, as given by the notebook. */
  section: string;
  /** Printed page in the John Friend edition. */
  page: string;
}

/** Source line shown with the whole set. */
export const FRIEND_AMALS_SOURCE =
  'Shams al-Ma\u2019arif al-Kubra: The Complete Sun of Divine Knowledge, translated by John Friend (John Friend Publishing, 2026), Chapter Two: The Divine Names';

/** The notebook's own closing warning for this set. */
export const FRIEND_AMALS_WARNING =
  'These are historical curiosities from an ancient medieval grimoire. Do them entirely at your own risk. They do not replace professional medical, mental health or financial care.';

export const FRIEND_AMALS: FriendAmal[] = [
  {
    id: 'friend-al-rahman',
    number: 1,
    title: 'Ya Rahman: mercy and the fulfilment of lawful needs',
    purpose: 'Mercy, and the fulfilment of lawful needs.',
    how: 'On Friday after Asr, face the Qiblah. Repeat "Ya Allah, ya Rahman" (O Most Gracious) until sunset.',
    words: 'Ya Allah, ya Rahman (repeat until sunset)',
    section: 'The Name al-Rahman',
    page: '37',
  },
  {
    id: 'friend-al-quddus',
    number: 2,
    title: 'Ya Quddus: calming blameworthy appetites',
    purpose: 'Calming blameworthy appetites.',
    how: 'Sit quietly. Repeat "Ya Quddus" (O Most Holy) and think on God as pure and free of all fault.',
    words: 'Ya Quddus (repeat)',
    section: 'The Name al-Quddus',
    page: '38',
  },
  {
    id: 'friend-al-salam',
    number: 3,
    title: 'Ya Salam: protection from tribulations',
    purpose: 'Protection from tribulations.',
    how: 'Sit quietly. Repeat "Ya Salam" (O Source of Peace) and think on God as peace and safety.',
    words: 'Ya Salam (repeat)',
    section: 'The Name al-Salam',
    page: '38',
  },
  {
    id: 'friend-al-aziz',
    number: 4,
    title: 'Ya Aziz: overcoming humiliation and fear',
    purpose: 'Overcoming humiliation and fear.',
    how: 'Sit quietly. Repeat "Ya Aziz" (O Mighty) and think on God as mighty and honoured.',
    words: 'Ya Aziz (repeat)',
    section: 'The Name al-Aziz',
    page: '39',
  },
  {
    id: 'friend-al-wahhab',
    number: 5,
    title: 'Ya Wahhab: asking for gifts',
    purpose: 'Asking for gifts.',
    how: 'Sit quietly. Repeat "Ya Wahhab" (O Bestower) and think on God as the giver of all gifts.',
    words: 'Ya Wahhab (repeat)',
    section: 'The Name al-Wahhab',
    page: '40',
  },
  {
    id: 'friend-al-razzaq',
    number: 6,
    title: 'Ya Razzaq: livelihood',
    purpose: 'Livelihood.',
    how: 'After prayer, sit quietly. Repeat "Ya Razzaq" (O Provider) and think on God as the provider of all provision.',
    words: 'Ya Razzaq (repeat)',
    section: 'The Name al-Razzaq',
    page: '40',
  },
  {
    id: 'friend-al-fattah',
    number: 7,
    title: 'Ya Fattah: opening closed doors',
    purpose: 'Opening closed doors.',
    how: 'Sit quietly. Repeat "Ya Fattah" (O Opener) and think on God as the opener of every closed door.',
    words: 'Ya Fattah (repeat)',
    section: 'The Name al-Fattah',
    page: '40',
  },
  {
    id: 'friend-al-alim',
    number: 8,
    title: 'Ya Alim: wise speech',
    purpose: 'Wise speech.',
    how: 'Sit quietly. Repeat "Ya Alim" (O All-Knowing) and think on God as the knower of all things.',
    words: 'Ya Alim (repeat)',
    section: 'The Name al-Alim',
    page: '40',
  },
  {
    id: 'friend-al-qabid',
    number: 9,
    title: 'Ya Qabid: dispelling inward heaviness',
    purpose: 'Dispelling inward heaviness.',
    how: 'Sit quietly. Repeat "Ya Qabid" (O Withholder) and think on God as the one who holds back what harms.',
    words: 'Ya Qabid (repeat)',
    section: 'The Name al-Qabid',
    page: '41',
  },
  {
    id: 'friend-al-basit',
    number: 10,
    title: 'Ya Basit: expanding ease',
    purpose: 'Expanding ease.',
    how: 'Sit quietly. Repeat "Ya Basit" (O Extender) and think on God as the one who opens and expands.',
    words: 'Ya Basit (repeat)',
    section: 'The Name al-Basit',
    page: '41',
  },
  {
    id: 'friend-al-rafi',
    number: 11,
    title: 'Ya Rafi: elevation of character',
    purpose: 'Elevation of character.',
    how: 'Sit quietly. Repeat "Ya Rafi\u2019" (O One Who Raises) and think on God as the one who raises the low.',
    words: 'Ya Rafi\u2019 (repeat)',
    section: 'The Name al-Rafi\u2019',
    page: '41',
  },
  {
    id: 'friend-al-halim',
    number: 12,
    title: 'Ya Halim: calming anger',
    purpose: 'Calming anger.',
    how: 'Sit quietly. Repeat "Ya Halim" (O Forbearing) and think on God as patient and forbearing.',
    words: 'Ya Halim (repeat)',
    section: 'The Name al-Halim',
    page: '41',
  },
  {
    id: 'friend-al-azim',
    number: 13,
    title: 'Ya Azim: warding anxiety',
    purpose: 'Warding anxiety.',
    how: 'Sit quietly. Repeat "Ya Azim" (O Magnificent) and think on God as great and magnificent.',
    words: 'Ya Azim (repeat)',
    section: 'The Name al-Azim',
    page: '41',
  },
  {
    id: 'friend-al-shakur',
    number: 14,
    title: 'Ya Shakur: preserving blessings',
    purpose: 'Preserving blessings.',
    how: 'Sit quietly. Repeat "Ya Shakur" (O Most Appreciative) and think on God as the one who thanks and rewards.',
    words: 'Ya Shakur (repeat)',
    section: 'The Name al-Shakur',
    page: '41',
  },
  {
    id: 'friend-al-wadud',
    number: 15,
    title: 'Ya Wadud: harmonising relationships',
    purpose: 'Harmonising relationships.',
    how: 'Sit quietly. Repeat "Ya Wadud" (O Most Loving) and think on God as loving and beloved.',
    words: 'Ya Wadud (repeat)',
    section: 'The Name al-Wadud',
    page: '41',
  },
  {
    id: 'friend-al-baith',
    number: 16,
    title: 'Ya Baith: stirring motivation',
    purpose: 'Stirring motivation.',
    how: 'Sit quietly. Repeat "Ya Ba\u2019ith" (O Resurrector) and think on God as the one who wakes the dead and the sleeping heart.',
    words: 'Ya Ba\u2019ith (repeat)',
    section: 'The Name al-Ba\u2019ith',
    page: '41',
  },
  {
    id: 'friend-al-haqq',
    number: 17,
    title: 'Ya Haqq: truth and conviction',
    purpose: 'Truth and conviction.',
    how: 'Sit quietly. Repeat "Ya Haqq" (O Truth) and think on God as the truth that never changes.',
    words: 'Ya Haqq (repeat)',
    section: 'The Name al-Haqq',
    page: '41',
  },
  {
    id: 'friend-al-qawi',
    number: 18,
    title: 'Ya Qawi: endurance',
    purpose: 'Endurance.',
    how: 'Sit quietly. Repeat "Ya Qawi" (O All-Strong) and think on God as strong beyond all strength.',
    words: 'Ya Qawi (repeat)',
    section: 'The Name al-Qawi',
    page: '42',
  },
  {
    id: 'friend-al-matin',
    number: 19,
    title: 'Ya Matin: unshakable firmness',
    purpose: 'Unshakable firmness.',
    how: 'Sit quietly. Repeat "Ya Matin" (O Firm), or "Ya Qawiyyu ya Matin" (O All-Strong, O Firm), and think on God as firm and unshakable.',
    words: 'Ya Matin, or Ya Qawiyyu ya Matin (repeat)',
    section: 'The Name al-Matin',
    page: '42',
  },
  {
    id: 'friend-al-wali',
    number: 20,
    title: 'Ya Wali: entrust a vulnerable matter to God\u2019s guardianship',
    purpose: 'Entrusting vulnerable affairs to God\u2019s guardianship.',
    how: 'Sit in surrender. Repeat "Ya Wali" (O Guardian, O Protecting Friend) and think on God as Protector.',
    words: 'Ya Wali (repeat)',
    section: 'The Name al-Wali',
    page: '42',
  },
  {
    id: 'friend-al-mubdi',
    number: 21,
    title: 'Ya Mubdi\u2019: soundness in a new undertaking',
    purpose: 'Soundness in new undertakings.',
    how: 'Sit in brief stillness. Repeat "Ya Mubdi\u2019" (O Originator of Creation) and ask for a wholesome start.',
    words: 'Ya Mubdi\u2019 (repeat)',
    section: 'The Name al-Mubdi\u2019',
    page: '42',
  },
  {
    id: 'friend-al-muhyi',
    number: 22,
    title: 'Ya Muhyi: awakening a dull heart',
    purpose: 'Awakening a dull heart.',
    how: 'Close your eyes. Turn your gaze to your heart. Softly recite "Ya Muhyi" (O Giver of Life).',
    words: 'Ya Muhyi (recite softly)',
    section: 'The Name al-Muhyi',
    page: '42',
  },
  {
    id: 'friend-al-mumit',
    number: 23,
    title: 'Ya Mumit: subduing negative compulsions',
    purpose: 'Subduing negative compulsions.',
    how: 'I have the title and the purpose only. The steps for this one are still in the notebook chat, and I will add them here when I copy them out.',
    note: 'Only the title was copied out so far. The steps are not in hand yet.',
    section: 'The Name al-Mumit',
    page: '42',
  },
  {
    id: 'friend-al-qayyum',
    number: 24,
    title: 'Ya Qayyum: settling disordered affairs, inward clarity',
    purpose: 'Settling disordered affairs and inward clarity.',
    how: 'Sit in seclusion with a calm and collected mind. Recite "Ya Qayyum" (O Self-Subsisting) and reflect that all things are held upright by God.',
    words: 'Ya Qayyum (repeat)',
    section: 'The Name al-Qayyum',
    page: '42',
  },
  {
    id: 'friend-al-sabur',
    number: 25,
    title: 'Ya Sabur: patience and steadfastness in trials',
    purpose: 'Patience and steadfastness in trials.',
    how: 'Sit peacefully. Invoke "Ya Sabur" (O Most Patient) and ask for steady perseverance.',
    words: 'Ya Sabur (repeat)',
    section: 'The Name al-Sabur',
    page: '50',
  },
];
