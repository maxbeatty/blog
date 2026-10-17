import { describe, expect, test, vi } from "vitest";
import worker, { prefersMarkdown } from "../worker/index.js";

const request = (path: string, accept = "text/html", method = "GET") =>
  new Request(`https://maxbeatty.com${path}`, {
    headers: { Accept: accept },
    method,
  });

describe("Markdown negotiation", () => {
  test.each([
    ["text/markdown", true],
    ["text/html", false],
    ["*/*", false],
    ["text/markdown;q=0", false],
    ["text/markdown;q=0.5,text/html", false],
    ["text/html;q=0.5,text/markdown", true],
    ["text/html,text/markdown", true],
  ])("respects Accept preferences: %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  test("serves Markdown at the homepage with discovery and cache headers", async () => {
    const fetch = vi.fn(
      async (req: Request) =>
        new Response(
          new URL(req.url).pathname === "/index.md"
            ? "# Max Beatty"
            : "<h1>Max Beatty</h1>",
          {
            headers: { "Content-Type": "text/html", Vary: "Accept-Encoding" },
          },
        ),
    );
    const response = await worker.fetch(request("/", "text/markdown"), {
      ASSETS: { fetch },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/markdown");
    expect(response.headers.get("Vary")).toContain("Accept-Encoding");
    expect(response.headers.get("Vary")).toContain("Accept");
    expect(response.headers.get("Link")).toContain("/llms.txt");
    expect(await response.text()).toBe("# Max Beatty");
  });

  test("does not validate Markdown against an HTML cache validator", async () => {
    const fetch = vi.fn(async () => new Response("# Max Beatty"));
    const incoming = request("/", "text/markdown");
    incoming.headers.set("If-None-Match", '"html-etag"');
    await worker.fetch(incoming, { ASSETS: { fetch } });
    expect(fetch.mock.calls[0][0].headers.has("If-None-Match")).toBe(false);
    expect(fetch.mock.calls[1][0].headers.get("If-None-Match")).toBe(
      '"html-etag"',
    );
  });

  test("HTML errors also vary by Accept", async () => {
    const response = await worker.fetch(request("/missing"), {
      ASSETS: {
        fetch: async () =>
          new Response("Not found", {
            status: 404,
            headers: { "Content-Type": "text/html" },
          }),
      },
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(await response.text()).toBe("Not found");
  });

  test("preserves HTML, asset responses, and redirects", async () => {
    for (const [path, status, type] of [
      ["/", 200, "text/html"],
      ["/profile.jpeg", 200, "image/jpeg"],
      ["/", 301, "text/html"],
    ] as const) {
      const fetch = vi.fn(
        async () =>
          new Response("original", {
            status,
            headers: { "Content-Type": type },
          }),
      );
      const response = await worker.fetch(request(path), { ASSETS: { fetch } });
      expect(response.status).toBe(status);
      expect(response.headers.get("Content-Type")).toBe(type);
      expect(await response.text()).toBe("original");
      expect(fetch).toHaveBeenCalledTimes(1);
    }
  });

  test.each(["GET", "HEAD"])(
    "keeps Markdown errors as real 404s for %s",
    async (method) => {
      const fetch = vi.fn(
        async () => new Response("not found", { status: 404 }),
      );
      const response = await worker.fetch(
        request("/missing", "text/markdown", method),
        { ASSETS: { fetch } },
      );
      expect(response.status).toBe(404);
      expect(response.headers.get("Content-Type")).toContain("text/markdown");
      expect(response.headers.get("Vary")).toBe("Accept");
      expect(await response.text()).toEqual(
        method === "HEAD"
          ? ""
          : expect.stringContaining("https://maxbeatty.com/llms.txt"),
      );
    },
  );
});
