# n8n Community Node: Mastodon

[![npm version](https://img.shields.io/npm/v/n8n-nodes-the-mastodon.svg)](https://www.npmjs.com/package/n8n-nodes-the-mastodon)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-the-mastodon.svg)](https://www.npmjs.com/package/n8n-nodes-the-mastodon)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

A community maintained n8n node pack for interacting with the Mastodon API. This package provides full CRUD operations across Mastodon resources, including statuses, accounts, timelines, media, polls, bookmarks, lists, and more—all seamlessly integrated into your n8n workflows.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration & Credentials](#configuration--credentials)
- [Usage Examples](#usage-examples)
  - [Post a Status](#post-a-status)
  - [Fetch Public Timeline](#fetch-public-timeline)
  - [Manage Lists](#manage-lists)
- [Available Resources & Operations](#available-resources--operations)
- [Testing](#testing)
- [Development & Contributing](#development--contributing)
- [License](#license)
- [References](#references)

---

## Features

- **Statuses**: Create, delete, edit, search, favourite, boost (reblog), bookmark, and manage scheduled statuses.
- **Accounts**: Follow, unfollow, block, mute, view profile, and manage relationships.
- **Timelines**: Retrieve public, home, hashtag, list, and link timelines with advanced query options.
- **Media**: Upload and manage media attachments.
- **Polls**: Fetch poll data and cast votes.
- **Bookmarks**: Add and remove bookmarks from statuses.
- **Lists**: Create, update, delete lists and manage list membership.
- **Notifications**: Fetch and dismiss notifications.
- **Administration**: Admin level endpoints for reports, retention metrics, cohorts, and more.
- **Customizable**: Leverage query parameters and additional fields for fine grained control.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/) v6 or higher
- An [n8n](https://n8n.io/) instance (self-hosted)

---

## Installation

```bash
# From your n8n project root:
npm install n8n-nodes-the-mastodon
```

The node will automatically be detected by n8n after installation. Restart your n8n instance if it is running.

---

## Configuration & Credentials

Before using the Mastodon node, you must configure OAuth2 credentials for your target Mastodon instance:

1. In your Mastodon instance, navigate to **Settings > Development** and create a new application.

   - Name: e.g., `n8n`
   - Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
   - Scopes: Select `read`, `write`, and `push` as needed.
   - Note down **Client ID** and **Client Secret**.

2. In your n8n UI:
   - Go to **Credentials** > **New** > **Mastodon OAuth2 API**.
   - Fill in:
     - **Instance URL**: `https://mastodon.social` (or your custom instance)
     - **Client ID**: from step 1
     - **Client Secret**: from step 1
     - **Scope**: `read write push`
   - Save and **Connect**. Authorize when prompted.

![](./docs/credentials-setup.png)

---

## Usage Examples

### Post a Status

1. Add a Mastodon node.
2. Resource: **Status**, Operation: **Create**.
3. Set **Status** text, and optionally add attachments or additional parameters.

```yaml
- name: Post Status
  type: n8n-nodes-community/n8n-nodes-the-mastodon:Mastodon
  parameters:
    resource: status
    operation: create
    status: 'Hello from n8n and Mastodon!'
    additionalFields:
      visibility: 'public'
```

### Fetch Public Timeline

- Resource: **Timeline**, Operation: **Public**.
- Use **Additional Fields** to filter `local`, `remote`, `only_media`, or paging parameters.

```yaml
- name: Get Public Timeline
  type: n8n-nodes-community/n8n-nodes-the-mastodon:Mastodon
  parameters:
    resource: timeline
    operation: public
    additionalFields:
      limit: 20
      local: true
```

### Manage Lists

- **Create List**:
  - Resource: **Lists**, Operation: **createList**; set `title` and optional `replies_policy`.
- **Add Account**:
  - Resource: **Lists**, Operation: **addAccountsToList**; set `listId` and `accountIds`.

```yaml
- name: Create and Update List
  type: n8n-nodes-community/n8n-nodes-the-mastodon:Mastodon
  parameters:
    resource: lists
    operation: createList
    title: 'My Favorite Authors'
- name: Add Accounts
  type: n8n-nodes-community/n8n-nodes-the-mastodon:Mastodon
  parameters:
    resource: lists
    operation: addAccountsToList
    listId: '12345'
    accountIds:
      - '42'
      - '99'
```

---

## Available Resources & Operations

| Resource      | Operations                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Status        | create, delete, edit, search, favourite, unfavourite, boost, unboost, bookmark, removeBookmark, view, viewEditHistory, viewSource |
| Account       | follow, unfollow, block, mute, unmute, verifyCredentials, viewProfile, getFollowers, getFollowing, searchAccounts                 |
| Timeline      | public, hashtag, home, list, link                                                                                                 |
| Bookmarks     | getBookmarks, addBookmark, removeBookmark                                                                                         |
| Favourites    | favourite, unfavourite                                                                                                            |
| Lists         | getLists, getList, createList, updateList, deleteList, getAccountsInList, addAccountsToList, removeAccountsFromList               |
| Media         | upload, update, delete, get (and more)                                                                                            |
| Polls         | getPoll, votePoll                                                                                                                 |
| Notifications | getAll, dismiss                                                                                                                   |
| Reports       | listReports, create, resolveReport                                                                                                |
| Retention     | viewStatistics                                                                                                                    |
| Markers       | get, save                                                                                                                         |
| ...           | (see full properties in code)                                                                                                     |

For a full list of fields and parameter descriptions, refer to the code under `nodes/Mastodon/*`.

---

## Testing

Automated tests are provided using [Jest](https://jestjs.io/).

```bash
# Install dev dependencies
npm install

# Run tests
npm test
```

Test files are located in the `__tests__` directory, covering each resource and operation.

---

## Development & Contributing

Contributions are welcome! Please abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the repository & clone locally.
2. Create a feature branch: `git checkout -b feature-name`.
3. Install dependencies: `npm install`.
4. Build & lint: `npm run build && npm run lint`.
5. Run tests: `npm test`.
6. Commit & push your changes, then open a Pull Request.

**Code style**: ESLint and Prettier are configured. Run:

```bash
npm run lint
npm run format
```

---

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

---

## References

- Mastodon API Docs: <https://docs.joinmastodon.org/api/>
- n8n Community Nodes Docs: <https://docs.n8n.io/integrations/community-nodes/>
- OAuth2 Setup Guide: <https://docs.joinmastodon.org/client/token/>
