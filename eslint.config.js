// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// Code-quality rules only: Prettier owns formatting, and eslint-config-prettier
// (last) turns off anything that would fight it.
export default defineConfig(
  globalIgnores(["**/dist/", "**/.astro/", "**/.wrangler/"]),

  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  prettier,
);
