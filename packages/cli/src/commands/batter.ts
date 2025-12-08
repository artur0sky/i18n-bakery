import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { KeyExtractor } from '../services/KeyExtractor';
import { ExtractedKey } from '../domain/types';

/**
 * Converts a flat object with dot-notation keys into a nested object
 * Example: { "tables.diner": "value" } => { tables: { diner: "value" } }
 */
function unflatten(data: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in data) {
    const parts = key.split('.');
    let cur = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        cur[part] = data[key];
      } else {
        cur[part] = cur[part] || {};
        cur = cur[part];
      }
    }
  }
  return result;
}

/**
 * Converts a nested object into a flat object with dot-notation keys
 * Example: { tables: { diner: "value" } } => { "tables.diner": "value" }
 */
function flatten(data: Record<string, any>, prefix = '', res: Record<string, string> = {}): Record<string, string> {
  for (const key in data) {
    const value = data[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flatten(value, newKey, res);
    } else {
      res[newKey] = String(value);
    }
  }
  return res;
}

interface BatterOptions {
  locale: string;
  out: string;
}

export async function batter(source: string, options: BatterOptions) {
  console.log(chalk.blue(`🥯 I18n Bakery: Batter (Extraction)`));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Locale: ${options.locale}`));
  console.log(chalk.gray(`Output: ${options.out}`));

  // Security: Validate locale(s)
  const locales = options.locale.split(',').map(l => l.trim());
  locales.forEach(l => validatePathSegment(l, 'locale'));

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

  // Merge and Save for each locale
  const outDir = path.isAbsolute(options.out) ? options.out : path.join(process.cwd(), options.out);

  for (const locale of locales) {
    console.log(chalk.blue(`\nProcessing locale: ${locale}...`));
    const localeDir = path.join(outDir, locale);
    await fs.ensureDir(localeDir);

    for (const [namespace, keys] of Object.entries(keysByNamespace)) {
      // Support hierarchical namespaces: 'home/hero' → locales/en-US/home/hero.json
      const namespacePath = namespace.includes('/') 
        ? namespace 
        : namespace;
      
      const filePath = path.join(localeDir, `${namespacePath}.json`);
      
      // Ensure directory exists for nested namespaces
      await fs.ensureDir(path.dirname(filePath));
      
      let currentTranslations: Record<string, string> = {};

      if (await fs.pathExists(filePath)) {
        try {
          const existingData = await fs.readJson(filePath);
          // Flatten existing nested data to work with it
          currentTranslations = flatten(existingData);
        } catch (e) {
          console.warn(chalk.yellow(`Could not read existing file ${filePath}, starting fresh.`));
        }
      }

      let newKeysCount = 0;
      for (const k of keys) {
        let finalKey = k.key;
        // Strip namespace from key if present (e.g. "actions.save" -> "save", "actions:save" -> "save")
        // Also handle hierarchical namespaces: "home/hero.title" -> "title"
        // Strip namespace from key if present
        // Handle hierarchical namespaces: "home/hero:title" (namespace: home/hero) -> "title"
        // The key in source is "home:hero:title"
        const namespacePrefixDots = namespace.replace(/\//g, '.');
        const namespacePrefixColons = namespace.replace(/\//g, ':');
        
        if (finalKey.startsWith(`${namespacePrefixDots}.`)) {
          finalKey = finalKey.slice(namespacePrefixDots.length + 1);
        } else if (finalKey.startsWith(`${namespacePrefixColons}:`)) {
          finalKey = finalKey.slice(namespacePrefixColons.length + 1);
        }

        if (!currentTranslations[finalKey]) {
          currentTranslations[finalKey] = k.defaultValue || finalKey;
          newKeysCount++;
        }
      }

      // Sort keys alphabetically
      const sortedTranslations: Record<string, string> = {};
      Object.keys(currentTranslations).sort().forEach(key => {
        sortedTranslations[key] = currentTranslations[key];
      });

      // Convert flat structure to nested before saving
      const nestedTranslations = unflatten(sortedTranslations);

      await fs.writeJson(filePath, nestedTranslations, { spaces: 2 });
      if (newKeysCount > 0) {
        console.log(chalk.magenta(`  + ${namespace}.json: Added ${newKeysCount} new keys.`));
      }
    }
  }

  console.log(chalk.blue(`\n✅ Baking complete! Translations ready in ${options.out} for [${locales.join(', ')}]`));
}

function validatePathSegment(segment: string, name: string) {
  if (!segment) return;
  if (segment.includes('..') || segment.includes('\\')) {
    throw new Error(`Invalid ${name}: "${segment}" contains traversal characters`);
  }
}
