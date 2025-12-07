/**
 * 🥯 i18n-bakery - Node File System Manager (Adapter Layer)
 * 
 * Concrete implementation of the FileSystemManager interface for Node.js.
 * Handles directory creation and path operations.
 * 
 * @module adapters/NodeFileSystemManager
 */

import { FileSystemManager } from '../domain/FileWriter';

/**
 * Node.js-based implementation of the FileSystemManager interface.
 * 
 * This adapter uses Node.js fs/promises API for file system operations.
 */
export class NodeFileSystemManager implements FileSystemManager {
  /**
   * Creates a directory and all parent directories if they don't exist.
   * 
   * @param dirPath - Absolute path to the directory
   */
  async createDirectory(dirPath: string): Promise<void> {
    if (typeof window !== 'undefined') {
      throw new Error('Directory creation is not supported in browser environment');
    }

    const fs = await import('fs/promises');
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Checks if a directory exists.
   * 
   * @param dirPath - Absolute path to the directory
   * @returns Promise that resolves with true if directory exists
   */
  async directoryExists(dirPath: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      return false;
    }

    try {
      const fs = await import('fs/promises');
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Gets the directory path from a file path.
   * 
   * @param filePath - Absolute path to the file
   * @returns Directory path
   */
  getDirectoryPath(filePath: string): string {
    // Manual path parsing to avoid dependency on 'path' module
    const separator = filePath.includes('\\') ? '\\' : '/';
    const parts = filePath.split(separator);
    parts.pop(); // Remove file name
    return parts.join(separator);
  }
}
