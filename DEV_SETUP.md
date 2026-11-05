# Local development and integration testing

This guide describes repeatable development flows for the `n8n-nodes-the-mastodon` community node. Start with the automated checks; use **throwaway Mastodon accounts** and disposable n8n data for integration work. Never run destructive workflows against a production account.

## Prerequisites and versions

- Node.js 22 or 24 LTS and [Corepack](https://nodejs.org/api/corepack.html)
- pnpm 10.33.0, as declared by `packageManager` in `package.json`
- Docker with Compose (only for container-based tests)
- A disposable Mastodon instance or account with minimally required API scopes

The checked-in Docker examples pin n8n **2.46.6**. Change image versions only after reviewing upstream release notes, backing up data and verifying the exact image build. The development Compose files bind n8n to **127.0.0.1:5678** and must not be published to the Internet.

## 1. Build and verify locally

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify             # lint, Jest (in-band), production build
```

Tests are mocked and do not prove live OAuth2, media upload, federation, or administrative correctness. Use a separate n8n/Mastodon test environment for those operations. The canonical dependency lock is `pnpm-lock.yaml`; do not regenerate `package-lock.json`.

The compiled distributable lives in `dist/`. If you change node properties, TypeScript interfaces or credentials, rerun `pnpm build` before using an installed copy.

## 2. Build a local n8n image without the plugin

```bash
docker build --target final -t mastodon-n8n:local .
docker run --rm --name mastodon-n8n-local -p 127.0.0.1:5678:5678 mastodon-n8n:local
```

Open `http://127.0.0.1:5678`. The final image runs as the upstream `node` user, not root. The image does **not** contain the plugin by default. This flow primarily tests the base image and entrypoint.

## 3. Package the plugin and build an image with it

```bash
pnpm build
pnpm pack
# Replace the filename with the tarball produced by pnpm pack:
docker build --target final-plugin \
  --build-arg PLUGIN_TARBALL=n8n-nodes-the-mastodon-0.0.37.tgz \
  -t mastodon-n8n:plugin .
docker run --rm --name mastodon-n8n-plugin -p 127.0.0.1:5678:5678 mastodon-n8n:plugin
```

The `final-plugin` target copies the packaged community-node distribution into a dedicated builder stage before constructing the non-root image. Use `Dockerfile.dev` if you need the alternate `N8N_CUSTOM_EXTENSIONS` setup. Neither target should be assumed production-ready solely because the image built.

For changes to a locally published package version, update the tarball filename in the build command; do not copy stale versions. When using Compose, set `PLUGIN_TARBALL` to the packed file's relative path and follow that Compose file's comments.

## 4. Bind-mounted editing workflow

A fast development alternative avoids rebuilding the image for each TypeScript change.

```bash
pnpm build
mkdir -p _dev/custom/n8n-nodes-the-mastodon
cp package.json _dev/custom/n8n-nodes-the-mastodon/
cp -R dist _dev/custom/n8n-nodes-the-mastodon/
docker compose -f docker-compose.bind.yml up -d
```

The Compose file mounts `./_dev/custom` under `/home/node/.n8n/custom` and configures `N8N_CUSTOM_EXTENSIONS`. Repeat the copy after building and restart the container if node metadata or compiled code changes.

To stop or clean up:

```bash
docker compose -f docker-compose.bind.yml down
# Add -v only when you intentionally want to delete the disposable data volume.
```

## 5. End-to-end manual validation checklist

Use fresh tokens and a test account on a disposable instance.

1. **Connection:** OAuth2 and token credentials connect to their selected instance over HTTPS. Confirm n8n's displayed OAuth redirect URL exactly matches your Mastodon app.
2. **Read paths:** Verify credentials, public/home timeline and list queries succeed and cache-scoping does not mix two test users.
3. **Write paths:** Create and delete a disposable status, and test idempotency/failed-write handling without causing duplicates.
4. **Media and pagination:** Upload a small disposable file and test paginated reads.
5. **Limits and errors:** Verify 429/reset behavior, missing reset headers and `continueOnFail` source-item pairing.
6. **Security:** Ensure off-origin API destinations, request redirects and unauthorized URL overrides fail without forwarding credentials.

Record n8n, Mastodon, Node.js and package versions. Do not upload execution data or logs containing tokens, private status content or personal data.

## Troubleshooting

- **pnpm lockfile mismatch:** Verify your Corepack/pnpm version, regenerate with `pnpm install` only for an intentional dependency update, and review/commit the resulting single lockfile.
- **401/403:** Check the token's scopes, its instance origin and whether the Mastodon app was revoked. Reconnect or rotate credentials as needed.
- **API endpoint redirect error:** Configure the final canonical Mastodon instance URL in credentials; authenticated API redirects are intentionally disabled.
- **Permission denied in `/home/node/.n8n`:** A volume created under an older root-running image may have incompatible ownership. Back up its data and repair ownership offline or recreate an **isolated development** volume; do not blindly change production volume ownership.
- **Changes not appearing:** Run `pnpm build`, copy `dist/` again, then restart the disposable container.

See [README.md](README.md), [SECURITY.md](SECURITY.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [AUDIT.md](AUDIT.md).
