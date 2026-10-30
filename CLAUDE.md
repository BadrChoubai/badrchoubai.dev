# CLAUDE.md

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Scope** (optional): the workspace touched — `www`, `bookshelf`, `pretty-printer`, `ui` — or omit it for repo-wide changes
- **Description:** imperative mood, lowercase, no trailing period (e.g. `feat(bookshelf): add count of books in each category`)
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer
- Adding or editing book entries is content, not a feature: use `docs(bookshelf): add <title>`

## Bookshelf notes

A book's notes are the Markdown body of its entry in `sites/bookshelf/src/content/books/`; any entry with a body gets a page at `/books/<id>/`. Don't put other `.md` files in that folder: every one is loaded as a book.

Notes follow one structure, so fix the Markdown rather than masking problems in CSS:

- **No title or byline:** the page already shows them, so the body starts with the notes (an optional short summary may come before the first heading)
- **Headings carry the structure:** `##` for a chapter or part in book order, `###` for a section, `####` for a subsection; never skip a level
- **Plain headings:** no bold or italics inside them, no trailing `.` or `:` (abbreviations like "Co." stay)
- **Chapter headings:** `Chapter One: The Basics`; numbered sections as `1.1 What is Systems Engineering?`
- **No `---` dividers:** headings separate sections, and the page draws a rule above each chapter
- **Callouts** are blockquotes; **comparison data** is a Markdown table
- **Images** live in `sites/bookshelf/src/assets/notes/<id>/` and are linked relatively
- **Leave out personal sections** (health, family, self-assessment); the site is public
- **Formatting only:** when restructuring imported notes, don't change the wording
