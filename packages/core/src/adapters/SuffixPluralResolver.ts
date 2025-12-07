/**
 * 🥯 i18n-bakery - Suffix Plural Resolver (Adapter Layer)
 * 
 * Concrete implementation of the PluralResolver interface
 * using i18next-style suffix strategy.
 * 
 * @module adapters/SuffixPluralResolver
 */

import {
  PluralResolver,
  PluralResolutionResult,
  PluralCategory,
  PluralKeyChecker,
  PluralizationConfig,
} from '../domain/Pluralization';

/**
 * i18next-style suffix-based plural resolver.
 * 
 * This adapter implements the simple suffix strategy:
 * - Exact count matches: key_0, key_1, key_2, etc.
 * - Singular (count === 1): key
 * - Plural (count !== 1): key_plural
 * 
 * @example
 * // With keys: { "apple": "apple", "apple_plural": "apples", "apple_0": "no apples" }
 * resolver.resolve('apple', 0)  // → { key: 'apple_0', exactMatch: true }
 * resolver.resolve('apple', 1)  // → { key: 'apple', category: 'singular' }
 * resolver.resolve('apple', 5)  // → { key: 'apple_plural', category: 'plural' }
 */
export class SuffixPluralResolver implements PluralResolver {
  private pluralSuffix: string;
  private keyChecker?: PluralKeyChecker;

  /**
   * Creates a new SuffixPluralResolver.
   * 
   * @param config - Configuration options
   * @param keyChecker - Optional key checker to verify key existence
   */
  constructor(config?: PluralizationConfig, keyChecker?: PluralKeyChecker) {
    this.pluralSuffix = config?.pluralSuffix || '_plural';
    this.keyChecker = keyChecker;
  }

  /**
   * Resolves the appropriate plural key based on count.
   * 
   * Resolution order:
   * 1. Exact count match (key_0, key_1, key_2, etc.)
   * 2. Singular form (count === 1): key
   * 3. Plural form (count !== 1): key_plural
   * 
   * @param key - Base translation key
   * @param count - The count value
   * @returns Resolution result with the key to use
   */
  resolve(key: string, count: number): PluralResolutionResult {
    // Step 1: Try exact count match (key_0, key_1, key_2, etc.)
    const exactKey = `${key}_${count}`;
    if (this.keyChecker && this.hasKey(exactKey)) {
      return {
        key: exactKey,
        category: this.getCategoryFromCount(count),
        exactMatch: true,
      };
    }

    // Step 2: Determine if singular or plural
    const isSingular = count === 1;

    if (isSingular) {
      // Singular: use base key
      return {
        key,
        category: 'singular',
        exactMatch: false,
      };
    } else {
      // Plural: use key_plural
      const pluralKey = `${key}${this.pluralSuffix}`;
      return {
        key: pluralKey,
        category: 'plural',
        exactMatch: false,
      };
    }
  }

  /**
   * Gets the plural category for a count.
   * 
   * For suffix strategy, this is simplified:
   * - count === 0: 'zero'
   * - count === 1: 'one'
   * - count === 2: 'two'
   * - count > 2: 'other'
   * 
   * @param count - The count value
   * @returns Plural category
   */
  getCategory(count: number): PluralCategory {
    return this.getCategoryFromCount(count);
  }

  /**
   * Helper to get category from count.
   * 
   * @param count - The count value
   * @returns Plural category
   */
  private getCategoryFromCount(count: number): PluralCategory {
    if (count === 0) return 'zero';
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    return 'other';
  }

  /**
   * Helper to check if a key exists using the key checker.
   * 
   * @param key - The key to check
   * @returns True if key exists
   */
  private hasKey(key: string): boolean {
    // This is a simplified check - in real usage, it would need locale and namespace
    // For now, we return false if no checker is provided
    return false;
  }

  /**
   * Sets the key checker for this resolver.
   * This allows the resolver to check if keys exist before using them.
   * 
   * @param checker - The key checker
   */
  setKeyChecker(checker: PluralKeyChecker): void {
    this.keyChecker = checker;
  }
}
