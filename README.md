# n8n Community Node: Mastodon

[![npm version](https://img.shields.io/npm/v/n8n-nodes-the-mastodon.svg)](https://www.npmjs.com/package/n8n-nodes-the-mastodon)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-the-mastodon.svg)](https://www.npmjs.com/package/n8n-nodes-the-mastodon)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

This is a community maintained n8n node pack for working with the Mastodon API. It provides full CRUD support across Mastodon resources, including statuses, accounts, timelines, media, polls, bookmarks, lists, and more, all within n8n workflows.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration & Credentials](#configuration--credentials)
- [Usage Examples](#usage-examples)
  - [Example Workflow Files](#example-workflow-files)
  - [Post a Status](#post-a-status)
  - [Fetch Public Timeline](#fetch-public-timeline)
  - [Manage Lists](#manage-lists)
- [Available Resources & Operations](#available-resources--operations)
- [Testing](#testing)
- [Development & Contributing](#development--contributing)
- [License](#license)
- [References](#references)

## Features

- **Dual Authentication**: Supports both OAuth2 and token based authentication.
- **Statuses**: Create, delete, edit, search, favourite, boost (reblog), bookmark, and manage scheduled statuses.
- **Accounts**: Follow, unfollow, block, mute, view profiles, and manage relationships.
- **Timelines**: Retrieve public, home, hashtag, list, and link timelines with advanced query options.
- **Media**: Upload and manage media attachments.
- **Polls**: Fetch poll data and cast votes.
- **Bookmarks**: Add and remove bookmarks from statuses.
- **Lists**: Create, update, and delete lists, and manage list membership.
- **Notifications**: Fetch and dismiss notifications.
- **Administration**: Admin level endpoints for reports, retention metrics, cohorts, and more.
- **Enhanced Error Handling**: Type safe handling with detailed error messages and automatic retry logic.
- **Security**: Sanitizes credentials in logs to prevent sensitive data exposure.
- **Customizable**: Uses query parameters and additional fields for fine grained control.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [pnpm](https://pnpm.io/) v10.33.0 or higher (recommended), or [npm](https://www.npmjs.com/) v6 or higher
- A self hosted [n8n](https://n8n.io/) instance

## Installation

```bash
# From your n8n project root:
pnpm install n8n-nodes-the-mastodon
# or with npm:
npm install n8n-nodes-the-mastodon
```

**Note**: pnpm is the recommended package manager for development. All scripts in `package.json` use pnpm commands.

### Build the image with or without the plugin

The Dockerfiles in this repository support a safe multi stage build with optional plugin installation.

Usage patterns:

- Build with plugin: Provide the tarball through `--build-arg` and build the `final-plugin` target. The tarball must be in the build context (for example, the repository root), or use a path relative to the build context.

```bash
docker build --target final-plugin --build-arg PLUGIN_TARBALL=n8n-nodes-the-mastodon-0.0.1.tgz -t n8n-with-plugin .
```

- Local development using the dev Dockerfile (no plugin):

```bash
docker build -f Dockerfile.dev -t n8n-dev:plain .
```

- Local development with plugin:

```bash
docker build -f Dockerfile.dev --target final-plugin --build-arg PLUGIN_TARBALL=n8n-nodes-the-mastodon-0.0.1.tgz -t n8n-dev:plugin .
```

Notes:

- The plugin tarball is used only when you explicitly build the `final-plugin` target. Default builds with no target do not install a plugin.
- This approach works across common Docker installations and does not depend on BuildKit specific optional mounts. If you prefer BuildKit mounts, the older instructions are still in Git history, but the recommended path is the `--target` flow above.

After installation, n8n should detect the node automatically. Restart your n8n instance if it is already running.

## Configuration & Credentials

The Mastodon node supports two authentication methods.

### Method 1: Token based Authentication (recommended for simplicity)

Token based authentication is simpler to set up and works well for personal use or cases where OAuth2 flow is not required.

1. In your Mastodon instance, go to **Settings > Development** and create a new application.
   - Name: for example, `n8n`
   - Scopes: select `read`, `write`, and `push` as needed
   - After creation, copy the **Access Token** from the application details

2. In n8n:
   - Go to **Credentials** > **New** > **Mastodon Access Token API**
   - Fill in:
     - **Mastodon Instance URL**: `https://mastodon.social` (or your custom instance)
     - **Access Token**: from step 1
   - Save the credential

3. In your Mastodon node:
   - Select **Token** as the **Authentication Type**
   - Choose your saved token credential

### Method 2: OAuth2 Authentication (required for authentication operations)

OAuth2 is required when you need authentication specific operations or want users to authorize through the standard OAuth flow.

1. In your Mastodon instance, go to **Settings > Development** and create a new application.
   - Name: for example, `n8n`
   - Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
   - Scopes: select `read`, `write`, and `push` as needed
   - Note the **Client ID** and **Client Secret**

2. In n8n:
   - Go to **Credentials** > **New** > **Mastodon OAuth2 API**
   - Fill in:
     - **Instance URL**: `https://mastodon.social` (or your custom instance)
     - **Client ID**: from step 1
     - **Client Secret**: from step 1
     - **Scope**: `read write push`
   - Save and click **Connect**, then authorize when prompted

3. In your Mastodon node:
   - Select **OAuth2** as the **Authentication Type**
   - Choose your saved OAuth2 credential

**Note**: Authentication resource operations such as managing OAuth applications, creating or updating OAuth client apps, rotating client secrets, managing redirect URIs, revoking OAuth consent, and listing registered OAuth scopes require OAuth2 credentials. They do not work with token based authentication.

### Note about deprecated scopes and server compatibility

Some Mastodon instances have deprecated or removed scopes such as `follow` and, in some configurations, may not accept `push`. If you see an error like this:

```text
The requested scope is invalid, unknown, or malformed.
```

The authorization URL is likely requesting scopes that the server does not support. If that happens, you can:

- Edit the credential **Scope** value to request only `read write` before starting the Connect flow.
- Or, after the Connect URL opens, remove unsupported scopes from the `scope` query parameter (for example, change `read write follow push` to `read write`) and continue.

When available, the node tries to prefer currently granted scopes to avoid requesting deprecated or unsupported scopes automatically.

## Usage Examples

### Example Workflow Files

The repository includes ready to import n8n workflows under `examples/`:

- `examples/Comprehensive Mastodon Test Workflow.json`
  - Comprehensive compatibility run in **safe mode**
  - Focuses on read operations and reversible write operations with cleanup
  - Recommended default for validating credentials, connectivity, and core functionality with lower risk

- `examples/Comprehensive Mastodon Test Workflow.safe.json`
  - Same safe mode workflow as above, provided as an explicit safe variant
  - Useful if you want to keep a safe profile while also maintaining a separate full mode file

- `examples/Comprehensive Mastodon Test Workflow.full.json`
  - Full coverage workflow for advanced testing
  - Includes additional admin/auth and higher impact operations, including profile deletion operations
  - Use only in controlled test environments and test accounts

- `examples/Mastodon_example_workflow.json`
  - Minimal practical example: create a status, inspect context, add and remove a bookmark, then delete the status
  - Good starting point for learning create and cleanup patterns

- `examples/Mastodon_node_template.json`
  - Reusable template pattern with token auth and safe, reversible flows
  - Demonstrates timeline fetch, search, follow/unfollow tag, and create/delete list in one pipeline

Import any file in n8n through **Workflows -> Import from File**.

### Post a Status

1. Add a Mastodon node.
2. Set Resource to **Status** and Operation to **Create**.
3. Enter the **Status** text, and optionally add attachments or additional parameters.

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

- Resource: **Timeline**
- Operation: **Public**
- Use **Additional Fields** to filter `local`, `remote`, `only_media`, or paging parameters

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
  - Resource: **Lists**
  - Operation: **createList**
  - Set `title` and optional `replies_policy`
- **Add Account**:
  - Resource: **Lists**
  - Operation: **addAccountsToList**
  - Set `listId` and `accountIds`

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

For a full list of fields and parameter descriptions, see the code under `nodes/Mastodon/*`.

## Testing

Automated tests are provided with [Jest](https://jestjs.io/).

```bash
# Install dev dependencies
pnpm install

# Run tests
pnpm test

# Or using the Makefile
make test
```

Test files are in `__tests__`, covering each resource and operation. The suite includes:

- Unit tests for API request handling
- Resource specific operation tests (accounts, statuses, timelines, and others)
- Rate limiting and queue management tests
- Error handling and retry logic tests
- URL truncation and extraction tests

## Development & Contributing

Contributions are welcome. Please follow our [Code of Conduct](CODE_OF_CONDUCT.md).

1. Fork the repository and clone it locally.
2. Create a feature branch: `git checkout -b feature-name`.
3. Install dependencies: `pnpm install`.
4. Build and lint: `pnpm run build && pnpm run lint`.
5. Run tests: `pnpm test`.
6. Commit and push your changes, then open a Pull Request.

**Code style**: ESLint and Prettier are configured. Run:

```bash
pnpm run lint
pnpm run format
```

**Using the Makefile**: common development tasks are available through make commands:

```bash
make install    # Install dependencies with pnpm
make build      # Build the project
make test       # Run tests
make lint       # Run linter
make clean      # Clean build artifacts and dependencies
make deps       # Ensure dependencies are installed
```

### TypeScript Configuration

This project uses a dual `typeRoots` approach in `tsconfig.json`:

- **`./types`**: custom type shims with minimal declarations for editor only type checking (for example, `n8n-workflow-shim.d.ts`, `jest.d.ts`, `node-globals.d.ts`)
- **`./node_modules/@types`**: standard third party type definitions from npm

This setup allows the project to:

1. Use custom shims for packages without types, or where peer dependencies would create conflicts
2. Use complete type definitions from `@types/*` packages for broader type checking
3. Maintain type safety without forcing all types through custom shims

When adding dependencies, ensure one of the following:

- The package includes its own types
- Add the matching `@types/*` package to `devDependencies`
- Create a minimal shim in `./types/` if needed

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## References

- Mastodon API Docs: <https://docs.joinmastodon.org/api/>
- n8n Community Nodes Docs: <https://docs.n8n.io/integrations/community-nodes/>
- OAuth2 Setup Guide: <https://docs.joinmastodon.org/client/token/>

## Frozen testing state

On 2025-10-12, the plugin was validated against a locally built n8n image using the `docker-compose.dev.plugin.yml` flow. The package was packed, the image was built, the package was copied into n8n's runtime custom extensions folder, and a require test inside the container returned "require OK". See `DEV_SETUP.md` for step by step reproduction and recommended developer flows.
