"use client";

import { MotionConfig } from "motion/react";
import { Toaster, toast } from "sonner";
import { Gamepad2 } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SummaryBar } from "@/components/game/summary-bar";
import {
  AddGameForm,
  type NewGameInput,
} from "@/components/game/add-game-form";
import { GameList } from "@/components/game/game-list";
import { EmptyState } from "@/components/game/empty-state";

function LoadingSkeleton() {
  return (
    <main className="flex flex-col gap-5" aria-busy="true" aria-label="Loading">
      <div className="h-28 animate-pulse rounded-xl bg-card/70" />
      <div className="h-64 animate-pulse rounded-xl bg-card/70" />
      <div className="h-24 animate-pulse rounded-xl bg-card/70" />
    </main>
  );
}

export default function Home() {
  const { games, isReady, counts, addGame, updateStatus, removeGame } =
    useGames();
  const { theme } = useTheme();

  function handleAdd(input: NewGameInput) {
    addGame(input);
    toast.success(`"${input.title}" added to your backlog`);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground shadow-lg shadow-primary/25">
              <Gamepad2 className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Game Backlog
              </h1>
              <p className="text-sm text-muted-foreground">
                Track, play, complete.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {isReady ? (
          <main className="flex flex-col gap-5">
            <SummaryBar counts={counts} />
            <AddGameForm onAdd={handleAdd} />
            {games.length > 0 ? (
              <section aria-label="Your games">
                <GameList
                  games={games}
                  onStatusChange={updateStatus}
                  onDelete={removeGame}
                />
              </section>
            ) : (
              <EmptyState />
            )}
          </main>
        ) : (
          <LoadingSkeleton />
        )}

        <Toaster
          theme={theme}
          position="bottom-right"
          richColors
          toastOptions={{
            style: { borderRadius: "0.75rem" },
          }}
        />
      </div>
    </MotionConfig>
  );
}
