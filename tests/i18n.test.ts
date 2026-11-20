import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SITE_LANGUAGES,
  resolveLanguage,
  isRtlLanguage,
  t,
  tf,
  allKeys,
  hasFullCoverage,
  STRINGS,
} from '../src/data/i18n';
import { I18N_HOME } from '../src/data/i18n-home';
import { I18N_LIBRARY } from '../src/data/i18n-library';
import { I18N_TOOLS, ASMA_MEANINGS, tTools, localizeTool } from '../src/data/i18n-tools';
import { I18N_TOPICS } from '../src/data/i18n-topics';
import { TOOLS_INDEX } from '../src/data/toolsIndex';
import {
  localizeTopic,
  localizeQuestion,
  localizeGuide,
} from '../src/data/topicsI18n';
import { TOPICS } from '../src/data/topicsContent';
import { TOPIC_QUESTIONS } from '../src/data/topicsQuestions';
import { STUDY_GUIDES } from '../src/data/studyGuides';
import { DEFAULT_SETTINGS, storage } from '../src/services/storage';
import { greetingForHour } from '../src/utils/greeting';

/**
 * Language switch: English is the primary language and the default
 * for every visitor. Hinglish, Bengali and Urdu are picked once, on
 * the first visit, on a big chooser screen; after that the language
 * can only be changed in Settings. The choice is remembered on the
 * device. Arabic, transliteration, book titles, names and
 * @ghayb.chronicles never change with the language.
 *
 * Hinglish long-form topic/question content comes from the Al Asrar
 * notebook (Hinglish, with sources and pages), not from translating
 * the English pages. The notebook's telling has its own section
 * breaks and term lists, so Hinglish topics replace the English
 * sections wholesale (fullSections / fullTerms). Bengali long-form
 * content is translated from the English pages. Guides in Hinglish
 * are still English for now — they are not in the notebook material.
 */

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

/** Minimal in-memory localStorage so the persistence tests can run in node. */
function stubLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
  return store;
}

const SETTINGS_KEY = 'khafi_user_settings';

describe('default language is English', () => {
  it('the default settings carry language en', () => {
    expect(DEFAULT_SETTINGS.language).toBe('en');
  });

  it('resolveLanguage falls back to en for unknown, missing or mistyped values', () => {
    expect(resolveLanguage(undefined)).toBe('en');
    expect(resolveLanguage(null)).toBe('en');
    expect(resolveLanguage('')).toBe('en');
    expect(resolveLanguage('xx')).toBe('en');
    expect(resolveLanguage('hinglish')).toBe('en');
    expect(resolveLanguage('EN')).toBe('en');
    expect(resolveLanguage('hi')).toBe('hi');
    expect(resolveLanguage('bn')).toBe('bn');
    expect(resolveLanguage('ur')).toBe('ur');
    expect(resolveLanguage('en')).toBe('en');
  });

  it('stored settings with an unknown language fall back to English', () => {
    stubLocalStorage({ [SETTINGS_KEY]: JSON.stringify({ language: 'xx' }) });
    expect(storage.getSettings().language).toBe('en');
  });

  it('the picker offers exactly English, Hinglish, Bengali, Urdu, in that order', () => {
    expect(SITE_LANGUAGES.map((l) => l.id)).toEqual(['en', 'hi', 'bn', 'ur']);
    expect(SITE_LANGUAGES.map((l) => l.nativeLabel)).toEqual(['English', 'Hinglish', 'বাংলা', 'اردو']);
  });

  it('Urdu is the only right-to-left language', () => {
    expect(isRtlLanguage('ur')).toBe(true);
    expect(isRtlLanguage('en')).toBe(false);
    expect(isRtlLanguage('hi')).toBe(false);
    expect(isRtlLanguage('bn')).toBe(false);
  });
});

describe('the choice persists on the device', () => {
  let realLocalStorage: unknown;
  beforeEach(() => {
    realLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });
  afterEach(() => {
    if (realLocalStorage === undefined) {
      delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
    } else {
      (globalThis as unknown as { localStorage: unknown }).localStorage = realLocalStorage;
    }
  });

  it('saving Hinglish then reading the settings back gives Hinglish', () => {
    const store = stubLocalStorage();
    storage.saveSettings({ ...DEFAULT_SETTINGS, language: 'hi' });
    expect(store.get(SETTINGS_KEY)).toContain('"language":"hi"');
    expect(storage.getSettings().language).toBe('hi');
  });

  it('saving Bengali then reading the settings back gives Bengali', () => {
    stubLocalStorage();
    storage.saveSettings({ ...DEFAULT_SETTINGS, language: 'bn' });
    expect(storage.getSettings().language).toBe('bn');
  });

  it('saving Urdu then reading the settings back gives Urdu', () => {
    stubLocalStorage();
    storage.saveSettings({ ...DEFAULT_SETTINGS, language: 'ur' });
    expect(storage.getSettings().language).toBe('ur');
  });

  it('a fresh visitor has not chosen a language; picking once marks it chosen', () => {
    stubLocalStorage();
    expect(storage.hasChosenLanguage()).toBe(false);
    storage.setLanguageChosen();
    expect(storage.hasChosenLanguage()).toBe(true);
  });

  it('a visitor with a saved settings record already counts as having chosen', () => {
    stubLocalStorage({ [SETTINGS_KEY]: JSON.stringify({ language: 'hi' }) });
    expect(storage.hasChosenLanguage()).toBe(true);
  });
});

describe('switching changes the visible labels', () => {
  // One key from every area, each with a genuinely different
  // Hinglish and Bengali value, so a missing area fails loudly.
  const spotKeys = [
    'nav.studyTools',
    'settings.language',
    'gate.followToEnter',
    'gate.unlock',
    'home.hero.browse',
    'home.languageTitle',
    'library.groupedNote',
    'book.returnToLibrary',
    'tools.common.search',
    'topics.studyNote',
  ];

  it('every spot key reads differently in Hinglish, Bengali and Urdu than in English', () => {
    for (const key of spotKeys) {
      const en = t(key, 'en');
      expect(en, `${key} has no English value`).not.toBe(key);
      expect(t(key, 'hi'), `${key} did not change in Hinglish`).not.toBe(en);
      expect(t(key, 'bn'), `${key} did not change in Bengali`).not.toBe(en);
      expect(t(key, 'ur'), `${key} did not change in Urdu`).not.toBe(en);
    }
  });

  it('single-word loanwords stay English in Hinglish by design, but change in Bengali', () => {
    // Hinglish speakers say Home, Library, Topics, Settings as they
    // are; forcing a translation would sound wrong. Bengali differs.
    for (const key of ['nav.home', 'nav.library', 'nav.topics', 'nav.settings', 'settings.title', 'topics.back']) {
      expect(t(key, 'hi'), `${key} hi`).toBe(t(key, 'en'));
      expect(t(key, 'bn'), `${key} bn`).not.toBe(t(key, 'en'));
    }
  });

  it('greetings change with the language', () => {
    expect(greetingForHour(9, 'en')).toBe('Good morning');
    expect(greetingForHour(9, 'hi')).not.toBe('Good morning');
    expect(greetingForHour(9, 'bn')).not.toBe('Good morning');
    expect(greetingForHour(9, 'ur')).not.toBe('Good morning');
    expect(greetingForHour(20, 'en')).toBe('Good evening');
    expect(greetingForHour(20, 'hi')).not.toBe('Good evening');
    expect(greetingForHour(20, 'ur')).not.toBe('Good evening');
  });

  it('placeholders survive translation', () => {
    const key = 'home.sky.hourOf';
    for (const lang of ['en', 'hi', 'bn', 'ur'] as const) {
      const out = tf(key, lang, { n: 3, dayNight: 'day' });
      expect(out, `${lang} lost the number`).toContain('3');
      expect(out, `${lang} left a raw placeholder`).not.toContain('{n}');
      expect(out, `${lang} left a raw placeholder`).not.toContain('{dayNight}');
    }
  });

  it('an unknown key falls back to the key itself, never a crash', () => {
    expect(t('no.such.key', 'hi')).toBe('no.such.key');
  });
});

describe('every key exists in all four languages', () => {
  it('the merged dict has full coverage in Hinglish, Bengali and Urdu', () => {
    expect(hasFullCoverage('hi')).toBe(true);
    expect(hasFullCoverage('bn')).toBe(true);
    expect(hasFullCoverage('ur')).toBe(true);
    const keys = allKeys();
    expect(keys.length).toBeGreaterThan(1500);
    for (const key of keys) {
      expect(STRINGS.hi[key], `missing hi: ${key}`).toBeTruthy();
      expect(STRINGS.bn[key], `missing bn: ${key}`).toBeTruthy();
      expect(STRINGS.ur[key], `missing ur: ${key}`).toBeTruthy();
    }
  });

  it('each chunk has identical key sets across its four languages', () => {
    for (const [name, chunk] of [
      ['home', I18N_HOME],
      ['library', I18N_LIBRARY],
      ['tools', I18N_TOOLS],
      ['topics', I18N_TOPICS],
    ] as const) {
      const en = Object.keys(chunk.en).sort();
      expect(Object.keys(chunk.hi).sort(), `${name} hi keys`).toEqual(en);
      expect(Object.keys(chunk.bn).sort(), `${name} bn keys`).toEqual(en);
      expect(Object.keys(chunk.ur).sort(), `${name} ur keys`).toEqual(en);
      for (const key of en) {
        expect(chunk.hi[key].trim().length, `${name} hi ${key} empty`).toBeGreaterThan(0);
        expect(chunk.bn[key].trim().length, `${name} bn ${key} empty`).toBeGreaterThan(0);
        expect(chunk.ur[key].trim().length, `${name} ur ${key} empty`).toBeGreaterThan(0);
      }
    }
  });

  it('tTools actually returns the Urdu strings, not English fallback', () => {
    // Regression: tTools once only accepted hi/bn, so the whole Tools
    // section rendered in English when Urdu was active, even though
    // every Urdu string existed in the dict.
    expect(tTools('tools.hub.title', 'ur')).toBe('مطالعے کے ٹولز');
    expect(tTools('tools.hub.subtitle', 'ur')).toContain('حروف');
    expect(tTools('tools.moon.footer', 'ur')).toContain('چاند');
    expect(tTools('tools.hub.title', 'ur')).not.toBe(I18N_TOOLS.en['tools.hub.title']);
    for (const tool of TOOLS_INDEX) {
      const localized = localizeTool(tool, 'ur');
      expect(localized.title, `${tool.id} ur title`).not.toBe(tool.title);
      expect(localized.blurb, `${tool.id} ur blurb`).not.toBe(tool.blurb);
      expect(localized.title.trim().length, `${tool.id} ur title`).toBeGreaterThan(0);
      expect(localized.blurb.trim().length, `${tool.id} ur blurb`).toBeGreaterThan(0);
    }
    // The other languages still resolve through the same lookup.
    expect(tTools('tools.hub.title', 'hi')).toBe('Padhai ke Tools');
    expect(tTools('tools.hub.title', 'bn')).toBe('পড়াশোনার টুলস');
    expect(tTools('tools.hub.title', 'en')).toBe('Study Tools');
  });

  it('no user-facing string carries an em dash pile-up in translation', () => {
    // A few em dashes mirror the English format (titles, chips); a
    // wall of them means a machine-made line slipped in.
    for (const [lang, dict] of [
      ['hi', STRINGS.hi],
      ['bn', STRINGS.bn],
      ['ur', STRINGS.ur],
    ] as const) {
      for (const [key, value] of Object.entries(dict)) {
        const count = (value.match(/—/g) ?? []).length;
        expect(count, `${lang} ${key} has ${count} em dashes`).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe('topics: Bengali and Urdu translated, Hinglish from the notebook', () => {
  // The notebook's Hinglish telling has its own section breaks, so
  // the Hinglish section counts differ from the English pages by
  // design. These are the counts the notebook material gives.
  const NOTEBOOK_SECTION_COUNTS: Record<string, number> = {
    'ibn-arabi-40-day-retreat': 6,
    'alam-al-malakut': 7,
    'ruh-and-soul': 5,
    'letter-alif': 5,
    'seal-of-solomon': 5,
    'three-kinds-of-dreams': 6,
    'surah-saba-34-14': 5,
    'al-khidr': 5,
    'quranic-drinks': 5,
    'rijal-al-ghayb': 6,
    'uwaisi-transmission': 3,
    'renewal-of-creation': 3,
    'basmalah-secrets': 6,
    'throne-verse': 6,
    'greatest-name': 6,
    'fawatih-openings': 6,
    'four-tawaqif': 6,
    'kaf-ha-ya-ayn-sad': 6,
    'zayirjah': 6,
    'circle-of-encompassing': 6,
    'simiya-works': 6,
    'uses-of-letters-retreats': 6,
  };

  it('all 22 topics localise to Bengali with the same shape as English', () => {
    expect(TOPICS).toHaveLength(22);
    for (const topic of TOPICS) {
      const bn = localizeTopic(topic, 'bn');
      expect(bn.id).toBe(topic.id);
      expect(bn.title).not.toBe(topic.title);
      expect(bn.sections).toHaveLength(topic.sections.length);
      for (let i = 0; i < topic.sections.length; i++) {
        expect(bn.sections[i].paragraphs).toHaveLength(topic.sections[i].paragraphs.length);
      }
      expect(bn.terms).toHaveLength(topic.terms.length);
      // Arabic, transliteration, sources and facts never change.
      for (let i = 0; i < topic.sections.length; i++) {
        expect(bn.sections[i].quote?.arabic).toBe(topic.sections[i].quote?.arabic);
        expect(bn.sections[i].quote?.transliteration).toBe(
          topic.sections[i].quote?.transliteration,
        );
        expect(bn.sections[i].quote?.source).toBe(topic.sections[i].quote?.source);
      }
      for (let i = 0; i < topic.terms.length; i++) {
        expect(bn.terms[i].arabic).toBe(topic.terms[i].arabic);
        expect(bn.terms[i].transliteration).toBe(topic.terms[i].transliteration);
      }
      expect(bn.sources).toEqual(topic.sources);
    }
  });

  it('Hinglish topics come from the notebook, with its own section breaks', () => {
    expect(TOPICS).toHaveLength(22);
    for (const topic of TOPICS) {
      const hi = localizeTopic(topic, 'hi');
      expect(hi.id).toBe(topic.id);
      // Titles that are names (Alam al-Malakut) stay the same in
      // Hinglish, like a book title; the translation shows in the
      // intro, sections and terms below.
      expect(hi.title.trim().length, `${topic.id} hi title`).toBeGreaterThan(0);
      // Topics 1-12 have impersonal English intros, so their Hinglish
      // intros must not add "Main Khafi hoon."; topics 13-22 say
      // "I am Khafi" in English, so theirs do start with it.
      if (TOPICS.indexOf(topic) < 12) {
        expect(hi.intro, `${topic.id} hi intro`).not.toMatch(/^Main Khafi hoon\./);
      } else {
        expect(hi.intro, `${topic.id} hi intro`).toMatch(/^Main Khafi hoon\./);
      }
      expect(hi.intro, `${topic.id} hi intro`).not.toBe(topic.intro);
      expect(hi.sections, `${topic.id} hi sections`).toHaveLength(
        NOTEBOOK_SECTION_COUNTS[topic.id],
      );
      // Every Hinglish term carries Arabic + transliteration + a meaning.
      expect(hi.terms.length, `${topic.id} hi terms`).toBeGreaterThan(0);
      for (const term of hi.terms) {
        expect(term.arabic.trim().length, `${topic.id} term arabic`).toBeGreaterThan(0);
        expect(term.transliteration.trim().length, `${topic.id} term transliteration`).toBeGreaterThan(0);
        expect(term.meaning.trim().length, `${topic.id} term meaning`).toBeGreaterThan(0);
      }
      // Sources, facts and numbers never change with the language.
      expect(hi.sources).toEqual(topic.sources);
    }
    // Spot-check the notebook headings, word for word.
    const byId = new Map(TOPICS.map((t) => [t.id, localizeTopic(t, 'hi')]));
    expect(byId.get('ibn-arabi-40-day-retreat')?.sections[0].heading).toBe(
      'Shuruat: Averroes (Ibn Rushd) ki Hairani',
    );
    expect(byId.get('alam-al-malakut')?.sections[2].heading).toBe(
      'Malakut ke Aath Sutoon (Eight Pillars)',
    );
    expect(byId.get('quranic-drinks')?.sections[0].heading).toBe('Paani (Al-Ma): Absolute Gnosis');
    expect(byId.get('rijal-al-ghayb')?.sections[1].heading).toBe(
      'The Cosmic Pyramid: Numbers aur Hierarchy',
    );
  });

  it('Hinglish questions are translated; guides still fall back to English', () => {
    for (const q of TOPIC_QUESTIONS) {
      const hi = localizeQuestion(q, 'hi');
      expect(hi.question, `${q.id} hi question`).not.toBe(q.question);
      expect(hi.answer, `${q.id} hi answer`).toHaveLength(q.answer.length);
      expect(hi.terms?.length).toBe(q.terms?.length ?? 0);
    }
    // Guides are not in the notebook material, so Hinglish guides
    // still show the English text for now.
    for (const g of STUDY_GUIDES) {
      expect(localizeGuide(g, 'hi').title).toBe(g.title);
    }
  });

  it('Bengali questions and guides are translated with the same shape', () => {
    for (const q of TOPIC_QUESTIONS) {
      const bn = localizeQuestion(q, 'bn');
      expect(bn.question).not.toBe(q.question);
      expect(bn.answer).toHaveLength(q.answer.length);
    }
    for (const g of STUDY_GUIDES) {
      const bn = localizeGuide(g, 'bn');
      expect(bn.title).not.toBe(g.title);
      expect(bn.sections).toHaveLength(g.sections.length);
    }
  });

  it('all 22 topics localise to Urdu with the same shape as English', () => {
    expect(TOPICS).toHaveLength(22);
    for (const topic of TOPICS) {
      const ur = localizeTopic(topic, 'ur');
      expect(ur.id).toBe(topic.id);
      expect(ur.title.trim().length, `${topic.id} ur title`).toBeGreaterThan(0);
      expect(ur.intro, `${topic.id} ur intro`).not.toBe(topic.intro);
      expect(ur.sections).toHaveLength(topic.sections.length);
      for (let i = 0; i < topic.sections.length; i++) {
        expect(ur.sections[i].paragraphs).toHaveLength(topic.sections[i].paragraphs.length);
      }
      expect(ur.terms).toHaveLength(topic.terms.length);
      // Arabic, transliteration, sources and facts never change.
      for (let i = 0; i < topic.sections.length; i++) {
        expect(ur.sections[i].quote?.arabic).toBe(topic.sections[i].quote?.arabic);
        expect(ur.sections[i].quote?.transliteration).toBe(
          topic.sections[i].quote?.transliteration,
        );
        expect(ur.sections[i].quote?.source).toBe(topic.sections[i].quote?.source);
      }
      for (let i = 0; i < topic.terms.length; i++) {
        expect(ur.terms[i].arabic).toBe(topic.terms[i].arabic);
        expect(ur.terms[i].transliteration).toBe(topic.terms[i].transliteration);
      }
      expect(ur.sources).toEqual(topic.sources);
    }
  });

  it('Urdu questions and guides are translated with the same shape', () => {
    for (const q of TOPIC_QUESTIONS) {
      const ur = localizeQuestion(q, 'ur');
      expect(ur.question).not.toBe(q.question);
      expect(ur.answer).toHaveLength(q.answer.length);
    }
    for (const g of STUDY_GUIDES) {
      const ur = localizeGuide(g, 'ur');
      expect(ur.title).not.toBe(g.title);
      expect(ur.sections).toHaveLength(g.sections.length);
    }
  });

  it('the 99 Names have Urdu meanings, keyed by the same Arabic names', () => {
    const enNames = Object.keys(ASMA_MEANINGS.en).sort();
    expect(enNames.length).toBe(99);
    expect(Object.keys(ASMA_MEANINGS.ur).sort()).toEqual(enNames);
    for (const name of enNames) {
      expect(ASMA_MEANINGS.ur[name].trim().length, `ur meaning for ${name}`).toBeGreaterThan(0);
    }
  });
});

describe('the language is picked once, on the first visit', () => {
  it('App shows the first-visit chooser before the gate', () => {
    const app = readSource('src/App.tsx');
    expect(app).toContain('LanguagePicker');
    expect(app).toContain('hasChosenLanguage');
    expect(app).toContain('showChooser');
  });

  it('the chooser offers all four languages in their own script, big tap targets, and saves the choice', () => {
    const picker = readSource('src/components/ui/LanguagePicker.tsx');
    expect(picker).toContain('SITE_LANGUAGES');
    expect(picker).toContain('updateSettings({ language: id })');
    expect(picker).toContain('setLanguageChosen');
    expect(picker).toContain('nativeLabel');
    expect(picker).toContain('min-h-[68px]');
    expect(picker).toContain('Noto Nastaliq Urdu');
  });

  it('the top bar no longer carries a language strip', () => {
    const nav = readSource('src/components/layout/Navbar.tsx');
    expect(nav).not.toContain('LanguagePicker');
  });

  it('the Home page no longer carries a language card', () => {
    const home = readSource('src/views/HomeView.tsx');
    expect(home).not.toContain('LanguagePicker');
  });

  it('Settings offers all four choices', () => {
    const modal = readSource('src/components/ui/SettingsModal.tsx');
    expect(modal).toContain('SITE_LANGUAGES');
  });

  it('the Tools hub counts topics from the live list, never a hardcoded number', () => {
    const hub = readSource('src/views/tools/ToolsHubView.tsx');
    expect(hub).not.toContain('2 topics so far');
    expect(hub).toContain('TOPICS.length');
  });
});
