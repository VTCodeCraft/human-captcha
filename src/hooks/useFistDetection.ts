"use client";

import { useEffect, useRef, useState } from "react";

import {
  WRIST,
  type HandLandmark,
  type HandLandmarks,
  type MultiHandHandedness,
  type MultiHandLandmarks,
} from "@/types/hand";

export interface FistState {
  /** True while the hand is closed into a fist. */
  isFist: boolean;
}

/** [MCP, tip] landmark index pairs for index, middle, ring and pinky. */
const FINGERS: Array<[number, number]> = [
  [5, 8],
  [9, 12],
  [13, 16],
  [17, 20],
];

/**
 * Hysteresis thresholds on hand "openness" — the mean ratio of
 * fingertip-to-wrist distance over MCP-to-wrist distance across the four
 * fingers. Extended fingers give a high ratio (~1.8+); a fist gives a low one
 * (~1.0). The gap between ON/OFF prevents flicker.
 */
const FIST_ON = 1.2; // close below this → grab
const FIST_OFF = 1.5; // open above this → release

function handFor(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
  label: string,
): HandLandmarks | null {
  for (let i = 0; i < landmarks.length; i++) {
    if (handedness[i]?.[0]?.categoryName === label) {
      return landmarks[i] ?? null;
    }
  }
  return null;
}

function distance2D(a: HandLandmark, b: HandLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Detects a closed fist on the given hand, used as a grab (mouse-down) gesture;
 * opening the hand releases (mouse-up). The metric is scale-invariant (each
 * finger ratio is normalized against its own MCP), so it works regardless of
 * how close the hand is to the camera.
 */
export function useFistDetection(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
  label: string = "Right",
): FistState {
  const [isFist, setIsFist] = useState(false);
  const fistRef = useRef(false);

  useEffect(() => {
    const hand = handFor(landmarks, handedness, label);
    if (!hand) {
      if (fistRef.current) {
        fistRef.current = false;
        setIsFist(false);
      }
      return;
    }

    const wrist = hand[WRIST];
    if (!wrist) return;

    let sum = 0;
    let count = 0;
    for (const [mcp, tip] of FINGERS) {
      const mcpPoint = hand[mcp];
      const tipPoint = hand[tip];
      if (!mcpPoint || !tipPoint) continue;
      const mcpDist = distance2D(mcpPoint, wrist) || 1;
      sum += distance2D(tipPoint, wrist) / mcpDist;
      count++;
    }
    if (count === 0) return;

    const openness = sum / count;

    const was = fistRef.current;
    let now = was;
    if (!was && openness < FIST_ON) now = true;
    else if (was && openness > FIST_OFF) now = false;

    if (now !== was) {
      fistRef.current = now;
      setIsFist(now);
    }
  }, [landmarks, handedness, label]);

  return { isFist };
}
