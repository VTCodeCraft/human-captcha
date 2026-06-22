"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { CameraFeed } from "@/components/CameraFeed";
import { SuccessScreen } from "@/components/SuccessScreen";
import { useCaptchaStore } from "@/store/captchaStore";
import { CaptchaState } from "@/types/captcha";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  /** Called once verification succeeds (after the success animation). */
  onVerified: () => void;
}

function makeToken(): string {
  const rand = () => Math.random().toString(36).slice(2, 10);
  return `hc_${rand()}${rand()}`;
}

/**
 * Modal that runs the real gesture-puzzle widget ({@link CameraFeed}) and,
 * driven by the shared captcha store, shows the success screen and reports
 * verification back to the host. Resets the store each time it opens so every
 * run starts fresh; unmounting the widget on close releases the camera.
 */
export function VerificationModal({
  open,
  onClose,
  onVerified,
}: VerificationModalProps) {
  const state = useCaptchaStore((s) => s.state);
  const reset = useCaptchaStore((s) => s.reset);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      reset();
      setToken(null);
    }
  }, [open, reset]);

  const onVerifiedRef = useRef(onVerified);
  onVerifiedRef.current = onVerified;

  useEffect(() => {
    if (!open || state !== CaptchaState.SUCCESS) return;
    setToken((prev) => prev ?? makeToken());
    const timer = setTimeout(() => onVerifiedRef.current(), 2400);
    return () => clearTimeout(timer);
  }, [open, state]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-strong relative w-full max-w-2xl rounded-3xl p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Human Verification
                </h3>
                <p className="text-xs text-zinc-400">
                  Solve the puzzle with hand gestures
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <CameraFeed />
              {state === CaptchaState.SUCCESS && token && (
                <SuccessScreen token={token} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
