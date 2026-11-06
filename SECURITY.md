# Security policy

Security reports are handled privately. **Do not open a public issue or pull request containing an exploit, credential, token, private Mastodon content, or vulnerability reproduction details.**

## Supported versions

Security fixes target the latest published version of `n8n-nodes-the-mastodon` and the current `main` branch. Older versions are not maintained as separate security branches. Keep n8n and Node.js on supported releases.

## Reporting a vulnerability

1. Prefer GitHub's **Report a vulnerability** option in the repository's **Security** tab when private vulnerability reporting is enabled.
2. Otherwise contact the package maintainer at **n8n-support@redoracle.com** (the contact declared in `package.json`). Do not include credentials or personally identifiable data in an initial message.
3. Include the affected version and n8n/Node.js versions, impact and preconditions, safe reproduction instructions, and any proposed mitigation.
4. Give maintainers an opportunity to assess and coordinate a patch and disclosure before posting details publicly.

No formal response-time or disclosure SLA is promised. If a compromised token is suspected, revoke it immediately on the Mastodon instance and rotate related secrets.

## Threat model and operational expectations

The node operates inside n8n with access to user-authorized Mastodon tokens and instance-specific API responses. In-scope risks include credential exfiltration via API destination or redirects, leaking private API responses through process-wide caches and logs, duplicate side effects from retries, and unsafe community workflow imports.

- Use **HTTPS**, except for explicitly trusted local development; verify the instance URL in the credential before connecting.
- A request endpoint must share the origin of its selected Mastodon credential. Redirect following is disabled for authenticated API requests.
- Read responses are partitioned by credential token hash; custom-authorization requests are not cached. Mutating requests are not retried automatically.
- Avoid sharing diagnostic logs with tokens, full API responses, workflow execution data or private user content.
- Never run destructive `examples/*.full.json` workflows on production accounts.
- Restrict administrative credentials to dedicated least-privilege test environments.

This project has no security certification or external penetration-test attestation. See [ARCHITECTURE.md](ARCHITECTURE.md) and [AUDIT.md](AUDIT.md) for implementation details, remaining risks and testing limits.
