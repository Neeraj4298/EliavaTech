"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Section 5.7 — Theme toggle rules:
 * Use next-themes with the `data-theme` attribute.
 * Default to the visitor's system setting, persist the choice,
 * and avoid a flash of the wrong theme.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="eliavatech-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
