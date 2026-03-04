"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { isValidImdbId } from "@/lib/imdb";

type ApiCast = {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
};

type ApiReview = {
  id: string;
  author: string;
  rating: number | null;
  url: string;
  createdAt: string;
  content: string;
};

type ApiResponse = {
  movie: {
    imdbId: string;
    title: string;
    year?: string;
    rating: number;
    runtimeMinutes: number | null;
    genres: string[];
    overview: string;
    posterUrl: string | null;
    cast: ApiCast[];
  };
  reviews: { total: number; samples: ApiReview[] };
  sentiment: {
    classification: "positive" | "mixed" | "negative";
    score: number;
    distribution: { positive: number; neutral: number; negative: number };
    aiSummary: string;
    keyPoints?: string[];
    themes?: { common: string[]; pros: string[]; cons: string[] };
  };
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SentimentBadge({ value }: { value: "positive" | "mixed" | "negative" }) {
  const styles =
    value === "positive"
      ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30"
      : value === "negative"
        ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30"
        : "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
  const label = value === "positive" ? "Positive" : value === "negative" ? "Negative" : "Mixed";

  return (
    <span className={cx("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", styles)}>
      {label}
    </span>
  );
}

export function MovieSearch() {
  const [imdbId, setImdbId] = useState("tt0133093");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  const isValid = useMemo(() => isValidImdbId(imdbId), [imdbId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);

    if (!isValid) {
      setError("Please enter a valid IMDb ID (example: tt0133093).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/movie?imdbId=${encodeURIComponent(imdbId)}`);
      const json = (await res.json()) as any;
      if (!res.ok) {
        setError(json?.message ?? "Something went wrong.");
        return;
      }
      setData(json as ApiResponse);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        suppressHydrationWarning
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="grid gap-2">
          <label className="text-sm font-medium text-white/80" htmlFor="imdbId">
            IMDb ID or URL
          </label>
          <div className="relative">
            <input
              id="imdbId"
              suppressHydrationWarning
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              placeholder="tt0133093 or IMDb link"
              autoComplete="off"
              spellCheck={false}
              className={cx(
                "h-12 w-full rounded-2xl bg-white/5 px-4 pr-24 text-white ring-1 ring-white/10 outline-none backdrop-blur",
                "placeholder:text-white/35",
                "focus:ring-2 focus:ring-white/30",
                !isValid && imdbId.trim().length > 0 && "ring-1 ring-rose-500/50 focus:ring-rose-500/50",
              )}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/45">
              {isValid ? "valid" : "tt… or IMDb URL"}
            </div>
          </div>
          <p className="text-xs text-white/45">
            Tip: Paste either an ID like{" "}
            <span className="font-mono text-white/70">tt0133093</span> or a full IMDb URL like{" "}
            <span className="font-mono text-white/70">https://www.imdb.com/title/tt0133093</span>.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className={cx(
            "h-12 shrink-0 rounded-2xl px-5 font-medium text-black",
            "bg-white hover:bg-white/90",
            "disabled:opacity-60 disabled:hover:bg-white",
            "transition-colors",
          )}
        >
          {loading ? "Analyzing…" : "Get insights"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-6 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-100 ring-1 ring-rose-500/30"
          >
            {error}
          </motion.div>
        )}

        {data && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 grid gap-6"
          >
            <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)] lg:items-stretch">
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur lg:flex lg:flex-col">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-white/5">
                  {data.movie.posterUrl ? (
                    <Image
                      src={data.movie.posterUrl}
                      alt={`${data.movie.title} poster`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 320px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/50">
                      No poster
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SentimentBadge value={data.sentiment.classification} />
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70 ring-1 ring-white/10">
                    IMDb: <span className="ml-1 font-mono">{data.movie.imdbId}</span>
                  </span>
                  <Link
                    href={`/title/${data.movie.imdbId}`}
                    className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    Open details →
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur lg:flex lg:flex-col">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {data.movie.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {[
                        data.movie.year,
                        data.movie.runtimeMinutes ? `${data.movie.runtimeMinutes} min` : null,
                        data.movie.genres?.slice(0, 3).join(" • "),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#14181c] px-4 py-3 ring-1 ring-white/15">
                    <p className="text-[11px] font-semibold text-white/65 uppercase tracking-[0.15em]">
                      IMDb rating
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="inline-flex items-center justify-center rounded-sm bg-[#f5c518] px-1.5 py-0.5 text-xs font-bold text-black">
                        ★
                      </span>
                      <p className="text-xl font-semibold text-white">
                        {data.movie.rating.toFixed(1)}
                        <span className="ml-1 text-xs font-normal text-white/55">/ 10</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:items-start">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/85">Plot</h3>
                    <p className="text-sm leading-6 text-white/70 line-clamp-6">
                      {data.movie.overview || "—"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/85">Audience sentiment (AI)</h3>
                    <p className="text-sm leading-6 text-white/70 line-clamp-6">
                      {data.sentiment.aiSummary}
                    </p>
                    {!!data.sentiment.keyPoints?.length && (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/65">
                        {data.sentiment.keyPoints.slice(0, 6).map((k) => (
                          <li key={k}>{k}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white/85">Cast</h3>
                    <p className="text-xs text-white/45">Top billed</p>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.movie.cast.slice(0, 12).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                      >
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/5">
                          {c.profileUrl ? (
                            <Image
                              src={c.profileUrl}
                              alt={c.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-white/40">
                              —
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{c.name}</p>
                          <p className="truncate text-xs text-white/55">{c.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-white/85">Audience reviews</h3>
                <p className="text-xs text-white/45">
                  Showing {data.reviews.samples.length} of {data.reviews.total}
                </p>
              </div>
              {data.reviews.samples.length === 0 ? (
                <p className="mt-3 text-sm text-white/60">
                  No audience ratings or reviews were found for this title.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {data.reviews.samples.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-white">{r.author}</p>
                        {r.rating !== null && (
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/65 ring-1 ring-white/10">
                            {r.rating}/10
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-5 text-sm leading-6 text-white/65">{r.content}</p>
                      <p className="mt-3 text-xs text-white/45 group-hover:text-white/60">Read more →</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

