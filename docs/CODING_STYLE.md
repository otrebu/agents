# Coding Style

## Functional Programming Patterns

- FP-first, minimal OOP
- Avoid classes entirely. Only exception: custom error types when required by the language.
- Prefer small, focused functions. If >3 params, accept a single options object.
- Favor immutable returns; isolate side effects at the edges.
- Prefer data-first utilities (inputs first, options last; return new values).
- Prefer pure functions and plain data structures.
- Use composition over inheritance.

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
- Add a good amount of logs, to the point of being annoying, but not too much that it's overwhelming, so that we can trace the code execution.

## Testing

### Universal Testing Principles

- Update tests when behavior changes, don't force green
- Test names should tell a story
- Tests should serve as documentation
