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
import { JSONFileSaver } from '../adapters/JSONFileSaver';

export interface RecipeInput {
  localesDir: string;
  locale: string;
  namespace: string;
  key: string;
  value: string;
  cwd: string;
}

export interface RecipeResult {
  filePath: string;
  key: string;
  value: string;
  isNew: boolean;
}

export class RecipeUseCase {
  async execute(input: RecipeInput): Promise<RecipeResult> {
    const { locale, namespace, key, value, cwd } = input;
    const localesDir = path.isAbsolute(input.localesDir)
      ? input.localesDir
      : path.join(cwd, input.localesDir);

    this.validatePathSegment(locale, 'locale');
    this.validatePathSegment(namespace, 'namespace');
    this.validateKey(key);

    const filePath = path.join(localesDir, locale, `${namespace}.json`);
    
    let isNew = true;
    if (await fs.pathExists(filePath)) {
      try {
        const content = await fs.readJson(filePath);
        const existing = this.getDeepKey(content, key);
        isNew = existing === undefined;
      } catch {
        // File exists but is malformed — start fresh
      }
    }

    const saver = new JSONFileSaver(localesDir, 'nested');
    await saver.save(locale, namespace, key, value, true);

    return { filePath, key, value, isNew };
  }

  private validatePathSegment(segment: string, name: string): void {
    if (!segment) throw new Error(`${name} is required`);
    if (segment.includes('..') || segment.includes('\\') || segment.includes('/') || path.isAbsolute(segment)) {
      throw new Error(`Invalid ${name} path segment`);
    }
  }

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

  private getDeepKey(obj: any, pathStr: string): any {
    return pathStr.split('.').reduce((o, k) => (o && o[k] !== 'undefined' ? o[k] : undefined), obj);
  }
}
