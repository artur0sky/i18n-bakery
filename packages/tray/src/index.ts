/**
 * 🥯 i18n-bakery/tray - MCP Server Entry Point
 *
 * The Silver Tray: delivers the i18n-bakery kitchen capabilities
 * to AI agents via the Model Context Protocol (MCP).
 *
 * This module assembles the McpServer, registers all tools, and starts
 * the stdio transport. It intentionally has no business logic — its sole
 * responsibility is DI assembly and server lifecycle.
 *
 * Tool Inventory:
 *   🔍 fry_batter    → Extract t() keys from source, write to locale files
 *   🔥 bake_bundle   → Compile locale files into production bundles
 *   📊 check_pantry  → Status report of translation completeness
 *   ✏️  update_recipe → Write a single translation key to a locale file
 *
 * @module index
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerBatterTool } from './tools/batterTool';
import { registerBakeTool } from './tools/bakeTool';
import { registerPantryTool } from './tools/pantryTool';
import { registerRecipeTool } from './tools/recipeTool';

const SERVER_NAME = '@i18n-bakery/tray';
const SERVER_VERSION = '1.0.8';

/**
 * Creates and configures the MCP server with all registered tools.
 * Exported for testing and programmatic usage.
 */
export function createTrayServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register all tools — each handles a single responsibility
  registerBatterTool(server);
  registerBakeTool(server);
  registerPantryTool(server);
  registerRecipeTool(server);

  return server;
}

/**
 * Starts the MCP server using stdio transport.
 * Called by the bin entry point.
 */
export async function startTrayServer(): Promise<void> {
  const server = createTrayServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

// Re-export types for consumers
export * from './domain/types';
