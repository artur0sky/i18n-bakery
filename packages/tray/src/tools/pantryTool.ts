/**
 * 🥯 i18n-bakery/tray - pantryTool (MCP Tool)
 *
 * MCP Tool: "check_pantry"
 *
 * Inspects all locale directories and returns a comprehensive status report:
 * how many keys exist, which are missing, and the completion percentage
 * per locale compared to a reference locale (usually en-US).
 *
 * This is the most valuable tool for AI-driven translation workflows —
 * an agent can call this first to decide what to translate next.
 *
 * @module tools/pantryTool
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PantryUseCase } from '../use-cases/PantryUseCase';

const useCase = new PantryUseCase();

const PantrySchema = {
  localesDir: z
    .string()
    .describe(
      'Directory containing locale subdirectories. Relative to cwd or absolute. Example: "public/locales"'
    ),
  sourceDir: z
    .string()
    .optional()
    .describe(
      'Optional: Source directory to scan for t() calls (e.g., "src"). ' +
      'If provided, the report will also include keys found in code that are missing in JSON.'
    ),
  referenceLocale: z
    .string()
    .optional()
    .describe(
      'The locale to use as the reference (source of truth). If omitted, the first locale starting with "en" is used, or the first found.'
    ),
  cwd: z
    .string()
    .describe('Absolute path to the project root. Used to resolve relative paths.'),
};

/**
 * Registers the "check_pantry" tool on the MCP server.
 */
export function registerPantryTool(server: McpServer): void {
  server.tool(
    'check_pantry',
    'Checks the translation pantry: scans all locale directories and returns a status report ' +
      'showing which keys are present, missing, and the completion percentage per locale ' +
      'compared to a reference locale. If sourceDir is provided, it also scans the source code ' +
      'for t() calls to discover keys that are not yet in any JSON file.',
    PantrySchema,
    async (args) => {
      const result = await useCase.execute({
        localesDir: args.localesDir,
        sourceDir: args.sourceDir,
        referenceLocale: args.referenceLocale,
        cwd: args.cwd,
      });

      const tableRows = result.locales
        .map((locale) => {
          const s = result.status[locale];
          const bar = buildProgressBar(s.completionPercent);
          return `  ${locale.padEnd(10)} ${bar} ${s.completionPercent}% (${s.presentKeys}/${s.totalKeys})`;
        })
        .join('\n');

      const missingReport = result.locales
        .filter((locale) => result.status[locale].missingKeys > 0)
        .map((locale) => {
          const s = result.status[locale];
          const keys = s.missingKeyList.slice(0, 15).map(k => {
              const details = s.missingKeyDetails?.[k];
              const fb = details?.fallback ? ` (Fallback: "${details.fallback}")` : '';
              return `    ${k}${fb}`;
          }).join('\n');
          
          const more =
            s.missingKeyList.length > 15
              ? `\n    ... and ${s.missingKeyList.length - 15} more`
              : '';
          return `\n  📭 ${locale} (${s.missingKeys} missing):\n${keys}${more}`;
        })
        .join('');

      const refMissingText = result.missingInReference 
        ? `\n\n⚠️ Missing in Reference (${result.referenceLocale}):\n    ${result.missingInReference.join('\n    ')}`
        : '';

      return {
        content: [
          {
            type: 'text',
            text: [
              `🥯 Pantry Status Report`,
              `Reference locale: ${result.referenceLocale}`,
              args.sourceDir ? `Source scan: Enabled (${args.sourceDir})` : 'Source scan: Disabled',
              `Locales found: ${result.locales.join(', ')}`,
              '',
              'Completion:',
              tableRows,
              refMissingText,
              missingReport ? `\nMissing Keys:${missingReport}` : '\n✅ All locales are complete!',
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

/** Builds a simple ASCII progress bar (10 chars wide) */
function buildProgressBar(percent: number): string {
  const filled = Math.round(percent / 10);
  return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}]`;
}
