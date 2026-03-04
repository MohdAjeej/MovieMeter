import { TitleScreen } from "@/components/TitleScreen";
import { parseImdbId } from "@/lib/imdb";
import { getMovieInsightByImdbId } from "@/lib/insights";

export default async function TitlePage({
  params,
}: {
  params: Promise<{ imdbId: string }>;
}) {
  const { imdbId: raw } = await params;
  const imdbId = parseImdbId(raw);
  const data = await getMovieInsightByImdbId(imdbId);

  return <TitleScreen insight={data} />;
}

