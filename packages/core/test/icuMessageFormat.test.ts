/**
 * 🥯 i18n-bakery - ICU MessageFormat Tests
 * 
 * Comprehensive tests for ICU MessageFormat syntax.
 * Tests plural, select, selectordinal, and combinations.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n, t, addTranslations } from '../src/index';

describe('ICU MessageFormat', () => {
  describe('Plural Syntax', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle basic plural with exact matches', () => {
      addTranslations('en', 'common', {
        'items': '{count, plural, =0 {no items} one {# item} other {# items}}',
      });

      expect(t('items', undefined, { count: 0 })).toBe('no items');
      expect(t('items', undefined, { count: 1 })).toBe('1 item');
      expect(t('items', undefined, { count: 5 })).toBe('5 items');
    });

    it('should replace # with count in plural', () => {
      addTranslations('en', 'common', {
        'apples': '{count, plural, one {You have # apple} other {You have # apples}}',
      });

      expect(t('apples', undefined, { count: 1 })).toBe('You have 1 apple');
      expect(t('apples', undefined, { count: 10 })).toBe('You have 10 apples');
    });

    it('should handle multiple exact matches', () => {
      addTranslations('en', 'common', {
        'likes': '{count, plural, =0 {Be the first to like} =1 {# person likes this} other {# people like this}}',
      });

      expect(t('likes', undefined, { count: 0 })).toBe('Be the first to like');
      expect(t('likes', undefined, { count: 1 })).toBe('1 person likes this');
      expect(t('likes', undefined, { count: 42 })).toBe('42 people like this');
    });
  });

  describe('Select Syntax', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle basic select', () => {
      addTranslations('en', 'common', {
        'pronoun': '{gender, select, male {He} female {She} other {They}}',
      });

      expect(t('pronoun', undefined, { gender: 'male' })).toBe('He');
      expect(t('pronoun', undefined, { gender: 'female' })).toBe('She');
      expect(t('pronoun', undefined, { gender: 'unknown' })).toBe('They');
    });

    it('should handle select with text around', () => {
      addTranslations('en', 'common', {
        'action': '{gender, select, male {He} female {She} other {They}} liked this post',
      });

      expect(t('action', undefined, { gender: 'male' })).toBe('He liked this post');
      expect(t('action', undefined, { gender: 'female' })).toBe('She liked this post');
    });
  });

  describe('Selectordinal Syntax', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle ordinal numbers', () => {
      addTranslations('en', 'common', {
        'place': 'You finished {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}',
      });

      expect(t('place', undefined, { place: 1 })).toBe('You finished 1st');
      expect(t('place', undefined, { place: 2 })).toBe('You finished 2nd');
      expect(t('place', undefined, { place: 3 })).toBe('You finished 3rd');
      expect(t('place', undefined, { place: 4 })).toBe('You finished 4th');
      expect(t('place', undefined, { place: 21 })).toBe('You finished 21st');
      expect(t('place', undefined, { place: 22 })).toBe('You finished 22nd');
      expect(t('place', undefined, { place: 23 })).toBe('You finished 23rd');
      expect(t('place', undefined, { place: 11 })).toBe('You finished 11th');
      expect(t('place', undefined, { place: 12 })).toBe('You finished 12th');
      expect(t('place', undefined, { place: 13 })).toBe('You finished 13th');
    });
  });

  describe('Simple Variables', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle simple variable substitution', () => {
      addTranslations('en', 'common', {
        'greeting': 'Hello, {name}!',
      });

      expect(t('greeting', undefined, { name: 'John' })).toBe('Hello, John!');
    });

    it('should handle multiple variables', () => {
      addTranslations('en', 'common', {
        'message': '{name} sent you {count} messages',
      });

      expect(t('message', undefined, { name: 'Alice', count: 5 })).toBe('Alice sent you 5 messages');
    });
  });

  describe('Complex Combinations', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle nested plural and select', () => {
      addTranslations('en', 'common', {
        'complex': '{gender, select, male {He has {count, plural, one {# item} other {# items}}} female {She has {count, plural, one {# item} other {# items}}} other {They have {count, plural, one {# item} other {# items}}}}',
      });

      expect(t('complex', undefined, { gender: 'male', count: 1 })).toBe('He has 1 item');
      expect(t('complex', undefined, { gender: 'male', count: 5 })).toBe('He has 5 items');
      expect(t('complex', undefined, { gender: 'female', count: 1 })).toBe('She has 1 item');
      expect(t('complex', undefined, { gender: 'female', count: 3 })).toBe('She has 3 items');
    });

    it('should handle plural with variables', () => {
      addTranslations('en', 'common', {
        'cart': '{name}, you have {count, plural, =0 {no items} one {# item} other {# items}} in your cart',
      });

      expect(t('cart', undefined, { name: 'John', count: 0 })).toBe('John, you have no items in your cart');
      expect(t('cart', undefined, { name: 'Alice', count: 1 })).toBe('Alice, you have 1 item in your cart');
      expect(t('cart', undefined, { name: 'Bob', count: 5 })).toBe('Bob, you have 5 items in your cart');
    });
  });

  describe('Real-world Scenarios', () => {
    beforeEach(() => {
      initI18n({
        locale: 'en',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });
    });

    it('should handle notification message', () => {
      addTranslations('en', 'notifications', {
        'new': '{count, plural, =0 {No new notifications} one {You have # new notification} other {You have # new notifications}}',
      });

      expect(t('notifications:new', undefined, { count: 0 })).toBe('No new notifications');
      expect(t('notifications:new', undefined, { count: 1 })).toBe('You have 1 new notification');
      expect(t('notifications:new', undefined, { count: 10 })).toBe('You have 10 new notifications');
    });

    it('should handle social interaction', () => {
      addTranslations('en', 'social', {
        'liked': '{gender, select, male {He} female {She} other {They}} {action, select, liked {liked} commented {commented on} shared {shared} other {interacted with}} your post',
      });

      expect(t('social:liked', undefined, { gender: 'male', action: 'liked' })).toBe('He liked your post');
      expect(t('social:liked', undefined, { gender: 'female', action: 'commented' })).toBe('She commented on your post');
      expect(t('social:liked', undefined, { gender: 'other', action: 'shared' })).toBe('They shared your post');
    });

    it('should handle file upload status', () => {
      addTranslations('en', 'upload', {
        'status': 'Uploading {count, plural, one {# file} other {# files}}... {percent}% complete',
      });

      expect(t('upload:status', undefined, { count: 1, percent: 50 })).toBe('Uploading 1 file... 50% complete');
      expect(t('upload:status', undefined, { count: 5, percent: 75 })).toBe('Uploading 5 files... 75% complete');
    });
  });

  describe('Multi-language Support', () => {
    it('should work with Spanish', () => {
      initI18n({
        locale: 'es',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });

      addTranslations('es', 'common', {
        'items': '{count, plural, =0 {sin artículos} one {# artículo} other {# artículos}}',
      });

      expect(t('items', undefined, { count: 0 })).toBe('sin artículos');
      expect(t('items', undefined, { count: 1 })).toBe('1 artículo');
      expect(t('items', undefined, { count: 5 })).toBe('5 artículos');
    });

    it('should work with Arabic', () => {
      initI18n({
        locale: 'ar',
        messageFormat: 'icu',
        defaultNamespace: 'common',
      });

      addTranslations('ar', 'common', {
        'items': '{count, plural, =0 {لا توجد عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصر} other {# عنصر}}',
      });

      expect(t('items', undefined, { count: 0 })).toBe('لا توجد عناصر');
      expect(t('items', undefined, { count: 1 })).toBe('عنصر واحد');
      expect(t('items', undefined, { count: 2 })).toBe('عنصران');
      expect(t('items', undefined, { count: 5 })).toBe('5 عناصر');
      expect(t('items', undefined, { count: 15 })).toBe('15 عنصر');
    });
  });
});

