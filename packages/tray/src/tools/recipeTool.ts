/**
 * 🥯 i18n-bakery/tray - recipeTool (MCP Tool)
 *
 * MCP Tool: "update_recipe"
 *
 * Writes or updates a single translation key in a specific locale file.
 * This is the atomic write primitive that AI agents use to persist
 * translations after resolving them — one key at a time.
 *
 * Typical AI workflow:
 *   1. check_pantry  → discover missing keys
 *   2. [translate]   → use LLM to generate translation strings
 *   3. update_recipe → persist each translated key
 *   4. bake_bundle   → compile for production (optional)
 *
 * @module tools/recipeTool
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RecipeUseCase } from '../use-cases/RecipeUseCase';

const useCase = new RecipeUseCase();

const RecipeSchema = {
  locale: z
    .string()
    .describe(
      'The locale to write to. Must match a directory name in localesDir. Example: "es-MX"'
    ),
  namespace: z
    .string()
    .describe(
      'The namespace (file name without extension). Example: "common" writes to "common.json". Supports nested: "home/hero"'
    ),
  key: z
    .string()
    .describe(
      'The translation key in dot-notation. Example: "home.title" or "buttons.save"'
    ),
  value: z
    .string()
    .describe('The translated string value to write. Example: "Bienvenido"'),
  localesDir: z
    .string()
    .describe(
      'Directory containing locale subdirectories. Relative to cwd or absolute. Example: "public/locales"'
    ),
  cwd: z
    .string()
    .describe('Absolute path to the project root. Used to resolve relative paths.'),
};

/**
 * Registers the "update_recipe" tool on the MCP server.
 */
export function registerRecipeTool(server: McpServer): void {
  server.tool(
    'update_recipe',
    'Writes or updates a single translation key in a locale file. ' +
      'Creates the file if it does not exist. Existing keys are updated, new keys are added. ' +
      'This is the primary write tool for AI-driven translation workflows. ' +
      'Use check_pantry first to find which keys are missing, then call this tool for each one.',
    RecipeSchema,
    async (args) => {
      const result = await useCase.execute({
        locale: args.locale,
        namespace: args.namespace,
        key: args.key,
        value: args.value,
        localesDir: args.localesDir,
        cwd: args.cwd,
      });

      const action = result.isNew ? '➕ Created' : '✏️  Updated';

      return {
        content: [
          {
            type: 'text',
            text: [
              `${action} translation key`,
              `Locale:    ${args.locale}`,
              `Namespace: ${args.namespace}`,
              `Key:       ${result.key}`,
              `Value:     "${result.value}"`,
              `File:      ${result.filePath}`,
            ].join('\n'),
          },
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
