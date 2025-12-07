
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpBackend } from '../src/plugins/HttpBackend';

describe('HttpBackend', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should load translations from URL pattern', async () => {
    const backend = new HttpBackend({
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    });

    const mockData = { key: 'value' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    const result = await backend.load('en', 'common');
    
    expect(global.fetch).toHaveBeenCalledWith('/locales/en/common.json', undefined);
    expect(result).toEqual(mockData);
  });

  it('should load translations using manifest', async () => {
    const backend = new HttpBackend({
      loadPath: '/fallback/{{lng}}/{{ns}}.json',
      manifestPath: '/manifest.json'
    });

    // Mock manifest load
    const manifest = {
      'en/common': '/hashed/en-common-123.json'
    };
    
    // First call for manifest, second for translation
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => manifest
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ key: 'hashed' })
      });

    await backend.init();
    const result = await backend.load('en', 'common');

    expect(global.fetch).toHaveBeenNthCalledWith(1, '/manifest.json', undefined);
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/hashed/en-common-123.json', undefined);
    expect(result).toEqual({ key: 'hashed' });
  });

  it('should fallback to pattern if manifest fails', async () => {
    const backend = new HttpBackend({
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      manifestPath: '/manifest.json'
    });

    // Mock manifest failure
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await backend.init();
    
    // Mock translation success
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ key: 'fallback' })
    });

    const result = await backend.load('en', 'common');

    expect(global.fetch).toHaveBeenCalledWith('/locales/en/common.json', undefined);
    expect(result).toEqual({ key: 'fallback' });
  });
});
