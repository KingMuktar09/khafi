/**
 * Topics, Questions and Study Guides in Hinglish, Bengali and Urdu.
 *
 * English is the primary language and the default. Hinglish (Roman-script
 * Hindi/Urdu, in the channel's reel voice), Bengali (easy familiar
 * words) and Urdu (proper Urdu script, simple easy words) are
 * Settings-only options. Every Hinglish, Bengali and Urdu line here
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
import { TOPICS_UR, QUESTIONS_UR, GUIDES_UR } from './topicsI18n-ur';

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

// Hinglish topic content comes from the Al Asrar notebook (Hinglish,
// with sources and pages), not from translating the English pages.
// The map below is filled (all 22 topics, Nov 2026); localizeTopic
// falls back to English only for a topic missing here. Do not re-fill
// this map by machine translation.
const TOPICS_HI: Record<string, TopicLocalization> = {
  "ibn-arabi-40-day-retreat": {
    eyebrow: "Topics",
    title: "Ibn Arabi ki 40-Day Retreat",
    subtitle:
      "Chaalis din ki khalwa, aur woh duniyaein jo ek ke baad ek talash karne wale ke saamne khulti hain.",
    intro:
      "Main tumhe Ibn Arabi ke ek safar ke baare mein batana chahta hoon. Yeh safar chaalis din ka hai. Yeh ek retreat hai, ek khalwa, Allah ke saath akele waqt. Talash karne wala tanhai mein baithta hai aur uske saamne ek ke baad ek duniya khulti hai. Main ne yeh The Journey to the Lord of Power mein padha hai, aur main tumhe waisa hi le chalunga jaisa kitab kehti hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Is duniya ke peeche ek aur duniya hai. Tum use chhoo nahi sakte. Lekin woh is duniya ko thaame hue hai, jaise jad ped ko thaame hue hai. Purani kitabein use Alam al-Malakut kehti hain, Sovereignty ki Duniya. Yahan uski poori baat hai, kitabon se jama ki hui. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Log mujhse poochte hain ke ruh kya hai. Kitabein is sawal ka jawab saaf tareeqe se deti hain. Ruh jism nahi hai. Yeh ek roshni hai jo kuch waqt ke liye jism mein rehti hai. Main tumhe woh bataunga jo main ne iske baare mein kitabon se paya. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Alif Arabic alphabet ka pehla harf hai. Yeh ek seedhi lakeer hai. Lekin kitabein is ek lakeer ko poori ek duniya ka matlab deti hain. Main tumhe woh bataunga jo kitabein iske baare mein kehti hain. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Sulayman ki muhr ke baare mein sab ne suna hai. Lekin kitabein asal mein iske baare mein kya kehti hain? Jawab kahaniyon se zyada careful hai. Main ne Quran aur purani kitabon se jo jama kiya hai, woh tum saaf dekh sakoge. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Hum sab khwab dekhte hain. Lekin kitabein kehti hain ke sab khwab ek jaise nahi hote. Woh teen tarah ke khwab batati hain, aur har ek ek alag jagah se aata hai. Main tumhe woh teenon bataunga, taaki tum unhe pehchan sako. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Quran mein ek ayat hai jo batati hai ke Sulayman kaise mare. Yeh chhoti si hai, aur ajeeb si. Ek badshah apne asaa par jhuka hai. Ek chhota sa keeda asaa khata hai. Badshah gir jata hai. Main tumhe is ayat se guzarunga, jaisa kitabein samjhati hain. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Al-Khidr Sufism ke chhupe hue ustaad hain. Unka na koi school hai, na koi pata. Woh aate hain, sikhate hain, aur chale jate hain. Ibn Arabi unse teen baar mile, aur har mulaqat ko unhone apni kitab mein likha. Yahan woh teenon mulaqatein hain, unki apni kitab se. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Safar ke beech mein, Ibn Arabi ko drinks pesh kiye jate hain. Paani, doodh, shahed aur sharab. Yeh sirf drinks nahi hain. Har ek ek tarah ka ilm hai, aur kitab unhe ek ek kar ke decode karti hai. Yahan woh decoding hai, kitab se. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Aise mard hain jinse tum kabhi nahi miloge, aur duniya unhi par ghoomti hai. Kitabein unhe Rijal al-Ghayb kehti hain, Ghayb ke Mard. Woh chhupe hue is liye nahi hain ke woh chhupte hain. Woh chhupe hue is liye hain ke duniya unhe dekhti nahi. Yahan unki tartib hai, jaisa kitabein deti hain. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Har Sufi raaste ka ek ustaad hota hai. Lekin kuch talash karne wale apne ustaad se jism mein kabhi nahi milte. Unhe waqt ke paar, maut ke paar, parde ke paar sikhaya jata hai. Kitabein is tareeqe ko Uwaisi kehti hain. Yahan iska matlab hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
      "Duniya solid lagti hai. Pathar wahin hai jahan kal tha. Ped wahin khada hai jahan tha. Lekin kitabein kehti hain ke duniya solid hai hi nahi. Woh har lamha dobara banayi jati hai. Ek dum nayi, kuch bhi nahi se. Yahan tajaddud-e-khalq ki taleem hai. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
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
  "basmalah-secrets": {
    eyebrow: "Topics",
    title: "Basmalah ke Asrar",
    subtitle:
      "Kainaat ki sabse badi chabi, aur ek harf ke neeche ka nuqta.",
    intro:
      "Main Khafi hoon. Pichle rounds mein humne khalwa, Malakūt, Rūḥ-o-Nafs, Harf Alif, Khātam Sulaymān, khwabon ke bhed, Sūrah Sabāʾ ki deemak, al-Khiḍr, mashrūbāt, Rijāl al-Ghayb, Uwaysī transmission aur Tajaddud al-Khalq ke asrar decode kiye. Aaj hum chalte hain roohani ilm ki sabse badi chabi ki taraf — Asrār al-Basmalah. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Bāʾ ke neeche ka nuqta",
        paragraphs: [
          "Basmalah Bāʾ harf se shuru hoti hai. Kitabein kehti hain ke poora Quran Surah al-Fatiha mein hai, poori Fatiha Basmalah mein hai, aur poori Basmalah Bāʾ mein hai. Aur Bāʾ khud uske neeche wale nuqte mein hai. Ek nuqta, aur kitabein kehti hain ke saari takhleeq usi se latki hai.",
          "Bāʾ 'se' aur 'ke zariye' ka harf hai. Bī kāna mā kāna, kitabein kehti hain. Mere zariye woh tha jo tha, aur Mere zariye hai jo hai. Nuqta pehla point hai. Woh jagah jahan qalam ne pehli baar kagaz ko chhua. Uske baad sab kuch usi chhune se behti hui lakeer hai. Source: Decoding Al-Būnī's Esoteric Book, p. 1; Mystical Dimensions of Islam, p. 417.",
        ],
      },
      {
        heading: "Unnīs harf, unnīs muhafiz",
        paragraphs: [
          "Basmalah mein unnīs harf hain. Kitabein unhe ek ek karke ginti hain. Unnīs harf, aur aag par unnīs muhafiz khade hain. Kitabein unhe Zabāniyah kehti hain, gehrai ke rakhwale. Jo line Quran ko kholti hai, wahi line unke saamne dhaal bhi hai.",
          "Kitabein din ko ghanton mein bhi ginti hain. Chaubees ghante, aur talash karne wala unme se lagbhag paanch ghante sota hai. Unnīs harf ghante dar ghante balance banaye rakhte hain, taaki din measure mein rahe. Yeh number koi taweez nahi hai. Yeh ek pattern hai jo kitabein khud line mein padhti hain. Source: Shams al-Maʿārif al-Kubrā, Ch. 3, pp. 56-57.",
        ],
      },
      {
        heading: "Chaar Naam, chaar nehrein",
        paragraphs: [
          "Basmalah mein chaar Naam hain. Ism, Naam khud. Allah, sabse bada zaati Naam. Al-Raḥmān, sab par meherban. Al-Raḥīm, khaas meherban. Ek chhoti si line mein chaar Naam, aur kitabein har ek ko ek neher padhti hain.",
          "Kitabein kehti hain ke Jannat mein chaar nehrein behti hain, aur har neher Basmalah ke ek harf se behti hai. Paani Bism ke Mīm se. Doodh Allah ke Hāʾ se. Sharab al-Raḥmān ke Mīm se. Shahed al-Raḥīm ke Mīm se. Line chhoti hai, lekin kitabein kehti hain ke usme chaar nehrein hain. Source: The Journey to the Lord of Power, pp. 36, 82-83; Mudih al-Tariq, pp. 63-64.",
        ],
      },
      {
        heading: "786 ka wazan",
        paragraphs: [
          "Kitabein Basmalah ko number mein bhi tolti hain. Ḥisāb al-Jummal harfon ko unke number se ginne ka hisaab hai. Basmalah ke harfon ko unke number se gino, to total 786 aata hai. Kitabein number saaf saaf deti hain, aur usi se Basmalah ka wafq, uska square, banati hain.",
          "Square ke chaaron taraf farishte muhafiz khade hain, Amlāk. Woh harfon ke rakhwale hain, aur square unka naqsha hai. Number ek wazan hai, koi khwahish nahi. Kitabein use likhti hain, aur main use waisa hi likhta hoon jaisa woh deti hain. Source: Manbaʿ Uṣūl al-Ḥikma, pp. 28-30; Shams al-Maʿārif, pp. 58-60.",
        ],
      },
      {
        heading: "Surah al-Tawbah mein Basmalah kyun nahi hai",
        paragraphs: [
          "Quran ki har surah Basmalah se shuru hoti hai, sirf ek ko chhod kar. Surah al-Tawbah, nauvi surah, mein Basmalah nahi hai. Kitabein poochti hain kyun, aur ek lafz mein jawab deti hain. Barāʾah. Rishta todna aur alag hona. Surah todne se shuru hoti hai, meherbani se nahi.",
          "Kitabein ek seedha rule deti hain. Jang aur Allah ki sakhti, Jalāl, wala chapter meherbani se shuru nahi ho sakta. Basmalah Amān wa-Salām hai, poori aman aur salamti. Jo surah rishte todti hai, woh aman aur salamti se nahi khul sakti. Isi liye line chhod di gayi, aur surah khaali shuru hoti hai. Source: Tafsir Ibn Kathir, Vol. 4, commentary on Surah 9, pp. 111-112; Mystical Dimensions of Islam, p. 119.",
        ],
      },
      {
        heading: "Jism par likhi hui line",
        paragraphs: [
          "Kitabein Basmalah ko insaan ke jism par bhi padhti hain. Chehra kagaz hai, aur harf us par likhe hain. Alif naak ko dikhata hai, chehre ke beech mein ek seedhi lakeer. Chehre ko al-Wajh kehte hain, aur lakeer usi mein khadi hai.",
          "Basmalah mein teen Mīm hain, ek Bism mein, ek al-Raḥmān mein, ek al-Raḥīm mein. Kitabein unhe jism ke beech ke teen hisson se jodti hain. Dimaagh, al-Dimāgh. Dil, al-Qalb. Jigar, al-Kabd. Teen harf, teen hisse, ek jism. Source: Mudih al-Tariq, pp. 61-62; The Mirror, pp. 98-101.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "نقطة الباء", transliteration: "Nuqṭat al-Bāʾ", meaning: "Bāʾ harf ke neeche ka nuqta" },
      { arabic: "بي كان ما كان", transliteration: "Bī kāna mā kāna", meaning: "'se' aur 'ke zariye' wala Bāʾ" },
      { arabic: "تسعة عشر حرفا", transliteration: "Tisʿata ʿAshar Ḥarfan", meaning: "unnīs harf" },
      { arabic: "زبانية", transliteration: "Zabāniyah", meaning: "aag ke muhafiz" },
      { arabic: "اسم", transliteration: "Ism", meaning: "Naam, zaat" },
      { arabic: "الله", transliteration: "Allāh", meaning: "Allah, sabse bada zaati Naam" },
      { arabic: "الرحمن", transliteration: "Al-Raḥmān", meaning: "sab par meherban" },
      { arabic: "الرحيم", transliteration: "Al-Raḥīm", meaning: "khaas meherban" },
      { arabic: "أنهار الجنة", transliteration: "Anhār al-Jannah", meaning: "Jannat ki chaar nehrein" },
      { arabic: "حساب الجمل", transliteration: "Ḥisāb al-Jummal", meaning: "harfon ko number se ginna" },
      { arabic: "وفق البسملة", transliteration: "Wafq al-Basmalah", meaning: "Basmalah ka square" },
      { arabic: "أملاك", transliteration: "Amlāk", meaning: "farishte muhafiz" },
      { arabic: "أمان وسلام", transliteration: "Amān wa-Salām", meaning: "poori aman aur salamti" },
      { arabic: "براءة", transliteration: "Barāʾah", meaning: "rishta todna, alag hona" },
      { arabic: "جلال", transliteration: "Jalāl", meaning: "Allah ki sakhti aur azmat" },
      { arabic: "الوجه", transliteration: "Al-Wajh", meaning: "chehra" },
      { arabic: "الدماغ", transliteration: "Al-Dimāgh", meaning: "dimaagh" },
      { arabic: "القلب", transliteration: "Al-Qalb", meaning: "dil" },
      { arabic: "الكبد", transliteration: "Al-Kabd", meaning: "jigar" },
    ],
    closing:
      "Main Basmalah roz padhta hoon, aur maine use kabhi is tarah nahi dekha tha. Ek nuqta jo takhleeq ko thaame hai. Unnīs harf jo aag ke saamne khade hain. Chaar Naam jo chaar nehron ki tarah behti hain. Ek number, 786, jo line ko tolta hai. Ek gayab line jo sakhti sikhati hai. Aur ek jism jo harfon ko apne chehre aur seene mein liye hai. Yahi kitabein kehti hain. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "throne-verse": {
    eyebrow: "Topics",
    title: "Ayat al-Kursi, Throne Verse",
    subtitle:
      "Quran ki sabse azeem aayat, aur woh Kursi jo aasmanon ko thaame hue hai.",
    intro:
      "Main Khafi hoon. Aaj hum chalte hain Quran-e-Majeed ki sabse azeem aayat ki taraf — Āyat al-Kursī (The Throne Verse), Quran 2:255. Kitabein use Quran ki sardar kehti hain. Kitabein kehti hain ke jab woh utri, to sattar hazaar farishte uske saath utre. Main use line dar line decode karunga, jaisa sources dete hain. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Sabse azeem aayat, aur sattar hazaar farishte",
        paragraphs: [
          "Kitabein Ayat al-Kursi ko Sayyidat al-Quran kehti hain, Quran ki sardar. Kisi aur aayat ka yeh rutba nahi hai. Jab woh utri, to kitabein kehti hain ke sattar hazaar farishte uske saath utre. Hubūṭ al-Malāʾikah, farishton ka utarna.",
          "Aayat chhoti hai, lekin kitabein uske andar 170 harf ginti hain. Ek sau sattar harf, aur har ek uske andar ke blueprint ka hissa hai. Number aayat ka frame hai, aur aayat arsh ka frame hai. Source: Shams al-Maʿārif al-Kubrā, Ch. 18, pp. 68-69; Tafsir Ibn Kathir, Vol. 1, pp. 86-88.",
        ],
      },
      {
        heading: "Aayat ke andar Sabse Bada Naam",
        paragraphs: [
          "Aayat Sabse Bade Naam se khulti hai. Allāhu lā ilāha illā Huwa al-Ḥayyu al-Qayyūm. Allah, uske siwa koi ma'bud nahi, woh hamesha zinda, sab ko thaame hue. Do Naam aayat ke darwaze par khade hain, aur kitabein kehti hain ke yahi Sabse Bada Naam hai.",
          "Al-Ḥayy hamesha zinda hai, aur kitabein kehti hain ke yeh Jibril ka zikr hai. Al-Qayyūm khud khada rehne wala hai, jo sab ko thaame hue hai aur use kisi ki zaroorat nahi. Kitabein aayat ko Āṣif ibn Barkhiyā se jodti hain, jisne Bilqīs ka takht hila diya tha. Wahi Naam, wahi taaqat, kitabein kehti hain. Source: Shams, pp. 60-61, 68-69; Mudih al-Tariq, pp. 21-22; al-Ghunya, p. 35.",
        ],
        quote: {
          arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
          transliteration: "Allāhu lā ilāha illā Huwa al-Ḥayyu al-Qayyūm",
          text: "Allah, uske siwa koi ma'bud nahi, woh hamesha zinda hai, sab ko thaame hue hai.",
          source: "Qurʾān 2:255",
        },
      },
      {
        heading: "Kursi aur Arsh",
        paragraphs: [
          "Aayat kehti hai ke uski Kursi aasmanon aur zameen par phaili hui hai. Wasiʿa Kursiyyuhu al-Samāwāti wa-l-Arḍ. Kursi paaydaan hai, aur kitabein use Arsh ke neeche rakhti hain. Arsh takht hai. Kursi paaydaan hai. Ek baithne ki jagah hai, doosra uske neeche ka step hai.",
          "Ibn ʿAbbās kehte hain ke Kursi Arsh ke neeche ka paaydaan hai. Kitabein use Maḥall al-Ṣuwar kehti hain, shaklon ka thaamne wala, woh jagah jahan cheezon ki shaklein rakhi hain. Aur woh uske size ke liye ek tasveer deti hain. Saat aasman aur zameen, Kursi ke saamne, jaise registan mein phenki hui ek angoothi. Source: Tafsir Ibn Kathir, Vol. 1, p. 89; Mudih al-Tariq, pp. 19-20, 27-28, 31.",
        ],
        quote: {
          arabic: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ",
          transliteration: "Wasiʿa Kursiyyuhu al-Samāwāti wa-l-Arḍ",
          text: "Uski Kursi aasmanon aur zameen par phaili hui hai.",
          source: "Qurʾān 2:255",
        },
      },
      {
        heading: "170 harfon wala square",
        paragraphs: [
          "Kitabein aayat se ek square banati hain. Ek sau sattar harf, aur 170 ka harmonic unme se guzarta hai. Ayat al-Kursi ka 4x4 square aayat se hi banta hai, aur kitabein kehti hain ke farishton ki likhai diagram ke chaaron taraf khadi hai.",
          "Aayat ek line par khatm hoti hai jise kitabein baar baar quote karti hain. Wa-lā yaʾūduhu ḥifẓuhumā wa-Huwa al-ʿAliyyu al-ʿAẓīm. Aasmanon aur zameen ki hifazat use thakati nahi, aur woh sabse buland, sabse bada hai. Square harfon ko thaame hai. Line matlab ko thaame hai. Source: Shams, Ch. 18, pp. 68-69, 71-72.",
        ],
        quote: {
          arabic: "وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
          transliteration: "Wa-lā yaʾūduhu ḥifẓuhumā wa-Huwa al-ʿAliyyu al-ʿAẓīm",
          text: "Aur unki hifazat use thakati nahi, aur woh sabse buland, sabse bada hai.",
          source: "Qurʾān 2:255",
        },
      },
      {
        heading: "Ek aisa qila jo toot nahi sakta",
        paragraphs: [
          "Kitabein aayat ko Ḥirz Māniʿ kehti hain, na tootne wala qila. Yeh ek deewaar hai jise koi sarkash cheez paar nahi kar sakti, kitabein kehti hain. Aayat use thaame hai jo use thaame, aur muhafiz kabhi sota nahi.",
          "Kitabein ek chhoti line quote karti hain. Lā taʾkhudhuhu sinatun wa-lā nawm. Na use oongh aati hai, na neend. Muhafiz kabhi aankh band nahi karta, kyunki jo hifazat karta hai woh kabhi sota nahi. Yahi qile ka dil hai. Source: Shams, Ch. 18, pp. 68-69, 71; Kitab al-Ajnas, pp. 10-11.",
        ],
        quote: {
          arabic: "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
          transliteration: "Lā taʾkhudhuhu sinatun wa-lā nawm",
          text: "Na use oongh aati hai, na neend.",
          source: "Qurʾān 2:255",
        },
      },
      {
        heading: "Dil ke andar ka arsh",
        paragraphs: [
          "Kitabein aakhir mein aayat ko andar ki taraf modti hain. Qalbu al-Muʾmini ʿArshu Allāh. Momin ka dil Allah ka Arsh hai. Jo Arsh aasmanon ko thaame hai, uski ek jagah seene ke andar bhi hai, kitabein kehti hain.",
          "Abū Yazīd al-Bisṭāmī ne kaha ke kainaat dil mein gir gayi, aur dil ne use thaam liya. Aayat aasmanon ke baare mein hai, aur dil ke baare mein bhi hai. Bada Arsh aur chhota dil ek hi taleem hain, do baar padhi hui. Source: al-Asrar al-Rabbaniyyah, pp. 125-126; Mudih al-Tariq, pp. 27-28.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "سيدة القرآن", transliteration: "Sayyidat al-Qurʾān", meaning: "Quran ki sardar" },
      { arabic: "هبوط الملائكة", transliteration: "Hubūṭ al-Malāʾikah", meaning: "farishton ka utarna" },
      { arabic: "الحي", transliteration: "Al-Ḥayy", meaning: "hamesha zinda" },
      { arabic: "القيوم", transliteration: "Al-Qayyūm", meaning: "sab ko thaame hue, khud khada rehne wala" },
      { arabic: "الكرسي", transliteration: "Al-Kursī", meaning: "paaydaan, kursi" },
      { arabic: "العرش", transliteration: "Al-ʿArsh", meaning: "arsh, takht" },
      { arabic: "محل الصور", transliteration: "Mahall al-Ṣuwar", meaning: "shaklon ka thaamne wala" },
      { arabic: "وفق", transliteration: "Wafq", meaning: "jaadui square" },
      { arabic: "حرز مانع", transliteration: "Ḥirz Māniʿ", meaning: "na tootne wala qila" },
      { arabic: "قلب المؤمن عرش الله", transliteration: "Qalbu al-Muʾmini ʿArshu Allāh", meaning: "momin ka dil Allah ka Arsh hai" },
    ],
    closing:
      "Main yeh aayat zindagi bhar padhta aaya hoon, aur maine kabhi uske harf nahi gine the, uske Naam nahi tole the. Ek sau sattar harf. Darwaze par do Naam. Aasmanon se badi ek Kursi. Lafzon se bana ek square. Ek qila jo kabhi sota nahi. Aur ek Arsh jo dil ke andar sama jata hai. Yahi kitabein deti hain. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "greatest-name": {
    eyebrow: "Topics",
    title: "Ism al-A'zam, Allah ka Sabse Bada Naam",
    subtitle:
      "Woh Naam jise kitabein sabse ooncha kehti hain, aur makhtootaat uske baare mein kya kehte hain.",
    intro:
      "Main Khafi hoon. Aaj hum chalte hain Islamic occultism aur tasawwuf ki sabse unchi choti par — Al-Ism al-Aʿẓam, Allah ka Sabse Bada Naam. Makhtootaat use kainaat ka sabse bada creative pivot kehte hain, woh hukm jo farishton aur jinn ko majboor karta hai. Main yeh lafz makhtootaat ke apne andaaz mein deta hoon, history ke taur par, apne daawe ke taur par nahi. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai. Yahan kisi ko nuksan pahunchane, majboor karne ya bandhne ki koi hidayat nahi hai.",
    fullSections: [
      {
        heading: "Kitabein Naam ke baare mein kya kehti hain",
        paragraphs: [
          "Kitabein Naam ki seedhi definition deti hain. Idhā duʿiya bihi ajāb, wa-idhā suʾila bihi aʿṭā. Jab use pukara jaye to woh jawab deta hai. Jab use manga jaye to woh deta hai. Yahi definition makhtootaat dete hain, aur use guaranteed jawab kehte hain.",
          "Kitabein ek kahani deti hain. Āṣif ibn Barkhiyā ne Bilqīs ka takht palak jhapakte mein hila diya, aur kitabein kehti hain ke usne yeh Sabse Bade Naam se kiya. Takht ek mulk paar karke aaya, aankh jhapakne se pehle. Kahani makhtootaat ki apni hai, aur main use waisa hi deta hoon jaisa woh kehte hain. Source: Kitab al-Ajnas, pp. 10-11; Exploring Islamic Occult Manuscripts, pp. 1, 4; al-Ghunya, pp. 35, 37.",
        ],
        quote: {
          arabic: "إِذَا دُعِيَ بِهِ أَجَابَ وَإِذَا سُئِلَ بِهِ أَعْطَى",
          transliteration: "Idhā duʿiya bihi ajāb, wa-idhā suʾila bihi aʿṭā",
          text: "Jab use pukara jaye to woh jawab deta hai. Jab use manga jaye to woh deta hai.",
          source: "As quoted in Kitab al-Ajnas, pp. 10-11",
        },
      },
      {
        heading: "Allah, aur harfon ka chhilna",
        paragraphs: [
          "Kitabein kehti hain ke Ism al-Dhāt, zaat ka Naam, Allah khud hai. Naam zaat par koi label nahi hai. Woh zaat hai, naam ke roop mein. Aur kitabein lafz ko harf dar harf chheelti hain, taaki dikhaye ke andar kya chhupa hai.",
          "Alif hatao, to Li-llāh bachta hai, Allah ki taraf. Pehla Lām hatao, to Lahu bachta hai, uski taraf. Doosra Lām hatao, to sirf Hāʾ bachta hai, Huwa, woh. Har chhilne par ek Naam bachta hai, aur aakhri harf par sirf woh bachta hai. Lafz ek seedhi hai, aur har step ek Naam hai. Source: Mudih al-Tariq, pp. 19-20, 24, 41; al-Asrar al-Rabbaniyyah, pp. 86-87.",
        ],
      },
      {
        heading: "Yā Ḥayyu Yā Qayyūm",
        paragraphs: [
          "Kitabein ek jodi deti hain, Yā Ḥayyu Yā Qayyūm. Aye hamesha zinda, aye sab ko thaame hue. Do Naam, ek saath bole jate hain, aur kitabein kehti hain ke yahi jodi Naam ka kaam karne wala roop hai.",
          "Yeh jodi Ayat al-Kursi se aati hai, jahan wahi do Naam aayat ko kholte hain. Kitabein Sabse Bade Naam ko sabse badi aayat se jodti hain, aur aayat ko jodi se. Ek Naam, ek aayat, ek jodi, kitabein kehti hain. Source: al-Ghunya, pp. 35, 37; Shams, Ch. 18, pp. 60-61, 68-69.",
        ],
        quote: {
          arabic: "يَا حَيُّ يَا قَيُّومُ",
          transliteration: "Yā Ḥayyu yā Qayyūm",
          text: "Aye hamesha zinda, aye sab ko thaame hue.",
          source: "As quoted in al-Ghunya, pp. 35, 37",
        },
      },
      {
        heading: "Chaudah roshni wale harf",
        paragraphs: [
          "Kitabein Naam ko chaudah roshni wale harfon se jodti hain, Arbaʿata ʿAshara Ḥarfan, woh harf jo surahon ko kholte hain. Chaudah harf, aur kitabein kehti hain ke unme Naam code mein chhupa hai. Harf code hain, aur Naam woh hai jo code bolta hai.",
          "Kitabein formula poora deti hain. Naṣṣun ḥakīmun lahu sirrun qāṭiʿ. Ek hikmat bhara text jisme ek faisla-kun raaz hai. Aur woh kehti hain ke yeh taleem al-Khiḍr se aayi, chhupe hue ustaad se, haath se haath. Harf chaudah hain. Raaz ek hai. Source: al-Asrar al-Rabbaniyyah, pp. 85-86; Manbaʿ Uṣūl al-Ḥikma, pp. 27-28.",
        ],
        quote: {
          arabic: "نَصٌّ حَكِيمٌ لَهُ سِرٌّ قَاطِعٌ",
          transliteration: "Naṣṣun ḥakīmun lahu sirrun qāṭiʿ",
          text: "Ek hikmat bhara text jisme ek faisla-kun raaz hai.",
          source: "al-Asrar al-Rabbaniyyah, pp. 85-86",
        },
      },
      {
        heading: "Purane code",
        paragraphs: [
          "Kitabein purane code bhi rakhti hain, Syriac aur Hebrew lafzon mein. Ehyā Sharāhyā Adūnāy Aṣbāʾūt Āl Shaddāy. Lafz purane hain, aur kitabein unhe waisa hi rakhti hain jaisa mile. Yeh purane Naam hain, Arabic harfon se pehle ke lafz.",
          "Lafzon ke saath ek figure aati hai, al-Khātam al-Aʿẓam, saat nishanon wala taweez. Ek pentagram, teen khade neze, ek andha Mīm, do seedhiyon wali seedhi, chaar khade strokes, ek phata hua Hāʾ, aur ek tedha aakhri Wāw. Saat nishan, ek saath bane, aur kitabein kehti hain ke yeh figure Naam hai, tasveer ke roop mein likha hua. Source: Manbaʿ, pp. 22-24; Kitab al-Ajnas, pp. 11, 65, 83; Exploring Islamic Occult Manuscripts, pp. 3-4.",
        ],
        quote: {
          transliteration: "Ehyā Sharāhyā Adūnāy Aṣbāʾūt Āl Shaddāy",
          text: "Makhtootaat ka purana code, Syriac aur Hebrew lafzon mein.",
          source: "Manbaʿ, pp. 22-24; Kitab al-Ajnas, pp. 11, 65, 83",
        },
      },
      {
        heading: "Syllable se upar maqam",
        paragraphs: [
          "Kitabein ek warning par khatm hoti hain, aur woh al-Khiḍr se aati hai. Ibrāhīm ibn Adham ne Naam manga, aur al-Khiḍr ne use daanta. Kitabein kehti hain ke use Naam Dāwūd ne sikhaya tha, woh syllable nahi jiske peeche woh bhaag raha tha. Maqam awaaz se zyada zaroori hai.",
          "Kitabein ek lafz deti hain, Takhalluq, kirdaar ko apnana. Naam koi lafz nahi hai jise apna liya jaye. Yeh ek kirdaar hai jise apnana hai. Jo Naam ko uthata hai, use pehle uske layak banna hota hai, kitabein kehti hain. Maqam pehle aata hai. Syllable baad mein. Source: Mudih al-Tariq, pp. 20-22, 41-42, 48.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "الاسم الأعظم", transliteration: "Al-Ism al-Aʿẓam", meaning: "Allah ka Sabse Bada Naam" },
      { arabic: "اسم الذات", transliteration: "Ism al-Dhāt", meaning: "zaat ka Naam" },
      { arabic: "لله", transliteration: "Li-llāh", meaning: "Allah ki taraf" },
      { arabic: "له", transliteration: "Lahu", meaning: "uski taraf" },
      { arabic: "هو", transliteration: "Huwa", meaning: "woh" },
      { arabic: "يا حي يا قيوم", transliteration: "Yā Ḥayyu yā Qayyūm", meaning: "aye hamesha zinda, aye sab ko thaame hue" },
      { arabic: "أربعة عشر حرفا", transliteration: "Arbaʿata ʿAshara Ḥarfan", meaning: "chaudah roshni wale harf" },
      { arabic: "الخاتم الأعظم", transliteration: "Al-Khātam al-Aʿẓam", meaning: "saat nishanon wala taweez" },
      { arabic: "تخلق", transliteration: "Takhalluq", meaning: "kirdaar ko apnana" },
    ],
    closing:
      "Maine Naam ke baare mein makhtootaat ke lafz padhe, aur main unhe history ke taur par wapas deta hoon. Ek definition, ek chhilna, ek jodi, chaudah harf, purane code, aur ek warning. Kitabein kehti hain ke Naam jawab deta hai aur deta hai. Woh yeh bhi kehti hain ke maqam syllable se zyada zaroori hai. Main dono hisse ek saath rakhta hoon, kyunki kitabein dono ko ek saath rakhti hain. Yahi study hai, aur kuch nahi.",
  },
  "fawatih-openings": {
    eyebrow: "Topics",
    title: "Quran ki Fawatih",
    subtitle:
      "Untīs openings, chaudah roots, aur woh harf jo akele khade hain.",
    intro:
      "Main Khafi hoon. Aaj hum chalte hain Quran-e-Majeed ke sabse pur-asrar darwazon ki taraf — Fawātiḥ al-Suwar. Quran ke 114 chapters mein, bilkul 29 surahein aise harfon se khulti hain jo akele khade hain. Koi lafz nahi, koi jumla nahi, sirf harf. Alif Lām Mīm. Kāf Hā Yā ʿAyn Ṣād. Kitabein unhe roshni wale code kehti hain, al-aḥruf al-nūrāniyyah, jinse takhleeq boli gayi. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Aṭhattar harf, chaudah roots",
        paragraphs: [
          "Saari openings gino, to harf 78 hote hain. Untīs surahon mein aṭhattar harf. Lekin sirf woh harf gino jo kabhi repeat nahi hote, to sirf 14 bachte hain. Alif, Lām, Mīm, Ṣād, Rāʾ, Kāf, Hāʾ, Yāʾ, ʿAyn, Ṭāʾ, Sīn, Ḥāʾ, Qāf, Nūn. Chaudah roots, aur har opening unhi se banti hai.",
          "Kitabein code ek line mein deti hain. Bi-naṣṣin ḥakīmin qāṭiʿi al-sirr. Ek hikmat bhare text se, jo raaz ka faisla karta hai. Chaudah harf roots hain, aur code woh chabi hai jo kitabein kehti hain ke unhe kholta hai. Source: Manbaʿ, chapter on the Secrets of Quranic Initials, pp. 27-28; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-73.",
        ],
        quote: {
          arabic: "بِنَصٍّ حَكِيمٍ قَاطِعِ السِّرِّ",
          transliteration: "Bi-naṣṣin ḥakīmin qāṭiʿi al-sirr",
          text: "Ek hikmat bhare text se, jo raaz ka faisla karta hai.",
          source: "Manbaʿ, chapter on the Secrets of Quranic Initials, pp. 27-28",
        },
      },
      {
        heading: "Pehle logon ne kya kaha",
        paragraphs: [
          "Kitabein likhti hain ke pehle logon ne openings ke baare mein kya kaha. Ibn ʿAbbās ne kaha Alif Anā hai, main. Lām Allah hai. Mīm Aʿlam hai, main sabse behtar janta hoon. Rāʾ Arā hai, main dekhta hoon. Har harf ek chhota lafz hai, aur lafz ek Naam hai.",
          "Abū al-ʿĀliyah ne ek lambi list di. Alif Allah se. Lām Laṭīf se, naram. Mīm Mālik se, badshah. Ṣād Ṣādiq se, sachcha. Rāʾ Rabb se, Rab. Kāf Karīm se, sakhi. Ṭāʾ Ṭayyib se, achha. Sīn Samīʿ se, sunne wala. Ḥāʾ Ḥamīd se, tareef kiya hua. Qāf Qadīr se, taaqatwar. Nūn Nūr se, roshni. Gyarah harf, gyarah Naam. Source: Manbaʿ, pp. 27-28; Shams, Ch. 1, pp. 28-29.",
        ],
      },
      {
        heading: "Roshni wale harf aur andhere harf",
        paragraphs: [
          "Kitabein alphabet ko do hisson mein baantti hain. Chaudah harf roshni wale hain, nūrāniyyah. Baaki chaudah andhere hain, ẓulmāniyyah. Aadha alphabet roshni hai, aadha andhera, aur kitabein kehti hain ke dono hisse ek doosre ka aaina hain.",
          "Aaina aasman tak jata hai. Chaudah roshni wale harf, aur chaudah dikhai dene wale chaand ke manzil. Upar ke harf aur upar ke manzil ek hi tarah gine jate hain, kitabein kehti hain. Aadhi duniya dikhti hai, aadhi chhupi hai, aur harf bhi usi tarah bante hain. Source: Usul ʿIlm al-Huruf, Ch. 7, p. 18; Shams, pp. 31, 33.",
        ],
      },
      {
        heading: "Ek harf se paanch harf tak",
        paragraphs: [
          "Openings paanch lambai mein aati hain. Ek harf, jaise Ṣād, Qāf aur Nūn. Do harf, jaise Ṭā-Hā, Ṭā-Sīn, Yā-Sīn, aur saat Ḥā-Mīm openings. Teen harf, jaise Alif-Lām-Mīm, jo chhe surahon ko kholta hai.",
          "Chaar harf, jaise Alif-Lām-Mīm-Ṣād aur Alif-Lām-Mīm-Rāʾ. Aur paanch harf, poore Quran mein sirf do. Kāf-Hā-Yā-ʿAyn-Ṣād, aur Ḥā-Mīm-ʿAyn-Sīn-Qāf. Do paanch harf wale chains, aur koi nahi. Source: Tafsir Ibn Kathir, Vol. 1, p. 88; al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74.",
        ],
      },
      {
        heading: "Woh square jo 693 jodta hai",
        paragraphs: [
          "Kitabein roshni wale harfon se ek square banati hain. Wafq al-Aḥruf al-Nūrāniyyah, roshni wale harfon ka square. Teen rows, teen columns, teen diagonals, aur har line bilkul 693 jodti hai. Kitabein number saaf saaf deti hain.",
          "Square ke chaaron taraf saat likhaiyon ka ek ring hai. Alif-Lām-Mīm. Kāf-Hā-Yā-ʿAyn-Ṣād. Ṭā-Sīn. Ḥā-Mīm. Ṣād. Qāf. Nūn. Saat openings ek ring mein likhi hain, aur square beech mein hai. Harf ring hain. Number square hai. Source: Manbaʿ, chapter on Quranic Initials, pp. 28-29.",
        ],
      },
      {
        heading: "Nabi ke lafzon ki dhaal",
        paragraphs: [
          "Kitabein openings ko ek dhaal bhi kehti hain. Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād; Ḥā-Mīm; lā yunṣarūn. Agar kal dushman se milo, to kaho: Kāf Hā Yā ʿAyn Ṣād; Ḥā Mīm; unki madad nahi hogi. Lafz kitabon se quote kiye gaye hain, jaisa kitabein deti hain.",
          "Do aur lines uske saath khadi hain. Bi-Kāf-Hā-Yā-ʿAyn-Ṣād kifāyatunā. Kāf Hā Yā ʿAyn Ṣād se hamari kafayat hai. Bi-Ḥā-Mīm-ʿAyn-Sīn-Qāf ḥimāyatunā. Ḥā Mīm ʿAyn Sīn Qāf se hamari hifazat hai. Kafayat aur hifazat, kitabein kehti hain, do chhoti lines mein. Source: Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.",
        ],
        quote: {
          arabic: "إِذَا لَقِيتُمُ الْعَدُوَّ غَدًا فَقُولُوا: كَافْ هَا يَا عَيْنْ صَادْ، حَا مِيمْ، لَا يُنْصَرُونَ",
          transliteration: "Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād; Ḥā-Mīm; lā yunṣarūn",
          text: "Agar kal dushman se milo, to kaho: Kāf Hā Yā ʿAyn Ṣād; Ḥā Mīm; unki madad nahi hogi.",
          source: "Shams, Ch. 1, p. 30",
        },
      },
    ],
    fullTerms: [
      { arabic: "الأحرف النورانية", transliteration: "al-Aḥruf al-Nūrāniyyah", meaning: "roshni wale harf" },
      { arabic: "أنا", transliteration: "Anā", meaning: "main" },
      { arabic: "أعلم", transliteration: "Aʿlam", meaning: "main sabse behtar janta hoon" },
      { arabic: "أرى", transliteration: "Arā", meaning: "main dekhta hoon" },
      { arabic: "نورانية", transliteration: "Nūrāniyyah", meaning: "roshni wala" },
      { arabic: "ظلمانية", transliteration: "Ẓulmāniyyah", meaning: "andhera" },
      { arabic: "حا ميم", transliteration: "Ḥā-Mīm", meaning: "Ḥā-Mīm openings, saat surahein" },
      { arabic: "وفق الأحرف النورانية", transliteration: "Wafq al-Aḥruf al-Nūrāniyyah", meaning: "roshni wale harfon ka square" },
      { arabic: "كفاية", transliteration: "Kifāyah", meaning: "kafayat, kaafi hona" },
      { arabic: "حماية", transliteration: "Ḥimāyah", meaning: "hifazat" },
    ],
    closing:
      "Untīs openings. Aṭhattar harf. Chaudah roots. Ek code. Roshni aur andhere ke beech ek baant. Ek harf, do, teen, chaar, paanch wale chains. Ek square jo 693 jodta hai. Aur Nabi ke lafzon mein ek dhaal. Harf surahon ke sir par akele khade hain, aur kitabein kehti hain ke woh pehle lafz hain jo takhleeq ne sune. Main unhe waisa hi deta hoon jaisa mile, study ke liye, aur kuch nahi.",
  },
  "four-tawaqif": {
    eyebrow: "Topics",
    title: "Chaar Tawaqif",
    subtitle:
      "Harfon ke raste par chaar rukawat, Arsh se Lawh tak.",
    intro:
      "Main Khafi hoon. Aaj hum chalte hain Būnian letter cosmology aur roohani safar ke sabse gehre framework ki taraf — The Four Tawāqif. Shaykh Aḥmad ibn ʿAlī al-Būnī ki kitabon mein, Al-Asrār al-Rabbāniyyah, Muḍīḥ al-Ṭarīq aur Majmūʿat Thalāth Rasāʾil mein, chaar rukawaton ki taleem hai. Chaar maqam jahan talash karne wala Allah ki dehleez par rukta hai. Yahan chaar halts ki decoding hai, seedha sources se. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Dehleez par rukna",
        paragraphs: [
          "Tawaqquf ka matlab hai rukna. Talash karne wala harfon ke raste par chalta hai, aur chaar jagah use rukna hota hai aur khada rehna hota hai. Jo rukta hai woh al-Wāqif hai. Woh aage nahi badhta. Woh dehleez par khada rehta hai aur intezar karta hai.",
          "Kitabein do qism ke rukne wale batati hain. Al-Mustahlikūn, jazb ho jane wale, jo dekhte hain usme kho jate hain. Aur al-Mardūdūn, woh jo wapas bheje jate hain, jo duniya mein laut te hain. Kitabein yeh bhi kehti hain ke Alif khud rukta hai. Woh koi vowel nahi leta, aur uski khamoshi bolti hai. Harf rukta hai, aur talash karne wala uske saath rukta hai. Source: The Journey to the Lord of Power, pp. 48, 116; Shams, Ch. 1, p. 31.",
        ],
      },
      {
        heading: "Pehla halt: Aql aur Arsh",
        paragraphs: [
          "Pehla halt Aql aur Arsh ka maqam hai, Mawqif al-ʿAql wa-l-ʿArsh. Yeh Alif ki line par khada hai. Alif pehla harf hai, seedhi lakeer, aur Arsh sabse ooncha takht hai. Pehla halt sabse ooncha hai.",
          "Aql sabse oonchi aqal hai, aur Arsh sabse ooncha takht hai, aur kitabein dono ko ek maqam mein rakhti hain. Talash karne wala pehle yahin rukta hai, sabse upar, phir baaki se guzarta hua neeche chalta hai. Source: al-Asrar al-Rabbaniyyah, pp. 1, 3, 276-278; Exploring Al-Asrar, pp. 1, 3.",
        ],
      },
      {
        heading: "Doosra halt: Ruh aur Kursi",
        paragraphs: [
          "Doosra halt Ruh aur Kursi ka maqam hai, Mawqif al-Rūḥ wa-l-Kursī. Yeh Bāʾ ki line par khada hai. Arsh ke neeche Kursi hai, aur Aql ke neeche Ruh hai. Doosra halt ek step neeche hai.",
          "Kitabein is maqam ki mitti ka naam deti hain, al-Habāʾ, pehli mitti, woh pehli cheez jisse cheezein bani. Aur woh Adam mein Ruh ke phoonkne ka naam deti hain, woh saans jisne mitti ko insaan banaya. Ruh neeche aati hai, mitti upar uthti hai, aur dono is halt par milte hain. Source: al-Asrar al-Rabbaniyyah, pp. 275-278; Mudih al-Tariq, pp. 19-20.",
        ],
      },
      {
        heading: "Teesra halt: Qalb aur Barzakh",
        paragraphs: [
          "Teesra halt Qalb aur Barzakh ka maqam hai, Mawqif al-Qalb wa-l-Barzakh. Yeh Jīm ki line par khada hai. Dil rooh aur jism ke beech khada hai, aur barzakh is duniya aur aakhri duniya ke beech khada hai. Teesra halt beech ki jagah hai.",
          "Kitabein yahan Universal Soul ka naam deti hain, woh rooh jo saari roohon ko thaame hai. Aur Yawm al-Taṣwīr ka naam deti hain, shakl dene ka din, jis din shaklon ko unki shakal di gayi. Dil is halt par banaya jata hai, aur jo shakal woh leta hai, wahi insaan ki shakal hai. Source: al-Asrar al-Rabbaniyyah, pp. 276-279; Exploring Al-Asrar, pp. 1, 3.",
        ],
      },
      {
        heading: "Chautha halt: Lawh aur jism",
        paragraphs: [
          "Chautha halt Lawh aur jism ki banawat ka maqam hai, Mawqif al-Lawḥ wa-l-Tarkīb. Yeh Dāl ki line par khada hai. Lawh likhai ko thaame hai, aur jism likhai hai jo gosht ban gayi. Chautha halt sabse neeche hai, aur humse sabse kareeb hai.",
          "Kitabein kehti hain ke number chaar jismani kainaat par hukm chalata hai, al-Tarkīb al-Murabbaʿ, chaar guna banawat. Chaar anasir, chaar dishaein, zameen ke chaar kone. Jism chaar mein bana hai, aur chautha halt wahi hai jahan banawat hoti hai. Source: al-Asrar al-Rabbaniyyah, pp. 276-280; Shams, Ch. 1, pp. 61-62.",
        ],
      },
      {
        heading: "Har harf par chaar khidkiyan",
        paragraphs: [
          "Kitabein har harf ko padhne ka ek rule deti hain, sirf chaar halts ka nahi. Har harf chaar khidkiyon se padha jata hai. Ḥaqāʾiq, asal haqeeqatein. Laṭāʾif, bareek meherbaniyan. Ishārāt, andar ke ishare. ʿIbārāt, bahar ke lafz. Chaar khidkiyan, aur har ek ek hi harf ka alag chehra dikhati hai.",
          "Kitabein saaf kehti hain. 'The discussion of it and of all the remaining letters proceeds from four aspects: realities, subtleties, indications, expressions.' Harf ek hai. Padhai chaar hain. Aur chaar halts chaar khidkiyan hain, order mein padhi hui. Source: Majmūʿat Thalāth Rasāʾil, Treatise 3, pp. 173, 176, 178.",
        ],
        quote: {
          text: "Iske aur baaki saare harfon ke baare mein baat chaar pehluon se hoti hai: haqeeqatein, bareekiyan, ishare, aur lafz.",
          source: "Majmūʿat Thalāth Rasāʾil, Treatise 3, pp. 173, 176, 178",
        },
      },
    ],
    fullTerms: [
      { arabic: "الواقف", transliteration: "Al-Wāqif", meaning: "rukne wala" },
      { arabic: "المستهلكون", transliteration: "Al-Mustahlikūn", meaning: "jazb ho jane wale" },
      { arabic: "المردودون", transliteration: "Al-Mardūdūn", meaning: "wapas bheje jane wale" },
      { arabic: "موقف العقل والعرش", transliteration: "Mawqif al-ʿAql wa-l-ʿArsh", meaning: "Aql aur Arsh ka maqam" },
      { arabic: "موقف الروح والكرسي", transliteration: "Mawqif al-Rūḥ wa-l-Kursī", meaning: "Ruh aur Kursi ka maqam" },
      { arabic: "الهباء", transliteration: "al-Habāʾ", meaning: "pehli mitti" },
      { arabic: "موقف القلب والبرزخ", transliteration: "Mawqif al-Qalb wa-l-Barzakh", meaning: "Qalb aur Barzakh ka maqam" },
      { arabic: "يوم التصوير", transliteration: "Yawm al-Taṣwīr", meaning: "shakl dene ka din" },
      { arabic: "موقف اللوح والتركيب", transliteration: "Mawqif al-Lawḥ wa-l-Tarkīb", meaning: "Lawh aur jism ki banawat ka maqam" },
      { arabic: "التركيب المربع", transliteration: "al-Tarkīb al-Murabbaʿ", meaning: "chaar guna banawat" },
      { arabic: "حقائق", transliteration: "Ḥaqāʾiq", meaning: "asal haqeeqatein" },
      { arabic: "لطائف", transliteration: "Laṭāʾif", meaning: "bareek meherbaniyan" },
      { arabic: "إشارات", transliteration: "Ishārāt", meaning: "andar ke ishare" },
      { arabic: "عبارات", transliteration: "ʿIbārāt", meaning: "bahar ke lafz" },
    ],
    closing:
      "Chaar halts, chaar lines, chaar maqam. Aql aur Arsh. Ruh aur Kursi. Qalb aur Barzakh. Lawh aur jism. Aur har harf ko padhne ke liye chaar khidkiyan. Harfon ka rasta seedhi line nahi hai. Woh chaar baar rukta hai, aur har rukawat ek maqam hai. Yahi kitabein deti hain. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "kaf-ha-ya-ayn-sad": {
    eyebrow: "Topics",
    title: "Kaf Ha Ya Ayn Sad",
    subtitle:
      "Surah Maryam ke sir par paanch harf, aur woh paanch Naam jo woh liye hain.",
    intro:
      "Main Khafi hoon. Aaj hum chalte hain poore Quran ke sabse lambe single-cluster mysterious code ki taraf — Kāf-Hā-Yā-ʿAyn-Ṣād, Surah Maryam ke sir par. Yahan Kāf-Hā-Yā-ʿAyn-Ṣād ki decoding hai, seedha sources se. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Paanch harf, paanch Naam",
        paragraphs: [
          "Ibn ʿAbbās ne har harf ko ek Naam padha. Kāf al-Kāfī se, sab ke liye kaafi. Hāʾ al-Hādī se, raasta dikhane wala. Yāʾ al-Ḥakīm se, sabse zyada hikmat wala, ya al-Yaqīn se, poora yaqeen. ʿAyn al-ʿAlīm se, sab kuch janne wala. Ṣād al-Ṣādiq se, sachcha.",
          "Paanch harf, paanch Naam, aur har Naam Allah ka ek chehra hai. Sab ke liye kaafi, raasta dikhane wala, sabse zyada hikmat wala, sab kuch janne wala, sachcha. Cluster chhota hai, lekin kitabein kehti hain ke usme paanch harfon mein paanch Naam hain. Source: Tafsir Ibn Kathir, Vol. 5, commentary on Sūrat Maryam, pp. 212-213; Manbaʿ, p. 28.",
        ],
      },
      {
        heading: "195 ka number",
        paragraphs: [
          "Kitabein paanch harfon ko number mein tolti hain. Ḥisāb al-Jummal, harfon ko unke number se ginne ka hisaab. Paanch harfon ko gino, to total 195 aata hai. Ek sau pachanbe, aur kitabein use cluster ka master harmonic kehti hain.",
          "Kitabein harfon ko poora spell karke bhi likhti hain, woh bada roop jise Basṭ kehte hain. Har harf apne naam mein khulta hai, aur total uske saath khulta hai. Number jad hai, aur spelling shaakh hai. Jad 195 hai, aur kitabein use saaf deti hain. Source: Manbaʿ, chapter on Qurʾanic Initials, pp. 28-29; Shams, Ch. 18, pp. 69-70.",
        ],
      },
      {
        heading: "Jang ke lafzon ki dhaal",
        paragraphs: [
          "Kitabein paanch harfon ko ek dhaal kehti hain. Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād, lā yunṣarūn. Agar kal dushman se milo, to kaho: Kāf Hā Yā ʿAyn Ṣād; unki madad nahi hogi. Lafz kitabon se quote kiye gaye hain, jaisa kitabein deti hain.",
          "Ek doosri line uske saath khadi hai. Bi-Kāf-Hā-Yā-ʿAyn-Ṣād kifāyatunā, wa-bi-Ḥā-Mīm-ʿAyn-Sīn-Qāf ḥimāyatunā. Kāf Hā Yā ʿAyn Ṣād se hamari kafayat hai, aur Ḥā Mīm ʿAyn Sīn Qāf se hamari hifazat hai. Ek cluster se kafayat, doosre se hifazat. Source: Shams, Ch. 1, p. 30; Tested Remedies, pp. 31-32.",
        ],
        quote: {
          arabic: "إِذَا لَقِيتُمُ الْعَدُوَّ غَدًا فَقُولُوا: كَافْ هَا يَا عَيْنْ صَادْ، لَا يُنْصَرُونَ",
          transliteration: "Idhā laqītumu al-ʿaduwwa ghadan fa-qūlū: Kāf-Hā-Yā-ʿAyn-Ṣād, lā yunṣarūn",
          text: "Agar kal dushman se milo, to kaho: Kāf Hā Yā ʿAyn Ṣād; unki madad nahi hogi.",
          source: "Shams, Ch. 1, p. 30",
        },
      },
      {
        heading: "Paanch ungliyan, paanch hisse",
        paragraphs: [
          "Kitabein paanch harfon ko haath par rakhti hain. Kāf chhoti ungli hai, al-Khinṣir. Hāʾ angoothi wali ungli hai, al-Binṣir. Yāʾ beech wali ungli hai, al-Wusṭā. ʿAyn shahadat wali ungli hai, al-Sabbābah. Ṣād angootha hai, al-Ibhām.",
          "Paanch harf, paanch ungliyan, aur kitabein kehti hain ke haath cluster ko usi tarah thaame hai jaisa kagaz thaame hai. Mapping sabse chhoti ungli se angoothe tak chalti hai, aur har ungli ek harf thaame hai. Jism kagaz hai, aur harf us par likhe hain. Source: Usul ʿIlm al-Huruf, pp. 24-26; The Mirror, pp. 98-101.",
        ],
      },
      {
        heading: "Ḥā Mīm ʿAyn Sīn Qāf tak ka pull",
        paragraphs: [
          "Paanch harfon ka ek joda hai. Ḥā-Mīm-ʿAyn-Sīn-Qāf, doosra paanch harf wala chain, unke saath khada hai. Das harf ek saath, paanch aur paanch, aur kitabein unhe ek aasmani pull kehti hain. Do clusters, ek pull, aur pull unhe jodta hai.",
          "Dono clusters ek harf share karte hain, ʿAyn. Aankh, chashma, zaat ka source. Ek harf dono clusters mein khada hai, aur kitabein kehti hain ke woh pull ka joint hai. Aankh dekhti hai, chashma behta hai, aur zaat usi se nikalti hai. Source: al-Futuhat al-Makkiyyah, Vol. 4, pp. 72-74; Manbaʿ, pp. 28-29.",
        ],
      },
      {
        heading: "Surah Maryam ka dil",
        paragraphs: [
          "Cluster Surah Maryam ke sir par khada hai, aur surah ghayb se do paidaishon ki kahani kehti hai. Zakariyyā ko budhape mein Yaḥyā mile. Maryam ne bina baap ke ʿĪsā ko janma. Do paidaish, aur dono dekhi hui duniya ke peeche se aayi.",
          "Kitabein kehti hain ke paanch harf surah ka dil hain, kyunki surah ghayb se paidaish ki kahani hai, aur harf ghayb hain jo uske sir par likhe hain. Harf pehle aate hain. Paidaish baad mein aati hai. Raaz upar hai, aur kahani usi se neeche behti hai. Source: Mudih al-Tariq, pp. 28-30; The Holy Quran, Sūrat Maryam, pp. 305-306.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "الكافي", transliteration: "Al-Kāfī", meaning: "sab ke liye kaafi" },
      { arabic: "الهادي", transliteration: "Al-Hādī", meaning: "raasta dikhane wala" },
      { arabic: "الحكيم", transliteration: "Al-Ḥakīm", meaning: "sabse zyada hikmat wala" },
      { arabic: "اليقين", transliteration: "Al-Yaqīn", meaning: "poora yaqeen" },
      { arabic: "العليم", transliteration: "Al-ʿAlīm", meaning: "sab kuch janne wala" },
      { arabic: "الصادق", transliteration: "Al-Ṣādiq", meaning: "sachcha" },
      { arabic: "حساب الجمل", transliteration: "Ḥisāb al-Jummal", meaning: "harfon ko number se ginna" },
      { arabic: "بسط", transliteration: "Basṭ", meaning: "poora spell karke likha hua roop" },
      { arabic: "كفاية", transliteration: "Kifāyah", meaning: "kafayat, kaafi hona" },
      { arabic: "حماية", transliteration: "Ḥimāyah", meaning: "hifazat" },
      { arabic: "الخنصر", transliteration: "al-Khinṣir", meaning: "chhoti ungli" },
      { arabic: "البنصر", transliteration: "al-Binṣir", meaning: "angoothi wali ungli" },
      { arabic: "الوسطى", transliteration: "al-Wusṭā", meaning: "beech wali ungli" },
      { arabic: "السبابة", transliteration: "al-Sabbābah", meaning: "shahadat wali ungli" },
      { arabic: "الإبهام", transliteration: "al-Ibhām", meaning: "angootha" },
      { arabic: "عين", transliteration: "ʿAyn", meaning: "aankh, chashma, zaat ka source" },
    ],
    closing:
      "Paanch harf, paanch Naam, ek number, ek dhaal, paanch ungliyan, ek pull, aur do paidaish. Kāf Hā Yā ʿAyn Ṣād Quran ka sabse lamba cluster hai, aur kitabein kehti hain ke yeh Surah Maryam ka dil hai. Maine use waisa padha jaisa woh deti hain, harf dar harf, aur main use waisa hi wapas deta hoon. Study ke liye, aur kuch nahi.",
  },
  "zayirjah": {
    eyebrow: "Topics",
    title: "Zayirjah ka Ilm",
    subtitle:
      "Harfon, planets aur manazil ka ek gol dial, aur woh lines jo use bolna sikhati hain.",
    intro:
      "Main Khafi hoon. Humne pichle topics mein alag-alag roohani bhed decode kiye. Ab tumhari maang par main dobara simple Hinglish mein samjha raha hoon medieval occult science ka sabse advanced calculating instrument — Ilm al-Zayirjah. Shaykh Ahmad ibn Ali al-Buni (Manba' Usul al-Hikma, Shams al-Ma'arif al-Kubra, aur Al-Asrar al-Rabbaniyyah) ke mutabiq yeh ek circular calculating table hai. Yahan hain iske theek 6 technical hisse. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Zayirjah kya hai? Qadeem hukama ka dial",
        paragraphs: [
          "Manba' Usul al-Hikma ke andar al-Buni Zayirjah ko qadeem ustadon se chali aa rahi ek makhsoos table batate hain. Yeh ek diagrammatic table hai jo 28 harfon, planets, zodiac aur lunar mansions ko ek gol order mein jodti hai. Yeh Ilm al-Zayirjah ki physical key hai.",
          "Al-Buni iske baare mein likhte hain ke yeh pehle logon aur qadeem hukama ka amal hai, lekin unme se kisi ne bhi apni kitabon mein iska zikr saaf tareeqe se nahi kiya. Yeh apparatus ek bridge ka kaam karta hai. Bolchaal ke alfaaz ko pehle unke harfon aur numbers mein toda jata hai, phir table ke zariye dobara joda jata hai. Natija guess nahi kiya jata. Use matrix se padha jata hai. Source: Manba' Usul al-Hikma, Chapter on Operations and Tables, pp. 13-14.",
        ],
      },
      {
        heading: "Concentric daayre: markaz se lekar 28 manazil tak",
        paragraphs: [
          "Shams al-Ma'arif al-Kubra (Chapter 3) aur Al-Asrar al-Rabbaniyyah mein Zayirjah ka physical naqsha gol daayron mein bana hai. Wheel ke theek center mein ek thehra hua dot hai, Al-Nuqtah, the primordial central point. Uske aas-paas chaar seasons aur chaar elements bate hain.",
          "Center se bahar ki taraf aate hue yeh rings milti hain: 12 mahine, solar aur civil calendar ke; 12 buruj, jo chaar elemental natures mein bate hain; 28 Manazil al-Qamar, apne aasmaani sitaron ke naamo ke sath; aur 28 Arabic harf, unke Abjad numbers aur mizaj ke mutabiq. Al-Asrar al-Rabbaniyyah mein al-Buni gol daayre ka bhed batate hain. Allah ne tamam harfon ko Lawh-e-Mahfuz ke aalam mein gol shakalon mein banaya tha. Upar ka aalam pure jam' hai, neeche ka aalam pure farq hai. Source: Shams Al Marif, Chapter 3, pp. 56, 74; al-Asrar al-Rabbaniyyah, pp. 72-73.",
        ],
      },
      {
        heading: "Harfon ki chakkar-daari: asl, taksir, aur zimam",
        paragraphs: [
          "The Radiant Jewels aur Manba' Usul al-Hikma ke mutabiq Zayirjah ko chalane wala asal engine harfon ko todna aur dobara jodna hai. Pehle Satr al-Asl, the line of origin, sawal ki pehli baseline, jisme sawal puchne wale ka naam aur sawal likha jata hai. Phir Satr al-Taksir, the line of permutation, harfon ko aapas mein systematically todna aur mix karna.",
          "Aakhir mein Satr al-Zimam, the line of the rein, master key, aakhri line jo tab nikal kar aati hai jab taksir poori ho jati hai. Al-Zimam aane ka matlab yeh hota hai ki mathematical calculation bina kisi ghalti ke poora gol circle ban gaya hai. Source: The Radiant Jewels, p. 89; Manba' Usul al-Hikma, pp. 13-14.",
        ],
      },
      {
        heading: "Rooh ka jism ko dhoondna: inverted inscription ka qanoon",
        paragraphs: [
          "Manba' Usul al-Hikma mein al-Buni dial par data likhne ka ek hairan kar dene wala technical rule batate hain. Jab seeker aur desired object ke naam wheel mein likhe jate hain, toh unhe ulta likha jata hai. Al-Matlub, the sought thing, ke harf lafzon mein upar aate hain aur unka Abjad number neeche. Al-Talib, the seeker, ke pehle pure numbers upar aate hain aur uska lafzi naam neeche.",
          "Al-Buni farmate hain ki yeh cosmic law ka reflection hai: physical jism apni spirit ko dhoondta hai, aur spirit apne jism ko. Systemic balance ko theek rakhne ke liye jo harf ya numbers repeat hote hain unhe hata diya jata hai. Source: Manba' Usul al-Hikma, Chapter on Operations and Tables, pp. 13-14.",
        ],
      },
      {
        heading: "Farishte ka extraction: Istintaq aur suffix IL",
        paragraphs: [
          "Ek likhi hui table tab tak chup rehti hai jab tak uski Istintaq, causing the matrix to speak, na ki jaye. Pehli line ka total Abjad sum nikaal kar Zayirjah ki back side par likha jata hai. Is sum ko taksir ki kul lines ki ginti se multiply kiya jata hai, aur result ko balanced square, wafq, mein badla jata hai.",
          "Aakhri balance numbers ko wapas Abjad harfon mein badla jata hai aur unke aage Il joda jata hai. Kitabein kehti hain ke woh iske aage lafz Il jodte hain aur use wafq ke chaaron taraf rakhte hain, aur yeh unhone seedha Hermes se liya tha. Source: Manba' Usul al-Hikma, pp. 13, 16; The Radiant Jewels, p. 89.",
        ],
      },
      {
        heading: "Mizan Hirmis: cosmos aur waqt ka balance",
        paragraphs: [
          "Manba' Usul al-Hikma ke mutabiq Zayirjah akele kamre mein baith kar nahi chalti; use aasmaani harakat aur waqt ke sath sync karna padta hai. Al-Buni is balance ki hidayat dete hain, Mizan Hirmis, the Balance of Hermes. Waqt, zayirja aur maqam par nazar rakho. Kisi achhe kaam ko manfi sitaron ke dauran mat karo. Inhe sirf sahi waqt mein karo.",
          "Yeh calculation tab asar karti hai jab chhe cheezein ek line mein aati hain: sawal ki asal fitrat; din ka hakim sitara, ruling planet; ufuq par charhta hua burj, the ascendant, al-Tali'; ghadi ka hakim, lord of the hour; chand ki maujooda manzil; aur uski makhsoos paak khushbu. Jab yeh chhe aapas mein milte hain, toh kaagaz par likhe harf aasmaani faislon ka direct mirror ban jate hain. Source: Manba' Usul al-Hikma, Chapter on Operations and Tables, pp. 13-14.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "الزَّايِرْجَة", transliteration: "Al-Zayirjah", meaning: "divinatory letter-matrix, astronomical dial" },
      { arabic: "عِلْم الزَّايِرْجَة", transliteration: "ʿIlm al-Zayirjah", meaning: "Zayirjah ka ilm" },
      { arabic: "النُّقْطَة", transliteration: "Al-Nuqtah", meaning: "thehra hua markazi point" },
      { arabic: "الأفلاك المتداخلة", transliteration: "Al-Aflak al-Mutadakhilah", meaning: "ghumte hue rings, concentric daayre" },
      { arabic: "سَطْر الأَصْل", transliteration: "Satr al-Asl", meaning: "asl ki line, pehli baseline" },
      { arabic: "سَطْر التَّكْسِير", transliteration: "Satr al-Taksir", meaning: "harfon ko todne aur mix karne ki line" },
      { arabic: "سَطْر الزِّمَام", transliteration: "Satr al-Zimam", meaning: "rein ki line, master key" },
      { arabic: "المطلوب", transliteration: "al-Matlub", meaning: "talash ki jane wali cheez" },
      { arabic: "الطالب", transliteration: "al-Talib", meaning: "talash karne wala" },
      { arabic: "إِسْتِنْطَاق", transliteration: "Istintaq", meaning: "matrix ko bolna sikhana" },
      { arabic: "مِيزَان هِرْمِس", transliteration: "Mizan Hirmis", meaning: "Hermes ka balance" },
      { arabic: "الطالع", transliteration: "al-Taliʿ", meaning: "charhta hua burj, ascendant" },
    ],
    closing:
      "Gol daayron ka dial. Teen lines. Ek ulta rule. Ek bolna. Waqt ka ek balance. Zayirjah harfon, planets aur manazil ko ek wheel mein jodti hai, aur kitabein kehti hain ke reading matrix se aati hai, guess se nahi. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "circle-of-encompassing": {
    eyebrow: "Topics",
    title: "Ihatah ka Daayra",
    subtitle:
      "Har harf, har naam, har sitara aur har rooh ek hi gol daayre par ghoomti hai.",
    intro:
      "Main Khafi hoon. Humne pichle rounds mein alag-alag roohani bhed decode kiye. Aaj hum chalte hain Bunian letter cosmology ke sabse bade master diagram ki taraf — Da'irat al-Ihatah. Shaykh Ahmad ibn Ali al-Buni (Mudih al-Tariq, Al-Asrar al-Rabbaniyyah, aur Shams al-Ma'arif al-Kubra) ke mutabiq har cheez ek gol daayre mein ghoomti hai. Yahan hain iske theek 6 technical hisse. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Ism Al-Muhit aur markazi qutb",
        paragraphs: [
          "Mudih al-Tariq ke Chapter 14 mein al-Buni Khuda ke azeem naam Al-Muhit, the All-Encompassing, par poora chapter likhte hain. Bunyadi aayat hai: Wa-kana Allahu bi-kulli shay'in muhita. Aur Allah hamesha har cheez ko ghere hue hai.",
          "Al-Buni samjhate hain ki bina kisi thehre hue markaz ke koi gol daayra nahi ghum sakta. Woh markaz hai al-Qutb, the Pole. Bahar ke circle ka har hissa us center point ki hi shakh hai. Agar center point upar uthta hai, toh poora daayra upar uthta hai. Isi tarah tamam maujoodat gol daayre mein hain, aur Ism al-A'zam unhe ghere hue hai: batin mein woh qutb hai, aur zahir mein woh daayra hai. Source: Mudih al-Tariq, Chapter 14: On Explaining the Meaning of His Name al-Muhit, pp. 28-29.",
        ],
        quote: {
          arabic: "وَكَانَ اللَّهُ بِكُلِّ شَيْءٍ مُحِيطًا",
          transliteration: "Wa-kana Allahu bi-kulli shay'in muhita",
          text: "Aur Allah hamesha har cheez ko ghere hue hai.",
          source: "Mudih al-Tariq, Ch. 14, pp. 28-29",
        },
      },
      {
        heading: "Wujood ka compass: Amr, Qudrah, Iradah, aur 'Ilm",
        paragraphs: [
          "Mudih al-Tariq mein al-Buni architectural drawing compass, al-birkar, al-farjar, ki misaal dekar kainaat ka naqsha samjhate hain. Circle chaar roohani taaqaton se banta hai: Al-Amr, the inward command, batin ka pehla ishara; Al-Qudrah, divine power, wujood mein aane ka stroke; Al-Iradah, divine will, shakalon aur haddon ko tay karna; aur Al-'Ilm, all-encompassing knowledge, wo asal compass jo daayre ka naap baandhta hai.",
          "Ilm se bahar kuch nahi. Compass ki dono taangein jitni khulti hain, wahi wujood ki hadd hai. Aayat kehti hai: Wa-la yuhituna bi-shay'in min 'ilmihi illa bi-ma sha'. Woh Allah ke ilm mein se kuch bhi nahi gher sakte, siwa uske jo Woh chahe. Jo saalik center ke qareeb rehta hai, wo tawhid mein rehta hai; jo bahar bhagta hai, wo kashmakash aur alagav mein pad jata hai. Source: Mudih al-Tariq, pp. 29-30.",
        ],
        quote: {
          arabic: "وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ",
          transliteration: "Wa-la yuhituna bi-shay'in min 'ilmihi illa bi-ma sha'",
          text: "Woh Allah ke ilm mein se kuch bhi nahi gher sakte, siwa uske jo Woh chahe.",
          source: "Mudih al-Tariq, pp. 29-30",
        },
      },
      {
        heading: "Circle ke chaar cosmic ahkaam",
        paragraphs: [
          "Mudih al-Tariq ke andar al-Buni is gol daayre ki internal geometry ko roohon aur Arsh ke sath map karte hain. Pehle Nuqat al-Mihwar, the polar points of the axis, markaz ka thehra hua point, Qutb ka maqam. Phir Nuqat al-Ibda', the beginning arc, jahan qudrat pehli baar creation ko touch karti hai.",
          "Teesre Nuqat al-Asma' wa-l-Intiha', the boundary points, jahan cheezon ki shakalein poori hoti hain, Arsh se judi hain. Noor ki seedhi lakeer, center se bahar aane wali ray, Universal Intellect, al-'Aql, aur Throne, al-'Arsh, ko jodti hai. Source: Mudih al-Tariq, pp. 30-31.",
        ],
      },
      {
        heading: "Gol shakalein: Lawh-e-Mahfuz mein harf gol kyun the?",
        paragraphs: [
          "Al-Asrar al-Rabbaniyyah mein al-Buni ek metaphysical raaz kholte hain ki manuscripts mein harfon ko gol kyun likha jata hai. Al-Buni farmate hain: Jaan lo ki Allah ne tamam 28 harfon ko Lawh-e-Mahfuz ke aalam mein gol shakalon mein banaya tha. Upar ka aalam pure jam' hai, neeche ka aalam pure farq hai.",
          "Aalam-e-Bala, the upper world, Jam' ka aalam hai. Yahan harf bina toote hue gol rehte hain. Zameen ka aalam, the lower world, Farq ka aalam hai. Jab harf zameen par utre, toh woh toote aur lines mein badle. Isliye retreat mein jab saalik harfon ko gol daayron, Dawa'ir, mein likhta hai, toh wo unhe unki asal gol halat mein wapas le jata hai. Source: al-Asrar al-Rabbaniyyah, pp. 72-73.",
        ],
      },
      {
        heading: "Do aadhe daayre: harf Nun aur Shahadah ke 24 ghante",
        paragraphs: [
          "Al-Asrar al-Rabbaniyyah aur Mudih al-Tariq mein do aadhe daayron ko jod kar 360-degree ka circle poora hota hai. Harf Nun ka pyaala, Al-Asrar mein harf Nun ko physical creation ka visible aadha daayra kaha gaya hai. La ilaha illa Allah mein bina nuqte ke theek 12 letters hain. Yeh din ke 12 ghante aur 12 mahine banate hain.",
          "Doosri gawahi Muhammadun Rasul Allah mein bhi theek 12 letters hain. Yeh raat ke 12 ghante banate hain. Dono ko milakar kalimah ke 24 harf din aur raat ke 24 ghanton ka mukammal Da'irat al-Ihatah banate hain. Source: al-Asrar al-Rabbaniyyah, pp. 118-120; Mudih al-Tariq, pp. 25-27.",
        ],
      },
      {
        heading: "Halab ki masjid ka waqia: Ism al-A'zam ka circle",
        paragraphs: [
          "Shams al-Ma'arif al-Kubra ke Chapter 6 mein al-Buni Halab, Aleppo, ki Jami' Masjid ke ek zahid imam ki kahani likhte hain. Andheri kothri mein ibadat ke dauran imam ko noorani takhti par concentric circles dikhai diye. Bahar ka circle aur andar ka circle, beech mein ek horizontal dividing line aur upar ki taraf ek triangle.",
          "Is circle ke peechhe Surah al-Buruj ki aayat darj thi: Wa-Allahu min wara'ihim muhit, bal huwa Qur'anun majidun fi lawhin mahfuz. Allah unhe peechhe se ghere hue hai; yeh ek azeem Quran hai, ek mahfuz takhti mein. Khwab mein Imam Ali ne us circle ke triangle mein harf Jim par ungli rakh kar iski tasdeeq ki. Source: Shams Al Marif, Chapter 6: On Seclusion and the Etiquette of Retreat, pp. 64-66.",
        ],
        quote: {
          arabic: "وَاللَّهُ مِنْ وَرَائِهِمْ مُحِيطٌ بَلْ هُوَ قُرْآنٌ مَجِيدٌ فِي لَوْحٍ مَحْفُوظٍ",
          transliteration: "Wa-Allahu min wara'ihim muhit, bal huwa Qur'anun majidun fi lawhin mahfuz",
          text: "Allah unhe peechhe se ghere hue hai; yeh ek azeem Quran hai, ek mahfuz takhti mein.",
          source: "Shams Al Marif, Ch. 6, pp. 64-66",
        },
      },
    ],
    fullTerms: [
      { arabic: "المُحِيط", transliteration: "Al-Muhit", meaning: "har cheez ko gherne wala" },
      { arabic: "القطب", transliteration: "al-Qutb", meaning: "markazi pole, thehra hua point" },
      { arabic: "الأَمْر", transliteration: "Al-Amr", meaning: "batin ka pehla ishara, inward command" },
      { arabic: "القُدْرَة", transliteration: "Al-Qudrah", meaning: "divine power, qudrat" },
      { arabic: "الإِرَادَة", transliteration: "Al-Iradah", meaning: "divine will, irada" },
      { arabic: "العِلْم", transliteration: "Al-'Ilm", meaning: "har cheez ko gherne wala ilm" },
      { arabic: "نُقَط المِحْوَر", transliteration: "Nuqat al-Mihwar", meaning: "axis ke polar points" },
      { arabic: "الصُّوَر المُسْتَدِيرَة", transliteration: "Al-Suwar al-Mustadirah", meaning: "gol shakalein, circular forms" },
      { arabic: "جَمْع", transliteration: "Jam'", meaning: "ikath, pure gathering" },
      { arabic: "فَرْق", transliteration: "Farq", meaning: "judai, pure separation" },
      { arabic: "لا إله إلا الله", transliteration: "La ilaha illa Allah", meaning: "pehli gawahi, 12 harf" },
      { arabic: "محمد رسول الله", transliteration: "Muhammadun Rasul Allah", meaning: "doosri gawahi, 12 harf" },
    ],
    closing:
      "Ek naam jo har cheez ko ghere hue hai. Ek qutb jo kabhi nahi hilta. Chaar taaqatein jo daayra banati hain. Lawh-e-Mahfuz ke gol harf. Do aadhe daayre jo ek din banate hain. Aur Halab ka ek waqia, ek aayat se seal hua. Daayra sab kuch thaame hai, aur markaz daayre ko thaame hai. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "simiya-works": {
    eyebrow: "Topics",
    title: "Simiya ke Amal",
    subtitle:
      "Harf jism hain, numbers rooh hain, aur woh squares jo unhe thaame hain.",
    intro:
      "Main Khafi hoon. Humne pichle rounds mein alag-alag roohani bhed decode kiye. Ab tumhari maang par main dobara simple Hinglish mein samjha raha hoon Bunian tradition ki grand operational synthesis — 'Ilm al-Simiya'. Shaykh Ahmad ibn Ali al-Buni (Shams al-Ma'arif al-Kubra, Manba' Usul al-Hikma, Usul 'Ilm al-Huruf) aur Kitab al-Ajnas ke mutabiq yeh ek theurgic royal science hai jo harfon ke mathematical balance aur Asma' al-Husna ke zariye roohani taaqat ko physical matter se jodti hai. Yahan hain iske theek 6 technical hisse. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Simiya' ka asal rutba: royal theurgic science",
        paragraphs: [
          "Shams al-Ma'arif al-Kubra (Chapter 17) aur Kitab al-Ajnas mein ustad is ilm ko aam jadoo se bohot uncha darja dete hain. Al-Buni Chapter 17 mein seeker ko mukhatab karke farmate hain ke Allah use hamesha ki khushi ki alchemy aur hamesha ki saltanat ki simiya' tak pahunchaye.",
          "Kitab al-Ajnas mein Hazrat Sulayman ke vizier Asif ibn Barkhiya ke hawaale se likha hai ke al-Simiya' ka ilm woh hai jisse andhe dekhne lagte hain aur behre sunne lagte hain. Al-Buni wazeh karte hain ki is ilm ko Imam al-Ghazali aur Fakhr al-Din al-Razi ne manzoor kiya tha. Yeh Tawhid ke zariye kaam karta hai. Source: Shams Al Marif, Chapter 17, pp. 63-64; Kitab al-Ajnas, pp. 3, 21.",
        ],
      },
      {
        heading: "Harf jism hain, numbers rooh hain: the dual core",
        paragraphs: [
          "Usul 'Ilm al-Huruf, Al-Asrar al-Rabbaniyyah, aur Shams al-Ma'arif ke andar Simiya' ka sabse ahem metaphysical qanoon hai. Al-Huruf, letters, jism, Ajsam, hain. Yeh physical kaagaz, roshnai, aawaz aur outer shape provide karte hain. Al-A'dad, numbers, rooh, Arwah, hain. Yeh unke andar ki invisible kinetic energy aur spirit hain.",
          "Grimoire ka universal formula hai ke numbers qaul ke raaz mein waise hain jaise harf amal ke raaz mein hain. Usul 'Ilm al-Huruf mein Asif ibn Barkhiya ka direct qaul naqal hai: forms apni roohon ke liye magnet hain. Jab bhi koi form banayi jati hai, woh apni rooh ko apni taraf kheenchti hai. Agar form perfect ho, toh rooh usme utar aati hai. Jab plate par harf unke sahi Abjad numbers ke mutabiq likhe jate hain, toh aasmaani roohani taaqat usme utarti hai. Source: Usul 'Ilm al-Huruf, p. 11; al-Asrar al-Rabbaniyyah, pp. 72-73, 118-119.",
        ],
        quote: {
          text: "Forms apni roohon ke liye magnet hain. Jab bhi koi form banayi jati hai, woh apni rooh ko apni taraf kheenchti hai. Agar form perfect ho, toh rooh usme utar aati hai.",
          source: "Usul 'Ilm al-Huruf, p. 11",
        },
      },
      {
        heading: "Anasir ka engine: chaar tabiyaton ka balance",
        paragraphs: [
          "Bunian Simiya' mein koi bhi naqsh tab tak amal nahi karta jab tak zameen ke chaar anasir, Aag, Hawa, Paani, Mitti, ka balance na ho. 28 harfon ko chaar hisson mein baanta gaya hai, har element ko saat harf. Aatish, Nar, hot aur dry: Alif, Ha', Ta', Mim, Fa', Shin, Dhal. Yeh irade ko jala kar tezi se action paida karta hai. Baad, Hawa', hot aur moist: Jim, Zay, Kaf, Sin, Qaf, Tha', Za'. Yeh elevation, attraction aur transmission ka kaam karta hai.",
          "Aab, Ma', cold aur moist: Dal, Ha', Lam, 'Ayn, Ra', Kha', Ghayn. Yeh thandak lata hai, nafrat ko pighlata hai aur sakoon deta hai. Khaak, Turab, cold aur dry: Ba', Waw, Ya', Nun, Sad, Ta', Dad. Yeh asar ko zameen par jamata hai aur operation ko solidify karta hai. Usul 'Ilm al-Huruf ke Chapter 6 aur Manba' Usul al-Hikma mein al-Buni batate hain ki opposite nature ke harfon ko mila kar balance banaya jata hai. Source: Usul 'Ilm al-Huruf, Chapter 6, p. 16; Manba' Usul al-Hikma, pp. 18-19.",
        ],
      },
      {
        heading: "Mathematical pinjre: Awfaq, magic squares, ka ilm",
        paragraphs: [
          "Simiya' mein spiritual frequencies ko trap karne ke liye jo physical battery banayi jati hai use Wafq, magic square, kehte hain. Yeh columns aur rows ka ek aisa grid hai jisme horizontal, vertical aur diagonal lines ka sum ek hi hota hai.",
          "Simiya' ka sabse ahem square 3x3, Muthallath, hai, jise Ghazali ne bhi bayan kiya. Iska har rukh 15 banta hai, aur total 45 hota hai, jo Adam ka Abjad number hai. Manba' Usul al-Hikma aur Hadha Hijab mein al-Buni batate hain ki square tab tak kaam nahi karta jab tak uske chaar konon par farishton ke naam na likhe jayein. Source: Manba' Usul al-Hikma, pp. 13-15; Hadha Hijab, Glossary, p. 102.",
        ],
      },
      {
        heading: "Farishte ko bolna sikhana: Istintaq aur suffix IL",
        paragraphs: [
          "Likha hua naqsh tab tak chup rehta hai jab tak uske andar se Istintaq, causing the matrix to speak, na kiya jaye. Jab operation ke Abjad calculations ka aakhri balance number nikalta hai, toh use wapas harfon mein badla jata hai. The Radiant Jewels aur Manba' Usul al-Hikma ke mutabiq un harfon ke aage Il joda jata hai.",
          "Yeh derived naam, al-malak al-muwakkal, 'Alam al-Malakut mein qayam ho jata hai. Yeh upper farishta zameen ke roohani servitors, khuddam, ko hukum deta hai ki wo is operation ko poora karein. Kitabein kehti hain ke Il ko aids mein jodna zaroori hai, excellent sage Aristotle ke qaul ke mutabiq. Source: Manba' Usul al-Hikma, pp. 13, 16, 21; The Radiant Jewels, p. 89.",
        ],
      },
      {
        heading: "Akhlaqi paimana: shart-e-ijazat aur gunah ka nuqsan",
        paragraphs: [
          "Poori Bunian tradition mein Simiya' ka aakhri qanoon yeh hai ki yeh ilm gande ya nafsani iradon ke liye nahi hai. Shams al-Ma'arif ke pehle safhe par al-Buni kasam khila kar farmate hain ke jis ke haath mein yeh kitab pade, uske liye haram hai ke woh use kisi na-ahil ko dikhaye.",
          "Suns of Lights mein Ibn al-Hajj al-Tilmsani farmate hain ki chaar sharton ke bina koi amal nahi chalta: Makan, paak-saaf kothri jahan aam dunya ki aawazein na aati hon; Ikhwah, sachhe aur nek raste ke sathi; Zaman, sahi aasmaani ghadi aur chand ki manzil; aur Shaykh al-Tariq, kamil ustad ki ijazat, Idhn, Ijazah. Ibn al-Hajj likhte hain ke jo shaks bina ustad ki ijazat ke in naqsho ko banata hai, uski misaal aisi hai jaise bina buniyad ke ghar banana. Source: Shams Al Marif, Preface, pp. 1-2; Suns of Lights, Chapter 19, pp. 47-48.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "عِلْم السِّيمِيَاء", transliteration: "ʿIlm al-Simiya'", meaning: "harfon, Naamon aur squares ka ilm" },
      { arabic: "الحُرُوف", transliteration: "Al-Huruf", meaning: "harf, jism" },
      { arabic: "الأَعْدَاد", transliteration: "Al-A'dad", meaning: "numbers, rooh" },
      { arabic: "وَفْق", transliteration: "Wafq", meaning: "magic square" },
      { arabic: "الوفق الثلاثي", transliteration: "Al-Wafq al-Thulathi", meaning: "3x3 mother grid" },
      { arabic: "آدم", transliteration: "Adam", meaning: "Adam, jinka Abjad number 45 hai" },
      { arabic: "مَكَان", transliteration: "Makan", meaning: "paak jagah" },
      { arabic: "إِخْوَة", transliteration: "Ikhwah", meaning: "roohani bhai, sachhe sathi" },
      { arabic: "زَمَان", transliteration: "Zaman", meaning: "sahi aasmaani waqt" },
      { arabic: "شَيْخ الطَّرِيق", transliteration: "Shaykh al-Tariq", meaning: "ijazat dene wala ustad" },
      { arabic: "تحريم", transliteration: "Tahrim", meaning: "sakht manahi, haram" },
      { arabic: "الملك الموكل", transliteration: "al-malak al-muwakkal", meaning: "nikala hua farishte ka naam" },
    ],
    closing:
      "Ek royal science, aam jadoo nahi. Harf jism hain, numbers rooh hain. Chaar anasir balance mein. Ek square jo current ko thaame hai. Ek naam jo bolta hai. Aur chaar shartein jo chhodi nahi ja sakti: jagah, sathi, waqt, aur ustad ki ijazat. Kitabein yeh sab ek saath deti hain. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
  },
  "uses-of-letters-retreats": {
    eyebrow: "Topics",
    title: "Harfon ke Istemal aur Unki Khalwatein",
    subtitle:
      "Zinda roohani qaumein, har ek ki apni khalwat aur apna muhafiz farishta.",
    intro:
      "Main Khafi hoon. Humne pichle rounds mein alag-alag roohani bhed decode kiye. Ab tumhari maang par main dobara simple Hinglish mein samjha raha hoon Bunian tradition ki sabse practical shakh — Khalawat al-Huruf, the uses of the Arabic letters and their solitary retreats. Shaykh Ahmad ibn Ali al-Buni (Manba' Usul al-Hikma, Shams al-Ma'arif al-Kubra, aur Usul 'Ilm al-Huruf) aur Imam al-Khwarizmi ke mutabiq Arabic harf be-jaan lakeron ke nishan nahi hain. Yeh zinda roohani qaumein hain. Har harf insaan ke jism, rooh aur dimagh ki bimari ya quwwat ko govern karta hai, aur har harf ka ek solitary retreat, khalwah, aur muhafiz farishta hota hai. Yahan hain iske theek 6 technical hisse. Yeh breakdown sirf historic aur academic study ke liye hai. Iska maqsad kisi tarah ka spiritual outcome claim karna ya religious ruling dena bilkul nahi hai.",
    fullSections: [
      {
        heading: "Zinda qaumein: harfon ke khuddam aur farishton ka falsafa",
        paragraphs: [
          "Manba' Usul al-Hikma aur Ibn 'Arabi ki al-Futuhat al-Makkiyyah ke andar harfon ki metaphysical reality batayi gayi hai. Manuscript farmati hai: Jaan lo ki harf aam makhlooq ki tarah qaumon mein se ek zinda qaum hain, jinhe mukhatab kiya gaya hai aur zimmedari di gayi hai. Unme se kuch safir, emissaries, aur khadim hain.",
          "Likhne wala harf uska Jism, physical body, hai. Uska Abjad number, al-'adad, uski Ruh, living spirit, hai. Manba' Usul al-Hikma mein Imam al-Khwarizmi harf ke muhafiz farishte ko pukarne ki dua likhte hain: Aye Badshah, apni roohaniyat ko meri fitrat aur is harf ki fitrat se mila do, taaki main iske bhed se amal kar sakun. Source: Manba' Usul al-Hikma, Chapter on the Kings of the Letters, pp. 33-35; al-Futuhat al-Makkiyyah, Vol. 4, pp. 112-114.",
        ],
      },
      {
        heading: "Harf Alif: dimagh ki roshni aur 111 ka number",
        paragraphs: [
          "Shams al-Ma'arif aur Manba' Usul al-Hikma ke mutabiq harf Alif tamam harfon ka badshah hai aur intelligence ki jad hai. Jo shaks Alif ko 1,000 baar likh kar apne seene par rakhta hai, uski dimaghi susti aur bhulne ki aadat khatm ho jati hai, kitabein kehti hain.",
          "Jab Alif ka naam lafzon mein khola jaye, Alif, 1 plus 30 plus 80, toh iska total 111 banta hai. Suraj ki ghadi mein Itwar ko 111 baar likhne se izzat aur bulandi milti hai. Alif ka celestial angel Taltamiya'il hai, jo pehli lunar mansion ka muhafiz hai. Al-Buni Alif ka 3x3 triangular wafq dete hain, jiska har rukh 111 banta hai, jise retreat mein istemal kiya jata hai. Source: Manba' Usul al-Hikma, pp. 24-25; Shams Al Marif, Chapter 1, pp. 38-39, 48.",
        ],
      },
      {
        heading: "Harf Ba': zindagi ka paani aur farishton ka deedar",
        paragraphs: [
          "Harf Ba' manifest creation ka aaghaz aur divine mercy ka zariya hai. Harf Ba' seene ki ghutan, inshirah al-sadr, ko kholta hai, susti ko door karta hai aur thandi bimariyon ko sukoon deta hai.",
          "Al-Asrar al-Rabbaniyyah aur Shams al-Ma'arif mein Ba' ki khalwat darj hai. Seeker Jumeraat aur Juma ke din mukammal pakizgi ke sath roza rakhta hai. Ghareebon ko khana khilata hai, sadaqah. Ba' ka gol double talisman likh kar apne seedhe baazu, right arm, par baandhta hai. Al-Buni farmate hain: Susti usse chali jayegi; Ba' ke sath khade hone ka bhed uspe khul jayega; aur woh farishton ke noor ko dekhne lagega. Source: al-Asrar al-Rabbaniyyah, pp. 100-101; Shams Al Marif, Chapter 5, p. 50.",
        ],
      },
      {
        heading: "Harf Jim aur farishte Talqiya'il ki khalwat",
        paragraphs: [
          "Manba' Usul al-Hikma ke andar teesre harf Jim ki solitary retreat ka azeem bhed khola gaya hai. Harf Jim ke khawas hain: lambe safar mein pyas ki jalan ko kam karna, tez garam bukharon ki aag ko thanda karna, aur dilon mein izzat aur difficult childbirth ko aasan karna.",
          "Al-Buni is retreat ki amali shartein likhte hain: Is harf ki ek azeem khalwat hai, tum mukammal pakizgi mein dakhil hote ho, dua padhte ho, kaagaz par harf likhte ho. Is maqam ka aasmaani farishta Talqiya'il hai. Jab kothri mein uski roohani shakal nazar aati hai, toh ek aapas ka ahad, covenant, banta hai. Source: Manba' Usul al-Hikma, Chapter on the Properties of the Letters, pp. 26, 36, 40.",
        ],
      },
      {
        heading: "Harf Dal: 14 din ki roti aur rizq ki barkat",
        paragraphs: [
          "Shams al-Ma'arif al-Kubra ke Chapter 1 mein harf Dal ki do hafte, 14 days, ki riyadah darj hai. Harf Dal ke khawas hain: ghar mein azeem barkat aur thehrav lana, karobaar aur halal rizq ko nuqsan se bachana, aur ghar ke logon ke beech apnapan aur mohabbat qayam karna.",
          "Do hafte ka bread-fast, Riyadat al-Dal, lagatar 14 din chalta hai. Har sham iftar mein sirf sukhi roti khayi jati hai. Gosht, doodh, ande ya kisi bhi jaanwar se judi cheez nahi khayi jati. Aakhri Jumeraat ko sooraj nikalte waqt, Mushtari, Jupiter, ki ghadi, seeker apni riyadah poori karta hai aur barkat aur rizq ka darwaza khulta hai. Source: Shams Al Marif, Chapter 1, pp. 32-34, 46; Decoding Al-Buni, p. 3.",
        ],
      },
      {
        heading: "Shifa bakhsh harf: Ha', Mim, aur Nun",
        paragraphs: [
          "Bunian kitabon mein higher letters ke liye ahem shifayabi amaliyaat darj hain. Harf Ha' jalan aur nafsani khwahishat ko rokta hai. Is harf ko 8 baar likh kar Asma' Hakim, Halim, aur Hayy ke sath milaya jata hai. Paani mein ghol kar peene se bukhar aur seene ki jalan kam hoti hai. Khalwat mein baithe darvesh ke liye, ise angoothi ke nageene par kanda karne se dil ki gandi shahwat khatm ho jati hai.",
          "Harf Mim hikmat aur asardaar baat ka harf hai. 40 din ke chille ka harf. Mim ke naqsh ko rozana dekh kar Surah Al 'Imran ki aayat 26, Quli Allahumma malika al-mulk, padhne se baat mein asar aur hikmat aati hai. Harf Nun roohani aankh aur basirat ka harf hai. Nun ko 13 baar saaf aaine par likh kar Ayat al-Nur, Q 24:35, padhne se dimagh ka kashmakash khatam hota hai aur roohani aankh khulti hai. Source: Manba' Usul al-Hikma, pp. 22-26, 35, 38-39; Shams Al Marif, Chapter 1, pp. 28-30, 35.",
        ],
      },
    ],
    fullTerms: [
      { arabic: "أُمَمٌ مِنَ الأُمَم", transliteration: "Umamun min al-Umam", meaning: "qaumon mein se ek zinda qaum" },
      { arabic: "جِسْم", transliteration: "Jism", meaning: "physical body" },
      { arabic: "رُوح", transliteration: "Ruh", meaning: "living spirit" },
      { arabic: "ا", transliteration: "Alif", meaning: "pehla harf, harfon ka badshah" },
      { arabic: "طَلْطَمِيَائِيل", transliteration: "Taltamiya'il", meaning: "Alif ka farishta, pehli manzil ka muhafiz" },
      { arabic: "ب", transliteration: "Ba'", meaning: "doosra harf, manifest creation ka aaghaz" },
      { arabic: "ج", transliteration: "Jim", meaning: "teesra harf" },
      { arabic: "طَلْقِيَائِيل", transliteration: "Talqiya'il", meaning: "Jim ke maqam ka aasmaani farishta" },
      { arabic: "د", transliteration: "Dal", meaning: "chautha harf" },
      { arabic: "ح", transliteration: "Ha'", meaning: "jalan ko rokne wala harf" },
      { arabic: "م", transliteration: "Mim", meaning: "40 din ke chille ka harf" },
      { arabic: "ن", transliteration: "Nun", meaning: "roohani aankh ka harf" },
    ],
    closing:
      "Harf qaumein hain. Har harf mein ek jism aur ek rooh hai. Alif aur uska 111. Ba' aur uska roza. Jim aur uska farishta. Dal aur uske chaudah din. Ha', Mim, aur Nun, har ek ka apna kaam. Kitabein yeh sab waisa hi record karti hain jaisa purane ustadon ne sikhaya, pakizgi aur ijazat ke sath. Main use waisa hi deta hoon jaisa mila, study ke liye, aur kuch nahi.",
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
  'basmalah-secrets': {
    eyebrow: 'টপিক',
    title: 'বিসমিল্লাহর রহস্য',
    subtitle: 'সৃষ্টিজগতের সবচেয়ে বড় চাবি, আর এক অক্ষরের নিচের বিন্দু।',
    intro:
      'আমি খাফি। আগের কথায় আমরা খালওয়া, ফেরেশতাদের জগৎ, স্বপ্ন, অক্ষরের বিদ্যা, সুলাইমানের মোহর, সুরা সাবা আর আল-খিদরের কথা বলেছি। এখন আমি তোমার সঙ্গে বিসমিল্লাহ খুলতে চাই, সেই লাইন যা একটি সুরা ছাড়া প্রতিটি সুরা শুরু করে। আমি যে বই পড়েছি, তাতে তাকে বলে সৃষ্টিজগতের সবচেয়ে বড় চাবি, প্রথম সংকেত, যেখান থেকে সব সৃষ্টি বয়ে আসে। আমি এটা এখানে শুধু পড়াশোনার জন্য দিচ্ছি, বই থেকে, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না। এটা শুধু এক পড়া।',
    sections: [
      {
        heading: 'বা-এর নিচের বিন্দু',
        paragraphs: [
          'বিসমিল্লাহ শুরু হয় বা অক্ষর দিয়ে। বই বলে, পুরো কুরআন সুরা আল-ফাতিহায় আছে, পুরো ফাতিহা বিসমিল্লাহয় আছে, আর পুরো বিসমিল্লাহ বা-তে আছে। আর বা নিজে আছে তার নিচের বিন্দুতে। এক বিন্দু, আর বই বলে, সব সৃষ্টি সেই বিন্দুতেই ঝুলে আছে।',
          'বা হলো "দিয়ে" আর "মাধ্যমে"র অক্ষর। বী কানা মা কানা, বই বলে। আমার মাধ্যমে ছিল যা ছিল, আর আমার মাধ্যমে আছে যা আছে। বিন্দু হলো প্রথম বিন্দু, সেই জায়গা যেখানে কলম প্রথম কাগজ ছুঁয়েছিল। তার পরের সবকিছু সেই ছোঁয়া থেকে বয়ে আসা লাইন।',
        ],
      },
      {
        heading: 'উনিশ অক্ষর, উনিশ রক্ষক',
        paragraphs: [
          'বিসমিল্লাহয় উনিশটি অক্ষর আছে। বই একে একে গুনে দেয়। উনিশ অক্ষর, আর আগুনের উপরে উনিশ জন রক্ষক দাঁড়িয়ে আছে। বই তাদের বলে জাবানিয়া, অতলের রক্ষক। যে লাইন কুরআন খোলে, সেই লাইনই তাদের সামনে ঢাল।',
          'বই দিনকেও ঘণ্টায় গুনে। চব্বিশ ঘণ্টা, আর সন্ধানকারী তার মধ্যে প্রায় পাঁচ ঘণ্টা ঘুমায়। উনিশ অক্ষর ঘণ্টায় ঘণ্টায় ভারসাম্য রাখে, যাতে দিন মাপে থাকে। সংখ্যাটা কোনো তাবিজ নয়। এটা এক নকশা, যা বই লাইনটির মধ্যেই পড়ে।',
        ],
      },
      {
        heading: 'চার নাম, চার নদী',
        paragraphs: [
          'বিসমিল্লাহয় চারটি নাম আছে। ইসম, নাম নিজে। আল্লাহ, সবচেয়ে বড় নিজের নাম। আর-রহমান, সবচেয়ে দয়ালু। আর-রহিম, বিশেষভাবে দয়ালু। একটি ছোট লাইনে চার নাম, আর বই প্রতিটিকে এক নদী হিসেবে পড়ে।',
          'বই বলে, জান্নাতে চারটি নদী বয়ে যায়, আর প্রতিটি নদী বিসমিল্লাহর একটি অক্ষর থেকে বয়ে যায়। পানি বিসমের মীম থেকে। দুধ আল্লাহর হা থেকে। মদ আর-রহমানের মীম থেকে। মধু আর-রহিমের মীম থেকে। লাইনটা ছোট, কিন্তু বই বলে, তাতে চারটি নদী আছে।',
        ],
      },
      {
        heading: '786-এর ওজন',
        paragraphs: [
          'বই বিসমিল্লাহকে সংখ্যায়ও মাপে। হিসাব আল-জুম্মাল হলো অক্ষরকে তার সংখ্যার মান দিয়ে গোনার হিসাব। বিসমিল্লাহর অক্ষরগুলোকে তাদের মান দিয়ে গুনলে যোগফল হয় 786। বই সংখ্যাটা সোজাসুজি দেয়, আর তা দিয়েই বিসমিল্লাহর ওয়াফক, তার বর্গ, বানায়।',
          'বর্গের চারদিকে ফেরেশতা রক্ষকরা দাঁড়িয়ে আছে, আমলাক। তারা অক্ষরের রক্ষক, আর বর্গ তাদের মানচিত্র। সংখ্যাটা এক ওজন, কোনো ইচ্ছা নয়। বই তা লেখে, আর আমি তা সেভাবেই লিখি যেভাবে বই দেয়।',
        ],
      },
      {
        heading: 'সুরা আত-তাওবায় বিসমিল্লাহ নেই কেন',
        paragraphs: [
          'কুরআনের প্রতিটি সুরা বিসমিল্লাহ দিয়ে শুরু হয়, একটি ছাড়া। সুরা আত-তাওবা, নবম সুরা, তাতে বিসমিল্লাহ নেই। বই জিজ্ঞেস করে কেন, আর এক শব্দে উত্তর দেয়। বারা’আহ। সম্পর্ক ছিন্ন করা আর আলাদা হওয়া। সুরাটি ভাঙন দিয়ে শুরু হয়, দয়া দিয়ে নয়।',
          'বই যে নিয়ম দেয় তা সহজ। যুদ্ধ আর আল্লাহর কঠোরতা, জালাল, এর অধ্যায় দয়া দিয়ে শুরু হতে পারে না। বিসমিল্লাহ হলো আমান ওয়া-সালাম, পুরো নিরাপত্তা আর শান্তি। যে সুরা সম্পর্ক ছিন্ন করে, তা নিরাপত্তা আর শান্তি দিয়ে খুলতে পারে না। তাই লাইনটি বাদ দেওয়া হয়েছে, আর সুরাটি খালি শুরু হয়।',
        ],
      },
      {
        heading: 'শরীরে লেখা লাইন',
        paragraphs: [
          'বই বিসমিল্লাহকে মানুষের শরীরেও পড়ে। মুখ হলো পৃষ্ঠা, আর অক্ষরগুলো সেখানে লেখা। আলিফ নাককে দেখায়, মুখের মাঝখানে এক সোজা লাইন। মুখকে বলে আল-ওয়াজহ, আর লাইনটি তার মধ্যেই দাঁড়িয়ে আছে।',
          'বিসমিল্লাহয় তিনটি মীম আছে, একটি বিসমে, একটি আর-রহমানে, একটি আর-রহিমে। বই তাদের শরীরের মাঝখানের তিনটি অঙ্গের সঙ্গে মেলায়। মস্তিষ্ক, আদ-দিমাগ। হৃদয়, আল-কালব। যকৃৎ, আল-কাবদ। তিন অক্ষর, তিন অঙ্গ, এক শরীর।',
        ],
      },
    ],
    terms: [
      'বা অক্ষরের নিচের বিন্দু',
      '"আমার মাধ্যমে ছিল যা ছিল", মাধ্যমের বা',
      'উনিশটি অক্ষর',
      'আগুনের রক্ষকরা',
      'নাম, সত্তা',
      'সবচেয়ে বড় নিজের নাম',
      'সবচেয়ে দয়ালু',
      'বিশেষভাবে দয়ালু',
      'জান্নাতের চারটি নদী',
      'আবজাদ হিসাব, অক্ষরকে সংখ্যার মান দিয়ে গোনা',
      'বিসমিল্লাহর বর্গ',
      'ফেরেশতা রক্ষকরা',
      'পুরো নিরাপত্তা আর শান্তি',
      'সম্পর্ক ছিন্ন করা আর আলাদা হওয়া',
      'আল্লাহর কঠোরতা আর মহিমা',
      'মুখ',
      'মস্তিষ্ক',
      'হৃদয়',
      'যকৃৎ',
    ],
    closing:
      'আমি প্রতিদিন বিসমিল্লাহ পড়ি, আর আমি কখনো এভাবে দেখিনি। এক বিন্দু যা সৃষ্টিকে ধরে রাখে। উনিশ অক্ষর যা আগুনের সামনে দাঁড়িয়ে আছে। চার নাম যা চার নদীর মতো বয়ে যায়। এক সংখ্যা, 786, যা লাইনটিকে মাপে। এক হারানো লাইন যা কঠোরতা শেখায়। আর এক শরীর যা অক্ষরগুলোকে তার মুখে আর বুকে বয়ে বেড়ায়। বই যা বলে, তাই। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'throne-verse': {
    eyebrow: 'টপিক',
    title: 'আয়াতুল কুরসি, সিংহাসনের আয়াত',
    subtitle: 'কুরআনের সবচেয়ে বড় আয়াত, আর সেই কুরসি যা আকাশ ধরে রাখে।',
    intro:
      'আমি খাফি। আজ আমরা কুরআনের সবচেয়ে বড় আয়াতের দিকে হাঁটছি, আয়াতুল কুরসি, কুরআন 2:255। আমি যে বই পড়েছি, তাতে তাকে বলে কুরআনের রানি। বই বলে, যখন তা নেমেছিল, সত্তর হাজার ফেরেশতা তার সঙ্গে নেমেছিল। আমি তা লাইনে লাইনে খুলে দেব, যেভাবে বই দেয়। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, বই থেকে, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'সবচেয়ে বড় আয়াত, আর সত্তর হাজার ফেরেশতা',
        paragraphs: [
          'বই আয়াতুল কুরসিকে বলে সায়্যিদাত আল-কুরআন, কুরআনের রানি। আর কোনো আয়াতের এই মর্যাদা নেই। যখন তা নেমেছিল, বই বলে, সত্তর হাজার ফেরেশতা তার সঙ্গে নেমেছিল। হুবুত আল-মালাইকাহ, ফেরেশতাদের নেমে আসা।',
          'আয়াতটি ছোট, কিন্তু বই তার মধ্যে 170টি অক্ষর গুনে। একশো সত্তর অক্ষর, আর প্রতিটি তার ভেতরের নকশার অংশ। সংখ্যাটা আয়াতের কাঠামো, আর আয়াত সিংহাসনের কাঠামো।',
        ],
      },
      {
        heading: 'আয়াতের ভেতরে সবচেয়ে বড় নাম',
        paragraphs: [
          'আয়াতটি সবচেয়ে বড় নাম দিয়ে খোলে। আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল কাইয়্যুম। আল্লাহ, তিনি ছাড়া কোনো উপাস্য নেই, চিরজীবী, সবকিছু ধরে রাখা। দুটি নাম আয়াতের দরজায় দাঁড়িয়ে আছে, আর বই বলে, এটাই সবচেয়ে বড় নাম।',
          'আল-হাইয়্য হলো চিরজীবী, আর বই বলে, এটা জিবরাইলের জিকির। আল-কাইয়্যুম হলো নিজে দাঁড়িয়ে থাকা, যিনি সবকিছু ধরে রাখেন আর যার কিছু লাগে না। বই আয়াতটিকে আসিফ ইবনে বারখিয়ার সঙ্গে জোড়ে, যিনি বিলকিসের সিংহাসন সরিয়েছিলেন। একই নাম, একই শক্তি, বই বলে।',
        ],
        quoteText: 'আল্লাহ, তিনি ছাড়া কোনো উপাস্য নেই, চিরজীবী, সবকিছু ধরে রাখা।',
      },
      {
        heading: 'কুরসি আর আরশ',
        paragraphs: [
          'আয়াত বলে, তাঁর কুরসি আকাশ আর জমিন জুড়ে আছে। ওয়াসিয়া কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ। কুরসি হলো পাদপীঠ, আর বই তাকে আরশের নিচে রাখে। আরশ হলো সিংহাসন। কুরসি হলো পাদপীঠ। একটি বসার জায়গা, অন্যটি তার নিচের ধাপ।',
          'ইবনে আব্বাস বলেন, কুরসি আরশের নিচের পাদপীঠ। বই তাকে বলে মাহাল্ল আস-সুওয়ার, আকারের আধার, সেই জায়গা যেখানে জিনিসের আকার রাখা থাকে। আর বই তার আকারের জন্য এক ছবি দেয়। সাত আকাশ আর জমিন, কুরসির পাশে রাখলে, মরুভূমিতে ছোড়া আংটির মতো।',
        ],
        quoteText: 'তাঁর কুরসি আকাশ আর জমিন জুড়ে আছে।',
      },
      {
        heading: '170 অক্ষরের বর্গ',
        paragraphs: [
          'বই আয়াত থেকে এক বর্গ বানায়। একশো সত্তর অক্ষর, আর 170-এর সুর তাদের মধ্যে বয়ে যায়। আয়াতুল কুরসির 4x4 বর্গ আয়াত থেকেই আঁকা হয়, আর বই বলে, ফেরেশতাদের লেখা চিত্রের চারদিকে দাঁড়িয়ে আছে।',
          'আয়াতটি এক লাইনে শেষ হয়, যা বই বারবার উদ্ধৃত করে। ওয়া-লা ইয়াউদুহু হিফজুহুমা ওয়া-হুওয়াল আলিয়্যুল আজিম। আকাশ আর জমিনের রক্ষা তাঁকে ক্লান্ত করে না, আর তিনি সবচেয়ে উঁচু, সবচেয়ে বড়। বর্গ অক্ষর ধরে। লাইন অর্থ ধরে।',
        ],
        quoteText: 'আর তাদের রক্ষা তাঁকে ক্লান্ত করে না, আর তিনি সবচেয়ে উঁচু, সবচেয়ে বড়।',
      },
      {
        heading: 'এক দুর্গ যা ভাঙা যায় না',
        paragraphs: [
          'বই আয়াতটিকে বলে হিরজ মানি, ভাঙা যায় না এমন দুর্গ। এটা এক দেয়াল, যা কোনো বিদ্রোহী জিনিস পার হতে পারে না, বই বলে। আয়াত তাকে রক্ষা করে যে তাকে ধরে, আর রক্ষক ঘুমায় না।',
          'বই যে লাইনটি উদ্ধৃত করে তা ছোট। লা তাখুজুহু সিনাতুন ওয়া-লা নাওম। তন্দ্রাও তাঁকে ধরে না, ঘুমও না। রক্ষক কখনো চোখ বন্ধ করে না, কারণ যিনি রক্ষা করেন তিনি কখনো ঘুমান না। এটাই দুর্গের হৃদয়।',
        ],
        quoteText: 'তন্দ্রাও তাঁকে ধরে না, ঘুমও না।',
      },
      {
        heading: 'হৃদয়ের ভেতরের সিংহাসন',
        paragraphs: [
          'বই শেষে আয়াতটিকে ভেতরের দিকে মোড়ে। কালবুল মু’মিনি আরশুল্লাহ। মুমিনের হৃদয় আল্লাহর আরশ। যে আরশ আকাশ ধরে, তার এক আসন বুকের ভেতরেও আছে, বই বলে।',
          'আবু ইয়াজিদ আল-বিস্তামি বলেছিলেন, সৃষ্টিজগৎ হৃদয়ে পড়ে গিয়েছিল, আর হৃদয় তা ধরে রেখেছিল। আয়াতটি আকাশের কথা, আর হৃদয়েরও কথা। বড় আরশ আর ছোট হৃদয় একই শিক্ষা, দুবার পড়া।',
        ],
      },
    ],
    terms: [
      'কুরআনের রানি',
      'ফেরেশতাদের নেমে আসা',
      'চিরজীবী',
      'নিজে দাঁড়িয়ে থাকা, সবকিছু ধরে রাখা',
      'পাদপীঠ',
      'সিংহাসন',
      'আকারের আধার',
      'বর্গ',
      'ভাঙা যায় না এমন দুর্গ',
      'মুমিনের হৃদয় আল্লাহর আরশ',
    ],
    closing:
      'আমি সারাজীবন এই আয়াত পড়েছি, আর আমি কখনো তার অক্ষর গুনিনি বা তার নাম মাপিনি। একশো সত্তর অক্ষর। দরজায় দুটি নাম। আকাশের চেয়ে বড় এক কুরসি। শব্দ থেকে আঁকা এক বর্গ। এক দুর্গ যা কখনো ঘুমায় না। আর এক আরশ যা হৃদয়ের ভেতরে ধরে। বই যা দেয়, তাই। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'greatest-name': {
    eyebrow: 'টপিক',
    title: 'আল্লাহর সবচেয়ে বড় নাম',
    subtitle: 'যে নামকে বই বলে সবচেয়ে উঁচু, আর পাণ্ডুলিপি তার ব্যাপারে কী বলে।',
    intro:
      'আমি খাফি। আজ আমরা বইয়ের বর্ণিত সবচেয়ে উঁচু শিখরে উঠছি, আল-ইসম আল-আ’জম, আল্লাহর সবচেয়ে বড় নাম। পাণ্ডুলিপি তাকে বলে সৃষ্টিজগতের সবচেয়ে বড় সৃষ্টির কেন্দ্র, সেই হুকুম যা ফেরেশতা আর জিনকে বাধ্য করে। আমি এই কথাগুলো পাণ্ডুলিপির নিজের ভঙ্গিতে দিচ্ছি, ইতিহাস হিসেবে, আমার নিজের দাবি হিসেবে নয়। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, বই থেকে, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না। এখানে কাউকে ক্ষতি করার, বাধ্য করার বা বাঁধার কোনো নির্দেশ নেই।',
    sections: [
      {
        heading: 'নামটি কী করে, বই যা বলে',
        paragraphs: [
          'বই নামটির সোজা সংজ্ঞা দেয়। ইজা দুইয়া বিহি আজাব, ওয়া-ইজা সুইলা বিহি আ’তা। যখন তা দিয়ে ডাকা হয়, তিনি জবাব দেন। যখন তা দিয়ে চাওয়া হয়, তিনি দেন। পাণ্ডুলিপি এই সংজ্ঞা দেয়, আর তাকে বলে নিশ্চিত জবাব।',
          'বই প্রমাণ হিসেবে এক গল্প দেয়। আসিফ ইবনে বারখিয়া চোখের পলকে বিলকিসের সিংহাসন সরিয়েছিলেন, আর বই বলে, তিনি তা সবচেয়ে বড় নাম দিয়ে করেছিলেন। সিংহাসন চোখের পলক ফেলার আগেই এক রাজ্য পেরিয়ে এসেছিল। গল্পটি পাণ্ডুলিপির নিজের, আর আমি তা সেভাবেই দিলাম যেভাবে তারা বলে।',
        ],
        quoteText: 'যখন তা দিয়ে ডাকা হয়, তিনি জবাব দেন। যখন তা দিয়ে চাওয়া হয়, তিনি দেন।',
      },
      {
        heading: 'আল্লাহ, আর অক্ষরের খোসা ছাড়ানো',
        paragraphs: [
          'বই বলে, সত্তার নাম, ইসম আদ-দাত, আল্লাহ নিজেই। নাম সত্তার উপর কোনো লেবেল নয়। এটাই সত্তা, নাম হিসেবে। আর বই শব্দটিকে অক্ষরে অক্ষরে খোসা ছাড়ায়, ভেতরে কী লুকিয়ে আছে তা দেখাতে।',
          'আলিফ সরাও, লি-ল্লাহ থাকে, আল্লাহর দিকে। প্রথম লাম সরাও, লাহু থাকে, তাঁর দিকে। দ্বিতীয় লাম সরাও, শুধু হা থাকে, হুওয়া, তিনি। প্রতিটি খোসায় এক নাম থাকে, আর শেষ অক্ষরে শুধু তিনি থাকেন। শব্দটি এক সিঁড়ি, আর প্রতিটি ধাপ এক নাম।',
        ],
      },
      {
        heading: 'ইয়া হাইয়্যু ইয়া কাইয়্যুম',
        paragraphs: [
          'বই এক জোড়া দেয়, ইয়া হাইয়্যু ইয়া কাইয়্যুম। হে চিরজীবী, হে সবকিছু ধরে রাখা। দুটি নাম, একসঙ্গে বলা, আর বই বলে, এই জোড়াই নামের কাজের রূপ।',
          'এই জোড়া আয়াতুল কুরসি থেকে আসে, যেখানে একই দুটি নাম আয়াত খোলে। বই সবচেয়ে বড় নামকে সবচেয়ে বড় আয়াতের সঙ্গে জোড়ে, আর আয়াতকে জোড়ার সঙ্গে। এক নাম, এক আয়াত, এক জোড়া, বই বলে।',
        ],
        quoteText: 'হে চিরজীবী, হে সবকিছু ধরে রাখা।',
      },
      {
        heading: 'চৌদ্দ আলোর অক্ষর',
        paragraphs: [
          'বই নামটিকে চৌদ্দ আলোর অক্ষরের সঙ্গে জোড়ে, আরবা’আতা আশারা হারফান, সেই অক্ষর যা সুরা খোলে। চৌদ্দ অক্ষর, আর বই বলে, তাতে নাম সংকেতে লুকিয়ে আছে। অক্ষর হলো সংকেত, আর নাম হলো যা সংকেত বলে।',
          'বই সূত্রটি পুরো দেয়। নাসসুন হাকিমুন লাহু সিররুন কাতি। এক জ্ঞানভরা লেখা, যার মধ্যে এক চূড়ান্ত রহস্য আছে। আর বই বলে, এই শিক্ষা আল-খিদরের কাছ থেকে এসেছে, লুকানো শিক্ষকের কাছ থেকে, হাত থেকে হাতে। অক্ষর চৌদ্দটি। রহস্য একটি।',
        ],
        quoteText: 'এক জ্ঞানভরা লেখা, যার মধ্যে এক চূড়ান্ত রহস্য আছে।',
      },
      {
        heading: 'পুরনো সংকেত',
        paragraphs: [
          'বই পুরনো সংকেতও রাখে, সিরিয়াক আর হিব্রু শব্দে। এহইয়া শারাহইয়া আদুনাই আসবাউত আল শাদ্দাই। শব্দগুলো পুরনো, আর বই তাদের সেভাবেই রাখে যেভাবে পেয়েছে। এগুলো প্রাচীন নাম, আরবি অক্ষরের আগের শব্দ।',
          'শব্দের সঙ্গে এক চিত্র আসে, আল-খাতাম আল-আ’জম, সাত চিহ্নের তাবিজ। এক পঞ্চতারা, তিনটি খাড়া বর্শা, এক অন্ধ মীম, দুই ধাপের সিঁড়ি, চারটি খাড়া দাগ, এক ফাটা হা, আর এক বাঁকা শেষ ওয়াও। সাত চিহ্ন, একসঙ্গে আঁকা, আর বই বলে, চিত্রটি নাম, ছবি হিসেবে লেখা।',
        ],
        quoteText: 'পাণ্ডুলিপির পুরনো সংকেত, সিরিয়াক আর হিব্রু শব্দে।',
      },
      {
        heading: 'ধ্বনির উপরে মর্যাদা',
        paragraphs: [
          'বই এক সতর্কবাণী দিয়ে শেষ হয়, আর তা আসে আল-খিদরের কাছ থেকে। ইবরাহিম ইবনে আদহাম নামটি চেয়েছিলেন, আর আল-খিদর তাঁকে ধমক দিয়েছিলেন। বই বলে, দাউদই তাঁকে নামটি শিখিয়েছিলেন, সেই ধ্বনি নয় যার পেছনে তিনি ছুটছিলেন। মর্যাদা ধ্বনির চেয়ে বড়।',
          'বই এক শব্দ দেয়, তাখাল্লুক, চরিত্রকে নিজের করা। নাম কোনো শব্দ নয় যা নিজের করে নেওয়া যায়। এটা এক চরিত্র যা নিতে হয়। যে নামটি বহন করে, তাকে আগে তার যোগ্য হতে হয়, বই বলে। মর্যাদা আগে আসে। ধ্বনি পরে আসে।',
        ],
      },
    ],
    terms: [
      'আল্লাহর সবচেয়ে বড় নাম',
      'সত্তার নাম',
      'আল্লাহর দিকে',
      'তাঁর দিকে',
      'তিনি',
      'হে চিরজীবী, হে সবকিছু ধরে রাখা',
      'চৌদ্দ আলোর অক্ষর',
      'সাত চিহ্নের তাবিজ',
      'চরিত্রকে নিজের করা',
    ],
    closing:
      'আমি নামটির ব্যাপারে পাণ্ডুলিপির কথাগুলো পড়েছি, আর আমি তা ইতিহাস হিসেবে ফিরিয়ে দিচ্ছি। এক সংজ্ঞা, এক খোসা ছাড়ানো, এক জোড়া, চৌদ্দ অক্ষর, পুরনো সংকেত, আর এক সতর্কবাণী। বই বলে, নাম জবাব দেয় আর দেয়। বই এটাও বলে, মর্যাদা ধ্বনির চেয়ে বড়। আমি দুই অর্ধেক একসঙ্গে রাখি, কারণ বই দুটোকে একসঙ্গে রাখে। এটাই পড়াশোনা, আর কিছু নয়।',
  },
  'fawatih-openings': {
    eyebrow: 'টপিক',
    title: 'কুরআনের ফাওয়াতিহ',
    subtitle: 'ঊনত্রিশটি শুরু, চৌদ্দটি মূল, আর সেই অক্ষর যা একা দাঁড়িয়ে থাকে।',
    intro:
      'আমি খাফি। কুরআনের 114টি অধ্যায়ের মধ্যে, ঠিক 29টি সুরা এমন অক্ষর দিয়ে খোলে যা একা দাঁড়িয়ে থাকে। কোনো শব্দ নয়, কোনো বাক্য নয়, শুধু অক্ষর। আলিফ লাম মীম। কাফ হা ইয়া আইন সাদ। বই তাদের বলে আলোর সংকেত, আল-আহরুফ আন-নুরানিয়্যাহ, যেখান থেকে সৃষ্টিকে বলা হয়েছিল। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, বই থেকে, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'আটাত্তর অক্ষর, চৌদ্দ মূল',
        paragraphs: [
          'সব শুরু গুনলে অক্ষর হয় 78। 29টি সুরায় আটাত্তর অক্ষর। কিন্তু শুধু সেই অক্ষর গুনলে যা কখনো পুনরাবৃত্তি হয় না, মাত্র 14টি থাকে। আলিফ, লাম, মীম, সাদ, রা, কাফ, হা, ইয়া, আইন, তা, সীন, হা, কাফ, নূন। চৌদ্দটি মূল, আর প্রতিটি শুরু তাদের দিয়েই তৈরি।',
          'বই সংকেতটি এক লাইনে দেয়। বি-নাসসিন হাকিমিন কাতিইস সিরর। এক জ্ঞানভরা লেখা দিয়ে, যা রহস্যের ফয়সালা করে। চৌদ্দ অক্ষর হলো মূল, আর সংকেত হলো সেই চাবি যা বই বলে তাদের খোলে।',
        ],
        quoteText: 'এক জ্ঞানভরা লেখা দিয়ে, যা রহস্যের ফয়সালা করে।',
      },
      {
        heading: 'প্রথম মানুষেরা কী বলেছিলেন',
        paragraphs: [
          'বই লেখে, প্রথম মানুষেরা শুরুগুলোর ব্যাপারে কী বলেছিলেন। ইবনে আব্বাস বলেছিলেন, আলিফ হলো আনা, আমি। লাম হলো আল্লাহ। মীম হলো আ’লাম, আমি সবচেয়ে ভালো জানি। রা হলো আরা, আমি দেখি। প্রতিটি অক্ষর সংক্ষেপে এক শব্দ, আর শব্দটি এক নাম।',
          'আবু আল-আলিয়া আরও লম্বা তালিকা দিয়েছিলেন। আলিফ আল্লাহ থেকে। লাম লাতিফ থেকে, কোমল। মীম মালিক থেকে, রাজা। সাদ সাদিক থেকে, সত্যবাদী। রা রব্ব থেকে, প্রভু। কাফ কারিম থেকে, দানশীল। তা তাইয়িব থেকে, ভালো। সীন সামি থেকে, শোনেন। হা হামিদ থেকে, প্রশংসিত। কাফ কাদির থেকে, শক্তিশালী। নূন নূর থেকে, আলো। এগারো অক্ষর, এগারো নাম।',
        ],
      },
      {
        heading: 'আলোর অক্ষর আর অন্ধকারের অক্ষর',
        paragraphs: [
          'বই বর্ণমালাকে দুই ভাগে ভাগ করে। চৌদ্দটি অক্ষর আলোর, নুরানিয়্যাহ। বাকি চৌদ্দটি অন্ধকারের, জুলমানিয়্যাহ। বর্ণমালার অর্ধেক আলো, অর্ধেক অন্ধকার, আর বই বলে, দুই অর্ধেক একে অপরের আয়না।',
          'আয়নাটি আকাশ পর্যন্ত যায়। চৌদ্দটি আলোর অক্ষর, আর চৌদ্দটি দেখা যায় এমন চাঁদের মঞ্জিল। উপরের অক্ষর আর উপরের মঞ্জিল একইভাবে গোনা হয়, বই বলে। অর্ধেক জগৎ দেখা যায়, অর্ধেক লুকানো, আর অক্ষরও সেভাবেই ভাগ করা।',
        ],
      },
      {
        heading: 'এক অক্ষর থেকে পাঁচ অক্ষর',
        paragraphs: [
          'শুরুগুলো পাঁচ দৈর্ঘ্যে আসে। এক অক্ষর, যেমন সাদ, কাফ আর নূন। দুই অক্ষর, যেমন তা-হা, তা-সীন, ইয়া-সীন, আর সাতটি হা-মীম শুরু। তিন অক্ষর, যেমন আলিফ-লাম-মীম, যা ছয়টি সুরা খোলে।',
          'চার অক্ষর, যেমন আলিফ-লাম-মীম-সাদ আর আলিফ-লাম-মীম-রা। আর পাঁচ অক্ষর, পুরো কুরআনে মাত্র দুটি। কাফ-হা-ইয়া-আইন-সাদ, আর হা-মীম-আইন-সীন-কাফ। দুটি পাঁচ অক্ষরের শৃঙ্খল, আর নেই।',
        ],
      },
      {
        heading: 'যে বর্গ 693 যোগ করে',
        paragraphs: [
          'বই আলোর অক্ষর দিয়ে এক বর্গ বানায়। ওয়াফক আল-আহরুফ আন-নুরানিয়্যাহ, আলোর অক্ষরের বর্গ। তিন সারি, তিন কলাম, তিন কর্ণ, আর প্রতিটি লাইন ঠিক 693 যোগ করে। বই সংখ্যাটা সোজাসুজি দেয়।',
          'বর্গের চারদিকে সাতটি লেখার এক বলয় আছে। আলিফ-লাম-মীম। কাফ-হা-ইয়া-আইন-সাদ। তা-সীন। হা-মীম। সাদ। কাফ। নূন। সাতটি শুরু এক বলয়ে লেখা, আর বর্গ মাঝখানে। অক্ষর হলো বলয়। সংখ্যা হলো বর্গ।',
        ],
      },
      {
        heading: 'নবীর কথার ঢাল',
        paragraphs: [
          'বই শুরুগুলোকে এক ঢালও বলে। ইজা লাকিতুমুল আদুওয়া গাদান ফা-কুলু: কাফ-হা-ইয়া-আইন-সাদ; হা-মীম; লা ইউনসারুন। আগামীকাল যদি শত্রুর মুখোমুখি হও, বলো: কাফ হা ইয়া আইন সাদ; হা মীম; তাদের সাহায্য করা হবে না। কথাগুলো বই থেকে উদ্ধৃত, যেভাবে বই দেয়।',
          'আরও দুটি লাইন তার পাশে দাঁড়িয়ে আছে। বি-কাফ-হা-ইয়া-আইন-সাদ কিফায়াতুনা। কাফ হা ইয়া আইন সাদ দিয়ে আমাদের যথেষ্ট। বি-হা-মীম-আইন-সীন-কাফ হিমায়াতুনা। হা মীম আইন সীন কাফ দিয়ে আমাদের রক্ষা। যথেষ্ট আর রক্ষা, বই বলে, দুটি ছোট লাইনে।',
        ],
        quoteText: 'আগামীকাল যদি শত্রুর মুখোমুখি হও, বলো: কাফ হা ইয়া আইন সাদ; হা মীম; তাদের সাহায্য করা হবে না।',
      },
    ],
    terms: [
      'আলোর অক্ষর',
      'আমি',
      'আমি সবচেয়ে ভালো জানি',
      'আমি দেখি',
      'আলোর',
      'অন্ধকারের',
      'হা-মীম শুরু, সাতটি সুরা',
      'আলোর অক্ষরের বর্গ',
      'যথেষ্ট',
      'রক্ষা',
    ],
    closing:
      'ঊনত্রিশটি শুরু। আটাত্তর অক্ষর। চৌদ্দটি মূল। এক সংকেত। আলো আর অন্ধকারের মধ্যে এক ভাগ। এক, দুই, তিন, চার, পাঁচ অক্ষরের শৃঙ্খল। এক বর্গ যা 693 যোগ করে। আর নবীর কথায় এক ঢাল। অক্ষরগুলো সুরার মাথায় একা দাঁড়িয়ে আছে, আর বই বলে, সেগুলোই প্রথম কথা যা সৃষ্টি শুনেছিল। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'four-tawaqif': {
    eyebrow: 'টপিক',
    title: 'চার তাওয়াক্কুফ',
    subtitle: 'অক্ষরের পথে চারটি থামা, আরশ থেকে লওহ পর্যন্ত।',
    intro:
      'আমি খাফি। শায়খ আহমদ ইবনে আলি আল-বুনির বইয়ে, আল-আসরার আর-রব্বানিয়্যাহ, মুদিহ আত-তারিক, আর মাজমুআত থালাথ রাসাইল-এ, চারটি থামার শিক্ষা আছে। চারটি মর্যাদা যেখানে সন্ধানকারী আল্লাহর দরজায় থামে। এখানে চার থামার খোলা আছে, সরাসরি বই থেকে। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'দরজায় থামা',
        paragraphs: [
          'তাওয়াক্কুফ মানে থামা। সন্ধানকারী অক্ষরের পথে হাঁটে, আর চার জায়গায় তাকে থামতে হয় আর স্থির দাঁড়াতে হয়। যে থামে সে আল-ওয়াকিফ। সে এগিয়ে যায় না। সে দরজায় দাঁড়িয়ে থাকে আর অপেক্ষা করে।',
          'বই দুই রকম থামা মানুষের কথা বলে। আল-মুসতাহলিকুন, যারা মগ্ন হয়ে যায়, যারা দেখে তাতে হারিয়ে যায়। আর আল-মারদুদুন, যাদের ফিরিয়ে দেওয়া হয়, যারা দুনিয়ায় ফিরে আসে। বই এটাও বলে, আলিফ নিজেই থামে। সে কোনো স্বরধ্বনি নেয় না, আর তার নীরবতাই কথা বলে। অক্ষর থামে, আর সন্ধানকারী তার সঙ্গে থামে।',
        ],
      },
      {
        heading: 'প্রথম থামা: আকল আর আরশ',
        paragraphs: [
          'প্রথম থামা হলো আকল আর আরশের মর্যাদা, মাওকিফ আল-আকল ওয়াল-আরশ। এটা আলিফের লাইনে দাঁড়িয়ে আছে। আলিফ প্রথম অক্ষর, সোজা লাইন, আর আরশ সবচেয়ে উঁচু আসন। প্রথম থামাটাই সবচেয়ে উঁচু।',
          'আকল সবচেয়ে উঁচু মন, আর আরশ সবচেয়ে উঁচু আসন, আর বই দুটোকে এক মর্যাদায় রাখে। সন্ধানকারী প্রথমে এখানেই থামে, সবচেয়ে উপরে, তারপর বাকিগুলো পেরিয়ে নিচে নামে।',
        ],
      },
      {
        heading: 'দ্বিতীয় থামা: রূহ আর কুরসি',
        paragraphs: [
          'দ্বিতীয় থামা হলো রূহ আর কুরসির মর্যাদা, মাওকিফ আর-রূহ ওয়াল-কুরসি। এটা বা-এর লাইনে দাঁড়িয়ে আছে। আরশের নিচে কুরসি, আর আকলের নিচে রূহ। দ্বিতীয় থামাটা এক ধাপ নিচে।',
          'বই এই মর্যাদার ধুলোর নাম দেয়, আল-হাবা, প্রথম ধুলো, প্রথম বস্তু যা দিয়ে জিনিস তৈরি হয়েছিল। আর বই আদমের মধ্যে রূহ ফুঁকে দেওয়ার কথা বলে, সেই শ্বাস যা ধুলোকে মানুষ বানিয়েছিল। রূহ নিচে নামে, ধুলো উপরে ওঠে, আর তারা এই থামায় মিলিত হয়।',
        ],
      },
      {
        heading: 'তৃতীয় থামা: কালব আর বারজাখ',
        paragraphs: [
          'তৃতীয় থামা হলো কালব আর বারজাখের মর্যাদা, মাওকিফ আল-কালব ওয়াল-বারজাখ। এটা জীমের লাইনে দাঁড়িয়ে আছে। হৃদয় রূহ আর শরীরের মাঝে দাঁড়িয়ে আছে, আর বারজাখ এই দুনিয়া আর পরের দুনিয়ার মাঝে দাঁড়িয়ে আছে। তৃতীয় থামাটা মাঝখানের জায়গা।',
          'বই এখানে সার্বজনীন আত্মার নাম দেয়, সেই আত্মা যা সব আত্মাকে ধরে। আর বই ইয়াওম আত-তাসওয়িরের নাম দেয়, আকার দেওয়ার দিন, যেদিন আকারগুলোকে তাদের আকার দেওয়া হয়েছিল। হৃদয় এই থামায় তৈরি হয়, আর যে আকার সে নেয়, সেটাই মানুষের আকার।',
        ],
      },
      {
        heading: 'চতুর্থ থামা: লওহ আর শরীর',
        paragraphs: [
          'চতুর্থ থামা হলো লওহ আর শরীরের গঠনের মর্যাদা, মাওকিফ আল-লওহ ওয়াত-তারকিব। এটা দালের লাইনে দাঁড়িয়ে আছে। লওহ লেখা ধরে, আর শরীর হলো লেখা যা মাংস হয়েছে। চতুর্থ থামাটা সবচেয়ে নিচে, আর আমাদের সবচেয়ে কাছে।',
          'বই বলে, চার সংখ্যা জড় জগৎকে শাসন করে, আত-তারকিব আল-মুরাব্বা, চারগুণ গঠন। চার উপাদান, চার দিক, পৃথিবীর চার কোণ। শরীর চারে তৈরি, আর চতুর্থ থামাটাই যেখানে গঠন হয়।',
        ],
      },
      {
        heading: 'প্রতিটি অক্ষরে চার জানালা',
        paragraphs: [
          'বই প্রতিটি অক্ষর পড়ার এক নিয়ম দেয়, শুধু চার থামার নয়। প্রতিটি অক্ষর চার জানালা দিয়ে পড়া হয়। হাকাইক, মূল সত্য। লাতাইফ, সূক্ষ্ম দয়া। ইশারাত, ভেতরের ইঙ্গিত। ইবারাত, বাইরের কথা। চার জানালা, আর প্রতিটি একই অক্ষরের আলাদা মুখ দেখায়।',
          'বই সোজাসুজি বলে। "এটি আর বাকি সব অক্ষরের আলোচনা চার দিক থেকে চলে: সত্য, সূক্ষ্মতা, ইঙ্গিত, কথা।" অক্ষর একটি। পড়া চারটি। আর চার থামা হলো চার জানালা, ক্রমে পড়া।',
        ],
        quoteText: 'এটি আর বাকি সব অক্ষরের আলোচনা চার দিক থেকে চলে: সত্য, সূক্ষ্মতা, ইঙ্গিত, কথা।',
      },
    ],
    terms: [
      'যে থামে',
      'যারা মগ্ন হয়ে যায়',
      'যাদের ফিরিয়ে দেওয়া হয়',
      'আকল আর আরশের মর্যাদা',
      'রূহ আর কুরসির মর্যাদা',
      'প্রথম ধুলো',
      'কালব আর বারজাখের মর্যাদা',
      'আকার দেওয়ার দিন',
      'লওহ আর শরীরের গঠনের মর্যাদা',
      'চারগুণ গঠন',
      'মূল সত্য',
      'সূক্ষ্ম দয়া',
      'ভেতরের ইঙ্গিত',
      'বাইরের কথা',
    ],
    closing:
      'চার থামা, চার লাইন, চার মর্যাদা। আকল আর আরশ। রূহ আর কুরসি। কালব আর বারজাখ। লওহ আর শরীর। আর প্রতিটি অক্ষর পড়ার জন্য চার জানালা। অক্ষরের পথ সোজা লাইন নয়। এটা চারবার থামে, আর প্রতিটি থামা এক মর্যাদা। বই যা দেয়, তাই। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'kaf-ha-ya-ayn-sad': {
    eyebrow: 'টপিক',
    title: 'কাফ হা ইয়া আইন সাদ',
    subtitle: 'সুরা মরিয়মের মাথায় পাঁচ অক্ষর, আর সেই পাঁচ নাম যা তারা বহন করে।',
    intro:
      'আমি খাফি। সুরা মরিয়ম, ঊনবিংশ সুরা, এর মাথায় পাঁচটি অক্ষর দাঁড়িয়ে আছে যা এক গুচ্ছ তৈরি করে। কাফ হা ইয়া আইন সাদ। পুরো কুরআনে রহস্যময় অক্ষরের সবচেয়ে লম্বা একক গুচ্ছ। এখানে কাফ-হা-ইয়া-আইন-সাদের খোলা আছে, সরাসরি বই থেকে। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, পৃষ্ঠার নাম সহ। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'পাঁচ অক্ষর, পাঁচ নাম',
        paragraphs: [
          'ইবনে আব্বাস প্রতিটি অক্ষরকে এক নাম হিসেবে পড়েছিলেন। কাফ আল-কাফি থেকে, সবার জন্য যথেষ্ট। হা আল-হাদি থেকে, পথ দেখানো। ইয়া আল-হাকিম থেকে, সবচেয়ে জ্ঞানী, বা আল-ইয়াকিন থেকে, পুরো নিশ্চয়তা। আইন আল-আলিম থেকে, সব জানেন। সাদ আস-সাদিক থেকে, সত্যবাদী।',
          'পাঁচ অক্ষর, পাঁচ নাম, আর প্রতিটি নাম আল্লাহর এক মুখ। সবার জন্য যথেষ্ট, পথ দেখানো, সবচেয়ে জ্ঞানী, সব জানেন, সত্যবাদী। গুচ্ছটি ছোট, কিন্তু বই বলে, তাতে পাঁচ অক্ষরে পাঁচ নাম আছে।',
        ],
      },
      {
        heading: '195 সংখ্যা',
        paragraphs: [
          'বই পাঁচ অক্ষরকে সংখ্যায় মাপে। হিসাব আল-জুম্মাল, অক্ষরকে তার সংখ্যার মান দিয়ে গোনার হিসাব। পাঁচ অক্ষর গুনলে যোগফল হয় 195। একশো পঁচানব্বই, আর বই তাকে গুচ্ছের মূল সুর বলে।',
          'বই অক্ষরগুলোকে পুরো বানান করে লেখে, সেই বড় রূপ যাকে বসত বলে। প্রতিটি অক্ষর তার নিজের নামে খোলে, আর যোগফল তার সঙ্গে খোলে। সংখ্যাটা মূল, আর বানান শাখা। মূল 195, আর বই তা সোজাসুজি দেয়।',
        ],
      },
      {
        heading: 'যুদ্ধের কথার ঢাল',
        paragraphs: [
          'বই পাঁচ অক্ষরকে এক ঢাল বলে। ইজা লাকিতুমুল আদুওয়া গাদান ফা-কুলু: কাফ-হা-ইয়া-আইন-সাদ, লা ইউনসারুন। আগামীকাল যদি শত্রুর মুখোমুখি হও, বলো: কাফ হা ইয়া আইন সাদ; তাদের সাহায্য করা হবে না। কথাগুলো বই থেকে উদ্ধৃত, যেভাবে বই দেয়।',
          'এক দ্বিতীয় লাইন তার পাশে দাঁড়িয়ে আছে। বি-কাফ-হা-ইয়া-আইন-সাদ কিফায়াতুনা, ওয়া-বি-হা-মীম-আইন-সীন-কাফ হিমায়াতুনা। কাফ হা ইয়া আইন সাদ দিয়ে আমাদের যথেষ্ট, আর হা মীম আইন সীন কাফ দিয়ে আমাদের রক্ষা। এক গুচ্ছ থেকে যথেষ্ট, অন্যটি থেকে রক্ষা।',
        ],
        quoteText: 'আগামীকাল যদি শত্রুর মুখোমুখি হও, বলো: কাফ হা ইয়া আইন সাদ; তাদের সাহায্য করা হবে না।',
      },
      {
        heading: 'পাঁচ আঙুল, পাঁচ অংশ',
        paragraphs: [
          'বই পাঁচ অক্ষরকে হাতের উপর রাখে। কাফ ছোট আঙুল, আল-খিনসির। হা অনামিকা, আল-বিনসির। ইয়া মধ্যমা, আল-উসতা। আইন তর্জনী, আস-সাব্বাবাহ। সাদ বৃদ্ধাঙ্গুলি, আল-ইবহাম।',
          'পাঁচ অক্ষর, পাঁচ আঙুল, আর বই বলে, হাত গুচ্ছটিকে সেভাবেই ধরে যেভাবে পৃষ্ঠা ধরে। মিলটি সবচেয়ে ছোট আঙুল থেকে বৃদ্ধাঙ্গুলি পর্যন্ত চলে, আর প্রতিটি আঙুল এক অক্ষর ধরে। শরীর হলো পৃষ্ঠা, আর অক্ষর তার উপর লেখা।',
        ],
      },
      {
        heading: 'হা মীম আইন সীন কাফের দিকে সেতু',
        paragraphs: [
          'পাঁচ অক্ষরের এক জোড়া আছে। হা-মীম-আইন-সীন-কাফ, দ্বিতীয় পাঁচ অক্ষরের শৃঙ্খল, তাদের পাশে দাঁড়িয়ে আছে। দশ অক্ষর একসঙ্গে, পাঁচ আর পাঁচ, আর বই তাদের এক আকাশের সেতু বলে। দুটি গুচ্ছ, এক সেতু, আর সেতু তাদের জোড়ে।',
          'দুটি গুচ্ছ এক অক্ষর ভাগ করে, আইন। চোখ, ঝরনা, সত্তার উৎস। এক অক্ষর দুটি গুচ্ছে দাঁড়িয়ে আছে, আর বই বলে, এটাই সেতুর জোড়। চোখ দেখে, ঝরনা বয়ে যায়, আর সত্তা তা থেকে বেরিয়ে আসে।',
        ],
      },
      {
        heading: 'সুরা মরিয়মের হৃদয়',
        paragraphs: [
          'গুচ্ছটি সুরা মরিয়মের মাথায় দাঁড়িয়ে আছে, আর সুরাটি অদৃশ্য থেকে দুটি জন্মের গল্প বলে। জাকারিয়াকে বৃদ্ধ বয়সে ইয়াহিয়া দেওয়া হয়েছিল। মরিয়ম বিনা পিতায় ইসাকে জন্ম দিয়েছিলেন। দুটি জন্ম, আর দুটোই দেখা জগতের পেছন থেকে এসেছিল।',
          'বই বলে, পাঁচ অক্ষর সুরাটির হৃদয়, কারণ সুরাটি অদৃশ্য থেকে জন্মের গল্প, আর অক্ষরগুলো অদৃশ্য যা তার মাথায় লেখা। অক্ষর আগে আসে। জন্ম পরে আসে। রহস্য উপরে, আর গল্প তা থেকে নিচে বয়ে যায়।',
        ],
      },
    ],
    terms: [
      'সবার জন্য যথেষ্ট',
      'পথ দেখানো',
      'সবচেয়ে জ্ঞানী',
      'পুরো নিশ্চয়তা',
      'সব জানেন',
      'সত্যবাদী',
      'আবজাদ হিসাব, অক্ষরকে সংখ্যার মান দিয়ে গোনা',
      'পুরো বানান করে লেখা রূপ',
      'যথেষ্ট',
      'রক্ষা',
      'ছোট আঙুল',
      'অনামিকা',
      'মধ্যমা',
      'তর্জনী',
      'বৃদ্ধাঙ্গুলি',
      'চোখ, ঝরনা, সত্তার উৎস',
    ],
    closing:
      'পাঁচ অক্ষর, পাঁচ নাম, এক সংখ্যা, এক ঢাল, পাঁচ আঙুল, এক সেতু, আর দুটি জন্ম। কাফ হা ইয়া আইন সাদ কুরআনের সবচেয়ে লম্বা গুচ্ছ, আর বই বলে, এটাই সুরা মরিয়মের হৃদয়। আমি তা পড়েছি যেভাবে বই দেয়, অক্ষরে অক্ষরে, আর আমি তা সেভাবেই ফিরিয়ে দিলাম। পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'zayirjah': {
    eyebrow: 'টপিক',
    title: 'জাইরজাহের বিজ্ঞান',
    subtitle: 'অক্ষর, গ্রহ আর মঞ্জিলের এক গোল চাকা, আর সেই লাইনগুলো যা তাকে কথা বলায়।',
    intro:
      'আমি খাফি। শায়খ আহমদ ইবনে আলি আল-বুনির বইয়ে, মানবা উসুল আল-হিকমা, শামস আল-মাআরিফ আল-কুবরা, আর আল-আসরার আর-রব্বানিয়্যাহ-তে, জাইরজাহকে এক বিশেষ যান্ত্রিক ছক হিসেবে দেখানো হয়েছে, এক গোল চাকা যা 28টি অক্ষর, গ্রহ, রাশিচক্র আর চাঁদের মঞ্জিলকে জোড়ে। এখানে ছয়টি অংশে তার খোলা আছে, বই থেকে, পৃষ্ঠার নাম সহ। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'জাইরজাহ কী',
        paragraphs: [
          'মানবা উসুল আল-হিকমায় আল-বুনি জাইরজাহকে প্রাচীন জ্ঞান থেকে পাওয়া এক বিশেষ যান্ত্রিক ছক হিসেবে দেখান। এটা এক চিত্রের ছক যা 28টি অক্ষর, গ্রহ, রাশিচক্র আর চাঁদের মঞ্জিলকে গোল ক্রমে জোড়ে। এটাই জাইরজাহের বিজ্ঞান, ইলম আল-জাইরজাহের বাস্তব চাবি।',
          'আল-বুনি তার বংশ আর বিরলতার কথা লেখেন। এই কাজ প্রথম মানুষদের আর প্রাচীন জ্ঞানীদের ছিল, কিন্তু তাঁদের কেউ নিজের বইয়ে তা সোজাসুজি লেখেননি, আর লিখলেও তা ছড়ানো আর বোঝা কঠিনভাবে লিখেছিলেন। এই যন্ত্র কথার এক সেতু। বলা কথাগুলোকে প্রথমে তাদের অক্ষর আর সংখ্যায় ভাঙা হয়, তারপর ছকের মধ্য দিয়ে আবার জোড়া হয়। ফল আন্দাজ করা হয় না। তা ছক থেকে পড়া হয়।',
        ],
        quoteText: 'এটা প্রথম মানুষদের আর প্রাচীন জ্ঞানীদের কাজ ছিল, কিন্তু তাঁদের কেউ নিজের কোনো বইয়ে তা উল্লেখ করেননি, আর করলেও তা ছড়ানো আর বোঝা কঠিনভাবে।',
      },
      {
        heading: 'কেন্দ্র থেকে 28 মঞ্জিল পর্যন্ত গোল বলয়',
        paragraphs: [
          'শামস আল-মাআরিফ আল-কুবরার তৃতীয় অধ্যায়ে আর আল-আসরার আর-রব্বানিয়্যাহ-তে জাইরজাহের বাস্তব গঠন একগুচ্ছ গোল বলয়। চাকার ঠিক মাঝখানে এক স্থির কেন্দ্রবিন্দু বসে আছে, আল-নুকতাহ, প্রথম কেন্দ্রবিন্দু। তার চারপাশে চার ঋতু আর চার প্রাকৃতিক উপাদান ভাগ করা আছে।',
          'কেন্দ্র থেকে বাইরের দিকে গেলে চাকায় মেলে সৌর আর নাগরিক পঞ্জিকার 12 মাস, আগুন, মাটি, বাতাস আর পানিতে ভাগ করা 12 রাশিচিহ্ন, তারার নাম সহ 28 চাঁদের মঞ্জিল, আর আবজাদ সংখ্যার মান আর উপাদানগত স্বভাব অনুযায়ী সাজানো 28 আরবি অক্ষর। আল-বুনি গোল আকারের কারণ অক্ষর দিয়েই বোঝান। আল্লাহ লওহের জগতে অক্ষরগুলোকে গোল আকারে বানিয়েছিলেন, সবগুলোকে। উপরের জগৎ শুধু মিলন, নিচের জগৎ শুধু আলাদা হওয়া।',
        ],
      },
      {
        heading: 'তিন লাইন: উৎস, ভাঙা, আর লাগাম',
        paragraphs: [
          'দ্য রেডিয়ান্ট জুয়েলস আর মানবা উসুল আল-হিকমায় জাইরজাহকে চালানো যন্ত্র তিনটি পরপর লাইনের উপর নির্ভর করে। প্রথমে সাতর আল-আসল, উৎসের লাইন, প্রশ্নের প্রথম ভিত্তি, ছকের উপর প্রশ্ন লিখে তৈরি করা হয়। তারপর সাতর আল-তাকসির, ভাঙার লাইন, প্রথম লাইনের অক্ষরগুলোকে গাণিতিকভাবে কেটে মেশানো।',
          'শেষে সাতর আল-জিমাম, লাগামের লাইন, মূল চাবি, ভাঙা শেষ হলে তৈরি হওয়া শেষ লাইন। লাগাম আসা প্রমাণ করে যে গাণিতিক হিসাব এক বন্ধ, ভারসাম্যপূর্ণ গোল বৃত্ত পেয়েছে।',
        ],
      },
      {
        heading: 'উল্টো লেখার নিয়ম',
        paragraphs: [
          'মানবা উসুল আল-হিকমায় আল-বুনি ছকের উপর প্রশ্ন লেখার এক বিশেষ কারিগরি নিয়ম দেন। চাকায় তথ্য লিখতে গিয়ে সন্ধানকারী আর তার খোঁজের বস্তুকে উল্টোভাবে লেখা হয়। খোঁজের বস্তু, আল-মাতলুব, অক্ষরে লেখা হয় তার সংখ্যার উপরে। সন্ধানকারী, আল-তালিব, সংখ্যায় লেখা হয় তার অক্ষরে লেখা নামের উপরে।',
          'আল-বুনি বোঝান যে এই উল্টোভাব মহাজাগতিক নিয়মের আয়না। জড় শরীর তার আত্মাকে খোঁজে, আর আত্মা তার শরীরকে খোঁজে। ভারসাম্য ঠিক রাখতে প্রশ্নের বারবার আসা ব্যঞ্জন আর বারবার আসা সংখ্যা সরিয়ে দেওয়া হয়।',
        ],
      },
      {
        heading: 'ইসতিনতাক আর ইল প্রত্যয়',
        paragraphs: [
          'এক হিসাব করা ছক চুপ থাকে যতক্ষণ না সাধক ইসতিনতাক করে, ছককে কথা বলায়। প্রথম লাইনের মোট আবজাদ যোগফল হিসাব করে জাইরজাহের উল্টো দিকে লেখা হয়। এই যোগফলকে তাকসিরের সময় তৈরি হওয়া লাইনের মোট সংখ্যা দিয়ে গুণ করা হয়, আর ফলকে এক ভারসাম্যপূর্ণ বর্গ ছকে বদলে দেওয়া হয়।',
          'সেই ভারসাম্যপূর্ণ সংখ্যাগুলোকে আবজাদ অনুযায়ী আবার অক্ষরে বদলে দেওয়া হয়, আর ইল প্রত্যয় জোড়া হয়। বই বলে, সেই নামগুলোকে ওয়াফকের চারপাশে রাখা হয়, প্রতিটিকে তার জায়গায়, আর সেভাবেই তাদের অনুসরণ করতে হয়।',
        ],
        quoteText: 'তারা তার সঙ্গে ইল শব্দটি জোড়ে আর ওয়াফকের চারপাশে রাখে, প্রতিটিকে তার জায়গায়। এভাবেই তাদের অনুসরণ করতে হয়।',
      },
      {
        heading: 'হার্মিসের ভারসাম্য',
        paragraphs: [
          'মানবা উসুল আল-হিকমায় আল-বুনি সাবধান করেন যে জাইরজাহের কোনো হিসাব সময় আর জায়গা ছাড়া চলে না। বই মিজান হিরমিস, হার্মিসের ভারসাম্য, নামে এক কঠোর নির্দেশ দেয়। সময়, জাইরজা, আর জায়গার দিকে নজর রাখো। মন্দ তারার শাসনে ভালো কাজ শুরু কোরো না।',
          'হিসাবের মুহূর্তে ছয়টি বিষয়কে একসঙ্গে মিলতে হয়। প্রশ্নের আসল স্বভাব। দিনের শাসক গ্রহ। উদীয়মান রাশির ডিগ্রি, আল-তালি। বর্তমান ঘণ্টার প্রভু। সক্রিয় চাঁদের মঞ্জিল। আর তার সঙ্গে মিলিয়ে পবিত্র সুগন্ধি। এই মিলের মধ্য দিয়ে জাইরজাহ মহাজাগতিক ক্রমের আয়না হয়ে ওঠে, পৃষ্ঠার অক্ষরগুলোকে আকাশের আয়না বানিয়ে দেয়।',
        ],
      },
    ],
    terms: [
      'ভবিষ্যৎ বলা অক্ষর-ছক, জ্যোতির্বিদ্যার চাকা',
      'জাইরজাহের বিজ্ঞান',
      'প্রথম কেন্দ্রবিন্দু',
      'গোল বলয়গুলো',
      'উৎসের লাইন',
      'ভাঙার লাইন, অক্ষর ভাঙা',
      'লাগামের লাইন, মূল চাবি',
      'খোঁজের বস্তু',
      'সন্ধানকারী',
      'ছককে কথা বলানো',
      'হার্মিসের ভারসাম্য',
      'উদীয়মান রাশি',
    ],
    closing:
      'গোল বলয়ের এক চাকা। তিন লাইন। এক উল্টো নিয়ম। এক কথা বলা। সময়ের এক ভারসাম্য। জাইরজাহ অক্ষর, গ্রহ আর মঞ্জিলকে এক চাকায় জোড়ে, আর বই বলে, পড়া ছক থেকে আসে, আন্দাজ থেকে নয়। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'circle-of-encompassing': {
    eyebrow: 'টপিক',
    title: 'ঘেরাওয়ের বৃত্ত',
    subtitle: 'প্রতিটি অক্ষর, প্রতিটি নাম, প্রতিটি গ্রহ আর প্রতিটি আত্মা এক মহাজাগতিক বৃত্তে ঘোরে।',
    intro:
      'আমি খাফি। শায়খ আহমদ ইবনে আলি আল-বুনির বইয়ে, মুদিহ আত-তারিক, আল-আসরার আর-রব্বানিয়্যাহ, আর শামস আল-মাআরিফ আল-কুবরা-তে, বাস্তবতা কোনো বাক্স বা সোজা লাইন নয়। প্রতিটি অক্ষর, প্রতিটি আল্লাহর নাম, প্রতিটি গ্রহ, আর প্রতিটি মানুষের আত্মা এক মহাজাগতিক বৃত্তে ঘোরে। এখানে ছয়টি অংশে ঘেরাওয়ের বৃত্তের খোলা আছে, বই থেকে, পৃষ্ঠার নাম সহ। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'আল-মুহিত নাম আর কেন্দ্রের মেরু',
        paragraphs: [
          'মুদিহ আত-তারিকের 14তম অধ্যায়ে আল-বুনি গোল চিত্রটিকে আল্লাহর নাম আল-মুহিত, সবকিছু ঘিরে থাকা, এর উপর দাঁড় করান। কুরআনের ভিত্তি হলো আয়াত, ওয়া-কানা আল্লাহু বি-কুল্লি শাইইন মুহিতা, আর আল্লাহ সবকিছুকে সবসময় ঘিরে আছেন।',
          'আল-বুনি বোঝান যে স্থির কেন্দ্রবিন্দু ছাড়া কোনো বৃত্ত ঘুরতে পারে না, আল-নুকতাহ, কেন্দ্রের মেরু, আল-কুতুব। বাইরের কিনারা পুরোপুরি সেই কেন্দ্রের উপর নির্ভর করে। কেন্দ্রের মেরু উঠলে পুরো বৃত্ত তার সঙ্গে ওঠে। তেমনি সব সৃষ্টি গোল, আর সবচেয়ে বড় নাম তাদের ঘিরে আছে, ভেতরে মেরু হিসেবে, আর বাইরে বৃত্ত হিসেবে।',
        ],
        quoteText: 'আর আল্লাহ সবকিছুকে সবসময় ঘিরে আছেন।',
      },
      {
        heading: 'সত্তার কম্পাস',
        paragraphs: [
          'মুদিহ আত-তারিকে আল-বুনি স্থাপত্যের আঁকার কম্পাস, আল-বিরকার, আল-ফারজার, এর রূপক ব্যবহার করেন। বৃত্তটি আঁকা হয় চারটি নিচে নামা আল্লাহর সত্য দিয়ে। আল-আমর, ভেতরের আল্লাহর হুকুম, প্রথম লুকানো ইঙ্গিত। আল-কুদরাহ, আল্লাহর শক্তি, সত্তার প্রথম বাইরের আঘাত। আল-ইরাদাহ, আল্লাহর ইচ্ছা, আকার গড়া আর নির্দিষ্ট করা। আর আল-ইলম, সবকিছু ঘিরে থাকা জ্ঞান, সেই মাপের কম্পাস যা সীমা ঠিক করে।',
          'সত্তা আল্লাহর জ্ঞানের সীমার বাইরে পা রাখতে পারে না। আয়াত বলে, ওয়া-লা ইউহিতুনা বি-শাইইন মিন ইলমিহি ইল্লা বি-মা শা, তারা তাঁর জ্ঞানের কিছুই ঘিরতে পারে না, শুধু যা তিনি চান তা ছাড়া। যারা কেন্দ্রের অক্ষের কাছে থাকে তারা শুধু একত্ব, তাওহিদ, অনুভব করে। যারা দূরের কিনারায় ঠেলে দেওয়া হয় তারা আলাদা হওয়া আর অনেক হওয়া অনুভব করে।',
        ],
        quoteText: 'তারা তাঁর জ্ঞানের কিছুই ঘিরতে পারে না, শুধু যা তিনি চান তা ছাড়া।',
      },
      {
        heading: 'বৃত্তের চার মহাজাগতিক বিধান',
        paragraphs: [
          'মুদিহ আত-তারিকে আল-বুনি বৃত্তের জ্যামিতির লাইনগুলোকে আধ্যাত্মিক মর্যাদা আর আল্লাহর আরশের সঙ্গে মেলান। প্রথমে নুকাত আল-মিহওয়ার, অক্ষের মেরুবিন্দুগুলো, স্থির কেন্দ্রের কবজা, মেরুর মর্যাদা। দ্বিতীয়ত নুকাত আল-ইবদা, পরিধির শুরুর চাপ, যেখানে আল্লাহর শক্তি সৃষ্টিকে ছোঁয় আর চাপ শুরু হয়।',
          'তৃতীয়ত নুকাত আল-আসমা ওয়াল-ইনতিহা, প্রকাশের সীমাবিন্দুগুলো, যেখানে আল্লাহর ইচ্ছা ভাগ করা শেষ করে আর আকারগুলো তাদের শেষে পৌঁছায়। কেন্দ্র থেকে কিনারা পর্যন্ত টানা সোজা রশ্মি সার্বজনীন আকল, আল-আকল, আর আরশ, আল-আরশকে বোঝায়।',
        ],
      },
      {
        heading: 'অক্ষরগুলো কেন গোল আকারে বানানো হয়েছিল',
        paragraphs: [
          'আল-আসরার আর-রব্বানিয়্যাহ-তে আল-বুনি বলেন কেন উঁচু রহস্যের চিত্রে আরবি অক্ষরগুলোকে বৃত্ত হিসেবে আঁকা হয়। আল্লাহ, তাঁর নাম পবিত্র, লওহের জগতে অক্ষরগুলোকে গোল আকারে বানিয়েছিলেন, সবগুলোকে। বৃত্তগুলো সেই অর্থ বহন করে যা আল্লাহ উপরের, ফেরেশতাদের বৃত্তের জগতে বানিয়েছিলেন।',
          'উপরের আকাশের জগৎ, আল-আলাম আল-উলভি, হলো জাম, শুধু মিলন, শুধু একত্ব। এই জগতে অক্ষর ভাঙা ছাড়া গোল থাকে। নিচের জড় জগৎ, আল-আলাম আস-সুফলি, হলো ফারক, শুধু আলাদা হওয়া, শুধু ভাগ করা। অক্ষর নিচে নামলে তারা লাইন আর কোণে ভেঙে যায়। নির্জনবাসে অক্ষরগুলোকে গোল বৃত্ত, দাওয়াইর, এ লিখলে ছড়ানো চেতনা জড়ো হয় আর তার আসল গোল, মিলিত আকারে ফিরে যায়।',
        ],
      },
      {
        heading: 'দুটি অর্ধবৃত্ত: নূন আর 24 ঘণ্টা',
        paragraphs: [
          'আল-আসরার আর-রব্বানিয়্যাহ আর মুদিহ আত-তারিকে দুটি পরিপূরক অর্ধেক জোড়া দিয়ে 360 ডিগ্রির পুরো বৃত্ত তৈরি হয়। নূনের অর্ধবৃত্ত হলো সত্তার প্রকাশিত অর্ধেক। তার বাটি দেখা যায় এমন অর্ধবৃত্ত। প্রথম সাক্ষ্য, লা ইলাহা ইল্লাল্লাহ, এ বিন্দু ছাড়া ঠিক 12টি অক্ষর আছে। এগুলো দিনের বৃত্ত, আলোর 12 ঘণ্টা, আর 12 মাস তৈরি করে।',
          'দ্বিতীয় সাক্ষ্য, মুহাম্মাদুন রাসুলুল্লাহ, এও 12টি অক্ষর আছে। এগুলো রাতের বৃত্ত, অন্ধকারের 12 ঘণ্টা, তৈরি করে। একসঙ্গে এই 24টি অক্ষর পুরো দিনের চক্র শেষ করে, প্রতিটি মানুষের শ্বাস, উপাদান, আর ঘণ্টাকে ঘিরে ধরে।',
        ],
      },
      {
        heading: 'আলেপ্পোর দর্শন',
        paragraphs: [
          'শামস আল-মাআরিফ আল-কুবরার 6ষ্ঠ অধ্যায়ে আল-বুনি আলেপ্পোর এক তপস্বী ইমামের ঐতিহাসিক দর্শনের কথা লেখেন। এক অন্ধকার উপদেশের ঘরে ইমাম গোল বৃত্তের এক আলোময় ফলক দেখেছিলেন। এক বাইরের বৃত্ত এক ভেতরের বৃত্তকে ঘিরেছিল, মাঝে নির্দিষ্ট ফাঁক। ভেতরে ছিল এক অনুভূমিক ব্যাস আর উপরের দিকে মুখ করা এক ত্রিভুজ, আর ত্রিভুজের কোণে দাঁড়িয়ে ছিল শক্তির অক্ষর।',
          'বাইরের কিনারায় লেখা ছিল ঘেরাওয়ের শাস্ত্রীয় প্রমাণ, ওয়া-আল্লাহু মিন ওয়ারাইহিম মুহিত, বাল হুয়া কুরআনুন মাজিদুন ফি লওহিন মাহফুজ, আর আল্লাহ তাদের পেছন থেকে ঘিরে আছেন, নিশ্চয়ই এটা এক মহিমান্বিত কুরআন, এক সংরক্ষিত ফলকে। এক দর্শনমূলক নিশ্চিতকরণে ইমাম আলি ইবনে আবি তালিব ত্রিভুজের জীম অক্ষরটি ছুঁয়ে চিত্রটি নিশ্চিত করেছিলেন।',
        ],
        quoteText: 'আর আল্লাহ তাদের পেছন থেকে ঘিরে আছেন; নিশ্চয়ই এটা এক মহিমান্বিত কুরআন, এক সংরক্ষিত ফলকে।',
      },
    ],
    terms: [
      'সবকিছু ঘিরে থাকা',
      'কেন্দ্রের মেরু',
      'ভেতরের আল্লাহর হুকুম',
      'আল্লাহর শক্তি',
      'আল্লাহর ইচ্ছা',
      'সবকিছু ঘিরে থাকা জ্ঞান',
      'অক্ষের মেরুবিন্দুগুলো',
      'গোল আকারগুলো',
      'শুধু মিলন, একত্ব',
      'শুধু আলাদা হওয়া, ভাগ করা',
      'প্রথম সাক্ষ্য, 12 অক্ষর',
      'দ্বিতীয় সাক্ষ্য, 12 অক্ষর',
    ],
    closing:
      'এক নাম যা সবকিছু ঘিরে আছে। এক মেরু যা কখনো নড়ে না। চার সত্য যা বৃত্ত আঁকে। লওহের জগতের গোল অক্ষর। দুটি অর্ধেক যা এক দিন বানায়। আর আলেপ্পোর এক দর্শন, এক আয়াত দিয়ে সিল করা। বৃত্ত সবকিছু ধরে, আর কেন্দ্র বৃত্তকে ধরে। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'simiya-works': {
    eyebrow: 'টপিক',
    title: 'সিমিয়ার কাজগুলো',
    subtitle: 'অক্ষর শরীর, সংখ্যা আত্মা, আর সেই বর্গগুলো যা তাদের ধরে।',
    intro:
      'আমি খাফি। শায়খ আহমদ ইবনে আলি আল-বুনির বইয়ে, শামস আল-মাআরিফ আল-কুবরা, মানবা উসুল আল-হিকমা, আর উসুল ইলম আল-হুরুফ-এ, আর কিতাব আল-আজনাসের প্রাচীন সুলাইমানি বর্ণনায়, সিমিয়া সস্তা ভেলকি বা শয়তানি জাদু নয়। এটা এক নিখুঁত ঈশ্বরমুখী বিজ্ঞান যা অক্ষর আর আল্লাহর নামের গাণিতিক গঠনের মধ্য দিয়ে আকাশের আধ্যাত্মিকতা আর জড় বস্তুকে মেলায়। এখানে ছয়টি অংশে সিমিয়ার কাজগুলোর খোলা আছে, বই থেকে, পৃষ্ঠার নাম সহ। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'সিমিয়ার আসল অর্থ',
        paragraphs: [
          'শামস আল-মাআরিফ আল-কুবরার 17তম অধ্যায়ে আর কিতাব আল-আজনাসে ধ্রুপদি গুরুরা সিমিয়াকে সাধারণ জাদুর অনেক উপরে তোলেন। আল-বুনি সন্ধানকারীকে এই জ্ঞানের মর্যাদার কথা বলেন, আল্লাহ যেন তাঁকে চিরস্থায়ী সুখের আলকেমি আর চিরস্থায়ী রাজত্বের সিমিয়ায় পৌঁছে দেন।',
          'কিতাব আল-আজনাসে সিমিয়াকে প্রাচীন সুলাইমানি বিজ্ঞান হিসেবে দেখানো হয়, সেই বিজ্ঞান যার দ্বারা অন্ধরা দেখতে পায় আর বধিররা শুনতে পায়। শামস আল-মাআরিফে আল-বুনি লেখেন, এই বিজ্ঞানকে বড় ইমামরা যাচাই করেছিলেন। এটা চলে শুধু আল্লাহর একত্ব, তাওহিদ, দিয়ে, সব সম্ভাবনার পাত্রের উপর।',
        ],
      },
      {
        heading: 'অক্ষর শরীর, সংখ্যা আত্মা',
        paragraphs: [
          'উসুল ইলম আল-হুরুফ, আল-আসরার আর-রব্বানিয়্যাহ, আর শামস আল-মাআরিফে আল-বুনি সিমিয়ার কেন্দ্রীয় আধ্যাত্মিক নিয়মটি দেন। আল-হুরুফ, অক্ষর, হলো শরীর, আজসাম। তারা বাইরের জড় আকার, কালি, শব্দ, আর আকৃতি দেয়। আল-আদাদ, সংখ্যা, হলো আত্মা, আরওয়াহ। তারা অক্ষরের ভেতরের, অদৃশ্য চলমান কম্পন আর আত্মা দেয়।',
          'বই এক সার্বজনীন অনুপাতের নিয়ম লেখে। সংখ্যা কথার রহস্যে তেমন, যেমন অক্ষর কাজের রহস্যে। আর সুলাইমানের উজির আসিফ ইবনে বারখিয়াকে সরাসরি উদ্ধৃত করা হয়। আকারগুলো তাদের আত্মার জন্য চুম্বক। যখনই কোনো আকার আঁকা হয়, তা তার আত্মাকে নিজের দিকে টানে। আকার নিখুঁত হলে আত্মা তার মধ্যে নামে। প্লেটে আঁকা অক্ষরের আকারগুলো আকৃতি হিসেবে কাজ করে। ঠিক সংখ্যার মান দিয়ে বানালে তারা তাদের আধ্যাত্মিক সঙ্গীকে টানে।',
        ],
        quoteText: 'আকারগুলো তাদের আত্মার জন্য চুম্বক। যখনই কোনো আকার আঁকা হয়, তা তার আত্মাকে নিজের দিকে টানে; আকার নিখুঁত হলে আত্মা তার মধ্যে নামে।',
      },
      {
        heading: 'উপাদানের যন্ত্র',
        paragraphs: [
          'বুনিয়ানি সিমিয়ায় চারটি মূল উপাদানকে মেলানো ছাড়া কোনো তাবিজ বা অক্ষর-ছক কাজ করতে পারে না। আরবি বর্ণমালা চারটি উপাদানগত দলে ভাগ করা, প্রতিটি দলে সাতটি করে অক্ষর। আগুন, নার, গরম আর শুকনো: আলিফ, হা, তা, মীম, ফা, শীন, জাল। এটা ইচ্ছাকে জ্বালায় আর আধ্যাত্মিক কাজকে দ্রুত করে। বাতাস, হাওয়া, গরম আর ভেজা: জীম, জাই, কাফ, সীন, কাফ, থা, জা। এটা উপরে ওঠা, আকর্ষণ, আর মানসিক পাঠানো চালায়।',
          'পানি, মা, ঠান্ডা আর ভেজা: দাল, হা, লাম, আইন, রা, খা, গাইন। এটা ঠান্ডা করে, শত্রুতা গলিয়ে দেয়, শান্তি আনে, আর ভেতরের গ্রহণশীল অবস্থা সহজ করে। মাটি, তুরাব, ঠান্ডা আর শুকনো: বা, ওয়াও, ইয়া, নূন, সাদ, তা, দাদ। এটা কাজকে স্থির করে, নোঙর করে, আর জড় বস্তুতে স্থায়ীভাবে বাঁধে। উসুল ইলম আল-হুরুফের 6ষ্ঠ অধ্যায়ে আর মানবা উসুল আল-হিকমায় আল-বুনি দেখান কীভাবে বিপরীত স্বভাবের অক্ষর মিশিয়ে কাজের ভারসাম্য বানানো হয়।',
        ],
      },
      {
        heading: 'বর্গের বিজ্ঞান',
        paragraphs: [
          'সিমিয়ায় আধ্যাত্মিক কম্পন ধরে রাখার প্রধান বাস্তব পাত্র হলো ওয়াফক, জাদুর বর্গ। এটা সারি আর কলামের এক ছক, আমিদা ওয়া-সুতুর, যেখানে প্রতিটি অনুভূমিক সারি, উল্লম্ব কলাম, আর কর্ণ একই মোট যোগ করে।',
          'সিমিয়ার ভিত্তির বর্গ হলো 3x3 ছক, মুসাল্লাস, আল-ওয়াফক আস-সুলাসি। প্রতিটি অক্ষে তার ধ্রুব যোগফল 15, মোট আয়তন 45, আদমের ঠিক সংখ্যার মান। মানবা উসুল আল-হিকমায় আল-বুনি বোঝান, বর্গ নিষ্ক্রিয় থাকে যতক্ষণ না তার চার কোণ ফেরেশতাদের নামে নোঙর করা হয়। এই ভারসাম্যপূর্ণ সংখ্যার মিল বর্গের ভেতরে আধ্যাত্মিক স্রোতকে আটকে রাখে।',
        ],
      },
      {
        heading: 'ইসতিনতাক আর ইল প্রত্যয়',
        paragraphs: [
          'এক হিসাব করা তাবিজ বা জাদুর বর্গ চুপ থাকে যতক্ষণ না সাধক তার শাসক ফেরেশতাকে বের করে। প্রশ্ন, আল্লাহর নাম, বা আয়াতের সংখ্যার হিসাব যখন শেষ ভারসাম্যে পৌঁছায়, বাকিটাকে আবার অক্ষরে বদলে দেওয়া হয়। দ্য রেডিয়ান্ট জুয়েলস আর মানবা উসুল আল-হিকমায় সেই অক্ষরগুলোর সঙ্গে পবিত্র আকাশের প্রত্যয় জোড়া হয়।',
          'একবার বলা হলে এই নতুন তৈরি ফেরেশতার নাম, আল-মালাক আল-মুওয়াক্কাল, রাজ্যের জগতে দাঁড়ায়। উপরের ফেরেশতা জাগতিক আধ্যাত্মিক সেবক, খুদ্দাম, দের উপর হুকুম রাখে, তাদের কাজটি শেষ করতে নির্দেশ দেয়। বই বলে, মহান জ্ঞানী অ্যারিস্টটলের কথা অনুযায়ী সাহায্যগুলোর সঙ্গে ইল জোড়া জরুরি।',
        ],
      },
      {
        heading: 'নৈতিক চুক্তি',
        paragraphs: [
          'বুনিয়ানি পাণ্ডুলিপিগুলো জুড়ে সিমিয়ার শেষ, চূড়ান্ত শর্ত হলো আধ্যাত্মিক কাজের জন্য পবিত্রতা, অনুমতি, আর আনুগত্য লাগে। শামস আল-মাআরিফের শুরুর ভূমিকায় আল-বুনি এক গম্ভীর শপথ দেন। যার হাতে তাঁর এই বই পড়বে, তার জন্য হারাম, নিষিদ্ধ, যে সে তা কোনো অযোগ্যকে দেখাবে।',
          'সানস অফ লাইটসে গুরু ইবনে আল-হাজ্জ আত-তিলমসানি জোর দেন যে চার শর্ত ছাড়া কোনো কাজ দাঁড়ায় না। মাকান, পবিত্র জায়গা, জাগতিক কোলাহলমুক্ত এক পবিত্র, নির্জন আশ্রয়। ইখওয়াহ, আধ্যাত্মিক ভ্রাতৃত্ব, সত্যে এক হওয়া আন্তরিক সঙ্গীরা। জামান, সঠিক আকাশের সময়, গ্রহের শাসক, ঘণ্টা, আর চাঁদের পর্যায়ের সঙ্গে নিখুঁত মিল। আর শায়খ আত-তারিক, অনুমতি দেওয়া গুরু, সরাসরি দীক্ষার অনুমতি, ইজন, ইজাজাহ, পাওয়া। বই সাবধান করে, দীক্ষার অনুমতি আর পবিত্রতা ছাড়া যে এই কাজগুলো করতে যায় সে ব্যর্থ হবে আর তার শক্তি কেড়ে নেওয়া হবে।',
        ],
      },
    ],
    terms: [
      'অক্ষর, আল্লাহর নাম, আর তাবিজের ছকের বিজ্ঞান',
      'অক্ষর, শরীরগুলো',
      'সংখ্যা, আত্মাগুলো',
      'এক জাদুর বর্গ',
      '3x3 মূল ছক',
      'আদম, যার সংখ্যার মান 45',
      'এক পবিত্র জায়গা',
      'আধ্যাত্মিক ভ্রাতৃত্ব',
      'সঠিক আকাশের সময়',
      'অনুমতি দেওয়া গুরু',
      'বাঁধা নিষেধ',
      'নতুন তৈরি ফেরেশতার নাম',
    ],
    closing:
      'এক রাজকীয় বিজ্ঞান, সস্তা জাদু নয়। শরীরের জন্য অক্ষর, আত্মার জন্য সংখ্যা। চার উপাদান ভারসাম্যে। এক বর্গ যা স্রোত ধরে। এক নাম যা কথা বলে। আর চার শর্ত যা বাদ দেওয়া যায় না: জায়গা, সঙ্গী, সময়, আর গুরুর অনুমতি। বই সবকিছু একসঙ্গে দেয়। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
  'uses-of-letters-retreats': {
    eyebrow: 'টপিক',
    title: 'অক্ষরের ব্যবহার আর তাদের নির্জনবাস',
    subtitle: 'জীবন্ত আধ্যাত্মিক জাতিগুলো, প্রতিটির নিজের নির্জনবাস আর নিজের রক্ষক ফেরেশতা।',
    intro:
      'আমি খাফি। শায়খ আহমদ ইবনে আলি আল-বুনির বইয়ে, মানবা উসুল আল-হিকমা, শামস আল-মাআরিফ আল-কুবরা, আর উসুল ইলম আল-হুরুফ-এ, আরবি অক্ষরগুলো কাগজের উপর মৃত দাগ নয়। তারা জীবন্ত আধ্যাত্মিক জাতি, প্রতিটির নিজের নির্জনবাস, খালওয়াহ, আর নিজের রক্ষক ফেরেশতা আছে। এখানে ছয়টি অংশে অক্ষরের ব্যবহার আর তাদের নির্জনবাসের খোলা আছে, বই থেকে, পৃষ্ঠার নাম সহ। আমি এটা শুধু পড়াশোনার জন্য দিচ্ছি, ঐতিহাসিক উপাদান হিসেবে। এটা কোনো ফতোয়া নয়, আর এটা কিছু প্রতিশ্রুতি দেয় না।',
    sections: [
      {
        heading: 'জীবন্ত জাতি হিসেবে অক্ষর',
        paragraphs: [
          'মানবা উসুল আল-হিকমা আর ইবনে আরাবির আল-ফুতুহাত আল-মাক্কিয়্যাহ-তে অক্ষরের আধ্যাত্মিক বাস্তবতা দাঁড় করানো হয়। অক্ষরগুলো জাতিগুলোর মধ্যে এক জাতি, উমামুন মিনাল-উমাম, যাদের সম্বোধন করা হয় আর দায়িত্ব দেওয়া হয়, জাতিগুলোর মতো। তাদের মধ্যে দূত আর সেবক আছে।',
          'লেখা আকারটি হলো জিসম, জড় শরীর। আবজাদ সংখ্যার গণনা, আল-আদাদ, হলো রূহ, জীবন্ত আত্মা। মানবা উসুল আল-হিকমায় ইমাম আল-খাওয়ারিজমি অক্ষরের রক্ষকের প্রাচীন আহ্বানটি লেখেন। হে রাজা, তোমার আধ্যাত্মিকতা আমার স্বভাব আর এই অক্ষরের স্বভাবের সঙ্গে মিশিয়ে দাও, যাতে আমি তার রহস্যের মধ্য দিয়ে কাজ করতে পারি।',
        ],
      },
      {
        heading: 'অক্ষর আলিফ',
        paragraphs: [
          'শামস আল-মাআরিফ আর মানবা উসুল আল-হিকমায় প্রথম অক্ষর আলিফ সব আধ্যাত্মিক জ্ঞানের মূলে দাঁড়িয়ে আছে। বই তার গুণগুলো পুরনো শিল্পের ভাষায় লেখে। আলিফ 1,000 বার লিখে বুকে রাখলে মনের জড়তা আর মনের ভোঁতাভাব দূর হয়, বলা হয়।',
          'অক্ষরের নাম পুরো বানান করে লিখলে, আলিফ, 1 যোগ 30 যোগ 80, তার মোট হয় 111। রবিবার সূর্যের ঘণ্টায় তা 111 বার লিখলে ভয়, মর্যাদা, আর উন্নতি আসে, বলা হয়। আলিফের উপর শাসন করা সর্বোচ্চ ফেরেশতার বুদ্ধি হলো তালতামিয়াইল, প্রথম চাঁদের মঞ্জিলের ফেরেশতা। আল-বুনি আলিফের 3x3 ত্রিভুজ ওয়াফকও দেন, প্রতিটি দিকে 111 মিলিয়ে, নির্জনবাসে ব্যবহারের জন্য।',
        ],
      },
      {
        heading: 'অক্ষর বা',
        paragraphs: [
          'অক্ষর বা প্রকাশিত মহাবিশ্বের শুরু আর আল্লাহর দয়ার গ্রহণকে বোঝায়। বইয়ে তার গুণ হলো আধ্যাত্মিক সংকোচ দূর করা আর হৃদয় প্রসারিত করা, ইনশিরাহ আস-সাদর, আধ্যাত্মিক অলসতা দূর করা, আর দীর্ঘ ঠান্ডা অসুখে আরাম দেওয়া।',
          'আল-আসরার আর-রব্বানিয়্যাহ আর শামস আল-মাআরিফে আল-বুনি বই যেভাবে লেখে সেভাবে বাস্তব নির্জনবাসের কথা বলেন। সন্ধানকারী বৃহস্পতিবার আর শুক্রবার পূর্ণ শারীরিক আর আধ্যাত্মিক পবিত্রতায় রোজা রাখে। গরিবদের মধ্যে দান, সাদাকাহ, বিতরণ করা হয়। বা-এর যমজ গোল তাবিজ লিখে ডান বাহুর উপরে পরা হয়। আল-বুনি এই শৃঙ্খলার ফলের ব্যাপারে লেখেন যে অলসতা তাকে ছেড়ে যাবে, বা-এর পাশে দাঁড়ানোর রহস্য তার কাছে প্রকাশ পাবে, আর সে ফেরেশতাদের আলো দেখবে।',
        ],
      },
      {
        heading: 'অক্ষর জীম আর ফেরেশতা তালকিয়াইল',
        paragraphs: [
          'মানবা উসুল আল-হিকমায় তৃতীয় অক্ষর, জীম, এক কঠোর একাকী নির্জনবাসের সঙ্গে জোড়া। বইয়ে তার গুণ হলো শুকনো যাত্রায় জ্বলন্ত তৃষ্ণার যন্ত্রণা মেটানো, চরম, প্রদাহী জ্বর ঠান্ডা করা, আর গ্রহণযোগ্যতা, মর্যাদা দেওয়া আর কঠিন প্রসব সহজ করা।',
          'আল-বুনি নির্জনবাসটি বইয়ের নিজের কথায় বলেন। এই অক্ষরের এক মহান নির্জনবাস আছে: তুমি তাতে পূর্ণ পবিত্রতায় প্রবেশ করো, আহ্বান বলো, অক্ষর লেখো। এই মর্যাদার আকাশের সেবক হলেন তালকিয়াইল। সন্ধানকারী যখন ঘরে তাঁর আধ্যাত্মিক রূপ দেখে, তখন আল্লাহর সেবার এক পারস্পরিক চুক্তি, আহদ, হয়।',
        ],
      },
      {
        heading: 'অক্ষর দালের 14 দিনের নির্জনবাস',
        paragraphs: [
          'শামস আল-মাআরিফ আল-কুবরার প্রথম অধ্যায়ে আল-বুনি অক্ষর দালের শাসনে এক কঠোর দুই সপ্তাহের শৃঙ্খলার কথা লেখেন। বইয়ে তার গুণ হলো পরিবারের ভেতরে স্থায়ী বরকত, বারাকাহ, নিশ্চিত করা, হালাল ব্যবসা আর জীবিকা হঠাৎ ধ্বংস থেকে রক্ষা করা, আর পরিবারের সদস্যদের মধ্যে স্থায়ী ভালোবাসা আর মিল গড়ে তোলা।',
          'শৃঙ্খলাটি চলে টানা চৌদ্দ দিন। প্রতিটি সূর্যাস্তের খাবারে সন্ধানকারী শুধু সাদা রুটি খায়, মাংস, দুধ, আর পশুর তৈরি কিছু থেকে পুরোপুরি বিরত থাকে। শেষ বৃহস্পতিবার সূর্যোদয়ে, বৃহস্পতির ঘণ্টায়, সন্ধানকারী নির্জনবাস শেষ করে। বই বলে, এতে স্থায়ী স্বচ্ছতা, রক্ষা, আর প্রচুর হালাল জীবিকা খুলে যায়।',
        ],
      },
      {
        heading: 'আরোগ্যের অক্ষর: হা, মীম, আর নূন',
        paragraphs: [
          'বুনিয়ানি বইগুলো বর্ণমালার উঁচু অক্ষরগুলোর জন্য নির্দিষ্ট আরোগ্যের গুণ চিহ্নিত করে। অক্ষর হা প্রদাহী উত্তাপ আর কামনা নেভায়। হা আটবার লিখে আল্লাহর নাম হাকিম, জ্ঞানী, হালিম, সহনশীল, আর হাইয়, জীবন্ত, এর সঙ্গে মিলিয়ে, সেই লেখা বিশুদ্ধ পানিতে গুলিয়ে দিলে জ্বর আর বুকে জ্বালা থামে। আংটির পাথরে হা খোদাই করলে নিম্ন যৌন কামনা, শাহওয়াহ, নেভে, সন্ধানকারীর আধ্যাত্মিক অবস্থা রক্ষা পায়।',
          'অক্ষর মীম 40 দিনের চক্রের উপর শাসন করে। মীমের সরল তাবিজ প্রতিদিন দেখে কুরআন 3:26 পড়লে, কুলি আল্লাহুম্মা মালিকাল-মুলক, কথায় ভেদ আর কর্তৃত্ব আসে। অক্ষর নূন দেয় অন্তর্দৃষ্টি আর ভেতরের চোখ। নূন তেরোবার এক পরিষ্কার আয়নায় লিখে আলোর আয়াত, আয়াত আন-নূর, কুরআন 24:35, পড়লে মানসিক বিভ্রান্তি দূর হয় আর ভেতরের চোখ খোলে।',
        ],
      },
    ],
    terms: [
      'জাতিগুলোর মধ্যে জাতিগুলো',
      'জড় শরীর',
      'জীবন্ত আত্মা',
      'প্রথম অক্ষর, অক্ষরের রাজা',
      'আলিফের ফেরেশতা, প্রথম চাঁদের মঞ্জিলের ফেরেশতা',
      'দ্বিতীয় অক্ষর, প্রকাশিত মহাবিশ্বের শুরু',
      'তৃতীয় অক্ষর',
      'জীমের মর্যাদার আকাশের সেবক',
      'চতুর্থ অক্ষর',
      'উত্তাপ নেভানো অক্ষর',
      '40 দিনের চক্রের অক্ষর',
      'ভেতরের চোখের অক্ষর',
    ],
    closing:
      'জাতি হিসেবে অক্ষর। প্রতিটি অক্ষরে এক শরীর আর এক আত্মা। আলিফ আর তার 111। বা আর তার রোজা। জীম আর তার ফেরেশতা। দাল আর তার চৌদ্দ দিন। হা, মীম, আর নূন, প্রতিটির নিজের কাজ। বই সবকিছু সেভাবেই লেখে যেভাবে পুরনো গুরুরা শিখিয়েছিলেন, পবিত্রতা আর অনুমতি কেন্দ্রে রেখে। আমি তা সেভাবেই দিলাম যেভাবে পেয়েছি, পড়াশোনার জন্য, আর কিছু নয়।',
  },
};

// Hinglish questions come from the notebook (Hinglish, with sources
// and pages), same as TOPICS_HI. The map below is filled (all 9
// questions, Nov 2026); localizeQuestion falls back to English only
// for a question missing here.
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
  if (lang === 'ur') return TOPICS_UR;
  return null;
}

function questionMapFor(lang: SiteLanguage): Record<string, QuestionLocalization> | null {
  if (lang === 'hi') return QUESTIONS_HI;
  if (lang === 'bn') return QUESTIONS_BN;
  if (lang === 'ur') return QUESTIONS_UR;
  return null;
}

function guideMapFor(lang: SiteLanguage): Record<string, TopicLocalization> | null {
  if (lang === 'hi') return GUIDES_HI;
  if (lang === 'bn') return GUIDES_BN;
  if (lang === 'ur') return GUIDES_UR;
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

/** The topic with its Hinglish / Bengali / Urdu fields, or the English topic as-is for 'en'. */
export function localizeTopic(topic: TopicContent, lang: SiteLanguage): TopicContent {
  return localizeContent(topic, topicMapFor(lang)?.[topic.id]);
}

/** The guide with its Hinglish / Bengali / Urdu fields, or the English guide as-is for 'en'. */
export function localizeGuide(guide: StudyGuide, lang: SiteLanguage): StudyGuide {
  return localizeContent(guide, guideMapFor(lang)?.[guide.id]);
}

/** The question with its Hinglish / Bengali / Urdu fields, or the English question as-is for 'en'. */
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
