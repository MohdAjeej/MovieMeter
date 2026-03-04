import { classifyAudienceSentiment } from "@/lib/sentiment";
import { createAiSentimentInsight } from "@/lib/openai";
import {
  buildPseudoReviewTexts,
  fetchOmdbMovieByImdbId,
  parseCast,
  parseGenres,
  parseImdbRating,
  parseRuntimeMinutes,
} from "@/lib/omdb";

export type MovieInsight = {
  movie: {
    imdbId: string;
    title: string;
    year?: string;
    rating: number;
    runtimeMinutes: number | null;
    genres: string[];
    overview: string;
    posterUrl: string | null;
    cast: { id: number; name: string; character: string; profileUrl: string | null }[];
  };
  reviews: { total: number; samples: { id: string; author: string; rating: number | null; url: string; createdAt: string; content: string }[] };
  sentiment: {
    classification: "positive" | "mixed" | "negative";
    score: number;
    distribution: { positive: number; neutral: number; negative: number };
    aiSummary: string;
    keyPoints: string[];
    themes?: { common: string[]; pros: string[]; cons: string[] };
  };
  meta: { provider: { movie: string; reviews: string } };
};

export async function getMovieInsightByImdbId(imdbId: string): Promise<MovieInsight> {
  const omdbMovie = await fetchOmdbMovieByImdbId(imdbId);
  const year = (omdbMovie.Year || "").slice(0, 4) || undefined;

  const cast = parseCast(omdbMovie.Actors).slice(0, 12);
  const pseudoReviewTexts = buildPseudoReviewTexts(omdbMovie);

  const reviews = (omdbMovie.Ratings ?? []).map((r, index) => ({
    id: `${omdbMovie.imdbID}-${index}`,
    author: r.Source,
    rating: null as number | null,
    url: `https://www.imdb.com/title/${omdbMovie.imdbID}`,
    createdAt: "",
    content: pseudoReviewTexts[index] ?? `${r.Source} rating: ${r.Value}`,
  }));

  const reviewTexts = pseudoReviewTexts.length > 0 ? pseudoReviewTexts : [omdbMovie.Plot];
  const computed = classifyAudienceSentiment(reviewTexts);

  const ai = await createAiSentimentInsight({
    title: omdbMovie.Title,
    year,
    reviewSnippets: reviewTexts,
    computedClassification: computed.classification,
    computedScore: computed.score,
  });

  const sentiment = {
    ...computed,
    aiSummary: ai?.aiSummary ?? computed.aiSummary,
    classification:
      ai?.classification === "positive" ||
      ai?.classification === "mixed" ||
      ai?.classification === "negative"
        ? ai.classification
        : computed.classification,
    keyPoints: ai?.keyPoints ?? [],
  };

  return {
    movie: {
      imdbId,
      title: omdbMovie.Title,
      year,
      rating: parseImdbRating(omdbMovie.imdbRating),
      runtimeMinutes: parseRuntimeMinutes(omdbMovie.Runtime),
      genres: parseGenres(omdbMovie.Genre),
      overview: omdbMovie.Plot,
      posterUrl: omdbMovie.Poster && omdbMovie.Poster !== "N/A" ? omdbMovie.Poster : null,
      cast,
    },
    reviews: {
      total: reviews.length,
      samples: reviews,
    },
    sentiment,
    meta: {
      provider: {
        movie: "OMDb (by imdbID)",
        reviews: "OMDb aggregated ratings + plot",
      },
    },
  };
}

