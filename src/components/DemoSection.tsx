"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { HumanCheckbox } from "@/components/HumanCheckbox";
import { OnboardingModal } from "@/components/OnboardingModal";
import { VerificationModal } from "@/components/VerificationModal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { fadeUp } from "@/lib/motion";

type View = "idle" | "onboarding" | "verifying";

export function DemoSection() {
  const [view, setView] = useState<View>("idle");
  const [verified, setVerified] = useState(false);

  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Live demo"
        title="Try it yourself"
        subtitle="Click the checkbox to launch a real verification. You'll need to allow camera access."
      />

      <motion.div
        {...fadeUp(0.1)}
        className="mt-14 flex flex-col items-center"
      >
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-tr from-[#00dbe9]/15 to-[#a855f7]/15 blur-3xl" />
          <HumanCheckbox
            verified={verified}
            onActivate={() => setView("onboarding")}
          />
        </div>

        {verified && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-sm text-green-400"
          >
            ✓ You&apos;ve been verified as human.
          </motion.p>
        )}
      </motion.div>

      <OnboardingModal
        open={view === "onboarding"}
        onClose={() => setView("idle")}
        onStart={() => setView("verifying")}
      />

      <VerificationModal
        open={view === "verifying"}
        onClose={() => setView("idle")}
        onVerified={() => {
          setVerified(true);
          setView("idle");
        }}
      />
    </section>
  );
}
