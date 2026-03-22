/**
 * 🥯 i18n-bakery/tray - Tests
 *
 * Tests for the four atomic use-cases that power the Tray MCP server.
 * Each test group covers the core logic in isolation.
 *
 * @module test/tray.test
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { BatterUseCase } from '../src/use-cases/BatterUseCase';
import { PantryUseCase } from '../src/use-cases/PantryUseCase';
import { RecipeUseCase } from '../src/use-cases/RecipeUseCase';
import { flattenObject, unflattenObject, setDeepKey, getDeepKey, validatePathSegment } from '../src/shared/utils';

// ─── Shared Utils ─────────────────────────────────────────────────────────────

describe('utils', () => {
  describe('flattenObject', () => {
    it('flattens nested objects with dot notation', () => {
      const input = { home: { title: 'Hi', sub: { key: 'val' } } };
      expect(flattenObject(input)).toEqual({ 'home.title': 'Hi', 'home.sub.key': 'val' });
    });

    it('handles already-flat objects', () => {
      const input = { title: 'Hi' };
      expect(flattenObject(input)).toEqual({ title: 'Hi' });
    });
  });

  describe('unflattenObject', () => {
    it('converts dot-notation keys to nested objects', () => {
      const input = { 'home.title': 'Hi', 'home.sub.key': 'val' };
      expect(unflattenObject(input)).toEqual({ home: { title: 'Hi', sub: { key: 'val' } } });
    });
  });

  describe('setDeepKey', () => {
    it('sets a nested key', () => {
      const obj: Record<string, any> = {};
      setDeepKey(obj, 'home.title', 'Hi');
      expect(obj.home.title).toBe('Hi');
    });
  });

  describe('getDeepKey', () => {
    it('gets a nested key', () => {
      const obj = { home: { title: 'Hi' } };
      expect(getDeepKey(obj, 'home.title')).toBe('Hi');
    });

    it('returns undefined for missing paths', () => {
      const obj = { home: {} };
      expect(getDeepKey(obj, 'home.missing.key')).toBeUndefined();
    });
  });

  describe('validatePathSegment', () => {
    it('allows valid locale segments', () => {
      expect(() => validatePathSegment('en-US', 'locale')).not.toThrow();
      expect(() => validatePathSegment('es-MX', 'locale')).not.toThrow();
    });

    it('rejects path traversal', () => {
      expect(() => validatePathSegment('../etc/passwd', 'locale')).toThrow();
    });

    it('rejects absolute paths', () => {
      expect(() => validatePathSegment('/etc/passwd', 'locale')).toThrow();
    });
  });
});

// ─── PantryUseCase ────────────────────────────────────────────────────────────

describe('PantryUseCase', () => {
  let tmpDir: string;
  const useCase = new PantryUseCase();

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tray-test-pantry-'));

    // Create mock locale structure
    const enDir = path.join(tmpDir, 'en-US');
    const esDir = path.join(tmpDir, 'es-MX');
    await fs.ensureDir(enDir);
    await fs.ensureDir(esDir);

    await fs.writeJson(path.join(enDir, 'common.json'), {
      home: { title: 'Home', subtitle: 'Welcome' },
      buttons: { save: 'Save', cancel: 'Cancel' },
    });

    await fs.writeJson(path.join(esDir, 'common.json'), {
      home: { title: 'Inicio' },
      // Missing: home.subtitle, buttons.save, buttons.cancel
    });
  });

  afterAll(async () => {
    await fs.remove(tmpDir);
  });

  it('detects missing keys in non-reference locale', async () => {
    const result = await useCase.execute({ localesDir: tmpDir, cwd: tmpDir });
    expect(result.referenceLocale).toBe('en-US');
    expect(result.locales).toContain('es-MX');

    const esStatus = result.status['es-MX'];
    expect(esStatus.missingKeys).toBe(3);
    expect(esStatus.completionPercent).toBeLessThan(100);
    expect(esStatus.missingKeyList).toContain('common.home.subtitle');
  });

  it('reference locale has 100% completion', async () => {
    const result = await useCase.execute({ localesDir: tmpDir, cwd: tmpDir });
    const enStatus = result.status['en-US'];
    expect(enStatus.completionPercent).toBe(100);
    expect(enStatus.missingKeys).toBe(0);
  });
});

// ─── RecipeUseCase ───────────────────────────────────────────────────────────

describe('RecipeUseCase', () => {
  let tmpDir: string;
  const useCase = new RecipeUseCase();

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tray-test-recipe-'));
    await fs.ensureDir(path.join(tmpDir, 'es-MX'));
    await fs.writeJson(path.join(tmpDir, 'es-MX', 'common.json'), {
      home: { title: 'Inicio' },
    });
  });

  afterAll(async () => {
    await fs.remove(tmpDir);
  });

  it('creates a new key', async () => {
    const result = await useCase.execute({
      locale: 'es-MX',
      namespace: 'common',
      key: 'home.subtitle',
      value: 'Bienvenido',
      localesDir: tmpDir,
      cwd: tmpDir,
    });

    expect(result.isNew).toBe(true);
    expect(result.value).toBe('Bienvenido');

    const file = await fs.readJson(result.filePath);
    expect(file.home.subtitle).toBe('Bienvenido');
  });

  it('updates an existing key', async () => {
    const result = await useCase.execute({
      locale: 'es-MX',
      namespace: 'common',
      key: 'home.title',
      value: 'Página Principal',
      localesDir: tmpDir,
      cwd: tmpDir,
    });

    expect(result.isNew).toBe(false);

    const file = await fs.readJson(result.filePath);
    expect(file.home.title).toBe('Página Principal');
  });

  it('rejects path traversal in locale', async () => {
    await expect(
      useCase.execute({
        locale: '../evil',
        namespace: 'common',
        key: 'test',
        value: 'value',
        localesDir: tmpDir,
        cwd: tmpDir,
      })
    ).rejects.toThrow();
  });
});
