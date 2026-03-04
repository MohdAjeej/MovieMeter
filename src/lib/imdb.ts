import { z } from "zod";

export const imdbIdSchema = z
  .string()
  .trim()
  .transform((v) => v.toLowerCase())
  .transform((v) => {
    // Allow full IMDb URLs like https://www.imdb.com/title/tt0133093/
    const match = v.match(/tt\d{7,9}(?!\d)/);
    if (!match) return v;
    // Only treat as valid if it's surrounded by non-word boundaries or URL separators
    const id = match[0];
    return id;
  })
  .refine((v) => /^tt\d{7,9}$/.test(v), {
    message: "Expected an IMDb ID or URL like https://www.imdb.com/title/tt0133093/",
  });

export type ImdbId = z.infer<typeof imdbIdSchema>;

export function parseImdbId(input: unknown): ImdbId {
  return imdbIdSchema.parse(input);
}

export function isValidImdbId(input: unknown): input is ImdbId {
  return imdbIdSchema.safeParse(input).success;
}

