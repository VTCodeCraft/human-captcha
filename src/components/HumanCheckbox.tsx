"use client";

import { motion } from "framer-motion";
import { Check, ScanFace } from "lucide-react";

import { cn } from "@/lib/utils";

interface HumanCheckboxProps {
  /** Whether verification has completed. */
  verified: boolean;
  /** Called when the user activates the (unverified) checkbox. */
  onActivate: () => void;
}

/**
 * The embeddable verification checkbox: "Verify you are human", protected by
 * HumanCaptcha. Clicking starts the flow; once verified it shows a check.
 */
export function HumanCheckbox({ verified, onActivate }: HumanCheckboxProps) {
  return (
    <div className="glass-strong w-full max-w-sm overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => !verified && onActivate()}
        disabled={verified}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/5 disabled:cursor-default"
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors",
            verified
              ? "border-green-500 bg-green-500"
              : "border-zinc-500 bg-transparent",
          )}
        >
          {verified && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </motion.span>
          )}
        </span>
        <span className="text-sm font-medium text-white">
          {verified ? "Verified" : "Verify you are human"}
        </span>
      </button>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-[#00dbe9] to-[#a855f7] text-black">
            <ScanFace className="h-2.5 w-2.5" />
          </span>
          Protected by HumanCaptcha
        </span>
        <span className="text-[10px] text-zinc-600">Privacy · Terms</span>
      </div>
    </div>
  );
}
