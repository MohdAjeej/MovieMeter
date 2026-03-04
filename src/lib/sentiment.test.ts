import { describe, expect, it } from "vitest";
import { classifyAudienceSentiment } from "@/lib/sentiment";

describe("audience sentiment", () => {
  it("classifies mostly positive text as positive", () => {
    const s = classifyAudienceSentiment([
      "Absolutely loved it. Stunning visuals and great performances.",
      "A fantastic movie with an excellent story.",
      "Really enjoyable and surprisingly emotional.",
    ]);
    expect(s.classification).toBe("positive");
  });

  it("classifies mostly negative text as negative", () => {
    const s = classifyAudienceSentiment([
      "Boring, messy, and a complete waste of time.",
      "Terrible pacing. I hated the ending.",
      "Painfully bad dialogue and flat characters.",
    ]);
    expect(s.classification).toBe("negative");
  });
});

