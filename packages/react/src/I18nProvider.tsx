import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { I18nService, I18nConfig, initI18n, getI18n } from '@i18n-bakery/core';

interface I18nContextType {
  i18n: I18nService;
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export interface I18nProviderProps {
  config: I18nConfig;
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ config, children }) => {
  // Initialize singleton if not already done, or use existing
  const i18n = useMemo(() => {
    try {
      return getI18n();
    } catch {
      return initI18n(config);
    }
  }, [config]);

  const [locale, setLocaleState] = useState(i18n.getCurrentLocale());
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = async (newLocale: string) => {
    setIsLoading(true);
    try {
      await i18n.setLocale(newLocale);
      setLocaleState(newLocale);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    i18n,
    locale,
    setLocale,
    isLoading
  }), [i18n, locale, isLoading]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
