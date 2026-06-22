"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Discriminates the reason webcam access failed so the UI can show a
 * tailored message for each case.
 */
export type CameraErrorType = "permission-denied" | "no-camera" | "unknown";

export interface CameraError {
  type: CameraErrorType;
  message: string;
}

export interface UseCameraResult {
  /** Attach to a <video> element to render the live stream. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** True while the browser is requesting/initializing the camera. */
  isLoading: boolean;
  /** Populated when access fails; null on success. */
  error: CameraError | null;
}

/**
 * Requests webcam access and wires the resulting stream into a video ref.
 *
 * The stream is acquired once on mount and torn down on unmount so the
 * camera light doesn't stay on after the component leaves the tree.
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<CameraError | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError({
          type: "no-camera",
          message: "No camera found on this device.",
        });
        setIsLoading(false);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        // Component unmounted while we were awaiting permission.
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(toCameraError(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, isLoading, error };
}

/** Maps a getUserMedia rejection to a typed, user-facing CameraError. */
function toCameraError(err: unknown): CameraError {
  if (err instanceof DOMException) {
    switch (err.name) {
      case "NotAllowedError":
      case "SecurityError":
        return {
          type: "permission-denied",
          message: "Camera permission denied.",
        };
      case "NotFoundError":
      case "OverconstrainedError":
        return { type: "no-camera", message: "No camera found." };
    }
  }

  return {
    type: "unknown",
    message: "Unable to access the camera.",
  };
}
