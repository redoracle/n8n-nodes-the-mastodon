# Mastodon administrator analytics: contract and scopes

Admin analytics are **read-only**, but Mastodon exposes them through POST methods because the request contains a set of metric keys and/or a date range. Do not substitute GET or invent `/:id` endpoints.

| Resource/operation | HTTP method and route | Parameters | Required scope / permission |
| --- | --- | --- | --- |
| Measures: Get Common Measures | `POST /api/v1/admin/measures` | `keys[]`, `start_at`, `end_at` | `admin:read`, View Dashboard |
| Measures: Get Measure by Key | `POST /api/v1/admin/measures` | One selected key, `start_at`, `end_at` | `admin:read`, View Dashboard |
| Dimensions: Get Common Dimensions | `POST /api/v1/admin/dimensions` | Supported non-contextual `keys[]` | `admin:read`, View Dashboard |
| Dimensions: Get Dimension by Key | `POST /api/v1/admin/dimensions` | One selected key | `admin:read`, View Dashboard |
| Retention and Cohorts | `POST /api/v1/admin/retention` | `start_at`, `end_at`, `frequency` | `admin:read`, View Dashboard |
| IP block list and detail | `GET /api/v1/admin/ip_blocks[/:id]` | Pagination for list; ID for detail | `admin:read:ip_blocks`, Manage Blocks |

The old `dimensionId` and `measureId` field **names** are retained for saved workflows, but the values now represent Mastodon dimension and measure **keys**, not nonexistent individual-record IDs. Date ranges are mandatory on measures and retention. Existing workflows that omitted these parameters must be updated to supply them.

The 'Get Common' operations intentionally request only general-purpose keys that do not require additional tag IDs or domain context. Specialized tag/domain analytics require a separate implementation with their own structured parameters.

No live administrator credentials are used by CI. The mock tests verify request contracts; real permission and version compatibility should be checked against disposable Mastodon 4.x instances.

## Authoritative references

- https://docs.joinmastodon.org/methods/admin/measures/
- https://docs.joinmastodon.org/methods/admin/dimensions/
- https://docs.joinmastodon.org/methods/admin/retention/
- https://docs.joinmastodon.org/methods/admin/ip_blocks/
