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
import { glob } from 'glob';
import { BabelKeyExtractor } from '@i18n-bakery/baker';
import type { PantryInput, PantryResult, LocaleStatus, ExtractedKeyInfo } from '../domain/types';
import { flattenObject } from '../shared/utils';

/**
 * Analyzes the pantry (locale directory) and returns a full status report
 * comparing all locales against a reference locale (and optionally source code).
 */
export class PantryUseCase {
  private extractor = new BabelKeyExtractor();

  async execute(input: PantryInput): Promise<PantryResult> {
    const { cwd, sourceDir } = input;
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

    // 1. Collect reference keys from JSON files
    const jsonReferenceKeys = await this.collectAllKeys(localesDir, referenceLocale);
    
    // 2. Optionally collect keys from source code
    let sourceKeys: ExtractedKeyInfo[] = [];
    if (sourceDir) {
      const absoluteSource = path.isAbsolute(sourceDir) ? sourceDir : path.join(cwd, sourceDir);
      if (await fs.pathExists(absoluteSource)) {
        const files = await glob(`${absoluteSource.replace(/\\/g, '/') }/**/*.{js,jsx,ts,tsx}`, {
          ignore: ['**/*.d.ts', '**/node_modules/**'],
        });
        
        for (const file of files) {
          const extracted = await this.extractor.extractFromFile(file);
          sourceKeys.push(...extracted);
        }
      }
    }

    // 3. Build a combined master key list with fallback info
    const masterKeyMap = new Map<string, { fallback?: string; file?: string; line?: number }>();
    
    // Add all keys from reference JSON
    for (const k of jsonReferenceKeys) {
      masterKeyMap.set(k, {});
    }
    
    // Add/Update keys from source code (with fallbacks!)
    const missingInReference: string[] = [];
    for (const sk of sourceKeys) {
        const fullKey = `${sk.namespace}.${sk.key}`;
        if (!masterKeyMap.has(fullKey)) {
            missingInReference.push(fullKey);
        }
        
        // Always prefer info from source (fallbacks are here)
        masterKeyMap.set(fullKey, {
            fallback: sk.defaultValue,
            file: path.relative(cwd, sk.file),
            line: sk.line
        });
    }

    const masterKeyList = Array.from(masterKeyMap.keys()).sort();
    const status: Record<string, LocaleStatus> = {};

    for (const locale of locales) {
      const localeKeys = await this.collectAllKeys(localesDir, locale);
      const missingKeyList = masterKeyList
        .filter((k) => !localeKeys.includes(k))
        .sort();

      const totalKeys = masterKeyList.length;
      const presentKeys = totalKeys - missingKeyList.length;
      const completionPercent =
        totalKeys === 0 ? 100 : Math.round((presentKeys / totalKeys) * 100);

      // Build details for missing keys
      const missingKeyDetails: Record<string, any> = {};
      for (const mk of missingKeyList) {
          const details = masterKeyMap.get(mk);
          if (details && (details.fallback || details.file)) {
              missingKeyDetails[mk] = details;
          }
      }

      status[locale] = {
        locale,
        totalKeys,
        presentKeys,
        missingKeys: missingKeyList.length,
        completionPercent,
        missingKeyList,
        missingKeyDetails: Object.keys(missingKeyDetails).length > 0 ? missingKeyDetails : undefined
      };
    }

    return { 
        referenceLocale, 
        locales, 
        status, 
        missingInReference: missingInReference.length > 0 ? missingInReference.sort() : undefined 
    };
  }

  /**
   * Reads all JSON files in a locale directory and returns a flat list of keys
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
      const relativePath = path.relative(baseDir, filePath);
      const namespace = relativePath.replace(/\\/g, '/').replace(/\.json$/, '');
      for (const key of Object.keys(flatData)) {
        keys.push(`${namespace}.${key}`);
      }
    } catch {}
  }
}
