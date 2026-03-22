/**
 * 🥯 i18n-bakery/tray - BatterUseCase (Use Case Layer)
 *
 * Orchestrates the extraction of translation keys from source files.
 * Wraps @i18n-bakery/baker's BabelKeyExtractor to produce a structured
 * result suitable for MCP tool responses.
 *
 * SRP: Only responsible for extraction orchestration.
 * DIP: Depends on abstractions, not concrete file system details.
 *
 * @module use-cases/BatterUseCase
 */

import path from 'path';
import { ExtractionUseCase } from '@i18n-bakery/baker';
import type { BatterInput, BatterResult } from '../domain/types';
import { validatePathSegment } from '../shared/utils';

export class BatterUseCase {
  async execute(input: BatterInput): Promise<BatterResult> {
    const { source, locales: rawLocales, cwd } = input;
    const out = input.out ?? 'public/locales';
    const format = input.format ?? 'json';

    const locales = rawLocales.split(',').map((l) => l.trim());
    locales.forEach((l) => validatePathSegment(l, 'locale'));

    const useCase = new ExtractionUseCase();
    const result = await useCase.execute({
      source,
      locales,
      out,
      format,
      cwd
    });

    // We do not have granular per-locale new key tracking from ExtractionUseCase anymore
    // but we can report aggregate metrics safely.
    const newKeysPerLocale: Record<string, number> = {};
    for (const locale of locales) {
      newKeysPerLocale[locale] = -1; // Unreported by batched execution
    }

    // Remap keysByNamespace to match Tray MCP schema requirements
    const mappedNamespaceKeys: Record<string, any[]> = {};
    for (const [ns, keys] of Object.entries(result.keysByNamespace)) {
        mappedNamespaceKeys[ns] = keys.map(k => ({
            key: k.key,
            namespace: k.namespace,
            defaultValue: k.defaultValue,
            file: k.file,
            line: k.line,
        }));
    }

    return {
      totalKeys: result.totalKeys,
      keysByNamespace: mappedNamespaceKeys,
      filesScanned: result.filesScanned,
      newKeysPerLocale,
      outputDir: result.outputDir,
    };
  }
}
