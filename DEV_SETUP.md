# Developer quick-start — testing this n8n community node locally

This repository contains an n8n community node. Below are several recommended ways to test it locally. Each flow includes quick commands, when to use it, pros/cons and troubleshooting tips.

Summary of flows

- Option A — npm link (fastest inner loop, no Docker)
- Option B — Docker + bind-mount custom extensions (recommended day-to-day)
- Option C — Build an image from a tarball (artifact parity, immutable)
- Option D — Manual copy into a local n8n `~/.n8n/custom` (quick, non-Docker)
- Option E — Install the package inside a running n8n container (debug / CI)
- Option F — Watch loop: build + rsync into a mounted folder (fast incremental)

Before you start

- Always run `npm run build` (produces `dist/`) before testing. n8n loads compiled output from `dist/`.
- Confirm `package.json` in the package folder contains an `n8n` section that lists `nodes` and/or `credentials` (this repo's `package.json` already contains it).
- If you need debug logs, set `N8N_LOG_LEVEL=debug`.

Option A — npm link (fastest)

When to use

- Rapid edit → test cycles on your host machine. No Docker required. Works well when developing TypeScript and testing against a local n8n install.

Commands (your preferred flow)

```bash
# 1) Build your node
cd n8n-nodes-the-mastodon
npm i
npm run build
npm link   # publishes the package to your global npm link

# 2) Link it into n8n’s custom dir
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y  # only if it's not already a package
npm link n8n-nodes-the-mastodon

# 3) Run n8n locally
npx n8n start
```

Pros

- Fast. Instant local node testing without containers.

Cons

- Less parity with Dockerized production environments.

Option B — Docker + bind-mount (recommended for parity and speed)

When to use

- You want container parity but a tight edit loop. This mounts a host folder into `/home/node/.n8n/custom` and n8n reads packages from there.

Files

- `docker-compose.bind.yml` (provided in this repo)

Commands

```bash
cd n8n-nodes-the-mastodon
npm install && npm run build
mkdir -p ../_dev/custom
rsync -a --delete ./ ../_dev/custom/n8n-nodes-the-mastodon/
docker compose -f docker-compose.bind.yml up -d
```

Notes

- The important env var is `N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom` which the compose file sets.
- After editing TypeScript, run `npm run build` then rsync to propagate compiled files into the mounted folder.

Option C — Build an image from a tarball (artifact parity)

When to use

- You want to test the exact artifact that you would ship. No bind-mounts; the package is baked into the image.

Files

- `Dockerfile.dev` and `docker-compose.plugin.yml` (provided in this repo). The Dockerfile accepts build-arg `PLUGIN_TARBALL`.

Commands

```bash
cd n8n-nodes-the-mastodon
npm install && npm run build && npm pack
export PLUGIN_TARBALL=$(ls n8n-nodes-the-mastodon-*.tgz | tail -n1)
docker compose -f docker-compose.plugin.yml up --build -d
```

What it does

- The Dockerfile installs the tarball into a temporary project and copies the installed package into `/home/node/.n8n/custom` so n8n will detect it as a custom extension.

Option D — Manual copy into `~/.n8n/custom` (quick, non-Docker)

When to use

- You have an n8n instance already running locally (or the `n8n` CLI) and you want to drop the built package into the custom extensions dir.

Commands

```bash
cd n8n-nodes-the-mastodon
npm install && npm run build
mkdir -p ~/.n8n/custom
rsync -a --delete ./ ~/.n8n/custom/n8n-nodes-the-mastodon/

# Restart n8n if it was running so it rescans the custom dir
npx n8n stop || true
npx n8n start
```

Option E — Install package inside a running n8n container (useful for debugging/CI)

When to use

- You have a running n8n container and want to quickly test installing the packed plugin inside the container without rebuilding the image.

Commands (example)

```bash
# from repo root
npm run build && npm pack
docker cp n8n-nodes-the-mastodon-*.tgz n8n_container:/tmp/plugin.tgz
docker exec -it n8n_container bash -lc "mkdir -p /home/node/.n8n/custom && cd /tmp && npm i ./plugin.tgz --no-audit --no-fund && cp -r node_modules/* /home/node/.n8n/custom/ && chown -R node:node /home/node/.n8n"

# restart n8n process inside container if necessary
docker restart n8n_container
```

Notes

- Container restarts or named-volumes may hide image-layer files; using `/home/node/.n8n/custom` is the most robust.

Option F — Watch loop with rsync (fast incremental)

When to use

- Fast incremental updates without rebuilding or repacking. Use a file-watching tool to run build + rsync on changes.

Example (macOS / Linux)

```bash
# from repo root
npm run build -- --watch &
while inotifywait -e close_write -r src dist package.json; do
  npm run build
  rsync -a --delete ./ ../_dev/custom/n8n-nodes-the-mastodon/
done
```

Tips and verification

- Start n8n with debug logs:

```bash
export N8N_LOG_LEVEL=debug
npx n8n start
```

- Watch startup logs for lines about "Loading custom nodes" or similar. When n8n detects custom nodes, it usually logs the package name and paths.
- Verify the custom folder has a `package.json` and `dist/` with the compiled JS files.
- The `n8n` manifest in `package.json` must reference the compiled JS files under `dist/` (this repo's package.json already does).

Common pitfalls

- Not running `npm run build` before packaging/copying. n8n loads compiled `dist/` not TypeScript sources.
- Using node_modules layout instead of `N8N_CUSTOM_EXTENSIONS`. The n8n team recommends pointing `N8N_CUSTOM_EXTENSIONS` at a folder that contains packages (package.json + dist/) instead of relying on node_module resolution within containers.
- Named volumes hiding image-time files. If you add files during build and then mount a named volume at the same path, the volume contents will hide the image layer contents — prefer copying into `/home/node/.n8n/custom` at container start/build, or use Option B/C.
- Peer dependency resolution errors (e.g., `Cannot find module 'n8n-workflow'`) typically occur if a package is installed in an unexpected module tree. Using `N8N_CUSTOM_EXTENSIONS` avoids many of these problems because n8n reads the package.json + dist directly from disk.

If the node doesn't show up

- Check logs (N8N_LOG_LEVEL=debug) for errors.
- Confirm `package.json` inside the custom folder contains an `n8n` section with `nodes`/`credentials` paths that exist.
- Try Option C (tarball image) — this often reproduces the final runtime environment and surfaces packaging issues.

---

## Recovery procedure — fix crashes after `npm link` (e.g. “isomorphic is not a constructor”)

Symptom

- Starting n8n with a linked plugin in `~/.n8n/custom` crashes early with an error like:

```text
TypeError: require(...).isomorphic is not a constructor
  at evalmachine.<anonymous>:1:1
  at Script.runInContext (node:vm:149:12)
  at loadClassInIsolation (.../n8n-core/src/nodes-loader/load-class-in-isolation.ts:16:17)
```

Why this happens

- If `~/.n8n/custom` contains a `node_modules` tree (for example, after `npm link` or `npm i` inside that folder), the n8n directory loader can traverse `node_modules` and attempt to load transitive dependencies as if they were nodes, causing odd eval errors.
- The recommended layout is `~/.n8n/custom/<your-package>/` with a `package.json` and compiled `dist/`, and no `node_modules` at the custom root.

Quick fix (clean and redeploy compiled artifacts only)

```bash
# 1) Stop n8n if running
npx n8n stop || true

# 2) Clean custom dir: unlink and remove nested node_modules
cd ~/.n8n/custom
npm unlink n8n-nodes-the-mastodon || true
rm -rf node_modules package-lock.json

# 3) Rebuild the plugin locally
cd -  # back to repo root (n8n-nodes-the-mastodon)
npm install --include=dev --no-audit --no-fund
npm run build

# 4) Deploy ONLY compiled artifacts into their own folder under ~/.n8n/custom
mkdir -p ~/.n8n/custom/n8n-nodes-the-mastodon
rsync -a --delete dist/ ~/.n8n/custom/n8n-nodes-the-mastodon/

# 5) Start n8n with custom extensions folder
export N8N_CUSTOM_EXTENSIONS="$HOME/.n8n/custom"
N8N_LOG_LEVEL=debug npx n8n start
```

Notes

- The `dist/` folder includes the compiled JS and a `package.json` the loader can read. Keeping it in a dedicated subfolder avoids `node_modules` in the custom root.
- Alternative: use the Docker flows (Option B/C), which naturally avoid this problem.
- If you prefer `npm pack` + install, install into a temp directory and copy the unpacked package folder (not `node_modules`) into `~/.n8n/custom/`.

---

## Frozen snapshot (verified on 2025-10-12)

The setup below was executed and validated on the host. The plugin was packed, the plugin image built and run, the package was copied into n8n's runtime custom folder inside the container, and a quick require test confirmed the node loads.

Build & pack the plugin artifact

```bash
npm install --include=dev --no-audit --no-fund
npm run build
npm pack
export PLUGIN_TARBALL=$(ls n8n-nodes-the-mastodon-*.tgz | tail -n1)
```

Build and run the plugin image

```bash
docker compose -f docker-compose.dev.plugin.yml up --build -d
```

Copy package into the runtime custom folder (inside the running container)

```bash
# copy package into runtime without preserving root ownership
docker compose -f docker-compose.dev.plugin.yml exec n8n sh -lc "mkdir -p /home/node/.n8n/custom && cd /tmp/plugin/node_modules && tar -cf - n8n-nodes-the-mastodon | tar --no-same-owner -x -C /home/node/.n8n/custom && chown -R node:node /home/node/.n8n/custom/n8n-nodes-the-mastodon"
docker compose -f docker-compose.dev.plugin.yml restart n8n
```

Quick runtime require test (inside container)

```bash
docker compose -f docker-compose.dev.plugin.yml exec n8n node -e "try{require('/home/node/.n8n/custom/n8n-nodes-the-mastodon/dist/nodes/Mastodon/Mastodon.node.js'); console.log('require OK')}catch(e){console.error('require ERR', e && e.stack? e.stack : e)}"
```

Observed outcome: the require test returned "require OK" and n8n started successfully. See `docker compose -f docker-compose.dev.plugin.yml logs n8n` for startup logs.

Notes / next improvements

- Automate: Update `Dockerfile.dev` to unpack the tarball into `/home/node/.n8n/custom` at build time (use a tarpipe to avoid root-owned files) and ensure peer deps are available in the image.
- Iteration: For rapid local development prefer `docker-compose.bind.yml` and rsync the built `dist/` into a host `_dev/custom` folder mounted to `/home/node/.n8n/custom`.

Further automation (optional)

- The `package.json` in this repo includes small scripts:
  - `npm run pack` builds and packs the tarball
  - `npm run dev:bind` to run the bind-mount compose
  - `npm run dev:plugin` to create and run the plugin image (looks for the latest tarball)
