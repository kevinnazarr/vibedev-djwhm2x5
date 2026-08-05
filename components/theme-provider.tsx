"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Module-level external store for the active theme.
 * Applies the .dark class and persists the choice on every change.
 * Dark-first: ships dark and only switches if the user has opted out.
 */
let themeCache: Theme = "dark";
let themeInitialized = false;
const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  if (!themeInitialized) {
    themeInitialized = true;
    if (typeof window !== "undefined") {
      const stored = readStorage(STORAGE_KEYS.theme);
      if (stored === "light" || stored === "dark") {
        themeCache = stored;
      }
      document.documentElement.classList.toggle(
        "dark",
        themeCache === "dark",
      );
    }
  }
  return themeCache;
}

function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  return readTheme();
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function setTheme(next: Theme): void {
  themeCache = next;
  writeStorage(STORAGE_KEYS.theme, next);
  document.documentElement.classList.toggle("dark", next === "dark");
  for (const listener of themeListeners) {
    listener();
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
