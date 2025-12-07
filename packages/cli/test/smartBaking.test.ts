
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { bake } from '../src/commands/bake';

const TEST_DIR = path.join(__dirname, 'temp-smart-baking');
const LOCALES_DIR = path.join(TEST_DIR, 'locales');
const DIST_DIR = path.join(TEST_DIR, 'dist');

describe('Smart Baking (CLI)', () => {
  beforeEach(async () => {
    await fs.ensureDir(LOCALES_DIR);
    await fs.ensureDir(path.join(LOCALES_DIR, 'en'));
    await fs.writeJson(path.join(LOCALES_DIR, 'en', 'common.json'), { hello: 'Hello' });
    await fs.writeJson(path.join(LOCALES_DIR, 'en', 'auth.json'), { login: 'Login' });
  });

  afterEach(async () => {
    await fs.remove(TEST_DIR);
  });

  it('should minify output when minify option is true', async () => {
    await bake(LOCALES_DIR, { out: DIST_DIR, minify: true });
    
    const outFile = path.join(DIST_DIR, 'en.json');
    const content = await fs.readFile(outFile, 'utf-8') as string;
    
    // Check if content has no newlines/spaces
    expect(content).not.toContain('\n');
    expect(content).not.toContain('  ');
    expect(JSON.parse(content)).toEqual({
      common: { hello: 'Hello' },
      auth: { login: 'Login' }
    });
  });

  it('should hash output filename when hash option is true', async () => {
    await bake(LOCALES_DIR, { out: DIST_DIR, hash: true, manifest: 'manifest.json' });
    
    const files = await fs.readdir(DIST_DIR) as string[];
    const hashedFile = files.find(f => f.startsWith('en.') && f.endsWith('.json') && f !== 'en.json');
    
    expect(hashedFile).toBeDefined();
    expect(hashedFile).toMatch(/en\.[a-f0-9]{8}\.json/);
    
    // Check manifest
    const manifest = await fs.readJson(path.join(DIST_DIR, 'manifest.json'));
    expect(manifest['en']).toBe(hashedFile);
  });

  it('should split output into chunks when split option is true', async () => {
    await bake(LOCALES_DIR, { out: DIST_DIR, split: true, manifest: 'manifest.json' });
    
    const enDir = path.join(DIST_DIR, 'en');
    expect(await fs.pathExists(enDir)).toBe(true);
    
    const files = await fs.readdir(enDir) as string[];
    expect(files).toContain('common.json');
    expect(files).toContain('auth.json');
    
    // Check manifest
    const manifest = await fs.readJson(path.join(DIST_DIR, 'manifest.json'));
    expect(manifest['en/common']).toBe('en/common.json');
    expect(manifest['en/auth']).toBe('en/auth.json');
  });

  it('should combine split, hash, and minify', async () => {
    await bake(LOCALES_DIR, { 
      out: DIST_DIR, 
      split: true, 
      hash: true, 
      minify: true,
      manifest: 'manifest.json' 
    });
    
    const enDir = path.join(DIST_DIR, 'en');
    const files = await fs.readdir(enDir) as string[];
    
    // Should be hashed files
    const commonFile = files.find(f => f.startsWith('common.') && f.endsWith('.json'));
    expect(commonFile).toMatch(/common\.[a-f0-9]{8}\.json/);
    
    // Should be minified
    const content = await fs.readFile(path.join(enDir, commonFile!), 'utf-8');
    expect(content).not.toContain('\n');
    
    // Check manifest
    const manifest = await fs.readJson(path.join(DIST_DIR, 'manifest.json'));
    expect(manifest['en/common']).toBe(`en/${commonFile}`);
  });
});
