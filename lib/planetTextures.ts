// Client-only helpers that turn NASA Trek map tiles into WebGL textures for the 3D scenes,
// plus a small procedural generator for close-up ground detail.
//
// • Colour  — NASA Trek mosaics (LRO WAC for the Moon, Viking MDIM 2.1 for Mars), fetched through
//             our same-origin proxy /api/nasa/tile so WebGL can use them.
// • Relief  — a normal map computed from the shading of a NASA layer (MOLA shaded relief for Mars,
//             the LRO WAC mosaic for the Moon) with a Sobel filter, so craters and canyons catch the light.
// • Ground  — the rover scenes use a procedural height field (craters / ripples) for centimetre detail,
//             tinted by the real NASA tile that contains the landing site.

/** Trek "EQ" tiling: zoom z has 2^(z+1) columns and 2^z rows of 256 px tiles. */
const TILE = 256;

export function tileUrl(layer: string, z: number, y: number, x: number) {
  return `/api/nasa/tile?layer=${encodeURIComponent(layer)}&z=${z}&y=${y}&x=${x}`;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("tile failed: " + url));
    img.src = url;
  });
}

const globeCache = new Map<string, Promise<HTMLCanvasElement>>();

/** Whole-planet equirectangular mosaic at zoom z (z=1 → 1024×512 px). Cached per layer+zoom. */
export function loadGlobeCanvas(layer: string, z = 1): Promise<HTMLCanvasElement> {
  const key = `${layer}/${z}`;
  const hit = globeCache.get(key);
  if (hit) return hit;
  const p = (async () => {
    const cols = 2 ** (z + 1);
    const rows = 2 ** z;
    const canvas = document.createElement("canvas");
    canvas.width = cols * TILE;
    canvas.height = rows * TILE;
    const ctx = canvas.getContext("2d")!;
    const jobs: Promise<void>[] = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++)
        jobs.push(loadImage(tileUrl(layer, z, y, x)).then((img) => ctx.drawImage(img, x * TILE, y * TILE, TILE, TILE)));
    const results = await Promise.allSettled(jobs);
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > results.length / 4) throw new Error(`${failed}/${results.length} NASA tiles failed`);
    return canvas;
  })();
  globeCache.set(key, p);
  p.catch(() => globeCache.delete(key)); // allow a retry later
  return p;
}

/** The single NASA tile that contains (lat, lng) at zoom z. */
export async function loadSiteTile(layer: string, z: number, lat: number, lng: number): Promise<HTMLImageElement> {
  const cols = 2 ** (z + 1);
  const rows = 2 ** z;
  const x = Math.min(cols - 1, Math.max(0, Math.floor(((lng + 180) / 360) * cols)));
  const y = Math.min(rows - 1, Math.max(0, Math.floor(((90 - lat) / 180) * rows)));
  return loadImage(tileUrl(layer, z, y, x));
}

/**
 * Turn the brightness of an image into a tangent-space normal map (Sobel filter).
 * `wrapX` is for globes, where the left and right edges meet.
 */
export function shadingToNormalMap(src: HTMLCanvasElement, strength = 2, wrapX = true): HTMLCanvasElement {
  const w = src.width;
  const h = src.height;
  const lum = new Float32Array(w * h);
  const data = src.getContext("2d")!.getImageData(0, 0, w, h).data;
  for (let i = 0; i < w * h; i++) lum[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  return heightToNormalMap(lum, w, h, strength, wrapX);
}

export function heightToNormalMap(height: Float32Array, w: number, h: number, strength: number, wrapX: boolean): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const at = (x: number, y: number) => {
    if (wrapX) x = (x + w) % w;
    else x = Math.min(w - 1, Math.max(0, x));
    y = Math.min(h - 1, Math.max(0, y));
    return height[y * w + x];
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Sobel gradients
      const tl = at(x - 1, y - 1), t = at(x, y - 1), tr = at(x + 1, y - 1);
      const l = at(x - 1, y), r = at(x + 1, y);
      const bl = at(x - 1, y + 1), b = at(x, y + 1), br = at(x + 1, y + 1);
      const dx = (tr + 2 * r + br - (tl + 2 * l + bl)) * strength;
      const dy = (bl + 2 * b + br - (tl + 2 * t + tr)) * strength;
      let nx = -dx, ny = dy, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len; ny /= len; nz /= len;
      const i = (y * w + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

// ───────────── Procedural ground (close-up detail around the vehicle) ─────────────

/** Small deterministic RNG so the ground looks the same on every visit. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(ix: number, iy: number, seed: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 982451653);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed), b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed), d = hash2(ix + 1, iy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

export function fbm(x: number, y: number, seed: number, octaves = 5) {
  let sum = 0, amp = 0.5, freq = 1, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + o * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm; // 0..1
}

export type Crater = { x: number; z: number; r: number; depth: number };

export type GroundSpec = {
  planet: "moon" | "mars";
  /** world size of the square ground (units) */
  size: number;
  /** vehicles sit on a flat pad of this radius */
  flatRadius: number;
  craters: Crater[];
  seed: number;
};

export function makeGroundSpec(planet: "moon" | "mars", size: number, flatRadius: number): GroundSpec {
  const seed = planet === "moon" ? 1967 : 2004;
  const rand = rng(seed);
  const craters: Crater[] = [];
  const count = planet === "moon" ? 26 : 7;
  for (let i = 0; i < count; i++) {
    const r = planet === "moon" ? 0.15 + rand() ** 2 * 1.3 : 0.2 + rand() * 0.6;
    const a = rand() * Math.PI * 2;
    const d = flatRadius + 0.4 + r + rand() * (size / 2 - flatRadius - r);
    craters.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, r, depth: r * (planet === "moon" ? 0.28 : 0.16) });
  }
  return { planet, size, flatRadius, craters, seed };
}

/** Ground height at world (x, z). 0 on the flat pad under the vehicle. */
export function groundHeight(spec: GroundSpec, x: number, z: number, fine = false) {
  const { planet, seed } = spec;
  let h = (fbm(x * 0.35, z * 0.35, seed, 4) - 0.5) * (planet === "mars" ? 0.55 : 0.4);
  if (planet === "mars") {
    // wind ripples across Meridiani-style plains
    const dir = x * 0.86 + z * 0.5;
    h += Math.sin(dir * 7 + fbm(x * 0.8, z * 0.8, seed + 3, 3) * 6) * 0.025;
  }
  for (const c of spec.craters) {
    const dist = Math.hypot(x - c.x, z - c.z) / c.r;
    if (dist < 1.6) {
      const bowl = dist < 1 ? -c.depth * (1 - dist * dist) : 0;
      const rim = c.depth * 0.45 * Math.exp(-((dist - 1) ** 2) / 0.04);
      h += bowl + rim;
    }
  }
  if (fine) h += (fbm(x * 9, z * 9, seed + 9, 3) - 0.5) * (planet === "moon" ? 0.02 : 0.014);
  // flatten the pad where the vehicle stands, blend smoothly to the open terrain
  const r = Math.hypot(x, z);
  const t = Math.min(1, Math.max(0, (r - spec.flatRadius) / 1.6));
  return h * t * t * (3 - 2 * t);
}

/** Colour + normal canvases for the ground (texture covers the whole square). */
export function makeGroundTextures(spec: GroundSpec, px = 512) {
  const { planet, size, seed } = spec;
  const heights = new Float32Array(px * px);
  const color = document.createElement("canvas");
  color.width = color.height = px;
  const ctx = color.getContext("2d")!;
  const img = ctx.createImageData(px, px);
  // base palettes (linear-ish sRGB): Moon = grey regolith, Mars = rusty ochre soil
  const base = planet === "moon" ? [118, 117, 115] : [150, 86, 52];
  const dark = planet === "moon" ? [62, 61, 60] : [92, 46, 27];
  const light = planet === "moon" ? [168, 166, 162] : [196, 128, 82];
  for (let j = 0; j < px; j++) {
    for (let i = 0; i < px; i++) {
      const x = (i / (px - 1) - 0.5) * size;
      const z = (j / (px - 1) - 0.5) * size;
      const h = groundHeight(spec, x, z, true);
      heights[j * px + i] = h;
      const n = fbm(x * 2.2, z * 2.2, seed + 21, 4);
      const speck = hash2(i, j, seed) > (planet === "moon" ? 0.985 : 0.99) ? 0.25 : 0;
      let k = 0.5 + (n - 0.5) * 0.9 + h * 0.6 + speck;
      k = Math.min(1, Math.max(0, k));
      const c = k < 0.5 ? mix(dark, base, k * 2) : mix(base, light, (k - 0.5) * 2);
      const o = (j * px + i) * 4;
      img.data[o] = c[0];
      img.data[o + 1] = c[1];
      img.data[o + 2] = c[2];
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // heights are in world units; scale so 1 px step ≈ real slope
  const pxPerUnit = px / size;
  const normal = heightToNormalMap(heights, px, px, pxPerUnit * 0.5, false);
  return { color, normal };
}

/** Blend a real NASA tile over the procedural colour, so the ground carries the landing site's true tones. */
export function tintWithNasaTile(color: HTMLCanvasElement, tile: HTMLImageElement, planet: "moon" | "mars") {
  const ctx = color.getContext("2d")!;
  ctx.save();
  ctx.globalCompositeOperation = planet === "moon" ? "overlay" : "soft-light";
  ctx.globalAlpha = planet === "moon" ? 0.55 : 0.7;
  ctx.drawImage(tile, 0, 0, color.width, color.height);
  ctx.restore();
}

function mix(a: number[], b: number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
