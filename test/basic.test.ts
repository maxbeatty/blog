import { expect, test } from "vitest";

test("content posts directory has files", async () => {
  const { readdirSync } = await import("node:fs");
  const files = readdirSync("src/content/posts");
  expect(files.length).toBeGreaterThan(650);
  expect(files[0]).toMatch(/\.md$/);
});
