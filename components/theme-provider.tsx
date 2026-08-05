"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

let themeCache: Theme = "dark";
let themeInitialized = false;
const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  if (!themeInitialized) {
    themeInitialized = true;
    if (typeof window !== "undefined") {
      const stored = readStorage(STORAGE_KEYS.theme);
      if (stored === "light" || stored === "dark") themeCache = stored;
      document.documentElement.classList.toggle("dark", themeCache === "dark");
    }
  }
  return themeCache;
}

function setTheme(next: Theme): void {
  themeCache = next;
  writeStorage(STORAGE_KEYS.theme, next);
  document.documentElement.classList.toggle("dark", next === "dark");
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "dark" as Theme);
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
