"use client";

import { useCallback, useRef, useState } from "react";

import { captureRegion } from "@/lib/captureRegion";
import { generateChallenge } from "@/lib/generateChallenge";
import { PUZZLE_SIZE, sliceImage } from "@/lib/sliceImage";
import { shuffleTiles } from "@/lib/shuffleTiles";
import { useCaptchaStore } from "@/store/captchaStore";
import type { Region } from "@/types/captcha";

/** How long (ms) the cursor must dwell on a tile before it counts as visited. */
const DWELL_MS = 350;

export interface UsePuzzleResult {
  /** The tile id currently under the cursor, or null. */
  currentTile: number | null;
  /** Captures the region, slices + shuffles tiles, and generates a challenge. */
  capture: (video: HTMLVideoElement, region: Region) => Promise<void>;
  /**
   * Feeds the current normalized cursor position (0..1 over the board). Pass
   * `null` when no cursor is present. Registers a visited tile after dwell.
   */
  track: (nx: number | null, ny: number | null) => void;
}

/**
 * Owns puzzle creation (capture → slice → shuffle → challenge) and the
 * tracking-phase logic that maps the cursor to a tile and records the visited
 * path (with a dwell threshold so the finger can pass over tiles harmlessly).
 */
export function usePuzzle(): UsePuzzleResult {
  const setCaptured = useCaptchaStore((s) => s.setCaptured);
  const setPuzzle = useCaptchaStore((s) => s.setPuzzle);
  const visitTile = useCaptchaStore((s) => s.visitTile);
  const shuffledTiles = useCaptchaStore((s) => s.shuffledTiles);

  const [currentTile, setCurrentTile] = useState<number | null>(null);

  // Dwell bookkeeping: which tile we're hovering and when it started.
  const dwellRef = useRef<{ tile: number | null; since: number }>({
    tile: null,
    since: 0,
  });

  const capture = useCallback(
    async (video: HTMLVideoElement, region: Region) => {
      const captured = captureRegion(video, region);
      setCaptured(captured);

      const tiles = await sliceImage(captured);
      const shuffled = shuffleTiles(tiles);
      const challenge = generateChallenge();

      setPuzzle(tiles, shuffled, challenge);
    },
    [setCaptured, setPuzzle],
  );

  const track = useCallback(
    (nx: number | null, ny: number | null) => {
      if (nx === null || ny === null) {
        setCurrentTile(null);
        dwellRef.current = { tile: null, since: 0 };
        return;
      }

      const col = Math.min(PUZZLE_SIZE - 1, Math.max(0, Math.floor(nx * PUZZLE_SIZE)));
      const row = Math.min(PUZZLE_SIZE - 1, Math.max(0, Math.floor(ny * PUZZLE_SIZE)));
      const slot = row * PUZZLE_SIZE + col;
      const id = shuffledTiles[slot]?.id ?? null;

      setCurrentTile(id);

      const now = performance.now();
      if (dwellRef.current.tile !== id) {
        dwellRef.current = { tile: id, since: now };
      } else if (id !== null && now - dwellRef.current.since >= DWELL_MS) {
        visitTile(id);
        // Prevent re-registering the same dwell; wait until the tile changes.
        dwellRef.current.since = Number.POSITIVE_INFINITY;
      }
    },
    [shuffledTiles, visitTile],
  );

  return { currentTile, capture, track };
}
