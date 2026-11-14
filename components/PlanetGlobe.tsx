"use client";

// A realistic, slowly turning 3D globe of the Moon or Mars, textured with NASA Trek mosaics:
// colour from LRO WAC (Moon) / Viking MDIM 2.1 (Mars), relief (normal map) derived from the
// NASA shading (WAC / MOLA shaded relief), a single hard "sun" light, and a thin atmosphere rim on Mars.
// The landing site of the planet's spacecraft glows on the surface.
// While NASA tiles load — or if they fail — the stylised CSS sphere stays visible underneath.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Planet } from "@/data/types";
import { loadGlobeCanvas, shadingToNormalMap } from "@/lib/planetTextures";

type Site = { lat: number; lng: number; color: string };
type Maps = { color: THREE.Texture; normal: THREE.Texture };

const deg = Math.PI / 180;

function siteVector(lat: number, lng: number, r: number) {
  // matches three.js SphereGeometry UVs with an equirectangular map (lon 0 → +x, east → -z)
  return new THREE.Vector3(Math.cos(lng * deg) * Math.cos(lat * deg) * r, Math.sin(lat * deg) * r, -Math.sin(lng * deg) * Math.cos(lat * deg) * r);
}

function Atmosphere({ color }: { color: string }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(color) } },
        vertexShader: `varying vec3 vNormal;
          void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 glowColor; varying vec3 vNormal;
          void main(){ float i = pow(0.62 - dot(vNormal, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(glowColor, 1.0) * i; }`,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [color],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh scale={1.07} material={material}>
      <sphereGeometry args={[1, 64, 32]} />
    </mesh>
  );
}

function Globe({ planet, maps, site, spin }: { planet: Planet; maps: Maps; site?: Site; spin: boolean }) {
  const inner = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const start = site ? -Math.PI / 2 - site.lng * deg : 0;
  const marker = useMemo(() => (site ? siteVector(site.lat, site.lng, 1.004) : null), [site]);

  useFrame((state, dt) => {
    if (inner.current && spin) inner.current.rotation.y += dt * 0.07;
    if (halo.current) {
      const s = 1 + (Math.sin(state.clock.elapsedTime * 2.4) * 0.5 + 0.5) * 0.9;
      halo.current.scale.setScalar(s);
    }
  });

  return (
    // outer group tilts the landing latitude toward the camera; inner group spins around the pole
    <group rotation={[site ? site.lat * deg : 0.12, 0, 0]}>
      <group ref={inner} rotation={[0, start, 0]}>
        <mesh>
          <sphereGeometry args={[1, 128, 64]} />
          <meshStandardMaterial map={maps.color} normalMap={maps.normal} roughness={1} metalness={0} />
        </mesh>
        {marker && site && (
          <group position={marker}>
            <mesh>
              <sphereGeometry args={[0.022, 16, 8]} />
              <meshBasicMaterial color={site.color} toneMapped={false} />
            </mesh>
            <mesh ref={halo}>
              <sphereGeometry args={[0.035, 16, 8]} />
              <meshBasicMaterial color={site.color} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>
      {planet.globe.atmosphere && <Atmosphere color={planet.globe.atmosphere} />}
    </group>
  );
}

export default function PlanetGlobe({ planet, site, className = "" }: { planet: Planet; site?: Site; className?: string }) {
  const [maps, setMaps] = useState<Maps | null>(null);
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a browser preference after mount
    setSpin(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let cancelled = false;
    let made: Maps | null = null;
    const { colorLayer, reliefLayer, reliefStrength } = planet.globe;
    Promise.all([loadGlobeCanvas(colorLayer, 1), loadGlobeCanvas(reliefLayer, 1)])
      .then(([colorCanvas, reliefCanvas]) => {
        if (cancelled) return;
        const color = new THREE.CanvasTexture(colorCanvas);
        color.colorSpace = THREE.SRGBColorSpace;
        color.anisotropy = 4;
        const normal = new THREE.CanvasTexture(shadingToNormalMap(reliefCanvas, reliefStrength, true));
        normal.anisotropy = 4;
        made = { color, normal };
        setMaps(made);
      })
      .catch(() => {
        /* keep the CSS sphere */
      });
    return () => {
      cancelled = true;
      made?.color.dispose();
      made?.normal.dispose();
    };
  }, [planet]);

  return (
    <div className={`relative ${className}`}>
      {/* Stylised fallback sphere (also the loading state) */}
      <div
        className={`planet absolute inset-0 transition-opacity duration-700 [animation:none] ${maps ? "opacity-0" : "opacity-100"}`}
        style={
          {
            background: `radial-gradient(circle at 30% 30%, ${planet.colors[0]}, ${planet.colors[1]} 45%, ${planet.colors[2]})`,
            "--planet-glow": planet.id === "mars" ? "rgba(255,122,69,.35)" : "rgba(201,209,230,.25)",
          } as React.CSSProperties
        }
        aria-hidden
      />
      {maps && (
        <div
          className="fade-up absolute -inset-[12%] rounded-full"
          style={{ filter: `drop-shadow(0 0 28px ${planet.id === "mars" ? "rgba(255,122,69,.35)" : "rgba(201,209,230,.22)"})` }}
          aria-hidden
        >
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.95], fov: 35 }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={planet.id === "moon" ? 0.05 : 0.1} />
            {/* the Sun: hard light from the side so craters and canyons throw real shadows */}
            <directionalLight position={[-4, 1.6, 2.6]} intensity={planet.id === "moon" ? 3.2 : 2.8} color={planet.id === "mars" ? "#fff2e6" : "#ffffff"} />
            <Globe planet={planet} maps={maps} site={site} spin={spin} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
