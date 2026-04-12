# blog

## Setup

### First Time

1. Install [mise](https://mise.jdx.dev/getting-started.html): `curl https://mise.run | sh`
1. Install tools: `mise install`

### Routinely

1. Install dependencies: `npm install`

## Development

Start the local development server:

```sh
npm run dev
```

## Writing

### Create a new post

```sh
npm run new-post "My Post Title"
```

This creates a Markdown file in `src/content/posts/` with today's date and the
correct frontmatter. The generated URL will be `/YYYY/MM/DD/my-post-title/`.

### Frontmatter reference

```yaml
---
title: "My Post Title" # required
slug: "2026/04/12/my-post-title" # required, determines the URL
date: 2026-04-12 # required
categories: # optional
  - "Personal"
tags: # optional
  - "javascript"
postFormat: standard # optional, one of: standard, link, image, quote, video, gallery, audio, aside
draft: true # optional, hides from index and sitemap
featuredImage: "/media/2026/04/hero.jpg" # optional
---
```

### Adding images

Place images in `public/media/YYYY/MM/` and reference them in Markdown:

```md
![Alt text](/media/2026/04/my-image.jpg)
```

## Test

Run the test suite:

```sh
npm run test
```

Build the site:

```sh
npm run build
```
