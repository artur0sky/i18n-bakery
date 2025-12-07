import { useI18n } from './I18nProvider';

export function useTranslation(namespace?: string) {
  const { i18n, locale } = useI18n();
  // Force re-render when locale changes is handled by the context providing a new locale value
  // But we might want to subscribe to store changes if we had a reactive store.
  // For now, relying on the provider's locale state is enough to trigger re-renders.

  const t = (key: string, defaultTextOrVars?: string | Record<string, any>, options?: Record<string, any>) => {
    // If namespace is provided at hook level, prepend it if key doesn't have one
    let finalKey = key;
    if (namespace && !key.includes('.') && !key.includes(':')) {
       // Check for both separators to be safe, though core handles it.
       // If the key already has a namespace (e.g. 'other:key'), don't prepend.
       finalKey = `${namespace}:${key}`;
    }
    return i18n.t(finalKey, defaultTextOrVars, options);
  };

  const ret = [t, i18n, true] as const;
  (ret as any).t = t;
  (ret as any).i18n = i18n;
  (ret as any).ready = true;

  return ret as unknown as {
    t: typeof t;
    i18n: typeof i18n;
    ready: boolean;
  } & [typeof t, typeof i18n, boolean];
}
