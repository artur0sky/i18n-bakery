import { ExtractionUseCase } from '@i18n-bakery/baker';
import { logger } from '../services/Logger';

interface BatterOptions {
  locale: string;
  out: string;
  format?: 'json' | 'toml';
  verbose?: boolean;
}

export async function batter(source: string, options: BatterOptions) {
  if (options.verbose) logger.setVerbose(true);

  logger.section(`🥯 I18n Bakery: Batter (Extraction)`);
  logger.gray(`Source: ${source}`);
  logger.gray(`Locale: ${options.locale}`);
  logger.gray(`Output: ${options.out}`);

  const locales = options.locale.split(',').map(l => l.trim());
  const useCase = new ExtractionUseCase();

  try {
    const result = await useCase.execute({
      source,
      locales,
      out: options.out,
      format: options.format
    });

    logger.success(`Extracted ${result.totalKeys} keys across ${Object.keys(result.keysByNamespace).length} namespaces.`);
    logger.section(`✅ Baking complete! Translations ready in ${options.out} for [${locales.join(', ')}]`);
  } catch (error: any) {
    logger.error(`Failed to extract keys: ${error.message}`);
    throw error;
  }
}
