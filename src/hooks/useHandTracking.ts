"use client";

import { useEffect, useRef, useState } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";

import { getHandLandmarker } from "@/lib/mediapipe";
import type { MultiHandLandmarks } from "@/types/hand";

export interface UseHandTrackingResult {
  /**
   * Landmarks for every hand currently detected (up to two). Empty when no
   * hand is visible; each entry holds that hand's 21 landmarks.
   */
  landmarks: MultiHandLandmarks;
  /** True once the HandLandmarker model has loaded and detection is running. */
  isReady: boolean;
}

/**
 * Continuously detects a single hand in the given video element using the
 * shared MediaPipe HandLandmarker and reports its landmarks.
 *
 * Frames are processed inside a `requestAnimationFrame` loop; each new video
 * frame is run through `detectForVideo`, and the resulting landmarks are
 * pushed to React state so consumers can render an overlay.
 */
export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
): UseHandTrackingResult {
  const [landmarks, setLandmarks] = useState<MultiHandLandmarks>([]);
  const [isReady, setIsReady] = useState(false);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  // Tracks the last processed frame time so we skip frames the video hasn't
  // advanced past (detectForVideo requires monotonically increasing input).
  const lastVideoTimeRef = useRef<number>(-1);

  useEffect(() => {
    let cancelled = false;

    function detectFrame() {
      // Schedule the next frame first so a thrown error doesn't kill the loop.
      rafRef.current = requestAnimationFrame(detectFrame);

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;

      // HAVE_CURRENT_DATA — there is at least one frame available to read.
      if (video.readyState < 2) return;

      // Only run inference when the video has advanced to a new frame.
      if (video.currentTime === lastVideoTimeRef.current) return;
      lastVideoTimeRef.current = video.currentTime;

      const result = landmarker.detectForVideo(video, performance.now());
      setLandmarks(result.landmarks);
    }

    getHandLandmarker()
      .then((landmarker) => {
        if (cancelled) return;
        landmarkerRef.current = landmarker;
        setIsReady(true);
        detectFrame();
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to initialize HandLandmarker:", err);
        }
      });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastVideoTimeRef.current = -1;
    };
  }, [videoRef]);

  return { landmarks, isReady };
}
