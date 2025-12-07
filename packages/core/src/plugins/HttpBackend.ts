
import { Plugin, PluginMetadata, PluginConfig } from '../domain/Plugin';
import { Loader, TranslationMap, Locale, Namespace } from '../domain/types';

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
      return await response.json();
    } catch (e) {
      console.error(`[HttpBackend] Network error loading ${url}`, e);
      return null;
    }
  }

  private resolveUrl(locale: Locale, namespace: Namespace): string {
    // Check manifest first if available
    if (this.manifest) {
      // We assume the manifest keys are "locale/namespace" or just "namespace" if flat?
      // Let's assume standard structure: "locale/namespace"
      const key = `${locale}/${namespace}`;
      if (this.manifest[key]) {
         // If manifest contains the full URL or relative path, we use it.
         // But we need to be careful about relative paths.
         // If manifestPath was "/locales/manifest.json", and manifest has "en/common": "en/common.a1b2.json"
         // We should probably resolve it relative to manifest directory?
         // For simplicity, let's assume manifest values are relative to the root or absolute.
         // Or we can replace the filename in loadPath?
         
         // Better approach: If manifest exists, we assume loadPath is the base directory if it doesn't contain {{}}.
         // But loadPath is usually a pattern.
         
         // Let's assume if manifest is used, we ignore loadPath pattern and use the value from manifest, 
         // potentially prepended by a base path if needed.
         // But for now, let's return the value from manifest directly if it looks like a path.
         return this.manifest[key];
      }
    }

    return this.options.loadPath
      .replace('{{lng}}', locale)
      .replace('{{ns}}', namespace);
  }
}
