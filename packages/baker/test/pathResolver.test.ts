/**
 * 🥯 i18n-bakery - Path Resolver Tests
 * 
 * Comprehensive tests for the FileSystemPathResolver adapter.
 * Ensures correct path resolution for different configurations.
 */

import { describe, it, expect } from 'vitest';
import { FileSystemPathResolver } from '../src/adapters/FileSystemPathResolver';
import { ParsedKey } from '../src/domain/KeyParser';

describe('FileSystemPathResolver', () => {
  describe('resolve', () => {
    it('should resolve a simple path with default extension', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: [],
        file: 'common',
        propertyPath: ['greeting'],
        originalKey: 'greeting',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('./locales/en/common.json');
    });

    it('should resolve a path with directories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('./locales/en/orders/meal.json');
    });

    it('should resolve a path with multiple directories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: ['app', 'features', 'orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'app:features:orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('./locales/en/app/features/orders/meal.json');
    });

    it('should respect custom extension', () => {
      const resolver = new FileSystemPathResolver({ 
        baseDir: './translations',
        extension: 'yaml'
      });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('./translations/en/orders/meal.yaml');
    });

    it('should handle different locales', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const enResult = resolver.resolve('en', parsed);
      const esResult = resolver.resolve('es-MX', parsed);
      const frResult = resolver.resolve('fr', parsed);

      expect(enResult).toBe('./locales/en/orders/meal.json');
      expect(esResult).toBe('./locales/es-MX/orders/meal.json');
      expect(frResult).toBe('./locales/fr/orders/meal.json');
    });
  });

  describe('getDirectoryPath', () => {
    it('should return directory path without file name', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const result = resolver.getDirectoryPath('en', parsed);
      expect(result).toBe('./locales/en/orders');
    });

    it('should return directory path with multiple directories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: ['app', 'features', 'orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'app:features:orders:meal.title',
      };

      const result = resolver.getDirectoryPath('en', parsed);
      expect(result).toBe('./locales/en/app/features/orders');
    });

    it('should return locale directory when no subdirectories', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './locales' });
      const parsed: ParsedKey = {
        directories: [],
        file: 'common',
        propertyPath: ['greeting'],
        originalKey: 'greeting',
      };

      const result = resolver.getDirectoryPath('en', parsed);
      expect(result).toBe('./locales/en');
    });
  });

  describe('configuration', () => {
    it('should work with absolute paths', () => {
      const resolver = new FileSystemPathResolver({ baseDir: '/var/app/locales' });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('/var/app/locales/en/orders/meal.json');
    });

    it('should work with Windows-style paths', () => {
      const resolver = new FileSystemPathResolver({ baseDir: 'C:\\\\app\\\\locales' });
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      // path.join handles platform-specific separators
      expect(result).toContain('locales');
      expect(result).toContain('orders');
      expect(result).toContain('meal.json');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical monorepo structure', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './packages/app/locales' });
      const parsed: ParsedKey = {
        directories: ['features', 'orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'features:orders:meal.title',
      };

      const result = resolver.resolve('en', parsed);
      expect(result).toBe('./packages/app/locales/en/features/orders/meal.json');
    });

    it('should handle Next.js public folder structure', () => {
      const resolver = new FileSystemPathResolver({ baseDir: './public/locales' });
      const parsed: ParsedKey = {
        directories: ['common'],
        file: 'navigation',
        propertyPath: ['home'],
        originalKey: 'common:navigation.home',
      };

      const result = resolver.resolve('en-US', parsed);
      expect(result).toBe('./public/locales/en-US/common/navigation.json');
    });
  });
});
