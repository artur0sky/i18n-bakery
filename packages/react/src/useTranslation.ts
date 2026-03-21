import { useState, useEffect } from 'react';
import { useI18n } from './I18nProvider';

export function useTranslation(namespace?: string) {
  const { i18n, locale } = useI18n();
  const [, setTick] = useState(0);

  useEffect(() => {
    return i18n.subscribe(() => {
      setTick(t => t + 1);
    });
  }, [i18n]);

  const t = (key: string, defaultText?: string, vars?: Record<string, any>) => {
    // If namespace is provided at hook level, prepend it if key doesn't have one
    let finalKey = key;
    if (namespace && !key.includes('.') && !key.includes(':')) {
       // Check for both separators to be safe, though core handles it.
       // If the key already has a namespace (e.g. 'other:key'), don't prepend.
       finalKey = `${namespace}.${key}`;
    }
    return i18n.t(finalKey, defaultText, vars);
  };

  return { t, i18n };
}
