# Research: TypeScript discriminated unions

**Date**: 2025-11-11 08:32:25
**Mode**: quick
**Queries**: 3 queries executed
**Sources**: 8 sources found

---

## Summary

A TypeScript discriminated union is a powerful pattern for creating type-safe and maintainable code when dealing with data that can take on various forms. It works by combining a union of types that all share a common property, the 'discriminant', which has a unique literal value for each type in the union. This allows TypeScript to narrow down the specific type within a control flow statement, enabling exhaustive checks to ensure all cases are handled at compile time. This pattern is widely used for managing state, handling API responses, and defining events, significantly reducing runtime errors and improving code clarity.

---

## Sources

1. **[Discriminated Unions in TypeScript](https://mayallo.com/blog/discriminated-unions-in-typescript/)**
1. **[Discriminated Unions in TypeScript - Convex](https://convex.dev/blog/discriminated-unions-in-typescript)**
1. **[TypeScript Discriminated Unions Explained with Examples](https://www.codespud.com/typescript-discriminated-unions-explained-with-examples/)**
1. **[A deep-dive into TypeScript's discriminated unions](https://dev.to/heymark/a-deep-dive-into-typescripts-discriminated-unions-370k)**
1. **[Leveraging Discriminated Unions in TypeScript for Robust Type Safety](https://fullstory.com/blog/leveraging-discriminated-unions-in-typescript-for-robust-type-safety/)**
1. **[Discriminated Unions - TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)**
1. **[Discriminated Unions in Typescript](https://antman-does-software.com/discriminated-unions-in-typescript)**
1. **[TypeScript discriminated union](https://developerway.com/posts/typescript-discriminated-union)**

---

## Key Findings

- A discriminated union is a type that is composed of several other types, where each of those types has a common property with a unique literal value.
- This common property is called the 'discriminant' or 'tag', and it's often named `kind`, `type`, or `status`.
- TypeScript's type narrowing capabilities can infer the specific type from the union based on the value of the discriminant property within control flow statements like `switch` or `if/else`.
- A key advantage is compile-time exhaustiveness checking, often achieved using the `never` type in a `default` case of a `switch` statement. This ensures that all possible variants of the union are handled, and raises a compile-time error if a case is missed.
- Discriminated unions enhance type safety by ensuring that you can only access properties that are valid for the specific type variant that has been narrowed down.
- Common use cases include state management (like Redux actions), handling API responses (e.g., `loading`, `success`, `error` states), modeling different types of events, and creating type-safe component props in frameworks like React.
- Combining discriminated unions with generics allows for the creation of flexible and reusable data structures where parts of the type can vary, such as a success payload in an API response.

---

## Detailed Quotes

> "A discriminated union is a union type where each member of the union shares a common property (the 'discriminant') that has a different literal type for each variant."
> — [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHRJQAfZD4Aj-09ZjYMHrRsivv3FIJq1oU6qKRrte0zYU6Mi1UHWuOaRd6S4dn5yWe7V3XH-2y63785jgnOYuIDN7vs-S7OJ_ot6E9hAPdaueyUXKj5Hte4DWqpUE0leoqScM0X5j99h9eAjOFW-Gk=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHRJQAfZD4Aj-09ZjYMHrRsivv3FIJq1oU6qKRrte0zYU6Mi1UHWuOaRd6S4dn5yWe7V3XH-2y63785jgnOYuIDN7vs-S7OJ_ot6E9hAPdaueyUXKj5Hte4DWqpUE0leoqScM0X5j99h9eAjOFW-Gk=)

> "The real power of discriminated unions comes when you use them with control flow statements like if/else or switch. TypeScript's type narrowing capabilities will automatically infer the correct type based on the discriminant's value."
> — [https://convex.dev/blog/discriminated-unions-in-typescript](https://convex.dev/blog/discriminated-unions-in-typescript)

> "A crucial aspect of discriminated unions is ensuring that all possible cases are handled. TypeScript's `never` type can be used to enforce this. If a new type is added to the union but not handled in a `switch` statement, TypeScript will issue a compile-time error, preventing potential bugs."
> — [https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHom2geI4rfJGzyIhlzpcADVx5xWdH-JcG-cqm-oaqZ8RIJfpORE3v4dyKe6-XJvsmM1pFfWh44ZBsmcbHOvQkq-wXDzBZVignOxgLX0q3MlbjLD0gLVM9zrX_lr1gkhiESUA2day4WkyDPrlQnFa2if_xMWdQhpBzZB1eeyGafFUdQo7r-mGtVfSMrpRLCx-CgB27__TDS1UY=](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHom2geI4rfJGzyIhlzpcADVx5xWdH-JcG-cqm-oaqZ8RIJfpORE3v4dyKe6-XJvsmM1pFfWh44ZBsmcbHOvQkq-wXDzBZVignOxgLX0q3MlbjLD0gLVM9zrX_lr1gkhiESUA2day4WkyDPrlQnFa2if_xMWdQhpBzZB1eeyGafFUdQo7r-mGtVfSMrpRLCx-CgB27__TDS1UY=)

> "Discriminated unions are excellent for defining actions in state management patterns like Redux, ensuring type safety for different action payloads."
> — [https://antman-does-software.com/discriminated-unions-in-typescript](https://antman-does-software.com/discriminated-unions-in-typescript)

---

## Claude's Analysis

### Key Learnings

- **Pattern**: Discriminated unions = union types + shared discriminant property (often `kind`, `type`, `status`) with unique literal values
- **Core benefit**: Compile-time exhaustiveness checking via `never` type in `default` case prevents missing variants
- **Type narrowing**: TypeScript auto-infers specific type in control flow (`switch`/`if`) based on discriminant value
- **Common use cases**: State machines, API response handling (loading/success/error), Redux actions, event modeling

### Recommendations

- Always use `never` type in `default` case for exhaustiveness checking
- Name discriminant consistently across codebase (`type` or `kind`)
- Combine with generics for flexible, reusable structures (e.g., `Result<T, E>`)
- Prefer discriminated unions over class hierarchies for FP-style codebases

### Next Steps

- Review existing union types in codebase—can they benefit from discriminants?
- Implement discriminated unions for API response handling
- Add exhaustiveness checking to all `switch` statements on union types
- Consider using `ts-pattern` library for pattern matching on complex discriminated unions

