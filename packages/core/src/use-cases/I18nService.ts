import { Store, Loader, Formatter, TranslationSaver, I18nConfig, Locale, Namespace, Key } from '../domain/types';
import { MemoryStore } from '../adapters/MemoryStore';
import { MustacheFormatter } from '../adapters/MustacheFormatter';

export class I18nService {
  private store: Store;
  private formatter: Formatter;
  private loader?: Loader;
  private saver?: TranslationSaver;
  
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
  }

  public getLocale(): Locale {
    return this.currentLocale;
  }

  public async setLocale(locale: Locale): Promise<void> {
    this.currentLocale = locale;
  }

  public t(key: string, defaultText?: string, vars?: Record<string, any>): string {
    const { namespace, key: actualKey } = this.parseKey(key);
    
    // 1. Try current locale
    let translation = this.store.get(this.currentLocale, namespace, actualKey);

    // 2. Try fallback locale
    if (!translation && this.fallbackLocale) {
      translation = this.store.get(this.fallbackLocale, namespace, actualKey);
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

  public addTranslations(locale: Locale, namespace: Namespace, data: Record<string, string>) {
    this.store.setNamespace(locale, namespace, data);
    this.loadedNamespaces.add(`${locale}:${namespace}`);
  }

  private parseKey(key: string): { namespace: Namespace; key: Key } {
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
