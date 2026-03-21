/**
 * 🥯 i18n-bakery - Key Parser Tests
 * 
 * Comprehensive tests for the DefaultKeyParser adapter.
 * Ensures correct parsing of translation keys following Phase 7 spec.
 */

import { describe, it, expect } from 'vitest';
import { DefaultKeyParser } from '../src/adapters/DefaultKeyParser';

describe('DefaultKeyParser', () => {
  const parser = new DefaultKeyParser();

  describe('normalize', () => {
    it('should trim whitespace', () => {
      expect(parser.normalize('  orders:meal.title  ')).toBe('orders:meal.title');
    });

    it('should remove duplicate colons', () => {
      expect(parser.normalize('orders::meal.title')).toBe('orders:meal.title');
      expect(parser.normalize('orders:::meal.title')).toBe('orders:meal.title');
    });

    it('should remove duplicate dots', () => {
      expect(parser.normalize('orders:meal..title')).toBe('orders:meal.title');
      expect(parser.normalize('orders:meal...title')).toBe('orders:meal.title');
    });

    it('should remove leading/trailing separators', () => {
      expect(parser.normalize(':orders:meal.title:')).toBe('orders:meal.title');
      expect(parser.normalize('.orders:meal.title.')).toBe('orders:meal.title');
    });

    it('should handle empty strings', () => {
      expect(parser.normalize('')).toBe('');
      expect(parser.normalize('   ')).toBe('');
    });

    it('should handle complex malformed keys', () => {
      expect(parser.normalize('  ::orders::meal...title..  ')).toBe('orders:meal.title');
    });
  });

  describe('parse - simple keys', () => {
    it('should parse a simple key without separators', () => {
      const result = parser.parse('title');
      expect(result).toEqual({
        directories: [],
        file: 'common',
        propertyPath: ['title'],
        originalKey: 'title',
      });
    });

    it('should parse a key with file and property', () => {
      const result = parser.parse('meal.title');
      expect(result).toEqual({
        directories: [],
        file: 'global',
        propertyPath: ['meal', 'title'],
        originalKey: 'meal.title',
      });
    });
  });

  describe('parse - keys with directories (colon separator)', () => {
    it('should parse a key with one directory', () => {
      const result = parser.parse('orders:meal.title');
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      });
    });

    it('should parse a key with nested properties after one colon', () => {
      const result = parser.parse('orders:meal.orderComponent.title');
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['orderComponent', 'title'],
        originalKey: 'orders:meal.orderComponent.title',
      });
    });

    it('should parse a key with three directory levels', () => {
      const result = parser.parse('app:orders:meal.title');
      expect(result).toEqual({
        directories: ['app', 'orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'app:orders:meal.title',
      });
    });
  });

  describe('parse - keys with nested properties', () => {
    it('should parse a key with nested property path', () => {
      const result = parser.parse('orders:meal.user.profile.name');
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['user', 'profile', 'name'],
        originalKey: 'orders:meal.user.profile.name',
      });
    });
  });

  describe('parse - dot-based global file', () => {
    it('should treat multiple dots as nested properties in global file when no colon present', () => {
      // NO colons: All dots are nested properties in 'global' file
      // orders.meal.component.title → file: 'global', props: ['orders', 'meal', 'component', 'title']
      const result = parser.parse('orders.meal.component.title');
      expect(result).toEqual({
        directories: [],
        file: 'global',
        propertyPath: ['orders', 'meal', 'component', 'title'],
        originalKey: 'orders.meal.component.title',
      });
    });

    it('should handle five-segment dot notation', () => {
      const result = parser.parse('app.orders.meal.component.title');
      expect(result).toEqual({
        directories: [],
        file: 'global',
        propertyPath: ['app', 'orders', 'meal', 'component', 'title'],
        originalKey: 'app.orders.meal.component.title',
      });
    });
  });

  describe('parse - edge cases', () => {
    it('should handle empty string', () => {
      const result = parser.parse('');
      expect(result).toEqual({
        directories: [],
        file: 'common',
        propertyPath: [''],
        originalKey: '',
      });
    });

    it('should handle malformed keys with normalization', () => {
      const result = parser.parse('  orders::meal..title  ');
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: '  orders::meal..title  ',
      });
    });

    it('should preserve original key even when normalized', () => {
      const result = parser.parse('  orders:meal.title  ');
      expect(result.originalKey).toBe('  orders:meal.title  ');
    });
  });

  describe('parse - i18next compatibility', () => {
    it('should parse i18next-style ns:key notation', () => {
      const result = parser.parse('auth:login');
      expect(result).toEqual({
        directories: [],
        file: 'auth',
        propertyPath: ['login'],
        originalKey: 'auth:login',
      });
    });

    it('should parse i18next-style with nested key', () => {
      const result = parser.parse('auth:login.button');
      expect(result).toEqual({
        directories: ['auth'],
        file: 'login',
        propertyPath: ['button'],
        originalKey: 'auth:login.button',
      });
    });
  });

  describe('parse - real-world examples', () => {
    it('should parse complex real-world key', () => {
      const result = parser.parse('app:features:orders:meal.orderComponent.title');
      expect(result).toEqual({
        directories: ['app', 'features', 'orders', 'meal'],
        file: 'orderComponent',
        propertyPath: ['title'],
        originalKey: 'app:features:orders:meal.orderComponent.title',
      });
    });

    it('should parse deeply nested property', () => {
      const result = parser.parse('orders:meal.user.profile.settings.language');
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['user', 'profile', 'settings', 'language'],
        originalKey: 'orders:meal.user.profile.settings.language',
      });
    });
  });
});
