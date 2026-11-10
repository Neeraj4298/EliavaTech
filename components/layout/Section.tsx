import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string;
  withContainer?: boolean;
}

/**
 * Section 2.5 & 6 — Section:
 * Vertical padding 120px desktop, 72px mobile (.section-spacing).
 */
export function Section({
  className,
  containerClassName,
  withContainer = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("section-spacing", className)} {...props}>
      {withContainer ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

export default Section;
