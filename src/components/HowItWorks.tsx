"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Camera,
  Grid3x3,
  Hand,
  ScanFace,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { fadeUp } from "@/lib/motion";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: ScanFace,
    title: "Create a capture region",
    description:
      "Raise both hands and frame a rectangle with your index fingers. A glowing selection box tracks your fingertips.",
  },
  {
    icon: Camera,
    title: "AI captures the image",
    description:
      "Hold the frame steady for two seconds. A countdown runs, then the region is captured straight from the video.",
  },
  {
    icon: Grid3x3,
    title: "Puzzle is generated",
    description:
      "The captured image is sliced into a shuffled 3×3 grid — a unique puzzle every single time.",
  },
  {
    icon: Hand,
    title: "Solve using gestures",
    description:
      "Move your right hand as a cursor, make a fist to grab a piece, and open your hand to drop it into place.",
  },
  {
    icon: BadgeCheck,
    title: "Human verified",
    description:
      "Once the image is reassembled, you're verified and a token is issued to your application.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How it works"
        title="Five steps to prove you're human"
        subtitle="No text to read, no images to label — just natural hand movement."
      />

      <div className="relative mt-16">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-[#00dbe9]/50 via-white/10 to-[#a855f7]/50 sm:left-1/2" />

        <div className="flex flex-col gap-8">
          {STEPS.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              {...fadeUp(i * 0.05)}
              className="relative flex items-start gap-5 sm:grid sm:grid-cols-2 sm:gap-10"
            >
              {/* Node */}
              <div className="absolute left-0 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00dbe9]/30 bg-[#06070e] text-[#00dbe9] shadow-[0_0_24px_-8px_rgba(0,219,233,0.8)] sm:left-1/2 sm:-translate-x-1/2">
                <Icon className="h-6 w-6" />
              </div>

              {/* Card — alternates sides on desktop */}
              <div
                className={
                  i % 2 === 0
                    ? "glass ml-20 rounded-2xl p-5 sm:col-start-1 sm:ml-0 sm:mr-12 sm:text-right"
                    : "glass ml-20 rounded-2xl p-5 sm:col-start-2 sm:ml-12"
                }
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-[#00dbe9]">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
