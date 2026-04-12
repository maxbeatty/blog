import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "Max Beatty",
    description: "Personal blog of Max Beatty",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/${post.id}/`,
    })),
  });
}
