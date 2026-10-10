# badrchoubai.dev

My sites and the components they share, as npm workspaces.

```
packages/ui/              shared Header, Footer, styles (@badrchoubai/ui)
sites/www/                badrchoubai.dev
sites/bookshelf/          bookshelf.badrchoubai.dev
sites/pretty-printer/     pretty-printer.badrchoubai.dev
```

## Develop

```sh
npm install                          # once, from the repo root
npm run dev                          # every site, side by side
npm run dev:www                      # just www         → localhost:4321
npm run dev:bookshelf                # just bookshelf   → localhost:4322
npm run dev:pretty-printer           # just pretty-printer → localhost:4323
npm run build                        # every site
```

`packages/ui` has no dev server of its own: the sites import its source
directly, so edits there hot-reload in whichever site is running.

The site-wide menu lives in `packages/ui/src/links.ts`.

## Deploy

Each site is its own Cloudflare Worker, connected to this repo through
Workers Builds:

| Worker         | Root directory       | Build watch paths                         |
| -------------- | -------------------- | ----------------------------------------- |
| www            | sites/www            | `sites/www/*`, `packages/ui/*`            |
| bookshelf      | sites/bookshelf      | `sites/bookshelf/*`, `packages/ui/*`      |
| pretty-printer | sites/pretty-printer | `sites/pretty-printer/*`, `packages/ui/*` |

Build command `npm run build`, deploy command `npx wrangler deploy`.
