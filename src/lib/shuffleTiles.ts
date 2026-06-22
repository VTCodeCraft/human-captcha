import type { Tile } from "@/types/puzzle";

/**
 * Returns a shuffled copy of the tiles using the Fisher-Yates algorithm.
 *
 * The result is guaranteed not to be in solved order (when more than one tile
 * is present), so the puzzle always looks scrambled.
 */
export function shuffleTiles(tiles: Tile[]): Tile[] {
  if (tiles.length <= 1) return [...tiles];

  let shuffled = [...tiles];
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (isSolved(shuffled));

  return shuffled;
}

/** True when every tile sits in its solved position. */
function isSolved(tiles: Tile[]): boolean {
  return tiles.every((tile, index) => tile.correctIndex === index);
}
