import type { CollectionEntry } from "astro:content";

// Drafts are visible while writing (`astro dev`) but never ship
export const isPublished = ({ data }: CollectionEntry<"projects">) =>
  import.meta.env.DEV || !data.draft;

export const hasWriteup = ({ body }: CollectionEntry<"projects">) =>
  !!body?.trim();
