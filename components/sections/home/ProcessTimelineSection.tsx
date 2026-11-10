"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { PROCESS_STEPS } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Section 4.2 #4 & Section 5.4 — How We Work (ProcessTimeline):
 * Four-step horizontal timeline (Discover, Design, Build, Support)
 * where the progress line draws and steps activate in sequence via GSAP ScrollTrigger.
 */
export function ProcessTimelineSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined" || !containerRef.current || !lineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 72%",
            end: "bottom 42%",
            scrub: 0.4,
            onUpdate: (self) => {
              const idx = Math.min(
                PROCESS_STEPS.length - 1,
                Math.floor(self.progress * PROCESS_STEPS.length)
              );
              setActiveStep(idx);
            },
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section className="border-y border-border/60 bg-surface/40">
      <div ref={containerRef} className="space-y-12">
        <SectionHeading
          eyebrow="How We Work"
          title="Four structured steps from problem to launch."
          description="No endless agency meetings or vague timelines. Every project follows a transparent four-stage delivery rhythm."
        />

        {/* Horizontal Progress Bar (Desktop) */}
        <div className="relative hidden lg:block h-1 w-full rounded-pill bg-border overflow-hidden">
          <div
            ref={lineRef}
            style={{ transformOrigin: "left" }}
            className="h-full w-full bg-primary will-change-transform"
          />
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((item, idx) => {
            const isActivated = prefersReducedMotion || idx <= activeStep;
            return (
              <Card
                key={item.step}
                variant={isActivated ? "elevated" : "default"}
                className={cn(
                  "flex flex-col justify-between gap-5 transition-all duration-250",
                  isActivated && "border-primary/50"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={isActivated ? "primary" : "default"} size="sm">
                      Step {item.step}
                    </Badge>
                    <CheckCircle2
                      strokeWidth={1.5}
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActivated ? "text-primary" : "text-border"
                      )}
                    />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="text-small text-text-muted leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <p className="font-mono text-xs text-primary">
                    Deliverable: {item.deliverable}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default ProcessTimelineSection;
