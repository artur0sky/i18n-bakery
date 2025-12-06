/**
 * 🥯 i18n-bakery - Key Parser (Domain Layer)
 * 
 * This file defines the domain interfaces for parsing translation keys
 * into structured components following Clean Architecture principles.
 * 
 * @module domain/KeyParser
 */

/**
 * Represents a parsed translation key with its hierarchical structure.
 * 
 * @example
 * Key: "orders:meal.orderComponent.title"
 * Result: {
 *   directories: ["orders", "meal"],
 *   file: "orderComponent",
 *   propertyPath: ["title"],
 *   originalKey: "orders:meal.orderComponent.title"
 * }
 */
export interface ParsedKey {
  /**
   * Directory path segments (from colon-separated parts)
   * Example: "orders:meal" → ["orders", "meal"]
   */
  directories: string[];
  
  /**
   * File name (second-to-last dot-separated segment)
   * Example: "orderComponent" in "orders:meal.orderComponent.title"
   */
  file: string;
  
  /**
   * Property path within the file (can be nested)
   * Example: ["title"] or ["user", "profile", "name"]
   */
  propertyPath: string[];
  
  /**
   * The original, unnormalized key for reference
   */
  originalKey: string;
}

/**
 * Port (Interface) for parsing translation keys.
 * 
 * Following the Dependency Inversion Principle (SOLID),
 * this interface allows different parsing strategies to be
 * implemented without changing the domain logic.
 */
export interface KeyParser {
  /**
   * Parses a translation key into its structured components.
   * 
   * Parsing Rules:
   * - `:` (colon) separates directory levels
   * - `.` (dot) separates file and property components
   * - All segments before the last two dots become directories
   * - Second-to-last segment is the file name
   * - Last segment is the property
   * 
   * @param key - The translation key to parse
   * @returns Structured representation of the key
   * 
   * @example
   * parse("orders:meal.title")
   * // { directories: ["orders"], file: "meal", propertyPath: ["title"], ... }
   * 
   * @example
   * parse("orders:meal.orderComponent.title")
   * // { directories: ["orders", "meal"], file: "orderComponent", propertyPath: ["title"], ... }
   */
  parse(key: string): ParsedKey;
  
  /**
   * Normalizes a key by removing duplicate separators,
   * trimming whitespace, and ensuring consistent format.
   * 
   * @param key - The key to normalize
   * @returns Normalized key
   * 
   * @example
   * normalize("  orders::meal..title  ")
   * // "orders:meal.title"
   */
  normalize(key: string): string;
}

/**
 * Configuration options for path resolution.
 */
export interface PathResolverConfig {
  /**
   * Base directory for translation files
   * @example "./locales" or "./src/i18n"
   */
  baseDir: string;
  
  /**
   * File extension (without dot)
   * @default "json"
   */
  extension?: string;
}

/**
 * Port (Interface) for resolving parsed keys to file system paths.
 * 
 * This interface abstracts the path resolution strategy,
 * allowing different storage backends (filesystem, S3, etc.)
 * to be implemented without changing the domain logic.
 */
export interface PathResolver {
  /**
   * Resolves a parsed key to a complete file path.
   * 
   * @param locale - The locale (e.g., "en", "es-MX")
   * @param parsedKey - The parsed key structure
   * @returns Complete file path
   * 
   * @example
   * resolve("en", { directories: ["orders"], file: "meal", ... })
   * // "./locales/en/orders/meal.json"
   */
  resolve(locale: string, parsedKey: ParsedKey): string;
  
  /**
   * Gets the directory path (without file name) for a parsed key.
   * Useful for creating directory structures.
   * 
   * @param locale - The locale
   * @param parsedKey - The parsed key structure
   * @returns Directory path
   * 
   * @example
   * getDirectoryPath("en", { directories: ["orders", "meal"], ... })
   * // "./locales/en/orders/meal"
   */
  getDirectoryPath(locale: string, parsedKey: ParsedKey): string;
}
