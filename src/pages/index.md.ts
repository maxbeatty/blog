import { getCollection } from "astro:content";
import { introduction } from "../lib/site";

export async function GET() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return new Response(
    `# Max Beatty\n\n${introduction.join("\n\n")}\n\n## Explore\n\n- [About](https://maxbeatty.com/about/)\n- [Articles](https://maxbeatty.com/articles/)\n- [Projects](https://maxbeatty.com/projects/)\n- [Contact](https://maxbeatty.com/contact/)\n- [Privacy](https://maxbeatty.com/privacy/)\n- [Agent guidance](https://maxbeatty.com/llms.txt)\n\n## Latest articles\n\n${posts
      .slice(0, 3)
      .map(
        (post) =>
          `- [${post.data.title}](https://maxbeatty.com/${post.id}/) (${post.data.date.toISOString().slice(0, 10)})`,
      )
      .join("\n")}\n`,
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}
