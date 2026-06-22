"use client";

import { cn } from "@/lib/utils";

interface FingerCursorProps {
  /** Cursor center x position, in pixels relative to the overlay container. */
  x: number;
  /** Cursor center y position, in pixels relative to the overlay container. */
  y: number;
  /** Whether the cursor should be shown (i.e. the finger is tracked). */
  visible: boolean;
  /** True while pinching (mouse-down); tightens the core and intensifies glow. */
  active?: boolean;
}

/**
 * Glowing red cursor marking the tracked fingertip. When `active` (pinching)
 * the core tightens and the glow intensifies, signalling a "grab".
 * Non-interactive overlay.
 */
export function FingerCursor({ x, y, visible, active = false }: FingerCursorProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-50 flex items-center justify-center"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <span
        className={cn(
          "absolute rounded-full bg-red-500/30",
          active ? "h-8 w-8" : "h-10 w-10 animate-ping",
        )}
      />
      <span
        className={cn(
          "absolute rounded-full ring-2 ring-red-400/70",
          active
            ? "h-7 w-7 shadow-[0_0_22px_6px_rgba(248,113,113,0.9)]"
            : "h-9 w-9 shadow-[0_0_16px_4px_rgba(248,113,113,0.7)]",
        )}
      />
      <span
        className={cn(
          "relative rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.9)]",
          active ? "h-2.5 w-2.5" : "h-4 w-4",
        )}
      />
    </div>
  );
}
