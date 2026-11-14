// Catalog of every NASA data source ReliQ uses: where it comes from, what it powers, and how to reach it.
// Base URLs can be overridden with environment variables (used for automated tests); defaults are NASA's.

export const TREK_BASE = process.env.NASA_TREK_BASE || "https://trek.nasa.gov/tiles";
export const IMAGES_API_BASE = process.env.NASA_IMAGES_API_BASE || "https://images-api.nasa.gov";

export type SourceId =
  | "trek-moon-wac"
  | "trek-mars-viking"
  | "trek-mars-mola"
  | "nasa-images"
  | "nssdca"
  | "science-surveyor-3"
  | "science-mer";

export type DataSource = {
  id: SourceId;
  name: string;
  provider: string;
  kind: "map tiles" | "REST API" | "Reference pages";
  usedFor: { ar: string; en: string };
  docs: string;
  /** URL the status check calls to prove the source is reachable */
  probeUrl: string;
  apiKey: false;
  updates: { ar: string; en: string };
};

export const SOURCES: DataSource[] = [
  {
    id: "trek-moon-wac",
    name: "LRO WAC Global Mosaic 303ppd v02 (Moon Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "خريطة القمر ومجسمه ثلاثي الأبعاد", en: "Moon map and 3D globe" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon",
    probeUrl: `${TREK_BASE}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة (فسيفساء عالمية)", en: "Static global mosaic" },
  },
  {
    id: "trek-mars-viking",
    name: "Viking MDIM 2.1 Color Mosaic 232m (Mars Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "خريطة المريخ الملونة ولون مجسمه ثلاثي الأبعاد", en: "Mars colour map and 3D globe colour" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars",
    probeUrl: `${TREK_BASE}/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة (فسيفساء عالمية)", en: "Static global mosaic" },
  },
  {
    id: "trek-mars-mola",
    name: "MGS MOLA Colour Shaded Relief 463m (Mars Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "طبقة تضاريس المريخ، وتضاريس مجسمه ثلاثي الأبعاد", en: "Mars elevation layer and 3D globe relief" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars",
    probeUrl: `${TREK_BASE}/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة", en: "Static global map" },
  },
  {
    id: "nasa-images",
    name: "NASA Image and Video Library API",
    provider: "NASA",
    kind: "REST API",
    usedFor: { ar: "صور ناسا الرسمية لكل مركبة", en: "Official NASA photos of each spacecraft" },
    docs: "https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf",
    probeUrl: `${IMAGES_API_BASE}/search?q=rover&media_type=image&page_size=1`,
    apiKey: false,
    updates: { ar: "تتحدث كلما نشرت ناسا صورًا جديدة (نخزنها ساعة)", en: "Updated as NASA publishes (cached 1 hour)" },
  },
  // ── Fact sources: the ONLY pages the vehicle facts and the chatbot knowledge (data/nasa_knowledge.json) come from ──
  {
    id: "nssdca",
    name: "NASA Space Science Data Coordinated Archive (NSSDCA)",
    provider: "NASA Goddard Space Flight Center",
    kind: "Reference pages",
    usedFor: { ar: "حقائق سيرفيور ٣ وأوبورتيونيتي وصحيفتا حقائق القمر والمريخ", en: "Surveyor 3 & Opportunity facts, Moon and Mars fact sheets" },
    docs: "https://nssdc.gsfc.nasa.gov/",
    probeUrl: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html",
    apiKey: false,
    updates: { ar: "سجلات أرشيفية — رُوجعت في نوفمبر ٢٠٢٦", en: "Archive records — reviewed November 2026" },
  },
  {
    id: "science-surveyor-3",
    name: "NASA Science — Surveyor 3",
    provider: "NASA Science Mission Directorate",
    kind: "Reference pages",
    usedFor: { ar: "قصة سيرفيور ٣ ومعلوماتها وروبوت المحادثة", en: "Surveyor 3 story, facts and chatbot" },
    docs: "https://science.nasa.gov/mission/surveyor-3/",
    probeUrl: "https://science.nasa.gov/mission/surveyor-3/",
    apiKey: false,
    updates: { ar: "صفحة مهمة رسمية — رُوجعت في نوفمبر ٢٠٢٦", en: "Official mission page — reviewed November 2026" },
  },
  {
    id: "science-mer",
    name: "NASA Science — Mars Exploration Rovers: Spirit and Opportunity",
    provider: "NASA Science Mission Directorate",
    kind: "Reference pages",
    usedFor: { ar: "قصة أوبورتيونيتي ومعلوماتها وروبوت المحادثة", en: "Opportunity story, facts and chatbot" },
    docs: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
    probeUrl: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
    apiKey: false,
    updates: { ar: "صفحة مهمة رسمية — رُوجعت في نوفمبر ٢٠٢٦", en: "Official mission page — reviewed November 2026" },
  },
];

export function getSource(id: SourceId) {
  return SOURCES.find((s) => s.id === id)!;
}
