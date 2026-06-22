"use client";

import { PuzzleTile } from "@/components/PuzzleTile";
import type { Tile } from "@/types/puzzle";

interface PuzzleBoardProps {
  /** Tiles in shuffled (display) order; rendered row-major into a 3×3 grid. */
  tiles: Tile[];
  /** Tile id currently under the cursor. */
  currentTile?: number | null;
  /** Tile ids that have been visited. */
  visited?: number[];
}

/**
 * The 3×3 puzzle board. Tiles are laid out row-major in the order given
 * (shuffled), matching the slot indexing used for cursor hit-testing.
 */
export function PuzzleBoard({
  tiles,
  currentTile = null,
  visited = [],
}: PuzzleBoardProps) {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 bg-zinc-950 p-1.5">
      {tiles.map((tile) => (
        <PuzzleTile
          key={tile.id}
          tile={tile}
          isCurrent={tile.id === currentTile}
          isVisited={visited.includes(tile.id)}
        />
      ))}
    </div>
  );
}
