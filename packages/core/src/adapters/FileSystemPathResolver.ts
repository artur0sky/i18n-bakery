import { PathResolver, ParsedKey } from '../domain/KeyParser';
import * as path from 'path';

/**
 * Configuration for the FileSystemPathResolver
 */
export interface PathResolverConfig {
  /**
   * Base directory for translations (e.g., "./locales")
   */
  baseDir: string;
  
  /**
   * File extension for translation files (default: "json")
   */
  extension?: string;
}

/**
 * File system-based path resolver.
 * Resolves parsed keys to actual file system paths.
 * 
 * This adapter follows the Open/Closed Principle - it's open for extension
 * (can be subclassed for custom path resolution) but closed for modification.
 */
export class FileSystemPathResolver implements PathResolver {
  private readonly baseDir: string;
  private readonly extension: string;

  constructor(config: PathResolverConfig) {
    this.baseDir = config.baseDir;
    this.extension = config.extension || 'json';
  }

  /**
   * Resolves the complete file path for a given parsed key and locale.
   * 
   * Path structure: {baseDir}/{locale}/{directories...}/{file}.{extension}
   * 
   * Example:
   * - baseDir: "./locales"
   * - locale: "en"
   * - directories: ["orders", "meal"]
   * - file: "orderComponent"
   * - Result: "./locales/en/orders/meal/orderComponent.json"
   * 
   * @param locale - The target locale
   * @param parsedKey - The parsed key structure
   * @returns The complete file path
   */
  resolve(locale: string, parsedKey: ParsedKey): string {
    const segments = [
      this.baseDir,
      locale,
      ...parsedKey.directories,
      `${parsedKey.file}.${this.extension}`
    ];

    return path.join(...segments);
  }

  /**
   * Gets the base directory for translations.
   * @returns The base directory path
   */
  getBaseDir(): string {
    return this.baseDir;
  }

  /**
   * Gets the directory path for a specific locale and parsed key (without the file name).
   * Useful for creating directories before writing files.
   * 
   * @param locale - The target locale
   * @param parsedKey - The parsed key structure
   * @returns The directory path
   */
  getDirectoryPath(locale: string, parsedKey: ParsedKey): string {
    const segments = [
      this.baseDir,
      locale,
      ...parsedKey.directories
    ];

    return path.join(...segments);
  }
}
