/**
 * Amals from the John Friend edition of Shams al-Ma'arif al-Kubra:
 * "Shams al-Ma'arif al-Kubra: The Complete Sun of Divine Knowledge",
 * translated by John Friend (John Friend Publishing, 2026).
 *
 * This edition is NOT in the library's catalog. It lives in the
 * Al Asrar notebook ("Al-Asrār: The Master Grimoire", 98 sources),
 * file "Shams Al Marif Al Kubra- Al Ahmad al buni.pdf", as identified
 * by the notebook's own Gemini chat. The notebook delivered 25 amals
 * from Chapter Two: The Divine Names, printed pp. 42-50.
 *
 * Only Nos. 20-25 are copied out here. Amals 1-19 are in the notebook
 * chat (tab t1) and are NOT yet copied out. They must not be added
 * until they are in hand.
 *
 * Each amal is a short Name recitation with quiet reflection. The
 * notebook's closing warning is shown with the set: these are
 * historical curiosities from an ancient medieval grimoire, do them
 * entirely at your own risk, and they do not replace professional
 * medical, mental health or financial care.
 *
 * The Arabic names and their meanings match the site's own 99 Names
 * data (src/data/asmaNames.ts): al-Wali the Protecting Friend,
 * al-Mubdi the Originator of Creation, al-Muhyi the Giver of Life,
 * al-Mumit the Bringer of Death, al-Qayyum the Self-Subsisting,
 * al-Sabur the Most Patient.
 */

export interface FriendAmal {
  id: string;
  /** Number in the notebook's Chapter Two set, 20-25. */
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
