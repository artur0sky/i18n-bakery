import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { JSONFileSaver } from '../adapters/JSONFileSaver';
import { TOMLFileSaver } from '../adapters/TOMLFileSaver';
import type { ExtractedKey } from '../domain/KeyExtractor';
import { ProjectScanner } from './ProjectScanner';

export interface ExtractionOptions {
  source: string;
  out: string;
  locales: string[];
  format?: 'json' | 'toml';
  cwd?: string;
  clean?: boolean;
  purge?: boolean;
}

export interface ExtractionUseCaseResult {
  totalKeys: number;
  keysByNamespace: Record<string, ExtractedKey[]>;
  outputDir: string;
  filesScanned: number;
  newKeysPerLocale: Record<string, number>;
}

function validatePathSegment(segment: string, label: string): void {
  if (
    !segment ||
    segment === '.' ||
    segment === '..' ||
    segment.includes('..') ||
    segment.includes('/') ||
    segment.includes('\\') ||
    segment.includes('\0') ||
    segment === '__proto__' ||
    segment === 'constructor' ||
    segment === 'prototype' ||
    path.isAbsolute(segment)
  ) {
    throw new Error(`Invalid ${label}: "${segment}" is not a safe path segment`);
  }
}

function validateNamespace(namespace: string): void {
  const segments = namespace.split('/');
  if (!namespace || segments.some((segment) => !segment)) {
    throw new Error(`Invalid namespace: "${namespace}"`);
  }
  segments.forEach((segment) => validatePathSegment(segment, 'namespace'));
}

function validateKey(key: string): void {
  const segments = key.split('.');
  if (
    !key ||
    segments.some(
      (segment) =>
        !segment ||
        segment === '__proto__' ||
        segment === 'constructor' ||
        segment === 'prototype'
    )
  ) {
    throw new Error(`Invalid translation key: "${key}"`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasTranslation(data: Record<string, unknown>, key: string): boolean {
  let current: unknown = data;
  for (const segment of key.split('.')) {
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, segment)) {
      return false;
    }
    current = current[segment];
  }
  return true;
}

function setTranslation(data: Record<string, unknown>, key: string, value: string): void {
  const segments = key.split('.');
  let current = data;
  for (const segment of segments.slice(0, -1)) {
    const child = current[segment];
    if (isRecord(child)) {
      current = child;
    } else {
      const newChild: Record<string, unknown> = {};
      current[segment] = newChild;
      current = newChild;
    }
  }
  current[segments[segments.length - 1]] = value;
}

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  );
}

export class ExtractionUseCase {
  async execute(options: ExtractionOptions): Promise<ExtractionUseCaseResult> {
    const cwd = path.resolve(options.cwd ?? process.cwd());
    const outDir = path.resolve(cwd, options.out);
    const format = options.format ?? 'json';
    const extension = format === 'toml' ? '.toml' : '.json';
    const locales = [...new Set(options.locales)];

    locales.forEach((locale) => validatePathSegment(locale, 'locale'));

    const scanner = new ProjectScanner();
    const { keys, filesScanned } = await scanner.scan({ source: options.source, cwd });
    const keysByNamespace: Record<string, ExtractedKey[]> = {};
    let totalKeys = 0;

    for (const key of keys) {
      try {
        validateNamespace(key.namespace);
        validateKey(key.key);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Skipping unsafe translation key "${key.key}": ${message}`);
        continue;
      }

      (keysByNamespace[key.namespace] ??= []).push(key);
      totalKeys++;
    }

    if (options.clean) {
      const sourceDir = path.resolve(cwd, options.source);
      const relativeSource = path.relative(outDir, sourceDir);
      const outputContainsSource =
        relativeSource === '' ||
        (!relativeSource.startsWith(`..${path.sep}`) &&
          relativeSource !== '..' &&
          !path.isAbsolute(relativeSource));

      if (outDir === cwd || outDir === path.parse(outDir).root || outputContainsSource) {
        throw new Error(`Refusing to clean unsafe output directory: ${outDir}`);
      }
      await fs.emptyDir(outDir);
    }

    const saver =
      format === 'toml' ? new TOMLFileSaver(outDir) : new JSONFileSaver(outDir, 'nested');
    const newKeysPerLocale: Record<string, number> = {};

    for (const locale of locales) {
      const localeDir = path.join(outDir, locale);
      await fs.ensureDir(localeDir);
      let newKeyCount = 0;
      const expectedFiles = new Set<string>();

      for (const [namespace, namespaceKeys] of Object.entries(keysByNamespace)) {
        const namespacePath = namespace.split('/').join(path.sep);
        const filePath = path.join(localeDir, `${namespacePath}${extension}`);
        expectedFiles.add(`${namespacePath.split(path.sep).join('/')}${extension}`);

        let existing: Record<string, unknown> = {};
        try {
          const contents = await fs.readFile(filePath, 'utf-8');
          const parsed: unknown =
            format === 'toml'
              ? new TOMLFileSaver(outDir).parseTOML(contents)
              : JSON.parse(contents);
          if (!isRecord(parsed)) {
            throw new Error(`Expected an object in translation file: ${filePath}`);
          }
          existing = parsed;
        } catch (error) {
          if (!isMissingFileError(error)) throw error;
        }

        for (const key of namespaceKeys) {
          let finalKey = key.key;
          const dotPrefix = `${namespace.replace(/\//g, '.')}.`;
          const colonPrefix = `${namespace.replace(/\//g, ':')}:`;
          if (finalKey.startsWith(dotPrefix)) {
            finalKey = finalKey.slice(dotPrefix.length);
          } else if (finalKey.startsWith(colonPrefix)) {
            finalKey = finalKey.slice(colonPrefix.length);
          }

          validateKey(finalKey);
          if (hasTranslation(existing, finalKey)) continue;

          const value = `[TODO] ${key.defaultValue || finalKey}`;
          await saver.save(locale, namespace, finalKey, value);
          setTranslation(existing, finalKey, value);
          newKeyCount++;
        }
      }

      if (options.purge) {
        const existingFiles = await glob(`**/*${extension}`, {
          cwd: localeDir,
          nodir: true,
        });
        for (const file of existingFiles) {
          const normalizedFile = file.replace(/\\/g, '/');
          if (!expectedFiles.has(normalizedFile)) {
            await fs.remove(path.join(localeDir, file));
          }
        }
      }

      newKeysPerLocale[locale] = newKeyCount;
    }

    return {
      totalKeys,
      keysByNamespace,
      outputDir: outDir,
      filesScanned,
      newKeysPerLocale,
    };
  }
}
