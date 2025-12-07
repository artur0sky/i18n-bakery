import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSONFileSaver } from '../src/adapters/node/JSONFileSaver';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

describe('JSONFileSaver - File Structure', () => {
  let tempDir: string;
  let saver: JSONFileSaver;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = path.join(os.tmpdir(), `i18n-bakery-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Nested structure (default)', () => {
    beforeEach(() => {
      saver = new JSONFileSaver(tempDir, 'nested');
    });

    it('should create nested JSON structure for dotted keys', async () => {
      await saver.save('en', 'common', 'home.title', 'Welcome Home');
      await saver.save('en', 'common', 'home.subtitle', 'Your dashboard');
      await saver.save('en', 'common', 'about.title', 'About Us');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      expect(content).toEqual({
        about: {
          title: 'About Us'
        },
        home: {
          subtitle: 'Your dashboard',
          title: 'Welcome Home'
        }
      });
    });

    it('should handle deeply nested keys', async () => {
      await saver.save('en', 'common', 'menu.items.home.label', 'Home');
      await saver.save('en', 'common', 'menu.items.about.label', 'About');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      expect(content).toEqual({
        menu: {
          items: {
            about: {
              label: 'About'
            },
            home: {
              label: 'Home'
            }
          }
        }
      });
    });
  });

  describe('Flat structure', () => {
    beforeEach(() => {
      saver = new JSONFileSaver(tempDir, 'flat');
    });

    it('should create flat JSON structure for dotted keys', async () => {
      await saver.save('en', 'common', 'home.title', 'Welcome Home');
      await saver.save('en', 'common', 'home.subtitle', 'Your dashboard');
      await saver.save('en', 'common', 'about.title', 'About Us');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      expect(content).toEqual({
        'about.title': 'About Us',
        'home.subtitle': 'Your dashboard',
        'home.title': 'Welcome Home'
      });
    });

    it('should handle keys without dots', async () => {
      await saver.save('en', 'common', 'title', 'Welcome');
      await saver.save('en', 'common', 'subtitle', 'Dashboard');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      expect(content).toEqual({
        subtitle: 'Dashboard',
        title: 'Welcome'
      });
    });
  });

  describe('Default behavior', () => {
    it('should use nested structure when no fileStructure is specified', async () => {
      saver = new JSONFileSaver(tempDir); // No second parameter

      await saver.save('en', 'common', 'home.title', 'Welcome Home');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      expect(content).toEqual({
        home: {
          title: 'Welcome Home'
        }
      });
    });
  });

  describe('Sorting', () => {
    it('should sort keys alphabetically in nested structure', async () => {
      saver = new JSONFileSaver(tempDir, 'nested');

      await saver.save('en', 'common', 'zebra.name', 'Zebra');
      await saver.save('en', 'common', 'apple.name', 'Apple');
      await saver.save('en', 'common', 'banana.name', 'Banana');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const keys = Object.keys(JSON.parse(fileContent));

      expect(keys).toEqual(['apple', 'banana', 'zebra']);
    });

    it('should sort keys alphabetically in flat structure', async () => {
      saver = new JSONFileSaver(tempDir, 'flat');

      await saver.save('en', 'common', 'zebra.name', 'Zebra');
      await saver.save('en', 'common', 'apple.name', 'Apple');
      await saver.save('en', 'common', 'banana.name', 'Banana');

      const filePath = path.join(tempDir, 'en', 'common.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const keys = Object.keys(JSON.parse(fileContent));

      expect(keys).toEqual(['apple.name', 'banana.name', 'zebra.name']);
    });
  });
});
