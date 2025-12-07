/**
 * 🥯 i18n-bakery - JSON File Writer (Adapter Layer)
 * 
 * Concrete implementation of the FileWriter interface for JSON format.
 * Handles reading, writing, and merging JSON translation files.
 * 
 * @module adapters/JSONFileWriter
 */

import {
  FileWriter,
  FileWriterConfig,
  TranslationFileContent,
  FileSystemManager,
} from '../domain/FileWriter';

/**
 * JSON-based implementation of the FileWriter interface.
 * 
 * This adapter handles JSON file operations with support for:
 * - Pretty-printing with configurable indentation
 * - Append-only mode to prevent overwriting manual edits
 * - Automatic directory creation
 * - Deep merging of translation variants
 */
export class JSONFileWriter implements FileWriter {
  private config: Required<FileWriterConfig>;
  private fsManager: FileSystemManager;

  /**
   * Creates a new JSONFileWriter.
   * 
   * @param fsManager - File system manager for directory operations
   * @param config - Configuration options
   */
  constructor(fsManager: FileSystemManager, config?: Partial<FileWriterConfig>) {
    this.fsManager = fsManager;
    this.config = {
      format: 'json',
      prettyPrint: config?.prettyPrint ?? true,
      indentSize: config?.indentSize ?? 2,
      createDirectories: config?.createDirectories ?? true,
    };
  }

  /**
   * Writes translation content to a JSON file.
   * 
   * @param filePath - Absolute path to the file
   * @param content - Translation content to write
   */
  async write(filePath: string, content: TranslationFileContent): Promise<void> {
    // Ensure directory exists
    if (this.config.createDirectories) {
      const dirPath = this.fsManager.getDirectoryPath(filePath);
      if (!(await this.fsManager.directoryExists(dirPath))) {
        await this.fsManager.createDirectory(dirPath);
      }
    }

    // Serialize content
    const jsonString = this.serialize(content);

    // Write to file (this will be implemented with actual fs operations)
    await this.writeFile(filePath, jsonString);
  }

  /**
   * Reads translation content from a JSON file.
   * 
   * @param filePath - Absolute path to the file
   * @returns Promise that resolves with the file content, or null if file doesn't exist
   */
  async read(filePath: string): Promise<TranslationFileContent | null> {
    if (!(await this.exists(filePath))) {
      return null;
    }

    const fileContent = await this.readFile(filePath);
    return this.deserialize(fileContent);
  }

  /**
   * Checks if a file exists.
   * 
   * @param filePath - Absolute path to the file
   * @returns Promise that resolves with true if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await this.readFile(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Merges new content with existing file content.
   * 
   * @param filePath - Absolute path to the file
   * @param newContent - New content to merge
   * @param mode - Merge mode: 'append' (don't overwrite) or 'replace' (overwrite)
   */
  async merge(
    filePath: string,
    newContent: TranslationFileContent,
    mode: 'append' | 'replace'
  ): Promise<void> {
    const existingContent = await this.read(filePath);

    if (!existingContent) {
      // File doesn't exist, just write new content
      await this.write(filePath, newContent);
      return;
    }

    const mergedContent = this.mergeContent(existingContent, newContent, mode);
    await this.write(filePath, mergedContent);
  }

  /**
   * Serializes translation content to JSON string.
   * 
   * @param content - Translation content
   * @returns JSON string
   */
  private serialize(content: TranslationFileContent): string {
    if (this.config.prettyPrint) {
      return JSON.stringify(content, null, this.config.indentSize);
    }
    return JSON.stringify(content);
  }

  /**
   * Deserializes JSON string to translation content.
   * 
   * @param jsonString - JSON string
   * @returns Translation content
   */
  private deserialize(jsonString: string): TranslationFileContent {
    return JSON.parse(jsonString);
  }

  /**
   * Merges two translation contents based on the specified mode.
   * 
   * @param existing - Existing content
   * @param newContent - New content to merge
   * @param mode - Merge mode
   * @returns Merged content
   */
  private mergeContent(
    existing: TranslationFileContent,
    newContent: TranslationFileContent,
    mode: 'append' | 'replace'
  ): TranslationFileContent {
    const result: TranslationFileContent = { ...existing };

    for (const [key, newEntry] of Object.entries(newContent)) {
      if (!result[key]) {
        // Key doesn't exist, add it
        result[key] = newEntry;
        continue;
      }

      // Key exists, merge variants
      for (const [signatureKey, newVariant] of Object.entries(newEntry.variants)) {
        if (mode === 'append' && result[key].variants[signatureKey]) {
          // Append mode: don't overwrite existing variants
          continue;
        }

        // Add or replace variant
        result[key].variants[signatureKey] = newVariant;
      }
    }

    return result;
  }

  /**
   * Writes string content to a file.
   * This is a placeholder that will use actual fs operations.
   * 
   * @param filePath - Absolute path to the file
   * @param content - String content to write
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    // This will be implemented with actual fs.writeFile in Node.js environment
    // For now, this is a placeholder that demonstrates the interface
    if (typeof window === 'undefined') {
      // Node.js environment
      const fs = await import('fs/promises');
      await fs.writeFile(filePath, content, 'utf-8');
    } else {
      // Browser environment - not supported
      throw new Error('File writing is not supported in browser environment');
    }
  }

  /**
   * Reads string content from a file.
   * This is a placeholder that will use actual fs operations.
   * 
   * @param filePath - Absolute path to the file
   * @returns String content
   */
  private async readFile(filePath: string): Promise<string> {
    // This will be implemented with actual fs.readFile in Node.js environment
    if (typeof window === 'undefined') {
      // Node.js environment
      const fs = await import('fs/promises');
      return await fs.readFile(filePath, 'utf-8');
    } else {
      // Browser environment - not supported
      throw new Error('File reading is not supported in browser environment');
    }
  }
}
