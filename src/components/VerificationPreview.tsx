"use client";

import { motion } from "framer-motion";
import { Hand } from "lucide-react";

const TILE_GRADIENTS = [
  "from-cyan-500/30 to-blue-600/30",
  "from-purple-500/30 to-fuchsia-600/30",
  "from-sky-500/30 to-cyan-600/30",
  "from-violet-500/30 to-purple-600/30",
  "from-cyan-400/30 to-teal-600/30",
  "from-fuchsia-500/30 to-pink-600/30",
  "from-blue-500/30 to-indigo-600/30",
  "from-teal-500/30 to-cyan-600/30",
  "from-purple-400/30 to-violet-600/30",
];

/**
 * Decorative, self-animating preview of a HumanCaptcha verification: a glass
 * card with a 3×3 puzzle board, a looping cursor, a hand-status row and a
 * progress bar. Purely visual (no camera).
 */
export function VerificationPreview() {
  return (
    <div className="animate-float relative">
      {/* Ambient glow behind the card */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#00dbe9]/20 to-[#a855f7]/20 blur-3xl" />

      <div className="glass-strong glow-ring relative w-full max-w-sm overflow-hidden rounded-3xl p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-[#00dbe9]/30 bg-[#00dbe9]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#00dbe9]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00dbe9]" />
            Verifying
          </span>
        </div>

        {/* Puzzle board */}
        <div className="relative">
          <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
            {TILE_GRADIENTS.map((g, i) => (
              <div
                key={i}
                className={`relative flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br ${g}`}
              >
                <span className="text-xs font-semibold text-white/40">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Scanner line */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            <div className="animate-scan absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00dbe9] to-transparent shadow-[0_0_12px_2px_rgba(0,219,233,0.6)]" />
          </div>

          {/* Looping cursor */}
          <motion.div
            className="pointer-events-none absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            initial={{ left: "20%", top: "25%" }}
            animate={{
              left: ["20%", "80%", "50%", "30%", "70%", "20%"],
              top: ["25%", "30%", "55%", "78%", "60%", "25%"],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute h-6 w-6 animate-pulse-ring rounded-full bg-red-500/40" />
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.9)]" />
          </motion.div>
        </div>

        {/* Hand status */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <Hand className="h-4 w-4 text-[#00dbe9]" />
          <span className="text-xs text-zinc-300">Right hand detected</span>
          <span className="ml-auto text-xs font-medium text-[#00dbe9]">98%</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
            <span>Solving puzzle</span>
            <span>72%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00dbe9] to-[#a855f7]"
              initial={{ width: "10%" }}
              animate={{ width: ["10%", "72%", "40%", "90%", "10%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
