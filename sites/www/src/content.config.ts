import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    repo: z.url().optional(),
    live: z.url().optional(),
    // Drafts show in `astro dev` but are left out of production builds
    draft: z.boolean().default(false),
    // Lower numbers show first
    order: z.number().default(100),
  }),
});

export const collections = { projects };
