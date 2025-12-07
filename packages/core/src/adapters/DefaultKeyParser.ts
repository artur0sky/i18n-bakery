/**
 * 🥯 i18n-bakery - Default Key Parser (Adapter Layer)
 * 
 * Concrete implementation of the KeyParser interface.
 * Parses translation keys using colon (:) for directories
 * and dot (.) for file/property separation.
 * 
 * @module adapters/DefaultKeyParser
 */

import { KeyParser, ParsedKey } from '../domain/KeyParser';

/**
 * Default implementation of the KeyParser interface.
 * 
 * This adapter implements the parsing strategy defined in Phase 7:
 * - Colons (:) separate directory levels
 * - Dots (.) separate file and property components
 * - Automatic normalization of malformed keys
 * 
 * @example
 * const parser = new DefaultKeyParser();
 * const parsed = parser.parse("orders:meal.orderComponent.title");
 * // {
 * //   directories: ["orders", "meal"],
 * //   file: "orderComponent",
 * //   propertyPath: ["title"],
 * //   originalKey: "orders:meal.orderComponent.title"
 * // }
 */
export class DefaultKeyParser implements KeyParser {
  /**
   * Normalizes a key by:
   * - Trimming whitespace
   * - Removing duplicate colons and dots
   * - Removing leading/trailing separators
   * 
   * @param key - The key to normalize
   * @returns Normalized key
   */
  normalize(key: string): string {
    if (!key || typeof key !== 'string') {
      return '';
    }

    return key
      .trim()
      // Remove duplicate colons
      .replace(/:+/g, ':')
      // Remove duplicate dots
      .replace(/\.+/g, '.')
      // Remove leading/trailing colons
      .replace(/^:+|:+$/g, '')
      // Remove leading/trailing dots
      .replace(/^\.+|\.+$/g, '');
  }

  /**
   * Parses a translation key into its structured components.
   * 
   * Parsing Rules:
   * 1. Split by colon (:) to get directory segments
   * 2. The last colon-separated segment contains file and property info
   * 3. Behavior depends on number of colons:
   *    - NO colons: All dots are nested properties in 'global' file
   *    - ONE colon + multiple dots: First dot is file, rest are nested properties
   *    - MULTIPLE colons + multiple dots: All but last 2 dots become directories
   * 
   * @param key - The translation key to parse
   * @returns Structured ParsedKey object
   */
  parse(key: string): ParsedKey {
    const originalKey = key;
    const normalized = this.normalize(key);

    if (!normalized) {
      return {
        directories: [],
        file: 'common',
        propertyPath: [''],
        originalKey,
      };
    }

    // Split by colon to get directory segments
    const colonParts = normalized.split(':');
    const colonCount = colonParts.length - 1; // Number of colons
    
    // All colon-separated parts except the last are directories
    const directories: string[] = [];
    let lastPart = normalized;

    if (colonParts.length > 1) {
      // Extract directories from colon-separated parts
      directories.push(...colonParts.slice(0, -1));
      lastPart = colonParts[colonParts.length - 1];
    }

    // Split the last part by dot to get file and property
    const dotParts = lastPart.split('.');

    if (dotParts.length === 1) {
      // Only one part after colon (or no colon)
      // If we have directories from colon, this single part is actually a property
      // Pop the last directory and use it as the file
      
      if (directories.length > 0) {
        // We have colon-based directories, so the single part is a property
        // Example: "auth:login" → file: "auth", property: ["login"]
        const file = directories.pop()!;
        return {
          directories,
          file,
          propertyPath: [dotParts[0]],
          originalKey,
        };
      } else {
        // No directories, treat as property in common file
        // Example: "login" → file: "common", property: ["login"]
        return {
          directories,
          file: 'common',
          propertyPath: [dotParts[0]],
          originalKey,
        };
      }
    }

    // Two or more dot-separated parts
    // Behavior depends on colon count:
    
    if (colonCount === 0) {
      // NO colons: All dots are nested properties in 'global' file
      // Example: "user.profile.name" → file: "global", props: ["user", "profile", "name"]
      // Example: "meal.title" → file: "global", props: ["meal", "title"]
      return {
        directories: [],
        file: 'global',
        propertyPath: dotParts,
        originalKey,
      };
    }

    if (dotParts.length === 2) {
      // Two parts with colon(s): file.property
      // Example: "orders:meal.title" or "auth:login.button"
      return {
        directories,
        file: dotParts[0],
        propertyPath: [dotParts[1]],
        originalKey,
      };
    }

    // Three or more dot-separated parts with colon(s)
    // Behavior depends on colon count:
    
    if (colonCount === 1) {
      // ONE colon: First dot-part is file, rest are nested properties
      // Example: "orders:meal.user.profile.name" → file: "meal", props: ["user", "profile", "name"]
      return {
        directories,
        file: dotParts[0],
        propertyPath: dotParts.slice(1),
        originalKey,
      };
    } else {
      // MULTIPLE colons: All but last 2 dots become directories
      // Example: "app:features:orders:meal.orderComponent.title" → dirs: ["app", "features", "orders", "meal"], file: "orderComponent", prop: ["title"]
      
      const additionalDirs = dotParts.slice(0, -2);
      directories.push(...additionalDirs);
      
      return {
        directories,
        file: dotParts[dotParts.length - 2],
        propertyPath: [dotParts[dotParts.length - 1]],
        originalKey,
      };
    }
  }
}
