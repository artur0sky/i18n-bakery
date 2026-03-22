# 🍽️ @i18n-bakery/tray

> **"The Silver Tray"** - _Delivers i18n-bakery capabilities directly to AI agents via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Effortless automation at your fingertips._

The **Tray Package** is the server-side bridge. it makes translation workflows accessible to any MCP-compatible AI agent (Claude, Cursor, Copilot, etc.), enabling fully automated i18n pipelines. Instead of running CLI commands manually, let your AI agent handle the extraction, status checks, and translation updates for you.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/tray.svg)](https://www.npmjs.com/package/@i18n-bakery/tray)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation

```bash
npm install @i18n-bakery/tray
# or
pnpm add @i18n-bakery/tray
# or
yarn add @i18n-bakery/tray
```

---

## 🚀 Quick Start (Claude Desktop)

To use **i18n-bakery** inside Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "i18n-bakery": {
      "command": "npx",
      "args": ["-y", "@i18n-bakery/tray"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## 🛠️ MCP Tools (The Chef's Tools)

The tray provides a set of atomic tools that AI agents use to orchestrate the bakery:

| Tool | Action | Description |
| :--- | :--- | :--- |
| `check_pantry` | 🔍 **Inspect** | Returns a status report of missing translations across all locales. |
| `fry_batter` | ⚡ **Extract** | Scans source files (JS/TS/JSX/TSX) and extracts new keys automatically. |
| `update_recipe` | ✒️ **Update** | Atomic write: updates or creates a single translation key in a specific locale. |
| `bake_bundle` | 📦 **Compile** | Compiles JSON files into production-ready optimized bundles. |

---

## 🤖 AI Agent Workflow

When you enable **Tray**, your AI agent can follow this "Standard Bakery Workflow":

1. **Check Pantry:** "I see 12 missing translations in Spanish."
2. **Fry Batter:** "Found 3 new UI strings in the latest component update."
3. **Draft & Update:** "Translating strings... Persisting keys one by one via `update_recipe`."
4. **Bake:** "Finalizing production bundle... Bundle ready and hashed."

---

## 🏗️ Architecture

Built with **Clean Architecture** and 100% parity with the CLI:

- **Domain/Use-Cases:** Consumes the same business logic from `@i18n-bakery/baker`.
- **Tools:** Atomic MCP tool definitions with Zod schema validation.
- **Transports:** Supports standard I/O (stdio) for local integration.

---

## 📖 Programmatic Usage

You can also host your own Tray server:

```typescript
import { createTrayServer } from '@i18n-bakery/tray';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = createTrayServer();
const transport = new StdioServerTransport();

await server.connect(transport);
console.log('i18n-bakery tray is ready!');
```

---

## 🛡️ Security

- **Path Validation:** All paths are checked against directory traversal attacks.
- **Zod Safety:** Input parameters are strictly validated before hitting the filesystem.
- **Parity:** Uses the same secure `JSONFileSaver` as the core library.

---

## 🔗 Related Packages

- **[@i18n-bakery/core](../core)** - The Head Chef (Logic & Store)
- **[@i18n-bakery/cli](../cli)** - The Sous-Chef (Manual Commands)
- **[@i18n-bakery/baker](../baker)** - The Pastry Chef (Heavy Lifting)

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
