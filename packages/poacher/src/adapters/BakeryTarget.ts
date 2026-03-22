import fs from 'fs-extra';
import path from 'path';
import { JSONFileSaver } from '@i18n-bakery/baker';
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
        const saver = new JSONFileSaver(targetPath, 'nested');

        for (const [locale, map] of translations) {
            const keys = Object.keys(map);
            const hasNestedObjects = keys.some(k => typeof map[k] === 'object' && map[k] !== null);
            
            if (hasNestedObjects) {
                for (const ns of keys) {
                    const content = map[ns];
                    if (typeof content === 'object') {
                        await this.saveDeepObject(saver, locale, ns, '', content);
                    } else {
                        await saver.save(locale, 'translation', ns, String(content));
                    }
                }
            } else {
                await this.saveDeepObject(saver, locale, 'translation', '', map);
            }
        }
        this.logger.success(`Translations saved to ${targetPath}`);
    }

    private async saveDeepObject(saver: JSONFileSaver, locale: string, ns: string, prefix: string, obj: any) {
        for (const [key, val] of Object.entries(obj)) {
            const currentPath = prefix ? `${prefix}.${key}` : key;
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                await this.saveDeepObject(saver, locale, ns, currentPath, val);
            } else {
                await saver.save(locale, ns, currentPath, String(val));
            }
        }
    }
}
