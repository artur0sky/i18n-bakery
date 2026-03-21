/**
 * 🥯 i18n-bakery - Pluralization Tests
 * 
 * Comprehensive tests for the pluralization system.
 * Tests i18next-style suffix pluralization.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n, t, addTranslations } from '../src/index';

describe('Pluralization', () => {
  beforeEach(() => {
    // Initialize i18n for each test
    initI18n({
      locale: 'en',
      fallbackLocale: 'en',
    });
  });

  describe('Basic Pluralization', () => {
    it('should use singular form when count is 1', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('apple', undefined, { count: 1 });
      expect(result).toBe('apple');
    });

    it('should use plural form when count is not 1', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('apple', undefined, { count: 5 });
      expect(result).toBe('apples');
    });

    it('should use plural form when count is 0', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('apple', undefined, { count: 0 });
      expect(result).toBe('apples');
    });

    it('should use plural form when count is 2', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('apple', undefined, { count: 2 });
      expect(result).toBe('apples');
    });
  });

  describe('Exact Count Matches', () => {
    it('should use exact count match for 0', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
        'apple_0': 'no apples',
      });

      const result = t('apple', undefined, { count: 0 });
      expect(result).toBe('no apples');
    });

    it('should use exact count match for 1', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
        'apple_1': 'one apple',
      });

      const result = t('apple', undefined, { count: 1 });
      expect(result).toBe('one apple');
    });

    it('should use exact count match for 2', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
        'apple_2': 'a couple of apples',
      });

      const result = t('apple', undefined, { count: 2 });
      expect(result).toBe('a couple of apples');
    });

    it('should use exact count match for any number', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
        'apple_100': 'a hundred apples!',
      });

      const result = t('apple', undefined, { count: 100 });
      expect(result).toBe('a hundred apples!');
    });
  });

  describe('Interpolation with Pluralization', () => {
    it('should interpolate count in singular form', () => {
      addTranslations('en', 'common', {
        'item': '{{count}} item',
        'item_plural': '{{count}} items',
      });

      const result = t('item', undefined, { count: 1 });
      expect(result).toBe('1 item');
    });

    it('should interpolate count in plural form', () => {
      addTranslations('en', 'common', {
        'item': '{{count}} item',
        'item_plural': '{{count}} items',
      });

      const result = t('item', undefined, { count: 5 });
      expect(result).toBe('5 items');
    });

    it('should interpolate multiple variables with count', () => {
      addTranslations('en', 'common', {
        'message': '{{name}} has {{count}} item',
        'message_plural': '{{name}} has {{count}} items',
      });

      const result = t('message', undefined, { name: 'John', count: 3 });
      expect(result).toBe('John has 3 items');
    });
  });

  describe('Fallback Behavior', () => {
    it('should fall back to base key if plural form does not exist', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        // No apple_plural
      });

      const result = t('apple', undefined, { count: 5 });
      expect(result).toBe('apple');
    });

    it('should work without count variable (normal translation)', () => {
      addTranslations('en', 'common', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('apple');
      expect(result).toBe('apple');
    });
  });

  describe('Namespaces with Pluralization', () => {
    it('should work with namespaced keys', () => {
      addTranslations('en', 'fruits', {
        'apple': 'apple',
        'apple_plural': 'apples',
      });

      const result = t('fruits:apple', undefined, { count: 5 });
      expect(result).toBe('apples');
    });

    it('should work with exact count in namespaces', () => {
      addTranslations('en', 'fruits', {
        'apple': 'apple',
        'apple_plural': 'apples',
        'apple_0': 'no apples',
      });

      const result = t('fruits:apple', undefined, { count: 0 });
      expect(result).toBe('no apples');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle shopping cart items', () => {
      addTranslations('en', 'cart', {
        'item': '{{count}} item in your cart',
        'item_plural': '{{count}} items in your cart',
        'item_0': 'Your cart is empty',
      });

      expect(t('cart:item', undefined, { count: 0 })).toBe('Your cart is empty');
      expect(t('cart:item', undefined, { count: 1 })).toBe('1 item in your cart');
      expect(t('cart:item', undefined, { count: 5 })).toBe('5 items in your cart');
    });

    it('should handle notification counts', () => {
      addTranslations('en', 'notifications', {
        'count': 'You have {{count}} notification',
        'count_plural': 'You have {{count}} notifications',
        'count_0': 'No new notifications',
      });

      expect(t('notifications:count', undefined, { count: 0 })).toBe('No new notifications');
      expect(t('notifications:count', undefined, { count: 1 })).toBe('You have 1 notification');
      expect(t('notifications:count', undefined, { count: 10 })).toBe('You have 10 notifications');
    });

    it('should handle likes/reactions', () => {
      addTranslations('en', 'social', {
        'like': '{{name}} liked this',
        'like_plural': '{{count}} people liked this',
        'like_0': 'Be the first to like this',
      });

      expect(t('social:like', undefined, { count: 0 })).toBe('Be the first to like this');
      expect(t('social:like', undefined, { name: 'John', count: 1 })).toBe('John liked this');
      expect(t('social:like', undefined, { count: 42 })).toBe('42 people liked this');
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative counts as plural', () => {
      addTranslations('en', 'common', {
        'item': 'item',
        'item_plural': 'items',
      });

      const result = t('item', undefined, { count: -5 });
      expect(result).toBe('items');
    });

    it('should handle decimal counts as plural', () => {
      addTranslations('en', 'common', {
        'item': 'item',
        'item_plural': 'items',
      });

      const result = t('item', undefined, { count: 1.5 });
      expect(result).toBe('items');
    });

    it('should handle very large counts', () => {
      addTranslations('en', 'common', {
        'item': '{{count}} item',
        'item_plural': '{{count}} items',
      });

      const result = t('item', undefined, { count: 1000000 });
      expect(result).toBe('1000000 items');
    });
  });
});
