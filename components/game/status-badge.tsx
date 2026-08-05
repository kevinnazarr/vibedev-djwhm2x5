import { STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GameStatus } from "@/types/game";
import { Badge } from "@/components/ui/badge";

const STATUS_CLASSES: Record<GameStatus, string> = {
  "Not Started":
    "border-status-not-started/30 bg-status-not-started/10 text-status-not-started",
  "In Progress":
    "border-status-in-progress/30 bg-status-in-progress/10 text-status-in-progress",
  Completed:
    "border-status-completed/30 bg-status-completed/10 text-status-completed",
  Dropped: "border-status-dropped/30 bg-status-dropped/10 text-status-dropped",
};

export function StatusBadge({
  status,
  className,
}: {
  status: GameStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASSES[status], className)}
      title={meta.description}
    >
      <Icon
        className={cn(
          "size-3",
          status === "In Progress" && "animate-pulse",
        )}
      />
      {status}
    </Badge>
  );
}
