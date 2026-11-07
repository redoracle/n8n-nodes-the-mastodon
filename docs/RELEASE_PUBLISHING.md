# npm releases and trusted publishing

The [Release workflow](../.github/workflows/release.yml) runs semantic-release on GitHub-hosted Node.js 24 after lint, tests and build. Publishing uses npm **Trusted Publishing (OIDC)**, never a long-lived npm write token. npm requires CLI 11.5.1 or newer for trusted publishing.

## One-time npm configuration

An npm package maintainer must open **npmjs.com → n8n-nodes-the-mastodon → Settings → Trusted Publishers** and authorize the GitHub Actions publisher:

| Setting | Value |
| --- | --- |
| GitHub owner | `redoracle` |
| Repository | `n8n-nodes-the-mastodon` |
| Workflow filename | `release.yml` |
| Environment | Empty (no workflow environment) |

For trusted publishers created after September 3, 2026, select **Allow npm publish** explicitly. The default may authorize only staged publishing. The trusted-publisher record must complete its first successful publish within two days of creation; recreate it if it expires.

This relationship is configured on **npmjs.com**, not in GitHub workflow YAML. The workflow grants `id-token: write`, disables package-manager caching for the release job, and intentionally does not expose `NPM_TOKEN` or `NODE_AUTH_TOKEN`. Keep account two-factor authentication enabled. Once OIDC publishing is working, retire the unused GitHub `NPM_TOKEN` secret.

## 2026-11-06 failed release: `v0.0.40`

[GitHub Actions run #42296132845](https://github.com/redoracle/n8n-nodes-the-mastodon/actions/runs/42296132845) passed install, lint, Jest, and build. npm rejected publishing version `0.0.40` with `EOTP` because the workflow did not provide an OIDC token and the legacy npm token requires a one-time password. During the failed release, semantic-release pushed Git tag `v0.0.40` at commit `439fb14eca735ab80d1c8e1225c378537ec4c1a7`. No matching GitHub Release existed at investigation time. Direct npm registry verification was unavailable from the investigation environment.

**Do not assume the tag means the package was published. Do not delete a legitimate published release tag.** The workflow now checks the newest semver Git tag against npm before calling semantic-release and fails safely instead of creating more orphaned release tags.

### Safe recovery

1. Configure the npm Trusted Publisher described above.
2. Check npm directly: `npm view n8n-nodes-the-mastodon@0.0.40 version --registry=https://registry.npmjs.org/`.
3. If the version exists on npm, **do not remove the tag**. Verify package integrity and decide whether a GitHub Release needs restoring. The next normal release can proceed.
4. If the version is confirmed **absent** from npm and the GitHub Release is also absent, verify the exact remote tag: `git ls-remote --tags origin refs/tags/v0.0.40` should show `439fb14eca735ab80d1c8e1225c378537ec4c1a7`.
5. After explicit maintainer approval, remove **only** that confirmed orphaned tag: `git push origin :refs/tags/v0.0.40`. Do not delete `v0.0.39` or unrelated tags.
6. Merge the OIDC release fix. Run **Actions → Release → Run workflow** from `main` and verify that npm, Git tag, and GitHub Release all have matching versions and that the workflow is green.

The CI job must not disable or bypass npm 2FA, silently suppress publication errors, or delete Git tags automatically.

## References

- [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers/)
- [semantic-release npm OIDC guidance](https://github.com/semantic-release/npm)
- [GitHub Actions with semantic-release](https://github.com/semantic-release/docs/blob/main/src/content/docs/recipes/ci-configurations/github-actions.mdx)
