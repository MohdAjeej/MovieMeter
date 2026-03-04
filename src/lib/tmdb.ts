const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  order: number;
  profile_path: string | null;
};

export type TmdbReview = {
  id: string;
  author: string;
  content: string;
  url: string;
  created_at: string;
  author_details?: {
    username?: string;
    rating?: number | null;
    avatar_path?: string | null;
  };
};

type TmdbFindResponse = {
  movie_results: { id: number }[];
};

type TmdbCreditsResponse = {
  cast: TmdbCastMember[];
};

type TmdbReviewsResponse = {
  results: TmdbReview[];
  total_results: number;
};

function getTmdbKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("Missing TMDB_API_KEY environment variable");
  return key;
}

async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", getTmdbKey());
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status} for ${path}. ${text}`.trim());
  }
  return (await res.json()) as T;
}

export function tmdbPosterUrl(path: string | null, size: "w342" | "w500" = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function tmdbMovieIdFromImdbId(imdbId: string): Promise<number | null> {
  const data = await tmdbFetch<TmdbFindResponse>(`/find/${encodeURIComponent(imdbId)}`, {
    external_source: "imdb_id",
  });
  return data.movie_results?.[0]?.id ?? null;
}

export async function tmdbGetMovieBundle(tmdbMovieId: number) {
  const [details, credits, reviews] = await Promise.all([
    tmdbFetch<TmdbMovieDetails>(`/movie/${tmdbMovieId}`, {
      language: "en-US",
    }),
    tmdbFetch<TmdbCreditsResponse>(`/movie/${tmdbMovieId}/credits`, {
      language: "en-US",
    }),
    tmdbFetch<TmdbReviewsResponse>(`/movie/${tmdbMovieId}/reviews`, {
      language: "en-US",
      page: 1,
    }),
  ]);

  return {
    details,
    cast: credits.cast ?? [],
    reviews: reviews.results ?? [],
    totalReviews: reviews.total_results ?? (reviews.results?.length ?? 0),
  };
}

