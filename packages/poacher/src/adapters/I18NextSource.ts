import fs from 'fs-extra';
import path from 'path';
import { IMigrationSource, TranslationMap } from '../domain/Interfaces';

export class I18NextSource implements IMigrationSource {
    async loadTranslations(sourcePath: string): Promise<Map<string, TranslationMap>> {
        const result = new Map<string, TranslationMap>();
        
        if (!fs.existsSync(sourcePath)) {
            throw new Error(`Source path does not exist: ${sourcePath}`);
        }

        const items = await fs.readdir(sourcePath);

        for (const item of items) {
            const itemPath = path.join(sourcePath, item);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                // Case: locales/en/common.json -> Locale is 'en'
                const locale = item;
                const localeData: TranslationMap = {};
                
                const namespaceFiles = await fs.readdir(itemPath);
                for (const nsFile of namespaceFiles) {
                    if (nsFile.endsWith('.json')) {
                        const ns = path.basename(nsFile, '.json');
                        const content = await fs.readJson(path.join(itemPath, nsFile));
                        localeData[ns] = content;
                    }
                }
                result.set(locale, localeData);

            } else if (stats.isFile() && item.endsWith('.json')) {
                // Case: locales/en.json -> Locale is 'en'
                const locale = path.basename(item, '.json');
                const content = await fs.readJson(itemPath);
                
                // If it's a flat file, we treat it as potentially "translation" namespace or just root
                // For consistency with namespaced structure, we might want to wrap it or keep it as is.
                // But Bakery often prefers directories. 
                // Let's store it directly. The target adapter needs to decide how to write it.
                // However, previous logic put namespaces as keys. 
                // Let's deduce: does content look like { ns: {...} }? Unlikely for single file.
                // We'll wrap it in 'translation' (default i18next ns) if we want uniformity,
                // or just pass it through.
                // Let's check if the user wants strictly bakery structure.
                // If we wrap it: result.set(locale, { translation: content });
                // But maybe the file IS the namespace?
                // Let's just create the map.
                result.set(locale, content as TranslationMap);
            }
        }

        return result;
    }
}
