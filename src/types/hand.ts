import type { Category, NormalizedLandmark } from "@mediapipe/tasks-vision";

/**
 * A single hand landmark in normalized image space.
 *
 * `x` and `y` are in the range [0, 1] relative to the input frame's width
 * and height; `z` is depth relative to the wrist (smaller = closer to camera).
 */
export type HandLandmark = NormalizedLandmark;

/**
 * The 21 landmarks that make up a single detected hand, ordered by the
 * MediaPipe hand topology (0 = wrist, 4 = thumb tip, 8 = index tip, ...).
 */
export type HandLandmarks = HandLandmark[];

/** Landmarks for every hand detected in a single frame (0..numHands hands). */
export type MultiHandLandmarks = HandLandmarks[];

/**
 * Handedness classification for every detected hand, aligned by index with
 * {@link MultiHandLandmarks}. Each entry is a list of `Category` objects whose
 * `categoryName` is "Left" or "Right".
 */
export type MultiHandHandedness = Category[][];

/** The fixed number of landmarks MediaPipe reports per hand. */
export const HAND_LANDMARK_COUNT = 21 as const;

/** Index of the wrist landmark. */
export const WRIST = 0 as const;

/** Index of the thumb tip within a hand's landmark array. */
export const THUMB_TIP = 4 as const;

/** Index of the index-finger tip within a hand's landmark array. */
export const INDEX_FINGER_TIP = 8 as const;

/** Index of the middle-finger MCP joint, used as a hand-scale reference. */
export const MIDDLE_FINGER_MCP = 9 as const;
