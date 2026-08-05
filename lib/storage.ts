import { STORAGE_KEYS } from "@/lib/constants";
import { isGameStatus, isPlatform, type Game } from "@/types/game";

export function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — app keeps working in memory.
  }
}

export function loadGames(): Game[] {
  const raw = readStorage(STORAGE_KEYS.games);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isGameRecord) : [];
  } catch {
    return [];
  }
}

export function saveGames(games: Game[]): void {
  writeStorage(STORAGE_KEYS.games, JSON.stringify(games));
}

function isGameRecord(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Record<string, unknown>;
  return (
    typeof game.id === "string" &&
    typeof game.title === "string" &&
    isPlatform(game.platform) &&
    isGameStatus(game.status) &&
    typeof game.createdAt === "number"
  );
}
