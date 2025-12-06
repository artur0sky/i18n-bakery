export type Locale = string;
export type Namespace = string;
export type Key = string;
export type TranslationValue = string;
export type TranslationMap = Record<Key, TranslationValue>;
export type NamespaceMap = Record<Namespace, TranslationMap>;
export type LocaleMap = Record<Locale, NamespaceMap>;

export interface I18nConfig {
  locale: Locale;
  fallbackLocale?: Locale;
  loader?: Loader;
  saver?: TranslationSaver; // New Port
  saveMissing?: boolean;    // Feature Flag
  debug?: boolean;
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
