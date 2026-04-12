import { test, expect } from "@playwright/test";

test("home page has expected heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Max Beatty");
});

test("home page lists posts", async ({ page }) => {
  await page.goto("/");
  const postLinks = page.locator("ul a");
  await expect(postLinks.first()).toBeVisible();
  expect(await postLinks.count()).toBeGreaterThan(100);
});

test("post page renders content", async ({ page }) => {
  await page.goto("/2020/07/11/how-to-inspect-safari-on-ios-from-your-mac/");
  await expect(page.locator("h1")).toHaveText(
    "How to inspect Safari on iOS from your Mac",
  );
  await expect(page.locator("article")).toBeVisible();
});

test("about page renders", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("h1")).toHaveText("About");
});

test("contact page renders", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("h1")).toHaveText("Contact");
});
