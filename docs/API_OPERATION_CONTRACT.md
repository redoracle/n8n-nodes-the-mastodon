# Mastodon API operation contracts

The Mastodon n8n action node exposes an API method only when an Operation selector value resolves to a registered handler. Merely having a TypeScript implementation is **not** evidence that it is usable from the node UI.

## Stable operation identifiers and migration aliases

The November 2026 routing fix aligns the visible operations without breaking previously saved workflows.

| Resource | n8n UI value | Handler | Compatible previous value |
| --- | --- | --- | --- |
| Notifications | `get` | `getNotifications` | `getNotifications` |
| Notifications | `dismiss` | `dismissNotification` | `dismissNotification` |
| Notifications | `unreadCount` | `getUnreadCount` | `getUnreadCount` |
| Follow Requests | `authorize` | `acceptRequest` | `acceptRequest` |
| Follow Requests | `reject` | `rejectRequest` | `rejectRequest` |
| Filters | `delete` | `remove` | `remove` |

Implemented account follow/unfollow, relationships, familiar followers, batch account retrieval, and account lookup operations are also visible. Account ID lists accept comma-separated text in the editor and pre-existing string arrays from saved workflows. Previously hidden status boost, favourite, bookmark, search and history operations are exposed.

**Transport corrections:** Dismiss one notification via `POST /api/v1/notifications/:id/dismiss`; Mastodon removed the older `POST /api/v1/notifications/dismiss` in 3.0. Favourites list `limit` is sent as a GET query parameter, not a request body.

## Outstanding API compliance work (separate PRs)

- Filters still use deprecated v1 API endpoints, not modern v2 groups, keywords and statuses.
- Media upload is synchronous v1; migrate to asynchronous v2 with processing-status polling.
- Streaming actions currently issue one HTTP request, **not** persistent event subscriptions. A proper n8n trigger should be designed separately.
- Notifications `Return All` does not paginate through the server's Link header pages.
- Admin dimensions/measures/retention/IP-block calls require separate HTTP method and route corrections.
- Live contract tests against disposable Mastodon instances remain necessary; passing mocked Jest tests does not establish server integration parity.

## Official API references

- [Notifications](https://docs.joinmastodon.org/methods/notifications/)
- [Filters](https://docs.joinmastodon.org/methods/filters/)
- [Media](https://docs.joinmastodon.org/methods/media/)
- [Accounts](https://docs.joinmastodon.org/methods/accounts/)
- [Statuses](https://docs.joinmastodon.org/methods/statuses/)
