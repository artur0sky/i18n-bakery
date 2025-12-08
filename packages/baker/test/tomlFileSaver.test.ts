/**
 * 🥯 i18n-bakery - TOML File Saver Tests
 * 
 * Tests for the TOMLFileSaver adapter.
 * Tests both nested and flat file structures.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TOMLFileSaver } from '../src/adapters/TOMLFileSaver';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('TOMLFileSaver', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for tests
    testDir = path.join(os.tmpdir(), `i18n-bakery-toml-saver-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  describe('Nested Structure', () => {
    it('should save simple translation in nested structure', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('title = "Welcome"');
      expect(content).toContain('Welcome');
    });

    it('should save nested keys in nested structure', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'home', 'header.title', 'Home Page');
      
      const filePath = path.join(testDir, 'en', 'home.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('[header]');
      expect(content).toContain('title = "Home Page"');
    });

    it('should save deeply nested keys', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'app', 'features.orders.meal.title', 'Pizza');
      
      const filePath = path.join(testDir, 'en', 'app.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('[features.orders.meal]');
      expect(content).toContain('title = "Pizza"');
    });

    it('should merge multiple keys in same file', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      await saver.save('en', 'common', 'subtitle', 'Hello World');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('title = "Welcome"');
      expect(content).toContain('subtitle = "Hello World"');
    });

    it('should preserve existing translations when adding new ones', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      await saver.save('en', 'common', 'description', 'A great app');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('title = "Welcome"');
      expect(content).toContain('description = "A great app"');
    });

    it('should sort keys alphabetically', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'zebra', 'Z');
      await saver.save('en', 'common', 'apple', 'A');
      await saver.save('en', 'common', 'banana', 'B');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      const appleIndex = content.indexOf('apple');
      const bananaIndex = content.indexOf('banana');
      const zebraIndex = content.indexOf('zebra');
      
      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });
  });

  describe('Flat Structure', () => {
    it('should save simple translation in flat structure', async () => {
      const saver = new TOMLFileSaver(testDir, 'flat');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('title = "Welcome"');
    });

    it('should save dotted keys as-is in flat structure', async () => {
      const saver = new TOMLFileSaver(testDir, 'flat');
      
      await saver.save('en', 'home', 'header.title', 'Home Page');
      
      const filePath = path.join(testDir, 'en', 'home.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      // In flat structure, the key should be quoted if it contains dots
      expect(content).toMatch(/"header\.title" = "Home Page"/);
    });

    it('should merge multiple keys in flat structure', async () => {
      const saver = new TOMLFileSaver(testDir, 'flat');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      await saver.save('en', 'common', 'subtitle', 'Hello World');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('title = "Welcome"');
      expect(content).toContain('subtitle = "Hello World"');
    });
  });

  describe('Multiple Locales', () => {
    it('should save translations for different locales', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'title', 'Welcome');
      await saver.save('es', 'common', 'title', 'Bienvenido');
      await saver.save('fr', 'common', 'title', 'Bienvenue');
      
      const enContent = await fs.readFile(path.join(testDir, 'en', 'common.toml'), 'utf-8');
      const esContent = await fs.readFile(path.join(testDir, 'es', 'common.toml'), 'utf-8');
      const frContent = await fs.readFile(path.join(testDir, 'fr', 'common.toml'), 'utf-8');
      
      expect(enContent).toContain('Welcome');
      expect(esContent).toContain('Bienvenido');
      expect(frContent).toContain('Bienvenue');
    });
  });

  describe('Multiple Namespaces', () => {
    it('should save translations in different namespaces', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'title', 'Common Title');
      await saver.save('en', 'home', 'title', 'Home Title');
      await saver.save('en', 'about', 'title', 'About Title');
      
      const commonContent = await fs.readFile(path.join(testDir, 'en', 'common.toml'), 'utf-8');
      const homeContent = await fs.readFile(path.join(testDir, 'en', 'home.toml'), 'utf-8');
      const aboutContent = await fs.readFile(path.join(testDir, 'en', 'about.toml'), 'utf-8');
      
      expect(commonContent).toContain('Common Title');
      expect(homeContent).toContain('Home Title');
      expect(aboutContent).toContain('About Title');
    });
  });

  describe('Special Characters', () => {
    it('should handle special characters in values', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'message', 'Line 1\nLine 2\tTabbed');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('\\n');
      expect(content).toContain('\\t');
    });

    it('should handle quotes in values', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'quote', 'He said "Hello"');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('\\"');
    });

    it('should handle backslashes in values', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'path', 'C:\\Users\\Documents');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('\\\\');
    });
  });

  describe('Variable Placeholders', () => {
    it('should preserve variable placeholders', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'common', 'greeting', 'Hello, {{name}}!');
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('{{name}}');
    });

    it('should preserve multiple variable placeholders', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en', 'orders', 'summary', '{{count}} items - Total: ${{amount}}');
      
      const filePath = path.join(testDir, 'en', 'orders.toml');
      const content = await fs.readFile(filePath, 'utf-8');
      
      expect(content).toContain('{{count}}');
      expect(content).toContain('{{amount}}');
    });
  });

  describe('Directory Creation', () => {
    it('should create locale directories automatically', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      await saver.save('en-US', 'common', 'title', 'Welcome');
      
      const dirExists = await fs.stat(path.join(testDir, 'en-US'))
        .then(() => true)
        .catch(() => false);
      
      expect(dirExists).toBe(true);
    });
  });

  describe('Round-trip', () => {
    it('should maintain data integrity through save-read cycle', async () => {
      const saver = new TOMLFileSaver(testDir, 'nested');
      
      const originalValue = 'Hello, {{name}}! You have {{count}} messages.';
      await saver.save('en', 'common', 'notification', originalValue);
      
      const filePath = path.join(testDir, 'en', 'common.toml');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse the TOML to verify
      const match = fileContent.match(/notification = "(.+)"/);
      expect(match).toBeDefined();
      
      // Unescape the value
      const savedValue = match![1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      
      expect(savedValue).toBe(originalValue);
    });
  });
});
