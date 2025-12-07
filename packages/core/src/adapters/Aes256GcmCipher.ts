
/**
 * 🥯 i18n-bakery - AES-256-GCM Cipher (Adapter Layer)
 * 
 * Implementation of Cipher interface using AES-256-GCM.
 * Uses the Web Crypto API (supported in modern browsers and Node.js 15+).
 * 
 * @module adapters/Aes256GcmCipher
 */

import { Cipher } from '../domain/Encryption';

export class Aes256GcmCipher implements Cipher {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12; // Recommended for GCM
  private static readonly SALT_LENGTH = 16;
  private static readonly ITERATIONS = 100000;

  /**
   * Encrypts data using AES-256-GCM.
   * Format: salt(16) + iv(12) + ciphertext
   */
  async encrypt(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(Aes256GcmCipher.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(Aes256GcmCipher.IV_LENGTH));

    // Derive key from secret
    const key = await this.deriveKey(secret, salt);

    // Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: Aes256GcmCipher.ALGORITHM, iv },
      key,
      dataBuffer
    );

    // Combine salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

    // Return as base64
    return this.arrayBufferToBase64(combined);
  }

  /**
   * Decrypts data using AES-256-GCM.
   */
  async decrypt(encryptedData: string, secret: string): Promise<string> {
    const combined = this.base64ToArrayBuffer(encryptedData);
    
    // Extract salt, iv, and ciphertext
    const salt = combined.slice(0, Aes256GcmCipher.SALT_LENGTH);
    const iv = combined.slice(Aes256GcmCipher.SALT_LENGTH, Aes256GcmCipher.SALT_LENGTH + Aes256GcmCipher.IV_LENGTH);
    const ciphertext = combined.slice(Aes256GcmCipher.SALT_LENGTH + Aes256GcmCipher.IV_LENGTH);

    // Derive key from secret and extracted salt
    const key = await this.deriveKey(secret, salt);

    try {
      // Decrypt
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: Aes256GcmCipher.ALGORITHM, iv },
        key,
        ciphertext
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (e) {
      throw new Error('Decryption failed: Invalid key or corrupted data');
    }
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
