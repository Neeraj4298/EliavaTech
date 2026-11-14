"use client";

import * as React from "react";
import Link from "next/link";
import {
  Globe,
  ShoppingBag,
  MessageSquareCode,
  Boxes,
  CloudCog,
  ArrowRight,
} from "lucide-react";
import { SERVICE_ITEMS, type ServiceNavItem } from "@/content/navigation";
import { TECH_CAPABILITIES } from "@/content/home";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TiltCard } from "@/components/motion/TiltCard";

const iconMap: Record<
  ServiceNavItem["icon"],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Globe,
  ShoppingBag,
  MessageSquareCode,
  Boxes,
  CloudCog,
};

export function ServicesOverviewSection() {
  return (
    <Section id="services">
      <div className="space-y-12">
        <SectionHeading
          eyebrow="Five Integrated Service Lines"
          title="Everything you need to run a modern digital business."
          description="From your first search-ready website to automated WhatsApp customer flows and custom CRM dashboards."
          action={
            <Button href="/services" variant="secondary" size="md" withArrow>
              Compare All Services
            </Button>
          }
        />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr gap-6">
          {SERVICE_ITEMS.map((service, idx) => {
            const Icon = iconMap[service.icon];
            return (
              <StaggerItem
                key={service.slug}
                className={
                  idx === 0 ? "h-full md:col-span-2 lg:col-span-2" : "h-full"
                }
              >
                <Link href={service.href} className="block h-full group">
                  <TiltCard cursorLabel="View" className="h-full">
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-input bg-primary/12 text-primary">
                            <Icon strokeWidth={1.5} className="h-5 w-5" />
                          </span>
                          <Badge variant="default" size="sm">
                            {service.startingPrice}
                          </Badge>
                        </div>
                        <h3 className="font-heading text-2xl font-semibold text-text group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-small text-text-muted leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/60 flex items-center justify-between text-small font-medium text-primary">
                        <span>Explore {service.shortTitle}</span>
                        <ArrowRight
                          strokeWidth={1.5}
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
                        />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Capabilities Strip per Section 5.4 */}
        <div className="rounded-card border border-border bg-surface p-5">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">
            Core Engineering &amp; Automation Stack
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {TECH_CAPABILITIES.map((tech) => (
              <div
                key={tech.name}
                className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 py-2 text-small"
              >
                <span className="font-heading font-semibold text-text">
                  {tech.name}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  · {tech.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default ServicesOverviewSection;
