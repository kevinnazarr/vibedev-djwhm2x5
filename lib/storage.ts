import { STORAGE_KEYS } from "@/lib/constants";
import { isGameStatus, isPlatform, type Game } from "@/types/game";

/** Read a value from localStorage, returning null when unavailable/invalid. */
export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write a value to localStorage, silently ignoring failures (private mode etc.). */
export function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — app keeps working in memory only.
  }
}

/** Load and validate the games collection from localStorage. */
export function loadGames(): Game[] {
  const raw = readStorage(STORAGE_KEYS.games);
  if (raw === null) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isGameRecord)
      .map((game) => ({ ...game, title: game.title.slice(0, 100) }));
  } catch {
    return [];
  }
}

/** Persist the games collection to localStorage. */
export function saveGames(games: Game[]): void {
  writeStorage(STORAGE_KEYS.games, JSON.stringify(games));
}

function isGameRecord(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    isPlatform(record.platform) &&
    isGameStatus(record.status) &&
    typeof record.createdAt === "number"
  );
}
