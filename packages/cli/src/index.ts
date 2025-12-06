import { cac } from 'cac';
import { batter } from './commands/batter';
import { bake } from './commands/bake';
import { version } from '../package.json';

const cli = cac('i18n-bakery');

cli
  .command('batter [source]', 'Extract translations from source files')
  .option('--locale <locale>', 'Target locale (e.g. es-mx)', { default: 'en' })
  .option('--out <dir>', 'Output directory for locales', { default: 'locales' })
  .action(async (source, options) => {
    await batter(source || 'src', options);
  });

cli
  .command('bake [source]', 'Compile translations into a single file')
  .option('--out <dir>', 'Output directory for bundles', { default: 'dist/locales' })
  .action(async (source, options) => {
    await bake(source || 'locales', options);
  });

cli.help();
cli.version(version);

cli.parse();
