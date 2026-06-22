import type { Region } from "@/types/captcha";
import type { CapturedImage } from "@/types/puzzle";

/**
 * Crops a normalized {@link Region} out of the current video frame and returns
 * it as a {@link CapturedImage}.
 *
 * The region is given in normalized coordinates (0..1), so it is scaled by the
 * video's intrinsic dimensions before sampling. This means the captured pixels
 * are correct regardless of how the video is displayed (e.g. `object-cover`).
 */
export function captureRegion(
  video: HTMLVideoElement,
  region: Region,
): CapturedImage {
  const frameWidth = video.videoWidth;
  const frameHeight = video.videoHeight;

  const sx = Math.round(region.x1 * frameWidth);
  const sy = Math.round(region.y1 * frameHeight);
  const sw = Math.max(1, Math.round((region.x2 - region.x1) * frameWidth));
  const sh = Math.max(1, Math.round((region.y2 - region.y1) * frameHeight));

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to acquire 2D canvas context for region capture.");
  }

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

  return { dataUrl: canvas.toDataURL("image/png"), width: sw, height: sh };
}
