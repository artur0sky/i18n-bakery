/**
 * 🥯 i18n-bakery - Baking Manager (Use Case Layer)
 * 
 * Orchestrates the compilation (baking) of translation files.
 * Handles reading, merging, minifying, hashing, encrypting, and writing.
 * 
 * @module use-cases/BakingManager
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import crypto from 'crypto';
import { Aes256GcmCipher, Logger, ConsoleLogger } from '@i18n-bakery/core';

// Polyfill for Node.js environment if not globally available
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

export interface BakeOptions {
  out: string;
  minify?: boolean;
  hash?: boolean;
  manifest?: string;
  split?: boolean;
  encrypt?: boolean;
  key?: string;
  verbose?: boolean;
}

export class BakingManager {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || new ConsoleLogger();
  }

  async bake(source: string, options: BakeOptions): Promise<void> {
    if (options.verbose) {
      // Assuming ConsoleLogger has setVerbose or similar, or we just log more
      // The core Logger interface might not have setVerbose.
      // We'll just log info/debug based on the interface.
      this.logger.info(`Verbose mode enabled`);
    }

    this.logger.info(`🥯 I18n Bakery: Bake (Compilation)`);
    this.logger.info(`Source: ${source}`);
    this.logger.info(`Output: ${options.out}`);
    if (options.minify) this.logger.info(`Minify: Enabled`);
    if (options.hash) this.logger.info(`Hash: Enabled`);
    if (options.split) this.logger.info(`Split: Enabled (Lazy Loading)`);
    if (options.encrypt) this.logger.info(`Encryption: Enabled (AES-256-GCM)`);

    if (options.encrypt && !options.key) {
      throw new Error('Encryption key is required when encryption is enabled. Use --key <secret>');
    }

    const cipher = options.encrypt ? new Aes256GcmCipher() : null;
    
    // Ensure source exists
    if (!(await fs.pathExists(source))) {
      throw new Error(`Source directory not found: ${source}`);
    }

    const locales = await fs.readdir(source);
    const manifest: Record<string, string> = {};
    
    const outDir = path.isAbsolute(options.out) ? options.out : path.join(process.cwd(), options.out);
    await fs.ensureDir(outDir);

    for (const locale of locales) {
      const localePath = path.join(source, locale);
      const stat = await fs.stat(localePath);
      
      if (stat.isDirectory()) {
        // Security: Validate locale
        try {
          this.validatePathSegment(locale, 'locale');
        } catch (e) {
          this.logger.warn(`Skipping invalid locale directory "${locale}"`);
          continue;
        }

        this.logger.info(`Baking locale: ${locale}...`);
        // Recursive glob to find all json files
        const globPath = path.join(localePath, '**/*.json').replace(/\\/g, '/');
        const files = await glob(globPath);
        
        const bundle: Record<string, any> = {};
        const namespaceFiles: Record<string, any> = {};

        for (const file of files) {
          // Derive namespace from relative path
          // e.g. locales/en-US/docs/namespaces.json -> docs/namespaces
          const relativePath = path.relative(localePath, file);
          const namespace = relativePath.replace(/\\/g, '/').replace(/\.json$/, '');
          const content = await fs.readJson(file);
          bundle[namespace] = content;
          namespaceFiles[namespace] = content;
        }

        if (options.split) {
           // Output individual files (Lazy Loading Friendly)
           const localeOutDir = path.join(outDir, locale);
           await fs.ensureDir(localeOutDir);
           
           for (const [ns, content] of Object.entries(namespaceFiles)) {
              let jsonContent = options.minify 
                ? JSON.stringify(content) 
                : JSON.stringify(content, null, 2);
              
              if (cipher && options.key) {
                 jsonContent = await cipher.encrypt(jsonContent, options.key);
              }

              let filename = `${ns}.json`;
              if (options.hash) {
                const hash = crypto.createHash('md5').update(jsonContent).digest('hex').substring(0, 8);
                filename = `${ns}.${hash}.json`;
              }
              
              const filePath = path.join(localeOutDir, filename);
              // Ensure directory exists for nested namespaces
              await fs.ensureDir(path.dirname(filePath));
              await fs.writeFile(filePath, jsonContent);
              
              // Update manifest
              // Key: "en/common" -> "en/common.a1b2.json"
              manifest[`${locale}/${ns}`] = `${locale}/${filename}`;
              this.logger.info(`  -> Baked ${locale}/${filename}`);
           }
        } else {
           // Output single bundle
           let jsonContent = options.minify 
              ? JSON.stringify(bundle) 
              : JSON.stringify(bundle, null, 2);

           if (cipher && options.key) {
              jsonContent = await cipher.encrypt(jsonContent, options.key);
           }
              
           let filename = `${locale}.json`;
           if (options.hash) {
              const hash = crypto.createHash('md5').update(jsonContent).digest('hex').substring(0, 8);
              filename = `${locale}.${hash}.json`;
           }
           
           const filePath = path.join(outDir, filename);
           await fs.writeFile(filePath, jsonContent);
           
           // Update manifest
           // Key: "en" -> "en.a1b2.json"
           manifest[locale] = filename;
           this.logger.info(`  -> Baked ${filename} (${(await fs.stat(filePath)).size} bytes)`);
        }
      }
    }
    
    if (options.manifest) {
      const manifestPath = path.join(outDir, options.manifest);
      await fs.writeJson(manifestPath, manifest, { spaces: options.minify ? 0 : 2 });
      this.logger.info(`  -> Generated manifest: ${options.manifest}`);
    }
    
    this.logger.info(`✅ Baking complete!`);
  }

  private validatePathSegment(segment: string, name: string) {
    if (!segment) return;
    if (
      segment.includes('..') || 
      segment.includes('/') || 
      segment.includes('\\') ||
      path.isAbsolute(segment)
    ) {
      throw new Error(`Invalid ${name}: "${segment}" contains traversal characters or is absolute`);
    }
  }
}
