/**
 * 🥯 i18n-bakery/tray - bakeTool (MCP Tool)
 *
 * MCP Tool: "bake_bundle"
 *
 * Compiles locale source files into optimized production bundles.
 * Supports minification, content hashing, split output (lazy loading),
 * AES-256-GCM encryption, and manifest generation.
 *
 * Use this after translation reviews are done and a build is ready.
 *
 * @module tools/bakeTool
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BakeUseCase } from '../use-cases/BakeUseCase';

const useCase = new BakeUseCase();

const BakeSchema = {
  source: z
    .string()
    .describe(
      'Directory containing locale subdirectories (e.g., "public/locales"). Relative to cwd or absolute.'
    ),
  out: z
    .string()
    .optional()
    .describe('Output directory for compiled bundles. Default: "dist/locales"'),
  minify: z
    .boolean()
    .optional()
    .describe('Minify the JSON output to reduce file size. Default: false'),
  hash: z
    .boolean()
    .optional()
    .describe(
      'Append a content hash to filenames for cache busting (e.g., common.a1b2c3d4.json). Default: false'
    ),
  manifest: z
    .string()
    .optional()
    .describe(
      'Generate a manifest JSON file mapping locale/namespace to hashed filenames. Provide filename, e.g., "manifest.json"'
    ),
  split: z
    .boolean()
    .optional()
    .describe(
      'Split output into separate files per namespace for lazy loading. Default: false'
    ),
  encrypt: z
    .boolean()
    .optional()
    .describe('Encrypt output files with AES-256-GCM. Requires encryptionKey. Default: false'),
  encryptionKey: z
    .string()
    .optional()
    .describe('Secret key for AES-256-GCM encryption. Required when encrypt is true.'),
  cwd: z
    .string()
    .describe('Absolute path to the project root. Used to resolve relative paths.'),
};

/**
 * Registers the "bake_bundle" tool on the MCP server.
 */
export function registerBakeTool(server: McpServer): void {
  server.tool(
    'bake_bundle',
    'Compiles locale translation files into optimized production bundles. ' +
      'Supports minification, content hash filenames (for cache busting), per-namespace splitting ' +
      '(for lazy loading), AES-256-GCM encryption, and manifest file generation. ' +
      'Use after translators have reviewed and approved all locale files.',
    BakeSchema,
    async (args) => {
      if (args.encrypt && !args.encryptionKey) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: '🔴 Error: "encryptionKey" is required when "encrypt" is true.',
            },
          ],
        };
      }

      const result = await useCase.execute({
        source: args.source,
        out: args.out,
        minify: args.minify,
        hash: args.hash,
        manifest: args.manifest,
        split: args.split,
        encrypt: args.encrypt,
        encryptionKey: args.encryptionKey,
        cwd: args.cwd,
      });

      return {
        content: [
          {
            type: 'text',
            text: [
              `✅ Bake complete`,
              `Locales compiled: ${result.localesCount}`,
              `Files baked: ${result.bakedFiles.length}`,
              result.manifestPath ? `Manifest: ${result.manifestPath}` : null,
              '',
              'Baked files:',
              ...result.bakedFiles.map((f) => `  ${f}`),
            ]
              .filter(Boolean)
              .join('\n'),
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
