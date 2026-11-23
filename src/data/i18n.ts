/**
 * Site languages: English, Hinglish, Bengali, Urdu.
 *
 * English is the primary language and the default for every visitor.
 * Hinglish (Roman-script Hindi/Urdu, in the channel's reel voice),
 * Bengali (easy familiar words) and Urdu (proper Urdu script, RTL)
 * are options. The language is picked once, on the first visit, on
 * a big chooser screen; after that it can only be changed in
 * Settings. The choice is remembered on the device
 * (UserSettings.language).
 *
 * What NEVER changes with the language:
 * - book titles, author names, and the @ghayb.chronicles handle
 * - Arabic text (Quran quotes, Names, letters) and transliteration
 * - numbers, sources (book + page), and facts
 * Only the plain explanation words around them get translated.
 *
 * Every Hinglish and Bengali string here was written by hand, in the
 * channel's own voice, and checked line by line. No machine
 * translation was used. If a key is missing in a language, `t`
 * falls back to English — and the tests fail on any missing key, so
 * a missing translation can never ship silently.
 *
 * The per-area chunks (i18n-home, i18n-library, i18n-topics) are
 * merged into STRINGS below. Their views either call t() here or
 * read their own chunk directly (topics helpers); both paths hold
 * the same strings.
 *
 * i18n-tools is deliberately NOT merged here: it is the biggest
 * chunk (about 3,400 strings across the four languages) and every
 * tools view reads it directly through tTools() in i18n-tools.ts,
 * so merging it would ship the whole study-tools dictionary in the
 * first-load bundle of every page, including Home. Tools routes
 * are lazy-loaded, so i18n-tools now downloads only when a reader
 * opens a study tool. Do not re-add it to STRINGS without checking
 * the first-load bundle size first.
 */

import { I18N_HOME } from './i18n-home';
import { I18N_LIBRARY } from './i18n-library';
import { I18N_TOPICS } from './i18n-topics';

export type SiteLanguage = 'en' | 'hi' | 'bn' | 'ur';

/** The four choices, in the order the Settings picker shows them. */
export const SITE_LANGUAGES: { id: SiteLanguage; label: string; nativeLabel: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'hi', label: 'Hinglish', nativeLabel: 'Hinglish' },
  { id: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { id: 'ur', label: 'Urdu', nativeLabel: 'اردو' },
];

/** Unknown or missing stored value falls back to English, the default. */
export function resolveLanguage(value: unknown): SiteLanguage {
  if (value === 'hi' || value === 'bn' || value === 'ur' || value === 'en') return value;
  return 'en';
}

/** True when the language reads right-to-left. Only Urdu does. */
export function isRtlLanguage(lang: SiteLanguage): boolean {
  return lang === 'ur';
}

type Dict = Record<string, string>;

const en: Dict = {
  // ---- Navbar ----
  'nav.home': 'Home',
  'nav.library': 'Library',
  'nav.studyTools': 'Study Tools',
  'nav.topics': 'Topics',
  'nav.more': 'More',
  'nav.readingPaths': 'Reading Paths',
  'nav.timeline': 'History Timeline',
  'nav.myShelf': 'My Shelf',
  'nav.findBook': 'Find a Book',
  'nav.magicSquare': 'Magic Square',
  'nav.magicSquareMaker': 'Magic Square Maker',
  'nav.amals': 'Amals',
  'nav.favorites': 'Favorites',
  'nav.info': 'Info',
  'nav.instagram': 'Instagram',
  'nav.admin': 'Admin',
  'nav.adminSignedIn': 'Admin (signed in)',
  'nav.authenticated': 'Authenticated',
  'nav.settings': 'Settings',
  'nav.lightTheme': 'Light theme',
  'nav.darkTheme': 'Dark theme',
  'nav.searchPlaceholder': 'Search this library...',
  'nav.closeMenu': 'Close menu',
  'nav.toggleMenu': 'Toggle Menu',
  'nav.switchLight': 'Switch to light theme',
  'nav.switchDark': 'Switch to dark theme',
  'nav.byGhayb': 'by Ghayb Chronicles',

  // ---- Footer ----
  'footer.freeLine': 'Free books on Islamic history and wisdom • Open to everyone',
  'footer.disclaimer':
    'Amals and magic squares are at your own risk. Ghayb Chronicles and this library are not responsible for any consequences.',

  // ---- Settings modal ----
  'settings.title': 'Settings',
  'settings.subtitle': 'Personalize Ilm-e-Ghayb Library',
  'settings.close': 'Close Settings',
  'settings.appearance': 'Appearance',
  'settings.dark': 'Dark',
  'settings.light': 'Light',
  'settings.system': 'System',
  'settings.accentColor': 'Accent Color',
  'settings.colorGold': 'Gold',
  'settings.colorBlue': 'Blue',
  'settings.colorGreen': 'Green',
  'settings.colorPurple': 'Purple',
  'settings.colorRose': 'Rose',
  'settings.viewMode': 'Default View Mode',
  'settings.listView': 'List View',
  'settings.gridView': 'Grid View',
  'settings.fontScale': 'Font Scale',
  'settings.small': 'Small',
  'settings.medium': 'Medium',
  'settings.large': 'Large',
  'settings.animations': 'Animations',
  'settings.animNormal': 'Normal',
  'settings.animNormalDesc': 'Subtle transitions',
  'settings.animReduced': 'Reduced Motion',
  'settings.animReducedDesc': 'Minimal motion',
  'settings.language': 'Language',
  'settings.languageNote': 'English is the main language. Pick Hinglish, Bengali or Urdu to read the whole site in that language.',
  'settings.languageEnglish': 'English',
  'settings.languageHinglish': 'Hinglish',
  'settings.languageBengali': 'Bengali',
  'settings.languageUrdu': 'Urdu',
  'settings.done': 'Done',

  // ---- Follow gate ----
  'gate.tagline':
    "Books on the Quran, the Prophet's life, Sufi wisdom and Islamic history. Every entry names its source. Everyone is welcome, no account needed.",
  'gate.followToEnter': 'Follow us to enter the library',
  'gate.oneFollow': 'One follow unlocks the library and every free book on this device.',
  'gate.collections': 'Collections',
  'gate.folders': 'Folders',
  'gate.books': 'Books',
  'gate.free': 'Free',
  'gate.afterFollow': 'After follow',
  'gate.loading': 'Loading the library…',
  'gate.followOnInstagram': 'Follow @ghayb.chronicles on Instagram',
  'gate.followedUnlock': 'I followed, unlock the library',
  'gate.orKey': 'or unlock with a key',
  'gate.keyPlaceholder': 'Have a key? Enter it here',
  'gate.unlock': 'Unlock',
  'gate.checking': 'Checking…',
  'gate.wrongKey': 'Wrong key. Try again.',
  'gate.joinChannel': 'Join the broadcast channel to get the key',
  'gate.trustNote':
    'This is a free library, so unlocking works on trust. It does not check your Instagram account. Follow first, then tap unlock. The key here opens the library and free books. Paid books need their own book key.',
  'gate.footnote': 'Islamic history and wisdom • Sufism and hidden knowledge, through art',
  'gate.adminSignIn': 'Library admin? Sign in here',
  'home.languageTitle': 'Choose your language',
  'home.languageSubtitle': 'Read the whole library in the language that feels easy to you.',
  'home.languageBarLabel': 'Language',
  'gate.keyLabel': 'Gate key',

  // ---- First-visit language chooser ----
  'chooser.title': 'Choose your language',
  'chooser.subtitle': 'Tap your language. You can change it later in Settings.',
};

const hi: Dict = {
  // ---- Navbar ----
  'nav.home': 'Home',
  'nav.library': 'Library',
  'nav.studyTools': 'Padhai ke Tools',
  'nav.topics': 'Topics',
  'nav.more': 'Aur',
  'nav.readingPaths': 'Padhne ke Raaste',
  'nav.timeline': 'Tareekh ki Timeline',
  'nav.myShelf': 'Meri Shelf',
  'nav.findBook': 'Kitab Dhoondhein',
  'nav.magicSquare': 'Magic Square',
  'nav.magicSquareMaker': 'Magic Square Maker',
  'nav.amals': 'Amal',
  'nav.favorites': 'Favorites',
  'nav.info': 'Info',
  'nav.instagram': 'Instagram',
  'nav.admin': 'Admin',
  'nav.adminSignedIn': 'Admin (signed in)',
  'nav.authenticated': 'Authenticated',
  'nav.settings': 'Settings',
  'nav.lightTheme': 'Light theme',
  'nav.darkTheme': 'Dark theme',
  'nav.searchPlaceholder': 'Is library mein dhoondhein...',
  'nav.closeMenu': 'Menu band karein',
  'nav.toggleMenu': 'Menu kholein ya band karein',
  'nav.switchLight': 'Light theme par jayein',
  'nav.switchDark': 'Dark theme par jayein',
  'nav.byGhayb': 'by Ghayb Chronicles',

  // ---- Footer ----
  'footer.freeLine': 'Islami tareekh aur hikmat par free kitabein • Sab ke liye khula hai',
  'footer.disclaimer':
    'Amal aur magic square aap apni zimmedari par karein. Ghayb Chronicles aur yeh library kisi bhi nateeje ki zimmedar nahi hai.',

  // ---- Settings modal ----
  'settings.title': 'Settings',
  'settings.subtitle': 'Ilm-e-Ghayb Library ko apne hisab se set karein',
  'settings.close': 'Settings band karein',
  'settings.appearance': 'Dikhawa',
  'settings.dark': 'Dark',
  'settings.light': 'Light',
  'settings.system': 'System',
  'settings.accentColor': 'Rang',
  'settings.colorGold': 'Sona',
  'settings.colorBlue': 'Neela',
  'settings.colorGreen': 'Hara',
  'settings.colorPurple': 'Baingani',
  'settings.colorRose': 'Gulabi',
  'settings.viewMode': 'Dekhne ka tareeka',
  'settings.listView': 'List',
  'settings.gridView': 'Grid',
  'settings.fontScale': 'Akshar ka size',
  'settings.small': 'Chhota',
  'settings.medium': 'Medium',
  'settings.large': 'Bada',
  'settings.animations': 'Harkat',
  'settings.animNormal': 'Normal',
  'settings.animNormalDesc': 'Halki-phulki harkat',
  'settings.animReduced': 'Kam Harkat',
  'settings.animReducedDesc': 'Bilkul kam harkat',
  'settings.language': 'Bhasha',
  'settings.languageNote': 'English hi main language hai. Poori site Hinglish, Bengali ya Urdu mein padhne ke liye yahan se chunein.',
  'settings.languageEnglish': 'English',
  'settings.languageHinglish': 'Hinglish',
  'settings.languageBengali': 'Bengali',
  'settings.languageUrdu': 'Urdu',
  'settings.done': 'Ho gaya',

  // ---- Follow gate ----
  'gate.tagline':
    "Quran, Nabi ki zindagi, Sufi hikmat aur Islami tareekh par kitabein. Har entry mein uska source likha hai. Sab ka swagat hai, koi account nahi chahiye.",
  'gate.followToEnter': 'Library mein jaane ke liye follow karein',
  'gate.oneFollow': 'Ek follow se is device par library aur har free kitab khul jayegi.',
  'gate.collections': 'Collections',
  'gate.folders': 'Folders',
  'gate.books': 'Kitabein',
  'gate.free': 'Free',
  'gate.afterFollow': 'Follow ke baad',
  'gate.loading': 'Library load ho rahi hai…',
  'gate.followOnInstagram': 'Instagram par @ghayb.chronicles ko follow karein',
  'gate.followedUnlock': 'Maine follow kar liya, library kholein',
  'gate.orKey': 'ya key se kholein',
  'gate.keyPlaceholder': 'Key hai? Yahan likhein',
  'gate.unlock': 'Kholein',
  'gate.checking': 'Check ho raha hai…',
  'gate.wrongKey': 'Galat key hai. Dobara try karein.',
  'gate.joinChannel': 'Key paane ke liye broadcast channel join karein',
  'gate.trustNote':
    'Yeh free library hai, isliye unlock bharose par hota hai. Yeh aapka Instagram account check nahi karti. Pehle follow karein, phir unlock dabayein. Yahan wali key se library aur free kitabein khulti hain. Paid kitab ko apni key chahiye.',
  'gate.footnote': 'Islami tareekh aur hikmat • Sufism aur chhupa hua ilm, art ke saath',
  'gate.adminSignIn': 'Library admin? Yahan sign in karein',
  'home.languageTitle': 'Apni bhasha chunein',
  'home.languageSubtitle': 'Poori library us bhasha mein padhein jo aapko aasan lagti hai.',
  'home.languageBarLabel': 'Bhasha',
  'gate.keyLabel': 'Gate key',

  // ---- First-visit language chooser ----
  'chooser.title': 'Apni bhasha chunein',
  'chooser.subtitle': 'Apni bhasha par tap karein. Baad mein Settings mein badal sakte hain.',
};

const bn: Dict = {
  // ---- Navbar ----
  'nav.home': 'হোম',
  'nav.library': 'লাইব্রেরি',
  'nav.studyTools': 'পড়াশোনার টুলস',
  'nav.topics': 'টপিক',
  'nav.more': 'আরও',
  'nav.readingPaths': 'পড়ার পথ',
  'nav.timeline': 'ইতিহাসের সময়রেখা',
  'nav.myShelf': 'আমার শেলফ',
  'nav.findBook': 'বই খুঁজুন',
  'nav.magicSquare': 'ম্যাজিক স্কয়ার',
  'nav.magicSquareMaker': 'ম্যাজিক স্কয়ার মেকার',
  'nav.amals': 'আমল',
  'nav.favorites': 'পছন্দের বই',
  'nav.info': 'তথ্য',
  'nav.instagram': 'ইনস্টাগ্রাম',
  'nav.admin': 'অ্যাডমিন',
  'nav.adminSignedIn': 'অ্যাডমিন (সাইন ইন করা আছে)',
  'nav.authenticated': 'সাইন ইন করা আছে',
  'nav.settings': 'সেটিংস',
  'nav.lightTheme': 'লাইট থিম',
  'nav.darkTheme': 'ডার্ক থিম',
  'nav.searchPlaceholder': 'এই লাইব্রেরিতে খুঁজুন...',
  'nav.closeMenu': 'মেনু বন্ধ করুন',
  'nav.toggleMenu': 'মেনু খুলুন বা বন্ধ করুন',
  'nav.switchLight': 'লাইট থিমে যান',
  'nav.switchDark': 'ডার্ক থিমে যান',
  'nav.byGhayb': 'by Ghayb Chronicles',

  // ---- Footer ----
  'footer.freeLine': 'ইসলামি ইতিহাস ও জ্ঞানের উপর ফ্রি বই • সবার জন্য খোলা',
  'footer.disclaimer':
    'আমল ও ম্যাজিক স্কয়ার নিজের দায়িত্বে করবেন। গায়েব ক্রনিকলস ও এই লাইব্রেরি কোনো পরিণতির জন্য দায়ী নয়।',

  // ---- Settings modal ----
  'settings.title': 'সেটিংস',
  'settings.subtitle': 'ইলমে গায়েব লাইব্রেরি নিজের মতো করে সাজান',
  'settings.close': 'সেটিংস বন্ধ করুন',
  'settings.appearance': 'চেহারা',
  'settings.dark': 'ডার্ক',
  'settings.light': 'লাইট',
  'settings.system': 'সিস্টেম',
  'settings.accentColor': 'অ্যাকসেন্ট রং',
  'settings.colorGold': 'সোনালি',
  'settings.colorBlue': 'নীল',
  'settings.colorGreen': 'সবুজ',
  'settings.colorPurple': 'বেগুনি',
  'settings.colorRose': 'গোলাপি',
  'settings.viewMode': 'ডিফল্ট ভিউ',
  'settings.listView': 'লিস্ট ভিউ',
  'settings.gridView': 'গ্রিড ভিউ',
  'settings.fontScale': 'অক্ষরের মাপ',
  'settings.small': 'ছোট',
  'settings.medium': 'মাঝারি',
  'settings.large': 'বড়',
  'settings.animations': 'অ্যানিমেশন',
  'settings.animNormal': 'সাধারণ',
  'settings.animNormalDesc': 'হালকা নড়াচড়া',
  'settings.animReduced': 'কম নড়াচড়া',
  'settings.animReducedDesc': 'একদম কম নড়াচড়া',
  'settings.language': 'ভাষা',
  'settings.languageNote': 'ইংরেজিই মূল ভাষা। পুরো সাইট হিংলিশ, বাংলা বা উর্দুতে পড়তে চাইলে এখান থেকে বেছে নিন।',
  'settings.languageEnglish': 'ইংরেজি',
  'settings.languageHinglish': 'হিংলিশ',
  'settings.languageBengali': 'বাংলা',
  'settings.languageUrdu': 'উর্দু',
  'settings.done': 'হয়ে গেছে',

  // ---- Follow gate ----
  'gate.tagline':
    'কুরআন, নবীর জীবন, সুফি জ্ঞান ও ইসলামি ইতিহাসের বই। প্রতিটি লেখায় তার উৎস দেওয়া আছে। সবাইকে স্বাগতম, কোনো অ্যাকাউন্ট লাগবে না।',
  'gate.followToEnter': 'লাইব্রেরিতে ঢুকতে ফলো করুন',
  'gate.oneFollow': 'একবার ফলো করলেই এই ডিভাইসে লাইব্রেরি আর সব ফ্রি বই খুলে যাবে।',
  'gate.collections': 'কালেকশন',
  'gate.folders': 'ফোল্ডার',
  'gate.books': 'বই',
  'gate.free': 'ফ্রি',
  'gate.afterFollow': 'ফলোর পরে',
  'gate.loading': 'লাইব্রেরি লোড হচ্ছে…',
  'gate.followOnInstagram': 'ইনস্টাগ্রামে @ghayb.chronicles কে ফলো করুন',
  'gate.followedUnlock': 'আমি ফলো করেছি, লাইব্রেরি খুলুন',
  'gate.orKey': 'অথবা চাবি দিয়ে খুলুন',
  'gate.keyPlaceholder': 'চাবি আছে? এখানে লিখুন',
  'gate.unlock': 'খুলুন',
  'gate.checking': 'দেখা হচ্ছে…',
  'gate.wrongKey': 'ভুল চাবি। আবার চেষ্টা করুন।',
  'gate.joinChannel': 'চাবি পেতে ব্রডকাস্ট চ্যানেলে যোগ দিন',
  'gate.trustNote':
    'এটি ফ্রি লাইব্রেরি, তাই আনলক হয় বিশ্বাসের উপর। এটা আপনার ইনস্টাগ্রাম অ্যাকাউন্ট দেখে না। প্রথমে ফলো করুন, তারপর আনলক চাপুন। এখানকার চাবিতে লাইব্রেরি আর ফ্রি বই খোলে। পেইড বইয়ের নিজের চাবি লাগে।',
  'gate.footnote': 'ইসলামি ইতিহাস ও জ্ঞান • সুফিবাদ ও লুকানো জ্ঞান, শিল্পের মাধ্যমে',
  'gate.adminSignIn': 'লাইব্রেরির অ্যাডমিন? এখানে সাইন ইন করুন',
  'home.languageTitle': 'আপনার ভাষা বেছে নিন',
  'home.languageSubtitle': 'পুরো লাইব্রেরি সেই ভাষায় পড়ুন যেটা আপনার সহজ লাগে।',
  'home.languageBarLabel': 'ভাষা',
  'gate.keyLabel': 'গেটের চাবি',

  // ---- First-visit language chooser ----
  'chooser.title': 'আপনার ভাষা বেছে নিন',
  'chooser.subtitle': 'আপনার ভাষায় ট্যাপ করুন। পরে সেটিংসে বদলাতে পারবেন।',
};

const ur: Dict = {
  // ---- Navbar ----
  'nav.home': 'ہوم',
  'nav.library': 'لائبریری',
  'nav.studyTools': 'مطالعے کے ٹولز',
  'nav.topics': 'موضوعات',
  'nav.more': 'مزید',
  'nav.readingPaths': 'پڑھنے کے راستے',
  'nav.timeline': 'تاریخ کی ٹائم لائن',
  'nav.myShelf': 'میری شیلف',
  'nav.findBook': 'کتاب تلاش کریں',
  'nav.magicSquare': 'میجک اسکوائر',
  'nav.magicSquareMaker': 'میجک اسکوائر بنانے والا',
  'nav.amals': 'اعمال',
  'nav.favorites': 'پسندیدہ',
  'nav.info': 'معلومات',
  'nav.instagram': 'Instagram',
  'nav.admin': 'ایڈمن',
  'nav.adminSignedIn': 'ایڈمن (سائن ان ہے)',
  'nav.authenticated': 'سائن ان ہے',
  'nav.settings': 'سیٹنگز',
  'nav.lightTheme': 'ہلکی تھیم',
  'nav.darkTheme': 'گہری تھیم',
  'nav.searchPlaceholder': 'اس لائبریری میں تلاش کریں...',
  'nav.closeMenu': 'مینیو بند کریں',
  'nav.toggleMenu': 'مینیو کھولیں یا بند کریں',
  'nav.switchLight': 'ہلکی تھیم پر جائیں',
  'nav.switchDark': 'گہری تھیم پر جائیں',
  'nav.byGhayb': 'by Ghayb Chronicles',

  // ---- Footer ----
  'footer.freeLine': 'اسلامی تاریخ اور حکمت پر مفت کتابیں • سب کے لیے کھلا ہے',
  'footer.disclaimer':
    'اعمال اور میجک اسکوائر آپ کی اپنی ذمہ داری پر ہیں۔ Ghayb Chronicles اور یہ لائبریری کسی بھی نتیجے کی ذمہ دار نہیں۔',

  // ---- Settings modal ----
  'settings.title': 'سیٹنگز',
  'settings.subtitle': 'علمِ غیب لائبریری کو اپنے حساب سے سیٹ کریں',
  'settings.close': 'سیٹنگز بند کریں',
  'settings.appearance': 'شکل',
  'settings.dark': 'گہری',
  'settings.light': 'ہلکی',
  'settings.system': 'سسٹم',
  'settings.accentColor': 'رنگ',
  'settings.colorGold': 'سنہری',
  'settings.colorBlue': 'نیلا',
  'settings.colorGreen': 'سبز',
  'settings.colorPurple': 'جامنی',
  'settings.colorRose': 'گلابی',
  'settings.viewMode': 'دیکھنے کا طریقہ',
  'settings.listView': 'لسٹ',
  'settings.gridView': 'گرڈ',
  'settings.fontScale': 'لفظوں کا سائز',
  'settings.small': 'چھوٹا',
  'settings.medium': 'درمیانہ',
  'settings.large': 'بڑا',
  'settings.animations': 'حرکت',
  'settings.animNormal': 'عام',
  'settings.animNormalDesc': 'ہلکی پھلکی حرکت',
  'settings.animReduced': 'کم حرکت',
  'settings.animReducedDesc': 'بالکل کم حرکت',
  'settings.language': 'زبان',
  'settings.languageNote': 'انگریزی ہی اصل زبان ہے۔ پوری سائٹ ہنگلش، بنگالی یا اردو میں پڑھنے کے لیے یہاں سے چنیں۔',
  'settings.languageEnglish': 'انگریزی',
  'settings.languageHinglish': 'ہنگلش',
  'settings.languageBengali': 'بنگالی',
  'settings.languageUrdu': 'اردو',
  'settings.done': 'ہو گیا',

  // ---- Follow gate ----
  'gate.tagline':
    'قرآن، نبی کی زندگی، صوفی حکمت اور اسلامی تاریخ پر کتابیں۔ ہر کتاب کے ساتھ اس کا ماخذ لکھا ہے۔ سب کا خیر مقدم ہے، کوئی اکاؤنٹ نہیں چاہیے۔',
  'gate.followToEnter': 'لائبریری میں جانے کے لیے فالو کریں',
  'gate.oneFollow': 'ایک فالو سے اس ڈیوائس پر لائبریری اور ہر مفت کتاب کھل جائے گی۔',
  'gate.collections': 'مجموعے',
  'gate.folders': 'فولڈرز',
  'gate.books': 'کتابیں',
  'gate.free': 'مفت',
  'gate.afterFollow': 'فالو کے بعد',
  'gate.loading': 'لائبریری لوڈ ہو رہی ہے…',
  'gate.followOnInstagram': 'Instagram پر @ghayb.chronicles کو فالو کریں',
  'gate.followedUnlock': 'میں نے فالو کر لیا، لائبریری کھولیں',
  'gate.orKey': 'یا چابی سے کھولیں',
  'gate.keyPlaceholder': 'چابی ہے؟ یہاں لکھیں',
  'gate.unlock': 'کھولیں',
  'gate.checking': 'جانچ ہو رہی ہے…',
  'gate.wrongKey': 'غلط چابی۔ دوبارہ کوشش کریں۔',
  'gate.joinChannel': 'چابی پانے کے لیے براڈکاسٹ چینل جوائن کریں',
  'gate.trustNote':
    'یہ مفت لائبریری ہے، اس لیے کھولنا بھروسے پر ہوتا ہے۔ یہ آپ کا Instagram اکاؤنٹ نہیں جانچتی۔ پہلے فالو کریں، پھر انلاک دبائیں۔ یہاں والی چابی سے لائبریری اور مفت کتابیں کھلتی ہیں۔ پیڈ کتاب کو اپنی چابی چاہیے۔',
  'gate.footnote': 'اسلامی تاریخ اور حکمت • تصوف اور چھپا ہوا علم، فن کے ذریعے',
  'gate.adminSignIn': 'لائبریری ایڈمن؟ یہاں سائن ان کریں',
  'home.languageTitle': 'اپنی زبان چنیں',
  'home.languageSubtitle': 'پوری لائبریری اس زبان میں پڑھیں جو آپ کو آسان لگتی ہے۔',
  'home.languageBarLabel': 'زبان',
  'gate.keyLabel': 'گیٹ کی چابی',

  // ---- First-visit language chooser ----
  'chooser.title': 'اپنی زبان چنیں',
  'chooser.subtitle': 'اپنی زبان پر ٹیپ کریں۔ بعد میں سیٹنگز میں بدل سکتے ہیں۔',
};

export const STRINGS: Record<SiteLanguage, Dict> = {
  en: { ...en, ...I18N_HOME.en, ...I18N_LIBRARY.en, ...I18N_TOPICS.en },
  hi: { ...hi, ...I18N_HOME.hi, ...I18N_LIBRARY.hi, ...I18N_TOPICS.hi },
  bn: { ...bn, ...I18N_HOME.bn, ...I18N_LIBRARY.bn, ...I18N_TOPICS.bn },
  ur: { ...ur, ...I18N_HOME.ur, ...I18N_LIBRARY.ur, ...I18N_TOPICS.ur },
};

/**
 * Translate a UI key. Falls back to English, then to the key itself,
 * so the page never crashes on a missing string — and the tests fail
 * on any missing key, so a missing translation can never ship.
 */
export function t(key: string, lang: SiteLanguage = 'en'): string {
  const l = resolveLanguage(lang);
  return STRINGS[l][key] ?? STRINGS.en[key] ?? key;
}

/** All keys that exist in English (the source of truth for tests). */
export function allKeys(): string[] {
  return Object.keys(STRINGS.en);
}

/**
 * Translate a key with {name} placeholders, e.g. tf('home.pageOf', lang,
 * { a: '3', b: '10' }). Placeholders are only ever numbers or dates.
 */
export function tf(key: string, lang: SiteLanguage, vars: Record<string, string | number>): string {
  let out = t(key, lang);
  for (const [name, value] of Object.entries(vars)) {
    out = out.split(`{${name}}`).join(String(value));
  }
  return out;
}

/** True when every key has a translation in the given language. */
export function hasFullCoverage(lang: SiteLanguage): boolean {
  return allKeys().every((k) => typeof STRINGS[lang][k] === 'string' && STRINGS[lang][k].length > 0);
}
