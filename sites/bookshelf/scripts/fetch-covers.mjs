#!/usr/bin/env node
/**
 * Finds cover art for books on Open Library and adds it to their entries.
 *
 * For each book without a `cover`, searches Open Library by title and author,
 * downloads the best match's cover to src/assets/covers/<id>.jpg and adds a
 * `cover:` line to the entry. Every match is graded so a person can review it:
 *
 *   ok       title and author both match
 *   check    found a cover, but the title or author differs; may be wrong
 *   missing  no cover found; nothing is changed
 *
 * It also writes a contact sheet (review.html) showing each cover next to
 * the book it was matched to. Remove the wrong ones with --reject.
 *
 * Usage:
 *   node scripts/fetch-covers.mjs                 fetch covers for every book
 *   node scripts/fetch-covers.mjs --dry-run       search only, change nothing
 *   node scripts/fetch-covers.mjs --only a,b      just these book ids
 *   node scripts/fetch-covers.mjs --limit 10      stop after 10 books
 *   node scripts/fetch-covers.mjs --report <dir>  where review.html goes
 *   node scripts/fetch-covers.mjs --reject a,b    undo: drop these covers
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS = join(SITE, "src/content/books");
const COVERS = join(SITE, "src/assets/covers");
// Path from a book entry to its cover, as written in the frontmatter
const coverRef = (id) => `../../assets/covers/${id}.jpg`;

// Generic client name; Open Library asks scripts to identify themselves
const HEADERS = { "User-Agent": "bookshelf-cover-script/1.0" };
// Open Library asks for no more than about one search a second
const DELAY_MS = 1100;
// Smaller files are placeholders or broken images, not covers
const MIN_COVER_BYTES = 4000;

const { values: args } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    only: { type: "string" },
    limit: { type: "string" },
    report: { type: "string", default: join(tmpdir(), "bookshelf-covers") },
    reject: { type: "string" },
  },
});
const list = (value) => value?.split(",").map((s) => s.trim()) ?? [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lowercase, no diacritics or punctuation: "Endō's" -> "endos". */
const normalise = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** Main title for matching: no subtitle, no leading article. */
const mainTitle = (title) =>
  normalise(title.split(/[:(]/)[0]).replace(/^(a|an|the) /, "");

/** Last name of each author: "Joe Dominguez & Vicki Robin" -> [dominguez, robin]. */
const surnames = (author) =>
  author
    .split(/&|,| and /)
    .map((name) =>
      normalise(name.replace(/\b(jr|sr)\.?$/i, ""))
        .split(" ")
        .pop(),
    )
    .filter(Boolean);

/** The handful of frontmatter fields this script reads, one per line. */
function readFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if (value.startsWith('"')) value = JSON.parse(value);
    else if (value.startsWith("'"))
      value = value.slice(1, -1).replace(/''/g, "'");
    fields[field[1]] = value;
  }
  return fields;
}

/** Adds `cover:` before `color:` (the schema's order), else at the end. */
function addCover(source, id) {
  const line = `cover: ${coverRef(id)}`;
  if (/^color:/m.test(source))
    return source.replace(/^color:/m, `${line}\ncolor:`);
  return source.replace(/^(---\n[\s\S]*?\n)---/, `$1${line}\n---`);
}

async function search(params) {
  const url = new URL("https://openlibrary.org/search.json");
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(key, value);
  url.searchParams.set(
    "fields",
    "key,title,author_name,cover_i,first_publish_year,edition_count",
  );
  url.searchParams.set("limit", "10");
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) throw new Error(`search failed: HTTP ${response.status}`);
  return (await response.json()).docs ?? [];
}

/** Best Open Library match for a book, graded ok/check, or null. */
async function findCover(book) {
  const firstAuthor = book.author.split(/&|,/)[0].trim();
  let docs = await search({ title: book.title, author: firstAuthor });
  if (!docs.some((doc) => doc.cover_i)) {
    // Looser fallback for typos and alternate titles
    await sleep(DELAY_MS);
    docs = await search({ q: `${book.title} ${firstAuthor}` });
  }

  const wantTitle = mainTitle(book.title);
  const wantAuthors = surnames(book.author);
  const graded = docs
    .filter((doc) => doc.cover_i)
    .map((doc) => {
      const titleOk = mainTitle(doc.title ?? "") === wantTitle;
      const theirs = (doc.author_name ?? []).map(normalise).join(" ");
      const authorOk = wantAuthors.some((name) => theirs.includes(name));
      return { doc, score: titleOk * 2 + authorOk, titleOk, authorOk };
    })
    // Best match first; among equals, the most-published work
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.doc.edition_count ?? 0) - (a.doc.edition_count ?? 0),
    );

  const best = graded[0];
  if (!best) return null;
  return {
    status: best.titleOk && best.authorOk ? "ok" : "check",
    coverId: best.doc.cover_i,
    work: `https://openlibrary.org${best.doc.key}`,
    matchedTitle: best.doc.title,
    matchedAuthor: (best.doc.author_name ?? []).join(", "),
    year: best.doc.first_publish_year,
  };
}

async function download(coverId, file) {
  const url = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`;
  const response = await fetch(url, { headers: HEADERS });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !type.startsWith("image/"))
    throw new Error(`cover download failed: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < MIN_COVER_BYTES)
    throw new Error(`cover too small (${bytes.length} bytes)`);
  await writeFile(file, bytes);
}

async function reject(ids) {
  for (const id of ids) {
    const entry = join(BOOKS, `${id}.md`);
    if (!existsSync(entry)) {
      console.error(`${id}: no such book`);
      continue;
    }
    const source = await readFile(entry, "utf8");
    const line = new RegExp(
      `^cover: ${coverRef(id).replace(/\./g, "\\.")}\\n`,
      "m",
    );
    if (line.test(source)) await writeFile(entry, source.replace(line, ""));
    await rm(join(COVERS, `${id}.jpg`), { force: true });
    console.log(`${id}: cover removed`);
  }
}

const escape = (text) =>
  String(text ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

function contactSheet(results) {
  const order = { check: 0, missing: 1, error: 2, ok: 3 };
  const cards = [...results]
    .sort(
      (a, b) => order[a.status] - order[b.status] || a.id.localeCompare(b.id),
    )
    .map((r) => {
      const image =
        r.file && existsSync(r.file)
          ? `<img src="${pathToFileURL(r.file)}" alt="" loading="lazy">`
          : `<div class="none">no cover</div>`;
      const match = r.matchedTitle
        ? `<p class="match">Matched: <a href="${escape(r.work)}">${escape(r.matchedTitle)}</a><br>${escape(r.matchedAuthor)}${r.year ? `, ${r.year}` : ""}</p>`
        : "";
      return `<figure class="${r.status}">${image}<figcaption>
        <span class="badge">${r.status}</span> <code>${escape(r.id)}</code>
        <p><strong>${escape(r.title)}</strong><br>${escape(r.author)}</p>${match}
        ${r.error ? `<p class="match">${escape(r.error)}</p>` : ""}
      </figcaption></figure>`;
    })
    .join("\n");
  const counts = Object.keys(order)
    .map((s) => `${results.filter((r) => r.status === s).length} ${s}`)
    .join(" · ");
  return `<!doctype html><meta charset="utf-8"><title>Cover review</title>
<style>
  body { font: 14px system-ui, sans-serif; margin: 24px; background: #1e1e1e; color: #eee; }
  a { color: #8cf; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
  figure { margin: 0; padding: 10px; border: 2px solid #444; }
  figure.check { border-color: #e0a030; } figure.missing, figure.error { border-color: #c55; }
  img, .none { display: block; width: 100%; aspect-ratio: 2/3; object-fit: cover; background: #333; }
  .none { display: grid; place-items: center; color: #888; }
  .badge { font-weight: 700; text-transform: uppercase; font-size: 11px; }
  .match { color: #aaa; font-size: 12px; }
  p { margin: 6px 0 0; }
</style>
<h1>Cover review</h1>
<p>${counts}. Remove wrong covers with <code>node scripts/fetch-covers.mjs --reject id1,id2</code>.</p>
<main>${cards}</main>`;
}

async function main() {
  if (args.reject) return reject(list(args.reject));

  const only = new Set(list(args.only));
  const limit = args.limit ? Number(args.limit) : Infinity;
  const dryRun = args["dry-run"];

  const allIds = (await readdir(BOOKS))
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3));
  for (const id of only)
    if (!allIds.includes(id)) console.error(`${id}: no such book`);
  const ids = allIds.filter((id) => !only.size || only.has(id)).sort();

  if (!dryRun) await mkdir(COVERS, { recursive: true });
  await mkdir(args.report, { recursive: true });

  const results = [];
  for (const id of ids) {
    if (results.length >= limit) break;
    const entry = join(BOOKS, `${id}.md`);
    const source = await readFile(entry, "utf8");
    const book = readFrontmatter(source);
    if (!book?.title || !book?.author) {
      console.error(`${id}: skipped, no title or author in frontmatter`);
      continue;
    }
    if (book.cover) continue;

    const result = { id, title: book.title, author: book.author };
    try {
      const found = await findCover(book);
      if (!found) {
        result.status = "missing";
      } else {
        Object.assign(result, found);
        if (!dryRun) {
          result.file = join(COVERS, `${id}.jpg`);
          await download(found.coverId, result.file);
          await writeFile(entry, addCover(source, id));
        }
      }
    } catch (error) {
      result.status = "error";
      result.error = error.message;
    }
    results.push(result);
    console.log(
      `${result.status.padEnd(7)} ${id}${result.matchedTitle && result.status !== "ok" ? `  ->  ${result.matchedTitle} (${result.matchedAuthor})` : ""}${result.error ? `  ${result.error}` : ""}`,
    );
    await sleep(DELAY_MS);
  }

  await writeFile(
    join(args.report, "report.json"),
    JSON.stringify(results, null, 2),
  );
  await writeFile(join(args.report, "review.html"), contactSheet(results));

  const tally = (s) => results.filter((r) => r.status === s).length;
  console.log(
    `\n${results.length} books: ${tally("ok")} ok, ${tally("check")} to check, ${tally("missing")} missing, ${tally("error")} errors${dryRun ? " (dry run, nothing changed)" : ""}`,
  );
  console.log(`Review: ${join(args.report, "review.html")}`);
}

await main();
