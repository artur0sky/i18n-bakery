
import { describe, it, expect } from 'vitest';
import { FileSystemPathResolver } from '../src/adapters/FileSystemPathResolver';
import { DefaultKeyParser } from '../src/adapters/DefaultKeyParser';
import { ParsedKey } from '../src/domain/KeyParser';
import { JSONFileWriter } from '../src/adapters/JSONFileWriter';

describe('Security Tests', () => {
  describe('FileSystemPathResolver - Path Traversal Prevention', () => {
    const resolver = new FileSystemPathResolver({ baseDir: './locales' });

    it('should throw error when directories contain traversal characters', () => {
      const parsed: ParsedKey = {
        directories: ['..', 'etc'],
        file: 'passwd',
        propertyPath: ['content'],
        originalKey: '..:etc:passwd.content',
      };

      expect(() => resolver.resolve('en', parsed)).toThrow(/Invalid path segment/);
    });

    it('should throw error when file contains traversal characters', () => {
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: '../secret',
        propertyPath: ['key'],
        originalKey: 'orders:../secret.key',
      };

      expect(() => resolver.resolve('en', parsed)).toThrow(/Invalid path segment/);
    });

    it('should throw error when locale contains traversal characters', () => {
      const parsed: ParsedKey = {
        directories: ['orders'],
        file: 'meal',
        propertyPath: ['title'],
        originalKey: 'orders:meal.title',
      };

      expect(() => resolver.resolve('../en', parsed)).toThrow(/Invalid path segment/);
    });
    
    it('should throw error when directories contain backslash', () => {
        const parsed: ParsedKey = {
          directories: ['..\\etc'],
          file: 'passwd',
          propertyPath: ['content'],
          originalKey: '..\\etc:passwd.content',
        };
  
        expect(() => resolver.resolve('en', parsed)).toThrow(/Invalid path segment/);
      });
  });

  describe('DefaultKeyParser - Injection Prevention', () => {
    const parser = new DefaultKeyParser();

    it('should sanitize keys containing script tags', () => {
      const key = 'auth:<script>alert(1)</script>.title';
      // We expect the parser to either throw or sanitize. 
      // For now, let's assume we want it to throw or return a safe key.
      // The user said "verify it is a key and not a badscript injected".
      // So throwing is probably best.
      expect(() => parser.parse(key)).toThrow(/Invalid key format/);
    });

    it('should sanitize keys containing suspicious characters', () => {
      const key = 'auth:javascript:void(0).title';
      expect(() => parser.parse(key)).toThrow(/Invalid key format/);
    });
  });

  describe('JSONFileWriter - Extension Restriction', () => {
    // Mock FileSystemManager
    const mockFsManager = {
      createDirectory: async () => {},
      directoryExists: async () => true,
      getDirectoryPath: (path: string) => path.substring(0, path.lastIndexOf('/')),
    } as any;

    const writer = new JSONFileWriter(mockFsManager);

    it('should throw error when writing file with invalid extension', async () => {
      const content = { key: { variants: {} } };
      await expect(writer.write('test.txt', content)).rejects.toThrow(/Security Error/);
    });

    it('should allow writing file with .json extension', async () => {
      // Mock writeFile to avoid actual file system interaction
      (writer as any).writeFile = async () => {};
      
      const content = { key: { variants: {} } };
      await expect(writer.write('test.json', content)).resolves.not.toThrow();
    });
  });
});
