# The Essential Ingredients (Core) 🥯

The `@i18n-bakery/core` package is the heart of the operation. It contains the fundamental runtime logic, the mixing bowl (store), and the master recipes (API) for managing translations in any JavaScript environment.

## 📋 Ingredients

- **I18nService**: The head baker that orchestrates everything.
- **MemoryStore**: A temporary bowl to hold your translations.
- **MustacheFormatter**: For adding flavor (variables) to your text.
- **TranslationSaver**: A port for saving missing ingredients automatically.

## 👩‍🍳 Usage

```typescript
import { initI18n } from '@i18n-bakery/core';

// 1. Preheat the oven
const i18n = initI18n({
  locale: 'en',
  fallbackLocale: 'es',
  loader: {
    load: async (locale, ns) => import(`./locales/${locale}/${ns}.json`)
  }
});

// 2. Serve a slice
const text = i18n.t('common.hello', 'Hello World');
```

## 📦 Installation

```bash
pnpm add @i18n-bakery/core
```
