import { test, expect } from "@playwright/test";

test("home page has expected heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Max Beatty");
});

test("home page lists 20 posts with pagination", async ({ page }) => {
  await page.goto("/");
  const postLinks = page.locator("ul a");
  await expect(postLinks.first()).toBeVisible();
  expect(await postLinks.count()).toBe(20);
  await expect(page.locator(".pagination")).toBeVisible();
  await expect(page.locator('a[href="/2/"]')).toBeVisible();
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

test("footer has navigation links", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.locator('a[href="/about/"]')).toBeVisible();
  await expect(footer.locator('a[href="/categories/"]')).toBeVisible();
  await expect(footer.locator('a[href="/tags/"]')).toBeVisible();
  await expect(footer.locator("select")).toBeVisible();
});
