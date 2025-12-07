
import { describe, it, expect, beforeAll } from 'vitest';
import { Aes256GcmCipher } from '../src/adapters/Aes256GcmCipher';
import { webcrypto } from 'crypto';

// Polyfill for Node.js environment if not globally available
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

describe('Aes256GcmCipher', () => {
  const cipher = new Aes256GcmCipher();
  const secret = 'super-secret-password';
  const data = 'Hello, World!';

  it('should encrypt and decrypt data correctly', async () => {
    const encrypted = await cipher.encrypt(data, secret);
    
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(data);
    
    const decrypted = await cipher.decrypt(encrypted, secret);
    expect(decrypted).toBe(data);
  });

  it('should produce different outputs for same data (random IV/Salt)', async () => {
    const encrypted1 = await cipher.encrypt(data, secret);
    const encrypted2 = await cipher.encrypt(data, secret);
    
    expect(encrypted1).not.toBe(encrypted2);
    
    const decrypted1 = await cipher.decrypt(encrypted1, secret);
    const decrypted2 = await cipher.decrypt(encrypted2, secret);
    
    expect(decrypted1).toBe(data);
    expect(decrypted2).toBe(data);
  });

  it('should fail to decrypt with wrong key', async () => {
    const encrypted = await cipher.encrypt(data, secret);
    
    await expect(cipher.decrypt(encrypted, 'wrong-password'))
      .rejects.toThrow();
  });

  it('should fail to decrypt tampered data', async () => {
    const encrypted = await cipher.encrypt(data, secret);
    
    // Tamper with the base64 string
    const tampered = encrypted.substring(0, encrypted.length - 4) + 'AAAA';
    
    await expect(cipher.decrypt(tampered, secret))
      .rejects.toThrow();
  });
});
