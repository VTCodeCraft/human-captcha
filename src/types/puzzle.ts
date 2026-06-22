/**
 * A still image captured from the video, stored as a data URL alongside its
 * pixel dimensions.
 */
export interface CapturedImage {
  /** PNG data URL of the captured region. */
  dataUrl: string;
  /** Width of the captured region, in pixels. */
  width: number;
  /** Height of the captured region, in pixels. */
  height: number;
}

/**
 * One tile of the 3×3 puzzle, cut from the captured image.
 */
export interface Tile {
  /** 1-based identity used by the challenge path (stable across shuffles). */
  id: number;
  /** The tile's position (0-8) in the solved/original image. */
  correctIndex: number;
  /** PNG data URL of this tile's cropped image. */
  imageData: string;
}
