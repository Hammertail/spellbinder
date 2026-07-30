# AGENTS.md

## Cursor Cloud specific instructions

`spellbinder` is a small, publishable TypeScript **library** (a `fetch` wrapper with Zod
response validation). There is no server, GUI, or long-running process to start — development
is limited to lint, test, and build. Standard scripts live in `package.json` (`lint`, `test`,
`build`); CI is defined in `.github/workflows/main.yml`.

### Use pnpm, not npm (important)

CI (`.github/workflows/main.yml`) uses `pnpm`, and you should too, even though a
`package-lock.json` is checked in. The `test` script globs `./**/*.test.ts`. With a flat npm
`node_modules`, that glob also matches `*.test.ts` files shipped inside dependencies (e.g.
`@changesets/*`), which then fail with `describe is not defined` and produce ~150 spurious
failures. With pnpm, dependency test files live under `node_modules/.pnpm/` (a dot-dir that
`glob` ignores by default), so only the repo's own `tests/*.test.ts` run. Reinstall with
`pnpm install --no-frozen-lockfile` if you ever see dependency test files failing.

### Running things

- Lint / typecheck: `pnpm run lint` (just `tsc --noEmit`).
- Tests: `pnpm run test` (node's built-in test runner via `tsx`). HTTP calls are mocked via
  `tests/helpers/mock-fetch.ts` (no real third-party network requests). Tests use BDD-style
  `describe` / `it` naming.
- Build: `pnpm run build` (`tsup`). pnpm reports esbuild's install script as "ignored", but the
  build still succeeds because `tsup` bundles its own esbuild — you do not need to approve build
  scripts for the build to work.

The library has no `main()`/entrypoint; to exercise it manually, import `Spellbinder` from
`./src` in a throwaway script run with `node --import tsx <file>.ts` (place the script inside the
repo so `zod` resolves from `node_modules`).
