import { ILogger } from '../domain/Interfaces';
import { BabelKeyExtractor } from '@i18n-bakery/baker';
import fs from 'fs-extra';
import path from 'path';

export class ScoutRecipes {
    constructor(private logger: ILogger) {}

    async execute(sourcePath: string): Promise<void> {
        this.logger.info(`Scouting for recipes (keys) in ${sourcePath} using Babel AST...`);
        
        const extractor = new BabelKeyExtractor();
        const files = await this.getFiles(sourcePath);
        
        this.logger.info(`Scanning ${files.length} files...`);

        const allKeys = new Map<string, string | undefined>();

        for (const file of files) {
            const extracted = await extractor.extractFromFile(file);
            for (const item of extracted) {
                // KeyExtractor returns namespace property but for flat listing we might combine them or just list key
                // item.key is the "namespace:key" or "key" string passed to t()
                if (!allKeys.has(item.key)) {
                    allKeys.set(item.key, item.defaultValue);
                }
            }
        }

        this.logger.info(`Found ${allKeys.size} unique keys.`);
        for (const [key, def] of allKeys) {
            this.logger.info(`- ${key} ${def ? `(default: "${def}")` : ''}`);
        }
    }

    private async getFiles(dir: string): Promise<string[]> {
        const subdirs = await fs.readdir(dir);
        const files: string[] = [];
        for (const subdir of subdirs) {
            const res = path.resolve(dir, subdir);
            if ((await fs.stat(res)).isDirectory()) {
                if (subdir !== 'node_modules' && subdir !== '.git') {
                    files.push(...(await this.getFiles(res)));
                }
            } else {
                if (res.endsWith('.ts') || res.endsWith('.tsx') || res.endsWith('.js') || res.endsWith('.jsx')) {
                    files.push(res);
                }
            }
        }
        return files;
    }
}
