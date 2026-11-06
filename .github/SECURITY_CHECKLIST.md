# Security review checklist

Use this during releases and reviews that touch credentials, transport or dependencies.

- [ ] Endpoint origin, scheme, URL override and redirect handling are reviewed.
- [ ] No authorization tokens, private response bodies or bearer-bearing URLs are recorded in diagnostics.
- [ ] Credential-scoped caches cannot be read across identities and do not cache custom Authorization responses.
- [ ] Network errors do not silently retry potentially committed writes.
- [ ] OAuth scopes are least-privilege; PKCE verifier/challenge use CSPRNG and S256.
- [ ] Rate-limit and retry handling have bounded waits and do not deadlock the request queue.
- [ ] Sensitive examples and workflows contain no real credentials.
- [ ] Package changes have a reviewed dependency graph and reproducible pnpm lockfile.
- [ ] Node.js runtime is actively supported and both CI matrix entries are green.
- [ ] The public README and SECURITY.md describe the actual implemented safeguards.
- [ ] Vulnerability disclosure is private; branch protection and security alerts are enabled by a repository administrator.

This checklist is review guidance, not evidence of an external security certification.
