import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { PageShell } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Status — HumanCaptcha",
  description:
    "Live operational status of HumanCaptcha verification, hand-tracking runtime and demo services.",
};

type Health = "operational" | "degraded" | "outage";

interface Service {
  name: string;
  description: string;
  status: Health;
}

const SERVICES: Service[] = [
  {
    name: "Verification flow",
    description: "Gesture capture, puzzle solving and token issuance.",
    status: "operational",
  },
  {
    name: "Hand-tracking runtime",
    description: "MediaPipe WASM runtime and hand-landmark model delivery.",
    status: "operational",
  },
  {
    name: "Demo site",
    description: "The marketing site and interactive live demo.",
    status: "operational",
  },
  {
    name: "Documentation",
    description: "Developer docs and SDK reference.",
    status: "operational",
  },
];

const STATUS_META: Record<
  Health,
  { label: string; dot: string; text: string }
> = {
  operational: {
    label: "Operational",
    dot: "bg-green-400",
    text: "text-green-400",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  outage: {
    label: "Outage",
    dot: "bg-red-400",
    text: "text-red-400",
  },
};

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-xs font-medium uppercase tracking-wider text-[#00dbe9]">
          System status
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          HumanCaptcha Status
        </h1>

        {/* Overall banner */}
        <div
          className={`mt-8 flex items-center gap-3 rounded-2xl border p-5 ${
            allOperational
              ? "border-green-400/20 bg-green-400/5"
              : "border-amber-400/20 bg-amber-400/5"
          }`}
        >
          <CheckCircle2
            className={`h-6 w-6 ${
              allOperational ? "text-green-400" : "text-amber-400"
            }`}
          />
          <div>
            <p className="text-sm font-semibold text-white">
              {allOperational
                ? "All systems operational"
                : "Some systems are experiencing issues"}
            </p>
            <p className="text-xs text-zinc-500">
              All processing runs on-device, so verification keeps working even
              if our site is offline.
            </p>
          </div>
        </div>

        {/* Per-service breakdown */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          {SERVICES.map((service, i) => {
            const meta = STATUS_META[service.status];
            return (
              <div
                key={service.name}
                className={`flex items-center justify-between gap-4 p-5 ${
                  i !== 0 ? "border-t border-white/10" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {service.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {service.description}
                  </p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-2 text-sm font-medium ${meta.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Incident history */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">Past incidents</h2>
          <div className="mt-4 rounded-2xl border border-white/10 p-6 text-center">
            <p className="text-sm text-zinc-400">
              No incidents reported in the last 90 days.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
