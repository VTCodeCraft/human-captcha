"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  /** Expected path of tile ids to trace. */
  challenge: number[];
  /** Tile ids visited so far (de-duplicated). */
  visited: number[];
}

/**
 * Displays the challenge path (e.g. 1 → 5 → 9) above the puzzle, marking each
 * step green once it has been traced in the correct order.
 */
export function ChallengeCard({ challenge, visited }: ChallengeCardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        Trace this path with your right index finger
      </p>
      <div className="flex items-center gap-2">
        {challenge.map((id, index) => {
          const done = visited[index] === id;
          return (
            <Fragment key={index}>
              {index > 0 && <span className="text-zinc-500">→</span>}
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold transition-colors",
                  done
                    ? "bg-green-500 text-white"
                    : "bg-zinc-800 text-zinc-300",
                )}
              >
                {id}
              </span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
