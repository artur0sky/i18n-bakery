import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';

import crypto from 'crypto';

interface BakeOptions {
  out: string;
  minify?: boolean;
  hash?: boolean;
  manifest?: string;
  split?: boolean;
}

export async function bake(source: string, options: BakeOptions) {
  console.log(chalk.blue(`🥯 I18n Bakery: Bake (Compilation)`));
  console.log(chalk.gray(`Source: ${source}`));
  console.log(chalk.gray(`Output: ${options.out}`));
  if (options.minify) console.log(chalk.gray(`Minify: Enabled`));
  if (options.hash) console.log(chalk.gray(`Hash: Enabled`));
  if (options.split) console.log(chalk.gray(`Split: Enabled (Lazy Loading)`));

  const locales = await fs.readdir(source);
  const manifest: Record<string, string> = {};
  
  const outDir = path.isAbsolute(options.out) ? options.out : path.join(process.cwd(), options.out);
  await fs.ensureDir(outDir);

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
      const namespaceFiles: Record<string, any> = {};

      for (const file of files) {
        const namespace = path.basename(file, '.json');
        const content = await fs.readJson(file);
        bundle[namespace] = content;
        namespaceFiles[namespace] = content;
      }

      if (options.split) {
         // Output individual files (Lazy Loading Friendly)
         const localeOutDir = path.join(outDir, locale);
         await fs.ensureDir(localeOutDir);
         
         for (const [ns, content] of Object.entries(namespaceFiles)) {
            const jsonContent = options.minify 
              ? JSON.stringify(content) 
              : JSON.stringify(content, null, 2);
            
            let filename = `${ns}.json`;
            if (options.hash) {
              const hash = crypto.createHash('md5').update(jsonContent).digest('hex').substring(0, 8);
              filename = `${ns}.${hash}.json`;
            }
            
            const filePath = path.join(localeOutDir, filename);
            await fs.writeFile(filePath, jsonContent);
            
            // Update manifest
            // Key: "en/common" -> "en/common.a1b2.json"
            manifest[`${locale}/${ns}`] = `${locale}/${filename}`;
            console.log(chalk.green(`  -> Baked ${locale}/${filename}`));
         }
      } else {
         // Output single bundle
         const jsonContent = options.minify 
            ? JSON.stringify(bundle) 
            : JSON.stringify(bundle, null, 2);
            
         let filename = `${locale}.json`;
         if (options.hash) {
            const hash = crypto.createHash('md5').update(jsonContent).digest('hex').substring(0, 8);
            filename = `${locale}.${hash}.json`;
         }
         
         const filePath = path.join(outDir, filename);
         await fs.writeFile(filePath, jsonContent);
         
         // Update manifest
         // Key: "en" -> "en.a1b2.json"
         manifest[locale] = filename;
         console.log(chalk.green(`  -> Baked ${filename} (${(await fs.stat(filePath)).size} bytes)`));
      }
    }
  }
  
  if (options.manifest) {
    const manifestPath = path.join(outDir, options.manifest);
    await fs.writeJson(manifestPath, manifest, { spaces: options.minify ? 0 : 2 });
    console.log(chalk.green(`  -> Generated manifest: ${options.manifest}`));
  }
  
  console.log(chalk.blue(`\n✅ Baking complete!`));
}

function validatePathSegment(segment: string, name: string) {
  if (!segment) return;
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
    throw new Error(`Invalid ${name}: "${segment}" contains traversal characters`);
  }
}
