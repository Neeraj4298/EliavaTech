"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_CONTENT } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";
import { ParticleField } from "@/components/three/ParticleField";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Section 4.2 #1 — Hero Section:
 * - Left: label "Digital solutions for growing businesses", H1 "Building What's Next.",
 *   subtext, buttons "Book a Free Consultation" and "See Our Work", trust line below.
 * - Right: interactive 3D scene that scales down and fades as the hero leaves the screen.
 */
export function HeroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)] items-center overflow-hidden py-8 md:py-12 border-b border-border/60"
    >
      {/* Subtle architectural background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, var(--primary) 0%, transparent 45%)",
        }}
      />

      {/* Full-Hero Floating Particle Field Background */}
      <ParticleField />

      <div className="container-max relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-4 md:space-y-6">
          <p className="font-mono text-xs sm:text-small font-medium text-primary">
            {HERO_CONTENT.label}
          </p>

          <SplitHeading
            text={HERO_CONTENT.title}
            as="h1"
            className="text-h1 block"
          />

          <p className="text-body text-text-muted max-w-xl">
            {HERO_CONTENT.subtext}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton cursorLabel="Book">
              <Button href={HERO_CONTENT.primaryCta.href} variant="primary" size="lg" withArrow>
                {HERO_CONTENT.primaryCta.label}
              </Button>
            </MagneticButton>

            <MagneticButton>
              <Button href={HERO_CONTENT.secondaryCta.href} variant="secondary" size="lg">
                {HERO_CONTENT.secondaryCta.label}
              </Button>
            </MagneticButton>
          </div>

          <div className="pt-4 border-t border-border/60">
            <p className="font-mono text-xs sm:text-small text-text-muted">
              {HERO_CONTENT.trustLine}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive 3D Scene */}
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { opacity: sceneOpacity }
          }
          className="lg:col-span-6 will-change-[opacity]"
        >
          <HeroSceneLoader />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
