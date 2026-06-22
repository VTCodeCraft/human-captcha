"use client";

import type { CapturedImage as CapturedImageData } from "@/types/puzzle";

interface CapturedImageProps {
  /** The captured still to display, or null to render nothing. */
  image: CapturedImageData | null;
  /** Optional alt text. */
  alt?: string;
  className?: string;
}

/**
 * Renders a captured still (data URL) as an image. Used to show the frozen
 * region the moment it is captured.
 */
export function CapturedImage({
  image,
  alt = "Captured region",
  className = "h-full w-full object-contain",
}: CapturedImageProps) {
  if (!image) return null;

  // Data-URL image; next/image adds no value here.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.dataUrl} alt={alt} className={className} draggable={false} />;
}
