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
import { ProjectScanner } from './ProjectScanner';

export interface PantryInput {
  localesDir: string;
  sourceDir?: string;
  referenceLocale?: string;
  cwd: string;
}

export interface LocaleStatus {
  locale: string;
  totalKeys: number;
  presentKeys: number;
  missingKeys: number;
  completionPercent: number;
  missingKeyList: string[];
  missingKeyDetails?: Record<string, any>;
}

export interface PantryResult {
  referenceLocale: string;
  locales: string[];
  status: Record<string, LocaleStatus>;
  missingInReference?: string[];
}

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

export class PantryUseCase {
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

    const referenceLocale =
      input.referenceLocale ??
      locales.find((l) => l.startsWith('en')) ??
      locales[0];

    if (!locales.includes(referenceLocale)) {
      throw new Error(
        `Reference locale "${referenceLocale}" not found. Available: ${locales.join(', ')}`
      );
    }

    const jsonReferenceKeys = await this.collectAllKeys(localesDir, referenceLocale);
    
    let sourceKeys: any[] = [];
    if (sourceDir) {
      const scanner = new ProjectScanner();
      const result = await scanner.scan({ source: sourceDir, cwd });
      sourceKeys = result.keys;
    }

    const masterKeyMap = new Map<string, { fallback?: string; file?: string; line?: number }>();
    
    for (const k of jsonReferenceKeys) {
      masterKeyMap.set(k, {});
    }
    
    const missingInReference: string[] = [];
    for (const sk of sourceKeys) {
        let finalKey = sk.key;
        const slashRegex = new RegExp('/', 'g');
        const dotPrefix = `${sk.namespace.replace(slashRegex, '.')}.`;
        const colonPrefix = `${sk.namespace.replace(slashRegex, ':')}.`;
        if (finalKey.startsWith(dotPrefix)) {
          finalKey = finalKey.slice(dotPrefix.length);
        } else if (finalKey.startsWith(colonPrefix)) {
          finalKey = finalKey.slice(colonPrefix.length);
        }

        const fullKey = `${sk.namespace}.${finalKey}`;
        if (!masterKeyMap.has(fullKey)) {
            missingInReference.push(fullKey);
        }
        
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
