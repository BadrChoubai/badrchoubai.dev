# badrchoubai.dev

My sites and the components they share, as npm workspaces.

```
packages/ui/              shared Header, Footer, styles (@badrchoubai/ui)
sites/www/                badrchoubai.dev
sites/bookshelf/          bookshelf.badrchoubai.dev
sites/monthly-playlists/  playlists.badrchoubai.dev
```

## Develop

```sh
npm install                          # once, from the repo root
npm run dev -w sites/bookshelf       # one site
npm run build                        # every site
```

The site-wide menu lives in `packages/ui/src/links.ts`.

## Deploy

Each site is its own Cloudflare Worker, connected to this repo through
Workers Builds:

| Worker            | Root directory          | Build watch paths                            |
| ----------------- | ----------------------- | -------------------------------------------- |
| www               | sites/www               | `sites/www/*`, `packages/ui/*`               |
| bookshelf         | sites/bookshelf         | `sites/bookshelf/*`, `packages/ui/*`         |
| monthly-playlists | sites/monthly-playlists | `sites/monthly-playlists/*`, `packages/ui/*` |

Build command `npm run build`, deploy command `npx wrangler deploy`.
