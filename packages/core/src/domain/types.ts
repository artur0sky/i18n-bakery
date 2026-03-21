export type Locale = string;
export type Namespace = string;
export type Key = string;
export type TranslationValue = string;
export type TranslationMap = Record<Key, TranslationValue>;
export type NamespaceMap = Record<Namespace, TranslationMap>;
export type LocaleMap = Record<Locale, NamespaceMap>;

/**
 * Supported output formats for translation files.
 */
export type OutputFormat = 'json' | 'yml' | 'yaml' | 'toml' | 'toon';

export interface I18nConfig {
  locale: Locale;
  fallbackLocale?: Locale;
  loader?: Loader;
  saver?: TranslationSaver; // New Port
  saveMissing?: boolean;    // Feature Flag
  debug?: boolean;
  /**
   * Output format for translation files.
   * @default 'json'
   */
  outputFormat?: OutputFormat;
  /**
   * Pluralization strategy to use.
   * - 'suffix': i18next-style (key, key_plural, key_0, key_1)
   * - 'cldr': CLDR-style (key_one, key_other, key_zero, key_few, key_many)
   * @default 'suffix'
   */
  pluralizationStrategy?: 'suffix' | 'cldr';
  /**
   * Message format syntax to use.
   * - 'mustache': Simple {{variable}} syntax (default)
   * - 'icu': ICU MessageFormat syntax with plural, select, selectordinal
   * @default 'mustache'
   */
  messageFormat?: 'mustache' | 'icu';
  /**
   * File structure for translation files.
   * - 'nested': Nested JSON objects (e.g., { "home": { "title": "..." } })
   * - 'flat': Flat key-value pairs (e.g., { "home.title": "..." })
   * @default 'nested'
   */
  fileStructure?: 'nested' | 'flat';
  /**
   * Plugins to register on initialization.
   */
  plugins?: Array<any>; // Using any to avoid circular dependency
}

export interface Loader {
  load(locale: Locale, namespace: Namespace): Promise<TranslationMap | null>;
}

export interface TranslationSaver {
  save(locale: Locale, namespace: Namespace, key: Key, value: string): Promise<void>;
}

export interface Formatter {
  interpolate(text: string, vars?: Record<string, any>): string;
}

export interface Store {
  get(locale: Locale, namespace: Namespace, key: Key): string | undefined;
  set(locale: Locale, namespace: Namespace, key: Key, value: string): void;
  setNamespace(locale: Locale, namespace: Namespace, translations: TranslationMap): void;
  has(locale: Locale, namespace: Namespace, key: Key): boolean;
  getAll(locale: Locale): NamespaceMap;
}

// Re-export Phase 7 & 8 interfaces
export * from './KeyParser';
export * from './VariableDetection';

// Re-export Phase 9 interfaces
export * from './FileWriter';

// Re-export Pluralization interfaces
export * from './Pluralization';

// Re-export Plugin interfaces
export * from './Plugin';
