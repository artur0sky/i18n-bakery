import { Store, Loader, Formatter, TranslationSaver, I18nConfig, Locale, Namespace, Key, TranslationMap } from '../domain/types';
import { MemoryStore } from '../adapters/MemoryStore';
import { MustacheFormatter } from '../adapters/MustacheFormatter';
import { ICUMessageFormatter } from '../adapters/ICUMessageFormatter';
import { PluralResolver, PluralCategory } from '../domain/Pluralization';
import { SuffixPluralResolver } from '../adapters/SuffixPluralResolver';
import { CLDRPluralResolver } from '../adapters/CLDRPluralResolver';
import { PluginManager, PluginContext } from '../domain/Plugin';
import { DefaultPluginManager } from '../adapters/DefaultPluginManager';

export class I18nService {
  private store: Store;
  private formatter: Formatter;
  private loader?: Loader;
  private saver?: TranslationSaver;
  private pluralResolver: PluralResolver;
  private pluginManager: PluginManager;
  
  private currentLocale: Locale;
  private fallbackLocale?: Locale;
  private defaultNamespace?: Namespace;
  private saveMissing: boolean;
  private debug: boolean;

  private loadedNamespaces: Set<string> = new Set();
  private pendingLoads: Map<string, Promise<void>> = new Map();
  private pendingSaves: Set<string> = new Set(); // Prevent spamming saves for same key
  private listeners: Set<() => void> = new Set();

  constructor(config: I18nConfig) {
    this.currentLocale = config.locale;
    this.fallbackLocale = config.fallbackLocale;
    this.defaultNamespace = config.defaultNamespace;
    this.loader = config.loader;
    this.saver = config.saver;
    this.saveMissing = config.saveMissing || false;
    this.debug = config.debug || false;
    
    // Default adapters
    this.store = new MemoryStore();
    this.pluginManager = new DefaultPluginManager(this.debug);
    
    // Initialize formatter based on messageFormat
    const messageFormat = config.messageFormat || 'mustache';
    this.formatter = messageFormat === 'icu'
      ? new ICUMessageFormatter(config.locale)
      : new MustacheFormatter();
    
    // Initialize plural resolver based on strategy
    const strategy = config.pluralizationStrategy || 'suffix';
    this.pluralResolver = strategy === 'cldr' 
      ? new CLDRPluralResolver()
      : new SuffixPluralResolver();

    // Register plugins
    if (config.plugins) {
      config.plugins.forEach(plugin => {
        this.pluginManager.register(plugin);
      });
    }
  }

  public getCurrentLocale(): Locale {
    return this.currentLocale;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public async setLocale(locale: Locale): Promise<void> {
    const oldLocale = this.currentLocale;
    this.currentLocale = locale;

    // Trigger onLocaleChange hook
    await this.pluginManager.executeHook('onLocaleChange', {
      locale: this.currentLocale,
      data: { oldLocale, newLocale: locale }
    });
    
    this.notifyListeners();
  }

  public t(key: string, defaultTextOrVars?: string | Record<string, any>, options?: Record<string, any>): string {
    let defaultText: string | undefined;
    let vars: Record<string, any> | undefined;

    // Handle argument overloading
    if (typeof defaultTextOrVars === 'object' && defaultTextOrVars !== null) {
      // Usage: t('key', { count: 1 }) or t('key', { defaultValue: 'Val' })
      vars = defaultTextOrVars;
      defaultText = vars.defaultValue as string; // Extract defaultValue if present
    } else {
      // Usage: t('key', 'Default Text', { count: 1 })
      defaultText = defaultTextOrVars as string | undefined;
      vars = options;
      
      // Also check options for defaultValue if defaultText is not provided as 2nd arg
      if (!defaultText && vars && vars.defaultValue) {
        defaultText = vars.defaultValue as string;
      }
    }

    const { namespace, key: actualKey } = this.parseKey(key);
    
    // Create context for plugins
    const context: PluginContext = {
      locale: this.currentLocale,
      namespace,
      key: actualKey,
      vars,
      data: {}
    };

    // Execute beforeTranslate hook (Synchronous attempt)
    const plugins = (this.pluginManager as any).getAll().filter((p: any) => p.config.enabled !== false);
    
    for (const plugin of plugins) {
      if (plugin.beforeTranslate) {
        const result = plugin.beforeTranslate(context);
        if (result) Object.assign(context, result);
      }
    }

    // Determine if we need pluralization
    const count = vars?.count;
    const needsPluralization = typeof count === 'number';
    
    let translation: string | undefined;
    
    if (needsPluralization) {
      // Try pluralization
      translation = this.getPluralTranslation(namespace, context.key || actualKey, count, vars);
    } else {
      // Normal translation lookup
      // 1. Try current locale
      translation = this.store.get(this.currentLocale, namespace, context.key || actualKey);

      // 2. Try fallback locale
      if (!translation && this.fallbackLocale) {
        translation = this.store.get(this.fallbackLocale, namespace, context.key || actualKey);
      }
    }

    // 3. Fallback to default text or key
    if (!translation) {
      const fallbackValue = defaultText || context.key || actualKey; 
      
      if (defaultText) {
          translation = defaultText;
      } else {
          translation = key; // Return full key for UI if absolutely nothing found
      }

      // Handle Missing Key
      this.handleMissingKey(this.currentLocale, namespace, context.key || actualKey, fallbackValue);
      
      // Trigger load if not loaded/loading
      this.ensureNamespaceLoaded(this.currentLocale, namespace);
    }

    // Interpolate
    let result = this.formatter.interpolate(translation, vars);
    context.result = result;

    // Execute afterTranslate hook (Synchronous attempt)
    for (const plugin of plugins) {
      if (plugin.afterTranslate) {
        const res = plugin.afterTranslate(context);
        if (res !== undefined && res !== null) {
          context.result = res as string;
        }
      }
    }

    return context.result || result;
  }

  /**
   * Gets the appropriate plural translation based on count.
   */
  private getPluralTranslation(
    namespace: Namespace,
    key: Key,
    count: number,
    vars?: Record<string, any>
  ): string | undefined {
    // Step 1: Try exact count match (key_0, key_1, key_2, etc.) for suffix strategy
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


  public addTranslations(locale: Locale, namespace: Namespace, data: TranslationMap) {
    this.store.setNamespace(locale, namespace, data);
    this.loadedNamespaces.add(`${locale}:${namespace}`);
    // Force notify listeners to update UI when new translations are loaded
    this.notifyListeners();
  }

  /**
   * Parses a translation key into namespace and key components.
   * 
   * Supports hierarchical namespaces:
   * - 'home:hero:title' → namespace: 'home/hero', key: 'title'
   * - 'home:hero.title' → namespace: 'home', key: 'hero.title'
   * - 'hero.title' → namespace: defaultNamespace or locale, key: 'hero.title'
   * 
   * Rules:
   * 1. Multiple colons (:) create directory structure (namespace path)
   * 2. The last colon separates namespace from key
   * 3. Dots (.) within the key create nested properties
   * 4. If no colon, uses defaultNamespace or locale-based file
   */
  private parseKey(key: string): { namespace: Namespace; key: Key } {
    // Check if key contains colon (namespace separator)
    if (key.includes(':')) {
      const lastColonIndex = key.lastIndexOf(':');
      const namespacePart = key.substring(0, lastColonIndex);
      const keyPart = key.substring(lastColonIndex + 1);
      
      // Convert multiple colons to directory path
      // 'home:navigation:showcase' → 'home/navigation/showcase'
      const namespace = namespacePart.replace(/:/g, '/');
      
      return { namespace, key: keyPart };
    }

    // No colon found - use defaultNamespace or locale-based file
    // If defaultNamespace is set, use it
    // Otherwise, use locale (e.g., 'en-US') like i18next
    const defaultNs = this.defaultNamespace || this.currentLocale;
    
    return { namespace: defaultNs, key };
  }

  private handleMissingKey(locale: Locale, namespace: Namespace, key: Key, value: string) {
    if (!this.saveMissing || !this.saver) return;

    const cacheKey = `${locale}:${namespace}:${key}`;
    if (this.pendingSaves.has(cacheKey)) return;

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
