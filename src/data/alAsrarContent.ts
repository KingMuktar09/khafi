/**
 * Content gathered from the Al Asrar notebook (NotebookLM, "Al-Asrār:
 * The Master Grimoire", 98 sources), 18 Nov 2026.
 *
 * Every entry here comes from that notebook's own Gemini chat, one
 * topic at a time, with the source book and page asked for at every
 * point. Nothing here is invented. Where a point has no source, the
 * source line says so plainly.
 *
 * The John Friend edition is named where the material comes from it:
 * Shams al-Ma'arif al-Kubra, translated by John Friend (John Friend
 * Publishing, 2026), as identified by the notebook for the file
 * "Shams Al Marif Al Kubra- Al Ahmad al buni.pdf".
 *
 * Writing rules for this content: simple and easy words, short lines,
 * deep explanation, very few em dashes, not many commas, no difficult
 * words. Arabic terms are shown with Arabic script, transliteration
 * and a plain-English meaning.
 */

export interface AlAsrarEntry {
  title: string;
  /** 2 to 4 short sentences, plain words. */
  body: string;
  /** Source book and page, e.g. "Kitab al-Ajnas, Glossary, p. 147". */
  source: string;
  /** Arabic term as printed, when the entry is about one. */
  arabic?: string;
  /** Latin transliteration of the Arabic term. */
  transliteration?: string;
  /** Plain-English meaning of the Arabic term. */
  meaning?: string;
}

export interface FilledToolContent {
  id: string;
  /** First-person intro, in Khafi's voice. */
  intro: string;
  entries: AlAsrarEntry[];
}

/**
 * The 15 Tier B tools filled in Stage 3A. Works, Bakhur and Adad,
 * Shurut and Glossary stay shells. Their material is in the second
 * batch and is not in hand yet.
 */
export const AL_ASRAR_TOOLS: Record<string, FilledToolContent> = {
  kitab: {
    id: 'kitab',
    intro:
      'I have spent a long time with these books. The word kitab means a book. But in the old books it means much more than paper and ink. Here is what I found about the Book, from the books themselves.',
    entries: [
      {
        title: 'The Three Mothers of Books',
        body: 'Ibn Arabi speaks of three mothers of books. The first is the Written Book. The second is the Differentiated Inscribed Book. The third is the Unknown Book. Each one is a level of how knowledge is written down in the cosmos.',
        source: 'al-Futuhat al-Makkiyyah, vol. 4, pp. 154-157',
        arabic: 'كتاب',
        transliteration: 'kitab',
        meaning: 'book, writing',
      },
      {
        title: 'The First Book and the Hidden Book',
        body: 'Al-Buni sets the First Book against the Hidden Book, also called the Total Book. Behind both stands the Primordial Inscription. The written book you hold is only one face of a much larger writing.',
        source: 'Mudih al-Tariq, pp. 47-49, 49-50, 42, 44',
      },
      {
        title: 'The Cosmic Book and the Written Book',
        body: 'The books draw a line between two books. One is the cosmic book, the world itself as a text. The other is the written book, the words on the page. The Sufi reads both. The page teaches him how to read the world.',
        source: 'islamic-spirituality-foundations.pdf, p. 177, p. 178 n. 1; Chittick, The Sufi Path of Knowledge, p. 131',
      },
      {
        title: 'The Preserved Tablet',
        body: 'The Preserved Tablet is the book in which all things are written before they come to be. Al-Buni returns to it again and again. It is the storehouse of the divine writing, and every other book is a copy drawn from it.',
        source: 'al-Asrar al-Rabbaniyyah, p. 146; Mudih al-Tariq, p. 43; Mystical Dimensions of Islam, pp. 89-90',
        arabic: 'اللوح المحفوظ',
        transliteration: 'al-Lawh al-Mahfuz',
        meaning: 'the Preserved Tablet',
      },
      {
        title: 'Titled Kitabs in the library',
        body: 'Some books carry Kitab in their very title. Kitab al-Ajnas, the Book of Kinds, opens with its own title page and a table of its parts. Kitab Tumtum al-Hindi is the book of Tumtum the Indian. Kitab al-Babiqat is the Book of the Prophet Daniel.',
        source: 'Kitab al-Ajnas, title pp. 4, 21; Kitab Tumtum al-Hindi, p. 119; Kitab al-Babiqat / Book of the Prophet Daniel',
      },
    ],
  },

  talasim: {
    id: 'talasim',
    intro:
      'A talisman is not a charm you buy in a market. In the old books it is a thing made with care, with Names and letters and numbers set in balance. Here is what the books say it is.',
    entries: [
      {
        title: 'What a talisman is',
        body: 'A talisman is a physical object. Divine Names, sacred letters or balanced numbers are written on it. The writing is meant to capture a spiritual effect and hold it in one place, so the effect stays with the object.',
        source: 'Kitab al-Ajnas, Glossary, p. 147; Hadha Hijab, Glossary, p. 30',
        arabic: 'طلسم',
        transliteration: 'tilasm',
        meaning: 'talisman, inscribed figure',
      },
      {
        title: 'The Luminous Talisman',
        body: 'One kind is called the Luminous Talisman. It is made of light, not of matter. The books name it among the highest figures, because light is the closest thing in creation to the spirit.',
        source: 'Kitab al-Ajnas, Glossary, p. 147',
        arabic: 'الطلسم النوراني',
        transliteration: 'al-Tilasm al-Nurani',
        meaning: 'the Luminous Talisman',
      },
      {
        title: 'It embodies Malakut and Mulk',
        body: 'A talisman stands between two worlds. It embodies Malakut, the unseen world of spirits, and Mulk, the seen world of bodies. The figure joins them, so what is above can touch what is below.',
        source: 'al-Asrar al-Rabbaniyyah, Letter Ba, p. 88',
      },
      {
        title: 'Shapes: circle and triangle',
        body: 'The books draw talismans in circles and triangles. The circle has no beginning and no end. The triangle sets three powers in balance. Both shapes appear in the diagrams, with the Hermetic Balances beside them.',
        source: 'al-Asrar al-Rabbaniyyah, diagram p. 148; Manba\u2019 Usul al-Hikma, Eighth Gift, p. 136',
      },
      {
        title: 'The lineage: Hermes and Aristotle',
        body: 'The books trace the art back to Hermes, and through him to Aristotle. The passage called "The Great Talisman" tells that line of teachers. The art is old, and its chain is part of its claim.',
        source: 'Kitab al-Ajnas, "The Great Talisman", pp. 83-84',
      },
      {
        title: 'The Staff of Moses',
        body: 'One famous figure is tied to the Staff of Moses. It sits in the Shams under the heading "Folded Slip of Noble Names". The staff is the sign of a power that turns aside harm and opens a road.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), "Folded Slip of Noble Names", pp. 62-65',
      },
      {
        title: 'The Basmala circle of protection',
        body: 'A circle is drawn with the Basmala, "In the name of God, the Merciful, the Compassionate". It is a ring of protection. The Name stands guard at the edge, and nothing unwelcome is meant to cross it.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 55',
        arabic: 'بسم الله الرحمن الرحيم',
        transliteration: 'Bismillah al-Rahman al-Rahim',
        meaning: 'In the name of God, the Merciful, the Compassionate',
      },
      {
        title: 'Ibn Sab\u2019in\u2019s healing dot poem',
        body: 'Ibn Sab\u2019in left a short poem about a healing dot. One dot, set in the right place, carries the whole figure. The books quote it as proof that small things can hold great power.',
        source: 'Kitab al-Ajnas, p. 86',
      },
      {
        title: 'Memory and knowledge',
        body: 'One figure is made for memory and knowledge. It is tied to the Name al-Fattah, the Opener. The one who carries it seeks an open mind and a memory that holds what it learns.',
        source: 'Manba\u2019 Usul al-Hikma, "Name al-Fattah", p. 88',
      },
      {
        title: 'Four strict conditions',
        body: 'No talisman is made without four conditions. The Place must be right. The Companions must be right. The Time must be right. And a Spiritual Master must guide the work. Miss one, and the books say the work is not sound.',
        source: 'Suns of Lights and the Great Treasure, "Four Conditions", pp. 11-12',
      },
      {
        title: 'Ibn Arabi\u2019s metaphorical use',
        body: 'Ibn Arabi also uses the word talisman in a different way. For him it can stand for a meaning hidden inside a form. The form is the shell. The meaning is the secret kept inside it.',
        source: 'al-Futuhat al-Makkiyyah, vol. 1, Introduction, p. 28',
      },
    ],
  },

  ashkal: {
    id: 'ashkal',
    intro:
      'Ashkal means forms. A form is not just a shape on paper. In these books a form is a vessel. It holds a spirit the way a cup holds water. Here is what the books say about forms.',
    entries: [
      {
        title: 'Forms are a magnet for their spirits',
        body: 'Asif ibn Barkhiya says it plainly. Forms are a magnet for their spirits. Make the form right, and the spirit that fits it is drawn to it. Make it wrong, and nothing comes.',
        source: 'Usul \u2019Ilm al-Huruf, p. 53',
        arabic: 'أشكال',
        transliteration: 'ashkal',
        meaning: 'forms, figures',
      },
      {
        title: 'The Four Manifestation Ranks',
        body: 'Forms appear in four ranks of manifestation. Each rank is a step down from the unseen into the seen. The books list them so the reader knows where a form stands on the ladder.',
        source: 'al-Asrar al-Rabbaniyyah, p. 65',
      },
      {
        title: 'Point and Circle',
        body: 'All forms begin with the Point. The Point grows into the Circle. The circle is the first shape, and every other shape is drawn inside it. The books return to the Point and the Circle on many pages.',
        source: 'Mudih al-Tariq, pp. 118-119; al-Asrar al-Rabbaniyyah, pp. 82, 119',
      },
      {
        title: 'Triangle',
        body: 'The Triangle comes after the Circle. Three points hold three powers in balance. The books give its diagram and its places in the ranks, and they use it to show how three things can stand as one.',
        source: 'al-Asrar al-Rabbaniyyah, p. 62, diagram p. 148; pp. 88, 148',
      },
      {
        title: 'Square',
        body: 'The Square is the form of balance and rest. Four sides, four corners, four powers held even. The books place it after the Triangle, as the form where things settle.',
        source: 'al-Asrar al-Rabbaniyyah, p. 63 (and p. 76)',
      },
      {
        title: 'Magic squares as figures',
        body: 'A magic square is also a figure. Its numbers are set so every line adds to the same sum. The books show a 4 by 4 Figure of Dal, and they explain how even and odd squares differ in their making.',
        source: 'Manba\u2019 Usul al-Hikma, Eighth Gift, p. 136, 4x4 Figure of Dal p. 137, Even/Odd p. 142 (and p. 22)',
      },
      {
        title: 'The Radiant Jewels figures',
        body: 'The Radiant Jewels gives its own figures. Four corners are marked with the letters B, D, W and H. The centre holds a single letter, set crosswise. The corners guard the centre, and the centre holds the power.',
        source: 'The Radiant Jewels for Summoning, p. 43 (and p. 48)',
      },
      {
        title: 'Ibn Arabi: the Nun semicircle',
        body: 'Ibn Arabi draws the letter Nun as a semicircle, a bowl that holds. He also speaks of the Four Cardinal Points, the four directions that frame the world. Both shapes teach the reader how the cosmos is laid out.',
        source: 'al-Futuhat al-Makkiyyah, vol. 3, p. 70, vol. 4, p. 154; vol. 6, p. 74',
      },
    ],
  },

  'figure-forge': {
    id: 'figure-forge',
    intro:
      'A figure is not written. It is made. The old books are strict about how a figure is made, what it is made of, and when it is made. I gathered their rules here so you can see the craft as they describe it.',
    entries: [
      {
        title: 'Inscription is not ordinary writing',
        body: 'The books make a sharp line between inscription and ordinary writing. Writing carries a message. Inscription, naqsh, sets a power into matter. The hand that inscribes must know the difference.',
        source: 'Suns of Lights and the Great Treasure, p. 11; Usul \u2019Ilm al-Huruf, p. 53',
        arabic: 'نقش',
        transliteration: 'naqsh',
        meaning: 'inscription, engraving',
      },
      {
        title: 'Planetary metals',
        body: 'Each planet has its metal. The books give a tablet of six metals and rings of seven and three metals. The metal must match the planet of the work, or the figure is wrong from the start.',
        source: 'Manba\u2019 Usul al-Hikma, p. 140; six-metal tablet, Radiant Jewels, p. 55; seven/three-metal rings, Kitab al-Ajnas, p. 46',
      },
      {
        title: 'Gold and red carnelian on Friday',
        body: 'Gold with red carnelian belongs to Friday. White crystal set in gold and pure silver set in gold are also named. The books are exact about which stone sits in which metal on which day.',
        source: 'Kitab al-Ajnas, p. 23; white crystal gold / pure silver gold, p. 42',
      },
      {
        title: 'Silver sheet at the Moon\u2019s exaltation',
        body: 'A silver sheet is used when the Moon stands at its exaltation, its strongest place in the sky. Silver belongs to the Moon. The time and the metal must agree.',
        source: 'Manba\u2019 Usul al-Hikma, p. 68',
      },
      {
        title: 'Timing: the ascendant and its lord',
        body: 'The hour is chosen by the ascendant and its lord, the planet that rules the rising sign. Fixed signs have their own rule. A figure made at the wrong hour is a figure made wrong.',
        source: 'Kitab al-Ajnas, p. 21; fixed signs, Manba\u2019 Usul al-Hikma, p. 65',
      },
      {
        title: 'Allah al-Latif around the square',
        body: 'The Name Allah al-Latif, God the Gentle, is written around the square. The Name frames the work. It stands at the edge like a guard at a door.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 48',
      },
      {
        title: 'The sand board',
        body: 'Some figures are drawn on a sand board, spread on a white handkerchief over sand. The sand takes the drawing and holds it. The board is the work table of the old craft.',
        source: 'Kitab al-Ajnas, p. 65',
      },
      {
        title: 'Perfect depiction, Dhu Miqrat',
        body: 'The books demand a perfect depiction. The figure called Dhu Miqrat is the example. Every line must be true. A crooked line is not a small fault here.',
        source: 'Manba\u2019 Usul al-Hikma, p. 144',
      },
      {
        title: 'Washing the figure',
        body: 'A finished figure is washed. First with running water and salt. Then with rose water and musk. The washing cleans the work and readies it for use.',
        source: 'Kitab al-Ajnas, pp. 23, 42, 46',
      },
      {
        title: 'Stellar consecration',
        body: 'The figure is consecrated under the stars on the first Friday of the Arabic month, at the crescent. The new moon opens the month, and the work begins with it.',
        source: 'Kitab al-Ajnas, p. 42',
      },
      {
        title: 'Silk pouches',
        body: 'The finished figure is kept in silk. Green silk, red silk and yellow silk are each named for their own work. The Shams names the pouches too. The cloth guards what the metal holds.',
        source: 'Kitab al-Ajnas, p. 23, p. 42, p. 46; Shams al-Ma\u2019arif al-Kubra (John Friend), p. 40',
      },
      {
        title: 'The artificer: fasting and a firm heart',
        body: 'The maker of the figure is called the artificer. The books ask two things of him. He fasts. And his heart is firm. The work passes through the maker, so the maker must be steady.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 42',
      },
    ],
  },

  'talism-studio': {
    id: 'talism-studio',
    intro:
      'The old books have no modern word for a studio. But they describe the room where the work is done in clear detail. I gathered their description of the workplace here, so you can see how they set it up.',
    entries: [
      {
        title: 'The remembrance house',
        body: 'The books speak of a dedicated remembrance house, a bayt li-l-dhikr. It is kept minimal. It has no window and no light. The worker sits directly on the earth. The room is bare so nothing pulls the mind away.',
        source: 'Majmu\u2019at Thalath Rasa\u2019il, p. 60',
        arabic: 'بيت للذكر',
        transliteration: 'bayt li-l-dhikr',
        meaning: 'a house for remembrance',
      },
      {
        title: 'The Four Pillars of the workplace',
        body: 'Four pillars hold the workplace. Time, Place, Companions and Master. The books return to these four again and again. A workplace without them is not a workplace at all.',
        source: 'Suns of Lights and the Great Treasure, pp. 11-12 (and p. 69)',
      },
      {
        title: 'The working altar',
        body: 'The work is done at a raised place, a working altar. It is lifted above the floor so the work has its own ground. The height marks the work as set apart from daily life.',
        source: 'Kitab al-Ajnas, p. 18',
      },
      {
        title: 'The sand board',
        body: 'The sand board is called Lawh al-Raml, the Tablet of Sand. Figures are drawn on it and read from it. The books describe it in the text and again in a transcript of the practice.',
        source: 'Kitab al-Ajnas, p. 65 (and p. 21), transcript pp. 87-89, 93-94',
        arabic: 'لوح الرمل',
        transliteration: 'Lawh al-Raml',
        meaning: 'the Tablet of Sand, the sand board',
      },
      {
        title: 'Design by calculation',
        body: 'Nothing in the studio is guessed. The elemental nature of a figure is worked out by calculation, from its corners and its centre. The numbers decide the shape before the hand draws it.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 140-141',
      },
      {
        title: 'Eight structural coordinates of a magic square',
        body: 'A magic square has eight structural coordinates. Key, Lock, Balance, Base Subtraction, Row Constant, Total Area, Controller and Limit. Each one is a part of the square, and each one must be right.',
        source: 'Decoding Al-Buni\u2019s Esoteric Book, transcribing Manba\u2019 Usul al-Hikma Part II, p. 305',
      },
      {
        title: 'Drafting precision',
        body: 'The books demand precision in drafting. A line a little off is a figure a little wrong. The hand must be steady and the eye must be true.',
        source: 'Manba\u2019 Usul al-Hikma, p. 144',
      },
      {
        title: 'Layout: centre against corners',
        body: 'The layout sets the centre against the corners. The forms sit inside each other in order: Point, then Triangle, then Square, then Circle. The centre holds the secret. The corners guard it.',
        source: 'al-Asrar al-Rabbaniyyah, pp. 82, 88, 148',
      },
      {
        title: 'Collaring with archangels',
        body: 'Some figures are collared, ringed round with the archangels. The collar is a ring of names set at the edge. It holds the figure closed, like a seal on a letter.',
        source: 'Hadha Hijab, p. 18; The Radiant Jewels for Summoning, p. 48',
      },
      {
        title: 'Study under an authorised master',
        body: 'The books say the work must be learned under an authorised master. No one teaches himself this craft. The master watches the hand and corrects it before a fault becomes a habit.',
        source: 'Suns of Lights and the Great Treasure, p. 12 (and p. 69)',
      },
      {
        title: 'Memorise the formulas',
        body: 'The worker must memorise the formulas. He does not glance at a notebook while he drafts. The work must live in his head, not on a page beside him.',
        source: 'The Radiant Jewels for Summoning, p. 78',
      },
      {
        title: 'Ethical orientation: no harm',
        body: 'The books set an ethical line. The work must not be turned to harm. A figure made to hurt another is not a figure at all. It is a wrong, and the books say so.',
        source: 'The Radiant Jewels for Summoning, p. 78',
      },
    ],
  },

  haqaiq: {
    id: 'haqaiq',
    intro:
      'Haqaiq means realities. The word points to what is real under the surface of things. The Sufis say the realities live in the heart, not in books. Here is what they wrote about them.',
    entries: [
      {
        title: 'Realities subsist in the heart',
        body: 'The books say the realities subsist in the heart. They quote the Hadith of Haritha, where a Companion speaks of what he saw with the eye of certainty. Two tastes are named, and each taste is a way of knowing.',
        source: 'Majmu\u2019at Thalath Rasa\u2019il, pp. 23-24, p. 24',
        arabic: 'حقائق',
        transliteration: 'haqa\u2019iq',
        meaning: 'realities, essential truths',
      },
      {
        title: 'Four ways of reading',
        body: 'A text can be read in four ways. Haqa\u2019iq, the realities. Lata\u2019if, the subtleties. Ishara, the allusion. And \u2019Ibara, the plain expression. The same words carry four layers, and the reader climbs them one by one.',
        source: 'Majmu\u2019at Thalath Rasa\u2019il, p. 186, Glossary',
      },
      {
        title: 'Ibn Arabi: three kinds of reality',
        body: 'Ibn Arabi sets out three kinds of reality. The essential, the attributive and the cosmic. Each one is a way the Real shows itself. The seeker learns to tell them apart.',
        source: 'al-Futuhat al-Makkiyyah, vol. 2, p. 30',
      },
      {
        title: 'The fixed entities',
        body: 'The fixed entities, a\u2019yan thabita, are the forms of all things as they stand in God\u2019s knowledge before they exist. They never come into being themselves. They are the patterns the world is cut from.',
        source: 'al-Futuhat al-Makkiyyah, vol. 1, p. 28',
        arabic: 'أعيان ثابتة',
        transliteration: 'a\u2019yan thabita',
        meaning: 'fixed entities',
      },
      {
        title: 'What Haqiqa means',
        body: 'Haqiqa is the reality of a thing, its innermost truth. The books define it, then set it beside Shari\u2019a, the law. The law is the road. The reality is what the road leads to. Both are needed, and the books list what a seeker must have before he walks it.',
        source: 'Qalaid al-Jawahir, p. 308; Shari\u2019a and Haqiqa, p. 309; prerequisites, p. 313',
      },
      {
        title: 'Across Mulk, Malakut and Jabarut',
        body: 'The realities run across three worlds. Mulk, the world of bodies. Malakut, the world of spirits. Jabarut, the world of power. Each world has its own realities, and the seeker meets them in order.',
        source: 'Mudih al-Tariq, p. 208, p. 182, p. 202',
      },
      {
        title: 'The Name al-Haqq and the Name al-Muhsi',
        body: 'Two Names carry the realities. Al-Haqq, the Real, is the Name of truth itself. Al-Muhsi, the Counter, is the Name that counts and keeps every reality in its place.',
        source: 'Manba\u2019 Usul al-Hikma, p. 65 (al-Haqq); p. 95 (al-Muhsi)',
      },
      {
        title: 'The triad: Shari\u2019a, Tariqa, Haqiqa',
        body: 'Three words hold the whole path. Shari\u2019a, the law. Tariqa, the way. Haqiqa, the reality. The books say the three stand together. The highest knowing, Haqq al-Yaqin, the truth of certainty, waits at the end of the road.',
        source: 'Mystical Dimensions of Islam, p. 99; Haqq al-Yaqin, p. 142',
      },
    ],
  },

  shart: {
    id: 'shart',
    intro:
      'Shart means a condition. Nothing in these books works without its conditions. The books list them with care, because a work done without its conditions is a work done wrong. Here are the conditions they name.',
    entries: [
      {
        title: 'Universal and relative conditions',
        body: 'Conditions come in two kinds. Universal conditions hold for every work. Relative conditions hold for one work alone. The Shams names three universal ones: sound belief, purity, and contemplative focus. Without these three, nothing else counts.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), pp. 42-43',
        arabic: 'شرط',
        transliteration: 'shart',
        meaning: 'condition, stipulation',
      },
      {
        title: 'The 27 Conditions',
        body: 'The Radiant Jewels lists 27 conditions. Certainty, secrecy, God-fearing, dignity, a living soul, an empty mind, memorisation, permission, alignment with the sky, avoiding the seven dotted days, and the waxing moon are among them. Each one is a door. All must open.',
        source: 'The Radiant Jewels for Summoning, pp. 77-80',
      },
      {
        title: 'The Four Pillars: Time, Place, Companions, Master',
        body: 'Four pillars hold every condition. The Time must be right. The Place must be right. The Companions must be right. And a Master must stand beside the work. The books name these four in more than one place, because they are the frame of all the rest.',
        source: 'Suns of Lights and the Great Treasure, pp. 11-12, 73',
      },
      {
        title: 'Discipline of the body',
        body: 'The body has its own conditions. The books speak of somatic discipline, the training of the body. They also demand strict number counts. The count must be exact, neither more nor less.',
        source: 'Suns of Lights and the Great Treasure, p. 72; strict number counts, p. 67',
      },
      {
        title: 'The legal limit',
        body: 'The books set a legal limit on conditions. Every condition not in the Book of God is void. A man may not add conditions of his own making and call them part of the work.',
        source: 'Manba\u2019 Usul al-Hikma, p. 139',
      },
      {
        title: 'Mathematical congruence',
        body: 'Some conditions are mathematical. The numbers must agree with each other. The books even speak of the -il suffix, a small ending on a word that changes what the word can do. Small things carry weight here.',
        source: 'Manba\u2019 Usul al-Hikma, p. 138; the -il suffix, p. 139',
      },
      {
        title: 'Purity and sincerity, without fee',
        body: 'Two conditions are named again and again. Purity of body and sincerity of heart. And the work is done without fee. No price is set on it. The books say this plainly, in more than one place.',
        source: 'Kitab al-Ajnas, p. 21 (and p. 43)',
      },
      {
        title: 'The first condition: turning to the Creator',
        body: 'Before any other condition comes the first one. The worker turns to the Creator. The work begins with God, not with the figure. Everything after that follows from this turn.',
        source: 'Usul \u2019Ilm al-Huruf, p. 64',
      },
      {
        title: 'The condition of will',
        body: 'One condition has its own name: Shart al-Irada, the condition of will. The will must be whole and pointed at one thing. A divided will cannot carry the work.',
        source: 'Majmu\u2019at Thalath Rasa\u2019il, p. 187',
      },
      {
        title: 'States come and go with their conditions',
        body: 'Spiritual states are tied to their conditions. When the condition is met, the state comes. When the condition is lost, the state leaves. The state does not stay on its own. It stays only while its condition holds.',
        source: 'al-Futuhat al-Makkiyyah, vol. 2, p. 30',
      },
    ],
  },

  'sirr-al-jalil': {
    id: 'sirr-al-jalil',
    intro:
      'Al-Sirr al-Jalil means the Great Secret. It is a name, a number and a door all at once. I gathered what the books say about it here, so you can see how one Name opens a whole field of secrets.',
    entries: [
      {
        title: 'The Name al-Jalil',
        body: 'Al-Jalil is the Majestic, the Name of awe and majesty. Its Abjad value is 73, a prime number. The books link it to al-Samad, the Eternal, and to al-Munji, the Saviour. The Shams gives it a whole chapter of its own.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), Ch. 42, "On His Name al-Jalil", p. 88; Manba\u2019 Usul al-Hikma, p. 42',
        arabic: 'الجليل',
        transliteration: 'al-Jalil',
        meaning: 'the Majestic, the Exalted',
      },
      {
        title: 'The Name al-Majid',
        body: 'Beside al-Jalil stands al-Majid, the Glorious. It unveils buried mysteries and decodes symbols. Where al-Jalil brings awe, al-Majid brings the opening of what was locked.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), Ch. 49, p. 41 (and p. 242); Manba\u2019 Usul al-Hikma, p. 43',
        arabic: 'المجيد',
        transliteration: 'al-Majid',
        meaning: 'the Glorious, the Noble',
      },
      {
        title: 'The secret in the Companion Matrix of al-Muhaymin',
        body: 'The secret of al-Jalil sits inside a larger figure. The Companion Matrix of al-Muhaymin holds ten letters, and their values add to 175. The Shams draws the matrix as a diagram, so the reader can see the secret set in its place.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 87 (diagram p. 48)',
      },
      {
        title: 'Noble secrets and prophetic inheritance',
        body: 'The Radiant Jewels opens with noble secrets. It calls them a prophetic inheritance, passed down from the prophets to those who come after. The secrets are not a new invention. They are an old trust.',
        source: 'The Radiant Jewels for Summoning, Preface, p. 1',
      },
      {
        title: 'Jilani and the fivefold thread',
        body: 'Abd al-Qadir al-Jilani speaks of a fivefold thread, tied with knots. Each knot is a stage. The thread is the path, and the knots are the stations where the seeker stops and learns.',
        source: 'Bahja Tul Asrar Wa Maadan UL Anwar, p. 93',
      },
    ],
  },

  durus: {
    id: 'durus',
    intro:
      'Durus means lessons. The old masters did not teach by books alone. They taught by silence, by example and by the company of the teacher. Here is what they say about learning.',
    entries: [
      {
        title: 'If you keep silent, the lessons are yours',
        body: 'One line holds the whole art of learning. If you keep silent, the lessons are yours. The student who talks too much misses what is being taught. Silence is the first lesson.',
        source: 'Majmu\u2019at Thalath Rasa\u2019il, p. 23',
        arabic: 'دروس',
        transliteration: 'durus',
        meaning: 'lessons, studies',
      },
      {
        title: 'Jilani\u2019s 13-branch curriculum',
        body: 'Abd al-Qadir al-Jilani taught a curriculum of thirteen branches, with daily classes. The branches cover the whole path, from the law to the heart. A student did not pick and choose. He studied them in order.',
        source: 'Qalaid al-Jawahir, p. 160',
      },
      {
        title: 'Study etiquette',
        body: 'The books set rules for the student. Be silent. Study the hearts of men, not only books. Practise more than you collect. Jilani returns to these rules in many discourses, because the manner of learning shapes what is learned.',
        source: 'Fath-ar-Rabbani, pp. 313, 347 (Disc. 50, 54), pp. 271-272 (Disc. 44), p. 27 (Disc. 3)',
      },
      {
        title: 'Rumi on teachers',
        body: 'Rumi says the teacher is the door. No one walks the path without one. The teacher has walked it before, and he knows where the road bends. The student who has no teacher walks blind.',
        source: 'Masnavi, pp. 154-155, 188',
      },
      {
        title: 'Taking lesson from creation',
        body: 'The books say to take lessons from creation itself. The sky, the earth, the rise and fall of kings, all of them teach. A man who reads only books misses the largest book of all, the world in front of him.',
        source: 'Nahj al-Balagha, pp. 250, 269',
      },
      {
        title: 'The college',
        body: 'The old colleges were called hawzah. Students gathered there to study the path under masters. The books describe the life of the college, its classes and its order, as a model of how learning should be held.',
        source: 'The Teachings of a Sufi Master, pp. 167-168 (Ch. 24)',
      },
    ],
  },

  index: {
    id: 'index',
    intro:
      'An index is a map of a book. The old books hid their knowledge on purpose, so the index is the key that opens them. I gathered what the books say about their own indexes here.',
    entries: [
      {
        title: 'Ibn Arabi and the chapter of the index',
        body: 'Ibn Arabi gives the index its own chapter, Bab al-Fihrist, the chapter of the list. The index is not an afterthought for him. It is a part of the book, and a reader who skips it misses the map.',
        source: 'al-Futuhat al-Makkiyyah, vol. 1, pp. 28-29',
        arabic: 'فهرست',
        transliteration: 'fihrist',
        meaning: 'index, list of contents',
      },
      {
        title: 'The Shams table of contents',
        body: 'The Shams opens with a table of contents for all 40 chapters. The parts are marked in the text. Part I holds chapters 1 to 14. Part II holds 15 to 20. Part III holds 21 to 37. Part IV holds 38 to 40. The list tells the reader the shape of the whole book at a glance.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), pp. 2-3 (Part markers pp. 24, 30)',
      },
      {
        title: 'The Tilimsani Fihrist plate',
        body: 'One famous index is drawn as a plate, a figure in itself. The Tilimsani Fihrist plate sets the contents of a book into a diagram. The reader sees the book as a shape before he reads a word of it.',
        source: 'columbia_aco004029_hi.pdf; Suns of Lights and the Great Treasure, p. 131',
      },
      {
        title: 'Rubrics: Maqsad, Bab, Fasl, Fa\u2019ida',
        body: 'The books divide themselves by rubrics. Maqsad is the aim. Bab is the chapter. Fasl is the section. Fa\u2019ida is the benefit, the useful point. Learn these four words, and any old book opens more easily.',
        source: 'The Radiant Jewels for Summoning, p. 66, p. 77',
      },
      {
        title: 'The Glossary of Kitab al-Ajnas',
        body: 'Kitab al-Ajnas closes with a glossary. Hard words are explained there in plain terms. The glossary is the book teaching the reader its own language.',
        source: 'Kitab al-Ajnas, p. 147, Glossary',
      },
      {
        title: 'The dispersal of knowledge',
        body: 'The old masters scattered their knowledge on purpose. They call it tabdid al-\u2019ilm, the dispersal of knowledge. A teaching is split across many pages, so only a patient reader can gather it whole. The index fights this dispersal, and the dispersal fights the index.',
        source: 'Mudih al-Tariq, p. 17; al-Asrar al-Rabbaniyyah, p. 1; Manba\u2019 Usul al-Hikma, p. 10',
      },
      {
        title: 'Opening by opening',
        body: 'The books open by openings. Tumtum opens with an opening. Kitab al-Ajnas opens with an opening. Al-Asrar opens with an opening. Each opening is a door, and the index lists the doors in order.',
        source: 'Tumtum al-Hindi, p. 7; Kitab al-Ajnas, p. 7; al-Asrar al-Rabbaniyyah, p. 7',
      },
      {
        title: 'Schimmel\u2019s indexes',
        body: 'Annemarie Schimmel\u2019s Mystical Dimensions of Islam ends with long indexes. The Quran index, the Hadith index, the index of Names and Places, and the index of Subjects. A modern reader can find any verse, any saying and any name in seconds.',
        source: 'Mystical Dimensions of Islam, p. ix, pp. 469-506 (Quran 469-470, Hadith 471-472, Names/Places 473-490, Subjects 491-506)',
      },
      {
        title: 'Abramelin Book Four as an index',
        body: 'The fourth book of Abramelin works as an index to the whole work. It lists what the earlier books hold, so the reader can find his way back. Even a grimoire needs a map.',
        source: 'The Book of Abramelin, p. 1, pp. 177, 194',
      },
    ],
  },

  library: {
    id: 'library',
    intro:
      'The old books were not kept on open shelves. They were hidden, buried, locked in chests and passed down in secret. This page gathers what the books say about keeping a library of such books.',
    entries: [
      {
        title: 'Hiding knowledge on purpose',
        body: 'The masters hid their knowledge on purpose. They call it tabdid al-\u2019ilm, the dispersal of knowledge, and they also speak of archival encryption, writing in a way that only the right reader can read. A book that anyone can read is a book anyone can misuse.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 144-145 (and pp. 32-33), p. 33; Mudih al-Tariq, p. 17; Manba\u2019 Usul al-Hikma, p. 10',
      },
      {
        title: 'Chests for inheritance',
        body: 'Books were kept in chests and passed down as inheritance. A chest holds the books of a master, and the son opens it when the father is gone. Some books were buried in the earth or hidden inside walls, to wait for a better time.',
        source: 'The Book of Abramelin, p. 1 (Book 1); burial in earth and walls, p. 177 (Book 2)',
      },
      {
        title: 'The covenant of custody',
        body: 'Keeping a book was a covenant, a promise. The keeper swore to guard it, to copy it truly, and to give it only to the right hands. The covenant bound the keeper as much as the book.',
        source: 'The Complete Magic of the Jinn, pp. 2-3 (and pp. 75-76), p. 74',
      },
      {
        title: 'The Library of Alexandria',
        body: 'The old library of Alexandria held five thousand to seven thousand codices. The books tell of Imam Ali\u2019s defence of it. The loss of a library is the loss of a world, and the books remember it as a wound.',
        source: 'Nahj al-Balagha, pp. 246-247',
      },
      {
        title: 'Early private compilations',
        body: 'Before the great libraries, there were private compilations. A man gathered what he could find, copied it by hand, and bound it for himself. The library began as one man\u2019s shelf.',
        source: 'islamic-spirituality-foundations.pdf, p. 135',
      },
      {
        title: 'Al-Radi gathers the Nahj',
        body: 'Al-Radi gathered the sayings of Imam Ali into the Nahj al-Balagha. He collected scattered sermons and letters into one book. Without his gathering, the words would have stayed scattered.',
        source: 'Nahj al-Balagha, pp. 282-283',
      },
      {
        title: 'Malfuzat: words spoken and recorded',
        body: 'Some books are malfuzat, words spoken by a master and written down by his listeners. The master speaks. The students write. The book is the record of a voice, not the work of a pen.',
        source: 'Mystical Dimensions of Islam, p. 356',
        arabic: 'ملفوظات',
        transliteration: 'malfuzat',
        meaning: 'spoken words recorded by listeners',
      },
      {
        title: 'Travelling for copies',
        body: 'A seeker travelled for copies. He walked from town to town to sit with a book for a few days and copy it by hand. The journey was part of the learning. The book was the prize at the end of the road.',
        source: 'Qalaid al-Jawahir, p. 531',
      },
      {
        title: 'Copying across faiths',
        body: 'Books were copied across faiths. Muslim, Christian and Jewish hands copied the same texts. And some books were given false names, pseudepigraphy, to give them weight. The library holds true books and false names side by side.',
        source: 'Tumtum al-Hindi, transcript pp. 114-116; pseudepigraphy, pp. 120-121',
      },
      {
        title: 'Modern repositories',
        body: 'Today the old books rest in great libraries. The SLUB in Dresden. The Herzog August Library in Wolfenbuttel. The BnF in Paris. Columbia and Princeton. A seeker can now read in a reading room what a master once hid in a chest.',
        source: 'Al Asrar notebook, source list and modern repository notes',
      },
    ],
  },

  atlas: {
    id: 'atlas',
    intro:
      'An atlas is a map. But this atlas does not map lands. It maps the heavens, the spheres and the letters that rule them. Here is how the old books draw the sky.',
    entries: [
      {
        title: 'The Atlas sphere',
        body: 'The highest sphere is called al-Falak al-Atlas, the Atlas sphere. It is starless. It is the sphere of the Throne, and the first of nine living spheres. All the other spheres turn inside it.',
        source: 'Usul \u2019Ilm al-Huruf, p. 77, pp. 78-79',
        arabic: 'الفلك الأطلس',
        transliteration: 'al-Falak al-Atlas',
        meaning: 'the Atlas sphere, the starless Throne sphere',
      },
      {
        title: 'Nine observation charts',
        body: 'The books give nine charts, one for each sphere. The Throne, the Footstool, Saturn, Jupiter, Mars, the Sun, Mercury, Venus and the Moon. Each chart shows its sphere and what moves inside it.',
        source: 'Usul \u2019Ilm al-Huruf, pp. 81-84',
      },
      {
        title: 'The Wheel of Letter Dispositions',
        body: 'The Wheel of Letter Dispositions sets a pair of letters on each sphere. Intellect holds Alif and \u2019Ayn. The Footstool holds Ba and Fa. Saturn holds Jim and Sad. Jupiter holds Dal and Qaf. Mars holds Ha and Ra. The Sun holds Waw and Shin. Venus holds Zay and Ta. Mercury holds Ha and Tha. The Moon holds Ta and Kha. The elements have their pairs too. Ya and Dhal are fire. Kaf and Dad are air. Lam and Za are water. Mim and Ghayn are earth. The Tablet and the Pen hold Nun and Sin.',
        source: 'al-Asrar al-Rabbaniyyah, pp. 88-91',
        arabic: 'دائرة تصريف الحروف',
        transliteration: 'Dairat Tasrif al-Huruf',
        meaning: 'the Wheel of Letter Dispositions',
      },
      {
        title: 'The Circle of the Rank of Bringing-into-Existence',
        body: 'One circle shows the rank of bringing into existence. It draws how a thing passes from the unseen into being. The circle is the map of that passage, step by step.',
        source: 'al-Asrar al-Rabbaniyyah, p. 82 (and p. 95)',
      },
      {
        title: 'The Head of Qaf',
        body: 'At the Head of Qaf the map is layered. The Pen stands outside. The Tablet stands in the middle. The spheres stand inside. Three rings, one inside the other, hold the whole cosmos.',
        source: 'al-Asrar al-Rabbaniyyah, p. 104',
      },
      {
        title: 'The letter \u2019Ayn planisphere',
        body: 'The letter \u2019Ayn has its own planisphere, a map of the sky drawn around one letter. The books give the map and its diagram, so the reader can see the heavens through a single letter.',
        source: 'al-Asrar al-Rabbaniyyah, p. 109 (diagram p. 148)',
      },
      {
        title: 'Ibn Arabi\u2019s Horn of Light',
        body: 'Ibn Arabi speaks of a Horn of Light, a shape that holds the light of the cosmos. Chittick quotes it from the Futuhat. The horn is a map too, drawn in light instead of ink.',
        source: 'Chittick, The Sufi Path of Knowledge (al-Futuhat al-Makkiyyah I:306)',
      },
    ],
  },

  qalam: {
    id: 'qalam',
    intro:
      'Qalam means a pen. But the Pen in these books is not the pen on my desk. It is the first thing God created, and the first thing that wrote. Here is what the books say about the Pen.',
    entries: [
      {
        title: 'The Cosmic Pen',
        body: 'The Cosmic Pen is the first thing God created. God said to it, "Write!" And it wrote all that would ever be. Every book and every page in this library is a small echo of that first writing.',
        source: 'Mudih al-Tariq, p. 42; Shams al-Ma\u2019arif al-Kubra (John Friend), p. 20; al-Ghunya li Talibi Tariq al-Haqq, vol. 2, p. 20',
        arabic: 'قلم',
        transliteration: 'qalam',
        meaning: 'pen',
      },
      {
        title: 'The Pen as First Intellect',
        body: 'The Pen is also called the First Intellect. It is the first mind, the first knower. The Journey to the Lord of Power explains this name and what it means for the seeker who wants to understand.',
        source: 'The Journey to the Lord of Power, pp. 47-49, Glossary p. 115',
      },
      {
        title: 'The triple inscription',
        body: 'The Pen writes in three places. The Preserved Tablet, where all things are written. The Tablet of Decree, where the decree is set. And the Tablet of the Heart, where the seeker reads his own portion.',
        source: 'al-Futuhat al-Makkiyyah, vol. 1, pp. 28-29',
      },
      {
        title: 'The limits of the Pen',
        body: 'Even the Pen has limits. The books say what the Pen can write and what it cannot. The Pen writes what is decreed. It does not write what is beyond decree. The limit is part of the teaching.',
        source: 'Mudih al-Tariq, p. 43',
      },
      {
        title: 'Talismanic pen rules',
        body: 'A pen for talismans follows strict rules. A reed pen. Saffron ink. Gold and silver ink. Ink drawn from seven springs. And even writing in water. Each rule is named in the books, with its page.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 68, 140, 141; Shams al-Ma\u2019arif al-Kubra (John Friend), pp. 46, 47, 48; The Radiant Jewels for Summoning, p. 54; Usul \u2019Ilm al-Huruf, p. 81',
      },
      {
        title: 'Rumi\u2019s ants parable',
        body: 'Rumi tells a parable of ants and a pen. The ants watch a pen move and argue about what moves it. Each ant sees only a little. The parable teaches the reader that he too sees only a little of what moves the world.',
        source: 'Masnavi, pp. 154-155',
      },
      {
        title: 'The basil pen and the eagle quill',
        body: 'Some pens are made of plants and birds. A pen of basil, rayhan, is named. So is the quill of a vulture or an eagle. The material of the pen is part of the work, not a small detail.',
        source: 'Manba\u2019 Usul al-Hikma, p. 67 (basil pen); p. 65 (vulture/eagle quill)',
      },
      {
        title: 'The metallic stylus and the slit reed',
        body: 'A stylus of metal is named in one manuscript. A slit reed pen is named in another. The slit holds the ink, and the metal holds the line. The tool shapes the writing, and the writing shapes the work.',
        source: 'columbia_aco004029_hi.pdf, p. 8 (metallic stylus); Manba\u2019 Usul al-Hikma, p. 144 (slit reed pen)',
      },
    ],
  },

  khatam: {
    id: 'khatam',
    intro:
      'Khatam means a seal. A seal closes a letter and proves who sent it. In the old books the seal is also a power, and Solomon is its master. Here is what the books say about seals.',
    entries: [
      {
        title: 'What a seal is, and Solomon as its master',
        body: 'A seal is a mark pressed into matter. It closes, it signs, and it guards. Solomon is the archetype of the sealer. His seal is the model for every seal after him.',
        source: 'The Tested Remedies of the Monk, p. 79; Kitab al-Ajnas, Glossary, p. 147; Hadha Hijab, p. 30',
        arabic: 'خاتم',
        transliteration: 'khatam',
        meaning: 'seal, signet ring',
      },
      {
        title: 'Wahb ibn Munabbih and the four layers',
        body: 'Wahb ibn Munabbih tells of a seal in four layers. Each layer is a level of power, one laid over the other. The books give the layers in order, so the reader can see how the seal is built.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 57',
      },
      {
        title: 'Inscriptions of Might',
        body: 'Some seals carry the Inscriptions of Might. The words are set in the seal to show power. The inscription is the voice of the seal, and the seal speaks by it.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 58',
      },
      {
        title: 'The Primordial Inscription on Adam\u2019s Heart',
        body: 'The books say an inscription was set on Adam\u2019s heart at the beginning. It is the Primordial Inscription, the first seal. Every seal after it is a copy of that first mark.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 57',
      },
      {
        title: 'The Crown-Seal',
        body: 'One seal is called the Crown-Seal. It sits like a crown, above the rest. The Bezoar Stones describe it at the start of the work, as the seal that rules the others.',
        source: 'Bezoar Stones, Knowledge Papers I-XII, pp. 1-3',
      },
      {
        title: 'The 3 by 3 Grid and the Pyramidal Seal',
        body: 'The 3 by 3 grid is the seal of Solomon and of al-Ghazali. The books call it the Pyramidal Seal too. Three rows, three columns, one centre. The grid is the simplest seal and the most used.',
        source: 'The Radiant Jewels for Summoning, p. 47',
      },
      {
        title: 'Al-Ghazali\u2019s quest in Balkh',
        body: 'Al-Ghazali went to Balkh in search of the seal. The books tell the story of his quest. He did not find the seal in a market. He found it by seeking, and the seeking was part of the finding.',
        source: 'The Radiant Jewels for Summoning, p. 47',
      },
      {
        title: 'The Seven Graphic Symbols of the Solomonic Seal',
        body: 'The Solomonic Seal, the Seal of the Greatest Name, holds seven graphic symbols. Each symbol is drawn with care. The seven together make the seal whole.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 22-23',
      },
      {
        title: 'Planetary ring seals',
        body: 'Rings are seals too. The books give ring seals for the planets, with their metals and their days. A ring seal is worn, so its power stays with the wearer.',
        source: 'Kitab al-Ajnas, pp. 21, 23, 42, 46',
      },
      {
        title: 'The Seal of Ruqya\u2019il, Sun and Sunday',
        body: 'The angel Ruqya\u2019il has his own seal. It belongs to the Sun and to Sunday. The books name it among the ring seals, with its day and its metal.',
        source: 'Kitab al-Ajnas, p. 23',
      },
      {
        title: 'The Seal of the Prophets',
        body: 'Khatam al-Anbiya means the Seal of the Prophets. It is the title of the Prophet Muhammad, peace be upon him. The seal here is not a ring. It is the closing of the line of prophets, the last and the seal of all.',
        source: 'Manba\u2019 Usul al-Hikma, p. 60',
        arabic: 'خاتم الأنبياء',
        transliteration: 'Khatam al-Anbiya',
        meaning: 'the Seal of the Prophets',
      },
      {
        title: 'Imam Ali\u2019s invocations',
        body: 'The books tie seals to the invocations of Imam Ali. His words are used as seals, spoken and written. The invocation seals the work, the way wax seals a letter.',
        source: 'Manba\u2019 Usul al-Hikma, p. 60',
      },
    ],
  },

  plate: {
    id: 'plate',
    intro:
      'A plate is a flat sheet of metal, made to carry a figure. Gold, silver, copper, iron and lead each have their own work. I gathered what the books say about each plate here.',
    entries: [
      {
        title: 'Lawh and Safihah, and the metals of the planets',
        body: 'The books use two words for a plate. Lawh is the tablet. Safihah is the sheet. Each planet has its metal. The Sun has gold. The Moon has silver. Mars has iron. Mercury has quicksilver. The metal must match the planet.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 140-141',
        arabic: 'لوح',
        transliteration: 'lawh',
        meaning: 'tablet, plate',
      },
      {
        title: 'Authorised substitutes',
        body: 'Not every worker can afford gold. The books allow authorised substitutes, other materials that stand in for the metals. The substitute must be allowed by the book. An unallowed substitute is not a substitute at all.',
        source: 'Manba\u2019 Usul al-Hikma, pp. 140-141',
      },
      {
        title: 'The Golden Tablet of Hermes',
        body: 'Hermes left a Golden Tablet. The books name it among the oldest plates. It is the model of the golden plate, and the books quote it as the root of the craft.',
        source: 'Kitab al-Ajnas, p. 83',
      },
      {
        title: 'The Gold Tablet',
        body: 'The Gold Tablet, the Lawh of gold, belongs to the Sun. The books name it in three places. Gold does not rust, and the books say that is why it suits the Sun, which does not fade.',
        source: 'Kitab al-Ajnas, p. 83; Shams al-Ma\u2019arif al-Kubra (John Friend), p. 76; Usul \u2019Ilm al-Huruf, p. 81',
      },
      {
        title: 'The Silver Sheet and Tablet',
        body: 'Silver belongs to the Moon. The books name the silver sheet and the silver tablet in several places. Silver is cool and bright, like the Moon at its full.',
        source: 'Manba\u2019 Usul al-Hikma, p. 68; Shams al-Ma\u2019arif al-Kubra (John Friend), pp. 46, 74; Usul \u2019Ilm al-Huruf, pp. 47, 81',
      },
      {
        title: 'The Tin Sheet',
        body: 'Tin has its own sheet. The books name it briefly, beside the greater metals. It is a lesser metal, but it has its own work and its own place.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 48; Bezoar Stones, p. 2',
      },
      {
        title: 'Red Copper and Yellow Copper',
        body: 'Copper comes in two colours in the books. The Red Copper Plate and the Yellow Copper Plate are named apart. Each colour has its own page, and the books keep them separate.',
        source: 'Shams al-Ma\u2019arif al-Kubra (John Friend), p. 45 (red copper); p. 47 (yellow copper)',
      },
      {
        title: 'Steel and Iron Plate',
        body: 'Steel and iron belong to Mars. The books name the steel plate and the iron plate together. Iron is hard and it cuts, and the books say that is why Mars holds it.',
        source: 'Usul \u2019Ilm al-Huruf, p. 48; Manba\u2019 Usul al-Hikma, p. 140',
      },
      {
        title: 'The Lead Tablet',
        body: 'Lead belongs to Saturn. The books name the lead tablet in two places. Lead is heavy and slow, like Saturn in the sky.',
        source: 'The Radiant Jewels for Summoning, p. 54; Shams al-Ma\u2019arif al-Kubra (John Friend), p. 38',
      },
      {
        title: 'Seven-Metal Casting',
        body: 'One plate is cast from seven metals together. The books name the seven-metal casting as a work of its own. Seven metals, seven planets, one plate. The casting joins them all.',
        source: 'Kitab al-Ajnas, p. 46',
      },
    ],
  },
};
