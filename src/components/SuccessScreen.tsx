"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessScreenProps {
  /** Issued verification token to display. */
  token: string;
}

/**
 * Animated success state: a large green check with pulse rings, the verified
 * message, and the generated token. Shown when a verification completes.
 */
export function SuccessScreen({ token }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#06070e]/90 backdrop-blur-sm"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute h-20 w-20 animate-pulse-ring rounded-full bg-green-500/40" />
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_40px_8px_rgba(34,197,94,0.6)]"
        >
          <Check className="h-10 w-10" strokeWidth={3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <p className="text-2xl font-bold text-white">Human Verified</p>
        <p className="mt-1 text-sm text-zinc-400">Token Generated</p>
        <code className="mt-3 inline-block rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-[#00dbe9]">
          {token}
        </code>
      </motion.div>
    </motion.div>
  );
}
