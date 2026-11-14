"use client";

import * as React from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import { useTheme } from "next-themes";
import { Code2, MessageSquare, ShoppingCart, BarChart3 } from "lucide-react";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";

if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

const ORBIT_TOKENS = [
  { id: "code", label: "Websites", Icon: Code2, angle: 0, radius: 2.25, yOffset: 0.85 },
  { id: "chat", label: "WhatsApp AI", Icon: MessageSquare, angle: Math.PI * 0.5, radius: 2.35, yOffset: 0.25 },
  { id: "cart", label: "E-commerce", Icon: ShoppingCart, angle: Math.PI, radius: 2.25, yOffset: -0.4 },
  { id: "chart", label: "CRM & ERP", Icon: BarChart3, angle: Math.PI * 1.5, radius: 2.35, yOffset: -0.9 },
] as const;

const LAYER_LABELS = [
  { id: "top", text: "03 · AI & Automation", tone: "gold" },
  { id: "mid", text: "02 · Custom Software", tone: "primary" },
  { id: "bot", text: "01 · Websites & E-commerce", tone: "default" },
] as const;

interface ScreenPoint {
  x: number;
  y: number;
}

interface MonogramRigProps {
  isDark: boolean;
  exploded: boolean;
  onToggleExploded: () => void;
  onUpdateOverlays: (
    tokens: Array<ScreenPoint | null>,
    layers: Array<ScreenPoint | null>,
    width: number,
    height: number
  ) => void;
}

function projectToScreen(
  obj: THREE.Object3D | null,
  camera: THREE.Camera,
  width: number,
  height: number,
  offsetVec: THREE.Vector3,
  scratchVec: THREE.Vector3
): ScreenPoint | null {
  if (!obj) return null;
  scratchVec.copy(offsetVec);
  obj.localToWorld(scratchVec);
  scratchVec.project(camera);
  return {
    x: (scratchVec.x * 0.5 + 0.5) * width,
    y: (-scratchVec.y * 0.5 + 0.5) * height,
  };
}

function MonogramRig({
  isDark,
  exploded,
  onToggleExploded,
  onUpdateOverlays,
}: MonogramRigProps) {
  const rootGroup = React.useRef<THREE.Group>(null);
  const topSlab = React.useRef<THREE.Mesh>(null);
  const midSlab = React.useRef<THREE.Mesh>(null);
  const botSlab = React.useRef<THREE.Mesh>(null);
  const orbitGroup = React.useRef<THREE.Group>(null);
  const tokenMeshRefs = React.useRef<Array<THREE.Group | null>>([]);

  const elapsedRef = React.useRef(0);
  const dragging = React.useRef(false);
  const movedDuringDrag = React.useRef(false);
  const prevPointer = React.useRef({ x: 0, y: 0 });
  const dragVelocity = React.useRef({ x: 0, y: 0 });
  const dragAngle = React.useRef({ x: 0.12, y: -0.32 });

  const scratchVec = React.useMemo(() => new THREE.Vector3(), []);
  const zeroOffset = React.useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const rightEdgeOffset = React.useMemo(() => new THREE.Vector3(1.1, 0, 0), []);
  const midRightOffset = React.useMemo(() => new THREE.Vector3(0.85, 0, 0), []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragging.current = true;
    movedDuringDrag.current = false;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = () => {
    if (dragging.current && !movedDuringDrag.current) {
      onToggleExploded();
    }
    dragging.current = false;
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const dx = e.clientX - prevPointer.current.x;
    const dy = e.clientY - prevPointer.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      movedDuringDrag.current = true;
    }
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
    elapsedRef.current += delta;
    const t = elapsedRef.current;
    if (!dragging.current) {
      dragVelocity.current.x *= 0.92;
      dragVelocity.current.y *= 0.92;
      dragAngle.current.y += dragVelocity.current.y + delta * 0.18;
      dragAngle.current.x += dragVelocity.current.x;
    }

    const { width, height } = state.size;
    const aspect = height > 0 ? width / height : 1;
    const responsiveScale = THREE.MathUtils.clamp(aspect * 1.02, 0.72, 1);

    if (rootGroup.current) {
      rootGroup.current.scale.setScalar(responsiveScale);
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

    const topTargetY = exploded ? 1.25 : 0.85;
    const botTargetY = exploded ? -1.25 : -0.85;
    if (topSlab.current) {
      topSlab.current.position.y = THREE.MathUtils.lerp(topSlab.current.position.y, topTargetY, 0.1);
    }
    if (botSlab.current) {
      botSlab.current.position.y = THREE.MathUtils.lerp(botSlab.current.position.y, botTargetY, 0.1);
    }
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y = t * 0.28;
    }

    const tokenPositions = ORBIT_TOKENS.map((_, i) =>
      projectToScreen(
        tokenMeshRefs.current[i] ?? null,
        state.camera,
        width,
        height,
        zeroOffset,
        scratchVec
      )
    );

    const slabs = [
      { mesh: topSlab.current, offset: rightEdgeOffset },
      { mesh: midSlab.current, offset: midRightOffset },
      { mesh: botSlab.current, offset: rightEdgeOffset },
    ];
    const layerPositions = slabs.map((item) =>
      projectToScreen(item.mesh, state.camera, width, height, item.offset, scratchVec)
    );

    onUpdateOverlays(tokenPositions, layerPositions, width, height);
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
      </RoundedBox>

      {/* Four Orbiting Service Token Spheres (labels rendered in React overlay outside Canvas) */}
      <group ref={orbitGroup}>
        {ORBIT_TOKENS.map(({ id, angle, radius, yOffset }, index) => {
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <group
              key={id}
              ref={(node) => {
                tokenMeshRefs.current[index] = node;
              }}
              position={[x, yOffset, z]}
            >
              <mesh>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial
                  color={indigoColor}
                  emissive={indigoColor}
                  emissiveIntensity={isDark ? 0.45 : 0.12}
                  roughness={0.28}
                />
              </mesh>
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

  const tokenElRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const layerElRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const handleUpdateOverlays = React.useCallback(
    (
      tokens: Array<ScreenPoint | null>,
      layers: Array<ScreenPoint | null>,
      width: number,
      height: number
    ) => {
      const padX = width < 440 ? 58 : 68;
      const padTop = 44;
      const padBottom = 44;

      for (let i = 0; i < tokens.length; i++) {
        const el = tokenElRefs.current[i];
        const pos = tokens[i];
        if (el && pos) {
          const cx = Math.min(Math.max(pos.x, padX), Math.max(padX, width - padX));
          const cy = Math.min(Math.max(pos.y, padTop), Math.max(padTop, height - padBottom));
          el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        }
      }
      const layerPadX = width < 440 ? 88 : 104;
      for (let i = 0; i < layers.length; i++) {
        const el = layerElRefs.current[i];
        const pos = layers[i];
        if (el && pos) {
          const cx = Math.min(Math.max(pos.x, layerPadX), Math.max(layerPadX, width - layerPadX));
          const cy = Math.min(Math.max(pos.y, padTop), Math.max(padTop, height - padBottom));
          el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        }
      }
    },
    []
  );

  return (
    <div
      data-cursor-label="Drag"
      onMouseEnter={() => setExploded(true)}
      onMouseLeave={() => setExploded(false)}
      className="relative h-[380px] sm:h-[460px] lg:h-[540px] w-full overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing rounded-card border border-border/60 bg-surface/35"
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
        <MonogramRig
          isDark={isDark}
          exploded={exploded}
          onToggleExploded={() => setExploded((prev) => !prev)}
          onUpdateOverlays={handleUpdateOverlays}
        />
      </Canvas>

      {/* Pure React 2D Overlay for Orbiting Icon Tokens & Exploded Layer Labels (no nested React roots!) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {ORBIT_TOKENS.map(({ id, label, Icon }, index) => (
          <div
            key={id}
            ref={(node) => {
              tokenElRefs.current[index] = node;
            }}
            style={{ transform: "translate3d(-200px, -200px, 0)" }}
            className="absolute left-0 top-0 flex items-center gap-1.5 rounded-pill border border-border bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-text shadow-sm backdrop-blur-xs will-change-transform"
          >
            <Icon strokeWidth={1.5} className="h-3 w-3 text-primary" />
            <span>{label}</span>
          </div>
        ))}

        {LAYER_LABELS.map((layer, index) => (
          <div
            key={layer.id}
            ref={(node) => {
              layerElRefs.current[index] = node;
            }}
            style={{
              transform: "translate3d(-200px, -200px, 0)",
              opacity: exploded ? 1 : 0,
            }}
            className={`absolute left-0 top-0 whitespace-nowrap rounded-pill border bg-surface/95 px-2.5 py-1 font-mono text-[11px] font-medium shadow-md transition-opacity duration-200 will-change-[transform,opacity] ${
              layer.tone === "gold"
                ? "border-gold/60 text-gold"
                : layer.tone === "primary"
                ? "border-primary/60 text-primary"
                : "border-border text-text"
            }`}
          >
            {layer.text}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-text-muted">
        <span className="truncate">
          {exploded ? "Exploded layer view active" : "Tap or hover layers · Drag to rotate"}
        </span>
        <span className="shrink-0">3D Monogram</span>
      </div>
    </div>
  );
}

export default HeroScene;


