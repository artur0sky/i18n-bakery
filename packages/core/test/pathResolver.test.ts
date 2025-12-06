import { describe, it, expect } from 'vitest';
import { FileSystemPathResolver } from '../src/adapters/FileSystemPathResolver';
import { DefaultKeyParser } from '../src/adapters/DefaultKeyParser';
import * as path from 'path';

describe('FileSystemPathResolver - Phase 7.2', () => {
  const parser = new DefaultKeyParser();

  describe('resolve()', () => {
    it('should resolve path with directories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('orders:meal.orderComponent.title');
      
      const result = resolver.resolve('en', parsed);
      const expected = path.join('./locales', 'en', 'orders', 'meal', 'orderComponent.json');
      
      expect(result).toBe(expected);
    });

    it('should resolve path without directories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('common.hello');
      
      const result = resolver.resolve('en', parsed);
      const expected = path.join('./locales', 'en', 'common.json');
      
      expect(result).toBe(expected);
    });

    it('should resolve path with multiple directory levels', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('app:features:orders.list.header');
      
      const result = resolver.resolve('en', parsed);
      const expected = path.join('./locales', 'en', 'app', 'features', 'orders', 'list.json');
      
      expect(result).toBe(expected);
    });

    it('should use custom extension', () => {
      const resolver = new FileSystemPathResolver({ 
        baseDir: './locales',
        extension: 'yaml'
      });
      const parsed = parser.parse('common.hello');
      
      const result = resolver.resolve('en', parsed);
      const expected = path.join('./locales', 'en', 'common.yaml');
      
      expect(result).toBe(expected);
    });

    it('should handle different locales', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('orders:meal.title');
      
      const resultEn = resolver.resolve('en', parsed);
      const resultEs = resolver.resolve('es-MX', parsed);
      
      expect(resultEn).toBe(path.join('./locales', 'en', 'orders', 'meal.json'));
      expect(resultEs).toBe(path.join('./locales', 'es-MX', 'orders', 'meal.json'));
    });

    it('should handle absolute base directory', () => {
      const resolver = new FileSystemPathResolver({ baseDir: '/var/app/locales' });
      const parsed = parser.parse('common.hello');
      
      const result = resolver.resolve('en', parsed);
      const expected = path.join('/var/app/locales', 'en', 'common.json');
      
      expect(result).toBe(expected);
    });
  });

  describe('getBaseDir()', () => {
    it('should return the configured base directory', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      expect(resolver.getBaseDir()).toBe('./locales');
    });
  });

  describe('getDirectoryPath()', () => {
    it('should return directory path without file name', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('orders:meal.orderComponent.title');
      
      const result = resolver.getDirectoryPath('en', parsed);
      const expected = path.join('./locales', 'en', 'orders', 'meal');
      
      expect(result).toBe(expected);
    });

    it('should return directory path without subdirectories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed = parser.parse('common.hello');
      
      const result = resolver.getDirectoryPath('en', parsed);
      const expected = path.join('./locales', 'en');
      
      expect(result).toBe(expected);
    });
  });

  describe('Integration - Full workflow', () => {
    it('should parse key and resolve to correct path', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      
      const testCases = [
        {
          key: 'orders:meal.orderComponent.title',
          locale: 'en',
          expected: path.join('./locales', 'en', 'orders', 'meal', 'orderComponent.json')
        },
        {
          key: 'common.hello',
          locale: 'es-MX',
          expected: path.join('./locales', 'es-MX', 'common.json')
        },
        {
          key: 'app:features:orders.list.header',
          locale: 'fr',
          expected: path.join('./locales', 'fr', 'app', 'features', 'orders', 'list.json')
        }
      ];

      testCases.forEach(({ key, locale, expected }) => {
        const parsed = parser.parse(key);
        const result = resolver.resolve(locale, parsed);
        expect(result).toBe(expected);
      });
    });
  });
});
