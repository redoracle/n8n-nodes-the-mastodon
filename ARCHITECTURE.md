# Architecture and security boundaries

The `nodes/Mastodon/Mastodon.node.ts` entrypoint declares the n8n node and routes operations to resource modules. Each `nodes/Mastodon/<resource>/` directory holds methods, property declarations and supporting types. `credentials/` defines OAuth2 and token credential schemas. `nodes/Mastodon/Mastodon_Methods.ts` implements shared authenticated API requests, a bounded response cache, metrics and the request queue.

```text
n8n input items
  -> Mastodon.node.ts (resource + operation routing)
  -> resource method (validated parameters)
  -> bindHandleApiRequest() (credential + endpoint guards)
  -> RequestQueue (serial requests, rate limits)
  -> n8n HTTP helper (redirects disabled, bearer token)
  -> response parsing / validation / short-lived GET cache
  -> n8n output items or paired error items
```

## Credentials and trust boundaries

- API requests must share their origin (scheme, hostname and port) with the selected credential instance. An optional node URL cannot redirect a token to an unrelated host. In the legacy link-timeline operation, the external link URL is passed as a **query value** while the API request remains on the credential's Mastodon origin. Production deployments should use TLS-enabled Mastodon instances.
- The transport rejects untrusted request-option URI/URL/redirect overrides and does not follow HTTP redirects. Custom headers are merged with credential headers; custom Authorization requests are not cached.
- A cryptographic digest of the access token partitions the shared GET cache without recording the raw token in cache keys. Authenticated HTTP responses may contain personal data and therefore must not be dumped into diagnostics.
- OAuth2 PKCE S256 verifier and challenge are produced from Node.js CSPRNG and SHA-256. OAuth state should be managed by the n8n OAuth2 platform implementation.

## Request semantics

- `RequestQueue` currently serializes outgoing requests **process-wide**; it is bounded to 1,000 queued entries and the queued wait limit is 60 seconds.
- Only successful, non-admin GET requests are cached for up to five minutes. Custom Authorization requests bypass the cache. POST/PUT/PATCH/DELETE requests are not cached.
- A failed queued request settles before any retry delay. **Only GET/HEAD/OPTIONS** can be retried automatically. Network or 5xx timeouts on writes must not be treated as proof that the server did not commit the mutation.
- Mastodon rate-limit headers are optional. Only valid remaining/reset values update queue state; reset accepts ISO-8601 or Unix epoch seconds.
- `continueOnFail` emits an error item with source-item pairing for failed items, instead of discarding later input items. Exceptions in credential initialization and authentication-specific actions are handled separately.

## Deployment safeguards

Development Compose files use loopback-only ports and a pinned n8n 2.46.6 image, and the custom Dockerfile drops root privileges for runtime. Root is used for image construction, not n8n request execution. Docker image build and user checks are automated; operators must protect data volumes, enforce TLS and test new image versions before deployment.

## Residual design backlog

1. Partition queues and rate limits by Mastodon instance/account so unrelated users never block one another.
2. Invalidate affected GET cache keys after mutations and assess whether the five-minute TTL is suitable for private timelines.
3. Replace the central resource switch with a typed operation registry while preserving public n8n operation IDs.
4. Add disposable-instance contract tests for media, OAuth2, status idempotency, admin operations and redirect handling.
5. Audit operation-level n8n item pairing, error propagation and pagination invariants across all resources.

See [AUDIT.md](AUDIT.md) for findings and verification boundaries, [SECURITY.md](SECURITY.md) for responsible disclosure, and [CONTRIBUTING.md](CONTRIBUTING.md) for dependency policy.
