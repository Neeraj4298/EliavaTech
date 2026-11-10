"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONCEPT_PROJECTS } from "@/content/navigation";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";

/**
 * Section 4.2 #8 — Work Preview:
 * Three concept project cards clearly labelled "Concept project" with device mockups.
 */
export function WorkPreviewSection() {
  return (
    <Section className="border-t border-border/60 bg-surface/40" id="work">
      <div className="space-y-12">
        <SectionHeading
          eyebrow="Concept Projects · Proof of Capability"
          title="Interactive demonstrations built to production standards."
          description="Explore three working concept projects showing how we engineer clinic booking systems, retail e-commerce, and real estate CRM pipelines."
          action={
            <Link href="/work">
              <Button variant="secondary" size="md" withArrow>
                View All Demos
              </Button>
            </Link>
          }
        />

        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CONCEPT_PROJECTS.map((project, index) => (
            <StaggerItem key={project.slug} className="h-full">
              <Link href={project.href} className="block h-full group">
                <TiltCard cursorLabel="View" className="h-full">
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="gold" size="sm" dot>
                          Concept project
                        </Badge>
                        <span className="font-mono text-xs text-text-muted">
                          {project.industry}
                        </span>
                      </div>

                      <DeviceMockup
                        type="browser"
                        url={`demo.eliavatech.com/${project.slug}`}
                        title={`0${index + 1}`}
                      >
                        <div className="space-y-2.5 py-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] text-primary">
                              {project.category}
                            </span>
                            <span className="h-2 w-12 rounded-pill bg-success/40" />
                          </div>
                          <div className="h-2.5 w-3/4 rounded-pill bg-text/20" />
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="h-12 rounded-input border border-border bg-surface-2 p-2">
                              <div className="h-1.5 w-8 rounded-pill bg-primary/50" />
                            </div>
                            <div className="h-12 rounded-input border border-border bg-surface-2 p-2">
                              <div className="h-1.5 w-10 rounded-pill bg-gold/60" />
                            </div>
                            <div className="h-12 rounded-input border border-border bg-surface-2 p-2">
                              <div className="h-1.5 w-7 rounded-pill bg-success/60" />
                            </div>
                          </div>
                        </div>
                      </DeviceMockup>

                      <h3 className="font-heading text-xl font-semibold text-text group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-small text-text-muted leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-small font-medium text-primary">
                      <span>Inspect Concept Project</span>
                      <ArrowRight
                        strokeWidth={1.5}
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                      />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}

export default WorkPreviewSection;
