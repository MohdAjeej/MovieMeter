"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type PosterCardItem = {
  imdbId: string;
  title: string;
  year?: string;
  posterUrl?: string | null;
  badge?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PosterCard({ item, rank }: { item: PosterCardItem; rank?: number }) {
  const [posterUrl, setPosterUrl] = useState<string | null | undefined>(item.posterUrl);

  useEffect(() => {
    let cancelled = false;
    if (posterUrl) return;

    async function load() {
      try {
        const res = await fetch(`/api/movie?imdbId=${encodeURIComponent(item.imdbId)}`);
        const json = (await res.json()) as any;
        if (!cancelled && json?.movie?.posterUrl) {
          setPosterUrl(json.movie.posterUrl as string);
        }
      } catch {
        // ignore; fallback "No poster" will be shown
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [item.imdbId, posterUrl]);

  return (
    <Link
      href={`/title/${item.imdbId}`}
      className={cx(
        "group relative block w-[156px] shrink-0",
        "rounded-2xl bg-white/5 ring-1 ring-white/10",
        "transition-transform hover:-translate-y-1",
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${item.title} poster`}
            fill
            sizes="156px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/45">
            No poster
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80" />

        {typeof rank === "number" && (
          <div className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f5c518] text-xs font-extrabold text-black shadow">
            {rank}
          </div>
        )}

        {item.badge && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/10 backdrop-blur">
            {item.badge}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        <p className="truncate text-xs font-semibold text-white/90">{item.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-white/55">{item.year ?? "—"}</p>
      </div>
    </Link>
  );
}

