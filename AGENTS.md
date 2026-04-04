# Spellbinder — agent and contributor guide

## What this project is

Spellbinder is a TypeScript **library** that wraps the `fetch` API. It helps you call HTTP endpoints and validate response bodies with [Zod](https://zod.dev/). It is published on npm as `spellbinder` (MIT). The public surface is exported from `src/index.ts` (for example `Spellbinder`, URL helpers, and `SpellError`). After a local build, compiled output lives under `dist/`.

This repository is a **package**, not a long-running application: there is no dev server to start.

For end-user installation and usage examples, see [README.md](./README.md).

## Prerequisites

- **Node.js** 18 or newer (recommended: stable `fetch` in Node and the test setup used here)
- **npm**

## Install (contributors)

From the repository root:

```bash
npm install
```

In CI or when you want a clean install from the lockfile:

```bash
npm ci
```

## Build and checks

Compile the library (CommonJS + ESM + type declarations) into `dist/`:

```bash
npm run build
```

Typecheck the project (`tsc` with `noEmit`):

```bash
npm run lint
```

## Test

Run the full test suite (all `**/*.test.ts` files):

```bash
npm test
```

Run a **single** test file (same runner as `npm test`, scoped to one path):

```bash
glob -c "node --import tsx --no-warnings --test" "./tests/get.test.ts"
```

Replace `./tests/get.test.ts` with any file under `tests/` (for example `post.test.ts`, `url.test.ts`).

## Package consumers

To use Spellbinder in another project:

```bash
npm install spellbinder
```

Zod is a **dependency** of this package; consumers typically import both `spellbinder` and `zod` in application code.
