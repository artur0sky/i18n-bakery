
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { BakeryTarget } from '../../src/adapters/BakeryTarget';
import { ConsoleLogger } from '../../src/adapters/ConsoleLogger';

const OUTPUT_DIR = path.join(__dirname, '../temp_target_output');

describe('BakeryTarget', () => {
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
            if (await fs.pathExists(parentDir)) {
                const files = (await fs.readdir(parentDir)) as string[];
                const backups = files.filter(f => f.startsWith(`${targetName}_backup_`));
                for (const backup of backups) {
                    await fs.remove(path.join(parentDir, backup));
                }
            }
        }
    });

    it('should backup existing directory', async () => {
        // Setup existing
        await fs.writeJson(path.join(OUTPUT_DIR, 'dummy.json'), { foo: 'bar' });
        
        const target = new BakeryTarget(logger);
        await target.backup(OUTPUT_DIR);

        // Check for backup folder sibling
        const parent = path.dirname(OUTPUT_DIR);
        const siblings = (await fs.readdir(parent)) as string[];
        const backup = siblings.find(s => s.startsWith('temp_target_output_backup_'));
        expect(backup).toBeDefined();

        // Cleanup
        if(backup) await fs.remove(path.join(parent, backup));
    });

    it('should write translations with correct bakery structure', async () => {
        const target = new BakeryTarget(logger);
        const map = new Map();
        map.set('en', {
            'common': { hello: 'world' },
            'auth': { login: 'Log In' }
        });

        await target.saveTranslations(OUTPUT_DIR, map);

        // Expect en/common.json and en/auth.json
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'en', 'common.json'))).toBe(true);
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'en', 'auth.json'))).toBe(true);
    });

    it('should handle flat maps by mapping to translation.json or nested files', async () => {
        // Scenario: Input was flattened keys or a root object that looks like namespace
        const target = new BakeryTarget(logger);
        const map = new Map();
        
        // Simulating result from flat file parsing which Poacher passes
        // If passed as { "namespace": { ... } } it works.
        // If passed as { "key": "val" } -> translation.json
        map.set('es', {
            'simple_key': 'hola'
        });

        await target.saveTranslations(OUTPUT_DIR, map);
        
        const file = path.join(OUTPUT_DIR, 'es', 'translation.json');
        expect(await fs.pathExists(file)).toBe(true);
        const content = await fs.readJson(file);
        expect(content.simple_key).toBe('hola');
    });

    it('should promote nested objects in flat maps to namespaces', async () => {
        const target = new BakeryTarget(logger);
        const map = new Map();
        map.set('fr', {
            'errors': { '404': 'Not Found' }, // Object -> Namespace
            'title': 'Le Website'             // String -> translation.json
        });

        await target.saveTranslations(OUTPUT_DIR, map);

        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'fr', 'errors.json'))).toBe(true);
        expect(await fs.pathExists(path.join(OUTPUT_DIR, 'fr', 'translation.json'))).toBe(true);
    });
});
