/**
 * Study-tools strings in English, Hinglish and Bengali.
 *
 * English is the primary language and the default. Hinglish (Roman-script
 * Hindi/Urdu, in the channel's reel voice) and Bengali (easy familiar
 * words) are Settings-only options. Every Hinglish and Bengali line here
 * was written by hand and checked line by line. No machine translation.
 *
 * What NEVER changes with the language:
 * - Arabic text, transliteration, Quran quotes, Names, and @ghayb.chronicles
 * - numbers, sources (book + page), and facts
 * - the user's own notes, counts and saved items
 * Only the plain explanation words around them get translated.
 *
 * Key layout: `tools.*` is shared chrome (hub, layout, search,
 * disclaimer, shells), `tools.<slug>.*` is one tool page's own words,
 * `tools.data.*` is id-keyed data (tool titles/blurbs, topic groups,
 * the 99 Names' short meanings, figures, planets, signs, phases,
 * counting rules, and the fixed English strings that come back from
 * the utils at run time). Every key exists in all three languages.
 * `tTools` falls back to English, then to the key itself, so a missing
 * string can never crash a page.
 */
import type { SiteLanguage } from '../types';

export const I18N_TOOLS: Record<SiteLanguage, Record<string, string>> = {
  en: {
    // ---- Shared ----
    'tools.common.system': 'System',
    'tools.common.school': 'School',
    'tools.common.kabir': 'Kabir (large)',
    'tools.common.saghir': 'Saghir (small)',
    'tools.common.mashriqi': 'Mashriqi (eastern)',
    'tools.common.maghribi': 'Maghribi (western)',
    'tools.common.save': 'Save',
    'tools.common.savedToGrimoire': 'Saved to Grimoire',
    'tools.common.total': 'Total',
    'tools.common.grandTotal': 'Grand total',
    'tools.common.runningTotal': 'Running total',
    'tools.common.value': 'Value',
    'tools.common.letter': 'Letter',
    'tools.common.name': 'Name',
    'tools.common.word': 'Word',
    'tools.common.sayIt': 'Say it',
    'tools.common.search': 'Search',
    'tools.common.closeSearch': 'Close search',
    'tools.common.cancel': 'Cancel',
    'tools.common.add': 'Add',
    'tools.common.exportJson': 'Export JSON',
    'tools.common.importJson': 'Import JSON',
    'tools.common.copied': 'Copied',
    'tools.common.untitledNote': 'Untitled note',
    'tools.common.source': 'Source',
    'tools.common.sources': 'Sources',
    'tools.common.day': 'Day',
    'tools.common.night': 'Night',
    'tools.common.yes': 'yes',
    'tools.common.no': 'no',
    'tools.common.all': 'All',
    'tools.common.noMatchesFor': 'No matches for “{q}”.',
    'tools.common.importFail': 'That file could not be imported.',
    'tools.common.readFail': 'That file could not be read.',

    // ---- Hub ----
    'tools.hub.title': 'Study Tools',
    'tools.hub.eyebrow': 'The Study Tools',
    'tools.hub.subtitle':
      'Small tools for studying letters, numbers and your own reading notes. Nothing here promises an outcome — it is all for study.',
    'tools.hub.topicsTitle': 'Topics',

    // ---- Layout ----
    'tools.layout.back': 'Study Tools',
    'tools.layout.search': 'Search',
    'tools.layout.searchAria': 'Search tools (Ctrl+K)',
    'tools.layout.defaultEyebrow': 'Study Tools',

    // ---- Disclaimer ----
    'tools.disclaimer.text':
      'These tools are for study and calculation only. They do not promise any outcome, protection, healing or provision. Never use them to harm anyone.',
    'tools.disclaimer.link': 'How these tools work',

    // ---- Search overlay ----
    'tools.search.placeholder': 'Search tools, topics and the 99 Names…',
    'tools.search.aria': 'Search tools, topics and the 99 Names',
    'tools.search.dialogLabel': 'Search study tools',
    'tools.search.hint': 'Try “letters”, “counter”, “notes”, “Malakut”, or a Name such as “Rahman”.',

    // ---- Shell / FilledToolPage ----
    'tools.shell.emptyTitle': 'Nothing here yet',
    'tools.shell.emptyMessage':
      'Nothing here yet — entries are added only from material supplied with a source, page, and permission note.',
    'tools.shell.aria.figureEntries': 'Figure entries',
    'tools.shell.aria.formEntries': 'Form entries',
    'tools.shell.aria.sealEntries': 'Seal entries',
    'tools.shell.aria.records': 'Records',
    'tools.shell.aria.entries': 'Entries',
    'tools.shell.aria.monograph': 'Monograph',
    'tools.shell.aria.courseEntries': 'Course entries',
    'tools.shell.aria.indexResults': 'Index results',
    'tools.shell.aria.libraryEntries': 'Library entries',
    'tools.shell.aria.atlasEntries': 'Atlas entries',
    'tools.shell.aboutSection': 'About this section',
    'tools.shell.entriesOne': '1 entry, each with its source named.',
    'tools.shell.entriesMany': '{n} entries, each with its source named.',
    'tools.shell.noEntriesMatch': 'No entries match this filter.',

    // ---- Figures (TalismanFigures) ----
    'tools.figures.studyOnly':
      'These figures are for study only. They do not promise any outcome. They give no religious ruling. Read them slowly and check the sources named.',

    // ---- Huruf ----
    'tools.huruf.title': 'Huruf — Letters & Numbers',
    'tools.huruf.eyebrow': 'Letters & Numbers',
    'tools.huruf.subtitle':
      'The 28 Arabic letters and their Abjad values. Pick a system and a school; the table updates.',
    'tools.huruf.thLetter': 'Letter',
    'tools.huruf.thName': 'Name',
    'tools.huruf.thValue': 'Value',
    'tools.huruf.tableNote':
      'Table: standard Abjad values (mashriqi/maghribi). Kabir is the full value; Saghir is the same value reduced to a single digit. Values checked against Wikipedia’s “Abjad numerals” and the OpenArabic and WiserWork abjad calculators — the two schools agree on 22 letters and differ on six (sad, dad, sin, shin, za, ghayn).',
    'tools.huruf.howCounted': 'How letters are counted',
    'tools.huruf.mappingsTitle': 'Mappings we do not show yet',
    'tools.huruf.elementGroups': 'Element groups',
    'tools.huruf.luminous': 'Luminous and dark letters',
    'tools.huruf.planetLinks': 'Letter-to-planet links',
    'tools.huruf.sourceNeeded': 'Source needed — no source has been named for this mapping yet.',

    // ---- Asma ----
    'tools.asma.title': 'Asma — The 99 Names',
    'tools.asma.eyebrow': 'The 99 Names',
    'tools.asma.subtitle':
      'Search the Names by Arabic, transliteration or meaning. Values use Kabir Mashriqi by default — change the system or school below and they recompute.',
    'tools.asma.reckonTitle': 'Reckon a name',
    'tools.asma.reckonLabel': 'Type any name or text',
    'tools.asma.reckonPlaceholder': 'e.g. Rahman',
    'tools.asma.noArabic': 'No Arabic letters found in that text.',
    'tools.asma.searchPlaceholder': 'Search by Arabic, transliteration or meaning…',
    'tools.asma.searchAria': 'Search the 99 Names',
    'tools.asma.noNames': 'No names match “{q}”.',
    'tools.asma.bare': 'Bare',
    'tools.asma.withAl': 'with “al-”',
    'tools.asma.saveAria': 'Save {name} to Grimoire',
    'tools.asma.sourceNote':
      'The list runs from Ar-Rahman to As-Sabur; Allah’s own name is not counted among the ninety-nine here.',

    // ---- Bast ----
    'tools.bast.title': 'Bast — Unfold a Text',
    'tools.bast.eyebrow': 'Unfold a Text',
    'tools.bast.subtitle':
      'Type any text and see it unfolded letter by letter, with each letter’s value and the running total.',
    'tools.bast.yourText': 'Your text',
    'tools.bast.placeholder': 'Type Arabic text here…',
    'tools.bast.countedAs': 'Counted as:',
    'tools.bast.empty': 'Nothing to unfold yet. Type some text above, or try the example.',
    'tools.bast.tryExample': 'Try an example:',
    'tools.bast.thHash': '#',
    'tools.bast.thLetter': 'Letter',
    'tools.bast.thKabir': 'Kabir',
    'tools.bast.thSaghir': 'Saghir',
    'tools.bast.thRunning': 'Running total',
    'tools.bast.saveUnfolding': 'Save this unfolding to Grimoire',
    'tools.bast.howCounted': 'How the text is counted',

    // ---- Fawatih ----
    'tools.fawatih.title': 'Fawatih (The Opening Letters)',
    'tools.fawatih.eyebrow': 'Letters & Numbers',
    'tools.fawatih.subtitle':
      'Fourteen letter forms open twenty-nine surahs. The forms below are found by a rule run over the opening verse of every surah. They are computed from the text, not typed in.',
    'tools.fawatih.summary':
      '{total} surahs open with disjointed letters, in {forms} distinct forms. Pick a system and a school; the values update. The “Say it” column reads each form in Latin letters, so you can sound it out without knowing Arabic.',
    'tools.fawatih.thForm': 'Form',
    'tools.fawatih.thSayIt': 'Say it',
    'tools.fawatih.thSurahs': 'Surahs it opens',
    'tools.fawatih.thValue': 'Value',
    'tools.fawatih.howFound': 'How these were found',
    'tools.fawatih.howFoundBody':
      'The Qur’an text used here is fully vocalised: every ordinary word carries vowel marks. A word with no vowel marks at all stands out at the start of a surah. It may carry only the lengthening mark (maddah), or no mark. And it is one to five letters long. The rule is: take the first word of each surah’s opening verse (after the Basmalah, where the Basmalah is a prefix and not a verse), and keep it only if it is such a bare word. That rule finds exactly 29 surahs and 14 forms. Ordinary first words, like “inna” in Surah 71 or “la” in Surah 75, carry vowel marks and are not picked up. Surah 42 is the one case where the letters run over two verses: Ha Mim opens verse 1, and Ayn Sin Qaf is the whole of verse 2.',
    'tools.fawatih.basmalahBody':
      'The Basmalah is verse 1 of Surah al-Fatiha, so it stays in that surah’s text. For the other surahs it is a prefix in the printed text, not a verse, so the rule strips it first.',
    'tools.fawatih.notSay': 'What this page does not say',
    'tools.fawatih.notSayBody':
      'This page shows which letters open which surahs and what the letters add up to. It does not say what the letters mean. No source has been named for an interpretation yet, so none is offered. The forms are shown as they appear at the start of the surahs, nothing more.',
    'tools.fawatih.sourceTail':
      'The forms and values are computed from that text at run time; the test suite checks the result is 29 surahs in 14 forms with the exact mapping shown above.',

    // ---- Sawaqit ----
    'tools.sawaqit.title': 'Sawaqit (The Seven Absent Letters)',
    'tools.sawaqit.eyebrow': 'Letters & Numbers',
    'tools.sawaqit.subtitle':
      'Seven letters of the alphabet do not appear anywhere in al-Fatiha. The letters below are found by counting which letters the Fatiha uses. They are computed from the text, not typed in.',
    'tools.sawaqit.textCounted': 'The text counted',
    'tools.sawaqit.textCountedBody':
      'al-Fatiha, Qur’an 1:1–7. The whole surah, including the Basmalah, which is its first verse. It has 29 words and 139 letters as written in the Uthmani text. The Latin lines under the Arabic read it out, so you can follow it without knowing Arabic.',
    'tools.sawaqit.lettersUsed': 'The 21 letters the Fatiha uses',
    'tools.sawaqit.lettersUsedBody':
      'In Abjad order. Every other letter of the alphabet appears at least once in the surah.',
    'tools.sawaqit.thAbsent': 'Absent letter',
    'tools.sawaqit.thName': 'Name',
    'tools.sawaqit.thValue': 'Value',
    'tools.sawaqit.footerTotal': 'The seven absent letters together',
    'tools.sawaqit.sumsBody':
      'The seven absent letters add up to 2,390 in Kabir Mashriqi and 2,990 in Kabir Maghribi. The difference is the letter Shin: 300 in the eastern table, 1,000 in the western table.',
    'tools.sawaqit.namesTitle': 'Names for the seven letters',
    'tools.sawaqit.namesBody':
      'The books give a Name of God for each absent letter. The seven names, in the order the books give them, are Fa, Jim, Shin, Tha, Za, Kha, Zay. Remember them by the first sounds: Fa-Ja-Sha-Tha-Za-Kha-Za. The two letters that sound like “z” are different letters: Za’ (ظ) and Zay (ز).',
    'tools.sawaqit.thLetter': 'Letter',
    'tools.sawaqit.thName2': 'Name',
    'tools.sawaqit.thAlso': 'Also given as',
    'tools.sawaqit.sourceTail':
      'The count is computed from that text at run time; the test suite checks the result is the seven letters shown above.',

    // ---- Shields ----
    'tools.shields.title': 'Shields (Running Letter Sums)',
    'tools.shields.eyebrow': 'Letters & Numbers',
    'tools.shields.subtitle':
      'Five short texts, counted word by word. Each row shows a word, its value, and the running total, so you can follow the arithmetic to the grand total.',
    'tools.shields.spellingTitle': 'A note on the spelling',
    'tools.shields.spellingBody1':
      'The totals count the Uthmani text as written, including the shadda: a shadda doubles its letter, so al-Rahman counts 529 here, while the plain spelling without the shadda counts 329 on the Asma page. Both use the same counting rules. The difference is the spelling of the text, not a different rule. The Basmalah is verse 1 of al-Fatiha, so it is counted in the Fatiha. For al-Ikhlas, al-Falaq and al-Nas the Basmalah is not a verse of those surahs, so it is not counted in them.',
    'tools.shields.spellingBody2':
      'The Latin lines read each text out, so you can follow it without knowing Arabic. In this reading, AA is the letter ayn, and th is the letter tha. The l of “al” stays written before sun letters, so ar-Rahman reads alrrahman.',
    'tools.shields.thHash': '#',
    'tools.shields.thWord': 'Word',
    'tools.shields.thSayIt': 'Say it',
    'tools.shields.thValue': 'Value',
    'tools.shields.thRunning': 'Running total',
    'tools.shields.grandTotalWords': 'Grand total ({n} words)',
    'tools.shields.saveTotal': 'Save this total to Grimoire',
    'tools.shields.sourceTail':
      'The totals are computed from that text at run time; the test suite checks all five totals in both systems and both schools.',

    // ---- Journal ----
    'tools.journal.title': 'Journal — Reading Notes',
    'tools.journal.eyebrow': 'Reading Notes',
    'tools.journal.subtitle': 'Notes on what you read, kept on this device only.',
    'tools.journal.deviceNote': 'Everything you write here stays on this device. Nothing is sent anywhere.',
    'tools.journal.editNote': 'Edit note',
    'tools.journal.newNote': 'New note',
    'tools.journal.titleLabel': 'Title',
    'tools.journal.titlePlaceholder': 'What is this note about?',
    'tools.journal.noteLabel': 'Note',
    'tools.journal.notePlaceholder': 'Write what you learned, questions you have, or a quote to remember…',
    'tools.journal.addNote': 'Add note',
    'tools.journal.saveChanges': 'Save changes',
    'tools.journal.importAria': 'Import journal JSON file',
    'tools.journal.empty': 'No notes yet. Add your first note above.',
    'tools.journal.editAria': 'Edit {title}',
    'tools.journal.deleteAria': 'Delete {title}',
    'tools.journal.edited': 'edited {date}',
    'tools.journal.emptySubmit': 'Write a title or some text first',
    'tools.journal.updated': 'Note updated',
    'tools.journal.added': 'Note added',
    'tools.journal.deleted': 'Note deleted',
    'tools.journal.exported': 'Journal exported',
    'tools.journal.importedOne': 'Imported 1 note',
    'tools.journal.importedMany': 'Imported {n} notes',

    // ---- Wird ----
    'tools.wird.title': 'Wird — Remembrance Counter',
    'tools.wird.eyebrow': 'Remembrance Counter',
    'tools.wird.subtitle': 'A simple counter. Pick a phrase, tap the big button, and set a target if you like.',
    'tools.wird.deviceNote': 'Everything you count here stays on this device. Nothing is sent anywhere.',
    'tools.wird.choosePhrase': 'Choose a phrase',
    'tools.wird.addPhraseLabel': 'Add your own phrase',
    'tools.wird.addPhrasePlaceholder': 'Add your own phrase…',
    'tools.wird.addAria': 'Add phrase',
    'tools.wird.ofTarget': '{count} of {target} · {progress}%',
    'tools.wird.progressAria': 'Progress towards {target}',
    'tools.wird.tapBtn': 'Tap to count',
    'tools.wird.countAria': 'Count one for {phrase}',
    'tools.wird.targetLabel': 'Target',
    'tools.wird.resetPhrase': 'Reset this phrase',
    'tools.wird.resetAll': 'Reset all',
    'tools.wird.resetPhraseToast': 'Reset {phrase}',
    'tools.wird.resetAllToast': 'All counts reset',
    'tools.wird.phraseAdded': 'Phrase added',

    // ---- Grimoire ----
    'tools.grimoire.title': 'Grimoire — Saved Items',
    'tools.grimoire.eyebrow': 'Saved Items',
    'tools.grimoire.subtitle': 'Names, unfolded texts and notes you saved from the other tools, all in one place.',
    'tools.grimoire.deviceNote': 'Everything you save here stays on this device. Nothing is sent anywhere.',
    'tools.grimoire.addNoteTitle': 'Add a note',
    'tools.grimoire.titleLabel': 'Title',
    'tools.grimoire.titlePlaceholder': 'What is this about?',
    'tools.grimoire.detailLabel': 'Detail',
    'tools.grimoire.detailPlaceholder': 'Write the detail you want to keep…',
    'tools.grimoire.saveNote': 'Save note',
    'tools.grimoire.importAria': 'Import grimoire JSON file',
    'tools.grimoire.empty':
      'Nothing saved yet. Save a Name from the Asma page, an unfolding from the Bast page, or add a note above.',
    'tools.grimoire.kindName': 'Name',
    'tools.grimoire.kindBast': 'Unfolded text',
    'tools.grimoire.kindNote': 'Note',
    'tools.grimoire.deleteAria': 'Delete {title}',
    'tools.grimoire.emptySubmit': 'Write a title or some detail first',
    'tools.grimoire.saved': 'Note saved to Grimoire',
    'tools.grimoire.deleted': 'Item deleted',
    'tools.grimoire.exported': 'Grimoire exported',
    'tools.grimoire.importedOne': 'Imported 1 item',
    'tools.grimoire.importedMany': 'Imported {n} items',

    // ---- Today ----
    'tools.today.title': 'Today',
    'tools.today.eyebrow': 'Time & Heavens',
    'tools.today.subtitle':
      'The facts of this day: the date, the day’s ruler, and the planetary hour we are in now.',
    'tools.today.hijriLabel': 'Hijri date (approximate):',
    'tools.today.hijriApprox': 'This date is approximate — it is the civil calendar, not a sighted date.',
    'tools.today.rulerTitle': 'Today’s ruler',
    'tools.today.rulerBodyA':
      'rules the first hour of this day, so it is the day’s ruler. The day is counted from sunrise: an instant before sunrise belongs to the previous day.',
    'tools.today.dayRulersNote':
      'Day rulers: Sunday Sun, Monday Moon, Tuesday Mars, Wednesday Mercury, Thursday Jupiter, Friday Venus, Saturday Saturn. Source: Wikipedia, “Planetary hours”.',
    'tools.today.currentTitle': 'The current hour',
    'tools.today.hourLineA': 'Hour {n} of 24 ({dayNight} hour), ruled by',
    'tools.today.approxNote':
      'Approximate, not real hours — no location is set, so these hours use a fixed 06:00–18:00 split. Set a location on the Planetary Hours page for real hours.',
    'tools.today.realNote':
      'Real hours for {label}. Hours are unequal: each day hour is one twelfth of sunrise to sunset, each night hour one twelfth of sunset to next sunrise.',
    'tools.today.unavailable': 'Planetary hours are unavailable for this place and day: {reason}',
    'tools.today.defaultReason': 'No sunrise or sunset could be worked out for this place and day.',
    'tools.today.yourSavedLocation': 'your saved location',
    'tools.today.locationLine': 'Location: {label} ({lat}, {lon}, {tz}).',
    'tools.today.noLocation':
      'No location is set. Times use the device time zone and the approximate 06:00–18:00 split. Set a location on the Planetary Hours page.',
    'tools.today.locationTail':
      'Nothing is sent anywhere — the location is saved on this device only. There are no prayer times here.',

    // ---- Hours ----
    'tools.hours.title': 'Planetary Hours',
    'tools.hours.eyebrow': 'Time & Heavens',
    'tools.hours.subtitle':
      'The 24 hours of the day, each ruled by a planet in Chaldean order. Day hours run sunrise to sunset, night hours sunset to next sunrise — so the hours are unequal.',
    'tools.hours.locationTitle': 'Location',
    'tools.hours.usingLocation': 'Using {label} ({lat}, {lon}, {tz}).',
    'tools.hours.noLocation':
      'No location is set. Hours below use the fixed 06:00–18:00 split — approximate, not real hours.',
    'tools.hours.pickCity': 'Pick a city',
    'tools.hours.chooseCity': 'Choose a city…',
    'tools.hours.lat': 'Latitude',
    'tools.hours.lon': 'Longitude',
    'tools.hours.useLatLon': 'Use this latitude and longitude',
    'tools.hours.useMyLocation': 'Use my location',
    'tools.hours.clearLocation': 'Clear location',
    'tools.hours.privacyNote':
      'Your location is used on this device only to work out sunrise and sunset — it is never sent anywhere. “Use my location” asks your browser for it first; you can say no and pick a city or type coordinates instead. No external geocoding or timezone service is used.',
    'tools.hours.dayRuler': 'Day ruler:',
    'tools.hours.sunrise': 'Sunrise',
    'tools.hours.sunset': 'Sunset',
    'tools.hours.approxBox':
      'Approximate, not real hours. No location is set, so this table uses a fixed 06:00–18:00 split in {tz}. Set a location above for real hours.',
    'tools.hours.realNote':
      'Hours are unequal: each day hour is one twelfth of sunrise to sunset, each night hour one twelfth of sunset to next sunrise. The day is counted from sunrise, so an instant before sunrise belongs to the previous day. Times are worked out with the Astronomy Engine library; the time zone is handled with Intl, so daylight saving is followed.',
    'tools.hours.thHour': 'Hour',
    'tools.hours.thTime': 'Time',
    'tools.hours.thRuler': 'Ruler',
    'tools.hours.thDayNight': 'Day / night',
    'tools.hours.nowSuffix': ' — now',
    'tools.hours.unavailableTitle': 'Planetary hours are unavailable for this place and day:',
    'tools.hours.unavailableDefault':
      'the Sun does not rise or set around now (polar day or night), so there is no sunrise or sunset to divide into hours.',
    'tools.hours.unavailableTail': 'No hours are invented. Pick another place or day.',
    'tools.hours.methodNote':
      'Method: Astronomy Engine (SearchRiseSet for the Sun); the Chaldean order is Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, and the first hour of the day is the day ruler. Source: Wikipedia, “Planetary hours”.',
    'tools.hours.geoSaved': 'Location saved on this device: {label}.',
    'tools.hours.geoInvalid':
      'That location is not valid. Latitude must be between -90 and 90, longitude between -180 and 180.',
    'tools.hours.geoTypeNumbers': 'Type a number for latitude and a number for longitude.',
    'tools.hours.geoNoGeo': 'This browser does not offer geolocation.',
    'tools.hours.geoAsking': 'Asking for your location…',
    'tools.hours.geoNotShared': 'Location was not shared. Pick a city or type a latitude and longitude instead.',
    'tools.hours.geoCleared': 'Location cleared. Hours are now the approximate 06:00–18:00 split.',
    'tools.hours.geoManual': 'Manual ({lat}, {lon})',
    'tools.hours.geoMyLocation': 'My location ({lat}, {lon})',

    // ---- Moon ----
    'tools.moon.title': 'Moon',
    'tools.moon.eyebrow': 'Time & Heavens',
    'tools.moon.subtitle':
      'The Moon’s phase, how much of it is lit, the lunar day, and the mansion it sits in.',
    'tools.moon.phaseAngle': 'Phase angle',
    'tools.moon.illumination': 'Illumination',
    'tools.moon.lunarDay': 'Lunar day',
    'tools.moon.lunarDayValue': 'Day {n} of 30',
    'tools.moon.longitude': 'Moon’s ecliptic longitude',
    'tools.moon.methodNote': 'Method: {method}. Phase angle 0° is new moon, 180° is full moon.',
    'tools.moon.currentMansion': 'Current mansion',
    'tools.moon.alsoCalled': '(also called {name})',
    'tools.moon.footer':
      'These are calculated facts only. They say where the Moon is and how lit it is — nothing here says what that means for any day or any person.',

    // ---- Mansions ----
    'tools.mansions.title': 'Lunar Mansions',
    'tools.mansions.eyebrow': 'Time & Heavens',
    'tools.mansions.subtitle':
      'The 28 stations of the Moon (manazil al-qamar). Today’s mansion is highlighted; the start point below is a convention you can move.',
    'tools.mansions.todayTitle': 'Today’s mansion',
    'tools.mansions.todayBodyA': 'The Moon is at {deg} ecliptic longitude, in',
    'tools.mansions.todayOffset': '(with a start offset of {offset}°)',
    'tools.mansions.offsetLabel': 'Start offset (degrees) — a convention, not a fixed fact',
    'tools.mansions.offsetNote':
      'The table below starts at 0° with al-Sharatayn by convention. Setting an offset of, say, 5° moves the start point to 5°, so every mansion’s range shifts by 5°. Other traditions start the count elsewhere — this control lets you use their start point instead. The Moon’s position itself comes from the Astronomy Engine.',
    'tools.mansions.thHash': '#',
    'tools.mansions.thMansion': 'Mansion',
    'tools.mansions.thArabic': 'Arabic',
    'tools.mansions.thDegrees': 'Degrees',
    'tools.mansions.todaySuffix': ' — today',
    'tools.mansions.alsoPrefix': 'also ',
    'tools.mansions.footerTail':
      'Each mansion covers 360 / 28 = about 12.857°. The list is a traditional table, not a modern astronomical fact.',

    // ---- Falak ----
    'tools.falak.title': 'Falak — the Twelve Signs',
    'tools.falak.eyebrow': 'Time & Heavens',
    'tools.falak.subtitle':
      'The twelve signs of the tropical zodiac, with the Sun’s sign today. A table for study — nothing here says what a sign means for any person.',
    'tools.falak.sunSignTitle': 'The Sun’s sign today',
    'tools.falak.sunSignBodyA': 'The Sun is at {deg}° ecliptic longitude, in',
    'tools.falak.methodNote':
      'Worked out with the Astronomy Engine (SunPosition ecliptic longitude of the Sun). {convention}',
    'tools.falak.thHash': '#',
    'tools.falak.thSign': 'Sign',
    'tools.falak.thArabic': 'Arabic',
    'tools.falak.thDates': 'Dates (approx.)',
    'tools.falak.thElement': 'Element',
    'tools.falak.thDegrees': 'Degrees',
    'tools.falak.todaySuffix': ' — today',
    'tools.falak.footer':
      'Elements are the traditional Western grouping: Fire = Aries, Leo, Sagittarius; Earth = Taurus, Virgo, Capricorn; Air = Gemini, Libra, Aquarius; Water = Cancer, Scorpio, Pisces. Source: {source}. The date ranges are approximate and shift a day or so from year to year, because the equinox itself moves.',

    // ---- Majlis ----
    'tools.majlis.title': 'Majlis',
    'tools.majlis.eyebrow': 'Time & Heavens',
    'tools.majlis.subtitle':
      'The facts of the moment, in one place: where you are, today’s ruler, the current hour, and the Moon.',
    'tools.majlis.locationTitle': 'Location',
    'tools.majlis.noLocation':
      'No location is set. Hours below use the approximate 06:00–18:00 split. Set a location on the Planetary Hours page.',
    'tools.majlis.locationNote': 'The location is saved on this device only. Nothing is sent anywhere.',
    'tools.majlis.rulerTitle': 'Today’s ruler',
    'tools.majlis.rulerBodyA': 'rules the first hour of this day.',
    'tools.majlis.currentTitle': 'The current hour',
    'tools.majlis.approxNote': 'Approximate, not real hours — no location is set.',
    'tools.majlis.unavailable': 'Planetary hours are unavailable for this place and day: {reason}',
    'tools.majlis.moonTitle': 'The Moon',
    'tools.majlis.moonLine': '{phase}, {pct}% lit, lunar day {day} of 30.',
    'tools.majlis.mansionLabel': 'Mansion:',
    'tools.majlis.methodNote':
      'Method: {method}. The mansion division (28 equal parts from 0° al-Sharatayn) is a convention; see the Lunar Mansions page.',
    'tools.majlis.footer':
      'That is all this page says: facts about the time and the sky. It does not score the day, recommend anything, or say what to do.',

    // ---- Forge ----
    'tools.forge.title': 'Wafq Forge — Magic Squares',
    'tools.forge.eyebrow': 'Squares & Seals',
    'tools.forge.subtitle':
      'Build a magic square of order 3 to 20 at a target sum, then check it line by line. A square is only shown as passed when every row, column and diagonal adds up.',
    'tools.forge.orderLabel': 'Order (size of the square)',
    'tools.forge.order2': '2 — not possible',
    'tools.forge.order2Title': 'No magic square of order 2 exists.',
    'tools.forge.kindOdd': 'Odd order — built by the Siamese method (de la Loubère).',
    'tools.forge.kindDoubly': 'Doubly even order (divisible by 4) — built by the complement method.',
    'tools.forge.kindSingly': 'Singly even order (even, not divisible by 4) — built by the LUX method (Conway).',
    'tools.forge.targetLabel': 'Target sum (default: the base constant {n})',
    'tools.forge.targetNote':
      'The target must differ from {base} by a multiple of {order}, and must not be below {base}. Otherwise the square is refused, not forced.',
    'tools.forge.generate': 'Generate square',
    'tools.forge.refusalPrefix': 'This square cannot be made:',
    'tools.forge.squareTitle': '{order}x{order} square — target {target}',
    'tools.forge.methodLineA': 'Method: {method}. Base constant {base}',
    'tools.forge.shiftSuffix': ', shifted by {n} in every cell.',
    'tools.forge.noShift': ', no shift.',
    'tools.forge.shownNote': 'The square is fully shown above, on this page. No download is needed to see it or use it.',
    'tools.forge.copyBtn': 'Copy square',
    'tools.forge.validationTitle': 'Validation — checked separately from the generator',
    'tools.forge.passBody':
      'Every row, every column and both diagonals sum to {target}, and all {n} numbers are different positive whole numbers.',
    'tools.forge.thLine': 'Line',
    'tools.forge.thSum': 'Sum',
    'tools.forge.thTarget': 'Target',
    'tools.forge.rowLabel': 'Row {n}',
    'tools.forge.colLabel': 'Column {n}',
    'tools.forge.diag1': 'Diagonal top-left to bottom-right',
    'tools.forge.diag2': 'Diagonal top-right to bottom-left',
    'tools.forge.distinctLine': 'All numbers different: {yesNo}.',
    'tools.forge.sealTitle': 'Seal frame and plate',
    'tools.forge.sealBody':
      'The framed seal is shown below, on this page. Copy it as text, save it as an image, or download the framed SVG. Print stays as an option too. All of these open only after the square passes validation.',
    'tools.forge.framedAria': 'Framed {order} by {order} magic square, every line sums to {target}',
    'tools.forge.gridAria': '{order} by {order} magic square',
    'tools.forge.printA2': 'Print as an A2 plate (420 x 594 mm proportions)',
    'tools.forge.saveImage': 'Save as image',
    'tools.forge.downloadSvg': 'Download framed SVG',
    'tools.forge.printPlate': 'Print plate',
    'tools.forge.exportOff': 'Export and print stay off until the square passes.',
    'tools.forge.svgCaption': '{order} x {order} — every line sums to {target} — {method}',
    'tools.forge.constructions': 'Constructions: {source}.',

    // ---- Qawaid ----
    'tools.qawaid.title': 'Qawa’id — The Rules of the Squares',
    'tools.qawaid.eyebrow': 'Squares & Seals',
    'tools.qawaid.subtitle':
      'How a square is built, when a target sum can be reached, how it is checked, and what is refused.',
    'tools.qawaid.whatTitle': 'What a magic square is',
    'tools.qawaid.whatBody':
      'A magic square is a grid of numbers where every row, every column and both diagonals add up to the same number. That number is called the magic constant, or target sum. The order is the number of cells along one side: a 3x3 square is order 3, a 4x4 square is order 4, and so on. For a square holding the numbers 1 to n squared, the constant is n times (n squared plus 1), divided by 2. So a 3x3 square sums to 15, a 4x4 to 34, a 5x5 to 65, and a 9x9 to 369.',
    'tools.qawaid.methodTitle': 'The method for each order type',
    'tools.qawaid.methodIntro':
      'Orders fall into three types, and each type has its own documented construction. The Forge first builds a base square holding the numbers 1 to n squared, then shifts it to the target sum (see the reachability rule below).',
    'tools.qawaid.oddTitle': 'Odd orders (3, 5, 7, 9, 11, 13, 15, 17, 19) — {method}',
    'tools.qawaid.oddBody':
      'Start with 1 in the middle cell of the top row. Then step up one row and right one column, wrapping around the edges when you leave the grid. If the next cell is already filled, step down one row from the current cell instead. Keep going until every cell holds a number.',
    'tools.qawaid.doublyTitle': 'Doubly even orders (4, 8, 12, 16, 20) — {method}',
    'tools.qawaid.doublyBody':
      'Write the numbers 1 to n squared in order, row by row. Then, in every 4x4 block, replace each number sitting on a diagonal of that block with its complement: n squared plus 1 minus the number. The numbers off the diagonals stay as they are.',
    'tools.qawaid.singlyTitle': 'Singly even orders (6, 10, 14, 18) — {method}',
    'tools.qawaid.singlyBody':
      'Build an array of letters, L, U and X, one letter for each 2x2 block of the finished square. Fill the blocks with four consecutive numbers each, walking the letter array in the same up-and-right order as the Siamese method, starting in the middle block of the top row. Each letter says in which order the four numbers land inside its 2x2 block: L fills top-right, bottom-left, bottom-right, top-left; U fills top-left, bottom-left, bottom-right, top-right; X fills top-left, bottom-right, bottom-left, top-right. The letters are arranged so the finished square adds up on every line.',
    'tools.qawaid.sourceNote': 'Source: {source}.',
    'tools.qawaid.reachTitle': 'The reachability rule',
    'tools.qawaid.reachBody':
      'The base square sums to its constant M. Adding the same whole number d to every cell adds n times d to every line, so a target T can be reached exactly when (T minus M) divided by n is a whole number, and d is not negative. The smallest cell of the base square is 1, so a negative shift would make a cell zero or negative, and that is refused.',
    'tools.qawaid.reachEx1': '3x3, target 27: the shift is (27 minus 15) / 3 = 4, so the cells run from 5 to 13. Allowed.',
    'tools.qawaid.reachEx2': '3x3, target 18: the shift is (18 minus 15) / 3 = 1, so the cells run from 2 to 10. Allowed.',
    'tools.qawaid.reachEx3': '3x3, target 16: the shift would be 1 / 3, which is not a whole number. Refused.',
    'tools.qawaid.reachEx4': '3x3, target 12: the shift would be minus 1, which would make a cell zero. Refused.',
    'tools.qawaid.reachEx5': '4x4, target 35: the shift would be 1 / 4, which is not a whole number. Refused.',
    'tools.qawaid.refusedNote':
      'When a target is refused, the Forge says so in plain words and makes nothing. It never rounds the shift, never patches a cell, and never repeats a number to force a result that only looks valid.',
    'tools.qawaid.validatorTitle': 'How the validator works',
    'tools.qawaid.validatorBody1':
      'The validator is separate code from the generator. It does not know how the square was made, and it never trusts the generator: it adds up the grid it is given, cell by cell. It checks every row, every column and both diagonals against the target, and it checks that every cell is a different positive whole number. It works on hand-made grids too, not only on squares the Forge built.',
    'tools.qawaid.validatorBody2':
      'The result is shown as PASS or FAIL, with every line sum listed, so anyone can see which line is wrong and by how much. Export and printing open only after a PASS.',
    'tools.qawaid.refusedTitle': 'What is refused and why',
    'tools.qawaid.refused1': 'Order 2: no magic square of order 2 exists.',
    'tools.qawaid.refused2': 'Orders below 3 or above 20: no construction is implemented and tested for them here.',
    'tools.qawaid.refused3': 'A target the shift cannot reach (shift not a whole number): refused, not rounded.',
    'tools.qawaid.refused4': 'A target below the base constant: refused, because a cell would become zero or negative.',
    'tools.qawaid.refused5': 'A target that is not a whole positive number: refused.',
    'tools.qawaid.modesTitle': 'Modes that are not built',
    'tools.qawaid.modesIntro':
      'These square modes are not built, because no rule and no worked example has been supplied for them. They are listed here so the gap is visible, instead of being guessed at.',
    'tools.qawaid.baseConstants': 'Base constants for reference:',

    // ---- Method ----
    'tools.method.title': 'Method — How These Tools Work',
    'tools.method.eyebrow': 'How It Works',
    'tools.method.subtitle':
      'Where the numbers come from, how letters are counted, what was tested, and the limits of these tools.',
    'tools.method.whatTitle': 'What these tools do',
    'tools.method.whatBody':
      'These tools are for study and calculation only. They add up letter values, keep reading notes, count taps, and save items you choose to keep. They do not promise any outcome, protection, healing or provision, and they give no religious rulings. Never use them to harm anyone.',
    'tools.method.sourcesTitle': 'Data sources',
    'tools.method.srcAbjadLabel': 'Abjad table: ',
    'tools.method.srcAbjadBody':
      'standard Abjad values (mashriqi/maghribi), checked against Wikipedia’s “Abjad numerals” and the OpenArabic and WiserWork abjad calculators. The two schools agree on 22 letters and differ on six (sad, dad, sin, shin, za, ghayn). Kabir is the full value of each letter; Saghir is the same value reduced to a single digit.',
    'tools.method.srcNamesLabel': 'The 99 Names: ',
    'tools.method.srcAstroLabel': 'Astronomy and time: ',
    'tools.method.srcAstroBody':
      'the maintained Astronomy Engine library (astronomy-engine) works out sunrise, sunset, the Moon’s phase and longitude, and the Sun’s longitude. No astronomy formulas are hand-written here.',
    'tools.method.srcMansionsLabel': 'Lunar mansions: ',
    'tools.method.srcMansionsBody':
      'Wikipedia, “Lunar mansion” (the manazil al-qamar table, 28 stations starting with al-Sharatayn at 0°), checked 18 Nov 2026.',
    'tools.method.srcSignsLabel': 'The twelve signs: ',
    'tools.method.srcSignsBody':
      'Wikipedia, “Astrological sign” (the Western zodiac table, tropical signs and element triplicities), checked 18 Nov 2026.',
    'tools.method.srcPlanetsLabel': 'Planets and day rulers: ',
    'tools.method.srcPlanetsBody':
      'Wikipedia, “Planetary hours” (Chaldean order and which planet rules each weekday). Arabic planet names: Wiktionary, “Appendix:Planets”, and the al-Biruni list quoted there.',
    'tools.method.srcSquaresLabel': 'Magic squares: ',
    'tools.method.srcSquaresBody':
      'Wikipedia, “Magic square” and “Conway’s LUX method for magic squares” (constructions checked 18 Nov 2026).',
    'tools.method.srcNotesLabel': 'Your notes, counts and saved items: ',
    'tools.method.srcNotesBody': 'written by you, kept in this device’s storage only. Nothing is sent anywhere.',
    'tools.method.timeTitle': 'How time is worked out (Phase 2)',
    'tools.method.timeIntro':
      'Planetary hours are unequal. The day starts at sunrise: the 12 day hours divide sunrise to sunset into 12 equal parts, and the 12 night hours divide sunset to next sunrise into 12 equal parts. An instant before sunrise belongs to the previous day, whose ruler still applies. The first hour of a day is ruled by that day’s planet, and after that the rulers cycle in Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.',
    'tools.method.timeLibLabel': 'Library: ',
    'tools.method.timeLibBody':
      'Astronomy Engine (astronomy-engine), a maintained astronomy library. Time zones are handled with Intl and the place’s IANA zone, so daylight saving is followed. No external geocoding or timezone service is used.',
    'tools.method.timeNoLocLabel': 'No location set: ',
    'tools.method.timeNoLocBody':
      'the hours fall back to a fixed 06:00–18:00 split, labelled clearly as “approximate, not real hours”.',
    'tools.method.timePolarLabel': 'Polar day or night: ',
    'tools.method.timePolarBody':
      'where the Sun does not rise or set, the hours are shown as unavailable with the reason — they are never invented.',
    'tools.method.timeLocLabel': 'Location: ',
    'tools.method.timeLocBody':
      'picked from a bundled city list, typed as a latitude and longitude, or shared from the browser — on this device only, never sent anywhere.',
    'tools.method.timeHijriLabel': 'Hijri date: ',
    'tools.method.timeHijriBody':
      'the Islamic civil calendar (Intl, Kuwaiti algorithm). It is approximate: real months depend on moon sighting and can differ by a day or two.',
    'tools.method.timeMansionsLabel': 'Lunar mansions: ',
    'tools.method.timeMansionsBody':
      '28 equal parts of about 12.857°, starting at 0° with al-Sharatayn. That is a convention, not a universal fact — other traditions start the count elsewhere, and the Mansions page lets you move the start point. The Moon’s position comes from the Astronomy Engine.',
    'tools.method.timeSignsLabel': 'The twelve signs: ',
    'tools.method.timeSignsBody':
      'the tropical zodiac, measured from the March equinox, so the signs no longer line up with the constellations of the same names. The date ranges are approximate and shift slightly year to year.',
    'tools.method.timeMoonLabel': 'Moon phase and lunar day: ',
    'tools.method.timeMoonBody':
      'from the Astronomy Engine; the lunar day is the phase angle’s share of a 29.53-day month, counted from 1.',
    'tools.method.squaresTitle': 'How the squares are built and checked (Phase 3)',
    'tools.method.squaresIntro':
      'The Wafq Forge builds a base square holding the numbers 1 to n squared, then shifts every cell by the same whole number to reach the target sum. Which construction is used depends on the order type: the Siamese method (de la Loubère) for odd orders, the complement method for doubly even orders (divisible by 4), and the LUX method (Conway) for singly even orders (even but not divisible by 4). Orders 3 to 20 are supported. The full rules are on the Qawa’id page.',
    'tools.method.sqReachLabel': 'Reachability rule: ',
    'tools.method.sqReachBody':
      'a target can be reached exactly when it differs from the base constant by a multiple of the order, and the shift is not negative. Otherwise the Forge refuses in plain words — it never rounds, patches a cell, or repeats a number to force a result.',
    'tools.method.sqValidatorLabel': 'Separate validator: ',
    'tools.method.sqValidatorBody':
      'the checker is separate code from the generator. It adds up the grid it is given — every row, every column, both diagonals — and checks that every cell is a different positive whole number. It works on hand-made grids too. The result is shown as PASS or FAIL, with every line sum listed.',
    'tools.method.sqExportLabel': 'Export and print: ',
    'tools.method.sqExportBody':
      'the framed SVG download and the A2 plate print open only after the square passes validation.',
    'tools.method.sqModesLabel': 'Modes not built: ',
    'tools.method.sqModesBody':
      'multiplied, cycling, hollow-centre and “grand wafq” squares are listed as “source needed” — no rule and worked example has been supplied for them, so they are not guessed at.',
    'tools.method.lettersTitle': 'How letters are counted',
    'tools.method.lettersIntro':
      'Before any counting, the text is normalised — cleaned up into a standard form — so the same letter written in different ways is counted once. The rules used are:',
    'tools.method.bareNote':
      'A name’s “bare” value counts the name without “al-”; the “with al-” value counts it with “al-” added. Both use the same Abjad table, in the system and school you pick.',
    'tools.method.testedTitle': 'What was tested',
    'tools.method.tested1':
      'Storage helpers: 10 automated tests pass — journal, wird and grimoire save/load round-trips, export/import of valid JSON, and bad files being rejected without wiping existing data.',
    'tools.method.tested2':
      'The Abjad arithmetic itself is tested here: letter values in both schools and both systems, normalisation (hamza forms, shadda, tatweel, decomposed letters), and text totals — including the plain checks “Allah 66” and “bism Allah 168”.',
    'tools.method.tested3':
      'Time and squares are tested by their own suites: planetary hours (including midnight and polar cases), moon and mansion boundaries, and square generation plus the separate validator (known constants, shifted sums, and cases that must be refused).',
    'tools.method.limitsTitle': 'Known limits',
    'tools.method.limit1':
      'Element groups, luminous and dark letters, and letter-to-planet links are not shown anywhere: no source has been named for those mappings yet, so nothing is guessed.',
    'tools.method.limit2':
      'The Maghribi values come from the table’s named sources (Wikipedia’s “Abjad numerals”, OpenArabic, WiserWork): six letters differ from the Mashriqi values, the other 22 agree.',
    'tools.method.limit3':
      'The Hijri date shown on the Today page is approximate — it is the calculated (civil) date, which can differ from the moon-sighting date by a day or two.',
    'tools.method.limit4': 'There are no prayer times here.',
    'tools.method.limit5':
      'Notes, counts and saved items live only on this device. Clearing this browser’s site data, or moving to another device, loses them unless you exported a JSON backup first.',

    // ---- About ----
    'tools.about.title': 'About (The Study Tools)',
    'tools.about.eyebrow': 'About',
    'tools.about.subtitle':
      'What this section is, where its numbers come from, what was tested, and what it cannot do.',
    'tools.about.whatTitle': 'What this section is',
    'tools.about.whatBody1':
      'A set of small tools for studying letters, numbers, time and your own reading notes. They add up letter values, work out the facts of the day, build and check magic squares, and keep notes you choose to save. They are for study and calculation only. They do not promise any outcome, protection, healing or provision, and they give no religious rulings. Never use them to harm anyone.',
    'tools.about.whatBody2':
      'Everything here runs in your browser. Your notes, counts and saved items stay on this device. Nothing is sent anywhere. The library and these tools sit behind the follow gate: they open when you tap “I followed” or enter the key from the Ghayb Chronicles broadcast channel. The site itself is free; there is no payment anywhere.',
    'tools.about.builtTitle': 'What is built',
    'tools.about.builtIntro':
      'Nineteen tools are built and working. The rest of the cards on the hub are shells: they hold only content supplied with its source and page, so they stay empty until that arrives.',
    'tools.about.builtLettersLabel': 'Letters & numbers: ',
    'tools.about.builtLettersBody':
      'Huruf (the 28 letters and their values), Asma (the 99 Names), Bast (unfold any text), Fawatih (the 14 opening-letter forms across 29 surahs), Sawaqit (the seven letters absent from al-Fatiha), Shields (running letter sums for five short texts).',
    'tools.about.builtTimeLabel': 'Time & sky: ',
    'tools.about.builtTimeBody':
      'Today, Planetary Hours, Moon, Lunar Mansions, Falak (the twelve signs), Majlis (the facts of the moment).',
    'tools.about.builtSquaresLabel': 'Squares: ',
    'tools.about.builtSquaresBody': 'Wafq Forge (build a magic square) and Qawa’id (the rules of the squares).',
    'tools.about.builtNotesLabel': 'Notes & memory: ',
    'tools.about.builtNotesBody': 'Journal (reading notes), Wird (a remembrance counter), Grimoire (saved items).',
    'tools.about.builtSelfLabel': 'This section itself: ',
    'tools.about.builtSelfBody': 'Method (how the tools work) and this About page.',
    'tools.about.notBuiltTitle': 'What is not built',
    'tools.about.notBuilt1': 'No AI teacher. Questions about the material are for a person, not this section.',
    'tools.about.notBuilt2':
      'Nothing that harms, compels or binds anyone. The tools index only; they never build workings aimed at a person.',
    'tools.about.notBuilt3': 'No incense recipes with quantities, and no preparation instructions of any kind.',
    'tools.about.sourcesTitle': 'Data sources',
    'tools.about.srcAbjadLabel': 'Abjad table: ',
    'tools.about.srcAbjadBody':
      'standard Abjad values (mashriqi/maghribi), checked against Wikipedia’s “Abjad numerals” and the OpenArabic and WiserWork abjad calculators. The two schools agree on 22 letters and differ on six (sad, dad, sin, shin, za, ghayn). Kabir is the full value of each letter; Saghir is the same value reduced to a single digit.',
    'tools.about.srcQuranLabel': 'Qur’anic text: ',
    'tools.about.srcQuranBody':
      'The Fawatih forms, the Sawaqit letters and the Shields totals are computed from that text at run time, not typed in. The text is used under the Tanzil terms: verbatim copies, source named, link to tanzil.net. Surah names and meanings come from the AlQuranCloud surah list, checked 18 Nov 2026.',
    'tools.about.srcTranslitLabel': 'Transliteration: ',
    'tools.about.srcTranslitBody':
      'The Latin reading of the Arabic on the Fawatih, Sawaqit and Shields pages comes from the same project. It is used for non-commercial use with a link back, as the terms ask. Every verse was checked word by word against the Arabic.',
    'tools.about.srcNamesLabel': 'The 99 Names: ',
    'tools.about.srcAstroLabel': 'Astronomy and time: ',
    'tools.about.srcAstroBody':
      'the maintained Astronomy Engine library (astronomy-engine) works out sunrise, sunset, the Moon’s phase and longitude, and the Sun’s longitude. No astronomy formulas are hand-written here.',
    'tools.about.srcMansionsLabel': 'Lunar mansions: ',
    'tools.about.srcMansionsBody':
      'Wikipedia, “Lunar mansion” (the manazil al-qamar table, 28 stations starting with al-Sharatayn at 0°), checked 18 Nov 2026.',
    'tools.about.srcSignsLabel': 'The twelve signs: ',
    'tools.about.srcSignsBody':
      'Wikipedia, “Astrological sign” (the Western zodiac table, tropical signs and element triplicities), checked 18 Nov 2026.',
    'tools.about.srcPlanetsLabel': 'Planets and day rulers: ',
    'tools.about.srcPlanetsBody':
      'Wikipedia, “Planetary hours” (Chaldean order and which planet rules each weekday). Arabic planet names: Wiktionary, “Appendix:Planets”, and the al-Biruni list quoted there.',
    'tools.about.srcSquaresLabel': 'Magic squares: ',
    'tools.about.srcSquaresBody':
      'Wikipedia, “Magic square” and “Conway’s LUX method for magic squares” (constructions checked 18 Nov 2026).',
    'tools.about.srcNotesLabel': 'Your notes, counts and saved items: ',
    'tools.about.srcNotesBody': 'written by you, kept in this device’s storage only. Nothing is sent anywhere.',
    'tools.about.convTitle': 'Conventions chosen',
    'tools.about.convSchoolsLabel': 'Two schools, two systems: ',
    'tools.about.convSchoolsBody':
      'Mashriqi (eastern) and Maghribi (western) letter tables; Kabir (full value) and Saghir (each letter reduced to a single digit, then added). The pages let you switch, and the numbers update.',
    'tools.about.convCountingLabel': 'Counting rules: ',
    'tools.about.convCountingBody':
      'one shared normalisation routine for all letter counting. Unicode NFC, hamza forms unified, ta marbuta read as ha, alif maqsura read as ya, a shadda doubling its letter (except where the letter is already written twice, as in Allah). The Uthmani spelling counts as written, so al-Rahman is 529 in the Shields and 329 in its plain spelling.',
    'tools.about.convHoursLabel': 'Planetary hours: ',
    'tools.about.convHoursBody':
      'unequal hours. The day runs sunrise to sunset, the night sunset to next sunrise. With no location set, the hours fall back to a fixed 06:00–18:00 split, labelled clearly as approximate. Where the Sun does not rise or set, the hours are shown as unavailable.',
    'tools.about.convHijriLabel': 'Hijri date: ',
    'tools.about.convHijriBody':
      'the Islamic civil calendar (Intl, Kuwaiti algorithm). It is approximate: real months depend on moon sighting and can differ by a day or two.',
    'tools.about.convMansionsLabel': 'Lunar mansions: ',
    'tools.about.convMansionsBody':
      '28 equal parts of about 12.857°, starting at 0° with al-Sharatayn. That is a convention, not a universal fact. Other traditions start the count elsewhere, and the Mansions page lets you move the start point.',
    'tools.about.convSignsLabel': 'The twelve signs: ',
    'tools.about.convSignsBody':
      'the tropical zodiac, measured from the March equinox, so the signs no longer line up with the constellations of the same names.',
    'tools.about.testedTitle': 'What was tested',
    'tools.about.testedIntro':
      'The whole site is covered by automated tests. The full suite is green, and it runs before every change is shipped. The tests that matter for this section:',
    'tools.about.testedAbjadLabel': 'Abjad arithmetic: ',
    'tools.about.testedAbjadBody':
      'letter values in both schools and both systems, normalisation (hamza forms, shadda, tatweel, decomposed letters), and text totals, including the plain checks “Allah 66” and “bism Allah 168”.',
    'tools.about.testedQuranLabel': 'Qur’anic text: ',
    'tools.about.testedQuranBody':
      'verse counts for the five shield texts, Unicode NFC form of every stored string, the Basmalah kept in al-Fatiha and stripped from the other three surahs, the Fawatih rule finding exactly 29 surahs in 14 forms with the exact mapping, the seven Sawaqit letters, and all five Shields totals in both systems and both schools. The expected numbers were worked out independently against the source text, not from the code under test. The transliteration is checked the same way: every verse matches its Arabic verse word for word (137 words), and the 114:6 fix is pinned in the test.',
    'tools.about.testedTimeLabel': 'Time and squares: ',
    'tools.about.testedTimeBody':
      'planetary hours (including midnight and polar cases), moon and mansion boundaries, and square generation plus the separate validator (known constants, shifted sums, and cases that must be refused).',
    'tools.about.testedStorageLabel': 'Storage and wiring: ',
    'tools.about.testedStorageBody':
      'journal, wird and grimoire save/load round-trips, export/import of valid JSON, bad files rejected without wiping existing data, and every tool in the hub having a matching route, URL and page.',
    'tools.about.limitsTitle': 'Known limits',
    'tools.about.limit1':
      'The Fawatih page does not say what the opening letters mean: no source has been named for an interpretation yet.',
    'tools.about.limit2':
      'The Sawaqit page does not give the traditional names attached to the seven absent letters: no source has been named for them yet. The Inloes translation of Shams al-Ma’arif was checked and does not give them.',
    'tools.about.limit3':
      'Element groups, luminous and dark letters, and letter-to-planet links are not shown anywhere: no source has been named for those mappings yet, so nothing is guessed.',
    'tools.about.limit4':
      'The Maghribi values come from the table’s named sources: six letters differ from the Mashriqi values, the other 22 agree.',
    'tools.about.limit5':
      'The Hijri date shown on the Today page is approximate. It is the calculated (civil) date, which can differ from the moon-sighting date by a day or two.',
    'tools.about.limit6': 'There are no prayer times here.',
    'tools.about.limit7':
      'Notes, counts and saved items live only on this device. Clearing this browser’s site data, or moving to another device, loses them unless you exported a JSON backup first.',
    'tools.about.whoTitle': 'Who made this',
    'tools.about.whoBody':
      'The Study Tools are part of the Ilm-e-Ghayb Library, from Ghayb Chronicles (@ghayb.chronicles). Islamic esoteric knowledge, mysticism and Sufi wisdom, with sources in every caption. The library is free; the tools and the books sit behind the follow gate for followers of the channel.',

    // ---- Tier B: Kitab ----
    'tools.kitab.title': 'Kitab (The Book)',
    'tools.kitab.eyebrow': 'The Book',
    'tools.kitab.subtitle': 'What the books say about the Book, from the books themselves.',
    'tools.kitab.chapterLabel': 'Chapter',
    'tools.kitab.filterAria': 'Filter by chapter',
    'tools.kitab.allChapters': 'All chapters',
    'tools.kitab.chapterN': 'Chapter {n}',
    'tools.kitab.frontMatter': 'Front matter',
    'tools.kitab.backMatter': 'Back matter',
    'tools.kitab.filterNote':
      'These entries are general notes about the Book, not chapter text, so the chapter filter does not narrow them.',

    // ---- Tier B: Talasim ----
    'tools.talasim.title': 'Talasim (Figures)',
    'tools.talasim.eyebrow': 'Figures',
    'tools.talasim.subtitle': 'What a talisman is, its shapes, and the four strict conditions.',
    'tools.talasim.searchLabel': 'Search figures',
    'tools.talasim.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Ashkal ----
    'tools.ashkal.title': 'Ashkal (Forms)',
    'tools.ashkal.eyebrow': 'Figures',
    'tools.ashkal.subtitle': 'Forms as vessels for spirits, from the Point to the Square.',
    'tools.ashkal.searchLabel': 'Search forms',
    'tools.ashkal.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Figure Forge ----
    'tools.figureForge.title': 'Figure Forge',
    'tools.figureForge.eyebrow': 'Figures',
    'tools.figureForge.subtitle': 'How a figure is made, in the words of the old books.',
    'tools.figureForge.searchLabel': 'Search figures',
    'tools.figureForge.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Talism Studio ----
    'tools.talismStudio.title': 'Talism Studio',
    'tools.talismStudio.eyebrow': 'Seals',
    'tools.talismStudio.subtitle': 'The room where the work is done, as the books describe it.',
    'tools.talismStudio.searchLabel': 'Search seals',
    'tools.talismStudio.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Haqaiq ----
    'tools.haqaiq.title': 'Haqa’iq (Realities)',
    'tools.haqaiq.eyebrow': 'Realities',
    'tools.haqaiq.subtitle': 'Realities that live in the heart, not in books.',
    'tools.haqaiq.searchLabel': 'Search records',
    'tools.haqaiq.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Shart ----
    'tools.shart.title': 'Shart (Conditions)',
    'tools.shart.eyebrow': 'Conditions',
    'tools.shart.subtitle': 'The conditions every work needs, named one by one.',
    'tools.shart.searchLabel': 'Search entries',
    'tools.shart.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: al-Sirr al-Jalil ----
    'tools.sirr.title': 'al-Sirr al-Jalil',
    'tools.sirr.eyebrow': 'Monograph',
    'tools.sirr.subtitle': 'The Great Secret, and the Name that opens it.',
    'tools.sirr.searchLabel': 'Search the monograph',
    'tools.sirr.searchPlaceholder': 'Search by heading or page',

    // ---- Tier B: Durus ----
    'tools.durus.title': 'Durus (Lessons)',
    'tools.durus.eyebrow': 'Lessons',
    'tools.durus.subtitle': 'Lessons on learning, from the old masters.',
    'tools.durus.searchLabel': 'Search lessons',
    'tools.durus.searchPlaceholder': 'Search by lesson or course',

    // ---- Tier B: Index ----
    'tools.index.title': 'Index',
    'tools.index.eyebrow': 'Index',
    'tools.index.subtitle': 'How the old books map themselves.',
    'tools.index.searchLabel': 'Search the index',
    'tools.index.searchPlaceholder': 'Search by name or topic',

    // ---- Tier B: Library ----
    'tools.library.title': 'Library (Squares Library)',
    'tools.library.eyebrow': 'Squares Library',
    'tools.library.subtitle': 'How the old books were kept and passed down.',
    'tools.library.searchLabel': 'Search entries',
    'tools.library.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Atlas ----
    'tools.atlas.title': 'Atlas',
    'tools.atlas.eyebrow': 'Atlas',
    'tools.atlas.subtitle': 'A map of the heavens, the spheres, and the letters.',
    'tools.atlas.searchLabel': 'Search the atlas',
    'tools.atlas.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Qalam ----
    'tools.qalam.title': 'Qalam',
    'tools.qalam.eyebrow': 'Qalam',
    'tools.qalam.subtitle': 'The Pen, the first thing created, and the first thing that wrote.',
    'tools.qalam.searchLabel': 'Search entries',
    'tools.qalam.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Khatam ----
    'tools.khatam.title': 'Khatam',
    'tools.khatam.eyebrow': 'Khatam',
    'tools.khatam.subtitle': 'The Seal, and Solomon its master.',
    'tools.khatam.searchLabel': 'Search entries',
    'tools.khatam.searchPlaceholder': 'Search by name or page',
    'tools.khatam.gridTitle': 'The 3 by 3 grid, shown on this page',
    'tools.khatam.gridBody':
      'The books call the 3 by 3 grid the seal of Solomon and of al-Ghazali. Here it is, as the books give it. Every row, every column and both diagonals add to 15.',
    'tools.khatam.gridNote':
      'The grid is fully shown above, on this page. No download is needed to see it or use it.',
    'tools.khatam.copyGrid': 'Copy grid',
    'tools.khatam.saveImage': 'Save as image',
    'tools.khatam.sealCaption': 'The seal of Solomon, 3 by 3, every line sums to 15',
    'tools.khatam.gridAria': 'The 3 by 3 grid, the seal of Solomon',
    'tools.khatam.sealAria': 'The seal of Solomon, a 3 by 3 grid',
    'tools.khatam.gridSourceBody': 'The numbers are the classic 3 by 3 square, and every line sums to 15.',

    // ---- Tier B: Plate ----
    'tools.plate.title': 'Plate',
    'tools.plate.eyebrow': 'Plate',
    'tools.plate.subtitle': 'Plates of metal, one for each planet.',
    'tools.plate.searchLabel': 'Search entries',
    'tools.plate.searchPlaceholder': 'Search by name or page',
    'tools.plate.metalsTitle': 'The metals and their planets, shown on this page',
    'tools.plate.metalsBody':
      'Each planet has its metal, and the metal must match the planet. The Sun has gold. The Moon has silver. Mars has iron. Mercury has quicksilver. Saturn has lead.',
    'tools.plate.metalsNote':
      'The figure is fully shown above, on this page. No download is needed to see it or use it. The books also name copper plates and a tin sheet, but they do not tie them to a planet in the entries on this page.',
    'tools.plate.copyList': 'Copy list',
    'tools.plate.saveImage': 'Save as image',
    'tools.plate.metalsAria': 'The metals and their planets',
    'tools.plate.tableAria': 'Plate of metals and their planets',
    'tools.plate.svgTitle': 'Lawh, the plate',
    'tools.plate.svgSub': 'Each planet has its metal. The metal must match the planet.',
    'tools.plate.svgFoot': 'Copper and tin are named as plates too. Their planets are not named here.',

    // ---- Tier B: Works ----
    'tools.works.title': 'Works',
    'tools.works.eyebrow': 'Works',
    'tools.works.subtitle': 'What the books say a work is, and what it needs.',
    'tools.works.searchLabel': 'Search entries',
    'tools.works.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Bakhur and Adad ----
    'tools.bakhur.title': 'Bakhur and Adad',
    'tools.bakhur.eyebrow': 'Bakhur and Adad',
    'tools.bakhur.subtitle': 'A catalogue of named substances and the number work, nothing more.',
    'tools.bakhur.searchLabel': 'Search the catalogue',
    'tools.bakhur.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Shurut ----
    'tools.shurut.title': 'Shurut (Conditions)',
    'tools.shurut.eyebrow': 'Conditions',
    'tools.shurut.subtitle': 'The conditions the books name, each with its source and page.',
    'tools.shurut.searchLabel': 'Search entries',
    'tools.shurut.searchPlaceholder': 'Search by name or page',

    // ---- Tier B: Glossary ----
    'tools.glossary.title': 'Glossary',
    'tools.glossary.eyebrow': 'Glossary',
    'tools.glossary.subtitle': 'The words used across this section, in plain words.',
    'tools.glossary.searchLabel': 'Search terms',
    'tools.glossary.searchPlaceholder': 'Search by term',
    'tools.glossary.filterLabel': 'Filter by letter',
    'tools.glossary.showingLetter': 'Showing terms under {letter}. Tap All to see the whole glossary again.',

    // ---- Data: tool titles & blurbs (hub + search) ----
    'tools.data.toolTitle.huruf': 'Huruf (Letters & Numbers)',
    'tools.data.toolBlurb.huruf':
      'The 28 Arabic letters and their Abjad values, with the counting rules shown in plain words.',
    'tools.data.toolTitle.asma': 'Asma (The 99 Names)',
    'tools.data.toolBlurb.asma':
      'Search the 99 Names, see each name’s number value, reckon any name, and save names you want to keep.',
    'tools.data.toolTitle.bast': 'Bast (Unfold a Text)',
    'tools.data.toolBlurb.bast':
      'Type any text and unfold it letter by letter, with each letter’s value and the running total.',
    'tools.data.toolTitle.fawatih': 'Fawatih (The Opening Letters)',
    'tools.data.toolBlurb.fawatih':
      'The 14 disjointed-letter forms that open 29 surahs, found by a rule run over the opening verse of every surah, with their values.',
    'tools.data.toolTitle.sawaqit': 'Sawaqit (The Seven Absent Letters)',
    'tools.data.toolBlurb.sawaqit':
      'The seven letters that do not appear anywhere in al-Fatiha, found by counting which letters the surah uses.',
    'tools.data.toolTitle.shields': 'Shields (Running Letter Sums)',
    'tools.data.toolBlurb.shields':
      'Word-by-word running letter sums for al-Fatiha, al-Ikhlas, al-Falaq, al-Nas and Ayat al-Kursi, so you can follow the arithmetic.',
    'tools.data.toolTitle.journal': 'Journal (Reading Notes)',
    'tools.data.toolBlurb.journal':
      'Keep notes on what you read. Everything stays on this device — nothing is sent anywhere.',
    'tools.data.toolTitle.wird': 'Wird (Remembrance Counter)',
    'tools.data.toolBlurb.wird':
      'A simple counter for daily remembrance, with targets you set yourself. Saved on this device.',
    'tools.data.toolTitle.grimoire': 'Grimoire (Saved Items)',
    'tools.data.toolBlurb.grimoire':
      'Names, unfolded texts and notes you saved from the other tools, all in one place on this device.',
    'tools.data.toolTitle.today': 'Today',
    'tools.data.toolBlurb.today':
      'The facts of this day: the date, the approximate Hijri date, the day’s ruler, and the planetary hour we are in now.',
    'tools.data.toolTitle.hours': 'Planetary Hours',
    'tools.data.toolBlurb.hours':
      'The 24 hours of the day, each ruled by a planet. Day hours run sunrise to sunset, night hours sunset to next sunrise — the hours are unequal.',
    'tools.data.toolTitle.moon': 'Moon',
    'tools.data.toolBlurb.moon':
      'The Moon’s phase, how much of it is lit, the lunar day, and the mansion it sits in.',
    'tools.data.toolTitle.mansions': 'Lunar Mansions',
    'tools.data.toolBlurb.mansions':
      'The 28 stations of the Moon, with today’s mansion highlighted and the start point shown as a convention you can move.',
    'tools.data.toolTitle.falak': 'Falak — the Twelve Signs',
    'tools.data.toolBlurb.falak': 'The twelve signs of the tropical zodiac, with the Sun’s sign today.',
    'tools.data.toolTitle.majlis': 'Majlis',
    'tools.data.toolBlurb.majlis':
      'The facts of the moment in one place: location, today’s ruler, the current hour, and the Moon. Facts only — no advice.',
    'tools.data.toolTitle.forge': 'Wafq Forge — Magic Squares',
    'tools.data.toolBlurb.forge':
      'Build a magic square of order 3 to 20 at a target sum, then check it line by line with a separate validator.',
    'tools.data.toolTitle.qawaid': 'Qawa’id — The Rules of the Squares',
    'tools.data.toolBlurb.qawaid':
      'How a square is built, when a target sum can be reached, how it is checked, and what is refused.',
    'tools.data.toolTitle.kitab': 'Kitab (The Book)',
    'tools.data.toolBlurb.kitab':
      'What the books say about the Book: the three mothers of books, the Preserved Tablet, and the titled kitabs in the library.',
    'tools.data.toolTitle.talasim': 'Talasim (Figures)',
    'tools.data.toolBlurb.talasim':
      'What a talisman is, its shapes and lineage, and the four strict conditions for making one.',
    'tools.data.toolTitle.ashkal': 'Ashkal (Forms)',
    'tools.data.toolBlurb.ashkal':
      'Forms as vessels for spirits: Point and Circle, Triangle and Square, magic squares as figures, and more.',
    'tools.data.toolTitle.figure-forge': 'Figure Forge',
    'tools.data.toolBlurb.figure-forge':
      'How a figure is made: metals and stones, timing, washing, consecration, and the artificer.',
    'tools.data.toolTitle.talism-studio': 'Talism Studio',
    'tools.data.toolBlurb.talism-studio':
      'The workplace of the old craft: the remembrance house, the four pillars, the sand board, and the rules of the studio.',
    'tools.data.toolTitle.haqaiq': 'Haqa’iq (Realities)',
    'tools.data.toolBlurb.haqaiq':
      'Realities that live in the heart: the fixed entities, the three worlds, and the path of law, way and reality.',
    'tools.data.toolTitle.shart': 'Shart (Conditions)',
    'tools.data.toolBlurb.shart':
      'The conditions every work needs: the 27 conditions, the four pillars, purity, and the condition of will.',
    'tools.data.toolTitle.sirr-al-jalil': 'al-Sirr al-Jalil',
    'tools.data.toolBlurb.sirr-al-jalil':
      'The Great Secret: the Name al-Jalil, the Name al-Majid, and the secret set in its matrix.',
    'tools.data.toolTitle.durus': 'Durus (Lessons)',
    'tools.data.toolBlurb.durus':
      'Lessons on learning: silence, Jilani’s thirteen branches, study etiquette, and learning from creation.',
    'tools.data.toolTitle.index': 'Index',
    'tools.data.toolBlurb.index':
      'How the old books map themselves: Ibn Arabi’s chapter of the index, rubrics, and the dispersal of knowledge.',
    'tools.data.toolTitle.library': 'Library (Squares Library)',
    'tools.data.toolBlurb.library':
      'How the old books were kept: hidden knowledge, chests, the covenant of custody, and the great libraries.',
    'tools.data.toolTitle.atlas': 'Atlas',
    'tools.data.toolBlurb.atlas':
      'A map of the heavens: the Atlas sphere, nine charts, the Wheel of Letter Dispositions, and the Head of Qaf.',
    'tools.data.toolTitle.qalam': 'Qalam',
    'tools.data.toolBlurb.qalam':
      'The Pen: the first thing created, the triple inscription, talismanic pen rules, and Rumi’s ants.',
    'tools.data.toolTitle.khatam': 'Khatam',
    'tools.data.toolBlurb.khatam':
      'The Seal: Solomon as its master, the 3 by 3 grid, the seven symbols, and the Seal of the Prophets.',
    'tools.data.toolTitle.plate': 'Plate',
    'tools.data.toolBlurb.plate':
      'Plates of metal: gold for the Sun, silver for the Moon, iron for Mars, lead for Saturn, and seven-metal casting.',
    'tools.data.toolTitle.works': 'Works',
    'tools.data.toolBlurb.works':
      'What the books say a work is: its two purposes, intention, the letters, the square sizes, and the protocols, each with its source named.',
    'tools.data.toolTitle.bakhur-adad': 'Bakhur and Adad',
    'tools.data.toolBlurb.bakhur-adad':
      'A catalogue of the aromatic substances and the number work, named with source and page. Never quantities, preparation, or recipes.',
    'tools.data.toolTitle.shurut': 'Shurut (Conditions)',
    'tools.data.toolBlurb.shurut':
      'The conditions a work needs: timing, harmony, consecration, charity, purity, intention and certainty, each with its source named.',
    'tools.data.toolTitle.glossary': 'Glossary',
    'tools.data.toolBlurb.glossary':
      'The words used across this section, explained in plain words, each with its source and page.',
    'tools.data.toolTitle.method': 'Method (How These Tools Work)',
    'tools.data.toolBlurb.method':
      'Where the numbers come from, how letters are counted, what was tested, and what these tools cannot do.',
    'tools.data.toolTitle.about': 'About (The Study Tools)',
    'tools.data.toolBlurb.about':
      'What this section is, where its numbers come from, what was tested, and what it cannot do.',

    // ---- Data: topic groups ----
    'tools.data.topicGroupTitle.quran': 'Quran & Tafseer',
    'tools.data.topicGroupBlurb.quran': 'The Quran, and how scholars explain it.',
    'tools.data.topicGroupTitle.hadith': 'Hadith',
    'tools.data.topicGroupBlurb.hadith': 'The Prophet’s sayings and practice, collected.',
    'tools.data.topicGroupTitle.seerah': 'Life of the Prophet',
    'tools.data.topicGroupBlurb.seerah': 'The Prophet’s life, and the stories of the Prophets.',
    'tools.data.topicGroupTitle.history': 'History',
    'tools.data.topicGroupBlurb.history': 'How Islam grew, and why empires rise and fall.',
    'tools.data.topicGroupTitle.sufism': 'Sufism & Wisdom',
    'tools.data.topicGroupBlurb.sufism': 'The spiritual path, and the foundations of faith.',
    'tools.data.topicGroupTitle.hidden': 'Hidden Knowledge',
    'tools.data.topicGroupBlurb.hidden': 'Secrets, symbols, the soul, dreams, and the unseen world.',

    // ---- Data: planets, days, signs, elements, phases ----
    'tools.data.planet.saturn': 'Saturn',
    'tools.data.planet.jupiter': 'Jupiter',
    'tools.data.planet.mars': 'Mars',
    'tools.data.planet.sun': 'Sun',
    'tools.data.planet.venus': 'Venus',
    'tools.data.planet.mercury': 'Mercury',
    'tools.data.planet.moon': 'Moon',
    'tools.data.dayName.sunday': 'Sunday',
    'tools.data.dayName.monday': 'Monday',
    'tools.data.dayName.tuesday': 'Tuesday',
    'tools.data.dayName.wednesday': 'Wednesday',
    'tools.data.dayName.thursday': 'Thursday',
    'tools.data.dayName.friday': 'Friday',
    'tools.data.dayName.saturday': 'Saturday',
    'tools.data.zodiac.0': 'Aries',
    'tools.data.zodiac.1': 'Taurus',
    'tools.data.zodiac.2': 'Gemini',
    'tools.data.zodiac.3': 'Cancer',
    'tools.data.zodiac.4': 'Leo',
    'tools.data.zodiac.5': 'Virgo',
    'tools.data.zodiac.6': 'Libra',
    'tools.data.zodiac.7': 'Scorpio',
    'tools.data.zodiac.8': 'Sagittarius',
    'tools.data.zodiac.9': 'Capricorn',
    'tools.data.zodiac.10': 'Aquarius',
    'tools.data.zodiac.11': 'Pisces',
    'tools.data.element.fire': 'Fire',
    'tools.data.element.earth': 'Earth',
    'tools.data.element.air': 'Air',
    'tools.data.element.water': 'Water',
    'tools.data.phase.newMoon': 'New Moon',
    'tools.data.phase.waxingCrescent': 'Waxing Crescent',
    'tools.data.phase.firstQuarter': 'First Quarter',
    'tools.data.phase.waxingGibbous': 'Waxing Gibbous',
    'tools.data.phase.fullMoon': 'Full Moon',
    'tools.data.phase.waningGibbous': 'Waning Gibbous',
    'tools.data.phase.lastQuarter': 'Last Quarter',
    'tools.data.phase.waningCrescent': 'Waning Crescent',

    // ---- Data: conventions & fixed util strings ----
    'tools.data.mansionConvention':
      '28 equal parts of about 12.857 degrees, starting at 0 degrees with al-Sharatayn. This is a convention, not a universal fact; other traditions start the count elsewhere.',
    'tools.data.zodiacConvention':
      'Tropical zodiac: signs are measured from the March equinox, so they no longer line up with the constellations of the same names. Dates are approximate and shift slightly year to year.',
    'tools.data.moonMethod': 'Astronomy Engine MoonPhase; lunar month 29.53 days',
    'tools.data.hijriMethod': 'Islamic civil calendar (Intl, Kuwaiti algorithm)',
    'tools.data.hijriNote': 'Real months depend on moon sighting and can differ by a day or two.',
    'tools.data.sunNoSet':
      'The Sun does not set on this day (midnight sun) — there is no sunrise or sunset to divide into hours.',
    'tools.data.sunNoRise':
      'The Sun does not rise on this day (polar night) — there is no sunrise or sunset to divide into hours.',
    'tools.data.sunRisesNoSet':
      'The Sun rises today but does not set on this calendar day — it sets after midnight.',

    // ---- Data: counting rules (NORMALIZATION_RULES, same order) ----
    'tools.data.normRule.1':
      'Text is first put into Unicode NFC form, so a letter typed as separate parts (for example alif plus a hamza mark above it) becomes one single letter.',
    'tools.data.normRule.2':
      'Tatweel (the stretch mark) and all vowel marks are removed: fatha, damma, kasra, sukun, tanwin, superscript alef, and similar marks.',
    'tools.data.normRule.3':
      'Hamza forms are unified: أ, إ, آ, ٱ, and a standalone hamza ء all become ا; ؤ becomes و; ئ becomes ي.',
    'tools.data.normRule.4':
      'Ta marbuta ة is read as ه. This is a choice made by this tool, not a universal rule.',
    'tools.data.normRule.5': 'Alif maqsura ى is read as ي.',
    'tools.data.normRule.6':
      'A shadda doubles the letter it sits on, so that letter counts twice. If the letter is already written twice, as the two lams in الله, the shadda adds no third letter, so الله still totals 66.',
    'tools.data.normRule.7':
      'Spaces, punctuation, and non-Arabic letters are ignored: they are not counted and do not appear in the letter list.',

    // ---- Data: unsupported square modes ----
    'tools.data.unsupported.multiplied.label': 'Multiplied squares',
    'tools.data.unsupported.multiplied.note': 'Source needed — no rule and worked example supplied.',
    'tools.data.unsupported.cycling.label': 'Cycling squares',
    'tools.data.unsupported.cycling.note': 'Source needed — no rule and worked example supplied.',
    'tools.data.unsupported.hollowCentre.label': 'Hollow-centre squares',
    'tools.data.unsupported.hollowCentre.note': 'Source needed — no rule and worked example supplied.',
    'tools.data.unsupported.grandWafq.label': 'Grand wafq',
    'tools.data.unsupported.grandWafq.note': 'Source needed — no rule and worked example supplied.',

    // ---- Data: import errors (toolsStorage) ----
    'tools.data.importError.notJson': 'That file is not valid JSON.',
    'tools.data.importError.noToolsData': 'That file does not hold tools data.',
    'tools.data.importError.noEntries': 'That file has no journal, wird or grimoire data in it.',
    'tools.data.importError.journalShape': 'The journal entries in that file are not in the right shape.',
    'tools.data.importError.wirdShape': 'The wird counts in that file are not in the right shape.',
    'tools.data.importError.grimoireShape': 'The grimoire items in that file are not in the right shape.',

    // ---- Data: Al Asrar intros (first-person, Khafi's voice) ----
    'tools.data.alAsrarIntro.kitab':
      'I have spent a long time with these books. The word kitab means a book. But in the old books it means much more than paper and ink. Here is what I found about the Book, from the books themselves.',
    'tools.data.alAsrarIntro.talasim':
      'A talisman is not a charm you buy in a market. In the old books it is a thing made with care, with Names and letters and numbers set in balance. Here is what the books say it is.',
    'tools.data.alAsrarIntro.ashkal':
      'Ashkal means forms. A form is not just a shape on paper. In these books a form is a vessel. It holds a spirit the way a cup holds water. Here is what the books say about forms.',
    'tools.data.alAsrarIntro.figure-forge':
      'A figure is not written. It is made. The old books are strict about how a figure is made, what it is made of, and when it is made. I gathered their rules here so you can see the craft as they describe it.',
    'tools.data.alAsrarIntro.talism-studio':
      'The old books have no modern word for a studio. But they describe the room where the work is done in clear detail. I gathered their description of the workplace here, so you can see how they set it up.',
    'tools.data.alAsrarIntro.haqaiq':
      'Haqaiq means realities. The word points to what is real under the surface of things. The Sufis say the realities live in the heart, not in books. Here is what they wrote about them.',
    'tools.data.alAsrarIntro.shart':
      'Shart means a condition. Nothing in these books works without its conditions. The books list them with care, because a work done without its conditions is a work done wrong. Here are the conditions they name.',
    'tools.data.alAsrarIntro.sirr-al-jalil':
      'Al-Sirr al-Jalil means the Great Secret. It is a name, a number and a door all at once. I gathered what the books say about it here, so you can see how one Name opens a whole field of secrets.',
    'tools.data.alAsrarIntro.durus':
      'Durus means lessons. The old masters did not teach by books alone. They taught by silence, by example and by the company of the teacher. Here is what they say about learning.',
    'tools.data.alAsrarIntro.index':
      'An index is a map of a book. The old books hid their knowledge on purpose, so the index is the key that opens them. I gathered what the books say about their own indexes here.',
    'tools.data.alAsrarIntro.library':
      'The old books were not kept on open shelves. They were hidden, buried, locked in chests and passed down in secret. This page gathers what the books say about keeping a library of such books.',
    'tools.data.alAsrarIntro.atlas':
      'An atlas is a map. But this atlas does not map lands. It maps the heavens, the spheres and the letters that rule them. Here is how the old books draw the sky.',
    'tools.data.alAsrarIntro.qalam':
      'Qalam means a pen. But the Pen in these books is not the pen on my desk. It is the first thing God created, and the first thing that wrote. Here is what the books say about the Pen.',
    'tools.data.alAsrarIntro.khatam':
      'Khatam means a seal. A seal closes a letter and proves who sent it. In the old books the seal is also a power, and Solomon is its master. Here is what the books say about seals.',
    'tools.data.alAsrarIntro.plate':
      'A plate is a flat sheet of metal, made to carry a figure. Gold, silver, copper, iron and lead each have their own work. I gathered what the books say about each plate here.',
    'tools.data.alAsrarIntro.works':
      'A work is a practical act, done with discipline and with God in mind. I gathered what the books say a work is, what it needs, and how knowledge and action belong together. Here it is, from the books themselves.',
    'tools.data.alAsrarIntro.bakhur-adad':
      'Bakhur and Adad is a catalogue, nothing more. It names the aromatic substances and the number work, with the source and page for each, so a reader can count the entries and look each one up. It never gives quantities, preparation, or recipes.',
    'tools.data.alAsrarIntro.shurut':
      'Shurut are the conditions. A work done outside its conditions is a work done wrong. I gathered the conditions the books name, each with its source and page, so a reader can check them one by one.',
    'tools.data.alAsrarIntro.glossary':
      'The Glossary explains the words used across this section, in plain words. These are the terms gathered so far, each with its source and page. The full table is still being gathered from the notebook, and more terms will be added here.',

    // ---- Data: talisman figures ----
    'tools.data.figureTitle.mutakabbir': 'Square of al-Mutakabbir, 4 by 4',
    'tools.data.figureCaption.mutakabbir':
      'A square of numbers from the book. The book gives these numbers as they are. We draw them here exactly as written.',
    'tools.data.figureNote.mutakabbir':
      'This grid does not check out as a magic square. The rows add to 206, 183, 198 and 206. The number 56 shows twice. We show it as it is in the book. We do not fix it.',
    'tools.data.figureTitle.jabbar': 'Square of al-Jabbar, 5 by 5',
    'tools.data.figureCaption.jabbar':
      'The book gives the number of this square but not the grid. We show only what the book gives.',
    'tools.data.figureNote.jabbar': 'The grid itself is not in hand. We do not guess the cells.',
    'tools.data.figureTitle.solomon-triangle': 'Solomon triangle wafq, 3 by 3',
    'tools.data.figureCaption.solomon-triangle':
      'A small square of nine numbers. Each row and each column and each diagonal adds to 15.',
    'tools.data.figureTitle.fatiha-wafqs': 'Seven wafqs of the omitted letters of al-Fatiha',
    'tools.data.figureCaption.fatiha-wafqs':
      'The book says there is a sevenfold wafq for every omitted letter of al-Fatiha. The rule is named here. No grid is drawn.',
    'tools.data.figureNote.fatiha-wafqs': 'The grids are not in hand. We do not draw what we do not have.',
    'tools.data.figureTitle.seven-seals': 'The seven seals for the seven days',
    'tools.data.figureCaption.seven-seals':
      'The book opens the chapter with this line. The form of the seven seals for the seven days. The seven marks below are the graphic marks found inside the seals.',
    'tools.data.figureNote.seven-seals':
      'In the book the seals are seven grids of 4 by 4 with numbers and hand drawn marks. The grids are hand drawn in the book. They are not written out here. Only the seven marks are drawn.',

    // ---- Data: Sawaqit name glosses ----
    'tools.data.sawaqitGloss.fard': 'the Unique, the Singular',
    'tools.data.sawaqitGloss.jabbar': 'the Compeller, the Restorer',
    'tools.data.sawaqitGloss.shahid': 'the Witness',
    'tools.data.sawaqitGloss.thabit': 'the Firm, the Constant',
    'tools.data.sawaqitGloss.zahir': 'the Manifest, the Helper',
    'tools.data.sawaqitGloss.khabir': 'the All-Aware',
    'tools.data.sawaqitGloss.zaki': 'the Pure',

    // ---- Data: plate metals ----
    'tools.data.metal.gold': 'Gold',
    'tools.data.metal.silver': 'Silver',
    'tools.data.metal.iron': 'Iron',
    'tools.data.metal.quicksilver': 'Quicksilver',
    'tools.data.metal.lead': 'Lead',
    'tools.forge.reasonOrderUnsupported': 'Order {order} is not supported. Orders 3 to 20 only, and order 2 has no magic square at all.',
    'tools.forge.reasonNoConstruction': 'No documented construction is implemented for order {order}, so no square is made.',
    'tools.forge.reasonTargetNotWhole': 'The target sum must be a whole positive number.',
    'tools.forge.reasonUnreachable': 'Target {target} cannot be reached for a {order}x{order} square. The base square sums to {base}, and shifting every cell by the same whole number changes each line by a multiple of {order}, so {target} cannot be reached that way. Pick a target that differs from {base} by a multiple of {order}.',
    'tools.forge.reasonBelowBase': 'Target {target} is below the base sum {base} for a {order}x{order} square. Reaching it would need a shift of {offset}, which would make the smallest cell zero or negative. Only targets of {base} or more can be made this way.',
    'tools.forge.failNotSquare': 'The grid is not square: every row must have the same number of cells as there are rows.',
    'tools.forge.failCell': 'Cell row {r}, column {c} is not a positive whole number.',
    'tools.forge.failRepeated': 'The number {value} appears more than once.',
    'tools.forge.failRow': 'Row {n} sums to {sum}, not {target}.',
    'tools.forge.failColumn': 'Column {n} sums to {sum}, not {target}.',
    'tools.forge.failDiag1': 'Diagonal (top-left to bottom-right) sums to {sum}, not {target}.',
    'tools.forge.failDiag2': 'Diagonal (top-right to bottom-left) sums to {sum}, not {target}.',
    'tools.forge.failSomeNotWhole': 'Some cells are not positive whole numbers.',
    'tools.forge.failNotDistinct': 'Not all numbers are different.',
  },
  hi: {
    // ---- Shared ----
    'tools.common.system': 'System',
    'tools.common.school': 'School',
    'tools.common.kabir': 'Kabir (bada)',
    'tools.common.saghir': 'Saghir (chhota)',
    'tools.common.mashriqi': 'Mashriqi (purbi)',
    'tools.common.maghribi': 'Maghribi (paschimi)',
    'tools.common.save': 'Save karein',
    'tools.common.savedToGrimoire': 'Grimoire mein save ho gaya',
    'tools.common.total': 'Kul jod',
    'tools.common.grandTotal': 'Kul jod',
    'tools.common.runningTotal': 'Chalta hua jod',
    'tools.common.value': 'Keemat',
    'tools.common.letter': 'Harf',
    'tools.common.name': 'Naam',
    'tools.common.word': 'Lafz',
    'tools.common.sayIt': 'Bolein',
    'tools.common.search': 'Dhoondhein',
    'tools.common.closeSearch': 'Search band karein',
    'tools.common.cancel': 'Radd karein',
    'tools.common.add': 'Jodein',
    'tools.common.exportJson': 'JSON export karein',
    'tools.common.importJson': 'JSON import karein',
    'tools.common.copied': 'Copy ho gaya',
    'tools.common.untitledNote': 'Bina naam ka note',
    'tools.common.source': 'Source',
    'tools.common.sources': 'Sources',
    'tools.common.day': 'Din',
    'tools.common.night': 'Raat',
    'tools.common.yes': 'haan',
    'tools.common.no': 'nahi',
    'tools.common.all': 'Sab',
    'tools.common.noMatchesFor': '“{q}” ke liye kuch nahi mila.',
    'tools.common.importFail': 'Woh file import nahi ho saki.',
    'tools.common.readFail': 'Woh file padhi nahi ja saki.',

    // ---- Hub ----
    'tools.hub.title': 'Padhai ke Tools',
    'tools.hub.eyebrow': 'Padhai ke Tools',
    'tools.hub.subtitle': 'Harf, number aur apne padhne ke notes ke liye chhote tools hain. Yahan kuch bhi kisi nateeje ka vaada nahi karta. Yeh sab sirf padhai ke liye hai.',
    'tools.hub.topicsTitle': 'Topics',

    // ---- Layout ----
    'tools.layout.back': 'Padhai ke Tools',
    'tools.layout.search': 'Dhoondhein',
    'tools.layout.searchAria': 'Tools dhoondhein (Ctrl+K)',
    'tools.layout.defaultEyebrow': 'Padhai ke Tools',

    // ---- Disclaimer ----
    'tools.disclaimer.text':
      'Yeh tools sirf padhai aur hisaab ke liye hain. Yeh kisi nateeje, hifazat, shifa ya rozi ka vaada nahi karte. Inse kabhi kisi ko nuksaan mat pahunchayein.',
    'tools.disclaimer.link': 'Yeh tools kaise kaam karte hain',

    // ---- Search overlay ----
    'tools.search.placeholder': 'Tools, topics aur 99 Naam dhoondhein…',
    'tools.search.aria': 'Tools, topics aur 99 Naam dhoondhein',
    'tools.search.dialogLabel': 'Padhai ke tools dhoondhein',
    'tools.search.hint': '“letters”, “counter”, “notes”, “Malakut” try karein, ya koi Naam jaise “Rahman”.',

    // ---- Shell / FilledToolPage ----
    'tools.shell.emptyTitle': 'Abhi yahan kuch nahi hai',
    'tools.shell.emptyMessage':
      'Abhi yahan kuch nahi hai. Yahan sirf wohi likha jata hai jo source, page aur permission note ke saath mila ho.',
    'tools.shell.aria.figureEntries': 'Figure entries',
    'tools.shell.aria.formEntries': 'Form entries',
    'tools.shell.aria.sealEntries': 'Seal entries',
    'tools.shell.aria.records': 'Records',
    'tools.shell.aria.entries': 'Entries',
    'tools.shell.aria.monograph': 'Monograph',
    'tools.shell.aria.courseEntries': 'Course entries',
    'tools.shell.aria.indexResults': 'Index results',
    'tools.shell.aria.libraryEntries': 'Library entries',
    'tools.shell.aria.atlasEntries': 'Atlas entries',
    'tools.shell.aboutSection': 'Is hisse ke baare mein',
    'tools.shell.entriesOne': '1 entry, har ek ka source likha hai.',
    'tools.shell.entriesMany': '{n} entries, har ek ka source likha hai.',
    'tools.shell.noEntriesMatch': 'Is filter se koi entry nahi milti.',

    // ---- Figures (TalismanFigures) ----
    'tools.figures.studyOnly':
      'Yeh figures sirf padhai ke liye hain. Yeh kisi nateeje ka vaada nahi karte. Yeh koi deeni faisla nahi dete. Aaram se padhein aur bataye gaye sources ko check karein.',

    // ---- Huruf ----
    'tools.huruf.title': 'Huruf — Harf aur Number',
    'tools.huruf.eyebrow': 'Harf aur Number',
    'tools.huruf.subtitle':
      '28 Arabi harf aur unki Abjad keemat. System aur school chunein, table khud badal jayega.',
    'tools.huruf.thLetter': 'Harf',
    'tools.huruf.thName': 'Naam',
    'tools.huruf.thValue': 'Keemat',
    'tools.huruf.tableNote': 'Yeh table standard Abjad keemat (mashriqi/maghribi) se bana hai. Kabir matlab poori keemat hai. Saghir matlab wahi keemat hai jo ek digit tak chhoti kar di gayi ho. Keemat ko Wikipedia ke “Abjad numerals” aur OpenArabic aur WiserWork ke abjad calculator se check kiya gaya hai. Dono school 22 harf par ek hain. Aur chhe harf par alag hain. Sad. Dad. Sin. Shin. Za. Ghayn.',
    'tools.huruf.howCounted': 'Harf kaise gine jate hain',
    'tools.huruf.mappingsTitle': 'Woh mapping jo hum abhi nahi dikhate',
    'tools.huruf.elementGroups': 'Anasir ke groups',
    'tools.huruf.luminous': 'Roshan aur andhere harf',
    'tools.huruf.planetLinks': 'Harf aur grah ka rishta',
    'tools.huruf.sourceNeeded': 'Source chahiye. Is mapping ke liye abhi koi source nahi bataya gaya.',

    // ---- Asma ----
    'tools.asma.title': 'Asma — 99 Naam',
    'tools.asma.eyebrow': '99 Naam',
    'tools.asma.subtitle':
      'Naam ko Arabi, transliteration ya matlab se dhoondhein. Keemat pehle se Kabir Mashriqi par hai. Neeche system ya school badlein, keemat khud badal jayegi.',
    'tools.asma.reckonTitle': 'Kisi naam ka hisaab lagayein',
    'tools.asma.reckonLabel': 'Koi naam ya text likhein',
    'tools.asma.reckonPlaceholder': 'jaise Rahman',
    'tools.asma.noArabic': 'Is text mein koi Arabi harf nahi mila.',
    'tools.asma.searchPlaceholder': 'Arabi, transliteration ya matlab se dhoondhein…',
    'tools.asma.searchAria': '99 Naam dhoondhein',
    'tools.asma.noNames': '“{q}” se koi naam nahi mila.',
    'tools.asma.bare': 'Bare',
    'tools.asma.withAl': '“al-” ke saath',
    'tools.asma.saveAria': '{name} ko Grimoire mein save karein',
    'tools.asma.sourceNote':
      'List Ar-Rahman se shuru hokar As-Sabur par khatm hoti hai; Allah ka apna naam in 99 mein gina nahi gaya.',

    // ---- Bast ----
    'tools.bast.title': 'Bast — Kisi Text ko Kholna',
    'tools.bast.eyebrow': 'Text ko Kholna',
    'tools.bast.subtitle':
      'Koi bhi text likhein aur use harf dar harf khula hua dekhein, har harf ki keemat aur chalte hue jod ke saath.',
    'tools.bast.yourText': 'Aapka text',
    'tools.bast.placeholder': 'Yahan Arabi text likhein…',
    'tools.bast.countedAs': 'Is tarah gina gaya:',
    'tools.bast.empty': 'Abhi kholne ke liye kuch nahi hai. Upar kuch likhein, ya misaal try karein.',
    'tools.bast.tryExample': 'Misaal try karein:',
    'tools.bast.thHash': '#',
    'tools.bast.thLetter': 'Harf',
    'tools.bast.thKabir': 'Kabir',
    'tools.bast.thSaghir': 'Saghir',
    'tools.bast.thRunning': 'Chalta hua jod',
    'tools.bast.saveUnfolding': 'Is unfolding ko Grimoire mein save karein',
    'tools.bast.howCounted': 'Text kaise gina jata hai',

    // ---- Fawatih ----
    'tools.fawatih.title': 'Fawatih (Shuru ke Harf)',
    'tools.fawatih.eyebrow': 'Harf aur Number',
    'tools.fawatih.subtitle':
      'Chaudah harf wali shaklein 29 suraton ko kholti hain. Neeche wali shaklein har surah ki pehli aayat par ek rule chalakar mili hain. Yeh text se nikli hain, haath se likhi nahi gayi.',
    'tools.fawatih.summary':
      '{total} suratein alag-alag harf se khulti hain, {forms} alag shaklon mein. System aur school chunein, keemat badal jayegi. “Say it” wala column har shakl ko Latin harf mein padhkar sunata hai, taaki aap Arabi jaane bina bhi use bol sakein.',
    'tools.fawatih.thForm': 'Shakl',
    'tools.fawatih.thSayIt': 'Bolein',
    'tools.fawatih.thSurahs': 'Kin suraton ko kholti hai',
    'tools.fawatih.thValue': 'Keemat',
    'tools.fawatih.howFound': 'Yeh kaise mili',
    'tools.fawatih.howFoundBody': 'Yahan jo Quran ka text use hota hai, woh poori tarah vocalised hai. Har aam lafz par vowel ke nishan hain. Jo lafz bilkul bina vowel nishan ke ho, woh surah ke shuru mein saaf nazar aata hai. Us par sirf lamba karne wala nishan (maddah) ho sakta hai. Ya koi nishan nahi. Aur woh ek se paanch harf ka hota hai. Rule yeh hai. Har surah ki pehli aayat ka pehla lafz liya jata hai. Basmalah ke baad. Jahan Basmalah prefix hai, aayat nahi. Aur use sirf tab rakha jata hai jab woh aisa khaali lafz ho. Is rule se bilkul 29 suratein aur 14 shaklein milti hain. Aam pehle lafz, jaise Surah 71 mein “inna” ya Surah 75 mein “la”, par vowel nishan hote hain. Isliye woh nahi liye jate. Surah 42 woh ek case hai jahan harf do aayaton par chalte hain. Ha Mim aayat 1 ko kholta hai. Aur Ayn Sin Qaf poori aayat 2 hai.',
    'tools.fawatih.basmalahBody': 'Basmalah Surah al-Fatiha ki aayat 1 hai. Isliye woh us surah ke text mein rehti hai. Baaki suraton mein woh chhape hue text mein prefix hai, aayat nahi. Isliye rule use pehle hata deta hai.',
    'tools.fawatih.notSay': 'Yeh page kya nahi kehta',
    'tools.fawatih.notSayBody': 'Is page par dikhaya gaya hai ki kaun se harf kin suraton ko kholte hain. Aur harf ka jod kya banta hai. Harf ka matlab kya hai, yeh nahi bataya gaya. Matlab ke liye abhi koi source nahi bataya gaya. Isliye koi matlab nahi diya gaya. Shaklein waisi hi dikhayi gayi hain jaisi suraton ke shuru mein aati hain. Isse zyada kuch nahi.',
    'tools.fawatih.sourceTail':
      'Shaklein aur keemat usi text se run time par nikli hain; test suite check karta hai ki nateeja 29 suratein, 14 shaklein aur bilkul wahi mapping hai jo upar dikhayi gayi hai.',

    // ---- Sawaqit ----
    'tools.sawaqit.title': 'Sawaqit (Saat Gayab Harf)',
    'tools.sawaqit.eyebrow': 'Harf aur Number',
    'tools.sawaqit.subtitle':
      'Alfabet ke saat harf al-Fatiha mein kahin nahi aate. Neeche wale harf Fatiha ke harf gin kar mile hain. Yeh text se nikle hain, haath se likhe nahi gaye.',
    'tools.sawaqit.textCounted': 'Jo text gina gaya',
    'tools.sawaqit.textCountedBody': 'Al-Fatiha gini gayi hai. Quran 1:1–7. Poori surah. Basmalah samet. Jo uski pehli aayat hai. Uthmani text mein jaise likhi hai, usmein 29 lafz aur 139 harf hain. Arabi ke neeche wali Latin linein use padhkar sunati hain. Taaki aap Arabi jaane bina bhi saath chal sakein.',
    'tools.sawaqit.lettersUsed': 'Woh 21 harf jo Fatiha mein aate hain',
    'tools.sawaqit.lettersUsedBody': 'Abjad ke order mein dikhaya gaya hai. Alfabet ka har doosra harf surah mein kam se kam ek baar aata hai.',
    'tools.sawaqit.thAbsent': 'Gayab harf',
    'tools.sawaqit.thName': 'Naam',
    'tools.sawaqit.thValue': 'Keemat',
    'tools.sawaqit.footerTotal': 'Saat gayab harf ka jod',
    'tools.sawaqit.sumsBody': 'Saat gayab harf ka jod Kabir Mashriqi mein 2,390 banta hai. Kabir Maghribi mein 2,990. Fark sirf Shin harf ka hai. Purbi table mein 300. Paschimi table mein 1,000.',
    'tools.sawaqit.namesTitle': 'Saat harf ke Naam',
    'tools.sawaqit.namesBody': 'Kitabein har gayab harf ke liye Allah ka ek Naam deti hain. Saat naam usi order mein hain jis order mein kitabein deti hain. Fa. Jim. Shin. Tha. Za. Kha. Zay. Pehli awaazon se yaad rakhein. Fa-Ja-Sha-Tha-Za-Kha-Za. Jo do harf “z” jaise sunayi dete hain, woh alag harf hain. Za’ (ظ) aur Zay (ز).',
    'tools.sawaqit.thLetter': 'Harf',
    'tools.sawaqit.thName2': 'Naam',
    'tools.sawaqit.thAlso': 'Is tarah bhi diya gaya',
    'tools.sawaqit.sourceTail':
      'Ginti usi text se run time par hui hai; test suite check karta hai ki nateeja wahi saat harf hain jo upar dikhaye gaye hain.',

    // ---- Shields ----
    'tools.shields.title': 'Shields (Chalta Hua Harf ka Jod)',
    'tools.shields.eyebrow': 'Harf aur Number',
    'tools.shields.subtitle':
      'Paanch chhote text, lafz dar lafz gine hue. Har row mein ek lafz, uski keemat aur chalta hua jod hai, taaki aap hisaab ko kul jod tak follow kar sakein.',
    'tools.shields.spellingTitle': 'Spelling par ek note',
    'tools.shields.spellingBody1': 'Jod Uthmani text jaise likha hai waise hi gina gaya hai. Shadda samet. Shadda apne harf ko double kar deta hai. Isliye al-Rahman yahan 529 banta hai. Jabki bina shadda wali seedhi spelling Asma page par 329 banti hai. Dono mein ginne ke rule ek hi hain. Fark text ki spelling ka hai. Rule ka nahi. Basmalah al-Fatiha ki aayat 1 hai. Isliye woh Fatiha mein gini gayi hai. al-Ikhlas, al-Falaq aur al-Nas mein Basmalah un suraton ki aayat nahi hai. Isliye unmein nahi gini gayi.',
    'tools.shields.spellingBody2': 'Latin linein har text ko padhkar sunati hain. Taaki aap Arabi jaane bina bhi saath chal sakein. Is reading mein AA harf ayn hai. Aur th harf tha hai. “al” ka l sun letters se pehle bhi likha rehta hai. Isliye ar-Rahman, alrrahman padha jata hai.',
    'tools.shields.thHash': '#',
    'tools.shields.thWord': 'Lafz',
    'tools.shields.thSayIt': 'Bolein',
    'tools.shields.thValue': 'Keemat',
    'tools.shields.thRunning': 'Chalta hua jod',
    'tools.shields.grandTotalWords': 'Kul jod ({n} lafz)',
    'tools.shields.saveTotal': 'Is kul jod ko Grimoire mein save karein',
    'tools.shields.sourceTail':
      'Jod usi text se run time par nikle hain; test suite paanchon jod ko dono system aur dono school mein check karta hai.',

    // ---- Journal ----
    'tools.journal.title': 'Journal — Padhne ke Notes',
    'tools.journal.eyebrow': 'Padhne ke Notes',
    'tools.journal.subtitle': 'Jo padha, us par notes. Sirf is device par rehte hain.',
    'tools.journal.deviceNote': 'Jo bhi aap yahan likhte hain, sirf is device par rehta hai. Kahin nahi bheja jata.',
    'tools.journal.editNote': 'Note badlein',
    'tools.journal.newNote': 'Naya note',
    'tools.journal.titleLabel': 'Title',
    'tools.journal.titlePlaceholder': 'Yeh note kis baare mein hai?',
    'tools.journal.noteLabel': 'Note',
    'tools.journal.notePlaceholder': 'Jo seekha, jo sawal hai, ya jo quote yaad rakhna hai, woh likhein…',
    'tools.journal.addNote': 'Note jodein',
    'tools.journal.saveChanges': 'Badlaav save karein',
    'tools.journal.importAria': 'Journal ki JSON file import karein',
    'tools.journal.empty': 'Abhi koi note nahi hai. Upar se apna pehla note jodein.',
    'tools.journal.editAria': '{title} ko badlein',
    'tools.journal.deleteAria': '{title} ko hatayein',
    'tools.journal.edited': '{date} ko badla gaya',
    'tools.journal.emptySubmit': 'Pehle title ya kuch text likhein',
    'tools.journal.updated': 'Note update ho gaya',
    'tools.journal.added': 'Note jud gaya',
    'tools.journal.deleted': 'Note hata diya gaya',
    'tools.journal.exported': 'Journal export ho gaya',
    'tools.journal.importedOne': '1 note import hua',
    'tools.journal.importedMany': '{n} notes import hue',

    // ---- Wird ----
    'tools.wird.title': 'Wird — Zikr Counter',
    'tools.wird.eyebrow': 'Zikr Counter',
    'tools.wird.subtitle': 'Ek seedha counter. Koi phrase chunein, bade button ko dabayein, aur chahein to target set karein.',
    'tools.wird.deviceNote': 'Jo bhi aap yahan ginte hain, sirf is device par rehta hai. Kahin nahi bheja jata.',
    'tools.wird.choosePhrase': 'Phrase chunein',
    'tools.wird.addPhraseLabel': 'Apni phrase jodein',
    'tools.wird.addPhrasePlaceholder': 'Apni phrase jodein…',
    'tools.wird.addAria': 'Phrase jodein',
    'tools.wird.ofTarget': '{target} mein se {count} · {progress}%',
    'tools.wird.progressAria': '{target} tak ki progress',
    'tools.wird.tapBtn': 'Ginne ke liye dabayein',
    'tools.wird.countAria': '{phrase} ke liye ek ginein',
    'tools.wird.targetLabel': 'Target',
    'tools.wird.resetPhrase': 'Is phrase ko zero karein',
    'tools.wird.resetAll': 'Sab zero karein',
    'tools.wird.resetPhraseToast': '{phrase} zero kar diya',
    'tools.wird.resetAllToast': 'Saari ginti zero kar di',
    'tools.wird.phraseAdded': 'Phrase jud gayi',

    // ---- Grimoire ----
    'tools.grimoire.title': 'Grimoire — Save Ki Hui Cheezein',
    'tools.grimoire.eyebrow': 'Save Ki Hui Cheezein',
    'tools.grimoire.subtitle': 'Naam, khule hue text aur notes jo aapne doosre tools se save kiye, sab ek jagah.',
    'tools.grimoire.deviceNote': 'Jo bhi aap yahan save karte hain, sirf is device par rehta hai. Kahin nahi bheja jata.',
    'tools.grimoire.addNoteTitle': 'Note jodein',
    'tools.grimoire.titleLabel': 'Title',
    'tools.grimoire.titlePlaceholder': 'Yeh kis baare mein hai?',
    'tools.grimoire.detailLabel': 'Detail',
    'tools.grimoire.detailPlaceholder': 'Jo detail rakhni hai, woh likhein…',
    'tools.grimoire.saveNote': 'Note save karein',
    'tools.grimoire.importAria': 'Grimoire ki JSON file import karein',
    'tools.grimoire.empty':
      'Abhi kuch save nahi hua. Asma page se koi Naam, Bast page se koi unfolding save karein, ya upar se note jodein.',
    'tools.grimoire.kindName': 'Naam',
    'tools.grimoire.kindBast': 'Khula hua text',
    'tools.grimoire.kindNote': 'Note',
    'tools.grimoire.deleteAria': '{title} ko hatayein',
    'tools.grimoire.emptySubmit': 'Pehle title ya kuch detail likhein',
    'tools.grimoire.saved': 'Note Grimoire mein save ho gaya',
    'tools.grimoire.deleted': 'Cheez hata di gayi',
    'tools.grimoire.exported': 'Grimoire export ho gaya',
    'tools.grimoire.importedOne': '1 cheez import hui',
    'tools.grimoire.importedMany': '{n} cheezein import hui',

    // ---- Today ----
    'tools.today.title': 'Aaj',
    'tools.today.eyebrow': 'Waqt aur Aasmaan',
    'tools.today.subtitle':
      'Aaj ke din ki baatein: tareekh, aaj ka hakim, aur jis planetary hour mein hum abhi hain.',
    'tools.today.hijriLabel': 'Hijri tareekh (andaaze se):',
    'tools.today.hijriApprox': 'Yeh tareekh andaaze se hai. Yeh civil calendar hai, chaand dekh kar tay ki hui tareekh nahi.',
    'tools.today.rulerTitle': 'Aaj ka hakim',
    'tools.today.rulerBodyA':
      'din ke pehle hour ka hakim hai, isliye wahi aaj ke din ka hakim hai. Din suraj nikalne se gina jata hai: suraj nikalne se ek pal pehle ka waqt pichhle din ka hota hai.',
    'tools.today.dayRulersNote': 'Din ke hakim aise hain. Itwaar Suraj. Somvaar Chaand. Mangalvaar Mangal. Budhvaar Budh. Guruvaar Guru. Shukravaar Shukra. Shanivaar Shani. Source: Wikipedia, “Planetary hours”.',
    'tools.today.currentTitle': 'Is waqt ka hour',
    'tools.today.hourLineA': '24 mein se {n}wa hour ({dayNight} hour), hakim hai',
    'tools.today.approxNote':
      'Andaaze wale hour hain, asli nahi. Koi location set nahi hai, isliye yeh hour fixed 06:00–18:00 hisse par hain. Asli hour ke liye Planetary Hours page par location set karein.',
    'tools.today.realNote':
      'Asli hour hain, {label} ke liye. Hour barabar nahi hote: din ka har hour suraj nikalne se doobne tak ka baarahwan hissa hai, raat ka har hour suraj doobne se agle suraj nikalne tak ka baarahwan hissa hai.',
    'tools.today.unavailable': 'Is jagah aur is din ke liye planetary hour nahi nikal sakte: {reason}',
    'tools.today.defaultReason': 'Is jagah aur is din ke liye suraj nikalna ya doobna nahi nikala ja saka.',
    'tools.today.yourSavedLocation': 'aapki saved location',
    'tools.today.locationLine': 'Location: {label} ({lat}, {lon}, {tz}).',
    'tools.today.noLocation':
      'Koi location set nahi hai. Waqt device ke time zone aur andaaze wale 06:00–18:00 hisse se hai. Planetary Hours page par location set karein.',
    'tools.today.locationTail':
      'Kuch bhi kahin nahi bheja jata. Location sirf is device par save hai. Yahan namaz ke waqt nahi hain.',

    // ---- Hours ----
    'tools.hours.title': 'Planetary Hours',
    'tools.hours.eyebrow': 'Waqt aur Aasmaan',
    'tools.hours.subtitle':
      'Din ke 24 hour, har ek par Chaldean order se ek grah ka raaj. Din ke hour suraj nikalne se doobne tak, raat ke hour suraj doobne se agle suraj nikalne tak. Isliye hour barabar nahi hote.',
    'tools.hours.locationTitle': 'Location',
    'tools.hours.usingLocation': '{label} use ho raha hai ({lat}, {lon}, {tz}).',
    'tools.hours.noLocation':
      'Koi location set nahi hai. Neeche wale hour fixed 06:00–18:00 hisse par hain. Andaaze wale, asli nahi.',
    'tools.hours.pickCity': 'Sheher chunein',
    'tools.hours.chooseCity': 'Sheher chunein…',
    'tools.hours.lat': 'Latitude',
    'tools.hours.lon': 'Longitude',
    'tools.hours.useLatLon': 'Is latitude aur longitude ko use karein',
    'tools.hours.useMyLocation': 'Meri location use karein',
    'tools.hours.clearLocation': 'Location hatayein',
    'tools.hours.privacyNote': 'Aapki location sirf is device par suraj nikalne aur doobne ka waqt nikalne ke liye use hoti hai. Use kahin nahi bheja jata. “Meri location use karein” pehle aapke browser se poochhta hai. Aap mana karke sheher chun sakte hain ya coordinates likh sakte hain. Koi bahari geocoding ya timezone service use nahi hoti.',
    'tools.hours.dayRuler': 'Din ka hakim:',
    'tools.hours.sunrise': 'Suraj nikalna',
    'tools.hours.sunset': 'Suraj doobna',
    'tools.hours.approxBox':
      'Andaaze wale hour hain, asli nahi. Koi location set nahi hai, isliye is table mein {tz} mein fixed 06:00–18:00 hissa use hua hai. Asli hour ke liye upar location set karein.',
    'tools.hours.realNote':
      'Hour barabar nahi hote: din ka har hour suraj nikalne se doobne tak ka baarahwan hissa hai, raat ka har hour suraj doobne se agle suraj nikalne tak ka baarahwan hissa hai. Din suraj nikalne se gina jata hai, isliye suraj nikalne se ek pal pehle ka waqt pichhle din ka hota hai. Waqt Astronomy Engine library se nikala gaya hai; time zone Intl se sambhala jata hai, isliye daylight saving bhi follow hota hai.',
    'tools.hours.thHour': 'Hour',
    'tools.hours.thTime': 'Waqt',
    'tools.hours.thRuler': 'Hakim',
    'tools.hours.thDayNight': 'Din / raat',
    'tools.hours.nowSuffix': ' — abhi',
    'tools.hours.unavailableTitle': 'Is jagah aur is din ke liye planetary hour nahi nikal sakte:',
    'tools.hours.unavailableDefault':
      'suraj is waqt ke aas-paas na nikalta hai na doobta hai (polar din ya raat), isliye suraj nikalna ya doobna hi nahi hai jise hour mein baanta ja sake.',
    'tools.hours.unavailableTail': 'Koi hour banaye nahi jate. Koi aur jagah ya din chunein.',
    'tools.hours.methodNote': 'Method yeh hai. Astronomy Engine (Suraj ke liye SearchRiseSet). Chaldean order matlab grahon ka purana order. Shani. Guru. Mangal. Suraj. Shukra. Budh. Chaand. Din ka pehla hour hi din ka hakim hota hai. Source: Wikipedia, “Planetary hours”.',
    'tools.hours.geoSaved': 'Location is device par save ho gayi: {label}.',
    'tools.hours.geoInvalid':
      'Woh location sahi nahi hai. Latitude -90 se 90 ke beech aur longitude -180 se 180 ke beech hona chahiye.',
    'tools.hours.geoTypeNumbers': 'Latitude ke liye ek number aur longitude ke liye ek number likhein.',
    'tools.hours.geoNoGeo': 'Yeh browser geolocation nahi deta.',
    'tools.hours.geoAsking': 'Aapki location poochhi ja rahi hai…',
    'tools.hours.geoNotShared': 'Location share nahi hui. Sheher chunein ya latitude aur longitude likhein.',
    'tools.hours.geoCleared': 'Location hata di gayi. Hour ab andaaze wale 06:00–18:00 hisse par hain.',
    'tools.hours.geoManual': 'Manual ({lat}, {lon})',
    'tools.hours.geoMyLocation': 'Meri location ({lat}, {lon})',

    // ---- Moon ----
    'tools.moon.title': 'Chaand',
    'tools.moon.eyebrow': 'Waqt aur Aasmaan',
    'tools.moon.subtitle':
      'Chaand ki phase, woh kitna roshan hai, chaand ka din, aur woh kis manzil mein hai.',
    'tools.moon.phaseAngle': 'Phase angle',
    'tools.moon.illumination': 'Roshni',
    'tools.moon.lunarDay': 'Chaand ka din',
    'tools.moon.lunarDayValue': '30 mein se {n}wa din',
    'tools.moon.longitude': 'Chaand ki ecliptic longitude',
    'tools.moon.methodNote': 'Method: {method}. Phase angle 0° naya chaand hai, 180° poora chaand hai.',
    'tools.moon.currentMansion': 'Is waqt ki manzil',
    'tools.moon.alsoCalled': '(ise {name} bhi kehte hain)',
    'tools.moon.footer': 'Yeh sirf gine hue facts hain. Yeh batate hain ki Chaand kahan hai aur kitna roshan hai. Yahan kuch nahi bataya gaya ki iska kisi din ya kisi insaan ke liye kya matlab hai.',

    // ---- Mansions ----
    'tools.mansions.title': 'Lunar Mansions',
    'tools.mansions.eyebrow': 'Waqt aur Aasmaan',
    'tools.mansions.subtitle':
      'Chaand ki 28 manzilein (manazil al-qamar). Aaj ki manzil highlight hai; neeche wala start point ek convention hai jise aap badal sakte hain.',
    'tools.mansions.todayTitle': 'Aaj ki manzil',
    'tools.mansions.todayBodyA': 'Chaand {deg} ecliptic longitude par hai, manzil hai',
    'tools.mansions.todayOffset': '(start offset {offset}° ke saath)',
    'tools.mansions.offsetLabel': 'Start offset (degrees). Ye ek convention hai. Pakki baat nahi.',
    'tools.mansions.offsetNote': 'Neeche wali table convention se 0° par al-Sharatayn se shuru hoti hai. Agar aap offset 5° set karein, to start point 5° ho jata hai. Isliye har manzil ki range 5° badal jati hai. Doosri traditions ginti kahin aur se shuru karti hain. Yeh control aapko unka start point use karne deta hai. Chaand ki position khud Astronomy Engine se aati hai.',
    'tools.mansions.thHash': '#',
    'tools.mansions.thMansion': 'Manzil',
    'tools.mansions.thArabic': 'Arabi',
    'tools.mansions.thDegrees': 'Degrees',
    'tools.mansions.todaySuffix': ' — aaj',
    'tools.mansions.alsoPrefix': 'ise ',
    'tools.mansions.footerTail':
      'Har manzil 360 / 28 = lagbhag 12.857° ki hoti hai. Yeh list ek purani table hai, aaj ka astronomical fact nahi.',

    // ---- Falak ----
    'tools.falak.title': 'Falak — Baarah Rashi',
    'tools.falak.eyebrow': 'Waqt aur Aasmaan',
    'tools.falak.subtitle':
      'Tropical zodiac ki baarah rashiyan, aaj Suraj kis rashi mein hai, uske saath. Padhai ke liye ek table. Yahan kuch nahi kehta ki kisi rashi ka kisi insaan ke liye kya matlab hai.',
    'tools.falak.sunSignTitle': 'Aaj Suraj ki rashi',
    'tools.falak.sunSignBodyA': 'Suraj {deg}° ecliptic longitude par hai, rashi hai',
    'tools.falak.methodNote':
      'Astronomy Engine se nikala gaya (Suraj ki ecliptic longitude, SunPosition). {convention}',
    'tools.falak.thHash': '#',
    'tools.falak.thSign': 'Rashi',
    'tools.falak.thArabic': 'Arabi',
    'tools.falak.thDates': 'Tareekhein (andaaze se)',
    'tools.falak.thElement': 'Anasir',
    'tools.falak.thDegrees': 'Degrees',
    'tools.falak.todaySuffix': ' — aaj',
    'tools.falak.footer': 'Anasir purani Western grouping se dikhaye gaye hain. Aag matlab Mesh, Singh, Dhanu. Mitti matlab Vrishabh, Kanya, Makar. Hawa matlab Mithun, Tula, Kumbh. Paani matlab Kark, Vrishchik, Meen. Source: {source}. Tareekhein andaaze se hain. Saal dar saal ek din aage-peeche hoti hain. Kyunki equinox khud badalta hai.',

    // ---- Majlis ----
    'tools.majlis.title': 'Majlis',
    'tools.majlis.eyebrow': 'Waqt aur Aasmaan',
    'tools.majlis.subtitle':
      'Is pal ki baatein, ek jagah: aap kahan hain, aaj ka hakim, is waqt ka hour, aur Chaand.',
    'tools.majlis.locationTitle': 'Location',
    'tools.majlis.noLocation':
      'Koi location set nahi hai. Neeche wale hour andaaze wale 06:00–18:00 hisse par hain. Planetary Hours page par location set karein.',
    'tools.majlis.locationNote': 'Location sirf is device par save hai. Kuch bhi kahin nahi bheja jata.',
    'tools.majlis.rulerTitle': 'Aaj ka hakim',
    'tools.majlis.rulerBodyA': 'din ke pehle hour ka hakim hai.',
    'tools.majlis.currentTitle': 'Is waqt ka hour',
    'tools.majlis.approxNote': 'Andaaze wale hour hain, asli nahi. Koi location set nahi hai.',
    'tools.majlis.unavailable': 'Is jagah aur is din ke liye planetary hour nahi nikal sakte: {reason}',
    'tools.majlis.moonTitle': 'Chaand',
    'tools.majlis.moonLine': '{phase}, {pct}% roshan, chaand ka {day}wa din, 30 mein se.',
    'tools.majlis.mansionLabel': 'Manzil:',
    'tools.majlis.methodNote':
      'Method: {method}. Manzil ka hissa (0° al-Sharatayn se 28 barabar hisse) ek convention hai; Lunar Mansions page dekhein.',
    'tools.majlis.footer': 'Is page par bas itna hi kaha gaya hai. Waqt aur aasmaan ki baatein. Din ko score nahi kiya jata. Kuch recommend nahi kiya jata. Aur nahi kaha jata ki kya karein.',

    // ---- Forge ----
    'tools.forge.title': 'Wafq Forge — Magic Squares',
    'tools.forge.eyebrow': 'Squares aur Seals',
    'tools.forge.subtitle':
      'Order 3 se 20 tak ka magic square banayein, ek target sum par, phir use line dar line check karein. Square tabhi pass mana jata hai jab har row, column aur diagonal ka jod barabar ho.',
    'tools.forge.orderLabel': 'Order (square ka size)',
    'tools.forge.order2': '2 — mumkin nahi',
    'tools.forge.order2Title': 'Order 2 ka koi magic square nahi hota.',
    'tools.forge.kindOdd': 'Odd order. Siamese method (de la Loubère) se banta hai.',
    'tools.forge.kindDoubly': 'Doubly even order (4 se divide hota hai). Complement method se banta hai.',
    'tools.forge.kindSingly': 'Singly even order (even, 4 se divide nahi hota). LUX method (Conway) se banta hai.',
    'tools.forge.targetLabel': 'Target sum (default: base constant {n})',
    'tools.forge.targetNote':
      'Target ko {base} se {order} ke multiple se alag hona chahiye, aur {base} se kam nahi hona chahiye. Warna square mana kar diya jata hai, zabardasti nahi banaya jata.',
    'tools.forge.generate': 'Square banayein',
    'tools.forge.refusalPrefix': 'Yeh square nahi ban sakta:',
    'tools.forge.squareTitle': '{order}x{order} square — target {target}',
    'tools.forge.methodLineA': 'Method: {method}. Base constant {base}',
    'tools.forge.shiftSuffix': ', har cell mein {n} se badla hua.',
    'tools.forge.noShift': ', koi badlaav nahi.',
    'tools.forge.shownNote': 'Square upar, is page par poora dikhaya gaya hai. Use dekhne ya use karne ke liye download ki zaroorat nahi.',
    'tools.forge.copyBtn': 'Square copy karein',
    'tools.forge.validationTitle': 'Validation — generator se alag check',
    'tools.forge.passBody':
      'Har row, har column aur dono diagonal ka jod {target} hai, aur saare {n} number alag-alag positive whole number hain.',
    'tools.forge.thLine': 'Line',
    'tools.forge.thSum': 'Jod',
    'tools.forge.thTarget': 'Target',
    'tools.forge.rowLabel': 'Row {n}',
    'tools.forge.colLabel': 'Column {n}',
    'tools.forge.diag1': 'Diagonal, upar-bayein se neeche-dayein',
    'tools.forge.diag2': 'Diagonal, upar-dayein se neeche-bayein',
    'tools.forge.distinctLine': 'Saare number alag hain: {yesNo}.',
    'tools.forge.sealTitle': 'Seal frame aur plate',
    'tools.forge.sealBody':
      'Framed seal neeche, is page par dikhaya gaya hai. Use text ke roop mein copy karein, image ke roop mein save karein, ya framed SVG download karein. Print ka option bhi hai. Yeh sab tabhi khulte hain jab square validation pass kare.',
    'tools.forge.framedAria': 'Framed {order} by {order} magic square, har line ka jod {target} hai',
    'tools.forge.gridAria': '{order} by {order} magic square',
    'tools.forge.printA2': 'A2 plate ke roop mein print karein (420 x 594 mm proportions)',
    'tools.forge.saveImage': 'Image ke roop mein save karein',
    'tools.forge.downloadSvg': 'Framed SVG download karein',
    'tools.forge.printPlate': 'Plate print karein',
    'tools.forge.exportOff': 'Export aur print tab tak band rehte hain jab tak square pass na kare.',
    'tools.forge.svgCaption': '{order} x {order} — har line ka jod {target} hai — {method}',
    'tools.forge.constructions': 'Constructions: {source}.',

    // ---- Qawaid ----
    'tools.qawaid.title': 'Qawa’id — Square ke Usool',
    'tools.qawaid.eyebrow': 'Squares aur Seals',
    'tools.qawaid.subtitle':
      'Square kaise banta hai, target sum kab mil sakta hai, use kaise check kiya jata hai, aur kya mana kar diya jata hai.',
    'tools.qawaid.whatTitle': 'Magic square kya hai',
    'tools.qawaid.whatBody': 'Magic square aise samjha jata hai. Ye number ka ek grid hai. Har row, har column aur dono diagonal ka jod ek hi number hota hai. Us number ko magic constant ya target sum kehte hain. Order matlab ek side mein kitne cell hain. 3x3 square order 3 hai. 4x4 square order 4 hai. Aur aise hi aage. 1 se n squared tak ke number wale square ke liye constant hai n times (n squared plus 1), divide by 2. Isliye 3x3 square ka jod 15. 4x4 ka 34. 5x5 ka 65. Aur 9x9 ka 369 hota hai.',
    'tools.qawaid.methodTitle': 'Har order type ka method',
    'tools.qawaid.methodIntro': 'Order teen type mein baanta jata hai. Har type ka apna documented construction hai. Forge mein pehle 1 se n squared tak ke number wala base square banaya jata hai. Phir use target sum tak shift kiya jata hai. Neeche reachability rule dekhein.',
    'tools.qawaid.oddTitle': 'Odd orders (3, 5, 7, 9, 11, 13, 15, 17, 19) — {method}',
    'tools.qawaid.oddBody':
      '1 se shuru karein, upar wali row ke beech wale cell mein. Phir ek row upar aur ek column dayein badhein, grid se bahar jayein to kinaron se wapas aayein. Agar agla cell pehle se bhara ho, to current cell se ek row neeche badhein. Aise hi chalte rahein jab tak har cell mein number na aa jaye.',
    'tools.qawaid.doublyTitle': 'Doubly even orders (4, 8, 12, 16, 20) — {method}',
    'tools.qawaid.doublyBody':
      '1 se n squared tak ke number row dar row likhein. Phir har 4x4 block mein, jo number us block ke diagonal par hai, use uske complement se badal dein: n squared plus 1 minus woh number. Diagonal se bahar wale number jaise hain waise hi rehte hain.',
    'tools.qawaid.singlyTitle': 'Singly even orders (6, 10, 14, 18) — {method}',
    'tools.qawaid.singlyBody':
      'L, U aur X harf ki ek array banayein, finished square ke har 2x2 block ke liye ek harf. Har block mein chaar lagatar number bharein, letter array par Siamese method wale upar-dayein order mein chal kar, upar wali row ke beech wale block se shuru karein. Har harf batata hai ki chaar number uske 2x2 block ke andar kis order mein aayenge: L bharta hai upar-dayein, neeche-bayein, neeche-dayein, upar-bayein; U bharta hai upar-bayein, neeche-bayein, neeche-dayein, upar-dayein; X bharta hai upar-bayein, neeche-dayein, neeche-bayein, upar-dayein. Harf is tarah lagaye gaye hain ki finished square ki har line ka jod barabar ho.',
    'tools.qawaid.sourceNote': 'Source: {source}.',
    'tools.qawaid.reachTitle': 'Reachability rule',
    'tools.qawaid.reachBody': 'Base square ke jod ko uska constant M kehte hain. Har cell mein ek hi whole number d jodne se har line mein n times d jud jata hai. Isliye target T tabhi bilkul mil sakta hai jab (T minus M) divide by n ek whole number ho. Aur d negative na ho. Base square ka sabse chhota cell 1 hai. Isliye negative shift se koi cell zero ya negative ho jayega. Aur use mana kar diya jata hai.',
    'tools.qawaid.reachEx1': '3x3, target 27: shift hai (27 minus 15) / 3 = 4, isliye cell 5 se 13 tak chalenge. Allowed.',
    'tools.qawaid.reachEx2': '3x3, target 18: shift hai (18 minus 15) / 3 = 1, isliye cell 2 se 10 tak chalenge. Allowed.',
    'tools.qawaid.reachEx3': '3x3, target 16: shift hota 1 / 3, jo whole number nahi hai. Mana kar diya gaya.',
    'tools.qawaid.reachEx4': '3x3, target 12: shift hota minus 1, jisse ek cell zero ho jata. Mana kar diya gaya.',
    'tools.qawaid.reachEx5': '4x4, target 35: shift hota 1 / 4, jo whole number nahi hai. Mana kar diya gaya.',
    'tools.qawaid.refusedNote': 'Jab target ko mana kiya jata hai, to seedhe shabdon mein bata diya jata hai. Aur kuch nahi banaya jata. Shift ko kabhi round nahi kiya jata. Cell ko kabhi patch nahi kiya jata. Aur number ko repeat karke aisa result kabhi nahi banaya jata jo sirf sahi lage.',
    'tools.qawaid.validatorTitle': 'Validator kaise kaam karta hai',
    'tools.qawaid.validatorBody1': 'Validator generator se alag code hai. Use nahi bataya jata ki square kaise bana. Generator par kabhi bharosa nahi kiya jata. Jo grid diya gaya hai, use cell dar cell joda jata hai. Har row, har column aur dono diagonal ko target se check kiya jata hai. Aur yeh bhi check kiya jata hai ki har cell ek alag positive whole number hai. Ye haath se bane grid par bhi kaam karta hai. Sirf Forge ke banaye square par nahi.',
    'tools.qawaid.validatorBody2': 'Nateeja PASS ya FAIL ke roop mein dikhaya jata hai. Har line ka jod list ke saath. Taaki koi bhi dekh sake ki kaun si line galat hai. Aur kitne se galat hai. Export aur print sirf PASS ke baad khulte hain.',
    'tools.qawaid.refusedTitle': 'Kya mana kar diya jata hai aur kyun',
    'tools.qawaid.refused1': 'Order 2: order 2 ka koi magic square nahi hota.',
    'tools.qawaid.refused2': 'Order 3 se kam ya 20 se zyada: unke liye yahan koi construction implement aur test nahi hua hai.',
    'tools.qawaid.refused3': 'Aisa target jise shift se nahi milaya ja sakta (shift whole number nahi hai): mana kar diya jata hai, round nahi kiya jata.',
    'tools.qawaid.refused4': 'Base constant se kam target: mana kar diya jata hai, kyunki ek cell zero ya negative ho jayega.',
    'tools.qawaid.refused5': 'Aisa target jo whole positive number nahi hai: mana kar diya jata hai.',
    'tools.qawaid.modesTitle': 'Woh modes jo nahi bane hain',
    'tools.qawaid.modesIntro': 'Ye square modes nahi banaye jate. Kyunki unke liye koi rule aur worked example nahi diya gaya hai. Unhe yahan list kiya jata hai taaki kami saaf dikhe. Andaze se kuch nahi banaya jata.',
    'tools.qawaid.baseConstants': 'Base constants, reference ke liye:',

    // ---- Method ----
    'tools.method.title': 'Method — Yeh Tools Kaise Kaam Karte Hain',
    'tools.method.eyebrow': 'Kaise Kaam Karta Hai',
    'tools.method.subtitle':
      'Number kahan se aate hain, harf kaise gine jate hain, kya test hua hai, aur in tools ki limit kya hai.',
    'tools.method.whatTitle': 'Yeh tools kya karte hain',
    'tools.method.whatBody': 'Ye tools sirf padhai aur hisaab ke liye hain. In se harf ki keemat jodi jati hai. Padhne ke notes rakhe jate hain. Tap gine jate hain. Aur woh cheezein save ki jati hain jo rakhni hon. Ye kisi nateeje, hifazat, shifa ya rozi ka vaada nahi karte. Aur koi deeni faisla nahi dete. Inse kabhi kisi ko nuksaan mat pahunchayein.',
    'tools.method.sourcesTitle': 'Data ke sources',
    'tools.method.srcAbjadLabel': 'Abjad table: ',
    'tools.method.srcAbjadBody': 'Standard Abjad keemat (mashriqi/maghribi) use hoti hai. Mashriqi matlab purbi table. Maghribi matlab paschimi table. Inhe Wikipedia ke “Abjad numerals” aur OpenArabic aur WiserWork ke abjad calculator se check kiya gaya hai. Dono school 22 harf par ek hain. Chhe par alag hain (sad, dad, sin, shin, za, ghayn). Kabir matlab har harf ki poori keemat hai. Saghir matlab wahi keemat hai jo ek digit tak chhoti kar di gayi ho.',
    'tools.method.srcNamesLabel': '99 Naam: ',
    'tools.method.srcAstroLabel': 'Astronomy aur waqt: ',
    'tools.method.srcAstroBody': 'Maintained Astronomy Engine library (astronomy-engine) se suraj nikalna, suraj doobna, Chaand ki phase aur longitude, aur Suraj ki longitude nikali jati hai. Yahan koi astronomy formula haath se nahi likha gaya.',
    'tools.method.srcMansionsLabel': 'Lunar mansions: ',
    'tools.method.srcMansionsBody': 'Wikipedia ke “Lunar mansion” se liya gaya hai. Manazil al-qamar table. 28 stations jo al-Sharatayn se 0° par shuru hoti hain. Use 18 Nov 2026 ko check kiya gaya tha.',
    'tools.method.srcSignsLabel': 'Baarah rashiyan: ',
    'tools.method.srcSignsBody': 'Wikipedia ke “Astrological sign” se liya gaya hai. Western zodiac table. Tropical signs aur element triplicities. Use 18 Nov 2026 ko check kiya gaya tha.',
    'tools.method.srcPlanetsLabel': 'Grah aur din ke hakim: ',
    'tools.method.srcPlanetsBody': 'Wikipedia ke “Planetary hours” se liya gaya hai. Chaldean order matlab grahon ka purana order. Aur kaun sa grah kis weekday ka hakim hai. Arabi grah ke naam Wiktionary ke “Appendix:Planets” se liye gaye hain. Aur wahan quote kiya gaya al-Biruni ka list.',
    'tools.method.srcSquaresLabel': 'Magic squares: ',
    'tools.method.srcSquaresBody': 'Wikipedia ke “Magic square” aur “Conway’s LUX method for magic squares” se liya gaya hai. Constructions ko 18 Nov 2026 ko check kiya gaya tha.',
    'tools.method.srcNotesLabel': 'Aapke notes, ginti aur save ki hui cheezein: ',
    'tools.method.srcNotesBody': 'aapke likhe hue, sirf is device ki storage mein rehte hain. Kahin nahi bheje jate.',
    'tools.method.timeTitle': 'Waqt kaise nikala jata hai (Phase 2)',
    'tools.method.timeIntro': 'Planetary hour barabar nahi hote. Din suraj nikalne se shuru hota hai. 12 din ke hour suraj nikalne se doobne tak ko 12 barabar hisso mein baant te hain. 12 raat ke hour suraj doobne se agle suraj nikalne tak ko 12 barabar hisso mein baant te hain. Suraj nikalne se ek pal pehle ka waqt pichhle din ka hota hai. Uska hakim abhi bhi lagta hai. Din ka pehla hour us din ke grah ka hota hai. Uske baad hakim Chaldean order mein chalte hain. Chaldean order matlab grahon ka purana order. Shani. Guru. Mangal. Suraj. Shukra. Budh. Chaand.',
    'tools.method.timeLibLabel': 'Library: ',
    'tools.method.timeLibBody': 'Astronomy Engine (astronomy-engine) use hota hai. Ye ek maintained astronomy library hai. Time zone ko Intl aur jagah ke IANA zone se sambhala jata hai. Isliye daylight saving follow hota hai. Koi bahari geocoding ya timezone service use nahi hoti.',
    'tools.method.timeNoLocLabel': 'Koi location set nahi hai: ',
    'tools.method.timeNoLocBody': 'Hour fixed 06:00–18:00 hisse par chalte hain. Use saaf taur par “approximate, not real hours” likha jata hai.',
    'tools.method.timePolarLabel': 'Polar din ya raat: ',
    'tools.method.timePolarBody': 'Jahan Suraj na nikalta hai na doobta hai, wahan hour ko wajah ke saath unavailable dikhaya jata hai. Woh kabhi banaye nahi jate.',
    'tools.method.timeLocLabel': 'Location: ',
    'tools.method.timeLocBody': 'Location bundled city list se chuni jati hai. Latitude aur longitude likh kar. Ya browser se share karke. Sirf is device par. Use kahin nahi bheja jata.',
    'tools.method.timeHijriLabel': 'Hijri tareekh: ',
    'tools.method.timeHijriBody': 'Islamic civil calendar (Intl, Kuwaiti algorithm) use hota hai. Yeh andaaze se hai. Asli mahine chaand dekhne par hote hain. Aur ek-do din aage-peeche ho sakte hain.',
    'tools.method.timeMansionsLabel': 'Lunar mansions: ',
    'tools.method.timeMansionsBody': '28 barabar hisse hain. Lagbhag 12.857° ke. 0° par al-Sharatayn se shuru. Yeh ek convention hai. Universal fact nahi. Doosri traditions ginti kahin aur se shuru karti hain. Mansions page aapko start point badalne deta hai. Chaand ki position Astronomy Engine se aati hai.',
    'tools.method.timeSignsLabel': 'Baarah rashiyan: ',
    'tools.method.timeSignsBody': 'Tropical zodiac use hota hai. March equinox se naapa jata hai. Isliye rashiyan ab unhi naam wale constellations se nahi milti. Tareekhein andaaze se hain. Aur saal dar saal thodi badalti hain.',
    'tools.method.timeMoonLabel': 'Chaand ki phase aur chaand ka din: ',
    'tools.method.timeMoonBody': 'Astronomy Engine se liya jata hai. Chaand ka din phase angle ka 29.53 din ke mahine mein hissa hai. 1 se gina jata hai.',
    'tools.method.squaresTitle': 'Square kaise bante aur check hote hain (Phase 3)',
    'tools.method.squaresIntro': 'Wafq Forge mein pehle 1 se n squared tak ke number wala base square banaya jata hai. Phir har cell ko ek hi whole number se shift karke target sum tak pahuncha jata hai. Kaun sa construction use hoga, ye order type par hai. Odd order ke liye Siamese method (de la Loubère). Doubly even order (4 se divide hone wale) ke liye complement method. Singly even order (even, 4 se divide na hone wale) ke liye LUX method (Conway). Order 3 se 20 tak supported hain. Poore usool Qawa’id page par hain.',
    'tools.method.sqReachLabel': 'Reachability rule: ',
    'tools.method.sqReachBody': 'Target tabhi bilkul milta hai jab woh base constant se order ke multiple se alag ho. Aur shift negative na ho. Warna Forge mein seedhe shabdon mein mana kar diya jata hai. Kabhi round nahi kiya jata. Cell ko patch nahi kiya jata. Ya number ko repeat karke result nahi banaya jata.',
    'tools.method.sqValidatorLabel': 'Alag validator: ',
    'tools.method.sqValidatorBody': 'Checker generator se alag code hai. Jo grid diya gaya hai, use joda jata hai. Har row. Har column. Dono diagonal. Aur check kiya jata hai ki har cell ek alag positive whole number hai. Ye haath se bane grid par bhi kaam karta hai. Nateeja PASS ya FAIL ke roop mein dikhaya jata hai. Har line ka jod list ke saath.',
    'tools.method.sqExportLabel': 'Export aur print: ',
    'tools.method.sqExportBody': 'Framed SVG download aur A2 plate print sirf tabhi khulte hain jab square validation pass kare.',
    'tools.method.sqModesLabel': 'Woh modes jo nahi bane: ',
    'tools.method.sqModesBody': 'Multiplied, cycling, hollow-centre aur “grand wafq” square ko “source needed” ke roop mein list kiya jata hai. Unke liye koi rule aur worked example nahi diya gaya. Isliye unhe andaze se nahi banaya jata.',
    'tools.method.lettersTitle': 'Harf kaise gine jate hain',
    'tools.method.lettersIntro': 'Ginne se pehle text ko normalise kiya jata hai. Ek standard form mein saaf kiya jata hai. Taaki ek hi harf jo alag tareeke se likha ho, ek hi baar gina jaye. Jo rules use hote hain, woh yeh hain:',
    'tools.method.bareNote': 'Kisi naam ki “bare” keemat use bina “al-” ke gini jati hai. “With al-” wali keemat “al-” jod kar gini jati hai. Dono mein ek hi Abjad table use hoti hai. Aapke chune hue system aur school mein.',
    'tools.method.testedTitle': 'Kya test hua hai',
    'tools.method.tested1': 'Storage helpers ko 10 automated test se check kiya jata hai. Journal, wird aur grimoire ki save/load round-trips. Sahi JSON ka export/import. Aur galat file ko bina purana data mitaye reject karna.',
    'tools.method.tested2': 'Abjad ke hisaab ko khud yahan test kiya jata hai. Dono school aur dono system mein harf ki keemat. Normalisation. Hamza forms. Shadda. Tatweel. Decomposed letters. Aur text ka jod. Jinmein seedhe checks “Allah 66” aur “bism Allah 168” bhi hain.',
    'tools.method.tested3': 'Waqt aur square ko apne test suites se test kiya jata hai. Planetary hour. Midnight aur polar cases samet. Chaand aur manzil ki boundaries. Aur square generation ke saath alag validator. Known constants. Shifted sums. Aur woh cases jo mana kiye jane chahiye.',
    'tools.method.limitsTitle': 'Known limits',
    'tools.method.limit1': 'Element groups, roshan aur andhere harf, aur harf-grah ke rishte kahin nahi dikhaye jate. Un mappings ke liye abhi koi source nahi bataya gaya. Isliye kuch andaza nahi lagaya jata.',
    'tools.method.limit2': 'Maghribi keemat table ke named sources se aati hai. Wikipedia ke “Abjad numerals”. OpenArabic. WiserWork. Chhe harf Mashriqi se alag hain. Baaki 22 ek hain.',
    'tools.method.limit3': 'Today page par dikhayi gayi Hijri tareekh andaaze se batayi jati hai. Yeh calculated (civil) tareekh hai. Jo chaand dekhne wali tareekh se ek-do din aage-peeche ho sakti hai.',
    'tools.method.limit4': 'Yahan namaz ke waqt nahi hain.',
    'tools.method.limit5': 'Notes, ginti aur save ki hui cheezein sirf is device par rakhi jati hain. Browser ka site data saaf karne se, ya doosre device par jaane se, woh kho jayengi. Jab tak aapne pehle JSON backup export na kiya ho.',

    // ---- About ----
    'tools.about.title': 'About (Padhai ke Tools)',
    'tools.about.eyebrow': 'About',
    'tools.about.subtitle':
      'Yeh section kya hai, iske number kahan se aate hain, kya test hua hai, aur yeh kya nahi kar sakta.',
    'tools.about.whatTitle': 'Yeh section kya hai',
    'tools.about.whatBody1': 'Ye chhote tools harf, number, waqt aur apne padhne ke notes ke liye hain. In se harf ki keemat jodi jati hai. Din ki baatein nikali jati hain. Magic square banaye aur check kiye jate hain. Aur woh notes rakhe jate hain jo save karne hon. Yeh sirf padhai aur hisaab ke liye hain. Yeh kisi nateeje, hifazat, shifa ya rozi ka vaada nahi karte. Aur koi deeni faisla nahi dete. Inse kabhi kisi ko nuksaan mat pahunchayein.',
    'tools.about.whatBody2': 'Yahan sab kuch aapke browser mein chalta hai. Aapke notes, ginti aur save ki hui cheezein is device par rehti hain. Kuch bhi kahin nahi bheja jata. Library aur yeh tools follow gate ke peeche hain. Yeh tab khulte hain jab aap “I followed” dabate hain ya Ghayb Chronicles broadcast channel ki key likhte hain. Site khud free hai. Kahin koi payment nahi hai.',
    'tools.about.builtTitle': 'Kya bana hua hai',
    'tools.about.builtIntro': 'Unnees tools bane hue hain aur kaam kar rahe hain. Hub par baaki cards shells hain. Unmein sirf wohi content hai jo apne source aur page ke saath mila ho. Isliye jab tak woh na aaye, woh khaali rehte hain.',
    'tools.about.builtLettersLabel': 'Harf aur number: ',
    'tools.about.builtLettersBody':
      'Huruf (28 harf aur unki keemat), Asma (99 Naam), Bast (koi bhi text kholein), Fawatih (29 suraton mein 14 opening-letter forms), Sawaqit (saat harf jo al-Fatiha mein nahi hain), Shields (paanch chhote texts ke chalte hue harf ke jod).',
    'tools.about.builtTimeLabel': 'Waqt aur aasmaan: ',
    'tools.about.builtTimeBody':
      'Today, Planetary Hours, Moon, Lunar Mansions, Falak (baarah rashiyan), Majlis (is pal ki baatein).',
    'tools.about.builtSquaresLabel': 'Squares: ',
    'tools.about.builtSquaresBody': 'Wafq Forge (magic square banayein) aur Qawa’id (square ke usool).',
    'tools.about.builtNotesLabel': 'Notes aur yaad: ',
    'tools.about.builtNotesBody': 'Journal (padhne ke notes), Wird (zikr counter), Grimoire (save ki hui cheezein).',
    'tools.about.builtSelfLabel': 'Yeh section khud: ',
    'tools.about.builtSelfBody': 'Method (tools kaise kaam karte hain) aur yeh About page.',
    'tools.about.notBuiltTitle': 'Kya nahi bana hai',
    'tools.about.notBuilt1': 'Koi AI teacher nahi. Material ke baare mein sawal kisi insaan se poochhe jayein, is section se nahi.',
    'tools.about.notBuilt2':
      'Kuch bhi jo kisi ko nuksaan pahunchaye, majboor kare ya baandhe. Tools sirf index karte hain; woh kabhi kisi insaan par aimed working nahi banate.',
    'tools.about.notBuilt3': 'Koi incense recipe quantity ke saath nahi, aur kisi bhi tarah ki taiyari ki instructions nahi.',
    'tools.about.sourcesTitle': 'Data ke sources',
    'tools.about.srcAbjadLabel': 'Abjad table: ',
    'tools.about.srcAbjadBody': 'Standard Abjad keemat (mashriqi/maghribi), Wikipedia ke “Abjad numerals” aur OpenArabic aur WiserWork ke abjad calculator se check ki gayi. Dono school 22 harf par ek hain. Chhe par alag hain (sad, dad, sin, shin, za, ghayn). Kabir matlab har harf ki poori keemat hai. Saghir matlab wahi keemat hai jo ek digit tak chhoti kar di gayi ho.',
    'tools.about.srcQuranLabel': 'Quran ka text: ',
    'tools.about.srcQuranBody': 'Fawatih forms, Sawaqit harf aur Shields ke jod usi text se run time par nikale jate hain. Haath se nahi likhe jate. Text Tanzil ki terms par use hota hai. Verbatim copies. Source named. tanzil.net ka link. Surah ke naam aur matlab AlQuranCloud ki surah list se liye gaye hain. Use 18 Nov 2026 ko check kiya gaya tha.',
    'tools.about.srcTranslitLabel': 'Transliteration: ',
    'tools.about.srcTranslitBody': 'Fawatih, Sawaqit aur Shields pages par Arabi ki Latin reading usi project se aati hai. Use non-commercial use ke liye rakha jata hai. Link back ke saath. Jaisa terms kehte hain. Har aayat ko Arabi se lafz dar lafz check kiya gaya hai.',
    'tools.about.srcNamesLabel': '99 Naam: ',
    'tools.about.srcAstroLabel': 'Astronomy aur waqt: ',
    'tools.about.srcAstroBody': 'Maintained Astronomy Engine library (astronomy-engine) se suraj nikalna, suraj doobna, Chaand ki phase aur longitude, aur Suraj ki longitude nikali jati hai. Yahan koi astronomy formula haath se nahi likha gaya.',
    'tools.about.srcMansionsLabel': 'Lunar mansions: ',
    'tools.about.srcMansionsBody': 'Wikipedia, “Lunar mansion” (manazil al-qamar table, 28 stations jo al-Sharatayn se 0° par shuru hoti hain), 18 Nov 2026 ko check kiya gaya tha.',
    'tools.about.srcSignsLabel': 'Baarah rashiyan: ',
    'tools.about.srcSignsBody': 'Wikipedia, “Astrological sign” (Western zodiac table, tropical signs aur element triplicities), 18 Nov 2026 ko check kiya gaya tha.',
    'tools.about.srcPlanetsLabel': 'Grah aur din ke hakim: ',
    'tools.about.srcPlanetsBody': 'Wikipedia, “Planetary hours” (Chaldean order aur kaun sa grah kis weekday ka hakim hai). Arabi grah ke naam: Wiktionary, “Appendix:Planets”, aur wahan quote kiya gaya al-Biruni ka list.',
    'tools.about.srcSquaresLabel': 'Magic squares: ',
    'tools.about.srcSquaresBody': 'Wikipedia, “Magic square” aur “Conway’s LUX method for magic squares” (constructions 18 Nov 2026 ko check kiye gaye the).',
    'tools.about.srcNotesLabel': 'Aapke notes, ginti aur save ki hui cheezein: ',
    'tools.about.srcNotesBody': 'aapke likhe hue, sirf is device ki storage mein rehte hain. Kuch bhi kahin nahi bheja jata.',
    'tools.about.convTitle': 'Chuni hui conventions',
    'tools.about.convSchoolsLabel': 'Do school, do system: ',
    'tools.about.convSchoolsBody': 'Do tables hain. Mashriqi matlab purbi. Maghribi matlab paschimi. Kabir matlab poori keemat. Saghir matlab har harf ek digit tak chhota karke joda gaya. Aap pages par switch kar sakte hain. Number update ho jate hain.',
    'tools.about.convCountingLabel': 'Ginne ke rules: ',
    'tools.about.convCountingBody': 'Harf ginne ke liye ek shared normalisation routine use hoti hai. Unicode NFC. Hamza forms ek kar diye gaye. Ta marbuta ko ha padha jata hai. Alif maqsura ko ya padha jata hai. Shadda apne harf ko double kar deta hai. Jab tak woh harf pehle se do baar likha na ho. Jaise Allah mein. Uthmani spelling jaise likhi hai waise hi gini jati hai. Isliye al-Rahman Shields mein 529 hai. Aur seedhi spelling mein 329 hai.',
    'tools.about.convHoursLabel': 'Planetary hours: ',
    'tools.about.convHoursBody': 'Hour barabar nahi hote. Din suraj nikalne se doobne tak chalta hai. Raat suraj doobne se agle suraj nikalne tak. Koi location set na ho to hour fixed 06:00–18:00 hisse par chalte hain. Use saaf taur par approximate likha jata hai. Jahan Suraj na nikalta hai na doobta hai, wahan hour ko unavailable dikhaya jata hai.',
    'tools.about.convHijriLabel': 'Hijri tareekh: ',
    'tools.about.convHijriBody': 'Islamic civil calendar (Intl, Kuwaiti algorithm) use hota hai. Yeh andaaze se hai. Asli mahine chaand dekhne par hote hain. Aur ek-do din aage-peeche ho sakte hain.',
    'tools.about.convMansionsLabel': 'Lunar mansions: ',
    'tools.about.convMansionsBody': '28 barabar hisse hain. Lagbhag 12.857° ke. 0° par al-Sharatayn se shuru. Yeh ek convention hai. Universal fact nahi. Doosri traditions ginti kahin aur se shuru karti hain. Mansions page aapko start point badalne deta hai.',
    'tools.about.convSignsLabel': 'Baarah rashiyan: ',
    'tools.about.convSignsBody': 'Tropical zodiac use hota hai. March equinox se naapa jata hai. Isliye rashiyan ab unhi naam wale constellations se nahi milti.',
    'tools.about.testedTitle': 'Kya test hua hai',
    'tools.about.testedIntro': 'Poori site automated tests se cover hai. Full suite green hai. Aur har change ship karne se pehle chalta hai. Is section ke liye jo tests matter karte hain, woh yeh hain:',
    'tools.about.testedAbjadLabel': 'Abjad ka hisaab: ',
    'tools.about.testedAbjadBody': 'Dono school aur dono system mein harf ki keemat check ki jati hai. Normalisation bhi. Hamza forms. Shadda. Tatweel. Decomposed letters. Aur text ka jod bhi. Jinmein seedhe checks “Allah 66” aur “bism Allah 168” bhi hain.',
    'tools.about.testedQuranLabel': 'Quran ka text: ',
    'tools.about.testedQuranBody': 'Paanch shield texts ke verse counts check kiye jate hain. Har stored string ka Unicode NFC form. Basmalah al-Fatiha mein rakhi gayi. Baaki teen suraton se hatayi gayi. Fawatih rule se bilkul 29 suratein 14 forms mein exact mapping ke saath. Saat Sawaqit harf. Aur paanchon Shields ke jod dono system aur dono school mein. Expected numbers ko source text se alag se nikala gaya tha. Test wale code se nahi. Transliteration bhi waise hi check ki jati hai. Har aayat apni Arabi aayat se lafz dar lafz milti hai. 137 lafz. Aur 114:6 fix test mein pin hai.',
    'tools.about.testedTimeLabel': 'Waqt aur squares: ',
    'tools.about.testedTimeBody': 'Planetary hour check kiye jate hain. Midnight aur polar cases samet. Chaand aur manzil ki boundaries. Aur square generation ke saath alag validator. Known constants. Shifted sums. Aur woh cases jo mana kiye jane chahiye.',
    'tools.about.testedStorageLabel': 'Storage aur wiring: ',
    'tools.about.testedStorageBody': 'Journal, wird aur grimoire ki save/load round-trips check ki jati hain. Sahi JSON ka export/import. Galat file ko bina purana data mitaye reject karna. Aur hub ke har tool ka matching route, URL aur page hona.',
    'tools.about.limitsTitle': 'Known limits',
    'tools.about.limit1': 'Fawatih page par nahi bataya jata ki opening letters ka matlab kya hai. Matlab ke liye abhi koi source nahi bataya gaya.',
    'tools.about.limit2': 'Sawaqit page par saat gayab harf se jude traditional naam nahi diye jate. Unke liye abhi koi source nahi bataya gaya. Shams al-Ma’arif ka Inloes translation check kiya gaya. Usmein woh naam nahi hain.',
    'tools.about.limit3': 'Element groups, roshan aur andhere harf, aur harf-grah ke rishte kahin nahi dikhaye jate. Un mappings ke liye abhi koi source nahi bataya gaya. Isliye kuch andaza nahi lagaya jata.',
    'tools.about.limit4': 'Maghribi keemat table ke named sources se aati hai. Chhe harf Mashriqi se alag hain. Baaki 22 ek hain.',
    'tools.about.limit5': 'Today page par dikhayi gayi Hijri tareekh andaaze se batayi jati hai. Yeh calculated (civil) tareekh hai. Jo chaand dekhne wali tareekh se ek-do din aage-peeche ho sakti hai.',
    'tools.about.limit6': 'Yahan namaz ke waqt nahi hain.',
    'tools.about.limit7': 'Notes, ginti aur save ki hui cheezein sirf is device par rakhi jati hain. Browser ka site data saaf karne se, ya doosre device par jaane se, woh kho jayengi. Jab tak aapne pehle JSON backup export na kiya ho.',
    'tools.about.whoTitle': 'Yeh kisne banaya',
    'tools.about.whoBody': 'Ye Study Tools Ilm-e-Ghayb Library ka hissa hain, Ghayb Chronicles (@ghayb.chronicles) se. Islamic esoteric knowledge, mysticism aur Sufi wisdom, har caption mein source ke saath. Library free hai. Tools aur kitabein channel ke followers ke liye follow gate ke peeche hain.',

    // ---- Tier B: Kitab ----
    'tools.kitab.title': 'Kitab (Kitab)',
    'tools.kitab.eyebrow': 'Kitab',
    'tools.kitab.subtitle': 'Kitab ke baare mein kitabein kya kehti hain, khud kitabon se.',
    'tools.kitab.chapterLabel': 'Chapter',
    'tools.kitab.filterAria': 'Chapter se filter karein',
    'tools.kitab.allChapters': 'Saare chapters',
    'tools.kitab.chapterN': 'Chapter {n}',
    'tools.kitab.frontMatter': 'Front matter',
    'tools.kitab.backMatter': 'Back matter',
    'tools.kitab.filterNote':
      'Yeh entries Kitab ke baare mein aam notes hain, chapter ka text nahi, isliye chapter filter se yeh kam nahi hoti.',

    // ---- Tier B: Talasim ----
    'tools.talasim.title': 'Talasim (Shaklein)',
    'tools.talasim.eyebrow': 'Shaklein',
    'tools.talasim.subtitle': 'Talisman kya hai, uski shaklein, aur use banane ki chaar sakht shartein.',
    'tools.talasim.searchLabel': 'Figures dhoondhein',
    'tools.talasim.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Ashkal ----
    'tools.ashkal.title': 'Ashkal (Roop)',
    'tools.ashkal.eyebrow': 'Shaklein',
    'tools.ashkal.subtitle': 'Roop rooh ke liye bartan hain, Point se Square tak.',
    'tools.ashkal.searchLabel': 'Forms dhoondhein',
    'tools.ashkal.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Figure Forge ----
    'tools.figureForge.title': 'Figure Forge',
    'tools.figureForge.eyebrow': 'Shaklein',
    'tools.figureForge.subtitle': 'Figure kaise banaya jata hai, purani kitabon ke shabdon mein.',
    'tools.figureForge.searchLabel': 'Figures dhoondhein',
    'tools.figureForge.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Talism Studio ----
    'tools.talismStudio.title': 'Talism Studio',
    'tools.talismStudio.eyebrow': 'Seals',
    'tools.talismStudio.subtitle': 'Woh kamra jahan kaam hota hai, jaisa kitabein batati hain.',
    'tools.talismStudio.searchLabel': 'Seals dhoondhein',
    'tools.talismStudio.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Haqaiq ----
    'tools.haqaiq.title': 'Haqa’iq (Haqeeqatein)',
    'tools.haqaiq.eyebrow': 'Haqeeqatein',
    'tools.haqaiq.subtitle': 'Haqeeqatein jo dil mein rehti hain, kitabon mein nahi.',
    'tools.haqaiq.searchLabel': 'Records dhoondhein',
    'tools.haqaiq.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Shart ----
    'tools.shart.title': 'Shart (Shartein)',
    'tools.shart.eyebrow': 'Shartein',
    'tools.shart.subtitle': 'Har kaam ke liye jo shartein chahiye, ek ek karke.',
    'tools.shart.searchLabel': 'Entries dhoondhein',
    'tools.shart.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: al-Sirr al-Jalil ----
    'tools.sirr.title': 'al-Sirr al-Jalil',
    'tools.sirr.eyebrow': 'Monograph',
    'tools.sirr.subtitle': 'Bada Raaz, aur woh Naam jo use kholta hai.',
    'tools.sirr.searchLabel': 'Monograph dhoondhein',
    'tools.sirr.searchPlaceholder': 'Heading ya page se dhoondhein',

    // ---- Tier B: Durus ----
    'tools.durus.title': 'Durus (Sabak)',
    'tools.durus.eyebrow': 'Sabak',
    'tools.durus.subtitle': 'Seekhne ke sabak, purane ustadon se.',
    'tools.durus.searchLabel': 'Sabak dhoondhein',
    'tools.durus.searchPlaceholder': 'Sabak ya course se dhoondhein',

    // ---- Tier B: Index ----
    'tools.index.title': 'Index',
    'tools.index.eyebrow': 'Index',
    'tools.index.subtitle': 'Purani kitabein khud ko kaise map karti hain.',
    'tools.index.searchLabel': 'Index dhoondhein',
    'tools.index.searchPlaceholder': 'Naam ya topic se dhoondhein',

    // ---- Tier B: Library ----
    'tools.library.title': 'Library (Squares Library)',
    'tools.library.eyebrow': 'Squares Library',
    'tools.library.subtitle': 'Purani kitabein kaise rakhi aur aage badhayi gayi.',
    'tools.library.searchLabel': 'Entries dhoondhein',
    'tools.library.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Atlas ----
    'tools.atlas.title': 'Atlas',
    'tools.atlas.eyebrow': 'Atlas',
    'tools.atlas.subtitle': 'Aasmaan ka map, spheres aur harf.',
    'tools.atlas.searchLabel': 'Atlas dhoondhein',
    'tools.atlas.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Qalam ----
    'tools.qalam.title': 'Qalam',
    'tools.qalam.eyebrow': 'Qalam',
    'tools.qalam.subtitle': 'Qalam, pehli cheez jo banayi gayi, aur pehli cheez jisne likha.',
    'tools.qalam.searchLabel': 'Entries dhoondhein',
    'tools.qalam.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Khatam ----
    'tools.khatam.title': 'Khatam',
    'tools.khatam.eyebrow': 'Khatam',
    'tools.khatam.subtitle': 'Seal, aur Suleman uske ustad.',
    'tools.khatam.searchLabel': 'Entries dhoondhein',
    'tools.khatam.searchPlaceholder': 'Naam ya page se dhoondhein',
    'tools.khatam.gridTitle': '3 by 3 grid, is page par dikhaya gaya',
    'tools.khatam.gridBody':
      'Kitabein 3 by 3 grid ko Suleman aur al-Ghazali ki seal kehti hain. Yeh raha, jaisa kitabein deti hain. Har row, har column aur dono diagonal ka jod 15 hai.',
    'tools.khatam.gridNote':
      'Grid upar, is page par poora dikhaya gaya hai. Use dekhne ya use karne ke liye download ki zaroorat nahi.',
    'tools.khatam.copyGrid': 'Grid copy karein',
    'tools.khatam.saveImage': 'Image ke roop mein save karein',
    'tools.khatam.sealCaption': 'Suleman ki seal, 3 by 3, har line ka jod 15 hai',
    'tools.khatam.gridAria': '3 by 3 grid, Suleman ki mohar',
    'tools.khatam.sealAria': 'Suleman ki mohar, 3 by 3 grid',
    'tools.khatam.gridSourceBody': 'Ye numbers classic 3 by 3 square hain, aur har line ka jod 15 hai.',

    // ---- Tier B: Plate ----
    'tools.plate.title': 'Plate',
    'tools.plate.eyebrow': 'Plate',
    'tools.plate.subtitle': 'Dhaat ki plates, har grah ke liye ek.',
    'tools.plate.searchLabel': 'Entries dhoondhein',
    'tools.plate.searchPlaceholder': 'Naam ya page se dhoondhein',
    'tools.plate.metalsTitle': 'Dhaat aur unke grah, is page par dikhaye gaye',
    'tools.plate.metalsBody':
      'Har grah ki apni dhaat hai, aur dhaat ko grah se milna chahiye. Suraj ki sona hai. Chaand ki chaandi hai. Mangal ki loha hai. Budh ki paara hai. Shani ki seesa hai.',
    'tools.plate.metalsNote':
      'Figure upar, is page par poora dikhaya gaya hai. Use dekhne ya use karne ke liye download ki zaroorat nahi. Kitabein taambe ki plates aur tin ki sheet ka bhi naam leti hain, lekin is page ki entries mein unhe kisi grah se nahi jodti.',
    'tools.plate.copyList': 'List copy karein',
    'tools.plate.saveImage': 'Image ke roop mein save karein',
    'tools.plate.metalsAria': 'Dhaat aur unke grah',
    'tools.plate.tableAria': 'Dhaaton aur unke grahon ki plate',
    'tools.plate.svgTitle': 'Lawh, plate',
    'tools.plate.svgSub': 'Har grah ki apni dhaat hai. Dhaat ko grah se milna chahiye.',
    'tools.plate.svgFoot': 'Taambe aur tin ko bhi plate kaha gaya hai. Unke grah yahan nahi bataye gaye.',

    // ---- Tier B: Works ----
    'tools.works.title': 'Works',
    'tools.works.eyebrow': 'Works',
    'tools.works.subtitle': 'Kitabein kaam ke baare mein kya kehti hain, aur use kya chahiye.',
    'tools.works.searchLabel': 'Entries dhoondhein',
    'tools.works.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Bakhur and Adad ----
    'tools.bakhur.title': 'Bakhur and Adad',
    'tools.bakhur.eyebrow': 'Bakhur and Adad',
    'tools.bakhur.subtitle': 'Naam wali khushboo wali cheezon aur number ke kaam ka catalogue, bas itna hi.',
    'tools.bakhur.searchLabel': 'Catalogue dhoondhein',
    'tools.bakhur.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Shurut ----
    'tools.shurut.title': 'Shurut (Shartein)',
    'tools.shurut.eyebrow': 'Shartein',
    'tools.shurut.subtitle': 'Woh shartein jo kitabein batati hain, har ek apne source aur page ke saath.',
    'tools.shurut.searchLabel': 'Entries dhoondhein',
    'tools.shurut.searchPlaceholder': 'Naam ya page se dhoondhein',

    // ---- Tier B: Glossary ----
    'tools.glossary.title': 'Glossary',
    'tools.glossary.eyebrow': 'Glossary',
    'tools.glossary.subtitle': 'Is section mein use hone wale lafz, seedhe shabdon mein.',
    'tools.glossary.searchLabel': 'Terms dhoondhein',
    'tools.glossary.searchPlaceholder': 'Term se dhoondhein',
    'tools.glossary.filterLabel': 'Harf se filter karein',
    'tools.glossary.showingLetter': '{letter} ke neeche wale terms dikhaye ja rahe hain. Poori glossary phir se dekhne ke liye All dabayein.',

    // ---- Data: tool titles & blurbs (hub + search) ----
    'tools.data.toolTitle.huruf': 'Huruf (Harf aur Number)',
    'tools.data.toolBlurb.huruf':
      '28 Arabi harf aur unki Abjad keemat, ginne ke rules seedhe shabdon mein.',
    'tools.data.toolTitle.asma': 'Asma (99 Naam)',
    'tools.data.toolBlurb.asma':
      '99 Naam dhoondhein, har naam ki number keemat dekhein, kisi bhi naam ka hisaab lagayein, aur jo naam rakhne hain unhe save karein.',
    'tools.data.toolTitle.bast': 'Bast (Text ko Kholna)',
    'tools.data.toolBlurb.bast':
      'Koi bhi text likhein aur use harf dar harf khula hua dekhein, har harf ki keemat aur chalte hue jod ke saath.',
    'tools.data.toolTitle.fawatih': 'Fawatih (Shuru ke Harf)',
    'tools.data.toolBlurb.fawatih':
      '14 alag harf wali shaklein jo 29 suraton ko kholti hain, har surah ki pehli aayat par rule chala kar mili hain, unki keemat ke saath.',
    'tools.data.toolTitle.sawaqit': 'Sawaqit (Saat Gayab Harf)',
    'tools.data.toolBlurb.sawaqit':
      'Saat harf jo al-Fatiha mein kahin nahi aate, surah ke harf gin kar mile hain.',
    'tools.data.toolTitle.shields': 'Shields (Chalta Hua Harf ka Jod)',
    'tools.data.toolBlurb.shields':
      'al-Fatiha, al-Ikhlas, al-Falaq, al-Nas aur Ayat al-Kursi ka lafz dar lafz chalta hua harf ka jod, taaki aap hisaab ko follow kar sakein.',
    'tools.data.toolTitle.journal': 'Journal (Padhne ke Notes)',
    'tools.data.toolBlurb.journal':
      'Jo padha, us par notes rakhein. Sab kuch is device par rehta hai. Kahin nahi bheja jata.',
    'tools.data.toolTitle.wird': 'Wird (Zikr Counter)',
    'tools.data.toolBlurb.wird':
      'Roz ke zikr ke liye ek seedha counter, apne set kiye hue targets ke saath. Is device par save hota hai.',
    'tools.data.toolTitle.grimoire': 'Grimoire (Save Ki Hui Cheezein)',
    'tools.data.toolBlurb.grimoire':
      'Naam, khule hue text aur notes jo aapne doosre tools se save kiye, sab ek jagah, is device par.',
    'tools.data.toolTitle.today': 'Aaj',
    'tools.data.toolBlurb.today':
      'Aaj ke din ki baatein: tareekh, andaaze se Hijri tareekh, din ka hakim, aur is waqt ka planetary hour.',
    'tools.data.toolTitle.hours': 'Planetary Hours',
    'tools.data.toolBlurb.hours':
      'Din ke 24 hour, har ek par ek grah ka raaj. Din ke hour suraj nikalne se doobne tak, raat ke hour suraj doobne se agle suraj nikalne tak. Hour barabar nahi hote.',
    'tools.data.toolTitle.moon': 'Chaand',
    'tools.data.toolBlurb.moon':
      'Chaand ki phase, woh kitna roshan hai, chaand ka din, aur woh kis manzil mein hai.',
    'tools.data.toolTitle.mansions': 'Lunar Mansions',
    'tools.data.toolBlurb.mansions':
      'Chaand ki 28 manzilein, aaj ki manzil highlight hai aur start point ek convention hai jise aap badal sakte hain.',
    'tools.data.toolTitle.falak': 'Falak — Baarah Rashi',
    'tools.data.toolBlurb.falak': 'Tropical zodiac ki baarah rashiyan, aaj Suraj kis rashi mein hai, uske saath.',
    'tools.data.toolTitle.majlis': 'Majlis',
    'tools.data.toolBlurb.majlis':
      'Is pal ki baatein ek jagah: location, aaj ka hakim, is waqt ka hour, aur Chaand. Sirf facts. Koi salah nahi.',
    'tools.data.toolTitle.forge': 'Wafq Forge — Magic Squares',
    'tools.data.toolBlurb.forge':
      'Order 3 se 20 tak ka magic square banayein, ek target sum par, phir use alag validator se line dar line check karein.',
    'tools.data.toolTitle.qawaid': 'Qawa’id — Square ke Usool',
    'tools.data.toolBlurb.qawaid':
      'Square kaise banta hai, target sum kab mil sakta hai, use kaise check kiya jata hai, aur kya mana kar diya jata hai.',
    'tools.data.toolTitle.kitab': 'Kitab (Kitab)',
    'tools.data.toolBlurb.kitab':
      'Kitab ke baare mein kitabein kya kehti hain: kitabon ki teen mothers, Preserved Tablet, aur library mein titled kitabein.',
    'tools.data.toolTitle.talasim': 'Talasim (Shaklein)',
    'tools.data.toolBlurb.talasim':
      'Talisman kya hai, uski shaklein aur lineage, aur use banane ki chaar sakht shartein.',
    'tools.data.toolTitle.ashkal': 'Ashkal (Roop)',
    'tools.data.toolBlurb.ashkal':
      'Roop rooh ke liye bartan hain: Point aur Circle, Triangle aur Square, figure ke roop mein magic squares, aur aur bhi.',
    'tools.data.toolTitle.figure-forge': 'Figure Forge',
    'tools.data.toolBlurb.figure-forge':
      'Figure kaise banaya jata hai: dhaat aur patthar, waqt, dhona, consecration, aur karigar.',
    'tools.data.toolTitle.talism-studio': 'Talism Studio',
    'tools.data.toolBlurb.talism-studio':
      'Purane hunar ki jagah: zikr ka ghar, chaar pillars, sand board, aur studio ke usool.',
    'tools.data.toolTitle.haqaiq': 'Haqa’iq (Haqeeqatein)',
    'tools.data.toolBlurb.haqaiq':
      'Haqeeqatein jo dil mein rehti hain: fixed entities, teen duniya, aur shariat, tareeqat aur haqeeqat ka raasta.',
    'tools.data.toolTitle.shart': 'Shart (Shartein)',
    'tools.data.toolBlurb.shart':
      'Har kaam ke liye jo shartein chahiye: 27 shartein, chaar pillars, paaki, aur iraade ki shart.',
    'tools.data.toolTitle.sirr-al-jalil': 'al-Sirr al-Jalil',
    'tools.data.toolBlurb.sirr-al-jalil':
      'Bada Raaz: Naam al-Jalil, Naam al-Majid, aur uske matrix mein set raaz.',
    'tools.data.toolTitle.durus': 'Durus (Sabak)',
    'tools.data.toolBlurb.durus':
      'Seekhne ke sabak: khamoshi, Jilani ki terah shakhein, padhne ke adab, aur creation se seekhna.',
    'tools.data.toolTitle.index': 'Index',
    'tools.data.toolBlurb.index':
      'Purani kitabein khud ko kaise map karti hain: Ibn Arabi ka index wala chapter, rubrics, aur ilm ka bikharna.',
    'tools.data.toolTitle.library': 'Library (Squares Library)',
    'tools.data.toolBlurb.library':
      'Purani kitabein kaise rakhi gayi: chhupa hua ilm, sandook, hifazat ka ahad, aur badi libraries.',
    'tools.data.toolTitle.atlas': 'Atlas',
    'tools.data.toolBlurb.atlas':
      'Aasmaan ka map: Atlas sphere, nau charts, Wheel of Letter Dispositions, aur Head of Qaf.',
    'tools.data.toolTitle.qalam': 'Qalam',
    'tools.data.toolBlurb.qalam':
      'Qalam: pehli cheez jo banayi gayi, triple inscription, talismanic pen ke usool, aur Rumi ki cheentiyan.',
    'tools.data.toolTitle.khatam': 'Khatam',
    'tools.data.toolBlurb.khatam':
      'Seal: Suleman uske ustad, 3 by 3 grid, saat symbols, aur Seal of the Prophets.',
    'tools.data.toolTitle.plate': 'Plate',
    'tools.data.toolBlurb.plate':
      'Dhaat ki plates: Suraj ke liye sona, Chaand ke liye chaandi, Mangal ke liye loha, Shani ke liye seesa, aur saat-dhaat casting.',
    'tools.data.toolTitle.works': 'Works',
    'tools.data.toolBlurb.works':
      'Kitabein kaam ke baare mein kya kehti hain: uske do maqsad, niyyat, harf, square ke sizes, aur protocols, har ek apne source ke saath.',
    'tools.data.toolTitle.bakhur-adad': 'Bakhur and Adad',
    'tools.data.toolBlurb.bakhur-adad':
      'Khushboo wali cheezon aur number ke kaam ka catalogue, source aur page ke saath. Kabhi quantity, taiyari ya recipe nahi.',
    'tools.data.toolTitle.shurut': 'Shurut (Shartein)',
    'tools.data.toolBlurb.shurut':
      'Kaam ke liye jo shartein chahiye: waqt, harmony, consecration, charity, paaki, niyyat aur yaqeen, har ek apne source ke saath.',
    'tools.data.toolTitle.glossary': 'Glossary',
    'tools.data.toolBlurb.glossary':
      'Is section mein use hone wale lafz, seedhe shabdon mein samjhaye gaye, har ek apne source aur page ke saath.',
    'tools.data.toolTitle.method': 'Method (Yeh Tools Kaise Kaam Karte Hain)',
    'tools.data.toolBlurb.method':
      'Number kahan se aate hain, harf kaise gine jate hain, kya test hua hai, aur yeh tools kya nahi kar sakte.',
    'tools.data.toolTitle.about': 'About (Padhai ke Tools)',
    'tools.data.toolBlurb.about':
      'Yeh section kya hai, iske number kahan se aate hain, kya test hua hai, aur yeh kya nahi kar sakta.',

    // ---- Data: topic groups ----
    'tools.data.topicGroupTitle.quran': 'Quran aur Tafseer',
    'tools.data.topicGroupBlurb.quran': 'Quran, aur scholars use kaise samjhate hain.',
    'tools.data.topicGroupTitle.hadith': 'Hadith',
    'tools.data.topicGroupBlurb.hadith': 'Nabi ki baatein aur amal, jama kiye hue.',
    'tools.data.topicGroupTitle.seerah': 'Nabi ki Zindagi',
    'tools.data.topicGroupBlurb.seerah': 'Nabi ki zindagi, aur Nabiyon ki kahaniyan.',
    'tools.data.topicGroupTitle.history': 'Tareekh',
    'tools.data.topicGroupBlurb.history': 'Islam kaise badha, aur saltanatein kyun uthti aur girti hain.',
    'tools.data.topicGroupTitle.sufism': 'Sufism aur Hikmat',
    'tools.data.topicGroupBlurb.sufism': 'Roohani raasta, aur imaan ki buniyad.',
    'tools.data.topicGroupTitle.hidden': 'Chhupa Hua Ilm',
    'tools.data.topicGroupBlurb.hidden': 'Raaz, symbols, rooh, khwab, aur ghayb ki duniya.',

    // ---- Data: planets, days, signs, elements, phases ----
    'tools.data.planet.saturn': 'Shani',
    'tools.data.planet.jupiter': 'Guru',
    'tools.data.planet.mars': 'Mangal',
    'tools.data.planet.sun': 'Suraj',
    'tools.data.planet.venus': 'Shukra',
    'tools.data.planet.mercury': 'Budh',
    'tools.data.planet.moon': 'Chaand',
    'tools.data.dayName.sunday': 'Itwaar',
    'tools.data.dayName.monday': 'Somvaar',
    'tools.data.dayName.tuesday': 'Mangalvaar',
    'tools.data.dayName.wednesday': 'Budhvaar',
    'tools.data.dayName.thursday': 'Guruvaar',
    'tools.data.dayName.friday': 'Shukravaar',
    'tools.data.dayName.saturday': 'Shanivaar',
    'tools.data.zodiac.0': 'Mesh',
    'tools.data.zodiac.1': 'Vrishabh',
    'tools.data.zodiac.2': 'Mithun',
    'tools.data.zodiac.3': 'Kark',
    'tools.data.zodiac.4': 'Singh',
    'tools.data.zodiac.5': 'Kanya',
    'tools.data.zodiac.6': 'Tula',
    'tools.data.zodiac.7': 'Vrishchik',
    'tools.data.zodiac.8': 'Dhanu',
    'tools.data.zodiac.9': 'Makar',
    'tools.data.zodiac.10': 'Kumbh',
    'tools.data.zodiac.11': 'Meen',
    'tools.data.element.fire': 'Aag',
    'tools.data.element.earth': 'Mitti',
    'tools.data.element.air': 'Hawa',
    'tools.data.element.water': 'Paani',
    'tools.data.phase.newMoon': 'Naya Chaand',
    'tools.data.phase.waxingCrescent': 'Badhta hua hilal',
    'tools.data.phase.firstQuarter': 'Pehla Quarter',
    'tools.data.phase.waxingGibbous': 'Badhta hua Chaand',
    'tools.data.phase.fullMoon': 'Poora Chaand',
    'tools.data.phase.waningGibbous': 'Ghatta hua Chaand',
    'tools.data.phase.lastQuarter': 'Aakhri Quarter',
    'tools.data.phase.waningCrescent': 'Ghatta hua hilal',

    // ---- Data: conventions & fixed util strings ----
    'tools.data.mansionConvention':
      '28 barabar hisse, lagbhag 12.857 degree ke, 0 degree se al-Sharatayn ke saath shuru. Yeh ek convention hai, universal fact nahi; doosri traditions ginti kahin aur se shuru karti hain.',
    'tools.data.zodiacConvention':
      'Tropical zodiac: rashiyan March equinox se naapi jati hain, isliye woh ab unhi naam wale constellations se nahi milti. Tareekhein andaaze se hain aur saal dar saal thodi badalti hain.',
    'tools.data.moonMethod': 'Astronomy Engine MoonPhase; chaand ka mahina 29.53 din ka',
    'tools.data.hijriMethod': 'Islami civil calendar (Intl, Kuwaiti algorithm)',
    'tools.data.hijriNote': 'Asli mahine chaand dekhne par hote hain aur ek-do din aage-peeche ho sakte hain.',
    'tools.data.sunNoSet':
      'Is din Suraj doobta nahi hai (midnight sun). Suraj nikalna ya doobna hi nahi hai jise hour mein baanta ja sake.',
    'tools.data.sunNoRise':
      'Is din Suraj nikalta nahi hai (polar night). Suraj nikalna ya doobna hi nahi hai jise hour mein baanta ja sake.',
    'tools.data.sunRisesNoSet':
      'Suraj aaj nikalta hai lekin is calendar din mein doobta nahi. Woh aadhi raat ke baad doobta hai.',

    // ---- Data: counting rules (NORMALIZATION_RULES, same order) ----
    'tools.data.normRule.1':
      'Pehle text ko Unicode NFC form mein dala jata hai, taaki jo harf alag-alag hisso mein likha ho (jaise alif aur uske upar hamza ka nishan) woh ek hi harf ban jaye.',
    'tools.data.normRule.2':
      'Tatweel (kheenchne wala nishan) aur saare vowel nishan hata diye jate hain: fatha, damma, kasra, sukun, tanwin, superscript alef, aur aise hi nishan.',
    'tools.data.normRule.3':
      'Hamza ki shaklein ek kar di jati hain: أ, إ, آ, ٱ, aur akela hamza ء sab ا ban jate hain; ؤ, و ban jata hai; ئ, ي ban jata hai.',
    'tools.data.normRule.4':
      'Ta marbuta ة ko ه padha jata hai. Yeh is tool ka apna faisla hai, universal rule nahi.',
    'tools.data.normRule.5': 'Alif maqsura ى ko ي padha jata hai.',
    'tools.data.normRule.6':
      'Shadda jis harf par hota hai, use double kar deta hai, isliye woh harf do baar gina jata hai. Agar woh harf pehle se do baar likha ho, jaise الله mein do lam, to shadda teesra harf nahi jodta, isliye الله ka jod phir bhi 66 hi rehta hai.',
    'tools.data.normRule.7':
      'Space, punctuation aur non-Arabi harf ko ignore kiya jata hai: woh gine nahi jate aur harf ki list mein nahi aate.',

    // ---- Data: unsupported square modes ----
    'tools.data.unsupported.multiplied.label': 'Guna kiye gaye squares',
    'tools.data.unsupported.multiplied.note': 'Source chahiye. Koi rule aur worked example nahi diya gaya.',
    'tools.data.unsupported.cycling.label': 'Chakkar wale squares',
    'tools.data.unsupported.cycling.note': 'Source chahiye. Koi rule aur worked example nahi diya gaya.',
    'tools.data.unsupported.hollowCentre.label': 'Khokhle beech wale squares',
    'tools.data.unsupported.hollowCentre.note': 'Source chahiye. Koi rule aur worked example nahi diya gaya.',
    'tools.data.unsupported.grandWafq.label': 'Grand wafq',
    'tools.data.unsupported.grandWafq.note': 'Source chahiye. Koi rule aur worked example nahi diya gaya.',

    // ---- Data: import errors (toolsStorage) ----
    'tools.data.importError.notJson': 'Woh file sahi JSON nahi hai.',
    'tools.data.importError.noToolsData': 'Us file mein tools ka data nahi hai.',
    'tools.data.importError.noEntries': 'Us file mein journal, wird ya grimoire ka data nahi hai.',
    'tools.data.importError.journalShape': 'Us file mein journal entries sahi shape mein nahi hain.',
    'tools.data.importError.wirdShape': 'Us file mein wird ki ginti sahi shape mein nahi hai.',
    'tools.data.importError.grimoireShape': 'Us file mein grimoire items sahi shape mein nahi hain.',

    // ---- Data: Al Asrar intros (first-person, Khafi's voice) ----
    'tools.data.alAsrarIntro.kitab':
      'Maine in kitabon ke saath bahut waqt guzara hai. Kitab lafz ka matlab hai ek kitab. Lekin purani kitabon mein iska matlab kagaz aur syahi se bahut zyada hai. Kitab ke baare mein maine kya paya, khud kitabon se.',
    'tools.data.alAsrarIntro.talasim':
      'Talisman woh charm nahi hai jo bazaar mein khareeda jata hai. Purani kitabon mein yeh ek cheez hai jo dekh-bhaal se banayi jati hai, Naam aur harf aur number balance mein set kiye jate hain. Kitabein iske baare mein kya kehti hain, yeh raha.',
    'tools.data.alAsrarIntro.ashkal':
      'Ashkal ka matlab hai forms. Form sirf kagaz par ek shape nahi hai. In kitabon mein form ek bartan hai. Woh rooh ko is tarah rakhta hai jaise cup paani ko rakhta hai. Forms ke baare mein kitabein kya kehti hain, yeh raha.',
    'tools.data.alAsrarIntro.figure-forge':
      'Figure likha nahi jata. Woh banaya jata hai. Purani kitabein sakhti se batati hain ki figure kaise banaya jata hai, kis cheez se banaya jata hai, aur kab banaya jata hai. Maine unke rules yahan jama kiye hain taaki aap hunar ko dekh sakein jaisa woh batati hain.',
    'tools.data.alAsrarIntro.talism-studio':
      'Purani kitabon mein studio ke liye koi modern lafz nahi hai. Lekin woh jis kamre mein kaam hota hai, use saaf detail mein batati hain. Maine unki workplace ki description yahan jama ki hai, taaki aap dekh sakein ki unhone use kaise set kiya tha.',
    'tools.data.alAsrarIntro.haqaiq':
      'Haqaiq ka matlab hai realities. Yeh lafz us taraf ishara karta hai jo cheezon ki satah ke neeche asal hai. Sufi kehte hain ki realities dil mein rehti hain, kitabon mein nahi. Unhone unke baare mein kya likha, yeh raha.',
    'tools.data.alAsrarIntro.shart':
      'Shart ka matlab hai ek shart. In kitabon mein kuch bhi apni sharton ke bina kaam nahi karta. Kitabein unhe dekh-bhaal se list karti hain, kyunki bina shart ke kiya gaya kaam galat kiya gaya kaam hai. Woh jo shartein batati hain, yeh rahi.',
    'tools.data.alAsrarIntro.sirr-al-jalil':
      'Al-Sirr al-Jalil ka matlab hai Bada Raaz. Yeh ek naam, ek number aur ek darwaza hai, ek saath. Maine kitabein iske baare mein kya kehti hain, yahan jama kiya hai, taaki aap dekh sakein ki ek Naam kaise raazon ka poora maidan khol deta hai.',
    'tools.data.alAsrarIntro.durus':
      'Durus ka matlab hai sabak. Purane ustad sirf kitabon se nahi padhate the. Woh khamoshi se, misaal se aur ustad ki sohbat se padhate the. Seekhne ke baare mein woh kya kehte hain, yeh raha.',
    'tools.data.alAsrarIntro.index':
      'Index kitab ka map hai. Purani kitabein apna ilm jaan-boojh kar chhupate the, isliye index hi woh chabi hai jo unhe kholti hai. Maine kitabein apne indexes ke baare mein kya kehti hain, yahan jama kiya hai.',
    'tools.data.alAsrarIntro.library':
      'Purani kitabein khuli shelves par nahi rakhi jati thi. Woh chhupayi jati thi, dafnayi jati thi, sandookon mein band ki jati thi aur raaz mein aage badhayi jati thi. Yeh page jama karta hai ki kitabein aisi kitabon ki library rakhne ke baare mein kya kehti hain.',
    'tools.data.alAsrarIntro.atlas':
      'Atlas ek map hai. Lekin yeh atlas zameen ka map nahi hai. Yeh aasmaan, spheres aur un harf ka map hai jo un par raaj karte hain. Purani kitabein aasmaan ko kaise khichte hain, yeh raha.',
    'tools.data.alAsrarIntro.qalam':
      'Qalam ka matlab hai ek pen. Lekin in kitabon mein Qalam meri desk par rakha pen nahi hai. Yeh pehli cheez hai jo Allah ne banayi, aur pehli cheez jisne likha. Qalam ke baare mein kitabein kya kehti hain, yeh raha.',
    'tools.data.alAsrarIntro.khatam':
      'Khatam ka matlab hai ek seal. Seal khat ko band karti hai aur batati hai ki use kisne bheja. Purani kitabon mein seal ek taaqat bhi hai, aur Suleman uske ustad hain. Seal ke baare mein kitabein kya kehti hain, yeh raha.',
    'tools.data.alAsrarIntro.plate':
      'Plate dhaat ki ek flat sheet hai, figure ko uthane ke liye banayi gayi. Sona, chaandi, taamba, loha aur seesa. Har ek ka apna kaam hai. Har plate ke baare mein kitabein kya kehti hain, maine yahan jama kiya hai.',
    'tools.data.alAsrarIntro.works':
      'Kaam ek practical amal hai, discipline ke saath aur Allah ko yaad rakh kar kiya jata hai. Kitabein kaam kya hai, use kya chahiye, aur ilm aur amal kaise saath rehte hain, iske baare mein kya kehti hain, maine jama kiya hai. Yeh raha, khud kitabon se.',
    'tools.data.alAsrarIntro.bakhur-adad':
      'Bakhur aur Adad ek catalogue hai, isse zyada kuch nahi. Yeh khushboo wali cheezon aur number ke kaam ka naam deta hai, har ek ka source aur page ke saath, taaki reader entries ko gin sake aur har ek ko dekh sake. Yeh kabhi quantity, taiyari ya recipe nahi deta.',
    'tools.data.alAsrarIntro.shurut':
      'Shurut shartein hain. Sharton ke bahar kiya gaya kaam galat kiya gaya kaam hai. Kitabein jo shartein batati hain, maine jama ki hain, har ek apne source aur page ke saath, taaki reader unhe ek ek karke check kar sake.',
    'tools.data.alAsrarIntro.glossary':
      'Glossary is section mein use hone wale lafzon ko seedhe shabdon mein samjhata hai. Yeh ab tak jama kiye gaye terms hain, har ek apne source aur page ke saath. Poori table abhi bhi notebook se jama ki ja rahi hai, aur yahan aur terms jude jayenge.',

    // ---- Data: talisman figures ----
    'tools.data.figureTitle.mutakabbir': 'al-Mutakabbir ka square, 4 by 4',
    'tools.data.figureCaption.mutakabbir':
      'Kitab se number ka ek square. Kitab yeh number jaise hain waise hi deti hai. Hum unhe yahan bilkul waise hi khichte hain jaise likhe hain.',
    'tools.data.figureNote.mutakabbir':
      'Yeh grid magic square ke roop mein check nahi hota. Rows ka jod hai 206, 183, 198 aur 206. Number 56 do baar aata hai. Hum use dikhate hain jaisa kitab mein hai. Hum use theek nahi karte.',
    'tools.data.figureTitle.jabbar': 'al-Jabbar ka square, 5 by 5',
    'tools.data.figureCaption.jabbar':
      'Kitab is square ka number deti hai, grid nahi. Hum sirf wahi dikhate hain jo kitab deti hai.',
    'tools.data.figureNote.jabbar': 'Grid khud haath mein nahi hai. Hum cells ka andaza nahi lagate.',
    'tools.data.figureTitle.solomon-triangle': 'Suleman triangle wafq, 3 by 3',
    'tools.data.figureCaption.solomon-triangle':
      'Nau number ka ek chhota square. Har row, har column aur har diagonal ka jod 15 hai.',
    'tools.data.figureTitle.fatiha-wafqs': 'al-Fatiha ke chhode gaye harf ke saat wafq',
    'tools.data.figureCaption.fatiha-wafqs':
      'Kitab kehti hai ki al-Fatiha ke har chhode gaye harf ke liye ek sevenfold wafq hai. Rule yahan bataya gaya hai. Koi grid nahi khinchi gayi.',
    'tools.data.figureNote.fatiha-wafqs': 'Grid haath mein nahi hain. Jo hamare paas nahi hai, use hum nahi khichte.',
    'tools.data.figureTitle.seven-seals': 'Saat dinon ke liye saat seals',
    'tools.data.figureCaption.seven-seals':
      'Kitab chapter ko is line se kholti hai. Saat dinon ke liye saat seals ka form. Neeche wale saat nishan woh graphic nishan hain jo seals ke andar mile hain.',
    'tools.data.figureNote.seven-seals':
      'Kitab mein seals number aur haath se khinchi hui nishaniyon wale 4 by 4 ke saat grid hain. Grid kitab mein haath se khinche hue hain. Woh yahan likhe nahi gaye hain. Sirf saat nishan khinche gaye hain.',

    // ---- Data: Sawaqit name glosses ----
    'tools.data.sawaqitGloss.fard': 'Jo Akela hai, Jo Ek hai',
    'tools.data.sawaqitGloss.jabbar': 'Jo Majboor karne wala hai, Jo Theek karne wala hai',
    'tools.data.sawaqitGloss.shahid': 'Jo Gawah hai',
    'tools.data.sawaqitGloss.thabit': 'Jo Mazboot hai, Jo Hamesha rehne wala hai',
    'tools.data.sawaqitGloss.zahir': 'Jo Zaahir hai, Jo Madad karne wala hai',
    'tools.data.sawaqitGloss.khabir': 'Jo Sab jaanne wala hai',
    'tools.data.sawaqitGloss.zaki': 'Jo Paak hai',

    // ---- Data: plate metals ----
    'tools.data.metal.gold': 'Sona',
    'tools.data.metal.silver': 'Chaandi',
    'tools.data.metal.iron': 'Loha',
    'tools.data.metal.quicksilver': 'Paara',
    'tools.data.metal.lead': 'Seesa',
    'tools.forge.reasonOrderUnsupported': 'Order {order} supported nahi hai. Sirf order 3 se 20 tak, aur order 2 ka koi magic square hota hi nahi.',
    'tools.forge.reasonNoConstruction': 'Order {order} ke liye koi documented construction implement nahi hua hai, isliye koi square nahi banaya jata.',
    'tools.forge.reasonTargetNotWhole': 'Target sum ek whole positive number hona chahiye.',
    'tools.forge.reasonUnreachable': 'Target {target} ko {order}x{order} square ke liye nahi milaya ja sakta. Base square ka jod {base} hai, aur har cell ko ek hi whole number se shift karne se har line {order} ke multiple se badalti hai, isliye {target} is tarah nahi mil sakta. Aisa target chunein jo {base} se {order} ke multiple se alag ho.',
    'tools.forge.reasonBelowBase': 'Target {target}, {order}x{order} square ke liye base sum {base} se kam hai. Use milane ke liye {offset} ka shift chahiye hota, jisse sabse chhota cell zero ya negative ho jata. Is tarah sirf {base} ya usse zyada ke target banaye ja sakte hain.',
    'tools.forge.failNotSquare': 'Grid square nahi hai: har row mein utne hi cell hone chahiye jitni rows hain.',
    'tools.forge.failCell': 'Row {r}, column {c} wala cell positive whole number nahi hai.',
    'tools.forge.failRepeated': 'Number {value} ek se zyada baar aata hai.',
    'tools.forge.failRow': 'Row {n} ka jod {sum} hai, {target} nahi.',
    'tools.forge.failColumn': 'Column {n} ka jod {sum} hai, {target} nahi.',
    'tools.forge.failDiag1': 'Diagonal (upar-bayein se neeche-dayein) ka jod {sum} hai, {target} nahi.',
    'tools.forge.failDiag2': 'Diagonal (upar-dayein se neeche-bayein) ka jod {sum} hai, {target} nahi.',
    'tools.forge.failSomeNotWhole': 'Kuch cells positive whole number nahi hain.',
    'tools.forge.failNotDistinct': 'Saare number alag nahi hain.',
  },
  bn: {
    // ---- Shared ----
    'tools.common.system': 'পদ্ধতি',
    'tools.common.school': 'স্কুল',
    'tools.common.kabir': 'কবীর (বড়)',
    'tools.common.saghir': 'সগীর (ছোট)',
    'tools.common.mashriqi': 'মাশরিকি (পূর্বের)',
    'tools.common.maghribi': 'মাগরিবি (পশ্চিমের)',
    'tools.common.save': 'সেভ করুন',
    'tools.common.savedToGrimoire': 'গ্রিমোয়ারে সেভ হয়েছে',
    'tools.common.total': 'মোট যোগফল',
    'tools.common.grandTotal': 'মোট যোগফল',
    'tools.common.runningTotal': 'চলতি যোগফল',
    'tools.common.value': 'মান',
    'tools.common.letter': 'অক্ষর',
    'tools.common.name': 'নাম',
    'tools.common.word': 'শব্দ',
    'tools.common.sayIt': 'বলুন',
    'tools.common.search': 'খুঁজুন',
    'tools.common.closeSearch': 'সার্চ বন্ধ করুন',
    'tools.common.cancel': 'বাতিল করুন',
    'tools.common.add': 'যোগ করুন',
    'tools.common.exportJson': 'JSON এক্সপোর্ট করুন',
    'tools.common.importJson': 'JSON ইমপোর্ট করুন',
    'tools.common.copied': 'কপি হয়েছে',
    'tools.common.untitledNote': 'নাম ছাড়া নোট',
    'tools.common.source': 'উৎস',
    'tools.common.sources': 'উৎসগুলো',
    'tools.common.day': 'দিন',
    'tools.common.night': 'রাত',
    'tools.common.yes': 'হ্যাঁ',
    'tools.common.no': 'না',
    'tools.common.all': 'সব',
    'tools.common.noMatchesFor': '“{q}”-এর জন্য কিছু পাওয়া যায়নি।',
    'tools.common.importFail': 'ওই ফাইলটি ইমপোর্ট করা যায়নি।',
    'tools.common.readFail': 'ওই ফাইলটি পড়া যায়নি।',

    // ---- Hub ----
    'tools.hub.title': 'পড়াশোনার টুলস',
    'tools.hub.eyebrow': 'পড়াশোনার টুলস',
    'tools.hub.subtitle': 'অক্ষর, সংখ্যা আর নিজের পড়ার নোটের জন্য ছোট টুলস। এখানে কিছুই কোনো ফলের প্রতিশ্রুতি দেয় না। সবই শুধু পড়াশোনার জন্য।',
    'tools.hub.topicsTitle': 'টপিক',

    // ---- Layout ----
    'tools.layout.back': 'পড়াশোনার টুলস',
    'tools.layout.search': 'খুঁজুন',
    'tools.layout.searchAria': 'টুলস খুঁজুন (Ctrl+K)',
    'tools.layout.defaultEyebrow': 'পড়াশোনার টুলস',

    // ---- Disclaimer ----
    'tools.disclaimer.text':
      'এই টুলস শুধু পড়াশোনা আর হিসাবের জন্য। এগুলো কোনো ফল, সুরক্ষা, শেফা বা রিজিকের প্রতিশ্রুতি দেয় না। এগুলো দিয়ে কখনো কারো ক্ষতি করবেন না।',
    'tools.disclaimer.link': 'এই টুলস কীভাবে কাজ করে',

    // ---- Search overlay ----
    'tools.search.placeholder': 'টুলস, টপিক আর 99 নাম খুঁজুন…',
    'tools.search.aria': 'টুলস, টপিক আর 99 নাম খুঁজুন',
    'tools.search.dialogLabel': 'পড়াশোনার টুলস খুঁজুন',
    'tools.search.hint': '“letters”, “counter”, “notes”, “Malakut” চেষ্টা করুন, অথবা কোনো নাম যেমন “Rahman”।',

    // ---- Shell / FilledToolPage ----
    'tools.shell.emptyTitle': 'এখানে এখনো কিছু নেই',
    'tools.shell.emptyMessage':
      'এখানে এখনো কিছু নেই. এখানে শুধু সেটাই লেখা হয় যা উৎস, পাতা আর অনুমতির নোটসহ পাওয়া গেছে।',
    'tools.shell.aria.figureEntries': 'Figure entries',
    'tools.shell.aria.formEntries': 'Form entries',
    'tools.shell.aria.sealEntries': 'Seal entries',
    'tools.shell.aria.records': 'Records',
    'tools.shell.aria.entries': 'Entries',
    'tools.shell.aria.monograph': 'Monograph',
    'tools.shell.aria.courseEntries': 'Course entries',
    'tools.shell.aria.indexResults': 'Index results',
    'tools.shell.aria.libraryEntries': 'Library entries',
    'tools.shell.aria.atlasEntries': 'Atlas entries',
    'tools.shell.aboutSection': 'এই অংশ সম্পর্কে',
    'tools.shell.entriesOne': '1টি এন্ট্রি, প্রত্যেকটির উৎস লেখা আছে।',
    'tools.shell.entriesMany': '{n}টি এন্ট্রি, প্রত্যেকটির উৎস লেখা আছে।',
    'tools.shell.noEntriesMatch': 'এই ফিল্টারে কোনো এন্ট্রি মেলেনি।',

    // ---- Figures (TalismanFigures) ----
    'tools.figures.studyOnly':
      'এই চিত্রগুলো শুধু পড়াশোনার জন্য। এগুলো কোনো ফলের প্রতিশ্রুতি দেয় না। এগুলো কোনো ধর্মীয় সিদ্ধান্ত দেয় না। ধীরে ধীরে পড়ুন আর দেওয়া উৎসগুলো দেখে নিন।',

    // ---- Huruf ----
    'tools.huruf.title': 'হুরুফ — অক্ষর ও সংখ্যা',
    'tools.huruf.eyebrow': 'অক্ষর ও সংখ্যা',
    'tools.huruf.subtitle':
      '28টি আরবি অক্ষর আর তাদের আবজাদ মান। পদ্ধতি আর স্কুল বেছে নিন, টেবিল নিজে বদলে যাবে।',
    'tools.huruf.thLetter': 'অক্ষর',
    'tools.huruf.thName': 'নাম',
    'tools.huruf.thValue': 'মান',
    'tools.huruf.tableNote': 'এই টেবিল সাধারণ আবজাদ মান (মাশরিকি/মাগরিবি) দিয়ে বানানো। কবীর মানে পুরো মান। সগীর মানে সেই মান যা এক অঙ্কে ছোট করা হয়েছে। মান Wikipedia-র “Abjad numerals” আর OpenArabic ও WiserWork-এর আবজাদ ক্যালকুলেটর দিয়ে যাচাই করা হয়েছে। দুই স্কুল 22টি অক্ষরে একমত। আর ছয়টি অক্ষরে আলাদা। সাদ। দাদ। সিন। শিন। জা। গাইন।',
    'tools.huruf.howCounted': 'অক্ষর কীভাবে গোনা হয়',
    'tools.huruf.mappingsTitle': 'যে ম্যাপিং আমরা এখনো দেখাই না',
    'tools.huruf.elementGroups': 'উপাদানের দল',
    'tools.huruf.luminous': 'আলোকিত ও অন্ধকার অক্ষর',
    'tools.huruf.planetLinks': 'অক্ষর আর গ্রহের সম্পর্ক',
    'tools.huruf.sourceNeeded': 'উৎস দরকার. এই ম্যাপিংয়ের জন্য এখনো কোনো উৎস বলা হয়নি।',

    // ---- Asma ----
    'tools.asma.title': 'আসমা — 99 নাম',
    'tools.asma.eyebrow': '99 নাম',
    'tools.asma.subtitle':
      'নাম খুঁজুন আরবি, উচ্চারণ বা অর্থ দিয়ে। মান আগে থেকেই কবীর মাশরিকিতে আছে. নিচে পদ্ধতি বা স্কুল বদলান, মান নিজে বদলে যাবে।',
    'tools.asma.reckonTitle': 'কোনো নামের হিসাব করুন',
    'tools.asma.reckonLabel': 'যেকোনো নাম বা লেখা লিখুন',
    'tools.asma.reckonPlaceholder': 'যেমন Rahman',
    'tools.asma.noArabic': 'এই লেখায় কোনো আরবি অক্ষর পাওয়া যায়নি।',
    'tools.asma.searchPlaceholder': 'আরবি, উচ্চারণ বা অর্থ দিয়ে খুঁজুন…',
    'tools.asma.searchAria': '99 নাম খুঁজুন',
    'tools.asma.noNames': '“{q}” দিয়ে কোনো নাম মেলেনি।',
    'tools.asma.bare': 'খালি',
    'tools.asma.withAl': '“al-” সহ',
    'tools.asma.saveAria': '{name}-কে গ্রিমোয়ারে সেভ করুন',
    'tools.asma.sourceNote':
      'তালিকা Ar-Rahman দিয়ে শুরু হয়ে As-Sabur-এ শেষ হয়; আল্লাহর নিজের নাম এই 99-এর মধ্যে গোনা হয়নি।',

    // ---- Bast ----
    'tools.bast.title': 'বাস্ত — কোনো লেখা খোলা',
    'tools.bast.eyebrow': 'লেখা খোলা',
    'tools.bast.subtitle':
      'যেকোনো লেখা লিখুন আর অক্ষরে অক্ষরে খোলা অবস্থায় দেখুন, প্রতিটি অক্ষরের মান আর চলতি যোগফলসহ।',
    'tools.bast.yourText': 'আপনার লেখা',
    'tools.bast.placeholder': 'এখানে আরবি লেখা লিখুন…',
    'tools.bast.countedAs': 'এভাবে গোনা হয়েছে:',
    'tools.bast.empty': 'খোলার মতো এখনো কিছু নেই। উপরে কিছু লিখুন, অথবা উদাহরণ চেষ্টা করুন।',
    'tools.bast.tryExample': 'উদাহরণ চেষ্টা করুন:',
    'tools.bast.thHash': '#',
    'tools.bast.thLetter': 'অক্ষর',
    'tools.bast.thKabir': 'কবীর',
    'tools.bast.thSaghir': 'সগীর',
    'tools.bast.thRunning': 'চলতি যোগফল',
    'tools.bast.saveUnfolding': 'এই খোলা লেখাটি গ্রিমোয়ারে সেভ করুন',
    'tools.bast.howCounted': 'লেখা কীভাবে গোনা হয়',

    // ---- Fawatih ----
    'tools.fawatih.title': 'ফাওয়াতিহ (শুরুর অক্ষর)',
    'tools.fawatih.eyebrow': 'অক্ষর ও সংখ্যা',
    'tools.fawatih.subtitle':
      'চৌদ্দটি অক্ষরের রূপ ঊনত্রিশটি সূরা খোলে। নিচের রূপগুলো প্রতিটি সূরার প্রথম আয়াতে একটি নিয়ম চালিয়ে পাওয়া গেছে। এগুলো লেখা থেকে বের হয়েছে, হাতে লেখা হয়নি।',
    'tools.fawatih.summary':
      '{total}টি সূরা আলাদা আলাদা অক্ষর দিয়ে খোলে, {forms}টি আলাদা রূপে। পদ্ধতি আর স্কুল বেছে নিন, মান বদলে যাবে। “Say it” কলাম প্রতিটি রূপ লাতিন অক্ষরে পড়ে শোনায়, যাতে আরবি না জানলেও আপনি বলতে পারেন।',
    'tools.fawatih.thForm': 'রূপ',
    'tools.fawatih.thSayIt': 'বলুন',
    'tools.fawatih.thSurahs': 'যে সূরাগুলো খোলে',
    'tools.fawatih.thValue': 'মান',
    'tools.fawatih.howFound': 'এগুলো কীভাবে পাওয়া গেল',
    'tools.fawatih.howFoundBody': 'এখানে যে কুরআনের লেখা ব্যবহার হয়, তা পুরোপুরি স্বরচিহ্নসহ। প্রতিটি সাধারণ শব্দে স্বরের চিহ্ন আছে। যে শব্দে কোনো স্বরের চিহ্নই নেই, তা সূরার শুরুতে চোখে পড়ে। তাতে শুধু দীর্ঘ করার চিহ্ন (মাদ্দাহ) থাকতে পারে। অথবা কোনো চিহ্নই না। আর তা এক থেকে পাঁচ অক্ষরের হয়। নিয়মটি হলো। প্রতিটি সূরার প্রথম আয়াতের প্রথম শব্দ নেওয়া হয়। বাসমালাহর পরে। যেখানে বাসমালাহ উপসর্গ, আয়াত নয়। আর তখনই রাখা হয় যখন তা এমন খালি শব্দ হয়। এই নিয়মে ঠিক 29টি সূরা আর 14টি রূপ পাওয়া যায়। সাধারণ প্রথম শব্দ, যেমন সূরা 71-এর “inna” বা সূরা 75-এর “la”, স্বরের চিহ্ন আছে বলে নেওয়া হয়নি। সূরা 42 হলো একমাত্র ক্ষেত্র যেখানে অক্ষর দুই আয়াত জুড়ে চলে। Ha Mim আয়াত 1 খোলে। আর Ayn Sin Qaf পুরো আয়াত 2।',
    'tools.fawatih.basmalahBody': 'বাসমালাহ সূরা আল-ফাতিহার আয়াত 1। তাই তা ওই সূরার লেখায় থাকে। অন্য সূরাগুলোতে তা ছাপা লেখায় উপসর্গ, আয়াত নয়। তাই নিয়ম প্রথমে তা সরিয়ে দেয়।',
    'tools.fawatih.notSay': 'এই পাতা যা বলে না',
    'tools.fawatih.notSayBody': 'এই পাতায় দেখানো হয়েছে কোন অক্ষর কোন সূরা খোলে। আর অক্ষরের যোগফল কত হয়। অক্ষরের অর্থ কী, তা বলা হয়নি। অর্থের জন্য এখনো কোনো উৎস বলা হয়নি। তাই কোনো অর্থ দেওয়া হয়নি। রূপগুলো ঠিক সেভাবেই দেখানো হয়েছে যেভাবে সূরার শুরুতে আসে। এর বেশি কিছু নয়।',
    'tools.fawatih.sourceTail':
      'রূপ আর মান ওই লেখা থেকেই রান টাইমে বের হয়েছে; টেস্ট স্যুট যাচাই করে যে ফল হলো 29টি সূরা, 14টি রূপ আর উপরে দেখানো হুবহু ম্যাপিং।',

    // ---- Sawaqit ----
    'tools.sawaqit.title': 'সাওয়াকিত (সাতটি অনুপস্থিত অক্ষর)',
    'tools.sawaqit.eyebrow': 'অক্ষর ও সংখ্যা',
    'tools.sawaqit.subtitle':
      'বর্ণমালার সাতটি অক্ষর আল-ফাতিহায় কোথাও আসে না। নিচের অক্ষরগুলো ফাতিহার অক্ষর গুনে পাওয়া গেছে। এগুলো লেখা থেকে বের হয়েছে, হাতে লেখা হয়নি।',
    'tools.sawaqit.textCounted': 'যে লেখাটি গোনা হয়েছে',
    'tools.sawaqit.textCountedBody': 'আল-ফাতিহা গোনা হয়েছে। কুরআন 1:1–7। পুরো সূরা। বাসমালাহসহ। যা তার প্রথম আয়াত। উসমানি লেখায় যেমন লেখা আছে, তাতে 29টি শব্দ আর 139টি অক্ষর আছে। আরবির নিচের লাতিন লাইনগুলো তা পড়ে শোনায়। যাতে আরবি না জানলেও আপনি সাথে চলতে পারেন।',
    'tools.sawaqit.lettersUsed': 'ফাতিহায় ব্যবহৃত 21টি অক্ষর',
    'tools.sawaqit.lettersUsedBody': 'আবজাদ ক্রমে দেখানো হয়েছে। বর্ণমালার বাকি প্রতিটি অক্ষর সূরায় অন্তত একবার এসেছে।',
    'tools.sawaqit.thAbsent': 'অনুপস্থিত অক্ষর',
    'tools.sawaqit.thName': 'নাম',
    'tools.sawaqit.thValue': 'মান',
    'tools.sawaqit.footerTotal': 'সাতটি অনুপস্থিত অক্ষরের যোগফল',
    'tools.sawaqit.sumsBody': 'সাতটি অনুপস্থিত অক্ষরের যোগফল কবীর মাশরিকিতে 2,390। কবীর মাগরিবিতে 2,990। পার্থক্য শুধু শিন অক্ষরের। পূর্বের টেবিলে 300। পশ্চিমের টেবিলে 1,000।',
    'tools.sawaqit.namesTitle': 'সাতটি অক্ষরের নাম',
    'tools.sawaqit.namesBody': 'বইগুলো প্রতিটি অনুপস্থিত অক্ষরের জন্য আল্লাহর একটি নাম দেয়। সাতটি নাম সেই ক্রমেই আছে যে ক্রমে বইগুলো দেয়। Fa। Jim। Shin। Tha। Za। Kha। Zay। প্রথম ধ্বনিগুলো দিয়ে মনে রাখুন। Fa-Ja-Sha-Tha-Za-Kha-Za। যে দুটি অক্ষর “z”-এর মতো শোনায়, সেগুলো আলাদা অক্ষর। Za’ (ظ) আর Zay (ز)।',
    'tools.sawaqit.thLetter': 'অক্ষর',
    'tools.sawaqit.thName2': 'নাম',
    'tools.sawaqit.thAlso': 'এভাবেও দেওয়া হয়েছে',
    'tools.sawaqit.sourceTail':
      'গণনা ওই লেখা থেকেই রান টাইমে হয়েছে; টেস্ট স্যুট যাচাই করে যে ফল হলো উপরে দেখানো সাতটি অক্ষর।',

    // ---- Shields ----
    'tools.shields.title': 'শিল্ডস (চলতি অক্ষরের যোগফল)',
    'tools.shields.eyebrow': 'অক্ষর ও সংখ্যা',
    'tools.shields.subtitle':
      'পাঁচটি ছোট লেখা, শব্দে শব্দে গোনা। প্রতিটি সারিতে একটি শব্দ, তার মান আর চলতি যোগফল আছে, যাতে আপনি হিসাবটি মোট যোগফল পর্যন্ত অনুসরণ করতে পারেন।',
    'tools.shields.spellingTitle': 'বানান নিয়ে একটি কথা',
    'tools.shields.spellingBody1': 'যোগফল উসমানি লেখাকে যেমন লেখা আছে তেমনই গোনা হয়েছে। শাদ্দাসহ। শাদ্দা তার অক্ষরকে দ্বিগুণ করে দেয়। তাই al-Rahman এখানে 529 হয়। আর শাদ্দা ছাড়া সাধারণ বানান আসমা পাতায় 329 হয়। দুটোতেই গোনার নিয়ম এক। পার্থক্য লেখার বানানের। নিয়মের নয়। বাসমালাহ আল-ফাতিহার আয়াত 1। তাই তা ফাতিহায় গোনা হয়েছে। আল-ইখলাস, আল-ফালাক আর আল-নাসে বাসমালাহ ওই সূরাগুলোর আয়াত নয়। তাই সেগুলোতে গোনা হয়নি।',
    'tools.shields.spellingBody2': 'লাতিন লাইনগুলো প্রতিটি লেখা পড়ে শোনায়। যাতে আরবি না জানলেও আপনি অনুসরণ করতে পারেন। এই পড়ায় AA হলো আইন অক্ষর। আর th হলো সা অক্ষর। “al”-এর l সূর্য-অক্ষরের আগেও লেখা থাকে। তাই ar-Rahman পড়া হয় alrrahman।',
    'tools.shields.thHash': '#',
    'tools.shields.thWord': 'শব্দ',
    'tools.shields.thSayIt': 'বলুন',
    'tools.shields.thValue': 'মান',
    'tools.shields.thRunning': 'চলতি যোগফল',
    'tools.shields.grandTotalWords': 'মোট যোগফল ({n}টি শব্দ)',
    'tools.shields.saveTotal': 'এই মোট যোগফল গ্রিমোয়ারে সেভ করুন',
    'tools.shields.sourceTail':
      'যোগফল ওই লেখা থেকেই রান টাইমে বের হয়েছে; টেস্ট স্যুট পাঁচটি যোগফলই দুই পদ্ধতি আর দুই স্কুলে যাচাই করে।',

    // ---- Journal ----
    'tools.journal.title': 'জার্নাল — পড়ার নোট',
    'tools.journal.eyebrow': 'পড়ার নোট',
    'tools.journal.subtitle': 'যা পড়লেন তার নোট. শুধু এই ডিভাইসেই থাকে।',
    'tools.journal.deviceNote': 'আপনি এখানে যা লিখবেন, তা শুধু এই ডিভাইসেই থাকে। কোথাও পাঠানো হয় না।',
    'tools.journal.editNote': 'নোট বদলান',
    'tools.journal.newNote': 'নতুন নোট',
    'tools.journal.titleLabel': 'শিরোনাম',
    'tools.journal.titlePlaceholder': 'এই নোটটি কী নিয়ে?',
    'tools.journal.noteLabel': 'নোট',
    'tools.journal.notePlaceholder': 'যা শিখলেন, যা প্রশ্ন আছে, বা যে উদ্ধৃতি মনে রাখতে চান, তা লিখুন…',
    'tools.journal.addNote': 'নোট যোগ করুন',
    'tools.journal.saveChanges': 'পরিবর্তন সেভ করুন',
    'tools.journal.importAria': 'জার্নালের JSON ফাইল ইমপোর্ট করুন',
    'tools.journal.empty': 'এখনো কোনো নোট নেই। উপরে থেকে আপনার প্রথম নোট যোগ করুন।',
    'tools.journal.editAria': '{title} বদলান',
    'tools.journal.deleteAria': '{title} মুছুন',
    'tools.journal.edited': '{date}-এ বদলানো হয়েছে',
    'tools.journal.emptySubmit': 'আগে শিরোনাম বা কিছু লেখা লিখুন',
    'tools.journal.updated': 'নোট আপডেট হয়েছে',
    'tools.journal.added': 'নোট যোগ হয়েছে',
    'tools.journal.deleted': 'নোট মুছে ফেলা হয়েছে',
    'tools.journal.exported': 'জার্নাল এক্সপোর্ট হয়েছে',
    'tools.journal.importedOne': '1টি নোট ইমপোর্ট হয়েছে',
    'tools.journal.importedMany': '{n}টি নোট ইমপোর্ট হয়েছে',

    // ---- Wird ----
    'tools.wird.title': 'ওয়ার্ড — জিকির কাউন্টার',
    'tools.wird.eyebrow': 'জিকির কাউন্টার',
    'tools.wird.subtitle': 'একটি সাধারণ কাউন্টার। একটি বাক্য বেছে নিন, বড় বোতামটি চাপুন, আর চাইলে লক্ষ্য ঠিক করুন।',
    'tools.wird.deviceNote': 'আপনি এখানে যা গুনবেন, তা শুধু এই ডিভাইসেই থাকে। কোথাও পাঠানো হয় না।',
    'tools.wird.choosePhrase': 'বাক্য বেছে নিন',
    'tools.wird.addPhraseLabel': 'নিজের বাক্য যোগ করুন',
    'tools.wird.addPhrasePlaceholder': 'নিজের বাক্য যোগ করুন…',
    'tools.wird.addAria': 'বাক্য যোগ করুন',
    'tools.wird.ofTarget': '{target}-এর মধ্যে {count} · {progress}%',
    'tools.wird.progressAria': '{target}-এর দিকে অগ্রগতি',
    'tools.wird.tapBtn': 'গুনতে চাপুন',
    'tools.wird.countAria': '{phrase}-এর জন্য একটি গুনুন',
    'tools.wird.targetLabel': 'লক্ষ্য',
    'tools.wird.resetPhrase': 'এই বাক্যটি শূন্য করুন',
    'tools.wird.resetAll': 'সব শূন্য করুন',
    'tools.wird.resetPhraseToast': '{phrase} শূন্য করা হয়েছে',
    'tools.wird.resetAllToast': 'সব গণনা শূন্য করা হয়েছে',
    'tools.wird.phraseAdded': 'বাক্য যোগ হয়েছে',

    // ---- Grimoire ----
    'tools.grimoire.title': 'গ্রিমোয়ার — সেভ করা জিনিস',
    'tools.grimoire.eyebrow': 'সেভ করা জিনিস',
    'tools.grimoire.subtitle': 'নাম, খোলা লেখা আর নোট যা আপনি অন্য টুলস থেকে সেভ করেছেন, সব এক জায়গায়।',
    'tools.grimoire.deviceNote': 'আপনি এখানে যা সেভ করবেন, তা শুধু এই ডিভাইসেই থাকে। কোথাও পাঠানো হয় না।',
    'tools.grimoire.addNoteTitle': 'নোট যোগ করুন',
    'tools.grimoire.titleLabel': 'শিরোনাম',
    'tools.grimoire.titlePlaceholder': 'এটা কী নিয়ে?',
    'tools.grimoire.detailLabel': 'বিস্তারিত',
    'tools.grimoire.detailPlaceholder': 'যে বিস্তারিত রাখতে চান, তা লিখুন…',
    'tools.grimoire.saveNote': 'নোট সেভ করুন',
    'tools.grimoire.importAria': 'গ্রিমোয়ারের JSON ফাইল ইমপোর্ট করুন',
    'tools.grimoire.empty':
      'এখনো কিছু সেভ হয়নি। আসমা পাতা থেকে কোনো নাম, বাস্ত পাতা থেকে কোনো খোলা লেখা সেভ করুন, অথবা উপরে থেকে নোট যোগ করুন।',
    'tools.grimoire.kindName': 'নাম',
    'tools.grimoire.kindBast': 'খোলা লেখা',
    'tools.grimoire.kindNote': 'নোট',
    'tools.grimoire.deleteAria': '{title} মুছুন',
    'tools.grimoire.emptySubmit': 'আগে শিরোনাম বা কিছু বিস্তারিত লিখুন',
    'tools.grimoire.saved': 'নোট গ্রিমোয়ারে সেভ হয়েছে',
    'tools.grimoire.deleted': 'জিনিসটি মুছে ফেলা হয়েছে',
    'tools.grimoire.exported': 'গ্রিমোয়ার এক্সপোর্ট হয়েছে',
    'tools.grimoire.importedOne': '1টি জিনিস ইমপোর্ট হয়েছে',
    'tools.grimoire.importedMany': '{n}টি জিনিস ইমপোর্ট হয়েছে',

    // ---- Today ----
    'tools.today.title': 'আজ',
    'tools.today.eyebrow': 'সময় ও আকাশ',
    'tools.today.subtitle':
      'আজকের দিনের কথা: তারিখ, আজকের শাসক, আর আমরা এখন যে প্ল্যানেটারি আওয়ারে আছি।',
    'tools.today.hijriLabel': 'হিজরি তারিখ (আনুমানিক):',
    'tools.today.hijriApprox': 'এই তারিখ আনুমানিক. এটি সিভিল ক্যালেন্ডার, চাঁদ দেখে ঠিক করা তারিখ নয়।',
    'tools.today.rulerTitle': 'আজকের শাসক',
    'tools.today.rulerBodyA':
      'দিনের প্রথম আওয়ারের শাসক, তাই এটাই আজকের দিনের শাসক। দিন গোনা হয় সূর্য ওঠা থেকে: সূর্য ওঠার এক মুহূর্ত আগের সময় আগের দিনের।',
    'tools.today.dayRulersNote': 'দিনের শাসক এভাবে। রবিবার সূর্য। সোমবার চাঁদ। মঙ্গলবার মঙ্গল। বুধবার বুধ। বৃহস্পতিবার বৃহস্পতি। শুক্রবার শুক্র। শনিবার শনি। উৎস: Wikipedia, “Planetary hours”।',
    'tools.today.currentTitle': 'এখনকার আওয়ার',
    'tools.today.hourLineA': '24-এর মধ্যে {n} নম্বর আওয়ার ({dayNight} আওয়ার), শাসক',
    'tools.today.approxNote':
      'আনুমানিক আওয়ার, আসল নয়. কোনো লোকেশন সেট করা নেই, তাই এই আওয়ারগুলো নির্দিষ্ট 06:00–18:00 ভাগে চলে। আসল আওয়ারের জন্য Planetary Hours পাতায় লোকেশন সেট করুন।',
    'tools.today.realNote':
      '{label}-এর জন্য আসল আওয়ার। আওয়ার সমান নয়: দিনের প্রতিটি আওয়ার সূর্য ওঠা থেকে ডোবা পর্যন্ত সময়ের বারো ভাগের এক ভাগ, রাতের প্রতিটি আওয়ার সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত সময়ের বারো ভাগের এক ভাগ।',
    'tools.today.unavailable': 'এই জায়গা আর এই দিনের জন্য প্ল্যানেটারি আওয়ার বের করা যায়নি: {reason}',
    'tools.today.defaultReason': 'এই জায়গা আর এই দিনের জন্য সূর্য ওঠা বা ডোবা বের করা যায়নি।',
    'tools.today.yourSavedLocation': 'apnar save kora location',
    'tools.today.locationLine': 'লোকেশন: {label} ({lat}, {lon}, {tz})।',
    'tools.today.noLocation':
      'কোনো লোকেশন সেট করা নেই। সময় ডিভাইসের টাইম জোন আর আনুমানিক 06:00–18:00 ভাগ দিয়ে চলছে। Planetary Hours পাতায় লোকেশন সেট করুন।',
    'tools.today.locationTail':
      'কিছুই কোথাও পাঠানো হয় না. লোকেশন শুধু এই ডিভাইসে সেভ থাকে। এখানে নামাজের সময় নেই।',

    // ---- Hours ----
    'tools.hours.title': 'Planetary Hours',
    'tools.hours.eyebrow': 'সময় ও আকাশ',
    'tools.hours.subtitle':
      'দিনের 24টি আওয়ার, প্রতিটি Chaldean ক্রমে একটি গ্রহের শাসনে। দিনের আওয়ার সূর্য ওঠা থেকে ডোবা পর্যন্ত, রাতের আওয়ার সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত. তাই আওয়ার সমান নয়।',
    'tools.hours.locationTitle': 'লোকেশন',
    'tools.hours.usingLocation': '{label} ব্যবহার হচ্ছে ({lat}, {lon}, {tz})।',
    'tools.hours.noLocation':
      'কোনো লোকেশন সেট করা নেই। নিচের আওয়ারগুলো নির্দিষ্ট 06:00–18:00 ভাগে চলে. আনুমানিক, আসল নয়।',
    'tools.hours.pickCity': 'শহর বেছে নিন',
    'tools.hours.chooseCity': 'শহর বেছে নিন…',
    'tools.hours.lat': 'অক্ষাংশ',
    'tools.hours.lon': 'দ্রাঘিমাংশ',
    'tools.hours.useLatLon': 'এই অক্ষাংশ আর দ্রাঘিমাংশ ব্যবহার করুন',
    'tools.hours.useMyLocation': 'আমার লোকেশন ব্যবহার করুন',
    'tools.hours.clearLocation': 'লোকেশন মুছুন',
    'tools.hours.privacyNote': 'আপনার লোকেশন শুধু এই ডিভাইসে সূর্য ওঠা আর ডোবার সময় বের করতে ব্যবহার হয়। তা কোথাও পাঠানো হয় না। “আমার লোকেশন ব্যবহার করুন” প্রথমে আপনার ব্রাউজারের কাছে চায়। আপনি না বলে শহর বেছে নিতে পারেন বা কোঅর্ডিনেট লিখতে পারেন। কোনো বাইরের জিওকোডিং বা টাইমজোন সার্ভিস ব্যবহার হয় না।',
    'tools.hours.dayRuler': 'দিনের শাসক:',
    'tools.hours.sunrise': 'সূর্যোদয়',
    'tools.hours.sunset': 'সূর্যাস্ত',
    'tools.hours.approxBox':
      'আনুমানিক আওয়ার, আসল নয়। কোনো লোকেশন সেট করা নেই, তাই এই টেবিলে {tz}-তে নির্দিষ্ট 06:00–18:00 ভাগ ব্যবহার হয়েছে। আসল আওয়ারের জন্য উপরে লোকেশন সেট করুন।',
    'tools.hours.realNote':
      'আওয়ার সমান নয়: দিনের প্রতিটি আওয়ার সূর্য ওঠা থেকে ডোবা পর্যন্ত সময়ের বারো ভাগের এক ভাগ, রাতের প্রতিটি আওয়ার সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত সময়ের বারো ভাগের এক ভাগ। দিন গোনা হয় সূর্য ওঠা থেকে, তাই সূর্য ওঠার এক মুহূর্ত আগের সময় আগের দিনের। সময় Astronomy Engine লাইব্রেরি দিয়ে বের করা হয়; টাইম জোন Intl দিয়ে সামলানো হয়, তাই daylight saving মানা হয়।',
    'tools.hours.thHour': 'আওয়ার',
    'tools.hours.thTime': 'সময়',
    'tools.hours.thRuler': 'শাসক',
    'tools.hours.thDayNight': 'দিন / রাত',
    'tools.hours.nowSuffix': ' — এখন',
    'tools.hours.unavailableTitle': 'এই জায়গা আর এই দিনের জন্য প্ল্যানেটারি আওয়ার বের করা যায়নি:',
    'tools.hours.unavailableDefault':
      'সূর্য এখনকার আশেপাশে ওঠেও না, ডোবেও না (মেরু দিন বা রাত), তাই সূর্য ওঠা বা ডোবা নেই যাকে আওয়ারে ভাগ করা যাবে।',
    'tools.hours.unavailableTail': 'কোনো আওয়ার বানানো হয় না। অন্য জায়গা বা দিন বেছে নিন।',
    'tools.hours.methodNote': 'পদ্ধতি এটা। Astronomy Engine (সূর্যের জন্য SearchRiseSet)। Chaldean ক্রম মানে গ্রহগুলোর পুরনো ক্রম। শনি। বৃহস্পতি। মঙ্গল। সূর্য। শুক্র। বুধ। চাঁদ। দিনের প্রথম আওয়ারই দিনের শাসক হয়। উৎস: Wikipedia, “Planetary hours”।',
    'tools.hours.geoSaved': 'লোকেশন এই ডিভাইসে সেভ হয়েছে: {label}।',
    'tools.hours.geoInvalid':
      'ওই লোকেশন ঠিক নয়। অক্ষাংশ -90 থেকে 90-এর মধ্যে আর দ্রাঘিমাংশ -180 থেকে 180-এর মধ্যে হতে হবে।',
    'tools.hours.geoTypeNumbers': 'অক্ষাংশের জন্য একটি সংখ্যা আর দ্রাঘিমাংশের জন্য একটি সংখ্যা লিখুন।',
    'tools.hours.geoNoGeo': 'এই ব্রাউজারে জিওলোকেশন নেই।',
    'tools.hours.geoAsking': 'আপনার লোকেশন চাওয়া হচ্ছে…',
    'tools.hours.geoNotShared': 'লোকেশন শেয়ার হয়নি। শহর বেছে নিন অথবা অক্ষাংশ আর দ্রাঘিমাংশ লিখুন।',
    'tools.hours.geoCleared': 'লোকেশন মুছে ফেলা হয়েছে। আওয়ার এখন আনুমানিক 06:00–18:00 ভাগে চলছে।',
    'tools.hours.geoManual': 'হাতে লেখা ({lat}, {lon})',
    'tools.hours.geoMyLocation': 'আমার লোকেশন ({lat}, {lon})',

    // ---- Moon ----
    'tools.moon.title': 'চাঁদ',
    'tools.moon.eyebrow': 'সময় ও আকাশ',
    'tools.moon.subtitle':
      'চাঁদের দশা, তা কতটা আলোকিত, চান্দ্র দিন, আর তা কোন মঞ্জিলে আছে।',
    'tools.moon.phaseAngle': 'দশার কোণ',
    'tools.moon.illumination': 'আলো',
    'tools.moon.lunarDay': 'চান্দ্র দিন',
    'tools.moon.lunarDayValue': '30-এর মধ্যে {n} নম্বর দিন',
    'tools.moon.longitude': 'চাঁদের ecliptic longitude',
    'tools.moon.methodNote': 'পদ্ধতি: {method}। দশার কোণ 0° মানে নতুন চাঁদ, 180° মানে পূর্ণ চাঁদ।',
    'tools.moon.currentMansion': 'এখনকার মঞ্জিল',
    'tools.moon.alsoCalled': '(একে {name}-ও বলা হয়)',
    'tools.moon.footer': 'এগুলো শুধু হিসাব করা তথ্য। এগুলো বলে চাঁদ কোথায় আছে আর কতটা আলোকিত। এখানে কিছু বলা হয়নি যে কোনো দিন বা কোনো মানুষের জন্য এর কী অর্থ।',

    // ---- Mansions ----
    'tools.mansions.title': 'Lunar Mansions',
    'tools.mansions.eyebrow': 'সময় ও আকাশ',
    'tools.mansions.subtitle':
      'চাঁদের 28টি মঞ্জিল (মানাজিল আল-কামার)। আজকের মঞ্জিল হাইলাইট করা আছে; নিচের শুরুর বিন্দু একটি প্রথা, যা আপনি বদলাতে পারেন।',
    'tools.mansions.todayTitle': 'আজকের মঞ্জিল',
    'tools.mansions.todayBodyA': 'চাঁদ {deg} ecliptic longitude-এ আছে, মঞ্জিল হলো',
    'tools.mansions.todayOffset': '(শুরুর অফসেট {offset}° সহ)',
    'tools.mansions.offsetLabel': 'শুরুর অফসেট (ডিগ্রি)। এটি একটি প্রথা। স্থির সত্য নয়।',
    'tools.mansions.offsetNote': 'নিচের টেবিল প্রথা অনুযায়ী 0°-তে al-Sharatayn দিয়ে শুরু হয়। অফসেট 5° সেট করলে শুরুর বিন্দু 5° হয়ে যায়। তাই প্রতিটি মঞ্জিলের সীমা 5° সরে যায়। অন্য ঐতিহ্য গণনা অন্য জায়গা থেকে শুরু করে। এই কন্ট্রোল দিয়ে আপনি তাদের শুরুর বিন্দু ব্যবহার করতে পারেন। চাঁদের অবস্থান নিজে Astronomy Engine থেকে আসে।',
    'tools.mansions.thHash': '#',
    'tools.mansions.thMansion': 'মঞ্জিল',
    'tools.mansions.thArabic': 'আরবি',
    'tools.mansions.thDegrees': 'ডিগ্রি',
    'tools.mansions.todaySuffix': ' — আজ',
    'tools.mansions.alsoPrefix': 'আরও ',
    'tools.mansions.footerTail':
      'প্রতিটি মঞ্জিল 360 / 28 = প্রায় 12.857° জুড়ে। এই তালিকা একটি পুরনো টেবিল, আধুনিক জ্যোতির্বিজ্ঞানের তথ্য নয়।',

    // ---- Falak ----
    'tools.falak.title': 'ফালাক — বারো রাশি',
    'tools.falak.eyebrow': 'সময় ও আকাশ',
    'tools.falak.subtitle':
      'ক্রান্তীয় রাশিচক্রের বারোটি রাশি, আজ সূর্য কোন রাশিতে আছে তা সহ। পড়াশোনার জন্য একটি টেবিল. এখানে কিছু বলে না কোনো রাশির কোনো মানুষের জন্য কী অর্থ।',
    'tools.falak.sunSignTitle': 'আজ সূর্যের রাশি',
    'tools.falak.sunSignBodyA': 'সূর্য {deg}° ecliptic longitude-এ আছে, রাশি হলো',
    'tools.falak.methodNote':
      'Astronomy Engine দিয়ে বের করা হয়েছে (সূর্যের ecliptic longitude, SunPosition)। {convention}',
    'tools.falak.thHash': '#',
    'tools.falak.thSign': 'রাশি',
    'tools.falak.thArabic': 'আরবি',
    'tools.falak.thDates': 'তারিখ (আনুমানিক)',
    'tools.falak.thElement': 'উপাদান',
    'tools.falak.thDegrees': 'ডিগ্রি',
    'tools.falak.todaySuffix': ' — আজ',
    'tools.falak.footer': 'উপাদান পুরনো পশ্চিমা ভাগ দিয়ে দেখানো হয়েছে। আগুন মানে মেষ, সিংহ, ধনু। মাটি মানে বৃষ, কন্যা, মকর। বাতাস মানে মিথুন, তুলা, কুম্ভ। জল মানে কর্কট, বৃশ্চিক, মীন। উৎস: {source}। তারিখগুলো আনুমানিক। আর বছর বছর এক দিন এদিক-ওদিক হয়। কারণ বিষুব নিজেই সরে।',

    // ---- Majlis ----
    'tools.majlis.title': 'মজলিস',
    'tools.majlis.eyebrow': 'সময় ও আকাশ',
    'tools.majlis.subtitle':
      'এই মুহূর্তের কথা, এক জায়গায়: আপনি কোথায়, আজকের শাসক, এখনকার আওয়ার, আর চাঁদ।',
    'tools.majlis.locationTitle': 'লোকেশন',
    'tools.majlis.noLocation':
      'কোনো লোকেশন সেট করা নেই। নিচের আওয়ারগুলো আনুমানিক 06:00–18:00 ভাগে চলে। Planetary Hours পাতায় লোকেশন সেট করুন।',
    'tools.majlis.locationNote': 'লোকেশন শুধু এই ডিভাইসে সেভ থাকে। কিছুই কোথাও পাঠানো হয় না।',
    'tools.majlis.rulerTitle': 'আজকের শাসক',
    'tools.majlis.rulerBodyA': 'দিনের প্রথম আওয়ারের শাসক।',
    'tools.majlis.currentTitle': 'এখনকার আওয়ার',
    'tools.majlis.approxNote': 'আনুমানিক আওয়ার, আসল নয়. কোনো লোকেশন সেট করা নেই।',
    'tools.majlis.unavailable': 'এই জায়গা আর এই দিনের জন্য প্ল্যানেটারি আওয়ার বের করা যায়নি: {reason}',
    'tools.majlis.moonTitle': 'চাঁদ',
    'tools.majlis.moonLine': '{phase}, {pct}% আলোকিত, চান্দ্র দিন {day}, 30-এর মধ্যে।',
    'tools.majlis.mansionLabel': 'মঞ্জিল:',
    'tools.majlis.methodNote':
      'পদ্ধতি: {method}। মঞ্জিলের ভাগ (0° al-Sharatayn থেকে 28টি সমান অংশ) একটি প্রথা; Lunar Mansions পাতা দেখুন।',
    'tools.majlis.footer': 'এই পাতায় শুধু এটুকুই বলা হয়েছে। সময় আর আকাশের কথা। দিনকে নম্বর দেওয়া হয় না। কিছু সুপারিশ করা হয় না। বা কী করতে হবে তা বলা হয় না।',

    // ---- Forge ----
    'tools.forge.title': 'ওয়াফক ফোর্জ — ম্যাজিক স্কয়ার',
    'tools.forge.eyebrow': 'স্কয়ার ও সিল',
    'tools.forge.subtitle':
      '3 থেকে 20 অর্ডারের ম্যাজিক স্কয়ার বানান, একটি টার্গেট যোগফলে, তারপর লাইন ধরে ধরে যাচাই করুন। স্কয়ার তখনই পাস বলে ধরা হয় যখন প্রতিটি সারি, কলাম আর কর্ণের যোগফল মেলে।',
    'tools.forge.orderLabel': 'অর্ডার (স্কয়ারের আকার)',
    'tools.forge.order2': '2 — সম্ভব নয়',
    'tools.forge.order2Title': 'অর্ডার 2-এর কোনো ম্যাজিক স্কয়ার হয় না।',
    'tools.forge.kindOdd': 'বিজোড় অর্ডার. Siamese method (de la Loubère) দিয়ে বানানো হয়।',
    'tools.forge.kindDoubly': 'দ্বিগুণ জোড় অর্ডার (4 দিয়ে ভাগ যায়). complement method দিয়ে বানানো হয়।',
    'tools.forge.kindSingly': 'একক জোড় অর্ডার (জোড়, 4 দিয়ে ভাগ যায় না). LUX method (Conway) দিয়ে বানানো হয়।',
    'tools.forge.targetLabel': 'টার্গেট যোগফল (ডিফল্ট: বেস কনস্ট্যান্ট {n})',
    'tools.forge.targetNote':
      'টার্গেটকে {base} থেকে {order}-এর গুণিতকে আলাদা হতে হবে, আর {base}-এর নিচে হওয়া চলবে না। নাহলে স্কয়ার মানা করে দেওয়া হয়, জোর করে বানানো হয় না।',
    'tools.forge.generate': 'স্কয়ার বানান',
    'tools.forge.refusalPrefix': 'এই স্কয়ার বানানো যাবে না:',
    'tools.forge.squareTitle': '{order}x{order} স্কয়ার — টার্গেট {target}',
    'tools.forge.methodLineA': 'পদ্ধতি: {method}। বেস কনস্ট্যান্ট {base}',
    'tools.forge.shiftSuffix': ', প্রতিটি ঘরে {n} করে সরানো হয়েছে।',
    'tools.forge.noShift': ', কোনো সরানো হয়নি।',
    'tools.forge.shownNote': 'স্কয়ার উপরে, এই পাতায় পুরোপুরি দেখানো হয়েছে। দেখতে বা ব্যবহার করতে ডাউনলোডের দরকার নেই।',
    'tools.forge.copyBtn': 'স্কয়ার কপি করুন',
    'tools.forge.validationTitle': 'যাচাই — জেনারেটর থেকে আলাদাভাবে পরীক্ষা করা',
    'tools.forge.passBody':
      'প্রতিটি সারি, প্রতিটি কলাম আর দুটি কর্ণের যোগফল {target}, আর সব {n}টি সংখ্যাই আলাদা আলাদা ধনাত্মক পূর্ণসংখ্যা।',
    'tools.forge.thLine': 'লাইন',
    'tools.forge.thSum': 'যোগফল',
    'tools.forge.thTarget': 'টার্গেট',
    'tools.forge.rowLabel': 'সারি {n}',
    'tools.forge.colLabel': 'কলাম {n}',
    'tools.forge.diag1': 'কর্ণ, উপর-বাম থেকে নিচে-ডান',
    'tools.forge.diag2': 'কর্ণ, উপর-ডান থেকে নিচে-বাম',
    'tools.forge.distinctLine': 'সব সংখ্যা আলাদা: {yesNo}।',
    'tools.forge.sealTitle': 'সিলের ফ্রেম আর প্লেট',
    'tools.forge.sealBody':
      'ফ্রেম করা সিল নিচে, এই পাতায় দেখানো হয়েছে। এটাকে লেখা হিসেবে কপি করুন, ছবি হিসেবে সেভ করুন, অথবা ফ্রেম করা SVG ডাউনলোড করুন। প্রিন্টের অপশনও আছে। এগুলো সব তখনই খোলে যখন স্কয়ার যাচাইয়ে পাস করে।',
    'tools.forge.framedAria': 'ফ্রেম করা {order} by {order} ম্যাজিক স্কয়ার, প্রতিটি লাইনের যোগফল {target}',
    'tools.forge.gridAria': '{order} by {order} magic square',
    'tools.forge.printA2': 'A2 প্লেট হিসেবে প্রিন্ট করুন (420 x 594 মিমি অনুপাত)',
    'tools.forge.saveImage': 'ছবি হিসেবে সেভ করুন',
    'tools.forge.downloadSvg': 'ফ্রেম করা SVG ডাউনলোড করুন',
    'tools.forge.printPlate': 'প্লেট প্রিন্ট করুন',
    'tools.forge.exportOff': 'স্কয়ার পাস না করা পর্যন্ত এক্সপোর্ট আর প্রিন্ট বন্ধ থাকে।',
    'tools.forge.svgCaption': '{order} x {order} — প্রতিটি লাইনের যোগফল {target} — {method}',
    'tools.forge.constructions': 'কনস্ট্রাকশন: {source}।',

    // ---- Qawaid ----
    'tools.qawaid.title': 'কাওয়ায়িদ — স্কয়ারের নিয়ম',
    'tools.qawaid.eyebrow': 'স্কয়ার ও সিল',
    'tools.qawaid.subtitle':
      'স্কয়ার কীভাবে বানানো হয়, টার্গেট যোগফল কখন মেলা যায়, কীভাবে যাচাই করা হয়, আর কী মানা করে দেওয়া হয়।',
    'tools.qawaid.whatTitle': 'ম্যাজিক স্কয়ার কী',
    'tools.qawaid.whatBody': 'ম্যাজিক স্কয়ার এভাবে বোঝানো হয়। এটি সংখ্যার একটি গ্রিড। প্রতিটি সারি, প্রতিটি কলাম আর দুটি কর্ণের যোগফল একই সংখ্যা হয়। সেই সংখ্যাকে ম্যাজিক কনস্ট্যান্ট বা টার্গেট যোগফল বলা হয়। অর্ডার মানে এক পাশে কয়টি ঘর আছে। 3x3 স্কয়ার হলো অর্ডার 3। 4x4 স্কয়ার হলো অর্ডার 4। আর এভাবেই চলতে থাকে। 1 থেকে n squared পর্যন্ত সংখ্যা থাকা স্কয়ারের জন্য কনস্ট্যান্ট হলো n গুণ (n squared যোগ 1), ভাগ 2। তাই 3x3 স্কয়ারের যোগফল 15। 4x4-এর 34। 5x5-এর 65। আর 9x9-এর 369।',
    'tools.qawaid.methodTitle': 'প্রতিটি অর্ডার ধরনের পদ্ধতি',
    'tools.qawaid.methodIntro': 'অর্ডার তিন ধরনে ভাগ করা হয়। প্রতিটি ধরনের নিজস্ব লেখা কনস্ট্রাকশন আছে। ফোর্জে প্রথমে 1 থেকে n squared পর্যন্ত সংখ্যা দিয়ে একটি বেস স্কয়ার বানানো হয়। তারপর তাকে টার্গেট যোগফলে সরানো হয়। নিচে reachability rule দেখুন।',
    'tools.qawaid.oddTitle': 'বিজোড় অর্ডার (3, 5, 7, 9, 11, 13, 15, 17, 19) — {method}',
    'tools.qawaid.oddBody':
      'উপরের সারির মাঝের ঘরে 1 দিয়ে শুরু করুন। তারপর এক সারি উপরে আর এক কলাম ডানে যান, গ্রিড ছেড়ে বেরিয়ে গেলে কিনারা দিয়ে ঘুরে ফিরে আসুন। পরের ঘরটি আগে থেকে ভরা থাকলে, বর্তমান ঘর থেকে এক সারি নিচে যান। এভাবেই চলতে থাকুন যতক্ষণ না প্রতিটি ঘরে সংখ্যা বসে।',
    'tools.qawaid.doublyTitle': 'দ্বিগুণ জোড় অর্ডার (4, 8, 12, 16, 20) — {method}',
    'tools.qawaid.doublyBody':
      '1 থেকে n squared পর্যন্ত সংখ্যা সারি ধরে ধরে লিখুন। তারপর প্রতিটি 4x4 ব্লকে, যে সংখ্যা সেই ব্লকের কর্ণের উপর আছে, তাকে তার complement দিয়ে বদলে দিন: n squared যোগ 1 বিয়োগ সেই সংখ্যা। কর্ণের বাইরের সংখ্যাগুলো যেমন আছে তেমনই থাকে।',
    'tools.qawaid.singlyTitle': 'একক জোড় অর্ডার (6, 10, 14, 18) — {method}',
    'tools.qawaid.singlyBody':
      'L, U আর X অক্ষরের একটি অ্যারে বানান, তৈরি স্কয়ারের প্রতিটি 2x2 ব্লকের জন্য একটি অক্ষর। প্রতিটি ব্লকে চারটি পরপর সংখ্যা ভরুন, Siamese method-এর মতো উপরে-ডানে ক্রমে letter array ধরে হেঁটে, উপরের সারির মাঝের ব্লক থেকে শুরু করে। প্রতিটি অক্ষর বলে তার 2x2 ব্লকের ভিতরে চারটি সংখ্যা কোন ক্রমে বসবে: L ভরে উপরে-ডানে, নিচে-বামে, নিচে-ডানে, উপরে-বামে; U ভরে উপরে-বামে, নিচে-বামে, নিচে-ডানে, উপরে-ডানে; X ভরে উপরে-বামে, নিচে-ডানে, নিচে-বামে, উপরে-ডানে। অক্ষরগুলো এমনভাবে সাজানো হয়েছে যাতে তৈরি স্কয়ারের প্রতিটি লাইনের যোগফল মেলে।',
    'tools.qawaid.sourceNote': 'উৎস: {source}।',
    'tools.qawaid.reachTitle': 'Reachability rule',
    'tools.qawaid.reachBody': 'বেস স্কয়ারের যোগফলকে তার কনস্ট্যান্ট M বলা হয়। প্রতিটি ঘরে একই পূর্ণসংখ্যা d যোগ করলে প্রতিটি লাইনে n গুণ d যোগ হয়। তাই টার্গেট T তখনই ঠিক মেলা যায় যখন (T বিয়োগ M) ভাগ n একটি পূর্ণসংখ্যা হয়। আর d ঋণাত্মক না হয়। বেস স্কয়ারের সবচেয়ে ছোট ঘর 1। তাই ঋণাত্মক shift-এ কোনো ঘর শূন্য বা ঋণাত্মক হয়ে যাবে। আর তা মানা করে দেওয়া হয়।',
    'tools.qawaid.reachEx1': '3x3, টার্গেট 27: shift হলো (27 বিয়োগ 15) / 3 = 4, তাই ঘরগুলো 5 থেকে 13 পর্যন্ত চলবে। অনুমোদিত।',
    'tools.qawaid.reachEx2': '3x3, টার্গেট 18: shift হলো (18 বিয়োগ 15) / 3 = 1, তাই ঘরগুলো 2 থেকে 10 পর্যন্ত চলবে। অনুমোদিত।',
    'tools.qawaid.reachEx3': '3x3, টার্গেট 16: shift হতো 1 / 3, যা পূর্ণসংখ্যা নয়। মানা করে দেওয়া হয়েছে।',
    'tools.qawaid.reachEx4': '3x3, টার্গেট 12: shift হতো বিয়োগ 1, যাতে একটি ঘর শূন্য হয়ে যেত। মানা করে দেওয়া হয়েছে।',
    'tools.qawaid.reachEx5': '4x4, টার্গেট 35: shift হতো 1 / 4, যা পূর্ণসংখ্যা নয়। মানা করে দেওয়া হয়েছে।',
    'tools.qawaid.refusedNote': 'টার্গেট মানা করে দিলে, সহজ ভাষায় তা বলে দেওয়া হয়। আর কিছুই বানানো হয় না। shift-কে কখনো round করা হয় না। ঘরকে কখনো patch করা হয় না। আর সংখ্যা repeat করে এমন ফল কখনো বানানো হয় না যা শুধু সঠিক দেখায়।',
    'tools.qawaid.validatorTitle': 'Validator কীভাবে কাজ করে',
    'tools.qawaid.validatorBody1': 'validator জেনারেটর থেকে আলাদা কোড। এটাকে বলা হয় না স্কয়ার কীভাবে বানানো হয়েছে। জেনারেটরকে কখনো বিশ্বাস করা হয় না। যে গ্রিড দেওয়া হয়, তা ঘরে ঘরে যোগ করা হয়। প্রতিটি সারি, প্রতিটি কলাম আর দুটি কর্ণকে টার্গেটের সাথে যাচাই করা হয়। আর যাচাই করা হয় প্রতিটি ঘর একটি আলাদা ধনাত্মক পূর্ণসংখ্যা কি না। এটা হাতে বানানো গ্রিডেও কাজ করে। শুধু ফোর্জের বানানো স্কয়ারে নয়।',
    'tools.qawaid.validatorBody2': 'ফল PASS বা FAIL হিসেবে দেখানো হয়। প্রতিটি লাইনের যোগফল তালিকাসহ। যাতে যে কেউ দেখতে পারে কোন লাইন ভুল। আর কতটা ভুল। এক্সপোর্ট আর প্রিন্ট শুধু PASS-এর পরেই খোলে।',
    'tools.qawaid.refusedTitle': 'কী মানা করে দেওয়া হয় আর কেন',
    'tools.qawaid.refused1': 'অর্ডার 2: অর্ডার 2-এর কোনো ম্যাজিক স্কয়ার হয় না।',
    'tools.qawaid.refused2': 'অর্ডার 3-এর নিচে বা 20-এর উপরে: সেগুলোর জন্য এখানে কোনো কনস্ট্রাকশন implement আর test করা হয়নি।',
    'tools.qawaid.refused3': 'এমন টার্গেট যা shift দিয়ে মেলানো যায় না (shift পূর্ণসংখ্যা নয়): মানা করে দেওয়া হয়, round করা হয় না।',
    'tools.qawaid.refused4': 'বেস কনস্ট্যান্টের নিচে টার্গেট: মানা করে দেওয়া হয়, কারণ একটি ঘর শূন্য বা ঋণাত্মক হয়ে যাবে।',
    'tools.qawaid.refused5': 'এমন টার্গেট যা পূর্ণ ধনাত্মক সংখ্যা নয়: মানা করে দেওয়া হয়।',
    'tools.qawaid.modesTitle': 'যে মোডগুলো বানানো হয়নি',
    'tools.qawaid.modesIntro': 'এই স্কয়ার মোডগুলো বানানো হয় না। কারণ সেগুলোর জন্য কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি। সেগুলো এখানে তালিকায় রাখা হয় যাতে ফাঁকটি চোখে পড়ে। আন্দাজে কিছু বানানো হয় না।',
    'tools.qawaid.baseConstants': 'বেস কনস্ট্যান্ট, রেফারেন্সের জন্য:',

    // ---- Method ----
    'tools.method.title': 'পদ্ধতি — এই টুলস কীভাবে কাজ করে',
    'tools.method.eyebrow': 'কীভাবে কাজ করে',
    'tools.method.subtitle':
      'সংখ্যা কোথা থেকে আসে, অক্ষর কীভাবে গোনা হয়, কী পরীক্ষা হয়েছে, আর এই টুলসের সীমা কী।',
    'tools.method.whatTitle': 'এই টুলস কী করে',
    'tools.method.whatBody': 'এই টুলস শুধু পড়াশোনা আর হিসাবের জন্য। এগুলো দিয়ে অক্ষরের মান যোগ করা হয়। পড়ার নোট রাখা হয়। ট্যাপ গোনা হয়। আর যা রাখতে হয় তা সেভ করা হয়। এগুলো কোনো ফল, সুরক্ষা, শেফা বা রিজিকের প্রতিশ্রুতি দেয় না। আর কোনো ধর্মীয় সিদ্ধান্ত দেয় না। এগুলো দিয়ে কখনো কারো ক্ষতি করবেন না।',
    'tools.method.sourcesTitle': 'তথ্যের উৎস',
    'tools.method.srcAbjadLabel': 'আবজাদ টেবিল: ',
    'tools.method.srcAbjadBody': 'সাধারণ আবজাদ মান (মাশরিকি/মাগরিবি) ব্যবহার হয়। মাশরিকি মানে পূর্বের টেবিল। মাগরিবি মানে পশ্চিমের টেবিল। এগুলো Wikipedia-র “Abjad numerals” আর OpenArabic ও WiserWork-এর আবজাদ ক্যালকুলেটর দিয়ে যাচাই করা হয়েছে। দুই স্কুল 22টি অক্ষরে একমত। ছয়টিতে আলাদা (সাদ, দাদ, সিন, শিন, জা, গাইন)। কবীর মানে প্রতিটি অক্ষরের পুরো মান। সগীর মানে সেই মান যা এক অঙ্কে ছোট করা হয়েছে।',
    'tools.method.srcNamesLabel': '99 নাম: ',
    'tools.method.srcAstroLabel': 'জ্যোতির্বিজ্ঞান আর সময়: ',
    'tools.method.srcAstroBody': 'রক্ষণাবেক্ষণ করা Astronomy Engine লাইব্রেরি (astronomy-engine) দিয়ে সূর্যোদয়, সূর্যাস্ত, চাঁদের দশা আর longitude, আর সূর্যের longitude বের করা হয়। এখানে কোনো জ্যোতির্বিজ্ঞানের সূত্র হাতে লেখা হয়নি।',
    'tools.method.srcMansionsLabel': 'চান্দ্র মঞ্জিল: ',
    'tools.method.srcMansionsBody': 'Wikipedia-র “Lunar mansion” থেকে নেওয়া হয়েছে। মানাজিল আল-কামার টেবিল। 28টি স্টেশন যা al-Sharatayn দিয়ে 0° থেকে শুরু হয়। তা 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.method.srcSignsLabel': 'বারো রাশি: ',
    'tools.method.srcSignsBody': 'Wikipedia-র “Astrological sign” থেকে নেওয়া হয়েছে। পশ্চিমা রাশিচক্রের টেবিল। ক্রান্তীয় রাশি আর উপাদানের ত্রয়ী। তা 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.method.srcPlanetsLabel': 'গ্রহ আর দিনের শাসক: ',
    'tools.method.srcPlanetsBody': 'Wikipedia-র “Planetary hours” থেকে নেওয়া হয়েছে। Chaldean ক্রম মানে গ্রহগুলোর পুরনো ক্রম। আর কোন গ্রহ কোন সপ্তাহের দিনের শাসক। আরবি গ্রহের নাম Wiktionary-র “Appendix:Planets” থেকে নেওয়া হয়েছে। আর সেখানে উদ্ধৃত al-Biruni-র তালিকা।',
    'tools.method.srcSquaresLabel': 'ম্যাজিক স্কয়ার: ',
    'tools.method.srcSquaresBody': 'Wikipedia-র “Magic square” আর “Conway’s LUX method for magic squares” থেকে নেওয়া হয়েছে। কনস্ট্রাকশন 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.method.srcNotesLabel': 'আপনার নোট, গণনা আর সেভ করা জিনিস: ',
    'tools.method.srcNotesBody': 'আপনার লেখা, শুধু এই ডিভাইসের স্টোরেজে থাকে। কোথাও পাঠানো হয় না।',
    'tools.method.timeTitle': 'সময় কীভাবে বের করা হয় (Phase 2)',
    'tools.method.timeIntro': 'প্ল্যানেটারি আওয়ার সমান নয়। দিন শুরু হয় সূর্য ওঠা থেকে। 12টি দিনের আওয়ার সূর্য ওঠা থেকে ডোবা পর্যন্ত সময়কে 12টি সমান ভাগে ভাগ করে। আর 12টি রাতের আওয়ার সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত সময়কে 12টি সমান ভাগে ভাগ করে। সূর্য ওঠার এক মুহূর্ত আগের সময় আগের দিনের। যার শাসক তখনো প্রযোজ্য। দিনের প্রথম আওয়ার সেই দিনের গ্রহের শাসনে থাকে। তারপর শাসক Chaldean ক্রমে ঘোরে। Chaldean ক্রম মানে গ্রহগুলোর পুরনো ক্রম। শনি। বৃহস্পতি। মঙ্গল। সূর্য। শুক্র। বুধ। চাঁদ।',
    'tools.method.timeLibLabel': 'লাইব্রেরি: ',
    'tools.method.timeLibBody': 'Astronomy Engine (astronomy-engine) ব্যবহার হয়। এটি একটি রক্ষণাবেক্ষণ করা জ্যোতির্বিজ্ঞান লাইব্রেরি। টাইম জোন Intl আর জায়গার IANA জোন দিয়ে সামলানো হয়। তাই daylight saving মানা হয়। কোনো বাইরের জিওকোডিং বা টাইমজোন সার্ভিস ব্যবহার হয় না।',
    'tools.method.timeNoLocLabel': 'কোনো লোকেশন সেট করা নেই: ',
    'tools.method.timeNoLocBody': 'আওয়ার নির্দিষ্ট 06:00–18:00 ভাগে চলে। তা স্পষ্টভাবে “approximate, not real hours” লেখা হয়।',
    'tools.method.timePolarLabel': 'মেরু দিন বা রাত: ',
    'tools.method.timePolarBody': 'যেখানে সূর্য ওঠে না বা ডোবে না, সেখানে আওয়ার কারণসহ unavailable দেখানো হয়। সেগুলো কখনো বানানো হয় না।',
    'tools.method.timeLocLabel': 'লোকেশন: ',
    'tools.method.timeLocBody': 'লোকেশন বান্ডেল করা শহরের তালিকা থেকে বাছা হয়। অক্ষাংশ আর দ্রাঘিমাংশ লিখে। অথবা ব্রাউজার থেকে শেয়ার করে। শুধু এই ডিভাইসে। তা কোথাও পাঠানো হয় না।',
    'tools.method.timeHijriLabel': 'হিজরি তারিখ: ',
    'tools.method.timeHijriBody': 'ইসলামি সিভিল ক্যালেন্ডার (Intl, Kuwaiti algorithm) ব্যবহার হয়। এটি আনুমানিক। আসল মাস চাঁদ দেখার উপর নির্ভর করে। আর এক-দুই দিন এদিক-ওদিক হতে পারে।',
    'tools.method.timeMansionsLabel': 'চান্দ্র মঞ্জিল: ',
    'tools.method.timeMansionsBody': '28টি সমান অংশ আছে। প্রায় 12.857° করে। 0°-তে al-Sharatayn দিয়ে শুরু। এটি একটি প্রথা। সর্বজনীন সত্য নয়। অন্য ঐতিহ্য গণনা অন্য জায়গা থেকে শুরু করে। Mansions পাতা আপনাকে শুরুর বিন্দু সরাতে দেয়। চাঁদের অবস্থান Astronomy Engine থেকে আসে।',
    'tools.method.timeSignsLabel': 'বারো রাশি: ',
    'tools.method.timeSignsBody': 'ক্রান্তীয় রাশিচক্র ব্যবহার হয়। মার্চ বিষুব থেকে মাপা হয়। তাই রাশিগুলো এখন আর একই নামের তারামণ্ডলের সাথে মেলে না। তারিখগুলো আনুমানিক। আর বছর বছর একটু বদলায়।',
    'tools.method.timeMoonLabel': 'চাঁদের দশা আর চান্দ্র দিন: ',
    'tools.method.timeMoonBody': 'Astronomy Engine থেকে নেওয়া হয়। চান্দ্র দিন হলো 29.53 দিনের মাসে দশার কোণের ভাগ। 1 থেকে গোনা হয়।',
    'tools.method.squaresTitle': 'স্কয়ার কীভাবে বানানো আর যাচাই করা হয় (Phase 3)',
    'tools.method.squaresIntro': 'ওয়াফক ফোর্জে প্রথমে 1 থেকে n squared পর্যন্ত সংখ্যা দিয়ে একটি বেস স্কয়ার বানানো হয়। তারপর প্রতিটি ঘরকে একই পূর্ণসংখ্যা দিয়ে সরিয়ে টার্গেট যোগফলে পৌঁছানো হয়। কোন কনস্ট্রাকশন ব্যবহার হবে, তা অর্ডারের ধরনের উপর নির্ভর করে। বিজোড় অর্ডারের জন্য Siamese method (de la Loubère)। দ্বিগুণ জোড় অর্ডারের (4 দিয়ে ভাগ যায়) জন্য complement method। একক জোড় অর্ডারের (জোড়, 4 দিয়ে ভাগ যায় না) জন্য LUX method (Conway)। অর্ডার 3 থেকে 20 সমর্থিত। পুরো নিয়ম Qawa’id পাতায় আছে।',
    'tools.method.sqReachLabel': 'Reachability rule: ',
    'tools.method.sqReachBody': 'টার্গেট তখনই ঠিক মেলে যখন তা বেস কনস্ট্যান্ট থেকে অর্ডারের গুণিতকে আলাদা হয়। আর shift ঋণাত্মক না হয়। নাহলে ফোর্জে সহজ ভাষায় মানা করে দেওয়া হয়। কখনো round করা হয় না। ঘর patch করা হয় না। বা সংখ্যা repeat করে ফল বানানো হয় না।',
    'tools.method.sqValidatorLabel': 'আলাদা validator: ',
    'tools.method.sqValidatorBody': 'যাচাইকারী জেনারেটর থেকে আলাদা কোড। যে গ্রিড দেওয়া হয়, তা যোগ করা হয়। প্রতিটি সারি। প্রতিটি কলাম। দুটি কর্ণ। আর যাচাই করা হয় প্রতিটি ঘর একটি আলাদা ধনাত্মক পূর্ণসংখ্যা কি না। এটা হাতে বানানো গ্রিডেও কাজ করে। ফল PASS বা FAIL হিসেবে দেখানো হয়। প্রতিটি লাইনের যোগফল তালিকাসহ।',
    'tools.method.sqExportLabel': 'এক্সপোর্ট আর প্রিন্ট: ',
    'tools.method.sqExportBody': 'ফ্রেম করা SVG ডাউনলোড আর A2 প্লেট প্রিন্ট শুধু স্কয়ার যাচাইয়ে পাস করার পরেই খোলে।',
    'tools.method.sqModesLabel': 'যে মোডগুলো বানানো হয়নি: ',
    'tools.method.sqModesBody': 'multiplied, cycling, hollow-centre আর “grand wafq” স্কয়ারকে “source needed” হিসেবে তালিকায় রাখা হয়। সেগুলোর জন্য কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি। তাই সেগুলো আন্দাজে বানানো হয় না।',
    'tools.method.lettersTitle': 'অক্ষর কীভাবে গোনা হয়',
    'tools.method.lettersIntro': 'গোনার আগে লেখাটিকে normalise করা হয়। একটি মানক রূপে পরিষ্কার করা হয়। যাতে একই অক্ষর আলাদাভাবে লেখা হলেও একবারই গোনা হয়। যে নিয়মগুলো ব্যবহার হয়, সেগুলো হলো:',
    'tools.method.bareNote': 'কোনো নামের “bare” মান তা “al-” ছাড়া গোনা হয়। “with al-” মান “al-” যোগ করে গোনা হয়। দুটোতেই একই আবজাদ টেবিল ব্যবহার হয়। আপনার বেছে নেওয়া পদ্ধতি আর স্কুলে।',
    'tools.method.testedTitle': 'কী পরীক্ষা হয়েছে',
    'tools.method.tested1': 'স্টোরেজ হেলপার 10টি automated test দিয়ে যাচাই করা হয়। জার্নাল, ওয়ার্ড আর গ্রিমোয়ারের save/load round-trips। সঠিক JSON-এর export/import। আর ভুল ফাইলকে পুরনো তথ্য না মুছে প্রত্যাখ্যান করা।',
    'tools.method.tested2': 'আবজাদ হিসাব নিজেই এখানে পরীক্ষা করা হয়। দুই স্কুল আর দুই পদ্ধতিতে অক্ষরের মান। normalisation। হামজার রূপ। শাদ্দা। তাতউইল। ভাঙা অক্ষর। আর লেখার যোগফল। যার মধ্যে সহজ যাচাই “Allah 66” আর “bism Allah 168”-ও আছে।',
    'tools.method.tested3': 'সময় আর স্কয়ার নিজেদের স্যুট দিয়ে পরীক্ষা করা হয়। প্ল্যানেটারি আওয়ার। মধ্যরাত আর মেরু ক্ষেত্রসহ। চাঁদ আর মঞ্জিলের সীমানা। আর স্কয়ার তৈরি করা ও আলাদা validator। জানা কনস্ট্যান্ট। সরানো যোগফল। আর যে ক্ষেত্রগুলো মানা করতেই হবে।',
    'tools.method.limitsTitle': 'জানা সীমা',
    'tools.method.limit1': 'উপাদানের দল, আলোকিত আর অন্ধকার অক্ষর, আর অক্ষর-গ্রহের সম্পর্ক কোথাও দেখানো হয় না। সেই ম্যাপিংগুলোর জন্য এখনো কোনো উৎস বলা হয়নি। তাই কিছু আন্দাজ করা হয় না।',
    'tools.method.limit2': 'মাগরিবি মান টেবিলের নাম করা উৎস থেকে আসে। Wikipedia-র “Abjad numerals”। OpenArabic। WiserWork। ছয়টি অক্ষর মাশরিকি থেকে আলাদা। বাকি 22টি এক।',
    'tools.method.limit3': 'Today পাতায় দেখানো হিজরি তারিখ আনুমানিক বলা হয়। এটি হিসাব করা (সিভিল) তারিখ। যা চাঁদ দেখার তারিখ থেকে এক-দুই দিন এদিক-ওদিক হতে পারে।',
    'tools.method.limit4': 'এখানে নামাজের সময় নেই।',
    'tools.method.limit5': 'নোট, গণনা আর সেভ করা জিনিস শুধু এই ডিভাইসেই রাখা হয়। ব্রাউজারের সাইট ডেটা মুছলে, বা অন্য ডিভাইসে গেলে, সেগুলো হারিয়ে যাবে। যদি না আপনি আগে JSON ব্যাকআপ এক্সপোর্ট করে থাকেন।',

    // ---- About ----
    'tools.about.title': 'About (পড়াশোনার টুলস)',
    'tools.about.eyebrow': 'About',
    'tools.about.subtitle':
      'এই অংশটি কী, এর সংখ্যা কোথা থেকে আসে, কী পরীক্ষা হয়েছে, আর এটা কী করতে পারে না।',
    'tools.about.whatTitle': 'এই অংশটি কী',
    'tools.about.whatBody1': 'এই ছোট টুলস অক্ষর, সংখ্যা, সময় আর নিজের পড়ার নোটের জন্য। এগুলো দিয়ে অক্ষরের মান যোগ করা হয়। দিনের কথা বের করা হয়। ম্যাজিক স্কয়ার বানানো আর যাচাই করা হয়। আর সেই নোট রাখা হয় যা সেভ করতে হয়। এগুলো শুধু পড়াশোনা আর হিসাবের জন্য। এগুলো কোনো ফল, সুরক্ষা, শেফা বা রিজিকের প্রতিশ্রুতি দেয় না। আর কোনো ধর্মীয় সিদ্ধান্ত দেয় না। এগুলো দিয়ে কখনো কারো ক্ষতি করবেন না।',
    'tools.about.whatBody2': 'এখানে সবকিছু আপনার ব্রাউজারে চলে। আপনার নোট, গণনা আর সেভ করা জিনিস এই ডিভাইসেই থাকে। কিছুই কোথাও পাঠানো হয় না। লাইব্রেরি আর এই টুলস ফলো গেটের পেছনে আছে। এগুলো খোলে যখন আপনি “I followed” চাপেন বা Ghayb Chronicles ব্রডকাস্ট চ্যানেলের চাবি লেখেন। সাইট নিজে ফ্রি। কোথাও কোনো পেমেন্ট নেই।',
    'tools.about.builtTitle': 'কী বানানো হয়েছে',
    'tools.about.builtIntro': 'ঊনিশটি টুলস বানানো হয়েছে। এগুলো কাজ করছে। হাবের বাকি কার্ডগুলো শেল। সেগুলোতে শুধু সেই কন্টেন্টই আছে যা উৎস আর পাতাসহ পাওয়া গেছে। তাই যতক্ষণ না তা আসে, সেগুলো খালি থাকে।',
    'tools.about.builtLettersLabel': 'অক্ষর ও সংখ্যা: ',
    'tools.about.builtLettersBody':
      'হুরুফ (28টি অক্ষর আর তাদের মান), আসমা (99 নাম), বাস্ত (যেকোনো লেখা খুলুন), ফাওয়াতিহ (29টি সূরায় 14টি শুরুর অক্ষরের রূপ), সাওয়াকিত (সাতটি অক্ষর যা আল-ফাতিহায় নেই), শিল্ডস (পাঁচটি ছোট লেখার চলতি অক্ষরের যোগফল)।',
    'tools.about.builtTimeLabel': 'সময় ও আকাশ: ',
    'tools.about.builtTimeBody':
      'Today, Planetary Hours, Moon, Lunar Mansions, ফালাক (বারো রাশি), মজলিস (এই মুহূর্তের কথা)।',
    'tools.about.builtSquaresLabel': 'স্কয়ার: ',
    'tools.about.builtSquaresBody': 'ওয়াফক ফোর্জ (ম্যাজিক স্কয়ার বানান) আর কাওয়ায়িদ (স্কয়ারের নিয়ম)।',
    'tools.about.builtNotesLabel': 'নোট ও স্মৃতি: ',
    'tools.about.builtNotesBody': 'জার্নাল (পড়ার নোট), ওয়ার্ড (জিকির কাউন্টার), গ্রিমোয়ার (সেভ করা জিনিস)।',
    'tools.about.builtSelfLabel': 'এই অংশ নিজে: ',
    'tools.about.builtSelfBody': 'পদ্ধতি (টুলস কীভাবে কাজ করে) আর এই About পাতা।',
    'tools.about.notBuiltTitle': 'কী বানানো হয়নি',
    'tools.about.notBuilt1': 'কোনো AI শিক্ষক নেই। বিষয় নিয়ে প্রশ্ন কোনো মানুষকে করতে হবে, এই অংশকে নয়।',
    'tools.about.notBuilt2':
      'কিছুই যা কাউকে ক্ষতি করে, বাধ্য করে বা বাঁধে। টুলস শুধু সূচি করে; সেগুলো কখনো কোনো মানুষের দিকে লক্ষ্য করে কাজ বানায় না।',
    'tools.about.notBuilt3': 'পরিমাণসহ কোনো ধূপের রেসিপি নেই, আর কোনো ধরনের তৈরির নির্দেশনা নেই।',
    'tools.about.sourcesTitle': 'তথ্যের উৎস',
    'tools.about.srcAbjadLabel': 'আবজাদ টেবিল: ',
    'tools.about.srcAbjadBody': 'সাধারণ আবজাদ মান (মাশরিকি/মাগরিবি), Wikipedia-র “Abjad numerals” আর OpenArabic ও WiserWork-এর আবজাদ ক্যালকুলেটর দিয়ে যাচাই করা। দুই স্কুল 22টি অক্ষরে একমত। ছয়টিতে আলাদা (সাদ, দাদ, সিন, শিন, জা, গাইন)। কবীর মানে প্রতিটি অক্ষরের পুরো মান। সগীর মানে সেই মান যা এক অঙ্কে ছোট করা হয়েছে।',
    'tools.about.srcQuranLabel': 'কুরআনের লেখা: ',
    'tools.about.srcQuranBody': 'ফাওয়াতিহ রূপ, সাওয়াকিত অক্ষর আর শিল্ডসের যোগফল ওই লেখা থেকেই রান টাইমে বের করা হয়। হাতে লেখা হয় না। লেখাটি Tanzil-এর শর্তে ব্যবহার হয়। হুবহু কপি। উৎসের নাম। tanzil.net-এর লিঙ্ক। সূরার নাম আর অর্থ AlQuranCloud-এর সূরা তালিকা থেকে নেওয়া হয়েছে। তা 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.about.srcTranslitLabel': 'উচ্চারণ: ',
    'tools.about.srcTranslitBody': 'ফাওয়াতিহ, সাওয়াকিত আর শিল্ডস পাতায় আরবির লাতিন পড়া একই প্রজেক্ট থেকে আসে। তা অ-বাণিজ্যিক ব্যবহারে রাখা হয়। লিঙ্কসহ। শর্ত যেমন বলে। প্রতিটি আয়াত আরবির সাথে শব্দে শব্দে যাচাই করা হয়েছে।',
    'tools.about.srcNamesLabel': '99 নাম: ',
    'tools.about.srcAstroLabel': 'জ্যোতির্বিজ্ঞান আর সময়: ',
    'tools.about.srcAstroBody': 'রক্ষণাবেক্ষণ করা Astronomy Engine লাইব্রেরি (astronomy-engine) দিয়ে সূর্যোদয়, সূর্যাস্ত, চাঁদের দশা আর longitude, আর সূর্যের longitude বের করা হয়। এখানে কোনো জ্যোতির্বিজ্ঞানের সূত্র হাতে লেখা হয়নি।',
    'tools.about.srcMansionsLabel': 'চান্দ্র মঞ্জিল: ',
    'tools.about.srcMansionsBody': 'Wikipedia, “Lunar mansion” (মানাজিল আল-কামার টেবিল, 28টি স্টেশন যা al-Sharatayn দিয়ে 0° থেকে শুরু হয়), 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.about.srcSignsLabel': 'বারো রাশি: ',
    'tools.about.srcSignsBody': 'Wikipedia, “Astrological sign” (পশ্চিমা রাশিচক্রের টেবিল, ক্রান্তীয় রাশি আর উপাদানের ত্রয়ী), 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল।',
    'tools.about.srcPlanetsLabel': 'গ্রহ আর দিনের শাসক: ',
    'tools.about.srcPlanetsBody': 'Wikipedia, “Planetary hours” (Chaldean ক্রম আর কোন গ্রহ কোন সপ্তাহের দিনের শাসক)। আরবি গ্রহের নাম: Wiktionary, “Appendix:Planets”, আর সেখানে উদ্ধৃত al-Biruni-র তালিকা।',
    'tools.about.srcSquaresLabel': 'ম্যাজিক স্কয়ার: ',
    'tools.about.srcSquaresBody': 'Wikipedia, “Magic square” আর “Conway’s LUX method for magic squares” (কনস্ট্রাকশন 18 নভেম্বর 2026-এ যাচাই করা হয়েছিল)।',
    'tools.about.srcNotesLabel': 'আপনার নোট, গণনা আর সেভ করা জিনিস: ',
    'tools.about.srcNotesBody': 'আপনার লেখা, শুধু এই ডিভাইসের স্টোরেজেই থাকে। কোথাও পাঠানো হয় না।',
    'tools.about.convTitle': 'বেছে নেওয়া প্রথা',
    'tools.about.convSchoolsLabel': 'দুই স্কুল, দুই পদ্ধতি: ',
    'tools.about.convSchoolsBody': 'দুটি টেবিল আছে। মাশরিকি মানে পূর্বের। মাগরিবি মানে পশ্চিমের। কবীর মানে পুরো মান। সগীর মানে প্রতিটি অক্ষর এক অঙ্কে ছোট করে যোগ করা। আপনি পাতায় বদলাতে পারেন। সংখ্যা আপডেট হয়।',
    'tools.about.convCountingLabel': 'গোনার নিয়ম: ',
    'tools.about.convCountingBody': 'সব অক্ষর গোনার জন্য একটি shared normalisation routine ব্যবহার হয়। Unicode NFC। হামজার রূপ এক করা হয়েছে। তা মারবুতা-কে হা পড়া হয়। আলিফ মাকসুরা-কে ইয়া পড়া হয়। শাদ্দা তার অক্ষরকে দ্বিগুণ করে। যেখানে অক্ষরটি আগে থেকে দুইবার লেখা আছে সেখানে ছাড়া। যেমন Allah-এ। উসমানি বানান যেমন লেখা আছে তেমনই গোনা হয়। তাই al-Rahman শিল্ডসে 529। আর সাধারণ বানানে 329।',
    'tools.about.convHoursLabel': 'প্ল্যানেটারি আওয়ার: ',
    'tools.about.convHoursBody': 'আওয়ার সমান নয়। দিন চলে সূর্য ওঠা থেকে ডোবা পর্যন্ত। রাত সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত। কোনো লোকেশন সেট করা না থাকলে, আওয়ার নির্দিষ্ট 06:00–18:00 ভাগে চলে। তা স্পষ্টভাবে আনুমানিক লেখা হয়। যেখানে সূর্য ওঠে না বা ডোবে না, সেখানে আওয়ার unavailable দেখানো হয়।',
    'tools.about.convHijriLabel': 'হিজরি তারিখ: ',
    'tools.about.convHijriBody': 'ইসলামি সিভিল ক্যালেন্ডার (Intl, Kuwaiti algorithm) ব্যবহার হয়। এটি আনুমানিক। আসল মাস চাঁদ দেখার উপর নির্ভর করে। আর এক-দুই দিন এদিক-ওদিক হতে পারে।',
    'tools.about.convMansionsLabel': 'চান্দ্র মঞ্জিল: ',
    'tools.about.convMansionsBody': '28টি সমান অংশ আছে। প্রায় 12.857° করে। 0°-তে al-Sharatayn দিয়ে শুরু। এটি একটি প্রথা। সর্বজনীন সত্য নয়। অন্য ঐতিহ্য গণনা অন্য জায়গা থেকে শুরু করে। Mansions পাতা আপনাকে শুরুর বিন্দু সরাতে দেয়।',
    'tools.about.convSignsLabel': 'বারো রাশি: ',
    'tools.about.convSignsBody': 'ক্রান্তীয় রাশিচক্র ব্যবহার হয়। মার্চ বিষুব থেকে মাপা হয়। তাই রাশিগুলো এখন আর একই নামের তারামণ্ডলের সাথে মেলে না।',
    'tools.about.testedTitle': 'কী পরীক্ষা হয়েছে',
    'tools.about.testedIntro': 'পুরো সাইট automated test দিয়ে ঢাকা আছে। পুরো স্যুট green। আর প্রতিটি পরিবর্তন পাঠানোর আগে তা চলে। এই অংশের জন্য যে test-গুলো গুরুত্বপূর্ণ, সেগুলো হলো:',
    'tools.about.testedAbjadLabel': 'আবজাদ হিসাব: ',
    'tools.about.testedAbjadBody': 'দুই স্কুল আর দুই পদ্ধতিতে অক্ষরের মান যাচাই করা হয়। normalisation-ও। হামজার রূপ। শাদ্দা। তাতউইল। ভাঙা অক্ষর। আর লেখার যোগফলও। যার মধ্যে সহজ যাচাই “Allah 66” আর “bism Allah 168”-ও আছে।',
    'tools.about.testedQuranLabel': 'কুরআনের লেখা: ',
    'tools.about.testedQuranBody': 'পাঁচটি শিল্ড লেখার আয়াতের সংখ্যা যাচাই করা হয়। প্রতিটি সংরক্ষিত স্ট্রিংয়ের Unicode NFC রূপ। বাসমালাহ আল-ফাতিহায় রাখা হয়েছে। অন্য তিনটি সূরা থেকে সরানো হয়েছে। ফাওয়াতিহ নিয়মে ঠিক 29টি সূরা 14টি রূপে হুবহু ম্যাপিংসহ। সাতটি সাওয়াকিত অক্ষর। আর পাঁচটি শিল্ডসের যোগফল দুই পদ্ধতি আর দুই স্কুলে। প্রত্যাশিত সংখ্যাগুলো উৎস লেখা থেকে আলাদাভাবে বের করা হয়েছিল। পরীক্ষার কোড থেকে নয়। উচ্চারণও একইভাবে যাচাই করা হয়। প্রতিটি আয়াত তার আরবি আয়াতের সাথে শব্দে শব্দে মেলে। 137টি শব্দ। আর 114:6 সংশোধন test-এ pin করা আছে।',
    'tools.about.testedTimeLabel': 'সময় আর স্কয়ার: ',
    'tools.about.testedTimeBody': 'প্ল্যানেটারি আওয়ার যাচাই করা হয়। মধ্যরাত আর মেরু ক্ষেত্রসহ। চাঁদ আর মঞ্জিলের সীমানা। আর স্কয়ার তৈরি করা ও আলাদা validator। জানা কনস্ট্যান্ট। সরানো যোগফল। আর যে ক্ষেত্রগুলো মানা করতেই হবে।',
    'tools.about.testedStorageLabel': 'স্টোরেজ আর ওয়্যারিং: ',
    'tools.about.testedStorageBody': 'জার্নাল, ওয়ার্ড আর গ্রিমোয়ারের save/load round-trips যাচাই করা হয়। সঠিক JSON-এর export/import। ভুল ফাইলকে পুরনো তথ্য না মুছে প্রত্যাখ্যান করা। আর হাবের প্রতিটি টুলের matching route, URL আর পাতা থাকা।',
    'tools.about.limitsTitle': 'জানা সীমা',
    'tools.about.limit1': 'ফাওয়াতিহ পাতায় বলা হয় না শুরুর অক্ষরগুলোর অর্থ কী। অর্থের জন্য এখনো কোনো উৎস বলা হয়নি।',
    'tools.about.limit2': 'সাওয়াকিত পাতায় সাতটি অনুপস্থিত অক্ষরের সাথে জড়িত ঐতিহ্যবাহী নাম দেওয়া হয় না। সেগুলোর জন্য এখনো কোনো উৎস বলা হয়নি। Shams al-Ma’arif-এর Inloes অনুবাদ যাচাই করা হয়েছে। তাতে সেগুলো নেই।',
    'tools.about.limit3': 'উপাদানের দল, আলোকিত আর অন্ধকার অক্ষর, আর অক্ষর-গ্রহের সম্পর্ক কোথাও দেখানো হয় না। সেই ম্যাপিংগুলোর জন্য এখনো কোনো উৎস বলা হয়নি। তাই কিছু আন্দাজ করা হয় না।',
    'tools.about.limit4': 'মাগরিবি মান টেবিলের নাম করা উৎস থেকে আসে। ছয়টি অক্ষর মাশরিকি থেকে আলাদা। বাকি 22টি এক।',
    'tools.about.limit5': 'Today পাতায় দেখানো হিজরি তারিখ আনুমানিক বলা হয়। এটি হিসাব করা (সিভিল) তারিখ। যা চাঁদ দেখার তারিখ থেকে এক-দুই দিন এদিক-ওদিক হতে পারে।',
    'tools.about.limit6': 'এখানে নামাজের সময় নেই।',
    'tools.about.limit7': 'নোট, গণনা আর সেভ করা জিনিস শুধু এই ডিভাইসেই রাখা হয়। ব্রাউজারের সাইট ডেটা মুছলে, বা অন্য ডিভাইসে গেলে, সেগুলো হারিয়ে যাবে। যদি না আপনি আগে JSON ব্যাকআপ এক্সপোর্ট করে থাকেন।',
    'tools.about.whoTitle': 'এটা কে বানিয়েছে',
    'tools.about.whoBody': 'এই Study Tools Ilm-e-Ghayb Library-র অংশ, Ghayb Chronicles (@ghayb.chronicles) থেকে। ইসলামি গূঢ় জ্ঞান, রহস্যবাদ আর সুফি প্রজ্ঞা, প্রতিটি ক্যাপশনে উৎসসহ। লাইব্রেরি ফ্রি। টুলস আর বই চ্যানেলের ফলোয়ারদের জন্য ফলো গেটের পেছনে আছে।',

    // ---- Tier B: Kitab ----
    'tools.kitab.title': 'কিতাব (বইটি)',
    'tools.kitab.eyebrow': 'বই',
    'tools.kitab.subtitle': 'বই সম্পর্কে বইগুলো কী বলে, বইগুলো থেকেই।',
    'tools.kitab.chapterLabel': 'অধ্যায়',
    'tools.kitab.filterAria': 'Chapter diye filter korun',
    'tools.kitab.allChapters': 'সব অধ্যায়',
    'tools.kitab.chapterN': 'অধ্যায় {n}',
    'tools.kitab.frontMatter': 'শুরুর অংশ',
    'tools.kitab.backMatter': 'শেষের অংশ',
    'tools.kitab.filterNote':
      'এই এন্ট্রিগুলো বই সম্পর্কে সাধারণ নোট, অধ্যায়ের লেখা নয়, তাই অধ্যায়ের ফিল্টারে এগুলো কমে না।',

    // ---- Tier B: Talasim ----
    'tools.talasim.title': 'তালাসিম (আকৃতি)',
    'tools.talasim.eyebrow': 'আকৃতি',
    'tools.talasim.subtitle': 'তাবিজ কী, তার আকৃতি, আর তা বানানোর চারটি কঠোর শর্ত।',
    'tools.talasim.searchLabel': 'আকৃতি খুঁজুন',
    'tools.talasim.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Ashkal ----
    'tools.ashkal.title': 'আশকাল (রূপ)',
    'tools.ashkal.eyebrow': 'আকৃতি',
    'tools.ashkal.subtitle': 'রূপ হলো আত্মার পাত্র, বিন্দু থেকে বর্গ পর্যন্ত।',
    'tools.ashkal.searchLabel': 'রূপ খুঁজুন',
    'tools.ashkal.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Figure Forge ----
    'tools.figureForge.title': 'ফিগার ফোর্জ',
    'tools.figureForge.eyebrow': 'আকৃতি',
    'tools.figureForge.subtitle': 'আকৃতি কীভাবে বানানো হয়, পুরনো বইয়ের ভাষায়।',
    'tools.figureForge.searchLabel': 'আকৃতি খুঁজুন',
    'tools.figureForge.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Talism Studio ----
    'tools.talismStudio.title': 'তালিস্ম স্টুডিও',
    'tools.talismStudio.eyebrow': 'সিল',
    'tools.talismStudio.subtitle': 'যে ঘরে কাজ হয়, বইগুলো যেমন বর্ণনা করে।',
    'tools.talismStudio.searchLabel': 'সিল খুঁজুন',
    'tools.talismStudio.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Haqaiq ----
    'tools.haqaiq.title': 'হাকায়িক (বাস্তবতা)',
    'tools.haqaiq.eyebrow': 'বাস্তবতা',
    'tools.haqaiq.subtitle': 'বাস্তবতা যা হৃদয়ে থাকে, বইয়ে নয়।',
    'tools.haqaiq.searchLabel': 'রেকর্ড খুঁজুন',
    'tools.haqaiq.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Shart ----
    'tools.shart.title': 'শর্ত (শর্তাবলি)',
    'tools.shart.eyebrow': 'শর্তাবলি',
    'tools.shart.subtitle': 'প্রতিটি কাজের জন্য যে শর্তগুলো দরকার, একে একে।',
    'tools.shart.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.shart.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: al-Sirr al-Jalil ----
    'tools.sirr.title': 'আল-সির আল-জালিল',
    'tools.sirr.eyebrow': 'মনোগ্রাফ',
    'tools.sirr.subtitle': 'মহান গোপন বিষয়, আর সেই নাম যা তা খোলে।',
    'tools.sirr.searchLabel': 'মনোগ্রাফ খুঁজুন',
    'tools.sirr.searchPlaceholder': 'শিরোনাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Durus ----
    'tools.durus.title': 'দুরুস (পাঠ)',
    'tools.durus.eyebrow': 'পাঠ',
    'tools.durus.subtitle': 'শেখার পাঠ, পুরনো উস্তাদদের কাছ থেকে।',
    'tools.durus.searchLabel': 'পাঠ খুঁজুন',
    'tools.durus.searchPlaceholder': 'পাঠ বা কোর্স দিয়ে খুঁজুন',

    // ---- Tier B: Index ----
    'tools.index.title': 'সূচি',
    'tools.index.eyebrow': 'সূচি',
    'tools.index.subtitle': 'পুরনো বইগুলো নিজেদেরকে কীভাবে মানচিত্র করে।',
    'tools.index.searchLabel': 'সূচি খুঁজুন',
    'tools.index.searchPlaceholder': 'নাম বা বিষয় দিয়ে খুঁজুন',

    // ---- Tier B: Library ----
    'tools.library.title': 'লাইব্রেরি (স্কয়ার লাইব্রেরি)',
    'tools.library.eyebrow': 'স্কয়ার লাইব্রেরি',
    'tools.library.subtitle': 'পুরনো বইগুলো কীভাবে রাখা হতো আর হাত বদল হতো।',
    'tools.library.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.library.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Atlas ----
    'tools.atlas.title': 'অ্যাটলাস',
    'tools.atlas.eyebrow': 'অ্যাটলাস',
    'tools.atlas.subtitle': 'আকাশের মানচিত্র, গোলক আর অক্ষর।',
    'tools.atlas.searchLabel': 'অ্যাটলাস খুঁজুন',
    'tools.atlas.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Qalam ----
    'tools.qalam.title': 'কলম',
    'tools.qalam.eyebrow': 'কলম',
    'tools.qalam.subtitle': 'কলম, প্রথম সৃষ্টি, আর প্রথম যা লিখেছিল।',
    'tools.qalam.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.qalam.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Khatam ----
    'tools.khatam.title': 'খাতাম',
    'tools.khatam.eyebrow': 'খাতাম',
    'tools.khatam.subtitle': 'সিল, আর সুলাইমান তার মালিক।',
    'tools.khatam.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.khatam.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',
    'tools.khatam.gridTitle': '3 by 3 গ্রিড, এই পাতায় দেখানো হয়েছে',
    'tools.khatam.gridBody':
      'বইগুলো 3 by 3 গ্রিডকে সুলাইমান আর আল-গাজালির সিল বলে। এটা রইল, বইগুলো যেমন দেয়। প্রতিটি সারি, প্রতিটি কলাম আর দুটি কর্ণের যোগফল 15।',
    'tools.khatam.gridNote':
      'গ্রিড উপরে, এই পাতায় পুরোপুরি দেখানো হয়েছে। দেখতে বা ব্যবহার করতে ডাউনলোডের দরকার নেই।',
    'tools.khatam.copyGrid': 'গ্রিড কপি করুন',
    'tools.khatam.saveImage': 'ছবি হিসেবে সেভ করুন',
    'tools.khatam.sealCaption': 'সুলাইমানের সিল, 3 by 3, প্রতিটি লাইনের যোগফল 15',
    'tools.khatam.gridAria': '3 by 3 grid, Sulemaner mohor',
    'tools.khatam.sealAria': 'Sulemaner mohor, 3 by 3 grid',
    'tools.khatam.gridSourceBody': 'Ei numbergulo classic 3 by 3 square, ar prottek line er jogfol 15.',

    // ---- Tier B: Plate ----
    'tools.plate.title': 'প্লেট',
    'tools.plate.eyebrow': 'প্লেট',
    'tools.plate.subtitle': 'ধাতুর প্লেট, প্রতিটি গ্রহের জন্য একটি।',
    'tools.plate.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.plate.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',
    'tools.plate.metalsTitle': 'ধাতু আর তাদের গ্রহ, এই পাতায় দেখানো হয়েছে',
    'tools.plate.metalsBody':
      'প্রতিটি গ্রহের নিজের ধাতু আছে, আর ধাতুকে গ্রহের সাথে মিলতে হবে। সূর্যের সোনা আছে। চাঁদের রুপা আছে। মঙ্গলের লোহা আছে। বুধের পারদ আছে। শনির সিসা আছে।',
    'tools.plate.metalsNote':
      'চিত্র উপরে, এই পাতায় পুরোপুরি দেখানো হয়েছে। দেখতে বা ব্যবহার করতে ডাউনলোডের দরকার নেই। বইগুলো তামার প্লেট আর টিনের পাতের নামও নেয়, কিন্তু এই পাতার এন্ট্রিগুলোতে সেগুলোকে কোনো গ্রহের সাথে জোড়ে না।',
    'tools.plate.copyList': 'তালিকা কপি করুন',
    'tools.plate.saveImage': 'ছবি হিসেবে সেভ করুন',
    'tools.plate.metalsAria': 'Dhatu ar tader groho',
    'tools.plate.tableAria': 'Dhatu ar tader groher plate',
    'tools.plate.svgTitle': 'লাওহ, প্লেট',
    'tools.plate.svgSub': 'প্রতিটি গ্রহের নিজের ধাতু আছে। ধাতুকে গ্রহের সাথে মিলতে হবে।',
    'tools.plate.svgFoot': 'তামা আর টিনকেও প্লেট বলা হয়েছে। তাদের গ্রহ এখানে বলা হয়নি।',

    // ---- Tier B: Works ----
    'tools.works.title': 'কাজ',
    'tools.works.eyebrow': 'কাজ',
    'tools.works.subtitle': 'বইগুলো কাজ সম্পর্কে কী বলে, আর তার কী দরকার।',
    'tools.works.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.works.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Bakhur and Adad ----
    'tools.bakhur.title': 'বাখুর ও আদাদ',
    'tools.bakhur.eyebrow': 'বাখুর ও আদাদ',
    'tools.bakhur.subtitle': 'নাম করা সুগন্ধি জিনিস আর সংখ্যার কাজের তালিকা, শুধু এটুকুই।',
    'tools.bakhur.searchLabel': 'তালিকা খুঁজুন',
    'tools.bakhur.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Shurut ----
    'tools.shurut.title': 'শুরুত (শর্তাবলি)',
    'tools.shurut.eyebrow': 'শর্তাবলি',
    'tools.shurut.subtitle': 'বইগুলো যে শর্তগুলো বলে, প্রতিটি তার উৎস আর পাতাসহ।',
    'tools.shurut.searchLabel': 'এন্ট্রি খুঁজুন',
    'tools.shurut.searchPlaceholder': 'নাম বা পাতা দিয়ে খুঁজুন',

    // ---- Tier B: Glossary ----
    'tools.glossary.title': 'শব্দকোষ',
    'tools.glossary.eyebrow': 'শব্দকোষ',
    'tools.glossary.subtitle': 'এই অংশে ব্যবহৃত শব্দগুলো, সহজ কথায়।',
    'tools.glossary.searchLabel': 'শব্দ খুঁজুন',
    'tools.glossary.searchPlaceholder': 'শব্দ দিয়ে খুঁজুন',
    'tools.glossary.filterLabel': 'অক্ষর দিয়ে ছাঁকুন',
    'tools.glossary.showingLetter': '{letter}-এর নিচের শব্দগুলো দেখানো হচ্ছে। পুরো শব্দকোষ আবার দেখতে All চাপুন।',

    // ---- Data: tool titles & blurbs (hub + search) ----
    'tools.data.toolTitle.huruf': 'হুরুফ (অক্ষর ও সংখ্যা)',
    'tools.data.toolBlurb.huruf':
      '28টি আরবি অক্ষর আর তাদের আবজাদ মান, গোনার নিয়ম সহজ কথায় দেখানো হয়েছে।',
    'tools.data.toolTitle.asma': 'আসমা (99 নাম)',
    'tools.data.toolBlurb.asma':
      '99 নাম খুঁজুন, প্রতিটি নামের সংখ্যার মান দেখুন, যেকোনো নামের হিসাব করুন, আর যে নাম রাখতে চান তা সেভ করুন।',
    'tools.data.toolTitle.bast': 'বাস্ত (লেখা খোলা)',
    'tools.data.toolBlurb.bast':
      'যেকোনো লেখা লিখুন আর অক্ষরে অক্ষরে খোলা অবস্থায় দেখুন, প্রতিটি অক্ষরের মান আর চলতি যোগফলসহ।',
    'tools.data.toolTitle.fawatih': 'ফাওয়াতিহ (শুরুর অক্ষর)',
    'tools.data.toolBlurb.fawatih':
      '14টি আলাদা অক্ষরের রূপ যা 29টি সূরা খোলে, প্রতিটি সূরার প্রথম আয়াতে নিয়ম চালিয়ে পাওয়া গেছে, তাদের মানসহ।',
    'tools.data.toolTitle.sawaqit': 'সাওয়াকিত (সাতটি অনুপস্থিত অক্ষর)',
    'tools.data.toolBlurb.sawaqit':
      'সাতটি অক্ষর যা আল-ফাতিহায় কোথাও আসে না, সূরাটি কোন অক্ষর ব্যবহার করে তা গুনে পাওয়া গেছে।',
    'tools.data.toolTitle.shields': 'শিল্ডস (চলতি অক্ষরের যোগফল)',
    'tools.data.toolBlurb.shields':
      'আল-ফাতিহা, আল-ইখলাস, আল-ফালাক, আল-নাস আর আয়াত আল-কুরসির শব্দে শব্দে চলতি অক্ষরের যোগফল, যাতে আপনি হিসাবটি অনুসরণ করতে পারেন।',
    'tools.data.toolTitle.journal': 'জার্নাল (পড়ার নোট)',
    'tools.data.toolBlurb.journal':
      'যা পড়লেন তার নোট রাখুন। সবকিছু এই ডিভাইসেই থাকে. কোথাও পাঠানো হয় না।',
    'tools.data.toolTitle.wird': 'ওয়ার্ড (জিকির কাউন্টার)',
    'tools.data.toolBlurb.wird':
      'দৈনিক জিকিরের জন্য একটি সাধারণ কাউন্টার, নিজের ঠিক করা লক্ষ্যসহ। এই ডিভাইসে সেভ হয়।',
    'tools.data.toolTitle.grimoire': 'গ্রিমোয়ার (সেভ করা জিনিস)',
    'tools.data.toolBlurb.grimoire':
      'নাম, খোলা লেখা আর নোট যা আপনি অন্য টুলস থেকে সেভ করেছেন, সব এক জায়গায়, এই ডিভাইসে।',
    'tools.data.toolTitle.today': 'আজ',
    'tools.data.toolBlurb.today':
      'আজকের দিনের কথা: তারিখ, আনুমানিক হিজরি তারিখ, দিনের শাসক, আর এখনকার প্ল্যানেটারি আওয়ার।',
    'tools.data.toolTitle.hours': 'Planetary Hours',
    'tools.data.toolBlurb.hours':
      'দিনের 24টি আওয়ার, প্রতিটি একটি গ্রহের শাসনে। দিনের আওয়ার সূর্য ওঠা থেকে ডোবা পর্যন্ত, রাতের আওয়ার সূর্য ডোবা থেকে পরের সূর্য ওঠা পর্যন্ত. আওয়ার সমান নয়।',
    'tools.data.toolTitle.moon': 'চাঁদ',
    'tools.data.toolBlurb.moon':
      'চাঁদের দশা, তা কতটা আলোকিত, চান্দ্র দিন, আর তা কোন মঞ্জিলে আছে।',
    'tools.data.toolTitle.mansions': 'Lunar Mansions',
    'tools.data.toolBlurb.mansions':
      'চাঁদের 28টি মঞ্জিল, আজকের মঞ্জিল হাইলাইট করা আর শুরুর বিন্দু একটি প্রথা যা আপনি বদলাতে পারেন।',
    'tools.data.toolTitle.falak': 'ফালাক — বারো রাশি',
    'tools.data.toolBlurb.falak': 'ক্রান্তীয় রাশিচক্রের বারোটি রাশি, আজ সূর্য কোন রাশিতে আছে তা সহ।',
    'tools.data.toolTitle.majlis': 'মজলিস',
    'tools.data.toolBlurb.majlis':
      'এই মুহূর্তের কথা এক জায়গায়: লোকেশন, আজকের শাসক, এখনকার আওয়ার, আর চাঁদ। শুধু তথ্য. কোনো পরামর্শ নয়।',
    'tools.data.toolTitle.forge': 'ওয়াফক ফোর্জ — ম্যাজিক স্কয়ার',
    'tools.data.toolBlurb.forge':
      '3 থেকে 20 অর্ডারের ম্যাজিক স্কয়ার বানান, একটি টার্গেট যোগফলে, তারপর আলাদা validator দিয়ে লাইন ধরে ধরে যাচাই করুন।',
    'tools.data.toolTitle.qawaid': 'কাওয়ায়িদ — স্কয়ারের নিয়ম',
    'tools.data.toolBlurb.qawaid':
      'স্কয়ার কীভাবে বানানো হয়, টার্গেট যোগফল কখন মেলা যায়, কীভাবে যাচাই করা হয়, আর কী মানা করে দেওয়া হয়।',
    'tools.data.toolTitle.kitab': 'কিতাব (বইটি)',
    'tools.data.toolBlurb.kitab':
      'বই সম্পর্কে বইগুলো কী বলে: বইয়ের তিন মা, সংরক্ষিত ফলক, আর লাইব্রেরিতে শিরোনাম দেওয়া কিতাবগুলো।',
    'tools.data.toolTitle.talasim': 'তালাসিম (আকৃতি)',
    'tools.data.toolBlurb.talasim':
      'তাবিজ কী, তার আকৃতি আর বংশ, আর তা বানানোর চারটি কঠোর শর্ত।',
    'tools.data.toolTitle.ashkal': 'আশকাল (রূপ)',
    'tools.data.toolBlurb.ashkal':
      'রূপ আত্মার পাত্র: বিন্দু আর বৃত্ত, ত্রিভুজ আর বর্গ, আকৃতি হিসেবে ম্যাজিক স্কয়ার, আর আরও অনেক কিছু।',
    'tools.data.toolTitle.figure-forge': 'ফিগার ফোর্জ',
    'tools.data.toolBlurb.figure-forge':
      'আকৃতি কীভাবে বানানো হয়: ধাতু আর পাথর, সময়, ধোয়া, পবিত্র করা, আর কারিগর।',
    'tools.data.toolTitle.talism-studio': 'তালিস্ম স্টুডিও',
    'tools.data.toolBlurb.talism-studio':
      'পুরনো কারিগরির কর্মশালা: জিকিরের ঘর, চারটি স্তম্ভ, বালির বোর্ড, আর স্টুডিওর নিয়ম।',
    'tools.data.toolTitle.haqaiq': 'হাকায়িক (বাস্তবতা)',
    'tools.data.toolBlurb.haqaiq':
      'বাস্তবতা যা হৃদয়ে থাকে: স্থির সত্তা, তিন জগৎ, আর শরিয়ত, তরিকত আর হাকিকতের পথ।',
    'tools.data.toolTitle.shart': 'শর্ত (শর্তাবলি)',
    'tools.data.toolBlurb.shart':
      'প্রতিটি কাজের জন্য যে শর্তগুলো দরকার: 27টি শর্ত, চারটি স্তম্ভ, পবিত্রতা, আর ইচ্ছার শর্ত।',
    'tools.data.toolTitle.sirr-al-jalil': 'আল-সির আল-জালিল',
    'tools.data.toolBlurb.sirr-al-jalil':
      'মহান গোপন বিষয়: আল-জালিল নাম, আল-মাজিদ নাম, আর তার ম্যাট্রিক্সে রাখা গোপন বিষয়।',
    'tools.data.toolTitle.durus': 'দুরুস (পাঠ)',
    'tools.data.toolBlurb.durus':
      'শেখার পাঠ: নীরবতা, জিলানির তেরোটি শাখা, পড়ার শিষ্টাচার, আর সৃষ্টি থেকে শেখা।',
    'tools.data.toolTitle.index': 'সূচি',
    'tools.data.toolBlurb.index':
      'পুরনো বইগুলো নিজেদেরকে কীভাবে মানচিত্র করে: ইবনে আরাবির সূচির অধ্যায়, রুব্রিক, আর জ্ঞানের ছড়িয়ে পড়া।',
    'tools.data.toolTitle.library': 'লাইব্রেরি (স্কয়ার লাইব্রেরি)',
    'tools.data.toolBlurb.library':
      'পুরনো বইগুলো কীভাবে রাখা হতো: লুকানো জ্ঞান, সিন্দুক, হেফাজতের চুক্তি, আর বড় লাইব্রেরিগুলো।',
    'tools.data.toolTitle.atlas': 'অ্যাটলাস',
    'tools.data.toolBlurb.atlas':
      'আকাশের মানচিত্র: অ্যাটলাস গোলক, নয়টি চার্ট, অক্ষর বিন্যাসের চাকা, আর কাফের মাথা।',
    'tools.data.toolTitle.qalam': 'কলম',
    'tools.data.toolBlurb.qalam':
      'কলম: প্রথম সৃষ্টি, ত্রিগুণ লেখা, তাবিজের কলমের নিয়ম, আর রুমির পিঁপড়া।',
    'tools.data.toolTitle.khatam': 'খাতাম',
    'tools.data.toolBlurb.khatam':
      'সিল: সুলাইমান তার মালিক, 3 by 3 গ্রিড, সাতটি প্রতীক, আর নবীদের সিল।',
    'tools.data.toolTitle.plate': 'প্লেট',
    'tools.data.toolBlurb.plate':
      'ধাতুর প্লেট: সূর্যের জন্য সোনা, চাঁদের জন্য রুপা, মঙ্গলের জন্য লোহা, শনির জন্য সিসা, আর সাত ধাতুর ঢালাই।',
    'tools.data.toolTitle.works': 'কাজ',
    'tools.data.toolBlurb.works':
      'বইগুলো কাজ সম্পর্কে কী বলে: তার দুটি উদ্দেশ্য, নিয়ত, অক্ষর, স্কয়ারের আকার, আর প্রোটোকল, প্রতিটি তার উৎসসহ।',
    'tools.data.toolTitle.bakhur-adad': 'বাখুর ও আদাদ',
    'tools.data.toolBlurb.bakhur-adad':
      'সুগন্ধি জিনিস আর সংখ্যার কাজের তালিকা, উৎস আর পাতাসহ। কখনো পরিমাণ, তৈরি বা রেসিপি নয়।',
    'tools.data.toolTitle.shurut': 'শুরুত (শর্তাবলি)',
    'tools.data.toolBlurb.shurut':
      'কাজের জন্য যে শর্তগুলো দরকার: সময়, সামঞ্জস্য, পবিত্রকরণ, দান, পবিত্রতা, নিয়ত আর নিশ্চয়তা, প্রতিটি তার উৎসসহ।',
    'tools.data.toolTitle.glossary': 'শব্দকোষ',
    'tools.data.toolBlurb.glossary':
      'এই অংশে ব্যবহৃত শব্দগুলো, সহজ কথায় ব্যাখ্যা করা, প্রতিটি তার উৎস আর পাতাসহ।',
    'tools.data.toolTitle.method': 'পদ্ধতি (এই টুলস কীভাবে কাজ করে)',
    'tools.data.toolBlurb.method':
      'সংখ্যা কোথা থেকে আসে, অক্ষর কীভাবে গোনা হয়, কী পরীক্ষা হয়েছে, আর এই টুলস কী করতে পারে না।',
    'tools.data.toolTitle.about': 'About (পড়াশোনার টুলস)',
    'tools.data.toolBlurb.about':
      'এই অংশটি কী, এর সংখ্যা কোথা থেকে আসে, কী পরীক্ষা হয়েছে, আর এটা কী করতে পারে না।',

    // ---- Data: topic groups ----
    'tools.data.topicGroupTitle.quran': 'কুরআন ও তাফসির',
    'tools.data.topicGroupBlurb.quran': 'কুরআন, আর আলেমরা কীভাবে তা ব্যাখ্যা করেন।',
    'tools.data.topicGroupTitle.hadith': 'হাদিস',
    'tools.data.topicGroupBlurb.hadith': 'নবীর কথা আর আমল, সংগ্রহ করা।',
    'tools.data.topicGroupTitle.seerah': 'নবীর জীবন',
    'tools.data.topicGroupBlurb.seerah': 'নবীর জীবন, আর নবীদের কাহিনি।',
    'tools.data.topicGroupTitle.history': 'ইতিহাস',
    'tools.data.topicGroupBlurb.history': 'ইসলাম কীভাবে বেড়েছে, আর সাম্রাজ্য কেন ওঠে আর পড়ে।',
    'tools.data.topicGroupTitle.sufism': 'সুফিবাদ ও জ্ঞান',
    'tools.data.topicGroupBlurb.sufism': 'আধ্যাত্মিক পথ, আর ঈমানের ভিত্তি।',
    'tools.data.topicGroupTitle.hidden': 'লুকানো জ্ঞান',
    'tools.data.topicGroupBlurb.hidden': 'গোপন বিষয়, প্রতীক, আত্মা, স্বপ্ন, আর অদৃশ্য জগৎ।',

    // ---- Data: planets, days, signs, elements, phases ----
    'tools.data.planet.saturn': 'শনি',
    'tools.data.planet.jupiter': 'বৃহস্পতি',
    'tools.data.planet.mars': 'মঙ্গল',
    'tools.data.planet.sun': 'সূর্য',
    'tools.data.planet.venus': 'শুক্র',
    'tools.data.planet.mercury': 'বুধ',
    'tools.data.planet.moon': 'চাঁদ',
    'tools.data.dayName.sunday': 'রবিবার',
    'tools.data.dayName.monday': 'সোমবার',
    'tools.data.dayName.tuesday': 'মঙ্গলবার',
    'tools.data.dayName.wednesday': 'বুধবার',
    'tools.data.dayName.thursday': 'বৃহস্পতিবার',
    'tools.data.dayName.friday': 'শুক্রবার',
    'tools.data.dayName.saturday': 'শনিবার',
    'tools.data.zodiac.0': 'মেষ',
    'tools.data.zodiac.1': 'বৃষ',
    'tools.data.zodiac.2': 'মিথুন',
    'tools.data.zodiac.3': 'কর্কট',
    'tools.data.zodiac.4': 'সিংহ',
    'tools.data.zodiac.5': 'কন্যা',
    'tools.data.zodiac.6': 'তুলা',
    'tools.data.zodiac.7': 'বৃশ্চিক',
    'tools.data.zodiac.8': 'ধনু',
    'tools.data.zodiac.9': 'মকর',
    'tools.data.zodiac.10': 'কুম্ভ',
    'tools.data.zodiac.11': 'মীন',
    'tools.data.element.fire': 'আগুন',
    'tools.data.element.earth': 'মাটি',
    'tools.data.element.air': 'বাতাস',
    'tools.data.element.water': 'জল',
    'tools.data.phase.newMoon': 'নতুন চাঁদ',
    'tools.data.phase.waxingCrescent': 'বাড়ন্ত কাস্তে চাঁদ',
    'tools.data.phase.firstQuarter': 'প্রথম চতুর্থাংশ',
    'tools.data.phase.waxingGibbous': 'বাড়ন্ত গিবাস',
    'tools.data.phase.fullMoon': 'পূর্ণ চাঁদ',
    'tools.data.phase.waningGibbous': 'কমন্ত গিবাস',
    'tools.data.phase.lastQuarter': 'শেষ চতুর্থাংশ',
    'tools.data.phase.waningCrescent': 'কমন্ত কাস্তে চাঁদ',

    // ---- Data: conventions & fixed util strings ----
    'tools.data.mansionConvention':
      'প্রায় 12.857 ডিগ্রির 28টি সমান অংশ, 0 ডিগ্রি থেকে al-Sharatayn দিয়ে শুরু। এটি একটি প্রথা, সর্বজনীন সত্য নয়; অন্য ঐতিহ্য গণনা অন্য জায়গা থেকে শুরু করে।',
    'tools.data.zodiacConvention':
      'ক্রান্তীয় রাশিচক্র: রাশিগুলো মার্চ বিষুব থেকে মাপা হয়, তাই সেগুলো এখন আর একই নামের তারামণ্ডলের সাথে মেলে না। তারিখগুলো আনুমানিক আর বছর বছর একটু বদলায়।',
    'tools.data.moonMethod': 'Astronomy Engine MoonPhase; চান্দ্র মাস 29.53 দিনের',
    'tools.data.hijriMethod': 'ইসলামি সিভিল ক্যালেন্ডার (Intl, Kuwaiti algorithm)',
    'tools.data.hijriNote': 'আসল মাস চাঁদ দেখার উপর নির্ভর করে আর এক-দুই দিন এদিক-ওদিক হতে পারে।',
    'tools.data.sunNoSet':
      'এই দিনে সূর্য ডোবে না (মধ্যরাতের সূর্য). সূর্যোদয় বা সূর্যাস্ত নেই যাকে আওয়ারে ভাগ করা যাবে।',
    'tools.data.sunNoRise':
      'এই দিনে সূর্য ওঠে না (মেরু রাত). সূর্যোদয় বা সূর্যাস্ত নেই যাকে আওয়ারে ভাগ করা যাবে।',
    'tools.data.sunRisesNoSet':
      'সূর্য আজ ওঠে কিন্তু এই ক্যালেন্ডার দিনে ডোবে না. এটা মধ্যরাতের পরে ডোবে।',

    // ---- Data: counting rules (NORMALIZATION_RULES, same order) ----
    'tools.data.normRule.1':
      'প্রথমে লেখাটিকে Unicode NFC রূপে আনা হয়, যাতে আলাদা আলাদা অংশে লেখা অক্ষর (যেমন আলিফ আর তার উপরে হামজার চিহ্ন) একটি অক্ষর হয়ে যায়।',
    'tools.data.normRule.2':
      'তাতউইল (টানা চিহ্ন) আর সব স্বরের চিহ্ন সরিয়ে দেওয়া হয়: ফাতহা, দাম্মা, কাসরা, সুকুন, তানউইন, উপরের আলিফ, আর এই ধরনের চিহ্ন।',
    'tools.data.normRule.3':
      'হামজার রূপগুলো এক করা হয়: أ, إ, آ, ٱ, আর একা হামজা ء সব ا হয়ে যায়; ؤ হয় و; ئ হয় ي।',
    'tools.data.normRule.4':
      'তা মারবুতা ة-কে ه পড়া হয়। এটি এই টুলের নিজের সিদ্ধান্ত, সর্বজনীন নিয়ম নয়।',
    'tools.data.normRule.5': 'আলিফ মাকসুরা ى-কে ي পড়া হয়।',
    'tools.data.normRule.6':
      'শাদ্দা যে অক্ষরের উপর থাকে তাকে দ্বিগুণ করে দেয়, তাই সেই অক্ষর দুইবার গোনা হয়। অক্ষরটি আগে থেকে দুইবার লেখা থাকলে, যেমন الله-তে দুটি লাম, শাদ্দা তৃতীয় অক্ষর যোগ করে না, তাই الله-এর যোগফল তবু 66-ই থাকে।',
    'tools.data.normRule.7':
      'স্পেস, যতিচিহ্ন আর অ-আরবি অক্ষর উপেক্ষা করা হয়: সেগুলো গোনা হয় না আর অক্ষরের তালিকায় আসে না।',

    // ---- Data: unsupported square modes ----
    'tools.data.unsupported.multiplied.label': 'গুণ করা স্কয়ার',
    'tools.data.unsupported.multiplied.note': 'উৎস দরকার. কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি।',
    'tools.data.unsupported.cycling.label': 'চক্রাকার স্কয়ার',
    'tools.data.unsupported.cycling.note': 'উৎস দরকার. কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি।',
    'tools.data.unsupported.hollowCentre.label': 'ফাঁপা মাঝখানের স্কয়ার',
    'tools.data.unsupported.hollowCentre.note': 'উৎস দরকার. কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি।',
    'tools.data.unsupported.grandWafq.label': 'গ্র্যান্ড ওয়াফক',
    'tools.data.unsupported.grandWafq.note': 'উৎস দরকার. কোনো নিয়ম আর কাজ করা উদাহরণ দেওয়া হয়নি।',

    // ---- Data: import errors (toolsStorage) ----
    'tools.data.importError.notJson': 'ওই ফাইলটি সঠিক JSON নয়।',
    'tools.data.importError.noToolsData': 'ওই ফাইলে টুলসের তথ্য নেই।',
    'tools.data.importError.noEntries': 'ওই ফাইলে জার্নাল, ওয়ার্ড বা গ্রিমোয়ারের তথ্য নেই।',
    'tools.data.importError.journalShape': 'ওই ফাইলে জার্নাল এন্ট্রিগুলো ঠিক আকারে নেই।',
    'tools.data.importError.wirdShape': 'ওই ফাইলে ওয়ার্ডের গণনা ঠিক আকারে নেই।',
    'tools.data.importError.grimoireShape': 'ওই ফাইলে গ্রিমোয়ারের জিনিসগুলো ঠিক আকারে নেই।',

    // ---- Data: Al Asrar intros (first-person, Khafi's voice) ----
    'tools.data.alAsrarIntro.kitab':
      'আমি এই বইগুলোর সাথে অনেক সময় কাটিয়েছি। কিতাব শব্দের অর্থ একটি বই। কিন্তু পুরনো বইয়ে এর অর্থ কাগজ আর কালির চেয়ে অনেক বেশি। বই সম্পর্কে আমি কী পেয়েছি, বইগুলো থেকেই।',
    'tools.data.alAsrarIntro.talasim':
      'তাবিজ বাজারে কেনা কোনো তাবিজ নয়। পুরনো বইয়ে এটি এমন একটি জিনিস যা যত্নে বানানো হয়, নাম আর অক্ষর আর সংখ্যা ভারসাম্যে বসানো হয়। বইগুলো এটা সম্পর্কে কী বলে, এই রইল।',
    'tools.data.alAsrarIntro.ashkal':
      'আশকাল মানে রূপ। রূপ শুধু কাগজের উপর একটি আকৃতি নয়। এই বইগুলোতে রূপ একটি পাত্র। এটি আত্মাকে ধরে রাখে যেমন কাপ জল ধরে রাখে। রূপ সম্পর্কে বইগুলো কী বলে, এই রইল।',
    'tools.data.alAsrarIntro.figure-forge':
      'আকৃতি লেখা হয় না। এটি বানানো হয়। পুরনো বইগুলো কঠোরভাবে বলে আকৃতি কীভাবে বানানো হয়, কী দিয়ে বানানো হয়, আর কখন বানানো হয়। আমি তাদের নিয়ম এখানে জড়ো করেছি যাতে আপনি কারিগরি দেখতে পারেন যেমন তারা বর্ণনা করে।',
    'tools.data.alAsrarIntro.talism-studio':
      'পুরনো বইয়ে স্টুডিওর জন্য কোনো আধুনিক শব্দ নেই। কিন্তু যে ঘরে কাজ হয়, তার বর্ণনা তারা স্পষ্টভাবে দেয়। আমি তাদের কর্মশালার বর্ণনা এখানে জড়ো করেছি, যাতে আপনি দেখতে পারেন তারা কীভাবে তা সাজিয়েছিল।',
    'tools.data.alAsrarIntro.haqaiq':
      'হাকায়িক মানে বাস্তবতা। শব্দটি ইঙ্গিত করে জিনিসের পৃষ্ঠের নিচে যা আসল। সুফিরা বলে বাস্তবতা হৃদয়ে থাকে, বইয়ে নয়। তারা সেগুলো সম্পর্কে কী লিখেছে, এই রইল।',
    'tools.data.alAsrarIntro.shart':
      'শর্ত মানে একটি শর্ত। এই বইগুলোতে শর্ত ছাড়া কিছুই কাজ করে না। বইগুলো যত্নে সেগুলো তালিকায় দেয়, কারণ শর্ত ছাড়া করা কাজ ভুল করা কাজ। তারা যে শর্তগুলো বলে, এই রইল।',
    'tools.data.alAsrarIntro.sirr-al-jalil':
      'আল-সির আল-জালিল মানে মহান গোপন বিষয়। এটি একসাথে একটি নাম, একটি সংখ্যা আর একটি দরজা। বইগুলো এটা সম্পর্কে কী বলে, আমি এখানে জড়ো করেছি, যাতে আপনি দেখতে পারেন একটি নাম কীভাবে গোপন বিষয়ের পুরো ক্ষেত্র খুলে দেয়।',
    'tools.data.alAsrarIntro.durus':
      'দুরুস মানে পাঠ। পুরনো উস্তাদরা শুধু বই দিয়ে পড়াতেন না। তাঁরা নীরবতা, উদাহরণ আর শিক্ষকের সঙ্গ দিয়ে পড়াতেন। শেখা সম্পর্কে তাঁরা কী বলেন, এই রইল।',
    'tools.data.alAsrarIntro.index':
      'সূচি একটি বইয়ের মানচিত্র। পুরনো বইগুলো ইচ্ছে করে তাদের জ্ঞান লুকিয়েছিল, তাই সূচিই সেই চাবি যা সেগুলো খোলে। বইগুলো তাদের নিজেদের সূচি সম্পর্কে কী বলে, আমি এখানে জড়ো করেছি।',
    'tools.data.alAsrarIntro.library':
      'পুরনো বইগুলো খোলা তাকে রাখা হতো না। সেগুলো লুকানো হতো, পুঁতে রাখা হতো, সিন্দুকে বন্ধ করা হতো আর গোপনে হাত বদল হতো। এই পাতা জড়ো করে বইগুলো এমন বইয়ের লাইব্রেরি রাখা সম্পর্কে কী বলে।',
    'tools.data.alAsrarIntro.atlas':
      'অ্যাটলাস একটি মানচিত্র। কিন্তু এই অ্যাটলাস ভূমির মানচিত্র নয়। এটি আকাশ, গোলক আর সেই অক্ষরগুলোর মানচিত্র যা সেগুলো শাসন করে। পুরনো বইগুলো আকাশ কীভাবে আঁকে, এই রইল।',
    'tools.data.alAsrarIntro.qalam':
      'কলম মানে একটি কলম। কিন্তু এই বইগুলোতে কলম আমার ডেস্কের কলম নয়। এটি প্রথম জিনিস যা আল্লাহ সৃষ্টি করেছেন, আর প্রথম জিনিস যা লিখেছে। কলম সম্পর্কে বইগুলো কী বলে, এই রইল।',
    'tools.data.alAsrarIntro.khatam':
      'খাতাম মানে একটি সিল। সিল চিঠি বন্ধ করে আর প্রমাণ করে কে পাঠিয়েছে। পুরনো বইয়ে সিল একটি শক্তিও, আর সুলাইমান তার মালিক। সিল সম্পর্কে বইগুলো কী বলে, এই রইল।',
    'tools.data.alAsrarIntro.plate':
      'প্লেট ধাতুর একটি সমতল পাত, আকৃতি বহন করার জন্য বানানো। সোনা, রুপা, তামা, লোহা আর সিসা. প্রত্যেকের নিজের কাজ আছে। প্রতিটি প্লেট সম্পর্কে বইগুলো কী বলে, আমি এখানে জড়ো করেছি।',
    'tools.data.alAsrarIntro.works':
      'কাজ একটি বাস্তব আমল, শৃঙ্খলার সাথে আর আল্লাহকে মনে রেখে করা হয়। বইগুলো কাজ কী, তার কী দরকার, আর জ্ঞান আর আমল কীভাবে একসাথে থাকে সে সম্পর্কে কী বলে, আমি জড়ো করেছি। এই রইল, বইগুলো থেকেই।',
    'tools.data.alAsrarIntro.bakhur-adad':
      'বাখুর আর আদাদ একটি তালিকা, এর বেশি কিছু নয়। এটি সুগন্ধি জিনিস আর সংখ্যার কাজের নাম দেয়, প্রতিটির উৎস আর পাতাসহ, যাতে পাঠক এন্ট্রিগুলো গুনতে পারে আর প্রতিটি খুঁজে দেখতে পারে। এটি কখনো পরিমাণ, তৈরি বা রেসিপি দেয় না।',
    'tools.data.alAsrarIntro.shurut':
      'শুরুত হলো শর্ত। শর্তের বাইরে করা কাজ ভুল করা কাজ। বইগুলো যে শর্তগুলো বলে, আমি জড়ো করেছি, প্রতিটি তার উৎস আর পাতাসহ, যাতে পাঠক একে একে সেগুলো যাচাই করতে পারে।',
    'tools.data.alAsrarIntro.glossary':
      'শব্দকোষ এই অংশে ব্যবহৃত শব্দগুলো সহজ কথায় ব্যাখ্যা করে। এগুলো এখন পর্যন্ত জড়ো করা শব্দ, প্রতিটি তার উৎস আর পাতাসহ। পুরো টেবিল এখনো নোটবুক থেকে জড়ো করা হচ্ছে, আর এখানে আরও শব্দ যোগ হবে।',

    // ---- Data: talisman figures ----
    'tools.data.figureTitle.mutakabbir': 'আল-মুতাকাব্বিরের স্কয়ার, 4 by 4',
    'tools.data.figureCaption.mutakabbir':
      'বই থেকে সংখ্যার একটি স্কয়ার। বই এই সংখ্যাগুলো যেমন আছে তেমনই দেয়। আমরা সেগুলো এখানে ঠিক যেমন লেখা আছে তেমনই আঁকি।',
    'tools.data.figureNote.mutakabbir':
      'এই গ্রিড ম্যাজিক স্কয়ার হিসেবে যাচাই হয় না। সারিগুলোর যোগফল 206, 183, 198 আর 206। 56 সংখ্যাটি দুইবার আসে। আমরা এটাকে দেখাই যেমন বইয়ে আছে। আমরা এটাকে ঠিক করি না।',
    'tools.data.figureTitle.jabbar': 'আল-জাব্বারের স্কয়ার, 5 by 5',
    'tools.data.figureCaption.jabbar':
      'বই এই স্কয়ারের সংখ্যা দেয়, গ্রিড নয়। আমরা শুধু সেটাই দেখাই যা বই দেয়।',
    'tools.data.figureNote.jabbar': 'গ্রিড নিজে হাতে নেই। আমরা ঘরগুলো আন্দাজ করি না।',
    'tools.data.figureTitle.solomon-triangle': 'সুলাইমান ত্রিভুজ ওয়াফক, 3 by 3',
    'tools.data.figureCaption.solomon-triangle':
      'নয়টি সংখ্যার একটি ছোট স্কয়ার। প্রতিটি সারি, প্রতিটি কলাম আর প্রতিটি কর্ণের যোগফল 15।',
    'tools.data.figureTitle.fatiha-wafqs': 'আল-ফাতিহার বাদ দেওয়া অক্ষরের সাতটি ওয়াফক',
    'tools.data.figureCaption.fatiha-wafqs':
      'বই বলে আল-ফাতিহার প্রতিটি বাদ দেওয়া অক্ষরের জন্য একটি সপ্তগুণ ওয়াফক আছে। নিয়মটি এখানে বলা হয়েছে। কোনো গ্রিড আঁকা হয়নি।',
    'tools.data.figureNote.fatiha-wafqs': 'গ্রিডগুলো হাতে নেই। যা আমাদের কাছে নেই, তা আমরা আঁকি না।',
    'tools.data.figureTitle.seven-seals': 'সাত দিনের জন্য সাতটি সিল',
    'tools.data.figureCaption.seven-seals':
      'বই এই লাইন দিয়ে অধ্যায় খোলে। সাত দিনের জন্য সাতটি সিলের রূপ। নিচের সাতটি চিহ্ন সেই গ্রাফিক চিহ্ন যা সিলগুলোর ভিতরে পাওয়া গেছে।',
    'tools.data.figureNote.seven-seals':
      'বইয়ে সিলগুলো সংখ্যা আর হাতে আঁকা চিহ্নসহ 4 by 4-এর সাতটি গ্রিড। গ্রিডগুলো বইয়ে হাতে আঁকা। সেগুলো এখানে লেখা হয়নি। শুধু সাতটি চিহ্ন আঁকা হয়েছে।',

    // ---- Data: Sawaqit name glosses ----
    'tools.data.sawaqitGloss.fard': 'যিনি এক, যিনি একক',
    'tools.data.sawaqitGloss.jabbar': 'যিনি বাধ্য করেন, যিনি পুনরুদ্ধার করেন',
    'tools.data.sawaqitGloss.shahid': 'যিনি সাক্ষী',
    'tools.data.sawaqitGloss.thabit': 'যিনি দৃঢ়, যিনি স্থির',
    'tools.data.sawaqitGloss.zahir': 'যিনি প্রকাশ্য, যিনি সাহায্যকারী',
    'tools.data.sawaqitGloss.khabir': 'যিনি সব জানেন',
    'tools.data.sawaqitGloss.zaki': 'যিনি পবিত্র',

    // ---- Data: plate metals ----
    'tools.data.metal.gold': 'সোনা',
    'tools.data.metal.silver': 'রুপা',
    'tools.data.metal.iron': 'লোহা',
    'tools.data.metal.quicksilver': 'পারদ',
    'tools.data.metal.lead': 'সিসা',
    'tools.forge.reasonOrderUnsupported': 'অর্ডার {order} সমর্থিত নয়। শুধু অর্ডার 3 থেকে 20, আর অর্ডার 2-এর কোনো ম্যাজিক স্কয়ার হয়ই না।',
    'tools.forge.reasonNoConstruction': 'অর্ডার {order}-এর জন্য কোনো লেখা কনস্ট্রাকশন implement করা হয়নি, তাই কোনো স্কয়ার বানানো হয় না।',
    'tools.forge.reasonTargetNotWhole': 'টার্গেট যোগফল একটি পূর্ণ ধনাত্মক সংখ্যা হতে হবে।',
    'tools.forge.reasonUnreachable': 'টার্গেট {target}-কে {order}x{order} স্কয়ারের জন্য মেলানো যায় না। বেস স্কয়ারের যোগফল {base}, আর প্রতিটি ঘরকে একই পূর্ণসংখ্যা দিয়ে সরালে প্রতিটি লাইন {order}-এর গুণিতকে বদলায়, তাই {target} এভাবে মেলানো যায় না। এমন টার্গেট বেছে নিন যা {base} থেকে {order}-এর গুণিতকে আলাদা।',
    'tools.forge.reasonBelowBase': 'টার্গেট {target}, {order}x{order} স্কয়ারের জন্য বেস যোগফল {base}-এর নিচে। এটাকে মেলাতে {offset}-এর shift দরকার হতো, যাতে সবচেয়ে ছোট ঘরটি শূন্য বা ঋণাত্মক হয়ে যেত। এভাবে শুধু {base} বা তার বেশি টার্গেটই বানানো যায়।',
    'tools.forge.failNotSquare': 'গ্রিডটি বর্গাকার নয়: প্রতিটি সারিতে ততগুলো ঘর থাকতে হবে যতগুলো সারি আছে।',
    'tools.forge.failCell': 'সারি {r}, কলাম {c}-এর ঘরটি ধনাত্মক পূর্ণসংখ্যা নয়।',
    'tools.forge.failRepeated': '{value} সংখ্যাটি একবারের বেশি এসেছে।',
    'tools.forge.failRow': 'সারি {n}-এর যোগফল {sum}, {target} নয়।',
    'tools.forge.failColumn': 'কলাম {n}-এর যোগফল {sum}, {target} নয়।',
    'tools.forge.failDiag1': 'কর্ণের (উপর-বাম থেকে নিচে-ডান) যোগফল {sum}, {target} নয়।',
    'tools.forge.failDiag2': 'কর্ণের (উপর-ডান থেকে নিচে-বাম) যোগফল {sum}, {target} নয়।',
    'tools.forge.failSomeNotWhole': 'কিছু ঘর ধনাত্মক পূর্ণসংখ্যা নয়।',
    'tools.forge.failNotDistinct': 'সব সংখ্যা আলাদা নয়।',
  },
  ur: {
    'tools.common.system': 'نظام',
    'tools.common.school': 'مکتب',
    'tools.common.kabir': 'کبیر (بڑا)',
    'tools.common.saghir': 'صغیر (چھوٹا)',
    'tools.common.mashriqi': 'مشرقی (مشرق کا)',
    'tools.common.maghribi': 'مغربی (مغرب کا)',
    'tools.common.save': 'محفوظ کریں',
    'tools.common.savedToGrimoire': 'Grimoire میں محفوظ ہو گیا',
    'tools.common.total': 'کل',
    'tools.common.grandTotal': 'پورا کل',
    'tools.common.runningTotal': 'چلتا ہوا کل',
    'tools.common.value': 'عدد',
    'tools.common.letter': 'حرف',
    'tools.common.name': 'نام',
    'tools.common.word': 'لفظ',
    'tools.common.sayIt': 'اس طرح کہیں',
    'tools.common.search': 'تلاش کریں',
    'tools.common.closeSearch': 'تلاش بند کریں',
    'tools.common.cancel': 'منسوخ کریں',
    'tools.common.add': 'شامل کریں',
    'tools.common.exportJson': 'JSON ایکسپورٹ کریں',
    'tools.common.importJson': 'JSON امپورٹ کریں',
    'tools.common.copied': 'نقل ہو گیا',
    'tools.common.untitledNote': 'بے عنوان نوٹ',
    'tools.common.source': 'ماخذ',
    'tools.common.sources': 'ماخذ',
    'tools.common.day': 'دن',
    'tools.common.night': 'رات',
    'tools.common.yes': 'ہاں',
    'tools.common.no': 'نہیں',
    'tools.common.all': 'سب',
    'tools.common.noMatchesFor': '“{q}” سے کچھ نہیں ملا۔',
    'tools.common.importFail': 'وہ فائل امپورٹ نہیں ہو سکی۔',
    'tools.common.readFail': 'وہ فائل پڑھی نہیں جا سکی۔',
    'tools.hub.title': 'مطالعے کے ٹولز',
    'tools.hub.eyebrow': 'مطالعے کے ٹولز',
    'tools.hub.subtitle': 'حروف، اعداد اور آپ کے اپنے پڑھنے کے نوٹس کے لیے چھوٹے ٹولز۔ یہاں کچھ بھی کسی نتیجے کا وعدہ نہیں کرتا، یہ سب مطالعے کے لیے ہے۔',
    'tools.hub.topicsTitle': 'موضوعات',
    'tools.layout.back': 'مطالعے کے ٹولز',
    'tools.layout.search': 'تلاش کریں',
    'tools.layout.searchAria': 'ٹولز تلاش کریں (Ctrl+K)',
    'tools.layout.defaultEyebrow': 'مطالعے کے ٹولز',
    'tools.disclaimer.text': 'یہ ٹولز صرف مطالعے اور حساب کے لیے ہیں۔ یہ کسی نتیجے، حفاظت، شفا یا رزق کا وعدہ نہیں کرتے۔ انہیں کبھی کسی کو نقصان پہنچانے کے لیے استعمال نہ کریں۔',
    'tools.disclaimer.link': 'یہ ٹولز کیسے کام کرتے ہیں',
    'tools.search.placeholder': 'ٹولز، موضوعات اور 99 نام تلاش کریں…',
    'tools.search.aria': 'ٹولز، موضوعات اور 99 نام تلاش کریں',
    'tools.search.dialogLabel': 'مطالعے کے ٹولز تلاش کریں',
    'tools.search.hint': '“letters” ، “counter” ، “notes” ، “Malakut” ، یا کوئی نام جیسے “Rahman” آزمائیں۔',
    'tools.shell.emptyTitle': 'یہاں ابھی کچھ نہیں',
    'tools.shell.emptyMessage': 'یہاں ابھی کچھ نہیں، اندراج صرف اس مواد سے شامل کیے جاتے ہیں جو ماخذ، صفحہ اور اجازت کی بات کے ساتھ دیا گیا ہو۔',
    'tools.shell.aria.figureEntries': 'شکل کے اندراج',
    'tools.shell.aria.formEntries': 'فارم کے اندراج',
    'tools.shell.aria.sealEntries': 'مہر کے اندراج',
    'tools.shell.aria.records': 'ریکارڈ',
    'tools.shell.aria.entries': 'اندراج',
    'tools.shell.aria.monograph': 'مونوگراف',
    'tools.shell.aria.courseEntries': 'کورس کے اندراج',
    'tools.shell.aria.indexResults': 'انڈیکس کے نتائج',
    'tools.shell.aria.libraryEntries': 'لائبریری کے اندراج',
    'tools.shell.aria.atlasEntries': 'اٹلس کے اندراج',
    'tools.shell.aboutSection': 'اس حصے کے بارے میں',
    'tools.shell.entriesOne': '1 اندراج، ہر ایک کا ماخذ بتایا گیا۔',
    'tools.shell.entriesMany': '{n} اندراج، ہر ایک کا ماخذ بتایا گیا۔',
    'tools.shell.noEntriesMatch': 'اس فلٹر سے کوئی اندراج نہیں ملتا۔',
    'tools.figures.studyOnly': 'یہ شکلیں صرف مطالعے کے لیے ہیں۔ یہ کسی نتیجے کا وعدہ نہیں کرتیں۔ یہ کوئی دینی حکم نہیں دیتیں۔ آہستہ پڑھیں اور بتائے گئے ماخذ کو جانچیں۔',
    'tools.huruf.title': 'Huruf — حروف اور اعداد',
    'tools.huruf.eyebrow': 'حروف اور اعداد',
    'tools.huruf.subtitle': '28 عربی حروف اور ان کی ابجد قیمتیں۔ نظام اور مکتب چنیں؛ جدول بدل جائے گا۔',
    'tools.huruf.thLetter': 'حرف',
    'tools.huruf.thName': 'نام',
    'tools.huruf.thValue': 'عدد',
    'tools.huruf.tableNote':
      'جدول: معیاری ابجد قیمتیں (مشرقی/مغربی)۔ کبیر پوری قیمت ہے؛ صغیر وہی قیمت جو ایک ہندسے تک کم کر دی گئی ہو۔ قیمتیں Wikipedia کے “Abjad numerals” اور OpenArabic اور WiserWork کے ابجد کیلکولیٹر سے جانچی گئی ہیں، دونوں مکاتب 22 حروف پر متفق ہیں اور چھ حروف پر مختلف ہیں (sad, dad, sin, shin, za, ghayn)۔',
    'tools.huruf.howCounted': 'حروف کیسے گنے جاتے ہیں',
    'tools.huruf.mappingsTitle': 'وہ نقشے جو ابھی نہیں دکھائے جاتے',
    'tools.huruf.elementGroups': 'عنصری گروہ',
    'tools.huruf.luminous': 'نورانی اور تاریک حروف',
    'tools.huruf.planetLinks': 'حرف سے سیارے کا تعلق',
    'tools.huruf.sourceNeeded': 'ماخذ چاہیے، اس نقشے کے لیے ابھی کوئی ماخذ نہیں بتایا گیا۔',
    'tools.asma.title': 'Asma — 99 نام',
    'tools.asma.eyebrow': '99 نام',
    'tools.asma.subtitle': 'ناموں کو عربی، لاطینی یا معنی سے تلاش کریں۔ قیمتیں پہلے سے کبیر مشرقی پر ہیں، نیچے نظام یا مکتب بدلیں تو وہ دوبارہ گنی جائیں گی۔',
    'tools.asma.reckonTitle': 'نام کا حساب لگائیں',
    'tools.asma.reckonLabel': 'کوئی بھی نام یا متن لکھیں',
    'tools.asma.reckonPlaceholder': 'مثلاً Rahman',
    'tools.asma.noArabic': 'اس متن میں کوئی عربی حرف نہیں ملا۔',
    'tools.asma.searchPlaceholder': 'عربی، لاطینی یا معنی سے تلاش کریں…',
    'tools.asma.searchAria': '99 نام تلاش کریں',
    'tools.asma.noNames': '“{q}” سے کوئی نام نہیں ملتا۔',
    'tools.asma.bare': 'بغیر "al-"',
    'tools.asma.withAl': '“al-” کے ساتھ',
    'tools.asma.saveAria': '{name} کو Grimoire میں محفوظ کریں',
    'tools.asma.sourceNote': 'فہرست Ar-Rahman سے As-Sabur تک چلتی ہے؛ اللہ کا اپنا نام یہاں ننانوے میں نہیں گنا گیا۔',
    'tools.bast.title': 'Bast — متن کو کھولیں',
    'tools.bast.eyebrow': 'متن کو کھولیں',
    'tools.bast.subtitle': 'کوئی بھی متن لکھیں اور اسے حرف بہ حرف کھلا ہوا دیکھیں، ہر حرف کی قیمت اور چلتے ہوئے کل کے ساتھ۔',
    'tools.bast.yourText': 'آپ کا متن',
    'tools.bast.placeholder': 'یہاں عربی متن لکھیں…',
    'tools.bast.countedAs': 'اس طرح گنا گیا:',
    'tools.bast.empty': 'ابھی کھولنے کو کچھ نہیں۔ اوپر کچھ متن لکھیں، یا مثال آزمائیں۔',
    'tools.bast.tryExample': 'مثال آزمائیں:',
    'tools.bast.thHash': '#',
    'tools.bast.thLetter': 'حرف',
    'tools.bast.thKabir': 'کبیر',
    'tools.bast.thSaghir': 'صغیر',
    'tools.bast.thRunning': 'چلتا ہوا کل',
    'tools.bast.saveUnfolding': 'اس کھولے ہوئے متن کو Grimoire میں محفوظ کریں',
    'tools.bast.howCounted': 'متن کیسے گنا جاتا ہے',
    'tools.fawatih.title': 'Fawatih (شروع کے حروف)',
    'tools.fawatih.eyebrow': 'حروف اور اعداد',
    'tools.fawatih.subtitle': 'چودہ حرفی شکلیں انتیس سورتوں کو کھولتی ہیں۔ نیچے والی شکلیں ہر سورت کی پہلی آیت پر اصول چلا کر ملی ہیں۔ یہ متن سے گنی گئی ہیں، لکھی نہیں گئی۔',
    'tools.fawatih.summary': '{total} سورتیں جدا جدا حروف سے کھلتی ہیں، {forms} الگ شکلوں میں۔ نظام اور مکتب چنیں؛ قیمتیں بدل جائیں گی۔ “Say it” والا کالم ہر شکل کو لاطینی حروف میں پڑھ کر بتاتا ہے، تاکہ آپ عربی جانے بغیر اسے پڑھ سکیں۔',
    'tools.fawatih.thForm': 'شکل',
    'tools.fawatih.thSayIt': 'اس طرح کہیں',
    'tools.fawatih.thSurahs': 'جن سورتوں کو کھولتی ہے',
    'tools.fawatih.thValue': 'عدد',
    'tools.fawatih.howFound': 'یہ کیسے ملیں',
    'tools.fawatih.howFoundBody':
      'یہاں استعمال ہونے والا قرآن کا متن مکمل اعراب والا ہے: ہر عام لفظ پر حرکات لگی ہیں۔ جو لفظ شروع میں بغیر کسی حرکت کے ہو وہ الگ نظر آتا ہے۔ اس پر صرف مد کا نشان (maddah) ہو سکتا ہے، یا کوئی نشان نہیں۔ اور وہ ایک سے پانچ حروف کا ہوتا ہے۔ اصول یہ ہے: ہر سورت کی پہلی آیت کا پہلا لفظ لیں (بسم اللہ کے بعد، جہاں بسم اللہ شروع میں ہے اور آیت نہیں)، اور اسے صرف اسی صورت میں رکھیں جب وہ ایسا سادہ لفظ ہو۔ اس اصول سے بالکل 29 سورتیں اور 14 شکلیں ملتی ہیں۔ عام پہلے لفظ، جیسے سورت 71 میں “inna” یا سورت 75 میں “la”، حرکات والے ہیں اور نہیں لیے جاتے۔ سورت 42 وہ واحد جگہ ہے جہاں حروف دو آیتوں میں چلتے ہیں: Ha Mim آیت 1 کو کھولتی ہے، اور Ayn Sin Qaf پوری آیت 2 ہے۔',
    'tools.fawatih.basmalahBody': 'بسم اللہ سورت الفاتحہ کی آیت 1 ہے، اس لیے وہ اس سورت کے متن میں رہتی ہے۔ دوسری سورتوں کے لیے وہ چھپے ہوئے متن میں شروع میں ہے، آیت نہیں، اس لیے اصول پہلے اسے ہٹا دیتا ہے۔',
    'tools.fawatih.notSay': 'یہ صفحہ کیا نہیں کہتا',
    'tools.fawatih.notSayBody': 'یہ صفحہ بتاتا ہے کہ کون سے حروف کن سورتوں کو کھولتے ہیں اور ان حروف کا جوڑ کیا ہے۔ یہ نہیں بتاتا کہ ان حروف کا مطلب کیا ہے۔ ابھی کسی تفسیر کا کوئی ماخذ نہیں بتایا گیا، اس لیے کوئی تفسیر نہیں دی گئی۔ شکلیں ویسے ہی دکھائی گئی ہیں جیسے وہ سورتوں کے شروع میں آتی ہیں، اس سے زیادہ کچھ نہیں۔',
    'tools.fawatih.sourceTail': 'شکلیں اور قیمتیں اسی متن سے چلتے وقت گنی جاتی ہیں؛ ٹیسٹ جانچتے ہیں کہ نتیجہ 14 شکلوں میں 29 سورتیں ہے، اوپر دکھائے گئے نقشے کے ساتھ۔',
    'tools.sawaqit.title': 'Sawaqit (سات غائب حروف)',
    'tools.sawaqit.eyebrow': 'حروف اور اعداد',
    'tools.sawaqit.subtitle': 'حروف تہجی کے سات حروف الفاتحہ میں کہیں نہیں آتے۔ نیچے والے حروف یہ گن کر ملے ہیں کہ فاتحہ کن حروف کو استعمال کرتی ہے۔ یہ متن سے گنے گئے ہیں، لکھے نہیں گئے۔',
    'tools.sawaqit.textCounted': 'گنا گیا متن',
    'tools.sawaqit.textCountedBody': 'الفاتحہ، قرآن 1:1–7۔ پوری سورت، بسم اللہ سمیت، جو اس کی پہلی آیت ہے۔ اس میں 29 الفاظ اور عثمانی متن کے مطابق 139 حروف ہیں۔ عربی کے نیچے لاطینی سطریں اسے پڑھ کر بتاتی ہیں، تاکہ آپ عربی جانے بغیر اس کا ساتھ دے سکیں۔',
    'tools.sawaqit.lettersUsed': 'وہ 21 حروف جو فاتحہ استعمال کرتی ہے',
    'tools.sawaqit.lettersUsedBody': 'ابجد کی ترتیب سے۔ حروف تہجی کا ہر دوسرا حرف سورت میں کم از کم ایک بار آتا ہے۔',
    'tools.sawaqit.thAbsent': 'غائب حرف',
    'tools.sawaqit.thName': 'نام',
    'tools.sawaqit.thValue': 'عدد',
    'tools.sawaqit.footerTotal': 'سات غائب حروف ایک ساتھ',
    'tools.sawaqit.sumsBody': 'سات غائب حروف کا جوڑ کبیر مشرقی میں 2,390 اور کبیر مغربی میں 2,990 ہے۔ فرق حرف شین کا ہے: مشرقی جدول میں 300، مغربی جدول میں 1,000۔',
    'tools.sawaqit.namesTitle': 'سات حروف کے نام',
    'tools.sawaqit.namesBody': 'کتابیں ہر غائب حرف کے لیے اللہ کا ایک نام دیتی ہیں۔ سات نام، اسی ترتیب سے جس میں کتابیں دیتی ہیں، یہ ہیں: Fa, Jim, Shin, Tha, Za, Kha, Zay۔ انہیں پہلی آوازوں سے یاد رکھیں: Fa-Ja-Sha-Tha-Za-Kha-Za۔ جو دو حروف “z” جیسے لگتے ہیں وہ الگ حروف ہیں: Za’ (ظ) اور Zay (ز)۔',
    'tools.sawaqit.thLetter': 'حرف',
    'tools.sawaqit.thName2': 'نام',
    'tools.sawaqit.thAlso': 'اس طرح بھی دیا گیا',
    'tools.sawaqit.sourceTail': 'گنتی اسی متن سے چلتے وقت گنی جاتی ہے؛ ٹیسٹ جانچتے ہیں کہ نتیجہ اوپر دکھائے گئے سات حروف ہیں۔',
    'tools.shields.title': 'Shields (چلتے ہوئے حرفی جوڑ)',
    'tools.shields.eyebrow': 'حروف اور اعداد',
    'tools.shields.subtitle': 'پانچ چھوٹے متن، لفظ بہ لفظ گنے گئے۔ ہر قطار ایک لفظ، اس کی قیمت، اور چلتا ہوا کل دکھاتی ہے، تاکہ آپ پورے کل تک حساب کا ساتھ دے سکیں۔',
    'tools.shields.spellingTitle': 'ہجے پر ایک بات',
    'tools.shields.spellingBody1': 'کل عثمانی متن کے مطابق گنے گئے ہیں، شد سمیت: شد اپنے حرف کو دوگنا کر دیتی ہے، اس لیے al-Rahman یہاں 529 گنا جاتا ہے، جبکہ شد کے بغیر سادہ ہجے Asma والے صفحے پر 329 گنتا ہے۔ دونوں میں گنتی کے اصول ایک ہی ہیں۔ فرق متن کے ہجے کا ہے، اصول کا نہیں۔ بسم اللہ الفاتحہ کی آیت 1 ہے، اس لیے وہ فاتحہ میں گنی جاتی ہے۔ الاخلاص، الفلق اور الناس کے لیے بسم اللہ ان سورتوں کی آیت نہیں، اس لیے وہ ان میں نہیں گنی جاتی۔',
    'tools.shields.spellingBody2': 'لاطینی سطریں ہر متن کو پڑھ کر بتاتی ہیں، تاکہ آپ عربی جانے بغیر اس کا ساتھ دے سکیں۔ اس پڑھنے میں AA حرف عین ہے، اور th حرف ثا ہے۔ “al” کا l شمسی حروف سے پہلے بھی لکھا رہتا ہے، اس لیے ar-Rahman کو alrrahman پڑھا جاتا ہے۔',
    'tools.shields.thHash': '#',
    'tools.shields.thWord': 'لفظ',
    'tools.shields.thSayIt': 'اس طرح کہیں',
    'tools.shields.thValue': 'عدد',
    'tools.shields.thRunning': 'چلتا ہوا کل',
    'tools.shields.grandTotalWords': 'پورا کل ({n} الفاظ)',
    'tools.shields.saveTotal': 'اس کل کو Grimoire میں محفوظ کریں',
    'tools.shields.sourceTail': 'کل اسی متن سے چلتے وقت گنے جاتے ہیں؛ ٹیسٹ دونوں نظاموں اور دونوں مکاتب میں پانچوں کل جانچتے ہیں۔',
    'tools.journal.title': 'Journal — پڑھنے کے نوٹس',
    'tools.journal.eyebrow': 'پڑھنے کے نوٹس',
    'tools.journal.subtitle': 'جو پڑھا اس پر نوٹس، صرف اسی ڈیوائس پر۔',
    'tools.journal.deviceNote': 'جو کچھ آپ یہاں لکھتے ہیں وہ اسی ڈیوائس پر رہتا ہے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.journal.editNote': 'نوٹ بدلیں',
    'tools.journal.newNote': 'نیا نوٹ',
    'tools.journal.titleLabel': 'عنوان',
    'tools.journal.titlePlaceholder': 'یہ نوٹ کس بارے میں ہے؟',
    'tools.journal.noteLabel': 'نوٹ',
    'tools.journal.notePlaceholder': 'جو سیکھا وہ لکھیں، جو سوال ہیں وہ لکھیں، یا کوئی قول جو یاد رکھنا چاہتے ہیں…',
    'tools.journal.addNote': 'نوٹ شامل کریں',
    'tools.journal.saveChanges': 'تبدیلیاں محفوظ کریں',
    'tools.journal.importAria': 'جرنل کی JSON فائل امپورٹ کریں',
    'tools.journal.empty': 'ابھی کوئی نوٹ نہیں۔ اوپر اپنا پہلا نوٹ شامل کریں۔',
    'tools.journal.editAria': '{title} بدلیں',
    'tools.journal.deleteAria': '{title} حذف کریں',
    'tools.journal.edited': 'بدلا گیا {date}',
    'tools.journal.emptySubmit': 'پہلے عنوان یا کچھ متن لکھیں',
    'tools.journal.updated': 'نوٹ بدل دیا گیا',
    'tools.journal.added': 'نوٹ شامل کر دیا گیا',
    'tools.journal.deleted': 'نوٹ حذف کر دیا گیا',
    'tools.journal.exported': 'جرنل ایکسپورٹ ہو گیا',
    'tools.journal.importedOne': '1 نوٹ امپورٹ ہوا',
    'tools.journal.importedMany': '{n} نوٹ امپورٹ ہوئے',
    'tools.wird.title': 'Wird — ذکر کا کاؤنٹر',
    'tools.wird.eyebrow': 'ذکر کا کاؤنٹر',
    'tools.wird.subtitle': 'ایک سادہ کاؤنٹر۔ کوئی جملہ چنیں، بڑا بٹن دبائیں، اور چاہیں تو ہدف لگائیں۔',
    'tools.wird.deviceNote': 'جو کچھ آپ یہاں گنتے ہیں وہ اسی ڈیوائس پر رہتا ہے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.wird.choosePhrase': 'جملہ چنیں',
    'tools.wird.addPhraseLabel': 'اپنا جملہ شامل کریں',
    'tools.wird.addPhrasePlaceholder': 'اپنا جملہ شامل کریں…',
    'tools.wird.addAria': 'جملہ شامل کریں',
    'tools.wird.ofTarget': '{count} از {target} · {progress}%',
    'tools.wird.progressAria': '{target} کی طرف پیش رفت',
    'tools.wird.tapBtn': 'گنتی کے لیے دبائیں',
    'tools.wird.countAria': '{phrase} کے لیے ایک گنیں',
    'tools.wird.targetLabel': 'ہدف',
    'tools.wird.resetPhrase': 'اس جملے کو ری سیٹ کریں',
    'tools.wird.resetAll': 'سب ری سیٹ کریں',
    'tools.wird.resetPhraseToast': '{phrase} ری سیٹ ہو گیا',
    'tools.wird.resetAllToast': 'تمام گنتی ری سیٹ ہو گئی',
    'tools.wird.phraseAdded': 'جملہ شامل کر دیا گیا',
    'tools.grimoire.title': 'Grimoire — محفوظ چیزیں',
    'tools.grimoire.eyebrow': 'محفوظ چیزیں',
    'tools.grimoire.subtitle': 'دوسرے ٹولز سے محفوظ کیے گئے نام، کھلے ہوئے متن اور نوٹس، سب ایک جگہ۔',
    'tools.grimoire.deviceNote': 'جو کچھ آپ یہاں محفوظ کرتے ہیں وہ اسی ڈیوائس پر رہتا ہے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.grimoire.addNoteTitle': 'نوٹ شامل کریں',
    'tools.grimoire.titleLabel': 'عنوان',
    'tools.grimoire.titlePlaceholder': 'یہ کس بارے میں ہے؟',
    'tools.grimoire.detailLabel': 'تفصیل',
    'tools.grimoire.detailPlaceholder': 'جو تفصیل رکھنا چاہتے ہیں وہ لکھیں…',
    'tools.grimoire.saveNote': 'نوٹ محفوظ کریں',
    'tools.grimoire.importAria': 'Grimoire کی JSON فائل امپورٹ کریں',
    'tools.grimoire.empty': 'ابھی کچھ محفوظ نہیں۔ Asma والے صفحے سے کوئی نام محفوظ کریں، Bast والے صفحے سے کوئی کھلا ہوا متن، یا اوپر نوٹ شامل کریں۔',
    'tools.grimoire.kindName': 'نام',
    'tools.grimoire.kindBast': 'کھلا ہوا متن',
    'tools.grimoire.kindNote': 'نوٹ',
    'tools.grimoire.deleteAria': '{title} حذف کریں',
    'tools.grimoire.emptySubmit': 'پہلے عنوان یا کچھ تفصیل لکھیں',
    'tools.grimoire.saved': 'نوٹ Grimoire میں محفوظ ہو گیا',
    'tools.grimoire.deleted': 'چیز حذف کر دی گئی',
    'tools.grimoire.exported': 'Grimoire ایکسپورٹ ہو گیا',
    'tools.grimoire.importedOne': '1 چیز امپورٹ ہوئی',
    'tools.grimoire.importedMany': '{n} چیزیں امپورٹ ہوئیں',
    'tools.today.title': 'آج',
    'tools.today.eyebrow': 'وقت اور آسمان',
    'tools.today.subtitle': 'آج کے دن کی باتیں: تاریخ، دن کا حاکم، اور جس سیارہ گھڑی میں ابھی ہیں۔',
    'tools.today.hijriLabel': 'ہجری تاریخ (تقریبی):',
    'tools.today.hijriApprox': 'یہ تاریخ تقریبی ہے، یہ شہری کیلنڈر ہے، چاند دیکھ کر طے ہونے والی تاریخ نہیں۔',
    'tools.today.rulerTitle': 'آج کا حاکم',
    'tools.today.rulerBodyA': 'اس دن کی پہلی گھڑی پر حکومت کرتا ہے، اس لیے وہ دن کا حاکم ہے۔ دن طلوع سے گنا جاتا ہے: طلوع سے ذرا پہلے کا لمحہ پچھلے دن کا ہوتا ہے۔',
    'tools.today.dayRulersNote': 'دن کے حاکم: اتوار سورج، پیر چاند، منگل مریخ، بدھ عطارد، جمعرات مشتری، جمعہ زہرہ، ہفتہ زحل۔ ماخذ: Wikipedia، “Planetary hours”۔',
    'tools.today.currentTitle': 'موجودہ گھڑی',
    'tools.today.hourLineA': '24 میں سے گھڑی {n} ({dayNight} والی گھڑی)، حاکم',
    'tools.today.approxNote': 'تقریبی ہے، اصلی گھڑیاں نہیں، کوئی جگہ سیٹ نہیں ہے، اس لیے یہ گھڑیاں 06:00–18:00 کی مقررہ تقسیم سے بنتی ہیں۔ اصلی گھڑیوں کے لیے Planetary Hours والے صفحے پر جگہ سیٹ کریں۔',
    'tools.today.realNote': '{label} کی اصلی گھڑیاں۔ گھڑیاں برابر نہیں: دن کی ہر گھڑی طلوع سے غروب کا بارہواں حصہ ہے، رات کی ہر گھڑی غروب سے اگلے طلوع کا بارہواں حصہ ہے۔',
    'tools.today.unavailable': 'اس جگہ اور دن کے لیے سیارہ گھڑیاں دستیاب نہیں: {reason}',
    'tools.today.defaultReason': 'اس جگہ اور دن کے لیے طلوع یا غروب معلوم نہیں ہو سکا۔',
    'tools.today.yourSavedLocation': 'آپ کی محفوظ جگہ',
    'tools.today.locationLine': 'جگہ: {label} ({lat}، {lon}، {tz})۔',
    'tools.today.noLocation': 'کوئی جگہ سیٹ نہیں ہے۔ وقت ڈیوائس کے ٹائم زون اور 06:00–18:00 کی تقریبی تقسیم سے بنتا ہے۔ Planetary Hours والے صفحے پر جگہ سیٹ کریں۔',
    'tools.today.locationTail': 'کچھ بھی کہیں نہیں بھیجا جاتا، جگہ صرف اسی ڈیوائس پر محفوظ ہے۔ یہاں نماز کے وقت نہیں ہیں۔',
    'tools.hours.title': 'سیارہ گھڑیاں',
    'tools.hours.eyebrow': 'وقت اور آسمان',
    'tools.hours.subtitle': 'دن کی 24 گھڑیاں، ہر ایک پر کلدانی ترتیب سے ایک سیارے کی حکومت۔ دن کی گھڑیاں طلوع سے غروب تک، رات کی گھڑیاں غروب سے اگلے طلوع تک، اس لیے گھڑیاں برابر نہیں۔',
    'tools.hours.locationTitle': 'جگہ',
    'tools.hours.usingLocation': '{label} استعمال ہو رہی ہے ({lat}، {lon}، {tz})۔',
    'tools.hours.noLocation': 'کوئی جگہ سیٹ نہیں ہے۔ نیچے والی گھڑیاں 06:00–18:00 کی مقررہ تقسیم سے بنتی ہیں، تقریبی ہیں، اصلی گھڑیاں نہیں۔',
    'tools.hours.pickCity': 'شہر چنیں',
    'tools.hours.chooseCity': 'شہر چنیں…',
    'tools.hours.lat': 'عرض بلد',
    'tools.hours.lon': 'طول بلد',
    'tools.hours.useLatLon': 'یہ عرض بلد اور طول بلد استعمال کریں',
    'tools.hours.useMyLocation': 'میری جگہ استعمال کریں',
    'tools.hours.clearLocation': 'جگہ صاف کریں',
    'tools.hours.privacyNote': 'آپ کی جگہ صرف اسی ڈیوائس پر طلوع اور غروب معلوم کرنے کے لیے استعمال ہوتی ہے، یہ کبھی کہیں نہیں بھیجی جاتی۔ “Use my location” پہلے آپ کے براؤزر سے جگہ مانگتا ہے؛ آپ نہ کہہ سکتے ہیں اور شہر چن سکتے ہیں یا نقاط لکھ سکتے ہیں۔ کوئی باہر کی جگہ یا ٹائم زون والی سروس استعمال نہیں ہوتی۔',
    'tools.hours.dayRuler': 'دن کا حاکم:',
    'tools.hours.sunrise': 'طلوع',
    'tools.hours.sunset': 'غروب',
    'tools.hours.approxBox': 'تقریبی ہے، اصلی گھڑیاں نہیں۔ کوئی جگہ سیٹ نہیں ہے، اس لیے یہ جدول {tz} میں 06:00–18:00 کی مقررہ تقسیم استعمال کرتا ہے۔ اصلی گھڑیوں کے لیے اوپر جگہ سیٹ کریں۔',
    'tools.hours.realNote': 'گھڑیاں برابر نہیں: دن کی ہر گھڑی طلوع سے غروب کا بارہواں حصہ ہے، رات کی ہر گھڑی غروب سے اگلے طلوع کا بارہواں حصہ ہے۔ دن طلوع سے گنا جاتا ہے، اس لیے طلوع سے ذرا پہلے کا لمحہ پچھلے دن کا ہوتا ہے۔ وقت Astronomy Engine لائبریری سے معلوم کیا جاتا ہے؛ ٹائم زون Intl سے سنبھالا جاتا ہے، اس لیے ڈے لائٹ سیونگ بھی مانی جاتی ہے۔',
    'tools.hours.thHour': 'گھڑی',
    'tools.hours.thTime': 'وقت',
    'tools.hours.thRuler': 'حاکم',
    'tools.hours.thDayNight': 'دن / رات',
    'tools.hours.nowSuffix': ' — ابھی',
    'tools.hours.unavailableTitle': 'اس جگہ اور دن کے لیے سیارہ گھڑیاں دستیاب نہیں:',
    'tools.hours.unavailableDefault': 'سورج ابھی طلوع یا غروب نہیں ہوتا (قطبی دن یا رات)، اس لیے کوئی طلوع یا غروب نہیں جسے گھڑیوں میں بانٹا جائے۔',
    'tools.hours.unavailableTail': 'کوئی گھڑی گھڑی نہیں جاتی۔ کوئی اور جگہ یا دن چنیں۔',
    'tools.hours.methodNote': 'طریقہ: Astronomy Engine (سورج کے لیے SearchRiseSet)؛ کلدانی ترتیب زحل، مشتری، مریخ، سورج، زہرہ، عطارد، چاند ہے، اور دن کی پہلی گھڑی دن کا حاکم ہے۔ ماخذ: Wikipedia، “Planetary hours”۔',
    'tools.hours.geoSaved': 'جگہ اسی ڈیوائس پر محفوظ ہو گئی: {label}۔',
    'tools.hours.geoInvalid': 'وہ جگہ درست نہیں۔ عرض بلد -90 سے 90 کے بیچ، طول بلد -180 سے 180 کے بیچ ہونا چاہیے۔',
    'tools.hours.geoTypeNumbers': 'عرض بلد کے لیے ایک عدد اور طول بلد کے لیے ایک عدد لکھیں۔',
    'tools.hours.geoNoGeo': 'یہ براؤزر جگہ بتانے کی سہولت نہیں دیتا۔',
    'tools.hours.geoAsking': 'آپ کی جگہ مانگی جا رہی ہے…',
    'tools.hours.geoNotShared': 'جگہ نہیں بتائی گئی۔ شہر چنیں یا عرض بلد اور طول بلد لکھیں۔',
    'tools.hours.geoCleared': 'جگہ صاف کر دی گئی۔ گھڑیاں اب 06:00–18:00 کی تقریبی تقسیم ہیں۔',
    'tools.hours.geoManual': 'ہاتھ سے ({lat}، {lon})',
    'tools.hours.geoMyLocation': 'میری جگہ ({lat}، {lon})',
    'tools.moon.title': 'چاند',
    'tools.moon.eyebrow': 'وقت اور آسمان',
    'tools.moon.subtitle': 'چاند کا مرحلہ، کتنا روشن ہے، قمری دن، اور کس منزل میں ہے۔',
    'tools.moon.phaseAngle': 'مرحلے کا زاویہ',
    'tools.moon.illumination': 'روشنی',
    'tools.moon.lunarDay': 'قمری دن',
    'tools.moon.lunarDayValue': '30 میں سے دن {n}',
    'tools.moon.longitude': 'چاند کا دائرۃ البروج والا طول بلد',
    'tools.moon.methodNote': 'طریقہ: {method}۔ مرحلے کا زاویہ 0° نیا چاند ہے، 180° پورا چاند ہے۔',
    'tools.moon.currentMansion': 'موجودہ منزل',
    'tools.moon.alsoCalled': '(اسے {name} بھی کہتے ہیں)',
    'tools.moon.footer': 'یہ صرف گنے ہوئے حقائق ہیں۔ یہ بتاتے ہیں کہ چاند کہاں ہے اور کتنا روشن ہے، یہاں کچھ بھی نہیں کہتا کہ اس کا کسی دن یا کسی شخص کے لیے کیا مطلب ہے۔',
    'tools.mansions.title': 'قمری منزلیں',
    'tools.mansions.eyebrow': 'وقت اور آسمان',
    'tools.mansions.subtitle': 'چاند کی 28 منزلیں (manazil al-qamar)۔ آج کی منزل نمایاں ہے؛ نیچے والا شروع کا نقطہ ایک اصول ہے جسے آپ بدل سکتے ہیں۔',
    'tools.mansions.todayTitle': 'آج کی منزل',
    'tools.mansions.todayBodyA': 'چاند {deg} دائرۃ البروج والے طول بلد پر ہے،',
    'tools.mansions.todayOffset': '(شروع کا فرق {offset}° کے ساتھ)',
    'tools.mansions.offsetLabel': 'شروع کا فرق (ڈگری)، ایک اصول ہے، پکا حق نہیں',
    'tools.mansions.offsetNote': 'نیچے والا جدول 0° سے al-Sharatayn کے ساتھ شروع ہوتا ہے، اصول کے طور پر۔ 5° کا فرق لگانے سے شروع کا نقطہ 5° پر چلا جاتا ہے، اس لیے ہر منزل کی حد 5° بدل جاتی ہے۔ دوسری روایات گنتی کہیں اور سے شروع کرتی ہیں، یہ کنٹرول آپ کو ان کا شروع کا نقطہ استعمال کرنے دیتا ہے۔ چاند کی جگہ خود Astronomy Engine سے آتی ہے۔',
    'tools.mansions.thHash': '#',
    'tools.mansions.thMansion': 'منزل',
    'tools.mansions.thArabic': 'عربی',
    'tools.mansions.thDegrees': 'ڈگری',
    'tools.mansions.todaySuffix': ' — آج',
    'tools.mansions.alsoPrefix': 'بھی ',
    'tools.mansions.footerTail': 'ہر منزل 360 / 28 = تقریباً 12.857° کی ہے۔ یہ فہرست ایک روایتی جدول ہے، جدید فلکیاتی حق نہیں۔',
    'tools.falak.title': 'Falak — بارہ برج',
    'tools.falak.eyebrow': 'وقت اور آسمان',
    'tools.falak.subtitle': 'مداری برجوں کے بارہ برج، آج سورج کا برج بھی۔ مطالعے کے لیے ایک جدول، یہاں کچھ بھی نہیں کہتا کہ کسی برج کا کسی شخص کے لیے کیا مطلب ہے۔',
    'tools.falak.sunSignTitle': 'آج سورج کا برج',
    'tools.falak.sunSignBodyA': 'سورج {deg}° دائرۃ البروج والے طول بلد پر ہے،',
    'tools.falak.methodNote': 'Astronomy Engine سے معلوم کیا گیا (سورج کا SunPosition دائرۃ البروج والا طول بلد)۔ {convention}',
    'tools.falak.thHash': '#',
    'tools.falak.thSign': 'برج',
    'tools.falak.thArabic': 'عربی',
    'tools.falak.thDates': 'تاریخیں (تقریبی)',
    'tools.falak.thElement': 'عنصر',
    'tools.falak.thDegrees': 'ڈگری',
    'tools.falak.todaySuffix': ' — آج',
    'tools.falak.footer': 'عنصر روایتی مغربی گروہ ہیں: آگ = Aries, Leo, Sagittarius؛ مٹی = Taurus, Virgo, Capricorn؛ ہوا = Gemini, Libra, Aquarius؛ پانی = Cancer, Scorpio, Pisces۔ ماخذ: {source}۔ تاریخیں تقریبی ہیں اور سال بہ سال ایک دن آگے پیچھے ہوتی ہیں، کیونکہ اعتدال خود حرکت کرتا ہے۔',
    'tools.majlis.title': 'مجلس',
    'tools.majlis.eyebrow': 'وقت اور آسمان',
    'tools.majlis.subtitle': 'اس لمحے کی باتیں، ایک جگہ: آپ کہاں ہیں، آج کا حاکم، موجودہ گھڑی، اور چاند۔',
    'tools.majlis.locationTitle': 'جگہ',
    'tools.majlis.noLocation': 'کوئی جگہ سیٹ نہیں ہے۔ نیچے والی گھڑیاں 06:00–18:00 کی تقریبی تقسیم سے بنتی ہیں۔ Planetary Hours والے صفحے پر جگہ سیٹ کریں۔',
    'tools.majlis.locationNote': 'جگہ صرف اسی ڈیوائس پر محفوظ ہے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.majlis.rulerTitle': 'آج کا حاکم',
    'tools.majlis.rulerBodyA': 'اس دن کی پہلی گھڑی پر حکومت کرتا ہے۔',
    'tools.majlis.currentTitle': 'موجودہ گھڑی',
    'tools.majlis.approxNote': 'تقریبی ہے، اصلی گھڑیاں نہیں، کوئی جگہ سیٹ نہیں ہے۔',
    'tools.majlis.unavailable': 'اس جگہ اور دن کے لیے سیارہ گھڑیاں دستیاب نہیں: {reason}',
    'tools.majlis.moonTitle': 'چاند',
    'tools.majlis.moonLine': '{phase}، {pct}% روشن، 30 میں سے قمری دن {day}۔',
    'tools.majlis.mansionLabel': 'منزل:',
    'tools.majlis.methodNote': 'طریقہ: {method}۔ منزل کی تقسیم (0° al-Sharatayn سے 28 برابر حصے) ایک اصول ہے؛ Lunar Mansions والا صفحہ دیکھیں۔',
    'tools.majlis.footer': 'اس صفحے پر بس یہی ہے: وقت اور آسمان کی باتیں۔ یہ دن کو نمبر نہیں دیتا، کچھ تجویز نہیں کرتا، اور نہیں کہتا کہ کیا کرنا ہے۔',
    'tools.forge.title': 'Wafq Forge — میجک اسکوائر',
    'tools.forge.eyebrow': 'مربع اور مہریں',
    'tools.forge.subtitle': '3 سے 20 تک کے آرڈر کا میجک اسکوائر ہدف والے جوڑ پر بنائیں، پھر اسے سطر بہ سطر جانچیں۔ مربع صرف تب پاس دکھایا جاتا ہے جب ہر قطار، کالم اور قطر کا جوڑ برابر ہو۔',
    'tools.forge.orderLabel': 'آرڈر (مربع کا سائز)',
    'tools.forge.order2': '2 — ممکن نہیں',
    'tools.forge.order2Title': 'آرڈر 2 کا کوئی میجک اسکوائر نہیں ہوتا۔',
    'tools.forge.kindOdd': 'طاق آرڈر، Siamese طریقے سے بنتا ہے (de la Loubère)۔',
    'tools.forge.kindDoubly': 'دوگنا جفت آرڈر (4 سے تقسیم ہوتا ہے)، complement طریقے سے بنتا ہے۔',
    'tools.forge.kindSingly': 'اکیلا جفت آرڈر (جفت ہے، 4 سے تقسیم نہیں ہوتا)، LUX طریقے سے بنتا ہے (Conway)۔',
    'tools.forge.targetLabel': 'ہدف والا جوڑ (پہلے سے: بنیادی کانسٹنٹ {n})',
    'tools.forge.targetNote': 'ہدف {base} سے {order} کے ضرب کے فرق پر ہونا چاہیے، اور {base} سے کم نہیں ہونا چاہیے۔ ورنہ مربع منع کر دیا جاتا ہے، زبردستی نہیں بنایا جاتا۔',
    'tools.forge.generate': 'مربع بنائیں',
    'tools.forge.refusalPrefix': 'یہ مربع نہیں بن سکتا:',
    'tools.forge.squareTitle': '{order}x{order} مربع، ہدف {target}',
    'tools.forge.methodLineA': 'طریقہ: {method}۔ بنیادی کانسٹنٹ {base}',
    'tools.forge.shiftSuffix': '، ہر خانے میں {n} کا فرق۔',
    'tools.forge.noShift': '، کوئی فرق نہیں۔',
    'tools.forge.shownNote': 'مربع اوپر، اسی صفحے پر پورا دکھایا گیا ہے۔ اسے دیکھنے یا استعمال کرنے کے لیے ڈاؤن لوڈ کی ضرورت نہیں۔',
    'tools.forge.copyBtn': 'مربع نقل کریں',
    'tools.forge.validationTitle': 'جانچ، بنانے والے سے الگ',
    'tools.forge.passBody': 'ہر قطار، ہر کالم اور دونوں قطر کا جوڑ {target} ہے، اور تمام {n} اعداد الگ الگ مثبت پورے اعداد ہیں۔',
    'tools.forge.thLine': 'لکیر',
    'tools.forge.thSum': 'جوڑ',
    'tools.forge.thTarget': 'ہدف',
    'tools.forge.rowLabel': 'قطار {n}',
    'tools.forge.colLabel': 'کالم {n}',
    'tools.forge.diag1': 'قطر اوپر بائیں سے نیچے دائیں',
    'tools.forge.diag2': 'قطر اوپر دائیں سے نیچے بائیں',
    'tools.forge.distinctLine': 'تمام اعداد الگ ہیں: {yesNo}۔',
    'tools.forge.sealTitle': 'مہر کا فریم اور پلیٹ',
    'tools.forge.sealBody': 'فریم والی مہر نیچے، اسی صفحے پر دکھائی گئی ہے۔ اسے متن کے طور پر نقل کریں، تصویر کے طور پر محفوظ کریں، یا فریم والی SVG ڈاؤن لوڈ کریں۔ پرنٹ بھی ایک آپشن ہے۔ یہ سب صرف اس وقت کھلتے ہیں جب مربع جانچ پاس کر لے۔',
    'tools.forge.framedAria': 'فریم والا {order} بٹا {order} میجک اسکوائر، ہر لکیر کا جوڑ {target}',
    'tools.forge.gridAria': '{order} بٹا {order} میجک اسکوائر',
    'tools.forge.printA2': 'A2 پلیٹ کے طور پر پرنٹ کریں (420 x 594 mm کے تناسب سے)',
    'tools.forge.saveImage': 'تصویر کے طور پر محفوظ کریں',
    'tools.forge.downloadSvg': 'فریم والی SVG ڈاؤن لوڈ کریں',
    'tools.forge.printPlate': 'پلیٹ پرنٹ کریں',
    'tools.forge.exportOff': 'ایکسپورٹ اور پرنٹ تب تک بند رہتے ہیں جب تک مربع پاس نہ کر لے۔',
    'tools.forge.svgCaption': '{order} x {order}، ہر لکیر کا جوڑ {target}، {method}',
    'tools.forge.constructions': 'تعمیرات: {source}۔',
    'tools.qawaid.title': 'Qawa’id — مربعوں کے اصول',
    'tools.qawaid.eyebrow': 'مربع اور مہریں',
    'tools.qawaid.subtitle': 'مربع کیسے بنتا ہے، ہدف والا جوڑ کب پہنچا جا سکتا ہے، اسے کیسے جانچا جاتا ہے، اور کیا منع ہے۔',
    'tools.qawaid.whatTitle': 'میجک اسکوائر کیا ہے',
    'tools.qawaid.whatBody': 'میجک اسکوائر اعداد کا ایک جال ہے جس میں ہر قطار، ہر کالم اور دونوں قطر کا جوڑ ایک ہی ہوتا ہے۔ اس عدد کو میجک کانسٹنٹ، یا ہدف والا جوڑ کہتے ہیں۔ آرڈر ایک طرف کے خانوں کی تعداد ہے: 3x3 والا مربع آرڈر 3 ہے، 4x4 والا آرڈر 4 ہے، اور اسی طرح۔ 1 سے n مربع تک کے اعداد والے مربع کا کانسٹنٹ n ضرب (n مربع جمع 1)، تقسیم 2 ہوتا ہے۔ اس لیے 3x3 کا جوڑ 15، 4x4 کا 34، 5x5 کا 65، اور 9x9 کا 369 ہوتا ہے۔',
    'tools.qawaid.methodTitle': 'ہر آرڈر کی قسم کا طریقہ',
    'tools.qawaid.methodIntro': 'آرڈر تین قسم کے ہوتے ہیں، اور ہر قسم کی اپنی دستاویزی تعمیر ہے۔ Forge پہلے 1 سے n مربع تک کے اعداد والا بنیادی مربع بناتا ہے، پھر اسے ہدف والے جوڑ تک پہنچانے کے لیے ہر خانے میں ایک ہی عدد جوڑتا ہے (نیچے پہنچنے والا اصول دیکھیں)۔',
    'tools.qawaid.oddTitle': 'طاق آرڈر (3، 5، 7، 9، 11، 13، 15، 17، 19)، {method}',
    'tools.qawaid.oddBody': '1 کو اوپر والی قطار کے بیچ والے خانے میں رکھیں۔ پھر ایک قطار اوپر اور ایک کالم دائیں جائیں، جب جال سے باہر نکلیں تو کناروں سے گھوم کر واپس آئیں۔ اگر اگلا خانہ پہلے سے بھرا ہو تو موجودہ خانے سے ایک قطار نیچے جائیں۔ یہی کرتے رہیں جب تک ہر خانے میں عدد نہ آ جائے۔',
    'tools.qawaid.doublyTitle': 'دوگنا جفت آرڈر (4، 8، 12، 16، 20)، {method}',
    'tools.qawaid.doublyBody': '1 سے n مربع تک کے اعداد ترتیب سے لکھیں، قطار بہ قطار۔ پھر ہر 4x4 بلاک میں، جو عدد اس بلاک کے کسی قطر پر بیٹھا ہو اسے اس کے complement سے بدل دیں: n مربع جمع 1 منفی وہ عدد۔ قطر سے باہر والے اعداد ویسے ہی رہتے ہیں۔',
    'tools.qawaid.singlyTitle': 'اکیلا جفت آرڈر (6، 10، 14، 18)، {method}',
    'tools.qawaid.singlyBody': 'حروف L، U اور X کی ایک صف بنائیں، تیار مربع کے ہر 2x2 بلاک کے لیے ایک حرف۔ بلاکوں کو چار چار لگاتار اعداد سے بھریں، حرفوں کی صف میں Siamese طریقے کی طرح اوپر اور دائیں چلتے ہوئے، اوپر والی قطار کے بیچ والے بلاک سے شروع کریں۔ ہر حرف بتاتا ہے کہ چار اعداد اس کے 2x2 بلاک میں کس ترتیب سے آئیں گے: L بھرتا ہے اوپر دائیں، نیچے بائیں، نیچے دائیں، اوپر بائیں؛ U بھرتا ہے اوپر بائیں، نیچے بائیں، نیچے دائیں، اوپر دائیں؛ X بھرتا ہے اوپر بائیں، نیچے دائیں، نیچے بائیں، اوپر دائیں۔ حرف اس طرح لگائے گئے ہیں کہ تیار مربع ہر لکیر پر برابر جوڑ دے۔',
    'tools.qawaid.sourceNote': 'ماخذ: {source}۔',
    'tools.qawaid.reachTitle': 'پہنچنے کا اصول',
    'tools.qawaid.reachBody': 'بنیادی مربع کا جوڑ اس کا کانسٹنٹ M ہے۔ ہر خانے میں ایک ہی پورا عدد d جوڑنے سے ہر لکیر میں n ضرب d بڑھ جاتا ہے، اس لیے ہدف T بالکل تب پہنچا جا سکتا ہے جب (T منفی M) تقسیم n پورا عدد ہو، اور d منفی نہ ہو۔ بنیادی مربع کا سب سے چھوٹا خانہ 1 ہے، اس لیے منفی فرق کسی خانے کو صفر یا منفی کر دے گا، اور یہ منع ہے۔',
    'tools.qawaid.reachEx1': '3x3، ہدف 27: فرق (27 منفی 15) / 3 = 4 ہے، اس لیے خانے 5 سے 13 تک چلتے ہیں۔ اجازت ہے۔',
    'tools.qawaid.reachEx2': '3x3، ہدف 18: فرق (18 منفی 15) / 3 = 1 ہے، اس لیے خانے 2 سے 10 تک چلتے ہیں۔ اجازت ہے۔',
    'tools.qawaid.reachEx3': '3x3، ہدف 16: فرق 1 / 3 ہوگا، جو پورا عدد نہیں۔ منع ہے۔',
    'tools.qawaid.reachEx4': '3x3، ہدف 12: فرق منفی 1 ہوگا، جس سے ایک خانہ صفر ہو جائے گا۔ منع ہے۔',
    'tools.qawaid.reachEx5': '4x4، ہدف 35: فرق 1 / 4 ہوگا، جو پورا عدد نہیں۔ منع ہے۔',
    'tools.qawaid.refusedNote': 'جب ہدف منع کیا جاتا ہے تو Forge سیدھے الفاظ میں بتا دیتا ہے اور کچھ نہیں بناتا۔ یہ کبھی فرق کو گول نہیں کرتا، کبھی خانہ نہیں بدلتا، اور کبھی ایسا نتیجہ زبردستی نہیں بناتا جو صرف دیکھنے میں درست لگے۔',
    'tools.qawaid.validatorTitle': 'جانچنے والا کیسے کام کرتا ہے',
    'tools.qawaid.validatorBody1': 'جانچنے والا بنانے والے سے الگ کوڈ ہے۔ یہ نہیں جانتا کہ مربع کیسے بنا، اور یہ کبھی بنانے والے پر بھروسہ نہیں کرتا: یہ دیا گیا جال خانہ بہ خانہ جوڑتا ہے۔ یہ ہر قطار، ہر کالم اور دونوں قطر کو ہدف سے جانچتا ہے، اور یہ جانچتا ہے کہ ہر خانہ الگ مثبت پورا عدد ہے۔ یہ ہاتھ سے بنے جالوں پر بھی کام کرتا ہے، صرف Forge کے بنائے مربعوں پر نہیں۔',
    'tools.qawaid.validatorBody2': 'نتیجہ PASS یا FAIL کے طور پر دکھایا جاتا ہے، ہر لکیر کا جوڑ درج ہوتا ہے، تاکہ کوئی بھی دیکھ سکے کہ کون سی لکیر غلط ہے اور کتنی غلط ہے۔ ایکسپورٹ اور پرنٹ صرف PASS کے بعد کھلتے ہیں۔',
    'tools.qawaid.refusedTitle': 'کیا منع ہے اور کیوں',
    'tools.qawaid.refused1': 'آرڈر 2: آرڈر 2 کا کوئی میجک اسکوائر نہیں ہوتا۔',
    'tools.qawaid.refused2': '3 سے کم یا 20 سے زیادہ آرڈر: ان کے لیے یہاں کوئی تعمیر نہیں بنائی اور جانچی گئی۔',
    'tools.qawaid.refused3': 'وہ ہدف جس تک فرق نہیں پہنچ سکتا (فرق پورا عدد نہیں): منع ہے، گول نہیں کیا جاتا۔',
    'tools.qawaid.refused4': 'بنیادی کانسٹنٹ سے کم ہدف: منع ہے، کیونکہ ایک خانہ صفر یا منفی ہو جائے گا۔',
    'tools.qawaid.refused5': 'وہ ہدف جو پورا مثبت عدد نہیں: منع ہے۔',
    'tools.qawaid.modesTitle': 'وہ طریقے جو نہیں بنے',
    'tools.qawaid.modesIntro': 'یہ مربع والے طریقے نہیں بنے، کیونکہ ان کے لیے کوئی اصول اور حل شدہ مثال نہیں دی گئی۔ یہ یہاں درج ہیں تاکہ خلا نظر آئے، اندازے سے بھرنے کے بجائے۔',
    'tools.qawaid.baseConstants': 'بنیادی کانسٹنٹ، حوالے کے لیے:',
    'tools.method.title': 'Method — یہ ٹولز کیسے کام کرتے ہیں',
    'tools.method.eyebrow': 'کیسے کام کرتا ہے',
    'tools.method.subtitle': 'اعداد کہاں سے آتے ہیں، حروف کیسے گنے جاتے ہیں، کیا جانچا گیا، اور ان ٹولز کی حدیں کیا ہیں۔',
    'tools.method.whatTitle': 'یہ ٹولز کیا کرتے ہیں',
    'tools.method.whatBody': 'یہ ٹولز صرف مطالعے اور حساب کے لیے ہیں۔ یہ حرفوں کی قیمتیں جوڑتے ہیں، پڑھنے کے نوٹس رکھتے ہیں، گنتی گنتے ہیں، اور وہ چیزیں محفوظ کرتے ہیں جو آپ رکھنا چاہیں۔ یہ کسی نتیجے، حفاظت، شفا یا رزق کا وعدہ نہیں کرتے، اور کوئی دینی حکم نہیں دیتے۔ انہیں کبھی کسی کو نقصان پہنچانے کے لیے استعمال نہ کریں۔',
    'tools.method.sourcesTitle': 'اعداد کے ماخذ',
    'tools.method.srcAbjadLabel': 'ابجد جدول: ',
    'tools.method.srcAbjadBody': 'معیاری ابجد قیمتیں (مشرقی/مغربی)، Wikipedia کے “Abjad numerals” اور OpenArabic اور WiserWork کے ابجد کیلکولیٹر سے جانچی گئی۔ دونوں مکاتب 22 حروف پر متفق ہیں اور چھ حروف پر مختلف ہیں (sad, dad, sin, shin, za, ghayn)۔ کبیر ہر حرف کی پوری قیمت ہے؛ صغیر وہی قیمت جو ایک ہندسے تک کم کر دی گئی ہو۔',
    'tools.method.srcNamesLabel': '99 نام: ',
    'tools.method.srcAstroLabel': 'فلکیات اور وقت: ',
    'tools.method.srcAstroBody': 'سنبھالی جانے والی Astronomy Engine لائبریری (astronomy-engine) طلوع، غروب، چاند کا مرحلہ اور طول بلد، اور سورج کا طول بلد معلوم کرتی ہے۔ کوئی فلکیاتی فارمولا ہاتھ سے نہیں لکھا گیا۔',
    'tools.method.srcMansionsLabel': 'قمری منزلیں: ',
    'tools.method.srcMansionsBody': 'Wikipedia، “Lunar mansion” (manazil al-qamar والا جدول، 28 منزلیں جو 0° پر al-Sharatayn سے شروع ہوتی ہیں)، 18 Nov 2026 کو جانچا گیا۔',
    'tools.method.srcSignsLabel': 'بارہ برج: ',
    'tools.method.srcSignsBody': 'Wikipedia، “Astrological sign” (مغربی برجوں والا جدول، مداری برج اور عنصری گروہ)، 18 Nov 2026 کو جانچا گیا۔',
    'tools.method.srcPlanetsLabel': 'سیارے اور دن کے حاکم: ',
    'tools.method.srcPlanetsBody': 'Wikipedia، “Planetary hours” (کلدانی ترتیب اور کون سا سیارہ کس ہفتے کے دن کا حاکم ہے)۔ سیاروں کے عربی نام: Wiktionary، “Appendix:Planets”، اور وہاں بتائی گئی al-Biruni والی فہرست۔',
    'tools.method.srcSquaresLabel': 'میجک اسکوائر: ',
    'tools.method.srcSquaresBody': 'Wikipedia، “Magic square” اور “Conway’s LUX method for magic squares” (تعمیرات 18 Nov 2026 کو جانچی گئیں)۔',
    'tools.method.srcNotesLabel': 'آپ کے نوٹس، گنتی اور محفوظ چیزیں: ',
    'tools.method.srcNotesBody': 'آپ کے لکھے ہوئے، صرف اس ڈیوائس کے ذخیرے میں رکھے گئے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.method.timeTitle': 'وقت کیسے معلوم کیا جاتا ہے (Phase 2)',
    'tools.method.timeIntro': 'سیارہ گھڑیاں برابر نہیں۔ دن طلوع سے شروع ہوتا ہے: 12 دن کی گھڑیاں طلوع سے غروب کو 12 برابر حصوں میں بانٹتی ہیں، اور 12 رات کی گھڑیاں غروب سے اگلے طلوع کو 12 برابر حصوں میں بانٹتی ہیں۔ طلوع سے ذرا پہلے کا لمحہ پچھلے دن کا ہوتا ہے، جس کا حاکم ابھی لاگو ہے۔ دن کی پہلی گھڑی پر اس دن کے سیارے کی حکومت ہوتی ہے، اور اس کے بعد حاکم کلدانی ترتیب سے چلتے ہیں: زحل، مشتری، مریخ، سورج، زہرہ، عطارد، چاند۔',
    'tools.method.timeLibLabel': 'لائبریری: ',
    'tools.method.timeLibBody': 'Astronomy Engine (astronomy-engine)، ایک سنبھالی جانے والی فلکیاتی لائبریری۔ ٹائم زون Intl اور جگہ کے IANA زون سے سنبھالے جاتے ہیں، اس لیے ڈے لائٹ سیونگ مانی جاتی ہے۔ کوئی باہر کی جگہ یا ٹائم زون والی سروس استعمال نہیں ہوتی۔',
    'tools.method.timeNoLocLabel': 'کوئی جگہ سیٹ نہیں: ',
    'tools.method.timeNoLocBody': 'گھڑیاں 06:00–18:00 کی مقررہ تقسیم پر آ جاتی ہیں، صاف لکھا ہوتا ہے کہ “تقریبی ہے، اصلی گھڑیاں نہیں”۔',
    'tools.method.timePolarLabel': 'قطبی دن یا رات: ',
    'tools.method.timePolarBody': 'جہاں سورج طلوع یا غروب نہیں ہوتا، وہاں گھڑیاں وجہ کے ساتھ دستیاب نہیں دکھائی جاتی ہیں، وہ کبھی گھڑی نہیں جاتی ہیں۔',
    'tools.method.timeLocLabel': 'جگہ: ',
    'tools.method.timeLocBody': 'بندھی ہوئی شہروں کی فہرست سے چنی گئی، عرض بلد اور طول بلد کے طور پر لکھی گئی، یا براؤزر سے بتائی گئی، صرف اسی ڈیوائس پر، کبھی کہیں نہیں بھیجی جاتی۔',
    'tools.method.timeHijriLabel': 'ہجری تاریخ: ',
    'tools.method.timeHijriBody': 'اسلامی شہری کیلنڈر (Intl، Kuwaiti الگورتھم)۔ یہ تقریبی ہے: اصلی مہینے چاند دیکھنے پر منحصر ہیں اور ایک دو دن کا فرق ہو سکتا ہے۔',
    'tools.method.timeMansionsLabel': 'قمری منزلیں: ',
    'tools.method.timeMansionsBody': 'تقریباً 12.857° کے 28 برابر حصے، 0° سے al-Sharatayn کے ساتھ شروع۔ یہ ایک اصول ہے، سب کا مانا ہوا حق نہیں، دوسری روایات گنتی کہیں اور سے شروع کرتی ہیں، اور Mansions والا صفحہ آپ کو شروع کا نقطہ بدلنے دیتا ہے۔ چاند کی جگہ Astronomy Engine سے آتی ہے۔',
    'tools.method.timeSignsLabel': 'بارہ برج: ',
    'tools.method.timeSignsBody': 'مداری برج، مارچ کے اعتدال سے ناپے گئے، اس لیے برج اب ان ہی ناموں والے جھرمٹوں سے نہیں ملتے۔ تاریخیں تقریبی ہیں اور سال بہ سال تھوڑا بدلتی ہیں۔',
    'tools.method.timeMoonLabel': 'چاند کا مرحلہ اور قمری دن: ',
    'tools.method.timeMoonBody': 'Astronomy Engine سے؛ قمری دن مرحلے کے زاویے کا 29.53 دن والے مہینے میں حصہ ہے، 1 سے گنا جاتا ہے۔',
    'tools.method.squaresTitle': 'مربع کیسے بنتے اور جانچے جاتے ہیں (Phase 3)',
    'tools.method.squaresIntro': 'Wafq Forge 1 سے n مربع تک کے اعداد والا بنیادی مربع بناتا ہے، پھر ہدف والے جوڑ تک پہنچنے کے لیے ہر خانے میں ایک ہی پورا عدد جوڑتا ہے۔ کون سی تعمیر استعمال ہو یہ آرڈر کی قسم پر منحصر ہے: طاق آرڈر کے لیے Siamese طریقہ (de la Loubère)، دوگنا جفت آرڈر (4 سے تقسیم ہوتا ہے) کے لیے complement طریقہ، اور اکیلا جفت آرڈر (جفت ہے مگر 4 سے تقسیم نہیں ہوتا) کے لیے LUX طریقہ (Conway)۔ آرڈر 3 سے 20 تک چلتے ہیں۔ پورے اصول Qawa’id والے صفحے پر ہیں۔',
    'tools.method.sqReachLabel': 'پہنچنے کا اصول: ',
    'tools.method.sqReachBody': 'ہدف بالکل تب پہنچا جا سکتا ہے جب وہ بنیادی کانسٹنٹ سے آرڈر کے ضرب کے فرق پر ہو، اور فرق منفی نہ ہو۔ ورنہ Forge سیدھے الفاظ میں منع کر دیتا ہے، یہ کبھی گول نہیں کرتا، خانہ نہیں بدلتا، یا عدد نہیں دہراتا تاکہ نتیجہ زبردستی بن جائے۔',
    'tools.method.sqValidatorLabel': 'الگ جانچنے والا: ',
    'tools.method.sqValidatorBody': 'جانچنے والا بنانے والے سے الگ کوڈ ہے۔ یہ دیا گیا جال جوڑتا ہے، ہر قطار، ہر کالم، دونوں قطر، اور جانچتا ہے کہ ہر خانہ الگ مثبت پورا عدد ہے۔ یہ ہاتھ سے بنے جالوں پر بھی کام کرتا ہے۔ نتیجہ PASS یا FAIL کے طور پر دکھایا جاتا ہے، ہر لکیر کا جوڑ درج ہوتا ہے۔',
    'tools.method.sqExportLabel': 'ایکسپورٹ اور پرنٹ: ',
    'tools.method.sqExportBody': 'فریم والی SVG ڈاؤن لوڈ اور A2 پلیٹ پرنٹ صرف اس وقت کھلتے ہیں جب مربع جانچ پاس کر لے۔',
    'tools.method.sqModesLabel': 'نہیں بنے طریقے: ',
    'tools.method.sqModesBody': 'multiplied، cycling، hollow-centre اور “grand wafq” والے مربع “ماخذ چاہیے” کے طور پر درج ہیں، ان کے لیے کوئی اصول اور حل شدہ مثال نہیں دی گئی، اس لیے ان کا اندازہ نہیں لگایا گیا۔',
    'tools.method.lettersTitle': 'حروف کیسے گنے جاتے ہیں',
    'tools.method.lettersIntro': 'گنتی سے پہلے متن کو معیاری شکل میں لایا جاتا ہے، صاف کیا جاتا ہے، تاکہ ایک ہی حرف جو الگ طرح لکھا گیا ہو ایک بار گنا جائے۔ استعمال ہونے والے اصول یہ ہیں:',
    'tools.method.bareNote': 'کسی نام کی “بغیر” والی قیمت اس نام کو “al-” کے بغیر گنتی ہے؛ “al- کے ساتھ” والی قیمت اسے “al-” جوڑ کر گنتی ہے۔ دونوں میں ایک ہی ابجد جدول استعمال ہوتا ہے، اسی نظام اور مکتب میں جو آپ چنیں۔',
    'tools.method.testedTitle': 'کیا جانچا گیا',
    'tools.method.tested1': 'ذخیرے کے مددگار: 10 خودکار ٹیسٹ پاس ہوتے ہیں، جرنل، ورد اور Grimoire کے محفوظ/لوڈ کے چکر، درست JSON کی ایکسپورٹ/امپورٹ، اور غلط فائلوں کو موجودہ ڈیٹا مٹائے بغیر رد کرنا۔',
    'tools.method.tested2': 'ابجد کا حساب خود یہیں جانچا جاتا ہے: دونوں مکاتب اور دونوں نظاموں میں حرفوں کی قیمتیں، معیاری شکل (ہمزہ کی شکلیں، شد، تطویل، ٹوٹے ہوئے حروف)، اور متن کے کل، سادہ جانچ “Allah 66” اور “bism Allah 168” سمیت۔',
    'tools.method.tested3': 'وقت اور مربع اپنے اپنے ٹیسٹ سے جانچے جاتے ہیں: سیارہ گھڑیاں (آدھی رات اور قطبی حالت سمیت)، چاند اور منزل کی حدیں، اور مربع بنانا اور الگ جانچنے والا (معلوم کانسٹنٹ، بدلے ہوئے جوڑ، اور وہ حالتیں جو منع ہونی چاہییں)۔',
    'tools.method.limitsTitle': 'معلوم حدیں',
    'tools.method.limit1': 'عنصری گروہ، نورانی اور تاریک حروف، اور حرف سے سیارے کا تعلق کہیں نہیں دکھائے جاتے: ان نقشوں کے لیے ابھی کوئی ماخذ نہیں بتایا گیا، اس لیے کچھ اندازے سے نہیں بنایا گیا۔',
    'tools.method.limit2': 'مغربی قیمتیں جدول کے بتائے گئے ماخذوں سے آتی ہیں (Wikipedia کے “Abjad numerals”، OpenArabic، WiserWork): چھ حروف مشرقی قیمتوں سے مختلف ہیں، باقی 22 متفق ہیں۔',
    'tools.method.limit3': 'Today والے صفحے پر دکھائی گئی ہجری تاریخ تقریبی ہے، یہ گنی ہوئی (شہری) تاریخ ہے، جو چاند دیکھ کر طے ہونے والی تاریخ سے ایک دو دن کا فرق رکھ سکتی ہے۔',
    'tools.method.limit4': 'یہاں نماز کے وقت نہیں ہیں۔',
    'tools.method.limit5': 'نوٹس، گنتی اور محفوظ چیزیں صرف اسی ڈیوائس پر رہتی ہیں۔ اس براؤزر کا سائٹ ڈیٹا صاف کرنے، یا دوسری ڈیوائس پر جانے سے وہ ختم ہو جائیں گی، جب تک آپ نے پہلے JSON بیک اپ ایکسپورٹ نہ کیا ہو۔',
    'tools.about.title': 'About (مطالعے کے ٹولز)',
    'tools.about.eyebrow': 'About',
    'tools.about.subtitle': 'یہ حصہ کیا ہے، اس کے اعداد کہاں سے آتے ہیں، کیا جانچا گیا، اور یہ کیا نہیں کر سکتا۔',
    'tools.about.whatTitle': 'یہ حصہ کیا ہے',
    'tools.about.whatBody1': 'حروف، اعداد، وقت اور آپ کے اپنے پڑھنے کے نوٹس کے مطالعے کے لیے چھوٹے ٹولز کا مجموعہ۔ یہ حرفوں کی قیمتیں جوڑتے ہیں، دن کی باتیں معلوم کرتے ہیں، میجک اسکوائر بناتے اور جانچتے ہیں، اور وہ نوٹس رکھتے ہیں جو آپ محفوظ کرنا چاہیں۔ یہ صرف مطالعے اور حساب کے لیے ہیں۔ یہ کسی نتیجے، حفاظت، شفا یا رزق کا وعدہ نہیں کرتے، اور کوئی دینی حکم نہیں دیتے۔ انہیں کبھی کسی کو نقصان پہنچانے کے لیے استعمال نہ کریں۔',
    'tools.about.whatBody2': 'یہاں سب کچھ آپ کے براؤزر میں چلتا ہے۔ آپ کے نوٹس، گنتی اور محفوظ چیزیں اسی ڈیوائس پر رہتی ہیں۔ کچھ بھی کہیں نہیں بھیجا جاتا۔ لائبریری اور یہ ٹولز فالو والے گیٹ کے پیچھے ہیں: یہ تب کھلتے ہیں جب آپ “I followed” دبائیں یا Ghayb Chronicles کے براڈکاسٹ چینل سے چابی لکھیں۔ سائٹ خود مفت ہے؛ کہیں کوئی پیسہ نہیں ہے۔',
    'tools.about.builtTitle': 'کیا بنا ہوا ہے',
    'tools.about.builtIntro': 'انیس ٹولز بنے ہوئے اور کام کر رہے ہیں۔ ہب کے باقی کارڈ خالی ڈھانچے ہیں: ان میں صرف وہ مواد ہے جو اپنے ماخذ اور صفحے کے ساتھ دیا گیا ہو، اس لیے وہ تب تک خالی رہتے ہیں جب تک وہ نہ آئے۔',
    'tools.about.builtLettersLabel': 'حروف اور اعداد: ',
    'tools.about.builtLettersBody': 'Huruf (28 حروف اور ان کی قیمتیں)، Asma (99 نام)، Bast (کوئی بھی متن کھولیں)، Fawatih (29 سورتوں میں 14 شروع والے حرفی شکلیں)، Sawaqit (الفاتحہ سے غائب سات حروف)، Shields (پانچ چھوٹے متنوں کے چلتے ہوئے حرفی جوڑ)۔',
    'tools.about.builtTimeLabel': 'وقت اور آسمان: ',
    'tools.about.builtTimeBody': 'Today، Planetary Hours، Moon، Lunar Mansions، Falak (بارہ برج)، Majlis (اس لمحے کی باتیں)۔',
    'tools.about.builtSquaresLabel': 'مربع: ',
    'tools.about.builtSquaresBody': 'Wafq Forge (میجک اسکوائر بنائیں) اور Qawa’id (مربعوں کے اصول)۔',
    'tools.about.builtNotesLabel': 'نوٹس اور یادداشت: ',
    'tools.about.builtNotesBody': 'Journal (پڑھنے کے نوٹس)، Wird (ذکر کا کاؤنٹر)، Grimoire (محفوظ چیزیں)۔',
    'tools.about.builtSelfLabel': 'یہ حصہ خود: ',
    'tools.about.builtSelfBody': 'Method (ٹولز کیسے کام کرتے ہیں) اور یہ About والا صفحہ۔',
    'tools.about.notBuiltTitle': 'کیا نہیں بنا',
    'tools.about.notBuilt1': 'کوئی AI استاد نہیں۔ مواد کے بارے میں سوال کسی انسان سے ہیں، اس حصے سے نہیں۔',
    'tools.about.notBuilt2': 'کچھ بھی نہیں جو کسی کو نقصان پہنچائے، مجبور کرے یا باندھے۔ ٹولز صرف انڈیکس کرتے ہیں؛ وہ کبھی کسی شخص پر کام نہیں بناتے۔',
    'tools.about.notBuilt3': 'مقدار والی کوئی بخور کی ترکیب نہیں، اور کسی بھی قسم کی تیاری کی ہدایت نہیں۔',
    'tools.about.sourcesTitle': 'اعداد کے ماخذ',
    'tools.about.srcAbjadLabel': 'ابجد جدول: ',
    'tools.about.srcAbjadBody': 'معیاری ابجد قیمتیں (مشرقی/مغربی)، Wikipedia کے “Abjad numerals” اور OpenArabic اور WiserWork کے ابجد کیلکولیٹر سے جانچی گئی۔ دونوں مکاتب 22 حروف پر متفق ہیں اور چھ حروف پر مختلف ہیں (sad, dad, sin, shin, za, ghayn)۔ کبیر ہر حرف کی پوری قیمت ہے؛ صغیر وہی قیمت جو ایک ہندسے تک کم کر دی گئی ہو۔',
    'tools.about.srcQuranLabel': 'قرآنی متن: ',
    'tools.about.srcQuranBody': 'Fawatih والی شکلیں، Sawaqit والے حروف اور Shields والے کل چلتے وقت اسی متن سے گنے جاتے ہیں، لکھے نہیں جاتے۔ متن Tanzil کی شرائط کے تحت استعمال ہوتا ہے: حرف بہ حرف نقل، ماخذ بتایا گیا، tanzil.net کا لنک۔ سورتوں کے نام اور معنی AlQuranCloud کی سورتوں والی فہرست سے ہیں، 18 Nov 2026 کو جانچے گئے۔',
    'tools.about.srcTranslitLabel': 'لاطینی پڑھائی: ',
    'tools.about.srcTranslitBody': 'Fawatih، Sawaqit اور Shields والے صفحوں پر عربی کی لاطینی پڑھائی اسی منصوبے سے ہے۔ یہ غیر تجارتی استعمال کے لیے ہے، لنک واپس دیا گیا ہے، جیسا کہ شرائط کہتی ہیں۔ ہر آیت لفظ بہ لفظ عربی سے جانچی گئی۔',
    'tools.about.srcNamesLabel': '99 نام: ',
    'tools.about.srcAstroLabel': 'فلکیات اور وقت: ',
    'tools.about.srcAstroBody': 'سنبھالی جانے والی Astronomy Engine لائبریری (astronomy-engine) طلوع، غروب، چاند کا مرحلہ اور طول بلد، اور سورج کا طول بلد معلوم کرتی ہے۔ کوئی فلکیاتی فارمولا ہاتھ سے نہیں لکھا گیا۔',
    'tools.about.srcMansionsLabel': 'قمری منزلیں: ',
    'tools.about.srcMansionsBody': 'Wikipedia، “Lunar mansion” (manazil al-qamar والا جدول، 28 منزلیں جو 0° پر al-Sharatayn سے شروع ہوتی ہیں)، 18 Nov 2026 کو جانچا گیا۔',
    'tools.about.srcSignsLabel': 'بارہ برج: ',
    'tools.about.srcSignsBody': 'Wikipedia، “Astrological sign” (مغربی برجوں والا جدول، مداری برج اور عنصری گروہ)، 18 Nov 2026 کو جانچا گیا۔',
    'tools.about.srcPlanetsLabel': 'سیارے اور دن کے حاکم: ',
    'tools.about.srcPlanetsBody': 'Wikipedia، “Planetary hours” (کلدانی ترتیب اور کون سا سیارہ کس ہفتے کے دن کا حاکم ہے)۔ سیاروں کے عربی نام: Wiktionary، “Appendix:Planets”، اور وہاں بتائی گئی al-Biruni والی فہرست۔',
    'tools.about.srcSquaresLabel': 'میجک اسکوائر: ',
    'tools.about.srcSquaresBody': 'Wikipedia، “Magic square” اور “Conway’s LUX method for magic squares” (تعمیرات 18 Nov 2026 کو جانچی گئیں)۔',
    'tools.about.srcNotesLabel': 'آپ کے نوٹس، گنتی اور محفوظ چیزیں: ',
    'tools.about.srcNotesBody': 'آپ کے لکھے ہوئے، صرف اس ڈیوائس کے ذخیرے میں رکھے گئے۔ کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.about.convTitle': 'چنے گئے اصول',
    'tools.about.convSchoolsLabel': 'دو مکاتب، دو نظام: ',
    'tools.about.convSchoolsBody': 'مشرقی (مشرق کا) اور مغربی (مغرب کا) حرفوں والے جدول؛ کبیر (پوری قیمت) اور صغیر (ہر حرف ایک ہندسے تک کم کر کے، پھر جوڑا گیا)۔ صفحے آپ کو بدلنے دیتے ہیں، اور اعداد بدل جاتے ہیں۔',
    'tools.about.convCountingLabel': 'گنتی کے اصول: ',
    'tools.about.convCountingBody': 'حروف گننے کے لیے ایک ہی معیاری شکل والا طریقہ۔ Unicode NFC، ہمزہ کی شکلیں ایک کر دی گئیں، تا مربوطہ کو ہا پڑھا گیا، الف مقصورہ کو یا پڑھا گیا، شد اپنے حرف کو دوگنا کر دیتی ہے (سوائے اس کے جہاں حرف پہلے سے دو بار لکھا ہو، جیسے اللہ میں)۔ عثمانی ہجے جیسا لکھا ہے ویسا گنا جاتا ہے، اس لیے al-Rahman Shields میں 529 اور سادہ ہجے میں 329 ہے۔',
    'tools.about.convHoursLabel': 'سیارہ گھڑیاں: ',
    'tools.about.convHoursBody': 'برابر نہیں گھڑیاں۔ دن طلوع سے غروب تک چلتا ہے، رات غروب سے اگلے طلوع تک۔ کوئی جگہ سیٹ نہ ہو تو گھڑیاں 06:00–18:00 کی مقررہ تقسیم پر آ جاتی ہیں، صاف لکھا ہوتا ہے کہ تقریبی ہے۔ جہاں سورج طلوع یا غروب نہیں ہوتا، وہاں گھڑیاں دستیاب نہیں دکھائی جاتی ہیں۔',
    'tools.about.convHijriLabel': 'ہجری تاریخ: ',
    'tools.about.convHijriBody': 'اسلامی شہری کیلنڈر (Intl، Kuwaiti الگورتھم)۔ یہ تقریبی ہے: اصلی مہینے چاند دیکھنے پر منحصر ہیں اور ایک دو دن کا فرق ہو سکتا ہے۔',
    'tools.about.convMansionsLabel': 'قمری منزلیں: ',
    'tools.about.convMansionsBody': 'تقریباً 12.857° کے 28 برابر حصے، 0° سے al-Sharatayn کے ساتھ شروع۔ یہ ایک اصول ہے، سب کا مانا ہوا حق نہیں۔ دوسری روایات گنتی کہیں اور سے شروع کرتی ہیں، اور Mansions والا صفحہ آپ کو شروع کا نقطہ بدلنے دیتا ہے۔',
    'tools.about.convSignsLabel': 'بارہ برج: ',
    'tools.about.convSignsBody': 'مداری برج، مارچ کے اعتدال سے ناپے گئے، اس لیے برج اب ان ہی ناموں والے جھرمٹوں سے نہیں ملتے۔',
    'tools.about.testedTitle': 'کیا جانچا گیا',
    'tools.about.testedIntro': 'پوری سائٹ خودکار ٹیسٹ سے ڈھکی ہے۔ پورا مجموعہ سبز ہے، اور ہر تبدیلی بھیجنے سے پہلے چلتا ہے۔ اس حصے کے لیے اہم ٹیسٹ:',
    'tools.about.testedAbjadLabel': 'ابجد کا حساب: ',
    'tools.about.testedAbjadBody': 'دونوں مکاتب اور دونوں نظاموں میں حرفوں کی قیمتیں، معیاری شکل (ہمزہ کی شکلیں، شد، تطویل، ٹوٹے ہوئے حروف)، اور متن کے کل، سادہ جانچ “Allah 66” اور “bism Allah 168” سمیت۔',
    'tools.about.testedQuranLabel': 'قرآنی متن: ',
    'tools.about.testedQuranBody': 'پانچ shield والے متنوں کی آیتوں کی گنتی، ہر محفوظ سٹرنگ کی Unicode NFC شکل، بسم اللہ الفاتحہ میں رکھی گئی اور باقی تین سورتوں سے ہٹائی گئی، Fawatih والا اصول جو بالکل 29 سورتوں کو 14 شکلوں میں پاتا ہے، سات Sawaqit والے حروف، اور دونوں نظاموں اور دونوں مکاتب میں پانچوں Shields والے کل۔ متوقع اعداد جانچے جانے والے کوڈ سے نہیں، ماخذ والے متن سے الگ گنے گئے۔ لاطینی پڑھائی بھی اسی طرح جانچی گئی: ہر آیت اپنی عربی آیت سے لفظ بہ لفظ ملتی ہے (137 الفاظ)، اور 114:6 والی درستگی ٹیسٹ میں بندھی ہے۔',
    'tools.about.testedTimeLabel': 'وقت اور مربع: ',
    'tools.about.testedTimeBody': 'سیارہ گھڑیاں (آدھی رات اور قطبی حالت سمیت)، چاند اور منزل کی حدیں، اور مربع بنانا اور الگ جانچنے والا (معلوم کانسٹنٹ، بدلے ہوئے جوڑ، اور وہ حالتیں جو منع ہونی چاہییں)۔',
    'tools.about.testedStorageLabel': 'ذخیرہ اور جوڑ: ',
    'tools.about.testedStorageBody': 'جرنل، ورد اور Grimoire کے محفوظ/لوڈ کے چکر، درست JSON کی ایکسپورٹ/امپورٹ، غلط فائلیں موجودہ ڈیٹا مٹائے بغیر رد، اور ہب کا ہر ٹول جس کا راستہ، URL اور صفحہ ملتا ہو۔',
    'tools.about.limitsTitle': 'معلوم حدیں',
    'tools.about.limit1': 'Fawatih والا صفحہ شروع والے حروف کا مطلب نہیں بتاتا: ابھی کسی تفسیر کا کوئی ماخذ نہیں بتایا گیا۔',
    'tools.about.limit2': 'Sawaqit والا صفحہ سات غائب حروف سے جڑے روایتی نام نہیں دیتا: ابھی ان کے لیے کوئی ماخذ نہیں بتایا گیا۔ Shams al-Ma’arif کا Inloes والا ترجمہ جانچا گیا اور وہ انہیں نہیں دیتا۔',
    'tools.about.limit3': 'عنصری گروہ، نورانی اور تاریک حروف، اور حرف سے سیارے کا تعلق کہیں نہیں دکھائے جاتے: ان نقشوں کے لیے ابھی کوئی ماخذ نہیں بتایا گیا، اس لیے کچھ اندازے سے نہیں بنایا گیا۔',
    'tools.about.limit4': 'مغربی قیمتیں جدول کے بتائے گئے ماخذوں سے آتی ہیں: چھ حروف مشرقی قیمتوں سے مختلف ہیں، باقی 22 متفق ہیں۔',
    'tools.about.limit5': 'Today والے صفحے پر دکھائی گئی ہجری تاریخ تقریبی ہے۔ یہ گنی ہوئی (شہری) تاریخ ہے، جو چاند دیکھ کر طے ہونے والی تاریخ سے ایک دو دن کا فرق رکھ سکتی ہے۔',
    'tools.about.limit6': 'یہاں نماز کے وقت نہیں ہیں۔',
    'tools.about.limit7': 'نوٹس، گنتی اور محفوظ چیزیں صرف اسی ڈیوائس پر رہتی ہیں۔ اس براؤزر کا سائٹ ڈیٹا صاف کرنے، یا دوسری ڈیوائس پر جانے سے وہ ختم ہو جائیں گی، جب تک آپ نے پہلے JSON بیک اپ ایکسپورٹ نہ کیا ہو۔',
    'tools.about.whoTitle': 'یہ کس نے بنایا',
    'tools.about.whoBody': 'مطالعے کے ٹولز علمِ غیب لائبریری کا حصہ ہیں، Ghayb Chronicles (@ghayb.chronicles) کی طرف سے۔ اسلامی غیبی علم، تصوف اور صوفی حکمت، ہر کیپشن میں ماخذ کے ساتھ۔ لائبریری مفت ہے؛ ٹولز اور کتابیں چینل کے فالوورز کے لیے فالو والے گیٹ کے پیچھے ہیں۔',
    'tools.kitab.title': 'Kitab (کتاب)',
    'tools.kitab.eyebrow': 'کتاب',
    'tools.kitab.subtitle': 'کتابوں کے بارے میں کتابیں کیا کہتی ہیں، کتابوں سے ہی۔',
    'tools.kitab.chapterLabel': 'باب',
    'tools.kitab.filterAria': 'باب سے فلٹر کریں',
    'tools.kitab.allChapters': 'تمام ابواب',
    'tools.kitab.chapterN': 'باب {n}',
    'tools.kitab.frontMatter': 'شروع کا مواد',
    'tools.kitab.backMatter': 'آخر کا مواد',
    'tools.kitab.filterNote': 'یہ اندراج کتاب کے بارے میں عام نوٹس ہیں، باب کا متن نہیں، اس لیے باب والا فلٹر انہیں کم نہیں کرتا۔',
    'tools.talasim.title': 'Talasim (شکلیں)',
    'tools.talasim.eyebrow': 'شکلیں',
    'tools.talasim.subtitle': 'طلسم کیا ہے، اس کی شکلیں، اور چار سخت شرطیں۔',
    'tools.talasim.searchLabel': 'شکلیں تلاش کریں',
    'tools.talasim.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.ashkal.title': 'Ashkal (شکلیں)',
    'tools.ashkal.eyebrow': 'شکلیں',
    'tools.ashkal.subtitle': 'شکلیں روحوں کے برتن کے طور پر، نقطے سے مربع تک۔',
    'tools.ashkal.searchLabel': 'شکلیں تلاش کریں',
    'tools.ashkal.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.figureForge.title': 'فگر فورج',
    'tools.figureForge.eyebrow': 'شکلیں',
    'tools.figureForge.subtitle': 'شکل کیسے بنتی ہے، پرانی کتابوں کے الفاظ میں۔',
    'tools.figureForge.searchLabel': 'شکلیں تلاش کریں',
    'tools.figureForge.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.talismStudio.title': 'طلسم اسٹوڈیو',
    'tools.talismStudio.eyebrow': 'مہریں',
    'tools.talismStudio.subtitle': 'وہ کمرہ جہاں کام ہوتا ہے، جیسا کہ کتابیں بتاتی ہیں۔',
    'tools.talismStudio.searchLabel': 'مہریں تلاش کریں',
    'tools.talismStudio.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.haqaiq.title': 'Haqa’iq (حقیقتیں)',
    'tools.haqaiq.eyebrow': 'حقیقتیں',
    'tools.haqaiq.subtitle': 'وہ حقیقتیں جو دل میں رہتی ہیں، کتابوں میں نہیں۔',
    'tools.haqaiq.searchLabel': 'ریکارڈ تلاش کریں',
    'tools.haqaiq.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.shart.title': 'Shart (شرطیں)',
    'tools.shart.eyebrow': 'شرطیں',
    'tools.shart.subtitle': 'وہ شرطیں جو ہر کام کو چاہییں، ایک ایک کر کے بتائی گئی۔',
    'tools.shart.searchLabel': 'اندراج تلاش کریں',
    'tools.shart.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.sirr.title': 'السّر الجلیل',
    'tools.sirr.eyebrow': 'مونوگراف',
    'tools.sirr.subtitle': 'بڑا راز، اور وہ نام جو اسے کھولتا ہے۔',
    'tools.sirr.searchLabel': 'مونوگراف تلاش کریں',
    'tools.sirr.searchPlaceholder': 'سرخی یا صفحے سے تلاش کریں',
    'tools.durus.title': 'Durus (سبق)',
    'tools.durus.eyebrow': 'سبق',
    'tools.durus.subtitle': 'سیکھنے کے سبق، پرانے استادوں سے۔',
    'tools.durus.searchLabel': 'سبق تلاش کریں',
    'tools.durus.searchPlaceholder': 'سبق یا کورس سے تلاش کریں',
    'tools.index.title': 'انڈیکس',
    'tools.index.eyebrow': 'انڈیکس',
    'tools.index.subtitle': 'پرانی کتابیں خود کو کیسے نقشہ بناتی ہیں۔',
    'tools.index.searchLabel': 'انڈیکس تلاش کریں',
    'tools.index.searchPlaceholder': 'نام یا موضوع سے تلاش کریں',
    'tools.library.title': 'Library (مربعوں کی لائبریری)',
    'tools.library.eyebrow': 'مربعوں کی لائبریری',
    'tools.library.subtitle': 'پرانی کتابیں کیسے رکھی جاتی تھیں اور آگے کیسے دی جاتی تھیں۔',
    'tools.library.searchLabel': 'اندراج تلاش کریں',
    'tools.library.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.atlas.title': 'اٹلس',
    'tools.atlas.eyebrow': 'اٹلس',
    'tools.atlas.subtitle': 'آسمان، کرّوں اور حروف کا نقشہ۔',
    'tools.atlas.searchLabel': 'اٹلس تلاش کریں',
    'tools.atlas.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.qalam.title': 'قلم',
    'tools.qalam.eyebrow': 'قلم',
    'tools.qalam.subtitle': 'قلم، پہلی چیز جو بنائی گئی، اور پہلی چیز جس نے لکھا۔',
    'tools.qalam.searchLabel': 'اندراج تلاش کریں',
    'tools.qalam.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.khatam.title': 'خاتم',
    'tools.khatam.eyebrow': 'مہر',
    'tools.khatam.subtitle': 'مہر، اور سلیمان اس کے مالک۔',
    'tools.khatam.searchLabel': 'اندراج تلاش کریں',
    'tools.khatam.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.khatam.gridTitle': '3 بٹا 3 والا جال، اسی صفحے پر دکھایا گیا',
    'tools.khatam.gridBody': 'کتابیں 3 بٹا 3 والے جال کو سلیمان اور الغزالی کی مہر کہتی ہیں۔ یہ رہا، جیسا کہ کتابیں دیتی ہیں۔ ہر قطار، ہر کالم اور دونوں قطر کا جوڑ 15 ہے۔',
    'tools.khatam.gridNote': 'جال اوپر، اسی صفحے پر پورا دکھایا گیا ہے۔ اسے دیکھنے یا استعمال کرنے کے لیے ڈاؤن لوڈ کی ضرورت نہیں۔',
    'tools.khatam.copyGrid': 'جال نقل کریں',
    'tools.khatam.saveImage': 'تصویر کے طور پر محفوظ کریں',
    'tools.khatam.sealCaption': 'سلیمان کی مہر، 3 بٹا 3، ہر لکیر کا جوڑ 15',
    'tools.khatam.gridAria': '3 بٹا 3 والا جال، سلیمان کی مہر',
    'tools.khatam.sealAria': 'سلیمان کی مہر، 3 بٹا 3 والا جال',
    'tools.khatam.gridSourceBody': 'اعداد کلاسیکی 3 بٹا 3 والا مربع ہیں، اور ہر لکیر کا جوڑ 15 ہے۔',
    'tools.plate.title': 'پلیٹ',
    'tools.plate.eyebrow': 'پلیٹ',
    'tools.plate.subtitle': 'دھات کی پلیٹیں، ہر سیارے کے لیے ایک۔',
    'tools.plate.searchLabel': 'اندراج تلاش کریں',
    'tools.plate.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.plate.metalsTitle': 'دھاتیں اور ان کے سیارے، اسی صفحے پر دکھائے گئے',
    'tools.plate.metalsBody': 'ہر سیارے کی اپنی دھات ہے، اور دھات سیارے سے ملنی چاہیے۔ سورج کی سونا ہے۔ چاند کی چاندی ہے۔ مریخ کی لوہا ہے۔ عطارد کی پارہ ہے۔ زحل کی سیسہ ہے۔',
    'tools.plate.metalsNote': 'شکل اوپر، اسی صفحے پر پوری دکھائی گئی ہے۔ اسے دیکھنے یا استعمال کرنے کے لیے ڈاؤن لوڈ کی ضرورت نہیں۔ کتابیں تانبے کی پلیٹوں اور ٹین کی چادر کا بھی نام لیتی ہیں، لیکن اس صفحے کے اندراجوں میں انہیں کسی سیارے سے نہیں جوڑتیں۔',
    'tools.plate.copyList': 'فہرست نقل کریں',
    'tools.plate.saveImage': 'تصویر کے طور پر محفوظ کریں',
    'tools.plate.metalsAria': 'دھاتیں اور ان کے سیارے',
    'tools.plate.tableAria': 'دھاتوں اور ان کے سیاروں کی پلیٹ',
    'tools.plate.svgTitle': 'Lawh، پلیٹ',
    'tools.plate.svgSub': 'ہر سیارے کی اپنی دھات ہے۔ دھات سیارے سے ملنی چاہیے۔',
    'tools.plate.svgFoot': 'تانبے اور ٹین کا بھی پلیٹوں کے طور پر نام ہے۔ ان کے سیارے یہاں نہیں بتائے گئے۔',
    'tools.works.title': 'کام',
    'tools.works.eyebrow': 'کام',
    'tools.works.subtitle': 'کتابیں کیا کہتی ہیں کہ کام کیا ہے، اور اسے کیا چاہیے۔',
    'tools.works.searchLabel': 'اندراج تلاش کریں',
    'tools.works.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.bakhur.title': 'بخور اور عدد',
    'tools.bakhur.eyebrow': 'بخور اور عدد',
    'tools.bakhur.subtitle': 'نام دی گئی چیزوں اور عدد والے کام کی فہرست، بس یہی۔',
    'tools.bakhur.searchLabel': 'فہرست تلاش کریں',
    'tools.bakhur.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.shurut.title': 'Shurut (شرطیں)',
    'tools.shurut.eyebrow': 'شرطیں',
    'tools.shurut.subtitle': 'وہ شرطیں جو کتابیں بتاتی ہیں، ہر ایک اپنے ماخذ اور صفحے کے ساتھ۔',
    'tools.shurut.searchLabel': 'اندراج تلاش کریں',
    'tools.shurut.searchPlaceholder': 'نام یا صفحے سے تلاش کریں',
    'tools.glossary.title': 'لغت',
    'tools.glossary.eyebrow': 'لغت',
    'tools.glossary.subtitle': 'اس حصے میں استعمال ہونے والے الفاظ، سادہ الفاظ میں۔',
    'tools.glossary.searchLabel': 'اصطلاحیں تلاش کریں',
    'tools.glossary.searchPlaceholder': 'اصطلاح سے تلاش کریں',
    'tools.glossary.filterLabel': 'حرف سے فلٹر کریں',
    'tools.glossary.showingLetter': '{letter} کے نیچے والی اصطلاحیں دکھائی جا رہی ہیں۔ پوری لغت دوبارہ دیکھنے کے لیے All دبائیں۔',
    'tools.data.toolTitle.huruf': 'Huruf (حروف اور اعداد)',
    'tools.data.toolBlurb.huruf': '28 عربی حروف اور ان کی ابجد قیمتیں، گنتی کے اصول سادہ الفاظ میں دکھائے گئے۔',
    'tools.data.toolTitle.asma': 'Asma (99 نام)',
    'tools.data.toolBlurb.asma': '99 نام تلاش کریں، ہر نام کی عددی قیمت دیکھیں، کسی بھی نام کا حساب لگائیں، اور جو نام رکھنا چاہیں محفوظ کریں۔',
    'tools.data.toolTitle.bast': 'Bast (متن کو کھولیں)',
    'tools.data.toolBlurb.bast': 'کوئی بھی متن لکھیں اور اسے حرف بہ حرف کھولیں، ہر حرف کی قیمت اور چلتے ہوئے کل کے ساتھ۔',
    'tools.data.toolTitle.fawatih': 'Fawatih (شروع کے حروف)',
    'tools.data.toolBlurb.fawatih': 'وہ 14 جدا جدا حرفی شکلیں جو 29 سورتوں کو کھولتی ہیں، ہر سورت کی پہلی آیت پر اصول چلا کر ملی ہیں، ان کی قیمتوں کے ساتھ۔',
    'tools.data.toolTitle.sawaqit': 'Sawaqit (سات غائب حروف)',
    'tools.data.toolBlurb.sawaqit': 'وہ سات حروف جو الفاتحہ میں کہیں نہیں آتے، یہ گن کر ملے ہیں کہ سورت کن حروف کو استعمال کرتی ہے۔',
    'tools.data.toolTitle.shields': 'Shields (چلتے ہوئے حرفی جوڑ)',
    'tools.data.toolBlurb.shields': 'الفاتحہ، الاخلاص، الفلق، الناس اور آیت الکرسی کے لفظ بہ لفظ چلتے ہوئے حرفی جوڑ، تاکہ آپ حساب کا ساتھ دے سکیں۔',
    'tools.data.toolTitle.journal': 'Journal (پڑھنے کے نوٹس)',
    'tools.data.toolBlurb.journal': 'جو پڑھا اس پر نوٹس رکھیں۔ سب کچھ اسی ڈیوائس پر رہتا ہے، کچھ بھی کہیں نہیں بھیجا جاتا۔',
    'tools.data.toolTitle.wird': 'Wird (ذکر کا کاؤنٹر)',
    'tools.data.toolBlurb.wird': 'روزانہ کے ذکر کے لیے ایک سادہ کاؤنٹر، ہدف آپ خود لگائیں۔ اسی ڈیوائس پر محفوظ۔',
    'tools.data.toolTitle.grimoire': 'Grimoire (محفوظ چیزیں)',
    'tools.data.toolBlurb.grimoire': 'دوسرے ٹولز سے محفوظ کیے گئے نام، کھلے ہوئے متن اور نوٹس، سب ایک جگہ اسی ڈیوائس پر۔',
    'tools.data.toolTitle.today': 'آج',
    'tools.data.toolBlurb.today': 'آج کے دن کی باتیں: تاریخ، تقریبی ہجری تاریخ، دن کا حاکم، اور جس سیارہ گھڑی میں ابھی ہیں۔',
    'tools.data.toolTitle.hours': 'سیارہ گھڑیاں',
    'tools.data.toolBlurb.hours': 'دن کی 24 گھڑیاں، ہر ایک پر ایک سیارے کی حکومت۔ دن کی گھڑیاں طلوع سے غروب تک، رات کی گھڑیاں غروب سے اگلے طلوع تک، گھڑیاں برابر نہیں۔',
    'tools.data.toolTitle.moon': 'چاند',
    'tools.data.toolBlurb.moon': 'چاند کا مرحلہ، کتنا روشن ہے، قمری دن، اور کس منزل میں ہے۔',
    'tools.data.toolTitle.mansions': 'قمری منزلیں',
    'tools.data.toolBlurb.mansions': 'چاند کی 28 منزلیں، آج کی منزل نمایاں اور شروع کا نقطہ ایک اصول کے طور پر دکھایا گیا جسے آپ بدل سکتے ہیں۔',
    'tools.data.toolTitle.falak': 'Falak — بارہ برج',
    'tools.data.toolBlurb.falak': 'مداری برجوں کے بارہ برج، آج سورج کا برج بھی۔',
    'tools.data.toolTitle.majlis': 'مجلس',
    'tools.data.toolBlurb.majlis': 'اس لمحے کی باتیں ایک جگہ: جگہ، آج کا حاکم، موجودہ گھڑی، اور چاند۔ صرف حقائق، کوئی مشورہ نہیں۔',
    'tools.data.toolTitle.forge': 'Wafq Forge — میجک اسکوائر',
    'tools.data.toolBlurb.forge': '3 سے 20 تک کے آرڈر کا میجک اسکوائر ہدف والے جوڑ پر بنائیں، پھر اسے الگ جانچنے والے سے سطر بہ سطر جانچیں۔',
    'tools.data.toolTitle.qawaid': 'Qawa’id — مربعوں کے اصول',
    'tools.data.toolBlurb.qawaid': 'مربع کیسے بنتا ہے، ہدف والا جوڑ کب پہنچا جا سکتا ہے، اسے کیسے جانچا جاتا ہے، اور کیا منع ہے۔',
    'tools.data.toolTitle.kitab': 'Kitab (کتاب)',
    'tools.data.toolBlurb.kitab': 'کتابوں کے بارے میں کتابیں کیا کہتی ہیں: کتابوں کی تین مائیں، لوح محفوظ، اور لائبریری میں عنوان والی کتابیں۔',
    'tools.data.toolTitle.talasim': 'Talasim (شکلیں)',
    'tools.data.toolBlurb.talasim': 'طلسم کیا ہے، اس کی شکلیں اور نسل، اور بنانے کی چار سخت شرطیں۔',
    'tools.data.toolTitle.ashkal': 'Ashkal (شکلیں)',
    'tools.data.toolBlurb.ashkal': 'شکلیں روحوں کے برتن کے طور پر: نقطہ اور دائرہ، مثلث اور مربع، میجک اسکوائر بطور شکل، اور بہت کچھ۔',
    'tools.data.toolTitle.figure-forge': 'فگر فورج',
    'tools.data.toolBlurb.figure-forge': 'شکل کیسے بنتی ہے: دھاتیں اور پتھر، وقت، دھونا، تقدیس، اور بنانے والا۔',
    'tools.data.toolTitle.talism-studio': 'طلسم اسٹوڈیو',
    'tools.data.toolBlurb.talism-studio': 'پرانے ہنر کی کام کی جگہ: ذکر کا گھر، چار ستون، ریت کا تختہ، اور اسٹوڈیو کے اصول۔',
    'tools.data.toolTitle.haqaiq': 'Haqa’iq (حقیقتیں)',
    'tools.data.toolBlurb.haqaiq': 'وہ حقیقتیں جو دل میں رہتی ہیں: ثابت چیزیں، تین جہان، اور شریعت، طریقہ اور حقیقت کا راستہ۔',
    'tools.data.toolTitle.shart': 'Shart (شرطیں)',
    'tools.data.toolBlurb.shart': 'وہ شرطیں جو ہر کام کو چاہییں: 27 شرطیں، چار ستون، پاکیزگی، اور ارادے کی شرط۔',
    'tools.data.toolTitle.sirr-al-jalil': 'السّر الجلیل',
    'tools.data.toolBlurb.sirr-al-jalil': 'بڑا راز: الجلیل نام، المجید نام، اور اس کے جال میں رکھا ہوا راز۔',
    'tools.data.toolTitle.durus': 'Durus (سبق)',
    'tools.data.toolBlurb.durus': 'سیکھنے کے سبق: خاموشی، جیلانی کی تیرہ شاخیں، مطالعے کے آداب، اور مخلوق سے سیکھنا۔',
    'tools.data.toolTitle.index': 'انڈیکس',
    'tools.data.toolBlurb.index': 'پرانی کتابیں خود کو کیسے نقشہ بناتی ہیں: ابن عربی کا انڈیکس والا باب، سرخیاں، اور علم کا بکھرنا۔',
    'tools.data.toolTitle.library': 'Library (مربعوں کی لائبریری)',
    'tools.data.toolBlurb.library': 'پرانی کتابیں کیسے رکھی جاتی تھیں: چھپا ہوا علم، صندوق، حفاظت کا عہد، اور بڑی لائبریریاں۔',
    'tools.data.toolTitle.atlas': 'اٹلس',
    'tools.data.toolBlurb.atlas': 'آسمان کا نقشہ: Atlas والا کرّہ، نو نقشے، حرفوں کی ترتیب والا پہیہ، اور قاف کا سر۔',
    'tools.data.toolTitle.qalam': 'قلم',
    'tools.data.toolBlurb.qalam': 'قلم: پہلی چیز جو بنائی گئی، تین بار لکھا جانا، طلسمی قلم کے اصول، اور رومی کی چیونٹیاں۔',
    'tools.data.toolTitle.khatam': 'خاتم',
    'tools.data.toolBlurb.khatam': 'مہر: سلیمان اس کے مالک کے طور پر، 3 بٹا 3 والا جال، سات علامتیں، اور انبیا کی مہر۔',
    'tools.data.toolTitle.plate': 'پلیٹ',
    'tools.data.toolBlurb.plate': 'دھات کی پلیٹیں: سورج کے لیے سونا، چاند کے لیے چاندی، مریخ کے لیے لوہا، زحل کے لیے سیسہ، اور سات دھاتوں کی ڈھلائی۔',
    'tools.data.toolTitle.works': 'کام',
    'tools.data.toolBlurb.works': 'کتابیں کیا کہتی ہیں کہ کام کیا ہے: اس کے دو مقصد، نیت، حروف، مربع کے سائز، اور طریقے، ہر ایک اپنے ماخذ کے ساتھ۔',
    'tools.data.toolTitle.bakhur-adad': 'بخور اور عدد',
    'tools.data.toolBlurb.bakhur-adad': 'خوشبودار چیزوں اور عدد والے کام کی فہرست، ماخذ اور صفحے کے ساتھ۔ کبھی مقدار، تیاری، یا ترکیب نہیں۔',
    'tools.data.toolTitle.shurut': 'Shurut (شرطیں)',
    'tools.data.toolBlurb.shurut': 'کام کو جو شرطیں چاہییں: وقت، ہم آہنگی، تقدیس، صدقہ، پاکیزگی، نیت اور یقین، ہر ایک اپنے ماخذ کے ساتھ۔',
    'tools.data.toolTitle.glossary': 'لغت',
    'tools.data.toolBlurb.glossary': 'اس حصے میں استعمال ہونے والے الفاظ، سادہ الفاظ میں سمجھائے گئے، ہر ایک اپنے ماخذ اور صفحے کے ساتھ۔',
    'tools.data.toolTitle.method': 'Method (یہ ٹولز کیسے کام کرتے ہیں)',
    'tools.data.toolBlurb.method': 'اعداد کہاں سے آتے ہیں، حروف کیسے گنے جاتے ہیں، کیا جانچا گیا، اور یہ ٹولز کیا نہیں کر سکتے۔',
    'tools.data.toolTitle.about': 'About (مطالعے کے ٹولز)',
    'tools.data.toolBlurb.about': 'یہ حصہ کیا ہے، اس کے اعداد کہاں سے آتے ہیں، کیا جانچا گیا، اور یہ کیا نہیں کر سکتا۔',
    'tools.data.topicGroupTitle.quran': 'قرآن اور تفسیر',
    'tools.data.topicGroupBlurb.quran': 'قرآن، اور علما اس کی تشریح کیسے کرتے ہیں۔',
    'tools.data.topicGroupTitle.hadith': 'حدیث',
    'tools.data.topicGroupBlurb.hadith': 'نبی کے اقوال اور عمل، جمع کیے گئے۔',
    'tools.data.topicGroupTitle.seerah': 'نبی کی زندگی',
    'tools.data.topicGroupBlurb.seerah': 'نبی کی زندگی، اور انبیا کی کہانیاں۔',
    'tools.data.topicGroupTitle.history': 'تاریخ',
    'tools.data.topicGroupBlurb.history': 'اسلام کیسے بڑھا، اور سلطنتیں کیوں اٹھتی اور گرتی ہیں۔',
    'tools.data.topicGroupTitle.sufism': 'تصوف اور حکمت',
    'tools.data.topicGroupBlurb.sufism': 'روحانی راستہ، اور ایمان کی بنیادیں۔',
    'tools.data.topicGroupTitle.hidden': 'چھپا ہوا علم',
    'tools.data.topicGroupBlurb.hidden': 'راز، علامتیں، روح، خواب، اور غیب کی دنیا۔',
    'tools.data.planet.saturn': 'زحل',
    'tools.data.planet.jupiter': 'مشتری',
    'tools.data.planet.mars': 'مریخ',
    'tools.data.planet.sun': 'سورج',
    'tools.data.planet.venus': 'زہرہ',
    'tools.data.planet.mercury': 'عطارد',
    'tools.data.planet.moon': 'چاند',
    'tools.data.dayName.sunday': 'اتوار',
    'tools.data.dayName.monday': 'پیر',
    'tools.data.dayName.tuesday': 'منگل',
    'tools.data.dayName.wednesday': 'بدھ',
    'tools.data.dayName.thursday': 'جمعرات',
    'tools.data.dayName.friday': 'جمعہ',
    'tools.data.dayName.saturday': 'ہفتہ',
    'tools.data.zodiac.0': 'حمل',
    'tools.data.zodiac.1': 'ثور',
    'tools.data.zodiac.2': 'جوزا',
    'tools.data.zodiac.3': 'سرطان',
    'tools.data.zodiac.4': 'اسد',
    'tools.data.zodiac.5': 'سنبلہ',
    'tools.data.zodiac.6': 'میزان',
    'tools.data.zodiac.7': 'عقرب',
    'tools.data.zodiac.8': 'قوس',
    'tools.data.zodiac.9': 'جدی',
    'tools.data.zodiac.10': 'دلو',
    'tools.data.zodiac.11': 'حوت',
    'tools.data.element.fire': 'آگ',
    'tools.data.element.earth': 'مٹی',
    'tools.data.element.air': 'ہوا',
    'tools.data.element.water': 'پانی',
    'tools.data.phase.newMoon': 'نیا چاند',
    'tools.data.phase.waxingCrescent': 'بڑھتا ہوا ہلال',
    'tools.data.phase.firstQuarter': 'پہلی چوتھائی',
    'tools.data.phase.waxingGibbous': 'بڑھتا ہوا گبوس',
    'tools.data.phase.fullMoon': 'پورا چاند',
    'tools.data.phase.waningGibbous': 'گھٹتا ہوا گبوس',
    'tools.data.phase.lastQuarter': 'آخری چوتھائی',
    'tools.data.phase.waningCrescent': 'گھٹتا ہوا ہلال',
    'tools.data.mansionConvention': 'تقریباً 12.857 ڈگری کے 28 برابر حصے، 0 ڈگری سے al-Sharatayn کے ساتھ شروع۔ یہ ایک اصول ہے، سب کا مانا ہوا حق نہیں؛ دوسری روایات گنتی کہیں اور سے شروع کرتی ہیں۔',
    'tools.data.zodiacConvention': 'مداری برج: برج مارچ کے اعتدال سے ناپے جاتے ہیں، اس لیے وہ اب ان ہی ناموں والے جھرمٹوں سے نہیں ملتے۔ تاریخیں تقریبی ہیں اور سال بہ سال تھوڑا بدلتی ہیں۔',
    'tools.data.moonMethod': 'Astronomy Engine MoonPhase؛ قمری مہینہ 29.53 دن',
    'tools.data.hijriMethod': 'اسلامی شہری کیلنڈر (Intl، Kuwaiti الگورتھم)',
    'tools.data.hijriNote': 'اصلی مہینے چاند دیکھنے پر منحصر ہیں اور ایک دو دن کا فرق ہو سکتا ہے۔',
    'tools.data.sunNoSet': 'اس دن سورج غروب نہیں ہوتا (آدھی رات کا سورج)، طلوع یا غروب نہیں جسے گھڑیوں میں بانٹا جائے۔',
    'tools.data.sunNoRise': 'اس دن سورج طلوع نہیں ہوتا (قطبی رات)، طلوع یا غروب نہیں جسے گھڑیوں میں بانٹا جائے۔',
    'tools.data.sunRisesNoSet': 'سورج آج طلوع ہوتا ہے مگر اس کیلنڈر والے دن غروب نہیں ہوتا، وہ آدھی رات کے بعد غروب ہوتا ہے۔',
    'tools.data.normRule.1': 'متن پہلے Unicode NFC شکل میں لایا جاتا ہے، تاکہ الگ حصوں کے طور پر لکھا گیا حرف (مثلاً الف اور اس کے اوپر ہمزہ کا نشان) ایک ہی حرف بن جائے۔',
    'tools.data.normRule.2': 'تطویل (کھینچنے کا نشان) اور تمام حرکات ہٹا دی جاتی ہیں: فتحہ، ضمہ، کسرہ، سکون، تنوین، اوپر والا الف، اور ایسے نشان۔',
    'tools.data.normRule.3': 'ہمزہ کی شکلیں ایک کر دی جاتی ہیں: أ، إ، آ، ٱ، اور اکیلا ہمزہ ء سب ا بن جاتے ہیں؛ ؤ و بن جاتا ہے؛ ئ ی بن جاتا ہے۔',
    'tools.data.normRule.4': 'تا مربوطہ ة کو ہ پڑھا جاتا ہے۔ یہ اس ٹول کا اپنا فیصلہ ہے، سب کا مانا ہوا اصول نہیں۔',
    'tools.data.normRule.5': 'الف مقصورہ ى کو ی پڑھا جاتا ہے۔',
    'tools.data.normRule.6': 'شد اپنے حرف کو دوگنا کر دیتی ہے، اس لیے وہ حرف دو بار گنا جاتا ہے۔ اگر حرف پہلے سے دو بار لکھا ہو، جیسے اللہ میں دو لام، تو شد تیسرا حرف نہیں جوڑتی، اس لیے اللہ پھر بھی 66 رہتا ہے۔',
    'tools.data.normRule.7': 'خالی جگہیں، رموز، اور غیر عربی حروف نظرانداز کیے جاتے ہیں: وہ گنے نہیں جاتے اور حرفوں کی فہرست میں نہیں آتے۔',
    'tools.data.unsupported.multiplied.label': 'ضرب والے مربع',
    'tools.data.unsupported.multiplied.note': 'ماخذ چاہیے، کوئی اصول اور حل شدہ مثال نہیں دی گئی۔',
    'tools.data.unsupported.cycling.label': 'چکر والے مربع',
    'tools.data.unsupported.cycling.note': 'ماخذ چاہیے، کوئی اصول اور حل شدہ مثال نہیں دی گئی۔',
    'tools.data.unsupported.hollowCentre.label': 'کھوکھلے بیچ والے مربع',
    'tools.data.unsupported.hollowCentre.note': 'ماخذ چاہیے، کوئی اصول اور حل شدہ مثال نہیں دی گئی۔',
    'tools.data.unsupported.grandWafq.label': 'بڑا وفق',
    'tools.data.unsupported.grandWafq.note': 'ماخذ چاہیے، کوئی اصول اور حل شدہ مثال نہیں دی گئی۔',
    'tools.data.importError.notJson': 'وہ فائل درست JSON نہیں ہے۔',
    'tools.data.importError.noToolsData': 'اس فائل میں ٹولز کا ڈیٹا نہیں ہے۔',
    'tools.data.importError.noEntries': 'اس فائل میں جرنل، ورد یا Grimoire کا ڈیٹا نہیں ہے۔',
    'tools.data.importError.journalShape': 'اس فائل میں جرنل کے اندراج درست شکل میں نہیں ہیں۔',
    'tools.data.importError.wirdShape': 'اس فائل میں ورد کی گنتی درست شکل میں نہیں ہے۔',
    'tools.data.importError.grimoireShape': 'اس فائل میں Grimoire کی چیزیں درست شکل میں نہیں ہیں۔',
    'tools.data.alAsrarIntro.kitab': 'میں نے ان کتابوں کے ساتھ بہت وقت گزارا ہے۔ لفظ kitab کا مطلب کتاب ہے۔ لیکن پرانی کتابوں میں اس کا مطلب کاغذ اور سیاہی سے بہت زیادہ ہے۔ کتاب کے بارے میں میں نے کتابوں سے ہی یہ پایا۔',
    'tools.data.alAsrarIntro.talasim': 'طلسم وہ تعویذ نہیں ہے جو بازار سے خریدا جائے۔ پرانی کتابوں میں یہ ایک چیز ہے جو دیکھ بھال سے بنائی جاتی ہے، نام اور حروف اور اعداد توازن میں رکھے جاتے ہیں۔ کتابیں اس کے بارے میں یہ کہتی ہیں۔',
    'tools.data.alAsrarIntro.ashkal': 'Ashkal کا مطلب شکلیں ہے۔ شکل صرف کاغذ پر بنی ہوئی شکل نہیں ہے۔ ان کتابوں میں شکل ایک برتن ہے۔ یہ روح کو اس طرح رکھتی ہے جیسے پیالہ پانی رکھتا ہے۔ شکلوں کے بارے میں کتابیں یہ کہتی ہیں۔',
    'tools.data.alAsrarIntro.figure-forge': 'شکل لکھی نہیں جاتی۔ یہ بنائی جاتی ہے۔ پرانی کتابیں اس بارے میں سخت ہیں کہ شکل کیسے بنتی ہے، کس چیز سے بنتی ہے، اور کب بنتی ہے۔ میں نے ان کے اصول یہاں جمع کیے تاکہ آپ ہنر کو ویسا دیکھ سکیں جیسا وہ بتاتے ہیں۔',
    'tools.data.alAsrarIntro.talism-studio': 'پرانی کتابوں میں اسٹوڈیو کے لیے کوئی نیا لفظ نہیں ہے۔ لیکن وہ اس کمرے کو صاف صاف بتاتی ہیں جہاں کام ہوتا ہے۔ میں نے کام کی جگہ کی ان کی تفصیل یہاں جمع کی، تاکہ آپ دیکھ سکیں کہ وہ اسے کیسے لگاتے تھے۔',
    'tools.data.alAsrarIntro.haqaiq': 'Haqaiq کا مطلب حقیقتیں ہے۔ یہ لفظ اس کی طرف اشارہ کرتا ہے جو چیزوں کی سطح کے نیچے اصلی ہے۔ صوفی کہتے ہیں کہ حقیقتیں دل میں رہتی ہیں، کتابوں میں نہیں۔ ان کے بارے میں انہوں نے یہ لکھا۔',
    'tools.data.alAsrarIntro.shart': 'Shart کا مطلب شرط ہے۔ ان کتابوں میں کوئی چیز اپنی شرطوں کے بغیر نہیں چلتی۔ کتابیں انہیں دیکھ بھال سے درج کرتی ہیں، کیونکہ شرطوں کے بغیر کیا گیا کام غلط کیا گیا کام ہے۔ وہ شرطیں یہ ہیں جو وہ بتاتی ہیں۔',
    'tools.data.alAsrarIntro.sirr-al-jalil': 'Al-Sirr al-Jalil کا مطلب بڑا راز ہے۔ یہ ایک نام، ایک عدد اور ایک دروازہ ہے، ایک ہی وقت میں۔ میں نے کتابوں کی بات یہاں جمع کی، تاکہ آپ دیکھ سکیں کہ ایک نام رازوں کا پورا میدان کیسے کھولتا ہے۔',
    'tools.data.alAsrarIntro.durus': 'Durus کا مطلب سبق ہے۔ پرانے استاد صرف کتابوں سے نہیں پڑھاتے تھے۔ وہ خاموشی سے، مثال سے اور استاد کی صحبت سے پڑھاتے تھے۔ سیکھنے کے بارے میں وہ یہ کہتے ہیں۔',
    'tools.data.alAsrarIntro.index': 'انڈیکس کتاب کا نقشہ ہے۔ پرانی کتابوں نے اپنا علم جان بوجھ کر چھپایا، اس لیے انڈیکس وہ چابی ہے جو انہیں کھولتی ہے۔ میں نے یہاں جمع کیا کہ کتابیں اپنے انڈیکس کے بارے میں کیا کہتی ہیں۔',
    'tools.data.alAsrarIntro.library': 'پرانی کتابیں کھلی شیلفوں پر نہیں رکھی جاتی تھیں۔ وہ چھپائی جاتی تھیں، دفن کی جاتی تھیں، صندوقوں میں بند کی جاتی تھیں اور راز میں آگے دی جاتی تھیں۔ یہ صفحہ جمع کرتا ہے کہ کتابیں ایسی کتابوں کی لائبریری رکھنے کے بارے میں کیا کہتی ہیں۔',
    'tools.data.alAsrarIntro.atlas': 'اٹلس ایک نقشہ ہے۔ لیکن یہ اٹلس زمینوں کا نقشہ نہیں بناتا۔ یہ آسمان، کرّوں اور ان حروف کا نقشہ بناتا ہے جو ان پر حکومت کرتے ہیں۔ پرانی کتابیں آسمان کو اس طرح بناتی ہیں۔',
    'tools.data.alAsrarIntro.qalam': 'Qalam کا مطلب قلم ہے۔ لیکن ان کتابوں میں قلم وہ قلم نہیں ہے جو میری میز پر ہے۔ یہ پہلی چیز ہے جو اللہ نے بنائی، اور پہلی چیز جس نے لکھا۔ قلم کے بارے میں کتابیں یہ کہتی ہیں۔',
    'tools.data.alAsrarIntro.khatam': 'Khatam کا مطلب مہر ہے۔ مہر خط کو بند کرتی ہے اور ثابت کرتی ہے کہ کس نے بھیجا۔ پرانی کتابوں میں مہر ایک طاقت بھی ہے، اور سلیمان اس کے مالک ہیں۔ مہروں کے بارے میں کتابیں یہ کہتی ہیں۔',
    'tools.data.alAsrarIntro.plate': 'پلیٹ دھات کی ایک چپٹی چادر ہے، جو شکل اٹھانے کے لیے بنائی جاتی ہے۔ سونا، چاندی، تانبا، لوہا اور سیسہ ہر ایک کا اپنا کام ہے۔ میں نے یہاں جمع کیا کہ کتابیں ہر پلیٹ کے بارے میں کیا کہتی ہیں۔',
    'tools.data.alAsrarIntro.works': 'کام ایک عملی عمل ہے، نظم کے ساتھ اور اللہ کو یاد رکھتے ہوئے کیا جاتا ہے۔ میں نے جمع کیا کہ کتابیں کیا کہتی ہیں کہ کام کیا ہے، اسے کیا چاہیے، اور علم اور عمل ایک ساتھ کیسے رہتے ہیں۔ یہ رہا، کتابوں سے ہی۔',
    'tools.data.alAsrarIntro.bakhur-adad': 'Bakhur and Adad ایک فہرست ہے، بس یہی۔ یہ خوشبودار چیزوں اور عدد والے کام کا نام لیتی ہے، ہر ایک کے ماخذ اور صفحے کے ساتھ، تاکہ پڑھنے والا اندراج گن سکے اور ہر ایک کو دیکھ سکے۔ یہ کبھی مقدار، تیاری، یا ترکیب نہیں دیتی۔',
    'tools.data.alAsrarIntro.shurut': 'Shurut شرطیں ہیں۔ شرطوں سے باہر کیا گیا کام غلط کیا گیا کام ہے۔ میں نے وہ شرطیں جمع کیں جو کتابیں بتاتی ہیں، ہر ایک اپنے ماخذ اور صفحے کے ساتھ، تاکہ پڑھنے والا انہیں ایک ایک کر کے جانچ سکے۔',
    'tools.data.alAsrarIntro.glossary': 'Glossary اس حصے میں استعمال ہونے والے الفاظ کو سادہ الفاظ میں سمجھاتی ہے۔ یہ اب تک جمع کی گئی اصطلاحیں ہیں، ہر ایک اپنے ماخذ اور صفحے کے ساتھ۔ پوری جدول ابھی نوٹ بک سے جمع کی جا رہی ہے، اور مزید اصطلاحیں یہاں شامل ہوں گی۔',
    'tools.data.figureTitle.mutakabbir': 'al-Mutakabbir کا مربع، 4 بٹا 4',
    'tools.data.figureCaption.mutakabbir': 'کتاب سے اعداد کا ایک مربع۔ کتاب یہ اعداد جیسے ہیں ویسے دیتی ہے۔ ہم انہیں یہاں بالکل جیسا لکھا ہے ویسا بناتے ہیں۔',
    'tools.data.figureNote.mutakabbir': 'یہ جال میجک اسکوائر کے طور پر درست نہیں نکلتا۔ قطاروں کا جوڑ 206، 183، 198 اور 206 ہے۔ عدد 56 دو بار آیا ہے۔ ہم اسے ویسا دکھاتے ہیں جیسا کتاب میں ہے۔ ہم اسے ٹھیک نہیں کرتے۔',
    'tools.data.figureTitle.jabbar': 'al-Jabbar کا مربع، 5 بٹا 5',
    'tools.data.figureCaption.jabbar': 'کتاب اس مربع کا عدد دیتی ہے مگر جال نہیں دیتی۔ ہم صرف وہ دکھاتے ہیں جو کتاب دیتی ہے۔',
    'tools.data.figureNote.jabbar': 'جال خود ہاتھ میں نہیں ہے۔ ہم خانے اندازے سے نہیں بھرتے۔',
    'tools.data.figureTitle.solomon-triangle': 'سلیمان والا مثلث وفق، 3 بٹا 3',
    'tools.data.figureCaption.solomon-triangle': 'نو اعداد کا ایک چھوٹا مربع۔ ہر قطار اور ہر کالم اور ہر قطر کا جوڑ 15 ہے۔',
    'tools.data.figureTitle.fatiha-wafqs': 'الفاتحہ کے چھوڑے گئے حروف کے سات وفق',
    'tools.data.figureCaption.fatiha-wafqs': 'کتاب کہتی ہے کہ الفاتحہ کے ہر چھوڑے گئے حرف کے لیے سات گنا وفق ہے۔ اصول یہاں بتایا گیا ہے۔ کوئی جال نہیں بنایا گیا۔',
    'tools.data.figureNote.fatiha-wafqs': 'جال ہاتھ میں نہیں ہیں۔ جو ہمارے پاس نہیں ہے وہ ہم نہیں بناتے۔',
    'tools.data.figureTitle.seven-seals': 'سات دنوں کے لیے سات مہریں',
    'tools.data.figureCaption.seven-seals': 'کتاب باب کو اس سطر سے کھولتی ہے۔ سات دنوں کے لیے سات مہروں کی شکل۔ نیچے والے سات نشان وہ گرافک نشان ہیں جو مہروں کے اندر ملے ہیں۔',
    'tools.data.figureNote.seven-seals': 'کتاب میں مہریں 4 بٹا 4 کے سات جال ہیں، اعداد اور ہاتھ سے بنے نشانوں کے ساتھ۔ جال کتاب میں ہاتھ سے بنے ہیں۔ وہ یہاں لکھے نہیں گئے۔ صرف سات نشان بنائے گئے ہیں۔',
    'tools.data.sawaqitGloss.fard': 'واحد، یکتا',
    'tools.data.sawaqitGloss.jabbar': 'جبار، درست کرنے والا',
    'tools.data.sawaqitGloss.shahid': 'گواہ',
    'tools.data.sawaqitGloss.thabit': 'ثابت، قائم',
    'tools.data.sawaqitGloss.zahir': 'ظاہر، مددگار',
    'tools.data.sawaqitGloss.khabir': 'سب جاننے والا',
    'tools.data.sawaqitGloss.zaki': 'پاک',
    'tools.data.metal.gold': 'سونا',
    'tools.data.metal.silver': 'چاندی',
    'tools.data.metal.iron': 'لوہا',
    'tools.data.metal.quicksilver': 'پارہ',
    'tools.data.metal.lead': 'سیسہ',
    'tools.forge.reasonOrderUnsupported': 'آرڈر {order} نہیں چلتا۔ صرف آرڈر 3 سے 20، اور آرڈر 2 کا کوئی میجک اسکوائر ہوتا ہی نہیں۔',
    'tools.forge.reasonNoConstruction': 'آرڈر {order} کے لیے کوئی دستاویزی تعمیر نہیں بنائی گئی، اس لیے کوئی مربع نہیں بنایا جاتا۔',
    'tools.forge.reasonTargetNotWhole': 'ہدف والا جوڑ پورا مثبت عدد ہونا چاہیے۔',
    'tools.forge.reasonUnreachable': 'ہدف {target} {order}x{order} والے مربع کے لیے نہیں پہنچا جا سکتا۔ بنیادی مربع کا جوڑ {base} ہے، اور ہر خانے میں ایک ہی پورا عدد جوڑنے سے ہر لکیر {order} کے ضرب سے بدلتی ہے، اس لیے {target} اس طرح نہیں پہنچا جا سکتا۔ ایسا ہدف چنیں جو {base} سے {order} کے ضرب کے فرق پر ہو۔',
    'tools.forge.reasonBelowBase': 'ہدف {target} {order}x{order} والے مربع کے بنیادی جوڑ {base} سے کم ہے۔ اس تک پہنچنے کے لیے {offset} کا فرق چاہیے، جس سے سب سے چھوٹا خانہ صفر یا منفی ہو جائے گا۔ صرف {base} یا اس سے زیادہ والے ہدف اس طرح بن سکتے ہیں۔',
    'tools.forge.failNotSquare': 'جال مربع نہیں ہے: ہر قطار میں اتنے ہی خانے ہونے چاہییں جتنی قطاریں ہیں۔',
    'tools.forge.failCell': 'قطار {r}، کالم {c} والا خانہ مثبت پورا عدد نہیں ہے۔',
    'tools.forge.failRepeated': 'عدد {value} ایک بار سے زیادہ آیا ہے۔',
    'tools.forge.failRow': 'قطار {n} کا جوڑ {sum} ہے، {target} نہیں۔',
    'tools.forge.failColumn': 'کالم {n} کا جوڑ {sum} ہے، {target} نہیں۔',
    'tools.forge.failDiag1': 'قطر (اوپر بائیں سے نیچے دائیں) کا جوڑ {sum} ہے، {target} نہیں۔',
    'tools.forge.failDiag2': 'قطر (اوپر دائیں سے نیچے بائیں) کا جوڑ {sum} ہے، {target} نہیں۔',
    'tools.forge.failSomeNotWhole': 'کچھ خانے مثبت پورے اعداد نہیں ہیں۔',
    'tools.forge.failNotDistinct': 'تمام اعداد الگ نہیں ہیں۔',
  },
};

/** Translate a tools key. Falls back to English, then to the key itself. */
export function tTools(key: string, lang: SiteLanguage = 'en'): string {
  const l = lang === 'hi' || lang === 'bn' ? lang : 'en';
  return I18N_TOOLS[l][key] ?? I18N_TOOLS.en[key] ?? key;
}

/** Translate a tools key with {name} placeholders (numbers or dates only). */
export function tfTools(key: string, lang: SiteLanguage, vars: Record<string, string | number>): string {
  let out = tTools(key, lang);
  for (const [name, value] of Object.entries(vars)) {
    out = out.split(`{${name}}`).join(String(value));
  }
  return out;
}

/** True when every tools key has a translation in the given language. */
export function toolsHasFullCoverage(lang: SiteLanguage): boolean {
  return Object.keys(I18N_TOOLS.en).every(
    (k) => typeof I18N_TOOLS[lang][k] === 'string' && I18N_TOOLS[lang][k].length > 0,
  );
}

/** Localized hub/search title + blurb for one tool entry. Falls back to the stored English. */
export function localizeTool(
  entry: { id: string; title: string; blurb: string },
  lang: SiteLanguage,
): { title: string; blurb: string } {
  return {
    title: tTools(`tools.data.toolTitle.${entry.id}`, lang) === `tools.data.toolTitle.${entry.id}`
      ? entry.title
      : tTools(`tools.data.toolTitle.${entry.id}`, lang),
    blurb: tTools(`tools.data.toolBlurb.${entry.id}`, lang) === `tools.data.toolBlurb.${entry.id}`
      ? entry.blurb
      : tTools(`tools.data.toolBlurb.${entry.id}`, lang),
  };
}

/** Localized title + blurb for one topic group. Falls back to the stored English. */
export function localizeTopicGroup(
  group: { id: string; title: string; blurb: string },
  lang: SiteLanguage,
): { title: string; blurb: string } {
  return {
    title: tTools(`tools.data.topicGroupTitle.${group.id}`, lang),
    blurb: tTools(`tools.data.topicGroupBlurb.${group.id}`, lang),
  };
}

/** The 99 Names' short meanings, keyed by the bare Arabic name. English is the stored meaning. */
export const ASMA_MEANINGS: Record<SiteLanguage, Record<string, string>> = {
  en: {
    'رحمن': 'The Most Gracious',
    'رحيم': 'The Most Merciful',
    'ملك': 'The King',
    'قدوس': 'The Most Holy',
    'سلام': 'The Source of Peace',
    'مؤمن': 'The Giver of Security',
    'مهيمن': 'The Guardian over All',
    'عزيز': 'The Mighty',
    'جبار': 'The Compeller',
    'متكبر': 'The Supreme in Greatness',
    'خالق': 'The Creator',
    'بارئ': 'The Maker',
    'مصور': 'The Fashioner of Forms',
    'غفار': 'The Repeatedly Forgiving',
    'قهار': 'The Subduer',
    'وهاب': 'The Bestower',
    'رزاق': 'The Provider',
    'فتاح': 'The Opener',
    'عليم': 'The All-Knowing',
    'قابض': 'The Withholder',
    'باسط': 'The Extender',
    'خافض': 'The One Who Lowers',
    'رافع': 'The One Who Raises',
    'معز': 'The Giver of Honour',
    'مذل': 'The Giver of Dishonour',
    'سميع': 'The All-Hearing',
    'بصير': 'The All-Seeing',
    'حكم': 'The Judge',
    'عدل': 'The Utterly Just',
    'لطيف': 'The Subtle and Kind',
    'خبير': 'The All-Aware',
    'حليم': 'The Forbearing',
    'عظيم': 'The Magnificent',
    'غفور': 'The All-Forgiving',
    'شكور': 'The Most Appreciative',
    'علي': 'The Most High',
    'كبير': 'The Most Great',
    'حفيظ': 'The Preserver',
    'مقيت': 'The Nourisher',
    'حسيب': 'The Reckoner',
    'جليل': 'The Majestic',
    'كريم': 'The Most Generous',
    'رقيب': 'The Watchful',
    'مجيب': 'The Answerer of Prayer',
    'واسع': 'The All-Encompassing',
    'حكيم': 'The All-Wise',
    'ودود': 'The Most Loving',
    'مجيد': 'The All-Glorious',
    'باعث': 'The Resurrector',
    'شهيد': 'The Witness',
    'حق': 'The Truth',
    'وكيل': 'The Trustee',
    'قوي': 'The All-Strong',
    'متين': 'The Firm',
    'ولي': 'The Protecting Friend',
    'حميد': 'The Praiseworthy',
    'محصي': 'The One Who Counts All Things',
    'مبدئ': 'The Originator of Creation',
    'معيد': 'The Restorer',
    'محيي': 'The Giver of Life',
    'مميت': 'The Bringer of Death',
    'حي': 'The Ever-Living',
    'قيوم': 'The Self-Subsisting',
    'واجد': 'The Finder',
    'ماجد': 'The Illustrious',
    'واحد': 'The One',
    'أحد': 'The Indivisible One',
    'صمد': 'The Eternal Refuge',
    'قادر': 'The Able',
    'مقتدر': 'The Omnipotent',
    'مقدم': 'The One Who Brings Forward',
    'مؤخر': 'The One Who Delays',
    'أول': 'The First',
    'آخر': 'The Last',
    'ظاهر': 'The Manifest',
    'باطن': 'The Hidden',
    'والي': 'The Patron',
    'متعالي': 'The Most Exalted',
    'بر': 'The Source of Goodness',
    'تواب': 'The Ever-Accepting of Repentance',
    'منتقم': 'The Avenger',
    'عفو': 'The Pardoner',
    'رؤوف': 'The Most Kind',
    'مالك الملك': 'Owner of All Sovereignty',
    'ذو الجلال والإكرام': 'Owner of Majesty and Honour',
    'مقسط': 'The Equitable',
    'جامع': 'The Gatherer',
    'غني': 'The Self-Sufficient',
    'مغني': 'The Enricher',
    'مانع': 'The Preventer',
    'ضار': 'The Bringer of Adversity',
    'نافع': 'The Bringer of Benefit',
    'نور': 'The Light',
    'هادي': 'The Guide',
    'بديع': 'The Incomparable Originator',
    'باقي': 'The Everlasting',
    'وارث': 'The Inheritor',
    'رشيد': 'The Guide to the Right Path',
    'صبور': 'The Most Patient',
  },
  hi: {
    'رحمن': 'Sab se zyada Meherban',
    'رحيم': 'Sab se zyada Raheem',
    'ملك': 'Badshah',
    'قدوس': 'Sab se zyada Paak',
    'سلام': 'Aman ki jad',
    'مؤمن': 'Hifazat dene wala',
    'مهيمن': 'Sab par Nigahban',
    'عزيز': 'Sab se Zabardast',
    'جبار': 'Jo Majboor karne wala hai',
    'متكبر': 'Sab se zyada Bada',
    'خالق': 'Paida karne wala',
    'بارئ': 'Banane wala',
    'مصور': 'Shaklein banane wala',
    'غفار': 'Baar baar Maaf karne wala',
    'قهار': 'Sab ko Dabane wala',
    'وهاب': 'Dene wala',
    'رزاق': 'Rozi dene wala',
    'فتاح': 'Kholne wala',
    'عليم': 'Sab jaanne wala',
    'قابض': 'Rokne wala',
    'باسط': 'Phailane wala',
    'خافض': 'Jo Neeche karta hai',
    'رافع': 'Jo Upar uthata hai',
    'معز': 'Izzat dene wala',
    'مذل': 'Zillat dene wala',
    'سميع': 'Sab sunne wala',
    'بصير': 'Sab dekhne wala',
    'حكم': 'Faisla karne wala',
    'عدل': 'Bilkul Insaaf karne wala',
    'لطيف': 'Narm aur Meherban',
    'خبير': 'Sab se Waqif',
    'حليم': 'Bardasht karne wala',
    'عظيم': 'Sab se Azeem',
    'غفور': 'Sab ko Maaf karne wala',
    'شكور': 'Sab se zyada Qadr karne wala',
    'علي': 'Sab se Uncha',
    'كبير': 'Sab se Bada',
    'حفيظ': 'Hifazat karne wala',
    'مقيت': 'Palne wala',
    'حسيب': 'Hisaab lene wala',
    'جليل': 'Jalal wala',
    'كريم': 'Sab se zyada Kareem',
    'رقيب': 'Nigah rakhne wala',
    'مجيب': 'Dua qubool karne wala',
    'واسع': 'Sab ko Gherne wala',
    'حكيم': 'Sab se zyada Hakeem',
    'ودود': 'Sab se zyada Mohabbat karne wala',
    'مجيد': 'Sab se zyada Shaan wala',
    'باعث': 'Dobara zinda karne wala',
    'شهيد': 'Gawah',
    'حق': 'Haq',
    'وكيل': 'Kaam sambhalne wala',
    'قوي': 'Sab se zyada Taqatwar',
    'متين': 'Mazboot',
    'ولي': 'Hifazat karne wala Dost',
    'حميد': 'Tareef ke layak',
    'محصي': 'Har cheez ginne wala',
    'مبدئ': 'Creation ko shuru karne wala',
    'معيد': 'Wapas lane wala',
    'محيي': 'Zindagi dene wala',
    'مميت': 'Maut dene wala',
    'حي': 'Hamesha Zinda rehne wala',
    'قيوم': 'Khud Qayam rehne wala',
    'واجد': 'Paane wala',
    'ماجد': 'Shaan wala',
    'واحد': 'Ek',
    'أحد': 'Jo Ek hai, kabhi bat-ta nahi',
    'صمد': 'Hamesha ki Panaah',
    'قادر': 'Qudrat rakhne wala',
    'مقتدر': 'Har cheez par Qadir',
    'مقدم': 'Jo Aage karta hai',
    'مؤخر': 'Jo Peeche karta hai',
    'أول': 'Pehla',
    'آخر': 'Aakhri',
    'ظاهر': 'Zaahir',
    'باطن': 'Chhupa hua',
    'والي': 'Sarparast',
    'متعالي': 'Sab se Buland',
    'بر': 'Bhalai ki jad',
    'تواب': 'Hamesha Tauba qubool karne wala',
    'منتقم': 'Badla lene wala',
    'عفو': 'Maaf karne wala',
    'رؤوف': 'Sab se zyada Narm',
    'مالك الملك': 'Saari Badshahat ka Malik',
    'ذو الجلال والإكرام': 'Jalal aur Izzat ka Malik',
    'مقسط': 'Insaaf karne wala',
    'جامع': 'Jama karne wala',
    'غني': 'Jo kisi ka Mohtaaj nahi',
    'مغني': 'Ameer karne wala',
    'مانع': 'Rokne wala',
    'ضار': 'Nuksaan pahunchane wala',
    'نافع': 'Faida pahunchane wala',
    'نور': 'Roshni',
    'هادي': 'Raasta dikhane wala',
    'بديع': 'Be-misaal tareeke se banane wala',
    'باقي': 'Hamesha rehne wala',
    'وارث': 'Waris',
    'رشيد': 'Seedhe raaste ki taraf le jane wala',
    'صبور': 'Sab se zyada Sabr karne wala',
  },
  bn: {
    'رحمن': 'সবচেয়ে দয়ালু',
    'رحيم': 'সবচেয়ে করুণাময়',
    'ملك': 'বাদশাহ',
    'قدوس': 'সবচেয়ে পবিত্র',
    'سلام': 'শান্তির উৎস',
    'مؤمن': 'নিরাপত্তা দানকারী',
    'مهيمن': 'সবার অভিভাবক',
    'عزيز': 'পরাক্রমশালী',
    'جبار': 'যিনি বাধ্য করেন',
    'متكبر': 'মহত্ত্বে সর্বোচ্চ',
    'خالق': 'সৃষ্টিকর্তা',
    'بارئ': 'স্রষ্টা',
    'مصور': 'আকৃতি দানকারী',
    'غفار': 'বারবার ক্ষমাকারী',
    'قهار': 'যিনি দমন করেন',
    'وهاب': 'দানকারী',
    'رزاق': 'রিজিকদাতা',
    'فتاح': 'যিনি খোলেন',
    'عليم': 'সর্বজ্ঞ',
    'قابض': 'যিনি আটকে রাখেন',
    'باسط': 'যিনি প্রসারিত করেন',
    'خافض': 'যিনি নামান',
    'رافع': 'যিনি তোলেন',
    'معز': 'সম্মান দানকারী',
    'مذل': 'অপমান দানকারী',
    'سميع': 'সর্বশ্রোতা',
    'بصير': 'সর্বদ্রষ্টা',
    'حكم': 'বিচারক',
    'عدل': 'সম্পূর্ণ ন্যায়পরায়ণ',
    'لطيف': 'সূক্ষ্ম ও দয়ালু',
    'خبير': 'সব জানেন যিনি',
    'حليم': 'সহনশীল',
    'عظيم': 'মহান',
    'غفور': 'সর্বক্ষমাশীল',
    'شكور': 'সবচেয়ে কৃতজ্ঞ',
    'علي': 'সর্বোচ্চ',
    'كبير': 'সর্বশ্রেষ্ঠ',
    'حفيظ': 'রক্ষাকারী',
    'مقيت': 'লালনকারী',
    'حسيب': 'হিসাব গ্রহণকারী',
    'جليل': 'মহিমান্বিত',
    'كريم': 'সবচেয়ে দানশীল',
    'رقيب': 'পর্যবেক্ষক',
    'مجيب': 'প্রার্থনার উত্তরদাতা',
    'واسع': 'সর্বব্যাপী',
    'حكيم': 'সর্বজ্ঞানী',
    'ودود': 'সবচেয়ে প্রেমময়',
    'مجيد': 'মহিমাময়',
    'باعث': 'পুনরুত্থানকারী',
    'شهيد': 'সাক্ষী',
    'حق': 'সত্য',
    'وكيل': 'অভিভাবক',
    'قوي': 'সর্বশক্তিমান',
    'متين': 'দৃঢ়',
    'ولي': 'রক্ষাকারী বন্ধু',
    'حميد': 'প্রশংসার যোগ্য',
    'محصي': 'যিনি সব গোনেন',
    'مبدئ': 'সৃষ্টির সূচনাকারী',
    'معيد': 'পুনরুদ্ধারকারী',
    'محيي': 'জীবনদাতা',
    'مميت': 'মৃত্যুদাতা',
    'حي': 'চিরজীবী',
    'قيوم': 'স্বয়ংসম্পূর্ণ',
    'واجد': 'যিনি পান',
    'ماجد': 'মহিমান্বিত',
    'واحد': 'এক',
    'أحد': 'অবিভাজ্য এক',
    'صمد': 'চিরন্তন আশ্রয়',
    'قادر': 'সক্ষম',
    'مقتدر': 'সর্বশক্তিমান',
    'مقدم': 'যিনি এগিয়ে আনেন',
    'مؤخر': 'যিনি পিছিয়ে দেন',
    'أول': 'প্রথম',
    'آخر': 'শেষ',
    'ظاهر': 'প্রকাশ্য',
    'باطن': 'গোপন',
    'والي': 'অভিভাবক',
    'متعالي': 'সর্বোচ্চ',
    'بر': 'কল্যাণের উৎস',
    'تواب': 'তওবা গ্রহণকারী',
    'منتقم': 'প্রতিশোধ গ্রহণকারী',
    'عفو': 'ক্ষমাকারী',
    'رؤوف': 'সবচেয়ে দয়ালু',
    'مالك الملك': 'সমস্ত সার্বভৌমত্বের মালিক',
    'ذو الجلال والإكرام': 'মহিমা ও সম্মানের মালিক',
    'مقسط': 'ন্যায়পরায়ণ',
    'جامع': 'একত্রকারী',
    'غني': 'স্বয়ংসম্পূর্ণ',
    'مغني': 'সমৃদ্ধকারী',
    'مانع': 'যিনি বাধা দেন',
    'ضار': 'ক্ষতিকারক',
    'نافع': 'উপকারী',
    'نور': 'আলো',
    'هادي': 'পথপ্রদর্শক',
    'بديع': 'অতুলনীয় স্রষ্টা',
    'باقي': 'চিরস্থায়ী',
    'وارث': 'উত্তরাধিকারী',
    'رشيد': 'সঠিক পথের পথপ্রদর্শক',
    'صبور': 'সবচেয়ে ধৈর্যশীল',
  },
  ur: {
    'رحمن': 'سب سے زیادہ رحم کرنے والا',
    'رحيم': 'بہت رحم کرنے والا',
    'ملك': 'بادشاہ',
    'قدوس': 'بہت پاک',
    'سلام': 'سلامتی دینے والا',
    'مؤمن': 'امن دینے والا',
    'مهيمن': 'سب پر نگہبان',
    'عزيز': 'زبردست',
    'جبار': 'سب پر غالب',
    'متكبر': 'بڑائی والا',
    'خالق': 'پیدا کرنے والا',
    'بارئ': 'بنانے والا',
    'مصور': 'صورتیں بنانے والا',
    'غفار': 'بار بار بخشنے والا',
    'قهار': 'سب پر غالب',
    'وهاب': 'بہت عطا کرنے والا',
    'رزاق': 'رزق دینے والا',
    'فتاح': 'کھولنے والا',
    'عليم': 'سب جاننے والا',
    'قابض': 'روکنے والا',
    'باسط': 'کشادہ کرنے والا',
    'خافض': 'نیچا کرنے والا',
    'رافع': 'اونچا کرنے والا',
    'معز': 'عزت دینے والا',
    'مذل': 'ذلت دینے والا',
    'سميع': 'سب سننے والا',
    'بصير': 'سب دیکھنے والا',
    'حكم': 'فیصلہ کرنے والا',
    'عدل': 'پورا انصاف کرنے والا',
    'لطيف': 'مہربان اور باریک بین',
    'خبير': 'سب سے باخبر',
    'حليم': 'بردبار',
    'عظيم': 'بہت بڑا',
    'غفور': 'بہت بخشنے والا',
    'شكور': 'بہت قدر کرنے والا',
    'علي': 'سب سے بلند',
    'كبير': 'سب سے بڑا',
    'حفيظ': 'حفاظت کرنے والا',
    'مقيت': 'روزی دینے والا',
    'حسيب': 'حساب لینے والا',
    'جليل': 'عظمت والا',
    'كريم': 'بہت کرم کرنے والا',
    'رقيب': 'نگرانی کرنے والا',
    'مجيب': 'دعا قبول کرنے والا',
    'واسع': 'سب پر محیط',
    'حكيم': 'حکمت والا',
    'ودود': 'بہت محبت کرنے والا',
    'مجيد': 'بزرگی والا',
    'باعث': 'اٹھانے والا',
    'شهيد': 'گواہ',
    'حق': 'سچ',
    'وكيل': 'کارساز',
    'قوي': 'بہت طاقتور',
    'متين': 'مضبوط',
    'ولي': 'دوست اور مددگار',
    'حميد': 'تعریف کے لائق',
    'محصي': 'سب کچھ گننے والا',
    'مبدئ': 'تخلیق شروع کرنے والا',
    'معيد': 'دوبارہ پیدا کرنے والا',
    'محيي': 'زندگی دینے والا',
    'مميت': 'موت دینے والا',
    'حي': 'ہمیشہ زندہ',
    'قيوم': 'سب کو قائم رکھنے والا',
    'واجد': 'پانے والا',
    'ماجد': 'بزرگی والا',
    'واحد': 'ایک',
    'أحد': 'یکتا',
    'صمد': 'بے نیاز',
    'قادر': 'قادر',
    'مقتدر': 'پوری قدرت والا',
    'مقدم': 'آگے کرنے والا',
    'مؤخر': 'پیچھے کرنے والا',
    'أول': 'پہلا',
    'آخر': 'آخری',
    'ظاهر': 'ظاہر',
    'باطن': 'چھپا ہوا',
    'والي': 'والی اور سرپرست',
    'متعالي': 'سب سے بلند',
    'بر': 'نیکی کرنے والا',
    'تواب': 'توبہ قبول کرنے والا',
    'منتقم': 'بدلہ لینے والا',
    'عفو': 'معاف کرنے والا',
    'رؤوف': 'بہت مہربان',
    'مالك الملك': 'تمام بادشاہت کا مالک',
    'ذو الجلال والإكرام': 'عظمت اور کرم کا مالک',
    'مقسط': 'انصاف کرنے والا',
    'جامع': 'جمع کرنے والا',
    'غني': 'بے نیاز',
    'مغني': 'بے نیاز کرنے والا',
    'مانع': 'روکنے والا',
    'ضار': 'نقصان پہنچانے والا',
    'نافع': 'فائدہ پہنچانے والا',
    'نور': 'نور',
    'هادي': 'ہدایت دینے والا',
    'بديع': 'بے مثال پیدا کرنے والا',
    'باقي': 'ہمیشہ رہنے والا',
    'وارث': 'وارث',
    'رشيد': 'سیدھے راستے کی طرف لے جانے والا',
    'صبور': 'بہت صبر کرنے والا',
  },
};

/** Localized short meaning of one Name, by its bare Arabic form. Falls back to the stored English. */
export function localizeAsmaMeaning(bare: string, englishMeaning: string, lang: SiteLanguage): string {
  if (lang === 'en') return englishMeaning;
  return ASMA_MEANINGS[lang][bare] ?? ASMA_MEANINGS.en[bare] ?? englishMeaning;
}

/** Localized first-person intro of one filled Tier B tool, by its tool key. */
export function localizeAlAsrarIntro(toolKey: string, englishIntro: string, lang: SiteLanguage): string {
  return tTools(`tools.data.alAsrarIntro.${toolKey}`, lang) === `tools.data.alAsrarIntro.${toolKey}`
    ? englishIntro
    : tTools(`tools.data.alAsrarIntro.${toolKey}`, lang);
}

/** Localized title/caption/note of one talisman figure, by its figure id. */
export function localizeFigure(
  figure: { id: string; title: string; caption: string; note?: string },
  lang: SiteLanguage,
): { title: string; caption: string; note?: string } {
  const title = tTools(`tools.data.figureTitle.${figure.id}`, lang);
  const caption = tTools(`tools.data.figureCaption.${figure.id}`, lang);
  const noteKey = `tools.data.figureNote.${figure.id}`;
  const note = tTools(noteKey, lang);
  return {
    title: title === `tools.data.figureTitle.${figure.id}` ? figure.title : title,
    caption: caption === `tools.data.figureCaption.${figure.id}` ? figure.caption : caption,
    note: figure.note ? (note === noteKey ? figure.note : note) : undefined,
  };
}

/** Localized planet name, by planet id (saturn, jupiter, mars, sun, venus, mercury, moon). */
export function localizePlanetName(id: string, englishName: string, lang: SiteLanguage): string {
  const name = tTools(`tools.data.planet.${id}`, lang);
  return name === `tools.data.planet.${id}` ? englishName : name;
}

/** Localized weekday name from its English name (Sunday … Saturday). */
export function localizeDayName(englishDay: string, lang: SiteLanguage): string {
  const key = `tools.data.dayName.${englishDay.toLowerCase()}`;
  const name = tTools(key, lang);
  return name === key ? englishDay : name;
}

/** Localized zodiac sign name, by sign index (0 Aries … 11 Pisces). */
export function localizeZodiacName(index: number, englishName: string, lang: SiteLanguage): string {
  const key = `tools.data.zodiac.${index}`;
  const name = tTools(key, lang);
  return name === key ? englishName : name;
}

/** Localized element name (fire, earth, air, water). */
export function localizeElement(element: string, lang: SiteLanguage): string {
  const key = `tools.data.element.${element.toLowerCase()}`;
  const name = tTools(key, lang);
  return name === key ? element : name;
}

/** Localized moon phase name, from the English name the astronomy util returns. */
export function localizePhaseName(phaseName: string, lang: SiteLanguage): string {
  const map: Record<string, string> = {
    'New Moon': 'newMoon',
    'Waxing Crescent': 'waxingCrescent',
    'First Quarter': 'firstQuarter',
    'Waxing Gibbous': 'waxingGibbous',
    'Full Moon': 'fullMoon',
    'Waning Gibbous': 'waningGibbous',
    'Last Quarter': 'lastQuarter',
    'Waning Crescent': 'waningCrescent',
  };
  const slug = map[phaseName];
  if (!slug) return phaseName;
  return tTools(`tools.data.phase.${slug}`, lang);
}

/** Localized moon method line, from the exact English string the astronomy util returns. */
export function localizeMoonMethod(method: string, lang: SiteLanguage): string {
  if (method === I18N_TOOLS.en['tools.data.moonMethod']) return tTools('tools.data.moonMethod', lang);
  return method;
}

/** Localized Hijri method line, from the exact English string the astronomy util returns. */
export function localizeHijriMethod(method: string, lang: SiteLanguage): string {
  if (method === I18N_TOOLS.en['tools.data.hijriMethod']) return tTools('tools.data.hijriMethod', lang);
  return method;
}

/** Localized Hijri note, from the exact English string the astronomy util returns. */
export function localizeHijriNote(note: string, lang: SiteLanguage): string {
  if (note === I18N_TOOLS.en['tools.data.hijriNote']) return tTools('tools.data.hijriNote', lang);
  return note;
}

/** Localized "Sun does not rise/set" reason, from the exact English string the astronomy util returns. */
export function localizeSunReason(reason: string, lang: SiteLanguage): string {
  if (reason === I18N_TOOLS.en['tools.data.sunNoSet']) return tTools('tools.data.sunNoSet', lang);
  if (reason === I18N_TOOLS.en['tools.data.sunNoRise']) return tTools('tools.data.sunNoRise', lang);
  if (reason === I18N_TOOLS.en['tools.data.sunRisesNoSet']) return tTools('tools.data.sunRisesNoSet', lang);
  if (reason === I18N_TOOLS.en['tools.today.defaultReason']) return tTools('tools.today.defaultReason', lang);
  return reason;
}

/** Localized counting rule, matched against the English rule text (NORMALIZATION_RULES order). */
export function localizeNormalizationRule(rule: string, lang: SiteLanguage): string {
  for (let i = 1; i <= 7; i += 1) {
    if (I18N_TOOLS.en[`tools.data.normRule.${i}`] === rule) {
      return tTools(`tools.data.normRule.${i}`, lang);
    }
  }
  return rule;
}

/** Localized label + note of one unsupported square mode, by its mode id. */
export function localizeUnsupportedMode(
  mode: { id: string; label: string; note: string },
  lang: SiteLanguage,
): { label: string; note: string } {
  const slugMap: Record<string, string> = {
    multiplied: 'multiplied',
    cycling: 'cycling',
    'hollow centre': 'hollowCentre',
    'grand wafq': 'grandWafq',
  };
  const slug = slugMap[mode.id];
  if (!slug) return { label: mode.label, note: mode.note };
  return {
    label: tTools(`tools.data.unsupported.${slug}.label`, lang),
    note: tTools(`tools.data.unsupported.${slug}.note`, lang),
  };
}

/** Localized import error, matched against the exact English string toolsStorage returns. */
export function localizeImportError(error: string, lang: SiteLanguage): string {
  const map: Record<string, string> = {
    [I18N_TOOLS.en['tools.data.importError.notJson']]: 'notJson',
    [I18N_TOOLS.en['tools.data.importError.noToolsData']]: 'noToolsData',
    [I18N_TOOLS.en['tools.data.importError.noEntries']]: 'noEntries',
    [I18N_TOOLS.en['tools.data.importError.journalShape']]: 'journalShape',
    [I18N_TOOLS.en['tools.data.importError.wirdShape']]: 'wirdShape',
    [I18N_TOOLS.en['tools.data.importError.grimoireShape']]: 'grimoireShape',
  };
  const slug = map[error];
  if (!slug) return error;
  return tTools(`tools.data.importError.${slug}`, lang);
}

/**
 * Localized Forge refusal reason. The generator builds the English reason
 * from templates with numbers; each template is recognised here and rebuilt
 * in the reader's language with the same numbers. Unknown text passes through.
 */
export function localizeForgeReason(reason: string, lang: SiteLanguage): string {
  if (lang === 'en') return reason;
  let m = reason.match(
    /^Order (\d+) is not supported\. Orders 3 to 20 only, and order 2 has no magic square at all\.$/,
  );
  if (m) return tfTools('tools.forge.reasonOrderUnsupported', lang, { order: m[1] });
  m = reason.match(/^No documented construction is implemented for order (\d+), so no square is made\.$/);
  if (m) return tfTools('tools.forge.reasonNoConstruction', lang, { order: m[1] });
  if (reason === 'The target sum must be a whole positive number.') {
    return tTools('tools.forge.reasonTargetNotWhole', lang);
  }
  m = reason.match(
    /^Target (\d+) cannot be reached for a (\d+)x\d+ square\. The base square sums to (\d+), and shifting every cell by the same whole number changes each line by a multiple of \d+, so \d+ cannot be reached that way\. Pick a target that differs from \d+ by a multiple of \d+\.$/,
  );
  if (m) {
    return tfTools('tools.forge.reasonUnreachable', lang, { target: m[1], order: m[2], base: m[3] });
  }
  m = reason.match(
    /^Target (\d+) is below the base sum (\d+) for a (\d+)x\d+ square\. Reaching it would need a shift of (-?\d+), which would make the smallest cell zero or negative\. Only targets of \d+ or more can be made this way\.$/,
  );
  if (m) {
    return tfTools('tools.forge.reasonBelowBase', lang, {
      target: m[1],
      base: m[2],
      order: m[3],
      offset: m[4],
    });
  }
  return reason;
}

/**
 * Localized validator failure line. The validator builds the English line
 * from templates with numbers; each template is recognised here and rebuilt
 * in the reader's language with the same numbers. Unknown text passes through.
 */
export function localizeValidationFailure(failure: string, lang: SiteLanguage): string {
  if (lang === 'en') return failure;
  if (failure === 'The grid is not square: every row must have the same number of cells as there are rows.') {
    return tTools('tools.forge.failNotSquare', lang);
  }
  if (failure === 'Some cells are not positive whole numbers.') {
    return tTools('tools.forge.failSomeNotWhole', lang);
  }
  if (failure === 'Not all numbers are different.') {
    return tTools('tools.forge.failNotDistinct', lang);
  }
  let m = failure.match(/^Cell row (\d+), column (\d+) is not a positive whole number\.$/);
  if (m) return tfTools('tools.forge.failCell', lang, { r: m[1], c: m[2] });
  m = failure.match(/^The number (\d+) appears more than once\.$/);
  if (m) return tfTools('tools.forge.failRepeated', lang, { value: m[1] });
  m = failure.match(/^Row (\d+) sums to (\d+), not (\d+)\.$/);
  if (m) return tfTools('tools.forge.failRow', lang, { n: m[1], sum: m[2], target: m[3] });
  m = failure.match(/^Column (\d+) sums to (\d+), not (\d+)\.$/);
  if (m) return tfTools('tools.forge.failColumn', lang, { n: m[1], sum: m[2], target: m[3] });
  m = failure.match(/^Diagonal \(top-left to bottom-right\) sums to (\d+), not (\d+)\.$/);
  if (m) return tfTools('tools.forge.failDiag1', lang, { sum: m[1], target: m[2] });
  m = failure.match(/^Diagonal \(top-right to bottom-left\) sums to (\d+), not (\d+)\.$/);
  if (m) return tfTools('tools.forge.failDiag2', lang, { sum: m[1], target: m[2] });
  return failure;
}

