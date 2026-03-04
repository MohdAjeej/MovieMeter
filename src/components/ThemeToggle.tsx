"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-20 rounded-full bg-white/5 ring-1 ring-white/10" />;

  const current = resolvedTheme ?? theme ?? "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-white/5 px-3 text-xs font-medium text-white/75 ring-1 ring-white/15 hover:bg-white/10 dark:text-white/75"
    >
      <span className="font-mono text-[11px]">{current === "dark" ? "Dark" : "Light"}</span>
      <span className="text-[11px] text-white/55">{current === "dark" ? "◐" : "◑"}</span>
    </button>
  );
}

