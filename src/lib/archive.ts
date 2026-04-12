import { getCollection } from "astro:content";

type ArchiveYear = {
  year: string;
  months: { value: string; label: string }[];
};

let cached: ArchiveYear[] | null = null;

export async function getArchiveYears() {
  if (cached) return cached;

  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const archiveMap = new Map<string, Set<string>>();
  for (const post of posts) {
    const year = String(post.data.date.getFullYear());
    const month = String(post.data.date.getMonth() + 1).padStart(2, "0");
    if (!archiveMap.has(year)) archiveMap.set(year, new Set());
    archiveMap.get(year)!.add(month);
  }

  cached = [...archiveMap.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, months]) => ({
      year,
      months: [...months]
        .sort((a, b) => b.localeCompare(a))
        .map((m) => ({
          value: `/${year}/${m}/`,
          label: new Date(Number(year), Number(m) - 1).toLocaleDateString(
            "en-US",
            { month: "long" },
          ),
        })),
    }));

  return cached;
}
