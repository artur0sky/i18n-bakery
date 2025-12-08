/**
 * Integration tests for format compatibility (JSON & TOML)
 * 
 * These tests verify that the CLI can extract and compile translations
 * in both JSON and TOML formats.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { batter } from '../src/commands/batter';
import { bake } from '../src/commands/bake';

const TEST_DIR = path.join(__dirname, 'tmp-format-test');
const SOURCE_DIR = path.join(TEST_DIR, 'src');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');
const DIST_DIR = path.join(TEST_DIR, 'dist');

describe('Format Compatibility Tests', () => {
  beforeEach(async () => {
    // Clean up and create test directories
    await fs.remove(TEST_DIR);
    await fs.ensureDir(SOURCE_DIR);
    await fs.ensureDir(LOCALES_DIR);
    
    // Create a sample source file with translations
    const sampleCode = `
import { useTranslation } from '@i18n-bakery/react';

function App() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <button>{t('actions.save')}</button>
      <button>{t('actions.cancel')}</button>
    </div>
  );
}
`;
    await fs.writeFile(path.join(SOURCE_DIR, 'App.tsx'), sampleCode, 'utf-8');
  });

  afterEach(async () => {
    // Clean up test directories
    await fs.remove(TEST_DIR);
  });

  describe('Batter Command (Extraction)', () => {
    it('should extract translations to JSON format', async () => {
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      const commonFile = path.join(LOCALES_DIR, 'en', 'common.json');
      const actionsFile = path.join(LOCALES_DIR, 'en', 'actions.json');
      
      expect(await fs.pathExists(commonFile)).toBe(true);
      expect(await fs.pathExists(actionsFile)).toBe(true);

      const commonContent = await fs.readJson(commonFile);
      expect(commonContent).toHaveProperty('welcome');
      expect(commonContent).toHaveProperty('description');
      
      const actionsContent = await fs.readJson(actionsFile);
      expect(actionsContent).toHaveProperty('save');
      expect(actionsContent).toHaveProperty('cancel');
    });

    it('should extract translations to TOML format', async () => {
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      const commonFile = path.join(LOCALES_DIR, 'en', 'common.toml');
      const actionsFile = path.join(LOCALES_DIR, 'en', 'actions.toml');
      
      expect(await fs.pathExists(commonFile)).toBe(true);
      expect(await fs.pathExists(actionsFile)).toBe(true);

      const commonContent = await fs.readFile(commonFile, 'utf-8');
      expect(commonContent).toContain('welcome');
      expect(commonContent).toContain('description');
      
      const actionsContent = await fs.readFile(actionsFile, 'utf-8');
      expect(actionsContent).toContain('save');
      expect(actionsContent).toContain('cancel');
    });

    it('should extract to multiple locales in JSON', async () => {
      await batter(SOURCE_DIR, {
        locale: 'en,es,fr',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      expect(await fs.pathExists(path.join(LOCALES_DIR, 'en', 'common.json'))).toBe(true);
      expect(await fs.pathExists(path.join(LOCALES_DIR, 'es', 'common.json'))).toBe(true);
      expect(await fs.pathExists(path.join(LOCALES_DIR, 'fr', 'common.json'))).toBe(true);
    });

    it('should extract to multiple locales in TOML', async () => {
      await batter(SOURCE_DIR, {
        locale: 'en,es,fr',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      expect(await fs.pathExists(path.join(LOCALES_DIR, 'en', 'common.toml'))).toBe(true);
      expect(await fs.pathExists(path.join(LOCALES_DIR, 'es', 'common.toml'))).toBe(true);
      expect(await fs.pathExists(path.join(LOCALES_DIR, 'fr', 'common.toml'))).toBe(true);
    });

    it('should merge new keys with existing JSON file', async () => {
      // First extraction
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      // Add a new translation key to source
      const newCode = `
import { useTranslation } from '@i18n-bakery/react';

function NewComponent() {
  const { t } = useTranslation('common');
  return <span>{t('newKey')}</span>;
}
`;
      await fs.writeFile(path.join(SOURCE_DIR, 'NewComponent.tsx'), newCode, 'utf-8');

      // Second extraction
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      const content = await fs.readJson(path.join(LOCALES_DIR, 'en', 'common.json'));
      expect(content).toHaveProperty('welcome');
      expect(content).toHaveProperty('newKey');
    });

    it('should merge new keys with existing TOML file', async () => {
      // First extraction
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      // Add a new translation key to source
      const newCode = `
import { useTranslation } from '@i18n-bakery/react';

function NewComponent() {
  const { t } = useTranslation('common');
  return <span>{t('newKey')}</span>;
}
`;
      await fs.writeFile(path.join(SOURCE_DIR, 'NewComponent.tsx'), newCode, 'utf-8');

      // Second extraction
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      const content = await fs.readFile(path.join(LOCALES_DIR, 'en', 'common.toml'), 'utf-8');
      expect(content).toContain('welcome');
      expect(content).toContain('newKey');
    });
  });

  describe('Bake Command (Compilation)', () => {
    it('should compile JSON files', async () => {
      // First extract
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      // Then bake
      await bake(LOCALES_DIR, {
        out: DIST_DIR,
        verbose: false,
      });

      const compiledFile = path.join(DIST_DIR, 'en.json');
      expect(await fs.pathExists(compiledFile)).toBe(true);

      const content = await fs.readJson(compiledFile);
      expect(content).toHaveProperty('common');
      expect(content.common).toHaveProperty('welcome');
    });

    it('should compile TOML files', async () => {
      // First extract to TOML
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      // Then bake TOML files
      await bake(LOCALES_DIR, {
        out: DIST_DIR,
        verbose: false,
      });

      const compiledFile = path.join(DIST_DIR, 'en.json');
      expect(await fs.pathExists(compiledFile)).toBe(true);

      const content = await fs.readJson(compiledFile);
      expect(content).toHaveProperty('common');
      expect(content.common).toHaveProperty('welcome');
      expect(content).toHaveProperty('actions');
      expect(content.actions).toHaveProperty('save');
    });
  });

  describe('Round-trip Tests', () => {
    it('should preserve data in JSON round-trip', async () => {
      // Extract
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      const originalContent = await fs.readJson(path.join(LOCALES_DIR, 'en', 'common.json'));

      // Manually update a translation
      originalContent.welcome = 'Welcome to our app!';
      await fs.writeJson(path.join(LOCALES_DIR, 'en', 'common.json'), originalContent, { spaces: 2 });

      // Extract again (should preserve manual edits)
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'json',
        verbose: false,
      });

      const updatedContent = await fs.readJson(path.join(LOCALES_DIR, 'en', 'common.json'));
      expect(updatedContent.welcome).toBe('Welcome to our app!');
    });

    it('should preserve data in TOML round-trip', async () => {
      // Extract
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      // Read and manually update
      const tomlContent = (await fs.readFile(path.join(LOCALES_DIR, 'en', 'common.toml'), 'utf-8')) as string;
      const updatedTomlContent = tomlContent.replace(/welcome = ".*"/, 'welcome = "Welcome to our app!"');
      await fs.writeFile(path.join(LOCALES_DIR, 'en', 'common.toml'), updatedTomlContent, 'utf-8');

      // Extract again (should preserve manual edits)
      await batter(SOURCE_DIR, {
        locale: 'en',
        out: LOCALES_DIR,
        format: 'toml',
        verbose: false,
      });

      const updatedContent = (await fs.readFile(path.join(LOCALES_DIR, 'en', 'common.toml'), 'utf-8')) as string;
      expect(updatedContent).toContain('welcome = "Welcome to our app!"');
    });
  });
});
