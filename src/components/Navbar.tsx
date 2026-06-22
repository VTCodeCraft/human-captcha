"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, ScanFace, Star, Sun, X } from "lucide-react";

import { GithubIcon } from "@/components/site/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "SDK", href: "#sdk" },
  { label: "Docs", href: "#developers" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#06070e]/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00dbe9] to-[#a855f7] text-black shadow-[0_0_20px_-4px_rgba(0,219,233,0.7)]">
            <ScanFace className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            HumanCaptcha
          </span>
          <span className="rounded-full border border-[#00dbe9]/30 bg-[#00dbe9]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00dbe9]">
            Beta
          </span>
        </a>

        {/* Links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
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
            className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            Github
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 sm:flex"
          >
            <Star className="h-3.5 w-3.5 text-[#00dbe9]" />
            <span className="font-medium">2.4k</span>
          </a>
          <button
            type="button"
            aria-label="Toggle theme"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10 sm:flex"
          >
            <Sun className="h-4 w-4" />
          </button>
          <a
            href="#demo"
            className="group flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00dbe9] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_-6px_rgba(0,219,233,0.8)] transition-transform hover:scale-[1.03]"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-white/10 bg-[#06070e]/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
}
