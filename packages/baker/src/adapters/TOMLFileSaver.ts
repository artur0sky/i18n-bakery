/**
 * 🥯 i18n-bakery - TOML File Saver
 * 
 * Implementation of TranslationSaver for TOML format.
 * This provides a simple interface for saving translations in TOML format.
 * 
 * @module adapters/TOMLFileSaver
 */

import fs from 'fs/promises';
import path from 'path';
import { TranslationSaver, Locale, Namespace, Key } from '@i18n-bakery/core';

/**
 * TOML-based implementation of TranslationSaver.
 * 
 * Saves translations in TOML format with support for:
 * - Nested and flat file structures
 * - Alphabetically sorted keys
 * - Pretty-printed output
 * - Automatic directory creation
 */
export class TOMLFileSaver implements TranslationSaver {
  private localesPath: string;
  private fileStructure: 'nested' | 'flat';

  /**
   * Creates a new TOMLFileSaver.
   * 
   * @param localesPath - Base path for locale files
   * @param fileStructure - File structure mode ('nested' or 'flat')
   */
  constructor(localesPath: string, fileStructure: 'nested' | 'flat' = 'nested') {
    this.localesPath = localesPath;
    this.fileStructure = fileStructure;
  }

  /**
   * Saves a translation to a TOML file.
   * 
   * @param locale - Locale code (e.g., 'en', 'es-MX')
   * @param namespace - Namespace for the translation
   * @param key - Translation key
   * @param value - Translation value
   */
  async save(locale: Locale, namespace: Namespace, key: Key, value: string): Promise<void> {
    const filePath = path.join(this.localesPath, locale, `${namespace}.toml`);
    
    let content: Record<string, any> = {};
    
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Read existing file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      content = this.parseTOML(fileContent);
    } catch (error: any) {
      // If file doesn't exist, we start with empty object
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Update content based on file structure
    if (this.fileStructure === 'flat') {
      // Flat structure: key as-is (e.g., "home.title" = "...")
      content[key] = value;
    } else {
      // Nested structure: split key by dots and create nested objects
      this.setDeep(content, key, value);
    }

    // Sort keys alphabetically
    const sortedContent = this.sortObject(content);

    // Write back
    const tomlString = this.stringifyTOML(sortedContent);
    await fs.writeFile(filePath, tomlString, 'utf-8');
  }

  /**
   * Sets a deep property in an object using dot notation.
   * 
   * @param obj - Object to modify
   * @param path - Dot-separated path
   * @param value - Value to set
   */
  private setDeep(obj: any, path: string, value: string): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Recursively sorts object keys alphabetically.
   * 
   * @param obj - Object to sort
   * @returns Sorted object
   */
  private sortObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(this.sortObject.bind(this));
    
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key) => {
        result[key] = this.sortObject(obj[key]);
        return result;
      }, {});
  }

  /**
   * Converts an object to TOML string.
   * 
   * @param obj - Object to convert
   * @param prefix - Current key prefix for nested tables
   * @returns TOML string
   */
  public stringifyTOML(obj: any, prefix: string = ''): string {
    const lines: string[] = [];
    const tables: string[] = [];

    // First, output simple key-value pairs
    for (const [key, value] of Object.entries(obj)) {
      // Security: Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // This is a nested table
        tables.push(this.stringifyTOML(value, fullKey));
      } else {
        // Simple value
        lines.push(`${this.escapeKey(key)} = ${this.serializeValue(value)}`);
      }
    }

    // If we have a prefix, this is a table section
    if (prefix && (lines.length > 0 || tables.length > 0)) {
      const result: string[] = [];
      result.push(`[${prefix}]`);
      if (lines.length > 0) {
        result.push(...lines);
      }
      if (tables.length > 0) {
        result.push('');
        result.push(...tables);
      }
      return result.join('\n');
    }

    // Root level
    return [...lines, ...tables].join('\n') + '\n';
  }

  /**
   * Parses a TOML string into an object.
   * 
   * @param tomlString - TOML string to parse
   * @returns Parsed object
   */
  public parseTOML(tomlString: string): Record<string, any> {
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
        currentTable[cleanKey] = this.deserializeValue(value.trim());
      }
    }

    return result;
  }

  /**
   * Escapes a key for TOML format.
   * 
   * @param key - Key to escape
   * @returns Escaped key
   */
  private escapeKey(key: string): string {
    // Check if key needs quoting
    if (/^[A-Za-z0-9_-]+$/.test(key)) {
      return key;
    }
    
    return '"' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
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
   * Serializes a value for TOML format.
   * 
   * @param value - Value to serialize
   * @returns Serialized value
   */
  private serializeValue(value: any): string {
    if (typeof value === 'string') {
      const escaped = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return `"${escaped}"`;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      const items = value.map(item => this.serializeValue(item));
      return '[' + items.join(', ') + ']';
    }

    // For objects, this shouldn't happen in flat structure
    return '{}';
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
