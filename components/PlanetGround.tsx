"use client";

// Realistic ground under the 3D vehicle: a displaced terrain mesh (craters on the Moon, wind ripples
// on Mars), a centimetre-scale normal map, scattered rocks, and the true colours of the landing site
// taken from the NASA Trek tile that contains it (LRO WAC for Surveyor 3, Viking MDIM 2.1 for Opportunity).

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { groundHeight, loadSiteTile, makeGroundSpec, makeGroundTextures, rng, tintWithNasaTile } from "@/lib/planetTextures";
import type { PlanetId } from "@/data/types";

const SIZE = 16; // world units (the vehicle is ~2 units wide)
const SEGMENTS = 200;
const FLAT = 1.45; // flat pad radius under the vehicle

type Props = { planet: PlanetId; site: { lat: number; lng: number } };

export default function PlanetGround({ planet, site }: Props) {
  const spec = useMemo(() => makeGroundSpec(planet, SIZE, FLAT), [planet]);

  // Terrain geometry (heights baked into the vertices)
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // becomes world -z after the -90° rotation
      pos.setZ(i, groundHeight(spec, x, -y));
    }
    g.computeVertexNormals();
    return g;
  }, [spec]);

  // Colour + normal textures
  const { colorTex, normalTex, colorCanvas } = useMemo(() => {
    const { color, normal } = makeGroundTextures(spec, 512);
    const colorTex = new THREE.CanvasTexture(color);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    colorTex.anisotropy = 8;
    const normalTex = new THREE.CanvasTexture(normal);
    normalTex.anisotropy = 8;
    return { colorTex, normalTex, colorCanvas: color };
  }, [spec]);

  // Tint with the real NASA tile of the landing site (if NASA answers)
  useEffect(() => {
    let cancelled = false;
    const layer = planet === "moon" ? "moon-wac" : "mars-viking";
    loadSiteTile(layer, 7, site.lat, site.lng)
      .then((tile) => {
        if (cancelled) return;
        tintWithNasaTile(colorCanvas, tile, planet);
        colorTex.needsUpdate = true;
      })
      .catch(() => {
        /* procedural colours are enough */
      });
    return () => {
      cancelled = true;
    };
  }, [planet, site.lat, site.lng, colorCanvas, colorTex]);

  useEffect(
    () => () => {
      geometry.dispose();
      colorTex.dispose();
      normalTex.dispose();
    },
    [geometry, colorTex, normalTex],
  );

  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial
          map={colorTex}
          normalMap={normalTex}
          normalScale={new THREE.Vector2(planet === "moon" ? 1.4 : 1.1, planet === "moon" ? 1.4 : 1.1)}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <Rocks planet={planet} spec={spec} />
    </group>
  );
}

function Rocks({ planet, spec }: { planet: PlanetId; spec: ReturnType<typeof makeGroundSpec> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = planet === "mars" ? 140 : 70;

  // One lumpy rock shape, reused for every instance
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const rand = rng(planet === "mars" ? 77 : 33);
    for (let i = 0; i < pos.count; i++) {
      const k = 0.75 + rand() * 0.5;
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * 0.7, pos.getZ(i) * k);
    }
    g.computeVertexNormals();
    return g;
  }, [planet]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = rng(planet === "mars" ? 404 : 303);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      let x = 0,
        z = 0;
      // keep rocks off the vehicle pad
      do {
        x = (rand() - 0.5) * SIZE * 0.85;
        z = (rand() - 0.5) * SIZE * 0.85;
      } while (Math.hypot(x, z) < FLAT + 0.35);
      const s = (planet === "mars" ? 0.025 : 0.03) + rand() ** 3 * (planet === "mars" ? 0.16 : 0.2);
      e.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(x, groundHeight(spec, x, z) + s * 0.25, z), q, new THREE.Vector3(s, s, s));
      mesh.setMatrixAt(i, m);
      const tone = 0.75 + rand() * 0.35;
      color.set(planet === "mars" ? "#7a4a33" : "#8a8986").multiplyScalar(tone);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    (mesh.material as THREE.Material).needsUpdate = true; // compile with per-instance colours
  }, [planet, spec, count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} castShadow receiveShadow>
      <meshStandardMaterial roughness={0.95} metalness={0} />
    </instancedMesh>
  );
}
