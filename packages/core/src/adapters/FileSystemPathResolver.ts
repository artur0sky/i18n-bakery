/**
 * 🥯 i18n-bakery - File System Path Resolver (Adapter Layer)
 * 
 * Concrete implementation of the PathResolver interface.
 * Resolves parsed keys to file system paths.
 * 
 * @module adapters/FileSystemPathResolver
 */

import { PathResolver, PathResolverConfig, ParsedKey } from '../domain/KeyParser';

/**
 * File system-based implementation of the PathResolver interface.
 * 
 * This adapter translates parsed keys into actual file system paths,
 * supporting configurable base directories and file extensions.
 * 
 * @example
 * const resolver = new FileSystemPathResolver({ baseDir: './locales' });
 * const parsed = { directories: ["orders"], file: "meal", propertyPath: ["title"], originalKey: "..." };
 * const filePath = resolver.resolve("en", parsed);
 * // "./locales/en/orders/meal.json"
 */
export class FileSystemPathResolver implements PathResolver {
  private baseDir: string;
  private extension: string;
  private separator: string;

  /**
   * Creates a new FileSystemPathResolver.
   * 
   * @param config - Configuration options
   */
  constructor(config: PathResolverConfig) {
    this.baseDir = config.baseDir;
    this.extension = config.extension || 'json';
    // Use forward slash as default separator (works on all platforms)
    this.separator = '/';
  }

  /**
   * Resolves a parsed key to a complete file path.
   * 
   * Path structure: {baseDir}/{locale}/{directories...}/{file}.{extension}
   * 
   * @param locale - The locale (e.g., "en", "es-MX")
   * @param parsedKey - The parsed key structure
   * @returns Complete file path
   */
  resolve(locale: string, parsedKey: ParsedKey): string {
    const dirPath = this.getDirectoryPath(locale, parsedKey);
    const fileName = `${parsedKey.file}.${this.extension}`;
    return this.joinPaths(dirPath, fileName);
  }

  /**
   * Gets the directory path (without file name) for a parsed key.
   * 
   * Path structure: {baseDir}/{locale}/{directories...}
   * 
   * @param locale - The locale
   * @param parsedKey - The parsed key structure
   * @returns Directory path
   */
  getDirectoryPath(locale: string, parsedKey: ParsedKey): string {
    const segments = [this.baseDir, locale, ...parsedKey.directories];
    return this.joinPaths(...segments);
  }

  /**
   * Joins path segments using the configured separator.
   * 
   * @param segments - Path segments to join
   * @returns Joined path
   */
  private joinPaths(...segments: string[]): string {
    return segments
      .filter(segment => segment && segment.length > 0)
      .join(this.separator);
  }
}
