// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://badrchoubai.dev",
  server: { port: 4321 },
  adapter: cloudflare({
    imageService: "compile",
    // Debugger port; each site needs its own so `npm run dev` can start them together
    inspectorPort: 9229,
  }),

  integrations: [sitemap()],
});
