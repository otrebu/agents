# Development Workflow

## Definition of Done ✓

A feature/change is complete when ALL of these are true:

1. ✅ Tests added/updated and passing
2. ✅ README and relevant docs updated
3. ✅ Committed with conventional commit message
4. ✅ On feature branch (most of the time, not all the time)

**Documentation is mandatory, not optional.** If you skip step 2, the feature is incomplete.

---

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
- Run the project's tests **before each commit**. If tests fail, **do not commit**.
- **Include documentation updates** with the feature (ideal) or in immediate follow-up commit.
  - Example: `feat(commands): add analyze-size command` should include README updates
  - Or: Followed immediately by `docs(readme): document analyze-size command`

## 3) Branching 🔀

- **Check branch strategy first.** If currently on `main`/`master`:
  1. Ask: "Currently on main. Should I stay here or create a feature branch? (I can use `/start-feature <description>` to create one)"
  2. Wait for user decision
  3. If creating branch, use repo convention (e.g., `feat/<ticket>-<slug>`)
- When using feature branches, push and open PRs; **never push directly** to protected branches.
- Some repos allow direct work on main (small projects, personal repos). When in doubt, ask.

## 4) Documentation 📝

**A feature is NOT complete until documentation is updated.**

After implementing ANY feature or making significant changes:

1. **Update the README immediately** - before the next task, before moving on

   - Add new features/commands to appropriate sections
   - Update examples if behavior changed
   - Refresh the "What's Included" section
   - Update repository structure if files were added

2. **Update relevant docs** (`/docs`, changelog, HOW_TO guides)

   - If you created a new pattern, document it
   - If you changed behavior, update affected docs
   - Keep examples accurate and remove stale sections

3. **Include docs in the same commit** or immediately after
   - Ideal: Feature implementation + docs in one commit
   - Acceptable: Docs in immediate follow-up commit
   - Never: Waiting for someone to notice missing docs

**For AI assistants:** Treat documentation as a blocking requirement. After you complete a feature, ask yourself: "What project-level docs need updating?" If the answer is "README" or "any HOW_TO guide", do it immediately, don't wait to be asked.

## 5) Pre-merge checklist ✅

- All tests pass locally and in CI.
- Lint/type checks pass.
- Docs updated (README/examples).
- PR description explains **what/why**, links ticket, and notes breaking changes.
