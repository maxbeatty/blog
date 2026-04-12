import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://maxbeatty.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
