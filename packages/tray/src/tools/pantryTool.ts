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
      'compared to a reference locale. Use this to discover what needs to be translated next. ' +
      'The response includes machine-readable JSON for programmatic use.',
    PantrySchema,
    async (args) => {
      const result = await useCase.execute({
        localesDir: args.localesDir,
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
          const keys = s.missingKeyList.slice(0, 20).join('\n    ');
          const more =
            s.missingKeyList.length > 20
              ? `\n    ... and ${s.missingKeyList.length - 20} more`
              : '';
          return `\n  📭 ${locale} (${s.missingKeys} missing):\n    ${keys}${more}`;
        })
        .join('');

      return {
        content: [
          {
            type: 'text',
            text: [
              `🥯 Pantry Status Report`,
              `Reference locale: ${result.referenceLocale}`,
              `Locales found: ${result.locales.join(', ')}`,
              '',
              'Completion:',
              tableRows,
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
