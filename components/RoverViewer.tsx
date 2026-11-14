"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows, OrbitControls, Stars } from "@react-three/drei";
import RoverModel from "./RoverModel";
import PlanetGround from "./PlanetGround";
import type { PartMesh, PlanetId, RoverModelKind } from "@/data/types";

type Props = {
  kind: RoverModelKind;
  planet: PlanetId;
  /** landing site — used to tint the ground with the real NASA tile */
  site: { lat: number; lng: number };
  accent: string;
  active: PartMesh | null;
  clickable: PartMesh[];
  onPick: (p: PartMesh) => void;
};

/** Widen the view on tall/narrow screens (phones, iPad portrait) so the vehicle fits. */
function AdaptiveFov() {
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = aspect < 1.2 ? Math.min(70, 38 * (1.2 / aspect)) : 38;
    camera.updateProjectionMatrix();
  }, [aspect, get]);
  return null;
}

// Lighting tuned per world:
//  • Moon — no air: a single hard white Sun low on the horizon, pitch-black sky, sharp long shadows,
//    almost no fill light (only the faint glow bounced from the grey ground).
//  • Mars — thin dusty air: a slightly warm Sun, butterscotch sky light from above, rusty ground bounce
//    and a dusty haze that swallows the horizon.
const LOOK = {
  moon: {
    bg: "#020205",
    fog: ["#020205", 9, 20] as const,
    ambient: 0.05,
    hemi: { sky: "#c9d3e6", ground: "#3a3a3d", intensity: 0.18 },
    sun: { pos: [6, 2.6, 2.2] as [number, number, number], intensity: 3.6, color: "#ffffff" },
    fill: { pos: [-4, 1.2, -3] as [number, number, number], intensity: 0.12, color: "#9aa7c2" },
    stars: 3000,
    exposure: 1.05,
  },
  mars: {
    bg: "#140a07",
    fog: ["#3a1d12", 6.5, 17] as const,
    ambient: 0.14,
    hemi: { sky: "#e0a57e", ground: "#5a2a18", intensity: 0.42 },
    sun: { pos: [5, 5.5, 3] as [number, number, number], intensity: 2.6, color: "#fff0dc" },
    fill: { pos: [-4, 2.5, -4] as [number, number, number], intensity: 0.35, color: "#ffb08a" },
    stars: 600,
    exposure: 1.0,
  },
};

export default function RoverViewer({ kind, planet, site, accent, active, clickable, onPick }: Props) {
  const L = LOOK[planet];
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.2, 2.1, 3.2], fov: 38 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: L.exposure }}
    >
      <AdaptiveFov />
      <color attach="background" args={[L.bg]} />
      <fog attach="fog" args={[...L.fog]} />
      <Stars radius={60} depth={30} count={L.stars} factor={3} fade speed={0.4} />

      <ambientLight intensity={L.ambient} />
      <hemisphereLight args={[L.hemi.sky, L.hemi.ground, L.hemi.intensity]} />
      <directionalLight
        position={L.sun.pos}
        intensity={L.sun.intensity}
        color={L.sun.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
      />
      <directionalLight position={L.fill.pos} intensity={L.fill.intensity} color={L.fill.color} />

      <group position={[0, -0.6, 0]}>
        <RoverModel kind={kind} active={active} clickable={clickable} accent={accent} onPick={onPick} />
        <PlanetGround planet={planet} site={site} />
        <ContactShadows position={[0, 0.003, 0]} opacity={planet === "moon" ? 0.75 : 0.55} scale={5} blur={2.2} far={2} />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={!active}
        autoRotateSpeed={0.8}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
