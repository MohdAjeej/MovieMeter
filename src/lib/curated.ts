import type { PosterCardItem } from "@/components/PosterCard";

// Curated samples for the redesigned UI (no extra API calls).
// These keep the UX rich while preserving the assignment's core "IMDb ID → insights" flow.
export const curated: {
  trending: PosterCardItem[];
  topRated: PosterCardItem[];
  sciFi: PosterCardItem[];
} = {
  trending: [
    {
      imdbId: "tt15398776",
      title: "Oppenheimer",
      year: "2023",
      badge: "Trending",
    },
    {
      imdbId: "tt9362722",
      title: "Spider-Man: Across the Spider-Verse",
      year: "2023",
      badge: "Hot",
    },
    {
      imdbId: "tt6791350",
      title: "Guardians of the Galaxy Vol. 3",
      year: "2023",
      badge: "Popular",
    },
    {
      imdbId: "tt3896198",
      title: "Guardians of the Galaxy Vol. 2",
      year: "2017",
    },
    {
      imdbId: "tt0111161",
      title: "The Shawshank Redemption",
      year: "1994",
      badge: "Classic",
    },
  ],
  topRated: [
    {
      imdbId: "tt0111161",
      title: "The Shawshank Redemption",
      year: "1994",
    },
    {
      imdbId: "tt0068646",
      title: "The Godfather",
      year: "1972",
    },
    {
      imdbId: "tt0468569",
      title: "The Dark Knight",
      year: "2008",
    },
    {
      imdbId: "tt0109830",
      title: "Forrest Gump",
      year: "1994",
    },
    {
      imdbId: "tt0137523",
      title: "Fight Club",
      year: "1999",
    },
  ],
  sciFi: [
    {
      imdbId: "tt0133093",
      title: "The Matrix",
      year: "1999",
      badge: "Mind-bending",
    },
    {
      imdbId: "tt0816692",
      title: "Interstellar",
      year: "2014",
    },
    {
      imdbId: "tt1375666",
      title: "Inception",
      year: "2010",
    },
    {
      imdbId: "tt0088763",
      title: "Back to the Future",
      year: "1985",
    },
    {
      imdbId: "tt0107290",
      title: "Jurassic Park",
      year: "1993",
    },
  ],
};

