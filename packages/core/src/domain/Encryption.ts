
/**
 * 🥯 i18n-bakery - Encryption (Domain Layer)
 * 
 * Defines the interface for encryption/decryption adapters.
 * 
 * @module domain/Encryption
 */

/**
 * Interface for encryption adapters.
 * Follows the Strategy pattern to allow different algorithms.
 */
export interface Cipher {
  /**
   * Encrypts a string value.
   * 
   * @param data - The plaintext string to encrypt
   * @param key - The secret key (raw string or passphrase)
   * @returns Promise resolving to the encrypted string (usually base64 encoded)
   */
  encrypt(data: string, key: string): Promise<string>;

  /**
   * Decrypts an encrypted string.
   * 
   * @param encryptedData - The encrypted string (usually base64 encoded)
   * @param key - The secret key (raw string or passphrase)
   * @returns Promise resolving to the decrypted plaintext string
   */
  decrypt(encryptedData: string, key: string): Promise<string>;
}
