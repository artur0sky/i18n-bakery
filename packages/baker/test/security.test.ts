
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { FileSystemPathResolver } from '../src/adapters/FileSystemPathResolver';
import { DefaultKeyParser } from '../src/adapters/DefaultKeyParser';
import { ParsedKey } from '../src/domain/KeyParser';
import { JSONFileWriter } from '../src/adapters/JSONFileWriter';
import { MustacheFormatter } from '@i18n-bakery/core';
import { JSONFileSaver } from '../src/adapters/JSONFileSaver';
import { TOMLFileSaver } from '../src/adapters/TOMLFileSaver';
import { BakingManager } from '../src/use-cases/BakingManager';

describe('Security Tests', () => {
  describe('translation file boundaries', () => {
    let dir: string;

    beforeEach(async () => {
      dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bakery-security-'));
    });

    afterEach(async () => {
      await fs.remove(dir);
    });

    it.each([['JSON', JSONFileSaver], ['TOML', TOMLFileSaver]] as const)('rejects prototype paths in %s', async (_, Saver) => {
      const saver = new Saver(dir);
      for (const key of ['__proto__.bakery_probe', 'constructor.prototype.bakery_probe', 'safe.__proto__']) {
        await expect(saver.save('en', 'common', key, 'bad')).rejects.toThrow(/prototype-related/);
      }
      await saver.save('en', 'common', 'toString.label', 'safe');
      expect(({} as Record<string, unknown>).bakery_probe).toBeUndefined();
    });

    it('rejects malicious TOML table and property names', () => {
      const saver = new TOMLFileSaver(dir);
      for (const content of ['[__proto__]\nbakery_probe = "bad"', '[constructor.prototype]\nbakery_probe = "bad"', '"__proto__" = "bad"']) {
        expect(() => saver.parseTOML(content)).toThrow(/prototype-related/);
      }
      expect(({} as Record<string, unknown>).bakery_probe).toBeUndefined();
      expect(saver.parseTOML('[toString]\nlabel = "safe"')).toEqual({ toString: { label: 'safe' } });
    });

    it('rejects manifest paths before writing output', async () => {
      const source = path.join(dir, 'source');
      const out = path.join(dir, 'out');
      await fs.ensureDir(source);
      const manager = new BakingManager();
      for (const manifest of ['../escape.json', '..\\escape.json', 'nested/manifest.json', 'C:\\escape.json', 'file:stream']) {
        await expect(manager.bake(source, { out, manifest })).rejects.toThrow(/Invalid manifest/);
      }
      expect(await fs.pathExists(out)).toBe(false);
    });

    it('does not follow a manifest symlink outside the output directory', async (context) => {
      const source = path.join(dir, 'source');
      const out = path.join(dir, 'out');
      const outside = path.join(dir, 'outside.json');
      await fs.ensureDir(source);
      await fs.ensureDir(out);
      await fs.writeFile(outside, 'untouched');
      try {
        await fs.symlink(outside, path.join(out, 'manifest.json'), 'file');
      } catch (error) {
        if (process.platform === 'win32' && (error as NodeJS.ErrnoException).code === 'EPERM') {
          context.skip();
        }
        throw error;
      }
      await expect(new BakingManager().bake(source, { out, manifest: 'manifest.json' })).rejects.toThrow(/symbolic links/);
      expect(await fs.readFile(outside, 'utf8')).toBe('untouched');
    });
  });

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

  describe('XSS Prevention', () => {
    const formatter = new MustacheFormatter();

    it('should escape HTML in interpolated values', () => {
      const template = 'Hello {{name}}';
      const result = formatter.interpolate(template, { name: '<script>alert(1)</script>' });
      expect(result).toBe('Hello &lt;script&gt;alert(1)&lt;/script&gt;');
    });

    it('should escape quotes in interpolated values', () => {
      const template = 'Title: {{title}}';
      const result = formatter.interpolate(template, { title: '"Hello"' });
      expect(result).toBe('Title: &quot;Hello&quot;');
    });
  });
});
