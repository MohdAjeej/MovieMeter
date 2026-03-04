export type OmdbRating = {
  Source: string;
  Value: string;
};

export type OmdbMovie = {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  imdbRating: string;
  Actors?: string;
  Ratings?: OmdbRating[];
  Response: "True" | "False";
  Error?: string;
};

function getOmdbKey() {
  const key = process.env.OMDB_API_KEY;
  if (!key) throw new Error("Missing OMDB_API_KEY environment variable");
  return key;
}

export async function fetchOmdbMovieByImdbId(imdbId: string): Promise<OmdbMovie> {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", getOmdbKey());
  url.searchParams.set("i", imdbId);
  url.searchParams.set("plot", "full");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OMDb ${res.status}. ${text}`.trim());
  }

  const json = (await res.json()) as OmdbMovie;
  if (json.Response !== "True") {
    throw new Error(json.Error || "OMDb could not find that title.");
  }
  return json;
}

export function parseRuntimeMinutes(runtime: string | undefined): number | null {
  if (!runtime) return null;
  const m = runtime.match(/(\d+)/);
  if (!m) return null;
  const num = Number(m[1]);
  return Number.isFinite(num) ? num : null;
}

export function parseGenres(genre: string | undefined): string[] {
  if (!genre) return [];
  return genre
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

export function parseCast(actors: string | undefined) {
  if (!actors) return [];
  return actors
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, idx) => ({
      id: idx + 1,
      name,
      character: "",
      profileUrl: null as string | null,
    }));
}

export function parseImdbRating(imdbRating: string | undefined): number {
  const n = Number(imdbRating);
  if (!Number.isFinite(n)) return 0;
  return n;
}

export function buildPseudoReviewTexts(movie: OmdbMovie): string[] {
  const texts: string[] = [];

  if (movie.Ratings && movie.Ratings.length > 0) {
    for (const r of movie.Ratings) {
      const src = r.Source;
      const val = r.Value;
      texts.push(`${src} rated this movie ${val}, reflecting how audiences and critics responded.`);
    }
  }

  if (movie.Plot) {
    texts.push(
      `Audience reactions are closely tied to this story summary: ${movie.Plot.slice(0, 400)}`,
    );
  }

  return texts;
}

