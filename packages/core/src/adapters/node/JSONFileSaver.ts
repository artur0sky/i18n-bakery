import fs from 'node:fs/promises';
import path from 'node:path';
import { TranslationSaver, Locale, Namespace, Key } from '../../domain/types';

export class JSONFileSaver implements TranslationSaver {
  private localesPath: string;

  constructor(localesPath: string) {
    this.localesPath = localesPath;
  }

  async save(locale: Locale, namespace: Namespace, key: Key, value: string): Promise<void> {
    const filePath = path.join(this.localesPath, locale, `${namespace}.json`);
    
    let content: Record<string, string> = {};
    
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Read existing file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      content = JSON.parse(fileContent);
    } catch (error: any) {
      // If file doesn't exist, we start with empty object
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Update content
    // Handle nested keys if needed, but for now we assume flat or user handles nesting in key string?
    // Wait, standard i18next JSONs are nested.
    // "home.title" -> { "home": { "title": "..." } } ? 
    // Usually namespace is file, key is inside.
    // If key is "section.title", JSON should be { "section": { "title": "..." } }
    
    this.setDeep(content, key, value);

    // Sort keys alphabetically (optional but nice for bakery)
    const sortedContent = this.sortObject(content);

    // Write back
    await fs.writeFile(filePath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf-8');
  }

  private setDeep(obj: any, path: string, value: string) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }

  private sortObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(this.sortObject.bind(this));
    
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key) => {
        result[key] = this.sortObject(obj[key]);
        return result;
      }, {});
  }
}
