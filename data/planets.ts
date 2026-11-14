import type { Planet, PlanetId } from "./types";

// Map tiles come from NASA Solar System Treks (public WMTS, equirectangular projection, no API key).
// URL pattern: {z}/{y}/{x}; zoom 0 = 2 columns x 1 row, which matches Leaflet's EPSG:4326 CRS.
// Docs: https://trek.nasa.gov/tiles/apidoc/trekAPI.html
const TREK = process.env.NEXT_PUBLIC_NASA_TREK_BASE || "https://trek.nasa.gov/tiles";
const TREK_CREDIT = 'NASA <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer">Solar System Treks</a>';

export const planets: Planet[] = [
  {
    id: "moon",
    name: { ar: "القمر", en: "The Moon" },
    tagline: { ar: "أقرب جار لنا في الفضاء", en: "Our closest neighbor in space" },
    // Numbers: NASA NSSDCA Moon Fact Sheet (nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)
    description: {
      ar: "يبعد عنا نحو ٣٨٤ ألف كم، وجاذبيته ١٫٦٢ م/ث² فقط، ولا يكاد يملك غلافًا جويًا. هنا هبطت سيرفيور ٣ عام ١٩٦٧ لتختبر تربته قبل وصول رواد أبولو.",
      en: "About 384,000 km away, with gravity of just 1.62 m/s² and almost no atmosphere. Surveyor 3 landed here in 1967 to test the soil before the Apollo astronauts arrived.",
    },
    colors: ["#f1f1f1", "#a3a3a8", "#55555c"],
    radiusKm: 1737.4,
    globe: { colorLayer: "moon-wac", reliefLayer: "moon-wac", reliefStrength: 2.2, atmosphere: null },
    layers: [
      {
        id: "moon-wac",
        name: { ar: "صور LRO الحقيقية", en: "LRO photo mosaic" },
        url: `${TREK}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 7,
        sourceId: "trek-moon-wac",
        attribution: `${TREK_CREDIT} · LRO WAC mosaic (NASA/GSFC/ASU)`,
      },
    ],
  },
  {
    id: "mars",
    name: { ar: "المريخ", en: "Mars" },
    tagline: { ar: "الكوكب الأحمر", en: "The Red Planet" },
    // Numbers: NASA NSSDCA Mars Fact Sheet (nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html)
    description: {
      ar: "نصف قطره ٣٣٨٩٫٥ كم، وغلافه الجوي رقيق معظمه ثاني أكسيد الكربون (٩٥٪). هنا بحثت أوبورتيونيتي أكثر من ١٤ سنة عن أدلة على ماء قديم.",
      en: "3,389.5 km in radius, with a thin atmosphere that is 95% carbon dioxide. Here Opportunity spent more than 14 years searching for evidence of ancient water.",
    },
    colors: ["#ffb38a", "#d0573a", "#5e1d12"],
    radiusKm: 3389.5,
    globe: { colorLayer: "mars-viking", reliefLayer: "mars-mola", reliefStrength: 3.0, atmosphere: "#ff9a6b" },
    layers: [
      {
        id: "mars-viking",
        name: { ar: "صور Viking الملونة", en: "Viking colour mosaic" },
        url: `${TREK}/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 7,
        sourceId: "trek-mars-viking",
        attribution: `${TREK_CREDIT} · Viking MDIM 2.1 (NASA/USGS)`,
      },
      {
        id: "mars-mola",
        name: { ar: "تضاريس MOLA (الارتفاعات)", en: "MOLA elevation relief" },
        url: `${TREK}/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 6,
        sourceId: "trek-mars-mola",
        attribution: `${TREK_CREDIT} · MGS MOLA colour shaded relief (NASA/GSFC)`,
      },
    ],
  },
];

export function getPlanet(id: string): Planet | undefined {
  return planets.find((p) => p.id === id);
}

export const planetIds: PlanetId[] = planets.map((p) => p.id);
