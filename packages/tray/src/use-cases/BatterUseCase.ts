/**
 * 🥯 i18n-bakery/tray - BatterUseCase (Use Case Layer)
 *
 * Orchestrates extraction and adapts the result for the Tray MCP response.
 *
 * @module use-cases/BatterUseCase
 */

import { ExtractionUseCase } from '@i18n-bakery/baker';
import type { BatterInput, BatterResult, ExtractedKeyInfo } from '../domain/types';
import { validatePathSegment } from '../shared/utils';

export class BatterUseCase {
  async execute(input: BatterInput): Promise<BatterResult> {
    const { source, locales: rawLocales, cwd } = input;
    const out = input.out ?? 'public/locales';
    const format = input.format ?? 'json';

    const locales = rawLocales.split(',').map((locale) => locale.trim());
    locales.forEach((locale) => validatePathSegment(locale, 'locale'));

    const result = await new ExtractionUseCase().execute({
      source,
      locales,
      out,
      format,
      cwd,
    });

    const keysByNamespace: Record<string, ExtractedKeyInfo[]> = {};
    for (const [namespace, keys] of Object.entries(result.keysByNamespace)) {
      keysByNamespace[namespace] = keys.map((key) => ({
        key: key.key,
        namespace: key.namespace,
        defaultValue: key.defaultValue,
        file: key.file,
        line: key.line,
      }));
    }

    return {
      totalKeys: result.totalKeys,
      keysByNamespace,
      filesScanned: result.filesScanned,
      newKeysPerLocale: result.newKeysPerLocale,
      outputDir: result.outputDir,
    };
  }
}
