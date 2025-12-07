/**
 * 🥯 i18n-bakery - CLDR Plural Resolver (Adapter Layer)
 * 
 * Concrete implementation of the PluralResolver interface
 * using CLDR standard with Intl.PluralRules API.
 * 
 * @module adapters/CLDRPluralResolver
 */

import {
  PluralResolver,
  PluralResolutionResult,
  PluralCategory,
  PluralKeyChecker,
  PluralizationConfig,
} from '../domain/Pluralization';

/**
 * CLDR-based plural resolver using Intl.PluralRules.
 * 
 * This adapter implements the CLDR standard for pluralization:
 * - Uses native Intl.PluralRules API (zero dependencies)
 * - Supports all languages with proper plural rules
 * - Categories: zero, one, two, few, many, other
 * 
 * @example
 * // English (simple: one, other)
 * resolver.resolve('apple', 1, 'en')  // → { key: 'apple_one', category: 'one' }
 * resolver.resolve('apple', 5, 'en')  // → { key: 'apple_other', category: 'other' }
 * 
 * @example
 * // Arabic (complex: zero, one, two, few, many, other)
 * resolver.resolve('apple', 0, 'ar')  // → { key: 'apple_zero', category: 'zero' }
 * resolver.resolve('apple', 1, 'ar')  // → { key: 'apple_one', category: 'one' }
 * resolver.resolve('apple', 2, 'ar')  // → { key: 'apple_two', category: 'two' }
 * resolver.resolve('apple', 5, 'ar')  // → { key: 'apple_few', category: 'few' }
 * resolver.resolve('apple', 15, 'ar') // → { key: 'apple_many', category: 'many' }
 * resolver.resolve('apple', 100, 'ar') // → { key: 'apple_other', category: 'other' }
 * 
 * @example
 * // Polish (complex: one, few, many, other)
 * resolver.resolve('apple', 1, 'pl')  // → { key: 'apple_one', category: 'one' }
 * resolver.resolve('apple', 2, 'pl')  // → { key: 'apple_few', category: 'few' }
 * resolver.resolve('apple', 5, 'pl')  // → { key: 'apple_many', category: 'many' }
 */
export class CLDRPluralResolver implements PluralResolver {
  private keyChecker?: PluralKeyChecker;
  private rulesCache: Map<string, Intl.PluralRules>;

  /**
   * Creates a new CLDRPluralResolver.
   * 
   * @param config - Configuration options (not used for CLDR, but kept for interface compatibility)
   * @param keyChecker - Optional key checker to verify key existence
   */
  constructor(config?: PluralizationConfig, keyChecker?: PluralKeyChecker) {
    this.keyChecker = keyChecker;
    this.rulesCache = new Map();
  }

  /**
   * Resolves the appropriate plural key based on count and locale.
   * 
   * Uses Intl.PluralRules to determine the correct CLDR category,
   * then constructs the key with the category suffix.
   * 
   * @param key - Base translation key
   * @param count - The count value
   * @param locale - The locale (required for CLDR)
   * @returns Resolution result with the key to use
   */
  resolve(key: string, count: number, locale: string = 'en'): PluralResolutionResult {
    // Get the CLDR category for this count and locale
    const category = this.getCategory(count, locale);
    
    // Construct the plural key: key_category (e.g., apple_one, apple_other)
    const pluralKey = `${key}_${category}`;

    return {
      key: pluralKey,
      category,
      exactMatch: false,
    };
  }

  /**
   * Gets the plural category for a count in a specific locale.
   * 
   * Uses the native Intl.PluralRules API to determine the category
   * according to CLDR rules for the given locale.
   * 
   * @param count - The count value
   * @param locale - The locale
   * @returns Plural category
   * 
   * @example
   * getCategory(1, 'en')   // → 'one'
   * getCategory(5, 'en')   // → 'other'
   * getCategory(0, 'ar')   // → 'zero'
   * getCategory(2, 'ar')   // → 'two'
   * getCategory(5, 'ar')   // → 'few'
   * getCategory(15, 'ar')  // → 'many'
   * getCategory(100, 'ar') // → 'other'
   */
  getCategory(count: number, locale: string): PluralCategory {
    // Get or create PluralRules for this locale
    let rules = this.rulesCache.get(locale);
    
    if (!rules) {
      try {
        rules = new Intl.PluralRules(locale);
        this.rulesCache.set(locale, rules);
      } catch (error) {
        // Fallback to English if locale is not supported
        console.warn(`[CLDRPluralResolver] Locale '${locale}' not supported, falling back to 'en'`);
        rules = new Intl.PluralRules('en');
        this.rulesCache.set(locale, rules);
      }
    }

    // Get the category from Intl.PluralRules
    const category = rules.select(count);

    // Intl.PluralRules returns: 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
    // This matches our PluralCategory type exactly
    return category as PluralCategory;
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

  /**
   * Clears the rules cache.
   * Useful for testing or when locale data needs to be refreshed.
   */
  clearCache(): void {
    this.rulesCache.clear();
  }

  /**
   * Gets information about plural rules for a specific locale.
   * Useful for debugging and understanding what categories are used.
   * 
   * @param locale - The locale to get info for
   * @returns Object with locale info and sample categories
   * 
   * @example
   * getLocaleInfo('en')
   * // → { locale: 'en', categories: ['one', 'other'], samples: { one: [1], other: [0, 2, 3, ...] } }
   * 
   * getLocaleInfo('ar')
   * // → { locale: 'ar', categories: ['zero', 'one', 'two', 'few', 'many', 'other'], ... }
   */
  getLocaleInfo(locale: string): {
    locale: string;
    categories: PluralCategory[];
    samples: Record<PluralCategory, number[]>;
  } {
    const categories = new Set<PluralCategory>();
    const samples: Record<string, number[]> = {};

    // Test numbers from 0 to 100 to find all categories
    for (let i = 0; i <= 100; i++) {
      const category = this.getCategory(i, locale);
      categories.add(category);
      
      if (!samples[category]) {
        samples[category] = [];
      }
      
      if (samples[category].length < 5) {
        samples[category].push(i);
      }
    }

    return {
      locale,
      categories: Array.from(categories),
      samples: samples as Record<PluralCategory, number[]>,
    };
  }
}
