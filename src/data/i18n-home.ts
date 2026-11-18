import type { SiteLanguage } from '../types';

/**
 * Home + Nav + Footer + Gate + Info + shared UI chrome strings.
 *
 * English is the primary language and the default. Hinglish (Roman
 * Hindi/Urdu, in the channel's reel voice) and Bengali (easy familiar
 * words) are Settings-only options. Every Hinglish and Bengali string
 * here was written by hand and checked line by line. No machine
 * translation was used.
 *
 * What NEVER changes with the language:
 * - book titles, author names, and the @ghayb.chronicles handle
 * - Arabic text and transliteration (al-Sharatayn, Kabir Mashriqi,
 *   Huruf, Shams al-Ma'arif, planet and mansion names)
 * - numbers, sources, and facts
 * Only the plain explanation words around them get translated.
 *
 * Key prefixes owned by this chunk: home.*, greeting.*, info.*,
 * specials.*, ui.*. The parent merges this into src/data/i18n.ts;
 * components call t()/tf() from there, so a key missing here falls
 * back to English until the merge lands.
 */
export const I18N_HOME: Record<SiteLanguage, Record<string, string>> = {
  en: {
    // ---- Shared: logo alt text ----
    'home.logoAlt': 'Ilm-e-Ghayb Library logo',
    'home.logoAltLong': 'Ilm-e-Ghayb Library logo — halftone gold arch doorway with a geometric star',
    'home.nav.instagramFollow': 'Follow @ghayb.chronicles on Instagram',

    // ---- Home hero ----
    'home.hero.eyebrow': 'Islamic history and wisdom',
    'home.hero.tagline': 'A free library of hidden knowledge',
    'home.hero.intro1':
      'Hidden knowledge, Sufi wisdom, and the books behind it: the Quran (the Muslim holy book), Tafseer (explaining the Quran), Hadith (the Prophet\'s sayings), Seerah (the Prophet\'s life), and history. Every entry names its source.',
    'home.hero.intro2': 'Everyone is welcome here. You do not need to be Muslim to read and learn.',
    'home.hero.browse': 'Browse the Library',
    'home.hero.follow': 'Follow @ghayb.chronicles',
    'home.hero.statCategories': 'Categories',
    'home.hero.searchPlaceholder': 'Search books: try “Sufi”, “Tafsir”, “Ibn Kathir” or “notes”…',
    'home.hero.searchAria': 'Search books by title, author or topic',
    'home.hero.searchButton': 'Search',

    // ---- Home: Continue Reading ----
    'home.continue.title': 'Continue Reading',
    'home.continue.viewHistory': 'View History',
    'home.continue.progress': 'Progress',
    'home.continue.pageOf': 'page {page} of {total}',
    'home.continue.pageOnly': 'page {page}',
    'home.continue.bookmarksOne': '{n} bookmark',
    'home.continue.bookmarksMany': '{n} bookmarks',

    // ---- Home: Tools ----
    'home.tools.title': 'Tools',
    'home.tools.blurb':
      'Made for this library. Your shelf, a book finder, the magic square maker, and amals from al-Buni\'s books.',
    'home.tools.shelfBlurb': 'Save books with a status — To Read, Reading, Finished.',
    'home.tools.findTitle': 'Find My Next Book',
    'home.tools.findBlurb': 'Three quick questions, three real books for your mood.',
    'home.tools.squareBlurb':
      'Build a magic number square in 3×3, 4×4, 5×5 or 7×7. Then check that every row adds up.',
    'home.tools.amalsTitle': 'Amals from al-Buni',
    'home.tools.amalsBlurb': '25 simple practices from Shams al-Ma\'arif. Tap one to see the full detail.',

    // ---- Home: Topic of the Day ----
    'home.topic.label': 'Topic of the Day · Day {day} · {date}',
    'home.topic.readToday': 'Read today’s topic',
    'home.topic.allTopics': 'All topics',

    // ---- Home: Reading Paths ----
    'home.journey.subtitle': 'A path through the books, in order, with your place saved.',
    'home.journey.allJourneys': 'All journeys',
    'home.journey.booksCount': '{n} books',
    'home.journey.readCount': '{done} of {total} read',
    'home.journey.knowledgeMap': 'Or see the Knowledge Map. It lists the masters in order of time',

    // ---- Home: Browse by Category ----
    'home.category.title': 'Browse by Category',
    'home.category.subtitle': 'Topics and categories — not folders. Tap a card to see its books.',
    'home.category.allBooks': 'All Books',
    'home.category.allBooksBlurb':
      'Every book in the library, flat. Tap a category chip to filter, tap a book to open it. No folders to dig through.',
    'home.category.bookCountOne': '{n} book',
    'home.category.bookCountMany': '{n} books',
    'home.category.booksFallback': 'Books in this category.',
    'home.category.viewAll': 'View all {n} categories',

    // ---- Home: channel behind the library ----
    'home.channel.titleA': 'The channel behind the',
    'home.channel.titleB': 'library',
    'home.channel.intro':
      'Ghayb Chronicles is a channel about Islamic history and wisdom — Sufism (the spiritual side of Islam), hidden knowledge, and the old books behind it. Every reel and post is built from real sources, with the source named in every entry, so you can check it yourself instead of taking our word for it.',
    'home.channel.sufiTitle': 'Sufism — the spiritual path',
    'home.channel.sufiBlurb':
      'Sufism is the spiritual side of Islam. Ibn Arabi, Rumi, Attar and Ghazali — their ideas, in simple words.',
    'home.channel.sourcesTitle': 'Sources in every entry',
    'home.channel.sourcesBlurb':
      'History, religious teachings, literary stories and theories are kept separate — and cited.',
    'home.channel.connectTitle': 'How the library connects',
    'home.channel.connectBlurb':
      'The books quoted in the channel live here. Read the full book behind any reel, free after follow.',
    'home.channel.readBooks': 'Read the books',

    // ---- Home: Catalog Highlights ----
    'home.highlights.title': 'Catalog Highlights',
    'home.highlights.subtitle': 'Some books to start with.',
    'home.highlights.pages': '{n} pages',
    'home.highlights.document': 'Document',

    // ---- Home: bottom banner ----
    'home.bottom.question': 'Looking for a book by topic or category, with search and filters?',
    'home.bottom.explore': 'Explore All Books',

    // ---- Home sky cards ----
    'home.sky.aria': 'The sky right now',
    'home.sky.today': 'Today',
    'home.sky.seeToday': 'See today',
    'home.sky.planetaryHour': 'Planetary hour now',
    'home.sky.day': 'day',
    'home.sky.night': 'night',
    'home.sky.hourOf': 'Hour {n} of 24, {dayNight}',
    'home.sky.approxNote':
      'Approximate, not real hours. Set your place in Planetary Hours for the true hours.',
    'home.sky.noHours':
      'No sunrise or sunset could be worked out for this place and day, so the hour is unavailable.',
    'home.sky.seeHours': 'See the hours',
    'home.sky.moon': 'The Moon',
    'home.sky.moonLit': 'Lit {n}% · Day {day} of the lunar month',
    'home.sky.seeMoon': 'See the Moon',
    'home.sky.mansion': 'Lunar mansion now',
    'home.sky.mansionOf': 'Mansion {n} of 28 · {from}° to {to}°',
    'home.sky.mansionNote': '28 equal parts from 0° al-Sharatayn, a stated convention.',
    'home.sky.seeMansions': 'See the mansions',
    'home.sky.phase.newMoon': 'New Moon',
    'home.sky.phase.waxingCrescent': 'Waxing Crescent',
    'home.sky.phase.firstQuarter': 'First Quarter',
    'home.sky.phase.waxingGibbous': 'Waxing Gibbous',
    'home.sky.phase.fullMoon': 'Full Moon',
    'home.sky.phase.waningGibbous': 'Waning Gibbous',
    'home.sky.phase.lastQuarter': 'Last Quarter',
    'home.sky.phase.waningCrescent': 'Waning Crescent',

    // ---- Home reckon box ----
    'home.reckon.label': 'Reckon a name',
    'home.reckon.title': 'What is a name worth in numbers?',
    'home.reckon.intro':
      'Type a name in Arabic. Its letters are counted in the abjad system, live, as you type.',
    'home.reckon.inputAria': 'Type a name in Arabic to reckon its value',
    'home.reckon.valueLabel': 'Value, Kabir Mashriqi',
    'home.reckon.noLetters': 'No Arabic letters found in that text.',
    'home.reckon.emptyHint': 'Type a name in Arabic to see its value.',
    'home.reckon.note': 'Kabir values, Mashriqi school. Other systems and schools are in the Huruf tool.',
    'home.reckon.openHuruf': 'Open the Huruf tool',

    // ---- Hijri date chip ----
    'home.hijri.approx': '(approx.)',
    'home.hijri.tooltip':
      '{date}. Tabular Islamic date, approximate, may differ from the sighted date by a day or two.',

    // ---- Wisdom of the Day ----
    'home.wisdom.title': 'Wisdom of the Day',
    'home.wisdom.teachingOf': 'A teaching of {master}. {about}',
    'home.wisdom.readSource': 'Read the source: {title}',

    // ---- Reading Stats ----
    'home.stats.title': 'Your Reading Stats',
    'home.stats.subtitle': 'Only on this device. Your shelf, your progress, your streak.',
    'home.stats.finished': 'Finished',
    'home.stats.readingNow': 'Reading now',
    'home.stats.onShelf': 'On My Shelf',
    'home.stats.journeySteps': 'Journey steps done',
    'home.stats.bookmarks': 'Bookmarks',
    'home.stats.streak': 'Day streak',

    // ---- Surprise Me / random book ----
    'home.random.empty': 'No books in the library yet.',
    'home.random.tag': 'Surprise Me. A random book',
    'home.random.another': 'Another one',
    'home.random.fallbackDesc': 'A book from the library, picked at random.',
    'home.random.open': 'Open this book',
    'home.random.onShelf': 'On My Shelf',
    'home.random.saveShelf': 'Save to My Shelf',
    'home.random.favorited': 'Favorited',
    'home.random.favorite': 'Favorite',

    // ---- Greeting ----
    'greeting.morning': 'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening': 'Good evening',

    // ---- Info page ----
    'info.tag': 'About & Creator',
    'info.intro':
      'A free library of old and important books. It covers the Quran, the Prophet\'s life, Sufism, history and more. Everyone is welcome to read.',
    'info.creatorTitle': 'Creator Identity',
    'info.creatorTagline': 'Islamic history and wisdom • Sufism and hidden knowledge, through art',
    'info.publicIdentity': 'Public Identity',
    'info.basedIn': 'Based in',
    'info.configurable': 'Configurable',
    'info.aboutTitle': 'About Ilm-e-Ghayb Library',
    'info.about1':
      'Ilm-e-Ghayb Library, by Ghayb Chronicles, is a free library of hidden knowledge and Sufi wisdom (Sufism is the spiritual side of Islam), and the books behind it.',
    'info.about2':
      'It covers Islamic knowledge: the Quran, the Sunnah (the Prophet\'s way of life), spirituality, history and philosophy. Every entry names its source, so you can check it yourself.',
    'info.authenticTitle': 'What does “Authentic” mean here?',
    'info.authentic1':
      'A book marked Authentic was checked by the library admin and found to be the genuine, unaltered text of the named work. Not a fake, altered or mislabelled copy.',
    'info.authentic2':
      'It is the admin\'s own check, not a scholarly certificate. A book without the mark has simply not been checked yet, not that it is fake. You can filter the library to Authentic books only from the Library page.',
    'info.authentic3':
      'Books with the same title are shown as versions. Version 1 is the oldest copy, Version 2 the next. Each has its real date, so you can tell which copy you are opening. If two copies share a title, check the date, author and edition before choosing.',
    'info.creatorNoteTitle': 'Creator Note',
    'info.creatorNoteQuote':
      'Some knowledge is everywhere.\nSome knowledge is hidden.\nThis is a place to seek both.',
    'info.connectTitle': 'Connect',
    'info.connectText': 'Questions, or a book to suggest? Message us here:',
    'info.telegramToBeAdded': 'To be added',
    'info.explore': 'Explore Library',

    // ---- Journeys (shown on Home; step notes live on the Journeys page) ----
    'specials.journey.seekers-path.title': 'The Seeker\'s Path',
    'specials.journey.seekers-path.subtitle': 'Sufism, step by step',
    'specials.journey.seekers-path.description':
      'Start with knowledge and belief, then walk the Sufi path: what the masters taught, how the heart travels, and the stories that carry it.',
    'specials.journey.seekers-path.level': 'Begin here',
    'specials.journey.ibn-arabi.title': 'The Ibn Arabi Journey',
    'specials.journey.ibn-arabi.subtitle': 'The Greatest Master',
    'specials.journey.ibn-arabi.description':
      'One master, in depth. Read Ibn Arabi himself, then the book that explains his idea of the unity of being, then the wider world of Sufi thought around him.',
    'specials.journey.ibn-arabi.level': 'Deep dive',
    'specials.journey.hidden-knowledge.title': 'The Hidden Knowledge Journey',
    'specials.journey.hidden-knowledge.subtitle': 'Secrets, symbols and wonders',
    'specials.journey.hidden-knowledge.description':
      'The side of the library other libraries do not have. Start with the great book of secrets, then the books of wonders, symbols, and the hidden history of orders and powers.',
    'specials.journey.hidden-knowledge.level': 'For the curious',
    'specials.journey.seerah-history.title': 'The Seerah & History Journey',
    'specials.journey.seerah-history.subtitle': 'From the Prophets to the historians',
    'specials.journey.seerah-history.description':
      'Read history the way the old scholars wrote it: the Prophets first, then the life of Muhammad (peace be upon him), then the caliphs, then the historians who tried to explain it all.',
    'specials.journey.seerah-history.level': 'History',
    'specials.journey.soul-afterlife.title': 'The Soul & Afterlife Journey',
    'specials.journey.soul-afterlife.subtitle': 'Death, Barzakh and what comes after',
    'specials.journey.soul-afterlife.description':
      'The questions everyone asks, in order. What is the soul? What happens after death? What are the signs before the end, and the great trials?',
    'specials.journey.soul-afterlife.level': 'Reflective',

    // ---- Wisdom of the Day entries (index matches WISDOMS order) ----
    'specials.wisdom.0.teaching':
      'Learn before you act: knowledge is the light that keeps worship and daily life on the right road.',
    'specials.wisdom.0.about': 'From the Ihya Ulum al-Din — knowledge comes first.',
    'specials.wisdom.1.teaching':
      'The seeker travels inward: the road to God is walked through the heart, not only with the feet.',
    'specials.wisdom.1.about': 'Ibn Arabi on the inner journey.',
    'specials.wisdom.2.teaching':
      'Do not settle for hearing about the truth — the birds in the story had to fly the road themselves.',
    'specials.wisdom.2.about': 'Attar: the search is the teaching.',
    'specials.wisdom.3.teaching':
      'The soul is a traveller: this world is one stop on its journey, not its home.',
    'specials.wisdom.3.about': 'Ibn al-Qayyim on the soul after death.',
    'specials.wisdom.4.teaching':
      'History repeats its patterns: empires rise when people hold together, and fall when they let go.',
    'specials.wisdom.4.about': 'Ibn Khaldun on why civilisations rise and fall.',
    'specials.wisdom.5.teaching':
      'The stories of the Prophets are not only history — they are lessons for anyone facing hardship today.',
    'specials.wisdom.5.about': 'Ibn Kathir: the Prophets as teachers.',
    'specials.wisdom.6.teaching':
      'Love turns the heart toward what it seeks; the Masnavi teaches through stories, not lectures.',
    'specials.wisdom.6.about': 'Rumi on love and the path.',

    // ---- Shared UI: toast / confirm / breadcrumbs / search ----
    'ui.toast.close': 'Close notification',
    'ui.confirm.confirmDefault': 'Confirm',
    'ui.confirm.cancelDefault': 'Cancel',
    'ui.confirm.closeModal': 'Close modal',
    'ui.confirm.deleting': 'Deleting...',
    'ui.breadcrumb.label': 'Breadcrumb',
    'ui.search.clearQuery': 'Clear query',
    'ui.search.queryButton': 'Query',
    'ui.search.placeholderDefault': 'Execute search command...',
    'ui.search.matches': 'QUERY_MATCHES ({n})',
    'ui.search.pressEnter': '[ PRESS_ENTER ]',
    'ui.search.noMatches': '[ NO_QUERY_MATCHES_FOUND ]',
    'ui.search.byAuthor': 'BY {author}',

    // ---- Shared UI: item details modal ----
    'ui.details.folderTitle': 'Folder Details',
    'ui.details.fileTitle': 'File Details',
    'ui.details.description': 'Description',
    'ui.details.contents': 'Contents',
    'ui.details.location': 'Location',
    'ui.details.created': 'Created',
    'ui.details.close': 'Close',
    'ui.details.closeDetails': 'Close Details',
    'ui.details.openFolder': 'Open Folder',
    'ui.details.author': 'Author / Creator',
    'ui.details.size': 'Size / Length',
    'ui.details.dateAdded': 'Date Added',
    'ui.details.download': 'Download',
    'ui.details.downloadDirect': 'Download file directly',
    'ui.details.openItem': 'Open Item',
    'ui.details.addFavorite': 'Add to favorites',
    'ui.details.removeFavorite': 'Remove from favorites',
    'ui.details.itemsOne': '{n} item',
    'ui.details.itemsMany': '{n} items',
    'ui.details.standardFile': 'Standard file',
    'ui.details.rootLibrary': 'Root Library',
    'ui.details.libraryRoot': 'Ilm-e-Ghayb Library (Root)',
    'ui.details.nameLabel': 'Name: {name}',

    // ---- Shared UI: reader advisory ----
    'ui.advisory.title': 'Reader Advisory',
    'ui.advisory.subtitle': 'Important Library Guidance & Notice',
    'ui.advisory.openingLabel': 'Opening:',
    'ui.advisory.body1':
      'Some materials in Ilm-e-Ghayb Library may contain descriptions of occult or magical practices, superstition, adult/erotic themes, violence, or other sensitive historical and literary material.',
    'ui.advisory.body2':
      'These materials are provided for reading, study, research, and historical understanding only.',
    'ui.advisory.warning':
      'Please do not practice, perform, imitate, or reproduce any harmful, occult, magical, erotic, or otherwise dangerous practices described in a text.',
    'ui.advisory.body3':
      'Read responsibly, use your judgment, and leave the material if it makes you uncomfortable.',
    'ui.advisory.bannerBody':
      'Some texts in Ilm-e-Ghayb Library may contain descriptions of sensitive historical, literary, or spiritual material provided for research and study only.',
    'ui.advisory.acknowledged': 'Session Acknowledged',
    'ui.advisory.readFull': 'Read Full Advisory',
    'ui.advisory.understand': 'I Understand',
    'ui.advisory.understandOpen': 'I Understand, Open File',

    // ---- Shared UI: theme toggle ----
    'ui.theme.toggle': 'Toggle visual theme',
  },
  hi: {
    // ---- Shared: logo alt text ----
    'home.logoAlt': 'Ilm-e-Ghayb Library ka logo',
    'home.logoAltLong': 'Ilm-e-Ghayb Library ka logo — halftone sunehra mehrab darwaza aur geometric sitara',
    'home.nav.instagramFollow': 'Instagram par @ghayb.chronicles ko follow karein',

    // ---- Home hero ----
    'home.hero.eyebrow': 'Islami tareekh aur hikmat',
    'home.hero.tagline': 'Chhupe hue ilm ki free library',
    'home.hero.intro1':
      'Chhupa hua ilm, Sufi hikmat, aur unke peeche ki kitabein: Quran (Musalmanon ki muqaddas kitab), Tafseer (Quran ki tafseel), Hadith (Nabi ki baatein), Seerah (Nabi ki zindagi), aur tareekh. Har entry mein uska source likha hai.',
    'home.hero.intro2': 'Yahan sab ka swagat hai. Padhne aur seekhne ke liye Musalman hona zaroori nahi hai.',
    'home.hero.browse': 'Library dekhein',
    'home.hero.follow': '@ghayb.chronicles ko follow karein',
    'home.hero.statCategories': 'Categories',
    'home.hero.searchPlaceholder': 'Kitabein dhoondhein: “Sufi”, “Tafsir”, “Ibn Kathir” ya “notes” try karein…',
    'home.hero.searchAria': 'Kitab ka naam, lekhak ya topic se dhoondhein',
    'home.hero.searchButton': 'Dhoondhein',

    // ---- Home: Continue Reading ----
    'home.continue.title': 'Padhna jaari rakhein',
    'home.continue.viewHistory': 'History dekhein',
    'home.continue.progress': 'Progress',
    'home.continue.pageOf': 'page {page} of {total}',
    'home.continue.pageOnly': 'page {page}',
    'home.continue.bookmarksOne': '{n} bookmark',
    'home.continue.bookmarksMany': '{n} bookmark',

    // ---- Home: Tools ----
    'home.tools.title': 'Tools',
    'home.tools.blurb':
      'Yeh library ke liye khaas banaye gaye hain. Aapki shelf, kitab dhoondhne wala, magic square maker, aur al-Buni ki kitabon se amal.',
    'home.tools.shelfBlurb': 'Kitabein status ke saath save karein — To Read, Reading, Finished.',
    'home.tools.findTitle': 'Meri Agli Kitab Dhoondhein',
    'home.tools.findBlurb': 'Teen chhote sawaal, aapke mood ke liye teen asli kitabein.',
    'home.tools.squareBlurb':
      '3×3, 4×4, 5×5 ya 7×7 ka magic number square banayein. Phir check karein ki har line ka jod barabar hai.',
    'home.tools.amalsTitle': 'al-Buni se Amal',
    'home.tools.amalsBlurb': 'Shams al-Ma\'arif se 25 aasan amal. Poori detail dekhne ke liye ek par tap karein.',

    // ---- Home: Topic of the Day ----
    'home.topic.label': 'Aaj ka Topic · Din {day} · {date}',
    'home.topic.readToday': 'Aaj ka topic padhein',
    'home.topic.allTopics': 'Saare topics',

    // ---- Home: Reading Paths ----
    'home.journey.subtitle': 'Kitabon se hokar ek raasta, tarteeb se, aur aapki jagah save rehti hai.',
    'home.journey.allJourneys': 'Saari journeys',
    'home.journey.booksCount': '{n} kitabein',
    'home.journey.readCount': '{total} mein se {done} padhe',
    'home.journey.knowledgeMap': 'Ya Knowledge Map dekhein. Ismein saare buzurg waqt ke hisab se hain',

    // ---- Home: Browse by Category ----
    'home.category.title': 'Category se dekhein',
    'home.category.subtitle': 'Topic aur category se dekhein — folder se nahi. Kitabein dekhne ke liye card par tap karein.',
    'home.category.allBooks': 'Saari Kitabein',
    'home.category.allBooksBlurb':
      'Library ki har kitab, ek hi jagah. Filter ke liye category chip dabayein, kholne ke liye kitab par tap karein. Folder khodne ki zaroorat nahi.',
    'home.category.bookCountOne': '{n} kitab',
    'home.category.bookCountMany': '{n} kitabein',
    'home.category.booksFallback': 'Is category ki kitabein.',
    'home.category.viewAll': '{n} categories dekhein',

    // ---- Home: channel behind the library ----
    'home.channel.titleA': 'Library ke peeche ka',
    'home.channel.titleB': 'channel',
    'home.channel.intro':
      'Ghayb Chronicles Islami tareekh aur hikmat ka channel hai — Sufism (Islam ka roohani pehlu), chhupa hua ilm, aur unke peeche ki purani kitabein. Har reel aur post asli sources se banti hai, har entry mein source likha hota hai, taaki aap khud check kar sakein, sirf hamari baat maan kar nahi.',
    'home.channel.sufiTitle': 'Sufism — roohani raasta',
    'home.channel.sufiBlurb':
      'Sufism Islam ka roohani pehlu hai. Ibn Arabi, Rumi, Attar aur Ghazali — unke khayal, aasan lafzon mein.',
    'home.channel.sourcesTitle': 'Har entry mein source',
    'home.channel.sourcesBlurb':
      'Tareekh, deeni taleem, adabi kahaniyan aur nazariye alag-alag rakhe gaye hain — aur har ek ka source diya gaya hai.',
    'home.channel.connectTitle': 'Library kaise judti hai',
    'home.channel.connectBlurb':
      'Channel mein jin kitabon ka zikr hota hai, woh yahin hain. Kisi bhi reel ke peeche ki poori kitab padhein, follow ke baad free.',
    'home.channel.readBooks': 'Kitabein padhein',

    // ---- Home: Catalog Highlights ----
    'home.highlights.title': 'Khaas Kitabein',
    'home.highlights.subtitle': 'Shuru karne ke liye kuch kitabein.',
    'home.highlights.pages': '{n} pages',
    'home.highlights.document': 'Document',

    // ---- Home: bottom banner ----
    'home.bottom.question': 'Topic ya category se kitab dhoondh rahe hain, search aur filter ke saath?',
    'home.bottom.explore': 'Saari kitabein dekhein',

    // ---- Home sky cards ----
    'home.sky.aria': 'Abhi ka aasmaan',
    'home.sky.today': 'Aaj',
    'home.sky.seeToday': 'Aaj ka dekhein',
    'home.sky.planetaryHour': 'Abhi ka Planetary Hour',
    'home.sky.day': 'din',
    'home.sky.night': 'raat',
    'home.sky.hourOf': '24 ghanton mein {n}wa ghanta, {dayNight}',
    'home.sky.approxNote':
      'Yeh andaze se hai, asli ghante nahi. Asli ghante ke liye Planetary Hours mein apni jagah set karein.',
    'home.sky.noHours':
      'Is jagah aur din ke liye suraj nikalne ya doobne ka waqt nahi nikala ja saka, isliye ghanta nahi bataya ja sakta.',
    'home.sky.seeHours': 'Ghante dekhein',
    'home.sky.moon': 'Chaand',
    'home.sky.moonLit': '{n}% roshan · Chaand ke mahine ka {day}wa din',
    'home.sky.seeMoon': 'Chaand dekhein',
    'home.sky.mansion': 'Abhi ki Lunar Mansion',
    'home.sky.mansionOf': '28 mein se {n}wi manzil · {from}° se {to}°',
    'home.sky.mansionNote': '0° al-Sharatayn se 28 barabar hisse, yeh ek tay shuda tareeka hai.',
    'home.sky.seeMansions': 'Manzilein dekhein',
    'home.sky.phase.newMoon': 'Naya chaand',
    'home.sky.phase.waxingCrescent': 'Badhata hua chaand',
    'home.sky.phase.firstQuarter': 'Pehla Quarter',
    'home.sky.phase.waxingGibbous': 'Badh raha chaand, poore ke kareeb',
    'home.sky.phase.fullMoon': 'Poora chaand',
    'home.sky.phase.waningGibbous': 'Ghat raha chaand, poore ke kareeb',
    'home.sky.phase.lastQuarter': 'Aakhri Quarter',
    'home.sky.phase.waningCrescent': 'Ghat-ta hua chaand',

    // ---- Home reckon box ----
    'home.reckon.label': 'Naam ka hisab karein',
    'home.reckon.title': 'Ek naam ki keemat number mein kya hai?',
    'home.reckon.intro':
      'Arabic mein naam likhein. Uske harf abjad system se gine jayenge, likhte hi, live.',
    'home.reckon.inputAria': 'Keemat jaanne ke liye Arabic mein naam likhein',
    'home.reckon.valueLabel': 'Keemat, Kabir Mashriqi',
    'home.reckon.noLetters': 'Is text mein koi Arabic harf nahi mila.',
    'home.reckon.emptyHint': 'Keemat dekhne ke liye Arabic mein naam likhein.',
    'home.reckon.note': 'Kabir keemat, Mashriqi school. Baaki system aur school Huruf tool mein hain.',
    'home.reckon.openHuruf': 'Huruf tool kholein',

    // ---- Hijri date chip ----
    'home.hijri.approx': '(andaze se)',
    'home.hijri.tooltip':
      '{date}. Yeh hisab se nikali hui Islami tareekh hai, andaze se — chaand dekhne wali tareekh se ek-do din ka farq ho sakta hai.',

    // ---- Wisdom of the Day ----
    'home.wisdom.title': 'Aaj ki Hikmat',
    'home.wisdom.teachingOf': '{master} ki ek seekh. {about}',
    'home.wisdom.readSource': 'Source padhein: {title}',

    // ---- Reading Stats ----
    'home.stats.title': 'Aapke Padhne ke Stats',
    'home.stats.subtitle': 'Sirf is device par. Aapki shelf, aapki progress, aapki streak.',
    'home.stats.finished': 'Poori ki',
    'home.stats.readingNow': 'Abhi padh rahe',
    'home.stats.onShelf': 'Meri Shelf par',
    'home.stats.journeySteps': 'Journey ke step poore',
    'home.stats.bookmarks': 'Bookmarks',
    'home.stats.streak': 'Lagatar din',

    // ---- Surprise Me / random book ----
    'home.random.empty': 'Library mein abhi koi kitab nahi hai.',
    'home.random.tag': 'Surprise Me. Ek random kitab',
    'home.random.another': 'Ek aur',
    'home.random.fallbackDesc': 'Library se random chuni hui ek kitab.',
    'home.random.open': 'Yeh kitab kholein',
    'home.random.onShelf': 'Meri Shelf par hai',
    'home.random.saveShelf': 'Meri Shelf mein save karein',
    'home.random.favorited': 'Favorite mein hai',
    'home.random.favorite': 'Favorite karein',

    // ---- Greeting ----
    'greeting.morning': 'Subah bakhair',
    'greeting.afternoon': 'Dopahar bakhair',
    'greeting.evening': 'Shaam bakhair',

    // ---- Info page ----
    'info.tag': 'About aur Creator',
    'info.intro':
      'Purani aur ahem kitabon ki free library. Ismein Quran, Nabi ki zindagi, Sufism, tareekh aur bahut kuch hai. Padhne ke liye sab ka swagat hai.',
    'info.creatorTitle': 'Creator ki Pehchan',
    'info.creatorTagline': 'Islami tareekh aur hikmat • Sufism aur chhupa hua ilm, art ke saath',
    'info.publicIdentity': 'Public Pehchan',
    'info.basedIn': 'Rehte hain',
    'info.configurable': 'Baad mein set hoga',
    'info.aboutTitle': 'Ilm-e-Ghayb Library ke baare mein',
    'info.about1':
      'Ilm-e-Ghayb Library, Ghayb Chronicles ki taraf se, chhupe hue ilm aur Sufi hikmat ki free library hai (Sufism Islam ka roohani pehlu hai), aur unke peeche ki kitabein bhi yahin hain.',
    'info.about2':
      'Ismein Islami ilm hai: Quran, Sunnah (Nabi ki zindagi ka tareeka), roohaniyat, tareekh aur falsafa. Har entry mein uska source likha hai, taaki aap khud check kar sakein.',
    'info.authenticTitle': 'Yahan “Authentic” ka matlab kya hai?',
    'info.authentic1':
      'Jis kitab par Authentic likha hai, use library admin ne check kiya hai aur woh usi kitab ka asli, bina badla hua text hai. Naqli, badli hui ya galat naam wali copy nahi hai.',
    'info.authentic2':
      'Yeh admin ki apni jaanch hai, koi badi degree ya certificate nahi. Jis kitab par yeh nishan nahi hai, use bas abhi tak check nahi kiya gaya — iska matlab yeh nahi ki woh naqli hai. Library page se aap sirf Authentic kitabein filter karke dekh sakte hain.',
    'info.authentic3':
      'Ek hi naam ki kitabein version ke roop mein dikhayi jati hain. Version 1 sabse purani copy hai, Version 2 uske baad ki. Har ek par uski asli tareekh likhi hai, taaki aap jaan sakein kaunsi copy khol rahe hain. Agar do copy ka naam ek jaisa ho, to chunne se pehle tareekh, lekhak aur edition dekh lein.',
    'info.creatorNoteTitle': 'Creator ka Note',
    'info.creatorNoteQuote':
      'Kuch ilm har jagah hai.\nKuch ilm chhupa hua hai.\nYeh dono ko dhoondhne ki jagah hai.',
    'info.connectTitle': 'Judein',
    'info.connectText': 'Koi sawaal hai, ya koi kitab sujhani hai? Yahan message karein:',
    'info.telegramToBeAdded': 'Jald aayega',
    'info.explore': 'Library ghumein',

    // ---- Journeys ----
    'specials.journey.seekers-path.title': 'Talib ka Raasta',
    'specials.journey.seekers-path.subtitle': 'Sufism, kadam dar kadam',
    'specials.journey.seekers-path.description':
      'Pehle ilm aur aqeedah, phir Sufi raasta: buzurgon ne kya sikhaya, dil ka safar kaisa hota hai, aur woh kahaniyan jo raaste ko aage le jati hain.',
    'specials.journey.seekers-path.level': 'Yahin se shuru karein',
    'specials.journey.ibn-arabi.title': 'Ibn Arabi ka Safar',
    'specials.journey.ibn-arabi.subtitle': 'Sabse Bade Ustad',
    'specials.journey.ibn-arabi.description':
      'Ek hi buzurg, gehrai se. Pehle Ibn Arabi ko khud padhein, phir woh kitab jo unke wahdat al-wujud ke khayal ko samjhati hai, phir unke aas-paas ki Sufi duniya.',
    'specials.journey.ibn-arabi.level': 'Gehrai mein',
    'specials.journey.hidden-knowledge.title': 'Chhupe Hue Ilm ka Safar',
    'specials.journey.hidden-knowledge.subtitle': 'Raaz, nishaniyan aur ajaib',
    'specials.journey.hidden-knowledge.description':
      'Library ka woh pehlu jo doosri library mein nahi milta. Raazon ki badi kitab se shuru karein, phir ajaib, nishaniyon aur chhupe hue itihas ki kitabein.',
    'specials.journey.hidden-knowledge.level': 'Jigyasu logon ke liye',
    'specials.journey.seerah-history.title': 'Seerah aur Tareekh ka Safar',
    'specials.journey.seerah-history.subtitle': 'Nabiyon se lekar itihaskaron tak',
    'specials.journey.seerah-history.description':
      'Tareekh ko waise padhein jaise purane aalim likhte the: pehle Nabi, phir Muhammad (peace be upon him) ki zindagi, phir khalifa, phir woh itihaskar jinhone sab samjhane ki koshish ki.',
    'specials.journey.seerah-history.level': 'Tareekh',
    'specials.journey.soul-afterlife.title': 'Rooh aur Aakhirat ka Safar',
    'specials.journey.soul-afterlife.subtitle': 'Maut, Barzakh aur uske baad kya hai',
    'specials.journey.soul-afterlife.description':
      'Woh sawaal jo sab poochte hain, tarteeb se. Rooh kya hai? Maut ke baad kya hota hai? Ant se pehle ke nishan kya hain, aur bade imtihan kaunse hain?',
    'specials.journey.soul-afterlife.level': 'Sochne wala',

    // ---- Wisdom of the Day entries ----
    'specials.wisdom.0.teaching':
      'Amal se pehle seekhein: ilm woh roshni hai jo ibadat aur roz ki zindagi ko sahi raaste par rakhti hai.',
    'specials.wisdom.0.about': 'Ihya Ulum al-Din se — pehle ilm aata hai.',
    'specials.wisdom.1.teaching':
      'Talib andar ki taraf safar karta hai: Khuda tak ka raasta dil se tay hota hai, sirf pairon se nahi.',
    'specials.wisdom.1.about': 'Ibn Arabi: andar ka safar.',
    'specials.wisdom.2.teaching':
      'Sach sun lene se kaam nahi chalta — kahani ke parindon ko raasta khud udna pada tha.',
    'specials.wisdom.2.about': 'Attar: khoj hi seekh hai.',
    'specials.wisdom.3.teaching':
      'Rooh ek musafir hai: yeh duniya uske safar ka ek padaav hai, uska ghar nahi.',
    'specials.wisdom.3.about': 'Ibn al-Qayyim: maut ke baad rooh.',
    'specials.wisdom.4.teaching':
      'Tareekh apne pattern dohrati hai: saltanatein tab uthti hain jab log ek saath rehte hain, aur tab girti hain jab saath chhoot jata hai.',
    'specials.wisdom.4.about': 'Ibn Khaldun: tehzeebein kyun uthti aur girti hain.',
    'specials.wisdom.5.teaching':
      'Nabiyon ki kahaniyan sirf tareekh nahi hain — aaj mushkil mein pade har shakhs ke liye unmein sabak hai.',
    'specials.wisdom.5.about': 'Ibn Kathir: Nabi, ustad ke roop mein.',
    'specials.wisdom.6.teaching':
      'Mohabbat dil ko usi taraf mod deti hai jise woh chahta hai; Masnavi lecture se nahi, kahaniyon se sikhati hai.',
    'specials.wisdom.6.about': 'Rumi: mohabbat aur raasta.',

    // ---- Shared UI: toast / confirm / breadcrumbs / search ----
    'ui.toast.close': 'Notification band karein',
    'ui.confirm.confirmDefault': 'Confirm karein',
    'ui.confirm.cancelDefault': 'Cancel karein',
    'ui.confirm.closeModal': 'Modal band karein',
    'ui.confirm.deleting': 'Delete ho raha hai…',
    'ui.breadcrumb.label': 'Rasta',
    'ui.search.clearQuery': 'Khoj saaf karein',
    'ui.search.queryButton': 'Khoj',
    'ui.search.placeholderDefault': 'Search command chalaiyein...',
    'ui.search.matches': 'MATCH MIL GAYE ({n})',
    'ui.search.pressEnter': '[ ENTER DABAYEIN ]',
    'ui.search.noMatches': '[ KOI MATCH NAHI MILA ]',
    'ui.search.byAuthor': 'BY {author}',

    // ---- Shared UI: item details modal ----
    'ui.details.folderTitle': 'Folder ki Details',
    'ui.details.fileTitle': 'File ki Details',
    'ui.details.description': 'Tafseel',
    'ui.details.contents': 'Andar kya hai',
    'ui.details.location': 'Jagah',
    'ui.details.created': 'Banaya gaya',
    'ui.details.close': 'Band karein',
    'ui.details.closeDetails': 'Details band karein',
    'ui.details.openFolder': 'Folder kholein',
    'ui.details.author': 'Lekhak / Creator',
    'ui.details.size': 'Size / Lambai',
    'ui.details.dateAdded': 'Kab add hua',
    'ui.details.download': 'Download karein',
    'ui.details.downloadDirect': 'File seedha download karein',
    'ui.details.openItem': 'Item kholein',
    'ui.details.addFavorite': 'Favorites mein add karein',
    'ui.details.removeFavorite': 'Favorites se hatayein',
    'ui.details.itemsOne': '{n} item',
    'ui.details.itemsMany': '{n} items',
    'ui.details.standardFile': 'Standard file',
    'ui.details.rootLibrary': 'Root Library',
    'ui.details.libraryRoot': 'Ilm-e-Ghayb Library (Root)',
    'ui.details.nameLabel': 'Naam: {name}',

    // ---- Shared UI: reader advisory ----
    'ui.advisory.title': 'Padhne Wale ke Liye Suchna',
    'ui.advisory.subtitle': 'Library ki ahem hidayat aur suchna',
    'ui.advisory.openingLabel': 'Khol rahe hain:',
    'ui.advisory.body1':
      'Ilm-e-Ghayb Library ki kuch kitabon mein jaadu-tona ya occult tareekon, andhvishwas, bade logon wale (adult/erotic) vishay, hinsa, ya doosri nazuk tareekhi aur adabi cheezon ka zikr ho sakta hai.',
    'ui.advisory.body2':
      'Yeh cheezein sirf padhne, seekhne, research aur tareekh samajhne ke liye di gayi hain.',
    'ui.advisory.warning':
      'Kisi bhi kitab mein likhe nuksan deh, occult, jaadui, erotic ya khatarnak tareekon ko na aazmayein, na karein, na unki naqal karein.',
    'ui.advisory.body3':
      'Zimmedari se padhein, apni samajh se kaam lein, aur agar koi cheez aapko pareshan kare to use chhod dein.',
    'ui.advisory.bannerBody':
      'Ilm-e-Ghayb Library ki kuch kitabon mein nazuk tareekhi, adabi ya roohani cheezon ka zikr ho sakta hai, jo sirf research aur padhai ke liye hain.',
    'ui.advisory.acknowledged': 'Is session mein maan liya',
    'ui.advisory.readFull': 'Poori Advisory padhein',
    'ui.advisory.understand': 'Samajh gaya',
    'ui.advisory.understandOpen': 'Samajh gaya, File kholein',

    // ---- Shared UI: theme toggle ----
    'ui.theme.toggle': 'Theme badlein',
  },
  bn: {
    // ---- Shared: logo alt text ----
    'home.logoAlt': 'ইলমে গায়েব লাইব্রেরির লোগো',
    'home.logoAltLong': 'ইলমে গায়েব লাইব্রেরির লোগো — হাফটোন সোনালি খিলান দরজা ও জ্যামিতিক তারা',
    'home.nav.instagramFollow': 'ইনস্টাগ্রামে @ghayb.chronicles কে ফলো করুন',

    // ---- Home hero ----
    'home.hero.eyebrow': 'ইসলামি ইতিহাস ও জ্ঞান',
    'home.hero.tagline': 'লুকানো জ্ঞানের ফ্রি লাইব্রেরি',
    'home.hero.intro1':
      'লুকানো জ্ঞান, সুফি প্রজ্ঞা, আর তার পেছনের বইগুলো: কুরআন (মুসলমানদের পবিত্র গ্রন্থ), তাফসির (কুরআনের ব্যাখ্যা), হাদিস (নবীর কথা), সিরাত (নবীর জীবন), আর ইতিহাস। প্রতিটি লেখায় তার উৎস দেওয়া আছে।',
    'home.hero.intro2': 'এখানে সবাইকে স্বাগতম। পড়তে ও শিখতে মুসলমান হওয়ার দরকার নেই।',
    'home.hero.browse': 'লাইব্রেরি দেখুন',
    'home.hero.follow': '@ghayb.chronicles কে ফলো করুন',
    'home.hero.statCategories': 'ক্যাটাগরি',
    'home.hero.searchPlaceholder': 'বই খুঁজুন: “Sufi”, “Tafsir”, “Ibn Kathir” বা “notes” লিখে দেখুন…',
    'home.hero.searchAria': 'বইয়ের নাম, লেখক বা টপিক দিয়ে খুঁজুন',
    'home.hero.searchButton': 'খুঁজুন',

    // ---- Home: Continue Reading ----
    'home.continue.title': 'পড়া চালিয়ে যান',
    'home.continue.viewHistory': 'ইতিহাস দেখুন',
    'home.continue.progress': 'কতটা পড়া হয়েছে',
    'home.continue.pageOf': 'পৃষ্ঠা {page} / {total}',
    'home.continue.pageOnly': 'পৃষ্ঠা {page}',
    'home.continue.bookmarksOne': '{n}টি বুকমার্ক',
    'home.continue.bookmarksMany': '{n}টি বুকমার্ক',

    // ---- Home: Tools ----
    'home.tools.title': 'টুলস',
    'home.tools.blurb':
      'এই লাইব্রেরির জন্যই বানানো। আপনার শেলফ, বই খোঁজার টুল, ম্যাজিক স্কয়ার মেকার, আর আল-বুনির বই থেকে আমল।',
    'home.tools.shelfBlurb': 'স্ট্যাটাস দিয়ে বই সেভ করুন — To Read, Reading, Finished।',
    'home.tools.findTitle': 'আমার পরের বইটি খুঁজুন',
    'home.tools.findBlurb': 'তিনটি ছোট প্রশ্ন, আপনার মনের মতো তিনটি আসল বই।',
    'home.tools.squareBlurb':
      '3×3, 4×4, 5×5 বা 7×7 ম্যাজিক সংখ্যার বর্গ বানান। তারপর দেখুন প্রতিটি লাইনের যোগফল মিলছে কি না।',
    'home.tools.amalsTitle': 'আল-বুনির আমল',
    'home.tools.amalsBlurb': 'Shams al-Ma\'arif থেকে 25টি সহজ আমল। পুরো বিবরণ দেখতে একটিতে ট্যাপ করুন।',

    // ---- Home: Topic of the Day ----
    'home.topic.label': 'আজকের টপিক · দিন {day} · {date}',
    'home.topic.readToday': 'আজকের টপিকটি পড়ুন',
    'home.topic.allTopics': 'সব টপিক',

    // ---- Home: Reading Paths ----
    'home.journey.subtitle': 'বইয়ের মধ্য দিয়ে একটি পথ, ক্রমানুসারে, আর আপনার জায়গা সেভ করা থাকে।',
    'home.journey.allJourneys': 'সব জার্নি',
    'home.journey.booksCount': '{n}টি বই',
    'home.journey.readCount': '{total}টির মধ্যে {done}টি পড়া হয়েছে',
    'home.journey.knowledgeMap': 'অথবা Knowledge Map দেখুন। এতে সব বুজুর্গ সময়ের ক্রমে আছেন',

    // ---- Home: Browse by Category ----
    'home.category.title': 'ক্যাটাগরি দিয়ে দেখুন',
    'home.category.subtitle': 'টপিক আর ক্যাটাগরি দিয়ে দেখুন — ফোল্ডার দিয়ে নয়। বই দেখতে কার্ডে ট্যাপ করুন।',
    'home.category.allBooks': 'সব বই',
    'home.category.allBooksBlurb':
      'লাইব্রেরির সব বই, এক জায়গায়। ফিল্টার করতে ক্যাটাগরি চিপ চাপুন, খুলতে বইয়ে ট্যাপ করুন। ফোল্ডার খুঁজতে হবে না।',
    'home.category.bookCountOne': '{n}টি বই',
    'home.category.bookCountMany': '{n}টি বই',
    'home.category.booksFallback': 'এই ক্যাটাগরির বই।',
    'home.category.viewAll': '{n}টি ক্যাটাগরি দেখুন',

    // ---- Home: channel behind the library ----
    'home.channel.titleA': 'লাইব্রেরির পেছনের',
    'home.channel.titleB': 'চ্যানেল',
    'home.channel.intro':
      'Ghayb Chronicles ইসলামি ইতিহাস ও জ্ঞানের চ্যানেল — সুফিবাদ (ইসলামের আধ্যাত্মিক দিক), লুকানো জ্ঞান, আর তার পেছনের পুরনো বই। প্রতিটি রিল ও পোস্ট আসল উৎস থেকে বানানো হয়, প্রতিটি লেখায় উৎস দেওয়া থাকে, যাতে আপনি নিজে যাচাই করতে পারেন, শুধু আমাদের কথা মেনে নয়।',
    'home.channel.sufiTitle': 'সুফিবাদ — আধ্যাত্মিক পথ',
    'home.channel.sufiBlurb':
      'সুফিবাদ ইসলামের আধ্যাত্মিক দিক। Ibn Arabi, Rumi, Attar আর Ghazali — তাঁদের ভাবনা, সহজ ভাষায়।',
    'home.channel.sourcesTitle': 'প্রতিটি লেখায় উৎস',
    'home.channel.sourcesBlurb':
      'ইতিহাস, ধর্মীয় শিক্ষা, সাহিত্যিক গল্প আর তত্ত্ব আলাদা রাখা হয়েছে — আর প্রতিটির উৎস দেওয়া আছে।',
    'home.channel.connectTitle': 'লাইব্রেরি কীভাবে যুক্ত',
    'home.channel.connectBlurb':
      'চ্যানেলে যে বইগুলোর কথা বলা হয়, সেগুলো এখানেই আছে। যেকোনো রিলের পেছনের পুরো বইটি পড়ুন, ফলোর পর ফ্রি।',
    'home.channel.readBooks': 'বইগুলো পড়ুন',

    // ---- Home: Catalog Highlights ----
    'home.highlights.title': 'বিশেষ বই',
    'home.highlights.subtitle': 'শুরু করার জন্য কিছু বই।',
    'home.highlights.pages': '{n} পৃষ্ঠা',
    'home.highlights.document': 'ডকুমেন্ট',

    // ---- Home: bottom banner ----
    'home.bottom.question': 'টপিক বা ক্যাটাগরি দিয়ে বই খুঁজছেন, সার্চ আর ফিল্টার সহ?',
    'home.bottom.explore': 'সব বই দেখুন',

    // ---- Home sky cards ----
    'home.sky.aria': 'এখনকার আকাশ',
    'home.sky.today': 'আজ',
    'home.sky.seeToday': 'আজকেরটা দেখুন',
    'home.sky.planetaryHour': 'এখনকার Planetary Hour',
    'home.sky.day': 'দিন',
    'home.sky.night': 'রাত',
    'home.sky.hourOf': '24 ঘণ্টার মধ্যে {n} নম্বর ঘণ্টা, {dayNight}',
    'home.sky.approxNote':
      'এটা আনুমানিক, আসল ঘণ্টা নয়। আসল ঘণ্টা পেতে Planetary Hours-এ আপনার জায়গা সেট করুন।',
    'home.sky.noHours':
      'এই জায়গা ও দিনের জন্য সূর্যোদয় বা সূর্যাস্ত বের করা যায়নি, তাই ঘণ্টা জানা যাচ্ছে না।',
    'home.sky.seeHours': 'ঘণ্টাগুলো দেখুন',
    'home.sky.moon': 'চাঁদ',
    'home.sky.moonLit': '{n}% আলোকিত · চাঁদের মাসের {day} নম্বর দিন',
    'home.sky.seeMoon': 'চাঁদ দেখুন',
    'home.sky.mansion': 'এখনকার Lunar Mansion',
    'home.sky.mansionOf': '28টির মধ্যে {n} নম্বর মঞ্জিল · {from}° থেকে {to}°',
    'home.sky.mansionNote': '0° al-Sharatayn থেকে 28টি সমান ভাগ, এটা একটা ঠিক করা নিয়ম।',
    'home.sky.seeMansions': 'মঞ্জিলগুলো দেখুন',
    'home.sky.phase.newMoon': 'নতুন চাঁদ',
    'home.sky.phase.waxingCrescent': 'বাড়ন্ত চাঁদ',
    'home.sky.phase.firstQuarter': 'প্রথম চতুর্থাংশ',
    'home.sky.phase.waxingGibbous': 'পূর্ণের কাছাকাছি বাড়ন্ত চাঁদ',
    'home.sky.phase.fullMoon': 'পূর্ণিমা',
    'home.sky.phase.waningGibbous': 'পূর্ণের কাছাকাছি কমন্ত চাঁদ',
    'home.sky.phase.lastQuarter': 'শেষ চতুর্থাংশ',
    'home.sky.phase.waningCrescent': 'কমন্ত চাঁদ',

    // ---- Home reckon box ----
    'home.reckon.label': 'নামের হিসাব করুন',
    'home.reckon.title': 'সংখ্যায় একটি নামের মূল্য কত?',
    'home.reckon.intro':
      'আরবিতে একটি নাম লিখুন। তার অক্ষরগুলো আবজাদ পদ্ধতিতে গোনা হবে, লিখতে লিখতেই।',
    'home.reckon.inputAria': 'মান জানতে আরবিতে নাম লিখুন',
    'home.reckon.valueLabel': 'মান, Kabir Mashriqi',
    'home.reckon.noLetters': 'এই লেখায় কোনো আরবি অক্ষর পাওয়া যায়নি।',
    'home.reckon.emptyHint': 'মান দেখতে আরবিতে নাম লিখুন।',
    'home.reckon.note': 'Kabir মান, Mashriqi ধারা। অন্য পদ্ধতি ও ধারা Huruf টুলে আছে।',
    'home.reckon.openHuruf': 'Huruf টুলটি খুলুন',

    // ---- Hijri date chip ----
    'home.hijri.approx': '(আনুমানিক)',
    'home.hijri.tooltip':
      '{date}। এটা হিসাব করে বের করা ইসলামি তারিখ, আনুমানিক — চাঁদ দেখার তারিখ থেকে এক-দুই দিনের পার্থক্য হতে পারে।',

    // ---- Wisdom of the Day ----
    'home.wisdom.title': 'আজকের হিকমত',
    'home.wisdom.teachingOf': '{master}-এর একটি শিক্ষা। {about}',
    'home.wisdom.readSource': 'উৎসটি পড়ুন: {title}',

    // ---- Reading Stats ----
    'home.stats.title': 'আপনার পড়ার হিসাব',
    'home.stats.subtitle': 'শুধু এই ডিভাইসে। আপনার শেলফ, আপনার অগ্রগতি, আপনার ধারাবাহিকতা।',
    'home.stats.finished': 'শেষ করা',
    'home.stats.readingNow': 'এখন পড়ছেন',
    'home.stats.onShelf': 'আমার শেলফে',
    'home.stats.journeySteps': 'জার্নির ধাপ শেষ',
    'home.stats.bookmarks': 'বুকমার্ক',
    'home.stats.streak': 'টানা দিন',

    // ---- Surprise Me / random book ----
    'home.random.empty': 'লাইব্রেরিতে এখনো কোনো বই নেই।',
    'home.random.tag': 'Surprise Me. একটি যেকোনো বই',
    'home.random.another': 'আরেকটি',
    'home.random.fallbackDesc': 'লাইব্রেরি থেকে যেকোনোভাবে বাছা একটি বই।',
    'home.random.open': 'এই বইটি খুলুন',
    'home.random.onShelf': 'আমার শেলফে আছে',
    'home.random.saveShelf': 'আমার শেলফে সেভ করুন',
    'home.random.favorited': 'পছন্দের তালিকায় আছে',
    'home.random.favorite': 'পছন্দ করুন',

    // ---- Greeting ----
    'greeting.morning': 'সুপ্রভাত',
    'greeting.afternoon': 'শুভ অপরাহ্ন',
    'greeting.evening': 'শুভ সন্ধ্যা',

    // ---- Info page ----
    'info.tag': 'পরিচিতি ও স্রষ্টা',
    'info.intro':
      'পুরনো ও গুরুত্বপূর্ণ বইয়ের ফ্রি লাইব্রেরি। এতে কুরআন, নবীর জীবন, সুফিবাদ, ইতিহাস আরও অনেক কিছু আছে। পড়তে সবাইকে স্বাগতম।',
    'info.creatorTitle': 'স্রষ্টার পরিচয়',
    'info.creatorTagline': 'ইসলামি ইতিহাস ও জ্ঞান • সুফিবাদ ও লুকানো জ্ঞান, শিল্পের মাধ্যমে',
    'info.publicIdentity': 'সবার কাছে পরিচয়',
    'info.basedIn': 'থাকেন',
    'info.configurable': 'পরে সেট করা হবে',
    'info.aboutTitle': 'ইলমে গায়েব লাইব্রেরি সম্পর্কে',
    'info.about1':
      'ইলমে গায়েব লাইব্রেরি, Ghayb Chronicles-এর তরফ থেকে, লুকানো জ্ঞান ও সুফি প্রজ্ঞার ফ্রি লাইব্রেরি (সুফিবাদ ইসলামের আধ্যাত্মিক দিক), আর তার পেছনের বইগুলোও এখানে আছে।',
    'info.about2':
      'এতে ইসলামি জ্ঞান আছে: কুরআন, সুন্নাহ (নবীর জীবনযাপনের পদ্ধতি), আধ্যাত্মিকতা, ইতিহাস ও দর্শন। প্রতিটি লেখায় তার উৎস দেওয়া আছে, যাতে আপনি নিজে যাচাই করতে পারেন।',
    'info.authenticTitle': 'এখানে “Authentic” মানে কী?',
    'info.authentic1':
      'যে বইয়ে Authentic লেখা আছে, লাইব্রেরির অ্যাডমিন সেটা যাচাই করেছেন এবং সেটা সেই বইয়ের আসল, অবিকৃত লেখা। নকল, বদলানো বা ভুল নামের কপি নয়।',
    'info.authentic2':
      'এটা অ্যাডমিনের নিজের যাচাই, কোনো পণ্ডিতের সার্টিফিকেট নয়। যে বইয়ে এই চিহ্ন নেই, সেটা এখনো যাচাই করা হয়নি — তার মানে এই নয় যে সেটা নকল। Library পাতা থেকে আপনি শুধু Authentic বই ফিল্টার করে দেখতে পারেন।',
    'info.authentic3':
      'একই নামের বইগুলো সংস্করণ হিসেবে দেখানো হয়। Version 1 সবচেয়ে পুরনো কপি, Version 2 তার পরেরটি। প্রতিটিতে তার আসল তারিখ দেওয়া আছে, যাতে বুঝতে পারেন কোন কপিটি খুলছেন। দুটি কপির নাম এক হলে, বেছে নেওয়ার আগে তারিখ, লেখক ও সংস্করণ দেখে নিন।',
    'info.creatorNoteTitle': 'স্রষ্টার কথা',
    'info.creatorNoteQuote':
      'কিছু জ্ঞান সব জায়গায় আছে।\nকিছু জ্ঞান লুকানো।\nএটা দুটোই খোঁজার জায়গা।',
    'info.connectTitle': 'যোগাযোগ করুন',
    'info.connectText': 'কোনো প্রশ্ন আছে, বা কোনো বইয়ের পরামর্শ দিতে চান? এখানে মেসেজ করুন:',
    'info.telegramToBeAdded': 'শীঘ্রই যোগ করা হবে',
    'info.explore': 'লাইব্রেরি ঘুরে দেখুন',

    // ---- Journeys ----
    'specials.journey.seekers-path.title': 'সন্ধানকারীর পথ',
    'specials.journey.seekers-path.subtitle': 'সুফিবাদ, ধাপে ধাপে',
    'specials.journey.seekers-path.description':
      'প্রথমে জ্ঞান ও বিশ্বাস, তারপর সুফি পথ: বুজুর্গরা কী শিখিয়েছেন, হৃদয়ের সফর কেমন হয়, আর সেই গল্পগুলো যা পথ দেখায়।',
    'specials.journey.seekers-path.level': 'এখান থেকে শুরু করুন',
    'specials.journey.ibn-arabi.title': 'Ibn Arabi-র সফর',
    'specials.journey.ibn-arabi.subtitle': 'সর্বশ্রেষ্ঠ গুরু',
    'specials.journey.ibn-arabi.description':
      'একজন বুজুর্গ, গভীরভাবে। প্রথমে Ibn Arabi-কে নিজে পড়ুন, তারপর সেই বই যা তাঁর অস্তিত্বের একত্বের ধারণা বোঝায়, তারপর তাঁর চারপাশের সুফি জগৎ।',
    'specials.journey.ibn-arabi.level': 'গভীরে যান',
    'specials.journey.hidden-knowledge.title': 'লুকানো জ্ঞানের সফর',
    'specials.journey.hidden-knowledge.subtitle': 'রহস্য, প্রতীক আর বিস্ময়',
    'specials.journey.hidden-knowledge.description':
      'লাইব্রেরির সেই দিক যা অন্য লাইব্রেরিতে নেই। রহস্যের বড় বই দিয়ে শুরু করুন, তারপর বিস্ময়, প্রতীক আর লুকানো ইতিহাসের বই।',
    'specials.journey.hidden-knowledge.level': 'কৌতূহলীদের জন্য',
    'specials.journey.seerah-history.title': 'সিরাত ও ইতিহাসের সফর',
    'specials.journey.seerah-history.subtitle': 'নবীদের থেকে ইতিহাসবিদদের পর্যন্ত',
    'specials.journey.seerah-history.description':
      'ইতিহাস পড়ুন সেভাবে যেভাবে পুরনো আলেমরা লিখতেন: প্রথমে নবীরা, তারপর Muhammad (peace be upon him)-এর জীবন, তারপর খলিফারা, তারপর সেই ইতিহাসবিদরা যারা সবকিছু বোঝার চেষ্টা করেছেন।',
    'specials.journey.seerah-history.level': 'ইতিহাস',
    'specials.journey.soul-afterlife.title': 'আত্মা ও পরকালের সফর',
    'specials.journey.soul-afterlife.subtitle': 'মৃত্যু, Barzakh আর তারপর কী আছে',
    'specials.journey.soul-afterlife.description':
      'যে প্রশ্নগুলো সবাই করে, ক্রমানুসারে। আত্মা কী? মৃত্যুর পর কী হয়? শেষের আগের লক্ষণগুলো কী, আর বড় পরীক্ষাগুলো কী?',
    'specials.journey.soul-afterlife.level': 'চিন্তাশীল',

    // ---- Wisdom of the Day entries ----
    'specials.wisdom.0.teaching':
      'কাজ করার আগে শিখুন: জ্ঞান সেই আলো যা ইবাদত ও দৈনন্দিন জীবনকে সঠিক পথে রাখে।',
    'specials.wisdom.0.about': 'Ihya Ulum al-Din থেকে — প্রথমে জ্ঞান আসে।',
    'specials.wisdom.1.teaching':
      'সন্ধানকারী ভেতরের দিকে সফর করে: আল্লাহর দিকে পথ হৃদয় দিয়ে চলা হয়, শুধু পা দিয়ে নয়।',
    'specials.wisdom.1.about': 'Ibn Arabi: ভেতরের সফর।',
    'specials.wisdom.2.teaching':
      'সত্যের কথা শুনলেই হয় না — গল্পের পাখিদের পথ নিজেদেরই উড়তে হয়েছিল।',
    'specials.wisdom.2.about': 'Attar: খোঁজই শিক্ষা।',
    'specials.wisdom.3.teaching':
      'আত্মা এক পথিক: এই দুনিয়া তার সফরের একটি বিরতি, তার বাড়ি নয়।',
    'specials.wisdom.3.about': 'Ibn al-Qayyim: মৃত্যুর পর আত্মা।',
    'specials.wisdom.4.teaching':
      'ইতিহাস তার ধারা পুনরাবৃত্তি করে: সাম্রাজ্য ওঠে যখন মানুষ একসাথে থাকে, আর পড়ে যখন তারা ছেড়ে দেয়।',
    'specials.wisdom.4.about': 'Ibn Khaldun: সভ্যতা কেন ওঠে আর পড়ে।',
    'specials.wisdom.5.teaching':
      'নবীদের গল্প শুধু ইতিহাস নয় — আজ কষ্টে থাকা প্রত্যেকের জন্য এতে শিক্ষা আছে।',
    'specials.wisdom.5.about': 'Ibn Kathir: নবীরা শিক্ষক হিসেবে।',
    'specials.wisdom.6.teaching':
      'ভালোবাসা হৃদয়কে তার দিকেই ফেরায় যা সে চায়; Masnavi বক্তৃতা দিয়ে নয়, গল্প দিয়ে শেখায়।',
    'specials.wisdom.6.about': 'Rumi: ভালোবাসা আর পথ।',

    // ---- Shared UI: toast / confirm / breadcrumbs / search ----
    'ui.toast.close': 'নোটিফিকেশন বন্ধ করুন',
    'ui.confirm.confirmDefault': 'নিশ্চিত করুন',
    'ui.confirm.cancelDefault': 'বাতিল করুন',
    'ui.confirm.closeModal': 'মডাল বন্ধ করুন',
    'ui.confirm.deleting': 'মুছে ফেলা হচ্ছে…',
    'ui.breadcrumb.label': 'পথনির্দেশ',
    'ui.search.clearQuery': 'খোঁজ মুছে ফেলুন',
    'ui.search.queryButton': 'খোঁজ',
    'ui.search.placeholderDefault': 'সার্চ কমান্ড চালান...',
    'ui.search.matches': 'মিলে গেছে ({n})',
    'ui.search.pressEnter': '[ ENTER চাপুন ]',
    'ui.search.noMatches': '[ কোনো মিল পাওয়া যায়নি ]',
    'ui.search.byAuthor': 'লেখক: {author}',

    // ---- Shared UI: item details modal ----
    'ui.details.folderTitle': 'ফোল্ডারের বিবরণ',
    'ui.details.fileTitle': 'ফাইলের বিবরণ',
    'ui.details.description': 'বিবরণ',
    'ui.details.contents': 'ভেতরে কী আছে',
    'ui.details.location': 'অবস্থান',
    'ui.details.created': 'তৈরি হয়েছে',
    'ui.details.close': 'বন্ধ করুন',
    'ui.details.closeDetails': 'বিবরণ বন্ধ করুন',
    'ui.details.openFolder': 'ফোল্ডার খুলুন',
    'ui.details.author': 'লেখক / স্রষ্টা',
    'ui.details.size': 'আকার / দৈর্ঘ্য',
    'ui.details.dateAdded': 'যোগ করার তারিখ',
    'ui.details.download': 'ডাউনলোড করুন',
    'ui.details.downloadDirect': 'ফাইলটি সরাসরি ডাউনলোড করুন',
    'ui.details.openItem': 'আইটেমটি খুলুন',
    'ui.details.addFavorite': 'পছন্দের তালিকায় যোগ করুন',
    'ui.details.removeFavorite': 'পছন্দের তালিকা থেকে সরান',
    'ui.details.itemsOne': '{n}টি আইটেম',
    'ui.details.itemsMany': '{n}টি আইটেম',
    'ui.details.standardFile': 'সাধারণ ফাইল',
    'ui.details.rootLibrary': 'মূল লাইব্রেরি',
    'ui.details.libraryRoot': 'ইলমে গায়েব লাইব্রেরি (মূল)',
    'ui.details.nameLabel': 'নাম: {name}',

    // ---- Shared UI: reader advisory ----
    'ui.advisory.title': 'পাঠকের জন্য সতর্কবার্তা',
    'ui.advisory.subtitle': 'লাইব্রেরির গুরুত্বপূর্ণ নির্দেশনা ও বিজ্ঞপ্তি',
    'ui.advisory.openingLabel': 'খুলছেন:',
    'ui.advisory.body1':
      'ইলমে গায়েব লাইব্রেরির কিছু বইয়ে জাদু-টোনা বা গুপ্তচর্চা, কুসংস্কার, প্রাপ্তবয়স্কদের বিষয়, সহিংসতা, বা অন্যান্য সংবেদনশীল ঐতিহাসিক ও সাহিত্যিক বিষয়ের বর্ণনা থাকতে পারে।',
    'ui.advisory.body2':
      'এই বিষয়গুলো শুধু পড়া, অধ্যয়ন, গবেষণা ও ইতিহাস বোঝার জন্য দেওয়া হয়েছে।',
    'ui.advisory.warning':
      'কোনো লেখায় বর্ণিত ক্ষতিকর, গুপ্ত, জাদুকরী, কামোদ্দীপক বা বিপজ্জনক চর্চা অনুশীলন, সম্পাদন, অনুকরণ বা পুনরুৎপাদন করবেন না।',
    'ui.advisory.body3':
      'দায়িত্ব নিয়ে পড়ুন, নিজের বিচারবুদ্ধি ব্যবহার করুন, আর কোনো বিষয় অস্বস্তিকর লাগলে সেটা ছেড়ে দিন।',
    'ui.advisory.bannerBody':
      'ইলমে গায়েব লাইব্রেরির কিছু লেখায় সংবেদনশীল ঐতিহাসিক, সাহিত্যিক বা আধ্যাত্মিক বিষয়ের বর্ণনা থাকতে পারে, যা শুধু গবেষণা ও পড়াশোনার জন্য।',
    'ui.advisory.acknowledged': 'এই সেশনে মেনে নেওয়া হয়েছে',
    'ui.advisory.readFull': 'পুরো সতর্কবার্তা পড়ুন',
    'ui.advisory.understand': 'বুঝেছি',
    'ui.advisory.understandOpen': 'বুঝেছি, ফাইল খুলুন',

    // ---- Shared UI: theme toggle ----
    'ui.theme.toggle': 'থিম বদলান',
  },
};
