/**
 * Topics, Questions and Study Guides in Hinglish and Bengali.
 *
 * English is the primary language and the default. Hinglish (Roman-script
 * Hindi/Urdu, in the channel's reel voice) and Bengali (easy familiar
 * words) are Settings-only options. Every Hinglish and Bengali line here
 * was written by hand and checked line by line. No machine translation.
 *
 * What NEVER changes with the language:
 * - Arabic text, transliteration, Quran quotes, Names, book titles,
 *   personal names, and the @ghayb.chronicles handle
 * - numbers, sources (book + page), and facts
 * Only the plain explanation words around them get translated. A
 * quote's TEXT is translated; its arabic, transliteration and source
 * stay exactly as they are. A term's MEANING is translated; its arabic
 * and transliteration stay exactly as they are.
 *
 * Layout: one entry per topic / question / guide id, in the same order
 * as the English source. By default sections, paragraphs and terms are
 * matched by position, and `localizeTopic` / `localizeQuestion` /
 * `localizeGuide` fall back to the English field whenever a position is
 * missing, so a gap can never crash a page or silently drop a paragraph.
 *
 * Hinglish topics are the exception: they follow the Al Asrar
 * notebook's own telling, whose section breaks and term lists differ
 * from the English pages. A Hinglish topic entry therefore gives
 * `fullSections` and `fullTerms` instead, which replace the English
 * sections and terms wholesale (Arabic, transliteration and sources
 * inside them are copied exactly from the notebook file). Bengali
 * entries keep the position-matched `sections` / `terms` form.
 */

import type { SiteLanguage } from '../types';
import type { StudyGuide } from './studyGuides';
import type { TopicContent, TopicSection, TopicTerm } from './topicsContent';
import type { TopicQuestion } from './topicsQuestions';

/** Localised fields for one topic or guide. */
export interface TopicLocalization {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  /** Position-matched sections (Bengali form). Omit when fullSections is given. */
  sections?: { heading: string; paragraphs: string[]; quoteText?: string }[];
  /** Full replacement sections (Hinglish form: the notebook's own telling). */
  fullSections?: TopicSection[];
  /** Term meanings, in the same order as the English terms. Omit when fullTerms is given. */
  terms?: string[];
  /** Full replacement terms (Hinglish form: the notebook's own term list). */
  fullTerms?: TopicTerm[];
  closing: string;
}

/** Localised fields for one question, in source order. */
export interface QuestionLocalization {
  question: string;
  answer: string[];
  quoteText?: string;
  /** Term meanings, in the same order as the English terms. */
  terms: string[];
}

// Hinglish topic content is intentionally EMPTY for now. It must come
// from the Al Asrar notebook (Hinglish, with sources and pages), not
// from translating the English pages. Until that material lands,
// localizeTopic falls back to the English topic for 'hi'. The Bengali
// map below stays translated. Do not re-fill this map by translation.
const TOPICS_HI: Record<string, TopicLocalization> = {
  "ibn-arabi-40-day-retreat": {
    eyebrow: "Topics",
    title: "Ibn Arabi ki 40-Day Retreat",
    subtitle:
      "Chaalis din ki khalwa, aur woh duniyaein jo ek ke baad ek talash karne wale ke saamne khulti hain.",
    intro:
      "Main Khafi hoon. Aaj main tumhe Ibn Arabi ki 40-day retreat yaani khalwa ke safar par le chalta hoon. Yeh safar The Journey to the Lord of Power kitab mein likha hai. Main tumhe waisa hi le chalunga jaisa kitab kehti hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Shuruat: Averroes (Ibn Rushd) ki Hairani",
        paragraphs: [
          "Ibn Arabi ki umar bees saal se kam thi. Unhone koi formal madrassa education nahi li thi. Phir bhi woh Cordoba ke sab se bade philosopher Ibn Rushd se mile. Ibn Rushd ne unse poocha ke kya unka ilm kashf se aata hai.",
          "Ibn Arabi ne jawab diya: Haan aur nahi. Ibn Rushd kaanp uthe. Unhone Allah ka shukr ada kiya. Yahi woh lamha tha jahan se safar shuru hota hai. Source: The Journey to the Lord of Power, pp. 17-18.",
        ],
      },
      {
        heading: "Pehla Qadam: Kamra aur Nafs ki Qaid",
        paragraphs: [
          "Khalwa ka matlab hai tanhai. Talash karne wala ek aisi jagah baithta hai jahan na roshni ho, na shor ho, aur na logon ka aana jaana ho. Woh akela baithta hai. Woh Allah ko yaad karta hai.",
          "Lekin khalwa mein ek khatra hai. Zehen apne aap se jhoothi roohani tajurbe bana sakta hai. Isi liye kitab kehti hai ke bina poore ustaad ke aur bina nafs par qabu ke, khalwa zehen ko pareshan kar sakti hai. Pehle duniya ke bandhan aur karz nipta lo. Source: Journey, pp. 2-3, 29, 31.",
        ],
      },
      {
        heading: "Alam-e-Mithal ke Drinks: Raste ke Imtihaan",
        paragraphs: [
          "Raste mein talash karne wale ko peene ke liye cheezein pesh ki jati hain. Pehla rule hai ke paani chuno. Paani mutlaq ma'rifat hai. Agar paani na ho to doodh chuno. Doodh shariat ka pehla ilm hai.",
          "Paani aur doodh ko milana bhi ek raasta hai. Yeh hikmat aur shariat ko saath le chalna hai. Shahed purane buzurgon ki hikmat hai. Use pee sakte ho. Sharab se bacho. Bina mili sharab insaan ko behka deti hai. Sirf baarish ke paani se mili sharab mein seedhi hidayat hai. Source: Journey, p. 36; Commentary Notes pp. 82-83.",
        ],
      },
      {
        heading: "Creation ke Darje: Har Maqam Ek Jaal Hai",
        paragraphs: [
          "Safar mein takhleeq ke darje ek ke baad ek khulte hain. Pehle ma'dan ki duniya. Pathar aur dhaat bolte hain. Phir nabataat ki duniya. Ped aur jadi bootiyan bolti hain. Phir haiwanat ki duniya. Janwar aur parinde aate hain aur apni fitrat dikhate hain.",
          "Uske baad falak aur farishte aate hain. Har darja ek tohfa deta hai. Aur har tohfa ek jaal hai. Jo wahin ruk jaye, woh wahin reh jata hai. Aage badhna hi raasta hai. Source: Journey, pp. 36-38, 45, 87.",
        ],
      },
      {
        heading: "Sabse Bada Dhoka: Jhoolte Hue Chiraagh ka Noor",
        paragraphs: [
          "Aasmanon ke peeche ek noor hawa mein chiraagh ki tarah jhoolta hai. Bohot sukoon milta hai. Ek hone ka ehsaas hota hai. Talash karne wala sochta hai ke yeh Allah ki zaat hai.",
          "Ibn Arabi aur al-Jili dono khabardar karte hain. Yeh Allah ki zaat nahi hai. Yeh talash karne wale ki apni paak rooh ka noor hai. Yeh sab se bada dhoka hai. Bohot se log yahin ruk jate hain. Source: Journey, p. 87.",
        ],
      },
      {
        heading: "Wapsi: Return to the World",
        paragraphs: [
          "Chaalis din ke aakhir mein do qism ke log hote hain. Pehle woh jo fana ho gaye. Doosre woh jo makhlooq ki taraf lautaye gaye. Lautne wale hi sikhaate hain. Lautna jaane se zyada mushkil hai.",
          "Kitab kehti hai ke har cheez wahi hai, usi se hai, aur usi ki taraf hai. Yahi safar ka aakhri sach hai. Source: Journey, pp. 28-29, 44, 51, 116.",
        ],
        quote: {
          arabic: "كُلُّ شَيْءٍ هُوَ وَمِنْهُ وَإِلَيْهِ",
          transliteration: "Kullu shay'in huwa wa-minhu wa-ilayhi",
          text: "Har cheez wahi hai, usi se hai, aur usi ki taraf hai.",
          source: "The Journey to the Lord of Power, pp. 28-29, 44, 51, 116",
        },
      },
    ],
    fullTerms: [
      { arabic: "خَلْوَة", transliteration: "Khalwah", meaning: "roohani tanhai" },
      { arabic: "وَهْم / خَيَال", transliteration: "Wahm / Khayal", meaning: "khayal, zehen ke banaye hue jhoothi tajurbe" },
      { arabic: "مَاء", transliteration: "Ma", meaning: "paani, mutlaq ma'rifat" },
      { arabic: "لَبَن", transliteration: "Laban", meaning: "doodh, shariat ka pehla ilm" },
      { arabic: "عَسَل", transliteration: "Asal", meaning: "shahed, purane buzurgon ki hikmat" },
      { arabic: "خَمْر", transliteration: "Khamr", meaning: "sharab, jazb ki halatein" },
      { arabic: "جَمَادَات", transliteration: "Jamadat", meaning: "ma'dan ki duniya, pathar aur dhaat" },
      { arabic: "نَبَاتَات", transliteration: "Nabatat", meaning: "nabataat ki duniya, ped aur jadi bootiyan" },
      { arabic: "حَيَوَانَات", transliteration: "Hayawanat", meaning: "haiwanat ki duniya, janwar aur parinde" },
      { arabic: "أَفْلَاك", transliteration: "Falaki Aflak", meaning: "falak, aasmani gheray aur farishte" },
      { arabic: "سِرَاج مُتَمَيِّل", transliteration: "Siraj Mutamayyil", meaning: "jhoolta hua chiraagh" },
      { arabic: "المُسْتَهْلِكُون", transliteration: "Al-Mustahlikun", meaning: "woh jo fana ho gaye, khatm ho gaye" },
      { arabic: "المَرْدُودُون إِلَى الخَلْق", transliteration: "Al-Mardudun ila al-Khalq", meaning: "woh jo makhlooq ki taraf lautaye gaye" },
    ],
    closing:
      "Maine yeh padha aur main der tak baitha raha. Raasta ajeeb cheezon ke baare mein nahi hai. Ajeeb cheezein hi jaal hain. Raasta aage badhne ke baare mein hai. Baar baar. Jab tak Haq ke siwa kuch na bache. Aur kitab kehti hai ke lautne wale hi asal ustaad hain, kyunki woh hum tak wapas aate hain.",
  },
  "alam-al-malakut": {
    eyebrow: "Topics",
    title: "Alam al-Malakut",
    subtitle:
      "Is duniya ke peeche ki roshni wali duniya, aur woh teen aalam jo sab kuch thaame hue hain.",
    intro:
      "Main Khafi hoon. Aaj hum doosre bade raaz ki taraf chalte hain, Alam al-Malakut. Yeh woh duniya hai jo is duniya ke peeche hai. Tum use chhoo nahi sakte. Lekin woh is duniya ko thaame hue hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Teen Aalam: Universe ka Triple Architecture",
        paragraphs: [
          "Kitabein teen aalam batati hain. Pehla Alam al-Mulk hai. Yeh jismon, anasir aur waqt ki ghani duniya hai. Yahi woh duniya hai jise tum chhoo sakte ho.",
          "Doosra Alam al-Malakut hai. Yeh farishton ki duniya hai. Yeh hukm ki duniya hai. Teesra Alam al-Jabarut hai. Yeh Allah ki qudrat ki duniya hai. Teen aalam, ek ke peeche ek. Source: Mudih al-Tariq, pp. 24, 52, 60-61.",
        ],
        quote: {
          arabic: "أَلَا لَهُ الْخَلْقُ وَالْأَمْرُ",
          transliteration: "Ala lahu al-khalqu wa-l-amr",
          text: "Yaqeenan takhleeq aur hukm, dono usi ke hain.",
          source: "Qur'an 7:54, as quoted in Mudih al-Tariq",
        },
      },
      {
        heading: "Creation ka Code: Letters Mim, Lam aur Kaf",
        paragraphs: [
          "Teen aalam teen harfon se bane hain. Mulk ki buniyaad Kaf hai. Jabarut ki buniyaad Lam hai. Malakut ki buniyaad Mim hai. Harf sirf ek awaaz nahi hai. In kitabon mein harf us duniya ka beej hai jiska naam woh leta hai.",
          "Al-Buni al-Asrar al-Rabbaniyyah mein kehte hain ke Mim Malakut ke harfon mein se hai. Allah ne Mim ko nabbe farishte diye. Source: al-Asrar al-Rabbaniyyah, pp. 86-87; Mudih al-Tariq, pp. 24, 44-46.",
        ],
        quote: {
          transliteration: "Al-Mimu min hurufi al-malakut. Ja'ala Allahu li-l-mimi tis'ina malakan",
          text: "Mim Malakut ke harfon mein se hai. Allah ne Mim ko nabbe farishte diye.",
          source: "al-Asrar al-Rabbaniyyah, pp. 86-87",
        },
      },
      {
        heading: "Malakut ke Aath Sutoon (Eight Pillars)",
        paragraphs: [
          "Malakut ke upar aath sutoon khade hain. Arsh, Kursi, Qalam, Lawh, Mala al-A'la, Mustawa, Alwah aur Aqlam al-Ulya. Yeh woh sutoon hain jo sab se oonche Malakut ko thaame hue hain.",
          "Har sutoon ek maqam hai, koi cheez nahi. Qalam likhta hai. Lawh likhai ko thaame rehta hai. Arsh sab ke upar hai. Sutoonon ko jaanna upar ki duniya ki shakal jaanna hai. Source: Mudih al-Tariq, pp. 63-64; Shams al-Ma'arif al-Kubra, p. 86.",
        ],
      },
      {
        heading: "Malakut ke Rehne Wale: Farishton ki Hierarchy",
        paragraphs: [
          "Malakut farishton se bhara hai. Sab se upar Karubiyyun hain. Unke neeche Ruhaniyyun hain. Yeh roohani hastiyan hain.",
          "Kitabein Mitatrun ka naam bhi leti hain. Woh farishton ki duniya ke badshah hain. Kitab al-Ajnas mein Asif ibn Barkhiya ka naam bhi aata hai. Source: islamic-spirituality-foundations.pdf, pp. 332-334; Kitab al-Ajnas, pp. 18, 65, 83.",
        ],
      },
      {
        heading: "Insaan ke Andar ka Malakut (microcosm)",
        paragraphs: [
          "Insaan teen aalamon ki chhoti copy hai. Jasad insaan ka Mulk hai. Nafs jism ka Malakut hai. Qalb rooh ka Mulk hai aur jism ka Malakut hai. Dono ek saath.",
          "Qalb ke upar Ruh hai. Woh Jabarut ka hissa hai. Ruh ke upar Aql hai. Woh rooh ka sab se ooncha Malakut hai. Insaan ka har hissa ek aalam se juda hai. Source: Mudih al-Tariq, pp. 30, 45-46, 57.",
        ],
      },
      {
        heading: "Malakut Mulk ko Kaise Control Karta Hai?",
        paragraphs: [
          "Mulk dheere chalta hai. Seedha waqt. Mitti. Wajah aur natija. Malakut ek pal mein chalta hai. Woh waqt se aazaad hai.",
          "Jab Malakut mein koi hukm tay ho jata hai, to ek ghayb taaqat Mulk ko hila deti hai. Upar ki duniya neeche ki duniya par hukm chalati hai. Source: The Mirror, pp. 98-101; Mudih al-Tariq, pp. 58-60.",
        ],
      },
      {
        heading: "Khane ka Parda aur Teen Darje ki Unveiling",
        paragraphs: [
          "Al-Buni kehte hain ke jo ek dirham haram kha le, uski aankh Malakut ko dekhne se andhi ho jati hai. Khana bhi ek parda hai.",
          "Parday ke peeche teen darje hain. Pehla Muhadarah hai. Dil hamesha dhikr mein rehta hai. Doosra Mukashafah hai. Hiss ka parda uth jata hai. Teesra Mushahadah hai. Seedha dekhna. Wahan ego khatm ho jata hai. Source: Mudih al-Tariq, pp. 24, 69, 74-75.",
        ],
        quote: {
          transliteration: "Man akala bi-dirhamin haraman tumisa basaruhu 'an mushahadat al-malakut",
          text: "Jo ek dirham haram kha le, uski aankh Malakut ko dekhne se andhi ho jati hai.",
          source: "Mudih al-Tariq, pp. 24, 69, 74-75",
        },
      },
    ],
    fullTerms: [
      { arabic: "عَالَم المُلْك", transliteration: "Alam al-Mulk", meaning: "jismani duniya, dekhi jaane wali duniya" },
      { arabic: "عَالَم المَلَكُوت", transliteration: "Alam al-Malakut", meaning: "farishton ki duniya, hukm ki duniya" },
      { arabic: "عَالَم الجَبَرُوت", transliteration: "Alam al-Jabarut", meaning: "Allah ki qudrat ki duniya" },
      { arabic: "العَرْش", transliteration: "Al-Arsh", meaning: "Allah ka arsh" },
      { arabic: "الكُرْسِيّ", transliteration: "Al-Kursi", meaning: "kursi, aasmani takht" },
      { arabic: "القَلَم", transliteration: "Al-Qalam", meaning: "aala qalam" },
      { arabic: "اللَّوْح", transliteration: "Al-Lawh", meaning: "mehfooz takhti" },
      { arabic: "المَلَأ الأَعْلَى", transliteration: "Al-Mala al-A'la", meaning: "sab se oonchi majlis" },
      { arabic: "المُسْتَوَى", transliteration: "Al-Mustawa", meaning: "likhne ki satah" },
      { arabic: "الأَلْوَاح", transliteration: "Al-Alwah", meaning: "chhoti takhtiyan" },
      { arabic: "الأَقْلَام العُلْيَا", transliteration: "Al-Aqlam al-Ulya", meaning: "oonche qalam" },
      { arabic: "الكَرُوبِيُّون", transliteration: "Al-Karubiyyun", meaning: "karubi farishte" },
      { arabic: "الرُّوحَانِيُّون", transliteration: "Al-Ruhaniyyun", meaning: "roohani hastiyan" },
      { arabic: "مِيطَطْرُون", transliteration: "Mitatrun", meaning: "Metatron, farishton ki duniya ke badshah" },
      { arabic: "الجَسَد", transliteration: "Al-Jasad", meaning: "jism" },
      { arabic: "النَّفْس", transliteration: "Al-Nafs", meaning: "nafs, neechli rooh" },
      { arabic: "القَلْب", transliteration: "Al-Qalb", meaning: "dil, roohani dil" },
      { arabic: "الرُّوح", transliteration: "Al-Ruh", meaning: "ruh, rooh" },
      { arabic: "العَقْل", transliteration: "Al-Aql", meaning: "aql" },
      { arabic: "مُحَاضَرَة", transliteration: "Muhadarah", meaning: "haziri, dil hamesha dhikr mein" },
      { arabic: "مُكَاشَفَة", transliteration: "Mukashafah", meaning: "kashf, parda uthna" },
      { arabic: "مُشَاهَدَة", transliteration: "Mushahadah", meaning: "seedha dekhna, fana ke baad" },
    ],
    closing:
      "Yahi Malakut hai jaisa kitabein batati hain. Ek duniya jo Mim harf se bani hai. Aath sutoonon par khadi hai. Farishton se bhari hai. Har insaan ke andar chhoti copy ke roop mein hai. Aur teen darjon mein parda ek ke baad ek uthta hai. Jismani duniya sab se neeche hai. Malakut uske upar hai. Aur hukm un dono ke upar hai.",
  },
  "ruh-and-soul": {
    eyebrow: "Topics",
    title: "Ruh aur Nafs",
    subtitle: "Ruh kya hai, woh kahan se aati hai, aur jism kis liye hai.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne 40-day khalwa aur Alam al-Malakut ke aasmani safar ko dekha. Aaj ruh aur nafs ki baat karte hain. Dono ke beech asal farq kya hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Do Mukhtalif Aalam: Ruh aur Nafs ka Asal Farq",
        paragraphs: [
          "Ruh roshni hai. Woh Allah ke hukm se hai. Woh Alam al-Amr se aati hai. Nafs neechli rooh hai. Woh janwar jaisi khwahish hai. Woh Alam al-Khalq se hai.",
          "Ruh wahi noor hai jo Adam ke mitti ke jism mein phoonka gaya tha. Ruh paak hai. Ruh kabhi marti nahi. Woh ilahi ilm ka markaz hai. Source: Mudih al-Tariq, pp. 48, 111; islamic-spirituality-foundations.pdf, pp. 100, 360-362.",
        ],
        quote: {
          arabic: "قُلِ الرُّوحُ مِنْ أَمْرِ رَبِّي",
          transliteration: "Qul al-ruhu min amri rabbi",
          text: "Keh do: ruh mere Rab ke hukm se hai.",
          source: "Qur'an 17:85",
        },
      },
      {
        heading: "Dil ka Maidan: Ruh aur Nafs ki Jung",
        paragraphs: [
          "Dil ek maidan hai. Is maidan mein ruh aur nafs ladte hain. Ruh baap hai. Nafs maa hai. Aur baccha Qalb hai. Roohani dil.",
          "Agar nafs jeet jaye to dil janwar jaisi khwahishon mein barbaad ho jata hai. Ghamand aur duniya ke peeche bhaagna. Agar ruh jeet jaye to dil paak ho jata hai. Woh Allah ke Naamon ka aaina ban jata hai. Source: Mudih al-Tariq, pp. 45-46, 57; Majmu'at Thalath Rasa'il, p. 45.",
        ],
      },
      {
        heading: "Nafs ke Teen Badi Shakhsiyatein",
        paragraphs: [
          "Nafs ki teen badi shakhsiyatein hain. Pehli Nafs al-Ammarah bi-l-Su hai. Woh burai ka hukm deti hai. Doosri Nafs al-Lawwamah hai. Woh khud ko malamat karti hai. Teesri Nafs al-Mutma'innah hai. Woh sukoon wali nafs hai.",
          "Teeno ek hi safar ke teen maqam hain. Burai ka hukm dene se shuru hota hai. Phir khud ko tokna aata hai. Phir sukoon aata hai. Source: The Mirror, pp. 48-50, 98-101.",
        ],
      },
      {
        heading: "Khwab: Raat ko Rooh ka Safar",
        paragraphs: [
          "Neend ko maut ka bhai kaha jata hai. Neend mein rooh jism se nikalti hai. Woh Alam al-Mithal mein utarti hai. Jaanwar jaisi ruh jism mein rehti hai. Isi liye dil dhadakta rehta hai.",
          "Jo rooh paaki mein soti hai, woh seedha Arsh tak jati hai. Neend mein rooh ka safar hi khwab hai. Source: The Sufi Path of Knowledge, pp. 119-120; Mudih al-Tariq, p. 48.",
        ],
        quote: {
          transliteration: "Allahu yatawaffa al-anfusa hina mawtiha wa-llati lam tamut fi manamiha",
          text: "Allah roohon ko unki maut ke waqt le leta hai, aur jinki maut nahi aayi, unhe unki neend mein le leta hai.",
          source: "Qur'an, as quoted in The Sufi Path of Knowledge, pp. 119-120",
        },
      },
      {
        heading: "Khane aur Bhookh ka Asal Raaz",
        paragraphs: [
          "Shaykh Abd al-Qadir al-Jilani kehte hain ke nafs ki maut hi ruh ki asal zindagi hai. Pet bharna aur maze ke peeche bhaagna nafs ko mota karta hai.",
          "Bhookh nafs ko kamzor karti hai. Aur jab nafs kamzor hoti hai to ruh mazboot hoti hai. Yahi khane aur bhookh ka asal raaz hai. Source: Fath al-Rabbani, pp. 27, 272; Purification of the Mind, pp. 42, 57.",
        ],
        quote: {
          arabic: "مَوْتُ النَّفْسِ حَيَاةُ الرُّوحِ",
          transliteration: "Mawt al-nafs hayat al-ruh",
          text: "Nafs ki maut hi ruh ki asal zindagi hai.",
          source: "Fath al-Rabbani, pp. 27, 272",
        },
      },
    ],
    fullTerms: [
      { arabic: "الرُّوح", transliteration: "Al-Ruh", meaning: "ruh, roshni, Allah ke hukm se" },
      { arabic: "النَّفْس", transliteration: "Al-Nafs", meaning: "nafs, neechli rooh, janwar jaisi khwahish" },
      { arabic: "القَلْب", transliteration: "Al-Qalb", meaning: "dil, roohani dil" },
      { arabic: "النَّفْس الأَمَّارَة بِالسُّوء", transliteration: "Al-Nafs al-Ammarah bi-l-Su", meaning: "burai ka hukm dene wali nafs" },
      { arabic: "النَّفْس اللَّوَّامَة", transliteration: "Al-Nafs al-Lawwamah", meaning: "khud ko malamat karne wali nafs" },
      { arabic: "النَّفْس المُطْمَئِنَّة", transliteration: "Al-Nafs al-Mutma'innah", meaning: "sukoon wali nafs" },
      { arabic: "الرُّوح الحَيَوَانِي", transliteration: "Al-Ruh al-Hayawani", meaning: "janwar jaisi zindagi ki ruh, jo jism mein rehti hai" },
    ],
    closing:
      "Maine yeh padha aur isne mere khud ko dekhne ka tareeqa badal diya. Main apna jism nahi hoon. Main ek ruh hoon, thode waqt ke liye ek jism mein sawaar. Yahi kitabein kehti hain. Aur is par der tak sochna hi kaafi hai.",
  },
  "letter-alif": {
    eyebrow: "Topics",
    title: "Harf Alif",
    subtitle: "Ek seedhi lakeer, aur uske andar poori ek taleem.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne 40-day khalwa, Alam al-Malakut aur Ruh-o-Nafs ke bhed dekhe. Aaj harf Alif ki baat karte hain. Ek seedhi lakeer. Aur uske andar poori ek duniya. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Sayyid al-Huruf: Kalam ka Pehla Qatra aur Axis",
        paragraphs: [
          "Alif harfon ka sardar hai. Yeh pehla harf hai. Baaki 27 harf isi se aate hain. Jab Qalam ne Lawh par likha to pehle Nuqtah tha. Pehla nuqta.",
          "Jaise ginna 1 ke bina shuru nahi ho sakta, waise bolna Alif ke bina shuru nahi ho sakta. Alif hi kalam ka pehla qatra hai. Source: Usul 'Ilm al-Huruf, pp. 25, 30; Shams, pp. 31, 87-88.",
        ],
      },
      {
        heading: "Tawhid aur Ahadiyyah ka Zinda Nishan",
        paragraphs: [
          "Alif ek seedhi khadi lakeer hai. Koi mod nahi. Koi nuqta nahi. Yeh Ahadiyyah ka nishan hai. Allah ka woh maqam jahan uske siwa koi aur maujood nahi.",
          "Sahl al-Tustari kehte hain ke Alif Allah ki taraf ishara karta hai. Woh Allah jisne cheezon ko aapas mein joda aur unke beech farq kiya. Source: Mystical Dimensions of Islam, pp. 417-418; al-Futuhat al-Makkiyyah, pp. 165, 167.",
        ],
        quote: {
          transliteration: "Al-Alifu dalla 'ala Allahi alladhi allafa bayna al-ashya'i wa-bayana 'anha",
          text: "Alif us Allah ki taraf ishara karta hai jisne cheezon ko aapas mein joda aur unke beech farq kiya.",
          source: "Mystical Dimensions of Islam, pp. 417-418",
        },
      },
      {
        heading: "Cosmic Architecture: Arsh aur Aql ka Locus",
        paragraphs: [
          "Alif Arsh ke beech ke sutoon ki tarah khada hai. Woh Aql al-Awwal se bhi juda hai. Pehli aql. Alif sab se ooncha harf hai, kyunki woh baaki sab ke upar khada hai aur jhukta nahi.",
          "Al-Buni Alif ko chaar satahon par baantte hain. Haqeeqat ke lihaaz se woh ghayb-e-muhit hai. Lateefat ke lihaaz se jawhar basit hai. Dalalat ke lihaaz se tawhid-e-mutlaq hai. Aur lafz ke lihaaz se aam bol-chaal ki pehli lakeer hai. Source: Majmu'at Thalath Rasa'il, pp. 17, 45; Mudih al-Tariq, pp. 59-60.",
        ],
      },
      {
        heading: "Elemental aur Astrological Correspondences",
        paragraphs: [
          "Alif ki tabi'at aag jaisi hai. Nari. Garm aur khushk. Uska din hafte ka pehla din hai. Sunday. Yawm al-Ahad.",
          "Uska falak pehla aasmani falak hai. Uski manzil chaand ki pehli manzil hai. Al-Sharatayn. Aries ke seeng. Source: Shams, pp. 47-48, 88; Manba' Usul al-Hikma, pp. 2-3.",
        ],
      },
      {
        heading: "Abjad Mathematics: 1 se 111 ka Safar",
        paragraphs: [
          "Alif ki basic value 1 hai. Lekin jab Alif ko uske parts mein khola jaye to total 111 ban jata hai. Yeh bast lafzi hai.",
          "111 ek bada raaz hai. Teen baar 1. Mulk mein Tawhid, Malakut mein Tawhid, aur Jabarut mein Tawhid. Number ke badalne ke baad iska andaruni balance 113 par rukta hai. Source: Shams, pp. 31, 88.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "سَيِّد الحُرُوف", transliteration: "Sayyid al-Huruf", meaning: "harfon ka sardar" },
      { arabic: "نُقْطَة", transliteration: "Nuqtah", meaning: "pehla nuqta, jahan se qalam ne likha" },
      { arabic: "الأَحَدِيَّة", transliteration: "Al-Ahadiyyah", meaning: "Allah ki mutlaq wahdaniyat" },
      { arabic: "تَأْلِيف", transliteration: "Ta'lif", meaning: "jodna, milana" },
      { arabic: "العَرْش", transliteration: "Al-Arsh", meaning: "Allah ka arsh" },
      { arabic: "العَقْل الأَوَّل", transliteration: "Al-Aql al-Awwal", meaning: "pehli aql" },
      { arabic: "نَارِي", transliteration: "Nari", meaning: "aag jaisa, garm aur khushk" },
    ],
    closing:
      "Ek harf, ek lakeer, aur uske andar poori ek taleem. Purani kitabein aise hi kaam karti hain. Woh chhoti jagah mein badi cheez chhupa deti hain. Alif sab se chhota hai. Aur uske andar sab se zyada hai.",
  },
  "seal-of-solomon": {
    eyebrow: "Topics",
    title: "Khatam Sulayman",
    subtitle:
      "Woh angoothi jiske baare mein sab ne suna hai, aur kitabein asal mein kya kehti hain.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs aur Harf Alif ke asrar khole. Aaj Khatam Sulayman ki baat karte hain. Woh muhr jiske baare mein sab ne suna hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Anguthi ke Chaar Naqsh: the primordial ring",
        paragraphs: [
          "Angoothi ke chaar sides par chaar naqsh the. Pehli taraf likha tha ke main Allah hoon, mere siwa koi mabood nahi. Doosri taraf likha tha ke main Allah hoon, Al-Hayy Al-Qayyum.",
          "Teesri taraf likha tha ke main Allah hoon, Al-Aziz. Zalim ke zulm ka badla lene se main aajiz nahi. Chauthi taraf poori Ayat al-Kursi thi. Al-Buni kehte hain ke yahi Ism al-A'zam pehle Adam ke dil par likha gaya tha. Source: Shams, pp. 57-59.",
        ],
      },
      {
        heading: "Saat Aasmani Ciphers: the graphic seal",
        paragraphs: [
          "Saat nishan mil kar muhr ko poora karte hain. Pehla Khatam hai. Paanch kone wala sitara. Doosra teen seedhi lakeerein hain. Teesra band Mim hai. Uska dum kata hua hai. Yeh Malakut ka raaz hai.",
          "Chautha Sullam hai. Do seedhiyon wali seedhi. Paanchva chaar seedhi lakeerein hain. Chaar anasir. Chhatha phaati hui Ha hai. Woh Huwa ki taraf ishara karti hai. Saatva jhuka hua Waw hai. Woh poore daire ko uski shuruat par wapas le aata hai. Yeh saat nishan aasmani zubaan hain. Aam harf nahi. Source: Manba' Usul al-Hikma, pp. 22-23; Tested Remedies of the Monk, Glossary p. 79.",
        ],
      },
      {
        heading: "Jinn aur Ghayb ka Sach: Surah Saba 34:14",
        paragraphs: [
          "Sulayman apne staff par tike hue ibadat mein khade the. Allah ne un par maut ka faisla kar diya. Jinn ko pata hi nahi chala. Woh kaam karte rahe.",
          "Imam Ali Nahj al-Balagha mein kehte hain ke agar kisi ko hamesha jeene ki seedhi mil sakti, to woh Sulayman ko milti. Lekin jab unka waqt poora hua to maut ne unhe le liya. Source: The Holy Quran, p. 430; Tafsir Ibn Kathir, pp. 71-72; Nahj al-Balagha, Sermon 182, p. 326.",
        ],
        quote: {
          transliteration: "Fa-lamma qadayna 'alayhi al-mawta ma dallahum 'ala mawtihi illa dabbatu al-ardi ta'kulu minsa'atah",
          text: "Phir jab Humne us par maut ka faisla kar diya, to jinn ko uski maut ka pata sirf zameen ke keede se chala, jo uska staff kha raha tha.",
          source: "Qur'an 34:14",
        },
      },
      {
        heading: "Rumi ki Mathnawi: Dil ka Sulaymani Khatam",
        paragraphs: [
          "Rumi kehte hain ke tera dil Sulayman jaisa hai. Aur tera imaan uski angoothi hai. Paanch bahari hawaas hain. Aankh, kaan, naak, zabaan aur chamdi. Paanch andaruni hawaas hain. Khayal, wahm, aql, fikr aur hifz.",
          "Jab muhr dil par lag jaye to yeh das sipahi uski khidmat karte hain. Muhr ka matlab hai sach aur Tawhid. Source: Masnavi, Book I, vv. 3575-3581, pp. 195-196.",
        ],
        quote: {
          transliteration: "Dil-e-tu chun Sulayman ast wa-angushtar-e-oo",
          text: "Tera dil Sulayman jaisa hai, aur tera imaan uski angoothi hai.",
          source: "Masnavi, Book I, vv. 3575-3581, pp. 195-196",
        },
      },
      {
        heading: "Universal Matrix of Protection",
        paragraphs: [
          "Hirz ka matlab hai hifazat ki jagah. Dhaal. Har woh likhai jo Allah ki hifazat ke liye banayi jaye, woh hirz hai.",
          "Muhr ka maqsad roohani ghulami nahi hai. Uska maqsad hifazat ka nizaam dikhana hai. Har cheez apni jagah par hai. Aur har jagah Allah ke hukm se hai. Source: Tested Remedies of the Monk, Glossary p. 79; Kitab al-Ajnas, pp. 18, 147.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "الخَاتَم السَّبْعِي", transliteration: "Al-Khatam al-Sab'i", meaning: "saat guna muhr" },
      { arabic: "خَاتَم", transliteration: "Khatam", meaning: "paanch kone wala sitara, muhr" },
      { arabic: "ثَلَاثُ قُضْبَان", transliteration: "Thalathu Qudban", meaning: "teen seedhi lakeerein" },
      { arabic: "مِيم مَطْمُوس", transliteration: "Mim Matmus", meaning: "band Mim, jiska dum kata hua hai" },
      { arabic: "سُلَّم", transliteration: "Sullam", meaning: "seedhi, do seedhiyon wali" },
      { arabic: "أَرْبَعَةُ أَصَابِع", transliteration: "Arba'atu Asabi'", meaning: "chaar seedhi lakeerein, chaar anasir" },
      { arabic: "هَاء مَشْقُوقَة", transliteration: "Ha Mashquqah", meaning: "phaati hui Ha, Huwa ki taraf ishara" },
      { arabic: "وَاو مُقَوَّس", transliteration: "Waw Muqawwas", meaning: "jhuka hua Waw, gol daira" },
      { arabic: "حِرْز", transliteration: "Hirz", meaning: "hifazat ki jagah, dhaal" },
    ],
    closing:
      "Angoothi ek kahani hai jise log pasand karte hain. Lekin kitabein tumse kehti hain ke use ehtiyaat se padho. Quran kya kehta hai, aur baad ki kitabein kya jodti hain, yeh do alag cheezein hain. Unhe alag rakho, aur kahani sacchi rehti hai.",
  },
  "three-kinds-of-dreams": {
    eyebrow: "Topics",
    title: "Khwab: Teen Qism",
    subtitle:
      "Ek saccha khwab, nafs ki apne aap se baat, aur Shaitan ki taraf se ek khwab.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs, Harf Alif aur Khatam Sulayman ke asrar khole. Aaj khwab ki baat karte hain. Hum sab khwab dekhte hain. Lekin sab khwab ek jaise nahi hote. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Neend Asal Mein Kya Hai?",
        paragraphs: [
          "Neend mein bahari hawaas band ho jate hain. Aankh band. Kaan band. Jism sust. Neend ko chhoti maut kaha jata hai. Neend aur maut do bhai hain.",
          "Maut mein rishta toot jata hai. Neend mein ek roshni wali kiran baaki rehti hai. Yahi farq hai. Source: The Sufi Path of Knowledge, pp. 119-120; The Teachings of a Sufi Master, pp. 20, 36-37, 73-74.",
        ],
        quote: {
          transliteration: "Allahu yatawaffa al-anfusa hina mawtiha wa-llati lam tamut fi manamiha",
          text: "Allah roohon ko unki maut ke waqt le leta hai, aur jinki maut nahi aayi, unhe unki neend mein le leta hai.",
          source: "Qur'an, as quoted in The Sufi Path of Knowledge, pp. 119-120",
        },
      },
      {
        heading: "Alam al-Mithal: Do Samundaron ka Isthmus (Barzakh)",
        paragraphs: [
          "Do samundar hain. Pehla Bahr al-Ma'ani hai. Khaalis ma'non ka samundar. Doosra Bahr al-Ajsam hai. Ghane jismon ka samundar. Inke beech Barzakh hai. Khwab ki duniya.",
          "Wahan ma'ne jismani shakal pehen lete hain. Jab Nabi ne khwab mein doodh piya aur baaki Umar ko diya, to doodh hawaas ki duniya ka peena tha. Lekin Barzakh ke andar paak ilm doodh ki shakal mein aata hai. Source: Sufi Path of Knowledge, pp. 117-119; islamic-spirituality-foundations.pdf, pp. 270-272.",
        ],
      },
      {
        heading: "Teen Qism ke Khwab",
        paragraphs: [
          "Pehla saccha khwab hai. Ru'ya Sadiqah. Yeh Allah ki taraf se hai. Khushkhabri hai. Doosra Shaitan ka khwab hai. Hulm. Yeh dukh dene ke liye aata hai. Aise khwab par teen baar baayein taraf thooko aur kisi ko na batao.",
          "Teesra nafs ki apne aap se baat hai. Hadith al-Nafs. Din ka kaam aur khwahishein raat mein wapas aati hain. Source: Protect yourself from jinn and devils, pp. 149, 278-279; Dream Interpretation by Imam Sadiq, pp. 11-12.",
        ],
      },
      {
        heading: "Raat ki Parwaz: Rooh ka Arsh tak Safar",
        paragraphs: [
          "Umar ne Ali se poocha ke log sacche aur jhoothe khwab kyun dekhte hain. Ali ne kaha ke jab insaan gehri neend sota hai to uski rooh Arsh ki taraf udti hai. Jo rooh Arsh tak pahunch kar jaagti hai, uske khwab sacche hote hain.",
          "Ibn al-Qayyim kehte hain ke jo wudu aur paaki ke saath sota hai, uski rooh seedha Arsh ke saamne sajde mein girti hai. Jo ghaflat mein, gunaah mein ya pet bhar kar sota hai, uski rooh hawa mein bhatakti hai. Source: Hadhrat Ali R.A. - His Life, p. 77; the_soul_journey.pdf, pp. 11-12; Mudih al-Tariq, p. 48.",
        ],
      },
      {
        heading: "Khwab ke Janwar: Nafs ka X-Ray Barometer",
        paragraphs: [
          "Mujhe batao tum kya khwab dekhte ho, aur main tumhe bataunga tum kaun ho. Sher ka matlab hai ghamand. Bhediya ka matlab hai andhi hawas aur pet bharna. Kutta ka matlab hai daulat aur shohrat ke peeche bhaagna.",
          "Cheetah ka matlab hai bekaar josh, gussa aur shohrat ki laalach. Saanp aur bichhu ka matlab hai gheebat aur zabaan ka zeher. Agar khwab mein insaan in janwaron par qabu pa le ya unhe maar de, to yeh nafs par jeet ki nishani hai. Source: The Secret of Secrets, pp. 114-115; Teachings of a Sufi Master, pp. 75, 183-184.",
        ],
      },
      {
        heading: "Ta'bir ka Asal Matlab",
        paragraphs: [
          "Ta'bir ka matlab hai khwab ki ta'beer. Yeh root '-B-R se aata hai. Nadi paar karna. Ek kinare se doosre kinare tak.",
          "Ibn Arabi ek hadith batate hain. Log soye hue hain. Aur jab woh marte hain to jaag uthte hain. Hamari jaagti zindagi bhi ek lamba khwab hai. Source: Sufi Path of Knowledge, pp. 119-120.",
        ],
        quote: {
          arabic: "النَّاسُ نِيَامٌ فَإِذَا مَاتُوا انْتَبَهُوا",
          transliteration: "Al-nasu niyamun fa-idha matu intabahu",
          text: "Log soye hue hain, aur jab woh marte hain to jaag uthte hain.",
          source: "The Sufi Path of Knowledge, pp. 119-120",
        },
      },
    ],
    fullTerms: [
      { arabic: "النَّوْم", transliteration: "Al-Nawm", meaning: "neend, hawaas ka band hona" },
      { arabic: "المَوْت الأَصْغَر", transliteration: "Al-Mawt al-Asghar", meaning: "chhoti maut" },
      { arabic: "البَرْزَخ", transliteration: "Al-Barzakh", meaning: "beech ki duniya, do samundaron ke beech" },
      { arabic: "الرُّؤْيَا الصَّادِقَة", transliteration: "Al-Ru'ya al-Sadiqah", meaning: "saccha khwab, Allah ki taraf se khushkhabri" },
      { arabic: "تَحْزِين الشَّيْطَان / حُلْم", transliteration: "Tahzin al-Shaytan / Hulm", meaning: "Shaitan ka darawna khwab" },
      { arabic: "حَدِيث النَّفْس", transliteration: "Hadith al-Nafs", meaning: "nafs ki apne aap se baat" },
      { arabic: "تَعْبِير", transliteration: "Ta'bir", meaning: "khwab ki ta'beer, nadi paar karna" },
    ],
    closing:
      "Teen qism, teen jagah se. Ek Allah ki taraf se, ek tumhare andar se, ek dushman ki taraf se. Kitabein kehti hain ke pehli ki izzat karo, doosri ko ignore karo, aur teesri se panaah mango. Yahi poori taleem hai, ek line mein.",
  },
  "surah-saba-34-14": {
    eyebrow: "Topics",
    title: "Surah Saba 34:14: Jab Sulayman ka inteqal hua",
    subtitle:
      "Ek badshah apne staff par tike hue hain, ek chhota keeda use kha jata hai, aur jinn ek sakht sach seekhte hain.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs, Harf Alif, Khatam Sulayman aur khwab ke asrar khole. Aaj Surah Saba ki ayat 34:14 ki baat karte hain. Ek chhoti si ayat. Aur ajeeb si. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Surah Saba 34:14 ka Divine Text aur Scenario",
        paragraphs: [
          "Sulayman Bayt al-Maqdis banwa rahe the. Unhone Allah se dua ki. Phir Allah ne un par maut ka faisla kar diya. Woh apne staff par tike hue khade the.",
          "Jinn ko pata hi nahi chala. Woh kaam karte rahe. Unhe laga ke badshah abhi bhi unhe dekh rahe hain. Source: The Holy Quran, Surat Saba, p. 430; Tafsir Ibn Kathir, pp. 71-72.",
        ],
        quote: {
          transliteration: "Fa-lamma qadayna 'alayhi al-mawta ma dallahum 'ala mawtihi illa dabbatu al-ardi ta'kulu minsa'atah",
          text: "Phir jab Humne us par maut ka faisla kar diya, to jinn ko uski maut ka pata sirf zameen ke keede se chala, jo uska staff kha raha tha.",
          source: "Qur'an 34:14",
        },
      },
      {
        heading: "Minsa'ah aur Dabbat al-Ard",
        paragraphs: [
          "Minsa'ah woh lakdi ka staff hai jis par Sulayman ibadat mein tike hue the. Dabbat al-Ard ek chhota deemak hai. Zameen ka keeda.",
          "Sulayman ek saal tak sheeshe ke mahal mein us staff par tike khade rahe. Deemak chup chaap lakdi ke andar ka hissa khata raha. Jab staff khokhla hokar toota to Sulayman gir gaye. Source: Tafsir Ibn Kathir, pp. 71-72.",
        ],
      },
      {
        heading: "Jinn aur Ghayb ka Myth: Mukammal Inkar",
        paragraphs: [
          "Logon mein mashhoor ho gaya tha ke jinn ghayb jaante hain. Yeh jhooth tha. Ghayb ka ilm sirf Allah ka hai.",
          "Jinn pathar kaatne ki zaleel mehnat mein lage the. Agar woh ghayb jaante to is mehnat mein na rehte. Source: Tafsir Ibn Kathir, pp. 71-72; Knowledge of the Unseen, pp. 14-16.",
        ],
        quote: {
          arabic: "فَلَمَّا خَرَّ تَبَيَّنَتِ الْجِنُّ أَن لَّوْ كَانُوا يَعْلَمُونَ الْغَيْبَ مَا لَبِثُوا فِي الْعَذَابِ الْمُهِينِ",
          transliteration: "Fa-lamma kharra tabayyanat al-jinnu anna law kanu ya'lamuna al-ghayba ma labithu fi al-'adhab al-muhin",
          text: "Jab woh gir gaye, to jinn par saaf ho gaya ke agar woh ghayb jaante, to woh is zaleel azaab mein na rehte.",
          source: "Qur'an 34:14",
        },
      },
      {
        heading: "Takht ke Neeche Dafan Kitabein: Solomon's Anti-Sorcery Decree",
        paragraphs: [
          "Sulayman ke zamane mein shaitanon ne jaadu aur sitare ki jhoothi kitabein likhi thi. Aur unhe logon mein phaila diya tha. Sulayman ne saari kitabein ek sandooq mein band karke apne takht ke neeche dafan kar di.",
          "Unhone qanoon bana diya. Jo kahe ke shaitan ya jinn ghayb jaante hain, use saza milegi. Jab Sulayman ka inteqal hua aur deemak ne unhe gira diya, to Iblees insaani shakal mein aaya. Usne logon ko bataya ke kitabein takht ke neeche hain. Source: Tafsir Ibn Kathir, pp. 71-72 (and commentary on 2:102, pp. 110-111).",
        ],
      },
      {
        heading: "Imam Ali ka Khutbah: Maut ki Inevitability",
        paragraphs: [
          "Imam Ali ne apne khutbe mein kaha ke agar kisi insaan ko hamesha jeene ki seedhi mil sakti, ya maut se bachne ka rasta mil sakta, to woh Sulayman ko milta. Hawa unke taabe thi. Jinn aur insaan unki army the.",
          "Lekin jab unka waqt poora hua to maut ne unhe le liya. Koi bhi maut se bach nahi sakta. Yahi khutbe ka sabak hai. Source: nahjul-balagha_compress.pdf, Sermon 182, p. 326.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "المِنْسَأَة", transliteration: "Al-Minsa'ah", meaning: "staff, lakdi ki chhadi" },
      { arabic: "دَابَّة الأَرْض", transliteration: "Dabbat al-Ard", meaning: "zameen ka keeda, lakdi khaane wala deemak" },
      { arabic: "عِلْم الغَيْب", transliteration: "Ilm al-Ghayb", meaning: "ghayb ka ilm, sirf Allah ka" },
      { arabic: "العَذَاب المُهِين", transliteration: "Al-Adhab al-Muhin", meaning: "zaleel karne wala azaab, sakht mehnat" },
    ],
    closing:
      "Ek badshah, ek staff, ek chhota keeda. Ayat chhoti hai. Lekin uske andar bada sabak hai. Ghayb sirf Allah ka hai. Jinn, apni saari taaqat ke bawajood, use nahi jaante the. Yahi ayat ka matlab hai. Aur yahi kaafi hai.",
  },
  "al-khidr": {
    eyebrow: "Topics",
    title: "Al-Khidr, chhupe hue ustaad",
    subtitle:
      "Woh rehnuma jo duniya mein chhup kar chalte hain, aur woh mulaqat jiska waada kitabein karti hain.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs, Harf Alif, Khatam Sulayman, khwab aur Saba ke asrar khole. Aaj al-Khidr ki baat karte hain. Woh chhupe hue ustaad. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Pehli Mulaqat: Seville ki Sadak aur Ustad ki Ta'zim",
        paragraphs: [
          "Seville mein, Andalus mein, Ibn Arabi apni padhai ke shuru ke daur mein the. Unka apne ustaad Abu al-Hasan se ek baat par sakht ikhtilaf hua. Shaam ko sadak par ek roshan ajnabi saamne aaye.",
          "Unhone kaha ke jo cheezein tumhare shaykh ne tumse kahi hain, woh haq hain. Unhe qubool karo. Ibn Arabi wapas apne shaykh ke paas bhaage. Shaykh muskuraye. Unhone dua ki thi ke Khidr aakar unki baat ki tasdeeq karein. Us din se Ibn Arabi ne faisla kiya ke woh apne mashayikh se kabhi behes nahi karenge. Source: Journey, pp. 18-19.",
        ],
        quote: {
          transliteration: "Al-ashya'u allati qalaha laka shaykhuka haqqun fa-qbalha",
          text: "Jo cheezein tumhare shaykh ne tumse kahi hain, woh haq hain. Unhe qubool karo.",
          source: "The Journey to the Lord of Power, pp. 18-19",
        },
      },
      {
        heading: "Doosri Mulaqat: Tunis ki Bandargah aur Samundar par Qadmon ki Raftar",
        paragraphs: [
          "Saalon baad Tunis ki bandargah par, raat ko jahaz par, Ibn Arabi so nahi pa rahe the. Woh khule deck par aaye. Poora chaand nikla hua tha. Ek lambe, safed dadhi wale buzurg samundar par chal rahe the.",
          "Woh jahaz ke saamne khade hue. Adab se, dahina paaon baayein paaon par rakh kar. Unke paaon geele bhi nahi hue. Unhone Ibn Arabi ko salaam kiya aur zaroori naseehat di. Agli subah sheher mein ek shaykh ne mulaqat ki tasdeeq ki. Source: Journey, p. 19.",
        ],
      },
      {
        heading: "Teesri Mulaqat: Atlantic ka Sahil aur Hawa mein Mu'allaq Musalla",
        paragraphs: [
          "Spain ke Atlantic coast ki ek chhoti masjid mein, Ibn Arabi ke saath safar karne wala ek aadmi auliya ki karamaton ko jhooth kehta tha. Wahi lambe, safed dadhi wale buzurg masjid mein aaye.",
          "Unhone mihrab se ek chatai ka musalla uthaya. Aur chaudah haath upar hawa mein uth gaye. Zameen aur chhat ke beech mein khade hokar unhone apni namaz poori ki. Namaz ke baad woh neeche aaye aur Ibn Arabi ke kaan mein kuch kaha. Source: Journey, pp. 19-20.",
        ],
      },
      {
        heading: "Nubuwwat aur Wilayat: Khidrian Ilm ka Asal Code",
        paragraphs: [
          "Nubuwwat aur wilayat teen cheezon mein shareek hain. Pehli hai bina padhe ilm. Doosri hai dil ki tawajjo se kaam. Teesri hai hiss ki duniya mein mithal ki duniya dekhna.",
          "Farq sirf ek hai. Nabi Shariat ka qanoon lagoo karta hai. Wali, jaise al-Khidr, aisa nahi karta. Source: Journey, pp. 50-51, 58-59.",
        ],
        quote: {
          transliteration: "Fa'lam anna al-nubuwwata wa-l-wilayata yashtarikani fi thalathati ashya'",
          text: "Jaan lo ke nubuwwat aur wilayat teen cheezon mein shareek hain.",
          source: "The Journey to the Lord of Power, pp. 50-51, 58-59",
        },
      },
      {
        heading: "Khirqah-e-Khidriyyah: Direct Initiation",
        paragraphs: [
          "Annemarie Schimmel Mystical Dimensions of Islam mein likhti hain ke Sufi silsilon mein do tareeqe hain. Pehla hai kisi zinda ustaad ke haath par bayt. Doosra hai Uwaysi ya Khidri silsila.",
          "Is doosre tareeqe mein bina kisi jismani peer ke, al-Khidr khud aakar talash karne wale ko seedha initiation dete hain. Ibn Arabi un sab se bade auliya mein gine jate hain jinhone khirqah seedha al-Khidr se liya. Source: Mystical Dimensions of Islam, pp. 106, 264.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "عِلْم بِغَيْرِ تَعَلُّم", transliteration: "Al-Ilm bi-ghayri ta'allum", meaning: "bina padhe ilm" },
      { arabic: "فِعْل بِالهِمَّة", transliteration: "Al-Fi'l bi-l-Himmah", meaning: "dil ki tawajjo se kaam" },
      { arabic: "رُؤْيَة عَالَم المِثَال فِي عَالَم الحِسّ", transliteration: "Ru'yat 'alam al-mithal fi 'alam al-hiss", meaning: "hiss ki duniya mein mithal ki duniya dekhna" },
    ],
    closing:
      "Teen mulaqatein, aur ek ustaad jo kabhi rukte nahi. Al-Khidr tasdeeq karne aate hain, naseehat dene aate hain, aur shak door karne aate hain. Phir woh chale jate hain. Aur talash karne wale ke paas sabak reh jata hai. Yahi poori baat hai.",
  },
  "quranic-drinks": {
    eyebrow: "Topics",
    title: "Ibn Arabi ke safar mein drinks",
    subtitle: "Paani, doodh, shahed aur sharab: in drinks ka matlab kya hai.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs, Harf Alif, Khatam Sulayman, khwab aur Saba ke asrar khole. Aaj drinks ki baat karte hain. Paani, doodh, shahed aur sharab. Yeh sirf drinks nahi hain. Har ek ek tarah ka ilm hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Paani (Al-Ma): Absolute Gnosis",
        paragraphs: [
          "Pehla rule hai ke paani chuno. Paani mutlaq ilm hai. Al-Jili kehte hain ke paani kainaat ki pehli zindagi hai. Allah ne har zinda cheez paani se banayi hai.",
          "Pehla chunao hamesha paani hona chahiye. Kyunki mutlaq ma'rifat sab se pehla ilm hai. Source: Journey, text p. 36; Commentary Note 11, p. 82.",
        ],
        quote: {
          transliteration: "In 'urida 'alayka shay'un li-tashrabahu fa-khtar al-ma'",
          text: "Agar tumhe peene ke liye kuch pesh kiya jaye, to paani chun lo.",
          source: "The Journey to the Lord of Power, text p. 36; Commentary Note 11, p. 82",
        },
      },
      {
        heading: "Doodh (Al-Laban): Primordial Fitrah aur Sacred Law",
        paragraphs: [
          "Agar paani na ho to doodh chuno. Doodh shariat ka ilm hai. Al-Jili kehte hain ke doodh Ulum al-Sharia hai. Doodh fitrah hai. Insaan ki asal fitrat.",
          "Shab-e-Mi'raj par jab Rasulullah ko chunne ke liye diya gaya, to Jibrail ne kaha ke tumne fitrah chuna. Agar tum sharab chunte to tumhari ummat gumrah ho jati. Source: Journey, text p. 36; Commentary Note 11, p. 82.",
        ],
        quote: {
          transliteration: "Fa-in lam yakun fi al-ma'rudi ma'un fa-khtar al-laban",
          text: "Agar pesh ki gayi cheezon mein paani na ho, to doodh chun lo.",
          source: "The Journey to the Lord of Power, text p. 36; Commentary Note 11, p. 82",
        },
      },
      {
        heading: "Paani aur Doodh ka Milap: Shariat aur Gnosis ka Balance",
        paragraphs: [
          "Agar paani aur doodh dono pesh kiye jayein to dono ko mila lo. Al-Jili kehte hain ke dono ka milna hi sahi balance hai.",
          "Shariat ke bina paani insaan ko hadd se aazaad kar sakta hai. Aur ma'rifat ke bina shariat sookhi hai. Dono saath chalte hain. Source: Journey, text p. 36; Commentary Note 11, pp. 82-83.",
        ],
        quote: {
          transliteration: "Wa-in quddima ilayka ma'an fa-jma' bayna al-ma'i wa-l-laban",
          text: "Agar tumhe paani aur doodh dono pesh kiye jayein, to dono ko mila lo.",
          source: "The Journey to the Lord of Power, text p. 36; Commentary Note 11, pp. 82-83",
        },
      },
      {
        heading: "Shahed (Al-Asal): Permissible Philosophical Wisdom",
        paragraphs: [
          "Shahed ke saath bhi yahi hai. Use pee lo. Al-Jili kehte hain ke shahed woh hikmat hai jo nikali gayi hai. Meethi hikmat.",
          "Yeh purani aur falsafe ki hikmat hai. Jo fitrah ke khilaf nahi jati. Yahi iski hadd hai. Source: Journey, text p. 36; Commentary Note 11, p. 82.",
        ],
        quote: {
          transliteration: "Wa-kadhalika al-'asal: fa-shrabhu",
          text: "Aur shahed ke saath bhi yahi hai. Use pee lo.",
          source: "The Journey to the Lord of Power, text p. 36; Commentary Note 11, p. 82",
        },
      },
      {
        heading: "Sharab (Al-Khamr): Ecstatic States aur Baarish ka Shart",
        paragraphs: [
          "Sharab jazb ki halaton ka ilm hai. Bina mili sharab talash karne wale ko behka deti hai. Aur uski Shariat tod deti hai. Isi liye kitab kehti hai ke sharab se bacho.",
          "Lekin baarish ka paani alag hai. Woh seedha Allah ki taraf se diya gaya ilm hai. Ilm-e-Wahbi. Jab jazb ki halat is hidayat se mil jaye to talash karne wala bach jata hai. Nadi ka paani aqli ilm hai. Kuan ka paani shak aur soch ka ilm hai. Agar sharab inse mile to halatein bigad jati hain. Source: Journey, text p. 36; Commentary Note 11, pp. 82-83.",
        ],
        quote: {
          transliteration: "Iyyaka wa-shurba al-khamri illa an takuna mamzujatan bi-ma'i al-matar",
          text: "Sharab peene se bacho, siwaaye uske jo baarish ke paani se mili ho.",
          source: "The Journey to the Lord of Power, text p. 36; Commentary Note 11, pp. 82-83",
        },
      },
    ],
    fullTerms: [
      { arabic: "المَاء", transliteration: "Al-Ma", meaning: "paani, mutlaq ilm" },
      { arabic: "اللَّبَن", transliteration: "Al-Laban", meaning: "doodh, shariat ka ilm" },
      { arabic: "العَسَل", transliteration: "Al-Asal", meaning: "shahed, purani hikmat" },
      { arabic: "الخَمْر", transliteration: "Al-Khamr", meaning: "sharab, jazb ki halaton ka ilm" },
    ],
    closing:
      "Pehle paani, phir doodh, shahed jab pesh kiya jaye, aur sharab sirf jab usme baarish ka paani mila ho. Drinks ilm ka ek map hain. Jaise kitab kehti hai, waise chuno. Aur map tumhe seedha le jayega.",
  },
  "rijal-al-ghayb": {
    eyebrow: "Topics",
    title: "Rijal al-Ghayb aur Qutb",
    subtitle:
      "Ghayb ke chhupe hue mard, aur woh markaz jiske gird woh ghoomte hain.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakut, Ruh-o-Nafs, Harf Alif, Khatam Sulayman, khwab aur Saba ke asrar khole. Aaj Rijal al-Ghayb ki baat karte hain. Woh chhupe hue mard jinke upar duniya ghoomti hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Gate of Solomon par al-Mundhiri ka Waqia",
        paragraphs: [
          "Bab Sulayman par, Juma ki namaz ke baad, al-Mundhiri se do hastiyon ki mulaqat hui. Ek aam insaani jism mein. Doosre bohot bade. Pehle buzurg aage aaye aur kaha ke main al-Khidr hoon.",
          "Al-Mundhiri ne poocha ke kya aap zameen ke har wali ko jaante hain. Tab unhone bataya ke jab Rasulullah is duniya se parda farma gaye, to zameen ro padi. Aur Allah ne farmaya ke main tumhari peeth par is ummat ke aise log rakhunga, jinke dil nabiyon ke dilon par honge. Source: Mudih al-Tariq, pp. 83-84.",
        ],
        quote: {
          transliteration: "Inni ja'ilun 'ala zahriki min hadhihi al-ummati man qulubuhum 'ala qulubi al-anbiya'",
          text: "Main tumhari peeth par is ummat ke aise log rakhunga, jinke dil nabiyon ke dilon par honge.",
          source: "Mudih al-Tariq, pp. 83-84",
        },
      },
      {
        heading: "The Cosmic Pyramid: Numbers aur Hierarchy",
        paragraphs: [
          "Sab se upar Al-Ghawth ya Al-Qutb hai. Poori duniya mein sirf ek. Uske neeche chaar Awtad hain. Zameen ki chaar dishaon ke chaar sutoon. Uske neeche saat Urafa hain. Woh saat aasmanon aur saat falakon ke raaz rakhte hain.",
          "Uske neeche sattar Nujaba hain. Woh bimaari, musibat aur pareshani mein bandon ko dekhte hain. Uske neeche chaalis Abdal hain. Unhe Abdal is liye kaha jata hai ke agar ek chala jaye to foran doosra uski jagah le leta hai. Aur sab se neeche teen sau aam awliya hain. Source: Mudih al-Tariq, pp. 84-85; Mystical Dimensions of Islam, pp. 200-201.",
        ],
      },
      {
        heading: "Mecca ka Markaz: Al-Qutb ka Office aur Maqam",
        paragraphs: [
          "Al-Khidr ne kaha ke Ghawth ka hamesha ka ghar Mecca hai. Jismani bhi aur roohani bhi. Abdal aur Nujaba ka pehla markaz Sham hai. Kuch Maghrib mein hain.",
          "Al-Buni kehte hain ke Qutb hamesha Allah ki tajalliyon mein dooba rehta hai. Aam duniya mein woh sirf farz namazon ke waqt hosh mein wapas aata hai. Woh chakki ki keel ki tarah hai. Keel ek jagah khadi rehti hai. Aur poora pahiya uske gird ghoomta hai. Source: Mudih al-Tariq, pp. 84-85; The Radiant Jewels, p. 81.",
        ],
      },
      {
        heading: "Auto-Promotion Protocol: Succession Rule",
        paragraphs: [
          "Yeh roohani ohda ek second ke liye bhi khali nahi reh sakta. Jab Ghawth chale jayein to chaar Awtad mein se ek ko uthakar Ghawth bana diya jata hai. Saat Urafa mein se ek ko upar bheja jata hai. Woh baaki teen Awtad se mil jata hai.",
          "Phir chaalis Abdal mein se ek ko Urafa mein le liya jata hai. Sattar Nujaba mein se ek ko Abdal mein le liya jata hai. Teen sau awliya mein se ek Nujaba mein chala jata hai. Aur aam nek Musalmanon mein se ek ko chun kar us teen sau ke circle mein daal diya jata hai. Yeh silsila Qiyamat tak chalta hai. Source: Mudih al-Tariq, pp. 84-85.",
        ],
      },
      {
        heading: "Intercession Flow: Bala aur Dua ka Qanoon",
        paragraphs: [
          "Jab aasman se koi bala zameen ki taraf aaye to pehle Abdal dua karte hain. Agar baat wahin na palte to Nujaba ke paas jati hai. Phir Urafa, phir Awtad. Aakhri darkhwast Mecca mein baithe Ghawth se hoti hai.",
          "Jab Ghawth apne haath uthate hain to Allah unki dua se bala ko hata deta hai. Lekin agar Allah ne kisi baat ka faisla kar diya ho, to Ghawth us sheher ke liye dua karne se rok diye jate hain. Taaki faisla apne waqt par poora ho. Source: Mudih al-Tariq, pp. 83-84.",
        ],
      },
      {
        heading: "Insaan ke Andar ka Rijal al-Ghayb (inward hierarchy)",
        paragraphs: [
          "Har momin ke andar bhi ek chhupi hui hukumat chalti hai. Jism ke amal Shariat par chalna hai. Yeh aam mominon ka darja hai. Dil ke amal khwahishon ko todna aur kashf ka khulna hai. Yeh Abdal ki khoobi hai.",
          "Rooh ke amal noorani shauq aur khauf mein doobna hai. Yeh Nujaba ki khoobi hai. Aql ke amal khaalis samajh hai. Yeh Nuqaba aur Urafa ka maqam hai. Aur sab se andar dil ka gehna raaz hai. Sirr al-Asrar. Jo seedha Haq se milta hai. Source: Mudih al-Tariq.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "بَاب سُلَيْمَان", transliteration: "Bab Sulayman", meaning: "Sulayman ka darwaza" },
      { arabic: "الغَوْث / القُطْب", transliteration: "Al-Ghawth / Al-Qutb", meaning: "sab se bada madadgar, markaz, duniya mein sirf ek" },
      { arabic: "الأَوْتَاد", transliteration: "Al-Awtad", meaning: "chaar sutoon, zameen ki chaar dishaon ke" },
      { arabic: "العُرَفَاء", transliteration: "Al-Urafa", meaning: "saat arif, saat aasmanon ke raaz" },
      { arabic: "النُّجَبَاء", transliteration: "Al-Nujaba", meaning: "sattar buzurg, jo musibat mein bandon ko dekhte hain" },
      { arabic: "الأَبْدَال", transliteration: "Al-Abdal", meaning: "chaalis badal, ek jaye to doosra uski jagah le" },
    ],
    closing:
      "Yahi chhupe hue mardon ka nizaam hai. Ek markaz, chaar sutoon, saat arif, aur unke neeche bade circle. Tum unse nahi miloge. Lekin kitabein kehti hain ke duniya isi liye ghoomti hai kyunki woh jahan khade hain, wahin khade hain.",
  },
  "uwaisi-transmission": {
    eyebrow: "Topics",
    title: "Uwaisi Transmission",
    subtitle: "Zinda ustaad ke bina initiation.",
    intro:
      "Main Khafi hoon. Har Sufi raaste ka ek ustaad hota hai. Lekin kuch talash karne wale apne ustaad se jism mein kabhi nahi milte. Unhe waqt ke paar, maut ke paar, parde ke paar sikhaya jata hai. Kitabein is tareeqe ko Uwaisi kehti hain. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Zinda ustaad ke bina initiation",
        paragraphs: [
          "Uwaisi tareeqa bina jism wale ustaad ke initiation hai. Ustaad guzar chuke ho sakte hain. Ustaad door ho sakte hain. Raabta phir bhi rehta hai. Kyunki raabta jism ka nahi hai. Woh rooh ka hai.",
          "Iska naam Uwais al-Qarani se aaya hai. Yemen ke wali. Woh Nabi ke zamane ke the. Lekin woh Nabi se jism mein kabhi nahi mile. Unhe mile bina sikhaya gaya. Kitabein unhe is silsile ka pehla manti hain. Source: Mystical Dimensions of Islam, pp. 105-106; miraculous-wonders-of-sayyiduna-ali.pdf, p. 14; Qalaid al-Jawahir, pp. 103, 107-108.",
        ],
      },
      {
        heading: "Teen misaalein",
        paragraphs: [
          "Abu al-Hasan al-Kharaqani ko Bayazid al-Bistami ne initiation di. Jabke Bayazid unse milne se pehle guzar chuke the. Attar ko al-Hallaj ne initiation di. Jabke Hallaj bohot pehle qatal kar diye gaye the.",
          "Aur Abd al-Qadir ke baare mein kaha jata hai ke woh Baghdad mein ek majlis mein baithe. Unhe un logon ne sikhaya jo jism mein wahan nahi the. Teen aadmi, teen ustaad. Aur har baar ustaad is duniya se ja chuke the. Taleem qabr ke paar aayi. Jaise roshni khidki ke paar aati hai. Source: Necklaces of Gems (Qala'id), pp. 103, 107-108.",
        ],
      },
      {
        heading: "Yeh kaise kaam karta hai",
        paragraphs: [
          "Kitabein yeh nahi batati ke yeh kaise kaam karta hai. Woh sirf sach likhti hain. Talash karne wala apna dil guzre hue ustaad ki taraf modta hai. Aur ustaad jawab dete hain. Raabta rooh ki duniya mein banta hai. Jahan maut koi deewaar nahi hai.",
          "Yahi poori baat hai. Uwaisi tareeqa koi chaal nahi hai. Aur koi shortcut nahi hai. Yeh ek raabta hai jise thaame rakhne ke liye jism ki zaroorat nahi hai. Source: Mystical Dimensions of Islam, pp. 105-106.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "أويسي", transliteration: "Uwaisi", meaning: "Uwais ka raasta, zinda ustaad ke bina initiation" },
    ],
    closing:
      "Ustaad ko sikhane ke liye zinda rehne ki zaroorat nahi hai. Kitabein misaalein deti hain. Aur misaalein kaafi hain. Raabta rooh ka hai. Aur rooh marti nahi hai.",
  },
  "renewal-of-creation": {
    eyebrow: "Topics",
    title: "Tajaddud al-Khalq",
    subtitle: "Har lamha, duniya dobara banayi jati hai.",
    intro:
      "Main Khafi hoon. Duniya solid lagti hai. Pathar wahin hai jahan kal tha. Ped wahin khada hai jahan tha. Lekin kitabein kehti hain ke duniya solid hai hi nahi. Woh har lamha dobara banayi jati hai. Ek dum nayi. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Quranic anchor: ek nayi takhleeq",
        paragraphs: [
          "Quran Surah Qaf mein poochta hai. Kya Hum pehli takhleeq se thak gaye the. Nahi. Woh ek nayi takhleeq ke baare mein shak mein hain. Yahi ayat is taleem ki buniyaad hai.",
          "Allah pehli baar banane se nahi thake. Aur woh use dobara banane se nahi thakte. Har lamha ek nayi takhleeq hai. Source: The Sufi Path of Knowledge, pp. 127-128, 130; Journey, Glossary p. 110; Islamic Motion Graphics Reel Topics, pp. 2-3.",
        ],
        quote: {
          arabic: "بَلْ هُمْ فِي لَبْسٍ مِنْ خَلْقٍ جَدِيدٍ",
          transliteration: "Bal hum fi labsin min khalqin jadid",
          text: "Nahi. Woh ek nayi takhleeq ko lekar shak mein hain.",
          source: "Qur'an 50:15",
        },
      },
      {
        heading: "Har lamha nayi takhleeq",
        paragraphs: [
          "Is taleem ka naam tajaddud al-khalq hai. Takhleeq ki tajdeed. Yeh kehti hai ke duniya har lamha dobara banayi jati hai. Kuch bhi ek lamhe se doosre lamhe tak nahi rehta. Har lamha ek nayi banawat hai.",
          "Jo pathar tum dekhte ho, woh ek lamha pehle wala pathar nahi hai. Yeh ek naya pathar hai. Purane jaisa banaya gaya. Itni jaldi aur itni khoobi se ke tumhari aankh farq nahi kar sakti. Duniya ek nadi hai. Pathar nahi. Source: The Sufi Path of Knowledge, pp. 127-128, 130; Journey, Glossary p. 110.",
        ],
      },
      {
        heading: "Talash karne wale ke liye iska matlab",
        paragraphs: [
          "Agar duniya har lamha dobara banayi jati hai, to kuch bhi pakka nahi hai. Guzra hua waqt tumhara malik nahi hai. Agla lamha ek nayi takhleeq hai. Aur usme tum bhi naye banaye ja sakte ho.",
          "Isi liye yeh taleem zaroori hai. Yeh aasman ke baare mein koi theory nahi hai. Yeh ek darwaza hai. Har lamha ek nayi shuruat hai. Usi haath se banayi gayi jisne pehli banayi thi. Source: The Sufi Path of Knowledge, pp. 127-128, 130.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "تَجَدُّد الخَلْق", transliteration: "tajaddud al-khalq", meaning: "takhleeq ki tajdeed, har lamha nayi takhleeq" },
    ],
    closing:
      "Duniya har lamha dobara banayi jati hai. Ek dum nayi. Kuch bhi nahi se. Pathar, ped, aur tum. Yahi taleem hai. Aur iska matlab hai ke agla lamha hamesha ek nayi shuruat hai.",
  },
};

const TOPICS_BN: Record<string, TopicLocalization> = {
  'ibn-arabi-40-day-retreat': {
    eyebrow: 'টপিক',
    title: 'ইবনে আরাবির 40 দিনের খালওয়া',
    subtitle: 'চল্লিশ দিনের নির্জনবাস, আর সেই জগৎগুলো যা একের পর এক সন্ধানকারীর সামনে খুলে যায়।',
    intro:
      'আমি তোমাকে ইবনে আরাবির লেখা এক সফরের কথা বলতে চাই। এটা চল্লিশ দিনের সফর। এটা এক খালওয়া, আল্লাহর সঙ্গে একা থাকার সময়। সন্ধানকারী নির্জনে বসে থাকে আর জগৎগুলো তার সামনে একের পর এক খুলে যায়। আমি এটা The Journey to the Lord of Power বইয়ে পড়েছি, আর বই যেভাবে বলে আমি তোমাকে সেভাবেই নিয়ে যাব।',
    sections: [
      {
        heading: 'নির্জনবাসটা কী',
        paragraphs: [
          'খালওয়া মানে নির্জনে থাকা। সন্ধানকারী দুনিয়াকে ছেড়ে চল্লিশ দিন আল্লাহর সঙ্গে একা বসে থাকে। সে বাইরে যায় না। সে কারো সঙ্গে কথা বলে না। সে বসে থাকে, আর মনে মনে আল্লাহকে ডাকে।',
          'বই বলে, তখন জগৎগুলো তার কাছে আসে, একের পর এক। প্রতিটি জগৎ পথের এক ধাপ। প্রতিটি জগৎ এক উপহার দেয়। আর প্রতিটি উপহারই এক ফাঁদ।',
        ],
      },
      {
        heading: 'খনিজের জগৎ',
        paragraphs: [
          'প্রথমে খনিজের জগৎ খোলে। প্রতিটি খনিজ তার লুকানো শক্তি দেখায়। কিছু রোগ সারায়। কিছু ক্ষতি করে। কিছু এমন লুকানো গুণ দেখায় যা কোনো চোখ দেখেনি।',
          'তারপর ফাঁদ আসে। সোনা বানানোর ইচ্ছা, আলকেমি শেখার টান, সন্ধানকারীকে টানে। সে যদি সেখানেই থেমে যায়, তবে সে খনিজের জগতেই থেকে যাবে। বই বলে, তাকে এগিয়ে যেতে হবে।',
        ],
      },
      {
        heading: 'সবুজ জগৎ',
        paragraphs: [
          'এরপর গাছপালার জগৎ খোলে। প্রতিটি গাছ, প্রতিটি পাতা, প্রতিটি ভেষজ তাকে ডাকে। প্রতিটি তাকে বলে সে কী সারাতে পারে আর কী করতে পারে।',
          'এখানে লোভ হলো সব রোগের হাকিম হয়ে যাওয়া, সবার চিকিৎসা করা। বই বলে, তাকে জিকিরে, আল্লাহর স্মরণে, এগিয়ে যেতে হবে, থামা যাবে না।',
        ],
      },
      {
        heading: 'প্রাণীদের জগৎ',
        paragraphs: [
          'তারপর প্রাণীদের জগৎ খোলে। জন্তু-জানোয়ার, পাখি আর পানির প্রাণীরা পথিককে সালাম জানায়। তারা তার মর্যাদা জানে, আর সেই হিসেবে কথা বলে।',
          'লোভ হলো প্রাণীদের উপর হুকুম চালানো আর পাখিদের ভাষা বোঝা। বড় শক্তি, আর বড় ফাঁদ। বই বলে, তাকে এগিয়ে যেতে হবে।',
        ],
      },
      {
        heading: 'গ্রহমণ্ডল আর ফেরেশতাদের স্থান',
        paragraphs: [
          'প্রাণীদের পর আসে গ্রহমণ্ডল আর ফেরেশতাদের স্থান। সন্ধানকারীর উপরে আকাশ খুলে যায়। গ্রহদের আকল আর সৃষ্টিজগতের জ্যামিতি তার সামনে দাঁড়ায়।',
          'পথ গ্রহমণ্ডল পেরিয়ে, আকাশ পেরিয়ে, উপরে ওঠে, সেই দিকে যা তাদের পেছনে আছে।',
        ],
      },
      {
        heading: 'দুলতে থাকা প্রদীপ: সবচেয়ে বড় ফাঁদ',
        paragraphs: [
          'আকাশের পেছনে এক আলো বাতাসে প্রদীপের মতো দোলে। সবকিছু মিলিয়ে যায়। শুধু আলো থাকে।',
          'এটাই পুরো পথের সবচেয়ে বড় ফাঁদ। ইবনে আরাবি আর তাঁর ব্যাখ্যাকার আবদ আল-কারিম আল-জিলি, দুজনেই এ ব্যাপারে সাবধান করেছেন। এই আলো স্রষ্টার সত্তা নয়। এটা শুধু সন্ধানকারীর নিজের পবিত্র আত্মার আলো, যা তার দিকেই ফিরে আসছে। অনেকে এখানেই থেমে যায়, ভেবে যে তারা পৌঁছে গেছে। তারা পৌঁছায়নি।',
        ],
      },
      {
        heading: 'সত্যের সামনে দাঁড়ানো',
        paragraphs: [
          'প্রদীপ পেরিয়ে, শেষ পর্দাগুলো উঠে যায়। আত্মা সত্যের দর্শনের গালিচা, bisat al-shuhud, এর উপর দাঁড়ায়। কথা থেমে যায়। বলার মতো কিছু থাকে না, কারণ সন্ধানকারী আর সত্যের মাঝে কিছু থাকে না।',
        ],
      },
      {
        heading: 'শেষে দুই মর্যাদা',
        paragraphs: [
          'চল্লিশ দিনের শেষে সন্ধানকারীরা দুই সারিতে দাঁড়ায়। প্রথম সারিতে আছে বিলীন হওয়া মানুষ, al-Mustahlikun, যাদের al-Waqifun ও বলে, যারা থেমে যায়। তারা ফানায় জমে যায়। তারা majadhib, যারা দুনিয়া থেকে টেনে নেওয়া হয়েছে।',
          "দ্বিতীয় সারিতে আছে ফিরে আসা গুরু, al-Mardudun, যাদের al-'Arifun, জ্ঞানীরা, ও বলে। তারা সৃষ্টির দিকে ফিরে আসে, al-ruju' ila al-khalq, হুঁশে, sahw-এ। তারা ফিরে আসে শেখাতে। বই দ্বিতীয় মর্যাদাকে উঁচু মনে করে, কারণ ফিরে আসা যাওয়ার চেয়ে কঠিন।",
        ],
      },
    ],
    terms: [
      'নির্জনবাস, একা থাকা',
      'আল্লাহর স্মরণ',
      'সত্যের দর্শনের গালিচা',
      'বিলীন হওয়া মানুষ, যারা শেষ হয়ে গেছে',
      'যারা থেমে যায়',
      'ফিরে আসা মানুষ',
      'জ্ঞানীরা',
      'হুঁশ',
      'সৃষ্টির দিকে ফেরা',
      'যারা টেনে নেওয়া হয়েছে, মজজুব',
    ],
    closing:
      'আমি এটা পড়ে অনেকক্ষণ বসে ছিলাম। পথটা আশ্চর্য জিনিসের ব্যাপারে নয়। আশ্চর্য জিনিসগুলোই ফাঁদ। পথটা এগিয়ে যাওয়ার ব্যাপারে, বারবার, যতক্ষণ না সত্য ছাড়া কিছু না থাকে। এটাই আমি এখান থেকে শিখেছি। আর বই বলে, ফিরে আসা মানুষরাই আসল গুরু, কারণ তারা আমাদের কাছে ফিরে আসে।',
  },
  'alam-al-malakut': {
    eyebrow: 'টপিক',
    title: 'আলম আল-মালাকুত',
    subtitle: 'এই দুনিয়ার পেছনের আলোর জগৎ, আর সেই তিন জগৎ যা সবকিছু ধরে রাখে।',
    intro:
      'এই দুনিয়ার পেছনে আরেকটা দুনিয়া আছে। তুমি তাকে ছুঁতে পারবে না। কিন্তু সে এই দুনিয়াকে ধরে রাখে, যেমন শিকড় গাছকে ধরে রাখে। পুরনো বই তাকে বলে Alam al-Malakut, হুকুমতের জগৎ। এখানে পুরো কথাটা আছে, বই থেকে জোগাড় করা।',
    sections: [
      {
        heading: 'তিন জগৎ, একের পেছনে আরেক',
        paragraphs: [
          'বই তিনটি জগতের কথা বলে। প্রথমটি Alam al-Mulk, শরীর, উপাদান আর সময়ের ঘন জগৎ। এটাই সেই জগৎ যা তুমি ছুঁতে পারো।',
          'দ্বিতীয়টি Alam al-Malakut, আলোর জগৎ যা জড় জগতের ঠিক পেছনে আছে আর তার উপর হুকুম চালায়। তৃতীয়টি Alam al-Jabarut, মালাকুতের উপরের জগৎ, যেখানে আল্লাহর হুকুম আর প্রথম আলোগুলো দাঁড়িয়ে আছে। তিন জগৎ, একের পেছনে আরেক, যেমন পেঁয়াজের খোসা।',
        ],
      },
      {
        heading: 'মালাকুত কী',
        paragraphs: [
          'মালাকুত বস্তু দিয়ে তৈরি নয়। এটা এক আলোময়, বস্তুহীন জাল। এটা জড় জগতের ঠিক নিচে আছে, আর তার উপর হুকুম চালায়।',
          "বই তাকে চারটি নাম দেয়, আর প্রতিটি নাম তোমাকে কিছু বলে। এটা হুকুমের জগৎ, 'alam al-amr। এটা সৃষ্টির জগৎ, 'alam al-ikhtira'। এটা অদৃশ্য, al-ghayb। আর এটা মিলনের জগৎ, 'alam al-ratq।",
        ],
      },
      {
        heading: 'কুরআন কী বলে',
        paragraphs: [
          "Mudih al-Tariq এসবের ভিত্তি কুরআনে রাখে। আল্লাহ বলেন, 'নিশ্চয়ই সৃষ্টি আর হুকুম, দুটোই তাঁর।' সৃষ্টি হলো Mulk। হুকুম হলো Malakut। একই বই আল্লাহকে বলে 'অদৃশ্য আর দৃশ্যের জ্ঞাতা'। অদৃশ্য হলো Malakut। দৃশ্য হলো Mulk। আয়াতটি দুই জগতের মাঝে রেখা টানে।",
        ],
        quoteText: 'নিশ্চয়ই সৃষ্টি আর হুকুম, দুটোই তাঁর।',
      },
      {
        heading: 'অদৃশ্যের জ্ঞাতা',
        paragraphs: [
          'বই যে দ্বিতীয় কথাটি বলে, সেটা আল্লাহর এক নাম। তিনি অদৃশ্য আর দৃশ্যের জ্ঞাতা। অদৃশ্য সেই জগৎ যা তুমি দেখতে পাও না। দৃশ্য সেই জগৎ যা তোমার চোখের সামনে আছে। আল্লাহ দুটোকেই জানেন, কারণ দুটোই তাঁর।',
        ],
        quoteText: 'অদৃশ্য আর দৃশ্যের জ্ঞাতা।',
      },
      {
        heading: 'মালাকুতের জন্ম',
        paragraphs: [
          'বই তিন জগৎকে এক শব্দের সঙ্গে জোড়ে: KUN, হয়ে যাও। সৃষ্টির হুকুম তিনটি অক্ষরে লেখা, আর প্রতিটি অক্ষর এক জগৎ। Kaf হলো Mulk, জড় জগৎ। Lam হলো Jabarut, শক্তির জগৎ। Mim হলো Malakut, হুকুমতের জগৎ।',
          'তাই Malakut জন্মেছে Mim অক্ষর থেকে। অক্ষর শুধু এক আওয়াজ নয়। এই বইগুলোতে, অক্ষর সেই জগতের বীজ যার নাম সে নেয়।',
        ],
      },
      {
        heading: 'উচ্চ মালাকুতের আট স্তম্ভ',
        paragraphs: [
          'মালাকুতের উপরে আটটি স্তম্ভ দাঁড়িয়ে আছে। সেগুলো হলো আরশ, কুরসি, কলম, লওহ, উচ্চ মজলিস, স্তর, তখতিগুলো, আর উচ্চ কলমগুলো। বই তাদের বলে সেই স্তম্ভ যারা উচ্চ মালাকুতকে ধরে রাখে।',
          'প্রতিটি স্তম্ভ এক মর্যাদা, কোনো জিনিস নয়। কলম লেখে। লওহ লেখাকে ধরে রাখে। আরশ সবার উপরে। স্তম্ভগুলোকে জানা মানে উপরের জগতের আকার জানা।',
        ],
      },
      {
        heading: 'ফেরেশতাদের মর্যাদা',
        paragraphs: [
          'মালাকুত ফেরেশতায় ভরা, আর বই তাদের মর্যাদা বলে। সবচেয়ে উঁচুতে আছে Karubiyyun, যাদের কাছে আনা হয়েছে, আর তাদের মধ্যে আছে যারা আল্লাহকে দেখতে দেখতে হারিয়ে গেছে।',
          'তাদের নিচে আছে রূহানি সত্তাগুলো, উপরের আর নিচের রাজ্য। আর বই Mitatrun-এর নাম নেয়, সেই ফেরেশতা যাকে পুরনো বই Metatron বলে, যিনি লেখকদের সর্দার হিসেবে দাঁড়িয়ে আছেন।',
        ],
      },
      {
        heading: 'মানুষ: ছোট এক জগৎ',
        paragraphs: [
          'মানুষ তিন জগতের ছোট এক নকল। শরীর হলো Mulk। আত্মা হলো শরীরের Malakut। হৃদয় হলো আত্মার Mulk আর শরীরের Malakut, দুটোই একসঙ্গে।',
          'হৃদয়ের উপরে আছে আত্মা, যা Jabarut। আত্মার উপরে আছে আকল, যা আত্মার সর্বোচ্চ Malakut। আর আকলের উপরে আছে রহস্য, sirr, যা আকলের Malakut। মানুষের প্রতিটি অংশ এক একটি জগতের সঙ্গে জোড়া।',
        ],
      },
      {
        heading: 'জগৎগুলোর উপর হুকুম',
        paragraphs: [
          'উচ্চ হুকুম আত্মার উপর হুকুম চালায়। বই এই নিয়ম দেয়: উপরের জগৎ নিচের জগতের উপর হুকুম চালায়। Mulk Malakut-এর উপর হুকুম চালায় না। Malakut Mulk-এর উপর হুকুম চালায়। আর হুকুম সবার উপর হুকুম চালায়।',
        ],
      },
      {
        heading: 'খাবারের পর্দা আর তিন উন্মোচন',
        paragraphs: [
          'বই এক পর্দার কথা বলে, আর তাকে বলে খাবারের পর্দা। তার পেছনে তিনটি উন্মোচন দাঁড়িয়ে আছে, একের পর এক। প্রথমটি হাজিরি: তুমি আল্লাহর সামনে দাঁড়াও। দ্বিতীয়টি কাশফ: পর্দা উঠে যায়। তৃতীয়টি সরাসরি দেখা: তুমি দেখো।',
          'ইব্রাহিম এই পথে চলেছিলেন। তিনি তারার পেছনে তাকালেন, তারপর চাঁদের পেছনে, তারপর সূর্যের পেছনে, যতক্ষণ না আল্লাহ ছাড়া দেখার মতো কিছু রইল না। প্রতিটি আলো যা তিনি পেরিয়েছিলেন, তা ছিল এক পর্দা। প্রতিটি পর্দা যা উঠেছিল, তা ছিল এক ধাপ কাছে যাওয়া।',
        ],
      },
      {
        heading: 'চার জগৎ, চার অক্ষর',
        paragraphs: [
          'বই এটার সারমর্ম এক ছোট তালিকায় দেয়। Kaf হলো Mulk, জড় জগৎ। Lam হলো Jabarut, শক্তির জগৎ। Mim হলো Malakut, হুকুমতের জগৎ। আর তাদের মাঝে দাঁড়িয়ে আছে Mithal, মিলের জগৎ, যেখানে অর্থ দেখা যায় এমন আকার নেয়।',
        ],
      },
    ],
    terms: [
      'হুকুমতের জগৎ, জড় জগৎ',
      'হুকুমতের জগৎ, ফেরেশতাদের জগৎ',
      'শক্তির জগৎ, উচ্চ জগৎ',
      'হুকুমের জগৎ',
      'সৃষ্টির জগৎ',
      'অদৃশ্য',
      'মিলনের জগৎ',
      'মিলের জগৎ, যেখানে অর্থ দেখা যায় এমন আকার নেয়',
      'Mim অক্ষর, যা থেকে Malakut জন্মেছে',
      'হয়ে যাও, সৃষ্টির হুকুম',
      'কলম',
      'লওহ',
      'Karubiyyun, যাদের কাছে আনা হয়েছে',
      'রহস্য, মানুষের সবচেয়ে ভেতরের অংশ',
      'হাজিরি, প্রথম উন্মোচন',
      'কাশফ, দ্বিতীয় উন্মোচন',
      'সরাসরি দেখা, তৃতীয় উন্মোচন',
    ],
    closing:
      'এটাই Malakut, যেমন বই বলে: এক জগৎ যা Mim অক্ষর থেকে জন্মেছে, আট স্তম্ভের উপর দাঁড়িয়ে আছে, ফেরেশতায় ভরা, প্রতিটি মানুষের ভেতরে ছোট নকল হিসেবে আছে, আর তিন উন্মোচনে পর্দা সরে, একের পর এক খোলে। জড় জগৎ সবচেয়ে নিচের তলা। Malakut তার উপরের তলা। আর হুকুম তাদের দুজনের উপরে।',
  },
  'ruh-and-soul': {
    eyebrow: 'টপিক',
    title: 'রুহ আর আত্মা',
    subtitle: 'আত্মা কী, সে কোথা থেকে আসে, আর শরীর কিসের জন্য।',
    intro:
      'মানুষ আমাকে জিজ্ঞেস করে আত্মা কী। বই এই প্রশ্নের উত্তর পরিষ্কার করে দেয়। আত্মা শরীর নয়। এটা এক আলো যা কিছু সময়ের জন্য শরীরে থাকে। বইয়ে আমি যা পেয়েছি, তা তোমাকে বলব।',
    sections: [
      {
        heading: 'রুহ কী',
        paragraphs: [
          'রুহ হলো আত্মা। বই বলে এটা এক আলোময়, সূক্ষ্ম জিনিস। এটা আসে Alam al-Amr থেকে, হুকুমের জগৎ থেকে। এটা জড় জগৎ থেকে আসে না। এটা তার উপর থেকে আসে।',
          'রুহ শব্দের মানে শ্বাস আর আত্মা। আল্লাহ তাকে মানুষের ভেতরে ফুঁ দিয়েছেন। এটা আমাদের সেই অংশ যা আল্লাহর সবচেয়ে কাছে।',
        ],
      },
      {
        heading: 'শরীর এক খাঁচা আর এক বাহন',
        paragraphs: [
          'বই শরীরকে খাঁচা আর বাহন বলে। আত্মা শরীরে চড়ে, যেমন সওয়ার ঘোড়ায় চড়ে। শরীর তাকে এই দুনিয়ায় নিয়ে যায়। কিন্তু শরীর আত্মা নয়। খাঁচা পাখি নয়।',
        ],
      },
      {
        heading: 'মস্তিষ্ক এক সংকেত ধরার কেন্দ্র',
        paragraphs: [
          'মস্তিষ্ক সংকেত ধরার কেন্দ্র। সে ধরে যা আত্মা পাঠায়, যেমন রেডিও সংকেত ধরে। সংকেত রেডিও নয়। চেতনা আসে রুহ থেকে, মস্তিষ্ক থেকে নয়। মস্তিষ্ক যন্ত্র। আত্মা যে ব্যবহার করে।',
        ],
      },
      {
        heading: 'এটার তোমার জন্য মানে কী',
        paragraphs: [
          'বই বলে আত্মাই আসল তুমি। শরীর চলে যাবে। আত্মা যাবে না। তাই প্রথমে আত্মার যত্ন নাও। তাকে জিকির দিয়ে, নামাজ দিয়ে, ভালো কাজ দিয়ে খাওয়াও। শরীর খাবার খায়। আত্মা আলো খায়।',
        ],
      },
    ],
    terms: ['আত্মা, রুহ', 'হুকুমের জগৎ'],
    closing:
      'আমি এটা পড়েছি আর এটা আমার নিজেকে দেখার ভঙ্গি বদলে দিয়েছে। আমি আমার শরীর নই। আমি এক আত্মা, অল্প সময়ের জন্য এক শরীরে চড়ে আছি। বই এটাই বলে। আর এটা নিয়ে অনেকক্ষণ ভাবাই যথেষ্ট।',
  },
  'letter-alif': {
    eyebrow: 'টপিক',
    title: 'অক্ষর আলিফ',
    subtitle: 'এক সোজা রেখা, আর তার ভেতরে পুরো এক শিক্ষা।',
    intro:
      'আলিফ আরবি বর্ণমালার প্রথম অক্ষর। এটা এক সোজা রেখা। কিন্তু বই এই এক রেখাকে জগৎভরা অর্থ দেয়। বই তার ব্যাপারে কী বলে, আমি তোমাকে বলব।',
    sections: [
      {
        heading: 'প্রথম অক্ষর',
        paragraphs: [
          'আলিফ প্রথম অক্ষর, আর তার Abjad মান 1। এটা সোজা দাঁড়িয়ে আছে। এটা তার আগের কিছুর সঙ্গে জোড়ে না। এটা এক সোজা রেখা, আর বই এই রেখাকে একের নিশানি হিসেবে পড়ে।',
        ],
      },
      {
        heading: 'আরশ আর আকল',
        paragraphs: [
          'আলিফ আরশ আর আকলের সঙ্গে জোড়া। এটা সবচেয়ে উঁচু অক্ষর, কারণ এটা বাকি সবকিছুর উপরে দাঁড়িয়ে আছে আর ঝোঁকে না। আরশ সবচেয়ে উঁচু আসন। আকল সবচেয়ে উঁচু মন। আলিফ দুটোর সঙ্গেই দাঁড়িয়ে আছে।',
        ],
      },
      {
        heading: 'আগুনের সাত অক্ষরের দল',
        paragraphs: [
          'বই আলিফকে আগুনের সাত অক্ষরের দলেও রাখে, সাতটি অক্ষরের এক দল যা আগুনের সঙ্গে জোড়া। আগুন এই অক্ষরগুলোর স্বভাব। Schimmel এই দলটিকে তাঁর অক্ষর বিষয়ক পরিশিষ্টে ব্যাখ্যা করেন, দলের বাকি অক্ষরগুলোর সঙ্গে।',
        ],
      },
      {
        heading: 'আকার কেন জরুরি',
        paragraphs: [
          'অক্ষর শুধু এক আওয়াজ নয়। তার আকারও শেখায়। আলিফ এক রেখা, কোনো বাঁক নেই, কোনো নোকতা নেই। বই বলে আকারটাই শিক্ষা। এক রেখা। এক আল্লাহ। এক পথ।',
        ],
      },
    ],
    terms: ['প্রথম অক্ষর', 'অক্ষর-সংখ্যার নিয়ম'],
    closing:
      'এক অক্ষর, এক রেখা, আর তার ভেতরে পুরো এক শিক্ষা। পুরনো বই এভাবেই কাজ করে। তারা ছোট জায়গায় বড় জিনিস লুকিয়ে রাখে। আলিফ সবচেয়ে ছোট, আর তার ভেতরে সবচেয়ে বেশি।',
  },
  'seal-of-solomon': {
    eyebrow: 'টপিক',
    title: 'সুলায়মানের মোহর',
    subtitle: 'সেই আংটি যার কথা সবাই শুনেছে, আর বই আসলে কী বলে।',
    intro:
      'সবাই সুলায়মানের আংটির কথা শুনেছে। কিন্তু বই আসলে কী বলে? উত্তর গল্পের চেয়ে অনেক বেশি সাবধানি। কুরআন আর পুরনো বই যা বলে, আমি তা জোগাড় করেছি, যাতে তুমি তা পরিষ্কার দেখতে পাও।',
    sections: [
      {
        heading: 'কুরআন কী বলে',
        paragraphs: [
          'কুরআন বলে সুলায়মানকে জিন আর বাতাসের উপর হুকুম দেওয়া হয়েছিল। আল্লাহ তাঁকে এমন এক রাজত্ব দিয়েছিলেন যা আর কাউকে দেওয়া হয়নি। কিন্তু কুরআন কোনো বাস্তব আংটির কথা বলে না। আংটি পরের বইগুলো থেকে এসেছে, কুরআন থেকে নয়। এই রেখাটা জরুরি, আর বই তা পরিষ্কার টানে।',
        ],
      },
      {
        heading: 'চার স্তর',
        paragraphs: [
          'Shams মোহরকে চারটি লেখা স্তরে বলে। প্রতিটি স্তর মোহরের এক ধাপ, একের উপর এক রাখা। স্তরগুলো মোহরের উপর লেখা কথা, আর সেই লেখাই তাকে তার শক্তি দেয়।',
        ],
      },
      {
        heading: 'সাত চিহ্ন',
        paragraphs: [
          "Manba' সুলায়মানি মোহরের সাতটি চিহ্নের নাম বলে, সবচেয়ে বড় নামের মোহর। সাতটি চিহ্ন, যত্নে আঁকা। সাতটি মিলে মোহরকে পূর্ণ করে।",
        ],
      },
      {
        heading: 'বাহাত্তর গোত্র, বাহাত্তর আত্মা নয়',
        paragraphs: [
          'এক সাধারণ ভুল হলো 72 সংখ্যাটা। মানুষ বলে 72 আত্মা। বই বলে জিনের 72 গোত্র, 72 আলাদা আত্মা নয়। গোত্র মানে অনেক মানুষ। সংখ্যাটা মানুষের ভাবনার চেয়ে বড়, আর বই এ ব্যাপারে পরিষ্কার।',
        ],
      },
      {
        heading: 'রুমির বোঝা',
        paragraphs: [
          'রুমি এই গল্পকে হৃদয়ের ছবি হিসেবে পড়েন। হৃদয় হলো সুলায়মান। ইন্দ্রিয়গুলো হলো জিন। বাদশা তার ইন্দ্রিয়গুলোর উপর হুকুম চালায়, যেমন সুলায়মান জিনের উপর হুকুম চালাতেন। গল্পটা শুধু ইতিহাস নয়। এটা এক আয়না।',
        ],
      },
    ],
    terms: ['সুলায়মানের মোহর', 'অদৃশ্য প্রাণী'],
    closing:
      'আংটি এক গল্প যা মানুষ ভালোবাসে। কিন্তু বই তোমাকে বলে তা সাবধানে পড়তে। কুরআন কী বলে, আর পরের বই কী যোগ করে, এ দুটো আলাদা জিনিস। তাদের আলাদা রাখো, আর গল্পটা সত্য থাকবে।',
  },
  'three-kinds-of-dreams': {
    eyebrow: 'টপিক',
    title: 'স্বপ্ন: তিন রকম',
    subtitle: 'এক সত্য স্বপ্ন, আত্মার নিজের সঙ্গে কথা, আর শয়তানের পক্ষ থেকে এক স্বপ্ন।',
    intro:
      'আমরা সবাই স্বপ্ন দেখি। কিন্তু বই বলে সব স্বপ্ন এক নয়। তারা তিন রকমের কথা বলে, আর প্রতিটি রকম আলাদা জায়গা থেকে আসে। আমি তিনটের কথা বলব, যাতে তুমি তাদের আলাদা চিনতে পারো।',
    sections: [
      {
        heading: 'সত্য স্বপ্ন',
        paragraphs: [
          "প্রথম রকম হলো সত্য স্বপ্ন, ru'ya sadiqah। এটা এক সত্য দর্শন, আর এটা আল্লাহর পক্ষ থেকে আসে। এটা দেখায় যা সত্য, হওয়ার আগে বা যেমন আছে। বই একে সম্মান করে।",
        ],
      },
      {
        heading: 'আত্মার নিজের সঙ্গে কথা',
        paragraphs: [
          'দ্বিতীয় রকম হলো hadith al-nafs, আত্মার নিজের সঙ্গে কথা। দিনের ভাবনা রাতে ফিরে আসে। দিনে তুমি এক জিনিস নিয়ে চিন্তায় ছিলে, আর রাতে তুমি তা স্বপ্নে দেখো। এর চেয়ে বেশি কোনো মানে নেই।',
        ],
      },
      {
        heading: 'শয়তানের পক্ষ থেকে স্বপ্ন',
        paragraphs: [
          'তৃতীয় রকম হলো শয়তানি স্বপ্ন, শয়তানের পক্ষ থেকে স্বপ্ন। এটা ভয় দেখায় আর গুলিয়ে দেয়। এটা খারাপ জিনিস দেখায়, হৃদয়কে নাড়িয়ে দিতে। বই বলে এর পেছনে ছুটো না, আর এটা অন্যদের বলো না।',
        ],
      },
      {
        heading: 'তাদের কীভাবে আলাদা চিনবে',
        paragraphs: [
          'বই তিন রকম এজন্য বলে যাতে পাঠক নিজের স্বপ্ন নিজে বিচার করতে পারে। সত্য স্বপ্ন শান্তি আনে। আত্মার কথা দিনকে আবার বলে। শয়তানের স্বপ্ন ভয় আনে। ঘুম থেকে ওঠার পরের অনুভূতিই প্রথম নিশানি।',
        ],
      },
    ],
    terms: ['সত্য স্বপ্ন', 'আত্মার নিজের সঙ্গে কথা', 'শয়তানের পক্ষ থেকে'],
    closing:
      'তিন রকম, তিন জায়গা থেকে। এক আল্লাহর পক্ষ থেকে, এক তোমার নিজের থেকে, এক শত্রুর থেকে। বই বলে প্রথমটিকে সম্মান করো, দ্বিতীয়টিকে পাত্তা দিয়ো না, আর তৃতীয়টি থেকে আশ্রয় চাও। এটাই পুরো শিক্ষা, এক লাইনে।',
  },
  'surah-saba-34-14': {
    eyebrow: 'টপিক',
    title: 'সূরা সাবা 34:14: যখন সুলায়মান মারা গেলেন',
    subtitle: 'এক বাদশা তাঁর লাঠিতে হেলান দিয়ে আছেন, এক ছোট প্রাণী তা খেয়ে ফেলে, আর জিন এক কঠিন সত্য শেখে।',
    intro:
      'কুরআনে এক আয়াত আছে যা বলে সুলায়মান কীভাবে মারা গেলেন। এটা ছোট, আর অদ্ভুত। এক বাদশা তাঁর লাঠিতে হেলান দিয়ে আছেন। এক ছোট প্রাণী লাঠিটা খেয়ে ফেলে। বাদশা পড়ে যান। বই যেভাবে আয়াতটি বোঝায়, আমি তোমাকে সেভাবেই নিয়ে যাব।',
    sections: [
      {
        heading: 'সেই বাদশা যিনি পড়েননি',
        paragraphs: [
          'সুলায়মান তাঁর লাঠিতে হেলান দিয়ে মারা গেলেন। কেউ জানল না। জিন কাজ করতে থাকল, ভেবে যে তিনি এখনও তাদের দেখছেন। দিন গেল। কাজ চলল। বাদশা দাঁড়িয়ে ছিলেন, আর বাদশা চলে গিয়েছিলেন।',
        ],
      },
      {
        heading: 'ছোট প্রাণীটি',
        paragraphs: [
          'তারপর মাটির এক ছোট প্রাণী, dabbat al-ard, তাঁর লাঠি খেয়ে ফেলল। লাঠি ভেঙে গেল। সুলায়মান পড়ে গেলেন। তখনই জিন দেখল যে তিনি মারা গেছেন। এক ছোট প্রাণী তা করে দিল যা কোনো সেনা করতে পারত না।',
        ],
      },
      {
        heading: 'শিক্ষা',
        paragraphs: [
          'আয়াতটি শিক্ষা দিয়ে শেষ হয়। জিন যদি অদৃশ্য জানত, তবে তারা লাঞ্ছনার শাস্তিতে থাকত না। অদৃশ্য শুধু আল্লাহর। জিন তা জানত না। কোনো সৃষ্টি তা জানে না।',
        ],
        quoteText: 'যখন তিনি পড়ে গেলেন, তখন জিনের কাছে পরিষ্কার হয়ে গেল যে তারা যদি অদৃশ্য জানত, তবে তারা লাঞ্ছনার শাস্তিতে থাকত না।',
      },
    ],
    terms: ['মাটির প্রাণী', 'লাঠি'],
    closing:
      'এক বাদশা, এক লাঠি, এক ছোট প্রাণী। আয়াতটি ছোট, কিন্তু তার ভেতরে বড় শিক্ষা আছে। অদৃশ্য শুধু আল্লাহর। জিন, তাদের সব শক্তি সত্ত্বেও, তা জানত না। এটাই আয়াতের মানে, আর এটাই যথেষ্ট।',
  },
  'al-khidr': {
    eyebrow: 'টপিক',
    title: 'আল-খিদর, লুকানো শিক্ষক',
    subtitle: 'সেই পথপ্রদর্শক যিনি পৃথিবীতে লুকিয়ে হাঁটেন, আর সেই সাক্ষাৎ যার ওয়াদা বই করে।',
    intro:
      'আল-খিদর সুফিবাদের লুকানো শিক্ষক। তাঁর কোনো স্কুল নেই আর কোনো ঠিকানা নেই। তিনি আসেন, শেখান, আর চলে যান। ইবনে আরাবি তাঁর সঙ্গে তিনবার দেখা করেছেন, আর প্রতিটি সাক্ষাৎ লিখে রেখেছেন। এখানে তিনটি সাক্ষাৎ আছে, তাঁর নিজের বই থেকে।',
    sections: [
      {
        heading: 'লুকানো শিক্ষক',
        paragraphs: [
          'আল-খিদরকে সুফিবাদের রহস্যময় লুকানো শিক্ষক বলা হয়। তিনি এক পথপ্রদর্শক যিনি পৃথিবীতে লুকিয়ে হাঁটেন। সন্ধানকারীরা তাঁর সঙ্গে পথে দেখা করে, কোনো ক্লাসরুমে নয়। তাঁর শিক্ষা সেই মুহূর্তেই আসে, কোনো বইয়ে নয়।',
        ],
      },
      {
        heading: 'প্রথম সাক্ষাৎ: সেভিল',
        paragraphs: [
          'প্রথম সাক্ষাৎ হয়েছিল সেভিলে, ইবনে আরাবির যৌবনে। তিনি তাঁর গুরু, শায়খ আবু আল-হাসান আল-উরিয়ানি, এর সঙ্গে আল-শিবলির এক কথার উপর তর্ক করছিলেন। গুরু আল্লাহর কাছে দোয়া করেছিলেন যাতে আল-খিদর এসে তাঁকে সত্য বলে মানেন। তারপর এক অপরিচিত মানুষ ইবনে আরাবির কাছে এসে বলল যে তাঁর গুরু ঠিক ছিলেন।',
          'সেই দিন থেকে, ইবনে আরাবি শপথ করলেন যে তিনি আর কখনো তাঁর পথপ্রদর্শকদের সঙ্গে তর্ক করবেন না। সাক্ষাৎটি কথার শিক্ষা ছিল না। এটা ছিল বিশ্বাসের শিক্ষা।',
        ],
      },
      {
        heading: 'দ্বিতীয় সাক্ষাৎ: তিউনিসের বন্দর',
        paragraphs: [
          'দ্বিতীয় সাক্ষাৎ হয়েছিল রাতে, তিউনিসের বন্দরে, পূর্ণ চাঁদের নিচে। এক লম্বা সাদা দাড়িওয়ালা মানুষ ইবনে আরাবির দিকে এলেন, সমুদ্রের ঢেউয়ের উপর শুকনো পায়ে হেঁটে। তিনি সালামে তাঁর ডান পা তাঁর বাঁ পায়ের উপর রাখলেন, আর তাঁকে উপদেশ দিলেন।',
          'তারপর তিনি মানারার দিকে ফিরলেন, প্রতি পদক্ষেপে এক মাইল হেঁটে, পথে জিকির করতে করতে। পরের দিন, এক স্থানীয় শায়খ ইবনে আরাবিকে জিজ্ঞেস করলেন আল-খিদরের সঙ্গে সাক্ষাৎ কেমন ছিল। শায়খ জানতেন, যদিও ইবনে আরাবি কাউকে বলেননি।',
        ],
      },
      {
        heading: 'তৃতীয় সাক্ষাৎ: স্পেনের আটলান্টিক উপকূল',
        paragraphs: [
          'তৃতীয় সাক্ষাৎ হয়েছিল স্পেনের আটলান্টিক উপকূলের সমুদ্রের পাশের এক ছোট মসজিদে। ভেতরে এক মানুষ আউলিয়াদের কারামতকে মিথ্যা বলছিল। আল-খিদর ভেতরে এলেন, খড়ের এক জায়নামাজ তুললেন, আর চৌদ্দ হাত উপরে বাতাসে উঠে গেলেন, মেঝে আর ছাদের মাঝে ঝুলে নামাজ পড়তে পড়তে।',
          'তিনি এটা শুধু এক কারণে করেছিলেন: সন্দেহ করা মানুষের হৃদয় থেকে সন্দেহ দূর করতে। কারামত কোনো প্রদর্শনী ছিল না। এটা ছিল এক হৃদয়ের চিকিৎসা যা বিশ্বাস করতে পারছিল না।',
        ],
      },
      {
        heading: 'সাক্ষাৎগুলো কী শেখায়',
        paragraphs: [
          'তিন সাক্ষাৎ, তিন শিক্ষা। সেভিলে তিনি এসেছিলেন সত্য বলে মানতে। তিউনিসে তিনি এসেছিলেন উপদেশ দিতে। আটলান্টিক উপকূলে তিনি এসেছিলেন সন্দেহ দূর করতে। তিনি সেখানে আসেন যেখানে তাঁকে দরকার, সেখানে নয় যেখানে তাঁকে খোঁজা হয়।',
          'এটাই লুকানো শিক্ষকের রীতি। তিনি পাওয়ার জন্য আসেন না। তিনি তাঁকে খুঁজতে আসেন যার তাঁকে দরকার।',
        ],
      },
    ],
    terms: ['সবুজ মানুষ, লুকানো শিক্ষক', 'আল্লাহর স্মরণ', 'আউলিয়ার কারামত'],
    closing:
      'তিন সাক্ষাৎ, আর এক শিক্ষক যিনি কখনো থাকেন না। আল-খিদর আসেন সত্য বলে মানতে, উপদেশ দিতে, আর সন্দেহ দূর করতে। তারপর তিনি চলে যান, আর সন্ধানকারীর কাছে শিক্ষাটা থেকে যায়। এটাই পুরো কথা।',
  },
  'rijal-al-ghayb': {
    eyebrow: 'টপিক',
    title: 'রিজাল আল-গায়েব আর কুতুব',
    subtitle: 'অদৃশ্যের লুকানো মানুষেরা, আর সেই কেন্দ্র যাকে ঘিরে তাঁরা ঘোরেন।',
    intro:
      'কিছু মানুষ আছেন যাঁদের সঙ্গে তুমি কখনো দেখা করবে না, আর দুনিয়া তাঁদের উপরেই ঘোরে। বই তাঁদের বলে Rijal al-Ghayb, অদৃশ্যের মানুষেরা। তাঁরা লুকানো নন কারণ তাঁরা লুকিয়ে থাকেন। তাঁরা লুকানো কারণ দুনিয়া তাঁদের দেখে না। এখানে তাঁদের মর্যাদা আছে, যেমন বই বলে।',
    sections: [
      {
        heading: 'কুতুব, কেন্দ্র',
        paragraphs: [
          'সবার উপরে দাঁড়িয়ে আছেন Qutb, কেন্দ্র। তাঁকে Ghawth ও বলে, সাহায্যকারী। বই বলে Qutb মক্কায় আছেন, আর দুনিয়া তাঁকে ঘিরে ঘোরে, যেমন চাকা তার অক্ষকে ঘিরে ঘোরে।',
        ],
      },
      {
        heading: 'দুই ইমাম',
        paragraphs: [
          'কুতুবের নিচে দাঁড়িয়ে আছেন দুই ইমাম। ডানের ইমাম হলেন Mulk, জড় জগৎ। বাঁয়ের ইমাম হলেন Malakut, হুকুমতের জগৎ। দুই ইমাম, দুই জগৎ, আর তাঁদের দুজনের উপরে এক কেন্দ্র।',
        ],
      },
      {
        heading: 'চার স্তম্ভ',
        paragraphs: [
          'ইমামদের নিচে দাঁড়িয়ে আছেন চার স্তম্ভ, Awtad। চারজন মানুষ, পৃথিবীর চার কোণ ধরে আছেন। তাঁদের একজন মারা গেলে, আরেকজন উঠে তাঁর জায়গা নেন।',
        ],
      },
      {
        heading: 'সাত বদল',
        paragraphs: [
          'স্তম্ভদের নিচে দাঁড়িয়ে আছেন সাত বদল, Abdal। তাঁদের বদল এজন্য বলে যে তাঁরা একে অপরের জায়গা নেন। একজন চলে গেলে, আরেকজন তাঁর জায়গা নেন, আর সংখ্যা সাতই থাকে।',
        ],
      },
      {
        heading: 'নজিব আর নকিব',
        paragraphs: [
          'বদলদের নিচে দাঁড়িয়ে আছেন নজিব আর নকিব, Nujaba আর Nuqaba। বই তাঁদের সংখ্যা সত্তর আর তিনশো বলে। তাঁরা লুকানো মানুষদের বড় বৃত্ত।',
        ],
      },
      {
        heading: 'সুলায়মানের দরজা',
        paragraphs: [
          'সুলায়মানের দরজা আল-মুনজিরি থেকে এক কথা বলে। আল-খিদর আর ইলিয়াস তার মাথায় দাঁড়িয়ে আছেন। তারপর আসেন তিনশো বন্ধু, চল্লিশ Abdal, সত্তর Nujaba, সাত Urafa, চার Awtad, আর এক Ghawth। সংখ্যাগুলো বইয়ে দেওয়া আছে, আর আমি সেগুলো সেভাবেই দিচ্ছি যেভাবে পেয়েছি।',
          'মর্যাদাটাই আসল কথা। প্রতিটি মর্যাদা তার উপরের জনকে জবাব দেয়। প্রতিটি মানুষ তাঁর জায়গায় দাঁড়িয়ে থাকেন যতক্ষণ না আল্লাহ তাঁকে ডাকেন, আর তারপর আরেকজন তাঁর জায়গায় উঠে দাঁড়ান। দুনিয়া কখনো তার লুকানো মানুষদের ছাড়া থাকে না।',
        ],
      },
    ],
    terms: [
      'অদৃশ্যের মানুষেরা',
      'কেন্দ্র, সেই অক্ষ যাকে ঘিরে দুনিয়া ঘোরে',
      'সাহায্যকারী, কুতুবের আরেক নাম',
      'স্তম্ভ, চার সাপোর্ট',
      'বদল, সেই সাতজন',
      'নজিব, সেই সত্তরজন',
    ],
    closing:
      'এটাই লুকানো মানুষদের মর্যাদা: এক কেন্দ্র, দুই ইমাম, চার স্তম্ভ, সাত বদল, আর তাঁদের নিচে বড় বৃত্তগুলো। তুমি তাঁদের সঙ্গে দেখা করবে না। কিন্তু বই বলে দুনিয়া এজন্য ঘোরে যে তাঁরা যেখানে দাঁড়িয়ে আছেন, সেখানেই দাঁড়িয়ে আছেন।',
  },
  'uwaisi-transmission': {
    eyebrow: 'টপিক',
    title: 'উয়াইসি তরিকা',
    subtitle: 'জীবিত শিক্ষক ছাড়া, শরীর ছাড়া, শিক্ষা।',
    intro:
      'প্রতিটি সুফি পথের এক শিক্ষক থাকে। কিন্তু কিছু সন্ধানকারী তাঁদের শিক্ষকের সঙ্গে শরীরে কখনো দেখা করেন না। তাঁদের সময়ের ওপারে, মৃত্যুর ওপারে, পর্দার ওপারে শেখানো হয়। বই এই পথকে Uwaisi বলে। এখানে তার মানে আছে।',
    sections: [
      {
        heading: 'জীবিত শিক্ষক ছাড়া শিক্ষা',
        paragraphs: [
          'উয়াইসি পথ হলো জীবিত শিক্ষক ছাড়া শিক্ষা, শরীরে। শিক্ষক মারা গিয়ে থাকতে পারেন। শিক্ষক দূরে থাকতে পারেন। সম্পর্ক তবু থাকে, কারণ সম্পর্ক শরীরের নয়। এটা আত্মার।',
          'নাম এসেছে Uwais al-Qarani থেকে, সেই মানুষ যিনি নবীকে ভালোবাসতেন আর কখনো তাঁর সঙ্গে দেখা করেননি। তাঁকে দেখা ছাড়াই শেখানো হয়েছিল। বই তাঁকে এই ধারার প্রথম হিসেবে বলে।',
        ],
      },
      {
        heading: 'তিন উদাহরণ',
        paragraphs: [
          'আবু আল-হাসান আল-খারাকানিকে বায়েজিদ আল-বিস্তামি শিক্ষা দিয়েছিলেন, যদিও বায়েজিদ তাঁদের দেখা হওয়ার আগেই মারা গিয়েছিলেন। আত্তারকে আল-হাল্লাজ শিক্ষা দিয়েছিলেন, যদিও হাল্লাজ অনেক আগেই মারা গিয়েছিলেন। আর আবদ আল-কাদিরের ব্যাপারে বলে যে তিনি বাগদাদে এক মজলিসে বসেছিলেন, তাঁদের কাছ থেকে শিক্ষা পেতে পেতে যাঁরা শরীরে সেখানে ছিলেন না।',
          'তিনজন মানুষ, তিন শিক্ষক, আর প্রতিবার শিক্ষক এই দুনিয়া থেকে চলে গিয়েছিলেন। শিক্ষা কবরের ওপার থেকে এলো, যেমন আলো জানালার ওপার থেকে আসে।',
        ],
      },
      {
        heading: 'এটা কীভাবে কাজ করে',
        paragraphs: [
          'বই কীভাবে তা বোঝায় না। তারা শুধু সত্যটা লেখে। এক সন্ধানকারী তাঁর হৃদয় অতীতের এক গুরুর দিকে ফেরায়, আর গুরু জবাব দেন। সম্পর্ক তৈরি হয় আত্মার জগতে, যেখানে মৃত্যু কোনো দেয়াল নয়।',
          'এটাই পুরো কথা। উয়াইসি পথ কোনো চাল নয় আর কোনো শর্টকাট নয়। এটা এক সম্পর্ক যা ধরে রাখতে শরীরের দরকার নেই।',
        ],
      },
    ],
    terms: ['উয়াইসের পথ, জীবিত শিক্ষক ছাড়া শিক্ষা'],
    closing:
      'শিক্ষককে শেখাতে জীবিত থাকার দরকার নেই। বই উদাহরণ দেয়, আর উদাহরণ যথেষ্ট। সম্পর্ক আত্মার, আর আত্মা মরে না।',
  },
  'renewal-of-creation': {
    eyebrow: 'টপিক',
    title: 'সৃষ্টির নবায়ন',
    subtitle: 'প্রতিটি মুহূর্তে, দুনিয়া আবার তৈরি হয়।',
    intro:
      'দুনিয়াকে শক্ত মনে হয়। পাথর সেখানেই আছে যেখানে গতকাল ছিল। গাছ সেখানেই দাঁড়িয়ে আছে যেখানে ছিল। কিন্তু বই বলে দুনিয়া মোটেই শক্ত নয়। এটা প্রতিটি মুহূর্তে আবার তৈরি হয়, একদম নতুন, শূন্য থেকে। এখানে সৃষ্টির নবায়নের শিক্ষা আছে।',
    sections: [
      {
        heading: 'মুহূর্তে সৃষ্টি',
        paragraphs: [
          'শিক্ষাটিকে বলে tajaddud al-khalq, সৃষ্টির নবায়ন। এটা বলে দুনিয়া প্রতিটি মুহূর্তে আবার তৈরি হয়। কিছুই এক মুহূর্ত থেকে আরেক মুহূর্তে থাকে না। প্রতিটি মুহূর্ত এক নতুন তৈরি।',
          'যে পাথর তুমি দেখো, সেটা এক মুহূর্ত আগের পাথর নয়। এটা এক নতুন পাথর, পুরনোটার আকারে বানানো, এত দ্রুত আর এত নিখুঁতভাবে যে তোমার চোখ পার্থক্য করতে পারে না। দুনিয়া এক নদী, পাথর নয়।',
        ],
      },
      {
        heading: 'কুরআনের ভিত্তি',
        paragraphs: [
          'কুরআন সূরা কাফে প্রশ্ন করে: আমরা কি প্রথম সৃষ্টিতে ক্লান্ত হয়ে গিয়েছিলাম? না, সে বলে। তারা নতুন সৃষ্টির ব্যাপারে বিভ্রান্ত সন্দেহে আছে। আয়াতটি শিক্ষার নিচের মাটি। আল্লাহ প্রথম বানানোতে ক্লান্ত হননি, আর তিনি তা আবার বানাতে ক্লান্ত হন না।',
        ],
        quoteText: 'আমরা কি প্রথম সৃষ্টিতে ক্লান্ত হয়ে গিয়েছিলাম? না, তারা নতুন সৃষ্টির ব্যাপারে বিভ্রান্ত সন্দেহে আছে।',
      },
      {
        heading: 'সন্ধানকারীর জন্য এটার মানে কী',
        paragraphs: [
          'দুনিয়া যদি প্রতিটি মুহূর্তে আবার তৈরি হয়, তবে কিছুই স্থির নয়। অতীত তোমার মালিক নয়। পরের মুহূর্ত এক নতুন সৃষ্টি, আর তাতে তুমিও নতুন করে তৈরি হতে পারো।',
          'এজন্যই শিক্ষাটা জরুরি। এটা আকাশের ব্যাপারে কোনো তত্ত্ব নয়। এটা এক দরজা। প্রতিটি মুহূর্ত এক নতুন শুরু, সেই হাতেই বানানো যা প্রথমটি বানিয়েছিল।',
        ],
      },
    ],
    terms: ['সৃষ্টির নবায়ন'],
    closing:
      'দুনিয়া প্রতিটি মুহূর্তে আবার তৈরি হয়, একদম নতুন, শূন্য থেকে। পাথর, গাছ, আর তুমি। এটাই শিক্ষা। আর এর মানে হলো পরের মুহূর্ত সবসময় এক নতুন শুরু।',
  },
  'quranic-drinks': {
    eyebrow: 'টপিক',
    title: 'ইবনে আরাবির সফরে পানীয়গুলো',
    subtitle: 'পানি, দুধ, মধু আর মদ: এই পানীয়গুলোর মানে কী।',
    intro:
      'সফরের মাঝখানে, ইবনে আরাবিকে পানীয় দেওয়া হয়। পানি, দুধ, মধু, মদ। এগুলো শুধু পানীয় নয়। প্রতিটি এক রকমের জ্ঞান, আর বই তাদের একে একে খোলে। এখানে সেই খোলা আছে, বই থেকে।',
    sections: [
      {
        heading: 'পানি: পরম জ্ঞান',
        paragraphs: [
          'পানি হলো পরম জ্ঞান। বই এক নিয়ম দেয়: তোমাকে পান করতে কিছু দেওয়া হলে, পানি বেছে নাও। পানি প্রথম পছন্দ, কারণ পরম জ্ঞান প্রথম জ্ঞান।',
          'পানির কোনো রং নেই আর নিজের কোনো স্বাদ নেই। এটা তার পেয়ালার আকার নেয়। পরম জ্ঞান তেমনই। এটা প্রতিটি অন্য জ্ঞানের নিচের মাটি।',
        ],
      },
      {
        heading: 'দুধ: পবিত্র পথের জ্ঞান',
        paragraphs: [
          'দুধ হলো পবিত্র পথের জ্ঞান, আর এটা fitrah, স্বাভাবিক স্বভাব। এটা নবীর পছন্দ। বই নিয়ম দেয়: পানি না থাকলে, দুধ বেছে নাও।',
          'দুধ ছোটকে খাওয়ায়। পবিত্র পথ সন্ধানকারীকে খাওয়ায়। দুটোই স্বাভাবিক, দুটোই দেওয়া, আর দুটোই বেড়ে ওঠা মানুষের প্রথম খাবার।',
        ],
      },
      {
        heading: 'পানি আর দুধ মেশানো',
        paragraphs: [
          'বই পানি আর দুধ মেশানোর কথাও বলে। মিশ্রণটি জ্ঞানের দ্বিতীয় শাখাগুলো আর প্রথম পবিত্র শরিয়তি জ্ঞানের মাঝে ঠিক সম্পর্ক। শাখাগুলো পানি। পবিত্র শরিয়তি জ্ঞান দুধ। একসঙ্গে তারা এক পানীয়।',
        ],
      },
      {
        heading: 'মধু: হালাল জ্ঞান',
        paragraphs: [
          "মধু হলো হালাল দার্শনিক আর ঐতিহ্যবাহী জ্ঞান। বই বলে, 'এটা মধুর ক্ষেত্রেও প্রযোজ্য: এটা পান করো।' মধু মিষ্টি আর হালাল, আর যে জ্ঞানের জন্য এটা দাঁড়িয়ে আছে, সেটাও মিষ্টি আর হালাল।",
        ],
      },
      {
        heading: 'মদ: ভাবের অবস্থার জ্ঞান',
        paragraphs: [
          "মদ হলো ভাবের অবস্থার জ্ঞান। বই এখানে সাবধান করে। এটা বলে, 'এটা পান করতে সাবধান থেকো... নইলে এটা পান করা থেকে বিরত থাকো।' না মেশানো মদ নেশা, আর নেশা পথ নয়।",
          'কিন্তু বৃষ্টির পানিতে মেশানো মদ হেদায়েতওয়ালা আর হুঁশওয়ালা। বৃষ্টির পানি সেই জ্ঞান যা উপর থেকে আসে। নদী আর ঝরনার পানি বুদ্ধির জ্ঞান, আর এটা অবস্থাগুলোকে গুলিয়ে দেয়। পার্থক্য এতে যে মদ কিসে মেশানো হয়েছে।',
        ],
      },
    ],
    terms: ['পরম জ্ঞান', 'স্বাভাবিক স্বভাব', 'পবিত্র পথের জ্ঞান'],
    closing:
      'প্রথমে পানি, তারপর দুধ, মধু যখন দেওয়া হয়, আর মদ শুধু যখন তাতে বৃষ্টির পানি মেশানো হয়। পানীয়গুলো জ্ঞানের এক মানচিত্র। বই যেভাবে বলে, সেভাবে বেছে নাও, আর মানচিত্র তোমাকে সোজা নিয়ে যাবে।',
  },
};

// Hinglish questions intentionally EMPTY, same reason as TOPICS_HI:
// the notebook's Hinglish questions (with sources and pages) are
// coming, and localizeQuestion falls back to English until then.
const QUESTIONS_HI: Record<string, QuestionLocalization> = {
  "what-is-the-ruh": {
    question: "Ruh aur Nafs mein asal farq kya hai?",
    answer: [
      "Ruh roshni hai. Woh Allah ke hukm se hai. Woh Alam al-Amr se aati hai. Quran kehta hai ke ruh mere Rab ke hukm se hai. Yeh wahi noor hai jo Adam ke mitti ke jism mein phoonka gaya tha.",
      "Ruh aur nafs dil par ladte hain. Ruh baap hai. Nafs maa hai. Aur baccha Qalb hai. Agar nafs jeet jaye to dil janwar jaisi khwahishon mein barbaad ho jata hai. Agar ruh jeet jaye to dil paak ho jata hai. Woh Allah ke Naamon ka aaina ban jata hai.",
      "Jism ruh ka pinjra hai. Aur uski sawari bhi. Dimaag uska signal pakadne wala station hai. Hosh ruh se aata hai. Dimaag se nahi.",
    ],
    terms: ["rooh, roohani roshni", "hukm ki duniya"],
  },
  "what-is-special-about-alif": {
    question: "Harf Alif mein kya khaas hai?",
    answer: [
      "Alif harfon ka sardar hai. Pehla harf. Uski value 1 hai. Woh seedha khada hai. Aur apne se pehle kisi se nahi judta. Woh Arsh aur Aql se juda hai. Aur woh Tawhid ka nishan hai.",
      "Jab Alif ko uske parts mein khola jaye to total 111 ban jata hai. Yeh teen baar 1 hai. Mulk mein Tawhid, Malakut mein Tawhid, aur Jabarut mein Tawhid. Number ke badalne ke baad iska andaruni balance 113 par rukta hai. Alif ki tabi'at aag jaisi hai. Uska din Sunday hai. Aur uski manzil chaand ki pehli manzil hai.",
      "Kitabein batati hain ke Alif kaise bana. Qalam ke sir se ek qatra gira. Woh Hamza bana. Aur Hamza Alif bana. Harf Qalam se hi paida hua. Alif Aql ke daire ke upar khada hai. Uske neeche Ayn hai. Harfon ke badalne ke daire par.",
    ],
    terms: ["pehla harf", "harf-number ka nizaam", "harfon ke badalne ka daira"],
  },
  "did-solomon-have-a-ring": {
    question: "Kya Sulayman ke paas sach mein ek angoothi thi?",
    answer: [
      "Quran kehta hai ke Sulayman ko jinn aur hawa par hukm diya gaya tha. Allah ne unhe aisi saltanat di jo kisi aur ko nahi di. Lekin Quran kisi jismani angoothi ka naam nahi leta. Angoothi baad ki kitabon se aayi hai. Khatam Sulayman saari muhron ka namuna hai.",
      "Shams chaar likhi hui satahein batata hai. Pehli kehti hai ke main Allah hoon. Mere siwa koi mabood nahi. Doosri kehti hai ke main Allah hoon, Al-Hayy Al-Qayyum. Teesri kehti hai ke main Allah hoon, Al-Aziz. Chauthi poori Ayat al-Kursi hai. Yahi likhai pehle se Adam ke dil par likhi thi. Manba' saat nishan batata hai. Paanch kone wala sitara, teen lakeerein, band Mim, seedhi, chaar lakeerein, phaati hui Ha, aur jhuka hua Waw.",
      "Kitabein jinn ke 72 qabeelon ki baat karti hain. 72 alag roohon ki nahi. Aur Rumi kehte hain ke dil Sulayman hai. Paanch bahari hawaas aur paanch andaruni hawaas uske sipahi hain. Jaise Sulayman jinn par hukm chalate the.",
    ],
    terms: ["Sulayman ki muhr", "ghayb ki makhlooq"],
  },
  "three-kinds-of-dreams": {
    question: "Khwab ki teen qism kya hain?",
    answer: [
      "Teen qism hain. Saccha khwab, Ru'ya Sadiqah, Allah ki taraf se khushkhabri hai. Kitabein use nubuwwat ka chhiyaliswa hissa kehti hain. Shaitan ka khwab, Hulm, darata hai aur uljhata hai. Teesri qism nafs ki apne aap se baat hai. Din ke khayal raat mein wapas aate hain.",
      "Imam Ali ne kaha ke gehri neend mein rooh Arsh ki taraf udti hai. Jo rooh wahan pahunch jaye, woh sacche khwab dekhti hai. Jo rooh raste mein ruk jaye, uske khwab uljhe hue hote hain.",
      "Ibn Arabi kehte hain ke neend rooh ko hawaas se alag kar deti hai. Aur woh Alam al-Mithal mein dakhil hoti hai. Wahan ma'ne dikhai dene wali shakal le lete hain. Ilm, misaal ke taur par, doodh ki shakal mein aata hai. Darawne khwab ke peeche mat bhaago. Aur use doosron ko mat batao.",
    ],
    terms: ["saccha khwab", "nafs ki apne aap se baat", "Shaitan ki taraf se"],
  },
  "what-happened-when-solomon-died": {
    question: "Jab Sulayman ka inteqal hua to kya hua?",
    answer: [
      "Sulayman apne staff par tike hue inteqal farma gaye. Kisi ko pata nahi chala. Zameen ka keeda, deemak, staff ki lakdi ke andar ka hissa khata raha. Staff toota. Unka jism gir gaya. Tabhi jinn ko pata chala ke woh guzar chuke hain.",
      "Tafsir Ibn Kathir batata hai ke aas paas kya hua. Sulayman ne un jhoothi kitabon ko zabt kar liya tha jo shaitanon ne kahinon ko likhwayi thi. Unhone unhe apne takht ke neeche dafan kar diya tha. Unhone khabardar kiya tha ke jo kahe ke jinn ghayb jaante hain, use saza milegi. Unke inteqal ke baad Shaitan ne kitabein khod nikali. Taaki Sulayman ko jadugar keh kar badnaam kare.",
      "Sabak saaf hai. Agar jinn ghayb jaante to is zaleel azaab mein na rehte. Imam Ali Nahj al-Balagha mein Sulayman ki maut ko maut ki yaqeeni hone ka sab se bada sabak kehte hain.",
    ],
    quoteText:
      "Jab woh gir gaye, to jinn par saaf ho gaya ke agar woh ghayb jaante, to woh is zaleel azaab mein na rehte.",
    terms: ["zameen ka keeda", "staff"],
  },
  "what-is-alam-al-mithal": {
    question: "Alam al-Mithal kya hai?",
    answer: [
      "Alam al-Mithal misaal ki duniya hai. Yeh jismani duniya aur Malakut ki duniya ke beech mein hai. Wahan ma'ne dikhai dene wali shakal le lete hain. Ilm doodh ki shakal mein aata hai. Ehsaas rang ki shakal mein aata hai. Jo yahan khayal hai, woh wahan shakal hai.",
      "Khwab isi duniya mein hote hain. Neend mein rooh hawaas se aazaad hokar isme dakhil hoti hai. Isi liye khwab tumhe ek sacchi cheez dikha sakta hai, aisi shakal mein jo lafzi nahi hai. Auliya ki himmat bhi isi duniya mein kaam karti hai.",
    ],
    terms: ["misaal ki duniya"],
  },
  "who-are-rijal-al-ghayb": {
    question: "Rijal al-Ghayb kaun hain?",
    answer: [
      "Rijal al-Ghayb ghayb ke mard hain. Woh chhupe hue mard jinke upar duniya ghoomti hai. Sab se upar Qutb hai. Markaz. Use Ghawth bhi kaha jata hai. Madadgar. Kitabein kehti hain ke woh Mecca mein hain.",
      "Unke neeche do Imam hain. Chaar Awtad hain. Saat Abdal hain. Aur unke neeche bade circle hain. Sattar Nujaba aur teen sau Nuqaba. Har darja apne upar wale ko jawab deta hai. Jab ek aadmi chala jaye to doosra uski jagah le leta hai.",
    ],
    terms: ["ghayb ke mard", "markaz, woh mehwar jiske gird duniya ghoomti hai"],
  },
  "why-do-letters-work": {
    question: "Ilm al-Huruf kaise kaam karta hai?",
    answer: [
      "Kitabein buniyaad saaf batati hain. Harf Allah ke kalaam ki pehli building blocks hain. Jin se takhleeq boli gayi. Harf jism hain. Ajsam. Aur number unki rooh hain. Arwah. Allah ne Adam ko naam sikhaye. Aur naam harfon se bane hain. Isi liye harf un lafzon ki taaqat rakhte hain jinhe woh banate hain.",
      "Ilm al-Huruf isi taaqat se kaam karta hai. Woh use banata nahi hai. Woh use tolta hai, jodta hai, aur lagata hai. Jaise mistri deewaar banane se pehle eentein ginta hai. Anasir ki tabi'at ko balance karke, aur Allah ke Naamon ki Abjad value se.",
    ],
    terms: ["harf-number ka nizaam", "number"],
  },
  "is-the-picatrix-in-these-books": {
    question: "Kya Picatrix (Ghayat al-Hakim) in kitabon mein hai?",
    answer: [
      "Nahi. Al Asrar notebook ke 98 sources mein se kisi mein bhi Ghayat al-Hakim ka zikr nahi hai. Woh kitab jise West mein Picatrix kaha jata hai.",
      "Iska matlab yeh nahi hai ke kitab maujood nahi hai. Iska matlab sirf yeh hai ke woh is collection mein nahi hai. Agar ek din woh add ho jaye, to yeh jawab badal jayega.",
    ],
    terms: [],
  },
};

const QUESTIONS_BN: Record<string, QuestionLocalization> = {
  'what-is-the-ruh': {
    question: 'রুহ, আত্মা, কী?',
    answer: [
      "রুহ হলো আত্মা। বই বলে এটা এক আলোময়, সূক্ষ্ম জিনিস। এটা আসে Alam al-Amr থেকে, হুকুমের জগৎ থেকে, জড় জগৎ থেকে নয়। কুরআন বলে, 'রুহ আমার রবের হুকুম থেকে।' আল্লাহ তাকে আদমের মাটিতে ফুঁ দিয়েছেন।",
      'রুহ আর নফস হৃদয়ের উপর লড়ে। রুহ পুরুষসুলভ, নফস নারীসুলভ, আর হৃদয় তাদের মাঝে দাঁড়িয়ে আছে। নফস যখন তার নিচু ইচ্ছাগুলো থেকে মরে যায়, তখন রুহ তার প্রথম পবিত্রতায় ফিরে আসে।',
      'শরীর তার খাঁচা আর তার বাহন। মস্তিষ্ক তার সংকেত ধরার কেন্দ্র। চেতনা আসে রুহ থেকে, মস্তিষ্ক থেকে নয়।',
    ],
    terms: ['আত্মা, রুহ', 'হুকুমের জগৎ'],
  },
  'what-is-special-about-alif': {
    question: 'আলিফ অক্ষরে কী বিশেষ আছে?',
    answer: [
      'আলিফ প্রথম অক্ষর, আর তার Abjad মান 1। এটা সোজা দাঁড়িয়ে আছে আর তার আগের কিছুর সঙ্গে জোড়ে না। এটা আরশ আর আকলের সঙ্গে জোড়া, আর এটা আগুনের সাত অক্ষরের দলে দাঁড়িয়ে আছে।',
      'বই বলে আলিফ কীভাবে তৈরি হয়েছিল। কলমের মাথা থেকে এক ফোঁটা পড়ে Hamza হলো, আর Hamza আলিফ হলো। অক্ষর কলম থেকেই জন্মেছে।',
      'আলিফ আকলের গোলকের উপরেও দাঁড়িয়ে আছে, তার নিচে Ayn-এর সঙ্গে, অক্ষর বদলের চাকায়। চাকাটি সেই মানচিত্র যা বলে অক্ষর কীভাবে চলে আর বদলায়।',
    ],
    terms: ['প্রথম অক্ষর', 'অক্ষর-সংখ্যার নিয়ম', 'অক্ষর বদলের চাকা'],
  },
  'did-solomon-have-a-ring': {
    question: 'সুলায়মানের কি সত্যিই এক আংটি ছিল?',
    answer: [
      'কুরআন বলে সুলায়মানকে জিন আর বাতাসের উপর হুকুম দেওয়া হয়েছিল। এটা কোনো বাস্তব আংটির নাম নেয় না। আংটি পরের বইগুলো থেকে এসেছে। সুলায়মানের মোহর সব মোহরের নমুনা, সেই ছাঁচ যা প্রতিটি মোহর মেনে চলে।',
      "Shams চারটি লেখা স্তর বলে, যেমন Wahb ibn Munabbih বলেছিলেন। প্রথমটি বলে, 'আমি আল্লাহ; আমি কখনো শেষ হইনি।' দ্বিতীয়টি বলে, 'আমি আল্লাহ, জীবিত, চিরস্থায়ী।' তৃতীয়টি বলে, 'আমি আল্লাহ, মহাশক্তিমান।' চতুর্থটি আয়াতুল কুরসি। একই লেখা শুরু থেকেই আদমের হৃদয়ে লেখা ছিল। আর বই সুলায়মানের এক 3x3 বর্গও দেয়, যা আদম আর আসাফের সঙ্গেও জোড়া, আর আল-গাজালির নামে বিখ্যাত।",
      "Manba' সবচেয়ে বড় নামের মোহরের সাতটি চিহ্ন বলে: এক পাঁচ কোণা তারা, তিনটি লাঠি, এক অন্ধ লেজ ছাড়া Mim, এক মই, চার আঙুলের দাগ, এক ফাটা Ha, আর এক বাঁকা Waw। বই বলে জিনের 72 গোত্র, 72 আলাদা আত্মা নয়। আর রুমি হৃদয়কে সুলায়মান হিসেবে পড়েন, যিনি পাঁচ বাইরের ইন্দ্রিয় আর পাঁচ ভেতরের ইন্দ্রিয়ের উপর হুকুম চালান, যেমন সুলায়মান জিনের উপর হুকুম চালাতেন।",
    ],
    terms: ['সুলায়মানের মোহর', 'অদৃশ্য প্রাণী'],
  },
  'three-kinds-of-dreams': {
    question: 'স্বপ্নের তিন রকম কী কী?',
    answer: [
      "তিন রকম। সত্য স্বপ্ন, ru'ya sadiqah, আল্লাহর পক্ষ থেকে সুসংবাদ, আর বই তাকে নবুওয়তের ছেচল্লিশ ভাগের এক ভাগ বলে। শয়তানি স্বপ্ন, hulm, এক ভয় যা ভয় দেখায় আর গুলিয়ে দেয়। তৃতীয় রকম হলো আত্মার নিজের সঙ্গে কথা, দিনের ভাবনা রাতে ফিরে আসে।",
      'ইমাম আলি বলেছেন গভীর ঘুমে আত্মা আল্লাহর আরশের দিকে উপরে যায়। যে আত্মা সেখানে পৌঁছে যায়, সে সত্য দর্শন দেখে। যে আত্মা পথে থেমে যায়, সে গুলিয়ে যাওয়া স্বপ্ন দেখে।',
      'ইবনে আরাবি বলেন ঘুম আত্মাকে তার ইন্দ্রিয়ের কাজ থেকে আলাদা করে দেয়, আর সে Alam al-Mithal-এ ঢোকে, মিলের জগতে। সেখানে, বিমূর্ত অর্থ দেখা যায় এমন আকার নেয়। জ্ঞান, যেমন, দুধ হিসেবে দেখা যায়। বই বলে ভয় দেখানো রকমের পেছনে ছুটো না, আর তা অন্যদের বলো না।',
    ],
    terms: ['সত্য স্বপ্ন', 'আত্মার নিজের সঙ্গে কথা', 'শয়তানের পক্ষ থেকে'],
  },
  'what-happened-when-solomon-died': {
    question: 'সুলায়মান যখন মারা গেলেন তখন কী হয়েছিল?',
    answer: [
      'সুলায়মান তাঁর লাঠিতে হেলান দিয়ে মারা গেলেন, আর কেউ জানল না। এক উইপোকা, মাটির প্রাণী, লাঠির কাঠের ভেতরটা খেয়ে ফেলল। এটা ভেঙে গেল, তাঁর শরীর পড়ে গেল, আর তখনই জিন দেখল যে তিনি মারা গেছেন।',
      'তাফসির ইবনে কাসির বলে আশেপাশে কী হয়েছিল। সুলায়মান সেই ধোঁকাবাজ বইগুলো বাজেয়াপ্ত করেছিলেন যা শয়তানরা গণকদের লিখিয়েছিল, আর সেগুলো তাঁর সিংহাসনের নিচে পুঁতে দিয়েছিলেন। তিনি সাবধান করেছিলেন যে বলবে জিন অদৃশ্য জানে, তাকে তিনি মেরে ফেলবেন। তাঁর মৃত্যুর পর, শয়তান বইগুলো খুঁড়ে বের করল, সুলায়মানকে জাদুকর বলে বদনাম করতে।',
      'শিক্ষা পরিষ্কার। জিন যদি অদৃশ্য জানত, তবে তারা লাঞ্ছনার শাস্তিতে থাকত না। ইমাম আলি Nahj al-Balagha-তে সুলায়মানের মৃত্যুকে মৃত্যুর নিশ্চিত হওয়ার সবচেয়ে বড় শিক্ষা বলেন।',
    ],
    quoteText: 'যখন তিনি পড়ে গেলেন, তখন জিনের কাছে পরিষ্কার হয়ে গেল যে তারা যদি অদৃশ্য জানত, তবে তারা লাঞ্ছনার শাস্তিতে থাকত না।',
    terms: ['মাটির প্রাণী', 'লাঠি'],
  },
  'what-is-alam-al-mithal': {
    question: 'আলম আল-মিসাল কী?',
    answer: [
      'আলম আল-মিসাল মিলের জগৎ, সাদৃশ্যের জগৎ। এটা জড় জগৎ আর হুকুমতের জগতের মাঝে দাঁড়িয়ে আছে। এতে, অর্থ দেখা যায় এমন আকার নেয়। জ্ঞান দুধ হিসেবে দেখা যায়। অনুভূতি রং হিসেবে দেখা যায়। যা এখানে বিমূর্ত, তা সেখানে এক আকার হয়ে যায়।',
      'স্বপ্ন এই জগতে হয়। ঘুমে, আত্মা ইন্দ্রিয় থেকে মুক্ত হয়ে যায় আর এতে ঢোকে। এজন্যই স্বপ্ন তোমাকে এক সত্য জিনিস দেখাতে পারে, এমন এক আকারে যা আক্ষরিক নয়।',
    ],
    terms: ['মিলের জগৎ'],
  },
  'who-are-rijal-al-ghayb': {
    question: 'রিজাল আল-গায়েব কারা?',
    answer: [
      'রিজাল আল-গায়েব অদৃশ্যের মানুষেরা, সেই লুকানো মানুষেরা যাঁদের উপর দুনিয়া ঘোরে। সবার উপরে দাঁড়িয়ে আছেন Qutb, কেন্দ্র, যাঁকে Ghawth ও বলে, সাহায্যকারী। বই বলে তিনি মক্কায় আছেন।',
      'তাঁর নিচে দাঁড়িয়ে আছেন দুই ইমাম, চার স্তম্ভ, সাত বদল, আর বড় বৃত্তগুলো: সত্তর নজিব আর তিনশো নকিব। প্রতিটি মর্যাদা তার উপরের জনকে জবাব দেয়, আর একজন মানুষ মারা গেলে আরেকজন তাঁর জায়গায় উঠে দাঁড়ান।',
    ],
    terms: ['অদৃশ্যের মানুষেরা', 'কেন্দ্র, সেই অক্ষ যাকে ঘিরে দুনিয়া ঘোরে'],
  },
  'why-do-letters-work': {
    question: 'ইলম আল-হুরুফ কীভাবে কাজ করে?',
    answer: [
      'বই ভিত্তি পরিষ্কার বলে। অক্ষরই ভিত্তি। প্রতিটি অক্ষর এক সংখ্যা রাখে, আর সংখ্যাগুলো অক্ষরের আত্মা। আল্লাহ আদমকে নাম শিখিয়েছিলেন, আর নাম অক্ষর দিয়ে তৈরি। তাই অক্ষর সেই শব্দগুলোর শক্তি রাখে যা তারা তৈরি করে।',
      'ইলম আল-হুরুফ সেই শক্তি নিয়েই কাজ করে। এটা তাকে বানায় না। এটা তাকে গোনে, জোড়ে, আর লাগায়, যেমন মিস্ত্রি দেয়াল বানানোর আগে ইট গোনে।',
    ],
    terms: ['অক্ষর-সংখ্যার নিয়ম', 'সংখ্যা'],
  },
  'is-the-picatrix-in-these-books': {
    question: 'Picatrix (Ghayat al-Hakim) কি এই বইগুলোতে আছে?',
    answer: [
      'না। আল আসরার নোটবুকের 98টি উৎসের কোনোটিই Ghayat al-Hakim-এর কথা বলে না, সেই বই যাকে পশ্চিমে Picatrix বলে।',
      'এর মানে এই নয় যে বইটি নেই। এর মানে শুধু এই যে এটা এই সংগ্রহে নেই। একদিন যদি এটা যোগ হয়, তবে এই উত্তর বদলে যাবে।',
    ],
    terms: [],
  },
};

// Hinglish guides intentionally EMPTY, same reason as TOPICS_HI:
// long-form Hinglish comes from the notebook, not from translation.
// localizeGuide falls back to English until then.
const GUIDES_HI: Record<string, TopicLocalization> = {};

const GUIDES_BN: Record<string, TopicLocalization> = {
  'tabdid-al-ilm': {
    eyebrow: 'স্টাডি গাইড',
    title: 'তাবদিদ আল-ইলম: জ্ঞান কেন ছড়ানো আছে',
    subtitle: 'জ্ঞানীরা তাঁদের বই বন্ধ করে দিয়েছেন, আর ছাত্রকে টুকরোগুলো জোগাড় করতে হবে।',
    intro:
      'পুরনো বই ইচ্ছে করেই কঠিন করে লেখা হয়েছে। জ্ঞানীরা সেগুলো ধাঁধা দিয়ে বন্ধ করে দিয়েছেন। তাঁরা ক্রম উল্টেপাল্টে দিয়েছেন। তাঁরা এক কাজকে অনেক অধ্যায়ে ভাগ করে দিয়েছেন। এটা দুর্ঘটনা নয়। এটা এক পদ্ধতি, আর তার নাম Tabdid al-Ilm, জ্ঞানের ছড়িয়ে দেওয়া।',
    sections: [
      {
        heading: 'জ্ঞানীরা জ্ঞান কেন ছড়িয়ে দিয়েছিলেন',
        paragraphs: [
          'এক বই যা সবকিছু এক জায়গায় দিয়ে দেয়, তা যে কেউ পড়তে পারে, আর যে কেউ ব্যবহার করতে পারে। জ্ঞানীরা তা চাননি। তাঁরা চেয়েছিলেন ছাত্র জ্ঞানের জন্য পরিশ্রম করুক, যাতে শুধু পরিশ্রম করা মানুষই তা পায়।',
          'তাই তাঁরা বই ধাঁধা দিয়ে বন্ধ করলেন, ক্রম উল্টেপাল্টে দিলেন, আর এক কাজকে অধ্যায়ে ভাগ করলেন। ছাত্রকে সঙ্গী বইগুলোতে ইঙ্গিত জোগাড় করতে হবে, টুকরো টুকরো, যতক্ষণ না পুরো কাজ তার সামনে দাঁড়ায়।',
        ],
      },
      {
        heading: 'ছড়ানো বই কীভাবে পড়বে',
        paragraphs: [
          'আস্তে পড়ো, আর পুরো বই পড়ো। এক অধ্যায় যা এক জিনিসের ব্যাপারে মনে হয়, তাতে আরেক অধ্যায়ের হারানো অর্ধেক থাকতে পারে। নোট রাখো। যখন কোনো ধাঁধা আসে, তাতে দাগ দাও। যখন একই কাজ আরেক অধ্যায়ে আবার আসে, তখন দুই জায়গা মিলিয়ে দেখো।',
          'জোগাড় করাটাই শেখা। যে ছাত্র টুকরোগুলো জোগাড় করে, সে কাজটিকে তার চেয়ে ভালো বোঝে যাকে তা পুরোটাই দিয়ে দেওয়া হয়েছে।',
        ],
      },
    ],
    terms: ['জ্ঞানের ছড়িয়ে দেওয়া'],
    closing:
      'বই ছড়ানো আছে যাতে ছাত্রকে জোগাড় করতে হয়। আস্তে জোগাড় করো, নোট রাখো, আর টুকরোগুলো মিলিয়ে দেখো। পুরো কাজ সেখানেই আছে, অধ্যায়ে ছড়ানো, তার অপেক্ষায় যে এর জন্য পরিশ্রম করবে।',
  },
  'testing-inspirations': {
    eyebrow: 'স্টাডি গাইড',
    title: 'মনের আওয়াজকে কিতাব দিয়ে পরীক্ষা করা',
    subtitle: 'মনের প্রতিটি আওয়াজ সত্য নয়। প্রথমে তা মেপে দেখো।',
    intro:
      'মনে এক ভাবনা আসে। এক অনুভূতি ওঠে। এটা কি সত্য? এটা কি আল্লাহর পক্ষ থেকে, না নিজের থেকে, না এর চেয়ে খারাপ কিছুর থেকে? বই এর জন্য এক নিয়ম দেয়, আর নিয়মটি সহজ: প্রতিটি ভেতরের অনুপ্রেরণাকে কিতাব দিয়ে মেপে দেখো।',
    sections: [
      {
        heading: 'নিয়ম',
        paragraphs: [
          'এক অনুপ্রেরণা যা কুরআন আর সুন্নাহর সঙ্গে মেলে, তা গ্রহণ করা হয়। এক অনুপ্রেরণা যা তাদের সঙ্গে মেলে না, তা সরিয়ে রাখা হয়। কিতাব দাঁড়িপাল্লা, আর অনুপ্রেরণা হলো যা মাপা হয়।',
          'মন ধোঁকা খেতে পারে। কিতাব পারে না। এজন্যই বই অনুভূতির আগে দাঁড়িপাল্লা রাখে।',
        ],
      },
      {
        heading: 'নিয়ম কীভাবে ব্যবহার করবে',
        paragraphs: [
          'যখন কোনো অনুপ্রেরণা আসে, তখন তাতে এক্ষুনি কাজ কোরো না। তার সঙ্গে বসো। জিজ্ঞেস করো কুরআন এর ব্যাপারে কী বলে, আর নবী এর ব্যাপারে কী শিখিয়েছেন। দুটো মিললে, অনুপ্রেরণাটা নাও। না মিললে, তা ছেড়ে দাও।',
          'এটা সন্দেহ নয়। এটা শৃঙ্খলা। যে সন্ধানকারী তাঁর অনুপ্রেরণা মাপে, সে নিরাপদে চলে। যে সন্ধানকারী মনের প্রতিটি আওয়াজের পেছনে চলে, সে অন্ধের মতো চলে।',
        ],
      },
    ],
    terms: ['ভেতরের অনুপ্রেরণা'],
    closing:
      'প্রতিটি অনুপ্রেরণাকে কিতাব দিয়ে মেপে দেখো। যা মেলে, তা নাও। যা মেলে না, তা ছেড়ে দাও। দাঁড়িপাল্লা কুরআন আর সুন্নাহ, আর মন হলো যা মাপা হয়।',
  },
  'four-classes-of-people': {
    eyebrow: 'স্টাডি গাইড',
    title: 'জ্ঞানের ব্যাপারে মানুষের চার শ্রেণি',
    subtitle: 'বই চার শ্রেণির কথা বলে। তালিকাটি এখনও জোগাড় করা হচ্ছে।',
    intro:
      'বই মানুষকে শ্রেণিতে ভাগ করে, জ্ঞানের সামনে তারা কোথায় দাঁড়িয়ে আছে, সেই হিসেবে। এই গাইড শিক্ষাটির নাম বলে, আর পরিষ্কার বলে যা এখনও হাতে নেই: চার শ্রেণি বইয়ে নামে বলা আছে, আর তালিকাটি এখানে যোগ হবে যখন তা জোগাড় হবে।',
    sections: [
      {
        heading: 'বই কী বলে',
        paragraphs: [
          "বই 'Protect yourself from jinn and devils', আল-খালিল ইবনে আহমদের, জ্ঞানের ব্যাপারে মানুষের চার শ্রেণির কথা বলে। শ্রেণিগুলোই কথার আসল কথা: সব মানুষ তাদের জ্ঞানের সামনে এক জায়গায় দাঁড়িয়ে নেই।",
          'চার শ্রেণি নিজে এখনও জোগাড় হয়নি। আমি সেগুলো বানাব না। যখন সেগুলো হাতে আসবে, তখন সেগুলো এখানে যোগ হবে, প্রতিটির সঙ্গে তার পাতা।',
        ],
      },
      {
        heading: 'শ্রেণিগুলো কেন জরুরি',
        paragraphs: [
          'যে সন্ধানকারী তাঁর শ্রেণি জানে, সে তাঁর কাজ জানে। যার জ্ঞান আছে আর সে তাতে কাজ করে, তার এক পথ। যার জ্ঞান আছে আর সে তাতে কাজ করে না, তার আরেক পথ। যার জ্ঞান নেই, তার তৃতীয় পথ। আর যে ভাবে সে জানে যখন সে জানে না, তার পথ সবচেয়ে কঠিন।',
          'এটাই শিক্ষার আকার, তালিকা হাতে আসার আগেই। জানো তুমি কোথায় দাঁড়িয়ে আছো, আর তুমি জানবে এরপর কী করতে হবে।',
        ],
      },
    ],
    terms: [],
    closing:
      'চার শ্রেণি, বইয়ে নামে বলা, এখনও জোগাড় করা হচ্ছে। তালিকা হাতে এলে তা এখানে আসবে। ততক্ষণ, সততার সঙ্গে এটাই বলা: আমার কাছে এখনও নেই।',
  },
  'knowledge-and-action': {
    eyebrow: 'স্টাডি গাইড',
    title: 'জ্ঞান আর কাজকে আলাদা করা যায় না',
    subtitle: 'জ্ঞান কাজের জন্য ডাকে।',
    intro:
      'কাজ ছাড়া জ্ঞান মরা বোঝা। বই এটা অনেকভাবে বলে, কিন্তু মানে একটাই: যা তুমি জানো, তা হতে হবে যা তুমি করো। এই গাইড শিক্ষাটিকে এক জায়গায় রাখে।',
    sections: [
      {
        heading: 'জ্ঞান কাজের জন্য ডাকে',
        paragraphs: [
          "আল-ফাতহ আর-রব্বানি বলে, 'জ্ঞান কাজের জন্য ডাকে।' কথাগুলো সহজ। জ্ঞান কোনো জিনিস নয় যা তুমি ধরো। এটা এক আওয়াজ, আর এটা হাতকে ডাকে।",
          "জিলা' আল-খাতির বলে জ্ঞান তলোয়ারের মতো আর কাজ হাতের মতো। হাত ছাড়া তলোয়ার কিছু কাটে না। কাজ ছাড়া জ্ঞান কিছু বদলায় না।",
        ],
      },
      {
        heading: 'ছোট কাজ, সবসময় করা',
        paragraphs: [
          'বই ছোট, টেকসই কাজের প্রশংসা করে, বড় ঝাঁকের চেয়ে যা টেকে না। অল্প, প্রতিদিন করা, একবার করে ছেড়ে দেওয়া অনেকের চেয়ে বেশি দামি।',
          'এটাই সন্ধানকারীর নিয়ম। অল্প করো, আর সবসময় করো। ছোট কাজ, ধরে রাখা, মানুষকে তৈরি করে। বড় কাজ, ছেড়ে দেওয়া, কিছু তৈরি করে না।',
        ],
      },
    ],
    terms: ['জ্ঞান', 'কাজ, আমল'],
    closing:
      'জ্ঞান কাজের জন্য ডাকে। তাকে এক ছোট কাজ দিয়ে জবাব দাও, সবসময় করা। এটাই পুরো শিক্ষা।',
  },
  'prerequisites-of-the-seeker': {
    eyebrow: 'স্টাডি গাইড',
    title: 'অক্ষরের সন্ধানকারীর শর্তগুলো',
    subtitle: 'সন্ধানকারীর শুরু করার আগে কী দরকার।',
    intro:
      "Manba' তা দিয়ে শুরু হয় যা অক্ষরের সন্ধানকারীর শুরু করার আগে দরকার। এক জ্ঞানের দরজা থাকে, আর দরজার এক চাবি থাকে। এই গাইড শিক্ষাটির নাম বলে, আর পরিষ্কার বলে যা এখনও হাতে নেই: শর্তগুলোর তালিকা এখানে যোগ হবে যখন তা জোগাড় হবে।",
    sections: [
      {
        heading: 'বই কী বলে',
        paragraphs: [
          "Manba' তার প্রথম পাতায় অক্ষরের সন্ধানকারীর শর্তগুলো দিয়ে শুরু হয়। বই পাঠককে জ্ঞান শুরু করতে দেয় না, যতক্ষণ না সে প্রথমে বলে তাকে কী আনতে হবে।",
          'তালিকাটি নিজে এখনও জোগাড় হয়নি। আমি তা বানাব না। যখন তা হাতে আসবে, তখন তা এখানে যোগ হবে, প্রতিটি জিনিসের সঙ্গে তার পাতা।',
        ],
      },
      {
        heading: 'শর্তগুলো আগে কেন আসে',
        paragraphs: [
          'অক্ষরের জ্ঞান কোনো খেলা নয়। এটা নাম আর সংখ্যা নিয়ে কাজ করে, যাদের বই আসল শক্তি বলে। শর্তগুলো সন্ধানকারীকে রক্ষা করতে, তাঁকে বাইরে রাখতে নয়।',
          'যে সন্ধানকারী তা আনে যা তাঁর কাছে চাওয়া হয়েছে, সে নিরাপদে চলে। যে সন্ধানকারী দরজা ছেড়ে জানালা দিয়ে ওঠে, সে বিপদ পায়। এজন্যই বই তালিকা দিয়ে শুরু হয়, জ্ঞান দিয়ে শুরুর আগে।',
        ],
      },
    ],
    terms: ['সন্ধানকারী, ছাত্র'],
    closing:
      'শর্তগুলো Manba\'-তে নামে বলা আছে, তার প্রথম পাতায়। তালিকাটি নিজে এখনও জোগাড় করা হচ্ছে, আর হাতে এলে তা এখানে আসবে। ততক্ষণ, সততার সঙ্গে এটাই বলা: আমার কাছে এখনও নেই।',
  },
  'scattered-operations': {
    eyebrow: 'স্টাডি গাইড',
    title: 'বইয়ে ছড়ানো কাজগুলো',
    subtitle: 'এক কাজ, অধ্যায়ে আর বইয়ে ভাগ করা।',
    intro:
      'এক কাজ খুব কমই এক জায়গায় পাওয়া যায়। বই তাকে অধ্যায়ে ভাগ করে, আর কখনো কখনো বইয়ে। ছাত্রকে পুরোটা দেখার আগে অংশগুলো জোগাড় করতে হবে। এটা Tabdid al-Ilm-এর জমজ, আর পুরনো বই এভাবেই লেখা হয়।',
    sections: [
      {
        heading: 'অংশগুলো দূরে দূরে ছড়ানো',
        paragraphs: [
          'এক অধ্যায় অক্ষর দেয়। আরেক অধ্যায় সময় দেয়। তৃতীয় বই শেষটা দেয়। এদের কেউ একা পুরো কাজ দেয় না। কাজ তখনই তৈরি হয় যখন অংশগুলো একসঙ্গে আনা হয়।',
          'Abramelin-এর বই এই ছড়ানো উপস্থাপনার নাম নেয়। যে ছাত্র এক বই পড়ে আর থেমে যায়, সে এক টুকরো পড়েছে। যে ছাত্র বইয়ের ওপারে পড়ে, সে কাজটা পায়।',
        ],
      },
      {
        heading: 'অংশগুলো কীভাবে জোগাড় করবে',
        paragraphs: [
          'এক নোটবই রাখো। যখন কোনো বই এক কাজের অংশ দেয়, তখন তা বই আর পাতার সঙ্গে লিখে নাও। যখন আরেক বই আরেক অংশ দেয়, তখন তা তার পাশে লিখে নাও। সময়ের সঙ্গে, অংশগুলো জোড়ে, আর কাজটা পুরো দাঁড়ায়।',
          'জোড়াতে তাড়াহুড়ো কোরো না। ভুল জায়গা থেকে নেওয়া অংশ কাজটাকে ভেঙে দেয়। অংশগুলো মিলিয়ে দেখো, পাতা দেখো, আর তখনই তাদের একসঙ্গে রাখো।',
        ],
      },
    ],
    terms: ['এক কাজ, এক বাস্তব কাজ'],
    closing:
      'কাজ ছড়ানো আছে, আর জোগাড় করাটাই কাজ। এক নোটবই রাখো, অংশগুলো তাদের পাতার সঙ্গে জোগাড় করো, আর পুরোটাকে আস্তে দাঁড়াতে দাও। পুরনো বই এভাবেই পড়া উচিত।',
  },
};

/** The map for a language: 'en' has no map, English is returned as-is. */
function topicMapFor(lang: SiteLanguage): Record<string, TopicLocalization> | null {
  if (lang === 'hi') return TOPICS_HI;
  if (lang === 'bn') return TOPICS_BN;
  return null;
}

function questionMapFor(lang: SiteLanguage): Record<string, QuestionLocalization> | null {
  if (lang === 'hi') return QUESTIONS_HI;
  if (lang === 'bn') return QUESTIONS_BN;
  return null;
}

function guideMapFor(lang: SiteLanguage): Record<string, TopicLocalization> | null {
  if (lang === 'hi') return GUIDES_HI;
  if (lang === 'bn') return GUIDES_BN;
  return null;
}

/**
 * Localise a topic (or guide — same shape). Arabic, transliteration,
 * sources, facts and numbers are copied through untouched. Any field
 * missing from the map falls back to the English original. When the
 * map gives fullSections / fullTerms (Hinglish topics: the notebook's
 * own telling), those replace the English sections and terms wholesale.
 */
function localizeContent<T extends TopicContent | StudyGuide>(
  item: T,
  loc: TopicLocalization | undefined,
): T {
  if (!loc) return item;
  const sections =
    loc.fullSections ??
    item.sections.map((section, i) => {
      const ls = loc.sections?.[i];
      if (!ls) return section;
      return {
        ...section,
        heading: ls.heading,
        paragraphs: section.paragraphs.map((p, j) => ls.paragraphs[j] ?? p),
        quote: section.quote
          ? { ...section.quote, text: ls.quoteText ?? section.quote.text }
          : undefined,
      };
    });
  const terms =
    loc.fullTerms ??
    item.terms.map((term, i) => ({ ...term, meaning: loc.terms?.[i] ?? term.meaning }));
  return {
    ...item,
    eyebrow: loc.eyebrow,
    title: loc.title,
    subtitle: loc.subtitle,
    intro: loc.intro,
    sections,
    terms,
    closing: loc.closing,
  };
}

/** The topic with its Hinglish / Bengali fields, or the English topic as-is for 'en'. */
export function localizeTopic(topic: TopicContent, lang: SiteLanguage): TopicContent {
  return localizeContent(topic, topicMapFor(lang)?.[topic.id]);
}

/** The guide with its Hinglish / Bengali fields, or the English guide as-is for 'en'. */
export function localizeGuide(guide: StudyGuide, lang: SiteLanguage): StudyGuide {
  return localizeContent(guide, guideMapFor(lang)?.[guide.id]);
}

/** The question with its Hinglish / Bengali fields, or the English question as-is for 'en'. */
export function localizeQuestion(question: TopicQuestion, lang: SiteLanguage): TopicQuestion {
  const loc = questionMapFor(lang)?.[question.id];
  if (!loc) return question;
  return {
    ...question,
    question: loc.question,
    answer: question.answer.map((p, i) => loc.answer[i] ?? p),
    quote: question.quote
      ? { ...question.quote, text: loc.quoteText ?? question.quote.text }
      : undefined,
    terms: (question.terms ?? []).map((term, i) => ({ ...term, meaning: loc.terms[i] ?? term.meaning })),
  };
}
