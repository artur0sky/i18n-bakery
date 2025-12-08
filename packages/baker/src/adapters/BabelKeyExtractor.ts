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

      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee) && path.node.callee.name === 't') {
            const args = path.node.arguments;
            if (args.length > 0 && t.isStringLiteral(args[0])) {
              const key = args[0].value;
              let defaultValue: string | undefined;

              if (args.length > 1 && t.isStringLiteral(args[1])) {
                defaultValue = args[1].value;
              }

              // Infer namespace from key (e.g., "common.hello" -> "common", "auth:login" -> "auth", "home:hero:title" -> "home/hero")
              let namespace = 'common';
              if (key.includes(':')) {
                const lastColonIndex = key.lastIndexOf(':');
                const namespacePart = key.substring(0, lastColonIndex);
                // Convert colons to slashes for directory structure
                namespace = namespacePart.replace(/:/g, '/');
              } else if (key.includes('.')) {
                const parts = key.split('.');
                namespace = parts[0];
              }

              keys.push({
                key,
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
      console.warn(`Failed to parse ${filePath}:`, error);
    }

    return keys;
  }
}
