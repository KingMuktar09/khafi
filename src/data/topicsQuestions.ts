/**
 * Questions: short answers to common questions, gathered from the
 * Al Asrar notebook (NotebookLM, "Al-Asrār: The Master Grimoire",
 * 98 sources), 18 Nov 2026.
 *
 * Same rules as the Topics: simple and easy words, deep explanation,
 * Arabic with transliteration and plain meaning, source shown for
 * every answer. Nothing here is invented.
 *
 * Seven of the nine questions also have a full long-form discussion in
 * src/data/topicsContent.ts (topicId). The Picatrix question and the
 * Science of Letters question have no full topic, because the sources
 * do not give a long-form discussion for them.
 */

import type { TopicQuote, TopicTerm } from './topicsContent';

export interface TopicQuestion {
  id: string;
  question: string;
  /** Short answer, 2 to 3 short paragraphs. */
  answer: string[];
  /** Source book and page for every point. */
  sources: string[];
  /** Full long-form discussion, when one exists. */
  topicId?: string;
  quote?: TopicQuote;
  terms?: TopicTerm[];
}

export const TOPIC_QUESTIONS: TopicQuestion[] = [
  {
    id: 'what-is-the-ruh',
    question: 'What is the ruh, the soul?',
    answer: [
      'The ruh is the soul. The books say it is a luminous, subtle substance. It comes from Alam al-Amr, the World of Command, not from the physical world. The Quran says, "The Spirit is of the command of my Lord." God breathed it into Adam\u2019s clay.',
      'The ruh and the nafs struggle over the heart. The ruh is masculine, the nafs is feminine, and the heart stands between them. When the nafs dies to its lower desires, the ruh returns to its first purity.',
      'The body is its cage and its vehicle. The brain is its receiving station. Consciousness comes from the ruh, not from the brain.',
    ],
    sources: [
      'The Holy Quran, 17:85 ("The Spirit is of the command of my Lord"); 15:29 (breathed into Adam\u2019s clay).',
      'Ibn al-Qayyim, The Soul\u2019s Journey After Death.',
      'Fath-ar-Rabbani.',
      'Chittick, The Sufi Path of Knowledge.',
      'Masnavi.',
      'The Mirror.',
    ],
    topicId: 'ruh-and-soul',
    terms: [
      { arabic: 'روح', transliteration: 'ruh', meaning: 'spirit, soul' },
      { arabic: 'عالم الأمر', transliteration: '\u2019Alam al-Amr', meaning: 'the World of Command' },
    ],
  },
  {
    id: 'what-is-special-about-alif',
    question: 'What is special about the letter Alif?',
    answer: [
      'Alif is the first letter, and its Abjad value is 1. It stands upright and joins to nothing before it. It belongs to the Throne and to the Intellect, and it stands in a fiery septet of seven letters.',
      'The books tell how Alif came to be. A drop fell from the head of the Pen and became the Hamza, and the Hamza became the Alif. The letter is born from the Pen itself.',
      'Alif also stands above the Sphere of Intellect, with Ayn below it, on the Wheel of Letter Dispositions. The wheel is the map of how letters move and change.',
    ],
    sources: [
      'Schimmel, Mystical Dimensions of Islam, Appendix 1, pp. 411-420.',
      'Usul \u2019Ilm al-Huruf, pp. 1-2 (the drop from the Pen\u2019s head).',
      'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 43.',
      'al-Asrar al-Rabbaniyyah, pp. 88-91 (Alif above the Sphere of Intellect).',
    ],
    topicId: 'letter-alif',
    terms: [
      { arabic: 'ألف', transliteration: 'Alif', meaning: 'the first letter' },
      { arabic: 'أبجد', transliteration: 'Abjad', meaning: 'the letter-number system' },
      { arabic: 'دائرة تصريف الحروف', transliteration: 'Da\u2019irat Tasrif al-Huruf', meaning: 'the Wheel of Letter Dispositions' },
    ],
  },
  {
    id: 'did-solomon-have-a-ring',
    question: 'Did Solomon really have a ring?',
    answer: [
      'The Quran says Solomon had dominion over the jinn and the wind. It does not name a physical ring. The ring comes from the later books. The Seal of Solomon is the archetype of all seals, the pattern every seal follows.',
      'The Shams names four inscribed layers, as told by Wahb ibn Munabbih. The first says, "I am God; I have never ceased." The second says, "I am God, the Living, the Everlasting." The third says, "I am God, the Mighty." The fourth is the Throne Verse. The same inscription was written on Adam\u2019s heart from the beginning. And the books give a 3x3 square of Solomon, also tied to Adam and Asaf, famous as al-Ghazali\u2019s.',
      'The Manba\u2019 names seven glyphs of the Greatest Name seal: a five-pointed star, three rods, a blind tailless Mim, a ladder, four fingertip strokes, a cleft Ha, and a curved Waw. The books say 72 tribes of jinn, not 72 single spirits. And Rumi reads the heart as Solomon, ruling five outer senses and five inner senses, the way Solomon ruled the jinn.',
    ],
    sources: [
      'The Holy Quran (Solomon\u2019s dominion over the jinn and the wind; no physical ring is named).',
      'Shams al-Ma\u2019arif al-Kubra (John Friend), pp. 57-58 (four inscribed layers, as told by Wahb ibn Munabbih); p. 59 (the inscription on Adam\u2019s heart).',
      'Manba\u2019 Usul al-Hikma, pp. 22-23 (seven glyphs of the Greatest Name seal).',
      'The Radiant Jewels for Summoning, pp. 47-48 (the 3x3 square of Solomon); p. 108 (72 tribes of jinn).',
      'Rumi, Mathnawi, Book I, vv. 3575-3581, printed pp. 195-196 (the heart is Solomon, the senses are jinn).',
      'Tested Remedies, Glossary, p. 79; Kitab al-Ajnas, Glossary, p. 147; Hadha Hijab, Glossary, p. 30 (the Seal as archetype of all seals).',
    ],
    topicId: 'seal-of-solomon',
    terms: [
      { arabic: 'خاتم سليمان', transliteration: 'Khatam Sulayman', meaning: 'the Seal of Solomon' },
      { arabic: 'جن', transliteration: 'jinn', meaning: 'unseen beings' },
    ],
  },
  {
    id: 'three-kinds-of-dreams',
    question: 'What are the three kinds of dreams?',
    answer: [
      'Three kinds. The true dream, ru\u2019ya sadiqah, is glad tidings from God, and the books call it one-forty-sixth of prophecy. The Satanic dream, hulm, is a terror that frightens and confuses. The third kind is the talk of the soul with itself, the day\u2019s thoughts coming back at night.',
      'Imam Ali said that in deep sleep the soul ascends toward the Divine Throne. A soul that reaches it witnesses true visions. A soul that is stopped on the way experiences muddled dreams.',
      'Ibn Arabi says sleep detaches the soul from its sensory duties, and it enters Alam al-Mithal, the world of likeness. There, abstract meanings take visible shapes. Knowledge, for example, appears as milk. The books say not to chase the frightening kind, and not to tell it to others.',
    ],
    sources: [
      'Ibn al-Qayyim, The Soul\u2019s Journey After Death, pp. 30-36.',
      'The Mirror, Ch. 14, pp. 83-85.',
      'Chittick, The Sufi Path of Knowledge, Ch. 9, pp. 115ff.',
      'Imam Ali (as quoted in the Al Asrar notebook answer: the soul ascends toward the Throne in deep sleep).',
      'Ibn Arabi (as quoted in the Al Asrar notebook answer: sleep enters Alam al-Mithal; knowledge appears as milk).',
    ],
    topicId: 'three-kinds-of-dreams',
    terms: [
      { arabic: 'رؤيا صادقة', transliteration: 'ru\u2019ya sadiqah', meaning: 'true dream' },
      { arabic: 'حديث النفس', transliteration: 'hadith al-nafs', meaning: 'the soul\u2019s talk with itself' },
      { arabic: 'شيطاني', transliteration: 'shaytani', meaning: 'from Shaytan' },
    ],
  },
  {
    id: 'what-happened-when-solomon-died',
    question: 'What happened when Solomon died?',
    answer: [
      'Solomon died leaning on his staff, and no one knew. A termite, the creature of the earth, gnawed through the wooden core of the staff. It broke, his body fell, and only then did the jinn see he was dead.',
      'Tafsir Ibn Kathir adds what happened around it. Solomon had confiscated the deceptive books that devils dictated to soothsayers, and he buried them under his throne. He warned he would execute anyone who claimed the jinn knew the Unseen. After his death, Satan dug the books up, to slander Solomon as a sorcerer.',
      'The lesson is plain. If the jinn had known the unseen, they would not have stayed in the humiliating torment. Imam Ali cites Solomon\u2019s death in Nahj al-Balagha as the ultimate lesson on the inevitability of death.',
    ],
    sources: [
      'The Holy Quran, Surat Saba\u2019 (34), verse 14, printed p. 430.',
      'Tafsir Ibn Kathir, exegesis of 2:102 and 34:14, printed pp. 71-72 [110-111].',
      'Nahj al-Balagha, Sermon 182, printed p. 326 (Imam Ali on Solomon\u2019s death).',
    ],
    topicId: 'surah-saba-34-14',
    quote: {
      arabic: 'فَلَمَّا خَرَّ تَبَيَّنَتِ الْجِنُّ أَن لَّوْ كَانُوا يَعْلَمُونَ الْغَيْبَ مَا لَبِثُوا فِي الْعَذَابِ الْمُهِينِ',
      transliteration: 'Fa-lamma kharra tabayyanat al-jinnu anna law kanu ya\u2019lamuna al-ghayba ma labithu fi al-\u2019adhab al-muhin',
      text: 'When he fell, it became clear to the jinn that had they known the unseen, they would not have stayed in the humiliating punishment.',
      source: 'Qur\u2019an 34:14',
    },
    terms: [
      { arabic: 'دابة الأرض', transliteration: 'dabbat al-ard', meaning: 'the creature of the earth' },
      { arabic: 'منسأة', transliteration: 'minsa\u2019ah', meaning: 'staff' },
    ],
  },
  {
    id: 'what-is-alam-al-mithal',
    question: 'What is Alam al-Mithal?',
    answer: [
      'Alam al-Mithal is the world of likeness, the world of similitudes. It stands between the physical world and the world of sovereignty. In it, meanings take visible shapes. Knowledge appears as milk. A feeling appears as a colour. What is abstract here becomes a form there.',
      'Dreams take place in this world. In sleep, the soul is freed from the senses and enters it. That is why a dream can show you something true in a shape that is not literal.',
    ],
    sources: [
      'Ibn Arabi (as quoted in the Al Asrar notebook answer: sleep enters Alam al-Mithal; knowledge appears as milk).',
      'Chittick, The Sufi Path of Knowledge, Ch. 9.',
    ],
    topicId: 'alam-al-malakut',
    terms: [
      { arabic: 'عالم المثال', transliteration: '\u2019Alam al-Mithal', meaning: 'the world of likeness' },
    ],
  },
  {
    id: 'who-are-rijal-al-ghayb',
    question: 'Who are the Rijal al-Ghayb?',
    answer: [
      'The Rijal al-Ghayb are the Men of the Unseen, the hidden men the world turns on. At the top stands the Qutb, the Pole, also called the Ghawth, the Helper. The books say he is in Mecca.',
      'Below him stand the Two Imams, the Four Pillars, the Seven Substitutes, and the wider circles: seventy Nobles and three hundred Chiefs. Each rank answers to the one above it, and when one man dies another rises in his place.',
    ],
    sources: [
      'Mudih al-Tariq, pp. 83-85 (the hierarchy of the Rijal al-Ghayb).',
      'The Radiant Jewels for Summoning, p. 81.',
      'Mystical Dimensions of Islam, pp. 200-201.',
    ],
    topicId: 'rijal-al-ghayb',
    terms: [
      { arabic: 'رجال الغيب', transliteration: 'Rijal al-Ghayb', meaning: 'the Men of the Unseen' },
      { arabic: 'قطب', transliteration: 'Qutb', meaning: 'the Pole, the axis the world turns on' },
    ],
  },
  {
    id: 'why-do-letters-work',
    question: 'Why does the Science of Letters work?',
    answer: [
      'The books give the ground plainly. The letters are the foundation. Each letter carries a number, and the numbers are the spirits of the letters. God taught Adam the names, and the names are made of letters. So the letters carry the power of the words they form.',
      'The Science of Letters works with that power. It does not invent it. It counts it, combines it, and applies it, the way a builder counts bricks before he builds a wall.',
    ],
    sources: [
      'Manba\u2019 Usul al-Hikma (Adad section: the letters and their values are the foundation).',
      'Usul \u2019Ilm al-Huruf (the letter-number system).',
      'The Holy Quran, 2:31 (God taught Adam the names).',
    ],
    terms: [
      { arabic: 'أبجد', transliteration: 'Abjad', meaning: 'the letter-number system' },
      { arabic: 'عدد', transliteration: 'adad', meaning: 'number' },
    ],
  },
  {
    id: 'is-the-picatrix-in-these-books',
    question: 'Is the Picatrix (Ghayat al-Hakim) in these books?',
    answer: [
      'No. None of the 98 sources in the Al Asrar notebook mention Ghayat al-Hakim, the book known in the West as the Picatrix.',
      'That does not mean the book does not exist. It only means it is not in this collection. If it is added one day, this answer will change.',
    ],
    sources: [
      'Al Asrar notebook, full source list (98 sources). Ghayat al-Hakim is absent.',
    ],
  },
];
