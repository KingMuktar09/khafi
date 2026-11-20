import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { BUNI_AMALS } from '../src/data/buniAmals';
import { FRIEND_AMALS } from '../src/data/friendAmals';
import { localizeAmal, localizeChapterTitle, FRIEND_WARNING } from '../src/data/amalsI18n';
import { t, SITE_LANGUAGES } from '../src/data/i18n';

const LANGS = SITE_LANGUAGES.map((l) => l.id);
import { I18N_HOME } from '../src/data/i18n-home';
import { getBookCoverUrl } from '../src/utils/fileUtils';

const ROOT = join(process.cwd(), 'data');
const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf-8'));
const books: Array<Record<string, unknown>> = catalog.books ?? catalog;

describe('Manba cover', () => {
  it('Manba has a stored coverUrl and the cover file exists', () => {
    const manba = books.find((b) => b.id === 'b-manba-usul-al-hikma');
    expect(manba).toBeDefined();
    expect(manba!.coverUrl).toBe('/covers/manba-usul-al-hikma.jpg');
    expect(existsSync(join(process.cwd(), 'public/covers/manba-usul-al-hikma.jpg'))).toBe(true);
  });

  it('getBookCoverUrl prefers the stored cover over the Drive thumbnail', () => {
    const manba = books.find((b) => b.id === 'b-manba-usul-al-hikma') as never;
    expect(getBookCoverUrl(manba)).toBe('/covers/manba-usul-al-hikma.jpg');
  });
});

describe('Info page keys (why / how / paid / follow)', () => {
  const INFO_KEYS = [
    'info.whyTitle', 'info.why1', 'info.why2',
    'info.howTitle', 'info.how1', 'info.how2', 'info.how3', 'info.how4',
    'info.paidTitle', 'info.paid1', 'info.paid2',
    'info.followTitle', 'info.follow1',
  ];
  it('every info key exists in all four languages', () => {
    for (const key of INFO_KEYS) {
      for (const lang of LANGS) {
        expect(t(key, lang).length, `${key} [${lang}]`).toBeGreaterThan(0);
        expect(t(key, lang), `${key} [${lang}] must not fall back to English raw`).not.toBe(key);
      }
    }
  });
  it('paid reason says what Muktar said: pay, value it, read it properly', () => {
    expect(t('info.paid1', 'en')).toMatch(/value/i);
    expect(t('info.paid2', 'en')).toMatch(/free/i);
  });
  it('why says: share this knowledge for followers and anyone who wants to know', () => {
    expect(t('info.why1', 'en')).toMatch(/followers/i);
    expect(t('info.why1', 'en')).toMatch(/wants to know/i);
  });
});

describe('Amals localisation', () => {
  const ALL = [...BUNI_AMALS, ...FRIEND_AMALS];
  it('all 50 amals have Hinglish, Bengali and Urdu text', () => {
    expect(ALL.length).toBe(50);
    for (const amal of ALL) {
      for (const lang of ['hi', 'bn', 'ur'] as const) {
        const text = localizeAmal(amal, lang);
        expect(text.title, `${amal.id} title [${lang}]`).not.toBe(amal.title);
        expect(text.purpose, `${amal.id} purpose [${lang}]`).not.toBe(amal.purpose);
        expect(text.how, `${amal.id} how [${lang}]`).not.toBe(amal.how);
        expect(text.title.length).toBeGreaterThan(3);
      }
    }
  });
  it('notes are translated where they exist, and fall back to English otherwise', () => {
    for (const amal of ALL) {
      if (amal.note) {
        const text = localizeAmal(amal, 'hi');
        expect(text.note, `${amal.id} note [hi]`).not.toBe(amal.note);
        expect(text.note!.length).toBeGreaterThan(10);
      }
    }
    const noNote = ALL.find((a) => !a.note)!;
    expect(localizeAmal(noNote, 'hi').note).toBeUndefined();
  });
  it('English falls back to the verified English data unchanged', () => {
    for (const amal of ALL) {
      const text = localizeAmal(amal, 'en');
      expect(text.title).toBe(amal.title);
      expect(text.purpose).toBe(amal.purpose);
      expect(text.how).toBe(amal.how);
    }
  });
  it('chapter titles are translated in hi/bn/ur', () => {
    expect(localizeChapterTitle('Chapter 5', 'The Secrets of Bismillah', 'hi')).toContain('Bismillah');
    expect(localizeChapterTitle('Chapter 5', 'The Secrets of Bismillah', 'bn')).toContain('বিসমিল্লাহ');
    expect(localizeChapterTitle('Chapter 5', 'The Secrets of Bismillah', 'ur')).toContain('بسم اللہ');
    expect(localizeChapterTitle('Chapter 5', 'The Secrets of Bismillah', 'en')).toBe(
      'Chapter 5 — The Secrets of Bismillah',
    );
  });
  it('friend warning is translated in all four languages', () => {
    for (const lang of LANGS) {
      expect(FRIEND_WARNING[lang].length).toBeGreaterThan(20);
    }
    expect(FRIEND_WARNING.hi).not.toBe(FRIEND_WARNING.en);
  });
});

describe('Drive preview timeout', () => {
  it('DrivePdfViewer has a load timeout so a stuck preview never hangs', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/pdf/DrivePdfViewer.tsx'), 'utf-8');
    expect(src).toMatch(/setTimeout/);
    expect(src).toMatch(/15_000|15000/);
    expect(src).toMatch(/setShowTrouble\(true\)/);
  });
});
