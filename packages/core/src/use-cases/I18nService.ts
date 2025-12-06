import { Store, Loader, Formatter, I18nConfig, Locale, Namespace, Key } from '../domain/types';
import { MemoryStore } from '../adapters/MemoryStore';
import { MustacheFormatter } from '../adapters/MustacheFormatter';

export class I18nService {
  private store: Store;
  private formatter: Formatter;
  private loader?: Loader;
  
  private currentLocale: Locale;
  private fallbackLocale?: Locale;
  private debug: boolean;

  private loadedNamespaces: Set<string> = new Set();
  private pendingLoads: Map<string, Promise<void>> = new Map();

  constructor(config: I18nConfig) {
    this.currentLocale = config.locale;
    this.fallbackLocale = config.fallbackLocale;
    this.loader = config.loader;
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
    // Potentially trigger re-loads or notify listeners here
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
      if (defaultText) {
        // Auto-register logic would go here (Phase 2)
        // For now, just return default
        translation = defaultText;
      } else {
        translation = key; // Return the key itself if no default
      }
      
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
