import { TranslationSaver, Locale, Namespace, Key } from '../domain/types';

export class ConsoleSaver implements TranslationSaver {
  async save(locale: Locale, namespace: Namespace, key: Key, value: string): Promise<void> {
    console.log(`[ConsoleSaver] Saving missing key: ${locale}/${namespace}.json -> "${key}": "${value}"`);
    return Promise.resolve();
  }
}
