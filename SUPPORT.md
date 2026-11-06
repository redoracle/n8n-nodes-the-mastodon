# Support

## Where to get help

- **Installation or node-configuration questions:** open a [GitHub Discussion](https://github.com/redoracle/n8n-nodes-the-mastodon/discussions) if Discussions are enabled, or create a [GitHub issue](https://github.com/redoracle/n8n-nodes-the-mastodon/issues/new/choose) using the appropriate template.
- **Confirmed bugs:** include the package version, n8n version, Node.js version, Mastodon server version, minimal reproducible workflow (redacted), expected/actual result, and whether OAuth2 or token auth was used.
- **Feature requests:** explain the Mastodon API endpoint, use case, and backward-compatibility expectations.
- **Security concerns:** follow [SECURITY.md](SECURITY.md) and report privately; never put an exploit or token in a public issue.
- **Platform support:** the [n8n community-node documentation](https://docs.n8n.io/integrations/community-nodes/) and [Mastodon API documentation](https://docs.joinmastodon.org/api/) are the primary integration references.

## Diagnostics

Confirm the credential instance origin matches the optional node URL, check the OAuth scopes, reproduce with a non-destructive GET operation, then run `pnpm verify` when developing locally. Sanitize workflow exports and logs before attaching them. The maintainer contact declared in `package.json` is `n8n-support@redoracle.com`; no guaranteed response-time SLA is provided.

The repository is community-maintained and not officially endorsed by the n8n or Mastodon teams.
