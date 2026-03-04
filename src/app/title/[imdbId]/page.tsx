import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { parseImdbId } from "@/lib/imdb";
import { getMovieInsightByImdbId } from "@/lib/insights";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ imdbId: string }>;
}) {
  const { imdbId: raw } = await params;
  const imdbId = parseImdbId(raw);
  const data = await getMovieInsightByImdbId(imdbId);

  return (
    <div className="min-h-screen bg-[#0c1012] text-white">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-white/60 hover:text-white">
            ← Back
          </Link>
          <div className="text-[11px] text-white/45">
            IMDb: <span className="font-mono text-white/70">{data.movie.imdbId}</span>
          </div>
        </div>

        <section className="mt-5 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5">
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
                <div className="flex h-full items-center justify-center text-sm text-white/45">
                  No poster
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              <button className="h-10 rounded-2xl bg-[#f5c518] text-sm font-semibold text-black hover:bg-[#f5c518]/90">
                + Add to Watchlist
              </button>
              <button className="h-10 rounded-2xl bg-white/5 text-sm font-medium text-white/85 ring-1 ring-white/10 hover:bg-white/10">
                ★ Rate
              </button>
              <a
                href={`https://www.imdb.com/title/${data.movie.imdbId}/`}
                target="_blank"
                rel="noreferrer"
                className="h-10 rounded-2xl bg-white/5 text-center text-sm font-medium leading-10 text-white/85 ring-1 ring-white/10 hover:bg-white/10"
              >
                Open on IMDb
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {data.movie.title}
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  {[
                    data.movie.year,
                    data.movie.runtimeMinutes ? `${data.movie.runtimeMinutes} min` : null,
                    data.movie.genres.slice(0, 4).join(" • "),
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

            <div className="mt-5 flex flex-wrap gap-2">
              {data.movie.genres.slice(0, 6).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-8 border-b border-white/10 pb-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["Overview", "Cast & Crew", "Reviews", "Media", "More"].map((t) => (
                  <span
                    key={t}
                    className={cx(
                      "shrink-0 rounded-full px-4 py-2 text-xs font-medium ring-1 ring-white/10",
                      t === "Overview"
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/75 hover:bg-white/10",
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-white/85">Plot</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{data.movie.overview || "—"}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/85">Audience sentiment (AI)</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{data.sentiment.aiSummary}</p>
                <div className="mt-3 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                  Verdict: <span className="ml-1 font-semibold text-white">{data.sentiment.classification}</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white/85">Top cast</h2>
                <p className="text-xs text-white/45">From OMDb</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.movie.cast.slice(0, 12).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 text-xs text-white/45">
                      {c.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{c.name}</p>
                      <p className="truncate text-xs text-white/55">{c.character || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white/85">Ratings & signals</h2>
                <p className="text-xs text-white/45">Samples</p>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {data.reviews.samples.length === 0 ? (
                  <p className="text-sm text-white/60">No ratings were available.</p>
                ) : (
                  data.reviews.samples.slice(0, 6).map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white">{r.author}</p>
                      <p className="mt-2 text-sm leading-6 text-white/65">{r.content}</p>
                      <p className="mt-3 text-xs text-white/45">View source →</p>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

