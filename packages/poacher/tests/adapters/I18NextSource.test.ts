
import { describe, it, expect } from 'vitest';
import path from 'path';
import { I18NextSource } from '../../src/adapters/I18NextSource';

const FIXTURES_DIR = path.join(__dirname, '../fixtures/complex-project/locales');

describe('I18NextSource', () => {
    it('should correctly load nested folder structure', async () => {
        const source = new I18NextSource();
        const map = await source.loadTranslations(FIXTURES_DIR);

        // Check Locales
        expect(map.has('en')).toBe(true);
        expect(map.has('es')).toBe(true);
        expect(map.size).toBe(2);

        // Check Namespaces in EN
        const en = map.get('en')!;
        expect(en['common']).toBeDefined();
        expect(en['auth']).toBeDefined();

        // Check Content
        // @ts-ignore
        expect(en['common'].welcome).toBe("Welcome to Bakery");
        // @ts-ignore
        expect(en['auth'].errors.required).toBe("Field is required");
    });

    it('should throw error if path does not exist', async () => {
        const source = new I18NextSource();
        await expect(source.loadTranslations('./fake/path')).rejects.toThrow();
    });
});
