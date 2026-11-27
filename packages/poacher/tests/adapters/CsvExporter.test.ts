import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { CsvExporter } from '../../src/adapters/CsvExporter';

describe('CsvExporter', () => {
    it('quotes every field and neutralizes spreadsheet formulas in keys, locales and values', async () => {
        const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bakery-csv-'));
        try {
            const output = path.join(dir, 'translations.csv');
            await new CsvExporter().export(output, new Map([
                ['=locale', {
                    '=SUM(1,2)': '  =1+1',
                    'comma,"quote"': 'line 1\nline "2"',
                    'normal': 'Hello',
                    'tab': '\ttext',
                }],
            ]));
            const csv = await fs.readFile(output, 'utf8');
            expect(csv).toBe([
                '"key","\'=locale"',
                '"\'=SUM(1,2)","\'  =1+1"',
                '"comma,""quote""","line 1\nline ""2"""',
                '"normal","Hello"',
                '"tab","\'\ttext"',
            ].join('\n'));
        } finally {
            await fs.remove(dir);
        }
    });
});
