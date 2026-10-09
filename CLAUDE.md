# CLAUDE.md

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Scope** (optional): the workspace touched — `www`, `bookshelf`, `ui` — or omit it for repo-wide changes
- **Description:** imperative mood, lowercase, no trailing period (e.g. `feat(bookshelf): add count of books in each category`)
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer
- Adding or editing book entries is content, not a feature: use `docs(bookshelf): add <title>`
