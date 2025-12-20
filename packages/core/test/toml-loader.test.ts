/**
 * Tests for TOMLLoader
 * 
 * Verifies that the TOMLLoader can correctly load and parse TOML translation files.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { TOMLLoader } from '../src/adapters/TOMLLoader';

const TEST_DIR = path.join(__dirname, 'tmp-toml-loader-test');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');

// Helper functions
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function remove(dirPath: string): Promise<void> {
  for (let i = 0; i < 5; i++) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
      return;
    } catch (error: any) {
      if (error.code === 'ENOENT') return;
      if (error.code === 'EBUSY' || error.code === 'EPERM') {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      throw error;
    }
  }
}

describe('TOMLLoader', () => {
  beforeEach(async () => {
    // Clean up and create test directories
    await remove(TEST_DIR);
    await ensureDir(LOCALES_DIR);
    
    // Create sample TOML files
    const enCommonToml = `
welcome = "Welcome"
description = "This is a description"

[actions]
save = "Save"
cancel = "Cancel"
`;
    
    const enActionsToml = `
submit = "Submit"
delete = "Delete"
`;
    
    const esCommonToml = `
welcome = "Bienvenido"
description = "Esta es una descripción"

[actions]
save = "Guardar"
cancel = "Cancelar"
`;
    
    await ensureDir(path.join(LOCALES_DIR, 'en'));
    await ensureDir(path.join(LOCALES_DIR, 'es'));
    
    await fs.writeFile(path.join(LOCALES_DIR, 'en', 'common.toml'), enCommonToml, 'utf-8');
    await fs.writeFile(path.join(LOCALES_DIR, 'en', 'actions.toml'), enActionsToml, 'utf-8');
    await fs.writeFile(path.join(LOCALES_DIR, 'es', 'common.toml'), esCommonToml, 'utf-8');
  });

  afterEach(async () => {
    // Clean up test directories
    await remove(TEST_DIR);
  });

  describe('load()', () => {
    it('should load a TOML file and parse it correctly', async () => {
      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'common');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('welcome', 'Welcome');
      expect(translations).toHaveProperty('description', 'This is a description');
      expect(translations).toHaveProperty('actions');
      expect((translations as any).actions).toHaveProperty('save', 'Save');
      expect((translations as any).actions).toHaveProperty('cancel', 'Cancel');
    });

    it('should load different namespaces', async () => {
      const loader = new TOMLLoader(LOCALES_DIR);
      const actionsTranslations = await loader.load('en', 'actions');

      expect(actionsTranslations).not.toBeNull();
      expect(actionsTranslations).toHaveProperty('submit', 'Submit');
      expect(actionsTranslations).toHaveProperty('delete', 'Delete');
    });

    it('should load different locales', async () => {
      const loader = new TOMLLoader(LOCALES_DIR);
      const esTranslations = await loader.load('es', 'common');

      expect(esTranslations).not.toBeNull();
      expect(esTranslations).toHaveProperty('welcome', 'Bienvenido');
      expect(esTranslations).toHaveProperty('description', 'Esta es una descripción');
      expect((esTranslations as any).actions).toHaveProperty('save', 'Guardar');
    });

    it('should return null for non-existent files', async () => {
      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'nonexistent');

      expect(translations).toBeNull();
    });

    it('should return null for non-existent locales', async () => {
      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('fr', 'common');

      expect(translations).toBeNull();
    });

    it('should handle nested namespaces', async () => {
      // Create a nested namespace file
      await ensureDir(path.join(LOCALES_DIR, 'en', 'home'));
      const nestedToml = `
title = "Home Title"
subtitle = "Home Subtitle"
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'home', 'hero.toml'), nestedToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'home/hero');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('title', 'Home Title');
      expect(translations).toHaveProperty('subtitle', 'Home Subtitle');
    });

    it('should handle special characters in values', async () => {
      const specialToml = `
quote = "He said \\"Hello\\""
newline = "Line 1\\nLine 2"
tab = "Column 1\\tColumn 2"
backslash = "Path: C:\\\\Users\\\\Name"
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'special.toml'), specialToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'special');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('quote', 'He said "Hello"');
      expect(translations).toHaveProperty('newline', 'Line 1\nLine 2');
      expect(translations).toHaveProperty('tab', 'Column 1\tColumn 2');
      expect(translations).toHaveProperty('backslash', 'Path: C:\\Users\\Name');
    });

    it('should handle numbers and booleans', async () => {
      const typesToml = `
count = 42
price = 19.99
enabled = true
disabled = false
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'types.toml'), typesToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'types');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('count', 42);
      expect(translations).toHaveProperty('price', 19.99);
      expect(translations).toHaveProperty('enabled', true);
      expect(translations).toHaveProperty('disabled', false);
    });

    it('should handle arrays', async () => {
      const arrayToml = `
colors = ["red", "green", "blue"]
numbers = [1, 2, 3]
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'arrays.toml'), arrayToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'arrays');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('colors');
      expect((translations as any).colors).toEqual(['red', 'green', 'blue']);
      expect((translations as any).numbers).toEqual([1, 2, 3]);
    });

    it('should handle comments', async () => {
      const commentToml = `
# This is a comment
title = "Title"
# Another comment
description = "Description"
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'comments.toml'), commentToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'comments');

      expect(translations).not.toBeNull();
      expect(translations).toHaveProperty('title', 'Title');
      expect(translations).toHaveProperty('description', 'Description');
      expect(Object.keys(translations as any)).toHaveLength(2);
    });

    it('should handle deeply nested tables', async () => {
      const nestedToml = `
[user]
name = "John"

[user.profile]
age = 30

[user.profile.address]
city = "New York"
`;
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'nested.toml'), nestedToml, 'utf-8');

      const loader = new TOMLLoader(LOCALES_DIR);
      const translations = await loader.load('en', 'nested');

      expect(translations).not.toBeNull();
      expect((translations as any).user).toHaveProperty('name', 'John');
      expect((translations as any).user.profile).toHaveProperty('age', 30);
      expect((translations as any).user.profile.address).toHaveProperty('city', 'New York');
    });
  });
});
