# solidlib

Personal SolidJS toolkit shared across my SPAs.

## Installation

```shell
npm install github:SamuelDavis/solidlib
```

Ships TypeScript source under the `solid` export condition, so `vite-plugin-solid` compiles it rather than pre-bundling it.

## Intent

Every export extends native or SolidJS behavior with a minimal, intuitive, clearly typed layer.

- **Enhance, don't reinvent.** Wrappers add semantics to the element they render; they never swap it for another.
- **Convenience without capture.** Recurring patterns fold into one tag, but consumer attributes, handlers, refs, and state pass through untouched.
- **Defaults, not overrides.** Anything the library sets, the consumer can replace.
- **Style hooks via `data-*`**, not classes. Third-party class contracts are matched exactly.
- **PicoCSS-compatible** semantics.

## Conventions

- Guards: `is*` naming, one type predicate, no side effects, exhaustive, preserve the input type.
- Prefer `assert(guard, …)` over `if (!guard(…)) throw`.
- Component props extend `ExtendProps`; never destructure.
- Internal listeners use `on:*`, so they never replace consumer `on*` handlers.
- No `@ts-expect-error`; fix the types.
- No component tests.
