"use client";

import { useEffect, useRef, useState } from "react";

import {
  INDEX_FINGER_TIP,
  MIDDLE_FINGER_MCP,
  THUMB_TIP,
  WRIST,
  type HandLandmark,
  type HandLandmarks,
  type MultiHandHandedness,
  type MultiHandLandmarks,
} from "@/types/hand";

export interface PinchState {
  /** True while the thumb and index finger are pinched together. */
  isPinching: boolean;
}

/**
 * Hysteresis thresholds (thumb–index distance ÷ hand size). Pinch engages
 * below `ON` and only releases above `OFF`; the gap prevents flicker.
 */
const PINCH_ON = 0.45;
const PINCH_OFF = 0.6;

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
 * Detects a thumb–index pinch on the given hand, used as a mouse-down/up
 * gesture for grabbing puzzle pieces. The distance is normalized by hand size
 * (wrist → middle-finger MCP) so the threshold is robust to camera distance.
 */
export function usePinchDetection(
  landmarks: MultiHandLandmarks,
  handedness: MultiHandHandedness,
  label: string = "Right",
): PinchState {
  const [isPinching, setIsPinching] = useState(false);
  const pinchingRef = useRef(false);

  useEffect(() => {
    const hand = handFor(landmarks, handedness, label);
    if (!hand) {
      if (pinchingRef.current) {
        pinchingRef.current = false;
        setIsPinching(false);
      }
      return;
    }

    const thumb = hand[THUMB_TIP];
    const index = hand[INDEX_FINGER_TIP];
    const wrist = hand[WRIST];
    const midMcp = hand[MIDDLE_FINGER_MCP];
    if (!thumb || !index || !wrist || !midMcp) return;

    const handScale = distance2D(wrist, midMcp) || 1;
    const ratio = distance2D(thumb, index) / handScale;

    const was = pinchingRef.current;
    let now = was;
    if (!was && ratio < PINCH_ON) now = true;
    else if (was && ratio > PINCH_OFF) now = false;

    if (now !== was) {
      pinchingRef.current = now;
      setIsPinching(now);
    }
  }, [landmarks, handedness, label]);

  return { isPinching };
}
