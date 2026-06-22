"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For side projects and prototypes.",
    features: ["1,000 verifications / mo", "3×3 puzzles", "Community support", "1 site key"],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For growing products in production.",
    features: [
      "100,000 verifications / mo",
      "All difficulty levels",
      "Priority support",
      "10 site keys",
      "Analytics dashboard",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For high-volume and regulated teams.",
    features: ["Unlimited verifications", "SLA & SSO", "Dedicated support", "On-prem option", "Custom models"],
    cta: "Contact sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, scalable pricing"
        subtitle="Start free. Upgrade when you grow. Cancel anytime."
      />

      <motion.div
        {...staggerContainer(0.1)}
        className="mt-16 grid gap-6 md:grid-cols-3"
      >
        {TIERS.map((tier) => (
          <motion.div
            key={tier.name}
            variants={staggerItem}
            className={cn(
              "relative flex flex-col rounded-2xl p-7",
              tier.featured
                ? "glass-strong border-[#00dbe9]/40 glow-cyan"
                : "glass",
            )}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00dbe9] to-[#a855f7] px-3 py-1 text-xs font-semibold text-black">
                Most popular
              </span>
            )}

            <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{tier.description}</p>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              <span className="text-sm text-zinc-500">{tier.period}</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00dbe9]" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={cn(
                "mt-7 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]",
                tier.featured
                  ? "bg-gradient-to-r from-[#00dbe9] to-[#22d3ee] text-black shadow-[0_0_24px_-6px_rgba(0,219,233,0.8)]"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
              )}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
