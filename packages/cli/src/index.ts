import { cac } from 'cac';
import { batter } from './commands/batter';
import { bake } from './commands/bake';
import { pantry } from './commands/pantry';
import { recipe } from './commands/recipe';
import { poach, scout } from './commands/poach';
import { version } from '../package.json';

const cli = cac('i18n-bakery');

cli
  .command('batter [source]', 'Extract translations from source files')
  .option('--locale <locale>', 'Target locale (e.g. es-mx)', { default: 'en' })
  .option('--out <dir>', 'Output directory for locales', { default: 'public/locales' })
  .option('--format <format>', 'Output format: json or toml', { default: 'json' })
  .option('--verbose', 'Enable verbose logging')
  .action(async (source, options) => {
    await batter(source || 'src', options);
  });

cli
  .command('bake [source]', 'Compile translations into a single file')
  .option('--out <dir>', 'Output directory for bundles', { default: 'dist/locales' })
  .option('--minify', 'Minify JSON output')
  .option('--hash', 'Add content hash to filenames')
  .option('--manifest <file>', 'Generate manifest file')
  .option('--split', 'Split into multiple files per namespace')
  .option('--encrypt', 'Encrypt output files')
  .option('--key <secret>', 'Encryption key')
  .option('--verbose', 'Enable verbose logging')
  .action(async (source, options) => {
    await bake(source || 'public/locales', options);
  });

cli
  .command('pantry', 'Inspect translation completeness')
  .option('--localesDir <dir>', 'Locales directory', { default: 'public/locales' })
  .option('--sourceDir <dir>', 'Optional source directory to compare against')
  .option('--referenceLocale <locale>', 'Locale to use as base truth')
  .option('--verbose', 'Enable verbose logging')
  .action(async (options) => {
    await pantry(options);
  });

cli
  .command('recipe <locale> <namespace> <key> <value>', 'Update or create a translation key directly')
  .option('--localesDir <dir>', 'Locales directory', { default: 'public/locales' })
  .option('--verbose', 'Enable verbose logging')
  .action(async (locale, namespace, key, value, options) => {
    await recipe({ ...options, locale, namespace, key, value });
  });

cli
  .command('poach [source]', 'Migrate translations from a legacy source (e.g. flat i18next)')
  .option('--target <path>', 'Output directory for bakery files', { default: './src/i18n/locales' })
  .option('--dry-run', 'Simulate without writing files')
  .action(async (source, options) => {
    await poach(source, options);
  });

cli
  .command('scout [path]', 'Identify translations in source code')
  .action(async (pathArg) => {
      await scout(pathArg);
  });

cli.help();
cli.version(version);

cli.parse();
