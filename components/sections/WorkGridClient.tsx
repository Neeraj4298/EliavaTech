"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WORK_PROJECTS } from "@/content/work";
import { Badge } from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const SERVICE_FILTERS = [
  "All Services",
  "WhatsApp & AI Automation",
  "E-commerce",
  "Custom Software",
] as const;

const INDUSTRY_FILTERS = [
  "All Industries",
  "Clinics & Healthcare",
  "Retail & D2C Stores",
  "Real Estate",
] as const;

/**
 * Section 4.5 — Filterable Work Grid by Service and Industry:
 * Cards open a concept project page. Every card is clearly labelled "Concept project".
 */
export function WorkGridClient() {
  const [serviceFilter, setServiceFilter] = React.useState<string>("All Services");
  const [industryFilter, setIndustryFilter] = React.useState<string>("All Industries");

  const filtered = WORK_PROJECTS.filter((project) => {
    const matchService =
      serviceFilter === "All Services" || project.serviceFilter === serviceFilter;
    const matchIndustry =
      industryFilter === "All Industries" || project.industryFilter === industryFilter;
    return matchService && matchIndustry;
  });

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="rounded-card border border-border bg-surface p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase text-text-muted mr-2">
            Filter by Service:
          </span>
          {SERVICE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setServiceFilter(f)}
              className={cn(
                "rounded-pill border px-3.5 py-1.5 text-xs font-medium transition-colors",
                serviceFilter === f
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface-2 text-text-muted hover:text-text"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
          <span className="font-mono text-xs uppercase text-text-muted mr-2">
            Filter by Industry:
          </span>
          {INDUSTRY_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setIndustryFilter(f)}
              className={cn(
                "rounded-pill border px-3.5 py-1.5 text-xs font-medium transition-colors",
                industryFilter === f
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface-2 text-text-muted hover:text-text"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Concept Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filtered.map((project, idx) => (
          <Link key={project.slug} href={`/work/${project.slug}`} className="block h-full group">
            <TiltCard cursorLabel="View" className="h-full">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="gold" size="sm" dot>
                      {project.label}
                    </Badge>
                    <span className="font-mono text-xs text-text-muted">
                      {project.industryFilter}
                    </span>
                  </div>

                  <DeviceMockup
                    type="browser"
                    url={project.demoUrl}
                    title={`0${idx + 1}`}
                  >
                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-primary">
                          {project.serviceFilter}
                        </span>
                        <Badge variant="success" size="sm">Interactive Demo</Badge>
                      </div>
                      <p className="text-xs font-medium text-text">{project.title}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="rounded-pill border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </DeviceMockup>

                  <h2 className="font-heading text-2xl font-semibold text-text group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-small text-text-muted leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-small font-medium text-primary">
                  <span>Open Interactive Concept Demo</span>
                  <ArrowRight
                    strokeWidth={1.5}
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </TiltCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WorkGridClient;
