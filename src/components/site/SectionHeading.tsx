"use client";

import { motion } from "framer-motion";

import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/** Centered section header: small cyan eyebrow, gradient title, subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      {...fadeUp()}
      className={cn("mx-auto max-w-2xl text-center", className)}
    >
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full border border-[#00dbe9]/30 bg-[#00dbe9]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#00dbe9]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
