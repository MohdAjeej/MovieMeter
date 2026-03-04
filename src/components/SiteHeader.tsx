"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { parseImdbId } from "@/lib/imdb";

const MODES = ["All", "Movies", "Series", "People"] as const;
type Mode = (typeof MODES)[number];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SiteHeader() {
  const [mode, setMode] = useState<Mode>("All");
  const [q, setQ] = useState("");
  const router = useRouter();

  const placeholder = useMemo(() => {
    switch (mode) {
      case "Movies":
        return "Search movies by IMDb link or ID…";
      case "Series":
        return "Search series by IMDb link or ID…";
      case "People":
        return "People search (demo UI) — paste title ID for now…";
      default:
        return "Search movies, series, people… (IMDb link or ID)";
    }
  }, [mode]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;

    try {
      const imdbId = parseImdbId(q);
      router.push(`/title/${imdbId}`);
    } catch {
      // Keep UX simple: we only support IMDb IDs/URLs for this assignment scope.
      router.push(`/?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-black/20 bg-[#121212]/92 backdrop-blur dark:border-white/10 dark:bg-[#121212]/92">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center rounded-sm bg-[#f5c518] px-2.5 py-1.5 text-xs font-extrabold tracking-tight text-black">
            IMDb
          </div>
          <span className="hidden text-xs font-semibold text-white/85 sm:inline">
            Discover
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="ml-1 flex min-w-0 flex-1 items-center gap-2"
          suppressHydrationWarning
        >
          <div className="hidden items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:flex">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cx(
                  "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                  mode === m ? "bg-white text-black" : "text-white/70 hover:text-white",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className={cx(
                "h-10 w-full rounded-full bg-white/5 px-4 pr-10 text-sm text-white ring-1 ring-white/10 outline-none",
                "placeholder:text-white/40",
                "focus:ring-2 focus:ring-white/25",
              )}
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/10 hover:bg-white/15"
              suppressHydrationWarning
            >
              Search
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          <a
            href="#discover"
            className="rounded-full px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white"
          >
            Discover
          </a>
          <a
            href="#charts"
            className="rounded-full px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white"
          >
            Charts
          </a>
        </nav>

        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

