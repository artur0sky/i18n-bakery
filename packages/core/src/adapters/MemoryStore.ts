import { Store, Locale, Namespace, Key, TranslationMap, NamespaceMap, LocaleMap } from '../domain/types';

export class MemoryStore implements Store {
  private data: LocaleMap = {};

  get(locale: Locale, namespace: Namespace, key: Key): string | undefined {
    const namespaceData = this.data[locale]?.[namespace];
    if (!namespaceData) return undefined;

    // Direct match
    if (typeof namespaceData[key] === 'string') {
      return namespaceData[key] as string;
    }

    // Nested match (dot notation)
    if (key.includes('.')) {
      const parts = key.split('.');
      let current: any = namespaceData;
      
      for (const part of parts) {
        if (current === undefined || current === null || typeof current !== 'object') {
          return undefined;
        }
        current = current[part];
      }
      
      if (typeof current === 'string') {
        return current;
      }
    }

    return undefined;
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
