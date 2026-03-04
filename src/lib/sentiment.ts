import Sentiment from "sentiment";

export type SentimentClassification = "positive" | "mixed" | "negative";

export type AudienceSentiment = {
  classification: SentimentClassification;
  score: number; // -1..+1-ish (average comparative)
  distribution: { positive: number; neutral: number; negative: number };
  aiSummary: string;
  themes: {
    common: string[];
    pros: string[];
    cons: string[];
  };
};

const analyzer = new Sentiment();

const STOPWORDS = new Set(
  [
    "the",
    "and",
    "with",
    "that",
    "this",
    "from",
    "have",
    "about",
    "there",
    "their",
    "they",
    "them",
    "your",
    "you",
    "was",
    "were",
    "are",
    "is",
    "it",
    "its",
    "but",
    "not",
    "for",
    "his",
    "her",
    "she",
    "him",
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "can",
    "could",
    "would",
    "should",
    "very",
    "just",
    "more",
    "most",
    "less",
    "than",
    "then",
    "into",
    "over",
    "after",
    "before",
    "also",
    "has",
    "had",
    "did",
    "does",
    "been",
  ].map((s) => s.toLowerCase()),
);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/g)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function topN(freq: Map<string, number>, n: number) {
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w);
}

export function classifyAudienceSentiment(reviewTexts: string[]): AudienceSentiment {
  const texts = reviewTexts.map((t) => t.trim()).filter(Boolean);
  if (texts.length === 0) {
    return {
      classification: "mixed",
      score: 0,
      distribution: { positive: 0, neutral: 0, negative: 0 },
      aiSummary:
        "Not enough audience reviews were available to summarize sentiment reliably.",
      themes: { common: [], pros: [], cons: [] },
    };
  }

  const results = texts.map((t) => analyzer.analyze(t));
  const comparatives = results.map((r) => r.comparative ?? 0);
  const avg = comparatives.reduce((a, b) => a + b, 0) / comparatives.length;

  const dist = { positive: 0, neutral: 0, negative: 0 };
  for (const c of comparatives) {
    if (c >= 0.2) dist.positive += 1;
    else if (c <= -0.2) dist.negative += 1;
    else dist.neutral += 1;
  }

  const classification: SentimentClassification =
    avg >= 0.35 ? "positive" : avg <= -0.25 ? "negative" : "mixed";

  const commonFreq = new Map<string, number>();
  const posFreq = new Map<string, number>();
  const negFreq = new Map<string, number>();

  results.forEach((r, idx) => {
    const tokens = tokenize(texts[idx] ?? "");
    const isPos = (comparatives[idx] ?? 0) >= 0.2;
    const isNeg = (comparatives[idx] ?? 0) <= -0.2;

    for (const tok of tokens) {
      commonFreq.set(tok, (commonFreq.get(tok) ?? 0) + 1);
      if (isPos) posFreq.set(tok, (posFreq.get(tok) ?? 0) + 1);
      if (isNeg) negFreq.set(tok, (negFreq.get(tok) ?? 0) + 1);
    }
  });

  const common = topN(commonFreq, 8);
  const pros = topN(posFreq, 6);
  const cons = topN(negFreq, 6);

  const toPct = (count: number) =>
    Math.round((count / Math.max(1, texts.length)) * 100);

  const aiSummary =
    classification === "positive"
      ? `Audience sentiment is mostly positive (${toPct(dist.positive)}% positive). Viewers frequently mention ${common.slice(0, 3).join(", ")}.`
      : classification === "negative"
        ? `Audience sentiment leans negative (${toPct(dist.negative)}% negative). Common complaints include ${cons.slice(0, 3).join(", ") || "pacing, story, or execution"}.`
        : `Audience sentiment is mixed (${toPct(dist.positive)}% positive / ${toPct(dist.negative)}% negative). Common themes include ${common.slice(0, 3).join(", ") || "story, performances, and pacing"}.`;

  return {
    classification,
    score: Number(avg.toFixed(3)),
    distribution: dist,
    aiSummary,
    themes: { common, pros, cons },
  };
}

