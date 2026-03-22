# @i18n-bakery/tray 🍽️

> The Silver Tray — delivers the **i18n-bakery** kitchen directly to AI agents via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

`tray` makes translation workflows accessible to any MCP-compatible AI agent (Claude, Cursor, Copilot, etc.), enabling fully automated i18n pipelines without human intervention.

---

## What it does

Instead of a human running CLI commands, an AI agent can:

1. **Detect** missing translations across all locales
2. **Extract** new keys after UI changes
3. **Write** translated strings directly to locale files
4. **Compile** production bundles with hashing and minification

## Tools

| Tool | Description |
|---|---|
| `fry_batter` | Scans source files for `t()` calls and writes keys to locale files |
| `bake_bundle` | Compiles locale files into optimized production bundles |
| `check_pantry` | Status report: completion %, missing keys per locale |
| `update_recipe` | Writes/updates a single translation key in a locale file |

## Typical AI Agent Workflow

```
1. check_pantry   → "es-MX is 60% complete, missing 12 keys"
2. fry_batter     → "Found 3 new keys after the latest component changes"
3. update_recipe  → write each translated key
4. bake_bundle    → compile for production
```

## Installation

```bash
pnpm add @i18n-bakery/tray
```

## Usage

### As an MCP Server (stdio)

```bash
# Start the MCP server via stdio
npx i18n-bakery-tray
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "i18n-bakery": {
      "command": "npx",
      "args": ["i18n-bakery-tray"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

### Programmatic Usage

```ts
import { createTrayServer } from '@i18n-bakery/tray';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = createTrayServer();
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Architecture

Follows Clean Architecture with SOLID principles:

```
src/
  domain/         Pure types — no runtime dependencies
  use-cases/      Orchestration: BatterUseCase, BakeUseCase, PantryUseCase, RecipeUseCase
  adapters/       Infrastructure: SilentLogger
  tools/          Atomic MCP tool registrations (one file per tool)
  shared/         DRY utilities: flatten/unflatten, deep key access, path validation
  index.ts        Server assembly — pure DI, no business logic
```

## Security

- All user-provided path segments are validated against directory traversal
- Prototype pollution is prevented at every object merge
- Encryption key is required when encryption is enabled (validated at tool level)
