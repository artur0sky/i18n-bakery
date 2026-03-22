import { PoachRecipes, I18NextSource, BakeryTarget, ConsoleLogger, ScoutRecipes } from '@i18n-bakery/poacher';
import path from 'path';

interface PoachOptions {
  target: string;
  dryRun?: boolean;
}

export async function poach(source: string, options: PoachOptions) {
  const logger = new ConsoleLogger();
  if (!source) {
    logger.error('Please provide a source path.');
    process.exit(1);
  }

  const sourcePath = path.resolve(process.cwd(), source);
  const targetPath = path.resolve(process.cwd(), options.target);

  const poacher = new PoachRecipes(
      new I18NextSource(),
      new BakeryTarget(logger),
      logger
  );

  await poacher.execute(sourcePath, targetPath, options);
}

export async function scout(source: string) {
  const logger = new ConsoleLogger();
  const target = source ? path.resolve(process.cwd(), source) : process.cwd();
  const scout = new ScoutRecipes(logger);
  await scout.execute(target);
}
