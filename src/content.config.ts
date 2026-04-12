import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    postFormat: z
      .enum([
        "standard",
        "link",
        "image",
        "quote",
        "video",
        "gallery",
        "audio",
        "aside",
      ])
      .default("standard"),
    draft: z.boolean().default(false),
    featuredImage: z.string().optional(),
  }),
});

export const collections = { posts };
