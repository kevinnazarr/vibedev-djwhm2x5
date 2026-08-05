"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Game, GameStatus } from "@/types/game";
import { GameCard } from "@/components/game/game-card";

export interface GameListProps {
  games: Game[];
  onStatusChange: (id: string, status: GameStatus) => void;
  onDelete: (id: string) => void;
}

export function GameList({
  games,
  onStatusChange,
  onDelete,
}: GameListProps) {
  return (
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
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
