import { IMigrationSource, IMigrationTarget, ILogger } from '../domain/Interfaces';

export class PoachRecipes {
    constructor(
        private source: IMigrationSource,
        private target: IMigrationTarget,
        private logger: ILogger
    ) {}

    async execute(sourcePath: string, targetPath: string, options: { dryRun?: boolean } = {}): Promise<void> {
        this.logger.info(`Starting migration from ${sourcePath} to ${targetPath}`);

        try {
            // 1. Load Translations
            this.logger.info('Loading legacy translations...');
            const translations = await this.source.loadTranslations(sourcePath);
            this.logger.success(`Loaded translations for ${translations.size} locales.`);

            if (options.dryRun) {
                this.logger.info('Dry run enabled. Skipping write operations.');
                return;
            }

            // 2. Backup Target
            await this.target.backup(targetPath);

            // 3. Save Translations
            this.logger.info('Baking new translation files...');
            await this.target.saveTranslations(targetPath, translations);
            
            this.logger.success('Migration completed successfully! 🍰');

        } catch (error: any) {
            this.logger.error(`Migration failed: ${error.message}`);
            throw error;
        }
    }
}
