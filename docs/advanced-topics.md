# Secret Ingredients (Advanced Topics)

## Auto-Save (Self-Rising Dough)

During development, you can configure `i18n-bakery` to automatically save missing keys to your JSON files. This makes the dough rise on its own!

```typescript
import { JSONFileSaver } from '@i18n-bakery/core/adapters/node'; // Node.js only

const i18n = initI18n({
  // ...
  saveMissing: process.env.NODE_ENV === 'development',
  saver: new JSONFileSaver('./locales')
});
```

## Custom Loaders (Special Delivery)

You can implement your own delivery strategy by matching the `Loader` interface.

```typescript
const myLoader = {
  load: async (locale, ns) => {
    const response = await fetch(`/api/translations/${locale}/${ns}`);
    return response.json();
  }
};
```

## Namespaces (Bread Types)

Organize your translations into namespaces (e.g., `common`, `auth`, `dashboard`) to load only what you need. Think of them as different types of bread in your bakery.

- `t('common.hello')` -> Loads `common` bread.
- `t('auth:login')` -> Loads `auth` bread (i18next style).
