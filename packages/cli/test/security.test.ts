
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { batter } from '../src/commands/batter';

const TEST_DIR = path.join(__dirname, 'temp-security-test');
const SRC_DIR = path.join(TEST_DIR, 'src');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');

describe('CLI Security Tests', () => {
  beforeEach(async () => {
    await fs.ensureDir(SRC_DIR);
    await fs.ensureDir(LOCALES_DIR);
  });

  afterEach(async () => {
    await fs.remove(TEST_DIR);
  });

  it('should prevent path traversal in namespace', async () => {
    // Malicious key: ../../outside
    const sourceCode = `
      import { t } from '@i18n-bakery/core';
      t('../../outside.key', 'Malicious');
    `;
    await fs.writeFile(path.join(SRC_DIR, 'malicious.ts'), sourceCode);

    // This should NOT throw, but should skip the malicious key
    await expect(batter(SRC_DIR, { locale: 'en', out: LOCALES_DIR }))
      .resolves.not.toThrow();
      
    // Verify file was NOT created outside
    const outsidePath = path.join(LOCALES_DIR, '..', 'outside.json');
    expect(await fs.pathExists(outsidePath)).toBe(false);
  });

  it('should prevent path traversal in locale option', async () => {
    const sourceCode = `t('common.key', 'Safe');`;
    await fs.writeFile(path.join(SRC_DIR, 'safe.ts'), sourceCode);

    // Malicious locale: ../../
    await expect(batter(SRC_DIR, { locale: '../../', out: LOCALES_DIR }))
      .rejects.toThrow(/Invalid locale/);
  });
});
