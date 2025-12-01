# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Favourites Resource**: Added complete `getFavourites` operation to retrieve favourited statuses
  - New operation: `GET /api/v1/favourites` with configurable limit parameter
  - Complements existing `favourite` and `unfavourite` operations
- **Type System Improvements**: Added minimal TypeScript declaration shims in `types/` directory
  - `n8n-workflow-shim.d.ts`: Provides editor-only IntelliSense without requiring full `n8n-workflow` installation
  - `jest.d.ts`: Minimal Jest type shims for test files
  - `node-globals.d.ts`: Essential Node.js global types
  - Configured `tsconfig.json` with `typeRoots` and `paths` for better module resolution
- **Build System Enhancements**:
  - Added `deps:ensure` script to verify and auto-install required dev dependencies
  - New Docker-based development workflows: `dev:bind`, `dev:plugin`, `docker:build`, `docker:up`
  - Added `pack` script for generating distributable `.tgz` package

### Changed

- **Favourites Operations**: Updated default operation to `getFavourites` (was `favourite`)
- **Build Process**: All build/lint/test scripts now run `deps:ensure` first for consistent dev environment
- **TypeScript Configuration**:
  - Removed deprecated `tslint.json`, now exclusively using ESLint
  - Added `$schema` reference for better IDE support
  - Configured custom `typeRoots` to prioritize local shims before `node_modules/@types`
  - Set `forceConsistentCasingInFileNames: true` for cross-platform compatibility
- **Test Documentation**: Expanded `test-instructions.md` with clearer setup steps and Docker workflows

### Fixed

- **Workflow Test Suite**: Fixed "9. Favourite Status" to correctly reference `$('2. Create Status').item.json.id` instead of relying on previous node output
- **Operation Mapping**: Ensured all favourites operations properly map to Mastodon API endpoints:
  - `POST /api/v1/statuses/:id/favourite` → `favourite`
  - `POST /api/v1/statuses/:id/unfavourite` → `unfavourite`
  - `GET /api/v1/favourites` → `getFavourites`

### Migration Notes

- **For Integrators**:
  - Favourites resource now defaults to `getFavourites` instead of `favourite` - update any workflows that rely on the default
  - New `limit` parameter available for `getFavourites` operation (default: 20)
- **For Contributors**:
  - Run `npm run deps:ensure` or standard `npm install --include=dev` before building to ensure all dependencies are present
  - Type shims in `types/` directory are editor helpers only; full types come from installed dev dependencies
  - Use `npm run pack` to generate distribution packages for testing
