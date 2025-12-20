#!/usr/bin/env node
const { cac } = require('cac');
const path = require('path');
const { version } = require('../package.json');
const { PoachRecipes, I18NextSource, BakeryTarget, ConsoleLogger, CsvExporter, ScoutRecipes } = require('../dist/index.js');

const cli = cac('poacher');

cli
  .command('poach [source]', 'Migrate translations from a legacy source')
  .option('--target <path>', 'Output directory for bakery files', { default: './src/i18n/locales' })
  .option('--dry-run', 'Simulate without writing files')
  .action(async (source, options) => {
    const logger = new ConsoleLogger();
    if (!source) {
       logger.error('Please provide a source path.');
       process.exit(1);
    }
    
    // Resolve paths
    const sourcePath = path.resolve(process.cwd(), source);
    const targetPath = path.resolve(process.cwd(), options.target);

    const poacher = new PoachRecipes(
        new I18NextSource(),
        new BakeryTarget(logger),
        logger
    );

    await poacher.execute(sourcePath, targetPath, options);
  });

cli
  .command('serve', 'Export translations to other formats')
  .option('--source <path>', 'Path to i18n-bakery locales', { default: './src/i18n/locales' })
  .option('--out <path>', 'Output file path')
  .option('--format <format>', 'Output format (csv)', { default: 'csv' })
  .action(async (options) => {
      const logger = new ConsoleLogger();
      // Reuse I18NextSource because Bakery files are also JSONs organized by folder/file!
      const source = new I18NextSource();
      const exporter = new CsvExporter();
      
      const sourcePath = path.resolve(process.cwd(), options.source);
      const outPath = path.resolve(process.cwd(), options.out || './exports/translations.csv');

      logger.info(`Exporting to ${options.format.toUpperCase()}...`);
      if (options.format !== 'csv') {
          logger.error('Only CSV format is currently supported.');
          process.exit(1);
      }

      const translations = await source.loadTranslations(sourcePath);
      await exporter.export(outPath, translations);
      logger.success(`Exported to ${outPath}`);
  });

cli
  .command('scout [path]', 'Identify translations in source code')
  .action(async (pathArg) => {
      const logger = new ConsoleLogger();
      const target = pathArg ? path.resolve(process.cwd(), pathArg) : process.cwd();
      const scout = new ScoutRecipes(logger);
      await scout.execute(target);
  });

cli.help();
cli.version(version);
cli.parse();
