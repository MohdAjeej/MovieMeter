import { describe, expect, it } from "vitest";
import { isValidImdbId, parseImdbId } from "@/lib/imdb";

describe("imdb id", () => {
  it("accepts a valid id", () => {
    expect(isValidImdbId("tt0133093")).toBe(true);
    expect(parseImdbId(" TT0133093 ")).toBe("tt0133093");
  });

  it("accepts a full imdb url", () => {
    const url = "https://www.imdb.com/title/tt0133093/?ref_=fn_al_tt_1";
    expect(isValidImdbId(url)).toBe(true);
    expect(parseImdbId(url)).toBe("tt0133093");
  });

  it("rejects invalid ids", () => {
    expect(isValidImdbId("0133093")).toBe(false);
    expect(isValidImdbId("tt123")).toBe(false);
    // We now accept inputs that contain a valid tt-id substring
    expect(isValidImdbId("tt0133093x")).toBe(true);
  });
});

