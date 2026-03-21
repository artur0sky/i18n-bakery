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
import fs from 'fs-extra';
import { glob } from 'glob';
import { BabelKeyExtractor } from '@i18n-bakery/baker';
import { TOMLFileSaver, JSONFileSaver } from '@i18n-bakery/baker';
import type { BatterInput, BatterResult, ExtractedKeyInfo } from '../domain/types';
import { validatePathSegment, flattenObject, unflattenObject } from '../shared/utils';

/**
 * Orchestrates the "batter" (extraction) phase.
 * Scans source files, extracts t() call keys, and writes them to locale files.
 */
export class BatterUseCase {
  private readonly extractor = new BabelKeyExtractor();

  async execute(input: BatterInput): Promise<BatterResult> {
    const { source, locales: rawLocales, cwd } = input;
    const out = input.out ?? 'public/locales';
    const format = input.format ?? 'json';
    const fileExtension = format === 'toml' ? '.toml' : '.json';

    const locales = rawLocales.split(',').map((l) => l.trim());
    locales.forEach((l) => validatePathSegment(l, 'locale'));

    const absoluteSource = path.isAbsolute(source) ? source : path.join(cwd, source);
    const absoluteOut = path.isAbsolute(out) ? out : path.join(cwd, out);

    if (!(await fs.pathExists(absoluteSource))) {
      throw new Error(`Source directory not found: ${absoluteSource}`);
    }

    const files = await glob(`${absoluteSource.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`, {
      ignore: ['**/*.d.ts', '**/node_modules/**'],
    });

    const keysByNamespace: Record<string, ExtractedKeyInfo[]> = {};
    let totalKeys = 0;

    for (const file of files) {
      const extracted = await this.extractor.extractFromFile(file);
      totalKeys += extracted.length;

      for (const k of extracted) {
        validatePathSegment(k.namespace, 'namespace');
        if (!keysByNamespace[k.namespace]) keysByNamespace[k.namespace] = [];
        keysByNamespace[k.namespace].push({
          key: k.key,
          namespace: k.namespace,
          defaultValue: k.defaultValue,
          file: k.file,
          line: k.line,
        });
      }
    }

    const newKeysPerLocale: Record<string, number> = {};

    for (const locale of locales) {
      const localeDir = path.join(absoluteOut, locale);
      await fs.ensureDir(localeDir);
      let localeNewKeys = 0;

      for (const [namespace, keys] of Object.entries(keysByNamespace)) {
        const filePath = path.join(localeDir, `${namespace}${fileExtension}`);
        await fs.ensureDir(path.dirname(filePath));

        let currentTranslations: Record<string, string> = {};

        if (await fs.pathExists(filePath)) {
          try {
            let existingData: Record<string, any>;
            if (format === 'toml') {
              const content = await fs.readFile(filePath, 'utf-8');
              const saver = new TOMLFileSaver(localeDir);
              existingData = saver.parseTOML(content);
            } else {
              existingData = await fs.readJson(filePath);
            }
            currentTranslations = flattenObject(existingData);
          } catch {
            // Start fresh on read error
          }
        }

        for (const k of keys) {
          const finalKey = this.stripNamespacePrefix(k.key, namespace);
          if (!currentTranslations[finalKey]) {
            currentTranslations[finalKey] = k.defaultValue ?? finalKey;
            localeNewKeys++;
          }
        }

        const sorted: Record<string, string> = {};
        Object.keys(currentTranslations)
          .sort()
          .forEach((key) => (sorted[key] = currentTranslations[key]));

        const nested = unflattenObject(sorted);

        if (format === 'toml') {
          const saver = new TOMLFileSaver(localeDir);
          const tomlStr = saver.stringifyTOML(nested);
          await fs.writeFile(filePath, tomlStr, 'utf-8');
        } else {
          await fs.writeJson(filePath, nested, { spaces: 2 });
        }
      }

      newKeysPerLocale[locale] = localeNewKeys;
    }

    return {
      totalKeys,
      keysByNamespace,
      filesScanned: files.length,
      newKeysPerLocale,
      outputDir: absoluteOut,
    };
  }

  /**
   * Strips the namespace prefix from a key if present.
   * e.g. key="common.home.title", namespace="common" → "home.title"
   */
  private stripNamespacePrefix(key: string, namespace: string): string {
    const dotPrefix = `${namespace.replace(/\//g, '.')}.`;
    const colonPrefix = `${namespace.replace(/\//g, ':')}.`;
    if (key.startsWith(dotPrefix)) return key.slice(dotPrefix.length);
    if (key.startsWith(colonPrefix)) return key.slice(colonPrefix.length);
    return key;
  }
}
