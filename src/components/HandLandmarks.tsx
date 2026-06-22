"use client";

import { useEffect, useRef } from "react";
import { HandLandmarker } from "@mediapipe/tasks-vision";

import { useHandTracking } from "@/hooks/useHandTracking";

interface HandLandmarksProps {
  /** Ref to the video element whose frames should be tracked. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const LANDMARK_RADIUS = 4;
const CONNECTION_WIDTH = 2;
const LANDMARK_COLOR = "#22d3ee"; // cyan-400
const CONNECTION_COLOR = "#f8fafc"; // slate-50

/**
 * Transparent canvas overlay that renders the detected hand skeleton on top
 * of the webcam feed: small circles for each of the 21 landmarks and lines
 * for the MediaPipe hand connections.
 *
 * The canvas is positioned by its parent (CameraFeed) and stretched to fill
 * it; its internal resolution is kept in sync with the video's intrinsic
 * dimensions so landmark coordinates (normalized 0..1) map cleanly to pixels.
 */
export function HandLandmarks({ videoRef }: HandLandmarksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { landmarks } = useHandTracking(videoRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match the canvas resolution to the video's intrinsic dimensions, falling
    // back to its displayed size before metadata has loaded.
    const width = video.videoWidth || video.clientWidth;
    const height = video.videoHeight || video.clientHeight;
    if (width === 0 || height === 0) return;

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    if (landmarks.length === 0) return;

    // Render each detected hand independently.
    for (const hand of landmarks) {
      // Defensive guard: ignore anything that isn't a proper landmark array.
      // This also shields the overlay from transient hot-reload state where
      // the previous (single-hand) shape can linger in React state.
      if (!Array.isArray(hand)) continue;

      // Draw the connections (bones) first so the joints sit on top.
      ctx.strokeStyle = CONNECTION_COLOR;
      ctx.lineWidth = CONNECTION_WIDTH;
      for (const { start, end } of HandLandmarker.HAND_CONNECTIONS) {
        const from = hand[start];
        const to = hand[end];
        if (!from || !to) continue;

        ctx.beginPath();
        ctx.moveTo(from.x * width, from.y * height);
        ctx.lineTo(to.x * width, to.y * height);
        ctx.stroke();
      }

      // Draw the landmark points (joints).
      ctx.fillStyle = LANDMARK_COLOR;
      for (const point of hand) {
        ctx.beginPath();
        ctx.arc(
          point.x * width,
          point.y * height,
          LANDMARK_RADIUS,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
  }, [landmarks, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
