/**
 * Topics: long-form discussions, gathered from the Al Asrar notebook
 * (NotebookLM, "Al-Asrār: The Master Grimoire", 98 sources), 18 Nov 2026.
 *
 * Standard length and structure for every topic: a first-person intro,
 * sections in order, a closing, and a source list. Simple and easy
 * words, deep explanation, quotations from books and the Quran where
 * they fit. Very few em dashes, not many commas, no difficult words.
 * Arabic terms are shown with Arabic script, transliteration and a
 * plain-English meaning. Nothing here is invented.
 *
 * The Alam al-Malakut discussion is the opening only. The rest is
 * still in the notebook chat (tab t1). That is marked on the page.
 */

import type { ViewName } from '../types';

export interface TopicQuote {
  arabic?: string;
  transliteration?: string;
  text: string;
  source: string;
}

export interface TopicSection {
  heading: string;
  paragraphs: string[];
  quote?: TopicQuote;
}

export interface TopicTerm {
  arabic: string;
  transliteration: string;
  meaning: string;
}

export interface TopicContent {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  /** Date the topic was added, ISO (e.g. '2026-11-18'). Shown on the hub card. Never invented. */
  addedDate: string;
  /** First-person intro, in Khafi's voice. */
  intro: string;
  sections: TopicSection[];
  /** Arabic terms used in the discussion. */
  terms: TopicTerm[];
  /** First-person closing, in Khafi's voice. */
  closing: string;
  /** Full source list, book and page. */
  sources: string[];
  /** Shown when the discussion is not complete yet. */
  continuesNote?: string;
}

export const TOPICS: TopicContent[] = [
  {
    id: 'ibn-arabi-40-day-retreat',
    slug: '40-day-retreat',
    title: 'Ibn Arabi\u2019s 40-Day Retreat',
    eyebrow: 'Topics',
    subtitle: 'A forty-day seclusion, and the worlds that open before the seeker, one after another.',
    addedDate: '2026-11-18',
    intro:
      'I want to tell you about a journey Ibn Arabi describes. It takes forty days. It is a retreat, a khalwa, a time alone with God. The seeker sits in seclusion and the worlds open before him, one after another. I read this in The Journey to the Lord of Power, and I will walk you through it as the book tells it.',
    sections: [
      {
        heading: 'What the retreat is',
        paragraphs: [
          'Khalwa means seclusion. The seeker leaves the world and sits alone with God for forty days. He does not go out. He does not speak to men. He sits, and he remembers.',
          'The book says the worlds then come to him, in order. Each world is a phase of the road. Each world offers a gift. And each gift is a trap.',
        ],
      },
      {
        heading: 'The world of minerals',
        paragraphs: [
          'First the mineral world opens. Every mineral shows its hidden powers. Some heal. Some harm. Some hide occult virtues no eye has seen.',
          'Then the trap comes. The desire to make gold, to learn alchemy, pulls at the seeker. If he stops for it, he stays in the mineral plane. The book says he must pass on.',
        ],
      },
      {
        heading: 'The green world',
        paragraphs: [
          'Next the world of plants opens. Every tree, every leaf, every herb calls out to him. Each one tells him what it can heal and what it can do.',
          'The temptation here is to become a master physician, a healer of all ills. The book says he must pass on in dhikr, in remembrance, and not stop.',
        ],
      },
      {
        heading: 'The world of animals',
        paragraphs: [
          'Then the animal world opens. Beasts and birds and creatures of the water greet the wayfarer. They know his rank, and they speak to it.',
          'The temptation is mastery over animals and the language of birds. A great power, and a great trap. The book says he must pass on.',
        ],
      },
      {
        heading: 'The spheres and the sanctuaries',
        paragraphs: [
          'After the animals come the planetary spheres and the angelic sanctuaries. The heavens open above the seeker. The planetary intelligences and the cosmic geometry stand before him.',
          'The road climbs past the spheres, past the heavens, toward what lies beyond them.',
        ],
      },
      {
        heading: 'The swaying lamp: the greatest trap',
        paragraphs: [
          'Beyond the heavens a light sways like a lamp in a breeze. All the many things vanish. Only the light remains.',
          'This is the greatest trap of the whole road. Ibn Arabi and his commentator Abd al-Karim al-Jili both warn about it. The light is not the Uncreated Essence. It is only the radiance of the seeker\u2019s own purified spirit, shining back at him. Many stop here, thinking they have arrived. They have not.',
        ],
      },
      {
        heading: 'Standing before the Real',
        paragraphs: [
          'Past the lamp, the final veils lift. The soul stands on the carpet of the Vision of the Real, bisat al-shuhud. Speech ceases. There is nothing left to say, because there is nothing left between the seeker and the Real.',
        ],
      },
      {
        heading: 'Two ranks at the end',
        paragraphs: [
          'At the end of forty days the seekers stand in two ranks. The first are the Extinguished, al-Mustahlikun, also called al-Waqifun, those who stand still. They are frozen in annihilation. They are the majadhib, the enraptured ones, pulled away from the world.',
          'The second are the Returning Masters, al-Mardudun, also called al-\u2019Arifun, the Knowers. They are sent back to creation, al-ruju\u2019 ila al-khalq, in sobriety, sahw. They come back to teach. The book holds the second rank higher, because the return is harder than the going.',
        ],
      },
    ],
    terms: [
      { arabic: 'خلوة', transliteration: 'khalwa', meaning: 'seclusion, the retreat' },
      { arabic: 'ذكر', transliteration: 'dhikr', meaning: 'remembrance of God' },
      { arabic: 'بساط الشهود', transliteration: 'bisat al-shuhud', meaning: 'the carpet of the Vision of the Real' },
      { arabic: 'المستهلكون', transliteration: 'al-Mustahlikun', meaning: 'the Extinguished, those consumed' },
      { arabic: 'الواقفون', transliteration: 'al-Waqifun', meaning: 'those who stand still' },
      { arabic: 'المردودون', transliteration: 'al-Mardudun', meaning: 'the Returned ones' },
      { arabic: 'العارفون', transliteration: 'al-\u2019Arifun', meaning: 'the Knowers' },
      { arabic: 'صحو', transliteration: 'sahw', meaning: 'sobriety' },
      { arabic: 'الرجوع إلى الخلق', transliteration: 'al-ruju\u2019 ila al-khalq', meaning: 'the return to creation' },
      { arabic: 'مجاذيب', transliteration: 'majadhib', meaning: 'the enraptured ones, those pulled away' },
    ],
    closing:
      'I read this and I sat with it for a long time. The road is not about the wonders. The wonders are the traps. The road is about passing on, again and again, until nothing is left but the Real. That is the lesson I take from it. And the book says the returning ones are the true masters, because they come back to us.',
    sources: [
      'The Journey to the Lord of Power by Muhammad ibn-Arabi: minerals, pp. 36-37; vegetal world, p. 37; animal world, pp. 37-38; the swaying lamp, Commentary Notes, p. 87 (also p. 45); the two ranks, pp. 28-29, pp. 29, 44, 51, Glossary p. 116.',
    ],
    continuesNote:
      'More to come: the notebook offered a follow-up on the Quranic drinks and the meeting with al-Khidr (pp. 50-51, 68). I have not gathered that part yet. It will come here when I do.',
  },
  {
    id: 'alam-al-malakut',
    slug: 'alam-al-malakut',
    title: 'Alam al-Malakut',
    eyebrow: 'Topics',
    subtitle: 'The luminous world behind this world, and the three worlds that hold all things.',
    addedDate: '2026-11-18',
    intro:
      'There is a world behind this world. You cannot touch it. But it holds this world up, the way a root holds a tree. The old books call it Alam al-Malakut, the World of Sovereignty. This is the opening of that discussion. The rest is still being gathered, and I will add it here when it comes.',
    sections: [
      {
        heading: 'Three worlds, one behind the other',
        paragraphs: [
          'The books set out three worlds. First is Alam al-Mulk, the dense physical world of bodies, elements and time. It is the world you can touch.',
          'Second is Alam al-Malakut, the luminous world that lies just beneath the physical world and rules it. Third is Alam al-Jabarut, the world above Malakut, where the divine decrees and the first lights stand. Three worlds, one behind the other, like the skins of an onion.',
        ],
      },
      {
        heading: 'What Malakut is',
        paragraphs: [
          'Malakut is not matter. It is a luminous, non-material matrix. It lies just under the physical world, and it governs it.',
          'The books give it four names, and each name tells you something. It is the World of Command, \u2019alam al-amr. It is the Realm of Invention, \u2019alam al-ikhtira\u2019. It is the Unseen, al-ghayb. And it is the World of Joining, \u2019alam al-ratq.',
        ],
      },
      {
        heading: 'What the Quran says',
        paragraphs: [
          'Mudih al-Tariq grounds all of this in the Quran. God says, "Surely His are the creation and the command." Creation is Mulk. Command is Malakut. The same book quotes God as "Knower of the unseen and the witnessed". The unseen is Malakut. The witnessed is Mulk. The verse draws the line between the two worlds.',
        ],
        quote: {
          arabic: 'أَلَا لَهُ الْخَلْقُ وَالْأَمْرُ',
          transliteration: 'Ala lahu al-khalqu wa al-amr',
          text: 'Surely His are the creation and the command.',
          source: 'Qur\u2019an 7:54, as quoted in Mudih al-Tariq',
        },
      },
      {
        heading: 'The Knower of the unseen',
        paragraphs: [
          'The second phrase the book quotes is a Name of God. He is the Knower of the unseen and the witnessed. The unseen is the world you cannot see. The witnessed is the world in front of your eyes. God knows both, because both are His.',
        ],
        quote: {
          arabic: 'عَالِمُ الْغَيْبِ وَالشَّهَادَةِ',
          transliteration: '\u2019Alim al-ghayb wa al-shahadah',
          text: 'Knower of the unseen and the witnessed.',
          source: 'As quoted in Mudih al-Tariq',
        },
      },
    ],
    terms: [
      { arabic: 'عالم الملك', transliteration: '\u2019Alam al-Mulk', meaning: 'the world of the kingdom, the physical world' },
      { arabic: 'عالم الملكوت', transliteration: '\u2019Alam al-Malakut', meaning: 'the world of sovereignty, the angelic world' },
      { arabic: 'عالم الجبروت', transliteration: '\u2019Alam al-Jabarut', meaning: 'the world of power, the transcendent realm' },
      { arabic: 'عالم الأمر', transliteration: '\u2019alam al-amr', meaning: 'the World of Command' },
      { arabic: 'عالم الاختراع', transliteration: '\u2019alam al-ikhtira\u2019', meaning: 'the Realm of Invention' },
      { arabic: 'الغيب', transliteration: 'al-ghayb', meaning: 'the Unseen' },
      { arabic: 'عالم الرتق', transliteration: '\u2019alam al-ratq', meaning: 'the World of Joining' },
    ],
    closing:
      'I am still gathering this discussion. What I have so far is the shape of the three worlds and the Quranic ground under them. The rest will come here when I have it.',
    sources: [
      'Mudih al-Tariq (for the Quranic foundation: Qur\u2019an 7:54 and "Knower of the unseen and the witnessed").',
      'Triple architecture, page numbers as captured from the Al Asrar notebook: Mulk [52, 75, 121-122]; Malakut [28-29, 52, 172]; Jabarut [60-61, 75, 126]. The book name for these page numbers is still to be confirmed. Source needed.',
    ],
    continuesNote:
      'This discussion continues. The rest of the long-form answer is still in the Al Asrar notebook chat, and I will add it here when I gather it.',
  },
  {
    id: 'ruh-and-soul',
    slug: 'ruh-and-soul',
    title: 'The Ruh and the Soul',
    eyebrow: 'Topics',
    subtitle: 'What the soul is, where it comes from, and what the body is for.',
    addedDate: '2026-11-18',
    intro:
      'People ask me what the soul is. The books answer this question in a clear way. The soul is not the body. It is a light that lives in the body for a time. I will share what I found about it, from the books themselves.',
    sections: [
      {
        heading: 'What the ruh is',
        paragraphs: [
          'The ruh is the soul. The books say it is a luminous, subtle substance. It comes from Alam al-Amr, the World of Command. It does not come from the physical world. It comes from above it.',
          'The word ruh means breath and spirit. God breathed it into man. It is the part of us that is closest to God.',
        ],
      },
      {
        heading: 'The body is a cage and a vehicle',
        paragraphs: [
          'The books call the body a cage and a vehicle. The soul rides in the body the way a rider rides a horse. The body carries it through this world. But the body is not the soul. The cage is not the bird.',
        ],
      },
      {
        heading: 'The brain is a receiving station',
        paragraphs: [
          'The brain is the receiving station. It picks up what the soul sends, the way a radio picks up a signal. The signal is not the radio. Consciousness comes from the ruh, not from the brain. The brain is the tool. The soul is the one who uses it.',
        ],
      },
      {
        heading: 'What this means for you',
        paragraphs: [
          'The books say the soul is the real you. The body will pass. The soul will not. So care for the soul first. Feed it with remembrance, with prayer, with good deeds. The body eats food. The soul eats light.',
        ],
      },
    ],
    terms: [
      { arabic: 'روح', transliteration: 'ruh', meaning: 'spirit, soul' },
      { arabic: 'عالم الأمر', transliteration: '\u2019Alam al-Amr', meaning: 'the World of Command' },
    ],
    closing:
      'I read this and it changed how I see myself. I am not my body. I am a soul, riding in a body for a short time. That is what the books say. And it is enough to think about for a long time.',
    sources: [
      'Ibn al-Qayyim, The Soul\u2019s Journey After Death.',
      'Fath-ar-Rabbani.',
      'Chittick, The Sufi Path of Knowledge.',
      'Masnavi.',
      'The Mirror.',
    ],
  },
  {
    id: 'letter-alif',
    slug: 'letter-alif',
    title: 'The Letter Alif',
    eyebrow: 'Topics',
    subtitle: 'One straight line, and a whole teaching inside it.',
    addedDate: '2026-11-18',
    intro:
      'Alif is the first letter of the Arabic alphabet. It is one straight line. But the books give this one line a whole world of meaning. I will share what they say about it.',
    sections: [
      {
        heading: 'The first letter',
        paragraphs: [
          'Alif is the first letter, and its Abjad value is 1. It stands upright. It joins to nothing before it. It is a straight line, and the books read that line as a sign of the One.',
        ],
      },
      {
        heading: 'The Throne and the Intellect',
        paragraphs: [
          'Alif belongs to the Throne and to the Intellect. It is the highest letter, because it stands above the rest and does not bend. The Throne is the highest seat. The Intellect is the highest mind. Alif stands with both.',
        ],
      },
      {
        heading: 'The fiery septet',
        paragraphs: [
          'The books also put Alif in a fiery septet, a set of seven letters tied to fire. Fire is the nature of these letters. Schimmel explains this set in her appendix on the letters, with the other letters of the septet.',
        ],
      },
      {
        heading: 'Why the shape matters',
        paragraphs: [
          'A letter is not only a sound. Its shape teaches too. Alif is one line, with no bend and no dot. The books say the shape itself is the teaching. One line. One God. One path.',
        ],
      },
    ],
    terms: [
      { arabic: 'ألف', transliteration: 'Alif', meaning: 'the first letter' },
      { arabic: 'أبجد', transliteration: 'Abjad', meaning: 'the letter-number system' },
    ],
    closing:
      'One letter, one line, and a whole teaching inside it. That is how the old books work. They hide great things in small places. Alif is the smallest of all, and it holds the most.',
    sources: [
      'Schimmel, Mystical Dimensions of Islam, Appendix 1, pp. 411-420.',
    ],
  },
  {
    id: 'seal-of-solomon',
    slug: 'seal-of-solomon',
    title: 'The Seal of Solomon',
    eyebrow: 'Topics',
    subtitle: 'The ring everyone has heard of, and what the books really say about it.',
    addedDate: '2026-11-18',
    intro:
      'Everyone has heard of Solomon\u2019s ring. But what do the books really say about it? The answer is more careful than the stories. I gathered what the Quran and the old books say, so you can see it plainly.',
    sections: [
      {
        heading: 'What the Quran says',
        paragraphs: [
          'The Quran says Solomon had dominion over the jinn and the wind. God gave him a kingdom no one else was given. But the Quran does not speak of a physical ring. The ring comes from the later books, not from the Quran. That line matters, and the books draw it clearly.',
        ],
      },
      {
        heading: 'The four layers',
        paragraphs: [
          'The Shams describes the seal in four inscribed layers. Each layer is a level of the seal, one laid over the other. The layers are the writing on the seal, and the writing is what gives it its power.',
        ],
      },
      {
        heading: 'The seven symbols',
        paragraphs: [
          'The Manba\u2019 names seven symbols of the Solomonic Seal, the Seal of the Greatest Name. Seven marks, drawn with care. The seven together make the seal whole.',
        ],
      },
      {
        heading: 'Seventy-two tribes, not seventy-two spirits',
        paragraphs: [
          'One common mistake is the number 72. People say 72 spirits. The books say 72 tribes of jinn, not 72 single spirits. A tribe is many. The number is bigger than people think, and the books are clear about it.',
        ],
      },
      {
        heading: 'Rumi\u2019s reading',
        paragraphs: [
          'Rumi reads the story as a picture of the heart. The heart is Solomon. The senses are the jinn. The king rules his senses the way Solomon ruled the jinn. The story is not only history. It is a mirror.',
        ],
      },
    ],
    terms: [
      { arabic: 'خاتم سليمان', transliteration: 'Khatam Sulayman', meaning: 'the Seal of Solomon' },
      { arabic: 'جن', transliteration: 'jinn', meaning: 'unseen beings' },
    ],
    closing:
      'The ring is a story people love. But the books ask you to read it with care. What the Quran says, and what the later books add, are two different things. Keep them apart, and the story stays true.',
    sources: [
      'The Holy Quran (Solomon\u2019s dominion over the jinn and the wind; no physical ring is named).',
      'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 60 (four inscribed layers).',
      'Manba\u2019 Usul al-Hikma, p. 60 (seven symbols).',
      'The Radiant Jewels for Summoning, p. 108 (72 tribes of jinn).',
      'Rumi, Mathnawi I:3575-82 (the heart is Solomon, the senses are jinn).',
    ],
  },
  {
    id: 'three-kinds-of-dreams',
    slug: 'three-kinds-of-dreams',
    title: 'Dreams: Three Kinds',
    eyebrow: 'Topics',
    subtitle: 'A true dream, the talk of the soul, and a dream from Shaytan.',
    addedDate: '2026-11-18',
    intro:
      'We all dream. But the books say not all dreams are the same. They name three kinds, and each kind comes from a different place. I will share the three, so you can tell them apart.',
    sections: [
      {
        heading: 'The true dream',
        paragraphs: [
          'The first kind is the true dream, ru\u2019ya sadiqah. It is a true vision, and it comes from God. It shows what is real, before it happens or as it is. The books treat it with respect.',
        ],
      },
      {
        heading: 'The talk of the soul',
        paragraphs: [
          'The second kind is hadith al-nafs, the talk of the soul with itself. It is the day\u2019s thoughts coming back at night. You worried about a thing by day, and you dream it by night. It means nothing more than that.',
        ],
      },
      {
        heading: 'The dream from Shaytan',
        paragraphs: [
          'The third kind is the shaytani dream, the dream from Shaytan. It frightens and confuses. It shows ugly things to shake the heart. The books say not to chase it, and not to tell it to others.',
        ],
      },
      {
        heading: 'How to tell them apart',
        paragraphs: [
          'The books give the three kinds so the reader can judge his own dreams. A true dream brings peace. The talk of the soul repeats the day. The dream of Shaytan brings fear. The feeling after waking is the first sign.',
        ],
      },
    ],
    terms: [
      { arabic: 'رؤيا صادقة', transliteration: 'ru\u2019ya sadiqah', meaning: 'true dream' },
      { arabic: 'حديث النفس', transliteration: 'hadith al-nafs', meaning: 'the soul\u2019s talk with itself' },
      { arabic: 'شيطاني', transliteration: 'shaytani', meaning: 'from Shaytan' },
    ],
    closing:
      'Three kinds, three sources. One from God, one from yourself, one from the enemy. The books say to honour the first, to ignore the second, and to seek refuge from the third. That is the whole teaching in one line.',
    sources: [
      'Ibn al-Qayyim, The Soul\u2019s Journey After Death, pp. 30-36.',
      'The Mirror, Ch. 14, pp. 83-85.',
      'Chittick, The Sufi Path of Knowledge, Ch. 9, pp. 115ff.',
    ],
  },
  {
    id: 'surah-saba-34-14',
    slug: 'surah-saba-34-14',
    title: 'Surah Saba 34:14: When Solomon Died',
    eyebrow: 'Topics',
    subtitle: 'A king leans on his staff, a small creature eats it, and the jinn learn a hard truth.',
    addedDate: '2026-11-18',
    intro:
      'There is a verse in the Quran that tells how Solomon died. It is short, and it is strange. A king leans on his staff. A small creature eats the staff. The king falls. I will walk you through the verse as the books explain it.',
    sections: [
      {
        heading: 'The king who did not fall',
        paragraphs: [
          'Solomon died leaning on his staff. No one knew. The jinn kept working, thinking he was still watching them. Days passed. The work went on. The king stood, and the king was already gone.',
        ],
      },
      {
        heading: 'The small creature',
        paragraphs: [
          'Then a small creature of the earth, dabbat al-ard, ate through his staff. The staff broke. Solomon fell. Only then did the jinn see that he was dead. A small creature did what no army could do.',
        ],
      },
      {
        heading: 'The lesson',
        paragraphs: [
          'The verse ends with the lesson. If the jinn had known the unseen, they would not have stayed in the humiliating torment. The unseen belongs to God alone. The jinn did not know it. No creature knows it.',
        ],
        quote: {
          arabic: 'فَلَمَّا خَرَّ تَبَيَّنَتِ الْجِنُّ أَن لَّوْ كَانُوا يَعْلَمُونَ الْغَيْبَ مَا لَبِثُوا فِي الْعَذَابِ الْمُهِينِ',
          transliteration: 'Fa-lamma kharra tabayyanat al-jinnu anna law kanu ya\u2019lamuna al-ghayba ma labithu fi al-\u2019adhab al-muhin',
          text: 'When he fell, it became clear to the jinn that had they known the unseen, they would not have stayed in the humiliating punishment.',
          source: 'Qur\u2019an 34:14',
        },
      },
    ],
    terms: [
      { arabic: 'دابة الأرض', transliteration: 'dabbat al-ard', meaning: 'the creature of the earth' },
      { arabic: 'منسأة', transliteration: 'minsa\u2019ah', meaning: 'staff' },
    ],
    closing:
      'A king, a staff, a small creature. The verse is short, but it holds a great teaching. The unseen is God\u2019s alone. Even the jinn, with all their power, did not know it. That is the point of the verse, and it is enough.',
    sources: [
      'The Holy Quran, Surah Saba (34), verse 14.',
      'Tafsir Ibn Kathir, vol. 2, 3:103, p. 250.',
    ],
  },
  {
    id: 'al-khidr',
    slug: 'al-khidr',
    title: 'Al-Khidr, the Hidden Teacher',
    eyebrow: 'Topics',
    subtitle: 'The guide who walks the earth unseen, and the meeting the books promise.',
    addedDate: '2026-11-18',
    intro:
      'Al-Khidr is the hidden teacher of Sufism. He has no school and no address. He appears, he teaches, and he goes. This discussion is only beginning. I will share what I have so far, and I will add the rest when I gather it.',
    sections: [
      {
        heading: 'The hidden teacher',
        paragraphs: [
          'Al-Khidr is called the mysterious hidden teacher of Sufism. He is a guide who walks the earth unseen. Seekers meet him on the road, not in a classroom. His teaching comes in the moment, not in a book.',
        ],
      },
      {
        heading: 'The meeting in The Journey',
        paragraphs: [
          'The Journey to the Lord of Power speaks of a meeting with al-Khidr, on pages 50 to 51 and page 68, beside the Quranic drinks. I have not gathered that part yet. The pages are named here so you know where it waits.',
        ],
      },
    ],
    terms: [
      { arabic: 'الخضر', transliteration: 'al-Khidr', meaning: 'the Green One, the hidden teacher' },
    ],
    closing:
      'This is all I have on al-Khidr for now. The meeting in The Journey is the next part to gather. It will come here when I have it.',
    sources: [
      'The Journey to the Lord of Power, pp. 50-51, 68 (meeting with al-Khidr; not yet gathered).',
      '\u2019Al Khidr, the mysterious hidden teacher of Sufism\u2019 (YouTube video, Al Asrar notebook sources).',
    ],
    continuesNote:
      'This discussion is only beginning. The meeting with al-Khidr in The Journey (pp. 50-51, 68) is still being gathered. It will come here when I have it.',
  },
];

/**
 * Topic of the Day: fixed upload order, never random, never shuffled.
 *
 * The topics are pre-made and added many at a time. Each day shows the
 * next topic in the order the topics were made. Day 1 is the first
 * topic. When the list ends, it starts again from the first topic.
 * The same date gives the same topic for every visitor, because the
 * count starts from one fixed date.
 */

/** First day of the Topics section: 18 Nov 2026. Day 1 shows the first topic. */
export const TOPICS_START_DATE = '2026-11-18';

/** Whole days from the start date to `date` (0 on the start date, never negative). */
export function daysSinceTopicsStart(date: Date): number {
  const start = new Date(`${TOPICS_START_DATE}T00:00:00`);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((day.getTime() - start.getTime()) / 86400000);
  return diff < 0 ? 0 : diff;
}

/** The topic for `date`, in fixed order, with its day number (1 on the start date). */
export function getTopicOfTheDay(date: Date = new Date()): {
  topic: TopicContent;
  dayNumber: number;
  date: Date;
} {
  const days = daysSinceTopicsStart(date);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return { topic: TOPICS[days % TOPICS.length], dayNumber: days + 1, date: day };
}

/** "18 Nov 2026" style date for a Date. */
export function formatTopicDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** "18 Nov 2026" style date for an ISO date string (a topic's addedDate). */
export function formatAddedDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return formatTopicDate(parsed);
}

/** One route per topic, in the same fixed order as TOPICS. */
export const TOPIC_ROUTES: Record<string, ViewName> = {
  'ibn-arabi-40-day-retreat': 'topic-retreat',
  'alam-al-malakut': 'topic-malakut',
  'ruh-and-soul': 'topic-ruh',
  'letter-alif': 'topic-alif',
  'seal-of-solomon': 'topic-seal',
  'three-kinds-of-dreams': 'topic-dreams',
  'surah-saba-34-14': 'topic-saba',
  'al-khidr': 'topic-khidr',
};

/** The route for a topic id, or the Topics hub when the id is unknown. */
export function topicRouteFor(id: string): ViewName {
  return TOPIC_ROUTES[id] ?? 'topics';
}
