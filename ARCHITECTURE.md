# Architecture and security

The n8n entrypoint in `nodes/Mastodon/Mastodon.node.ts` declares the node and routes operations. Resource directories under `nodes/Mastodon/` define methods, properties, and interfaces. Credentials live in `credentials/`; shared transport, queueing, and caching live in `Mastodon_Methods.ts`.

## Request semantics

- `RequestQueue` serializes outgoing requests process-wide. This is conservative and does not yet partition rate limits by server or account.
- Successful, non-admin GET responses are cached for up to five minutes in a bounded LRU cache. Keys contain a SHA-256 digest of the access token rather than the token itself. Authenticated accounts do not share GET cache entries.
- The retry signal releases the serial queue slot before waiting or re-queueing. Only read-only methods (GET, HEAD, OPTIONS) are automatically retried. Writes are never retried automatically because a timeout or server error does not prove the write was not committed.
- Mutations can leave related cached GET responses stale for the remaining TTL. Only select credentials for the trusted Mastodon instance; do not override the API URL with an untrusted host.

## Design improvement backlog

1. Scope rate-limit state and queues by Mastodon host/account so independent accounts do not block each other.
2. Replace the central switch router with a typed operation registry while preserving the public operation contracts.
3. Implement per-input error items and pairing metadata for `continueOnFail`; the current outer error handler can silently drop failed items.
4. Add disposable-instance API integration tests for media uploads, OAuth2 and administrative actions.

CI runs ESLint, Jest and production TypeScript/icon builds on Node 20 and 22; release uses Node 22. Lockfiles are intentionally not upgraded without compatible dependency resolution and verification.
