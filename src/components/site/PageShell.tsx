import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ScanFace } from "lucide-react";

import { Footer } from "@/components/Footer";

/**
 * Layout wrapper for standalone routes (Privacy, Terms, Status).
 *
 * Provides a minimal sticky header with the logo (linking home) and a
 * "Back to home" link, plus the shared site footer. Unlike the marketing
 * `Navbar`, it avoids in-page anchor links that only resolve on the home page.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06070e]/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00dbe9] to-[#a855f7] text-black shadow-[0_0_20px_-4px_rgba(0,219,233,0.7)]">
              <ScanFace className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              HumanCaptcha
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}
