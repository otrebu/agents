# AI coding assistant documentation

Follow my documentation, as closely as you can.

Be extremely concise, sacrifice grammar for the sake of concision.

# Documentation

- Coding Style: @docs/CODING_STYLE.md
- Development Workflow: @docs/DEVELOPMENT_WORKFLOW.md

# TypeScript Rules (applies to *.ts and *.tsx files)

- Always declare explicit types for function parameters, return values, and variables
- Use `interface` for object shapes and type definitions (prefer interfaces over type aliases for objects)
- Avoid `any`; use `unknown` when type is truly unknown, then narrow with type guards
- Follow TypeScript best practices: strict mode, no implicit any, proper type inference
