"use client";

import { useEffect, useRef, useState } from "react";

import {
  INDEX_FINGER_TIP,
  type MultiHandHandedness,
  type MultiHandLandmarks,
} from "@/types/hand";

export interface FingerPosition {
  /**
   * Stable identifier for this hand across frames (its handedness label, e.g.
   * "Left"/"Right"). Used as a React key and as the per-hand smoothing key.
   */
  id: string;
  /** Smoothed x position of the index fingertip, in pixels. */
  x: number;
  /** Smoothed y position of the index fingertip, in pixels. */
  y: number;
}

/**
 * Exponential-smoothing factor in [0, 1]. Higher reacts faster (less smooth),
 * lower is smoother but laggier. 0.5 keeps cursors responsive yet stable.
 */
const SMOOTHING_FACTOR = 0.5;

/**
 * Tracks the index fingertip (landmark 8) of every detected hand and reports a
 * smoothed pixel position for each, suitable for rendering cursor overlays.
 *
 * Coordinates are produced in the pixel space described by `width`/`height`
 * (typically the displayed video size). Smoothing is applied per hand via an
 * exponential moving average, keyed by handedness so each hand's cursor stays
 * stable even as the other hand enters or leaves the frame.
 */
export function useFingerTracking(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
  width: number,
  height: number,
  landmarkIndex: number = INDEX_FINGER_TIP,
): FingerPosition[] {
  const [positions, setPositions] = useState<FingerPosition[]>([]);

  // Last smoothed position per hand id; entries are pruned when a hand is lost.
  const prevRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    if (width === 0 || height === 0) {
      prevRef.current.clear();
      setPositions((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    const next: FingerPosition[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < landmarks.length; i++) {
      const point = landmarks[i]?.[landmarkIndex];
      if (!point) continue;

      // Prefer the handedness label as a stable key; fall back to the slot
      // index, and disambiguate if two hands somehow share a label.
      const label = handedness[i]?.[0]?.categoryName ?? `hand-${i}`;
      let id = label;
      if (seen.has(id)) id = `${label}-${i}`;
      seen.add(id);

      const targetX = point.x * width;
      const targetY = point.y * height;

      const prev = prevRef.current.get(id);
      const x = prev ? prev.x + (targetX - prev.x) * SMOOTHING_FACTOR : targetX;
      const y = prev ? prev.y + (targetY - prev.y) * SMOOTHING_FACTOR : targetY;

      prevRef.current.set(id, { x, y });
      next.push({ id, x, y });
    }

    // Drop smoothing anchors for hands no longer visible so re-acquisition snaps.
    for (const key of prevRef.current.keys()) {
      if (!seen.has(key)) prevRef.current.delete(key);
    }

    setPositions(next);
  }, [landmarks, handedness, width, height, landmarkIndex]);

  return positions;
}
