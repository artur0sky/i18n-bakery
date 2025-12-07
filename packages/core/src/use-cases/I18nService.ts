import { Store, Loader, Formatter, TranslationSaver, I18nConfig, Locale, Namespace, Key } from '../domain/types';
import { MemoryStore } from '../adapters/MemoryStore';
import { MustacheFormatter } from '../adapters/MustacheFormatter';
import { PluralResolver, PluralCategory } from '../domain/Pluralization';
import { SuffixPluralResolver } from '../adapters/SuffixPluralResolver';
import { CLDRPluralResolver } from '../adapters/CLDRPluralResolver';

export class I18nService {
  private store: Store;
  private formatter: Formatter;
  private loader?: Loader;
  private saver?: TranslationSaver;
  private pluralResolver: PluralResolver;
  
  private currentLocale: Locale;
  private fallbackLocale?: Locale;
  private saveMissing: boolean;
  private debug: boolean;

  private loadedNamespaces: Set<string> = new Set();
  private pendingLoads: Map<string, Promise<void>> = new Map();
  private pendingSaves: Set<string> = new Set(); // Prevent spamming saves for same key

  constructor(config: I18nConfig) {
    this.currentLocale = config.locale;
    this.fallbackLocale = config.fallbackLocale;
    this.loader = config.loader;
    this.saver = config.saver;
    this.saveMissing = config.saveMissing || false;
    this.debug = config.debug || false;
    
    // Default adapters
    this.store = new MemoryStore();
    this.formatter = new MustacheFormatter();
    
    // Initialize plural resolver based on strategy
    const strategy = config.pluralizationStrategy || 'suffix';
    this.pluralResolver = strategy === 'cldr' 
      ? new CLDRPluralResolver()
      : new SuffixPluralResolver();
  }

  public getCurrentLocale(): Locale {
    return this.currentLocale;
  }

  public async setLocale(locale: Locale): Promise<void> {
    this.currentLocale = locale;
  }

  public t(key: string, defaultText?: string, vars?: Record<string, any>): string {
    const { namespace, key: actualKey } = this.parseKey(key);
    
    // Determine if we need pluralization
    const count = vars?.count;
    const needsPluralization = typeof count === 'number';
    
    let translation: string | undefined;
    
    if (needsPluralization) {
      // Try pluralization
      translation = this.getPluralTranslation(namespace, actualKey, count, vars);
    } else {
      // Normal translation lookup
      // 1. Try current locale
      translation = this.store.get(this.currentLocale, namespace, actualKey);

      // 2. Try fallback locale
      if (!translation && this.fallbackLocale) {
        translation = this.store.get(this.fallbackLocale, namespace, actualKey);
      }
    }

    // 3. Fallback to default text or key
    if (!translation) {
      const fallbackValue = defaultText || actualKey; // Use actualKey (without ns) if no default
      
      if (defaultText) {
          translation = defaultText;
      } else {
          translation = key; // Return full key for UI if absolutely nothing found
      }

      // Handle Missing Key
      this.handleMissingKey(this.currentLocale, namespace, actualKey, fallbackValue);
      
      // Trigger load if not loaded/loading
      this.ensureNamespaceLoaded(this.currentLocale, namespace);
    }

    return this.formatter.interpolate(translation, vars);
  }

  /**
   * Gets the appropriate plural translation based on count.
   * 
   * Uses the configured PluralResolver to determine the correct plural form.
   * For suffix strategy, also tries exact count matches first.
   * 
   * @param namespace - The namespace
   * @param key - The base key
   * @param count - The count value
   * @param vars - Variables for interpolation
   * @returns Translation string or undefined
   */
  private getPluralTranslation(
    namespace: Namespace,
    key: Key,
    count: number,
    vars?: Record<string, any>
  ): string | undefined {
    // Step 1: Try exact count match (key_0, key_1, key_2, etc.) for suffix strategy
    // This is a special case for i18next compatibility
    const exactKey = `${key}_${count}`;
    let translation = this.store.get(this.currentLocale, namespace, exactKey);
    
    if (translation) {
      return translation;
    }

    // Try fallback locale for exact match
    if (this.fallbackLocale) {
      translation = this.store.get(this.fallbackLocale, namespace, exactKey);
      if (translation) {
        return translation;
      }
    }

    // Step 2: Use the plural resolver to get the appropriate key
    const resolution = this.pluralResolver.resolve(key, count, this.currentLocale);
    const pluralKey = resolution.key;
    
    // Try to get the translation for the resolved plural key
    translation = this.store.get(this.currentLocale, namespace, pluralKey);
    
    if (translation) {
      return translation;
    }

    // Try fallback locale
    if (this.fallbackLocale) {
      translation = this.store.get(this.fallbackLocale, namespace, pluralKey);
      if (translation) {
        return translation;
      }
    }

    // If no plural form exists, fall back to base key
    translation = this.store.get(this.currentLocale, namespace, key);
    
    if (!translation && this.fallbackLocale) {
      translation = this.store.get(this.fallbackLocale, namespace, key);
    }

    return translation;
  }


  public addTranslations(locale: Locale, namespace: Namespace, data: Record<string, string>) {
    this.store.setNamespace(locale, namespace, data);
    this.loadedNamespaces.add(`${locale}:${namespace}`);
  }

  private parseKey(key: string): { namespace: Namespace; key: Key } {
    // i18next style: ns:key
    if (key.includes(':')) {
      const parts = key.split(':');
      return { namespace: parts[0], key: parts.slice(1).join(':') };
    }

    const parts = key.split('.');
    if (parts.length > 1) {
      return { namespace: parts[0], key: parts.slice(1).join('.') };
    }
    return { namespace: 'common', key }; // Default namespace
  }

  private handleMissingKey(locale: Locale, namespace: Namespace, key: Key, value: string) {
    if (!this.saveMissing || !this.saver) return;

    const cacheKey = `${locale}:${namespace}:${key}`;
    if (this.pendingSaves.has(cacheKey)) return;

    // Update in-memory store immediately so we don't try to save again in this session
    // But wait, if we update store, next render won't trigger missing key.
    // That's good behavior for runtime.
    this.store.set(locale, namespace, key, value);
    
    this.pendingSaves.add(cacheKey);
    if (this.debug) console.log(`[i18n-bakery] Missing key detected: ${cacheKey}. Saving...`);

    this.saver.save(locale, namespace, key, value)
      .catch(err => {
        console.error(`[i18n-bakery] Failed to save missing key ${cacheKey}`, err);
      })
      .finally(() => {
        this.pendingSaves.delete(cacheKey);
      });
  }

  private ensureNamespaceLoaded(locale: Locale, namespace: Namespace) {
    if (!this.loader) return;
    
    const cacheKey = `${locale}:${namespace}`;
    if (this.loadedNamespaces.has(cacheKey)) return;
    if (this.pendingLoads.has(cacheKey)) return;

    if (this.debug) console.log(`[i18n-bakery] Triggering load for ${cacheKey}`);

    const promise = this.loader.load(locale, namespace)
      .then((data) => {
        if (data) {
          this.addTranslations(locale, namespace, data);
        }
      })
      .catch((err) => {
        console.error(`[i18n-bakery] Failed to load ${cacheKey}`, err);
      })
      .finally(() => {
        this.pendingLoads.delete(cacheKey);
      });

    this.pendingLoads.set(cacheKey, promise);
  }
}
