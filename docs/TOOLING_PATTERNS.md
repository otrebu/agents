# Tooling Patterns

## pnpm

```bash
# Install and manage dependencies
pnpm install                         # Install all dependencies
pnpm add <package>                   # Add package to dependencies
pnpm add -D <package>                # Add to devDependencies
pnpm add -g <package>                # Install globally
pnpm remove <package>                # Remove a package
pnpm update                          # Update all dependencies
pnpm update <package>                # Update specific package

# Running scripts
pnpm <script-name>                   # Run package.json script
pnpm run <script-name>               # Same as above (explicit)
pnpm start                           # Run start script
pnpm test                            # Run test script
pnpm exec <command>                  # Execute shell command

# Run commands across workspaces
pnpm -r <command>                    # Run in all workspace packages (recursive)
pnpm -r --filter <pattern> <command> # Run in filtered packages

# Filtering examples
pnpm --filter "./packages/**" build  # Build all packages
pnpm --filter @myorg/api dev         # Run dev in specific package
pnpm --filter "!@myorg/docs" test    # Exclude specific package

# Add dependencies to workspace packages
pnpm add <package> --filter <workspace>  # Add to specific workspace
pnpm add <package> -w                    # Add to workspace root

# Other useful commands
pnpm list                             # List installed packages
pnpm outdated                         # Check for outdated packages
pnpm why <package>                    # Show why package is installed
pnpm store prune                      # Clean up unused packages
pnpm install --frozen-lockfile        # Install without updating lockfile (CI)
```

## Pnpm Workspaces

Monorepo management tool for pnpm.
Use pnpm workspaces to manage dependencies between packages in the monorepo.
Preferred over lerna/yarn/npm workspaces for speed and developer ergonomics.

TypeScript monorepo with pnpm workspaces

Structure:

```text
├── pnpm-workspace.yaml        # Define workspace packages
├── tsconfig.json              # Root - project references only
├── tsconfig.base.json         # Shared compiler options
├── packages/
│   ├── package-a/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
```

Key files:

- pnpm-workspace.yaml

```yaml
packages:
  - "packages/*"
```

- tsconfig.base.json (strict mode enabled)

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

- tsconfig.json (root)

```json
{
  "files": [],
  "references": [
    { "path": "./packages/package-a" },
    { "path": "./packages/package-b" }
  ]
}
```

- packages/\*/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "references": [{ "path": "../dependency-package" }]
}
```

- packages/\*/package.json

```json
{
  "name": "@monorepo/package-name",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@monorepo/other-package": "workspace:*"
  }
}
```

Commands:

```bash
# Install dependencies
pnpm add <package> --filter @monorepo/target-package
pnpm add -Dw <package>  # Install to workspace root

# Build (uses project references)
tsc --build
pnpm -r build  # All packages

# Type-check
tsc --build --force

# Development
pnpm --filter @monorepo/package-name dev
```

Key points:

- workspace:\* protocol for internal dependencies (auto-converts on publish)
- Project references enforce boundaries and enable incremental builds
- Each package extends tsconfig.base.json for consistent strict mode
- Use tsc --build to respect project references
- Individual packages can override specific strict flags in their local tsconfig if needed

## Node.js

JavaScript runtime for server-side execution.

Prefer using LTS versions. Manage versions with `nvm`.

## Typescript

Typed superset of JavaScript.

tsconfig.json for most projects.
Source: https://www.totaltypescript.com/tsconfig-cheat-sheet

```json
{
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* If transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* AND if you're building for a library: */
    "declaration": true,

    /* AND if you're building for a library in a monorepo: */
    "composite": true,
    "declarationMap": true,

    /* If NOT transpiling with TypeScript: */
    "module": "preserve",
    "noEmit": true,

    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* If your code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}
```

## Vite

Fast build tool for modern web development.

Initialize a new Vite project:
`pnpm create vite . --template react-ts`

## Xstate

State management library for building complex state machines.
Be careful to use v5 and not v4.

## Vitest

Fast unit test framework with native ESM support.

### Testing Guidelines: Parameterized vs Individual Tests

> Note: `test` and `it` are aliases in Vitest - use whichever you prefer. This guide uses `test`.

#### Use Parameterized Tests When:

1. **Testing pure functions with clear input/output mapping**
   - Validation functions (email, phone, etc.)
   - Formatters/parsers
   - Math/calculation functions
2. **Edge cases follow the same pattern**
   - Same assertions, different data
   - Minimal or identical setup/teardown
3. **You want to document expected behavior as data**
   - Test cases serve as specification
   - Easy for non-technical stakeholders to review

Example:

```typescript
test.each([
  { input: "user@example.com", expected: true, case: "valid email" },
  { input: "no-at-sign", expected: false, case: "missing @" },
  { input: "@example.com", expected: false, case: "missing local" },
  { input: "user@", expected: false, case: "missing domain" },
])("email validation: $case", ({ input, expected }) => {
  expect(isValidEmail(input)).toBe(expected);
});
```

#### Use Individual Tests When:

1. **Setup/teardown differs significantly per case**

   - Different mocks needed
   - Different database states
   - Different authentication contexts

2. **Assertions vary in complexity or type**
   - Some cases check structure, others check side effects
   - Error vs success paths need different validation
3. **Business scenarios are distinct**

   - Each test tells a different story
   - Test names are descriptive narratives

4. **Debugging needs clarity**
   - Complex async operations
   - Integration tests with multiple steps
   - When failure context matters more than data patterns

Example:

```typescript
test("should create user and send welcome email", async () => {
  vi.mocked(emailService.send).mockResolvedValue({ id: "msg-123" });

  const user = await createUser({ email: "new@example.com" });

  expect(user.id).toBeDefined();
  expect(emailService.send).toHaveBeenCalledWith({
    to: "new@example.com",
    template: "welcome",
  });
});

test("should rollback user creation if email fails", async () => {
  vi.mocked(emailService.send).mockRejectedValue(new Error("SMTP down"));

  await expect(createUser({ email: "new@example.com" })).rejects.toThrow(
    "SMTP down"
  );

  const users = await db.users.findAll();
  expect(users).toHaveLength(0); // rollback verified
});
```

#### Decision Tree

```
Is this a pure function with clear input → output?
├─ YES → Are edge cases similar in structure?
│  ├─ YES → Use parameterized tests ✓
│  └─ NO  → Use individual tests
└─ NO  → Does each test need different setup/mocks?
   ├─ YES → Use individual tests ✓
   └─ NO  → Use parameterized tests ✓
```

#### Hybrid Approach

Group related scenarios with parameterization, separate distinct scenarios:

```typescript
describe("UserService.updateProfile", () => {
  // Parameterize validation failures
  test.each([
    { field: "email", value: "invalid", error: "Invalid email" },
    { field: "age", value: -5, error: "Age must be positive" },
  ])("rejects invalid $field", async ({ field, value, error }) => {
    await expect(updateProfile({ [field]: value })).rejects.toThrow(error);
  });

  // Separate test for success path with side effects
  test("updates profile and invalidates cache", async () => {
    await updateProfile({ name: "New Name" });

    expect(cache.delete).toHaveBeenCalledWith("user:123");
    expect(auditLog.record).toHaveBeenCalledWith("PROFILE_UPDATED");
  });
});
```

#### Key Principle

**Parameterize for data variance, individualize for behavioral variance.**

## Eslint

Linter for identifying and reporting patterns in JavaScript/TypeScript.
Using the config from: https://www.npmjs.com/package/uba-eslint-config.

eslint.config.js:

```typescript
import { ubaEslintConfig } from "uba-eslint-config";

export default [...ubaEslintConfig];
```

## Prettier

Opinionated code formatter, always use the default settings. So `.prettierrc` should be just {}.
If installed, use the config from: https://www.npmjs.com/package/uba-eslint-config.
Which exports:

```typescript
import { ubaPrettierConfig } from "uba-eslint-config";

export default ubaPrettierConfig;
```

## React

UI library for building component-based interfaces.

Prefer function components with hooks.
Prefer using Xstate for state management alonside with React Context.

## Tailwind

Utility-first CSS framework.

Install Tailwind dependencies:

```bash
pnpm install tailwindcss @tailwindcss/vite
```

Configure Vite - Add the Tailwind plugin to vite.config.ts:

```typescript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Import Tailwind - Add to your main CSS file (e.g., src/style.css):

```css
@import "tailwindcss";
```

Use classes directly in JSX: `className="flex items-center gap-4"`.

## storybook

Tool for building UI components in isolation.

## react hook form

Performant form library with easy validation.

```typescript
import { useForm } from "react-hook-form";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();
```

## zod

TypeScript-first schema validation library.

```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

type User = z.infer<typeof schema>;
```

## tanstack query

Powerful data fetching and state management for async data.

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
```

## tanstack router

Type-safe routing library for React.

```typescript
import { createRouter, createRoute } from "@tanstack/react-router";

const route = createRoute({
  path: "/users/$userId",
  component: UserDetail,
});
```

## boxen

Create boxes in terminal output.

```typescript
import boxen from "boxen";

console.log(boxen("Hello World", { padding: 1, borderStyle: "round" }));
```

## chalk

Terminal string styling.

```typescript
import chalk from "chalk";

console.log(chalk.blue.bold("Success!"));
```

## commander

CLI framework for building command-line tools.
Always use it with @commander-js/extra-typings to get the best type safety with the least effort.

```typescript
import { Command } from "@commander-js/extra-typings";

const program = new Command();
program.option("-d, --debug", "enable debug mode").action((options) => {
  /* ... */
});
```

## ora

Elegant terminal spinners.

```typescript
import ora from "ora";

const spinner = ora("Loading...").start();
// ... async work
spinner.succeed("Done!");
```

## date-fns

Modern date utility library.

```typescript
import { format, addDays } from "date-fns";

format(new Date(), "yyyy-MM-dd");
addDays(new Date(), 7);
```

## dotenv

Load environment variables from `.env` files.

```typescript
import "dotenv/config";

const apiKey = process.env.API_KEY;
```

## semantic-release

Automated versioning and package publishing based on conventional commits.

```bash
# Install semantic-release and plugins
pnpm add -D semantic-release \
  @semantic-release/commit-analyzer \
  @semantic-release/release-notes-generator \
  @semantic-release/npm \
  @semantic-release/changelog \
  @semantic-release/git \
  @semantic-release/github
```

Configuration file: `release.config.js`

```typescript
export default {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "docs", scope: "README", release: "patch" },
          { type: "chore", release: "patch" },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
```

Run in CI:

```bash
pnpm exec semantic-release
```

## husky with commitlint

Git hooks for pre-commit and pre-push.

```bash
# Install husky
pnpm add -D husky

# Initialize husky
pnpm exec husky init

# Add commit-msg hook
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
```

## husky to run tests

```bash
# Add pre-commit hook
echo "pnpm lint && pnpm format && pnpm test" > .husky/pre-commit
```

## package.json scripts

### Naming convention

- Use base script names with colon-suffixed variants for specific actions.
- Use `:fix` for auto-fixing variants and `:check` for no-write verification.
- Keep names lowercase and consistent across packages.

### Basic commands

- **Linting**
  - `lint`: Run ESLint
  - `lint:fix`: Fix linting issues
- **Testing**
  - `test`: Run all tests
- **Building**
  - `build`: Build all packages
- **Formatting**
  - `format`: Format code with Prettier
  - `format:check`: Check formatting without changes
