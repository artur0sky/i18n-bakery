import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { batter } from '../src/commands/batter';
import { bake } from '../src/commands/bake';

const TEST_DIR = path.join(__dirname, 'temp-test-env');
const SRC_DIR = path.join(TEST_DIR, 'src');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');
const DIST_DIR = path.join(TEST_DIR, 'dist');

describe('CLI Integration Tests', () => {
  beforeEach(async () => {
    await fs.ensureDir(SRC_DIR);
    await fs.ensureDir(LOCALES_DIR);
  });

  afterEach(async () => {
    await fs.remove(TEST_DIR);
  });

  it('should extract translations (batter) and compile them (bake)', async () => {
    // 1. Create a dummy source file
    const sourceCode = `
      import { t } from '@i18n-bakery/core';
      
      export function Component() {
        t('common.greeting', 'Hello World');
        t('auth.login', 'Sign In');
        t('auth.logout'); // No default
      }
    `;
    await fs.writeFile(path.join(SRC_DIR, 'app.ts'), sourceCode);

    // 2. Run BATTER
    await batter(SRC_DIR, { locale: 'en', out: LOCALES_DIR });

    // 3. Verify extraction
    const commonJsonPath = path.join(LOCALES_DIR, 'en', 'common.json');
    const authJsonPath = path.join(LOCALES_DIR, 'en', 'auth.json');

    expect(await fs.pathExists(commonJsonPath)).toBe(true);
    expect(await fs.pathExists(authJsonPath)).toBe(true);

    const commonData = await fs.readJson(commonJsonPath);
    const authData = await fs.readJson(authJsonPath);

    expect(commonData['greeting']).toBe('Hello World');
    expect(authData['login']).toBe('Sign In');
    expect(authData['logout']).toBe('logout'); // Default fallback

    // 4. Run BAKE
    await bake(LOCALES_DIR, { out: DIST_DIR });

    // 5. Verify compilation
    const bundlePath = path.join(DIST_DIR, 'en.json');
    expect(await fs.pathExists(bundlePath)).toBe(true);

    const bundle = await fs.readJson(bundlePath);
    expect(bundle.common['greeting']).toBe('Hello World');
    expect(bundle.auth['login']).toBe('Sign In');
  });

  it('should merge with existing translations', async () => {
    // 1. Setup existing translation
    const existingAuth = {
      "login": "Log In Existing", // Should be preserved if we don't overwrite (logic check)
      "old": "Old Key"
    };
    await fs.ensureDir(path.join(LOCALES_DIR, 'en'));
    await fs.writeJson(path.join(LOCALES_DIR, 'en', 'auth.json'), existingAuth);

    // 2. Create source file
    const sourceCode = `t('auth.login', 'New Default'); t('auth.new', 'New Key');`;
    await fs.writeFile(path.join(SRC_DIR, 'update.ts'), sourceCode);

    // 3. Run BATTER
    await batter(SRC_DIR, { locale: 'en', out: LOCALES_DIR });

    // 4. Verify merge
    const authData = await fs.readJson(path.join(LOCALES_DIR, 'en', 'auth.json'));
    
    // Existing keys should be preserved? 
    // Based on current implementation: 
    // if (!currentTranslations[k.key]) { currentTranslations[k.key] = ... }
    // So existing keys are preserved.
    expect(authData['login']).toBe('Log In Existing'); 
    expect(authData['old']).toBe('Old Key'); // Preserved
    expect(authData['new']).toBe('New Key'); // Added
  });
});
