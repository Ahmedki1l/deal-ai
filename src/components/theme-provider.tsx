"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} />;
}
