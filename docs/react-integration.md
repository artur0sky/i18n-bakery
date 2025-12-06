# The React Glaze (Integration)

The `@i18n-bakery/react` package adds the finishing touch to your React applications with hooks and providers.

## The Warm Wrapper (I18nProvider)

Wrap your application with the `I18nProvider` to keep it warm and connected to the bakery.

```tsx
import { I18nProvider } from '@i18n-bakery/react';
import { i18nConfig } from './i18n.config';

function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <YourApp />
    </I18nProvider>
  );
}
```

## useT Hook (Fresh Slices)

Use the `useT` hook to fetch fresh translations directly in your components.

```tsx
import { useT } from '@i18n-bakery/react';

function MyComponent() {
  const { t } = useT('common'); // Optional namespace prefix

  return <h1>{t('hello')}</h1>;
}
```

## useI18n Hook (Master Baker Access)

Access the full i18n instance and locale state.

```tsx
import { useI18n } from '@i18n-bakery/react';

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button onClick={() => setLocale('es')}>
      Switch to Spanish
    </button>
  );
}
```
