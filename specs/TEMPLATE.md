# Feature Name

> **Purpose:** Brief one-line description of what this feature accomplishes
>
> **Type:** [New Feature | Refactor | Enhancement | Bug Fix]

---

## Goal

Clear statement of what success looks like. What problem are we solving?

---

## Requirements

Specific, testable requirements:

1. **Requirement 1**
   - Sub-requirement or detail
   - Another detail

2. **Requirement 2**
   - Detail

3. **Requirement 3**
   - Detail

---

## Acceptance Criteria

How we know the implementation is complete and correct:

- [ ] All existing tests pass
- [ ] New tests added for [specific functionality]
- [ ] Type coverage maintained/improved
- [ ] Documentation updated
- [ ] No breaking changes to public API
- [ ] Performance meets benchmarks (specify)
- [ ] Security review passed (if applicable)

---

## Constraints

Hard limits and non-negotiables:

- **Technical:** Must work in Node.js v18+ and modern browsers
- **Performance:** Response time < 100ms for typical requests
- **Size:** Bundle size increase < 5KB
- **Compatibility:** Backward compatible with v2.x API
- **Dependencies:** Prefer zero additional dependencies
- **Testing:** Minimum 80% code coverage

---

## Non-Functional Requirements

- **Accessibility:** WCAG 2.1 AA compliance
- **Internationalization:** Support for all existing locales
- **Observability:** Add metrics/logging for key operations
- **Error Handling:** Graceful degradation on failures

---

## Out of Scope

Explicitly state what this spec does NOT include:

- ❌ Migration of existing data (separate effort)
- ❌ UI redesign (using current design system)
- ❌ Performance optimization of unrelated code

---

## Technical Approach Guidance (Optional)

If there are specific technical requirements or preferred approaches:

**Preferred patterns:**
- Use functional programming style
- Prefer composition over inheritance
- Follow existing code conventions in `docs/CODING_STYLE.md`

**Specific libraries/tools:**
- Use Zod for schema validation
- Use date-fns for date operations
- Follow TypeScript strict mode

**Architecture constraints:**
- Keep business logic separate from presentation
- Use dependency injection for testability
- Follow repository pattern for data access

---

## Success Metrics

How we measure if this feature achieves its goal:

- **Performance:** API response time improves by 20%
- **UX:** User task completion rate increases by 15%
- **Quality:** Bug reports decrease by 30%
- **Adoption:** 80% of users migrate within 1 month

---

## References

Links to related docs, designs, discussions:

- [Design mockups](https://...)
- [Technical RFC](https://...)
- [Related issue #123](https://...)
- [Prior art / inspiration](https://...)

---

## Notes for Implementers

Any additional context, gotchas, or helpful hints:

- Pay special attention to edge case X
- Reference implementation Y shows good patterns
- Watch out for issue Z that came up in previous attempts

---

## Example Usage (Optional)

Show what the end result looks like in practice:

\`\`\`typescript
// Before
const result = oldApi.doSomething({ verbose: true });

// After
const result = newApi.doSomething({ verbose: true });
\`\`\`

---

## Implementation Checklist

High-level steps for implementation (optional - helps organize work):

1. [ ] Set up infrastructure/scaffolding
2. [ ] Implement core functionality
3. [ ] Add error handling
4. [ ] Write unit tests
5. [ ] Write integration tests
6. [ ] Update documentation
7. [ ] Add logging/metrics
8. [ ] Performance testing
9. [ ] Security review
10. [ ] Update changelog
