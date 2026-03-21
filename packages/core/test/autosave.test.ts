import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initI18n, t, TranslationSaver } from '../src/index';

describe('i18n-bakery auto-save', () => {
  let mockSaver: TranslationSaver;

  beforeEach(() => {
    mockSaver = {
      save: vi.fn().mockResolvedValue(undefined),
    };

    initI18n({
      locale: 'en',
      saveMissing: true,
      saver: mockSaver,
    });
  });

  it('should call saver when key is missing and default text provided', () => {
    t('home.title', 'Welcome Home');
    expect(mockSaver.save).toHaveBeenCalledWith('en', 'home', 'title', 'Welcome Home');
  });

  it('should call saver with key part if no default text provided', () => {
    t('home.subtitle');
    expect(mockSaver.save).toHaveBeenCalledWith('en', 'home', 'subtitle', 'subtitle');
  });

  it('should not call saver if saveMissing is false', () => {
    initI18n({
      locale: 'en',
      saveMissing: false,
      saver: mockSaver,
    });
    t('home.desc', 'Description');
    expect(mockSaver.save).not.toHaveBeenCalled();
  });

  it('should not call saver if key already exists', () => {
    // First call saves it and adds to memory
    t('home.exists', 'Existing');
    expect(mockSaver.save).toHaveBeenCalledTimes(1);
    
    // Second call should find it in memory (because handleMissingKey updates store)
    t('home.exists', 'Existing');
    expect(mockSaver.save).toHaveBeenCalledTimes(1);
  });
});
