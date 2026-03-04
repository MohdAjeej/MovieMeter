"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MovieInsight } from "@/lib/insights";
import { SiteHeader } from "@/components/SiteHeader";

type TabId = "overview" | "cast" | "reviews" | "media" | "more";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function loadWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("mm_watchlist");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("mm_watchlist", JSON.stringify(list));
  } catch {
    // ignore
  }
}

function loadRatings(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("mm_ratings");
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveRatings(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("mm_ratings", JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function TitleScreen({ insight }: { insight: MovieInsight }) {
  const [tab, setTab] = useState<TabId>("overview");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const imdbId = insight.movie.imdbId;

  useEffect(() => {
    const wl = loadWatchlist();
    setInWatchlist(wl.includes(imdbId));
    const ratings = loadRatings();
    setLiked(Boolean(ratings[imdbId]));
  }, [imdbId]);

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2000);
  }

  function toggleWatchlist() {
    const current = loadWatchlist();
    const exists = current.includes(imdbId);
    const next = exists ? current.filter((id) => id !== imdbId) : [...current, imdbId];
    saveWatchlist(next);
    setInWatchlist(!exists);
    showMessage(exists ? "Removed from watchlist" : "Added to watchlist");
  }

  function toggleLiked() {
    const ratings = loadRatings();
    const nextLiked = !ratings[imdbId];
    const next = { ...ratings, [imdbId]: nextLiked };
    if (!nextLiked) {
      delete next[imdbId];
    }
    saveRatings(next);
    setLiked(nextLiked);
    showMessage(nextLiked ? "Marked as liked" : "Removed like");
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast & Crew" },
    { id: "reviews", label: "Reviews" },
    { id: "media", label: "Media" },
    { id: "more", label: "More" },
  ];

  const sentimentLabel = useMemo(
    () => insight.sentiment.classification,
    [insight.sentiment.classification],
  );

  return (
    <div className="min-h-screen bg-[#0c1012] text-white">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-white/60 hover:text-white">
            ← Back
          </Link>
          <div className="text-[11px] text-white/45">
            IMDb: <span className="font-mono text-white/70">{insight.movie.imdbId}</span>
          </div>
        </div>

        <section className="mt-5 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          {/* Left: poster + actions */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
              {insight.movie.posterUrl ? (
                <Image
                  src={insight.movie.posterUrl}
                  alt={`${insight.movie.title} poster`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 320px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/45">
                  No poster
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={toggleWatchlist}
                className={cx(
                  "h-10 rounded-2xl text-sm font-semibold",
                  inWatchlist
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[#f5c518] text-black hover:bg-[#f5c518]/90",
                )}
              >
                {inWatchlist ? "In Watchlist" : "+ Add to Watchlist"}
              </button>
              <button
                type="button"
                onClick={toggleLiked}
                className={cx(
                  "h-10 rounded-2xl text-sm font-medium ring-1 ring-white/10 hover:bg-white/10",
                  liked ? "bg-white text-black" : "bg-white/5 text-white/85",
                )}
              >
                {liked ? "★ Liked" : "★ Rate"}
              </button>
              <a
                href={`https://www.imdb.com/title/${insight.movie.imdbId}/`}
                target="_blank"
                rel="noreferrer"
                className="h-10 rounded-2xl bg-white/5 text-center text-sm font-medium leading-10 text-white/85 ring-1 ring-white/10 hover:bg-white/10"
              >
                Open on IMDb
              </a>
              {message && (
                <p className="mt-1 text-xs text-emerald-300" aria-live="polite">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Right: summary + tabs + content */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {insight.movie.title}
                </h1>
                <p className="mt-2 text-sm text-white/70">
                  {[
                    insight.movie.year,
                    insight.movie.runtimeMinutes ? `${insight.movie.runtimeMinutes} min` : null,
                    insight.movie.genres.slice(0, 4).join(" • "),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              <div className="rounded-2xl bg-[#14181c] px-4 py-3 ring-1 ring-white/15">
                <p className="text-xs font-semibold text-white/65 uppercase tracking-[0.15em]">
                  IMDb rating
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="inline-flex items-center justify-center rounded-sm bg-[#f5c518] px-1.5 py-0.5 text-xs font-bold text-black">
                    ★
                  </span>
                  <p className="text-xl font-semibold text-white">
                    {insight.movie.rating.toFixed(1)}
                    <span className="ml-1 text-xs font-normal text-white/55">/ 10</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {insight.movie.genres.slice(0, 6).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-8 border-b border-white/10 pb-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "shrink-0 rounded-full px-4 py-2 text-xs font-medium ring-1 ring-white/10",
                      tab === t.id
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/75 hover:bg-white/10",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab panels */}
            {tab === "overview" && (
              <div className="mt-6 grid gap-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold text-white/85">Plot</h2>
                  <p className="mt-2 text-sm leading-7 text-white/75">{insight.movie.overview || "—"}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/85">Audience sentiment (AI)</h2>
                  <p className="mt-2 text-sm leading-7 text-white/75">{insight.sentiment.aiSummary}</p>
                  <div className="mt-3 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
                    Verdict: <span className="ml-1 font-semibold text-white">{sentimentLabel}</span>
                  </div>
                </div>
              </div>
            )}

            {tab === "cast" && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white/85">Top cast</h2>
                  <p className="text-xs text-white/45">From OMDb</p>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {insight.movie.cast.slice(0, 12).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 text-xs text-white/45">
                        {c.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{c.name}</p>
                        <p className="truncate text-xs text-white/55">{c.character || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white/85">Ratings & reviews</h2>
                  <p className="text-xs text-white/45">
                    Showing {insight.reviews.samples.length} of {insight.reviews.total}
                  </p>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {insight.reviews.samples.length === 0 ? (
                    <p className="text-sm text-white/65">No ratings were available.</p>
                  ) : (
                    insight.reviews.samples.slice(0, 6).map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10"
                      >
                        <p className="text-sm font-semibold text-white">{r.author}</p>
                        <p className="mt-2 text-sm leading-6 text-white/70">{r.content}</p>
                        <p className="mt-3 text-xs text-white/45">View source →</p>
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === "media" && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-white/85">Media</h2>
                <p className="mt-2 text-sm text-white/65">
                  Media integration is not part of the current assignment, but this section is reserved for trailers,
                  clips, and photo galleries.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10" />
                  <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10" />
                  <div className="aspect-video rounded-2xl bg-white/5 ring-1 ring-white/10" />
                </div>
              </div>
            )}

            {tab === "more" && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-white/85">More information</h2>
                <dl className="mt-3 grid gap-2 text-sm text-white/75">
                  <div className="flex gap-2">
                    <dt className="w-28 text-white/55">Year</dt>
                    <dd>{insight.movie.year ?? "—"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 text-white/55">Runtime</dt>
                    <dd>
                      {insight.movie.runtimeMinutes ? `${insight.movie.runtimeMinutes} min` : "—"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 text-white/55">Genres</dt>
                    <dd>{insight.movie.genres.join(", ") || "—"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 text-white/55">IMDb page</dt>
                    <dd>
                      <a
                        href={`https://www.imdb.com/title/${insight.movie.imdbId}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-cyan-300 hover:text-cyan-200"
                      >
                        Open on IMDb →
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

