"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Tile } from "@/types/puzzle";

interface PuzzleTileProps {
  /** The tile to render. */
  tile: Tile;
  /** Cell width / height in pixels. */
  width: number;
  height: number;
  /** Target top-left position in board pixels. */
  x: number;
  y: number;
  /** True while this piece is being dragged by the cursor. */
  isDragging: boolean;
  /** True when this piece currently sits in its correct slot. */
  isCorrect: boolean;
}

/**
 * A single puzzle piece. Springs (snaps) to its slot when idle and follows the
 * cursor instantly while dragged. Correctly-placed pieces get a green border.
 */
export function PuzzleTile({
  tile,
  width,
  height,
  x,
  y,
  isDragging,
  isCorrect,
}: PuzzleTileProps) {
  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-xl border-2",
        isDragging
          ? "border-red-400 shadow-2xl"
          : isCorrect
            ? "border-green-400/70"
            : "border-white/15",
      )}
      style={{ width, height, zIndex: isDragging ? 40 : 1 }}
      animate={{ x, y, scale: isDragging ? 1.06 : 1 }}
      transition={
        isDragging
          ? { type: "tween", duration: 0 }
          : { type: "spring", stiffness: 500, damping: 38 }
      }
    >
      {/* Data-URL image; next/image adds no value here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.imageData}
        alt={`Tile ${tile.id}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-sm font-bold text-white">
        {tile.id}
      </span>
    </motion.div>
  );
}
