/**
 * Questions: short answers to common questions, gathered from the
 * Al Asrar notebook (NotebookLM, "Al-Asrār: The Master Grimoire",
 * 98 sources), 18 Nov 2026.
 *
 * Same rules as the Topics: simple and easy words, deep explanation,
 * Arabic with transliteration and plain meaning, source shown for
 * every answer. Nothing here is invented.
 *
 * Five of the six questions also have a full long-form discussion in
 * src/data/topicsContent.ts (topicId). The Picatrix question has no
 * full topic, because none of the sources mention the book at all.
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
      'The ruh is the soul. The books say it is a luminous, subtle substance. It comes from Alam al-Amr, the World of Command, not from the physical world.',
      'The body is its cage and its vehicle. The brain is its receiving station. Consciousness comes from the ruh, not from the brain.',
    ],
    sources: [
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
      'Alif is the first letter, and its Abjad value is 1. It stands upright and joins to nothing before it.',
      'It belongs to the Throne and to the Intellect, and it stands in a fiery septet of seven letters. Schimmel explains the set in her appendix on the letters.',
    ],
    sources: [
      'Schimmel, Mystical Dimensions of Islam, Appendix 1, pp. 411-420.',
    ],
    topicId: 'letter-alif',
    terms: [
      { arabic: 'ألف', transliteration: 'Alif', meaning: 'the first letter' },
      { arabic: 'أبجد', transliteration: 'Abjad', meaning: 'the letter-number system' },
    ],
  },
  {
    id: 'did-solomon-have-a-ring',
    question: 'Did Solomon really have a ring?',
    answer: [
      'The Quran says Solomon had dominion over the jinn and the wind. It does not name a physical ring. The ring comes from the later books.',
      'The Shams names four inscribed layers. The Manba\u2019 names seven symbols. And the books say 72 tribes of jinn, not 72 single spirits. Rumi reads the heart as Solomon and the senses as the jinn.',
    ],
    sources: [
      'The Holy Quran (Solomon\u2019s dominion over the jinn and the wind; no physical ring is named).',
      'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 60 (four inscribed layers).',
      'Manba\u2019 Usul al-Hikma, p. 60 (seven symbols).',
      'The Radiant Jewels for Summoning, p. 108 (72 tribes of jinn).',
      'Rumi, Mathnawi I:3575-82 (the heart is Solomon, the senses are jinn).',
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
      'Three kinds. The true dream, ru\u2019ya sadiqah, comes from God. Hadith al-nafs is the talk of the soul with itself, the day\u2019s thoughts coming back at night. The shaytani dream comes from Shaytan, and it frightens and confuses.',
      'The books say not to chase the third kind, and not to tell it to others.',
    ],
    sources: [
      'Ibn al-Qayyim, The Soul\u2019s Journey After Death, pp. 30-36.',
      'The Mirror, Ch. 14, pp. 83-85.',
      'Chittick, The Sufi Path of Knowledge, Ch. 9, pp. 115ff.',
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
      'Solomon died leaning on his staff, and no one knew. A small creature of the earth ate through the staff. It broke, he fell, and only then did the jinn see he was dead.',
      'The lesson is plain. If the jinn had known the unseen, they would not have stayed in the humiliating torment.',
    ],
    sources: [
      'The Holy Quran, Surah Saba (34), verse 14.',
      'Tafsir Ibn Kathir, vol. 2, 3:103, p. 250.',
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
