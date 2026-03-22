import { PantryUseCase } from '@i18n-bakery/baker';
import { logger } from '../services/Logger';

interface PantryOptions {
  localesDir: string;
  sourceDir?: string;
  referenceLocale?: string;
  verbose?: boolean;
}

export async function pantry(options: PantryOptions) {
  if (options.verbose) logger.setVerbose(true);

  logger.section(`🥯 I18n Bakery: Pantry (Status Check)`);

  const useCase = new PantryUseCase();
  
  try {
    const result = await useCase.execute({
      localesDir: options.localesDir,
      sourceDir: options.sourceDir,
      referenceLocale: options.referenceLocale,
      cwd: process.cwd()
    });

    logger.success(`Pantry analysis complete!`);
    logger.cyan(`Reference Locale: ${result.referenceLocale}`);

    for (const [locale, status] of Object.entries(result.status)) {
      if (status.completionPercent === 100) {
        logger.success(`\nLocale: ${locale}`);
        logger.success(`Completion: ${status.completionPercent}%`);
      } else if (status.completionPercent > 80) {
        logger.warn(`\nLocale: ${locale}`);
        logger.warn(`Completion: ${status.completionPercent}%`);
      } else {
        logger.error(`\nLocale: ${locale}`);
        logger.error(`Completion: ${status.completionPercent}%`);
      }
      logger.gray(`Total Keys: ${status.totalKeys} | Present: ${status.presentKeys} | Missing: ${status.missingKeys}`);

      if (status.missingKeys > 0) {
        logger.warn(`Missing Keys:`);
        status.missingKeyList.slice(0, 5).forEach((k: string) => logger.gray(`  - ${k}`));
        if (status.missingKeys > 5) {
          logger.gray(`  ... and ${status.missingKeys - 5} more.`);
        }
      }
    }

  } catch (error: any) {
    logger.error(`Failed to analyze pantry: ${error.message}`);
    process.exit(1);
  }
}
