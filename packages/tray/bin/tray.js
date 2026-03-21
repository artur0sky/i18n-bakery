#!/usr/bin/env node
/**
 * 🥯 i18n-bakery/tray - Binary Entry Point
 *
 * Starts the MCP server via stdio. This file is intentionally minimal —
 * it simply calls the exported startTrayServer() function so that the
 * actual logic lives in the testable TypeScript source.
 */

import { startTrayServer } from '../dist/index.js';

startTrayServer().catch((err) => {
  console.error('[tray] Failed to start MCP server:', err);
  process.exit(1);
});
