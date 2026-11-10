"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ParticleFieldProps {
  count?: number;
  isDark: boolean;
}

function createParticleBuffers(count: number) {
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random distribution around the monogram
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const seed3 = Math.sin(i * 39.425) * 43758.5453;

    const r1 = seed1 - Math.floor(seed1);
    const r2 = seed2 - Math.floor(seed2);
    const r3 = seed3 - Math.floor(seed3);

    const radius = 2.4 + r1 * 2.8;
    const theta = r2 * Math.PI * 2;
    const phi = Math.acos(2 * r3 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.85;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.7;
    scales[i] = 0.5 + r1 * 0.8;
  }

  return { positions };
}

/**
 * Section 5.2 & 6 — ParticleField:
 * Procedural soft particle cloud surrounding the 3D E monogram slabs.
 */
export function ParticleField({ count = 110, isDark }: ParticleFieldProps) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const { positions } = React.useMemo(() => createParticleBuffers(count), [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.045;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
  });

  const color = isDark ? "#9A8DFF" : "#4B3FE0";

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={isDark ? 0.55 : 0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default ParticleField;
