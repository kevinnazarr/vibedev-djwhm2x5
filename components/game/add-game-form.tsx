"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { GAME_STATUSES, PLATFORMS, type GameStatus, type Platform } from "@/types/game";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";

export interface NewGameInput {
  title: string;
  platform: Platform;
  status: GameStatus;
}

const platformOptions: SelectOption[] = PLATFORMS.map((platform) => ({
  value: platform,
  label: platform,
}));
const statusOptions: SelectOption[] = GAME_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export function AddGameForm({ onAdd }: { onAdd: (input: NewGameInput) => void }) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("PC");
  const [status, setStatus] = useState<GameStatus>("Not Started");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Enter the game title");
      return;
    }
    if (trimmed.length > 100) {
      setError("Title must be under 100 characters");
      return;
    }
    setError(null);
    onAdd({ title: trimmed, platform, status });
    setTitle("");
  }

  return (
    <section className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="p-5 pb-3">
        <h2 className="text-base font-semibold tracking-tight">Add a game</h2>
        <p className="text-sm text-muted-foreground">
          Log a new game to your backlog and pick its starting status.
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-5 pt-3">
        <label htmlFor="game-title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="game-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Elden Ring"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "game-title-error" : undefined}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            error && "border-destructive",
          )}
        />
        {error ? (
          <p id="game-title-error" role="alert" className="text-xs font-medium text-destructive">
            {error}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Platform
            <Select
              id="game-platform"
              value={platform}
              onChange={(value) => setPlatform(value as Platform)}
              options={platformOptions}
              aria-label="Platform"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Status
            <Select
              id="game-status"
              value={status}
              onChange={(value) => setStatus(value as GameStatus)}
              options={statusOptions}
              aria-label="Status"
            />
          </label>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="size-4" />
            Add to backlog
          </Button>
        </div>
      </form>
    </section>
  );
}
