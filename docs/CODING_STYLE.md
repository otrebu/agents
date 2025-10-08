# Coding Style

## Functional Programming Patterns

- FP-first, minimal OOP
- Avoid classes entirely.
- Prefer small, focused functions. If >3 params, accept a single options object.
- Favor immutable returns; isolate side effects at the edges.
- Prefer data-first utilities (inputs first, options last; return new values).
- Only exception: custom errors that extend `Error`.
- Prefer pure functions, modules, closures, and plain JavaScript objects.
- Use composition over inheritance. No `this`, no `new`, no prototypes.

## Explicit, descriptive verbose naming

- Names must be intention-revealing and self-documenting.
- Include domain terms and units where relevant (e.g., `timeoutMs`, `priceGBP`).
- Booleans start with is/has/should; functions are verbs; data are nouns.
- Avoid abbreviations unless industry-standard (id, URL, HTML).

## Comments explain WHY, not HOW

- Write comments only for rationale, constraints, trade-offs, invariants, and gotchas.
- Do not narrate implementation steps or restate code.

## Error handling

- Error handling: Prefer explicit error handling with typed errors

## Logging

### Application Type Determines Logging Strategy

**Services/APIs/Web Servers:**
- Use structured logging with data as fields, not string interpolation
- Output machine-parseable format (e.g., JSON) for log aggregation
- Never use basic print/console statements

**CLI Tools:**
- Use human-readable terminal output
- Direct output to stdout (normal) and stderr (errors)
- Use colored/formatted text for better UX

### Universal Logging Principles

- Never log sensitive data (passwords, tokens, PII) - configure redaction
- Use appropriate log levels to reflect system severity:
  - **debug**: Detailed diagnostic info (usually disabled in production)
  - **info**: Normal operations and significant business events
  - **warn**: Unexpected situations that don't prevent operation
  - **error**: Errors affecting functionality but not crashing the app
  - **fatal**: Critical errors requiring immediate shutdown
- Include contextual data (requestId, userId, etc.) for traceability
- Log level reflects **system severity**, not business outcomes (failed login = info/debug, not error)

## Testing

- any tests: prefer to use parameterized tests, think carefully about what input and output look like so that the tests exercise the system and explain the code to the future traveller

## Import aliases (Absolute, Readable, Consistent)

Goal: Make imports readable and stable by using import aliases and absolute paths from the project root or src/.
Scope: Applies only to languages/toolchains that support aliases (e.g., TS/JS, Python, Go). Never rewrite node_modules (third-party) imports.

Examples:
✅ Good (with aliases):
```typescript
import { UserService } from '@/services/UserService'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/dates'
```
❌ Avoid (relative paths):
```typescript
import { UserService } from '../../../services/UserService'
import { Button } from '../../components/ui/Button'
```

IMPORTANT: Path aliases must be configured in multiple tools for your project to work correctly. Each tool needs its own configuration. Be aware and prompt the user to configure the aliases if not configured in tsconfig.json, vite.config.ts, etc.
