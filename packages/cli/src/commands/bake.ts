import { BakingManager, BakeOptions } from '@i18n-bakery/baker';
import { logger } from '../services/Logger';

export async function bake(source: string, options: BakeOptions) {
  if (options.verbose) logger.setVerbose(true);
  
  const manager = new BakingManager(logger);
  await manager.bake(source, options);
}
