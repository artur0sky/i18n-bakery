
import { Plugin, PluginMetadata, PluginConfig } from '../domain/Plugin';
import { Loader, TranslationMap, Locale, Namespace } from '../domain/types';
import { Cipher } from '../domain/Encryption';

export interface HttpBackendOptions {
  /**
   * Path pattern to load translations.
   * Use {{lng}} for locale and {{ns}} for namespace.
   * Example: '/locales/{{lng}}/{{ns}}.json'
   */
  loadPath: string;
  
  /**
   * Path to the manifest file (optional).
   * If provided, the backend will try to load this first to resolve hashed filenames.
   */
  manifestPath?: string;
  
  /**
   * Custom request options for fetch.
   */
  requestOptions?: RequestInit;

  /**
   * Cipher implementation for decryption (optional).
   * If provided, the backend will attempt to decrypt the response.
   */
  cipher?: Cipher;

  /**
   * Secret key for decryption (optional).
   * Required if cipher is provided.
   */
  secret?: string;
}

/**
 * HttpBackend plugin for loading translations via fetch API.
 * Supports "Smart Baking" via manifest.json lookup.
 */
export class HttpBackend implements Plugin, Loader {
  metadata: PluginMetadata = {
    name: 'http-backend',
    type: 'backend',
    version: '1.0.0',
  };
  
  config: PluginConfig = {
    enabled: true,
    options: {}
  };

  private options: HttpBackendOptions;
  private manifest: Record<string, string> | null = null;

  constructor(options: HttpBackendOptions) {
    this.options = options;
    this.config.options = options;
  }

  async init(): Promise<void> {
    if (this.options.manifestPath) {
      try {
        const response = await fetch(this.options.manifestPath, this.options.requestOptions);
        if (response.ok) {
          this.manifest = await response.json();
        } else {
            console.warn(`[HttpBackend] Failed to load manifest from ${this.options.manifestPath}: ${response.statusText}`);
        }
      } catch (e) {
        console.warn(`[HttpBackend] Failed to load manifest from ${this.options.manifestPath}`, e);
      }
    }
  }

  async load(locale: Locale, namespace: Namespace): Promise<TranslationMap | null> {
    const url = this.resolveUrl(locale, namespace);
    
    try {
      const response = await fetch(url, this.options.requestOptions);
      if (!response.ok) {
        console.warn(`[HttpBackend] Failed to load ${url}: ${response.statusText}`);
        return null;
      }

      // If encryption is enabled, get text and decrypt
      if (this.options.cipher && this.options.secret) {
        const encryptedText = await response.text();
        try {
          const decryptedText = await this.options.cipher.decrypt(encryptedText, this.options.secret);
          return JSON.parse(decryptedText);
        } catch (e) {
          console.error(`[HttpBackend] Decryption failed for ${url}`, e);
          return null;
        }
      }

      return await response.json();
    } catch (e) {
      console.error(`[HttpBackend] Network error loading ${url}`, e);
      return null;
    }
  }

  private resolveUrl(locale: Locale, namespace: Namespace): string {
    // Check manifest first if available
    if (this.manifest) {
      const key = `${locale}/${namespace}`;
      if (this.manifest[key]) {
         const manifestEntry = this.manifest[key];
         
         // If entry starts with /, it's an absolute path, use as-is
         if (manifestEntry.startsWith('/')) {
           return manifestEntry;
         }
         
         // Otherwise, resolve relative to manifestPath directory
         if (this.options.manifestPath) {
             const lastSlashIndex = this.options.manifestPath.lastIndexOf('/');
             const basePath = lastSlashIndex >= 0 
               ? this.options.manifestPath.substring(0, lastSlashIndex + 1)
               : '';
             return basePath + manifestEntry;
         }
         return manifestEntry;
      }
    }

    return this.options.loadPath
      .replace('{{lng}}', locale)
      .replace('{{ns}}', namespace);
  }
}
