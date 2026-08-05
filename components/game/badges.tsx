import { PLATFORM_META, STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GameStatus, Platform } from "@/types/game";

const BASE = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium";

const STATUS_CLASSES: Record<GameStatus, string> = {
  "Not Started": "border-status-not-started/30 bg-status-not-started/10 text-status-not-started",
  "In Progress": "border-status-in-progress/30 bg-status-in-progress/10 text-status-in-progress",
  Completed: "border-status-completed/30 bg-status-completed/10 text-status-completed",
  Dropped: "border-status-dropped/30 bg-status-dropped/10 text-status-dropped",
};

const PLATFORM_CLASSES: Record<Platform, string> = {
  PC: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PS5: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Xbox: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Switch: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "Steam Deck": "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export function StatusBadge({ status }: { status: GameStatus }) {
  const Icon = STATUS_META[status].icon;
  return (
    <span className={cn(BASE, STATUS_CLASSES[status])} title={STATUS_META[status].description}>
      <Icon className={cn("size-3", status === "In Progress" && "animate-pulse")} />
      {status}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  const { icon: Icon, accent } = PLATFORM_META[platform];
  return (
    <span className={cn(BASE, PLATFORM_CLASSES[platform])}>
      <Icon className={cn("size-3", accent)} />
      {platform}
    </span>
  );
}
