"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, Text } from "@/data/types";

// UI strings (labels, buttons). Rover content lives in data/rovers.ts.
const ui = {
  brandTagline: { ar: "منصة تعليمية لاستكشاف مركبات الفضاء", en: "Learn the stories of rovers in space" },
  heroTitle: { ar: "اكتشف المركبات التي استكشفت عوالم أخرى", en: "Discover the spacecraft that explored other worlds" },
  heroText: {
    ar: "اختر عالمًا، تجول على خريطته، افحص مركبته بتقنية ثلاثية الأبعاد، استمع لقصتها بلسانها، ثم خض مهمة حقيقية بنفسك.",
    en: "Pick a world, explore its map, inspect its spacecraft in 3D, hear its story in its own words, then take on a real mission yourself.",
  },
  choosePlanet: { ar: "اختر وجهتك", en: "Choose your destination" },
  explore: { ar: "استكشف", en: "Explore" },
  rovers: { ar: "مركبة", en: "spacecraft" },
  howItWorks: { ar: "كيف تعمل الرحلة؟", en: "How the journey works" },
  step1: { ar: "اختر الكوكب", en: "Pick a planet" },
  step2: { ar: "تجول في الخريطة", en: "Explore the map" },
  step3: { ar: "افحص المركبة 3D", en: "Inspect the rover in 3D" },
  step4: { ar: "خض المهمة", en: "Take the mission" },
  back: { ar: "رجوع", en: "Back" },
  home: { ar: "الرئيسية", en: "Home" },
  mapHint: { ar: "اسحب الخريطة وقرّب، ثم اضغط على المركبة", en: "Drag and zoom the map, then tap the spacecraft" },
  landed: { ar: "تاريخ الهبوط", en: "Landed" },
  viewRover: { ar: "افتح المركبة", en: "Open spacecraft" },
  roversOn: { ar: "استكشف", en: "Explore" },
  mapFallback: {
    ar: "تعذر تحميل صور الخريطة من ناسا — تُعرض خريطة مبسطة.",
    en: "Couldn't load NASA map imagery — showing a simplified map.",
  },
  story: { ar: "القصة", en: "The Story" },
  achievements: { ar: "أبرز الإنجازات", en: "Key Achievements" },
  keyParts: { ar: "٣ أجزاء رئيسية", en: "3 Key Parts" },
  keyPartsHint: { ar: "اضغط على جزء لتراه يضيء على المجسم", en: "Tap a part to see it glow on the model" },
  funFact: { ar: "معلومة ممتعة", en: "Fun fact" },
  dragToRotate: { ar: "اسحب للتدوير • قرّب بإصبعين", en: "Drag to rotate • pinch to zoom" },
  startMission: { ar: "ابدأ المهمة", en: "Start the mission" },
  partsExplored: { ar: "أجزاء استكشفتها", en: "parts explored" },
  agency: { ar: "الجهة", en: "Agency" },
  site: { ar: "موقع الهبوط", en: "Landing site" },
  question: { ar: "الموقف", en: "Situation" },
  of: { ar: "من", en: "of" },
  next: { ar: "التالي", en: "Next" },
  finish: { ar: "إنهاء المهمة", en: "Finish mission" },
  correct: { ar: "قرار صحيح!", en: "Great call!" },
  wrong: { ar: "ليس تمامًا", en: "Not quite" },
  missionComplete: { ar: "انتهت المهمة", en: "Mission complete" },
  yourScore: { ar: "نتيجتك", en: "Your score" },
  badgeGold: { ar: "قائد مهمات خبير 🏅", en: "Expert Mission Commander 🏅" },
  badgeSilver: { ar: "مستكشف واعد 🥈", en: "Promising Explorer 🥈" },
  badgeTry: { ar: "متدرب فضاء — حاول مرة أخرى 🚀", en: "Space Trainee — try again 🚀" },
  retry: { ar: "أعد المهمة", en: "Retry mission" },
  backToRover: { ar: "العودة للمركبة", en: "Back to rover" },
  moreRovers: { ar: "مركبات أخرى", en: "More rovers" },
  completed: { ar: "مكتملة", en: "Completed" },
  best: { ar: "أفضل نتيجة", en: "Best" },
  chatTitle: { ar: "مساعد ريليك", en: "ReliQ Assistant" },
  chatPlaceholder: { ar: "اكتب سؤالك...", en: "Ask a question..." },
  chatWelcome: {
    ar: "مرحبًا! اسألني عن سيرفيور ٣ أو أوبورتيونيتي أو القمر أو المريخ — أجيب من سجلات ناسا المعتمدة فقط.",
    en: "Hi! Ask me about Surveyor 3, Opportunity, the Moon or Mars — I answer only from approved NASA records.",
  },
  chatSuggestions: { ar: "أسئلة مقترحة", en: "Try asking" },
  chatError: { ar: "حدث خطأ، حاول مرة أخرى.", en: "Something went wrong, please try again." },
  chatOpen: { ar: "اسأل المساعد", en: "Ask the assistant" },
  talkToRover: { ar: "كلّم المركبة", en: "Talk to the rover" },
  chatRoleNote: { ar: "ذكاء اصطناعي يتقمص المركبة · يجيب من سجلات ناسا فقط", en: "AI playing the spacecraft · answers from NASA records only" },
  chatSources: { ar: "المصادر: NSSDCA وNASA Science", en: "Sources: NSSDCA & NASA Science" },
  chatClose: { ar: "إغلاق المحادثة", en: "Close chat" },
  chatReset: { ar: "محادثة جديدة", en: "New chat" },
  send: { ar: "إرسال", en: "Send" },
  loading3d: { ar: "جاري تحميل المجسم...", en: "Loading 3D model..." },
  footer: { ar: "مشروع تعليمي — الحقائق من سجلات ناسا الرسمية", en: "Educational project — facts from official NASA records" },
  footerExplore: { ar: "استكشف", en: "Explore" },
  footerData: { ar: "البيانات والمصادر", en: "Data & sources" },
  footerDataText: { ar: "كل مصادر ناسا التي تعتمد عليها المنصة، مع فحص مباشر للاتصال.", en: "Every NASA source the platform relies on, with a live connection check." },
  leaderboard: { ar: "لوحة الصدارة", en: "Leaderboard" },
  lbTitle: { ar: "لوحة صدارة المستكشفين", en: "Explorers' Leaderboard" },
  lbText: {
    ar: "اجمع نقاط الخبرة (XP) بحل المهمات واستكشاف أجزاء المركبات وقراءة قصصها — وتسلّق نحو قيادة المهمة!",
    en: "Earn XP by solving missions, exploring spacecraft parts and reading their stories — and climb toward Mission Commander!",
  },
  lbWeekly: { ar: "هذا الأسبوع", en: "This week" },
  lbAll: { ar: "الكل", en: "All time" },
  lbRank: { ar: "الترتيب", en: "Rank" },
  lbStudent: { ar: "الطالب", en: "Student" },
  lbVehicles: { ar: "المركبات المستكشفة", en: "Spacecraft explored" },
  lbXp: { ar: "النقاط", en: "XP" },
  lbYou: { ar: "أنت", en: "You" },
  lbYourName: { ar: "اسمك على اللوحة", en: "Your name on the board" },
  lbSave: { ar: "حفظ", en: "Save" },
  lbEdit: { ar: "تعديل الاسم", en: "Edit name" },
  lbYourRank: { ar: "ترتيبك الحالي", en: "Your current rank" },
  lbHowTitle: { ar: "كيف تجمع النقاط؟", en: "How to earn XP" },
  lbHowMission: { ar: "كل إجابة صحيحة جديدة في مهمة", en: "Each new correct answer in a mission" },
  lbHowMissionDone: { ar: "إكمال مهمة لأول مرة", en: "Finishing a mission for the first time" },
  lbHowPart: { ar: "استكشاف جزء جديد من مركبة", en: "Exploring a new spacecraft part" },
  lbHowStory: { ar: "قراءة قصة مركبة حتى النهاية", en: "Reading a spacecraft's story to the end" },
  lbDemo: { ar: "أسماء الطلاب الآخرين بيانات تجريبية للعرض. نقاطك أنت محفوظة في متصفحك فقط.", en: "Other students are demo data. Your own XP is saved only in this browser." },
  lbStart: { ar: "ابدأ الاستكشاف", en: "Start exploring" },
  lbTitle1: { ar: "قائد المهمة", en: "Mission Commander" },
  lbTitle2: { ar: "مستكشف المريخ", en: "Mars Explorer" },
  lbTitle3: { ar: "رائد فضاء مبتدئ", en: "Rookie Astronaut" },
  lbLevelCadet: { ar: "متدرب فضاء", en: "Space Cadet" },
  lbLevelPilot: { ar: "طيار مداري", en: "Orbital Pilot" },
  lbLevelScientist: { ar: "عالم كواكب", en: "Planetary Scientist" },
  lbGold: { ar: "الوسام الذهبي", en: "Gold medal" },
  lbSilver: { ar: "الوسام الفضي", en: "Silver medal" },
  lbBronze: { ar: "الوسام البرونزي", en: "Bronze medal" },
  xpGained: { ar: "نقطة خبرة!", en: "XP earned!" },
  myStory: { ar: "قصتي بلساني", en: "My story, in my own words" },
  myStoryHint: { ar: "رحلة تفاعلية ترويها المركبة نفسها — تنقّل بين الفصول", en: "An interactive journey told by the spacecraft itself — step through the chapters" },
  chapter: { ar: "الفصل", en: "Chapter" },
  prev: { ar: "السابق", en: "Previous" },
  storyEnd: { ar: "النهاية — شكرًا لأنك رافقتني!", en: "The end — thanks for travelling with me!" },
  restartStory: { ar: "من البداية", en: "From the start" },
  officialSources: { ar: "المصادر الرسمية (ناسا)", en: "Official sources (NASA)" },
  officialSourcesHint: { ar: "كل معلومة في هذه الصفحة مدققة من هذه الصفحات فقط.", en: "Every fact on this page was checked against these pages only." },
  mapLayers: { ar: "طبقات الخريطة", en: "Map layers" },
  baseMap: { ar: "الخريطة الأساسية (ناسا)", en: "Base map (NASA)" },
  km: { ar: "كم", en: "km" },
  liveFromNasa: { ar: "مباشر من ناسا", en: "Live from NASA" },
  unavailable: { ar: "غير متاحة", en: "unavailable" },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  nasaUnavailable: { ar: "تعذر الاتصال بناسا الآن", en: "Couldn't reach NASA right now" },
  nasaPhotos: { ar: "صور ناسا الرسمية", en: "Official NASA photos" },
  nasaPhotosHint: { ar: "من مكتبة ناسا للصور والفيديو — اضغط على صورة لفتحها", en: "From the NASA Image and Video Library — tap a photo to open it" },
  nasaPhotosEmpty: { ar: "ما لقينا صورًا لهذه المركبة في مكتبة ناسا.", en: "No photos of this rover were found in the NASA library." },
  tryAgain: { ar: "حاول مرة ثانية", en: "Try again" },
  updated: { ar: "آخر تحديث", en: "Updated" },
  source: { ar: "المصدر", en: "Source" },
  openOnNasa: { ar: "افتح في موقع ناسا", en: "Open on NASA's site" },
  dataHub: { ar: "مركز البيانات", en: "Data Hub" },
  dataHubTitle: { ar: "بيانات ناسا في ريليك", en: "NASA data in ReliQ" },
  dataHubText: {
    ar: "كل مصدر بيانات تستخدمه المنصة، مع فحص مباشر للاتصال، ومقارنة بين المركبتين.",
    en: "Every data source the platform uses, with a live connection check and a comparison of the two spacecraft.",
  },
  sourcesTitle: { ar: "مصادر البيانات", en: "Data sources" },
  checkNow: { ar: "افحص الاتصال الآن", en: "Check connection now" },
  checking: { ar: "جاري الفحص...", en: "Checking..." },
  connected: { ar: "متصل", en: "Connected" },
  notConnected: { ar: "غير متصل", en: "Not reachable" },
  noKey: { ar: "بدون مفتاح API", en: "No API key needed" },
  usedFor: { ar: "يُستخدم في", en: "Used for" },
  refresh: { ar: "التحديث", en: "Refresh" },
  docs: { ar: "التوثيق الرسمي", en: "Official docs" },
  compareTitle: { ar: "قارن بين المركبتين", en: "Compare the two spacecraft" },
  massChart: { ar: "الكتلة حسب سجل NSSDCA (كغ)", en: "Mass in the NSSDCA record (kg)" },
  massChartNote: { ar: "سيرفيور ٣: الكتلة بعد الهبوط · أوبورتيونيتي: كتلة المركبة الجوالة وحدها.", en: "Surveyor 3: mass after landing · Opportunity: the rover alone." },
  timelineTitle: { ar: "متى هبطت كل مركبة؟", en: "When did each spacecraft land?" },
  factsSources: { ar: "أرقام المركبات مدققة من NSSDCA وصفحات NASA Science فقط.", en: "Spacecraft figures are checked only against NSSDCA and NASA Science pages." },
  homeDataTitle: { ar: "مبني على بيانات ناسا المفتوحة", en: "Built on NASA open data" },
  homeDataText: {
    ar: "خرائط ومجسمات القمر والمريخ من NASA Trek، وصور رسمية من مكتبة ناسا، وحقائق مدققة من NSSDCA وNASA Science.",
    en: "Moon and Mars maps and 3D globes from NASA Trek, official photos from the NASA library, and facts checked against NSSDCA and NASA Science.",
  },
  openDataHub: { ar: "افتح مركز البيانات", en: "Open the Data Hub" },
  nav: { ar: "التنقل", en: "Navigation" },
  notFound: { ar: "الصفحة غير موجودة", en: "Page not found" },
} satisfies Record<string, Text>;

export type UIKey = keyof typeof ui;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UIKey) => string;
  tx: (text: Text) => string;
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "reliq-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Load saved language once on the client.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable — keep default */
    }
  }, []);

  // Keep <html lang/dir> in sync so the whole page flips RTL/LTR.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "ar" ? "en" : "ar"),
    t: (key) => ui[key][lang],
    tx: (text) => text[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

export function formatDate(iso: string, lang: Lang) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "ar" ? "ar-SA-u-ca-gregory" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
