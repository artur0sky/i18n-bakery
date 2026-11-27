# Security hardening plan

## Phase 1: Protect translation data

- [x] Harden the core memory store against prototype pollution; cover public
  runtime behavior and update the Core README.
- [x] Harden Baker's JSON/TOML parsing and saving, and confine manifest paths;
  cover regressions and update the Baker README.

## Phase 2: Protect integrations

- [ ] Escape spreadsheet CSV fields, test untrusted keys and values, and update
  the Poacher README.
- [ ] Label untrusted extraction results in Tray, test the MCP response contract,
  and update the Tray README.

## Phase 3: Verify the bakery

- [ ] Update the vulnerable `yaml` transitive dependency, run dependency audit,
  focused tests and workspace build/tests, and document remaining limitations.

Complete and verify each task before checking it off and making its focused
Conventional Commit. Keep unrelated worktree changes out of these commits.
GitHub-hosted CI, security settings and browser E2E require separate validation.
