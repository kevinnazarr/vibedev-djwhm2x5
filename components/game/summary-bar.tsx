"use client";

import { AnimatePresence, motion } from "motion/react";
import { Gamepad2 } from "lucide-react";
import { GAME_STATUSES, type GameStatus } from "@/types/game";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { GameCounts } from "@/hooks/use-games";

const DOT_CLASSES: Record<GameStatus, string> = {
  "Not Started": "bg-status-not-started",
  "In Progress": "bg-status-in-progress",
  Completed: "bg-status-completed",
  Dropped: "bg-status-dropped",
};

function AnimatedCount({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-7 overflow-hidden align-bottom font-mono text-2xl font-semibold tabular-nums tracking-tight">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function SummaryBar({ counts }: { counts: GameCounts }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Gamepad2 className="size-6" />
          </div>
          <div>
            <AnimatedCount value={counts.total} />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              games in backlog
            </p>
          </div>
        </div>

        <div
          className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
          role="list"
          aria-label="Games by status"
        >
          {GAME_STATUSES.map((status) => {
            const count = counts.byStatus[status];
            return (
              <div
                key={status}
                role="listitem"
                className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors duration-200 hover:border-border"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span
                    className={cn("size-1.5 rounded-full", DOT_CLASSES[status])}
                  />
                  <span className="truncate">{status}</span>
                </div>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
