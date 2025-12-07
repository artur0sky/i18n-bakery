import { I18nConfig } from './domain/types';
import { I18nService } from './use-cases/I18nService';

// Singleton instance
let i18nInstance: I18nService | null = null;

export function initI18n(config: I18nConfig): I18nService {
  i18nInstance = new I18nService(config);
  return i18nInstance;
}

export function getI18n(): I18nService {
  if (!i18nInstance) {
    throw new Error('[i18n-bakery] I18n not initialized. Call initI18n() first.');
  }
  return i18nInstance;
}

export function t(key: string, defaultText?: string, vars?: Record<string, any>): string {
  return getI18n().t(key, defaultText, vars);
}

export function setLocale(locale: string): Promise<void> {
  return getI18n().setLocale(locale);
}

export function addTranslations(locale: string, namespace: string, data: Record<string, string>) {
  return getI18n().addTranslations(locale, namespace, data);
}

// Export types and classes for advanced usage
export * from './domain/types';
export * from './use-cases/I18nService';
export * from './adapters/MemoryStore';
export * from './adapters/MustacheFormatter';
export * from './adapters/ICUMessageFormatter';
export * from './adapters/ConsoleSaver';

// Phase 7 - Advanced Key Engine
export * from './adapters/DefaultKeyParser';
export * from './adapters/FileSystemPathResolver';

// Phase 8 - Variable Detection
export * from './adapters/DefaultVariableDetector';
export * from './adapters/MemoryTranslationEntryManager';

// Phase 9 - File Auto-creation
export * from './adapters/JSONFileWriter';
export * from './adapters/NodeFileSystemManager';
export * from './use-cases/TranslationFileManager';

// Pluralization
export * from './adapters/SuffixPluralResolver';
export * from './adapters/CLDRPluralResolver';

