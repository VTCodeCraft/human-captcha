import type { MotionProps } from "framer-motion";

/** Fade-and-rise as the element scrolls into view. */
export const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

/** Simple fade-in. */
export const fadeIn = (delay = 0): MotionProps => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

/** Container that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.08): MotionProps => ({
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-80px" },
  variants: {
    hidden: {},
    show: { transition: { staggerChildren: stagger } },
  },
});

/** Child item for use inside {@link staggerContainer}. */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;
