import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Stronger, more opaque glass (for modals / foreground surfaces). */
  strong?: boolean;
}

/** Glassmorphism surface with rounded corners and a subtle border. */
export function GlassCard({
  strong = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
