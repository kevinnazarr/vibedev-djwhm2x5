import { PLATFORM_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types/game";
import { Badge } from "@/components/ui/badge";

const PLATFORM_CLASSES: Record<Platform, string> = {
  PC: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PS5: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Xbox: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Switch: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  "Steam Deck":
    "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export function PlatformBadge({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  const meta = PLATFORM_META[platform];
  const Icon = meta.icon;
  return (
    <Badge
      variant="outline"
      className={cn(PLATFORM_CLASSES[platform], className)}
    >
      <Icon className={cn("size-3", meta.accent)} />
      {platform}
    </Badge>
  );
}
