
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { BabelKeyExtractor } from '../../src/adapters/BabelKeyExtractor';

const TEMP_DIR = path.join(__dirname, 'temp_babel_extractor_test');

describe('BabelKeyExtractor - Options Object Support', () => {
    beforeEach(async () => {
        await fs.ensureDir(TEMP_DIR);
    });

    afterEach(async () => {
        await fs.remove(TEMP_DIR);
    });

    it('should extract defaultValue from options object', async () => {
        const filePath = path.join(TEMP_DIR, 'TestComponent.tsx');
        const content = `
            import { useTranslation } from 'react-i18next';

            export function TestComponent() {
                const { t } = useTranslation();

                return (
                    <div>
                        {/* Standard usage */}
                        <h1>{t('header.title', 'Welcome Back')}</h1>

                        {/* Options object usage (i18next style) */}
                        <p>{t('header.subtitle', { defaultValue: 'My default subtitle', otherVar: 123 })}</p>

                        {/* Mixed usage (second arg is default) */}
                        <span>{t('header.footer', 'Footer Text', { someOption: true })}</span>
                        
                        {/* Empty defaults */}
                         <span>{t('header.empty')}</span>
                    </div>
                );
            }
        `;
        await fs.writeFile(filePath, content);

        const extractor = new BabelKeyExtractor();
        const keys = await extractor.extractFromFile(filePath);

        // Sort keys to ensure order
        keys.sort((a, b) => a.key.localeCompare(b.key));

        expect(keys).toHaveLength(4);

        // 1. header.empty
        expect(keys[0].key).toBe('header.empty');
        expect(keys[0].defaultValue).toBeUndefined();

        // 2. header.footer
        expect(keys[1].key).toBe('header.footer');
        expect(keys[1].defaultValue).toBe('Footer Text');

        // 3. header.subtitle (THE NEW FEATURE)
        expect(keys[2].key).toBe('header.subtitle');
        expect(keys[2].defaultValue).toBe('My default subtitle');

        // 4. header.title
        expect(keys[3].key).toBe('header.title');
        expect(keys[3].defaultValue).toBe('Welcome Back');
    });
});
