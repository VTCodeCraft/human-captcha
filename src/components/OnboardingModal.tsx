"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Grid3x3,
  Hand,
  MousePointer2,
  ScanFace,
  Timer,
  X,
  type LucideIcon,
} from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

interface Lesson {
  icon: LucideIcon;
  title: string;
  description: string;
}

const LESSONS: Lesson[] = [
  { icon: ScanFace, title: "Create a box with your hands", description: "Raise both hands and frame a rectangle using your two index fingers." },
  { icon: Timer, title: "Hold for 2 seconds", description: "Keep the frame steady. A countdown will start automatically." },
  { icon: Grid3x3, title: "A puzzle appears", description: "The captured image is sliced into a shuffled 3×3 grid." },
  { icon: MousePointer2, title: "Use your right hand as a cursor", description: "Move your right hand to glide the glowing cursor over the board." },
  { icon: Hand, title: "Make a fist to grab", description: "Close your hand into a fist to pick up the piece under the cursor." },
  { icon: Grid3x3, title: "Open your hand to drop", description: "Release the fist to drop the piece and swap it into place." },
  { icon: BadgeCheck, title: "Get verified", description: "Reassemble the image and you're instantly verified as human." },
];

export function OnboardingModal({ open, onClose, onStart }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const lesson = LESSONS[step];
  const isLast = step === LESSONS.length - 1;
  const Icon = lesson.icon;

  const next = () => (isLast ? onStart() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <AnimatePresence onExitComplete={() => setStep(0)}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-6"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-xs font-semibold uppercase tracking-wider text-[#00dbe9]">
              How to verify
            </span>

            {/* Animated illustration */}
            <div className="relative mt-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="absolute h-32 w-32 rounded-full bg-[#00dbe9]/15 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00dbe9]/30 bg-[#06070e] text-[#00dbe9] shadow-[0_0_30px_-8px_rgba(0,219,233,0.8)]"
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-5 text-center"
              >
                <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                  {lesson.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {LESSONS.map((_, i) => (
                <span
                  key={i}
                  className={
                    i === step
                      ? "h-1.5 w-5 rounded-full bg-[#00dbe9] transition-all"
                      : "h-1.5 w-1.5 rounded-full bg-white/20 transition-all"
                  }
                />
              ))}
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={next}
                className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00dbe9] to-[#22d3ee] px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-6px_rgba(0,219,233,0.8)] transition-transform hover:scale-[1.02]"
              >
                {isLast ? "Start Verification" : "Next"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
