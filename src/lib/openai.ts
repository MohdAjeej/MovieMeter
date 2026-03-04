export type AiSentimentInsight = {
  aiSummary: string;
  classification?: "positive" | "mixed" | "negative";
  keyPoints?: string[];
};

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

export function hasOpenAiConfig() {
  return Boolean(env("OPENAI_API_KEY"));
}

export async function createAiSentimentInsight(args: {
  title: string;
  year?: string;
  reviewSnippets: string[];
  computedClassification: "positive" | "mixed" | "negative";
  computedScore: number;
}): Promise<AiSentimentInsight | null> {
  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) return null;

  const baseUrl = env("OPENAI_BASE_URL") ?? "https://api.openai.com/v1";
  const model = env("OPENAI_MODEL") ?? "gpt-4o-mini";

  const snippets = args.reviewSnippets
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((s, i) => `${i + 1}. ${s.slice(0, 800)}`);

  const body = {
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a movie review analyst. Produce concise audience sentiment insights from the provided review snippets. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: [
          `Movie: ${args.title}${args.year ? ` (${args.year})` : ""}`,
          `Computed sentiment (heuristic): classification=${args.computedClassification}, score=${args.computedScore}`,
          "",
          "Review snippets:",
          ...snippets,
          "",
          "Return JSON with keys:",
          `- aiSummary (string, 2-4 sentences, no spoilers)`,
          `- classification (one of "positive"|"mixed"|"negative")`,
          `- keyPoints (array of 3-6 short bullet strings)`,
        ].join("\n"),
      },
    ],
  };

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;

  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed.aiSummary !== "string") return null;
    return {
      aiSummary: parsed.aiSummary,
      classification: parsed.classification,
      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints.filter((x: any) => typeof x === "string").slice(0, 6)
        : undefined,
    };
  } catch {
    return null;
  }
}

