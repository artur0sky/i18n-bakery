import { useI18n } from './I18nProvider';
import { useState, useEffect } from 'react';

export function useT(namespace?: string) {
  const { i18n, locale } = useI18n();
  // Force re-render when locale changes is handled by the context providing a new locale value
  // But we might want to subscribe to store changes if we had a reactive store.
  // For now, relying on the provider's locale state is enough to trigger re-renders.

  const t = (key: string, defaultText?: string, vars?: Record<string, any>) => {
    // If namespace is provided at hook level, prepend it if key doesn't have one
    let finalKey = key;
    if (namespace && !key.includes('.')) {
      finalKey = `${namespace}.${key}`;
    }
    return i18n.t(finalKey, defaultText, vars);
  };

  return { t, locale };
}
