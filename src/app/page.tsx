import { MovieSearch } from "@/components/MovieSearch";
import { SiteHeader } from "@/components/SiteHeader";
import { CarouselRow } from "@/components/CarouselRow";
import { SearchHotkeyListener } from "@/components/SearchHotkeyListener";
import { curated, type CuratedItem } from "@/lib/curated";
import { fetchOmdbMovieByImdbId } from "@/lib/omdb";
import type { PosterCardItem } from "@/components/PosterCard";

async function hydrateCurated(items: CuratedItem[]): Promise<PosterCardItem[]> {
  return Promise.all(
    items.map(async (item) => {
      try {
        const omdb = await fetchOmdbMovieByImdbId(item.imdbId);
        return {
          imdbId: item.imdbId,
          title: omdb.Title || item.title,
          year: (omdb.Year || item.year)?.slice(0, 4),
          posterUrl: omdb.Poster && omdb.Poster !== "N/A" ? omdb.Poster : null,
          badge: item.badge,
        };
      } catch {
        return {
          imdbId: item.imdbId,
          title: item.title,
          year: item.year,
          posterUrl: null,
          badge: item.badge,
        };
      }
    }),
  );
}

export default async function Home() {
  const [trending, topRated, sciFi] = await Promise.all([
    hydrateCurated(curated.trending),
    hydrateCurated(curated.topRated),
    hydrateCurated(curated.sciFi),
  ]);

  return (
    <div className="min-h-screen bg-[#0c1012] text-white">
      <SiteHeader />
      <SearchHotkeyListener />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 via-white/0 to-transparent p-6 ring-1 ring-white/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-120px] h-[460px] w-[460px] rounded-full bg-[#f5c518]/10 blur-3xl" />
            <div className="absolute bottom-[-220px] left-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/10">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c518] text-[11px] font-extrabold text-black">
                  ★
                </span>
                Premium movie discovery
              </div>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Search by IMDb link. Get an instant, sentiment-driven snapshot.
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-[15px] leading-7 text-white/70">
                Paste an IMDb URL (like `https://www.imdb.com/title/tt0133093/`) or just the ID. We fetch details and
                translate audience signals into a clear verdict.
              </p>
              <div className="mt-6 rounded-3xl bg-black/40 p-5 ring-1 ring-white/10 backdrop-blur">
                <MovieSearch />
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
              <h2 className="text-sm font-semibold text-white/85">What you’ll see</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                <li>Movie title, poster, year, rating, plot summary</li>
                <li>Top-billed cast list</li>
                <li>Aggregated ratings + sentiment classification</li>
                <li>AI-style sentiment summary (LLM if configured)</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15">
                  Unified search
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15">
                  Quick actions
                </span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15">
                  Clean details view
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="discover" className="mt-12">
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Discover</h2>
              <p className="mt-1 text-sm text-white/60">
                Curated rows inspired by popular movie platforms.
              </p>
            </div>
            <span className="text-xs text-white/45">Scroll horizontally to explore →</span>
          </header>
          <CarouselRow
            title="Trending worldwide"
            subtitle="Curated picks to explore the redesigned UI"
            items={trending}
            ranked
          />
          <CarouselRow
            title="Top rated"
            subtitle="Evergreen classics worth revisiting"
            items={topRated}
          />
          <CarouselRow
            title="Mind-bending sci‑fi"
            subtitle="If you liked The Matrix…"
            items={sciFi}
          />
        </section>

        <section id="charts" className="mt-16 border-t border-white/10 pt-10">
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Charts</h2>
              <p className="mt-1 text-sm text-white/60">
                A lightweight take on Top 10 style lists.
              </p>
            </div>
          </header>
          <CarouselRow
            title="Top 10 classics"
            subtitle="Ranked by cultural impact (curated)"
            items={topRated}
            ranked
          />
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-lg font-semibold tracking-tight text-white">How it works</h2>
          <p className="mt-2 text-sm text-white/60">
            A simple three-step flow inspired by movie platforms like{" "}
            <span className="font-semibold text-white/85">IMDb</span> (`https://www.imdb.com/`).
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Step 1</p>
              <h3 className="mt-2 text-sm font-semibold text-white/90">Paste any IMDb link</h3>
              <p className="mt-2 text-xs text-white/65">
                Copy a URL from `https://www.imdb.com/` or just the ID (for example `tt0133093`) into the search box.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Step 2</p>
              <h3 className="mt-2 text-sm font-semibold text-white/90">We fetch movie details</h3>
              <p className="mt-2 text-xs text-white/65">
                The backend looks up the title, year, runtime, genres, ratings, and poster using the OMDb API.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Step 3</p>
              <h3 className="mt-2 text-sm font-semibold text-white/90">Sentiment & insights</h3>
              <p className="mt-2 text-xs text-white/65">
                We run a sentiment pass over ratings / descriptions and present a clean verdict: positive, mixed, or
                negative.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-lg font-semibold tracking-tight text-white">Why this tool exists</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <p className="text-sm leading-7 text-white/65">
              When browsing movies on sites like `https://www.imdb.com/`, you often have to skim ratings, reviews, and
              long plots yourself. This tool compresses that information into a quick, sentiment-driven snapshot while
              still showing the core details (title, poster, cast, runtime, and genres).
            </p>
            <p className="text-sm leading-7 text-white/65">
              It is intentionally lightweight and focused on a single task: paste an IMDb link or ID, understand what
              the movie is about, and quickly sense how audiences reacted. This makes it ideal for quick discovery or
              when you&apos;re deciding what to watch next.
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-lg font-semibold tracking-tight text-white">FAQ</h2>
          <div className="mt-6 space-y-5 text-sm text-white/70">
            <div>
              <p className="font-semibold text-white">Do you scrape data from `https://www.imdb.com/`?</p>
              <p className="mt-1 text-white/65">
                No. We use the official OMDb API, which exposes movie and rating data keyed by IMDb IDs. You can still
                paste IMDb URLs or IDs for convenience, but the data is fetched via OMDb.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Can I use this on mobile?</p>
              <p className="mt-1 text-white/65">
                Yes. The layout is fully responsive: the poster and details stack vertically on small screens and form a
                two-column grid on desktop.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Where does the AI summary run?</p>
              <p className="mt-1 text-white/65">
                By default, the sentiment summary is generated heuristically on the backend. If you configure an
                OpenAI-compatible API key, the server will call the model for richer, human-like summaries.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-6 text-[11px] text-white/45">
          <p>
            Built as a technical assignment demo. Inspired by movie discovery flows on platforms like
            {` `}
            <span className="font-semibold text-white/70">IMDb</span>.
          </p>
        </footer>
      </main>
    </div>
  );
}
