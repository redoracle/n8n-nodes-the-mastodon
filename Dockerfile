FROM n8nio/n8n:latest AS base

# Use root to install packages during image build
USER root

# Default final stage (no plugin). We keep the runtime and entrypoint logic here.
WORKDIR /home/node

EXPOSE 5678

# Add an entrypoint wrapper that will run at container start (after volumes are mounted).
# The wrapper will ensure the community node package is visible under /home/node/.n8n/node_modules
RUN cat > /usr/local/bin/entrypoint-with-plugin.sh <<'EOS'
#!/bin/sh
# If global package exists, make sure it is visible in /home/node/.n8n/node_modules
mkdir -p /home/node/.n8n
if [ ! -d /home/node/.n8n/node_modules ]; then
	mkdir -p /home/node/.n8n/node_modules
fi
# Prefer per-user installation. If the named volume is empty, copy the prepared plugin from /opt/plugins into it.
if [ -L /home/node/.n8n/node_modules/n8n-nodes-the-mastodon ]; then
	echo "Removing stale symlink at /home/node/.n8n/node_modules/n8n-nodes-the-mastodon" && rm -f /home/node/.n8n/node_modules/n8n-nodes-the-mastodon || true
fi
mkdir -p /home/node/.n8n/node_modules
if [ ! -d /home/node/.n8n/node_modules/n8n-nodes-the-mastodon ]; then
	if [ -d /opt/plugins/node_modules/n8n-nodes-the-mastodon ]; then
		echo "Copying plugin from /opt/plugins into /home/node/.n8n/node_modules..." && cp -a /opt/plugins/node_modules/n8n-nodes-the-mastodon /home/node/.n8n/node_modules/ && chown -R node:node /home/node/.n8n/node_modules/n8n-nodes-the-mastodon || true
	else
		echo "No plugin found in /opt/plugins to copy into volume."
	fi
else
	echo "Per-user package already present in volume: /home/node/.n8n/node_modules/n8n-nodes-the-mastodon"
fi
# Ensure ownership
chown -R node:node /home/node/.n8n || true
# Export NODE_PATH so modules that `require('n8n-workflow')` resolve against global and opt locations
export NODE_PATH="/home/node/.n8n/node_modules:/opt/plugins/node_modules:/usr/local/lib/node_modules:${NODE_PATH:-}"
echo "[entrypoint] NODE_PATH=${NODE_PATH}"
# Log contents of /home/node/.n8n/node_modules for easy debugging
echo "[entrypoint] /home/node/.n8n/node_modules listing:" && ls -la /home/node/.n8n/node_modules || true
# Exec the original entrypoint script (base image provides /docker-entrypoint.sh)
exec /docker-entrypoint.sh "$@"
EOS
RUN chmod +x /usr/local/bin/entrypoint-with-plugin.sh && chown root:root /usr/local/bin/entrypoint-with-plugin.sh

# Use tini to run the wrapper (keeps same startup semantics as base image)
ENTRYPOINT ["tini","--","/usr/local/bin/entrypoint-with-plugin.sh"]

# Default command: let the entrypoint decide if no args passed
CMD []

### Optional plugin build support (only used when you build target=final-plugin)
FROM node:24.12-bookworm-slim AS plugin-builder
ARG PLUGIN_TARBALL
WORKDIR /tmp

# Install minimal packages needed for building and clean apt caches to reduce image size and vulnerabilities.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# If you build with --target final-plugin and pass --build-arg PLUGIN_TARBALL=...,
# the following COPY will include the tarball into the plugin-builder. If you do
# not provide the tarball (normal/default builds), this stage is skipped when
# building the default 'final' target.
COPY ${PLUGIN_TARBALL} /tmp/plugin.tgz

# Install the tarball into /opt/plugins (isolated builder stage)
RUN mkdir -p /opt/plugins && npm install --prefix /opt/plugins /tmp/plugin.tgz --no-audit --no-fund && npm install -g /tmp/plugin.tgz --no-audit --no-fund || true && chown -R root:root /opt/plugins && rm -f /tmp/plugin.tgz

### Final stages
FROM base AS final-plugin

# Copy the prepared /opt/plugins from the plugin-builder into the final image
COPY --from=plugin-builder /opt/plugins /opt/plugins

FROM base AS final

# No plugin: just use base stage as final image

