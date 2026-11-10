import React from "react";
import { cn } from "@/lib/utils";

export type LogoVariant = "full" | "monogram" | "light" | "dark";
export type LogoSize = "sm" | "md" | "lg";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Four logo variants per Section 2.2:
   * - "full": Full horizontal (monogram + wordmark) following active theme CSS variables
   * - "monogram": Monogram mark only following active theme CSS variables
   * - "light": Explicit light-theme palette (#0B1020 text, #C98A12 gold) for light backgrounds
   * - "dark": Explicit dark-theme palette (#EEF1F8 text, #F2B84B gold) for dark backgrounds
   */
  variant?: LogoVariant;
  /**
   * Size preset for monogram and wordmark
   */
  size?: LogoSize;
  /**
   * Optional override to hide wordmark when using "light" or "dark" variant
   */
  monogramOnly?: boolean;
}

const sizeMap: Record<LogoSize, { svg: string; text: string; gap: string }> = {
  sm: { svg: "w-7 h-7", text: "text-lg", gap: "gap-2" },
  md: { svg: "w-9 h-9", text: "text-xl", gap: "gap-2.5" },
  lg: { svg: "w-12 h-12", text: "text-2xl", gap: "gap-3" },
};

export function Logo({
  variant = "full",
  size = "md",
  monogramOnly = false,
  className,
  style,
  ...props
}: LogoProps) {
  const isMonogram = variant === "monogram" || monogramOnly;

  // Theme-locked CSS variable overrides when variant is explicitly "light" or "dark"
  const themeVariables: React.CSSProperties =
    variant === "light"
      ? ({
          "--gold": "#C98A12",
          "--text": "#0B1020",
          "--text-muted": "#55607A",
          color: "#0B1020",
        } as React.CSSProperties)
      : variant === "dark"
      ? ({
          "--gold": "#F2B84B",
          "--text": "#EEF1F8",
          "--text-muted": "#9AA6C3",
          color: "#EEF1F8",
        } as React.CSSProperties)
      : {
          color: "var(--text)",
        };

  const dimensions = sizeMap[size];

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        dimensions.gap,
        className
      )}
      style={{ ...themeVariables, ...style }}
      aria-label="EliavaTech"
      {...props}
    >
      {/* Starter SVG per Section 2.2:
          Three horizontal bars forming 'E'. Top bar is gold, other two take currentColor.
          Middle bar is shorter, giving a stepped, ascending feel. */}
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0 transition-colors duration-200", dimensions.svg)}
        role="img"
        aria-hidden={!isMonogram}
      >
        <title>EliavaTech Monogram</title>
        <rect x="8" y="8" width="32" height="8" rx="2" fill="var(--gold)" />
        <rect x="8" y="20" width="24" height="8" rx="2" fill="currentColor" />
        <rect x="8" y="32" width="32" height="8" rx="2" fill="currentColor" />
      </svg>

      {!isMonogram && (
        <span
          className={cn(
            "font-heading leading-none tracking-[0.02em] transition-colors duration-200",
            dimensions.text
          )}
        >
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            Eliava
          </span>
          <span
            className="font-light tracking-[0.03em]"
            style={{ color: "var(--text-muted)" }}
          >
            Tech
          </span>
        </span>
      )}
    </div>
  );
}

export default Logo;
