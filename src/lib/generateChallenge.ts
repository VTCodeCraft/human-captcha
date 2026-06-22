import { PUZZLE_SIZE } from "@/lib/sliceImage";

/** Default number of steps in a generated challenge path. */
const DEFAULT_MIN_LENGTH = 3;
const DEFAULT_MAX_LENGTH = 4;

/** Returns the ids (1-based) of the 4-neighbours of a tile id on the grid. */
function neighbours(id: number): number[] {
  const index = id - 1;
  const row = Math.floor(index / PUZZLE_SIZE);
  const col = index % PUZZLE_SIZE;

  const result: number[] = [];
  if (row > 0) result.push(id - PUZZLE_SIZE);
  if (row < PUZZLE_SIZE - 1) result.push(id + PUZZLE_SIZE);
  if (col > 0) result.push(id - 1);
  if (col < PUZZLE_SIZE - 1) result.push(id + 1);
  return result;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generates a challenge path as a sequence of tile ids (1-9). The path is a
 * random walk across adjacent cells of the canonical 3×3 layout, with no
 * repeated tiles, e.g. `[1, 5, 9]` or `[8, 9, 6, 3]`.
 */
export function generateChallenge(
  minLength: number = DEFAULT_MIN_LENGTH,
  maxLength: number = DEFAULT_MAX_LENGTH,
): number[] {
  const targetLength =
    minLength + Math.floor(Math.random() * (maxLength - minLength + 1));

  const path: number[] = [randomItem([1, 2, 3, 4, 5, 6, 7, 8, 9])];

  while (path.length < targetLength) {
    const current = path[path.length - 1];
    const options = neighbours(current).filter((id) => !path.includes(id));
    if (options.length === 0) break; // dead end — return what we have
    path.push(randomItem(options));
  }

  return path;
}
