/**
 * Topics-area strings: Topics hub, topic pages, Questions, Study
 * Guides, and the Instagram request / question / comment box.
 *
 * English is primary. Hinglish (Roman Hindi/Urdu, reel voice) and
 * Bengali (easy familiar words) are hand-written, never machine
 * translated. Arabic, transliteration, Quran quotes, book titles,
 * personal names, sources and the @ghayb.chronicles handle never change.
 *
 * Merged into the base dict by the parent (src/data/i18n.ts).
 * Every key here exists in all three languages. `tt` falls back to
 * English, then to the key itself, so a missing string can never
 * crash a page.
 */
import type { SiteLanguage } from '../types';

export const I18N_TOPICS: Record<SiteLanguage, Record<string, string>> = {
  en: {
    // ---- Topics chrome (hub + topic pages) ----
    'topics.back': 'Topics',
    'topics.studyNote':
      'These discussions are for study only. They do not promise any outcome, and they give no religious ruling. Read them slowly, and check the sources named at the end.',
    'topics.studyNoteHub':
      'These discussions are for study only. They do not promise any outcome, and they give no religious ruling. Read them slowly, and check the sources named at the end of each one.',
    'topics.intro': 'Introduction',
    'topics.wordsUsed': 'Words used here',
    'topics.closing': 'Closing',
    'topics.sources': 'Sources',
    'topics.sourceLabel': 'Source: ',
    'topics.sourcesLabel': 'Sources: ',
    'topics.whatOthersSaid': 'What others said',
    'topics.anonymous': 'Anonymous',
    'topics.hubTitle': 'Topics',
    'topics.hubSubtitle':
      'Longer discussions, gathered from the books with their sources named. {count} topics so far.',
    'topics.topicOfDay': 'Topic of the Day',
    'topics.dayLabel': 'Day {day} · {date}',
    'topics.readToday': "Read today's topic",
    'topics.dailyNote':
      'A new topic every day, in the order the topics were made. Day 1 is the first topic. When the list ends, it starts again.',
    'topics.readDiscussion': 'Read the discussion',
    'topics.guidesEyebrow': 'Study Guides',
    'topics.guidesTitle': 'Study guides, in full',
    'topics.guidesDesc':
      'Short practical guides for the seeker, gathered from the books with their sources named. All six guides on one page.',
    'topics.readGuides': 'Read the guides',
    'topics.questionsEyebrow': 'Questions',
    'topics.questionsTitle': 'Questions, answered',
    'topics.questionsDesc':
      'Short answers to common questions, with the source named for every answer. New answers get added here, so check back.',
    'topics.readQuestions': 'Read the questions',

    // ---- Questions ----
    'questions.title': 'Questions',
    'questions.subtitle': 'Short answers to common questions, with the source named for every answer.',
    'questions.studyNote':
      'These answers are for study only. They do not promise any outcome, and they give no religious ruling. New answers get added here, so check back.',
    'questions.readFull': 'Read the full discussion',

    // ---- Study Guides ----
    'guides.title': 'Study Guides',
    'guides.subtitle':
      'Short practical guides for the seeker, gathered from the books with their sources named. {count} guides so far.',
    'guides.studyNote':
      'These guides are for study only. They do not promise any outcome, and they give no religious ruling. Read them slowly, and check the sources named at the end of each one.',
    'guides.onThisPage': 'Guides on this page',

    // ---- Instagram send box ----
    'sendbox.instagramName': 'Your Instagram name (optional)',
    'sendbox.postAnonymous': 'Post as anonymous',
    'sendbox.send': 'Send',
    'sendbox.sending': 'Sending…',
    'sendbox.copied': 'Copied. Paste it in the Instagram chat that just opened.',
    'sendbox.copyFailed':
      'Copy did not work on this device. Copy the text below and paste it in the Instagram chat.',
    'sendbox.copyTextLabel': 'Text to copy',
    'sendbox.orSend': 'Or send it on Instagram: ',
    'sendbox.topicWant': 'Topic I want',
    'sendbox.myQuestion': 'My question',
    'sendbox.commentOn': 'Comment on {label}',
    'sendbox.requestTitle': 'Request a topic',
    'sendbox.requestLabel': 'The topic you want',
    'sendbox.requestPlaceholder': 'Write the topic you want to read about.',
    'sendbox.requestNote':
      'New topics come from requests like yours. Write the topic you want, with your Instagram name if you want to show who you are, or post as anonymous.',
    'sendbox.requestDone':
      'Thanks. Your request is saved. New topics get added to this page in the order they were made.',
    'sendbox.askTitle': 'Ask a question',
    'sendbox.askLabel': 'Your question',
    'sendbox.askPlaceholder': 'What do you want to know?',
    'sendbox.askNote':
      'Send your question with your Instagram name, or post as anonymous. If you give your name, the answer comes back to you on Instagram too. New answers get added here so others can read them too.',
    'sendbox.askDone':
      'Thanks. Your question is saved. The answer will come back to you on Instagram, and it will be added here too.',
    'sendbox.commentTitle': 'Comments and wants',
    'sendbox.commentLabel': 'Your comment, or a topic you need',
    'sendbox.commentPlaceholder': 'Share a thought on this topic, or write a topic you need.',
    'sendbox.commentNote': 'Good comments and answered wants get added to this page.',
    'sendbox.commentDone':
      'Thanks. Your note is saved. Good comments and answered wants get added to this page.',
  },
  hi: {
    // ---- Topics chrome (hub + topic pages) ----
    'topics.back': 'Topics',
    'topics.studyNote':
      'Yeh guftagu sirf padhai ke liye hai. Yeh kisi nateeje ka wada nahi karti, aur koi mazhabi faisla nahi deti. Aahista padho, aur aakhir mein diye gaye sources ko check karo.',
    'topics.studyNoteHub':
      'Yeh guftagu sirf padhai ke liye hai. Yeh kisi nateeje ka wada nahi karti, aur koi mazhabi faisla nahi deti. Aahista padho, aur har ek ke aakhir mein diye gaye sources ko check karo.',
    'topics.intro': 'Shuruaat',
    'topics.wordsUsed': 'Yahan istemal hue lafz',
    'topics.closing': 'Aakhri baat',
    'topics.sources': 'Sources',
    'topics.sourceLabel': 'Source: ',
    'topics.sourcesLabel': 'Sources: ',
    'topics.whatOthersSaid': 'Doosron ne kya kaha',
    'topics.anonymous': 'Anonymous',
    'topics.hubTitle': 'Topics',
    'topics.hubSubtitle':
      'Kitabon se jama ki hui lambi guftagu, har ek ke saath uska source. Ab tak {count} topics.',
    'topics.topicOfDay': 'Aaj ka Topic',
    'topics.dayLabel': 'Day {day} · {date}',
    'topics.readToday': "Aaj ka topic padho",
    'topics.dailyNote':
      'Har din ek naya topic, usi tartib mein jis mein topics banaye gaye. Pehla din pehla topic hai. Jab list khatm ho jaye, to phir se shuru ho jaati hai.',
    'topics.readDiscussion': 'Poori guftagu padho',
    'topics.guidesEyebrow': 'Study Guides',
    'topics.guidesTitle': 'Study guides, poori',
    'topics.guidesDesc':
      'Talib ke liye chhote amli guides, kitabon se jama kiye gaye, har ek ke saath uska source. Saare chhe guides ek hi page par.',
    'topics.readGuides': 'Guides padho',
    'topics.questionsEyebrow': 'Questions',
    'topics.questionsTitle': 'Sawal, jawab ke saath',
    'topics.questionsDesc':
      'Aam sawalon ke chhote jawab, har jawab ke saath uska source. Naye jawab yahan judte rehte hain, to wapas aakar dekhte raho.',
    'topics.readQuestions': 'Sawal padho',

    // ---- Questions ----
    'questions.title': 'Questions',
    'questions.subtitle': 'Aam sawalon ke chhote jawab, har jawab ke saath uska source.',
    'questions.studyNote':
      'Yeh jawab sirf padhai ke liye hain. Yeh kisi nateeje ka wada nahi karte, aur koi mazhabi faisla nahi dete. Naye jawab yahan judte rehte hain, to wapas aakar dekhte raho.',
    'questions.readFull': 'Poori guftagu padho',

    // ---- Study Guides ----
    'guides.title': 'Study Guides',
    'guides.subtitle':
      'Talib ke liye chhote amli guides, kitabon se jama kiye gaye, har ek ke saath uska source. Ab tak {count} guides.',
    'guides.studyNote':
      'Yeh guides sirf padhai ke liye hain. Yeh kisi nateeje ka wada nahi karti, aur koi mazhabi faisla nahi deti. Aahista padho, aur har ek ke aakhir mein diye gaye sources ko check karo.',
    'guides.onThisPage': 'Is page par guides',

    // ---- Instagram send box ----
    'sendbox.instagramName': 'Apna Instagram naam (zaroori nahi)',
    'sendbox.postAnonymous': 'Bina naam ke post karo',
    'sendbox.send': 'Bhejo',
    'sendbox.sending': 'Bheja ja raha hai…',
    'sendbox.copied': 'Copy ho gaya. Jo Instagram chat abhi khuli hai, usmein paste kar do.',
    'sendbox.copyFailed':
      'Is device par copy nahi hua. Neeche wala text copy karo aur Instagram chat mein paste kar do.',
    'sendbox.copyTextLabel': 'Copy karne wala text',
    'sendbox.orSend': 'Ya Instagram par bhejo: ',
    'sendbox.topicWant': 'Topic jo mujhe chahiye',
    'sendbox.myQuestion': 'Mera sawal',
    'sendbox.commentOn': '{label} par comment',
    'sendbox.requestTitle': 'Ek topic ki guzarish karo',
    'sendbox.requestLabel': 'Woh topic jo tum chahte ho',
    'sendbox.requestPlaceholder': 'Woh topic likho jiske baare mein tum padhna chahte ho.',
    'sendbox.requestNote':
      'Naye topics tumhari jaisi guzarish se aate hain. Woh topic likho jo tum chahte ho, apne Instagram naam ke saath agar tum batana chahte ho ki tum kaun ho, ya bina naam ke post karo.',
    'sendbox.requestDone':
      'Shukriya. Tumhari guzarish save ho gayi. Naye topics is page par usi tartib mein judte hain jis mein woh banaye gaye.',
    'sendbox.askTitle': 'Ek sawal poochho',
    'sendbox.askLabel': 'Tumhara sawal',
    'sendbox.askPlaceholder': 'Tum kya jaanna chahte ho?',
    'sendbox.askNote':
      'Apna sawal apne Instagram naam ke saath bhejo, ya bina naam ke post karo. Agar tum apna naam doge, to jawab Instagram par tumhe bhi milega. Naye jawab yahan judte hain taaki doosre bhi padh sakein.',
    'sendbox.askDone':
      'Shukriya. Tumhara sawal save ho gaya. Jawab Instagram par tumhe milega, aur yahan bhi jud jayega.',
    'sendbox.commentTitle': 'Comments aur chahat',
    'sendbox.commentLabel': 'Tumhara comment, ya woh topic jo tumhe chahiye',
    'sendbox.commentPlaceholder': 'Is topic par apna khayal likho, ya woh topic likho jo tumhe chahiye.',
    'sendbox.commentNote': 'Achhe comments aur jawab diye gaye chahat is page par jud jaate hain.',
    'sendbox.commentDone':
      'Shukriya. Tumhara note save ho gaya. Achhe comments aur jawab diye gaye chahat is page par jud jaate hain.',
  },
  bn: {
    // ---- Topics chrome (hub + topic pages) ----
    'topics.back': 'টপিক',
    'topics.studyNote':
      'এই আলোচনাগুলো শুধু পড়াশোনার জন্য। এগুলো কোনো ফলাফলের ওয়াদা করে না, আর কোনো ধর্মীয় ফতোয়া দেয় না। আস্তে পড়ো, আর শেষে দেওয়া উৎসগুলো দেখো।',
    'topics.studyNoteHub':
      'এই আলোচনাগুলো শুধু পড়াশোনার জন্য। এগুলো কোনো ফলাফলের ওয়াদা করে না, আর কোনো ধর্মীয় ফতোয়া দেয় না। আস্তে পড়ো, আর প্রতিটির শেষে দেওয়া উৎসগুলো দেখো।',
    'topics.intro': 'ভূমিকা',
    'topics.wordsUsed': 'এখানে ব্যবহৃত শব্দগুলো',
    'topics.closing': 'শেষ কথা',
    'topics.sources': 'উৎস',
    'topics.sourceLabel': 'উৎস: ',
    'topics.sourcesLabel': 'উৎস: ',
    'topics.whatOthersSaid': 'অন্যরা কী বলেছে',
    'topics.anonymous': 'নামহীন',
    'topics.hubTitle': 'টপিক',
    'topics.hubSubtitle':
      'বই থেকে জোগাড় করা লম্বা আলোচনা, প্রতিটির সঙ্গে তার উৎস। এখন পর্যন্ত {count}টি টপিক।',
    'topics.topicOfDay': 'আজকের টপিক',
    'topics.dayLabel': 'Day {day} · {date}',
    'topics.readToday': 'আজকের টপিকটি পড়ো',
    'topics.dailyNote':
      'প্রতিদিন এক নতুন টপিক, যেই ক্রমে টপিকগুলো তৈরি হয়েছিল সেই ক্রমে। প্রথম দিন প্রথম টপিক। তালিকা শেষ হলে, আবার শুরু হয়।',
    'topics.readDiscussion': 'পুরো আলোচনাটি পড়ো',
    'topics.guidesEyebrow': 'স্টাডি গাইড',
    'topics.guidesTitle': 'স্টাডি গাইড, পুরোটা',
    'topics.guidesDesc':
      'সন্ধানকারীর জন্য ছোট বাস্তব গাইড, বই থেকে জোগাড় করা, প্রতিটির সঙ্গে তার উৎস। ছয়টি গাইডই এক পাতায়।',
    'topics.readGuides': 'গাইডগুলো পড়ো',
    'topics.questionsEyebrow': 'প্রশ্ন',
    'topics.questionsTitle': 'প্রশ্ন, উত্তরসহ',
    'topics.questionsDesc':
      'সাধারণ প্রশ্নের ছোট উত্তর, প্রতিটি উত্তরের সঙ্গে তার উৎস। নতুন উত্তর এখানে যোগ হতে থাকে, তাই ফিরে এসে দেখো।',
    'topics.readQuestions': 'প্রশ্নগুলো পড়ো',

    // ---- Questions ----
    'questions.title': 'প্রশ্ন',
    'questions.subtitle': 'সাধারণ প্রশ্নের ছোট উত্তর, প্রতিটি উত্তরের সঙ্গে তার উৎস।',
    'questions.studyNote':
      'এই উত্তরগুলো শুধু পড়াশোনার জন্য। এগুলো কোনো ফলাফলের ওয়াদা করে না, আর কোনো ধর্মীয় ফতোয়া দেয় না। নতুন উত্তর এখানে যোগ হতে থাকে, তাই ফিরে এসে দেখো।',
    'questions.readFull': 'পুরো আলোচনাটি পড়ো',

    // ---- Study Guides ----
    'guides.title': 'স্টাডি গাইড',
    'guides.subtitle':
      'সন্ধানকারীর জন্য ছোট বাস্তব গাইড, বই থেকে জোগাড় করা, প্রতিটির সঙ্গে তার উৎস। এখন পর্যন্ত {count}টি গাইড।',
    'guides.studyNote':
      'এই গাইডগুলো শুধু পড়াশোনার জন্য। এগুলো কোনো ফলাফলের ওয়াদা করে না, আর কোনো ধর্মীয় ফতোয়া দেয় না। আস্তে পড়ো, আর প্রতিটির শেষে দেওয়া উৎসগুলো দেখো।',
    'guides.onThisPage': 'এই পাতায় গাইডগুলো',

    // ---- Instagram send box ----
    'sendbox.instagramName': 'আপনার ইনস্টাগ্রাম নাম (ঐচ্ছিক)',
    'sendbox.postAnonymous': 'নাম ছাড়া পোস্ট করো',
    'sendbox.send': 'পাঠাও',
    'sendbox.sending': 'পাঠানো হচ্ছে…',
    'sendbox.copied': 'কপি হয়ে গেছে। যে ইনস্টাগ্রাম চ্যাটটি এখন খুলেছে, তাতে পেস্ট করে দাও।',
    'sendbox.copyFailed':
      'এই ডিভাইসে কপি হয়নি। নিচের লেখাটি কপি করো আর ইনস্টাগ্রাম চ্যাটে পেস্ট করে দাও।',
    'sendbox.copyTextLabel': 'কপি করার লেখা',
    'sendbox.orSend': 'অথবা ইনস্টাগ্রামে পাঠাও: ',
    'sendbox.topicWant': 'যে টপিকটি আমি চাই',
    'sendbox.myQuestion': 'আমার প্রশ্ন',
    'sendbox.commentOn': '{label}-এর উপর মন্তব্য',
    'sendbox.requestTitle': 'একটি টপিকের অনুরোধ করো',
    'sendbox.requestLabel': 'যে টপিকটি তুমি চাও',
    'sendbox.requestPlaceholder': 'যে টপিকটি নিয়ে পড়তে চাও, তা লেখো।',
    'sendbox.requestNote':
      'নতুন টপিক তোমার মতো অনুরোধ থেকেই আসে। যে টপিকটি চাও তা লেখো, তোমার ইনস্টাগ্রাম নামসহ যদি তুমি জানাতে চাও তুমি কে, অথবা নাম ছাড়া পোস্ট করো।',
    'sendbox.requestDone':
      'ধন্যবাদ। তোমার অনুরোধ সেভ হয়েছে। নতুন টপিক এই পাতায় যোগ হয় সেই ক্রমে যেভাবে সেগুলো তৈরি হয়েছিল।',
    'sendbox.askTitle': 'একটি প্রশ্ন করো',
    'sendbox.askLabel': 'তোমার প্রশ্ন',
    'sendbox.askPlaceholder': 'তুমি কী জানতে চাও?',
    'sendbox.askNote':
      'তোমার প্রশ্ন তোমার ইনস্টাগ্রাম নামসহ পাঠাও, অথবা নাম ছাড়া পোস্ট করো। তুমি নাম দিলে, উত্তর ইনস্টাগ্রামেও তোমার কাছে আসবে। নতুন উত্তর এখানে যোগ হয় যাতে অন্যরাও পড়তে পারে।',
    'sendbox.askDone':
      'ধন্যবাদ। তোমার প্রশ্ন সেভ হয়েছে। উত্তর ইনস্টাগ্রামে তোমার কাছে আসবে, আর এখানেও যোগ হবে।',
    'sendbox.commentTitle': 'মন্তব্য আর চাওয়া',
    'sendbox.commentLabel': 'তোমার মন্তব্য, অথবা যে টপিকটি তোমার দরকার',
    'sendbox.commentPlaceholder': 'এই টপিক নিয়ে তোমার ভাবনা লেখো, অথবা যে টপিকটি তোমার দরকার তা লেখো।',
    'sendbox.commentNote': 'ভালো মন্তব্য আর উত্তর দেওয়া চাওয়াগুলো এই পাতায় যোগ হয়।',
    'sendbox.commentDone':
      'ধন্যবাদ। তোমার নোট সেভ হয়েছে। ভালো মন্তব্য আর উত্তর দেওয়া চাওয়াগুলো এই পাতায় যোগ হয়।',
  },
  ur: {
    'topics.back': 'موضوعات',
    'topics.studyNote': 'یہ گفتگو صرف مطالعے کے لیے ہے۔ یہ کسی نتیجے کا وعدہ نہیں کرتی، اور کوئی دینی حکم نہیں دیتی۔ آہستہ پڑھیں، اور آخر میں بتائے گئے ماخذ کو جانچیں۔',
    'topics.studyNoteHub': 'یہ گفتگو صرف مطالعے کے لیے ہے۔ یہ کسی نتیجے کا وعدہ نہیں کرتی، اور کوئی دینی حکم نہیں دیتی۔ آہستہ پڑھیں، اور ہر ایک کے آخر میں بتائے گئے ماخذ کو جانچیں۔',
    'topics.intro': 'تعارف',
    'topics.wordsUsed': 'یہاں استعمال ہونے والے الفاظ',
    'topics.closing': 'اختتام',
    'topics.sources': 'ماخذ',
    'topics.sourceLabel': 'ماخذ: ',
    'topics.sourcesLabel': 'ماخذ: ',
    'topics.whatOthersSaid': 'دوسروں نے کیا کہا',
    'topics.anonymous': 'گمنام',
    'topics.hubTitle': 'موضوعات',
    'topics.hubSubtitle': 'لمبی گفتگو، کتابوں سے ماخذ کے ساتھ جمع کی گئی۔ اب تک {count} موضوعات۔',
    'topics.topicOfDay': 'آج کا موضوع',
    'topics.dayLabel': 'دن {day} · {date}',
    'topics.readToday': 'آج کا موضوع پڑھیں',
    'topics.dailyNote': 'ہر دن ایک نیا موضوع، اسی ترتیب سے جس میں موضوعات بنے تھے۔ دن 1 پہلا موضوع ہے۔ جب فہرست ختم ہو جائے تو دوبارہ شروع ہو جاتی ہے۔',
    'topics.readDiscussion': 'گفتگو پڑھیں',
    'topics.guidesEyebrow': 'مطالعے کی رہنما کتابیں',
    'topics.guidesTitle': 'مطالعے کی رہنما کتابیں، مکمل',
    'topics.guidesDesc': 'طالب کے لیے چھوٹی عملی رہنما کتابیں، کتابوں سے ماخذ کے ساتھ جمع کی گئی۔ تمام چھ رہنما کتابیں ایک صفحے پر۔',
    'topics.readGuides': 'رہنما کتابیں پڑھیں',
    'topics.questionsEyebrow': 'سوالات',
    'topics.questionsTitle': 'سوالات، جواب کے ساتھ',
    'topics.questionsDesc': 'عام سوالوں کے چھوٹے جواب، ہر جواب کے ساتھ ماخذ۔ نئے جواب یہاں شامل ہوتے رہتے ہیں، اس لیے دوبارہ دیکھتے رہیں۔',
    'topics.readQuestions': 'سوالات پڑھیں',
    'questions.title': 'سوالات',
    'questions.subtitle': 'عام سوالوں کے چھوٹے جواب، ہر جواب کے ساتھ ماخذ۔',
    'questions.studyNote': 'یہ جواب صرف مطالعے کے لیے ہیں۔ یہ کسی نتیجے کا وعدہ نہیں کرتے، اور کوئی دینی حکم نہیں دیتے۔ نئے جواب یہاں شامل ہوتے رہتے ہیں، اس لیے دوبارہ دیکھتے رہیں۔',
    'questions.readFull': 'پوری گفتگو پڑھیں',
    'guides.title': 'مطالعے کی رہنما کتابیں',
    'guides.subtitle': 'طالب کے لیے چھوٹی عملی رہنما کتابیں، کتابوں سے ماخذ کے ساتھ جمع کی گئی۔ اب تک {count} رہنما کتابیں۔',
    'guides.studyNote': 'یہ رہنما کتابیں صرف مطالعے کے لیے ہیں۔ یہ کسی نتیجے کا وعدہ نہیں کرتیں، اور کوئی دینی حکم نہیں دیتیں۔ آہستہ پڑھیں، اور ہر ایک کے آخر میں بتائے گئے ماخذ کو جانچیں۔',
    'guides.onThisPage': 'اس صفحے پر رہنما کتابیں',
    'sendbox.instagramName': 'آپ کا Instagram نام (اختیاری)',
    'sendbox.postAnonymous': 'گمنام پوسٹ کریں',
    'sendbox.send': 'بھیجیں',
    'sendbox.sending': 'بھیجا جا رہا ہے…',
    'sendbox.copied': 'نقل ہو گیا۔ اسے اس Instagram چیٹ میں چسپاں کریں جو ابھی کھلی ہے۔',
    'sendbox.copyFailed': 'اس ڈیوائس پر نقل نہیں ہو سکا۔ نیچے والا متن نقل کریں اور Instagram چیٹ میں چسپاں کریں۔',
    'sendbox.copyTextLabel': 'نقل کرنے والا متن',
    'sendbox.orSend': 'یا Instagram پر بھیجیں: ',
    'sendbox.topicWant': 'جو موضوع چاہیے',
    'sendbox.myQuestion': 'میرا سوال',
    'sendbox.commentOn': '{label} پر تبصرہ',
    'sendbox.requestTitle': 'موضوع کی درخواست کریں',
    'sendbox.requestLabel': 'جو موضوع چاہیے',
    'sendbox.requestPlaceholder': 'جو موضوع پڑھنا چاہتے ہیں وہ لکھیں۔',
    'sendbox.requestNote': 'نئے موضوعات آپ جیسی درخواستوں سے آتے ہیں۔ جو موضوع چاہیے وہ لکھیں، اور اگر چاہیں تو اپنا Instagram نام بھی لکھیں، یا گمنام پوسٹ کریں۔',
    'sendbox.requestDone': 'شکریہ۔ آپ کی درخواست محفوظ ہو گئی۔ نئے موضوعات اسی ترتیب سے اس صفحے پر شامل ہوتے ہیں جس میں وہ بنے تھے۔',
    'sendbox.askTitle': 'سوال پوچھیں',
    'sendbox.askLabel': 'آپ کا سوال',
    'sendbox.askPlaceholder': 'کیا جاننا چاہتے ہیں؟',
    'sendbox.askNote': 'اپنا سوال اپنے Instagram نام کے ساتھ بھیجیں، یا گمنام پوسٹ کریں۔ اگر آپ نام دیں گے تو جواب Instagram پر بھی آپ تک پہنچے گا۔ نئے جواب یہاں شامل ہوتے ہیں تاکہ دوسرے بھی پڑھ سکیں۔',
    'sendbox.askDone': 'شکریہ۔ آپ کا سوال محفوظ ہو گیا۔ جواب Instagram پر آپ تک پہنچے گا، اور یہاں بھی شامل ہو جائے گا۔',
    'sendbox.commentTitle': 'تبصرے اور خواہشیں',
    'sendbox.commentLabel': 'آپ کا تبصرہ، یا جو موضوع چاہیے',
    'sendbox.commentPlaceholder': 'اس موضوع پر اپنی سوچ لکھیں، یا جو موضوع چاہیے وہ لکھیں۔',
    'sendbox.commentNote': 'اچھے تبصرے اور جواب دی گئی خواہشیں اس صفحے پر شامل ہوتی ہیں۔',
    'sendbox.commentDone': 'شکریہ۔ آپ کی بات محفوظ ہو گئی۔ اچھے تبصرے اور جواب دی گئی خواہشیں اس صفحے پر شامل ہوتی ہیں۔',
  },
};

/**
 * Translate a Topics-area key. Falls back to English, then to the key
 * itself, so the page never crashes on a missing string. Use this
 * until the parent merges I18N_TOPICS into the base dict, after which
 * the base `t` reads the same keys.
 */
export function tt(key: string, lang: SiteLanguage = 'en'): string {
  return I18N_TOPICS[lang]?.[key] ?? I18N_TOPICS.en[key] ?? key;
}

/** Translate a key with {name} placeholders, e.g. dayLabel with {day} and {date}. */
export function ttf(key: string, lang: SiteLanguage, vars: Record<string, string | number>): string {
  let out = tt(key, lang);
  for (const [name, value] of Object.entries(vars)) {
    out = out.split(`{${name}}`).join(String(value));
  }
  return out;
}
