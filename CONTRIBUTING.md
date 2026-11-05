# Contributing and reproducible verification

Use Node 22 (Node 20 is also supported in CI), Corepack and pnpm 10 as declared in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` runs lint, Jest in-band and the production build. Include regression tests when updating resource methods or shared transport. Do not commit `dist/`, tokens, local environment files or package tarballs.

## Dependencies

Dependabot checks npm and GitHub Actions weekly. Upgrade dependencies in a disposable branch with `pnpm update` for compatible releases; inspect the direct and transitive diff. Regenerate and commit `pnpm-lock.yaml` and `package-lock.json` together if the dependency graph changes. Then run:

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm audit
```

Do not use blanket `--latest` upgrades for n8n, pkce-challenge, pnpm, Jest, ESLint or other major-version changes without integration tests and review. Never mark an upgrade safe merely because a newer version exists.

PRs should report behavioral changes, tests run and any verification limits. The release workflow publishes only from main.
