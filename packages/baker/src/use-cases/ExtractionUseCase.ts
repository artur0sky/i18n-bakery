import path from 'path';
import { ProjectScanner } from './ProjectScanner';
import { JSONFileSaver } from '../adapters/JSONFileSaver';
import { TOMLFileSaver } from '../adapters/TOMLFileSaver';

export interface ExtractionOptions {
  source: string;
  out: string;
  locales: string[];
  format?: 'json' | 'toml';
  cwd?: string;
}

export class ExtractionUseCase {
  async execute(options: ExtractionOptions) {
    const cwd = options.cwd ?? process.cwd();
    const outDir = path.isAbsolute(options.out) ? options.out : path.join(cwd, options.out);
    
    for (const locale of options.locales) {
      if (locale.includes('..') || locale.includes('/') || locale.includes('\\')) {
        throw new Error(`Invalid locale: ${locale}`);
      }
    }
    
    const scanner = new ProjectScanner();
    const { keys, filesScanned } = await scanner.scan({ source: options.source, cwd });

    const format = options.format || 'json';
    
    const keysByNamespace: Record<string, any[]> = {};

    for (const k of keys) {
      if (!keysByNamespace[k.namespace]) keysByNamespace[k.namespace] = [];
      keysByNamespace[k.namespace].push(k);
    }

    for (const locale of options.locales) {
      const saver = format === 'toml' 
        ? new TOMLFileSaver(outDir) 
        : new JSONFileSaver(outDir, 'nested');

      for (const [namespace, namespaceKeys] of Object.entries(keysByNamespace)) {
        for (const k of namespaceKeys) {
          let finalKey = k.key;
          
          // If the key explicitly contains the namespace (either as 'ns:key' or 'ns.key'), 
          // strip the prefix to get the clean key inside the file.
          const colonIndex = k.key.indexOf(':');
          const dotIndex = k.key.indexOf('.');
          
          if (colonIndex !== -1) {
            // Priority 1: Colon separator (e.g. "auth:login.title" -> "login.title" in auth.json)
            const nsPart = k.key.substring(0, colonIndex);
            if (nsPart.replace(/:/g, '/') === namespace) {
              finalKey = k.key.substring(colonIndex + 1);
            }
          } else if (dotIndex !== -1) {
            // Priority 2: Dot separator (e.g. "common.welcome" -> "welcome" in common.json)
            const nsPart = k.key.substring(0, dotIndex);
            if (nsPart === namespace) {
              finalKey = k.key.substring(dotIndex + 1);
            }
          }

          const value = k.defaultValue || finalKey;
          await saver.save(locale, namespace, finalKey, value);
        }
      }
    }

    return {
      totalKeys: keys.length,
      keysByNamespace,
      outputDir: outDir,
      filesScanned,
    };
  }
}
