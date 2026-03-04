"use client";

import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#121212]/92 text-white backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="MovieMeter logo"
            width={120}
            height={32}
            priority
          />
        </Link>

        <nav className="flex items-center gap-2 text-xs font-medium text-white/75">
          <Link
            href="/"
            className="rounded-full px-3 py-2 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Home
          </Link>
          <a
            href="#discover"
            className="rounded-full px-3 py-2 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Discover
          </a>
          <a
            href="#charts"
            className="rounded-full px-3 py-2 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Charts
          </a>
        </nav>
      </div>
    </header>
  );
}

