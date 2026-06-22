"use client";

import { useCamera } from "@/hooks/useCamera";
import { HandLandmarks } from "@/components/HandLandmarks";

/**
 * Renders the live webcam feed inside a responsive 16:9 frame, with
 * loading and error overlays driven by the useCamera hook.
 */
export function CameraFeed() {
  const { videoRef, isLoading, error } = useCamera();

  return (
    <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Hand skeleton overlay, absolutely positioned over the video. */}
      <HandLandmarks videoRef={videoRef} />

      {(isLoading || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 p-6 text-center">
          {error ? (
            <p className="text-sm font-medium text-red-400">{error.message}</p>
          ) : (
            <p className="text-sm font-medium text-zinc-300">
              Loading camera...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
