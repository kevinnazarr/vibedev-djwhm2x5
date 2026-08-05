"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GAME_STATUSES, type Game, type GameStatus } from "@/types/game";
import { PLATFORM_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { PlatformBadge, StatusBadge } from "@/components/game/badges";

const statusOptions: SelectOption[] = GAME_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

interface GameCardProps {
  game: Game;
  onStatusChange: (id: string, status: GameStatus) => void;
  onDelete: (id: string) => void;
}

export function GameCard({ game, onStatusChange, onDelete }: GameCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { icon: PlatformIcon, accent } = PLATFORM_META[game.platform];
  const completed = game.status === "Completed";
  const dropped = game.status === "Dropped";

  function handleConfirmDelete() {
    onDelete(game.id);
    setConfirmOpen(false);
    toast.success(`"${game.title}" removed from your backlog`);
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-colors duration-200 hover:border-foreground/20",
        completed && "opacity-80",
        dropped && "opacity-60",
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50">
          <PlatformIcon className={cn("size-5", accent)} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-card-foreground",
              completed && "decoration-status-completed/60 decoration-2 underline-offset-4",
            )}
            title={game.title}
          >
            <span
              className={cn(
                completed && "line-through decoration-status-completed/60",
                dropped && "text-muted-foreground",
              )}
            >
              {game.title}
            </span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <PlatformBadge platform={game.platform} />
            <StatusBadge status={game.status} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Select
            value={game.status}
            onChange={(value) => onStatusChange(game.id, value as GameStatus)}
            options={statusOptions}
            size="sm"
            aria-label={`Status for ${game.title}`}
            className="w-32 sm:w-36"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${game.title}`}
            onClick={() => setConfirmOpen(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this game?"
        description={`"${game.title}" will be permanently removed from your backlog. This can't be undone.`}
      >
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
