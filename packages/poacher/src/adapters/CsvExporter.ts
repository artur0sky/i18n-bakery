import fs from 'fs-extra';
import path from 'path';
import { TranslationMap } from '../domain/Interfaces';

export class CsvExporter {
    async export(outputPath: string, translations: Map<string, TranslationMap>): Promise<void> {
        // 1. Gather all unique keys and locales
        const locales = Array.from(translations.keys());
        const allKeys = new Set<string>();
        const flatten = (obj: any, prefix = '') => {
            for (const k in obj) {
                const val = obj[k];
                const key = prefix ? `${prefix}.${k}` : k;
                if (typeof val === 'object' && val !== null) {
                    flatten(val, key);
                } else {
                    allKeys.add(key);
                }
            }
        };

        for (const map of translations.values()) {
            flatten(map);
        }

        const sortedKeys = Array.from(allKeys).sort();
        
        // 2. Build CSV Content
        // Header
        const header = ['key', ...locales].join(',');
        const rows = [header];

        // Rows
        for (const key of sortedKeys) {
            const row = [key];
            for (const locale of locales) {
                const map = translations.get(locale);
                const val = this.getValue(map, key);
                // Escape quotes
                const escaped = val ? `"${val.replace(/"/g, '""')}"` : '';
                row.push(escaped);
            }
            rows.push(row.join(','));
        }

        const content = rows.join('\n');
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, content);
    }

    private getValue(map: TranslationMap | undefined, key: string): string | undefined {
        if (!map) return undefined;
        const parts = key.split('.');
        let current: any = map;
        for (const part of parts) {
            if (current && typeof current === 'object') {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return typeof current === 'string' ? current : undefined;
    }
}
