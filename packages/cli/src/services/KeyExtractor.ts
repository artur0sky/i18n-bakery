import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'fs-extra';
import { ExtractedKey } from '../domain/types';

export class KeyExtractor {
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

              // Infer namespace from key (e.g., "common.hello" -> "common", "auth:login" -> "auth")
              let namespace = 'common';
              if (key.includes(':')) {
                const parts = key.split(':');
                namespace = parts[0];
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
