"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_CONTENT } from "@/content/home";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";
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

  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-24 lg:py-28 border-b border-border/60"
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

      <div className="container-max relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <Badge variant="primary" size="md" dot>
              {HERO_CONTENT.label}
            </Badge>
          </div>

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

          <div className="pt-4 border-t border-border/60 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gold shrink-0" aria-hidden="true" />
            <p className="font-mono text-xs sm:text-small text-text-muted tracking-wide">
              {HERO_CONTENT.trustLine}
            </p>
          </div>
        </div>

        {/* Right Column: Interactive 3D Scene */}
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { scale: sceneScale, opacity: sceneOpacity }
          }
          className="lg:col-span-6 will-change-[transform,opacity]"
        >
          <HeroSceneLoader />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
