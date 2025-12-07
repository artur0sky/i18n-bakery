import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { KeyExtractor } from '../services/KeyExtractor';
import { ExtractedKey } from '../domain/types';

interface BatterOptions {
  locale: string;
  out: string;
}

export async function batter(source: string, options: BatterOptions) {
  console.log(chalk.blue(`🥯 I18n Bakery: Batter (Extraction)`));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Locale: ${options.locale}`));
  console.log(chalk.gray(`Output: ${options.out}`));

  // Security: Validate locale
  validatePathSegment(options.locale, 'locale');

  const extractor = new KeyExtractor();
  const files = await glob(`${source}/**/*.{js,jsx,ts,tsx}`, { ignore: ['**/*.d.ts', '**/node_modules/**'] });

  console.log(chalk.cyan(`Found ${files.length} files to scan...`));

  let totalKeys = 0;
  const keysByNamespace: Record<string, ExtractedKey[]> = {};

  for (const file of files) {
    const keys = await extractor.extractFromFile(file);
    totalKeys += keys.length;

    for (const key of keys) {
      // Security: Validate namespace
      try {
        validatePathSegment(key.namespace, 'namespace');
      } catch (e) {
        console.warn(chalk.red(`Skipping malicious key "${key.key}" with invalid namespace "${key.namespace}"`));
        continue;
      }

      if (!keysByNamespace[key.namespace]) {
        keysByNamespace[key.namespace] = [];
      }
      keysByNamespace[key.namespace].push(key);
    }
  }

  console.log(chalk.green(`Extracted ${totalKeys} keys across ${Object.keys(keysByNamespace).length} namespaces.`));

  // Merge and Save
  const outDir = path.isAbsolute(options.out) ? options.out : path.join(process.cwd(), options.out);
  const localeDir = path.join(outDir, options.locale);
  await fs.ensureDir(localeDir);

  for (const [namespace, keys] of Object.entries(keysByNamespace)) {
    const filePath = path.join(localeDir, `${namespace}.json`);
    let currentTranslations: Record<string, string> = {};

    if (await fs.pathExists(filePath)) {
      try {
        currentTranslations = await fs.readJson(filePath);
      } catch (e) {
        console.warn(chalk.yellow(`Could not read existing file ${filePath}, starting fresh.`));
      }
    }

    let newKeysCount = 0;
    for (const k of keys) {
      if (!currentTranslations[k.key]) {
        currentTranslations[k.key] = k.defaultValue || k.key;
        newKeysCount++;
      }
    }

    // Sort keys alphabetically
    const sortedTranslations: Record<string, string> = {};
    Object.keys(currentTranslations).sort().forEach(key => {
      sortedTranslations[key] = currentTranslations[key];
    });

    await fs.writeJson(filePath, sortedTranslations, { spaces: 2 });
    if (newKeysCount > 0) {
      console.log(chalk.magenta(`  + ${namespace}.json: Added ${newKeysCount} new keys.`));
    }
  }

  console.log(chalk.blue(`\n✅ Baking complete! Translations ready in ${options.out}/${options.locale}`));
}

function validatePathSegment(segment: string, name: string) {
  if (!segment) return;
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
    throw new Error(`Invalid ${name}: "${segment}" contains traversal characters`);
  }
}
