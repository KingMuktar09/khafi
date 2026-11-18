/**
 * Amals from the books of Ahmad al-Buni — verified against the real book
 * in this library: "The Sun of Knowledge: Shams al-Ma'arif", translated
 * by Amina Inloes (Revelore Press, 2021).
 *
 * These 25 are beginner-friendly and safe only: simple recitations, short
 * spoken prayers, or a short prayer of two rak'ahs. Nothing here needs
 * writing, amulets, fasting, seclusion, or contact with spirits — those
 * parts of the book were left out on purpose.
 *
 * "PDF p." is the page number in the library's PDF file of the book.
 * Each amal was read from the book itself, not guessed.
 *
 * This is the Inloes translation, NOT the "John Friend English version".
 * No edition in the library is labelled as the John Friend version, so
 * nothing here is presented as coming from that edition.
 */

export interface BuniAmal {
  id: string;
  title: string;
  /** What it is for, in one plain line. */
  purpose: string;
  /** How to do it, in simple English — the full detail from the book. */
  how: string;
  /** The exact words or phrase to say, where the book gives them. */
  words?: string;
  /** An honest note about the book's own words (what was left out, or
   *  where the book is unclear). Shown as-is, never hidden. */
  note?: string;
  /** Book chapter, e.g. "Chapter 5". */
  chapter: string;
  /** Section name inside the chapter, as printed in the book. */
  section: string;
  /** Page number(s) in the library's PDF file, e.g. "178" or "178–179". */
  pdfPage: string;
}

/** The three chapters these amals come from, with their book titles. */
export const BUNI_CHAPTERS: Array<{ chapter: string; title: string }> = [
  { chapter: 'Chapter 5', title: 'The Secrets of Bismillah' },
  { chapter: 'Chapter 8', title: 'The Four Seasons — the divine names' },
  { chapter: 'Chapter 10', title: 'A Miscellany of Tried-and-True Talismans' },
];

/** Exact title of the book in the catalog, used to link to it. */
export const BUNI_BOOK_TITLE = 'The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif';

/** The other al-Buni book in the library: the Arabic manuscript scans. */
export const BUNI_MANUSCRIPT_TITLE = 'Al-buni Shams-al-maarif-manuscript-1500';

export const BUNI_AMALS: BuniAmal[] = [
  {
    id: 'buni-night-protection',
    title: 'Night protection — recite Bismillah 121 times before sleep',
    purpose: 'Protection from Satan, theft, sudden death and misfortune while you sleep.',
    how: 'Before sleeping, recite "Bismillah al-Rahman al-Rahim" (In the name of God, the Merciful, the Compassionate) 121 times.',
    words: 'Bismillah al-Rahman al-Rahim — 121 times',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '178',
  },
  {
    id: 'buni-provision-sunrise',
    title: 'Provision at sunrise — recite Bismillah 300 times, then 100 salawat',
    purpose: 'Provision and sustenance from unexpected places.',
    how: 'At sunrise, facing the sunrise, recite Bismillah 300 times, then send blessings on the Prophet Muhammad 100 times. The book says to keep doing it regularly.',
    words: 'Bismillah — 300 times, then blessings on the Prophet — 100 times',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '178',
  },
  {
    id: 'buni-wish-friday',
    title: 'A wish on Friday — recite Bismillah 113 times during the sermon',
    purpose: 'A secret wish you want granted.',
    how: 'On Friday, while the imam is giving the sermon, recite Bismillah 113 times with your wish in mind, then raise your hands and ask God for it.',
    words: 'Bismillah — 113 times',
    note: 'The book says to recite during the imam’s sermon. Some scholars say one should listen to the khutbah in silence — the book’s instruction is given here as written.',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '178–179',
  },
  {
    id: 'buni-aims-desires',
    title: 'Aims and desires — recite Bismillah 786 times for 7 days',
    purpose: 'Getting something good you want, or keeping away something bad.',
    how: 'Recite Bismillah 786 times (its numerical value) every day for 7 days, keeping your specific aim in mind.',
    words: 'Bismillah — 786 times, every day for 7 days',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '177–178',
  },
  {
    id: 'buni-pain',
    title: 'Pain — recite Bismillah 100 times for 3 days',
    purpose: 'Relief from pain.',
    how: 'If you are in pain, recite Bismillah 100 times a day for 3 days.',
    words: 'Bismillah — 100 times a day, for 3 days',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '178',
  },
  {
    id: 'buni-oppressor',
    title: 'Facing an oppressor — recite Bismillah 50 times',
    purpose: 'Safety when you come face to face with an oppressor or a harsh, powerful person.',
    how: 'Recite Bismillah 50 times when facing them. The book says God will put fear of you in their heart and save you from danger.',
    words: 'Bismillah — 50 times',
    chapter: 'Chapter 5',
    section: 'The Virtues of Bismillah al-Rahman al-Rahim',
    pdfPage: '178',
  },
  {
    id: 'buni-morning-evening',
    title: 'Morning and evening protection — say "Bismillah al-a\'zam" 3 times',
    purpose: 'Protection from harm for the whole day, and safety through the night.',
    how: 'On waking, say "In the name of God, the Greatest" (Bismillah al-a\'zam) 3 times. Say it 3 times again in the evening.',
    words: 'Bismillah al-a\'zam (In the name of God, the Greatest) — 3 times, morning and evening',
    chapter: 'Chapter 5',
    section: 'Further Virtues of Bismillah al-Rahman al-Rahim in the Prophetic Tradition',
    pdfPage: '197',
  },
  {
    id: 'buni-begin-prayer',
    title: 'Begin every prayer and reading with Bismillah',
    purpose: 'Safety in this world and the next, and an easy death and grave.',
    how: 'Start every prayer and every reading of scripture with Bismillah. The book says whoever does this has no fear of the questioning angels, and God eases the pangs of death and widens their grave.',
    words: 'Bismillah — at the start of every prayer and reading',
    chapter: 'Chapter 5',
    section: 'The Gospel',
    pdfPage: '190–191',
  },
  {
    id: 'buni-home-entry',
    title: 'Bismillah when entering and leaving home',
    purpose: 'Safety at home and outside.',
    how: 'When you enter and leave your home, say: "In the name of God, we enter and leave, and in God we trust."',
    words: '"In the name of God, we enter and leave, and in God we trust."',
    chapter: 'Chapter 5',
    section: 'Further Virtues of Bismillah al-Rahman al-Rahim in the Prophetic Tradition',
    pdfPage: '198',
  },
  {
    id: 'buni-before-sleep',
    title: 'Bismillah before sleep',
    purpose: 'Protection through the night.',
    how: 'Before going to sleep, say: "Bismillah, and upon the path of the Messenger of God."',
    words: '"Bismillah, and upon the path of the Messenger of God."',
    chapter: 'Chapter 5',
    section: 'Further Virtues of Bismillah al-Rahman al-Rahim in the Prophetic Tradition',
    pdfPage: '198',
  },
  {
    id: 'buni-ya-allah',
    title: 'Call "Ya Allah" and ask for what you need',
    purpose: 'Anything you need from God.',
    how: 'Say "O God!" (Ya Allah) and ask Him for what you need. The book says God answers: "I am here, My servant! I am God, so what do you need?"',
    words: '"Ya Allah" (O God!)',
    chapter: 'Chapter 5',
    section: 'On the Nature of God',
    pdfPage: '216',
  },
  {
    id: 'buni-hidden-name',
    title: "A short prayer with God's hidden name",
    purpose: "Any need, using God's hidden name.",
    how: 'Recite this short prayer: "O God! I beseech You by Your hidden name: the Pure, the Purifying, the Sacred, the Ever-living, the Everlasting. In the name of God, the Compassionate, the Merciful — Mighty and Generous."',
    chapter: 'Chapter 5',
    section: 'Prayers',
    pdfPage: '217',
  },
  {
    id: 'buni-important-matter',
    title: 'A short prayer for an important matter',
    purpose: 'An important need, asking God to take care of all of it.',
    how: 'Recite this prayer: "O God! I ask You, because You are God, in absolute truth! And because You are God, whatever condition or fortune I am in. And because You are God, the Sacred. You alone are the Unique, the Eternal. You have no opposite or like, no opponent or peer. And because You are God, whom none is like! \'And He is Hearing, Seeing.\' Bless our master Muhammad and the family of Muhammad, and bless whoever loves Muhammad. Take care of what I need — all of it — in a way that will be beneficial for my worldly life and my afterlife — so that I may be guarded by Your shepherding, protected from pitfalls, looked after by Your care. O You who always returns good! Revered and forgiving! O source of blessings!" The book says this prayer contains the Greatest Name of God.',
    chapter: 'Chapter 5',
    section: 'Prayers',
    pdfPage: '217–218',
  },
  {
    id: 'buni-ya-rahman-rahim',
    title: 'Ya Rahman, Ya Rahim — be treated kindly',
    purpose: 'Being treated kindly by people in all situations.',
    how: 'Recite the two names al-Rahman (the Merciful) and al-Rahim (the Compassionate) often.',
    words: 'al-Rahman, al-Rahim — often',
    chapter: 'Chapter 8',
    section: "Employing the divine names 'the Merciful' and 'the Compassionate'",
    pdfPage: '252',
  },
  {
    id: 'buni-ya-salam',
    title: 'Ya Salam — protection from calamity',
    purpose: 'Protection from calamities.',
    how: 'Recite al-Salam (the Peace) often.',
    words: 'al-Salam — often',
    note: 'The book adds a further claim here (falling into a trance and touching a snake or scorpion unharmed). That part is left out.',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '254',
  },
  {
    id: 'buni-ya-mumin',
    title: 'Ya Mu\'min, 132 times — protection from serious illness',
    purpose: 'Protection from plague and serious illness.',
    how: "Recite al-Mu'min (the Bestower of Security) 132 times regularly.",
    words: "al-Mu'min — 132 times",
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '254',
  },
  {
    id: 'buni-ya-razzaq',
    title: 'Ya Razzaq — provision',
    purpose: 'Provision and sustenance from places you never expected.',
    how: 'Recite al-Razzaq (the Sustainer) often.',
    words: 'al-Razzaq — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '255',
  },
  {
    id: 'buni-ya-wahhab',
    title: 'Ya Wahhab — answered prayers',
    purpose: 'Getting your prayers answered.',
    how: 'Recite al-Wahhab (the Giving) often.',
    words: 'al-Wahhab — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '255',
  },
  {
    id: 'buni-ya-alim',
    title: "Ya 'Alim — speak words of wisdom",
    purpose: 'Speaking wisely.',
    how: "Recite al-'Alim (the Knowing) often. The book says God will make you utter words of wisdom.",
    words: "al-'Alim — often",
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '255',
  },
  {
    id: 'buni-ya-qahhar',
    title: 'Ya Qahhar — control over your desires',
    purpose: 'Gaining power over your lusts and appetites.',
    how: 'Recite al-Qahhar (the Victorious) often.',
    words: 'al-Qahhar — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '255',
  },
  {
    id: 'buni-ya-hafiz',
    title: 'Ya Hafiz — protection from evil schemes',
    purpose: 'Protection from the schemes of evil people, wherever you go.',
    how: 'Recite al-Hafiz (the Protector) often.',
    words: 'al-Hafiz — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '256',
  },
  {
    id: 'buni-ya-mujib',
    title: 'Ya Mujib — a way out of difficulty',
    purpose: 'Finding a way out of any difficulty you fall into.',
    how: 'Recite al-Mujib (the Responder) often.',
    words: 'al-Mujib — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '257',
  },
  {
    id: 'buni-ya-sabur',
    title: 'Ya Sabur — firmness in hard times',
    purpose: 'Firmness when facing adversity and the troubles of life.',
    how: 'Recite al-Sabur (the Patient) often.',
    words: 'al-Sabur — often',
    chapter: 'Chapter 8',
    section: 'The Other Divine Names',
    pdfPage: '262',
  },
  {
    id: 'buni-surah-fath',
    title: "Recite the opening of Surah al-Fath (Qur'an 48) — victory and divine help",
    purpose: "Victory and God's help when you are weak, defeated, or in difficulty.",
    how: 'Recite the opening of Surah al-Fath (chapter 48, "The Victory"). The book says reciting it turns the meek into the mighty and the weak into the strong, and God assists the reciter in ways they cannot imagine.',
    words: 'The opening of Surah al-Fath (Qur’an 48)',
    note: 'The book does not say how many verses "the opening" means. The other uses in this entry involve writing on parchment, a battle-standard or a cup — those are not included here.',
    chapter: 'Chapter 10',
    section: 'Victory and Divine Aid',
    pdfPage: '274',
  },
  {
    id: 'buni-two-rakahs-maghrib',
    title: "Two rak'ahs after Maghrib — protection from someone who wishes you harm",
    purpose: 'Protection from a person you fear will betray you or wishes you ill.',
    how: 'After the sunset (Maghrib) prayer, pray 2 rak\'ahs: in the first, recite Surah al-Fatiha (1) and Surah al-Kafirun (109); in the second, recite Surah al-Fatiha (1) and Surah al-Falaq (113). Then say: "O God, O Sufficer, protect me from the evil of [the person]."',
    words: '"O God, O Sufficer, protect me from the evil of [the person]." — after 2 rak’ahs',
    note: 'The book then adds writing names and placing them in a turban — that written part is not included here.',
    chapter: 'Chapter 10',
    section: 'Outwitting Enemies',
    pdfPage: '291',
  },
];
