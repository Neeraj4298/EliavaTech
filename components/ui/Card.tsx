"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "interactive" | "outline";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-surface border border-border shadow-[var(--shadow-card)]",
  elevated:
    "bg-surface-2 border border-border shadow-[var(--shadow-card)]",
  interactive:
    "bg-surface border border-border shadow-[var(--shadow-card)] hover:border-primary/50 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 cursor-pointer",
  outline:
    "bg-transparent border border-border",
};

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3.5 md:p-4",
  md: "p-4 md:p-6",
  lg: "p-5 md:p-8",
};

/**
 * Section 6 Primitive — Card
 * - Radius: 12px (rounded-card) per Section 2.5
 * - Light mode: soft shadows; Dark mode: 1px border + faint primary glow on hover
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 mb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-heading text-xl font-semibold tracking-[-0.02em] text-text",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-small text-text-muted", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-small text-text", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 pt-4 border-t border-border flex items-center justify-between gap-3",
        className
      )}
      {...props}
    />
  );
}

export default Card;
