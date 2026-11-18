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
 * Twelve topics, in upload order. The daily rotation runs through
 * them in this order, from the fixed start date 2026-11-18.
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
  },
  {
    id: 'alam-al-malakut',
    slug: 'alam-al-malakut',
    title: 'Alam al-Malakut',
    eyebrow: 'Topics',
    subtitle: 'The luminous world behind this world, and the three worlds that hold all things.',
    addedDate: '2026-11-18',
    intro:
      'There is a world behind this world. You cannot touch it. But it holds this world up, the way a root holds a tree. The old books call it Alam al-Malakut, the World of Sovereignty. Here is the full discussion, gathered from the books.',
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
      {
        heading: 'The Genesis of the Malakut',
        paragraphs: [
          'The books trace the three worlds back to one word: KUN, Be. The creative command is written with three letters, and each letter is a world. Kaf is Mulk, the physical world. Lam is Jabarut, the world of power. Mim is Malakut, the world of sovereignty.',
          'So Malakut is born from the letter Mim. The letter is not just a sound. In these books, the letter is the seed of the world it names.',
        ],
      },
      {
        heading: 'The Eight Pillars of the Highest Malakut',
        paragraphs: [
          'Above the Malakut stand eight pillars. They are the Throne, the Footstool, the Pen, the Tablet, the Highest Assembly, the Level, the Tablets, and the Highest Pens. The books name them as the pillars that hold the highest Malakut up.',
          'Each pillar is a station, not a thing. The Pen writes. The Tablet holds the writing. The Throne sits above all. To know the pillars is to know the shape of the world above this one.',
        ],
      },
      {
        heading: 'Angelic hierarchies',
        paragraphs: [
          'The Malakut is full of angels, and the books give them ranks. Highest are the Cherubim, those brought near, and among them the enraptured ones who are lost in gazing at God.',
          'Below them are the spiritual entities, the upper and lower kingdoms. And the books name Mitatrun, the angel the old books call Metatron, who stands at the head of the scribes.',
        ],
      },
      {
        heading: 'The human microcosm',
        paragraphs: [
          'Man is a small copy of the three worlds. The body is Mulk. The soul is the Malakut of the body. The heart is the Mulk of the spirit and the Malakut of the body, both at once.',
          'Above the heart stands the spirit, which is Jabarut. Above the spirit stands the intellect, which is the supreme Malakut of the spirit. And above the intellect stands the secret, the sirr, which is the Malakut of the intellect. Each part of man belongs to one of the worlds.',
        ],
      },
      {
        heading: 'The subjugation of worlds',
        paragraphs: [
          'The lofty Command dominates the spirit. That is the rule the books give: the higher world rules the lower one. Mulk does not rule Malakut. Malakut rules Mulk. And the Command rules them all.',
        ],
      },
      {
        heading: 'The Veil of Food and the Threefold Unveiling',
        paragraphs: [
          'The books speak of a veil, and they call it the Veil of Food. Behind it stand three unveilings, one after the other. The first is Presence: you stand before God. The second is Unveiling: the cover lifts. The third is Direct Contemplation: you see.',
          'Ibrahim walked this road. He gazed beyond the stars, then beyond the Moon, then beyond the Sun, until nothing was left to gaze at but God. Each light he passed was a veil. Each veil lifted was a step nearer.',
        ],
      },
      {
        heading: 'Four worlds, four letters',
        paragraphs: [
          'The books sum it up in a small table. Kaf is Mulk, the physical world. Lam is Jabarut, the world of power. Mim is Malakut, the world of sovereignty. And between them stands Mithal, the world of likeness, where meanings take visible shape.',
        ],
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
      { arabic: 'عالم المثال', transliteration: '\u2019Alam al-Mithal', meaning: 'the world of likeness, where meanings take visible shape' },
      { arabic: 'ميم', transliteration: 'Mim', meaning: 'the letter Mim, from which Malakut is born' },
      { arabic: 'كن', transliteration: 'KUN', meaning: 'Be, the creative command' },
      { arabic: 'القلم', transliteration: 'al-Qalam', meaning: 'the Pen' },
      { arabic: 'اللوح', transliteration: 'al-Lawh', meaning: 'the Tablet' },
      { arabic: 'الكروبيون', transliteration: 'al-Karubiyyun', meaning: 'the Cherubim, those brought near' },
      { arabic: 'سر', transliteration: 'sirr', meaning: 'the secret, the innermost part of man' },
      { arabic: 'محاضرة', transliteration: 'muhadara', meaning: 'Presence, the first unveiling' },
      { arabic: 'مكاشفة', transliteration: 'mukashafa', meaning: 'Unveiling, the second unveiling' },
      { arabic: 'مشاهدة', transliteration: 'mushahada', meaning: 'Direct Contemplation, the third unveiling' },
    ],
    closing:
      'That is the Malakut as the books give it: a world born from the letter Mim, held up by eight pillars, full of angels, copied small inside every man, and veiled by three unveilings that open one after the other. The physical world is the lowest floor. The Malakut is the floor above it. And the Command is above them both.',
    sources: [
      'Mudih al-Tariq (for the Quranic foundation: Qur\u2019an 7:54 and "Knower of the unseen and the witnessed").',
      'Mudih al-Tariq, p. 24; pp. 52, 60-61; pp. 63-64; pp. 74-75; p. 69; pp. 30, 45-46, 57; pp. 58-60',
      'Majmu\u2019at Thalath Rasa\u2019il, pp. 26, 186',
      'Mystical Dimensions of Islam, p. 270',
      'al-Asrar al-Rabbaniyyah, "The Letter Mim", pp. 86-87',
      'Islamic Spirituality: Foundations, Ch. 17, "The Angels", pp. 332-334',
      'Kitab al-Ajnas, pp. 18, 65, 83',
      'The Journey to the Lord of Power, pp. 28-29',
      'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 86',
    ],
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
      'Al-Khidr is the hidden teacher of Sufism. He has no school and no address. He appears, he teaches, and he goes. Ibn Arabi met him three times, and he wrote each meeting down. Here are the three meetings, from his own book.',
    sections: [
      {
        heading: 'The hidden teacher',
        paragraphs: [
          'Al-Khidr is called the mysterious hidden teacher of Sufism. He is a guide who walks the earth unseen. Seekers meet him on the road, not in a classroom. His teaching comes in the moment, not in a book.',
        ],
      },
      {
        heading: 'First meeting: Seville',
        paragraphs: [
          'The first meeting came in Seville, in the days of Ibn Arabi\u2019s youth. He was in a dispute with his master, Shaykh Abu al-Hasan al-\u2019Uryani, over an utterance of al-Shibli. The master had prayed to God for al-Khidr to confirm him. Then a stranger came to Ibn Arabi and told him his master was right.',
          'From that day, Ibn Arabi vowed never to dispute his guides again. The meeting was not a lesson in words. It was a lesson in trust.',
        ],
      },
      {
        heading: 'Second meeting: the Port of Tunis',
        paragraphs: [
          'The second meeting came at night, at the Port of Tunis, under a full moon. A tall white-bearded man came toward Ibn Arabi, walking dry-shod on the waves of the sea. He placed his right foot on his left in salutation, and he gave him counsel.',
          'Then he turned and walked toward the Manara, covering a mile with each step, reciting dhikr as he went. The next day, a local shaykh asked Ibn Arabi how the meeting with al-Khidr had been. The shaykh had known, though Ibn Arabi had told no one.',
        ],
      },
      {
        heading: 'Third meeting: the Atlantic coast of Spain',
        paragraphs: [
          'The third meeting came in a small seaside mosque on the Atlantic coast of Spain. A man inside was denying the miracles of saints. Al-Khidr entered, picked up a straw prayer mat, and rose fourteen cubits into the air, praying suspended between the floor and the roof.',
          'He did it for one reason only: to remove doubt from the heart of the skeptic. The miracle was not a show. It was a cure for a heart that could not believe.',
        ],
      },
      {
        heading: 'What the meetings teach',
        paragraphs: [
          'Three meetings, three lessons. In Seville he came to confirm. In Tunis he came to counsel. On the Atlantic coast he came to remove doubt. He appears where he is needed, not where he is sought.',
          'That is the way of the hidden teacher. He does not come to be found. He comes to find the one who needs him.',
        ],
      },
    ],
    terms: [
      { arabic: 'الخضر', transliteration: 'al-Khidr', meaning: 'the Green One, the hidden teacher' },
      { arabic: 'ذكر', transliteration: 'dhikr', meaning: 'remembrance of God' },
      { arabic: 'كرامة', transliteration: 'karamah', meaning: 'a miracle of a saint' },
    ],
    closing:
      'Three meetings, and one teacher who never stays. Al-Khidr comes to confirm, to counsel, and to remove doubt. Then he goes, and the seeker is left with the lesson. That is the whole of it.',
    sources: [
      'The Journey to the Lord of Power, Introduction, pp. 18-19 (the three meetings with al-Khidr).',
      'Necklaces of Gems (Qala\u2019id), pp. 41, 53-54 (al-Khidr as the Guide).',
      '\u2019Al Khidr, the mysterious hidden teacher of Sufism\u2019 (YouTube video, Al Asrar notebook sources).',
    ],
  },
  {
    id: 'rijal-al-ghayb',
    slug: 'rijal-al-ghayb',
    title: 'Rijal al-Ghayb and the Qutb',
    eyebrow: 'Topics',
    subtitle: 'The hidden men of the unseen, and the pole they turn around.',
    addedDate: '2026-11-18',
    intro:
      'There are men you will never meet, and the world turns on them. The books call them the Rijal al-Ghayb, the Men of the Unseen. They are not hidden because they hide. They are hidden because the world does not see them. Here is their order, as the books give it.',
    sections: [
      {
        heading: 'The Qutb, the pole',
        paragraphs: [
          'At the top stands the Qutb, the Pole. He is also called the Ghawth, the Helper. The books say the Qutb is in Mecca, and the world turns around him the way a wheel turns around its axle.',
        ],
      },
      {
        heading: 'The Two Imams',
        paragraphs: [
          'Below the Qutb stand the Two Imams. The Imam of the Right is the Mulk, the physical world. The Imam of the Left is the Malakut, the world of sovereignty. Two imams, two worlds, one pole above them both.',
        ],
      },
      {
        heading: 'The Four Pillars',
        paragraphs: [
          'Below the imams stand the Four Pillars, the Awtad. Four men, holding the four corners of the earth. When one of them dies, another rises to take his place.',
        ],
      },
      {
        heading: 'The Seven Substitutes',
        paragraphs: [
          'Below the pillars stand the Seven Substitutes, the Abdal. They are called substitutes because they stand in for one another. When one leaves, another takes his place, and the number stays seven.',
        ],
      },
      {
        heading: 'The Nobles and the Chiefs',
        paragraphs: [
          'Below the substitutes stand the Nobles and the Chiefs, the Nujaba and the Nuqaba. The books give their numbers as seventy and three hundred. They are the wider circle of the hidden men.',
        ],
      },
      {
        heading: 'The Gate of Solomon',
        paragraphs: [
          'The Gate of Solomon passes down a saying from al-Mundhiri. Al-Khidr and Ilyas stand at its head. Then come three hundred friends, forty Abdal, seventy Nujaba, seven Urafa, four Awtad, and one Ghawth. The numbers are given in the books, and I give them as I found them.',
          'The order is the point. Each rank answers to the one above it. Each man holds his place until God calls him, and then another rises in his stead. The world never lacks its hidden men.',
        ],
      },
    ],
    terms: [
      { arabic: 'رجال الغيب', transliteration: 'Rijal al-Ghayb', meaning: 'the Men of the Unseen' },
      { arabic: 'قطب', transliteration: 'Qutb', meaning: 'the Pole, the axis the world turns on' },
      { arabic: 'غوث', transliteration: 'Ghawth', meaning: 'the Helper, another name for the Qutb' },
      { arabic: 'أوتاد', transliteration: 'Awtad', meaning: 'the Pillars, the four supports' },
      { arabic: 'أبدال', transliteration: 'Abdal', meaning: 'the Substitutes, the seven' },
      { arabic: 'نجباء', transliteration: 'Nujaba\u2019', meaning: 'the Nobles, the seventy' },
    ],
    closing:
      'That is the order of the hidden men: one pole, two imams, four pillars, seven substitutes, and the wider circles below them. You will not meet them. But the books say the world turns because they stand where they stand.',
    sources: [
      'Mudih al-Tariq, pp. 83-85 (the hierarchy of the Rijal al-Ghayb).',
      'The Radiant Jewels for Summoning, p. 81 (the hidden hierarchy).',
      'Mystical Dimensions of Islam, pp. 200-201 (the Qutb and the hidden men).',
      'The Gate of Solomon, as transmitted from al-Mundhiri (the numbers of the ranks).',
    ],
  },
  {
    id: 'uwaisi-transmission',
    slug: 'uwaisi-transmission',
    title: 'Uwaisi Transmission',
    eyebrow: 'Topics',
    subtitle: 'Initiation without a living teacher in the flesh.',
    addedDate: '2026-11-18',
    intro:
      'Every Sufi path has a teacher. But some seekers never meet their teacher in the flesh. They are taught across time, across death, across the veil. The books call this the Uwaisi way. Here is what it means.',
    sections: [
      {
        heading: 'Initiation without a living teacher',
        paragraphs: [
          'The Uwaisi way is initiation without a living teacher in the flesh. The teacher may be dead. The teacher may be far away. The link still holds, because the link is not of the flesh. It is of the spirit.',
          'The name comes from Uwais al-Qarani, the man who loved the Prophet and never met him. He was taught without meeting. The books hold him up as the first of the line.',
        ],
      },
      {
        heading: 'Three examples',
        paragraphs: [
          'Abu al-Hasan al-Kharaqani was initiated by Bayazid al-Bistami, though Bayazid had died before they could meet. Attar was initiated by al-Hallaj, though Hallaj had been killed long before. And Abd al-Qadir is said to have sat in an assembly in Baghdad, taught by those who were not there in the flesh.',
          'Three men, three teachers, and in each case the teacher was gone from this world. The teaching crossed the grave the way light crosses a window.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'The books do not explain the how. They only record the fact. A seeker turns his heart to a master of the past, and the master answers. The link is made in the world of the spirit, where death is not a wall.',
          'That is the whole of it. The Uwaisi way is not a trick and not a shortcut. It is a link that does not need a body to hold it.',
        ],
      },
    ],
    terms: [
      { arabic: 'أويسي', transliteration: 'Uwaisi', meaning: 'the way of Uwais, initiation without a living teacher' },
    ],
    closing:
      'The teacher does not have to be alive to teach. The books give the examples, and the examples are enough. The link is of the spirit, and the spirit does not die.',
    sources: [
      'Mystical Dimensions of Islam, pp. 105-106 (Uwaisi transmission).',
      'Necklaces of Gems (Qala\u2019id), pp. 103, 107-108 (Kharaqani, Attar, Abd al-Qadir).',
    ],
  },
  {
    id: 'renewal-of-creation',
    slug: 'renewal-of-creation',
    title: 'The Renewal of Creation',
    eyebrow: 'Topics',
    subtitle: 'Each moment, the world is made again.',
    addedDate: '2026-11-18',
    intro:
      'The world looks solid. The stone sits where it sat yesterday. The tree stands where it stood. But the books say the world is not solid at all. It is made again, in every instant, fresh from nothing. Here is the teaching of the renewal of creation.',
    sections: [
      {
        heading: 'Instantaneous creation',
        paragraphs: [
          'The teaching is called tajaddud al-khalq, the renewal of creation. It says the world is created anew in every instant. Nothing lasts from one moment to the next. Each moment is a new making.',
          'The stone you see is not the stone of a moment ago. It is a new stone, made in the image of the old one, so fast and so perfect that your eye cannot tell the difference. The world is a river, not a rock.',
        ],
      },
      {
        heading: 'The Quranic ground',
        paragraphs: [
          'The Quran asks the question in Surah Qaf: were We worn out by the first creation? No, it says. They are in confused doubt about a new creation. The verse is the ground under the teaching. God did not tire of the first making, and He does not tire of making it again.',
        ],
        quote: {
          arabic: 'أَفَعَيِينَا بِٱلْخَلْقِ ٱلْأَوَّلِ بَلْ هُمْ فِى لَبْسٍ مِّنْ خَلْقٍ جَدِيدٍ',
          transliteration: 'Afa\u2019ayyina bil-khalq al-awwal, bal hum fi labsin min khalqin jadid',
          text: 'Were We then worn out by the first creation? Nay, they are in confused doubt about a new creation.',
          source: 'Qur\u2019an 50:15',
        },
      },
      {
        heading: 'What it means for the seeker',
        paragraphs: [
          'If the world is made again in every instant, then nothing is fixed. The past does not own you. The next moment is a new creation, and in it you can be made new too.',
          'That is why the teaching matters. It is not a theory about the sky. It is a door. Each moment is a fresh start, made by the same hand that made the first one.',
        ],
      },
    ],
    terms: [
      { arabic: 'تجدد الخلق', transliteration: 'tajaddud al-khalq', meaning: 'the renewal of creation' },
    ],
    closing:
      'The world is made again, in every instant, fresh from nothing. The stone, the tree, and you. That is the teaching. And it means the next moment is always a new beginning.',
    sources: [
      'The Journey to the Lord of Power, Glossary, p. 110 (tajaddud al-khalq).',
      'The Sufi Path of Knowledge, pp. 127-128, 130 (renewal of creation).',
      'Qur\u2019an 50:15.',
    ],
  },
  {
    id: 'quranic-drinks',
    slug: 'quranic-drinks',
    title: 'The Drinks in Ibn Arabi\u2019s Journey',
    eyebrow: 'Topics',
    subtitle: 'Water, milk, honey and wine: what the drinks mean.',
    addedDate: '2026-11-18',
    intro:
      'In the middle of the Journey, Ibn Arabi is offered drinks. Water, milk, honey, wine. They are not just drinks. Each one is a kind of knowledge, and the book decodes them one by one. Here is the decoding, from the book itself.',
    sections: [
      {
        heading: 'Water: Absolute Knowledge',
        paragraphs: [
          'Water is Absolute Knowledge. The book gives a rule: if you are offered something to drink, choose water. Water is the first choice, because Absolute Knowledge is the first knowledge.',
          'Water has no colour and no taste of its own. It takes the shape of its cup. Absolute Knowledge is like that. It is the ground under every other knowledge.',
        ],
      },
      {
        heading: 'Milk: the Knowledge of the Sacred Ways',
        paragraphs: [
          'Milk is the Knowledge of the Sacred Ways, and it is the fitrah, the natural disposition. It is the Prophet\u2019s choice. The book gives the rule: if there is no water, choose milk.',
          'Milk feeds the young. The Sacred Ways feed the seeker. Both are natural, both are given, and both are the first food of the one who is growing.',
        ],
      },
      {
        heading: 'Water and milk blended',
        paragraphs: [
          'The book also speaks of water and milk blended together. The blend is the exact relationship between the secondary branches of knowledge and the primary sacred legal knowledge. The branches are the water. The sacred law is the milk. Together they are one drink.',
        ],
      },
      {
        heading: 'Honey: permissible wisdom',
        paragraphs: [
          'Honey is permissible philosophical and traditional wisdom. The book says, "This also applies to honey: Drink it." Honey is sweet and lawful, and the wisdom it stands for is sweet and lawful too.',
        ],
      },
      {
        heading: 'Wine: the Knowledge of Ecstatic States',
        paragraphs: [
          'Wine is the Knowledge of Ecstatic States. The book is careful here. It says, "Be careful of drinking it... Refrain from drinking it otherwise." Unmixed wine is drunkenness, and drunkenness is not the path.',
          'But wine mixed with rainwater is guided and sober. Rainwater is the knowledge that comes down from above. River and spring water is intellectual knowledge, and it muddles the states. The difference is in what the wine is mixed with.',
        ],
      },
    ],
    terms: [
      { arabic: 'العلم المطلق', transliteration: 'al-\u2019Ilm al-Mutlaq', meaning: 'Absolute Knowledge' },
      { arabic: 'فطرة', transliteration: 'fitrah', meaning: 'the natural disposition' },
      { arabic: 'علوم الشرائع', transliteration: '\u2019Ulum al-Shara\u2019i\u2019', meaning: 'the Knowledge of the Sacred Ways' },
    ],
    closing:
      'Water first, milk second, honey when it is offered, and wine only when it is mixed with rainwater. The drinks are a map of knowledge. Choose as the book says to choose, and the map leads you straight.',
    sources: [
      'The Journey to the Lord of Power, p. 36; pp. 36-37.',
      'The Journey to the Lord of Power, Commentary Note 11, pp. 82-83.',
    ],
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
  'rijal-al-ghayb': 'topic-rijal',
  'uwaisi-transmission': 'topic-uwaisi',
  'renewal-of-creation': 'topic-renewal',
  'quranic-drinks': 'topic-drinks',
};

/** The route for a topic id, or the Topics hub when the id is unknown. */
export function topicRouteFor(id: string): ViewName {
  return TOPIC_ROUTES[id] ?? 'topics';
}

/**
 * Every view that belongs to Topics: the hub, every topic page, the
 * Questions part, and the Guides page. Topics is open to everyone, so
 * the gate and the navbar both use this list to tell a Topics page
 * from a gated page.
 */
export const TOPIC_VIEWS: ViewName[] = [
  'topics',
  'topic-retreat',
  'topic-malakut',
  'topic-ruh',
  'topic-alif',
  'topic-seal',
  'topic-dreams',
  'topic-saba',
  'topic-khidr',
  'topic-rijal',
  'topic-uwaisi',
  'topic-renewal',
  'topic-drinks',
  'topics-questions',
  'topics-guides',
];

/** True when the view is a Topics page (hub, topic, questions, guides). */
export function isTopicsView(view: string): boolean {
  return (TOPIC_VIEWS as string[]).includes(view);
}
