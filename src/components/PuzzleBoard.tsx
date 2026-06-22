"use client";

import { PuzzleTile } from "@/components/PuzzleTile";
import { PUZZLE_SIZE } from "@/lib/sliceImage";
import type { Tile } from "@/types/puzzle";

interface PuzzleBoardProps {
  /** Tiles in current board order; slot `i` is `tiles[i]`. */
  tiles: Tile[];
  /** Board width / height in pixels. */
  width: number;
  height: number;
  /** Slot of the piece being dragged, or null. */
  draggingSlot?: number | null;
  /** Cursor position in board pixels (used to position the dragged piece). */
  cursor?: { x: number; y: number } | null;
}

/**
 * The 3×3 puzzle board. Each piece is absolutely positioned at its slot and
 * animated by Framer Motion; the grabbed piece follows the cursor and pieces
 * snap into place after a swap.
 */
export function PuzzleBoard({
  tiles,
  width,
  height,
  draggingSlot = null,
  cursor = null,
}: PuzzleBoardProps) {
  const cellWidth = width / PUZZLE_SIZE;
  const cellHeight = height / PUZZLE_SIZE;

  return (
    <div
      className="absolute inset-0 bg-zinc-950"
      style={{ width, height }}
    >
      {tiles.map((tile, slot) => {
        const row = Math.floor(slot / PUZZLE_SIZE);
        const col = slot % PUZZLE_SIZE;
        const isDragging = slot === draggingSlot && cursor !== null;

        const x = isDragging ? cursor.x - cellWidth / 2 : col * cellWidth;
        const y = isDragging ? cursor.y - cellHeight / 2 : row * cellHeight;

        return (
          <PuzzleTile
            key={tile.id}
            tile={tile}
            width={cellWidth}
            height={cellHeight}
            x={x}
            y={y}
            isDragging={isDragging}
            isCorrect={tile.correctIndex === slot}
          />
        );
      })}
    </div>
  );
}
