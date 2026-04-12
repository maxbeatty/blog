import { test, expect } from "@playwright/test";

test("home page has expected heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main h1")).toContainText(
    "Software engineering leader",
  );
});

test("home page lists 3 latest articles", async ({ page }) => {
  await page.goto("/");
  const articleCards = page.locator("main article");
  await expect(articleCards.first()).toBeVisible();
  expect(await articleCards.count()).toBe(3);
  await expect(
    page.getByRole("link", { name: "See all articles" }),
  ).toBeVisible();
});

test("post page renders content", async ({ page }) => {
  await page.goto("/2020/07/11/how-to-inspect-safari-on-ios-from-your-mac/");
  await expect(page.locator("main h1")).toHaveText(
    "How to inspect Safari on iOS from your Mac",
  );
  await expect(page.locator("main article")).toBeVisible();
});

test("post page has OG meta tags", async ({ page }) => {
  await page.goto("/2020/07/11/how-to-inspect-safari-on-ios-from-your-mac/");
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute(
    "content",
    "How to inspect Safari on iOS from your Mac",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveAttribute("content", /^2020-07-11/);
});

test("post page has syntax highlighted code blocks", async ({ page }) => {
  await page.goto("/2017/08/17/environment-variables-in-node-js/");
  const codeBlock = page.locator("pre.astro-code");
  await expect(codeBlock.first()).toBeVisible();
});

test("about page renders", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("main h1")).toContainText("Max Beatty");
});

test("404 page renders", async ({ page }) => {
  const response = await page.goto("/nonexistent-page/");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main h1")).toHaveText("404");
  await expect(page.getByRole("link", { name: "Go home" })).toBeVisible();
});

test("articles page lists posts grouped by year", async ({ page }) => {
  await page.goto("/articles/");
  await expect(page.locator("main h1")).toHaveText("Articles");
  await expect(page.locator("main h2").first()).toBeVisible();
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("tag listing page renders", async ({ page }) => {
  await page.goto("/tags/");
  await expect(page.locator("main h1")).toHaveText("Tags");
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("individual tag page lists posts", async ({ page }) => {
  await page.goto("/tags/development/");
  await expect(page.locator("main h1")).toHaveText("development");
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("category listing page renders", async ({ page }) => {
  await page.goto("/categories/");
  await expect(page.locator("main h1")).toHaveText("Categories");
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("individual category page lists posts", async ({ page }) => {
  await page.goto("/categories/personal/");
  await expect(page.locator("main h1")).toHaveText("Personal");
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("year archive page renders with month navigation", async ({ page }) => {
  await page.goto("/2020/");
  await expect(page.locator("main h1")).toHaveText("2020");
  await expect(page.locator('a[href="/2020/07/"]')).toBeVisible();
});

test("month archive page lists posts", async ({ page }) => {
  await page.goto("/2020/07/");
  await expect(page.locator("main h1")).toContainText("July 2020");
  await expect(page.locator("main ul a").first()).toBeVisible();
});

test("RSS feed returns XML", async ({ request }) => {
  const response = await request.get("/rss.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("<rss");
  expect(body).toContain("<title>Max Beatty</title>");
  expect(body).toContain("how-to-inspect-safari-on-ios-from-your-mac");
});

test("footer has navigation links", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.locator('a[href="/about/"]')).toBeVisible();
  await expect(footer.locator('a[href="/articles/"]')).toBeVisible();
  await expect(footer.locator('a[href="/projects/"]')).toBeVisible();
  await expect(footer.locator('a[href="/uses/"]')).toBeVisible();
});
