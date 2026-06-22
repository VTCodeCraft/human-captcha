"use client";

import { useEffect, useRef, useState } from "react";

import type { Region } from "@/types/captcha";
import {
  INDEX_FINGER_TIP,
  type HandLandmark,
  type MultiHandHandedness,
  type MultiHandLandmarks,
} from "@/types/hand";

export interface RegionSelection {
  /** The current rectangle between the two index fingers, or null. */
  region: Region | null;
  /** Progress toward the hold threshold, in [0, 1]. */
  progress: number;
  /** True once the region has been held steady long enough. */
  isStable: boolean;
}

/** How long (ms) the region must hold steady before it's considered stable. */
const HOLD_MS = 1000;
/** Max normalized corner movement still considered "steady". */
const STABILITY_EPS = 0.04;

/** Finds the index fingertip of the hand with the given handedness label. */
function indexTipFor(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
  label: string,
): HandLandmark | null {
  for (let i = 0; i < landmarks.length; i++) {
    if (handedness[i]?.[0]?.categoryName === label) {
      return landmarks[i]?.[INDEX_FINGER_TIP] ?? null;
    }
  }
  return null;
}

/** Largest per-corner movement between two regions, in normalized units. */
function regionDrift(a: Region, b: Region): number {
  return Math.max(
    Math.abs(a.x1 - b.x1),
    Math.abs(a.y1 - b.y1),
    Math.abs(a.x2 - b.x2),
    Math.abs(a.y2 - b.y2),
  );
}

/**
 * Derives a selection rectangle from the two index fingertips (one per hand)
 * and tracks how long it has held steady.
 *
 * The rectangle spans from the min to the max of the two fingertips in
 * normalized coordinates. When both corners stay within `STABILITY_EPS` for
 * `HOLD_MS`, `isStable` becomes true.
 */
export function useRegionSelection(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
): RegionSelection {
  const [selection, setSelection] = useState<RegionSelection>({
    region: null,
    progress: 0,
    isStable: false,
  });

  const anchorRef = useRef<Region | null>(null);
  const sinceRef = useRef<number>(0);

  useEffect(() => {
    const left = indexTipFor(landmarks, handedness, "Left");
    const right = indexTipFor(landmarks, handedness, "Right");

    if (!left || !right) {
      anchorRef.current = null;
      sinceRef.current = 0;
      setSelection((prev) =>
        prev.region === null && prev.progress === 0 && !prev.isStable
          ? prev
          : { region: null, progress: 0, isStable: false },
      );
      return;
    }

    const region: Region = {
      x1: Math.min(left.x, right.x),
      y1: Math.min(left.y, right.y),
      x2: Math.max(left.x, right.x),
      y2: Math.max(left.y, right.y),
    };

    const now = performance.now();
    const anchor = anchorRef.current;

    if (!anchor || regionDrift(anchor, region) > STABILITY_EPS) {
      // Moved too much — reset the hold timer and re-anchor.
      anchorRef.current = region;
      sinceRef.current = now;
      setSelection({ region, progress: 0, isStable: false });
      return;
    }

    const progress = Math.min(1, (now - sinceRef.current) / HOLD_MS);
    setSelection({ region, progress, isStable: progress >= 1 });
  }, [landmarks, handedness]);

  return selection;
}
