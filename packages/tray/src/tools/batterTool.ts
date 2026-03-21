/**
 * 🥯 i18n-bakery/tray - batterTool (MCP Tool)
 *
 * MCP Tool: "fry_batter"
 *
 * Scans source files for t() calls and extracts all translation keys,
 * writing them to the appropriate locale files. New keys get a placeholder
 * value; existing keys are preserved.
 *
 * This allows an AI agent to synchronize translation files after code changes
 * without any manual CLI invocation.
 *
 * @module tools/batterTool
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BatterUseCase } from '../use-cases/BatterUseCase';

const useCase = new BatterUseCase();

/** Zod schema for input validation — provides MCP with parameter descriptions */
const BatterSchema = {
  source: z
    .string()
    .describe(
      'Source directory to scan for t() calls. Relative to cwd or absolute. Example: "src"'
    ),
  locales: z
    .string()
    .describe(
      'Comma-separated list of locale identifiers to write files for. Example: "en-US,es-MX,it,jp"'
    ),
  out: z
    .string()
    .optional()
    .describe('Output directory for locale files. Default: "public/locales"'),
  format: z
    .enum(['json', 'toml'])
    .optional()
    .describe('Output format for translation files. Default: "json"'),
  cwd: z
    .string()
    .describe(
      'Absolute path to the project root. Required to resolve relative paths correctly.'
    ),
};

/**
 * Registers the "fry_batter" tool on the MCP server.
 *
 * @param server - The MCP server instance to register on
 */
export function registerBatterTool(server: McpServer): void {
  server.tool(
    'fry_batter',
    'Scans source files for i18n t() calls and extracts translation keys into locale files. ' +
      'New keys are added with placeholder values; existing keys are never overwritten. ' +
      'Use this after writing new UI components to synchronize translation files automatically.',
    BatterSchema,
    async (args) => {
      const result = await useCase.execute({
        source: args.source,
        locales: args.locales,
        out: args.out,
        format: args.format,
        cwd: args.cwd,
      });

      const summary = Object.entries(result.newKeysPerLocale)
        .map(([locale, count]) => `  ${locale}: +${count} new keys`)
        .join('\n');

      return {
        content: [
          {
            type: 'text',
            text: [
              `✅ Extraction complete`,
              `Files scanned: ${result.filesScanned}`,
              `Total keys found: ${result.totalKeys}`,
              `Namespaces: ${Object.keys(result.keysByNamespace).join(', ')}`,
              `New keys added per locale:\n${summary}`,
              `Output directory: ${result.outputDir}`,
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
