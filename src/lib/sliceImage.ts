import type { CapturedImage, Tile } from "@/types/puzzle";

/** The puzzle is a fixed 3×3 grid. */
export const PUZZLE_SIZE = 3;

/** Total number of tiles in the puzzle (9). */
export const PUZZLE_TILE_COUNT = PUZZLE_SIZE * PUZZLE_SIZE;

/** Loads an image element from a data URL. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load captured image."));
    img.src = src;
  });
}

/**
 * Slices a {@link CapturedImage} into a 3×3 grid of {@link Tile}s, in solved
 * order (left-to-right, top-to-bottom). Each tile carries its original
 * position as both `id` (1-based) and `correctIndex` (0-based).
 */
export async function sliceImage(captured: CapturedImage): Promise<Tile[]> {
  const img = await loadImage(captured.dataUrl);

  const tileWidth = Math.floor(img.width / PUZZLE_SIZE);
  const tileHeight = Math.floor(img.height / PUZZLE_SIZE);

  const tiles: Tile[] = [];
  for (let row = 0; row < PUZZLE_SIZE; row++) {
    for (let col = 0; col < PUZZLE_SIZE; col++) {
      const index = row * PUZZLE_SIZE + col;

      const canvas = document.createElement("canvas");
      canvas.width = tileWidth;
      canvas.height = tileHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to acquire 2D canvas context for slicing.");
      }

      ctx.drawImage(
        img,
        col * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight,
      );

      tiles.push({
        id: index + 1,
        correctIndex: index,
        imageData: canvas.toDataURL("image/png"),
      });
    }
  }

  return tiles;
}
