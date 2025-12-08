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
   * @throws Error if any path segment is invalid
   */
  resolve(locale: string, parsedKey: ParsedKey): string {
    this.validatePathSegment(locale);
    parsedKey.directories.forEach(dir => this.validatePathSegment(dir));
    this.validatePathSegment(parsedKey.file);

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
   * @throws Error if any path segment is invalid
   */
  getDirectoryPath(locale: string, parsedKey: ParsedKey): string {
    this.validatePathSegment(locale);
    parsedKey.directories.forEach(dir => this.validatePathSegment(dir));

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

  /**
   * Validates a path segment to prevent traversal and invalid characters.
   * 
   * @param segment - The path segment to validate
   * @throws Error if the segment is invalid
   */
  private validatePathSegment(segment: string): void {
    if (!segment) return;

    // Check for path traversal
    if (segment.includes('..')) {
      throw new Error(`Invalid path segment: "${segment}" contains traversal characters`);
    }

    // Check for path separators (both forward and backward slashes)
    if (segment.includes('/') || segment.includes('\\')) {
      throw new Error(`Invalid path segment: "${segment}" contains path separators`);
    }

    // Check for null bytes
    if (segment.includes('\0')) {
      throw new Error(`Invalid path segment: "${segment}" contains null bytes`);
    }
  }
}
