import { describe, it, expect } from 'vitest';
import { DefaultKeyParser } from '../src/adapters/DefaultKeyParser';
import { ParsedKey } from '../src/domain/KeyParser';

describe('DefaultKeyParser - Phase 7.1', () => {
  const parser = new DefaultKeyParser();

  describe('parse()', () => {
    it('should parse key with directories, file, and property', () => {
      const result = parser.parse('orders:meal.orderComponent.title');
      
      expect(result).toEqual({
        directories: ['orders', 'meal'],
        file: 'orderComponent',
        propertyPath: ['title'],
        originalKey: 'orders:meal.orderComponent.title'
      });
    });

    it('should parse key with multiple directory levels', () => {
      const result = parser.parse('app:features:orders.list.header');
      
      expect(result).toEqual({
        directories: ['app', 'features', 'orders'],
        file: 'list',
        propertyPath: ['header'],
        originalKey: 'app:features:orders.list.header'
      });
    });

    it('should parse key with nested property path', () => {
      const result = parser.parse('orders:meal.form.fields.name.label');
      
      expect(result).toEqual({
        directories: ['orders', 'meal', 'form', 'fields'],
        file: 'name',
        propertyPath: ['label'],
        originalKey: 'orders:meal.form.fields.name.label'
      });
    });

    it('should parse simple key without directories', () => {
      const result = parser.parse('common.hello');
      
      expect(result).toEqual({
        directories: [],
        file: 'common',
        propertyPath: ['hello'],
        originalKey: 'common.hello'
      });
    });

    it('should parse key with only file name (no property path)', () => {
      const result = parser.parse('common');
      
      expect(result).toEqual({
        directories: [],
        file: 'common',
        propertyPath: [],
        originalKey: 'common'
      });
    });

    it('should parse key with directory but no property path', () => {
      const result = parser.parse('orders:meal');
      
      expect(result).toEqual({
        directories: ['orders'],
        file: 'meal',
        propertyPath: [],
        originalKey: 'orders:meal'
      });
    });

    it('should handle single directory level', () => {
      const result = parser.parse('auth:login.title');
      
      expect(result).toEqual({
        directories: ['auth'],
        file: 'login',
        propertyPath: ['title'],
        originalKey: 'auth:login.title'
      });
    });

    it('should throw error for empty key', () => {
      expect(() => parser.parse('')).toThrow('[i18n-bakery] Invalid key');
    });

    it('should throw error for null key', () => {
      expect(() => parser.parse(null as any)).toThrow('[i18n-bakery] Invalid key');
    });

    it('should throw error for undefined key', () => {
      expect(() => parser.parse(undefined as any)).toThrow('[i18n-bakery] Invalid key');
    });
  });

  describe('normalize()', () => {
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

    it('should remove leading separators', () => {
      expect(parser.normalize(':orders:meal.title')).toBe('orders:meal.title');
      expect(parser.normalize('.orders:meal.title')).toBe('orders:meal.title');
    });

    it('should remove trailing separators', () => {
      expect(parser.normalize('orders:meal.title:')).toBe('orders:meal.title');
      expect(parser.normalize('orders:meal.title.')).toBe('orders:meal.title');
    });

    it('should handle empty string', () => {
      expect(parser.normalize('')).toBe('');
    });

    it('should handle null', () => {
      expect(parser.normalize(null as any)).toBe('');
    });

    it('should normalize complex malformed key', () => {
      expect(parser.normalize('  ::orders::meal..title::  ')).toBe('orders:meal.title');
    });
  });

  describe('Integration - parse and normalize', () => {
    it('should parse normalized keys consistently', () => {
      const key1 = 'orders:meal.title';
      const key2 = '  orders::meal..title  ';
      
      const normalized = parser.normalize(key2);
      expect(normalized).toBe(key1);
      
      const parsed1 = parser.parse(key1);
      const parsed2 = parser.parse(normalized);
      
      expect(parsed1).toEqual(parsed2);
    });
  });
});
