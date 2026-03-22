#!/usr/bin/env node

/**
 * 🥯 i18n-bakery/tray - Binary Entry Point
 *
 * This file is the entry point for the MCP server.
 * Since the package is "type": "module", we import the ESM build.
 */

import { startTrayServer } from '../dist/index.js';

startTrayServer().catch((err) => {
  console.error('[i18n-bakery/tray] Failed to start MCP server:', err);
  process.exit(1);
});
