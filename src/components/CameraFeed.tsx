"use client";

import { useEffect, useRef, useState } from "react";

import { CapturedImage } from "@/components/CapturedImage";
import { FingerCursor } from "@/components/FingerCursor";
import { HandLandmarks } from "@/components/HandLandmarks";
import { PuzzleBoard } from "@/components/PuzzleBoard";
import { SelectionBox } from "@/components/SelectionBox";
import { useCamera } from "@/hooks/useCamera";
import { useFingerTracking } from "@/hooks/useFingerTracking";
import { useHandTracking } from "@/hooks/useHandTracking";
import { useFistDetection } from "@/hooks/useFistDetection";
import { usePuzzle } from "@/hooks/usePuzzle";
import { useRegionSelection } from "@/hooks/useRegionSelection";
import { PUZZLE_SIZE } from "@/lib/sliceImage";
import { useCaptchaStore } from "@/store/captchaStore";
import { CaptchaState } from "@/types/captcha";
import { MIDDLE_FINGER_MCP } from "@/types/hand";
import type { Tile } from "@/types/puzzle";

const STATUS_TEXT: Partial<Record<CaptchaState, string>> = {
  [CaptchaState.CAMERA]: "Raise both index fingers to frame an area",
  [CaptchaState.SELECTING_REGION]: "Hold the frame steady to capture",
  [CaptchaState.PUZZLE_READY]: "Get ready…",
  [CaptchaState.TRACKING]: "Make a fist to grab a piece, open your hand to drop",
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** True when every piece sits in its correct slot. */
function isPuzzleSolved(tiles: Tile[]): boolean {
  return tiles.length > 0 && tiles.every((t, i) => t.correctIndex === i);
}

export function CameraFeed() {
  const { videoRef, isLoading, error } = useCamera();
  const { landmarks, handedness } = useHandTracking(videoRef);

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

  // Store.
  const state = useCaptchaStore((s) => s.state);
  const setState = useCaptchaStore((s) => s.setState);
  const setRegion = useCaptchaStore((s) => s.setRegion);
  const capturedImage = useCaptchaStore((s) => s.capturedImage);
  const shuffledTiles = useCaptchaStore((s) => s.shuffledTiles);
  const draggingSlot = useCaptchaStore((s) => s.draggingSlot);
  const reset = useCaptchaStore((s) => s.reset);

  // Tracking + interaction.
  const selection = useRegionSelection(landmarks, handedness);
  // Anchor the cursor to the palm (middle-finger MCP) so it stays put when the
  // hand opens/closes into a fist.
  const fingers = useFingerTracking(
    landmarks,
    handedness,
    size.width,
    size.height,
    MIDDLE_FINGER_MCP,
  );
  const rightFinger = fingers.find((f) => f.id === "Right") ?? null;
  const fist = useFistDetection(landmarks, handedness, "Right");
  const { capture, grab, drop } = usePuzzle();

  // Cursor in board pixels, mirrored to match the flipped (selfie) feed.
  const cursor =
    state === CaptchaState.TRACKING && rightFinger && size.width > 0
      ? { x: size.width - rightFinger.x, y: rightFinger.y }
      : null;

  // Board slot under the cursor.
  const slot =
    cursor && size.width > 0 && size.height > 0
      ? clamp(Math.floor(cursor.y / (size.height / PUZZLE_SIZE)), 0, PUZZLE_SIZE - 1) *
          PUZZLE_SIZE +
        clamp(Math.floor(cursor.x / (size.width / PUZZLE_SIZE)), 0, PUZZLE_SIZE - 1)
      : null;
  const slotRef = useRef<number | null>(null);
  useEffect(() => {
    slotRef.current = slot;
  }, [slot]);

  const hasRegion = selection.region !== null;
  const isStable = selection.isStable;

  // CAMERA ⇄ SELECTING_REGION.
  useEffect(() => {
    if (state === CaptchaState.CAMERA && hasRegion) {
      setState(CaptchaState.SELECTING_REGION);
    } else if (state === CaptchaState.SELECTING_REGION && !hasRegion) {
      setState(CaptchaState.CAMERA);
    }
  }, [state, hasRegion, setState]);

  // SELECTING_REGION → CAPTURING once steady.
  useEffect(() => {
    if (state === CaptchaState.SELECTING_REGION && isStable && selection.region) {
      setRegion(selection.region);
      setState(CaptchaState.CAPTURING);
    }
  }, [state, isStable, selection.region, setRegion, setState]);

  // CAPTURING: grab the frame and build the puzzle.
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
    const timer = setTimeout(() => setState(CaptchaState.TRACKING), 1500);
    return () => clearTimeout(timer);
  }, [state, setState]);

  // Fist edges → grab / drop, then validate.
  const prevFistRef = useRef(false);
  useEffect(() => {
    if (state !== CaptchaState.TRACKING) {
      prevFistRef.current = false;
      return;
    }
    const was = prevFistRef.current;
    const now = fist.isFist;
    if (now === was) return;
    prevFistRef.current = now;

    const current = slotRef.current;
    if (current === null) return;

    if (now) {
      grab(current);
    } else {
      const wasDragging = useCaptchaStore.getState().draggingSlot !== null;
      drop(current);
      if (wasDragging) setState(CaptchaState.VALIDATING);
    }
  }, [state, fist.isFist, grab, drop, setState]);

  // VALIDATING: solved → SUCCESS, otherwise keep solving.
  useEffect(() => {
    if (state !== CaptchaState.VALIDATING) return;
    const solved = isPuzzleSolved(useCaptchaStore.getState().shuffledTiles);
    setState(solved ? CaptchaState.SUCCESS : CaptchaState.TRACKING);
  }, [state, setState]);

  const showLandmarks =
    state === CaptchaState.CAMERA || state === CaptchaState.SELECTING_REGION;
  const showPuzzle =
    state === CaptchaState.PUZZLE_READY ||
    state === CaptchaState.TRACKING ||
    state === CaptchaState.VALIDATING ||
    state === CaptchaState.SUCCESS;
  const statusText = STATUS_TEXT[state];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-lg"
      >
        {/* Mirrored (selfie) layer: video + aligned overlays flip together. */}
        <div className="absolute inset-0 -scale-x-100">
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
        </div>

        {state === CaptchaState.CAPTURING && capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <CapturedImage image={capturedImage} />
          </div>
        )}

        {showPuzzle && size.width > 0 && (
          <PuzzleBoard
            tiles={shuffledTiles}
            width={size.width}
            height={size.height}
            draggingSlot={state === CaptchaState.TRACKING ? draggingSlot : null}
            cursor={cursor}
          />
        )}

        {state === CaptchaState.TRACKING && rightFinger && cursor && (
          <FingerCursor
            x={cursor.x}
            y={cursor.y}
            visible
            active={fist.isFist}
          />
        )}

        {statusText && (
          <div className="absolute inset-x-0 top-0 z-30 flex justify-center p-3">
            <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
              {statusText}
            </span>
          </div>
        )}

        {state === CaptchaState.SUCCESS && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/75">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-[0_0_30px_8px_rgba(34,197,94,0.6)]">
              ✓
            </div>
            <p className="text-xl font-semibold text-white">Human Verified</p>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Restart
            </button>
          </div>
        )}

        {(isLoading || error) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/90 p-6 text-center">
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
