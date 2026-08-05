"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { loadGames, saveGames } from "@/lib/storage";
import {
  GAME_STATUSES,
  type Game,
  type GameStatus,
  type Platform,
} from "@/types/game";

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

/**
 * Module-level external store backed by localStorage.
 * Synchronizes the collection, persists on every mutation, and notifies
 * subscribers — no setState-in-effect, hydration-safe via server snapshot.
 */
let gamesCache: Game[] | null = null;
const listeners = new Set<() => void>();

function readGames(): Game[] {
  if (gamesCache === null) {
    gamesCache = loadGames();
  }
  return gamesCache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Game[] | null {
  return typeof window === "undefined" ? null : readGames();
}

function getServerSnapshot(): Game[] | null {
  return null;
}

function commit(games: Game[]): void {
  gamesCache = games;
  saveGames(games);
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Single source of truth for the game collection.
 * Owns all localStorage reads/writes so components never touch storage directly.
 */
export function useGames() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const games = useMemo(() => snapshot ?? [], [snapshot]);

  const addGame = useCallback(
    (input: { title: string; platform: Platform; status: GameStatus }) => {
      const game: Game = {
        id: createId(),
        title: input.title.trim(),
        platform: input.platform,
        status: input.status,
        createdAt: Date.now(),
      };
      commit([game, ...readGames()]);
      return game;
    },
    [],
  );

  const updateStatus = useCallback((id: string, status: GameStatus) => {
    commit(
      readGames().map((game) =>
        game.id === id ? { ...game, status } : game,
      ),
    );
  }, []);

  const removeGame = useCallback((id: string) => {
    commit(readGames().filter((game) => game.id !== id));
  }, []);

  const counts = useMemo<GameCounts>(() => {
    const byStatus = Object.fromEntries(
      GAME_STATUSES.map((status) => [status, 0]),
    ) as Record<GameStatus, number>;
    for (const game of games) {
      byStatus[game.status] += 1;
    }
    return { total: games.length, byStatus };
  }, [games]);

  return {
    games,
    isReady: snapshot !== null,
    counts,
    addGame,
    updateStatus,
    removeGame,
  };
}
