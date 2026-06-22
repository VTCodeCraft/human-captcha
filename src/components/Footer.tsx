import { ScanFace } from "lucide-react";

import { GithubIcon } from "@/components/site/icons";

const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Status", href: "#" },
  { label: "Docs", href: "#developers" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00dbe9] to-[#a855f7] text-black">
                <ScanFace className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                HumanCaptcha
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Gesture-based CAPTCHA powered by computer vision and puzzle
              solving.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <GithubIcon className="h-4 w-4" />
              Github
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} HumanCaptcha. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
