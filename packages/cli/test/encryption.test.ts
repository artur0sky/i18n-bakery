
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { bake } from '../src/commands/bake';
// Local implementation for testing to avoid cross-package import issues
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

  async decrypt(encryptedData: string, secret: string): Promise<string> {
    const combined = this.base64ToArrayBuffer(encryptedData);
    const salt = combined.slice(0, Aes256GcmCipher.SALT_LENGTH);
    const iv = combined.slice(Aes256GcmCipher.SALT_LENGTH, Aes256GcmCipher.SALT_LENGTH + Aes256GcmCipher.IV_LENGTH);
    const ciphertext = combined.slice(Aes256GcmCipher.SALT_LENGTH + Aes256GcmCipher.IV_LENGTH);
    const key = await this.deriveKey(secret, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: Aes256GcmCipher.ALGORITHM, iv },
      key,
      ciphertext
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
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
      ['encrypt', 'decrypt']
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

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

// Polyfill for Node.js environment if not globally available
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = require('crypto').webcrypto;
}

const TEST_DIR = path.join(__dirname, 'temp-encryption');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');
const DIST_DIR = path.join(TEST_DIR, 'dist');

describe('Bake Encryption', () => {
  beforeEach(async () => {
    await fs.ensureDir(LOCALES_DIR);
    await fs.ensureDir(path.join(LOCALES_DIR, 'en'));
    await fs.writeJson(path.join(LOCALES_DIR, 'en', 'common.json'), { hello: 'Hello' });
  });

  afterEach(async () => {
    for (let i = 0; i < 5; i++) {
        try {
            await fs.remove(TEST_DIR);
            break;
        } catch (error: any) {
             if (error.code === 'ENOENT') break;
             if (i === 4) console.warn('Failed to cleanup TEST_DIR:', error);
             await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
  });

  it('should encrypt output when encrypt option is true', async () => {
    const secret = 'my-secret-key';
    await bake(LOCALES_DIR, { out: DIST_DIR, encrypt: true, key: secret });
    
    const outFile = path.join(DIST_DIR, 'en.json');
    const content = await fs.readFile(outFile, 'utf-8') as string;
    
    // Should not be valid JSON anymore (it's base64)
    expect(() => JSON.parse(content)).toThrow();
    
    // Decrypt to verify
    const cipher = new Aes256GcmCipher();
    const decrypted = await cipher.decrypt(content, secret);
    const json = JSON.parse(decrypted);
    
    expect(json).toEqual({ common: { hello: 'Hello' } });
  });

  it('should encrypt split files', async () => {
    const secret = 'my-secret-key';
    await bake(LOCALES_DIR, { out: DIST_DIR, encrypt: true, key: secret, split: true });
    
    const outFile = path.join(DIST_DIR, 'en', 'common.json');
    const content = await fs.readFile(outFile, 'utf-8') as string;
    
    // Should not be valid JSON
    expect(() => JSON.parse(content)).toThrow();
    
    // Decrypt
    const cipher = new Aes256GcmCipher();
    const decrypted = await cipher.decrypt(content, secret);
    const json = JSON.parse(decrypted);
    
    expect(json).toEqual({ hello: 'Hello' });
  });
});
