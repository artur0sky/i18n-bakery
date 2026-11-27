/**
 * 🥯 i18n-bakery - Babel Key Extractor (Adapter Layer)
 * 
 * Concrete implementation of the KeyExtractor interface using Babel.
 * Parses source code to find t() calls and extract keys.
 * 
 * @module adapters/BabelKeyExtractor
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'fs-extra';
import { KeyExtractor, ExtractedKey } from '../domain/KeyExtractor';

/**
 * KeyExtractor implementation using Babel parser.
 * 
 * This adapter parses TypeScript/JavaScript files to find usages of the `t()` function.
 * It extracts the key, default value, and infers the namespace.
 */
export class BabelKeyExtractor implements KeyExtractor {
  async extractFromFile(filePath: string): Promise<ExtractedKey[]> {
    const code = await fs.readFile(filePath, 'utf-8');
    const keys: ExtractedKey[] = [];

    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
      });

      let defaultNamespace = 'common';
      let hasExplicitNamespace = false;

      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'useTranslation') {
            const args = path.node.arguments;
            if (args.length > 0 && t.isStringLiteral(args[0])) {
              defaultNamespace = args[0].value.replace(/:/g, '/');
              hasExplicitNamespace = true;
            } else if (args.length === 0) {
              hasExplicitNamespace = true;
            }
          }
        }
      });

      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee) && path.node.callee.name === 't') {
            const args = path.node.arguments;
            if (args.length > 0 && t.isStringLiteral(args[0])) {
              const key = args[0].value;
              let defaultValue: string | undefined;

              if (args.length > 1) {
                const secondArg = args[1];

                if (t.isStringLiteral(secondArg)) {
                  defaultValue = secondArg.value;
                } else if (t.isObjectExpression(secondArg)) {
                  const properties = secondArg.properties;
                  for (const prop of properties) {
                    if (
                      t.isObjectProperty(prop) &&
                      t.isIdentifier(prop.key) &&
                      prop.key.name === 'defaultValue' &&
                      t.isStringLiteral(prop.value)
                    ) {
                      defaultValue = prop.value.value;
                      break;
                    }
                  }
                }
              }

              let namespace = defaultNamespace;
              let actualKey = key;

              if (key.includes(':')) {
                const lastColonIndex = key.lastIndexOf(':');
                const namespacePart = key.substring(0, lastColonIndex);
                namespace = namespacePart.replace(/:/g, '/');
                actualKey = key.substring(lastColonIndex + 1);
              } else if (key.includes('.') && !hasExplicitNamespace) {
                const firstDotIndex = key.indexOf('.');
                namespace = key.substring(0, firstDotIndex);
                actualKey = key.substring(firstDotIndex + 1);
              }

              keys.push({
                key: actualKey,
                defaultValue,
                file: filePath,
                line: path.node.loc?.start.line || 0,
                namespace,
              });
            }
          }
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse ${filePath}: ${message}`);
    }

    return keys;
  }
}
