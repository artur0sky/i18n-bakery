/**
 * 🥯 i18n-bakery - Pluralization (Domain Layer)
 * 
 * This file defines the domain interfaces for pluralization
 * following Clean Architecture principles.
 * 
 * @module domain/Pluralization
 */

/**
 * Plural categories based on CLDR standard.
 * Used for advanced pluralization rules.
 */
export type PluralCategory = 
  | 'zero'    // 0 items (Arabic, Welsh)
  | 'one'     // 1 item (singular)
  | 'two'     // 2 items (Arabic, Welsh)
  | 'few'     // few items (Polish: 2-4, Russian: 2-4 except 12-14)
  | 'many'    // many items (Polish: 5+, Arabic: 11-99)
  | 'other';  // rest (fallback, always required)

/**
 * Pluralization strategy types.
 */
export type PluralizationStrategy = 
  | 'suffix'  // i18next-style: key, key_plural, key_0, key_1, etc.
  | 'cldr'    // CLDR-style: key_one, key_other, key_zero, etc.
  | 'icu';    // ICU MessageFormat

/**
 * Configuration for pluralization.
 */
export interface PluralizationConfig {
  /**
   * Pluralization strategy to use
   * @default 'suffix'
   */
  strategy?: PluralizationStrategy;
  
  /**
   * Suffix for plural form in 'suffix' strategy
   * @default '_plural'
   */
  pluralSuffix?: string;
  
  /**
   * Whether to prepare keys for pluralization
   * (add _plural suffix when detecting count variable)
   * @default true
   */
  prepareKeys?: boolean;
}

/**
 * Result of pluralization resolution.
 */
export interface PluralResolutionResult {
  /**
   * The resolved key to use for translation
   */
  key: string;
  
  /**
   * The plural category that was resolved
   */
  category?: PluralCategory | 'plural' | 'singular';
  
  /**
   * Whether an exact count match was found (e.g., key_0, key_1)
   */
  exactMatch: boolean;
}

/**
 * Port (Interface) for resolving plural forms.
 * 
 * Following the Dependency Inversion Principle (SOLID),
 * this interface allows different pluralization strategies
 * to be implemented without changing the domain logic.
 */
export interface PluralResolver {
  /**
   * Resolves the appropriate plural key based on count.
   * 
   * @param key - Base translation key
   * @param count - The count value
   * @param locale - The locale (for CLDR/ICU strategies)
   * @returns Resolution result with the key to use
   * 
   * @example
   * // Suffix strategy
   * resolver.resolve('apple', 1)  // → { key: 'apple', category: 'singular' }
   * resolver.resolve('apple', 5)  // → { key: 'apple_plural', category: 'plural' }
   * resolver.resolve('apple', 0)  // → { key: 'apple_0', exactMatch: true }
   * 
   * @example
   * // CLDR strategy
   * resolver.resolve('apple', 1, 'en')  // → { key: 'apple_one', category: 'one' }
   * resolver.resolve('apple', 5, 'en')  // → { key: 'apple_other', category: 'other' }
   */
  resolve(key: string, count: number, locale?: string): PluralResolutionResult;
  
  /**
   * Gets the plural category for a count in a specific locale.
   * Only used for CLDR/ICU strategies.
   * 
   * @param count - The count value
   * @param locale - The locale
   * @returns Plural category
   */
  getCategory(count: number, locale: string): PluralCategory;
}

/**
 * Port (Interface) for checking if plural keys exist.
 * This is used by the translation system to determine
 * which plural form to use.
 */
export interface PluralKeyChecker {
  /**
   * Checks if a specific plural key exists in the store.
   * 
   * @param locale - The locale
   * @param namespace - The namespace
   * @param key - The key to check
   * @returns True if the key exists
   */
  hasKey(locale: string, namespace: string, key: string): boolean;
}
