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
 * Six more topics were added 2026-11-19, taking the order to
 * eighteen days. Four more topics were added 2026-11-19, taking
 * the order to twenty-two days. The rotation is unchanged: TOPICS[days % length].
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
  {
    id: 'basmalah-secrets',
    slug: 'basmalah-secrets',
    title: 'The Secrets of the Basmalah',
    eyebrow: 'Topics',
    subtitle: 'The master key of the cosmos, and the dot beneath one letter.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In our earlier talks we walked through retreats, the angelic world, dreams, the science of letters, the Seal of Solomon, Surah Saba and al-Khidr. Now I want to open the Basmalah with you, the line every surah begins with except one. The books I read call it the master key of the cosmos, the first cipher from which all creation flows. I share it here for study only, from the books, with their pages named. This is not a ruling, and it promises nothing. It is a reading, nothing more.',
    sections: [
      {
        heading: 'The dot beneath the Ba',
        paragraphs: [
          'The Basmalah begins with the letter Ba. The books say the whole Quran is held in Surah al-Fatiha, and the whole Fatiha is held in the Basmalah, and the whole Basmalah is held in the Ba. And the Ba itself is held in the dot beneath it. One dot, and the books say all creation hangs from it.',
          'The Ba is the letter of by and through. Bi kana ma kana, the books say. By Me was what was, and by Me is what is. The dot is the first point, the place where the pen first touched the page. Everything after it is the line that flows from that touch. Source: Decoding Al-Buni\u2019s Esoteric Book, p. 1; Mystical Dimensions of Islam, p. 417.',
        ],
      },
      {
        heading: 'Nineteen letters, nineteen guardians',
        paragraphs: [
          'The Basmalah has nineteen letters. The books count them one by one. Nineteen letters, and nineteen guardians stand over the fire. The books call them the Zabaniyah, the keepers of the abyss. The line that opens the Quran is also the shield that stands before them.',
          'The books also count the day in hours. Twenty-four hours, and the seeker sleeps about five of them. The nineteen letters keep a balance through the hours, hour by hour, so that the day stays in measure. The number is not a charm. It is a pattern the books read in the line itself. Source: Shams al-Ma\u2019arif al-Kubra, Ch. 3, pp. 56-57.',
        ],
      },
      {
        heading: 'Four Names, four rivers',
        paragraphs: [
          'The Basmalah holds four Names. Ism, the Name itself. Allah, the supreme personal Name. Al-Rahman, the All-Merciful. Al-Rahim, the Compassionate, the specially Merciful. Four Names in one short line, and the books read each one as a river.',
          'The books say four rivers flow in Paradise, and each river flows from one letter of the Basmalah. Water flows from the Mim of Bism. Milk flows from the Ha of Allah. Wine flows from the Mim of al-Rahman. Honey flows from the Mim of al-Rahim. The line is short, but the books say it holds four rivers. Source: The Journey to the Lord of Power, pp. 36, 82-83; Mudih al-Tariq, pp. 63-64.',
        ],
      },
      {
        heading: 'The weight of 786',
        paragraphs: [
          'The books also weigh the Basmalah in numbers. Hisab al-Jummal is the reckoning of letters by their number values. Count the letters of the Basmalah by their values, and the sum is 786. The books give the number plainly, and they build the wafq of the Basmalah, its square matrix, from it.',
          'Around the square stand the angelic custodians, the Amlak. They are the keepers of the letters, and the square is their map. The number is a weight, not a wish. The books record it, and I record it as they give it. Source: Manba\u2019 Usul al-Hikma, pp. 28-30; Shams al-Ma\u2019arif, pp. 58-60.',
        ],
      },
      {
        heading: 'Why Surah al-Tawbah has no Basmalah',
        paragraphs: [
          'Every surah of the Quran opens with the Basmalah except one. Surah al-Tawbah, the ninth surah, has none. The books ask why, and they answer with one word. Bara\u2019ah. Renunciation and severance. The surah opens with a break, not with mercy.',
          'The rule the books give is simple. A chapter of warfare and divine severity, of Jalal, cannot begin with mercy. The Basmalah is Aman wa-Salam, absolute safety and peace. A surah that severs ties cannot open with safety and peace. So the line is left out, and the surah begins bare. Source: Tafsir Ibn Kathir, Vol. 4, commentary on Surah 9, pp. 111-112; Mystical Dimensions of Islam, p. 119.',
        ],
      },
      {
        heading: 'The line written on the body',
        paragraphs: [
          'The books read the Basmalah on the human body too. The face is the page, and the letters are written there. The Alif mirrors the nose, one straight line down the middle of the face. The face itself is called al-Wajh, and the line stands in it.',
          'The Basmalah has three Mims, one in Bism, one in al-Rahman, one in al-Rahim. The books match them to three organs at the centre of the body. The brain, al-Dimagh. The heart, al-Qalb. The liver, al-Kabd. Three letters, three organs, one body. Source: Mudih al-Tariq, pp. 61-62; The Mirror, pp. 98-101.',
        ],
      },
    ],
    terms: [
      { arabic: 'نقطة الباء', transliteration: 'Nuqṭat al-Bāʾ', meaning: 'the dot beneath the letter Ba' },
      { arabic: 'بي كان ما كان', transliteration: 'Bī kāna mā kāna', meaning: 'by Me was what was, the instrumental Ba' },
      { arabic: 'تسعة عشر حرفا', transliteration: 'Tisʿata ʿAshar Ḥarfan', meaning: 'nineteen consonantal letters' },
      { arabic: 'زبانية', transliteration: 'Zabāniyah', meaning: 'the guardians of the fire' },
      { arabic: 'اسم', transliteration: 'Ism', meaning: 'the Name, the essence' },
      { arabic: 'الله', transliteration: 'Allāh', meaning: 'the supreme personal Name' },
      { arabic: 'الرحمن', transliteration: 'Al-Raḥmān', meaning: 'the All-Merciful' },
      { arabic: 'الرحيم', transliteration: 'Al-Raḥīm', meaning: 'the Compassionate, the specially Merciful' },
      { arabic: 'أنهار الجنة', transliteration: 'Anhār al-Jannah', meaning: 'the four celestial rivers' },
      { arabic: 'حساب الجمل', transliteration: 'Ḥisāb al-Jummal', meaning: 'Abjad reckoning, letters counted by number values' },
      { arabic: 'وفق البسملة', transliteration: 'Wafq al-Basmalah', meaning: 'the magic square matrix of the Basmalah' },
      { arabic: 'أملاك', transliteration: 'Amlāk', meaning: 'angelic custodians' },
      { arabic: 'أمان وسلام', transliteration: 'Amān wa-Salām', meaning: 'absolute safety and peace' },
      { arabic: 'براءة', transliteration: 'Barāʾah', meaning: 'renunciation and severance' },
      { arabic: 'جلال', transliteration: 'Jalāl', meaning: 'divine severity and majesty' },
      { arabic: 'الوجه', transliteration: 'Al-Wajh', meaning: 'the face' },
      { arabic: 'الدماغ', transliteration: 'Al-Dimāgh', meaning: 'the brain' },
      { arabic: 'القلب', transliteration: 'Al-Qalb', meaning: 'the heart' },
      { arabic: 'الكبد', transliteration: 'Al-Kabd', meaning: 'the liver' },
    ],
    closing:
      'I read the Basmalah every day, and I had never seen it like this. A dot that holds creation. Nineteen letters that stand before the fire. Four Names that flow as four rivers. A number, 786, that weighs the line. A missing line that teaches severity. And a body that carries the letters on its face and in its chest. That is what the books say. I give it to you as I found it, for study, and nothing more.',
    sources: [
      'Decoding Al-Buni\u2019s Esoteric Book, p. 1; Mystical Dimensions of Islam, p. 417.',
      'Shams al-Ma\u2019arif al-Kubra, Ch. 3, pp. 56-57.',
      'The Journey to the Lord of Power, pp. 36, 82-83; Mudih al-Tariq, pp. 63-64.',
      'Manba\u2019 Usul al-Hikma, pp. 28-30; Shams al-Ma\u2019arif, pp. 58-60.',
      'Tafsir Ibn Kathir, Vol. 4, commentary on Surah 9, pp. 111-112; Mystical Dimensions of Islam, p. 119.',
      'Mudih al-Tariq, pp. 61-62; The Mirror, pp. 98-101.',
    ],
  },
  {
    id: 'throne-verse',
    slug: 'throne-verse',
    title: 'The Throne Verse, Ayat al-Kursi',
    eyebrow: 'Topics',
    subtitle: 'The greatest verse of the Quran, and the Footstool that holds the heavens.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. Today we walk to the greatest verse of the Quran, Ayat al-Kursi, Quran 2:255. The books I read call it the mistress of the Quran. Seventy thousand angels came down with it, the books say. I will decode it as the sources give it, line by line. I share this for study only, from the books, with their pages named. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'The greatest verse, and seventy thousand angels',
        paragraphs: [
          'The books call Ayat al-Kursi Sayyidat al-Quran, the Mistress of the Quran. No other verse holds her rank. When she came down, the books say seventy thousand angels came down with her. Hubut al-Malaʾikah, the angelic descent.',
          'The verse is short, but the books count 170 letters inside it. One hundred and seventy letters, and each one is a part of the inner blueprint. The number is the frame of the verse, and the verse is the frame of the throne. Source: Shams al-Ma\u2019arif al-Kubra, Ch. 18, pp. 68-69; Tafsir Ibn Kathir, Vol. 1, pp. 86-88.',
        ],
      },
      {
        heading: 'The Greatest Name inside the verse',
        paragraphs: [
          'The verse opens with the Greatest Name. Allahu la ilaha illa Huwa al-Hayyu al-Qayyum. Allah, there is no god but He, the Ever-Living, the Self-Subsisting Sustainer. Two Names stand at the door of the verse, and the books say they are the Greatest Name itself.',
          'Al-Hayy is the Ever-Living, and the books say it is the remembrance of Jibril. Al-Qayyum is the Self-Subsisting Sustainer, the One who holds all things while needing nothing. The books tie the verse to Asif ibn Barkhiya, the one who moved the throne of Bilqis. The same Names, the same power, the books say. Source: Shams, pp. 60-61, 68-69; Mudih al-Tariq, pp. 21-22; al-Ghunya, p. 35.',
        ],
        quote: {
          arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
          transliteration: 'Allāhu lā ilāha illā Huwa al-Ḥayyu al-Qayyūm',
          text: 'Allah, there is no god but He, the Ever-Living, the Self-Subsisting Sustainer.',
          source: 'Qur\u2019an 2:255',
        },
      },
      {
        heading: 'The Footstool and the Throne',
        paragraphs: [
          'The verse says His Footstool extends over the heavens and the earth. Wasiʿa Kursiyyuhu al-Samawati wa-l-Ard. The Kursi is the Footstool, and the books are careful to set it below the Throne. The Throne is al-Arsh. The Footstool is al-Kursi. One is the seat, the other is the step beneath it.',
          'Ibn Abbas says the Kursi is the pedestal below the Throne. The books call it Mahall al-Suwar, the receptacle of forms, the place where the shapes of things are held. And they give a picture for its size. The seven heavens and the earths, set beside the Kursi, are like a ring thrown in a desert. Source: Tafsir Ibn Kathir, Vol. 1, p. 89; Mudih al-Tariq, pp. 19-20, 27-28, 31.',
        ],
        quote: {
          arabic: 'وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ',
          transliteration: 'Wasiʿa Kursiyyuhu al-Samāwāti wa-l-Arḍ',
          text: 'His Footstool extends over the heavens and the earth.',
          source: 'Qur\u2019an 2:255',
        },
      },
      {
        heading: 'The 170-letter square',
        paragraphs: [
          'The books build a square from the verse. One hundred and seventy letters, and the 170 recitation harmonic runs through them. The 4x4 magic square matrix of Ayat al-Kursi is drawn from the verse itself, and the books say angelic inscriptions stand around the diagram.',
          'The verse ends with a line the books quote again and again. Wa-la yaʾuduhu hifzuhuma wa-Huwa al-Aliyyu al-Azim. Guarding the heavens and the earth does not weary Him, and He is the Most High, the Most Great. The square holds the letters. The line holds the meaning. Source: Shams, Ch. 18, pp. 68-69, 71-72.',
        ],
        quote: {
          arabic: 'وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
          transliteration: 'Wa-lā yaʾūduhu ḥifẓuhumā wa-Huwa al-ʿAliyyu al-ʿAẓīm',
          text: 'And guarding them does not weary Him, and He is the Most High, the Most Great.',
          source: 'Qur\u2019an 2:255',
        },
      },
      {
        heading: 'A sanctuary that cannot be broken',
        paragraphs: [
          'The books call the verse Hirz Maniʿ, the impenetrable sanctuary. It is a wall no rebellious thing can cross, the books say. The verse guards the one who holds it, and the guard does not sleep.',
          'The line the books quote is short. La taʾkhudhuhu sinatun wa-la nawm. Neither slumber nor sleep overtakes Him. The guard never closes his eyes, because the One who guards never sleeps. That is the heart of the sanctuary. Source: Shams, Ch. 18, pp. 68-69, 71; Kitab al-Ajnas, pp. 10-11.',
        ],
        quote: {
          arabic: 'لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
          transliteration: 'Lā taʾkhudhuhu sinatun wa-lā nawm',
          text: 'Neither slumber nor sleep overtakes Him.',
          source: 'Qur\u2019an 2:255',
        },
      },
      {
        heading: 'The throne inside the heart',
        paragraphs: [
          'The books turn the verse inward at the end. Qalbu al-Muʾmini ʿArshu Allah. The heart of the believer is the Throne of God. The Throne that holds the heavens also has a seat inside the chest, the books say.',
          'Abu Yazid al-Bistami said the cosmos fell into the heart, and the heart held it. The verse is about the heavens, and it is also about the heart. The great Throne and the small heart are one teaching, read twice. Source: al-Asrar al-Rabbaniyyah, pp. 125-126; Mudih al-Tariq, pp. 27-28.',
        ],
      },
    ],
    terms: [
      { arabic: 'سيدة القرآن', transliteration: 'Sayyidat al-Qurʾān', meaning: 'the Mistress of the Quran' },
      { arabic: 'هبوط الملائكة', transliteration: 'Hubūṭ al-Malāʾikah', meaning: 'the angelic descent' },
      { arabic: 'الحي', transliteration: 'Al-Ḥayy', meaning: 'the Ever-Living' },
      { arabic: 'القيوم', transliteration: 'Al-Qayyūm', meaning: 'the Self-Subsisting Sustainer' },
      { arabic: 'الكرسي', transliteration: 'Al-Kursī', meaning: 'the Footstool' },
      { arabic: 'العرش', transliteration: 'Al-ʿArsh', meaning: 'the Throne' },
      { arabic: 'محل الصور', transliteration: 'Mahall al-Ṣuwar', meaning: 'the receptacle of forms' },
      { arabic: 'وفق', transliteration: 'Wafq', meaning: 'the magic square matrix' },
      { arabic: 'حرز مانع', transliteration: 'Ḥirz Māniʿ', meaning: 'the impenetrable sanctuary' },
      { arabic: 'قلب المؤمن عرش الله', transliteration: 'Qalbu al-Muʾmini ʿArshu Allāh', meaning: 'the heart of the believer is the Throne of God' },
    ],
    closing:
      'I read this verse all my life, and I had never counted its letters or weighed its Names. One hundred and seventy letters. Two Names at the door. A Footstool wider than the heavens. A square drawn from the words. A sanctuary that never sleeps. And a Throne that fits inside the heart. That is what the books give. I share it as I found it, for study, and nothing more.',
    sources: [
      'Shams al-Ma\u2019arif al-Kubra, Ch. 18, pp. 68-69; Tafsir Ibn Kathir, Vol. 1, pp. 86-88.',
      'Shams, pp. 60-61, 68-69; Mudih al-Tariq, pp. 21-22; al-Ghunya, p. 35.',
      'Tafsir Ibn Kathir, Vol. 1, p. 89; Mudih al-Tariq, pp. 19-20, 27-28, 31.',
      'Shams, Ch. 18, pp. 68-69, 71-72.',
      'Shams, Ch. 18, pp. 68-69, 71; Kitab al-Ajnas, pp. 10-11.',
      'al-Asrar al-Rabbaniyyah, pp. 125-126; Mudih al-Tariq, pp. 27-28.',
    ],
  },
  {
    id: 'greatest-name',
    slug: 'greatest-name',
    title: 'The Greatest Name of God',
    eyebrow: 'Topics',
    subtitle: 'The Name the books call the highest, and what the manuscripts say about it.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. Today we step to the highest summit the books describe, al-Ism al-Aʿzam, the Greatest Name of God. The manuscripts call it the ultimate creative pivot of the universe, the command that compels angels and jinn. I give those words as the manuscripts frame them, as history, not as a claim of my own. I share this for study only, from the books, with their pages named. This is not a ruling, and it promises nothing. There are no instructions here to harm, compel or bind anyone.',
    sections: [
      {
        heading: 'What the books say the Name does',
        paragraphs: [
          'The books give the Name a plain definition. Idha duʿiya bihi ajab, wa-idha suʾila bihi aʿta. When called upon by it, He answers. When asked by it, He gives. That is the definition the manuscripts give, and they call it the guaranteed response.',
          'The books give one story as proof. Asif ibn Barkhiya moved the throne of Bilqis in the blink of an eye, and the books say he did it by the Greatest Name. The throne crossed a kingdom before the eye could blink. The story is the manuscripts\u2019 own, and I give it as they tell it. Source: Kitab al-Ajnas, pp. 10-11; Exploring Islamic Occult Manuscripts, pp. 1, 4; al-Ghunya, pp. 35, 37.',
        ],
        quote: {
          arabic: 'إِذَا دُعِيَ بِهِ أَجَابَ وَإِذَا سُئِلَ بِهِ أَعْطَى',
          transliteration: 'Idhā duʿiya bihi ajāb, wa-idhā suʾila bihi aʿṭā',
          text: 'When called upon by it, He answers; when asked by it, He gives.',
          source: 'As quoted in Kitab al-Ajnas, pp. 10-11',
        },
      },
      {
        heading: 'Allah, and the peeling of the letters',
        paragraphs: [
          'The books say the Name of the Essence, Ism al-Dhat, is Allah itself. The Name is not a label on the Essence. It is the Essence named. And the books peel the word letter by letter, to show what hides inside it.',
          'Remove the Alif, and Li-llah is left, to Allah. Remove the first Lam, and Lahu is left, to Him. Remove the second Lam, and only the Ha is left, Huwa, He. Each peeling leaves a Name, and the last letter leaves only He. The word is a ladder, and each step is a Name. Source: Mudih al-Tariq, pp. 19-20, 24, 41; al-Asrar al-Rabbaniyyah, pp. 86-87.',
        ],
      },
      {
        heading: 'Ya Hayyu Ya Qayyum',
        paragraphs: [
          'The books give a working pair, Ya Hayyu Ya Qayyum. O Ever-Living, O Self-Subsisting Sustainer. Two Names, spoken together, and the books say this pair is the Name in its working form.',
          'The pair comes from Ayat al-Kursi, where the same two Names open the verse. The books link the Greatest Name to the greatest verse, and the verse to the pair. One Name, one verse, one pair, the books say. Source: al-Ghunya, pp. 35, 37; Shams, Ch. 18, pp. 60-61, 68-69.',
        ],
        quote: {
          arabic: 'يَا حَيُّ يَا قَيُّومُ',
          transliteration: 'Yā Ḥayyu yā Qayyūm',
          text: 'O Ever-Living, O Self-Subsisting Sustainer.',
          source: 'As quoted in al-Ghunya, pp. 35, 37',
        },
      },
      {
        heading: 'Fourteen luminous letters',
        paragraphs: [
          'The books tie the Name to the fourteen luminous letters, Arbaʿata ʿAshara Harfan, the letters that open the surahs. Fourteen letters, and the books say they hold the Name in cipher. The letters are the code, and the Name is what the code spells.',
          'The books give the formula in full. Nassun hakīmun lahu sirrun qāṭiʿ. A wise text that possesses a decisive secret. And they say the teaching came down through al-Khidr, the hidden teacher, passed from hand to hand. The letters are fourteen. The secret is one. Source: al-Asrar al-Rabbaniyyah, pp. 85-86; Manbaʿ Uṣūl al-Ḥikma, pp. 27-28.',
        ],
        quote: {
          arabic: 'نَصٌّ حَكِيمٌ لَهُ سِرٌّ قَاطِعٌ',
          transliteration: 'Naṣṣun ḥakīmun lahu sirrun qāṭiʿ',
          text: 'A wise text that possesses a decisive secret.',
          source: 'al-Asrar al-Rabbaniyyah, pp. 85-86',
        },
      },
      {
        heading: 'The old ciphers',
        paragraphs: [
          'The books also keep older ciphers, in Syriac and Hebrew words. Ehya Sharahya Adonay Asbaʾut Al Shadday. The words are old, and the books keep them exactly as they were received. They are the archaic names, the words from before the Arabic letters.',
          'With the words comes a figure, al-Khatam al-Aʿzam, the Sevenfold Graphic Talisman. A pentagram, three vertical lances, a blind Mim, a two-runged ladder, four vertical strokes, a cleft Ha, and a curved terminal Waw. Seven marks, drawn together, and the books say the figure is the Name written as a picture. Source: Manbaʿ, pp. 22-24; Kitab al-Ajnas, pp. 11, 65, 83; Exploring Islamic Occult Manuscripts, pp. 3-4.',
        ],
        quote: {
          transliteration: 'Ehyā Sharāhyā Adūnāy Aṣbāʾūt Āl Shaddāy',
          text: 'The archaic cipher as the manuscripts give it, in Syriac and Hebrew words.',
          source: 'Manbaʿ, pp. 22-24; Kitab al-Ajnas, pp. 11, 65, 83',
        },
      },
      {
        heading: 'The station over the syllable',
        paragraphs: [
          'The books end with a warning, and it comes from al-Khidr himself. Ibrahim ibn Adham sought the Name, and al-Khidr reproached him. It was David who taught him the Name, the books say, not the syllable he was chasing. The station matters more than the sound.',
          'The word the books give is Takhalluq, the assimilation of character. The Name is not a word to own. It is a character to take on. The one who carries the Name must first become worthy of it, the books say. The station comes first. The syllable comes after. Source: Mudih al-Tariq, pp. 20-22, 41-42, 48.',
        ],
      },
    ],
    terms: [
      { arabic: 'الاسم الأعظم', transliteration: 'Al-Ism al-Aʿẓam', meaning: 'the Greatest Name of God' },
      { arabic: 'اسم الذات', transliteration: 'Ism al-Dhāt', meaning: 'the Name of the Essence' },
      { arabic: 'لله', transliteration: 'Li-llāh', meaning: 'to Allah' },
      { arabic: 'له', transliteration: 'Lahu', meaning: 'to Him' },
      { arabic: 'هو', transliteration: 'Huwa', meaning: 'He' },
      { arabic: 'يا حي يا قيوم', transliteration: 'Yā Ḥayyu yā Qayyūm', meaning: 'O Ever-Living, O Self-Subsisting Sustainer' },
      { arabic: 'أربعة عشر حرفا', transliteration: 'Arbaʿata ʿAshara Ḥarfan', meaning: 'the fourteen luminous letters' },
      { arabic: 'الخاتم الأعظم', transliteration: 'Al-Khātam al-Aʿẓam', meaning: 'the Sevenfold Graphic Talisman' },
      { arabic: 'تخلق', transliteration: 'Takhalluq', meaning: 'assimilation of character' },
    ],
    closing:
      'I read the manuscripts\u2019 words about the Name, and I give them back as history. A definition, a peeling, a pair, fourteen letters, old ciphers, and a warning. The books say the Name answers and gives. They also say the station matters more than the syllable. I keep both halves together, because the books keep them together. That is the study, and nothing more.',
    sources: [
      'Kitab al-Ajnas, pp. 10-11; Exploring Islamic Occult Manuscripts, pp. 1, 4; al-Ghunya, pp. 35, 37.',
      'Mudih al-Tariq, pp. 19-20, 24, 41; al-Asrar al-Rabbaniyyah, pp. 86-87.',
      'al-Ghunya, pp. 35, 37; Shams, Ch. 18, pp. 60-61, 68-69.',
      'al-Asrar al-Rabbaniyyah, pp. 85-86; Manbaʿ Uṣūl al-Ḥikma, pp. 27-28.',
      'Manbaʿ, pp. 22-24; Kitab al-Ajnas, pp. 11, 65, 83; Exploring Islamic Occult Manuscripts, pp. 3-4.',
      'Mudih al-Tariq, pp. 20-22, 41-42, 48.',
    ],
  },
  {
    id: 'fawatih-openings',
    slug: 'fawatih-openings',
    title: 'The Openings of the Quran',
    eyebrow: 'Topics',
    subtitle: 'Twenty-nine openings, fourteen roots, and the letters that stand alone.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. Across the 114 chapters of the Quran, exactly 29 surahs open with letters that stand alone. No word, no sentence, just letters. Alif Lam Mim. Kaf Ha Ya Ayn Sad. The books call them the luminous ciphers, al-ahruf al-nuraniyyah, from which creation was spoken into being. I share this for study only, from the books, with their pages named. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'Seventy-eight letters, fourteen roots',
        paragraphs: [
          'Count all the openings, and the letters add to 78. Seventy-eight letters across 29 surahs. But count only the letters that never repeat, and only 14 are left. Alif, Lam, Mim, Sad, Ra, Kaf, Ha, Ya, Ayn, Ta, Sin, Ha, Qaf, Nun. Fourteen roots, and every opening is built from them.',
          'The books give the cipher in one line. Bi-nassin hakimin qatiʿi al-sirr. By a wise text, decisive of the secret. The fourteen letters are the roots, and the cipher is the key the books say unlocks them. Source: Manbaʿ, chapter on the Secrets of Quranic Initials, pp. 27-28; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-73.',
        ],
        quote: {
          arabic: 'بِنَصٍّ حَكِيمٍ قَاطِعِ السِّرِّ',
          transliteration: 'Bi-naṣṣin ḥakīmin qāṭiʿi al-sirr',
          text: 'By a wise text, decisive of the secret.',
          source: 'Manbaʿ, chapter on the Secrets of Quranic Initials, pp. 27-28',
        },
      },
      {
        heading: 'What the early men said',
        paragraphs: [
          'The books record what the early men said about the openings. Ibn Abbas said Alif is Ana, I. Lam is Allah. Mim is Aʿlam, I know best. Ra is Ara, I see. Each letter is a word in short, and the word is a Name.',
          'Abu al-Aliyah gave a longer list. Alif from Allah. Lam from Latif, the Gentle. Mim from Malik, the King. Sad from Sadiq, the Truthful. Ra from Rabb, the Lord. Kaf from Karim, the Generous. Ta from Tayyib, the Good. Sin from Samiʿ, the Hearing. Ha from Hamid, the Praised. Qaf from Qadir, the Powerful. Nun from Nur, the Light. Eleven letters, eleven Names. Source: Manbaʿ, pp. 27-28; Shams, Ch. 1, pp. 28-29.',
        ],
      },
      {
        heading: 'Luminous letters and dark letters',
        paragraphs: [
          'The books split the alphabet in two. Fourteen letters are luminous, nuraniyyah. The other fourteen are dark, zulmaniyyah. Half the alphabet is light, and half is dark, and the books say the two halves mirror each other.',
          'The mirror runs to the sky. Fourteen luminous letters, and fourteen visible lunar mansions. The letters above and the mansions above are counted the same way, the books say. Half the world is seen, and half is hidden, and the letters are split the same way. Source: Usul ʿIlm al-Huruf, Ch. 7, p. 18; Shams, pp. 31, 33.',
        ],
      },
      {
        heading: 'From one letter to five',
        paragraphs: [
          'The openings come in five lengths. One letter, like Sad, Qaf and Nun. Two letters, like Ta-Ha, Ta-Sin, Ya-Sin, and the seven Ha-Mim openings. Three letters, like Alif-Lam-Mim, which opens six surahs.',
          'Four letters, like Alif-Lam-Mim-Sad and Alif-Lam-Mim-Ra. And five letters, only two of them in the whole Quran. Kaf-Ha-Ya-Ayn-Sad, and Ha-Mim-Ayn-Sin-Qaf. Two fivefold chains, and no more. Source: Tafsir Ibn Kathir, Vol. 1, p. 88; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74.',
        ],
      },
      {
        heading: 'The square that adds to 693',
        paragraphs: [
          'The books build a square from the luminous letters. Wafq al-Ahruf al-Nuraniyyah, the square of the luminous letters. Three rows, three columns, three diagonals, and every line adds to exactly 693. The books give the number plainly.',
          'Around the square runs a ring of seven inscriptions. Alif-Lam-Mim. Kaf-Ha-Ya-Ayn-Sad. Ta-Sin. Ha-Mim. Sad. Qaf. Nun. Seven openings written in a ring, and the square in the middle. The letters are the ring. The number is the square. Source: Manbaʿ, chapter on Quranic Initials, pp. 28-29.',
        ],
      },
      {
        heading: 'The shield of the Prophet\u2019s words',
        paragraphs: [
          'The books also give the openings as a shield. Idha laqitumu al-ʿaduwwa ghadan fa-qulu: Kaf-Ha-Ya-ʿAyn-Sad; Ha-Mim; la yunsarun. If you meet the enemy tomorrow, say: Kaf Ha Ya Ayn Sad; Ha Mim; they will not be helped. The words are quoted from the books, as the books give them.',
          'Two more lines stand beside it. Bi-Kaf-Ha-Ya-ʿAyn-Sad kifayatuna. By Kaf Ha Ya Ayn Sad is our sufficiency. Bi-Ha-Mim-ʿAyn-Sin-Qaf himayatuna. By Ha Mim Ayn Sin Qaf is our protection. Sufficiency and protection, the books say, in two short lines. Source: Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.',
        ],
        quote: {
          arabic: 'إِذَا لَقِيتُمُ الْعَدُوَّ غَدًا فَقُولُوا: كَافْ هَا يَا عَيْنْ صَادْ، حَا مِيمْ، لَا يُنْصَرُونَ',
          transliteration: 'Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād; Ḥā-Mīm; lā yunṣarūn',
          text: 'If you meet the enemy tomorrow, say: Kaf Ha Ya Ayn Sad; Ha Mim; they will not be helped.',
          source: 'Shams, Ch. 1, p. 30',
        },
      },
    ],
    terms: [
      { arabic: 'الأحرف النورانية', transliteration: 'al-Aḥruf al-Nūrāniyyah', meaning: 'the luminous letters' },
      { arabic: 'أنا', transliteration: 'Anā', meaning: 'I' },
      { arabic: 'أعلم', transliteration: 'Aʿlam', meaning: 'I know best' },
      { arabic: 'أرى', transliteration: 'Arā', meaning: 'I see' },
      { arabic: 'نورانية', transliteration: 'Nūrāniyyah', meaning: 'luminous' },
      { arabic: 'ظلمانية', transliteration: 'Ẓulmāniyyah', meaning: 'dark' },
      { arabic: 'حا ميم', transliteration: 'Ḥā-Mīm', meaning: 'the Ha-Mim openings, seven surahs' },
      { arabic: 'وفق الأحرف النورانية', transliteration: 'Wafq al-Aḥruf al-Nūrāniyyah', meaning: 'the square of the luminous letters' },
      { arabic: 'كفاية', transliteration: 'Kifāyah', meaning: 'sufficiency' },
      { arabic: 'حماية', transliteration: 'Ḥimāyah', meaning: 'protection' },
    ],
    closing:
      'Twenty-nine openings. Seventy-eight letters. Fourteen roots. One cipher. A split between light and dark. Chains of one letter, two, three, four, five. A square that adds to 693. And a shield in the Prophet\u2019s words. The letters stand alone at the head of the surahs, and the books say they are the first words creation heard. I give them as I found them, for study, and nothing more.',
    sources: [
      'Manbaʿ, chapter on the Secrets of Quranic Initials, pp. 27-28; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-73.',
      'Manbaʿ, pp. 27-28; Shams, Ch. 1, pp. 28-29.',
      'Usul ʿIlm al-Huruf, Ch. 7, p. 18; Shams, pp. 31, 33.',
      'Tafsir Ibn Kathir, Vol. 1, p. 88; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74.',
      'Manbaʿ, chapter on Quranic Initials, pp. 28-29.',
      'Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.',
    ],
  },
  {
    id: 'four-tawaqif',
    slug: 'four-tawaqif',
    title: 'The Four Tawaqif',
    eyebrow: 'Topics',
    subtitle: 'Four halts on the road of the letters, from the Throne to the Tablet.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In the masterworks of Shaykh Ahmad ibn Ali al-Buni, al-Asrar al-Rabbaniyyah, Mudih al-Tariq, and Majmuʿat Thalath Rasaʾil, there is a teaching of four halts. Four stations where the seeker stops at the threshold of God. Here is the decoding of the four halts, directly from the sources. I share this for study only, with the pages named. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'Halting at the threshold',
        paragraphs: [
          'Tawaqquf means halting. The seeker walks the road of the letters, and at four places he must stop and stand still. The one who halts is al-Waqif. He does not push on. He stands at the threshold and waits.',
          'The books name two kinds of halters. Al-Mustahlikun, the absorbed ones, who are lost in what they see. And al-Mardudun, those sent back, who return to the world. The books also say the Alif itself halts. It takes no vowel, and its stillness speaks. The letter halts, and the seeker halts with it. Source: The Journey to the Lord of Power, pp. 48, 116; Shams, Ch. 1, p. 31.',
        ],
      },
      {
        heading: 'The first halt: the Intellect and the Throne',
        paragraphs: [
          'The first halt is the station of the Intellect and the Throne, Mawqif al-ʿAql wa-l-ʿArsh. It stands on the line of Alif. The Alif is the first letter, the straight line, and the Throne is the highest seat. The first halt is the highest one.',
          'The Intellect is the highest mind, and the Throne is the highest seat, and the books put them together in one station. The seeker halts here first, at the top, before he walks down through the rest. Source: al-Asrar al-Rabbaniyyah, pp. 1, 3, 276-278; Exploring Al-Asrar, pp. 1, 3.',
        ],
      },
      {
        heading: 'The second halt: the Spirit and the Footstool',
        paragraphs: [
          'The second halt is the station of the Spirit and the Footstool, Mawqif al-Ruh wa-l-Kursi. It stands on the line of Ba. Below the Throne sits the Footstool, and below the Intellect stands the Spirit. The second halt is one step down.',
          'The books name the dust of this station, al-Habaʾ, the primordial dust, the first matter from which things were shaped. And they name the breathing of the Ruh into Adam, the breath that made the dust a man. The Spirit comes down, and the dust rises up, and they meet at this halt. Source: al-Asrar al-Rabbaniyyah, pp. 275-278; Mudih al-Tariq, pp. 19-20.',
        ],
      },
      {
        heading: 'The third halt: the Heart and the Isthmus',
        paragraphs: [
          'The third halt is the station of the Heart and the Isthmus, Mawqif al-Qalb wa-l-Barzakh. It stands on the line of Jim. The heart stands between the spirit and the body, and the isthmus stands between this world and the next. The third halt is the middle place.',
          'The books name the Universal Soul here, the soul that holds all souls. And they name Yawm al-Taswir, the Day of Fashioning, the day the shapes were given their form. The heart is fashioned at this halt, and the shape it takes is the shape of the man. Source: al-Asrar al-Rabbaniyyah, pp. 276-279; Exploring Al-Asrar, pp. 1, 3.',
        ],
      },
      {
        heading: 'The fourth halt: the Tablet and the body',
        paragraphs: [
          'The fourth halt is the station of the Tablet and bodily composition, Mawqif al-Lawh wa-l-Tarkib. It stands on the line of Dal. The Tablet holds the writing, and the body is the writing made flesh. The fourth halt is the lowest one, and the nearest to us.',
          'The books say the number four governs the physical universe, al-Tarkib al-Murabbaʿ, the fourfold composition. Four elements, four directions, four corners of the earth. The body is built in fours, and the fourth halt is where the building happens. Source: al-Asrar al-Rabbaniyyah, pp. 276-280; Shams, Ch. 1, pp. 61-62.',
        ],
      },
      {
        heading: 'Four windows on every letter',
        paragraphs: [
          'The books give a rule for reading every letter, not just the four halts. Every letter is read through four windows. Haqaʾiq, essential realities. Lataʾif, subtle graces. Isharat, inner indications. ʿIbarat, outward expressions. Four windows, and each one shows a different face of the same letter.',
          'The books say it plainly. "The discussion of it and of all the remaining letters proceeds from four aspects: realities, subtleties, indications, expressions." The letter is one. The readings are four. And the four halts are the four windows, read in order. Source: Majmūʿat Thalāth Rasāʾil, Treatise 3, pp. 173, 176, 178.',
        ],
        quote: {
          text: 'The discussion of it and of all the remaining letters proceeds from four aspects: realities, subtleties, indications, expressions.',
          source: 'Majmūʿat Thalāth Rasāʾil, Treatise 3, pp. 173, 176, 178',
        },
      },
    ],
    terms: [
      { arabic: 'الواقف', transliteration: 'Al-Wāqif', meaning: 'the one who halts' },
      { arabic: 'المستهلكون', transliteration: 'Al-Mustahlikūn', meaning: 'the absorbed ones' },
      { arabic: 'المردودون', transliteration: 'Al-Mardūdūn', meaning: 'those sent back' },
      { arabic: 'موقف العقل والعرش', transliteration: 'Mawqif al-ʿAql wa-l-ʿArsh', meaning: 'the station of the Intellect and the Throne' },
      { arabic: 'موقف الروح والكرسي', transliteration: 'Mawqif al-Rūḥ wa-l-Kursī', meaning: 'the station of the Spirit and the Footstool' },
      { arabic: 'الهباء', transliteration: 'al-Habāʾ', meaning: 'the primordial dust' },
      { arabic: 'موقف القلب والبرزخ', transliteration: 'Mawqif al-Qalb wa-l-Barzakh', meaning: 'the station of the Heart and the Isthmus' },
      { arabic: 'يوم التصوير', transliteration: 'Yawm al-Taṣwīr', meaning: 'the Day of Fashioning' },
      { arabic: 'موقف اللوح والتركيب', transliteration: 'Mawqif al-Lawḥ wa-l-Tarkīb', meaning: 'the station of the Tablet and bodily composition' },
      { arabic: 'التركيب المربع', transliteration: 'al-Tarkīb al-Murabbaʿ', meaning: 'the fourfold composition' },
      { arabic: 'حقائق', transliteration: 'Ḥaqāʾiq', meaning: 'essential realities' },
      { arabic: 'لطائف', transliteration: 'Laṭāʾif', meaning: 'subtle graces' },
      { arabic: 'إشارات', transliteration: 'Ishārāt', meaning: 'inner indications' },
      { arabic: 'عبارات', transliteration: 'ʿIbārāt', meaning: 'outward expressions' },
    ],
    closing:
      'Four halts, four lines, four stations. The Intellect and the Throne. The Spirit and the Footstool. The Heart and the Isthmus. The Tablet and the body. And four windows to read every letter through. The road of the letters is not a straight line. It stops four times, and each stop is a station. That is what the books give. I share it as I found it, for study, and nothing more.',
    sources: [
      'The Journey to the Lord of Power, pp. 48, 116; Shams, Ch. 1, p. 31.',
      'al-Asrar al-Rabbaniyyah, pp. 1, 3, 276-278; Exploring Al-Asrar, pp. 1, 3.',
      'al-Asrar al-Rabbaniyyah, pp. 275-278; Mudih al-Tariq, pp. 19-20.',
      'al-Asrar al-Rabbaniyyah, pp. 276-279; Exploring Al-Asrar, pp. 1, 3.',
      'al-Asrar al-Rabbaniyyah, pp. 276-280; Shams, Ch. 1, pp. 61-62.',
      'Majmūʿat Thalāth Rasāʾil, Treatise 3, pp. 173, 176, 178.',
    ],
  },
  {
    id: 'kaf-ha-ya-ayn-sad',
    slug: 'kaf-ha-ya-ayn-sad',
    title: 'Kaf Ha Ya Ayn Sad',
    eyebrow: 'Topics',
    subtitle: 'Five letters at the head of Surah Maryam, and the five Names they carry.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. At the head of Surah Maryam, the nineteenth surah, stand five letters that make one cluster. Kaf Ha Ya Ayn Sad. The longest single cluster of mysterious letters in the whole Quran. Here is the decoding of Kaf-Ha-Ya-Ayn-Sad, directly from the sources. I share this for study only, with the pages named. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'Five letters, five Names',
        paragraphs: [
          'Ibn Abbas read each letter as a Name. Kaf from al-Kafi, the All-Sufficient. Ha from al-Hadi, the Guide. Ya from al-Hakim, the All-Wise, or from al-Yaqin, absolute certainty. Ayn from al-Alim, the All-Knowing. Sad from al-Sadiq, the Truthful.',
          'Five letters, five Names, and each Name is a face of God. The All-Sufficient, the Guide, the All-Wise, the All-Knowing, the Truthful. The cluster is short, but the books say it holds five Names in five letters. Source: Tafsir Ibn Kathir, Vol. 5, commentary on Surat Maryam, pp. 212-213; Manbaʿ, p. 28.',
        ],
      },
      {
        heading: 'The number 195',
        paragraphs: [
          'The books weigh the five letters in numbers. Hisab al-Jummal, the reckoning of letters by their values. Count the five letters, and the sum is 195. One hundred and ninety-five, and the books call it the master harmonic of the cluster.',
          'The books also spell the letters out in full, the expanded form called Bast. Each letter opens into its own name, and the sum opens with it. The number is the root, and the spelling is the branch. The root is 195, and the books give it plainly. Source: Manbaʿ, chapter on Quranic Initials, pp. 28-29; Shams, Ch. 18, pp. 69-70.',
        ],
      },
      {
        heading: 'The shield of the battle words',
        paragraphs: [
          'The books give the five letters as a shield. Idha laqitumu al-ʿaduwwa ghadan fa-qulu: Kaf-Ha-Ya-ʿAyn-Sad, la yunsarun. If you meet the enemy tomorrow, say: Kaf Ha Ya Ayn Sad; they will not be helped. The words are quoted from the books, as the books give them.',
          'A second line stands beside it. Bi-Kaf-Ha-Ya-ʿAyn-Sad kifayatuna, wa-bi-Ha-Mim-ʿAyn-Sin-Qaf himayatuna. By Kaf Ha Ya Ayn Sad is our sufficiency, and by Ha Mim Ayn Sin Qaf is our protection. Sufficiency from one cluster, protection from the other. Source: Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.',
        ],
        quote: {
          arabic: 'إِذَا لَقِيتُمُ الْعَدُوَّ غَدًا فَقُولُوا: كَافْ هَا يَا عَيْنْ صَادْ، لَا يُنْصَرُونَ',
          transliteration: 'Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād, lā yunṣarūn',
          text: 'If you meet the enemy tomorrow, say: Kaf Ha Ya Ayn Sad; they will not be helped.',
          source: 'Shams, Ch. 1, p. 30',
        },
      },
      {
        heading: 'Five fingers, five organs',
        paragraphs: [
          'The books map the five letters onto the hand. Kaf is the little finger, al-Khinsir. Ha is the ring finger, al-Binsir. Ya is the middle finger, al-Wusta. Ayn is the index finger, al-Sabbabah. Sad is the thumb, al-Ibham.',
          'Five letters, five fingers, and the books say the hand carries the cluster the way the page carries it. The mapping runs from the smallest finger to the thumb, and each finger holds one letter. The body is the page, and the letters are written on it. Source: Usul ʿIlm al-Huruf, pp. 24-26; The Mirror, pp. 98-101.',
        ],
      },
      {
        heading: 'The bridge to Ha Mim Ayn Sin Qaf',
        paragraphs: [
          'The five letters have a pair. Ha-Mim-Ayn-Sin-Qaf, the second fivefold chain, stands beside them. Ten letters together, five and five, and the books call them a celestial bridge. Two clusters, one bridge, and the bridge joins them.',
          'The two clusters share one letter, Ayn. The Eye, the Spring, the Source of Essence. One letter stands in both clusters, and the books say it is the joint of the bridge. The Eye sees, the Spring flows, and the Essence pours out from it. Source: al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74; Manbaʿ, pp. 28-29.',
        ],
      },
      {
        heading: 'The heart of Surah Maryam',
        paragraphs: [
          'The cluster stands at the head of Surah Maryam, and the surah tells of two births from the unseen. Zakariyya was granted Yahya in his old age. Maryam conceived Isa without a father. Two births, and both came from beyond the seen world.',
          'The books say the five letters are the heart of the surah, because the surah is the story of birth from the unseen, and the letters are the unseen written at its head. The letters come first. The births follow. The secret is at the top, and the story flows down from it. Source: Mudih al-Tariq, pp. 28-30; The Holy Quran, Surat Maryam, pp. 305-306.',
        ],
      },
    ],
    terms: [
      { arabic: 'الكافي', transliteration: 'Al-Kāfī', meaning: 'the All-Sufficient' },
      { arabic: 'الهادي', transliteration: 'Al-Hādī', meaning: 'the Guide' },
      { arabic: 'الحكيم', transliteration: 'Al-Ḥakīm', meaning: 'the All-Wise' },
      { arabic: 'اليقين', transliteration: 'Al-Yaqīn', meaning: 'absolute certainty' },
      { arabic: 'العليم', transliteration: 'Al-ʿAlīm', meaning: 'the All-Knowing' },
      { arabic: 'الصادق', transliteration: 'Al-Ṣādiq', meaning: 'the Truthful' },
      { arabic: 'حساب الجمل', transliteration: 'Ḥisāb al-Jummal', meaning: 'Abjad reckoning, letters counted by number values' },
      { arabic: 'بسط', transliteration: 'Basṭ', meaning: 'the expanded spelled form' },
      { arabic: 'كفاية', transliteration: 'Kifāyah', meaning: 'sufficiency' },
      { arabic: 'حماية', transliteration: 'Ḥimāyah', meaning: 'protection' },
      { arabic: 'الخنصر', transliteration: 'al-Khinṣir', meaning: 'the little finger' },
      { arabic: 'البنصر', transliteration: 'al-Binṣir', meaning: 'the ring finger' },
      { arabic: 'الوسطى', transliteration: 'al-Wusṭā', meaning: 'the middle finger' },
      { arabic: 'السبابة', transliteration: 'al-Sabbābah', meaning: 'the index finger' },
      { arabic: 'الإبهام', transliteration: 'al-Ibhām', meaning: 'the thumb' },
      { arabic: 'عين', transliteration: 'ʿAyn', meaning: 'the Eye, the Spring, the Source of Essence' },
    ],
    closing:
      'Five letters, five Names, one number, one shield, five fingers, one bridge, and two births. Kaf Ha Ya Ayn Sad is the longest cluster in the Quran, and the books say it is the heart of Surah Maryam. I read it as they give it, letter by letter, and I give it back the same way. For study, and nothing more.',
    sources: [
      'Tafsir Ibn Kathir, Vol. 5, commentary on Surat Maryam, pp. 212-213; Manbaʿ, p. 28.',
      'Manbaʿ, chapter on Quranic Initials, pp. 28-29; Shams, Ch. 18, pp. 69-70.',
      'Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.',
      'Usul ʿIlm al-Huruf, pp. 24-26; The Mirror, pp. 98-101.',
      'al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74; Manbaʿ, pp. 28-29.',
      'Mudih al-Tariq, pp. 28-30; The Holy Quran, Surat Maryam, pp. 305-306.',
    ],
  },
  {
    id: 'zayirjah',
    slug: 'zayirjah',
    title: 'The Science of the Zayirjah',
    eyebrow: 'Topics',
    subtitle: 'A circular dial of letters, planets and mansions, and the lines that make it speak.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In the treatises of Shaykh Ahmad ibn Ali al-Buni, Manbaʿ Usul al-Hikma, Shams al-Maʿarif al-Kubra, and Al-Asrar al-Rabbaniyyah, the Zayirjah is presented as a specialized mechanical matrix, a circular dial that joins the 28 letters, the planets, the zodiac and the lunar mansions. Here are six sections that decode it, from the books, with the pages named. I share this for study only. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'What the Zayirjah is',
        paragraphs: [
          'In Manbaʿ Usul al-Hikma, al-Buni presents the Zayirjah as a specialized mechanical matrix inherited from ancient wisdom. It is a diagrammatic table that combines the 28 letters, the planets, the zodiac and the lunar mansions in a circular order. It is the physical key to the science of the Zayirjah, ʿIlm al-Zayirjah.',
          'Al-Buni describes its lineage and its rarity. The practice belonged to the first people and the ancient sages, but none of them wrote it down plainly in their books, or if they did, they wrote it in a scattered and incomprehensible way. The apparatus serves as a bridge of speech. Spoken words are dismantled into their letters and numbers, then rebuilt through the table. The outcome is not guessed. It is read from the matrix. Source: Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
        ],
        quote: {
          text: 'This is the practice of the first people and the ancient sages, but none of them mentioned it in any of their books, or, if they did, it was in a scattered and incomprehensible way.',
          source: 'Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14',
        },
      },
      {
        heading: 'The concentric circles',
        paragraphs: [
          'In Shams al-Maʿarif al-Kubra, chapter 3, and in Al-Asrar al-Rabbaniyyah, the physical structure of the Zayirjah is a set of nested circles. At the exact midpoint of the disk sits an unmoving central dot, al-Nuqtah, the primordial central point. Around it, the four seasons and the four natural elements are divided.',
          'Moving outward from the center, the wheel contains the 12 months of the solar and civil calendars, the 12 zodiac signs divided by fire, earth, air and water, the 28 lunar mansions marked with their stellar names, and the 28 Arabic letters arranged by their Abjad numerical values and elemental temperaments. Al-Buni explains the round form by the letters themselves. God created the letters in the Tablet-world as round forms, all of them. The upper world is pure gathering, and the lower world is pure separation. Source: Shams al-Maʿarif, Ch. 3, pp. 56, 74; Al-Asrar al-Rabbaniyyah, pp. 72-73.',
        ],
      },
      {
        heading: 'Three lines: origin, breaking, and the rein',
        paragraphs: [
          'In The Radiant Jewels and Manbaʿ Usul al-Hikma, the engine driving the Zayirjah relies on three successive lines. First comes Satr al-Asl, the line of origin, the initial baseline of the inquiry, formed by writing the question across the matrix. Then comes Satr al-Taksir, the line of permutation, the mathematical cutting and mixing of the letters of the first line.',
          'Last comes Satr al-Zimam, the line of the rein, the master key, the final line produced when the permutation is complete. The arrival of the rein verifies that the mathematical calculation has achieved a closed, balanced circle. Source: The Radiant Jewels, p. 89; Manbaʿ Usul al-Hikma, pp. 13-14.',
        ],
      },
      {
        heading: 'The inverted inscription rule',
        paragraphs: [
          'In Manbaʿ Usul al-Hikma, al-Buni details a specific technical rule for recording inquiries on the grid. When entering data onto the dial, the seeker and the object of inquiry are recorded in opposite forms. The sought thing, al-Matlub, is written in letters above its numerical value. The seeker, al-Talib, is written in numbers above his lettered name.',
          'Al-Buni explains that this inversion mirrors cosmic law. Physical bodies seek their spirits, and spirits seek bodies. To maintain systemic balance, repeated consonants in the inquiry and repeated numbers are removed. Source: Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
        ],
      },
      {
        heading: 'Istintaq and the suffix Il',
        paragraphs: [
          'A calculated diagram remains silent until the practitioner performs Istintaq, causing the matrix to speak. The aggregate Abjad sum of the first line is calculated and written on the reverse of the Zayirjah. This sum is multiplied by the total number of lines generated during taksir, and the resulting total is converted into a balanced square matrix.',
          'The resulting balanced values are converted back into letters according to Abjad, and the suffix Il is added. The books say the derived names are set around the wafq, each in its place, and they are to be followed in this way. Source: Manbaʿ Usul al-Hikma, pp. 13, 16; The Radiant Jewels, p. 89.',
        ],
        quote: {
          text: 'They add to it the word Il and set it around the wafq, each in its place. They are to be followed in this way.',
          source: 'Manbaʿ Usul al-Hikma, pp. 13, 16',
        },
      },
      {
        heading: 'The Balance of Hermes',
        paragraphs: [
          'In Manbaʿ Usul al-Hikma, al-Buni warns that no calculation on the Zayirjah operates independently of time and place. The text gives a strict guideline under the name Mizan Hirmis, the Balance of Hermes. Be vigilant over the times, the zayirja, and the place. Works of good are not to be undertaken under the rule of evil stars.',
          'The operation requires six factors to synchronize at the moment of calculation. The nature of the inquired matter. The ruling planet of the day. The rising degree of the ascendant, al-Taliʿ. The lord of the current hour. The active lunar mansion. And the corresponding pure aromatic substance. Through this alignment, the Zayirjah reflects the cosmic order, turning the letters on the page into a mirror of the heavens. Source: Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
        ],
      },
    ],
    terms: [
      { arabic: 'الزَّايِرْجَة', transliteration: 'Al-Zayirjah', meaning: 'the divinatory letter-matrix, the astronomical dial' },
      { arabic: 'عِلْم الزَّايِرْجَة', transliteration: 'ʿIlm al-Zayirjah', meaning: 'the science of the Zayirjah' },
      { arabic: 'النُّقْطَة', transliteration: 'Al-Nuqtah', meaning: 'the primordial central point' },
      { arabic: 'الأفلاك المتداخلة', transliteration: 'Al-Aflak al-Mutadakhilah', meaning: 'the concentric rings' },
      { arabic: 'سَطْر الأَصْل', transliteration: 'Satr al-Asl', meaning: 'the line of origin' },
      { arabic: 'سَطْر التَّكْسِير', transliteration: 'Satr al-Taksir', meaning: 'the line of permutation, letter-breaking' },
      { arabic: 'سَطْر الزِّمَام', transliteration: 'Satr al-Zimam', meaning: 'the line of the rein, the master key' },
      { arabic: 'المطلوب', transliteration: 'al-Matlub', meaning: 'the sought thing' },
      { arabic: 'الطالب', transliteration: 'al-Talib', meaning: 'the seeker' },
      { arabic: 'إِسْتِنْطَاق', transliteration: 'Istintaq', meaning: 'causing the matrix to speak' },
      { arabic: 'مِيزَان هِرْمِس', transliteration: 'Mizan Hirmis', meaning: 'the Balance of Hermes' },
      { arabic: 'الطالع', transliteration: 'al-Taliʿ', meaning: 'the ascendant' },
    ],
    closing:
      'A dial of circles. Three lines. One inverted rule. One speaking. One balance of time. The Zayirjah joins letters, planets and mansions in one wheel, and the books say the reading comes from the matrix, not from guessing. I give it as I found it, for study, and nothing more.',
    sources: [
      'Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
      'Shams al-Maʿarif, Ch. 3, pp. 56, 74; Al-Asrar al-Rabbaniyyah, pp. 72-73.',
      'The Radiant Jewels, p. 89; Manbaʿ Usul al-Hikma, pp. 13-14.',
      'Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
      'Manbaʿ Usul al-Hikma, pp. 13, 16; The Radiant Jewels, p. 89.',
      'Manbaʿ Usul al-Hikma, chapter on Operations and Tables, pp. 13-14.',
    ],
  },
  {
    id: 'circle-of-encompassing',
    slug: 'circle-of-encompassing',
    title: 'The Circle of Encompassing',
    eyebrow: 'Topics',
    subtitle: 'Every letter, every name, every planet and every soul turns on one cosmic circle.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In the treatises of Shaykh Ahmad ibn Ali al-Buni, Mudih al-Tariq, Al-Asrar al-Rabbaniyyah, and Shams al-Maʿarif al-Kubra, reality is not a box or a straight line. Every letter, every divine name, every planet, and every human soul rotates along a cosmic circle. Here are six sections that decode the Encompassing Circle, from the books, with the pages named. I share this for study only. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'The Name Al-Muhit and the central pole',
        paragraphs: [
          'In chapter 14 of Mudih al-Tariq, al-Buni grounds the circular diagram in the Divine Name Al-Muhit, the All-Encompassing. The Quranic foundation is the verse, Wa-kana Allahu bi-kulli shayʾin muhita, and God ever encompasses all things.',
          'Al-Buni explains that no circle can turn without an unmoving center point, al-Nuqtah, the central pole, al-Qutb. The outer rim is entirely dependent on that central origin. If the central pole is raised, the whole circle rises with it. Likewise, all existents are circular, and the Greatest Name encompasses them, as a pole in the inwardness, and as a circle in the outwardness. Source: Mudih al-Tariq, Ch. 14: On Explaining the Meaning of His Name al-Muhit, pp. 28-29.',
        ],
        quote: {
          arabic: 'وَكَانَ اللَّهُ بِكُلِّ شَيْءٍ مُحِيطًا',
          transliteration: 'Wa-kana Allahu bi-kulli shayʾin muhita',
          text: 'And God ever encompasses all things.',
          source: 'Mudih al-Tariq, Ch. 14, pp. 28-29',
        },
      },
      {
        heading: 'The compass of being',
        paragraphs: [
          'In Mudih al-Tariq, al-Buni uses the metaphor of an architectural drawing compass, al-birkar, also called al-farjar. The circle is traced out through four descending divine realities. Al-Amr, the inward divine command, the primordial hidden impulse. Al-Qudrah, divine power, the initial outward stroke of existence. Al-Iradah, divine will, the shaping and specification of forms. And al-ʿIlm, all-encompassing knowledge, the measuring compass that establishes the boundary.',
          'Existence cannot step outside the boundary of divine knowledge. The verse says, Wa-la yuhituna bi-shayʾin min ʿilmihi illa bi-ma shaʾ, they do not encompass anything of His knowledge except what He wills. Wayfarers remaining close to the central axis experience pure unity, Tawhid. Those pushed to the far rim experience separation and multiplicity. Source: Mudih al-Tariq, pp. 29-30.',
        ],
        quote: {
          arabic: 'وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ',
          transliteration: 'Wa-la yuhituna bi-shayʾin min ʿilmihi illa bi-ma shaʾ',
          text: 'They do not encompass anything of His knowledge except what He wills.',
          source: 'Mudih al-Tariq, pp. 29-30',
        },
      },
      {
        heading: 'The four cosmic rulings of the circle',
        paragraphs: [
          'In Mudih al-Tariq, al-Buni maps the geometric lines of the circle to spiritual ranks and the Divine Throne. First, Nuqat al-Mihwar, the polar points of the axis, the motionless central pivot, the station of the Pole. Second, Nuqat al-Ibdaʿ, the beginning arc of the circumference, the point where divine power touches creation and begins the arc.',
          'Third, Nuqat al-Asmaʾ wa-l-Intihaʾ, the boundary points of manifestation, where divine will completes differentiation and forms reach their end. The straight ray extending from the center to the rim represents the Universal Intellect, al-ʿAql, and the Throne, al-ʿArsh. Source: Mudih al-Tariq, pp. 30-31.',
        ],
      },
      {
        heading: 'Why letters were created as round forms',
        paragraphs: [
          'In Al-Asrar al-Rabbaniyyah, al-Buni reveals why Arabic letters in higher esoteric diagrams are drawn as circles. God, sanctified are His names, created the letters in the Tablet-world as round forms, all of them. The circles carry the meaning God created in the world of the upper, angelic circles.',
          'The upper celestial world, al-ʿAlam al-ʿAlwi, is Jamʿ, pure gathering, pure unity. In this realm letters exist as undivided circles. The lower physical world, al-ʿAlam al-Sufli, is Farq, pure separation, pure differentiation. When letters descend, they break into lines and angles. Inscribing letters in concentric circles, Dawaʾir, during retreat gathers scattered consciousness and returns it to its original round, gathered form. Source: Al-Asrar al-Rabbaniyyah, pp. 72-73.',
        ],
      },
      {
        heading: 'The double arc: Nun and the 24 hours',
        paragraphs: [
          'In Al-Asrar al-Rabbaniyyah and Mudih al-Tariq, two complementary halves are joined to complete the 360-degree circle. The semi-circle of the Nun is the manifest half of existence. Its bowl is the visible half-circle. The first testimony of faith, La ilaha illa Allah, contains exactly 12 letters without dots. These form the circle of the day, 12 hours of light, and the 12 months.',
          'The second testimony, Muhammadun Rasul Allah, also contains 12 letters. These form the circle of the night, 12 hours of darkness. United, these 24 letters complete the full daily cycle, encompassing every human breath, element, and hour. Source: Al-Asrar al-Rabbaniyyah, pp. 118-120; Mudih al-Tariq, pp. 25-27.',
        ],
      },
      {
        heading: 'The Aleppo vision',
        paragraphs: [
          'In chapter 6 of Shams al-Maʿarif al-Kubra, al-Buni documents a historical vision of an ascetic imam in Aleppo. In a dark preaching cell, the imam witnessed a visionary tablet of concentric circles. An outer circle enclosed an inner circle, separated by a defined margin. Inside was a horizontal diameter with an upward-pointing inscribed triangle, and in the angles of the triangle stood letters of power.',
          'Inscribed upon the outer edge was the scriptural proof of encompassing, Wa-Allahu min waraʾihim muhit, bal huwa Qurʾanun majidun fi lawhin mahfuz, and God encompasses them from behind, indeed, it is a glorious Quran in a preserved tablet. In a visionary confirmation, Imam Ali ibn Abi Talib touched the letter Jim in the triangle and confirmed the diagram. Source: Shams al-Maʿarif, Ch. 6: On Seclusion and the Etiquette of Retreat, pp. 64-66.',
        ],
        quote: {
          arabic: 'وَاللَّهُ مِنْ وَرَائِهِمْ مُحِيطٌ بَلْ هُوَ قُرْآنٌ مَجِيدٌ فِي لَوْحٍ مَحْفُوظٍ',
          transliteration: 'Wa-Allahu min waraʾihim muhit, bal huwa Qurʾanun majidun fi lawhin mahfuz',
          text: 'And God encompasses them from behind; indeed, it is a glorious Quran in a preserved tablet.',
          source: 'Shams al-Maʿarif, Ch. 6, pp. 64-66',
        },
      },
    ],
    terms: [
      { arabic: 'المُحِيط', transliteration: 'Al-Muhit', meaning: 'the All-Encompassing' },
      { arabic: 'القطب', transliteration: 'al-Qutb', meaning: 'the central pole' },
      { arabic: 'الأَمْر', transliteration: 'Al-Amr', meaning: 'the inward divine command' },
      { arabic: 'القُدْرَة', transliteration: 'Al-Qudrah', meaning: 'divine power' },
      { arabic: 'الإِرَادَة', transliteration: 'Al-Iradah', meaning: 'divine will' },
      { arabic: 'العِلْم', transliteration: 'Al-ʿIlm', meaning: 'all-encompassing knowledge' },
      { arabic: 'نُقَط المِحْوَر', transliteration: 'Nuqat al-Mihwar', meaning: 'the polar points of the axis' },
      { arabic: 'لا إله إلا الله', transliteration: 'La ilaha illa Allah', meaning: 'the first testimony of faith, 12 letters' },
      { arabic: 'محمد رسول الله', transliteration: 'Muhammadun Rasul Allah', meaning: 'the second testimony, 12 letters' },
      { arabic: 'الصُّوَر المُسْتَدِيرَة', transliteration: 'Al-Suwar al-Mustadirah', meaning: 'the circular forms' },
      { arabic: 'جَمْع', transliteration: 'Jamʿ', meaning: 'pure gathering, unity' },
      { arabic: 'فَرْق', transliteration: 'Farq', meaning: 'pure separation, differentiation' },
    ],
    closing:
      'One Name that encompasses all things. One pole that never moves. Four realities that trace the circle. Round letters from the Tablet-world. Two halves that make one day. And one vision in Aleppo, sealed by a verse. The circle holds everything, and the center holds the circle. I give it as I found it, for study, and nothing more.',
    sources: [
      'Mudih al-Tariq, Ch. 14: On Explaining the Meaning of His Name al-Muhit, pp. 28-29.',
      'Mudih al-Tariq, pp. 29-30.',
      'Mudih al-Tariq, pp. 30-31.',
      'Al-Asrar al-Rabbaniyyah, pp. 72-73.',
      'Al-Asrar al-Rabbaniyyah, pp. 118-120; Mudih al-Tariq, pp. 25-27.',
      'Shams al-Maʿarif, Ch. 6: On Seclusion and the Etiquette of Retreat, pp. 64-66.',
    ],
  },
  {
    id: 'simiya-works',
    slug: 'simiya-works',
    title: 'The Works of Simiya',
    eyebrow: 'Topics',
    subtitle: 'Letters as bodies, numbers as spirits, and the squares that hold them.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In the master texts of Shaykh Ahmad ibn Ali al-Buni, Shams al-Maʿarif al-Kubra, Manbaʿ Usul al-Hikma, and Usul ʿIlm al-Huruf, along with the ancient Solomonic transmissions in Kitab al-Ajnas, Simiyaʿ is not cheap illusion or demonic sorcery. It is an exact theurgic science that aligns celestial spiritualities with physical matter through the mathematical architecture of letters and Divine Names. Here are six sections that decode the works of Simiyaʿ, from the books, with the pages named. I share this for study only. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'The real meaning of Simiyaʿ',
        paragraphs: [
          'In Shams al-Maʿarif al-Kubra, chapter 17, and in Kitab al-Ajnas, the classical masters elevate Simiyaʿ far above ordinary magic. Al-Buni addresses the seeker concerning the nobility of this knowledge, praying that God bring him to the alchemy of everlasting happiness and the simiyaʿ of perpetual sovereignty.',
          'In Kitab al-Ajnas, Simiyaʿ is introduced as the ancient Solomonic science, the science by which the blind are made to see and the deaf are made to hear. In Shams al-Maʿarif, al-Buni notes that this science was verified by great imams. It operates through pure Divine Unity, Tawhid, upon all receptacles of possibility. Source: Shams al-Maʿarif, Ch. 17, pp. 63-64; Kitab al-Ajnas, pp. 3, 21.',
        ],
      },
      {
        heading: 'Letters as bodies, numbers as spirits',
        paragraphs: [
          'In Usul ʿIlm al-Huruf, Al-Asrar al-Rabbaniyyah, and Shams al-Maʿarif, al-Buni sets down the central metaphysical axiom of Simiyaʿ. Al-Huruf, the letters, are bodies, Ajsam. They provide the outward physical form, ink, sound, and shape. Al-Aʿdad, the numbers, are spirits, Arwah. They provide the inward, invisible kinetic frequency and spirit of the letter.',
          'The grimoire records a universal proportional law. Numbers stand in the secret of sayings as letters stand in the secret of acts. And Solomon’s vizier Asif ibn Barkhiya is quoted directly. Forms are a magnet for their spirits. Whenever a form is depicted, it draws its spirit to itself. If the form is perfect, the spirit descends into it. Physical letterforms inscribed on a plate act as shapes. When constructed with their exact numerical values, they draw their spiritual counterpart. Source: Usul ʿIlm al-Huruf, p. 11; Al-Asrar al-Rabbaniyyah, pp. 72-73, 118-119.',
        ],
        quote: {
          text: 'Forms are a magnet for their spirits. Whenever a form is depicted, it draws its spirit to itself; if the form is perfect, the spirit descends into it.',
          source: 'Usul ʿIlm al-Huruf, p. 11',
        },
      },
      {
        heading: 'The elemental engine',
        paragraphs: [
          'In Bunian Simiyaʿ, no talisman or letter-grid can function without harmonizing the four foundational elements. The Arabic alphabet is divided into four elemental groups of seven letters each. Fire, Nar, hot and dry: Alif, Haʾ, Taʾ, Mim, Faʾ, Shin, Dhal. It ignites intention and quickens spiritual agency. Air, Hawaʾ, hot and moist: Jim, Zay, Kaf, Sin, Qaf, Thaʾ, Zaʾ. It governs ethereal elevation, attraction, and mental transmission.',
          'Water, Maʾ, cold and moist: Dal, Haʾ, Lam, ʿAyn, Raʾ, Khaʾ, Ghayn. It cools, dissolves enmity, brings peace, and facilitates inner receptive states. Earth, Turab, cold and dry: Baʾ, Waw, Yaʾ, Nun, Sad, Taʾ, Dad. It fixes, anchors, and binds the operation permanently into physical matter. In chapter 6 of Usul ʿIlm al-Huruf and in Manbaʿ Usul al-Hikma, al-Buni demonstrates how letters of opposite natures are blended to balance a working. Source: Usul ʿIlm al-Huruf, Ch. 6, p. 16; Manbaʿ Usul al-Hikma, pp. 18-19.',
        ],
      },
      {
        heading: 'The science of squares',
        paragraphs: [
          'The primary physical container used in Simiyaʿ to house spiritual frequencies is the Wafq, the magic square. It is a grid of rows and columns, aʿmida wa-sutur, where every horizontal row, vertical column, and diagonal sums to the same total.',
          'The foundational square of Simiyaʿ is the 3x3 grid, the Muthallath, al-Wafq al-Thulathi. Its constant sum along every axis is 15, producing a total volume of 45, the exact numerical value of Adam. In Manbaʿ Usul al-Hikma, al-Buni explains that a square remains inert until its four corners are anchored by angelic names. This balanced numerical harmony locks the spiritual current inside the grid. Source: Manbaʿ Usul al-Hikma, pp. 13-15; Hadha Hijab, Glossary, p. 102.',
        ],
      },
      {
        heading: 'Istintaq and the suffix Il',
        paragraphs: [
          'A calculated talisman or magic square remains silent until the practitioner extracts its governing angel. When the numerical calculations of an inquiry, divine name, or verse reach a final balance, the remainder is converted back into letters. In The Radiant Jewels and Manbaʿ Usul al-Hikma, the sacred celestial suffix is appended to the derived letters.',
          'Once spoken, this newly derived angelic name, al-malak al-muwakkal, stands in the World of the Kingdom. The upper angel holds authority over terrestrial spiritual servitors, khuddam, directing them to carry out the operation. The books say Il must be added to the aids, according to the saying of the excellent sage Aristotle. Source: Manbaʿ Usul al-Hikma, pp. 13, 16, 21; The Radiant Jewels, p. 89.',
        ],
      },
      {
        heading: 'The ethical covenant',
        paragraphs: [
          'The final, absolute condition of Simiyaʿ across the Bunian manuscripts is that spiritual operations require purity, permission, and obedience. In the opening preface of Shams al-Maʿarif, al-Buni sets down a solemn oath. It is forbidden, haram, for anyone into whose hand this book of his falls to reveal it to anyone unworthy.',
          'In Suns of Lights, the master Ibn al-Hajj al-Tilmsani emphasizes that no operation stands without four conditions. Makan, a sacred place, a pure, isolated sanctuary free from worldly distraction. Ikhwah, spiritual fellowship, sincere companions united in truth. Zaman, proper celestial time, exact synchronization with planetary rulers, hours, and lunar phases. And Shaykh al-Tariq, the authorizing master, receiving direct initiatory permission, Idhn, Ijazah. The texts warn that without initiatory permission and purity, a practitioner attempting these operations will fail and be stripped of the power. Source: Shams al-Maʿarif, Preface, pp. 1-2; Suns of Lights, Ch. 19, pp. 47-48.',
        ],
      },
    ],
    terms: [
      { arabic: 'عِلْم السِّيمِيَاء', transliteration: 'ʿIlm al-Simiyaʾ', meaning: 'the science of letters, divine names, and talismanic matrices' },
      { arabic: 'الحُرُوف', transliteration: 'Al-Huruf', meaning: 'letters, the bodies' },
      { arabic: 'الأَعْدَاد', transliteration: 'Al-Aʿdad', meaning: 'numbers, the spirits' },
      { arabic: 'وَفْق', transliteration: 'Wafq', meaning: 'a magic square' },
      { arabic: 'الوفق الثلاثي', transliteration: 'Al-Wafq al-Thulathi', meaning: 'the 3x3 mother matrix' },
      { arabic: 'آدم', transliteration: 'Adam', meaning: 'Adam, whose numerical value is 45' },
      { arabic: 'مَكَان', transliteration: 'Makan', meaning: 'a sacred place' },
      { arabic: 'إِخْوَة', transliteration: 'Ikhwah', meaning: 'spiritual fellowship' },
      { arabic: 'زَمَان', transliteration: 'Zaman', meaning: 'proper celestial time' },
      { arabic: 'شَيْخ الطَّرِيق', transliteration: 'Shaykh al-Tariq', meaning: 'the authorizing master' },
      { arabic: 'تحريم', transliteration: 'Tahrim', meaning: 'a binding prohibition' },
      { arabic: 'الملك الموكل', transliteration: 'al-malak al-muwakkal', meaning: 'the newly derived angelic name' },
    ],
    closing:
      'A royal science, not vulgar magic. Letters for bodies, numbers for spirits. Four elements in balance. A square that holds the current. A name that speaks. And four conditions that cannot be skipped: place, fellowship, time, and a master’s permission. The books give all of it together. I give it as I found it, for study, and nothing more.',
    sources: [
      'Shams al-Maʿarif, Ch. 17, pp. 63-64; Kitab al-Ajnas, pp. 3, 21.',
      'Usul ʿIlm al-Huruf, p. 11; Al-Asrar al-Rabbaniyyah, pp. 72-73, 118-119.',
      'Usul ʿIlm al-Huruf, Ch. 6, p. 16; Manbaʿ Usul al-Hikma, pp. 18-19.',
      'Manbaʿ Usul al-Hikma, pp. 13-15; Hadha Hijab, Glossary, p. 102.',
      'Manbaʿ Usul al-Hikma, pp. 13, 16, 21; The Radiant Jewels, p. 89.',
      'Shams al-Maʿarif, Preface, pp. 1-2; Suns of Lights, Ch. 19, pp. 47-48.',
    ],
  },
  {
    id: 'uses-of-letters-retreats',
    slug: 'uses-of-letters-retreats',
    title: 'The Uses of Letters and Their Retreats',
    eyebrow: 'Topics',
    subtitle: 'Living spiritual nations, each with its own retreat and its own guardian angel.',
    addedDate: '2026-11-19',
    intro:
      'I am Khafi. In the treatises of Shaykh Ahmad ibn Ali al-Buni, Manbaʿ Usul al-Hikma, Shams al-Maʿarif al-Kubra, and Usul ʿIlm al-Huruf, the Arabic letters are not dead marks on paper. They are living spiritual nations, each with its own retreat, khalwah, and its own guardian angel. Here are six sections that decode the uses of the letters and their retreats, from the books, with the pages named. I share this for study only, as historical material. This is not a ruling, and it promises nothing.',
    sections: [
      {
        heading: 'Letters as living nations',
        paragraphs: [
          'In Manbaʿ Usul al-Hikma and Ibn ʿArabi’s al-Futuhat al-Makkiyyah, the tradition establishes the metaphysical reality of letters. The letters are a nation among nations, Umamun min al-Umam, addressed and made responsible, like nations. Among them are emissaries and servants.',
          'The written shape is the Jism, the physical body. The Abjad numerical count, al-ʿadad, is the Ruh, the living spirit. In Manbaʿ Usul al-Hikma, Imam al-Khwarizmi records the classical invocation of the letter’s guardian. O King, mix your spirituality with my nature and the nature of this letter, so that I may act through its secret. Source: Manbaʿ Usul al-Hikma, chapter on the Kings of the Letters, pp. 33-35; al-Futuhat al-Makkiyyah, Vol. 4, pp. 112-114.',
        ],
      },
      {
        heading: 'The letter Alif',
        paragraphs: [
          'In Shams al-Maʿarif and Manbaʿ Usul al-Hikma, the primordial letter Alif stands at the root of all spiritual knowledge. The books record its properties in the old language of the art. Writing Alif 1,000 times and carrying it upon the chest is said to clear cognitive sluggishness and dullness of mind.',
          'When the name of the letter is spelled out in full, Alif, 1 plus 30 plus 80, its total is 111. Inscribing it 111 times under the solar hour on Sunday is said to bring awe, dignity, and elevation. The supreme angelic intelligence governing the letter Alif is Taltamiyaʾil, the angel of the first lunar mansion. Al-Buni also provides the 3x3 triangular wafq of Alif, equaling 111 along every side, to be used in retreat. Source: Manbaʿ Usul al-Hikma, pp. 24-25; Shams al-Maʿarif, Ch. 1, pp. 38-39, 48.',
        ],
      },
      {
        heading: 'The letter Baʾ',
        paragraphs: [
          'The letter Baʾ represents the beginning of the manifest universe and the reception of divine compassion. Its properties in the books are relieving spiritual constriction and expanding the heart, inshirah al-sadr, removing spiritual laziness, and soothing chronic cold ailments.',
          'In Al-Asrar al-Rabbaniyyah and Shams al-Maʿarif, al-Buni explains the practical retreat as the books record it. The seeker fasts on Thursday and Friday in total physical and spiritual cleanliness. Alms, sadaqah, are distributed to the poor. The twin circular talisman of Baʾ is inscribed and carried on the upper right arm. Al-Buni writes concerning the outcome of this discipline that laziness will leave him, the secret of standing by the Baʾ will be made manifest to him, and he will see the lights of the angels. Source: Al-Asrar al-Rabbaniyyah, pp. 100-101; Shams al-Maʿarif, Ch. 5, p. 50.',
        ],
      },
      {
        heading: 'The letter Jim and the angel Talqiyaʾil',
        paragraphs: [
          'In Manbaʿ Usul al-Hikma, the third letter, Jim, is connected to an intensive solitary retreat. Its properties in the books are quenching the agony of burning thirst during arid journeys, cooling extreme, inflammatory fevers, and granting acceptance, dignity, and easing difficult childbirth.',
          'Al-Buni specifies the retreat in the books’ own words. This letter has a mighty retreat: you enter it in complete purity, speak the invocation, write the letter. The celestial servant of this station is named Talqiyaʾil. When the seeker witnesses his spiritual appearance in the cell, a mutual covenant, ʿahd, of divine service is made. Source: Manbaʿ Usul al-Hikma, chapter on the Properties of the Letters, pp. 26, 36, 40.',
        ],
      },
      {
        heading: 'The 14-day retreat of the letter Dal',
        paragraphs: [
          'In chapter 1 of Shams al-Maʿarif al-Kubra, al-Buni records a strict two-week discipline governed by the letter Dal. Its properties in the books are securing enduring blessing, barakah, within the household, safeguarding lawful trade and sustenance from sudden ruin, and cultivating enduring love and harmony among family members.',
          'The discipline runs fourteen consecutive days. At every sunset meal, the seeker eats only plain bread, completely abstaining from meat, milk, and animal products. On the final Thursday at sunrise, the hour of Jupiter, the seeker completes the retreat. The books say this unlocks lasting clarity, protection, and abundant lawful sustenance. Source: Shams al-Maʿarif, Ch. 1, pp. 32-34, 46; Decoding Al-Buni, p. 3.',
        ],
      },
      {
        heading: 'The therapeutic letters: Haʾ, Mim, and Nun',
        paragraphs: [
          'The Bunian corpus identifies specific therapeutic properties for the higher letters of the alphabet. The letter Haʾ extinguishes inflammatory heat and lust. Written eight times and combined with the Divine Names Hakim, the Wise, Halim, the Forbearing, and Hayy, the Living, dissolving the writing in pure water stills fevers and burning chest pains. Engraving Haʾ on a ring-bezel extinguishes lower sexual lust, shahwah, preserving the seeker’s spiritual state.',
          'The letter Mim governs 40-day cycles. Contemplating the linear talisman of Mim daily while reciting Q 3:26, Quli Allahumma malika al-mulk, gives penetrating speech and authority. The letter Nun gives intuitive perception and the inner eye. Writing Nun thirteen times upon a clean mirror while reciting the Light Verse, Ayat al-Nur, Q 24:35, clears mental confusion and opens inner sight. Source: Manbaʿ Usul al-Hikma, pp. 22-26, 35, 38-39; Shams al-Maʿarif, Ch. 1, pp. 28-30, 35.',
        ],
      },
    ],
    terms: [
      { arabic: 'أُمَمٌ مِنَ الأُمَم', transliteration: 'Umamun min al-Umam', meaning: 'nations among the nations' },
      { arabic: 'جِسْم', transliteration: 'Jism', meaning: 'the physical body' },
      { arabic: 'رُوح', transliteration: 'Ruh', meaning: 'the living spirit' },
      { arabic: 'ا', transliteration: 'Alif', meaning: 'the first letter, the king of letters' },
      { arabic: 'طَلْطَمِيَائِيل', transliteration: 'Taltamiyaʾil', meaning: 'the angel of Alif, of the first lunar mansion' },
      { arabic: 'ب', transliteration: 'Baʾ', meaning: 'the second letter, the beginning of the manifest universe' },
      { arabic: 'ج', transliteration: 'Jim', meaning: 'the third letter' },
      { arabic: 'طَلْقِيَائِيل', transliteration: 'Talqiyaʾil', meaning: 'the celestial servant of Jim' },
      { arabic: 'د', transliteration: 'Dal', meaning: 'the fourth letter' },
      { arabic: 'ح', transliteration: 'Haʾ', meaning: 'the letter that extinguishes heat' },
      { arabic: 'م', transliteration: 'Mim', meaning: 'the letter of 40-day cycles' },
      { arabic: 'ن', transliteration: 'Nun', meaning: 'the letter of inner sight' },
    ],
    closing:
      'Letters as nations. A body and a spirit in every letter. Alif and its 111. Baʾ and its fast. Jim and its angel. Dal and its fourteen days. Haʾ, Mim, and Nun, each with its own work. The books record all of it as the old masters taught it, with purity and permission at the center. I give it as I found it, for study, and nothing more.',
    sources: [
      'Manbaʿ Usul al-Hikma, chapter on the Kings of the Letters, pp. 33-35; al-Futuhat al-Makkiyyah, Vol. 4, pp. 112-114.',
      'Manbaʿ Usul al-Hikma, pp. 24-25; Shams al-Maʿarif, Ch. 1, pp. 38-39, 48.',
      'Al-Asrar al-Rabbaniyyah, pp. 100-101; Shams al-Maʿarif, Ch. 5, p. 50.',
      'Manbaʿ Usul al-Hikma, chapter on the Properties of the Letters, pp. 26, 36, 40.',
      'Shams al-Maʿarif, Ch. 1, pp. 32-34, 46; Decoding Al-Buni, p. 3.',
      'Manbaʿ Usul al-Hikma, pp. 22-26, 35, 38-39; Shams al-Maʿarif, Ch. 1, pp. 28-30, 35.',
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
  'basmalah-secrets': 'topic-basmalah',
  'throne-verse': 'topic-kursi',
  'greatest-name': 'topic-greatest-name',
  'fawatih-openings': 'topic-fawatih',
  'four-tawaqif': 'topic-tawaqif',
  'kaf-ha-ya-ayn-sad': 'topic-khayas',
  'zayirjah': 'topic-zayirjah',
  'circle-of-encompassing': 'topic-ihatah',
  'simiya-works': 'topic-simiya',
  'uses-of-letters-retreats': 'topic-khalawat',
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
  'topic-basmalah',
  'topic-kursi',
  'topic-greatest-name',
  'topic-fawatih',
  'topic-tawaqif',
  'topic-khayas',
  'topic-zayirjah',
  'topic-ihatah',
  'topic-simiya',
  'topic-khalawat',
  'topics-questions',
  'topics-guides',
];

/** True when the view is a Topics page (hub, topic, questions, guides). */
export function isTopicsView(view: string): boolean {
  return (TOPIC_VIEWS as string[]).includes(view);
}
