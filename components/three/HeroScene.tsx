"use client";

import * as React from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Html, Environment, Lightformer } from "@react-three/drei";
import { useTheme } from "next-themes";
import { Code2, MessageSquare, ShoppingCart, BarChart3 } from "lucide-react";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";

interface MonogramRigProps {
  isDark: boolean;
  exploded: boolean;
}

const ORBIT_TOKENS = [
  { id: "code", label: "Websites", Icon: Code2, angle: 0, radius: 2.35, yOffset: 0.9 },
  { id: "chat", label: "WhatsApp AI", Icon: MessageSquare, angle: Math.PI * 0.5, radius: 2.45, yOffset: 0.25 },
  { id: "cart", label: "E-commerce", Icon: ShoppingCart, angle: Math.PI, radius: 2.35, yOffset: -0.45 },
  { id: "chart", label: "CRM & ERP", Icon: BarChart3, angle: Math.PI * 1.5, radius: 2.45, yOffset: -0.95 },
] as const;

function MonogramRig({ isDark, exploded }: MonogramRigProps) {
  const rootGroup = React.useRef<THREE.Group>(null);
  const topSlab = React.useRef<THREE.Mesh>(null);
  const midSlab = React.useRef<THREE.Mesh>(null);
  const botSlab = React.useRef<THREE.Mesh>(null);
  const orbitGroup = React.useRef<THREE.Group>(null);

  const dragging = React.useRef(false);
  const prevPointer = React.useRef({ x: 0, y: 0 });
  const dragVelocity = React.useRef({ x: 0, y: 0 });
  const dragAngle = React.useRef({ x: 0.12, y: -0.32 });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const dx = e.clientX - prevPointer.current.x;
    const dy = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = { x: dy * 0.006, y: dx * 0.008 };
    dragAngle.current.y += dragVelocity.current.y;
    dragAngle.current.x = THREE.MathUtils.clamp(
      dragAngle.current.x + dragVelocity.current.x,
      -0.55,
      0.55
    );
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!dragging.current) {
      dragVelocity.current.x *= 0.92;
      dragVelocity.current.y *= 0.92;
      dragAngle.current.y += dragVelocity.current.y + delta * 0.18;
      dragAngle.current.x += dragVelocity.current.x;
    }

    if (rootGroup.current) {
      const targetRotX = dragAngle.current.x - state.pointer.y * 0.24;
      const targetRotY = dragAngle.current.y + state.pointer.x * 0.34;
      rootGroup.current.rotation.x = THREE.MathUtils.lerp(
        rootGroup.current.rotation.x,
        targetRotX,
        0.08
      );
      rootGroup.current.rotation.y = THREE.MathUtils.lerp(
        rootGroup.current.rotation.y,
        targetRotY,
        0.08
      );
      rootGroup.current.position.y = Math.sin(t * 1.2) * 0.09;
    }

    const topTargetY = exploded ? 1.28 : 0.85;
    const botTargetY = exploded ? -1.28 : -0.85;
    if (topSlab.current) {
      topSlab.current.position.y = THREE.MathUtils.lerp(topSlab.current.position.y, topTargetY, 0.1);
    }
    if (botSlab.current) {
      botSlab.current.position.y = THREE.MathUtils.lerp(botSlab.current.position.y, botTargetY, 0.1);
    }
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y = t * 0.28;
    }
  });

  const goldColor = isDark ? "#F2B84B" : "#C98A12";
  const indigoColor = isDark ? "#7C6CFF" : "#4B3FE0";
  const baseSlabColor = isDark ? "#1B2644" : "#DDE3F4";

  return (
    <group
      ref={rootGroup}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <RoundedBox ref={topSlab} args={[2.6, 0.46, 0.68]} radius={0.12} smoothness={4} position={[0, 0.85, 0]}>
        <meshStandardMaterial
          color={goldColor}
          emissive={isDark ? "#F2B84B" : "#000000"}
          emissiveIntensity={isDark ? 0.22 : 0}
          roughness={isDark ? 0.25 : 0.32}
          metalness={0.72}
        />
        {exploded && (
          <Html position={[1.55, 0, 0]} center distanceFactor={8}>
            <div className="whitespace-nowrap rounded-pill border border-gold/60 bg-surface/95 px-2.5 py-1 font-mono text-[11px] font-medium text-gold shadow-md">
              03 · AI &amp; Automation
            </div>
          </Html>
        )}
      </RoundedBox>

      {/* Middle Slab: Shorter stepped bar */}
      <RoundedBox ref={midSlab} args={[1.95, 0.46, 0.68]} radius={0.12} smoothness={4} position={[-0.325, 0, 0]}>
        <meshPhysicalMaterial
          color={indigoColor}
          emissive={isDark ? "#7C6CFF" : "#000000"}
          emissiveIntensity={isDark ? 0.28 : 0}
          roughness={isDark ? 0.18 : 0.25}
          metalness={0.35}
          transmission={isDark ? 0.25 : 0.4}
          thickness={0.8}
        />
        {exploded && (
          <Html position={[1.25, 0, 0]} center distanceFactor={8}>
            <div className="whitespace-nowrap rounded-pill border border-primary/60 bg-surface/95 px-2.5 py-1 font-mono text-[11px] font-medium text-primary shadow-md">
              02 · Custom Software
            </div>
          </Html>
        )}
      </RoundedBox>

      {/* Bottom Slab: Full width foundation */}
      <RoundedBox ref={botSlab} args={[2.6, 0.46, 0.68]} radius={0.12} smoothness={4} position={[0, -0.85, 0]}>
        <meshPhysicalMaterial
          color={baseSlabColor}
          emissive={isDark ? "#4B3FE0" : "#000000"}
          emissiveIntensity={isDark ? 0.14 : 0}
          roughness={isDark ? 0.24 : 0.28}
          metalness={0.45}
          transmission={0.2}
          thickness={0.6}
        />
        {exploded && (
          <Html position={[1.55, 0, 0]} center distanceFactor={8}>
            <div className="whitespace-nowrap rounded-pill border border-border bg-surface/95 px-2.5 py-1 font-mono text-[11px] font-medium text-text shadow-md">
              01 · Websites &amp; E-commerce
            </div>
          </Html>
        )}
      </RoundedBox>

      {/* Four Orbiting Service Icon Tokens */}
      <group ref={orbitGroup}>
        {ORBIT_TOKENS.map(({ id, label, Icon, angle, radius, yOffset }) => {
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group key={id} position={[x, yOffset, z]}>
              <mesh>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial
                  color={indigoColor}
                  emissive={indigoColor}
                  emissiveIntensity={isDark ? 0.4 : 0.1}
                  roughness={0.3}
                />
              </mesh>
              <Html center distanceFactor={9}>
                <div className="pointer-events-none flex items-center gap-1.5 rounded-pill border border-border bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-text shadow-sm backdrop-blur-xs">
                  <Icon strokeWidth={1.5} className="h-3 w-3 text-primary" />
                  <span>{label}</span>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export interface HeroSceneProps {
  active?: boolean;
}

export function HeroScene({ active = true }: HeroSceneProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [exploded, setExploded] = React.useState(false);

  return (
    <div
      data-cursor-label="Drag"
      onMouseEnter={() => setExploded(true)}
      onMouseLeave={() => setExploded(false)}
      className="relative h-[420px] sm:h-[480px] lg:h-[540px] w-full select-none cursor-grab active:cursor-grabbing rounded-card border border-border/60 bg-surface/35"
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0.2, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={isDark ? 0.65 : 1.1} />
        <directionalLight position={[4, 6, 4]} intensity={isDark ? 1.4 : 1.8} />
        <pointLight position={[-4, -2, 3]} intensity={isDark ? 1.1 : 0.7} color={isDark ? "#7C6CFF" : "#4B3FE0"} />

        <Environment resolution={128}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={2.2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[8, 8, 1]} />
            <Lightformer intensity={1.4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[8, 2, 1]} />
            <Lightformer intensity={1.2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[8, 2, 1]} />
          </group>
        </Environment>

        <ParticleField isDark={isDark} />
        <MonogramRig isDark={isDark} exploded={exploded} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-text-muted">
        <span>{exploded ? "Exploded layer view active" : "Hover to inspect layers · Drag to rotate"}</span>
        <span>3D Monogram</span>
      </div>
    </div>
  );
}

export default HeroScene;

