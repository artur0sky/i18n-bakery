import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { I18nProvider, useTranslation, useI18n } from '../src';
import { I18nConfig, I18nService, initI18n } from '@i18n-bakery/core';
import React from 'react';

const mockConfig: I18nConfig = {
  locale: 'en',
  fallbackLocale: 'es',
  debug: true,
  loader: {
    load: async (locale, ns) => {
      if (locale === 'en' && ns === 'common') {
        return { hello: 'Hello World' };
      }
      return null;
    }
  }
};

const service = initI18n(mockConfig);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(I18nProvider, { config: mockConfig, children }, children)
);

describe('React Bindings', () => {
  it('should provide i18n instance', () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.i18n).toBeInstanceOf(I18nService);
    expect(result.current.locale).toBe('en');
  });

  it('should translate using useTranslation', async () => {
    const { result } = renderHook(() => {
        const tObj = useTranslation();
        const { i18n } = useI18n();
        return { ...tObj, i18nInstance: i18n };
    }, { wrapper });
    
    expect(result.current.t('common:hello')).toBe('common:hello'); 

    act(() => {
      result.current.i18nInstance.addTranslations('en', 'common', { hello: 'Hello World' });
    });
    
    await waitFor(() => {
      expect(result.current.t('common:hello')).toBe('Hello World');
    });
  });

  it('should change locale', async () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    
    await act(async () => {
      await result.current.setLocale('es');
    });

    expect(result.current.locale).toBe('es');
    expect(result.current.i18n.getCurrentLocale()).toBe('es');
  });

  it('should handle namespaces in useTranslation', () => {
    const { result } = renderHook(() => useTranslation('auth'), { wrapper });
    
    expect(result.current.t('login')).toBe('auth.login');
  });
});
