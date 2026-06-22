"use client";

import type { Region } from "@/types/captcha";

interface SelectionBoxProps {
  /** Normalized region to draw, or null to render nothing. */
  region: Region | null;
  /** Hold progress in [0, 1], shown as a top progress bar. */
  progress: number;
}

const CORNER = "absolute h-4 w-4 border-cyan-300";

/**
 * Rounded rectangle drawn between the two index fingers, with corner
 * indicators and a hold-progress bar. Dims the area outside the region.
 * Non-interactive overlay.
 */
export function SelectionBox({ region, progress }: SelectionBoxProps) {
  if (!region) return null;

  const style: React.CSSProperties = {
    left: `${region.x1 * 100}%`,
    top: `${region.y1 * 100}%`,
    width: `${(region.x2 - region.x1) * 100}%`,
    height: `${(region.y2 - region.y1) * 100}%`,
    // Dim everything outside the selection.
    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)",
  };

  return (
    <div
      className="pointer-events-none absolute rounded-xl border-2 border-cyan-300/90"
      style={style}
    >
      {/* Corner indicators */}
      <span className={`${CORNER} -left-0.5 -top-0.5 rounded-tl-lg border-l-4 border-t-4`} />
      <span className={`${CORNER} -right-0.5 -top-0.5 rounded-tr-lg border-r-4 border-t-4`} />
      <span className={`${CORNER} -bottom-0.5 -left-0.5 rounded-bl-lg border-b-4 border-l-4`} />
      <span className={`${CORNER} -bottom-0.5 -right-0.5 rounded-br-lg border-b-4 border-r-4`} />

      {/* Hold-progress bar */}
      <div className="absolute -top-3 left-0 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-cyan-400 transition-[width] duration-75"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
