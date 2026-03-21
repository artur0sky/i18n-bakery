/**
 * 🥯 i18n-bakery/tray - PantryUseCase (Use Case Layer)
 *
 * Inspects the translation files to produce a structured status report:
 * which locales exist, which keys are missing, and completion percentage.
 *
 * This is the most valuable use case for AI agents — it answers:
 * "What translations are missing, and where?"
 *
 * SRP: Only responsible for reading and comparing locale files.
 *
 * @module use-cases/PantryUseCase
 */

import path from 'path';
import fs from 'fs-extra';
import type { PantryInput, PantryResult, LocaleStatus } from '../domain/types';
import { flattenObject } from '../shared/utils';

/**
 * Analyzes the pantry (locale directory) and returns a full status report
 * comparing all locales against a reference locale.
 */
export class PantryUseCase {
  async execute(input: PantryInput): Promise<PantryResult> {
    const { cwd } = input;
    const localesDir = path.isAbsolute(input.localesDir)
      ? input.localesDir
      : path.join(cwd, input.localesDir);

    if (!(await fs.pathExists(localesDir))) {
      throw new Error(`Locales directory not found: ${localesDir}`);
    }

    const entries = await fs.readdir(localesDir);
    const locales: string[] = [];

    for (const entry of entries) {
      const stat = await fs.stat(path.join(localesDir, entry));
      if (stat.isDirectory()) locales.push(entry);
    }

    if (locales.length === 0) {
      throw new Error(`No locale directories found in: ${localesDir}`);
    }

    // Determine reference locale
    const referenceLocale =
      input.referenceLocale ??
      locales.find((l) => l.startsWith('en')) ??
      locales[0];

    if (!locales.includes(referenceLocale)) {
      throw new Error(
        `Reference locale "${referenceLocale}" not found. Available: ${locales.join(', ')}`
      );
    }

    const referenceKeys = await this.collectAllKeys(localesDir, referenceLocale);
    const status: Record<string, LocaleStatus> = {};

    for (const locale of locales) {
      const localeKeys = await this.collectAllKeys(localesDir, locale);
      const missingKeyList = referenceKeys
        .filter((k) => !localeKeys.includes(k))
        .sort();

      const totalKeys = referenceKeys.length;
      const presentKeys = totalKeys - missingKeyList.length;
      const completionPercent =
        totalKeys === 0 ? 100 : Math.round((presentKeys / totalKeys) * 100);

      status[locale] = {
        locale,
        totalKeys,
        presentKeys,
        missingKeys: missingKeyList.length,
        completionPercent,
        missingKeyList,
      };
    }

    return { referenceLocale, locales, status };
  }

  /**
   * Reads all JSON files in a locale directory and returns a flat list of keys
   * in the format "namespace/subns.key.subkey".
   */
  private async collectAllKeys(localesDir: string, locale: string): Promise<string[]> {
    const localeDir = path.join(localesDir, locale);
    const keys: string[] = [];

    await this.walkDirectory(localeDir, localeDir, keys);

    return keys;
  }

  private async walkDirectory(
    baseDir: string,
    currentDir: string,
    keys: string[]
  ): Promise<void> {
    let entries: string[];
    try {
      entries = await fs.readdir(currentDir);
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await this.walkDirectory(baseDir, fullPath, keys);
      } else if (entry.endsWith('.json')) {
        await this.extractKeysFromJsonFile(baseDir, fullPath, keys);
      }
    }
  }

  private async extractKeysFromJsonFile(
    baseDir: string,
    filePath: string,
    keys: string[]
  ): Promise<void> {
    try {
      const data = await fs.readJson(filePath);
      const flatData = flattenObject(data);

      // Namespace is the relative path without extension
      const relativePath = path.relative(baseDir, filePath);
      const namespace = relativePath.replace(/\\/g, '/').replace(/\.json$/, '');

      for (const key of Object.keys(flatData)) {
        keys.push(`${namespace}.${key}`);
      }
    } catch {
      // Silently skip malformed JSON files
    }
  }
}
