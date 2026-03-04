# IMDb Insight (Next.js)

Enter an IMDb movie ID (example: `tt0133093`) to fetch:

- Movie title + poster
- Cast list
- Release year & rating
- Short plot summary
- Audience reviews
- AI-style audience sentiment summary + overall classification (positive / mixed / negative)

## Tech stack rationale

- **Next.js (App Router) + TypeScript**: One codebase for UI + API routes, strong typing, easy Vercel deploy.
- **Tailwind CSS**: Fast iteration on a “premium” responsive UI without over-engineering.
- **TMDB API**: Reliable way to map `imdb_id` → movie details, credits (cast), and reviews.
- **Sentiment (lexicon-based)**: Deterministic baseline sentiment scoring; optionally enhanced with an LLM.

## Setup (local)

### Prerequisites

- Node.js 20+
- A free TMDB API key (create an account on [TMDB](https://www.themoviedb.org/), then generate an API key)

### Install

```bash
cd movie-website
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

- **Required**: `TMDB_API_KEY`
- **Optional** (for richer “AI” summaries): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Testing

Basic unit tests for validation + sentiment scoring:

```bash
npm test
```

## Deployment (Vercel)

1. Push this folder (`movie-website/`) to a GitHub repo
2. Import the repo in Vercel
3. Set environment variables in Vercel project settings:
   - `TMDB_API_KEY` (required)
   - `OPENAI_API_KEY` (optional)
   - `OPENAI_BASE_URL` and `OPENAI_MODEL` (optional)
4. Deploy

## Assumptions / Notes

- Reviews are sourced from **TMDB** (not scraped from IMDb) to keep the solution stable and ToS-friendly.
- If no LLM key is configured, the app still works and produces a deterministic “AI-style” summary from review sentiment + themes.
- Some titles may have limited/no reviews in TMDB; the UI handles this gracefully.

