// Shared content types for ReliQ.
// Every user-facing text has an Arabic (ar) and English (en) version.

export type Lang = "ar" | "en";
export type Text = { ar: string; en: string };

export type PlanetId = "moon" | "mars";

export type Planet = {
  id: PlanetId;
  name: Text;
  tagline: Text;
  description: Text;
  /** CSS colors used for the planet sphere on the landing page */
  colors: [string, string, string];
  /** Mean radius, used for the map scale bar and distances */
  radiusKm: number;
  /** NASA Trek map layers (first = default). */
  layers: MapLayer[];
  /** How the realistic 3D globe and ground are built from NASA Trek imagery (see lib/planetTextures.ts). */
  globe: {
    /** Tile-proxy layer id (app/api/nasa/tile) used as the colour map */
    colorLayer: string;
    /** Tile-proxy layer id whose shading is turned into a normal (relief) map */
    reliefLayer: string;
    /** Strength of the relief derived from the NASA map */
    reliefStrength: number;
    /** Thin atmosphere glow (Mars) — the Moon has none */
    atmosphere: string | null;
  };
};

export type MapLayer = {
  id: string;
  name: Text;
  /** Tile URL template, {z}/{y}/{x} as served by NASA Trek WMTS */
  url: string;
  maxNativeZoom: number;
  /** id in lib/nasa/sources.ts, shown as the layer's credit */
  sourceId: string;
  attribution: string;
};

/** Visual 3D blueprint — the rover model is generated in code from this. */
export type RoverModelKind = "lunokhod" | "lrv" | "yutu" | "sojourner" | "mer" | "msl" | "surveyor";

/** Mesh groups that can be highlighted on the 3D model */
export type PartMesh =
  | "wheels"
  | "solar"
  | "mast"
  | "arm"
  | "antenna"
  | "rtg"
  | "lid"
  | "reflector"
  | "radar"
  | "battery"
  | "apxs"
  | "camera"
  | "legs";

export type RoverPart = {
  id: string;
  mesh: PartMesh;
  icon: string;
  name: Text;
  role: Text;
  funFact: Text;
};

export type MissionStep = {
  situation: Text;
  options: { text: Text; correct: boolean }[];
  explanation: Text;
};

/** One chapter of the vehicle's first-person story ("I landed…"). */
export type StoryChapter = {
  icon: string;
  /** Short date label shown on the chapter, e.g. "2004-01-25" or "1969-11" */
  date: string;
  title: Text;
  text: Text;
};

/** "rover" drives around; "lander" stays where it landed (e.g. Surveyor 3). */
export type VehicleKind = "rover" | "lander";

export type Rover = {
  id: string;
  planet: PlanetId;
  kind: VehicleKind;
  name: Text;
  agency: Text;
  country: Text;
  flag: string;
  landingDate: string; // ISO date
  landingSite: Text;
  lat: number;
  lng: number;
  model: RoverModelKind;
  accent: string;
  summary: Text;
  story: Text;
  /** Interactive first-person story, told by the vehicle itself */
  persona: StoryChapter[];
  /** Official NASA pages the facts were checked against */
  sources: { title: string; url: string }[];
  achievements: Text[];
  stats: { label: Text; value: Text }[];
  parts: [RoverPart, RoverPart, RoverPart];
  /** Mass in kg as listed in NASA NSSDCA "Facts in Brief" (Surveyor 3: landed mass; Opportunity: rover mass). Used by the comparison chart. */
  massKg: number;
  /** Search words for the NASA Image and Video Library */
  nasaImagesQuery: string;
  mission: {
    title: Text;
    intro: Text;
    steps: MissionStep[];
  };
};
