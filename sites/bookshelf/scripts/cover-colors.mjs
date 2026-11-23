#!/usr/bin/env node
/**
 * Sets each book's `color` (the spine colour on mobile) from its cover art.
 *
 * Picks the cover's most significant colour: the hue with the most saturated
 * pixels, so a red title on a white jacket wins over the white. Covers with
 * almost no colour (black-and-white jackets) get a grey. The colour's
 * lightness is then nudged, keeping its hue, until black text on it passes
 * the contrast range the content schema enforces (6:1 to 9:1).
 *
 * It also writes a contact sheet (review.html) showing each cover next to
 * its old and new spine colour. Undo a bad pick with `git checkout` on that
 * entry, or set its `color:` by hand.
 *
 * Usage:
 *   node scripts/cover-colors.mjs                 recolour every book with a cover
 *   node scripts/cover-colors.mjs --dry-run       pick colours, change nothing
 *   node scripts/cover-colors.mjs --only a,b      just these book ids
 *   node scripts/cover-colors.mjs --report <dir>  where review.html goes
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import sharp from "sharp";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS = join(SITE, "src/content/books");

// Must match the refinements on `color` in src/content.config.ts, with a
// little margin so rounding to #rrggbb never lands outside them
const MIN_CONTRAST = 6.2;
const MAX_CONTRAST = 8.8;

// OKLCH chroma below this reads as grey
const GREY_CHROMA = 0.04;
// A cover needs at least this share of coloured pixels to get a hue
const MIN_COLOURED_SHARE = 0.04;
const HUE_BINS = 24;

const { values: args } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    only: { type: "string" },
    report: { type: "string", default: join(tmpdir(), "bookshelf-colors") },
  },
});
const only = args.only?.split(",").map((s) => s.trim());

/* ---------- colour maths: sRGB <-> OKLab, WCAG contrast ---------- */

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

/** sRGB 0-1 -> OKLab [L, a, b]. */
function rgbToOklab([r, g, b]) {
  [r, g, b] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLab -> linear sRGB (may fall outside 0-1). */
function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

/** OKLCH -> linear sRGB, lowering chroma until it fits the sRGB gamut. */
function oklchToLinear(L, C, h) {
  let lo = 0;
  let hi = C;
  const at = (c) => oklabToLinear([L, c * Math.cos(h), c * Math.sin(h)]);
  if (inGamut(at(C))) return at(C);
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(at(mid))) lo = mid;
    else hi = mid;
  }
  return at(lo).map((c) => Math.min(1, Math.max(0, c)));
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
/** Contrast of black text on a linear-sRGB colour. */
const contrastWithBlack = (linear) => (luminance(linear) + 0.05) / 0.05;

const toHex = (linear) =>
  "#" +
  linear
    .map((c) =>
      Math.round(toGamma(c) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

const hexToLinear = (hex) =>
  [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));

/* ---------- picking a cover's colour ---------- */

/** The cover's most significant colour, as OKLCH [L, C, h]. */
async function significantColour(file) {
  const { data, info } = await sharp(file)
    .resize(60, 90, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  // Per hue bin: total chroma (its weight) and summed OKLab of its pixels
  const bins = Array.from({ length: HUE_BINS }, () => ({
    weight: 0,
    L: 0,
    a: 0,
    b: 0,
  }));
  let greyL = 0;
  let coloured = 0;

  for (let i = 0; i < data.length; i += 3) {
    const [L, a, b] = rgbToOklab(
      [data[i], data[i + 1], data[i + 2]].map((c) => c / 255),
    );
    const C = Math.hypot(a, b);
    greyL += L;
    if (C < GREY_CHROMA) continue;
    coloured++;
    const h = (Math.atan2(b, a) + 2 * Math.PI) % (2 * Math.PI);
    const bin = bins[Math.floor((h / (2 * Math.PI)) * HUE_BINS) % HUE_BINS];
    // Weight by chroma so a vivid accent beats a large dull area
    bin.weight += C;
    bin.L += L * C;
    bin.a += a * C;
    bin.b += b * C;
  }

  if (coloured / pixels < MIN_COLOURED_SHARE) {
    return [greyL / pixels, 0, 0];
  }

  // Merge each bin with its neighbours so a hue split across a boundary
  // isn't undercounted, then take the strongest
  const score = (i) =>
    [-1, 0, 1].reduce(
      (sum, d) => sum + bins[(i + d + HUE_BINS) % HUE_BINS].weight,
      0,
    );
  let best = 0;
  for (let i = 1; i < HUE_BINS; i++) if (score(i) > score(best)) best = i;

  const group = [-1, 0, 1].map((d) => bins[(best + d + HUE_BINS) % HUE_BINS]);
  const w = group.reduce((s, g) => s + g.weight, 0);
  const L = group.reduce((s, g) => s + g.L, 0) / w;
  const a = group.reduce((s, g) => s + g.a, 0) / w;
  const b = group.reduce((s, g) => s + g.b, 0) / w;
  return [L, Math.hypot(a, b), Math.atan2(b, a)];
}

/** Move lightness (same hue) until black text contrast is in range. */
function spineColour([L, C, h]) {
  const at = (l) => oklchToLinear(l, C, h);
  const contrast = contrastWithBlack(at(L));
  if (contrast >= MIN_CONTRAST && contrast <= MAX_CONTRAST) return toHex(at(L));

  // Too dark: lighten up to the minimum. Too light: darken down to the maximum
  const target = contrast < MIN_CONTRAST ? MIN_CONTRAST : MAX_CONTRAST;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (contrastWithBlack(at(mid)) < target) lo = mid;
    else hi = mid;
  }
  return toHex(at(contrast < MIN_CONTRAST ? hi : lo));
}

/* ---------- entries ---------- */

const frontmatter = (text) => text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
const field = (fm, key) =>
  fm
    .match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");

function setColour(text, hex) {
  const line = `color: "${hex}"`;
  const fm = frontmatter(text);
  const updated = /^color:/m.test(fm)
    ? fm.replace(/^color:.*$/m, line)
    : `${fm}\n${line}`;
  return text.replace(fm, updated);
}

const escape = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

function contactSheet(results) {
  const swatch = (hex, label) =>
    `<div class="spine" style="background:${hex}"><span>${label}</span><code>${hex ?? "none"}</code></div>`;
  const cards = results
    .map(
      (
        r,
      ) => `<figure><img src="${pathToFileURL(r.cover)}" alt="" loading="lazy">
      <figcaption><code>${escape(r.id)}</code><p><strong>${escape(r.title)}</strong></p>
      ${swatch(r.old, "old")}${swatch(r.new, "new")}</figcaption></figure>`,
    )
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>Spine colour review</title>
<style>
  body { font: 14px system-ui, sans-serif; margin: 24px; background: #1e1e1e; color: #eee; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
  figure { margin: 0; padding: 10px; border: 2px solid #444; }
  img { display: block; width: 100%; aspect-ratio: 2/3; object-fit: cover; background: #333; }
  p { margin: 6px 0; }
  .spine { display: flex; justify-content: space-between; margin-top: 6px; padding: 6px 10px; color: #000; font-weight: 700; }
</style>
<h1>Spine colour review</h1>
<p>${results.filter((r) => r.old !== r.new).length} of ${results.length} changed.</p>
<main>${cards}</main>`;
}

async function main() {
  const files = (await readdir(BOOKS)).filter((f) => f.endsWith(".md"));
  const results = [];

  for (const file of files.sort()) {
    const id = file.replace(/\.md$/, "");
    if (only && !only.includes(id)) continue;
    const path = join(BOOKS, file);
    const text = await readFile(path, "utf8");
    const fm = frontmatter(text);
    const coverRef = field(fm, "cover");
    if (!coverRef) {
      console.log(`skip     ${id} (no cover)`);
      continue;
    }

    const cover = resolve(BOOKS, coverRef);
    const old = field(fm, "color");
    const hex = spineColour(await significantColour(cover));
    // Sanity check against the schema's own bounds
    const contrast = contrastWithBlack(hexToLinear(hex));
    if (contrast < 6 || contrast > 9) {
      throw new Error(`${id}: ${hex} has contrast ${contrast.toFixed(2)}`);
    }

    results.push({ id, title: field(fm, "title"), cover, old, new: hex });
    console.log(
      `${old === hex ? "same   " : "changed"}  ${id}  ${old ?? "none"} -> ${hex}`,
    );
    if (!args["dry-run"] && old !== hex) {
      await writeFile(path, setColour(text, hex));
    }
  }

  await mkdir(args.report, { recursive: true });
  await writeFile(join(args.report, "review.html"), contactSheet(results));
  console.log(
    `\n${results.length} books, ${results.filter((r) => r.old !== r.new).length} changed${args["dry-run"] ? " (dry run, nothing changed)" : ""}`,
  );
  console.log(`Review: ${join(args.report, "review.html")}`);
}

await main();
