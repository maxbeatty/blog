# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal blog built with Astro 6 and TypeScript (strictest mode).

## Commands

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run prettier` — check formatting
- `npm run prettier:fix` — fix formatting
- `npm run test` — run unit tests (vitest)
- `npm run test:e2e` — run e2e tests (playwright, builds first)

## Setup

Uses [mise](https://mise.jdx.dev) for tool version management. Run `mise install` then `npm install`.

## Architecture

Astro 6 blog migrated from WordPress. Statically built and deployed to Cloudflare.

- `src/content.config.ts` — content collection schema (posts)
- `src/content/posts/` — 719 Markdown blog posts with YAML frontmatter
- `src/pages/[...slug].astro` — dynamic catch-all route for posts (uses `getStaticPaths`)
- `src/pages/` — static pages (index, about, contact)
- `src/layouts/` — BaseLayout and PostLayout
- `public/media/` — images and media files organized by year/month
- `astro.config.mjs` — Astro configuration (site, trailingSlash, sitemap)

Posts use a `slug` frontmatter property for URL routing: `/YYYY/MM/DD/post-slug/`

## CI

GitHub Actions (`.github/workflows/test.yml`) runs on PRs and pushes to main: installs via mise, caches node_modules, runs `npm ci` and `npm run prettier`.

## Code Style

Prettier handles all formatting. No ESLint. Run `npm run prettier:fix` before committing.
