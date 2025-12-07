import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

interface BakeOptions {
  out: string;
}

export async function bake(source: string, options: BakeOptions) {
  console.log(chalk.blue(`🥯 I18n Bakery: Bake (Compilation)`));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Output: ${options.out}`));

  const locales = await fs.readdir(source);
  
  for (const locale of locales) {
    const localePath = path.join(source, locale);
    const stat = await fs.stat(localePath);
    
    if (stat.isDirectory()) {
      // Security: Validate locale
      try {
        validatePathSegment(locale, 'locale');
      } catch (e) {
        console.warn(chalk.red(`Skipping invalid locale directory "${locale}"`));
        continue;
      }

      console.log(chalk.cyan(`Baking locale: ${locale}...`));
      const files = await glob(`${localePath}/*.json`);
      const bundle: Record<string, any> = {};

      for (const file of files) {
        const namespace = path.basename(file, '.json');
        const content = await fs.readJson(file);
        bundle[namespace] = content;
      }

      const outDir = path.isAbsolute(options.out) ? options.out : path.join(process.cwd(), options.out);
      await fs.ensureDir(outDir);
      const outFile = path.join(outDir, `${locale}.json`);
      
      await fs.writeJson(outFile, bundle);
      console.log(chalk.green(`  -> Baked ${locale}.json (${(await fs.stat(outFile)).size} bytes)`));
    }
  }
  
  console.log(chalk.blue(`\n✅ Baking complete!`));
}

function validatePathSegment(segment: string, name: string) {
  if (!segment) return;
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
    throw new Error(`Invalid ${name}: "${segment}" contains traversal characters`);
  }
}
