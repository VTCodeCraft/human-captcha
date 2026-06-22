"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { fadeUp } from "@/lib/motion";

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "Do users need to install anything?",
    a: "No. HumanCaptcha runs entirely in the browser using the device camera and WebAssembly — no plugins, apps or downloads.",
  },
  {
    q: "Is camera data sent to your servers?",
    a: "Never. All hand tracking and puzzle solving happens on-device. Only an anonymous verification token leaves the browser.",
  },
  {
    q: "What if a user has no camera?",
    a: "You can configure a fallback challenge, or gate the gesture flow behind a feature check and use a traditional method as backup.",
  },
  {
    q: "How does it stop bots?",
    a: "Solving requires continuous, human-like motor control across many frames — far harder to fake than clicking a checkbox or labelling images.",
  },
  {
    q: "Which frameworks are supported?",
    a: "React, Next.js and plain HTML are supported out of the box. Any framework that can render a component or script tag works.",
  },
  {
    q: "Is it accessible?",
    a: "Gesture verification ships alongside accessible fallbacks so users who can't use a camera or gestures can still verify.",
  },
];

function FaqItem({ item }: { item: QA }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#00dbe9] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
      />

      <motion.div {...fadeUp(0.1)} className="mt-12 flex flex-col gap-3">
        {FAQS.map((item) => (
          <FaqItem key={item.q} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
