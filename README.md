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

### Building the image with or without the plugin

The Dockerfiles in this repository now provide a safe multi-stage build that supports an optional plugin install.

Usage patterns:

- Build with plugin: provide the tarball via --build-arg and build the `final-plugin` target. The tarball must be present in the build context (e.g. the repository root) or specify a path relative to the build context.

```bash
docker build --target final-plugin --build-arg PLUGIN_TARBALL=n8n-nodes-the-mastodon-0.0.1.tgz -t n8n-with-plugin .
```

- For local development using the dev Dockerfile (no plugin):

```bash
docker build -f Dockerfile.dev -t n8n-dev:plain .
```

- For local development with plugin:

```bash
docker build -f Dockerfile.dev --target final-plugin --build-arg PLUGIN_TARBALL=n8n-nodes-the-mastodon-0.0.1.tgz -t n8n-dev:plugin .
```

Notes:

- The plugin tarball is only used when you explicitly build the `final-plugin` target. The default builds (no target) will not attempt to install a plugin.
- This approach works across common Docker installations and does not rely on BuildKit-specific optional mounts. If you prefer BuildKit mounts, the older instructions remain in the Git history, but the recommended path is the `--target` flow above.

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

### Note about deprecated scopes and server compatibility

Some Mastodon instances have deprecated or removed scopes such as `follow` (and may not accept `push` in some configurations). If you see an error like:

```text
The requested scope is invalid, unknown, or malformed.
```

It usually means the authorization URL requested scopes the server doesn't support. If that happens you can:

- Edit the **Scope** value in the credential to only request `read write` before initiating the Connect flow.
- Or, after the Connect URL opens, remove unsupported scopes from the `scope` query param (e.g. change `read write follow push` → `read write`) and continue.

The node will try to prefer the currently granted scopes when available to avoid requesting deprecated/unsupported scopes automatically.

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

### TypeScript Configuration

This project uses a dual-typeRoots approach in `tsconfig.json`:

- **`./types`**: Custom type shims providing minimal declarations for editor-only type checking (e.g., `n8n-workflow-shim.d.ts`, `jest.d.ts`, `node-globals.d.ts`)
- **`./node_modules/@types`**: Standard third-party type definitions from npm

This configuration allows the project to:

1. Use custom shims for packages that don't provide types or where peer dependencies would cause conflicts
2. Leverage full type definitions from `@types/*` packages for comprehensive type checking
3. Maintain type-safety without forcing all types through custom shims

When adding new dependencies, ensure either:

- The package includes its own types, or
- Add the corresponding `@types/*` package to devDependencies, or
- Create a minimal shim in `./types/` if needed

---

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

---

## References

- Mastodon API Docs: <https://docs.joinmastodon.org/api/>
- n8n Community Nodes Docs: <https://docs.n8n.io/integrations/community-nodes/>
- OAuth2 Setup Guide: <https://docs.joinmastodon.org/client/token/>

## Frozen testing state

On 2025-10-12 the plugin was validated against a locally built n8n image using the `docker-compose.dev.plugin.yml` flow. The package was packed, the image built, the package copied into n8n's runtime custom extensions folder, and a require test inside the container returned "require OK". See `DEV_SETUP.md` for step-by-step reproduction and recommended developer flows.
