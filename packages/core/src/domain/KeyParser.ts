/**
 * Represents a parsed translation key with its structural components.
 * 
 * Example: "orders:meal.orderComponent.title"
 * - directories: ["orders", "meal"]
 * - file: "orderComponent"
 * - propertyPath: ["title"]
 */
export interface ParsedKey {
  /**
   * Directory path segments derived from colon-separated parts
   * Example: "orders:meal" -> ["orders", "meal"]
   */
  directories: string[];
  
  /**
   * The file name (without extension) where the translation will be stored
   * Example: "orderComponent" from "orders:meal.orderComponent.title"
   */
  file: string;
  
  /**
   * Dot-separated property path within the JSON file
   * Example: ["title"] or ["nested", "property", "key"]
   */
  propertyPath: string[];
  
  /**
   * The original key for reference
   */
  originalKey: string;
}

/**
 * Port (Interface) for parsing translation keys into structured components.
 * Follows the Single Responsibility Principle - only concerned with key parsing.
 */
export interface KeyParser {
  /**
   * Parses a translation key into its structural components.
   * 
   * Parsing Rules:
   * - `:` (colon) separates directory levels
   * - `.` (dot) separates file and property path
   * - Last segment before first dot is the file name
   * - Everything after first dot is the property path
   * 
   * @param key - The translation key to parse
   * @returns Parsed key structure
   * 
   * @example
   * parse("orders:meal.orderComponent.title")
   * // Returns:
   * // {
   * //   directories: ["orders", "meal"],
   * //   file: "orderComponent",
   * //   propertyPath: ["title"],
   * //   originalKey: "orders:meal.orderComponent.title"
   * // }
   * 
   * @example
   * parse("common.hello")
   * // Returns:
   * // {
   * //   directories: [],
   * //   file: "common",
   * //   propertyPath: ["hello"],
   * //   originalKey: "common.hello"
   * // }
   */
  parse(key: string): ParsedKey;
  
  /**
   * Normalizes a key to ensure consistent representation.
   * Useful for comparing keys or generating cache keys.
   * 
   * @param key - The translation key to normalize
   * @returns Normalized key string
   */
  normalize(key: string): string;
}

/**
 * Port (Interface) for resolving file paths from parsed keys.
 * Follows the Dependency Inversion Principle - depends on abstraction.
 */
export interface PathResolver {
  /**
   * Resolves the complete file path for a given parsed key and locale.
   * 
   * @param locale - The target locale (e.g., "en", "es-MX")
   * @param parsedKey - The parsed key structure
   * @returns The complete file path (e.g., "/locales/en/orders/meal/orderComponent.json")
   * 
   * @example
   * const parsed = parser.parse("orders:meal.orderComponent.title");
   * const path = resolver.resolve("en", parsed);
   * // Returns: "/locales/en/orders/meal/orderComponent.json"
   */
  resolve(locale: string, parsedKey: ParsedKey): string;
  
  /**
   * Gets the base directory for translations.
   * @returns The base directory path
   */
  getBaseDir(): string;
}
