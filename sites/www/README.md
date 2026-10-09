# badrchoubai.dev

Source code for my personal website — a portfolio and blog focused on cloud and backend engineering.

Built with [Astro](https://astro.build), deployed on [Cloudflare Workers](https://workers.cloudflare.com).

## 🚀 Project Structure

```text
/
├── public/
│   ├── images/               # Static images used in posts and hero sections
│   ├── favicon.ico
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── assets/               # SVG icon assets
│   ├── components/           # Reusable Astro components (Header, Footer, PostCard, …)
│   ├── content/
│   │   ├── blog/             # Blog posts (.mdx) and series (blog/series/**)
│   │   └── copy/             # Standalone copy/text content (e.g. about-me.md)
│   ├── layouts/              # Page layouts (Layout.astro)
│   ├── pages/                # File-based routes
│   │   ├── index.astro       # Home / portfolio page
│   │   └── blog/
│   │       ├── index.astro   # Blog listing with tag filtering
│   │       └── [...slug].astro  # Individual post pages
│   ├── sections/             # Full-width page sections (Hero, …)
│   ├── styles/               # Global CSS (base, colors, typography, document)
│   └── content.config.ts     # Content collection schemas
├── astro.config.mjs
├── wrangler.jsonc            # Cloudflare Workers deployment config
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                  | Action                                                     |
| :----------------------- | :--------------------------------------------------------- |
| `npm install`            | Install dependencies                                       |
| `npm run dev`            | Start local dev server at `localhost:4321`                 |
| `npm run build`          | Build the production site to `./dist/`                     |
| `npm run preview`        | Preview the production build locally                       |
| `npm run lint`           | Format all files with Prettier                             |
| `npm run deploy:preview` | Build and run locally via Wrangler (`wrangler dev`)        |
| `npm run deploy`         | Build and deploy to Cloudflare Workers (`wrangler deploy`) |

## 🛠 Tech Stack

| Area               | Technology                                     |
| :----------------- | :--------------------------------------------- |
| Framework          | [Astro](https://astro.build) 6                 |
| Language           | TypeScript 5                                   |
| Content            | MDX (via `@astrojs/mdx`)                       |
| Fonts              | Inter Variable (via `@fontsource-variable`)    |
| Hosting            | Cloudflare Workers (via `@astrojs/cloudflare`) |
| Image Optimization | Cloudflare Images                              |
| Formatting         | Prettier + prettier-plugin-astro               |

## ✍️ Writing Content

Blog posts live in `src/content/blog/` as `.mdx` files. Each post requires the following frontmatter:

```yaml
---
title: "Post title"
description: "Short description shown in the post card."
published: 2024-10-14
tags: [kubernetes, tutorial]
draft: false # set to true to hide the post from listings
image: /images/cover.jpg # optional cover image
---
```

Series posts (e.g. the Go learning series) go in `src/content/blog/series/<series-name>/`.

## 🔗 Links

- **Website:** [badrchoubai.dev](https://badrchoubai.dev)
- **GitHub:** [github.com/BadrChoubai](https://www.github.com/BadrChoubai)
- **LinkedIn:** [linkedin.com/in/BadrChoubai](https://www.linkedin.com/in/BadrChoubai)
