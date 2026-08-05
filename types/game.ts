/** Ordered list of supported game statuses. The order defines select order. */
export const GAME_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
  "Dropped",
] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];

/** Ordered list of supported platforms. */
export const PLATFORMS = ["PC", "PS5", "Xbox", "Switch", "Steam Deck"] as const;

export type Platform = (typeof PLATFORMS)[number];

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  status: GameStatus;
  createdAt: number;
}

export function isGameStatus(value: unknown): value is GameStatus {
  return (
    typeof value === "string" && (GAME_STATUSES as readonly string[]).includes(value)
  );
}

export function isPlatform(value: unknown): value is Platform {
  return (
    typeof value === "string" && (PLATFORMS as readonly string[]).includes(value)
  );
}
