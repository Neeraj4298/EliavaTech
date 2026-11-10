"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showLabel?: boolean;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

const emptySubscribe = () => () => {};

/**
 * Section 5.6 & 5.7 — ThemeToggle:
 * - Uses next-themes (`data-theme` attribute) with no flash of wrong theme.
 * - Circular reveal transition using the View Transitions API, with a fallback fade.
 * - Sun and moon icons morph smoothly.
 * - Respects prefers-reduced-motion.
 */
export function ThemeToggle({
  showLabel = false,
  className,
  ...props
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const doc =
      typeof document !== "undefined"
        ? (document as ViewTransitionDocument)
        : undefined;

    if (!doc?.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        // Fallback already applied
      });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Toggle color theme"
      }
      title={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Toggle color theme"
      }
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-pill border border-border bg-surface text-text",
        "h-10 px-3 text-small font-medium transition-all duration-200",
        "hover:bg-surface-2 hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        ! showLabel && "w-10 px-0",
        className
      )}
      {...props}
    >
      <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
        {/* Sun Icon (visible in Light mode, morphs out in Dark mode) */}
        <Sun
          strokeWidth={1.5}
          className={cn(
            "h-[18px] w-[18px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-gold"
          )}
          aria-hidden="true"
        />
        {/* Moon Icon (visible in Dark mode, morphs in) */}
        <Moon
          strokeWidth={1.5}
          className={cn(
            "absolute h-[18px] w-[18px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted && isDark
              ? "rotate-0 scale-100 opacity-100 text-primary"
              : "-rotate-90 scale-0 opacity-0"
          )}
          aria-hidden="true"
        />
      </span>

      {showLabel && (
        <span className="text-small font-medium text-text">
          {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
