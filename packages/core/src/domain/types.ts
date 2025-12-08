import { Logger } from './Logger';
export type Locale = string;
export type Namespace = string;
export type Key = string;
export type TranslationValue = string | { [key: string]: TranslationValue };
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
  supportedLocales?: Locale[];
  loader?: Loader;
  saver?: TranslationSaver; // New Port
  saveMissing?: boolean;    // Feature Flag
  debug?: boolean;
  logger?: Logger;          // Logger Port
  /**
   * Default namespace to use when no namespace is specified in the key.
   * If not set, keys without namespace will use a file named after the locale (e.g., 'en-US.json').
   * @default undefined (uses locale-named file like i18next)
   */
  defaultNamespace?: Namespace;
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
   * Message format to use for interpolation.
   * - 'mustache': Simple {{variable}} syntax
   * - 'icu': ICU MessageFormat syntax
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
   * Plugin instances to register.
   */
  plugins?: any[];
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

// Re-export Pluralization interfaces

// Re-export Pluralization interfaces
export * from './Pluralization';

// Re-export Plugin interfaces
export * from './Plugin';

// Logger
export * from './Logger';
export * from '../adapters/ConsoleLogger';
