/**
 * Amals in Hinglish, Bengali and Urdu.
 *
 * The amal content itself (src/data/buniAmals.ts, src/data/friendAmals.ts)
 * is English, verified against the books. The page chrome (titles,
 * buttons, labels) was already translated in the i18n files, but every
 * amal title, purpose and instruction stayed English — that is what
 * this file fixes. Arabic words and transliteration are never
 * translated: the `words` field stays exactly as in the English data.
 *
 * Translations here are hand-written in simple words, in Muktar's
 * reel voice for Hinglish (simple Roman Hindi/Urdu, easy words).
 * Any field missing here falls back to the English text, so a new
 * amal never shows a blank.
 */
import type { SiteLanguage } from './i18n';

export interface AmalText {
  title: string;
  purpose: string;
  how: string;
  note?: string;
}

type AmalMap = Record<string, Partial<AmalText>>;

const HI: AmalMap = {
  'buni-night-protection': {
    title: 'Raat ki hifazat — sone se pehle Bismillah 121 baar padhein',
    purpose: 'Sote waqt Shaitan, chori, achanak maut aur musibat se hifazat.',
    how: 'Sone se pehle "Bismillah al-Rahman al-Rahim" (Allah ke naam se, jo bada Meherban, Nihayat Rehem wala hai) 121 baar padhein.',
  },
  'buni-provision-sunrise': {
    title: 'Suraj nikalte waqt rozi — Bismillah 300 baar, phir 100 durood',
    purpose: 'Aisi jagah se rozi aur guzara, jahan se umeed bhi na ho.',
    how: 'Suraj nikalte waqt, suraj ki taraf munh karke, Bismillah 300 baar padhein, phir Nabi Muhammad par 100 baar durood bhejein. Kitab kehti hai ise roz karte raho.',
  },
  'buni-wish-friday': {
    title: 'Jumme ko ek khwahish — khutbe ke waqt Bismillah 113 baar padhein',
    purpose: 'Ek chhupi hui khwahish jo aap poori karwana chahte ho.',
    how: 'Jumme ko, jab imam khutba de raha ho, apni khwahish dil mein rakh kar Bismillah 113 baar padhein, phir haath uthakar Allah se maangein.',
    note: 'Kitab kehti hai khutbe ke waqt padhein. Kuch aalim kehte hain khutba khamoshi se sunna chahiye — kitab ki baat yahan jaisi likhi hai waisi hi di gayi hai.',
  },
  'buni-aims-desires': {
    title: 'Maqsad aur khwahishein — 7 din tak Bismillah 786 baar padhein',
    purpose: 'Koi achhi cheez paana jo aap chahte ho, ya koi buri cheez door rakhna.',
    how: 'Har roz Bismillah 786 baar (yeh uski adad ki keemat hai) 7 din tak padhein, apna khaas maqsad dil mein rakh kar.',
  },
  'buni-pain': {
    title: 'Dard — 3 din tak Bismillah 100 baar padhein',
    purpose: 'Dard se aaram.',
    how: 'Agar dard hai, to Bismillah 100 baar roz 3 din tak padhein.',
  },
  'buni-oppressor': {
    title: 'Zaalim ke saamne — Bismillah 50 baar padhein',
    purpose: 'Jab kisi zaalim ya sakht, taqatwar shakhs ke saamne aao to hifazat.',
    how: 'Unke saamne Bismillah 50 baar padhein. Kitab kehti hai Allah unke dil mein aapka khauf daal dega aur aapko khatre se bacha lega.',
  },
  'buni-morning-evening': {
    title: 'Subah-shaam ki hifazat — "Bismillah al-a\'zam" 3 baar kahein',
    purpose: 'Poore din nuksan se hifazat, aur raat bhar ki salaamti.',
    how: 'Jaagte hi "Allah ke naam se, jo Sab se Bada hai" (Bismillah al-a\'zam) 3 baar kahein. Shaam ko phir 3 baar kahein.',
  },
  'buni-begin-prayer': {
    title: 'Har namaz aur tilawat Bismillah se shuru karein',
    purpose: 'Duniya aur aakhirat mein salaamti, aur aasan maut aur qabr.',
    how: 'Har namaz aur Quran ki har tilawat Bismillah se shuru karein. Kitab kehti hai jo aisa karta hai use sawal karne wale farishton ka koi khauf nahi, aur Allah maut ki takleef aasan kar deta hai aur qabr khuli kar deta hai.',
  },
  'buni-home-entry': {
    title: 'Ghar mein aate-jaate Bismillah',
    purpose: 'Ghar mein aur bahar salaamti.',
    how: 'Ghar mein aate aur jaate waqt kahein: "Allah ke naam se hum andar aate hain aur bahar jaate hain, aur Allah par bharosa karte hain."',
  },
  'buni-before-sleep': {
    title: 'Sone se pehle Bismillah',
    purpose: 'Raat bhar ki hifazat.',
    how: 'Sone se pehle kahein: "Bismillah, aur Allah ke Rasool ke raaste par."',
  },
  'buni-ya-allah': {
    title: '"Ya Allah" pukaarein aur jo chahiye maangein',
    purpose: 'Allah se jo kuch bhi chahiye.',
    how: '"Ya Allah" (Aye Allah!) kahein aur jo chahiye maangein. Kitab kehti hai Allah jawab deta hai: "Main yahan hoon, mere bande! Main Allah hoon, to tumhe kya chahiye?"',
  },
  'buni-hidden-name': {
    title: 'Allah ke chhupe naam se ek chhoti dua',
    purpose: 'Koi bhi zaroorat, Allah ke chhupe naam se.',
    how: 'Yeh chhoti dua padhein: "Aye Allah! Main Tujhse Tere chhupe naam se maangta hoon: Paak, Paak karne wala, Muqaddas, Hamesha Zinda, Hamesha Rehne wala. Allah ke naam se, jo Meherban, Rehem wala hai — Zabardast aur Sakhi."',
  },
  'buni-important-matter': {
    title: 'Ek ahem kaam ke liye ek chhoti dua',
    purpose: 'Ek ahem zaroorat, Allah se kehna ke woh sab sambhaal le.',
    how: 'Kitab mein likhi lambi dua padhein, jo "Aye Allah! Main Tujhse maangta hoon, kyunki Tu hi Allah hai..." se shuru hoti hai. Kitab kehti hai is dua mein Allah ka Sab se Bada Naam hai.',
  },
  'buni-ya-rahman-rahim': {
    title: 'Ya Rahman, Ya Rahim — logon se achha salook paayein',
    purpose: 'Har haal mein logon se achha salook paana.',
    how: 'Al-Rahman (Meherban) aur al-Rahim (Rehem wala) — yeh do naam aksar padhein.',
  },
  'buni-ya-salam': {
    title: 'Ya Salam — musibat se hifazat',
    purpose: 'Musibaton se hifazat.',
    how: 'Al-Salam (Aman dene wala) aksar padhein.',
    note: 'Kitab iske baad ek aur daawa bhi karti hai (behosh hokar saanp ya bichhu ko bina nuksan chhoona). Woh hissa chhod diya gaya hai.',
  },
  'buni-ya-mumin': {
    title: "Ya Mu'min, 132 baar — badi beemari se hifazat",
    purpose: 'Waba aur badi beemari se hifazat.',
    how: "Al-Mu'min (Aman dene wala) 132 baar roz padhein.",
  },
  'buni-ya-razzaq': {
    title: 'Ya Razzaq — rozi',
    purpose: 'Aisi jagah se rozi aur guzara, jahan se umeed bhi na ho.',
    how: 'Al-Razzaq (Rozi dene wala) aksar padhein.',
  },
  'buni-ya-wahhab': {
    title: 'Ya Wahhab — duaein qubool hon',
    purpose: 'Duaon ka qubool hona.',
    how: 'Al-Wahhab (Dene wala) aksar padhein.',
  },
  'buni-ya-alim': {
    title: "Ya 'Alim — hikmat bhari baatein bolein",
    purpose: 'Hikmat se bolna.',
    how: "Al-'Alim (Sab jaanne wala) aksar padhein. Kitab kehti hai Allah aapko hikmat bhari baatein bulwayega.",
  },
  'buni-ya-qahhar': {
    title: 'Ya Qahhar — apni khwahishon par qaabu',
    purpose: 'Apni nafs aur khwahishon par qaabu paana.',
    how: 'Al-Qahhar (Ghalib aane wala) aksar padhein.',
  },
  'buni-ya-hafiz': {
    title: 'Ya Hafiz — buri chaalon se hifazat',
    purpose: 'Bure logon ki chaalon se hifazat, jahan bhi jaayein.',
    how: 'Al-Hafiz (Hifazat karne wala) aksar padhein.',
  },
  'buni-ya-mujib': {
    title: 'Ya Mujib — mushkil se nikalne ka raasta',
    purpose: 'Kisi bhi mushkil se nikalne ka raasta milna.',
    how: 'Al-Mujib (Jawab dene wala) aksar padhein.',
  },
  'buni-ya-sabur': {
    title: 'Ya Sabur — mushkil waqt mein mazbooti',
    purpose: 'Mushkil aur zindagi ki pareshaniyon mein mazboot rehna.',
    how: 'Al-Sabur (Sabr karne wala) aksar padhein.',
  },
  'buni-surah-fath': {
    title: 'Surah al-Fath (Quran 48) ki shuruaat padhein — jeet aur Allah ki madad',
    purpose: 'Jeet aur Allah ki madad, jab aap kamzor, haare hue ya mushkil mein hon.',
    how: 'Surah al-Fath (surah 48, "Jeet") ki shuruaat padhein. Kitab kehti hai isse padhne se kamzor taqatwar ban jaata hai, aur Allah aise tareeke se madad karta hai jo aap soch bhi nahi sakte.',
    note: 'Kitab nahi kehti "shuruaat" ka matlab kitni aayatein hain. Ismein parchment par likhne, jhanda ya pyaale wale tareeke bhi hain — woh yahan nahi diye gaye.',
  },
  'buni-two-rakahs-maghrib': {
    title: 'Maghrib ke baad 2 rak\'aat — us shakhs se hifazat jo aapka bura chahta ho',
    purpose: 'Us shakhs se hifazat jisse aapko dhokhe ya buraai ka darr ho.',
    how: 'Maghrib ki namaz ke baad 2 rak\'aat padhein: pehli mein Surah al-Fatiha (1) aur Surah al-Kafirun (109); dusri mein Surah al-Fatiha (1) aur Surah al-Falaq (113). Phir kahein: "Aye Allah, Aye Kaafi, mujhe us shakhs ki buraai se bacha le."',
    note: 'Kitab iske baad naam likh kar pagdi mein rakhne ki baat bhi karti hai — woh likhne wala hissa yahan nahi diya gaya.',
  },
  'friend-al-rahman': {
    title: 'Ya Rahman: rehem aur halal zarooratein poori hon',
    purpose: 'Rehem, aur halal zarooratein poori hon.',
    how: 'Jumme ko Asr ke baad, Qiblah ki taraf munh karke, suraj doobne tak "Ya Allah, ya Rahman" (Aye Sab se Zyada Meherban) dohrate rahein.',
  },
  'friend-al-quddus': {
    title: 'Ya Quddus: buri khwahishon ko shaant karna',
    purpose: 'Buri khwahishon ko shaant karna.',
    how: 'Shaanti se baithein. "Ya Quddus" (Aye Sab se Paak) dohrate rahein, aur sochein ke Allah paak hai aur har aib se door hai.',
  },
  'friend-al-salam': {
    title: 'Ya Salam: musibaton se hifazat',
    purpose: 'Musibaton se hifazat.',
    how: 'Shaanti se baithein. "Ya Salam" (Aye Aman dene wale) dohrate rahein, aur sochein ke Allah aman aur salaamti hai.',
  },
  'friend-al-aziz': {
    title: 'Ya Aziz: zillat aur darr se jeetna',
    purpose: 'Zillat aur darr se jeetna.',
    how: 'Shaanti se baithein. "Ya Aziz" (Aye Zabardast) dohrate rahein, aur sochein ke Allah zabardast aur izzat wala hai.',
  },
  'friend-al-wahhab': {
    title: 'Ya Wahhab: inaam maangna',
    purpose: 'Inaam maangna.',
    how: 'Shaanti se baithein. "Ya Wahhab" (Aye Dene wale) dohrate rahein, aur sochein ke Allah har inaam dene wala hai.',
  },
  'friend-al-razzaq': {
    title: 'Ya Razzaq: rozi',
    purpose: 'Rozi.',
    how: 'Namaz ke baad, shaanti se baithein. "Ya Razzaq" (Rozi dene wale) dohrate rahein, aur sochein ke Allah har rozi dene wala hai.',
  },
  'friend-al-fattah': {
    title: 'Ya Fattah: band darwaze khulna',
    purpose: 'Band darwaze khulna.',
    how: 'Shaanti se baithein. "Ya Fattah" (Aye Kholne wale) dohrate rahein, aur sochein ke Allah har band darwaza kholne wala hai.',
  },
  'friend-al-alim': {
    title: 'Ya Alim: hikmat bhari baat',
    purpose: 'Hikmat bhari baat.',
    how: 'Shaanti se baithein. "Ya Alim" (Aye Sab Jaane wale) dohrate rahein, aur sochein ke Allah sab kuch jaanne wala hai.',
  },
  'friend-al-qabid': {
    title: 'Ya Qabid: andar ki bhaari pan ko door karna',
    purpose: 'Andar ki bhaari pan ko door karna.',
    how: 'Shaanti se baithein. "Ya Qabid" (Aye Rokne wale) dohrate rahein, aur sochein ke Allah woh hai jo nuksan wali cheez rok deta hai.',
  },
  'friend-al-basit': {
    title: 'Ya Basit: aasani aur khula pan',
    purpose: 'Aasani aur khula pan.',
    how: 'Shaanti se baithein. "Ya Basit" (Aye Khula karne wale) dohrate rahein, aur sochein ke Allah kholta hai aur khula karta hai.',
  },
  'friend-al-rafi': {
    title: "Ya Rafi: kirdaar ki bulandi",
    purpose: 'Kirdaar ki bulandi.',
    how: 'Shaanti se baithein. "Ya Rafi\'" (Aye Buland karne wale) dohrate rahein, aur sochein ke Allah neeche wale ko buland karta hai.',
  },
  'friend-al-halim': {
    title: 'Ya Halim: gussa shaant karna',
    purpose: 'Gussa shaant karna.',
    how: 'Shaanti se baithein. "Ya Halim" (Aye Sabr karne wale) dohrate rahein, aur sochein ke Allah sabr karne wala aur bardasht karne wala hai.',
  },
  'friend-al-azim': {
    title: 'Ya Azim: pareshani door karna',
    purpose: 'Pareshani door karna.',
    how: 'Shaanti se baithein. "Ya Azim" (Aye Sab se Bade) dohrate rahein, aur sochein ke Allah bada aur azmat wala hai.',
  },
  'friend-al-shakur': {
    title: 'Ya Shakur: ne\'matein bachana',
    purpose: "Ne'matein bachana.",
    how: 'Shaanti se baithein. "Ya Shakur" (Aye Sab se Zyada Shukr karne wale) dohrate rahein, aur sochein ke Allah shukr karta hai aur badla deta hai.',
  },
  'friend-al-wadud': {
    title: 'Ya Wadud: rishton mein mohabbat',
    purpose: 'Rishton mein mohabbat.',
    how: 'Shaanti se baithein. "Ya Wadud" (Aye Sab se Zyada Mohabbat karne wale) dohrate rahein, aur sochein ke Allah mohabbat karta hai aur mohabbat ke layak hai.',
  },
  'friend-al-baith': {
    title: 'Ya Baith: hausla jagana',
    purpose: 'Hausla jagana.',
    how: 'Shaanti se baithein. "Ya Ba\'ith" (Aye Uthane wale) dohrate rahein, aur sochein ke Allah murdon aur sone walon ko jagata hai.',
  },
  'friend-al-haqq': {
    title: 'Ya Haqq: sach aur yaqeen',
    purpose: 'Sach aur yaqeen.',
    how: 'Shaanti se baithein. "Ya Haqq" (Aye Sach) dohrate rahein, aur sochein ke Allah woh sach hai jo kabhi nahi badalta.',
  },
  'friend-al-qawi': {
    title: 'Ya Qawi: bardasht aur taqat',
    purpose: 'Bardasht aur taqat.',
    how: 'Shaanti se baithein. "Ya Qawi" (Aye Sab se Zyada Taqatwar) dohrate rahein, aur sochein ke Allah har taqat se zyada taqatwar hai.',
  },
  'friend-al-matin': {
    title: 'Ya Matin: na hilaane wali mazbooti',
    purpose: 'Na hilaane wali mazbooti.',
    how: 'Shaanti se baithein. "Ya Matin" (Aye Mazboot), ya "Ya Qawiyyu ya Matin" (Aye Sab se Zyada Taqatwar, Aye Mazboot) dohrate rahein, aur sochein ke Allah mazboot aur na hilaane wala hai.',
  },
  'friend-al-wali': {
    title: 'Ya Wali: kamzor kaam Allah ke hawaale karna',
    purpose: 'Kamzor kaam Allah ki hifazat ke hawaale karna.',
    how: 'Bharose ke saath baithein. "Ya Wali" (Aye Hifazat karne wale, Aye Dost) dohrate rahein, aur sochein ke Allah hifazat karta hai.',
  },
  'friend-al-mubdi': {
    title: "Ya Mubdi': naye kaam ki salaamti",
    purpose: 'Naye kaam mein salaamti.',
    how: 'Thodi der shaanti se baithein. "Ya Mubdi\'" (Aye Paida karne wale) dohrate rahein, aur achhi shuruaat maangein.',
  },
  'friend-al-muhyi': {
    title: 'Ya Muhyi: sust dil ko jagana',
    purpose: 'Sust dil ko jagana.',
    how: 'Aankhein band karein. Dhyaan dil ki taraf le jaayein. Dheere se "Ya Muhyi" (Aye Zindagi dene wale) padhein.',
  },
  'friend-al-mumit': {
    title: 'Ya Mumit: buri aadat ko dabana',
    purpose: 'Buri aadat ko dabana.',
    how: 'Is amal ke sirf naam aur matlab abhi haath mein hain. Uske kadam abhi notebook chat mein hain, main unhe yahan daal dunga jab unhe nikaal lunga.',
    note: 'Abhi tak sirf naam nikaala gaya hai. Uske kadam abhi haath mein nahi hain.',
  },
  'friend-al-qayyum': {
    title: 'Ya Qayyum: bigde kaam sudharna, andar ki saafai',
    purpose: 'Bigde kaam sudharna aur andar ki saafai.',
    how: 'Tanhai mein shaant aur saaf dimaag se baithein. "Ya Qayyum" (Aye Khud Khada Rehne wale) padhein aur sochein ke sab kuch Allah hi sambhaale hue hai.',
  },
  'friend-al-sabur': {
    title: 'Ya Sabur: museebat mein sabr aur mazbooti',
    purpose: 'Museebat mein sabr aur mazbooti.',
    how: 'Shaanti se baithein. "Ya Sabur" (Aye Sab se Zyada Sabr karne wale) padhein aur mazbooti se sabr maangein.',
  },
};

const BN: AmalMap = {
  'buni-night-protection': { title: 'রাতের হেফাজত — ঘুমানোর আগে বিসমিল্লাহ ১২১ বার পড়ুন', purpose: 'ঘুমের সময় শয়তান, চুরি, হঠাৎ মৃত্যু ও বিপদ থেকে হেফাজত।', how: 'ঘুমানোর আগে "বিসমিল্লাহির রহমানির রহিম" (আল্লাহর নামে, যিনি পরম দয়ালু, অতি করুণাময়) ১২১ বার পড়ুন।' },
  'buni-provision-sunrise': { title: 'সূর্যোদয়ে রিজিক — বিসমিল্লাহ ৩০০ বার, তারপর ১০০ দরুদ', purpose: 'এমন জায়গা থেকে রিজিক ও জীবিকা, যেখানে আশাও করা যায় না।', how: 'সূর্য ওঠার সময় সূর্যের দিকে মুখ করে বিসমিল্লাহ ৩০০ বার পড়ুন, তারপর নবী মুহাম্মদের ওপর ১০০ বার দরুদ পড়ুন। বই বলে নিয়মিত করতে থাকুন।' },
  'buni-wish-friday': { title: 'জুমার দিন একটি ইচ্ছা — খুতবার সময় বিসমিল্লাহ ১১৩ বার পড়ুন', purpose: 'একটি গোপন ইচ্ছা যা আপনি পূরণ করতে চান।', how: 'জুমার দিন, ইমাম খুতবা দেওয়ার সময়, আপনার ইচ্ছা মনে রেখে বিসমিল্লাহ ১১৩ বার পড়ুন, তারপর হাত তুলে আল্লাহর কাছে চান।', note: 'বই বলে খুতবার সময় পড়তে। কিছু আলেম বলেন খুতবা নীরবে শোনা উচিত — বইয়ের কথা এখানে যেমন লেখা আছে তেমনই দেওয়া হল।' },
  'buni-aims-desires': { title: 'লক্ষ্য ও ইচ্ছা — ৭ দিন ধরে বিসমিল্লাহ ৭৮৬ বার পড়ুন', purpose: 'কোনো ভালো জিনিস পাওয়া যা আপনি চান, বা খারাপ কিছু দূরে রাখা।', how: 'প্রতিদিন বিসমিল্লাহ ৭৮৬ বার (এটা তার সংখ্যার মান) ৭ দিন ধরে পড়ুন, আপনার নির্দিষ্ট লক্ষ্য মনে রেখে।' },
  'buni-pain': { title: 'ব্যথা — ৩ দিন ধরে বিসমিল্লাহ ১০০ বার পড়ুন', purpose: 'ব্যথা থেকে মুক্তি।', how: 'ব্যথা হলে বিসমিল্লাহ ১০০ বার দিনে, ৩ দিন ধরে পড়ুন।' },
  'buni-oppressor': { title: 'জালিমের সামনে — বিসমিল্লাহ ৫০ বার পড়ুন', purpose: 'কোনো জালিম বা কঠোর, শক্তিশালী লোকের মুখোমুখি হলে নিরাপত্তা।', how: 'তাদের সামনে বিসমিল্লাহ ৫০ বার পড়ুন। বই বলে আল্লাহ তাদের মনে আপনার ভয় ঢুকিয়ে দেবেন আর আপনাকে বিপদ থেকে বাঁচাবেন।' },
  'buni-morning-evening': { title: 'সকাল-সন্ধ্যার হেফাজত — "বিসমিল্লাহিল আ\'জম" ৩ বার বলুন', purpose: 'সারাদিন ক্ষতি থেকে হেফাজত, আর রাতভর নিরাপত্তা।', how: 'জেগে উঠে "আল্লাহর নামে, যিনি সবচেয়ে মহান" (বিসমিল্লাহিল আ\'জম) ৩ বার বলুন। সন্ধ্যায় আবার ৩ বার বলুন।' },
  'buni-begin-prayer': { title: 'প্রতিটি নামাজ ও তিলাওয়াত বিসমিল্লাহ দিয়ে শুরু করুন', purpose: 'দুনিয়া ও আখিরাতে নিরাপত্তা, আর সহজ মৃত্যু ও কবর।', how: 'প্রতিটি নামাজ ও কুরআনের প্রতিটি তিলাওয়াত বিসমিল্লাহ দিয়ে শুরু করুন। বই বলে যে এটা করে তার প্রশ্নকারী ফেরেশতাদের ভয় নেই, আর আল্লাহ মৃত্যুর কষ্ট সহজ করে দেন ও কবর প্রশস্ত করে দেন।' },
  'buni-home-entry': { title: 'ঘরে ঢোকা ও বেরোনোর সময় বিসমিল্লাহ', purpose: 'ঘরে ও বাইরে নিরাপত্তা।', how: 'ঘরে ঢোকা ও বেরোনোর সময় বলুন: "আল্লাহর নামে আমরা ভেতরে আসি ও বাইরে যাই, আর আল্লাহর ওপর ভরসা করি।"' },
  'buni-before-sleep': { title: 'ঘুমানোর আগে বিসমিল্লাহ', purpose: 'রাতভর হেফাজত।', how: 'ঘুমানোর আগে বলুন: "বিসমিল্লাহ, আর আল্লাহর রাসূলের পথে।"' },
  'buni-ya-allah': { title: '"ইয়া আল্লাহ" ডাকুন আর যা দরকার চান', purpose: 'আল্লাহর কাছে যা কিছু দরকার।', how: '"ইয়া আল্লাহ" (হে আল্লাহ!) বলুন আর যা দরকার চান। বই বলে আল্লাহ উত্তর দেন: "আমি এখানে আছি, আমার বান্দা! আমিই আল্লাহ, তোমার কী দরকার?"' },
  'buni-hidden-name': { title: 'আল্লাহর লুকানো নামে একটি ছোট দোয়া', purpose: 'যেকোনো দরকার, আল্লাহর লুকানো নামে।', how: 'এই ছোট দোয়াটি পড়ুন: "হে আল্লাহ! আমি তোমার লুকানো নামে চাইছি: পবিত্র, পবিত্রকারী, পবিত্র, চিরজীবী, চিরস্থায়ী। আল্লাহর নামে, যিনি দয়ালু, করুণাময় — শক্তিশালী ও দানশীল।"' },
  'buni-important-matter': { title: 'একটি গুরুত্বপূর্ণ কাজের জন্য একটি ছোট দোয়া', purpose: 'একটি গুরুত্বপূর্ণ দরকার, আল্লাহকে বলা যাতে তিনি সব সামলে নেন।', how: 'বইয়ে লেখা লম্বা দোয়াটি পড়ুন, যা "হে আল্লাহ! আমি তোমার কাছে চাইছি, কারণ তুমিই আল্লাহ..." দিয়ে শুরু হয়। বই বলে এই দোয়ায় আল্লাহর সবচেয়ে বড় নাম আছে।' },
  'buni-ya-rahman-rahim': { title: 'ইয়া রহমান, ইয়া রহিম — মানুষের কাছ থেকে ভালো ব্যবহার পাওয়া', purpose: 'সব পরিস্থিতিতে মানুষের কাছ থেকে ভালো ব্যবহার পাওয়া।', how: 'আল-রহমান (দয়ালু) ও আল-রহিম (করুণাময়) — এই দুটি নাম প্রায়ই পড়ুন।' },
  'buni-ya-salam': { title: 'ইয়া সালাম — বিপদ থেকে হেফাজত', purpose: 'বিপদ থেকে হেফাজত।', how: 'আল-সালাম (শান্তি দানকারী) প্রায়ই পড়ুন।', note: 'বই এরপর আরও একটি দাবি করে (অচেতন হয়ে সাপ বা বিছু ধরলেও ক্ষতি হয় না)। সেই অংশ বাদ দেওয়া হয়েছে।' },
  'buni-ya-mumin': { title: "ইয়া মু'মিন, ১৩২ বার — গুরুতর অসুখ থেকে হেফাজত", purpose: 'মহামারি ও গুরুতর অসুখ থেকে হেফাজত।', how: "আল-মু'মিন (নিরাপত্তা দানকারী) ১৩২ বার নিয়মিত পড়ুন।" },
  'buni-ya-razzaq': { title: 'ইয়া রাজ্জাক — রিজিক', purpose: 'এমন জায়গা থেকে রিজিক ও জীবিকা, যেখানে আশাও করা যায় না।', how: 'আল-রাজ্জাক (রিজিক দানকারী) প্রায়ই পড়ুন।' },
  'buni-ya-wahhab': { title: 'ইয়া ওয়াহহাব — দোয়া কবুল হওয়া', purpose: 'দোয়া কবুল হওয়া।', how: 'আল-ওয়াহহাব (দানকারী) প্রায়ই পড়ুন।' },
  'buni-ya-alim': { title: "ইয়া 'আলিম — জ্ঞানের কথা বলা", purpose: 'জ্ঞানের সঙ্গে কথা বলা।', how: "আল-'আলিম (সব জানেন) প্রায়ই পড়ুন। বই বলে আল্লাহ আপনাকে জ্ঞানের কথা বলাবেন।" },
  'buni-ya-qahhar': { title: 'ইয়া কাহহার — নিজের ইচ্ছার ওপর নিয়ন্ত্রণ', purpose: 'নিজের কামনা ও ইচ্ছার ওপর নিয়ন্ত্রণ পাওয়া।', how: 'আল-কাহহার (বিজয়ী) প্রায়ই পড়ুন।' },
  'buni-ya-hafiz': { title: 'ইয়া হাফিজ — খারাপ ষড়যন্ত্র থেকে হেফাজত', purpose: 'খারাপ মানুষের ষড়যন্ত্র থেকে হেফাজত, যেখানেই যান।', how: 'আল-হাফিজ (হেফাজতকারী) প্রায়ই পড়ুন।' },
  'buni-ya-mujib': { title: 'ইয়া মুজিব — কষ্ট থেকে বেরোনোর পথ', purpose: 'যেকোনো কষ্ট থেকে বেরোনোর পথ খুঁজে পাওয়া।', how: 'আল-মুজিব (উত্তর দানকারী) প্রায়ই পড়ুন।' },
  'buni-ya-sabur': { title: 'ইয়া সাবুর — কঠিন সময়ে দৃঢ়তা', purpose: 'কষ্ট ও জীবনের সমস্যায় দৃঢ় থাকা।', how: 'আল-সাবুর (ধৈর্যশীল) প্রায়ই পড়ুন।' },
  'buni-surah-fath': { title: 'সূরা আল-ফাতহ (কুরআন ৪৮)-এর শুরু পড়ুন — বিজয় ও আল্লাহর সাহায্য', purpose: 'বিজয় ও আল্লাহর সাহায্য, যখন আপনি দুর্বল, পরাজিত বা কষ্টে থাকেন।', how: 'সূরা আল-ফাতহ (অধ্যায় ৪৮, "বিজয়")-এর শুরু পড়ুন। বই বলে এটা পড়লে দুর্বল শক্তিশালী হয়ে যায়, আর আল্লাহ এমনভাবে সাহায্য করেন যা আপনি কল্পনাও করতে পারবেন না।', note: 'বই বলে না "শুরু" মানে কতটি আয়াত। এর অন্য ব্যবহারে পার্চমেন্টে লেখা, পতাকা বা পেয়ালার কথা আছে — সেগুলো এখানে দেওয়া হয়নি।' },
  'buni-two-rakahs-maghrib': { title: 'মাগরিবের পর ২ রাকাত — যে আপনার ক্ষতি চায় তার থেকে হেফাজত', purpose: 'যে আপনাকে ধোঁকা দেবে বা ক্ষতি চায় বলে ভয়, তার থেকে হেফাজত।', how: 'মাগরিবের নামাজের পর ২ রাকাত পড়ুন: প্রথমে সূরা আল-ফাতিহা (১) ও সূরা আল-কাফিরুন (১০৯); দ্বিতীয়তে সূরা আল-ফাতিহা (১) ও সূরা আল-ফালাক (১১৩)। তারপর বলুন: "হে আল্লাহ, হে যথেষ্ট, আমাকে ওই লোকের ক্ষতি থেকে বাঁচাও।"', note: 'বই এরপর নাম লিখে পাগড়িতে রাখার কথাও বলে — সেই লেখার অংশ এখানে দেওয়া হয়নি।' },
  'friend-al-rahman': { title: 'ইয়া রহমান: দয়া ও হালাল প্রয়োজন পূরণ', purpose: 'দয়া, আর হালাল প্রয়োজন পূরণ।', how: 'জুমার দিন আসরের পর, কিবলার দিকে মুখ করে, সূর্য ডোবা পর্যন্ত "ইয়া আল্লাহ, ইয়া রহমান" (হে সবচেয়ে দয়ালু) বলতে থাকুন।' },
  'friend-al-quddus': { title: 'ইয়া কুদ্দুস: খারাপ ইচ্ছা শান্ত করা', purpose: 'খারাপ ইচ্ছা শান্ত করা।', how: 'শান্তভাবে বসুন। "ইয়া কুদ্দুস" (হে সবচেয়ে পবিত্র) বলতে থাকুন, আর ভাবুন আল্লাহ পবিত্র ও সব দোষ থেকে মুক্ত।' },
  'friend-al-salam': { title: 'ইয়া সালাম: বিপদ থেকে হেফাজত', purpose: 'বিপদ থেকে হেফাজত।', how: 'শান্তভাবে বসুন। "ইয়া সালাম" (হে শান্তি দানকারী) বলতে থাকুন, আর ভাবুন আল্লাহ শান্তি ও নিরাপত্তা।' },
  'friend-al-aziz': { title: 'ইয়া আজিজ: অপমান ও ভয় জয় করা', purpose: 'অপমান ও ভয় জয় করা।', how: 'শান্তভাবে বসুন। "ইয়া আজিজ" (হে মহাশক্তিমান) বলতে থাকুন, আর ভাবুন আল্লাহ শক্তিশালী ও সম্মানিত।' },
  'friend-al-wahhab': { title: 'ইয়া ওয়াহহাব: উপহার চাওয়া', purpose: 'উপহার চাওয়া।', how: 'শান্তভাবে বসুন। "ইয়া ওয়াহহাব" (হে দানকারী) বলতে থাকুন, আর ভাবুন আল্লাহ সব উপহার দানকারী।' },
  'friend-al-razzaq': { title: 'ইয়া রাজ্জাক: রিজিক', purpose: 'রিজিক।', how: 'নামাজের পর, শান্তভাবে বসুন। "ইয়া রাজ্জাক" (রিজিক দানকারী) বলতে থাকুন, আর ভাবুন আল্লাহ সব রিজিক দানকারী।' },
  'friend-al-fattah': { title: 'ইয়া ফাত্তাহ: বন্ধ দরজা খোলা', purpose: 'বন্ধ দরজা খোলা।', how: 'শান্তভাবে বসুন। "ইয়া ফাত্তাহ" (হে খোলনেওয়ালা) বলতে থাকুন, আর ভাবুন আল্লাহ প্রতিটি বন্ধ দরজা খুলে দেন।' },
  'friend-al-alim': { title: 'ইয়া আলিম: জ্ঞানের কথা', purpose: 'জ্ঞানের কথা।', how: 'শান্তভাবে বসুন। "ইয়া আলিম" (হে সর্বজ্ঞ) বলতে থাকুন, আর ভাবুন আল্লাহ সব কিছু জানেন।' },
  'friend-al-qabid': { title: 'ইয়া কাবিদ: ভেতরের ভার দূর করা', purpose: 'ভেতরের ভার দূর করা।', how: 'শান্তভাবে বসুন। "ইয়া কাবিদ" (হে আটকে রাখা) বলতে থাকুন, আর ভাবুন আল্লাহ ক্ষতিকর জিনিস আটকে রাখেন।' },
  'friend-al-basit': { title: 'ইয়া বাসিত: সহজতা ও প্রশস্ততা', purpose: 'সহজতা ও প্রশস্ততা।', how: 'শান্তভাবে বসুন। "ইয়া বাসিত" (হে প্রশস্তকারী) বলতে থাকুন, আর ভাবুন আল্লাহ খোলেন ও প্রশস্ত করেন।' },
  'friend-al-rafi': { title: "ইয়া রাফি': চরিত্রের উন্নতি", purpose: 'চরিত্রের উন্নতি।', how: 'শান্তভাবে বসুন। "ইয়া রাফি\'" (হে উঁচু করা) বলতে থাকুন, আর ভাবুন আল্লাহ নিচের জনকে উঁচু করেন।' },
  'friend-al-halim': { title: 'ইয়া হালিম: রাগ শান্ত করা', purpose: 'রাগ শান্ত করা।', how: 'শান্তভাবে বসুন। "ইয়া হালিম" (হে ধৈর্যশীল) বলতে থাকুন, আর ভাবুন আল্লাহ ধৈর্যশীল ও সহনশীল।' },
  'friend-al-azim': { title: 'ইয়া আজিম: উদ্বেগ দূর করা', purpose: 'উদ্বেগ দূর করা।', how: 'শান্তভাবে বসুন। "ইয়া আজিম" (হে মহান) বলতে থাকুন, আর ভাবুন আল্লাহ মহান ও গৌরবময়।' },
  'friend-al-shakur': { title: 'ইয়া শাকুর: নিয়ামত রক্ষা করা', purpose: 'নিয়ামত রক্ষা করা।', how: 'শান্তভাবে বসুন। "ইয়া শাকুর" (হে সবচেয়ে কৃতজ্ঞ) বলতে থাকুন, আর ভাবুন আল্লাহ কৃতজ্ঞতা প্রকাশ করেন ও পুরস্কার দেন।' },
  'friend-al-wadud': { title: 'ইয়া ওয়াদুদ: সম্পর্কে ভালোবাসা', purpose: 'সম্পর্কে ভালোবাসা।', how: 'শান্তভাবে বসুন। "ইয়া ওয়াদুদ" (হে সবচেয়ে ভালোবাসা) বলতে থাকুন, আর ভাবুন আল্লাহ ভালোবাসেন ও ভালোবাসার যোগ্য।' },
  'friend-al-baith': { title: "ইয়া বা'ইস: উৎসাহ জাগানো", purpose: 'উৎসাহ জাগানো।', how: 'শান্তভাবে বসুন। "ইয়া বা\'ইস" (হে জাগানো) বলতে থাকুন, আর ভাবুন আল্লাহ মৃত ও ঘুমন্তদের জাগান।' },
  'friend-al-haqq': { title: 'ইয়া হাক্ক: সত্য ও বিশ্বাস', purpose: 'সত্য ও বিশ্বাস।', how: 'শান্তভাবে বসুন। "ইয়া হাক্ক" (হে সত্য) বলতে থাকুন, আর ভাবুন আল্লাহ সেই সত্য যা কখনো বদলায় না।' },
  'friend-al-qawi': { title: 'ইয়া কাভি: সহনশীলতা', purpose: 'সহনশীলতা।', how: 'শান্তভাবে বসুন। "ইয়া কাভি" (হে সবচেয়ে শক্তিশালী) বলতে থাকুন, আর ভাবুন আল্লাহ সব শক্তির চেয়ে শক্তিশালী।' },
  'friend-al-matin': { title: 'ইয়া মাতিন: অটল দৃঢ়তা', purpose: 'অটল দৃঢ়তা।', how: 'শান্তভাবে বসুন। "ইয়া মাতিন" (হে দৃঢ়), বা "ইয়া কাভিয়্যু ইয়া মাতিন" (হে সবচেয়ে শক্তিশালী, হে দৃঢ়) বলতে থাকুন, আর ভাবুন আল্লাহ দৃঢ় ও অটল।' },
  'friend-al-wali': { title: 'ইয়া ওয়ালি: দুর্বল বিষয় আল্লাহর হেফাজতে দেওয়া', purpose: 'দুর্বল বিষয় আল্লাহর হেফাজতে দেওয়া।', how: 'আস্থা নিয়ে বসুন। "ইয়া ওয়ালি" (হে রক্ষক, হে বন্ধু) বলতে থাকুন, আর ভাবুন আল্লাহ রক্ষা করেন।' },
  'friend-al-mubdi': { title: "ইয়া মুবদি': নতুন কাজে নিরাপত্তা", purpose: 'নতুন কাজে নিরাপত্তা।', how: 'অল্পক্ষণ শান্তভাবে বসুন। "ইয়া মুবদি\'" (হে সৃষ্টির সূচনাকারী) বলতে থাকুন, আর ভালো শুরু চান।' },
  'friend-al-muhyi': { title: 'ইয়া মুহয়ি: নিস্তেজ মন জাগানো', purpose: 'নিস্তেজ মন জাগানো।', how: 'চোখ বন্ধ করুন। মনোযোগ হৃদয়ের দিকে নিন। আস্তে "ইয়া মুহয়ি" (হে জীবন দানকারী) পড়ুন।' },
  'friend-al-mumit': { title: 'ইয়া মুমিত: খারাপ অভ্যাস দমন করা', purpose: 'খারাপ অভ্যাস দমন করা।', how: 'এই আমলের শুধু নাম ও উদ্দেশ্য এখন হাতে আছে। এর ধাপগুলো এখনো নোটবুক চ্যাটে আছে, আমি সেগুলো বের করে এখানে যোগ করব।', note: 'এখনো শুধু নাম বের করা হয়েছে। ধাপগুলো হাতে নেই।' },
  'friend-al-qayyum': { title: 'ইয়া কাইয়্যুম: এলোমেলো কাজ ঠিক করা, ভেতরের স্বচ্ছতা', purpose: 'এলোমেলো কাজ ঠিক করা ও ভেতরের স্বচ্ছতা।', how: 'নির্জনে শান্ত ও স্থির মন নিয়ে বসুন। "ইয়া কাইয়্যুম" (হে স্বয়ংসম্পূর্ণ) পড়ুন আর ভাবুন সব কিছু আল্লাহই ধরে রেখেছেন।' },
  'friend-al-sabur': { title: 'ইয়া সাবুর: পরীক্ষায় ধৈর্য ও দৃঢ়তা', purpose: 'পরীক্ষায় ধৈর্য ও দৃঢ়তা।', how: 'শান্তভাবে বসুন। "ইয়া সাবুর" (হে সবচেয়ে ধৈর্যশীল) পড়ুন আর দৃঢ় ধৈর্য চান।' },
};

const UR: AmalMap = {
  'buni-night-protection': { title: 'رات کی حفاظت — سونے سے پہلے بسم اللہ 121 بار پڑھیں', purpose: 'سوتے وقت شیطان، چوری، اچانک موت اور مصیبت سے حفاظت۔', how: 'سونے سے پہلے "بسم اللہ الرحمن الرحیم" (اللہ کے نام سے، جو بڑا مہربان، نہایت رحم والا ہے) 121 بار پڑھیں۔' },
  'buni-provision-sunrise': { title: 'سورج نکلتے وقت رزق — بسم اللہ 300 بار، پھر 100 درود', purpose: 'ایسی جگہ سے رزق اور گزارا، جہاں سے امید بھی نہ ہو۔', how: 'سورج نکلتے وقت، سورج کی طرف منہ کر کے، بسم اللہ 300 بار پڑھیں، پھر نبی محمد پر 100 بار درود بھیجیں۔ کتاب کہتی ہے اسے روز کرتے رہو۔' },
  'buni-wish-friday': { title: 'جمعے کو ایک خواہش — خطبے کے وقت بسم اللہ 113 بار پڑھیں', purpose: 'ایک چھپی ہوئی خواہش جو آپ پوری کروانا چاہتے ہو۔', how: 'جمعے کو، جب امام خطبہ دے رہا ہو، اپنی خواہش دل میں رکھ کر بسم اللہ 113 بار پڑھیں، پھر ہاتھ اٹھا کر اللہ سے مانگیں۔', note: 'کتاب کہتی ہے خطبے کے وقت پڑھیں۔ کچھ عالم کہتے ہیں خطبہ خاموشی سے سننا چاہیے — کتاب کی بات یہاں جیسی لکھی ہے ویسی ہی دی گئی ہے۔' },
  'buni-aims-desires': { title: 'مقصد اور خواہشیں — 7 دن تک بسم اللہ 786 بار پڑھیں', purpose: 'کوئی اچھی چیز پانا جو آپ چاہتے ہو، یا کوئی بری چیز دور رکھنا۔', how: 'ہر روز بسم اللہ 786 بار (یہ اس کی عددی قیمت ہے) 7 دن تک پڑھیں، اپنا خاص مقصد دل میں رکھ کر۔' },
  'buni-pain': { title: 'درد — 3 دن تک بسم اللہ 100 بار پڑھیں', purpose: 'درد سے آرام۔', how: 'اگر درد ہے، تو بسم اللہ 100 بار روز 3 دن تک پڑھیں۔' },
  'buni-oppressor': { title: 'ظالم کے سامنے — بسم اللہ 50 بار پڑھیں', purpose: 'جب کسی ظالم یا سخت، طاقتور شخص کے سامنے آؤ تو حفاظت۔', how: 'ان کے سامنے بسم اللہ 50 بار پڑھیں۔ کتاب کہتی ہے اللہ ان کے دل میں آپ کا خوف ڈال دے گا اور آپ کو خطرے سے بچا لے گا۔' },
  'buni-morning-evening': { title: 'صبح شام کی حفاظت — "بسم اللہ الاعظم" 3 بار کہیں', purpose: 'پورے دن نقصان سے حفاظت، اور رات بھر کی سلامتی۔', how: 'جاگتے ہی "اللہ کے نام سے، جو سب سے بڑا ہے" (بسم اللہ الاعظم) 3 بار کہیں۔ شام کو پھر 3 بار کہیں۔' },
  'buni-begin-prayer': { title: 'ہر نماز اور تلاوت بسم اللہ سے شروع کریں', purpose: 'دنیا اور آخرت میں سلامتی، اور آسان موت اور قبر۔', how: 'ہر نماز اور قرآن کی ہر تلاوت بسم اللہ سے شروع کریں۔ کتاب کہتی ہے جو ایسا کرتا ہے اسے سوال کرنے والے فرشتوں کا کوئی خوف نہیں، اور اللہ موت کی تکلیف آسان کر دیتا ہے اور قبر کھلی کر دیتا ہے۔' },
  'buni-home-entry': { title: 'گھر میں آتے جاتے بسم اللہ', purpose: 'گھر میں اور باہر سلامتی۔', how: 'گھر میں آتے اور جاتے وقت کہیں: "اللہ کے نام سے ہم اندر آتے ہیں اور باہر جاتے ہیں، اور اللہ پر بھروسہ کرتے ہیں۔"' },
  'buni-before-sleep': { title: 'سونے سے پہلے بسم اللہ', purpose: 'رات بھر کی حفاظت۔', how: 'سونے سے پہلے کہیں: "بسم اللہ، اور اللہ کے رسول کے راستے پر۔"' },
  'buni-ya-allah': { title: '"یا اللہ" پکاریں اور جو چاہیے مانگیں', purpose: 'اللہ سے جو کچھ بھی چاہیے۔', how: '"یا اللہ" (اے اللہ!) کہیں اور جو چاہیے مانگیں۔ کتاب کہتی ہے اللہ جواب دیتا ہے: "میں یہاں ہوں، میرے بندے! میں اللہ ہوں، تو تمہیں کیا چاہیے؟"' },
  'buni-hidden-name': { title: 'اللہ کے چھپے نام سے ایک چھوٹی دعا', purpose: 'کوئی بھی ضرورت، اللہ کے چھپے نام سے۔', how: 'یہ چھوٹی دعا پڑھیں: "اے اللہ! میں تجھ سے تیرے چھپے نام سے مانگتا ہوں: پاک، پاک کرنے والا، مقدس، ہمیشہ زندہ، ہمیشہ رہنے والا۔ اللہ کے نام سے، جو مہربان، رحم والا ہے — زبردست اور سخی۔"' },
  'buni-important-matter': { title: 'ایک اہم کام کے لیے ایک چھوٹی دعا', purpose: 'ایک اہم ضرورت، اللہ سے کہنا کہ وہ سب سنبھال لے۔', how: 'کتاب میں لکھی لمبی دعا پڑھیں، جو "اے اللہ! میں تجھ سے مانگتا ہوں، کیونکہ تو ہی اللہ ہے..." سے شروع ہوتی ہے۔ کتاب کہتی ہے اس دعا میں اللہ کا سب سے بڑا نام ہے۔' },
  'buni-ya-rahman-rahim': { title: 'یا رحمان، یا رحیم — لوگوں سے اچھا سلوک پائیں', purpose: 'ہر حال میں لوگوں سے اچھا سلوک پانا۔', how: 'الرحمان (مہربان) اور الرحیم (رحم والا) — یہ دو نام اکثر پڑھیں۔' },
  'buni-ya-salam': { title: 'یا سلام — مصیبت سے حفاظت', purpose: 'مصیبتوں سے حفاظت۔', how: 'السلام (امن دینے والا) اکثر پڑھیں۔', note: 'کتاب اس کے بعد ایک اور دعویٰ بھی کرتی ہے (بے ہوش ہو کر سانپ یا بچھو کو بغیر نقصان چھونا)۔ وہ حصہ چھوڑ دیا گیا ہے۔' },
  'buni-ya-mumin': { title: 'یا مومن، 132 بار — بڑی بیماری سے حفاظت', purpose: 'وبا اور بڑی بیماری سے حفاظت۔', how: 'المومن (امن دینے والا) 132 بار روز پڑھیں۔' },
  'buni-ya-razzaq': { title: 'یا رزاق — رزق', purpose: 'ایسی جگہ سے رزق اور گزارا، جہاں سے امید بھی نہ ہو۔', how: 'الرزاق (رزق دینے والا) اکثر پڑھیں۔' },
  'buni-ya-wahhab': { title: 'یا وہاب — دعائیں قبول ہوں', purpose: 'دعاؤں کا قبول ہونا۔', how: 'الوہاب (دینے والا) اکثر پڑھیں۔' },
  'buni-ya-alim': { title: 'یا علیم — حکمت بھری باتیں بولیں', purpose: 'حکمت سے بولنا۔', how: 'العلیم (سب جاننے والا) اکثر پڑھیں۔ کتاب کہتی ہے اللہ آپ کو حکمت بھری باتیں بلوائے گا۔' },
  'buni-ya-qahhar': { title: 'یا قہار — اپنی خواہشوں پر قابو', purpose: 'اپنی نفس اور خواہشوں پر قابو پانا۔', how: 'القہار (غالب آنے والا) اکثر پڑھیں۔' },
  'buni-ya-hafiz': { title: 'یا حفیظ — بری چالوں سے حفاظت', purpose: 'برے لوگوں کی چالوں سے حفاظت، جہاں بھی جائیں۔', how: 'الحفیظ (حفاظت کرنے والا) اکثر پڑھیں۔' },
  'buni-ya-mujib': { title: 'یا مجیب — مشکل سے نکلنے کا راستہ', purpose: 'کسی بھی مشکل سے نکلنے کا راستہ ملنا۔', how: 'المجیب (جواب دینے والا) اکثر پڑھیں۔' },
  'buni-ya-sabur': { title: 'یا صبور — مشکل وقت میں مضبوطی', purpose: 'مشکل اور زندگی کی پریشانیوں میں مضبوط رہنا۔', how: 'الصبور (صبر کرنے والا) اکثر پڑھیں۔' },
  'buni-surah-fath': { title: 'سورۃ الفتح (قرآن 48) کی شروعات پڑھیں — جیت اور اللہ کی مدد', purpose: 'جیت اور اللہ کی مدد، جب آپ کمزور، ہارے ہوئے یا مشکل میں ہوں۔', how: 'سورۃ الفتح (سورۃ 48، "جیت") کی شروعات پڑھیں۔ کتاب کہتی ہے اس سے پڑھنے سے کمزور طاقتور بن جاتا ہے، اور اللہ ایسے طریقے سے مدد کرتا ہے جو آپ سوچ بھی نہیں سکتے۔', note: 'کتاب نہیں کہتی "شروعات" کا مطلب کتنی آیتیں ہیں۔ اس میں پارچمنٹ پر لکھنے، جھنڈا یا پیالے والے طریقے بھی ہیں — وہ یہاں نہیں دیے گئے۔' },
  'buni-two-rakahs-maghrib': { title: 'مغرب کے بعد 2 رکعت — اس شخص سے حفاظت جو آپ کا برا چاہتا ہو', purpose: 'اس شخص سے حفاظت جس سے آپ کو دھوکے یا برائی کا ڈر ہو۔', how: 'مغرب کی نماز کے بعد 2 رکعت پڑھیں: پہلی میں سورۃ الفاتحہ (1) اور سورۃ الکافرون (109)؛ دوسری میں سورۃ الفاتحہ (1) اور سورۃ الفلق (113)۔ پھر کہیں: "اے اللہ، اے کافی، مجھے اس شخص کی برائی سے بچا لے۔"', note: 'کتاب اس کے بعد نام لکھ کر پگڑی میں رکھنے کی بات بھی کرتی ہے — وہ لکھنے والا حصہ یہاں نہیں دیا گیا۔' },
  'friend-al-rahman': { title: 'یا رحمان: رحم اور حلال ضرورتیں پوری ہوں', purpose: 'رحم، اور حلال ضرورتیں پوری ہوں۔', how: 'جمعے کو عصر کے بعد، قبلہ کی طرف منہ کر کے، سورج ڈوبنے تک "یا اللہ، یا رحمان" (اے سب سے زیادہ مہربان) دہراتے رہیں۔' },
  'friend-al-quddus': { title: 'یا قدوس: بری خواہشوں کو شانتی کرنا', purpose: 'بری خواہشوں کو شانتی کرنا۔', how: 'شانتی سے بیٹھیں۔ "یا قدوس" (اے سب سے پاک) دہراتے رہیں، اور سوچیں کہ اللہ پاک ہے اور ہر عیب سے دور ہے۔' },
  'friend-al-salam': { title: 'یا سلام: مصیبتوں سے حفاظت', purpose: 'مصیبتوں سے حفاظت۔', how: 'شانتی سے بیٹھیں۔ "یا سلام" (اے امن دینے والے) دہراتے رہیں، اور سوچیں کہ اللہ امن اور سلامتی ہے۔' },
  'friend-al-aziz': { title: 'یا عزیز: ذلت اور ڈر سے جیتنا', purpose: 'ذلت اور ڈر سے جیتنا۔', how: 'شانتی سے بیٹھیں۔ "یا عزیز" (اے زبردست) دہراتے رہیں، اور سوچیں کہ اللہ زبردست اور عزت والا ہے۔' },
  'friend-al-wahhab': { title: 'یا وہاب: انعام مانگنا', purpose: 'انعام مانگنا۔', how: 'شانتی سے بیٹھیں۔ "یا وہاب" (اے دینے والے) دہراتے رہیں، اور سوچیں کہ اللہ ہر انعام دینے والا ہے۔' },
  'friend-al-razzaq': { title: 'یا رزاق: رزق', purpose: 'رزق۔', how: 'نماز کے بعد، شانتی سے بیٹھیں۔ "یا رزاق" (رزق دینے والا) دہراتے رہیں، اور سوچیں کہ اللہ ہر رزق دینے والا ہے۔' },
  'friend-al-fattah': { title: 'یا فتاح: بند دروازے کھلنا', purpose: 'بند دروازے کھلنا۔', how: 'شانتی سے بیٹھیں۔ "یا فتاح" (اے کھولنے والے) دہراتے رہیں، اور سوچیں کہ اللہ ہر بند دروازا کھولنے والا ہے۔' },
  'friend-al-alim': { title: 'یا علیم: حکمت بھری بات', purpose: 'حکمت بھری بات۔', how: 'شانتی سے بیٹھیں۔ "یا علیم" (اے سب جاننے والے) دہراتے رہیں، اور سوچیں کہ اللہ سب کچھ جاننے والا ہے۔' },
  'friend-al-qabid': { title: 'یا قابض: اندر کی بھاری پن کو دور کرنا', purpose: 'اندر کی بھاری پن کو دور کرنا۔', how: 'شانتی سے بیٹھیں۔ "یا قابض" (اے روکنے والے) دہراتے رہیں، اور سوچیں کہ اللہ وہ ہے جو نقصان والی چیز روک دیتا ہے۔' },
  'friend-al-basit': { title: 'یا باسط: آسانی اور کھلا پن', purpose: 'آسانی اور کھلا پن۔', how: 'شانتی سے بیٹھیں۔ "یا باسط" (اے کھلا کرنے والے) دہراتے رہیں، اور سوچیں کہ اللہ کھولتا ہے اور کھلا کرتا ہے۔' },
  'friend-al-rafi': { title: 'یا رافع: کردار کی بلندی', purpose: 'کردار کی بلندی۔', how: 'شانتی سے بیٹھیں۔ "یا رافع" (اے بلند کرنے والے) دہراتے رہیں، اور سوچیں کہ اللہ نیچے والے کو بلند کرتا ہے۔' },
  'friend-al-halim': { title: 'یا حلیم: غصہ شانتی کرنا', purpose: 'غصہ شانتی کرنا۔', how: 'شانتی سے بیٹھیں۔ "یا حلیم" (اے صبر کرنے والے) دہراتے رہیں، اور سوچیں کہ اللہ صبر کرنے والا اور برداشت کرنے والا ہے۔' },
  'friend-al-azim': { title: 'یا عظیم: پریشانی دور کرنا', purpose: 'پریشانی دور کرنا۔', how: 'شانتی سے بیٹھیں۔ "یا عظیم" (اے سب سے بڑے) دہراتے رہیں، اور سوچیں کہ اللہ بڑا اور عظمت والا ہے۔' },
  'friend-al-shakur': { title: 'یا شکور: نعمتیں بچانا', purpose: 'نعمتیں بچانا۔', how: 'شانتی سے بیٹھیں۔ "یا شکور" (اے سب سے زیادہ شکر کرنے والے) دہراتے رہیں، اور سوچیں کہ اللہ شکر کرتا ہے اور بدلہ دیتا ہے۔' },
  'friend-al-wadud': { title: 'یا ودود: رشتوں میں محبت', purpose: 'رشتوں میں محبت۔', how: 'شانتی سے بیٹھیں۔ "یا ودود" (اے سب سے زیادہ محبت کرنے والے) دہراتے رہیں، اور سوچیں کہ اللہ محبت کرتا ہے اور محبت کے لائق ہے۔' },
  'friend-al-baith': { title: 'یا باعث: حوصلہ جگانا', purpose: 'حوصلہ جگانا۔', how: 'شانتی سے بیٹھیں۔ "یا باعث" (اے اٹھانے والے) دہراتے رہیں، اور سوچیں کہ اللہ مردوں اور سونے والوں کو جگاتا ہے۔' },
  'friend-al-haqq': { title: 'یا حق: سچ اور یقین', purpose: 'سچ اور یقین۔', how: 'شانتی سے بیٹھیں۔ "یا حق" (اے سچ) دہراتے رہیں، اور سوچیں کہ اللہ وہ سچ ہے جو کبھی نہیں بدلتا۔' },
  'friend-al-qawi': { title: 'یا قوی: برداشت اور طاقت', purpose: 'برداشت اور طاقت۔', how: 'شانتی سے بیٹھیں۔ "یا قوی" (اے سب سے زیادہ طاقتور) دہراتے رہیں، اور سوچیں کہ اللہ ہر طاقت سے زیادہ طاقتور ہے۔' },
  'friend-al-matin': { title: 'یا متین: نہ ہلانے والی مضبوطی', purpose: 'نہ ہلانے والی مضبوطی۔', how: 'شانتی سے بیٹھیں۔ "یا متین" (اے مضبوط)، یا "یا قوی یا متین" (اے سب سے زیادہ طاقتور، اے مضبوط) دہراتے رہیں، اور سوچیں کہ اللہ مضبوط اور نہ ہلانے والا ہے۔' },
  'friend-al-wali': { title: 'یا ولی: کمزور کام اللہ کے حوالے کرنا', purpose: 'کمزور کام اللہ کی حفاظت کے حوالے کرنا۔', how: 'بھروسے کے ساتھ بیٹھیں۔ "یا ولی" (اے حفاظت کرنے والے، اے دوست) دہراتے رہیں، اور سوچیں کہ اللہ حفاظت کرتا ہے۔' },
  'friend-al-mubdi': { title: 'یا مبدی: نئے کام کی سلامتی', purpose: 'نئے کام میں سلامتی۔', how: 'تھوڑی دیر شانتی سے بیٹھیں۔ "یا مبدی" (اے پیدا کرنے والے) دہراتے رہیں، اور اچھی شروعات مانگیں۔' },
  'friend-al-muhyi': { title: 'یا محیی: سست دل کو جگانا', purpose: 'سست دل کو جگانا۔', how: 'آنکھیں بند کریں۔ دھیان دل کی طرف لے جائیں۔ دھیرے سے "یا محیی" (اے زندگی دینے والے) پڑھیں۔' },
  'friend-al-mumit': { title: 'یا ممیت: بری عادت کو دبانا', purpose: 'بری عادت کو دبانا۔', how: 'اس عمل کے صرف نام اور مطلب ابھی ہاتھ میں ہیں۔ اس کے قدم ابھی نوٹ بک چیٹ میں ہیں، میں انھیں یہاں ڈال دوں گا جب انھیں نکال لوں گا۔', note: 'ابھی تک صرف نام نکالا گیا ہے۔ اس کے قدم ابھی ہاتھ میں نہیں ہیں۔' },
  'friend-al-qayyum': { title: 'یا قیوم: بگڑے کام سدھارنا، اندر کی صفائی', purpose: 'بگڑے کام سدھارنا اور اندر کی صفائی۔', how: 'تنہائی میں شانت اور صاف دماغ سے بیٹھیں۔ "یا قیوم" (اے خود کھڑا رہنے والے) پڑھیں اور سوچیں کہ سب کچھ اللہ ہی سنبھالے ہوئے ہے۔' },
  'friend-al-sabur': { title: 'یا صبور: مصیبت میں صبر اور مضبوطی', purpose: 'مصیبت میں صبر اور مضبوطی۔', how: 'شانتی سے بیٹھیں۔ "یا صبور" (اے سب سے زیادہ صبر کرنے والے) پڑھیں اور مضبوطی سے صبر مانگیں۔' },
};

const CHAPTER_TITLES: Record<SiteLanguage, Record<string, string>> = {
  en: {},
  hi: {
    'Chapter 5': 'Bismillah ke raaz',
    'Chapter 8': 'Chaar mausam — Allah ke naam',
    'Chapter 10': 'Aazmaaye hue talismans ki ek chhoti list',
  },
  bn: {
    'Chapter 5': 'বিসমিল্লাহর রহস্য',
    'Chapter 8': 'চার ঋতু — আল্লাহর নাম',
    'Chapter 10': 'পরীক্ষিত তাবিজের একটি ছোট তালিকা',
  },
  ur: {
    'Chapter 5': 'بسم اللہ کے راز',
    'Chapter 8': 'چار موسم — اللہ کے نام',
    'Chapter 10': 'آزمائے ہوئے تعویذوں کی ایک چھوٹی فہرست',
  },
};

/** The John Friend warning on the Amals page, in the reader's language. */
export const FRIEND_WARNING: Record<SiteLanguage, string> = {
  en: 'These are historical curiosities from an ancient medieval grimoire. Do them entirely at your own risk. They do not replace professional medical, mental health or financial care.',
  hi: 'Yeh ek purani madhyakaaleen kitab ki aitihasik dilchasp baatein hain. Inhe poori tarah apne risk par karein. Yeh doctor, mental health ya paise ki madad ki jagah nahi le sakti.',
  bn: 'এগুলো একটি প্রাচীন মধ্যযুগীয় গ্রিমোয়ার থেকে নেওয়া ঐতিহাসিক কৌতূহল। সম্পূর্ণ নিজের ঝুঁকিতে করুন। এগুলো পেশাদার চিকিৎসা, মানসিক স্বাস্থ্য বা আর্থিক সাহায্যের বিকল্প নয়।',
  ur: 'یہ ایک قدیم قرون وسطیٰ کی کتاب کی تاریخی دلچسپ باتیں ہیں۔ انھیں مکمل طور پر اپنے خطرے پر کریں۔ یہ پیشہ ورانہ طبی، ذہنی صحت یا مالی مدد کی جگہ نہیں لے سکتیں۔',
};

const MAPS: Record<SiteLanguage, AmalMap> = { en: {}, hi: HI, bn: BN, ur: UR };

export interface AmalLike {
  id: string;
  title: string;
  purpose: string;
  how: string;
  note?: string;
}

/** Localised title/purpose/how/note for one amal, falling back to English. */
export function localizeAmal<T extends AmalLike>(amal: T, lang: SiteLanguage): AmalText {
  const entry = MAPS[lang]?.[amal.id] ?? {};
  return {
    title: entry.title ?? amal.title,
    purpose: entry.purpose ?? amal.purpose,
    how: entry.how ?? amal.how,
    note: entry.note ?? amal.note,
  };
}

export function localizeChapterTitle(chapter: string, title: string, lang: SiteLanguage): string {
  const t = CHAPTER_TITLES[lang]?.[chapter];
  return t ? `${chapter} — ${t}` : `${chapter} — ${title}`;
}
