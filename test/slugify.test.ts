import { expect, test } from "vitest";
import { slugify } from "../src/lib/slugify";

test("lowercases input", () => {
  expect(slugify("Hello World")).toBe("hello-world");
});

test("replaces spaces and special characters with hyphens", () => {
  expect(slugify("node.js & TypeScript!")).toBe("node-js-typescript");
});

test("strips leading and trailing hyphens", () => {
  expect(slugify("--hello--")).toBe("hello");
});

test("collapses multiple non-alphanumeric chars into single hyphen", () => {
  expect(slugify("a   b...c")).toBe("a-b-c");
});

test("returns empty string for emoji-only input", () => {
  expect(slugify("🇪🇸")).toBe("");
});

test("returns empty string for empty input", () => {
  expect(slugify("")).toBe("");
});

test("handles mixed alphanumeric and emoji", () => {
  expect(slugify("🇮🇹 Italy")).toBe("italy");
});
