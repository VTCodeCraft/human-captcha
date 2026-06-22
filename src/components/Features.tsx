"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Code2,
  Hand,
  Lock,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Camera,
    title: "Computer Vision",
    description:
      "MediaPipe-powered hand tracking detects 21 landmarks per hand in real time, right in the browser.",
  },
  {
    icon: Hand,
    title: "Gesture Recognition",
    description:
      "Frame a region with both hands, then grab and drag puzzle pieces with a natural fist gesture.",
  },
  {
    icon: ShieldCheck,
    title: "Bot-Resistant",
    description:
      "Solving requires fluid, human motor control — far harder for scripts than clicking checkboxes.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "All inference runs on-device. Camera frames never leave the user's machine.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "GPU-accelerated detection keeps the experience smooth at 30+ FPS with minimal latency.",
  },
  {
    icon: Code2,
    title: "Drop-in SDK",
    description:
      "One component, one site key. Works with React, Next.js and plain HTML out of the box.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to verify humans"
        subtitle="A complete, gesture-native verification stack — built for the way people actually move."
      />

      <motion.div
        {...staggerContainer()}
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={staggerItem}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-[#00dbe9]/30"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00dbe9]/0 blur-2xl transition-colors duration-500 group-hover:bg-[#00dbe9]/20" />
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#00dbe9]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
