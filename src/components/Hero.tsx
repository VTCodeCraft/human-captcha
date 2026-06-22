"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

import { VerificationPreview } from "@/components/VerificationPreview";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const BADGES = [
  "Gesture Based",
  "Human Motion Verified",
  "No Mouse Required",
  "No Keyboard Required",
  "Liveness Detection",
  "Spatial Interaction",
  "Privacy First",
  "No Text CAPTCHA",
  "Beyond Mouse & Keyboard",
  "Physical Interaction Required",
  "Bot Resistant",
  "Spatial CAPTCHA",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex max-w-7xl flex-col items-center gap-14 px-4 pb-20 pt-36 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-28 lg:pt-44"
    >
      {/* Left */}
      <div className="flex-1">
        <motion.span
          {...fadeUp()}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00dbe9]" />
          Gesture-Based CAPTCHA for Humans
        </motion.span>

        <motion.h1
          {...fadeUp(0.05)}
          className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          CAPTCHA,
          <br />
          <span className="text-gradient">Reinvented.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          Verify humans using computer vision, hand gestures and puzzle solving.
          No more squinting at distorted text.
        </motion.p>

        <motion.div {...fadeUp(0.15)} className="mt-8 flex flex-wrap gap-3">
          <a
            href="#demo"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00dbe9] to-[#22d3ee] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_30px_-6px_rgba(0,219,233,0.8)] transition-transform hover:scale-[1.03]"
          >
            Try Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#developers"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </a>
        </motion.div>

        <motion.ul
          {...staggerContainer(0.07)}
          className="mt-10 flex flex-wrap gap-2"
        >
          {BADGES.map((badge) => (
            <motion.li
              key={badge}
              variants={staggerItem}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300"
            >
              {badge}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="flex flex-1 justify-center lg:justify-end"
      >
        <VerificationPreview />
      </motion.div>
    </section>
  );
}
