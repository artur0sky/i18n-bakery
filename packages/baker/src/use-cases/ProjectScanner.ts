import { glob } from 'glob';
import path from 'path';
import fs from 'fs-extra';
import { ExtractedKey } from '../domain/KeyExtractor';
import { BabelKeyExtractor } from '../adapters/BabelKeyExtractor';

export interface ProjectScannerOptions {
  source: string;
  cwd?: string;
}

export interface ProjectScannerResult {
  keys: ExtractedKey[];
  filesScanned: number;
}

export class ProjectScanner {
  private extractor = new BabelKeyExtractor();

  async scan(options: ProjectScannerOptions): Promise<ProjectScannerResult> {
    const cwd = options.cwd ?? process.cwd();
    const absoluteSource = path.isAbsolute(options.source) ? options.source : path.join(cwd, options.source);

    if (!(await fs.pathExists(absoluteSource))) {
      throw new Error(`Source directory not found: ${absoluteSource}`);
    }

    const files = await glob(`${absoluteSource.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`, { 
      ignore: ['**/*.d.ts', '**/node_modules/**'] 
    });

    const allKeys: ExtractedKey[] = [];

    for (const file of files) {
      try {
        const extracted = await this.extractor.extractFromFile(file);
        allKeys.push(...extracted);
      } catch (e) {
        // Skip or log parsing errors
      }
    }

    return { keys: allKeys, filesScanned: files.length };
  }
}
