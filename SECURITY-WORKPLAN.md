# Security hardening plan

## Phase 1: Protect translation data

- [x] Harden the core memory store against prototype pollution; cover public
  runtime behavior and update the Core README.
- [x] Harden Baker's JSON/TOML parsing and saving, and confine manifest paths;
  cover regressions and update the Baker README.

## Phase 2: Protect integrations

- [x] Escape spreadsheet CSV fields, test untrusted keys and values, and update
  the Poacher README.
- [x] Label untrusted extraction results in Tray, test the MCP response contract,
  and update the Tray README.

## Phase 3: Verify the bakery

- [x] Add version-update notifications, dependency audit and CodeQL workflows;
  document the GitHub settings required to enforce merge protection.
- [x] Remove the vulnerable optional `yaml` resolution, constrain future
  resolutions to a patched version, and run dependency audit and workspace
  build/tests.

The locked dependency graph no longer installs `yaml`; the workspace override
requires version 2.8.3 or later within major version 2 if it is resolved again.
On Windows without symlink privileges, the manifest symlink regression is
skipped and must be exercised on a runner that can create symlinks. The React
example has no browser E2E runner.

Complete and verify each task before checking it off and making its focused
Conventional Commit. Keep unrelated worktree changes out of these commits.
GitHub-hosted CI, security settings and browser E2E require separate validation.
