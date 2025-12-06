import { Store, Locale, Namespace, Key, TranslationMap, NamespaceMap, LocaleMap } from '../domain/types';

export class MemoryStore implements Store {
  private data: LocaleMap = {};

  get(locale: Locale, namespace: Namespace, key: Key): string | undefined {
    return this.data[locale]?.[namespace]?.[key];
  }

  set(locale: Locale, namespace: Namespace, key: Key, value: string): void {
    if (!this.data[locale]) this.data[locale] = {};
    if (!this.data[locale][namespace]) this.data[locale][namespace] = {};
    this.data[locale][namespace][key] = value;
  }

  setNamespace(locale: Locale, namespace: Namespace, translations: TranslationMap): void {
    if (!this.data[locale]) this.data[locale] = {};
    this.data[locale][namespace] = { ...translations };
  }

  has(locale: Locale, namespace: Namespace, key: Key): boolean {
    return !!this.data[locale]?.[namespace]?.[key];
  }

  getAll(locale: Locale): NamespaceMap {
    return this.data[locale] || {};
  }
}
