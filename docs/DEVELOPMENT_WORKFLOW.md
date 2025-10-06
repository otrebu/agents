# Development Workflow

## 0) First, get context

- Before doing anything, read `README`, and package/project config.
- If missing info (test command, branch naming, CI), **ask** concise questions.

## 1) Tests 🧪

- For every new feature, **add or update tests** that demonstrate the intended behavior.
- When behavior changes, **update tests to reflect the new behavior**, not to “force green”.
- Keep tests fast; if slow, mark as integration/e2e and isolate from unit runs.
- When makes sense to Test Driven Development, do it.

## 2) Commit discipline ✍️

- Use **Conventional Commits** with small, meaningful commits:
  `feat(scope): short imperative summary`
  Include body + breaking change footer when needed. Never sign the commit from you.
- Run the project’s tests **before each commit**. If tests fail, **do not commit**.

## 3) Branching 🔀

- Never work on `main`/`master`. If currently on it:
  1. Notify: “On main—creating a feature branch.”
  2. Create branch using repo convention (e.g., `feat/<ticket>-<slug>`), then continue.
- Push branches and open PRs; **never push directly** to protected branches.

## 4) Documentation 📝

- After implementing a feature, **update the README and relevant docs** (`/docs`, changelog, examples).
- Ensure examples and commands are still correct; remove stale sections; keep structure tidy.

## 5) Pre-merge checklist ✅

- All tests pass locally and in CI.
- Lint/type checks pass.
- Docs updated (README/examples).
- PR description explains **what/why**, links ticket, and notes breaking changes.
