# The React Glaze 🍩

The `@i18n-bakery/react` package adds the finishing touch to your React applications. It provides sweet hooks and a warm provider to keep your UI in sync with your translations.

## 📋 Ingredients

- **I18nProvider**: Wraps your app to keep it warm and connected to the bakery.
- **useTranslation**: A hook to fetch fresh translations directly in your components.
- **useI18n**: Access the full power of the bakery (change locale, etc.).

## 👩‍🍳 Usage

```tsx
import { I18nProvider, useTranslation } from '@i18n-bakery/react';

function App() {
  return (
    <I18nProvider config={...}>
      <Welcome />
    </I18nProvider>
  );
}

function Welcome() {
  const { t } = useTranslation('common');
  return <h1>{t('hello')}</h1>;
}
```

## 📦 Installation

```bash
pnpm add @i18n-bakery/react
```
