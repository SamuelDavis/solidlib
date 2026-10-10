# solidlib

SolidJS utilities: types, runtime guards, HTML component wrappers, and helpers.

## Design

Personal project for SolidJS SPAs — common patterns: types, component wrappers, utilities.

## Installation

```shell
npm install github:SamuelDavis/solidlib
# or a specific tag
npm install github:SamuelDavis/solidlib#v1.2.0
```

This package ships TypeScript source: **your bundler compiles it.**
The default `vite-plugin-solid` setup handles this; no extra config needed:

## Architecture

Four modules, all exported from `src/index.tsx`:

**`src/types.ts`** — Generic type helpers

**`src/guards.ts`** — Runtime type guards with TS narrowing.

`is<T>(value: any, ...context: unknown[]): value is T;`

**`src/components.tsx`** — Solid.js components.

`HTML*` convenience wrappers around standard HTML elements.

**`src/utilities.ts`** — Solid.js helpers:

- `persist(signal|store, opts)` — localStorage sync with encode/decode
- `onInput(setter, key, mutator)` — form input event handler factory
