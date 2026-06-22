"use client";

interface FingerCursorProps {
  /** Cursor center x position, in pixels relative to the overlay container. */
  x: number;
  /** Cursor center y position, in pixels relative to the overlay container. */
  y: number;
  /** Whether the cursor should be shown (i.e. the finger is tracked). */
  visible: boolean;
}

/**
 * Presentational cursor that marks the tracked fingertip: a solid red core,
 * a glowing ring, and a pulsing halo. Purely positional — all tracking and
 * smoothing happens upstream in `useFingerTracking`.
 *
 * Rendered with absolute positioning and `pointer-events-none` so it floats
 * over the video without intercepting input.
 */
export function FingerCursor({ x, y, visible }: FingerCursorProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-10 flex items-center justify-center"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {/* Pulsing halo */}
      <span className="absolute h-10 w-10 rounded-full bg-red-500/30 animate-ping" />

      {/* Outer glowing ring */}
      <span className="absolute h-9 w-9 rounded-full ring-2 ring-red-400/70 shadow-[0_0_16px_4px_rgba(248,113,113,0.7)]" />

      {/* Inner red circle */}
      <span className="relative h-4 w-4 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.9)]" />
    </div>
  );
}
