/**
 * 🥯 i18n-bakery/tray - BakeUseCase (Use Case Layer)
 *
 * Orchestrates the compilation (baking) of locale files into production bundles.
 * Delegates all heavy lifting to @i18n-bakery/baker's BakingManager.
 *
 * SRP: Only responsible for adapting MCP input to BakingManager and collecting results.
 *
 * @module use-cases/BakeUseCase
 */

import path from 'path';
import fs from 'fs-extra';
import { glob } from 'glob';
import { BakingManager } from '@i18n-bakery/baker';
import type { BakeInput, BakeResult } from '../domain/types';
import { SilentLogger } from '../adapters/SilentLogger';

/**
 * Orchestrates the "bake" (compilation) phase.
 * Reads locale files and compiles them into optimized production bundles.
 */
export class BakeUseCase {
  async execute(input: BakeInput): Promise<BakeResult> {
    const { source, cwd } = input;
    const out = input.out ?? 'dist/locales';

    const absoluteSource = path.isAbsolute(source) ? source : path.join(cwd, source);
    const absoluteOut = path.isAbsolute(out) ? out : path.join(cwd, out);

    if (!(await fs.pathExists(absoluteSource))) {
      throw new Error(`Source directory not found: ${absoluteSource}`);
    }

    // Use SilentLogger to capture output structurally, not as console noise
    const logger = new SilentLogger();
    const manager = new BakingManager(logger);

    await manager.bake(absoluteSource, {
      out: absoluteOut,
      minify: input.minify,
      hash: input.hash,
      manifest: input.manifest,
      split: input.split,
      encrypt: input.encrypt,
      key: input.encryptionKey,
    });

    // Collect results by scanning output
    const bakedFiles = await glob(`${absoluteOut.replace(/\\/g, '/')}/**/*.json`);

    const manifestPath = input.manifest
      ? path.join(absoluteOut, input.manifest)
      : undefined;

    // Count locales from source directory
    const entries = await fs.readdir(absoluteSource);
    const localesCount = (
      await Promise.all(
        entries.map(async (e) => {
          const stat = await fs.stat(path.join(absoluteSource, e));
          return stat.isDirectory();
        })
      )
    ).filter(Boolean).length;

    return {
      bakedFiles: bakedFiles.map((f) => path.relative(cwd, f)),
      manifestPath: manifestPath ? path.relative(cwd, manifestPath) : undefined,
      localesCount,
    };
  }
}
