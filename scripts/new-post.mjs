#!/usr/bin/env node

import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ");

if (!title) {
  console.error("Usage: node scripts/new-post.mjs <title>");
  console.error('Example: node scripts/new-post.mjs "My New Post"');
  process.exit(1);
}

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const dateStr = `${year}-${month}-${day}`;

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const filename = `${dateStr}-${slug}.md`;
const filepath = join("src/content/posts", filename);

if (existsSync(filepath)) {
  console.error(`File already exists: ${filepath}`);
  process.exit(1);
}

const content = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${year}/${month}/${day}/${slug}"
date: ${dateStr}
---

`;

writeFileSync(filepath, content, "utf-8");
console.log(`Created ${filepath}`);
console.log(`URL: /${year}/${month}/${day}/${slug}/`);
