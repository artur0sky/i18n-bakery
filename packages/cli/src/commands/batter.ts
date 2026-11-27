import { ExtractionUseCase } from '@i18n-bakery/baker';
import { logger } from '../services/Logger';

interface BatterOptions {
  locale: string;
  out: string;
  format?: 'json' | 'toml';
  clean?: boolean;
  purge?: boolean;
  verbose?: boolean;
}

export async function batter(source: string, options: BatterOptions) {
  if (options.verbose) logger.setVerbose(true);

  logger.section('🥯 I18n Bakery: Batter (Extraction)');
  logger.gray(`Source: ${source}`);
  logger.gray(`Locale: ${options.locale}`);
  logger.gray(`Output: ${options.out}`);

  const locales = options.locale.split(',').map((locale) => locale.trim());
  const useCase = new ExtractionUseCase();

  try {
    const result = await useCase.execute({
      source,
      locales,
      out: options.out,
      format: options.format,
      clean: options.clean,
      purge: options.purge,
    });

    logger.success(
      `Extracted ${result.totalKeys} keys across ${Object.keys(result.keysByNamespace).length} namespaces.`
    );
    logger.section(
      `✅ Baking complete! Translations ready in ${options.out} for [${locales.join(', ')}]`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to extract keys: ${message}`);
    process.exitCode = 1;
  }
}
