# The Core Recipe (Runtime API)

The `@i18n-bakery/core` package provides the fundamental ingredients for translation management.

## Preheat the Oven (Initialization)

Initialize the i18n service with your configuration.

```typescript
import { initI18n } from '@i18n-bakery/core';

const i18n = initI18n({
  locale: 'en',
  fallbackLocale: 'es',
  loader: {
    load: async (locale, ns) => {
      // Fetch your ingredients (JSON files) here
      return import(`./locales/${locale}/${ns}.json`);
    }
  }
});
```

## Taste Test (Translating Text)

Use the `t` function to serve translated text.

```typescript
// Basic serving
i18n.t('common.hello'); // "Hello World"

// With garnish (variables)
i18n.t('common.welcome', 'Welcome {{name}}', { name: 'Alice' });

// With emergency rations (fallback text)
i18n.t('missing.key', 'Default Text');
```

## Switch Flavors (Changing Locale)

Switch the active locale dynamically.

```typescript
await i18n.setLocale('es');
```

## Stocking Manually (Adding Translations)

Sometimes you need to add ingredients by hand.

```typescript
i18n.addTranslations('en', 'common', {
  hello: 'Hello World'
});
```
