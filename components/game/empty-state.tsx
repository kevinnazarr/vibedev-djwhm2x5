"use client";

import { motion } from "motion/react";
import { Ghost } from "lucide-react";

export function EmptyState() {
  return (
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
          Add your first game above and start tracking your gaming journey —
          your progress is saved right in your browser.
        </p>
      </div>
    </motion.div>
  );
}
