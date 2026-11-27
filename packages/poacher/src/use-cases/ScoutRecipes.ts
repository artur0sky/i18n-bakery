import { ILogger } from '../domain/Interfaces';
import { ProjectScanner } from '@i18n-bakery/baker';

export class ScoutRecipes {
    constructor(private logger: ILogger) {}

    async execute(sourcePath: string): Promise<void> {
        this.logger.info(`Scouting for recipes (keys) in ${sourcePath} using Babel AST...`);
        
        const scanner = new ProjectScanner();
        const { keys, filesScanned } = await scanner.scan({ source: sourcePath });
        
        this.logger.info(`Scanning ${filesScanned} files...`);

        const allKeys = new Map<string, string | undefined>();

        for (const item of keys) {
            const fullKey = item.namespace === 'common'
                ? item.key
                : `${item.namespace.replace(/\//g, ':')}:${item.key}`;
            if (!allKeys.has(fullKey)) {
                allKeys.set(fullKey, item.defaultValue);
            }
        }

        this.logger.info(`Found ${allKeys.size} unique keys.`);
        for (const [key, def] of allKeys) {
            this.logger.info(`- ${key} ${def ? `(default: "${def}")` : ''}`);
        }
    }
}
