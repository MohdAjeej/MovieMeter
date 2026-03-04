import { NextRequest, NextResponse } from "next/server";
import { parseImdbId } from "@/lib/imdb";
import { getMovieInsightByImdbId } from "@/lib/insights";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const imdbIdRaw = url.searchParams.get("imdbId") ?? "";

  let imdbId: string;
  try {
    imdbId = parseImdbId(imdbIdRaw);
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "INVALID_IMDB_ID",
        message: e?.errors?.[0]?.message ?? "Invalid IMDb ID",
      },
      { status: 400 },
    );
  }

  try {
    const insight = await getMovieInsightByImdbId(imdbId);
    return NextResponse.json(insight);
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Unknown error";
    const status = msg.includes("Missing OMDB_API_KEY") ? 500 : 502;
    return NextResponse.json(
      {
        error: "FETCH_FAILED",
        message: msg.includes("Missing OMDB_API_KEY")
          ? "Server is missing OMDB_API_KEY. Add it to your environment variables."
          : msg,
      },
      { status },
    );
  }
}

