// GET /api/nasa/tile?layer=<id>&z=<z>&y=<y>&x=<x>
// Same-origin proxy for NASA Trek map tiles, so the 3D globes and terrain can use them as WebGL textures
// (WebGL needs CORS-clean images; going through our own server avoids any cross-origin problem).
// Only the NASA layers listed below can be requested, and only at sensible zoom levels.
import { TREK_BASE } from "@/lib/nasa/sources";

const LAYERS: Record<string, { path: string; maxZoom: number }> = {
  "moon-wac": { path: "Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02", maxZoom: 7 },
  "mars-viking": { path: "Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m", maxZoom: 7 },
  "mars-mola": { path: "Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m", maxZoom: 6 },
};

function int(v: string | null) {
  if (v === null || !/^\d{1,4}$/.test(v)) return null;
  return Number(v);
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const layer = LAYERS[q.get("layer") ?? ""];
  const z = int(q.get("z"));
  const y = int(q.get("y"));
  const x = int(q.get("x"));

  // Trek EQ tiling: zoom z has 2^(z+1) columns and 2^z rows.
  if (!layer || z === null || y === null || x === null || z > layer.maxZoom || y >= 2 ** z || x >= 2 ** (z + 1)) {
    return Response.json({ ok: false, error: "BAD_TILE" }, { status: 400 });
  }

  const url = `${TREK_BASE}/${layer.path}/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { "User-Agent": "ReliQ-education-app" } });
    if (!res.ok) return Response.json({ ok: false, error: "NASA_UNAVAILABLE" }, { status: 502 });
    const body = await res.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        // NASA mosaics are static, so tiles can be cached for a long time.
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (err) {
    console.error("NASA tile failed", url, err);
    return Response.json({ ok: false, error: "NASA_UNAVAILABLE" }, { status: 502 });
  }
}
