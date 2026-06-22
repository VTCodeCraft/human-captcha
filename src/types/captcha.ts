/**
 * The finite states of the HumanCaptcha flow. Progression is linear:
 *
 *   CAMERA → SELECTING_REGION → CAPTURING → PUZZLE_READY
 *          → TRACKING → VALIDATING → SUCCESS | FAIL
 */
export enum CaptchaState {
  /** Live webcam with hand landmarks; waiting for two hands. */
  CAMERA,
  /** Two index fingers define a rectangle; waiting for it to hold still. */
  SELECTING_REGION,
  /** Region held steady: grab the frame and build the puzzle. */
  CAPTURING,
  /** Shuffled puzzle generated and shown to the user. */
  PUZZLE_READY,
  /** Right index finger acts as a cursor to trace the challenge path. */
  TRACKING,
  /** Comparing the traced path against the expected path. */
  VALIDATING,
  /** Path matched — human verified. */
  SUCCESS,
  /** Path did not match — allow retry. */
  FAIL,
}

/**
 * A rectangular region of the video frame, expressed in normalized
 * coordinates (0..1) so it is independent of display/intrinsic resolution.
 * `(x1, y1)` is the top-left corner and `(x2, y2)` the bottom-right.
 */
export interface Region {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
