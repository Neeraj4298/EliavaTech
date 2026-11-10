"use client";

import * as React from "react";
import { Badge, type BadgeVariant } from "./Badge";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowVariant?: BadgeVariant;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}

/**
 * Section 6 — SectionHeading:
 * Reusable section header with eyebrow Badge, SplitHeading H2, and description.
 */
export function SectionHeading({
  eyebrow,
  eyebrowVariant = "primary",
  title,
  description,
  align = "left",
  className,
  action,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCenter
          ? "items-center text-center max-w-3xl mx-auto"
          : "md:flex-row md:items-end justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", !isCenter && "max-w-2xl")}>
        {eyebrow && (
          <Reveal>
            <Badge variant={eyebrowVariant} size="md" dot>
              {eyebrow}
            </Badge>
          </Reveal>
        )}
        <SplitHeading text={title} as="h2" className="text-h2 block" />
        {description && (
          <Reveal delay={0.08}>
            <p className="text-body text-text-muted">{description}</p>
          </Reveal>
        )}
      </div>

      {action && <Reveal delay={0.12}>{action}</Reveal>}
    </div>
  );
}

export default SectionHeading;
