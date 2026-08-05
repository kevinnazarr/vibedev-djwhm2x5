"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { loadGames, saveGames } from "@/lib/storage";
import { GAME_STATUSES, type Game, type GameStatus, type Platform } from "@/types/game";

export interface GameCounts {
  total: number;
  byStatus: Record<GameStatus, number>;
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

let gamesCache: Game[] | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Game[] | null {
  return typeof window === "undefined" ? null : (gamesCache ??= loadGames());
}

function commit(games: Game[]): void {
  gamesCache = games;
  saveGames(games);
  listeners.forEach((listener) => listener());
}

export function useGames() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const addGame = useCallback((input: { title: string; platform: Platform; status: GameStatus }) => {
    commit([
      {
        id: createId(),
        title: input.title.trim(),
        platform: input.platform,
        status: input.status,
        createdAt: Date.now(),
      },
      ...(gamesCache ?? []),
    ]);
  }, []);

  const updateStatus = useCallback((id: string, status: GameStatus) => {
    commit((gamesCache ?? []).map((game) => (game.id === id ? { ...game, status } : game)));
  }, []);

  const removeGame = useCallback((id: string) => {
    commit((gamesCache ?? []).filter((game) => game.id !== id));
  }, []);

  const games = useMemo(() => snapshot ?? [], [snapshot]);
  const counts = useMemo<GameCounts>(() => {
    const byStatus = Object.fromEntries(
      GAME_STATUSES.map((status) => [status, 0]),
    ) as Record<GameStatus, number>;
    for (const game of games) byStatus[game.status] += 1;
    return { total: games.length, byStatus };
  }, [games]);

  return { games, isReady: snapshot !== null, counts, addGame, updateStatus, removeGame };
}
