"use client";

import { useCallback } from "react";

import { captureRegion } from "@/lib/captureRegion";
import { sliceImage } from "@/lib/sliceImage";
import { shuffleTiles } from "@/lib/shuffleTiles";
import { useCaptchaStore } from "@/store/captchaStore";
import type { Region } from "@/types/captcha";

export interface UsePuzzleResult {
  /** Captures the region, slices it 3×3, and shuffles into the board. */
  capture: (video: HTMLVideoElement, region: Region) => Promise<void>;
  /** Grabs the piece in the given board slot (pinch down). */
  grab: (slot: number) => void;
  /** Drops the grabbed piece on the given slot, swapping (pinch up). */
  drop: (slot: number) => void;
}

/**
 * Owns puzzle creation (capture → slice → shuffle) and the grab/drop actions
 * used while solving the puzzle by hand.
 */
export function usePuzzle(): UsePuzzleResult {
  const setCaptured = useCaptchaStore((s) => s.setCaptured);
  const setPuzzle = useCaptchaStore((s) => s.setPuzzle);
  const grabSlot = useCaptchaStore((s) => s.grabSlot);
  const dropSlot = useCaptchaStore((s) => s.dropSlot);

  const capture = useCallback(
    async (video: HTMLVideoElement, region: Region) => {
      const captured = captureRegion(video, region);
      setCaptured(captured);

      const tiles = await sliceImage(captured);
      setPuzzle(tiles, shuffleTiles(tiles));
    },
    [setCaptured, setPuzzle],
  );

  const grab = useCallback((slot: number) => grabSlot(slot), [grabSlot]);
  const drop = useCallback((slot: number) => dropSlot(slot), [dropSlot]);

  return { capture, grab, drop };
}
