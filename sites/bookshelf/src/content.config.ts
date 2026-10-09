import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { genres } from "./genres";

/** WCAG contrast of black text on a #rrggbb background. */
function contrastWithBlack(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05) / 0.05;
}

const books = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      // Catalogue heading the shelf files under, "Surname, Forenames". Only
      // needed where that isn't the first author's last word, e.g. names
      // entered under the forename ("Marcus Aurelius", "Ibn Khaldūn")
      authorSort: z.string().optional(),
      genre: z.enum(genres),
      // Missing artwork is drawn as a plain cover in `color`
      cover: image().optional(),
      // Covers are drawn with black text, so the colour must stay mid-tone:
      // light enough for AA contrast, dark enough not to read as blank paper
      color: z
        .string()
        .regex(/^#[0-9a-f]{6}$/i, "Use a #rrggbb colour")
        .refine((hex) => contrastWithBlack(hex) >= 6, {
          message: "Too dark for black text (needs 6:1); lighten it",
        })
        .refine((hex) => contrastWithBlack(hex) <= 9, {
          message: "Too light; pick a deeper colour from the cover",
        })
        .default("#5b90c1"),
      link: z.url().optional(),
    }),
});

export const collections = { books };
