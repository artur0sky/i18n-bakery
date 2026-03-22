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
        throw new Error(`Invalid locale name: ${locale}`);
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
          const slashRegex = new RegExp('/', 'g');
          const dotPrefix = `${namespace.replace(slashRegex, '.')}.`;
          const colonPrefix = `${namespace.replace(slashRegex, ':')}.`;
          
          if (finalKey.startsWith(dotPrefix)) {
            finalKey = finalKey.slice(dotPrefix.length);
          } else if (finalKey.startsWith(colonPrefix)) {
            finalKey = finalKey.slice(colonPrefix.length);
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
