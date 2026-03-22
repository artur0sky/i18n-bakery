import { RecipeUseCase } from '@i18n-bakery/baker';
import { logger } from '../services/Logger';

interface RecipeOptions {
  localesDir: string;
  locale: string;
  namespace: string;
  key: string;
  value: string;
  verbose?: boolean;
}

export async function recipe(options: RecipeOptions) {
  if (options.verbose) logger.setVerbose(true);

  logger.section(`🥯 I18n Bakery: Recipe (Update Translation Key)`);

  const useCase = new RecipeUseCase();
  
  try {
    const result = await useCase.execute({
      localesDir: options.localesDir,
      locale: options.locale,
      namespace: options.namespace,
      key: options.key,
      value: options.value,
      cwd: process.cwd()
    });

    if (result.isNew) {
      logger.success(`Added new key "${result.key}" to ${options.locale}/${options.namespace}.json -> "${result.value}"`);
    } else {
      logger.success(`Updated key "${result.key}" in ${options.locale}/${options.namespace}.json -> "${result.value}"`);
    }
  } catch (error: any) {
    logger.error(`Failed to update recipe: ${error.message}`);
    process.exit(1);
  }
}
