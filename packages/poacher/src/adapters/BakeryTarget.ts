import fs from 'fs-extra';
import path from 'path';
import { IMigrationTarget, TranslationMap } from '../domain/Interfaces';
import { ILogger } from '../domain/Interfaces';

export class BakeryTarget implements IMigrationTarget {
    constructor(private logger: ILogger) {}

    async backup(targetPath: string): Promise<void> {
        if (fs.existsSync(targetPath)) {
            const backupPath = `${targetPath}_backup_${Date.now()}`;
            this.logger.info(`Creating backup at ${backupPath}`);
            await fs.copy(targetPath, backupPath);
        }
    }

    async saveTranslations(targetPath: string, translations: Map<string, TranslationMap>): Promise<void> {
        // Bakery structure: targetPath/{locale}/{namespace}.json
        // We assume the TranslationMap keys at the top level are namespaces if they contain objects
        // Or if it's flat, we might need to decide a namespace.

        for (const [locale, map] of translations) {
            const localeDir = path.join(targetPath, locale);
            await fs.ensureDir(localeDir);

            // Heuristic to detect namespaces vs flat keys
            // If all values are objects, treat as namespaces.
            // If mix of strings and objects, it's a flat file structure or mixed.
            // i18n-bakery prefers splitting by namespace.
            
            // For now, let's just write what we have.
            // If map has keys that are clearly namespaces (files from source), we write them.
            // If source was single file 'en.json', map is { key: val }. We write to 'translation.json' or 'app.json'?
            // i18next default is 'translation'.
            
            // Let's handle the "From I18NextSource" ambiguity.
            // If we came from folders, map is { common: {...}, auth: {...} }
            // If we came from flat files, map is { key: 'val' ... }
            
            const keys = Object.keys(map);
            const hasNestedObjects = keys.some(k => typeof map[k] === 'object' && map[k] !== null);
            
            if (hasNestedObjects) {
                // Assume keys are namespaces
                for (const ns of keys) {
                    const content = map[ns];
                    if (typeof content === 'object') {
                       await fs.writeJson(path.join(localeDir, `${ns}.json`), content, { spaces: 2 });
                    } else {
                       // Edge case: root key mixed with namespaces? 
                       // i18next doesn't usually do this.
                       // We'll write these specifically to a 'common.json' or 'translation.json' 
                       // if we can't find a better place, but strict separation is safer.
                       // For simplicity, let's treat top-level primitives as 'translation' namespace.
                       await this.appendToNamespace(localeDir, 'translation', { [ns]: content });
                    }
                }
            } else {
                // All primitives, so it's a flat file. Write to translation.json
                await fs.writeJson(path.join(localeDir, 'translation.json'), map, { spaces: 2 });
            }
        }
        this.logger.success(`Translations saved to ${targetPath}`);
    }

    private async appendToNamespace(localeDir: string, ns: string, data: any) {
        const file = path.join(localeDir, `${ns}.json`);
        let current = {};
        if (await fs.pathExists(file)) {
            current = await fs.readJson(file);
        }
        Object.assign(current, data);
        await fs.writeJson(file, current, { spaces: 2 });
    }
}
