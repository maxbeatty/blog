import { expect, test } from "vitest";

test("content posts directory has files", async () => {
  const { readdirSync } = await import("node:fs");
  const files = readdirSync("src/content/posts").filter((file) =>
    file.endsWith(".md"),
  );
  expect(files.length).toBeGreaterThan(650);
  expect(files[0]).toMatch(/\.md$/);
});
