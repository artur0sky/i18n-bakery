import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { ExtractionUseCase } from '../src/use-cases/ExtractionUseCase';

describe('ExtractionUseCase', () => {
  let temporaryDirectory: string | undefined;

  afterEach(async () => {
    if (temporaryDirectory) {
      await fs.remove(temporaryDirectory);
      temporaryDirectory = undefined;
    }
  });

  async function createProject(source: string): Promise<string> {
    temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'i18n-bakery-extraction-'));
    const sourceDirectory = path.join(temporaryDirectory, 'src');
    await fs.ensureDir(sourceDirectory);
    await fs.writeFile(path.join(sourceDirectory, 'app.ts'), source, 'utf-8');
    return temporaryDirectory;
  }

  it('marks only new keys as TODO and preserves existing translations', async () => {
    const cwd = await createProject("t('common.existing', 'Fallback'); t('common.new', 'New value');");
    const localeDirectory = path.join(cwd, 'locales', 'en');
    await fs.ensureDir(localeDirectory);
    await fs.writeJson(path.join(localeDirectory, 'common.json'), {
      existing: 'Translated value',
      legacy: 'Keep this',
    });

    const result = await new ExtractionUseCase().execute({
      source: 'src',
      out: 'locales',
      locales: ['en'],
      cwd,
    });

    expect(await fs.readJson(path.join(localeDirectory, 'common.json'))).toEqual({
      existing: 'Translated value',
      legacy: 'Keep this',
      new: '[TODO] New value',
    });
    expect(result.newKeysPerLocale.en).toBe(1);
  });

  it('purges orphaned files without removing active translation namespaces', async () => {
    const cwd = await createProject("t('common.current', 'Current value');");
    const localeDirectory = path.join(cwd, 'locales', 'en');
    await fs.ensureDir(localeDirectory);
    await fs.writeJson(path.join(localeDirectory, 'orphan.json'), { old: 'Old value' });

    await new ExtractionUseCase().execute({
      source: 'src',
      out: 'locales',
      locales: ['en'],
      cwd,
      purge: true,
    });

    expect(await fs.pathExists(path.join(localeDirectory, 'orphan.json'))).toBe(false);
    expect(await fs.readJson(path.join(localeDirectory, 'common.json'))).toEqual({
      current: '[TODO] Current value',
    });
  });

  it('refuses to clean a directory containing the source project', async () => {
    const cwd = await createProject("t('common.key', 'Value');");

    await expect(
      new ExtractionUseCase().execute({
        source: 'src',
        out: '.',
        locales: ['en'],
        cwd,
        clean: true,
      })
    ).rejects.toThrow('Refusing to clean unsafe output directory');

    expect(await fs.pathExists(path.join(cwd, 'src', 'app.ts'))).toBe(true);
  });

  it('rejects namespaces that could escape the locale directory', async () => {
    const cwd = await createProject("t('../outside:polluted', 'Value');");

    await expect(
      new ExtractionUseCase().execute({
        source: 'src',
        out: 'locales',
        locales: ['en'],
        cwd,
      })
    ).rejects.toThrow('Invalid namespace');
    expect(await fs.pathExists(path.join(cwd, 'outside.json'))).toBe(false);
  });
});
