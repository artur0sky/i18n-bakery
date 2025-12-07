import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

import crypto from 'crypto';

// Local implementation to avoid cross-package import issues in CLI
class Aes256GcmCipher {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;
  private static readonly SALT_LENGTH = 16;
  private static readonly ITERATIONS = 100000;

  async encrypt(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const salt = crypto.getRandomValues(new Uint8Array(Aes256GcmCipher.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(Aes256GcmCipher.IV_LENGTH));
    const key = await this.deriveKey(secret, salt);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: Aes256GcmCipher.ALGORITHM, iv },
      key,
      dataBuffer
    );
    const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    return this.arrayBufferToBase64(combined);
  }

  private async deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: Aes256GcmCipher.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: Aes256GcmCipher.ALGORITHM, length: Aes256GcmCipher.KEY_LENGTH },
      false,
      ['encrypt']
    );
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }
}


// Polyfill for Node.js environment if not globally available
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

interface BakeOptions {
  out: string;
  minify?: boolean;
  hash?: boolean;
  manifest?: string;
  split?: boolean;
  encrypt?: boolean;
  key?: string;
}

export async function bake(source: string, options: BakeOptions) {
  console.log(chalk.blue(`🥯 I18n Bakery: Bake (Compilation)`));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Output: ${options.out}`));
  if (options.minify) console.log(chalk.gray(`Minify: Enabled`));
  if (options.hash) console.log(chalk.gray(`Hash: Enabled`));
  if (options.split) console.log(chalk.gray(`Split: Enabled (Lazy Loading)`));
  if (options.encrypt) console.log(chalk.gray(`Encryption: Enabled (AES-256-GCM)`));

  if (options.encrypt && !options.key) {
    throw new Error('Encryption key is required when encryption is enabled. Use --key <secret>');
  }

  const cipher = options.encrypt ? new Aes256GcmCipher() : null;
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
        validatePathSegment(locale, 'locale');
      } catch (e) {
        console.warn(chalk.red(`Skipping invalid locale directory "${locale}"`));
        continue;
      }

      console.log(chalk.cyan(`Baking locale: ${locale}...`));
      const globPath = path.join(localePath, '*.json').replace(/\\/g, '/');
      const files = await glob(globPath);
      
      const bundle: Record<string, any> = {};
      const namespaceFiles: Record<string, any> = {};

      for (const file of files) {
        const namespace = path.basename(file, '.json');
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
            await fs.writeFile(filePath, jsonContent);
            
            // Update manifest
            // Key: "en/common" -> "en/common.a1b2.json"
            manifest[`${locale}/${ns}`] = `${locale}/${filename}`;
            console.log(chalk.green(`  -> Baked ${locale}/${filename}`));
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
         console.log(chalk.green(`  -> Baked ${filename} (${(await fs.stat(filePath)).size} bytes)`));
      }
    }
  }
  
  if (options.manifest) {
    const manifestPath = path.join(outDir, options.manifest);
    await fs.writeJson(manifestPath, manifest, { spaces: options.minify ? 0 : 2 });
    console.log(chalk.green(`  -> Generated manifest: ${options.manifest}`));
  }
  
  console.log(chalk.blue(`\n✅ Baking complete!`));
}

function validatePathSegment(segment: string, name: string) {
  if (!segment) return;
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
    throw new Error(`Invalid ${name}: "${segment}" contains traversal characters`);
  }
}
