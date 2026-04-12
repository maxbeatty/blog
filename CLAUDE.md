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

## Setup

Uses [mise](https://mise.jdx.dev) for tool version management. Run `mise install` then `npm install`.

## Architecture

Astro project with standard directory structure:

- `src/pages/` — file-based routing
- `public/` — static assets served as-is
- `astro.config.mjs` — Astro configuration

## CI

GitHub Actions (`.github/workflows/test.yml`) runs on PRs and pushes to main: installs via mise, caches node_modules, runs `npm ci` and `npm run prettier`.

## Code Style

Prettier handles all formatting. No ESLint. Run `npm run prettier:fix` before committing.
