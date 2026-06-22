"use client";

import { useEffect, useRef, useState } from "react";

import { CapturedImage } from "@/components/CapturedImage";
import { ChallengeCard } from "@/components/ChallengeCard";
import { FingerCursor } from "@/components/FingerCursor";
import { HandLandmarks } from "@/components/HandLandmarks";
import { PuzzleBoard } from "@/components/PuzzleBoard";
import { SelectionBox } from "@/components/SelectionBox";
import { useCamera } from "@/hooks/useCamera";
import { useFingerTracking } from "@/hooks/useFingerTracking";
import { useHandTracking } from "@/hooks/useHandTracking";
import { usePuzzle } from "@/hooks/usePuzzle";
import { useRegionSelection } from "@/hooks/useRegionSelection";
import { validatePath } from "@/lib/validatePath";
import { useCaptchaStore } from "@/store/captchaStore";
import { CaptchaState } from "@/types/captcha";

/** Per-state instruction text shown above/over the feed. */
const STATUS_TEXT: Partial<Record<CaptchaState, string>> = {
  [CaptchaState.CAMERA]: "Raise both index fingers to begin",
  [CaptchaState.SELECTING_REGION]:
    "Frame an area with both index fingers, then hold still",
  [CaptchaState.CAPTURING]: "Captured!",
  [CaptchaState.PUZZLE_READY]: "Get ready…",
};

/**
 * Orchestrates the whole HumanCaptcha flow. Hand tracking runs once here and
 * drives a state machine: camera → region selection → capture → puzzle →
 * finger-traced challenge → validation → success/fail.
 */
export function CameraFeed() {
  const { videoRef, isLoading, error } = useCamera();
  const { landmarks, handedness } = useHandTracking(videoRef);

  // Displayed size of the feed/board, used to map normalized coords to pixels.
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Store state machine + data.
  const state = useCaptchaStore((s) => s.state);
  const setState = useCaptchaStore((s) => s.setState);
  const setRegion = useCaptchaStore((s) => s.setRegion);
  const capturedImage = useCaptchaStore((s) => s.capturedImage);
  const shuffledTiles = useCaptchaStore((s) => s.shuffledTiles);
  const challenge = useCaptchaStore((s) => s.challenge);
  const visitedTiles = useCaptchaStore((s) => s.visitedTiles);
  const reset = useCaptchaStore((s) => s.reset);

  // Derived tracking.
  const selection = useRegionSelection(landmarks, handedness);
  const fingers = useFingerTracking(
    landmarks,
    handedness,
    size.width,
    size.height,
  );
  const rightFinger = fingers.find((f) => f.id === "Right") ?? null;
  const { currentTile, capture, track } = usePuzzle();

  const hasRegion = selection.region !== null;
  const isStable = selection.isStable;

  // CAMERA ⇄ SELECTING_REGION based on whether two index fingers are present.
  useEffect(() => {
    if (state === CaptchaState.CAMERA && hasRegion) {
      setState(CaptchaState.SELECTING_REGION);
    } else if (state === CaptchaState.SELECTING_REGION && !hasRegion) {
      setState(CaptchaState.CAMERA);
    }
  }, [state, hasRegion, setState]);

  // SELECTING_REGION → CAPTURING once the region holds steady.
  useEffect(() => {
    if (state === CaptchaState.SELECTING_REGION && isStable && selection.region) {
      setRegion(selection.region);
      setState(CaptchaState.CAPTURING);
    }
  }, [state, isStable, selection.region, setRegion, setState]);

  // CAPTURING: grab the frame and build the puzzle, then advance.
  useEffect(() => {
    if (state !== CaptchaState.CAPTURING) return;
    let cancelled = false;

    const video = videoRef.current;
    const region = useCaptchaStore.getState().region;
    if (!video || !region) {
      setState(CaptchaState.CAMERA);
      return;
    }

    capture(video, region)
      .then(() => {
        if (!cancelled) setState(CaptchaState.PUZZLE_READY);
      })
      .catch((err) => {
        console.error("Capture/puzzle generation failed:", err);
        if (!cancelled) setState(CaptchaState.CAMERA);
      });

    return () => {
      cancelled = true;
    };
  }, [state, videoRef, capture, setState]);

  // PUZZLE_READY → TRACKING after a brief look at the shuffled board.
  useEffect(() => {
    if (state !== CaptchaState.PUZZLE_READY) return;
    const timer = setTimeout(() => setState(CaptchaState.TRACKING), 1800);
    return () => clearTimeout(timer);
  }, [state, setState]);

  // TRACKING: feed the cursor position to the tile tracker each frame.
  useEffect(() => {
    if (state !== CaptchaState.TRACKING) return;
    if (rightFinger && size.width > 0 && size.height > 0) {
      track(rightFinger.x / size.width, rightFinger.y / size.height);
    } else {
      track(null, null);
    }
  }, [state, rightFinger, size.width, size.height, track]);

  // TRACKING → VALIDATING once enough tiles have been traced.
  useEffect(() => {
    if (
      state === CaptchaState.TRACKING &&
      challenge.length > 0 &&
      visitedTiles.length >= challenge.length
    ) {
      setState(CaptchaState.VALIDATING);
    }
  }, [state, visitedTiles, challenge, setState]);

  // VALIDATING → SUCCESS | FAIL.
  useEffect(() => {
    if (state !== CaptchaState.VALIDATING) return;
    const ok = validatePath(challenge, visitedTiles);
    const timer = setTimeout(
      () => setState(ok ? CaptchaState.SUCCESS : CaptchaState.FAIL),
      400,
    );
    return () => clearTimeout(timer);
  }, [state, challenge, visitedTiles, setState]);

  const showLandmarks =
    state === CaptchaState.CAMERA || state === CaptchaState.SELECTING_REGION;
  const showPuzzle =
    state === CaptchaState.PUZZLE_READY ||
    state === CaptchaState.TRACKING ||
    state === CaptchaState.VALIDATING ||
    state === CaptchaState.SUCCESS ||
    state === CaptchaState.FAIL;
  const showCursor = state === CaptchaState.TRACKING && rightFinger !== null;
  const statusText = STATUS_TEXT[state];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      {(state === CaptchaState.TRACKING ||
        state === CaptchaState.VALIDATING) && (
        <ChallengeCard challenge={challenge} visited={visitedTiles} />
      )}

      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-lg"
      >
        {/* Live feed stays mounted (and playing) so detection keeps running. */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
        />

        {showLandmarks && (
          <HandLandmarks videoRef={videoRef} landmarks={landmarks} />
        )}

        {state === CaptchaState.SELECTING_REGION && (
          <SelectionBox region={selection.region} progress={selection.progress} />
        )}

        {state === CaptchaState.CAPTURING && capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <CapturedImage image={capturedImage} />
          </div>
        )}

        {showPuzzle && (
          <PuzzleBoard
            tiles={shuffledTiles}
            currentTile={currentTile}
            visited={visitedTiles}
          />
        )}

        {showCursor && rightFinger && (
          <FingerCursor x={rightFinger.x} y={rightFinger.y} visible />
        )}

        {/* Status banner */}
        {statusText && (
          <div className="absolute inset-x-0 top-0 flex justify-center p-3">
            <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
              {statusText}
            </span>
          </div>
        )}

        {/* Success / fail overlays */}
        {state === CaptchaState.SUCCESS && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">
              ✓
            </div>
            <p className="text-xl font-semibold text-white">Human Verified</p>
          </div>
        )}

        {state === CaptchaState.FAIL && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-3xl text-white">
              ✕
            </div>
            <p className="text-lg font-semibold text-white">
              Path didn&apos;t match
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Camera loading / error */}
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
    </div>
  );
}
