import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "gold"
  | "success"
  | "danger"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-2 text-text border-border",
  primary: "bg-primary/12 text-primary border-primary/25",
  gold: "bg-gold/15 text-gold border-gold/30",
  success: "bg-success/12 text-success border-success/25",
  danger: "bg-danger/12 text-danger border-danger/25",
  outline: "bg-transparent text-text-muted border-border",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-text-muted",
  primary: "bg-primary",
  gold: "bg-gold",
  success: "bg-success",
  danger: "bg-danger",
  outline: "bg-text-muted",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-xs gap-1.5",
  md: "px-3 py-1 text-small gap-2",
};

/**
 * Section 6 Primitive — Badge
 * - Radius: 999px (rounded-pill) per Section 2.5
 */
export function Badge({
  variant = "default",
  size = "sm",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-pill border font-medium leading-none select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClasses[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
