import assert from "node:assert/strict";

const origin = process.argv[2] || "http://127.0.0.1:8787";
for (const [path, accept, status, type, content] of [
  ["/", "text/markdown", 200, "text/markdown", "# Max Beatty"],
  ["/", "text/html", 200, "text/html", "application/ld+json"],
  ["/index.md", "*/*", 200, "text/markdown", "# Max Beatty"],
  ["/llms.txt", "*/*", 200, "text/plain", "## When to use this site"],
  ["/robots.txt", "*/*", 200, "text/plain", "Sitemap:"],
  ["/contact/", "text/html", 200, "text/html", "LinkedIn"],
  ["/profile.jpeg", "*/*", 200, "image/jpeg", null],
  ["/sitemap-index.xml", "*/*", 200, "xml", "<sitemapindex"],
  ["/rss.xml", "*/*", 200, "xml", "<rss"],
  [
    "/__agentic-missing-page",
    "text/markdown",
    404,
    "text/markdown",
    "https://maxbeatty.com/llms.txt",
  ],
  ["/__agentic-missing-page", "text/html", 404, "text/html", "Page not found"],
]) {
  const response = await fetch(new URL(path, origin), {
    headers: { Accept: accept },
  });
  assert.equal(response.status, status, `${path}: status`);
  assert.ok(
    response.headers.get("Content-Type")?.includes(type),
    `${path}: Content-Type`,
  );
  if (path === "/" || path.startsWith("/__agentic")) {
    assert.match(
      response.headers.get("Vary") || "",
      /\bAccept\b/i,
      `${path}: Vary`,
    );
  }
  if (content)
    assert.ok((await response.text()).includes(content), `${path}: body`);
  console.log(`${response.status} ${type} ${path} (Accept: ${accept})`);
}
