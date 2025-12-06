import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { I18nProvider, useT, useI18n } from '../src';
import { I18nConfig, I18nService } from '@i18n-bakery/core';
import React from 'react';

// Mock I18nService to avoid full core dependency in unit tests if desired,
// but integration testing with real core is better for this package.
// We will use real core but mock loader/saver if needed.

const mockConfig: I18nConfig = {
  locale: 'en',
  fallbackLocale: 'es',
  loader: {
    load: async (locale, ns) => {
      if (locale === 'en' && ns === 'common') {
        return { hello: 'Hello World' };
      }
      return null;
    }
  }
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(I18nProvider, { config: mockConfig, children }, children)
);

describe('React Bindings', () => {
  it('should provide i18n instance', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.i18n).toBeInstanceOf(I18nService);
    expect(result.current.locale).toBe('en');
  });

  it('should translate using useT', async () => {
    // We need both hooks to test interaction
    const { result } = renderHook(() => {
        const t = useT();
        const i18n = useI18n();
        return { ...t, setLocale: i18n.setLocale, i18nInstance: i18n.i18n };
    }, { wrapper });
    
    // First render, translation missing
    expect(result.current.t('common.hello')).toBe('common.hello'); 

    // Add translations manually
    await act(async () => {
      result.current.i18nInstance.addTranslations('en', 'common', { hello: 'Hello World' });
      // Force re-render
      await result.current.setLocale('en');
    });
    
    expect(result.current.t('common.hello')).toBe('Hello World');
  });

  it('should change locale', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.setLocale('es');
    });

    expect(result.current.locale).toBe('es');
    expect(result.current.i18n.getCurrentLocale()).toBe('es');
  });

  it('should handle namespaces in useT', () => {
    const { result } = renderHook(() => useT('auth'), { wrapper });
    
    // Should prepend namespace
    // We mock t to verify arguments? Or just check output key
    // i18n.t returns key if not found.
    expect(result.current.t('login')).toBe('auth.login');
    expect(result.current.t('common.login')).toBe('common.login'); // Should not prepend if already has dot
  });
});
