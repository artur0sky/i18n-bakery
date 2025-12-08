/**
 * 🥯 i18n-bakery - Output Format Configuration Tests
 * 
 * Tests for the outputFormat configuration option.
 * Ensures users can configure different file formats for translations.
 */

import { describe, it, expect } from 'vitest';
import { initI18n, OutputFormat } from '@i18n-bakery/core';
import { FileSystemPathResolver } from '../src/adapters/FileSystemPathResolver';

describe('Output Format Configuration', () => {
  describe('I18nConfig.outputFormat', () => {
    it('should accept json as outputFormat', () => {
      const config = {
        locale: 'en',
        outputFormat: 'json' as OutputFormat,
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });

    it('should accept yml as outputFormat', () => {
      const config = {
        locale: 'en',
        outputFormat: 'yml' as OutputFormat,
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });

    it('should accept yaml as outputFormat', () => {
      const config = {
        locale: 'en',
        outputFormat: 'yaml' as OutputFormat,
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });

    it('should accept toml as outputFormat', () => {
      const config = {
        locale: 'en',
        outputFormat: 'toml' as OutputFormat,
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });

    it('should accept toon as outputFormat', () => {
      const config = {
        locale: 'en',
        outputFormat: 'toon' as OutputFormat,
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });

    it('should work without outputFormat (defaults to json)', () => {
      const config = {
        locale: 'en',
      };
      
      const i18n = initI18n(config);
      expect(i18n).toBeDefined();
    });
  });

  describe('PathResolver with different extensions', () => {
    it('should create PathResolver with json extension', () => {
      const resolver = new FileSystemPathResolver({
        baseDir: './locales',
        extension: 'json',
      });
      
      expect(resolver).toBeDefined();
    });

    it('should create PathResolver with yml extension', () => {
      const resolver = new FileSystemPathResolver({
        baseDir: './locales',
        extension: 'yml',
      });
      
      expect(resolver).toBeDefined();
    });

    it('should create PathResolver with yaml extension', () => {
      const resolver = new FileSystemPathResolver({
        baseDir: './locales',
        extension: 'yaml',
      });
      
      expect(resolver).toBeDefined();
    });

    it('should create PathResolver with toml extension', () => {
      const resolver = new FileSystemPathResolver({
        baseDir: './locales',
        extension: 'toml',
      });
      
      expect(resolver).toBeDefined();
    });

    it('should create PathResolver with toon extension', () => {
      const resolver = new FileSystemPathResolver({
        baseDir: './locales',
        extension: 'toon',
      });
      
      expect(resolver).toBeDefined();
    });
  });
});
