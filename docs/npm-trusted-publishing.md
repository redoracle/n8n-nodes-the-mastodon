# npm Trusted Publishing recovery for Mastodon

The workflow already has `id-token: write`, but GitHub Actions runs on November 7, 2026 failed during the `@semantic-release/npm` OIDC exchange:

```text
404 OIDC token exchange error - package not found
ENONPMTOKEN No npm token specified.
```

Those runs also warned that GitHub Release `v0.0.39` exists but `n8n-nodes-the-mastodon@0.0.39` was missing on npm. The workflow now fails **before** `semantic-release` modifies release tags if npm's package metadata returns 404.

## Recovery checklist

1. On a maintainer workstation, confirm registry state and ownership:
   ```bash
   npm view n8n-nodes-the-mastodon versions --json
   npm view n8n-nodes-the-mastodon@0.0.39 version
   npm owner ls n8n-nodes-the-mastodon
   ```
   A registry 404 is not proof of entitlement to the package name; verify ownership and historical state. If already owned by someone else, seek authorization or npm support rather than trying to claim it.
2. If the package is absent or lacks a version, **bootstrap it interactively with npm 2FA**. Staged publishing is an option for new packages. Inspect source, current Git tags, existing npm versions and the exact `npm pack --dry-run` tarball. Do not blindly publish from a historical tag or overwrite version history. Review/approve any staged publish with 2FA.
3. Configure **npmjs.com → package Settings → Trusted publishing**:
   - Provider: GitHub Actions
   - Owner: `redoracle`
   - Repository: `n8n-nodes-the-mastodon`
   - Workflow filename: `release.yml`
   - Environment: blank (release job defines no environment)
   - **Allow npm publish: enabled** (`@semantic-release/npm` performs direct publish).
4. New trusted publisher configurations must complete one successful publication within 48 hours. Ensure an appropriate release-worthy Conventional Commit is available after the trust is added.
5. Verify GitHub Actions logs, npm registry version, GitHub Release and provenance before revoking any legacy token.

Never treat a successful OIDC context check as successful npm authentication. `npm whoami` is not an OIDC publishing test.

Docs: https://docs.npmjs.com/trusted-publishers/ ; https://docs.npmjs.com/staged-publishing/
