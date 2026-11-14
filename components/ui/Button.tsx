"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  withArrow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary border border-transparent hover:bg-primary-hover shadow-[var(--glow-primary)] hover:shadow-[0_10px_28px_-4px_var(--primary)]",
  secondary:
    "bg-surface text-text border border-border hover:bg-surface-2 hover:border-primary/40 shadow-[var(--shadow-card)]",
  ghost:
    "bg-transparent text-text border border-transparent hover:bg-surface-2 hover:text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1 md:h-9 md:px-4 md:text-small md:gap-1.5",
  md: "h-9 px-4 text-xs gap-1.5 md:h-11 md:px-6 md:text-small md:gap-2",
  lg: "h-10 px-4.5 text-[13px] gap-1.5 md:h-13 md:px-7 md:text-body md:gap-2.5",
};

/**
 * Section 6 Primitive — Button (primary, secondary, ghost)
 * - Radius: 999px (rounded-pill) per Section 2.5
 * - Renders a Next.js `<Link>` when `href` is provided so `<button>` is never nested inside `<a>`.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      withArrow = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      href,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const sharedClassName = cn(
      "group relative inline-flex items-center justify-center rounded-pill font-medium select-none",
      "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
      "active:scale-[0.98]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      "disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    const innerContent = (
      <>
        {isLoading && (
          <Loader2
            strokeWidth={1.5}
            className="h-4 w-4 animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {!isLoading && leftIcon && (
          <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 inline-flex items-center">{rightIcon}</span>
        )}
        {!isLoading && withArrow && (
          <ArrowRight
            strokeWidth={1.5}
            className="h-4 w-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={sharedClassName}>
          {innerContent}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={sharedClassName}
        {...props}
      >
        {innerContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

