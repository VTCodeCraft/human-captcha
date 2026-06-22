"use client";

import { cn } from "@/lib/utils";
import type { Tile } from "@/types/puzzle";

interface PuzzleTileProps {
  /** The tile to render. */
  tile: Tile;
  /** True when the cursor is currently over this tile. */
  isCurrent?: boolean;
  /** True when this tile has been visited in the traced path. */
  isVisited?: boolean;
}

/**
 * A single image tile of the puzzle board, with its id badge. Highlights when
 * it is under the cursor or has been visited.
 */
export function PuzzleTile({ tile, isCurrent, isVisited }: PuzzleTileProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border-2 transition-colors",
        isCurrent
          ? "border-red-400 ring-2 ring-red-400/60"
          : isVisited
            ? "border-green-400"
            : "border-white/15",
      )}
    >
      {/* Data-URL image; next/image adds no value here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.imageData}
        alt={`Tile ${tile.id}`}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {isVisited && <div className="absolute inset-0 bg-green-500/30" />}

      <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-sm font-bold text-white">
        {tile.id}
      </span>
    </div>
  );
}
