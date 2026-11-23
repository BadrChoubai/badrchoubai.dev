// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://pretty-printer.badrchoubai.dev",
  server: { port: 4323 },
  // The page imports fontsource CSS; let Vite bundle it in dev instead of
  // handing the .css files to Node
  vite: { ssr: { noExternal: [/^@fontsource-variable\//] } },
});
