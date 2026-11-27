# 🍽️ @i18n-bakery/tray

> **"The Silver Tray"** — delivers selected i18n-bakery workflows to MCP-compatible AI clients.

The Tray package is an MCP server for source extraction, translation status, single-key updates, and bundle baking. It shares use cases with Baker; it does not expose every command available in the CLI.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/tray.svg)](https://www.npmjs.com/package/@i18n-bakery/tray)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add @i18n-bakery/tray
```

## 🚀 Quick Start (Claude Desktop)

The package provides the `i18n-bakery-tray` executable and uses stdio when started as an MCP server. For clients that accept an `mcpServers` configuration:

```json
{
  "mcpServers": {
    "i18n-bakery": {
      "command": "pnpm",
      "args": ["dlx", "@i18n-bakery/tray"]
    }
  }
}
```

---

## 🛠️ MCP Tools (The Chef's Tools)

Each tool takes a project-root `cwd` string. Pass an absolute path so relative paths resolve predictably.

| Tool | Action | Description |
| :--- | :--- | :--- |
| `check_pantry` | 🔍 **Inspect** | Compares JSON locale files and reports missing keys and completion by locale. An optional source scan adds keys discovered in code. |
| `fry_batter` | ⚡ **Extract** | Scans `.js`, `.jsx`, `.ts`, and `.tsx` source for static translation calls and writes new keys as JSON or TOML. Existing values are preserved; keys without source defaults are written as empty strings. |
| `update_recipe` | ✒️ **Update** | Creates or overwrites one key in a nested JSON locale file. The namespace is a single path segment; nested namespace paths are not supported. |
| `bake_bundle` | 📦 **Compile** | Reads JSON or TOML locale files and writes JSON bundles; supports minifying, hashing, splitting by namespace, encryption, and manifests. |

`check_pantry` reads JSON locale files only. If baking finds both JSON and TOML in a locale directory, JSON takes precedence.

---

## 🤖 AI Agent Workflow

An agent can use the tools in a reviewable sequence:

1. **Check Pantry:** inspect coverage against a reference locale.
2. **Fry Batter:** extract static keys after source changes.
3. **Draft & Update:** review translations, then persist individual keys with `update_recipe`.
4. **Bake:** compile locale files when a production bundle is needed.

The tools do not generate or verify translated text; the client decides what values to write.

---

## 🏗️ Architecture (Kitchen Layout)

- **Domain/Use Cases:** delegates extraction, baking, pantry checks, and recipe updates to Baker.
- **Tools:** registers four MCP tools with Zod input schemas.
- **Transport:** the bundled executable starts the server over stdio.

---

## 📖 Programmatic Usage (Serving from Code)

`createTrayServer()` creates the server and registers the same four tools. Connect it to an MCP transport:

```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createTrayServer } from '@i18n-bakery/tray'

const server = createTrayServer()
await server.connect(new StdioServerTransport())
```

---

## 🛡️ Security (Kitchen Safety)

- MCP inputs are defined with Zod schemas.
- Locale, namespace, and key validation is applied by the relevant Baker use cases.
- Caller-supplied paths are resolved from `cwd`; limit them to project directories the MCP client is authorized to access.

---

## 🔗 Related Packages (Kitchen Staff)

- **[@i18n-bakery/core](../core)** — runtime translation engine.
- **[@i18n-bakery/cli](../cli)** — command-line workflows.
- **[@i18n-bakery/baker](../baker)** — shared extraction and file use cases.

---

## 📜 License

MIT © Arturo Sáenz

---

## 🙏 Support

- 📖 [Main Documentation](../../README.md)
- 🐛 [Issue Tracker](https://github.com/artur0sky/i18n-bakery/issues)

---

<div align="center">

**🍽️ The silver tray for your AI-driven translations**

_Made with 🍩 and Model Context Protocol_

</div>
