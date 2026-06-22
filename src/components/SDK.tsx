"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/site/SectionHeading";
import { fadeUp } from "@/lib/motion";

interface Prop {
  name: string;
  type: string;
  def: string;
  description: string;
}

const PROPS: Prop[] = [
  { name: "siteKey", type: "string", def: "—", description: "Your public site key (required)." },
  { name: "theme", type: '"dark" | "light"', def: '"dark"', description: "Widget color theme." },
  { name: "onSuccess", type: "(token: string) => void", def: "—", description: "Called with a verification token on success." },
  { name: "onError", type: "(error: Error) => void", def: "—", description: "Called when verification fails." },
  { name: "onExpired", type: "() => void", def: "—", description: "Called when an issued token expires." },
  { name: "size", type: '"compact" | "normal"', def: '"normal"', description: "Rendered widget size." },
  { name: "cameraFacing", type: '"user" | "environment"', def: '"user"', description: "Which camera to request." },
  { name: "modal", type: "boolean", def: "false", description: "Open in a modal instead of inline." },
  { name: "language", type: "string", def: '"en"', description: "UI language as an ISO code." },
];

const TS_EXAMPLE = `interface HumanCaptchaProps {
  siteKey: string;
  theme?: "dark" | "light";
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
  onExpired?: () => void;
  size?: "compact" | "normal";
  cameraFacing?: "user" | "environment";
  modal?: boolean;
  language?: string;
}`;

export function SDK() {
  return (
    <section id="sdk" className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="SDK"
        title="Component API"
        subtitle="A single, fully-typed component. Every prop is optional except your site key."
      />

      <motion.div
        {...fadeUp()}
        className="glass mt-14 overflow-hidden rounded-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3 font-medium">Prop</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Default</th>
                <th className="px-5 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-mono font-medium text-[#00dbe9]">
                    {p.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-purple-300">
                    {p.type}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-zinc-400">
                    {p.def}
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.1)} className="glass mt-6 overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 px-5 py-2.5 text-xs font-medium text-zinc-400">
          TypeScript
        </div>
        <pre className="overflow-x-auto px-5 py-4 text-sm leading-relaxed">
          <code className="font-mono text-zinc-200">{TS_EXAMPLE}</code>
        </pre>
      </motion.div>
    </section>
  );
}
