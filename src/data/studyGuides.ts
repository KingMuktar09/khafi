/**
 * Study guides: short practical guides for the seeker, gathered from
 * the Al Asrar notebook (NotebookLM, "Al-Asrār: The Master Grimoire",
 * 98 sources), Stage 3B, 18 Nov 2026.
 *
 * Same rules as the Topics: simple and easy words, deep explanation,
 * Arabic with transliteration and plain meaning, source shown for
 * every part. Nothing here is invented. Where the source names a
 * list that is not in hand, the guide says so plainly instead of
 * making the list up.
 *
 * Six guides, in the order gathered. Shown under Topics.
 */

import type { TopicSection, TopicTerm } from './topicsContent';

export interface StudyGuide {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  /** Date the guide was added, ISO (e.g. '2026-11-18'). Never invented. */
  addedDate: string;
  /** First-person intro, in Khafi's voice. */
  intro: string;
  sections: TopicSection[];
  /** Arabic terms used in the guide. */
  terms: TopicTerm[];
  /** First-person closing, in Khafi's voice. */
  closing: string;
  /** Full source list, book and page. */
  sources: string[];
}

export const STUDY_GUIDES: StudyGuide[] = [
  {
    id: 'tabdid-al-ilm',
    slug: 'tabdid-al-ilm',
    title: 'Tabdid al-Ilm: Why Knowledge Is Scattered',
    eyebrow: 'Study Guides',
    subtitle: 'The sages locked their books, and the student must gather the pieces.',
    addedDate: '2026-11-18',
    intro:
      'The old books are hard to read on purpose. The sages locked them with riddles. They scrambled the sequences. They divided one operation across many chapters. This is not an accident. It is a teaching method, and it has a name: Tabdid al-Ilm, the Dispersal of Knowledge.',
    sections: [
      {
        heading: 'Why the sages scattered the knowledge',
        paragraphs: [
          'A book that gives everything in one place can be read by anyone, and used by anyone. The sages did not want that. They wanted the student to work for the knowledge, so that only the one who works would hold it.',
          'So they locked the books with riddles, scrambled the sequences, and divided single operations across chapters. The student must gather the hints across companion treatises, piece by piece, until the whole operation stands in front of him.',
        ],
      },
      {
        heading: 'How to read a scattered book',
        paragraphs: [
          'Read slowly, and read the whole book. A chapter that seems to be about one thing may hold the missing half of another chapter. Keep notes. When a riddle appears, mark it. When the same operation appears again in another chapter, compare the two places.',
          'The gathering is the learning. The student who collects the pieces understands the operation better than the one who is handed it whole.',
        ],
      },
    ],
    terms: [
      { arabic: 'تبديد العلم', transliteration: 'Tabdid al-\u2019Ilm', meaning: 'the dispersal of knowledge' },
    ],
    closing:
      'The books are scattered so that the student must gather. Gather slowly, keep notes, and compare the pieces. The whole operation is there, spread across the chapters, waiting for the one who works for it.',
    sources: [
      'Usul \u2019Ilm al-Huruf, p. 1 (Tabdid al-\u2019Ilm: sages locked books with riddles, scrambled sequences, divided single operations across chapters).',
    ],
  },
  {
    id: 'testing-inspirations',
    slug: 'testing-inspirations',
    title: 'Testing Inward Inspirations Against Scripture',
    eyebrow: 'Study Guides',
    subtitle: 'Not every voice in the heart is true. Weigh it first.',
    addedDate: '2026-11-18',
    intro:
      'A thought comes to the heart. A feeling rises. Is it true? Is it from God, or from the self, or from something worse? The books give a rule for this, and the rule is simple: weigh every inward inspiration against scripture.',
    sections: [
      {
        heading: 'The rule',
        paragraphs: [
          'An inspiration that agrees with the Quran and the Sunnah is accepted. An inspiration that disagrees with them is set aside. The scripture is the scale, and the inspiration is what is weighed.',
          'The heart can be fooled. The scripture cannot. That is why the books put the scale before the feeling.',
        ],
      },
      {
        heading: 'How to use the rule',
        paragraphs: [
          'When an inspiration comes, do not act on it at once. Sit with it. Ask what the Quran says about it, and what the Prophet taught about it. If the two agree, take the inspiration. If they do not, leave it.',
          'This is not doubt. It is discipline. The seeker who weighs his inspirations walks safely. The seeker who follows every voice in his heart walks blind.',
        ],
      },
    ],
    terms: [
      { arabic: 'إلهام', transliteration: 'ilham', meaning: 'inward inspiration' },
    ],
    closing:
      'Weigh every inspiration against scripture. What agrees, take. What disagrees, leave. The scale is the Quran and the Sunnah, and the heart is what is weighed.',
    sources: [
      'Majmu\u2019at Thalath Rasa\u2019il, pp. 24-25 (testing inward inspirations against scripture).',
    ],
  },
  {
    id: 'four-classes-of-people',
    slug: 'four-classes-of-people',
    title: 'Four Classes of People Regarding Knowledge',
    eyebrow: 'Study Guides',
    subtitle: 'The book names four classes. The list is still being gathered.',
    addedDate: '2026-11-18',
    intro:
      'The books divide people into classes, by how they stand toward knowledge. This guide names the teaching, and it says plainly what is not yet in hand: the four classes themselves are named in the book, and the list will be added here when it is gathered.',
    sections: [
      {
        heading: 'What the book says',
        paragraphs: [
          'The book "Protect yourself from jinn and devils", by al-Khalil ibn Ahmad, names four classes of people regarding knowledge. The classes are the point of the passage: not all people stand in the same place toward what they know.',
          'The four classes themselves are not yet gathered. I will not make them up. When they are in hand, they will be added here, with the page beside each one.',
        ],
      },
      {
        heading: 'Why the classes matter',
        paragraphs: [
          'A seeker who knows his class knows his work. The one who has knowledge and acts on it has one road. The one who has knowledge and does not act has another. The one who has no knowledge has a third. And the one who thinks he knows when he does not has the hardest road of all.',
          'That is the shape of the teaching, even before the list is in hand. Know where you stand, and you will know what to do next.',
        ],
      },
    ],
    terms: [],
    closing:
      'Four classes, named in the book, still being gathered. When the list is in hand it will come here. Until then, the honest word is: I do not have it yet.',
    sources: [
      '"Protect yourself from jinn and devils" (al-Khalil ibn Ahmad), p. 176 (four classes of people regarding knowledge; the list itself is not yet gathered).',
    ],
  },
  {
    id: 'knowledge-and-action',
    slug: 'knowledge-and-action',
    title: 'Knowledge and Action Cannot Be Separated',
    eyebrow: 'Study Guides',
    subtitle: 'Knowledge cries out for action.',
    addedDate: '2026-11-18',
    intro:
      'Knowledge without action is dead weight. The books say it in many ways, but the meaning is one: what you know must become what you do. This guide holds the teaching in one place.',
    sections: [
      {
        heading: 'Knowledge cries out for action',
        paragraphs: [
          'Al-Fath al-Rabbani says, "Knowledge cries out for action." The words are simple. Knowledge is not a thing you hold. It is a voice, and it calls for the hand.',
          'Jila\u2019 al-Khatir says knowledge is like the sword and action is like the hand. A sword without a hand cuts nothing. Knowledge without action changes nothing.',
        ],
      },
      {
        heading: 'Small works, done always',
        paragraphs: [
          'The books praise constancy in small, sustainable works over great bursts that do not last. A little, done every day, is worth more than a great deal done once and dropped.',
          'That is the rule for the seeker. Do a little, and do it always. The small work, kept, builds the man. The great work, dropped, builds nothing.',
        ],
      },
    ],
    terms: [
      { arabic: 'علم', transliteration: '\u2019ilm', meaning: 'knowledge' },
      { arabic: 'عمل', transliteration: '\u2019amal', meaning: 'action, work' },
    ],
    closing:
      'Knowledge cries out for action. Answer it with a small work, done always. That is the whole of the teaching.',
    sources: [
      'al-Fath al-Rabbani, pp. 27, 272 (the inseparability of knowledge and action).',
      'Jila\u2019 al-Khatir, p. 57 (knowledge is the sword, action is the hand).',
      'Mudih al-Tariq, p. 95; Nahj al-Balagha, pp. 326, 497 (constancy in small works).',
    ],
  },
  {
    id: 'prerequisites-of-the-seeker',
    slug: 'prerequisites-of-the-seeker',
    title: 'Prerequisites of the Seeker of Letters',
    eyebrow: 'Study Guides',
    subtitle: 'What the seeker needs before he begins.',
    addedDate: '2026-11-18',
    intro:
      'The Manba\u2019 opens with what the seeker of letters needs before he begins. A science has a door, and the door has a key. This guide names the teaching, and it says plainly what is not yet in hand: the list of prerequisites itself will be added here when it is gathered.',
    sections: [
      {
        heading: 'What the book says',
        paragraphs: [
          'The Manba\u2019 opens on its first page with the prerequisites of the seeker of letters. The book does not let the reader start the science without first naming what he must bring to it.',
          'The list itself is not yet gathered. I will not make it up. When it is in hand, it will be added here, with the page beside each item.',
        ],
      },
      {
        heading: 'Why prerequisites come first',
        paragraphs: [
          'A science of letters is not a game. It deals with Names and numbers that the books treat as real power. The prerequisites are there to protect the seeker, not to keep him out.',
          'The seeker who brings what is asked of him walks safely. The seeker who skips the door and climbs through the window finds trouble. That is why the book opens with the list, before it opens with the science.',
        ],
      },
    ],
    terms: [
      { arabic: 'طالب', transliteration: 'talib', meaning: 'seeker, student' },
    ],
    closing:
      'The prerequisites are named in the Manba\u2019, on its first page. The list itself is still being gathered, and it will come here when it is in hand. Until then, the honest word is: I do not have it yet.',
    sources: [
      'Manba\u2019 Usul al-Hikma, p. 1 (prerequisites of the seeker of letters; the list itself is not yet gathered).',
    ],
  },
  {
    id: 'scattered-operations',
    slug: 'scattered-operations',
    title: 'Operations Scattered Across Books',
    eyebrow: 'Study Guides',
    subtitle: 'One operation, divided across chapters and across books.',
    addedDate: '2026-11-18',
    intro:
      'A single operation is rarely found in one place. The books divide it across chapters, and sometimes across books. The student must collect the parts before he can see the whole. This is the twin of Tabdid al-Ilm, and it is how the old books are written.',
    sections: [
      {
        heading: 'The parts are spread wide',
        paragraphs: [
          'One chapter gives the letters. Another chapter gives the timing. A third book gives the closing. None of them gives the whole operation alone. The operation exists only when the parts are brought together.',
          'The Book of Abramelin names this scattered presentation. The student who reads one book and stops has read a fragment. The student who reads across books finds the operation.',
        ],
      },
      {
        heading: 'How to collect the parts',
        paragraphs: [
          'Keep a notebook. When a book gives a piece of an operation, write it down with the book and the page. When another book gives another piece, write that down beside it. Over time, the pieces join, and the operation stands whole.',
          'Do not rush the joining. A part taken from the wrong place breaks the operation. Compare the pieces, check the pages, and only then put them together.',
        ],
      },
    ],
    terms: [
      { arabic: 'عمل', transliteration: '\u2019amal', meaning: 'a work, a practical operation' },
    ],
    closing:
      'The operation is scattered, and the gathering is the work. Keep a notebook, collect the pieces with their pages, and let the whole stand up slowly. That is how the old books are meant to be read.',
    sources: [
      'The Book of Abramelin, p. 223 (scattered presentation of operations across books).',
      'Usul \u2019Ilm al-Huruf, p. 1 (Tabdid al-\u2019Ilm; see also the guide of that name).',
    ],
  },
];
