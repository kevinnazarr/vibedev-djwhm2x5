"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Toaster, toast } from "sonner";
import { Gamepad2, Ghost } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SummaryBar } from "@/components/game/summary-bar";
import { AddGameForm, type NewGameInput } from "@/components/game/add-game-form";
import { GameCard } from "@/components/game/game-card";

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
  const { games, isReady, counts, addGame, updateStatus, removeGame } = useGames();
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
            <div className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-primary to-fuchsia-600 text-primary-foreground shadow-lg shadow-primary/25">
              <Gamepad2 className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Game Backlog</h1>
              <p className="text-sm text-muted-foreground">Track, play, complete.</p>
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
                <div className="scroll-slim max-h-[55vh] overflow-y-auto pr-1 sm:max-h-[60vh]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {games.map((game, index) => (
                      <motion.div
                        key={game.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: Math.min(index * 0.045, 0.45),
                            type: "spring",
                            stiffness: 320,
                            damping: 30,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.96,
                          x: 32,
                          transition: { duration: 0.16, ease: "easeOut" },
                        }}
                        className="mb-2.5 last:mb-0"
                      >
                        <GameCard
                          game={game}
                          onStatusChange={updateStatus}
                          onDelete={removeGame}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
                >
                  <Ghost className="size-8" />
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold text-card-foreground">
                    Your backlog is empty
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Add your first game above and start tracking your gaming journey — your
                    progress is saved right in your browser.
                  </p>
                </div>
              </motion.div>
            )}
          </main>
        ) : (
          <LoadingSkeleton />
        )}

        <Toaster
          theme={theme}
          position="bottom-right"
          richColors
          toastOptions={{ style: { borderRadius: "0.75rem" } }}
        />
      </div>
    </MotionConfig>
  );
}
