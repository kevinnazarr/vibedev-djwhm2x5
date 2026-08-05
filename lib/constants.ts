import {
  CircleCheck,
  CircleDashed,
  CircleOff,
  Gamepad,
  Gamepad2,
  Joystick,
  Monitor,
  TabletSmartphone,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { GameStatus, Platform } from "@/types/game";

export const STORAGE_KEYS = {
  games: "game-backlog-tracker:games",
  theme: "game-backlog-tracker:theme",
} as const;

export const STATUS_META: Record<GameStatus, { description: string; icon: LucideIcon }> = {
  "Not Started": { description: "On the radar, not yet booted up", icon: CircleDashed },
  "In Progress": { description: "Currently being played", icon: Timer },
  Completed: { description: "Finished — credits rolled", icon: CircleCheck },
  Dropped: { description: "Set aside, maybe forever", icon: CircleOff },
};

export const PLATFORM_META: Record<Platform, { icon: LucideIcon; accent: string }> = {
  PC: { icon: Monitor, accent: "text-sky-500" },
  PS5: { icon: Gamepad2, accent: "text-indigo-400" },
  Xbox: { icon: Joystick, accent: "text-emerald-500" },
  Switch: { icon: Gamepad, accent: "text-rose-400" },
  "Steam Deck": { icon: TabletSmartphone, accent: "text-zinc-400" },
};
