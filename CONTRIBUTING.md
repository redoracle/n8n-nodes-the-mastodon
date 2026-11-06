# Contributing

Thank you for improving the Mastodon community node. Changes should preserve existing n8n workflow contracts unless a breaking migration is explicitly proposed.

## Prerequisites

Use a supported Node.js LTS version (22 or 24), Corepack and the exact pnpm version specified by the `packageManager` field. pnpm is the sole supported lockfile manager.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm verify` runs lint, Jest in-band and the production build. Run the applicable tests on the Node.js versions in CI. Do not commit `dist/`, secrets, private workflows, environment files, tarballs or `node_modules/`.

## Change lifecycle

1. Search existing issues and define the expected Mastodon API behavior, permissions and version constraints.
2. Develop in a separate branch; keep behavior/security changes small and reviewable.
3. Add regression tests for bugs, credentials, retry/rate-limit behavior and API response shapes.
4. Run `pnpm install --frozen-lockfile && pnpm verify` and inspect generated package contents if changing packaging.
5. Update the README, `ARCHITECTURE.md`, `SECURITY.md`, `AUDIT.md` and changelog where applicable.
6. Create a PR using the template and list tests, security considerations, migration/rollback details and remaining integration-test limits.

Never attach raw access tokens, private statuses or unredacted workflow exports to a PR.

## Dependency upgrades

Dependabot checks npm (including pnpm) and GitHub Actions weekly. In a dedicated branch, upgrade only **within supported compatibility ranges** after verifying upstream changelogs, peer dependencies, license and security advisories. Use:

```sh
pnpm update
pnpm install --frozen-lockfile
pnpm verify
pnpm audit --prod
```

Inspect and commit **`pnpm-lock.yaml` only** for dependency resolution changes. Do not generate or commit `package-lock.json`. n8n, Jest, ESLint, TypeScript and pnpm major upgrades require separate review and integration testing rather than a blanket `--latest` command. New runtime dependencies need explicit justification, especially for credential-handling code. Treat advisory findings according to reachability and upstream remediation, not just the count of advisories.

## Maintainers

See `.github/CODEOWNERS`, the [code of conduct](CODE_OF_CONDUCT.md), [support guidance](SUPPORT.md), [security policy](SECURITY.md) and [audit report](AUDIT.md). Public issues are not a security-reporting channel.

The release workflow runs after merges to `main`; do not commit directly to `main` to bypass review or pretend that CI passed when it did not.
