
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { PoachRecipes } from '../../src/use-cases/PoachRecipes';
import { I18NextSource } from '../../src/adapters/I18NextSource';
import { BakeryTarget } from '../../src/adapters/BakeryTarget';
import { ConsoleLogger } from '../../src/adapters/ConsoleLogger';

const FIXTURES_DIR = path.join(__dirname, '../fixtures/complex-project/locales');
const OUTPUT_DIR = path.join(__dirname, '../temp_poach_output');

describe('PoachRecipes (UseCase)', () => {
    const logger = new ConsoleLogger();

    beforeEach(async () => {
        await fs.ensureDir(OUTPUT_DIR);
        await fs.emptyDir(OUTPUT_DIR);
    });

    afterEach(async () => {
        if (process.env.KEEP_ARTIFACTS !== 'true') {
            await fs.remove(OUTPUT_DIR);
            
            // Cleanup backups generated during test
            const parentDir = path.dirname(OUTPUT_DIR);
            const targetName = path.basename(OUTPUT_DIR);
            const files = (await fs.readdir(parentDir)) as string[];
            const backups = files.filter(f => f.startsWith(`${targetName}_backup_`));
            
            for (const backup of backups) {
                await fs.remove(path.join(parentDir, backup));
            }
        }
    });

    it('should orchestrate full migration successfully', async () => {
        const poacher = new PoachRecipes(
            new I18NextSource(),
            new BakeryTarget(logger),
            logger
        );

        await poacher.execute(FIXTURES_DIR, OUTPUT_DIR);

        // Verify Structure
        // en/common.json
        // en/auth.json
        // es/common.json
        
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'en', 'common.json'))).toBe(true);
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'en', 'auth.json'))).toBe(true);
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'es', 'common.json'))).toBe(true);
    });

    it('dry-run should NOT write files', async () => {
        const poacher = new PoachRecipes(
            new I18NextSource(),
            new BakeryTarget(logger),
            logger
        );

        await poacher.execute(FIXTURES_DIR, OUTPUT_DIR, { dryRun: true });

        expect(await fs.readdir(OUTPUT_DIR)).toHaveLength(0);
    });

    it('should fail cleanly if source adapter fails', async () => {
        const poacher = new PoachRecipes(
            new I18NextSource(), // Will fail on bad path
            new BakeryTarget(logger),
            logger
        );

        await expect(poacher.execute('./bad/path', OUTPUT_DIR)).rejects.toThrow();
    });
});
