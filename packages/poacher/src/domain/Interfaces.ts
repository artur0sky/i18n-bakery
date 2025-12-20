import { Logger as ICoreLogger } from '@i18n-bakery/core';

export interface ILogger extends ICoreLogger {
    success(message: string): void;
}

export type TranslationKey = string;
export type TranslationValue = string; 
// Nested map: could be string or another map. 
// But i18n-bakery usually flattens specific components. 
// For migration, we might deal with nested structures.
export interface TranslationMap {
    [key: string]: TranslationValue | TranslationMap;
}

export interface IMigrationSource {
    /**
     * Reads all translation files from the source directory.
     * Returns a map where keys are locales (e.g. 'en', 'es') and values are the translation data.
     */
    loadTranslations(sourcePath: string): Promise<Map<string, TranslationMap>>;
}

export interface IMigrationTarget {
    /**
     * Saves the migrated translations to the target location.
     */
    saveTranslations(targetPath: string, translations: Map<string, TranslationMap>): Promise<void>;
    
    /**
     * Creates a backup of the target directory before writing.
     */
    backup(targetPath: string): Promise<void>;
}
