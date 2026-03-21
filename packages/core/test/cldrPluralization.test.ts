/**
 * 🥯 i18n-bakery - CLDR Pluralization Tests
 * 
 * Comprehensive tests for CLDR-based pluralization.
 * Tests Intl.PluralRules integration and multi-language support.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n, t, addTranslations } from '../src/index';

describe('CLDR Pluralization', () => {
  describe('English (simple: one, other)', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should use one form when count is 1', () => {
      addTranslations('en', 'common', {
        'apple_one': '{{count}} apple',
        'apple_other': '{{count}} apples',
      });

      const result = t('apple', undefined, { count: 1 });
      expect(result).toBe('1 apple');
    });

    it('should use other form when count is not 1', () => {
      addTranslations('en', 'common', {
        'apple_one': '{{count}} apple',
        'apple_other': '{{count}} apples',
      });

      expect(t('apple', undefined, { count: 0 })).toBe('0 apples');
      expect(t('apple', undefined, { count: 2 })).toBe('2 apples');
      expect(t('apple', undefined, { count: 5 })).toBe('5 apples');
      expect(t('apple', undefined, { count: 100 })).toBe('100 apples');
    });
  });

  describe('Spanish (simple: one, other)', () => {
    beforeEach(() => {
      initI18n({
        locale: 'es',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should use one form when count is 1', () => {
      addTranslations('es', 'common', {
        'manzana_one': '{{count}} manzana',
        'manzana_other': '{{count}} manzanas',
      });

      const result = t('manzana', undefined, { count: 1 });
      expect(result).toBe('1 manzana');
    });

    it('should use other form when count is not 1', () => {
      addTranslations('es', 'common', {
        'manzana_one': '{{count}} manzana',
        'manzana_other': '{{count}} manzanas',
      });

      expect(t('manzana', undefined, { count: 0 })).toBe('0 manzanas');
      expect(t('manzana', undefined, { count: 2 })).toBe('2 manzanas');
      expect(t('manzana', undefined, { count: 5 })).toBe('5 manzanas');
    });
  });

  describe('Polish (complex: one, few, many, other)', () => {
    beforeEach(() => {
      initI18n({
        locale: 'pl',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should use one form for 1', () => {
      addTranslations('pl', 'common', {
        'apple_one': '{{count}} jabłko',
        'apple_few': '{{count}} jabłka',
        'apple_many': '{{count}} jabłek',
        'apple_other': '{{count}} jabłka',
      });

      const result = t('apple', undefined, { count: 1 });
      expect(result).toBe('1 jabłko');
    });

    it('should use few form for 2-4', () => {
      addTranslations('pl', 'common', {
        'apple_one': '{{count}} jabłko',
        'apple_few': '{{count}} jabłka',
        'apple_many': '{{count}} jabłek',
        'apple_other': '{{count}} jabłka',
      });

      expect(t('apple', undefined, { count: 2 })).toBe('2 jabłka');
      expect(t('apple', undefined, { count: 3 })).toBe('3 jabłka');
      expect(t('apple', undefined, { count: 4 })).toBe('4 jabłka');
    });

    it('should use many form for 5-21', () => {
      addTranslations('pl', 'common', {
        'apple_one': '{{count}} jabłko',
        'apple_few': '{{count}} jabłka',
        'apple_many': '{{count}} jabłek',
        'apple_other': '{{count}} jabłka',
      });

      expect(t('apple', undefined, { count: 5 })).toBe('5 jabłek');
      expect(t('apple', undefined, { count: 10 })).toBe('10 jabłek');
      expect(t('apple', undefined, { count: 21 })).toBe('21 jabłek');
    });
  });

  describe('Arabic (very complex: zero, one, two, few, many, other)', () => {
    beforeEach(() => {
      initI18n({
        locale: 'ar',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should use zero form for 0', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      const result = t('apple', undefined, { count: 0 });
      expect(result).toBe('لا توجد تفاحات');
    });

    it('should use one form for 1', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      const result = t('apple', undefined, { count: 1 });
      expect(result).toBe('تفاحة واحدة');
    });

    it('should use two form for 2', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      const result = t('apple', undefined, { count: 2 });
      expect(result).toBe('تفاحتان');
    });

    it('should use few form for 3-10', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      expect(t('apple', undefined, { count: 3 })).toBe('3 تفاحات');
      expect(t('apple', undefined, { count: 5 })).toBe('5 تفاحات');
      expect(t('apple', undefined, { count: 10 })).toBe('10 تفاحات');
    });

    it('should use many form for 11-99', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      expect(t('apple', undefined, { count: 11 })).toBe('11 تفاحة');
      expect(t('apple', undefined, { count: 50 })).toBe('50 تفاحة');
      expect(t('apple', undefined, { count: 99 })).toBe('99 تفاحة');
    });

    it('should use other form for 100+', () => {
      addTranslations('ar', 'common', {
        'apple_zero': 'لا توجد تفاحات',
        'apple_one': 'تفاحة واحدة',
        'apple_two': 'تفاحتان',
        'apple_few': '{{count}} تفاحات',
        'apple_many': '{{count}} تفاحة',
        'apple_other': '{{count}} تفاحة',
      });

      expect(t('apple', undefined, { count: 100 })).toBe('100 تفاحة');
      expect(t('apple', undefined, { count: 1000 })).toBe('1000 تفاحة');
    });
  });

  describe('Russian (complex: one, few, many, other)', () => {
    beforeEach(() => {
      initI18n({
        locale: 'ru',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should use one form for 1, 21, 31, etc.', () => {
      addTranslations('ru', 'common', {
        'apple_one': '{{count}} яблоко',
        'apple_few': '{{count}} яблока',
        'apple_many': '{{count}} яблок',
        'apple_other': '{{count}} яблока',
      });

      expect(t('apple', undefined, { count: 1 })).toBe('1 яблоко');
      expect(t('apple', undefined, { count: 21 })).toBe('21 яблоко');
      expect(t('apple', undefined, { count: 31 })).toBe('31 яблоко');
    });

    it('should use few form for 2-4, 22-24, etc.', () => {
      addTranslations('ru', 'common', {
        'apple_one': '{{count}} яблоко',
        'apple_few': '{{count}} яблока',
        'apple_many': '{{count}} яблок',
        'apple_other': '{{count}} яблока',
      });

      expect(t('apple', undefined, { count: 2 })).toBe('2 яблока');
      expect(t('apple', undefined, { count: 3 })).toBe('3 яблока');
      expect(t('apple', undefined, { count: 4 })).toBe('4 яблока');
      expect(t('apple', undefined, { count: 22 })).toBe('22 яблока');
    });

    it('should use many form for 0, 5-20, 25-30, etc.', () => {
      addTranslations('ru', 'common', {
        'apple_one': '{{count}} яблоко',
        'apple_few': '{{count}} яблока',
        'apple_many': '{{count}} яблок',
        'apple_other': '{{count}} яблока',
      });

      expect(t('apple', undefined, { count: 0 })).toBe('0 яблок');
      expect(t('apple', undefined, { count: 5 })).toBe('5 яблок');
      expect(t('apple', undefined, { count: 10 })).toBe('10 яблок');
      expect(t('apple', undefined, { count: 20 })).toBe('20 яблок');
    });
  });

  describe('Fallback Behavior', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should fall back to base key if plural form does not exist', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        // No apple_one or apple_other
      });

      const result = t('apple', undefined, { count: 5 });
      expect(result).toBe('apple');
    });
  });

  describe('Namespaces with CLDR', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        pluralizationStrategy: 'cldr',
        defaultNamespace: 'common',
      });
    });

    it('should work with namespaced keys', () => {
      addTranslations('en', 'fruits', {
        'apple_one': '{{count}} apple',
        'apple_other': '{{count}} apples',
      });

      expect(t('fruits:apple', undefined, { count: 1 })).toBe('1 apple');
      expect(t('fruits:apple', undefined, { count: 5 })).toBe('5 apples');
    });
  });
});
