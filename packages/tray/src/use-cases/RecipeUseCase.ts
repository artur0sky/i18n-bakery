/**
 * 🥯 i18n-bakery/tray - RecipeUseCase (Use Case Layer)
 *
 * Writes or updates a specific translation key in a locale file.
 * This is the "write" capability that allows AI agents to directly
 * persist translated strings without manual editing.
 *
 * SRP: Only responsible for writing a single key to a locale file.
 * OCP: Format detection is done via strategy selection.
 *
 * @module use-cases/RecipeUseCase
 */

import path from 'path';
import fs from 'fs-extra';
import type { RecipeInput, RecipeResult } from '../domain/types';
import { validatePathSegment, setDeepKey, getDeepKey } from '../shared/utils';

/**
 * Writes a translation key to the appropriate locale file.
 * Handles create-or-update logic with deep key merging.
 */
export class RecipeUseCase {
  async execute(input: RecipeInput): Promise<RecipeResult> {
    const { locale, namespace, key, value, cwd } = input;
    const localesDir = path.isAbsolute(input.localesDir)
      ? input.localesDir
      : path.join(cwd, input.localesDir);

    // Security: validate all user-provided path segments
    validatePathSegment(locale, 'locale');
    validatePathSegment(namespace, 'namespace');
    this.validateKey(key);

    const filePath = path.join(localesDir, locale, `${namespace}.json`);
    await fs.ensureDir(path.dirname(filePath));

    let content: Record<string, any> = {};
    let isNew = true;

    if (await fs.pathExists(filePath)) {
      try {
        content = await fs.readJson(filePath);
        const existing = getDeepKey(content, key);
        isNew = existing === undefined;
      } catch {
        // File exists but is malformed — start fresh
      }
    }

    setDeepKey(content, key, value);

    // Sort the top-level keys alphabetically for consistency with the bakery
    const sorted = this.sortTopLevelKeys(content);

    await fs.writeJson(filePath, sorted, { spaces: 2 });

    return { filePath, key, value, isNew };
  }

  /**
   * Validates a dot-notation key for path traversal and banned characters.
   */
  private validateKey(key: string): void {
    if (!key || key.trim().length === 0) {
      throw new Error('Key cannot be empty');
    }
    if (key.includes('..') || key.includes('/') || key.includes('\\')) {
      throw new Error(`Invalid key: "${key}" contains forbidden characters`);
    }
    const parts = key.split('.');
    for (const part of parts) {
      if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
        throw new Error(`Invalid key: "${key}" contains prototype pollution vector`);
      }
    }
  }

  /**
   * Sorts the top-level keys of an object alphabetically.
   * Nested keys are left as-is to preserve author intent.
   */
  private sortTopLevelKeys(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    Object.keys(obj)
      .sort()
      .forEach((k) => (sorted[k] = obj[k]));
    return sorted;
  }
}
