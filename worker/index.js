export function prefersMarkdown(accept = "") {
  const types = accept
    .toLowerCase()
    .split(",")
    .map((entry) => {
      const [type, ...parameters] = entry.trim().split(";");
      const quality = parameters.find((value) => value.trim().startsWith("q="));
      return { type, q: quality ? Number(quality.trim().slice(2)) : 1 };
    });
  const markdown = Math.max(
    0,
    ...types.filter(({ type }) => type === "text/markdown").map(({ q }) => q),
  );
  const html = Math.max(
    0,
    ...types.filter(({ type }) => type === "text/html").map(({ q }) => q),
  );
  return markdown > 0 && markdown >= html;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const markdown = prefersMarkdown(request.headers.get("Accept") || "");
    const assetRequest = new Request(request);
    if (markdown && ["/", "/index.html"].includes(url.pathname)) {
      // Validate the Markdown representation's ETag, rather than the HTML one.
      assetRequest.headers.delete("If-None-Match");
      assetRequest.headers.delete("If-Modified-Since");
    }
    const response = await env.ASSETS.fetch(assetRequest);
    if (!["GET", "HEAD"].includes(request.method)) return response;
    if (markdown && response.status === 404) {
      return new Response(
        request.method === "HEAD"
          ? null
          : "# Page not found\n\nThis page does not exist. Start with the [site guide](https://maxbeatty.com/llms.txt) or [article archive](https://maxbeatty.com/articles/).\n",
        {
          status: 404,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            Vary: "Accept",
          },
        },
      );
    }
    if (response.status === 404) {
      const headers = new Headers(response.headers);
      headers.append("Vary", "Accept");
      return new Response(response.body, { status: 404, headers });
    }
    if (url.pathname !== "/" && url.pathname !== "/index.html") return response;
    const headers = new Headers(response.headers);
    headers.append("Vary", "Accept");
    headers.append(
      "Link",
      '</index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"',
    );
    if (markdown && response.ok) {
      const asset = await env.ASSETS.fetch(
        new Request(new URL("/index.md", url), request),
      );
      const markdownHeaders = new Headers(asset.headers);
      markdownHeaders.set("Content-Type", "text/markdown; charset=utf-8");
      markdownHeaders.set("Vary", headers.get("Vary"));
      markdownHeaders.set("Link", headers.get("Link"));
      return new Response(asset.body, {
        status: asset.status,
        headers: markdownHeaders,
      });
    }
    return new Response(response.body, { status: response.status, headers });
  },
};
