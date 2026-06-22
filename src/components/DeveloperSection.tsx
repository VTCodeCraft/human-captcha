"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INSTALL: Record<string, string> = {
  npm: "npm install human-captcha",
  pnpm: "pnpm add human-captcha",
  yarn: "yarn add human-captcha",
};

const CODE: Record<string, string> = {
  React: `import { HumanCaptcha } from "human-captcha";

function App() {
  return (
    <HumanCaptcha
      siteKey="demo"
      onSuccess={(token) => {
        console.log("verified:", token);
      }}
    />
  );
}`,
  "Next.js": `"use client";

import { HumanCaptcha } from "human-captcha";

export default function Verify() {
  return (
    <HumanCaptcha
      siteKey={process.env.NEXT_PUBLIC_HC_KEY!}
      onSuccess={(token) => fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      })}
    />
  );
}`,
  HTML: `<script src="https://cdn.humancaptcha.dev/v1.js" defer></script>

<div
  class="human-captcha"
  data-sitekey="demo"
  data-on-success="onVerified"
></div>`,
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

export function DeveloperSection() {
  const [pm, setPm] = useState<keyof typeof INSTALL>("npm");
  const [fw, setFw] = useState<keyof typeof CODE>("React");

  return (
    <section
      id="developers"
      className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="Developers"
        title="Integrate in minutes"
        subtitle="Install the package, drop in the component, and you're protecting forms with gestures."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        {/* Install */}
        <motion.div {...fadeUp()} className="lg:col-span-2">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex border-b border-white/10">
              {Object.keys(INSTALL).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPm(key as keyof typeof INSTALL)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-colors",
                    pm === key
                      ? "text-[#00dbe9]"
                      : "text-zinc-400 hover:text-white",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <code className="font-mono text-sm text-zinc-200">
                {INSTALL[pm]}
              </code>
              <CopyButton value={INSTALL[pm]} />
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Zero config to start. Bring your own site key from the dashboard
            when you go to production.
          </p>
        </motion.div>

        {/* Code */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-3">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pr-3">
              <div className="flex">
                {Object.keys(CODE).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFw(key as keyof typeof CODE)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium transition-colors",
                      fw === key
                        ? "text-[#00dbe9]"
                        : "text-zinc-400 hover:text-white",
                    )}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <CopyButton value={CODE[fw]} />
            </div>
            <pre className="overflow-x-auto px-5 py-4 text-sm leading-relaxed">
              <code className="font-mono text-zinc-200">{CODE[fw]}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
