import { KeyParser, ParsedKey } from '../domain/KeyParser';

/**
 * Default implementation of KeyParser following the parsing rules:
 * - `:` (colon) = directory separator
 * - `.` (dot) = file and property separator
 * 
 * This adapter implements the Interface Segregation Principle by focusing
 * solely on key parsing logic.
 */
export class DefaultKeyParser implements KeyParser {
  /**
   * Parses a translation key into its structural components.
   * 
   * Algorithm:
   * 1. Split by `:` to get directory segments
   * 2. Take the last segment and split by `.`
   * 3. First part after split is the file name
   * 4. Remaining parts are the property path
   * 
   * @param key - The translation key to parse
   * @returns Parsed key structure
   */
  parse(key: string): ParsedKey {
    if (!key || typeof key !== 'string') {
      throw new Error(`[i18n-bakery] Invalid key: ${key}. Key must be a non-empty string.`);
    }

    /**
     * Updated parsing strategy:
     * 
     * Single colon: "orders:meal" -> file: "orders:meal" (literal)
     * Multiple colons: "orders:meal:component" -> dirs: ["orders", "meal"], file: "component"
     * 
     * With dots:
     * "orders:meal.title" -> dirs: ["orders"], file: "meal", prop: ["title"]
     * "orders:meal:component.title" -> dirs: ["orders", "meal"], file: "component", prop: ["title"]
     * "orders:meal.form.title" -> dirs: ["orders", "meal"], file: "form", prop: ["title"]
     */

    // Step 1: Split by colon
    const colonParts = key.split(':');
    
    let directoriesFromColons: string[] = [];
    let fileAndPropertyPart: string;
    
    if (colonParts.length === 1) {
      // No colons: everything is in dots
      fileAndPropertyPart = colonParts[0];
    } else {
      // Has colons
      // All colon parts except the last are directories
      directoriesFromColons = colonParts.slice(0, -1);
      fileAndPropertyPart = colonParts[colonParts.length - 1];
    }
    
    // Step 2: Split by dot to get file and property path
    const dotParts = fileAndPropertyPart.split('.');
    
    // Step 3: Determine file and property path
    let file: string;
    let propertyPath: string[];
    let directoriesFromDots: string[] = [];
    
    if (dotParts.length === 1) {
      // No dots: just a file name
      file = dotParts[0];
      propertyPath = [];
    } else if (dotParts.length === 2) {
      // One dot: file.property
      file = dotParts[0];
      propertyPath = [dotParts[1]];
    } else {
      // Multiple dots: treat all but last two as directories
      // Example: "meal.orderComponent.title" -> dirs: ["meal"], file: "orderComponent", prop: ["title"]
      directoriesFromDots = dotParts.slice(0, -2);
      file = dotParts[dotParts.length - 2];
      propertyPath = [dotParts[dotParts.length - 1]];
    }

    // Step 4: Combine all directories
    const directories = [...directoriesFromColons, ...directoriesFromDots];

    // Validation: file name must not be empty
    if (!file) {
      throw new Error(`[i18n-bakery] Invalid key: ${key}. File name cannot be empty.`);
    }

    return {
      directories,
      file,
      propertyPath,
      originalKey: key
    };
  }

  /**
   * Normalizes a key to ensure consistent representation.
   * 
   * Normalization rules:
   * - Trim whitespace
   * - Convert to lowercase (optional, configurable)
   * - Remove duplicate separators
   * 
   * @param key - The translation key to normalize
   * @returns Normalized key string
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
      // Remove leading/trailing separators
      .replace(/^[:.]|[:.]$/g, '');
  }
}
