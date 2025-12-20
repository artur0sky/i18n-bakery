/**
 * 🥯 i18n-bakery - TOML Loader (Adapter Layer)
 * 
 * Concrete implementation of the Loader interface for TOML format.
 * Loads translation files in TOML format for runtime use.
 * 
 * @module adapters/TOMLLoader
 */

import { Loader, Locale, Namespace, TranslationMap } from '../domain/types';

/**
 * TOML-based implementation of the Loader interface.
 * 
 * Loads translations from TOML files with support for:
 * - Node.js file system loading
 * - Browser fetch API loading
 * - Nested and flat file structures
 * - Automatic parsing of TOML format
 */
export class TOMLLoader implements Loader {
  private basePath: string;
  private fileStructure: 'nested' | 'flat';

  /**
   * Creates a new TOMLLoader.
   * 
   * @param basePath - Base path for locale files (e.g., '/locales' or './public/locales')
   * @param fileStructure - File structure mode ('nested' or 'flat')
   */
  constructor(basePath: string, fileStructure: 'nested' | 'flat' = 'nested') {
    this.basePath = basePath;
    this.fileStructure = fileStructure;
  }

  /**
   * Loads a translation namespace for a specific locale.
   * 
   * @param locale - Locale code (e.g., 'en', 'es-MX')
   * @param namespace - Namespace to load
   * @returns Promise that resolves with the translation map, or null if not found
   */
  async load(locale: Locale, namespace: Namespace): Promise<TranslationMap | null> {
    const filePath = this.getFilePath(locale, namespace);
    
    try {
      const content = await this.loadFile(filePath);
      const parsed = this.parseTOML(content);
      
      // If flat structure, return as-is
      // If nested structure, it's already nested
      return parsed as TranslationMap;
    } catch (error: any) {
      // File not found or parse error
      if (error.code === 'ENOENT' || error.name === 'NotFoundError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Gets the file path for a locale and namespace.
   * 
   * @param locale - Locale code
   * @param namespace - Namespace
   * @returns File path
   */
  private getFilePath(locale: Locale, namespace: Namespace): string {
    // Handle hierarchical namespaces: 'home/hero' -> locales/en/home/hero.toml
    return `${this.basePath}/${locale}/${namespace}.toml`;
  }

  /**
   * Loads a file from the file system or network.
   * 
   * @param filePath - Path to the file
   * @returns Promise that resolves with the file content
   */
  private async loadFile(filePath: string): Promise<string> {
    if (typeof window === 'undefined') {
      // Node.js environment
      const fs = await import('fs/promises');
      return await fs.readFile(filePath, 'utf-8');
    } else {
      // Browser environment
      const response = await fetch(filePath);
      if (!response.ok) {
        const error: any = new Error(`Failed to load ${filePath}: ${response.statusText}`);
        error.name = 'NotFoundError';
        throw error;
      }
      return await response.text();
    }
  }

  /**
   * Parses a TOML string into an object.
   * 
   * @param tomlString - TOML string to parse
   * @returns Parsed object
   */
  private parseTOML(tomlString: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = tomlString.split('\n');
    
    let currentTable: any = result;
    let currentPath: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse table header
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const tableName = trimmed.slice(1, -1);
        currentPath = tableName.split('.');
        
        // Navigate/create the table structure
        currentTable = result;
        for (const part of currentPath) {
          if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
             continue; // Skip dangerous keys
          }

          if (!currentTable[part]) {
            currentTable[part] = {};
          }
          currentTable = currentTable[part];
        }
        continue;
      }

      // Parse key-value pair
      const kvMatch = trimmed.match(/^([^=]+?)\s*=\s*(.+)$/);
      if (kvMatch) {
        const [, key, value] = kvMatch;
        const cleanKey = this.unescapeKey(key.trim());

        if (cleanKey === '__proto__' || cleanKey === 'constructor' || cleanKey === 'prototype') {
            continue; // Skip dangerous keys
        }

        currentTable[cleanKey] = this.deserializeValue(value.trim());
      }
    }

    return result;
  }

  /**
   * Unescapes a TOML key.
   * 
   * @param key - Key to unescape
   * @returns Unescaped key
   */
  private unescapeKey(key: string): string {
    if (key.startsWith('"') && key.endsWith('"')) {
      return key.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    return key;
  }

  /**
   * Deserializes a TOML value.
   * 
   * @param value - Serialized value
   * @returns Deserialized value
   */
  private deserializeValue(value: string): any {
    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return parseFloat(value);
    }

    // Array
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1).trim();
      if (!arrayContent) return [];
      
      // Simple split by comma (doesn't handle nested arrays, but sufficient for our use case)
      return arrayContent.split(',').map(item => this.deserializeValue(item.trim()));
    }

    // String
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1)
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    // Unquoted string (shouldn't happen in valid TOML, but handle it)
    return value;
  }
}
