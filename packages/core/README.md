# 🥖 @i18n-bakery/core

> **"The Head Chef"** — the framework-independent runtime that manages the current locale, translation lookup, interpolation, pluralization, and plugins. Source scanning and file-based baking live in [`@i18n-bakery/baker`](../baker).

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/core.svg)](https://www.npmjs.com/package/@i18n-bakery/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add @i18n-bakery/core
```

---

## 🚀 Quick Start (Preheating the Oven)

### Basic Setup (The Starter Recipe)

```typescript
import { addTranslations, initI18n, t } from '@i18n-bakery/core'

initI18n({
  locale: 'en',
  fallbackLocale: 'en',
  defaultNamespace: 'common',
})

addTranslations('en', 'common', {
  welcome: 'Hello, {{name}}!',
  apple: 'apple',
  apple_plural: 'apples',
  apple_0: 'no apples',
})

t('welcome', { name: 'Baker' }) // → 'Hello, Baker!'
t('apple', { count: 0 }) // → 'no apples'
```

`initI18n` creates the shared service instance. Call it before using the top-level `t`, `setLocale`, `getI18n`, or `addTranslations` functions.

The in-memory store treats locale, namespace, and translation keys as data,
including prototype-named keys. Nested lookup only follows own properties.

### With Auto-Save (Self-Rising Dough)

Core exposes the `TranslationSaver` interface and a `ConsoleSaver`. File-based savers are provided by Baker.

```typescript
import { ConsoleSaver, initI18n, t } from '@i18n-bakery/core'

initI18n({
  locale: 'en',
  saveMissing: true,
  saver: new ConsoleSaver(),
})

t('common:welcome', 'Welcome!') // Logs the missing entry through ConsoleSaver
```

---

## 🎯 Core Features (The Menu)

### 1. Translation Engine (The Oven)

Translate keys, use a fallback value, and interpolate Mustache-style variables:

```typescript
t('home:title', 'Welcome')
t('greeting', 'Hello, {{name}}!', { name: 'World' })
t('common:greeting', 'Hello, {{user.name}}!', {
  user: { name: 'Baker' },
})
```

The default formatter uses `{{variable}}` placeholders. Substituted values are HTML-escaped. If a translation is missing, Core returns the provided default value or the key and can request the namespace from a configured loader.

### 2. Pluralization (Counting Loaves)

The default suffix strategy supports exact-count keys and the singular/plural forms:

#### Suffix Strategy (i18next-Style)

```typescript
addTranslations('en', 'common', {
  apple: 'apple',
  apple_plural: 'apples',
  apple_0: 'no apples',
})

t('common:apple', { count: 0 }) // → 'no apples'
t('common:apple', { count: 1 }) // → 'apple'
t('common:apple', { count: 5 }) // → 'apples'
```

#### CLDR Categories (The Locale's Own Recipe)

Set `pluralizationStrategy: 'cldr'` to use the categories returned by the runtime's `Intl.PluralRules`, such as `zero`, `one`, `two`, `few`, `many`, and `other`.

```typescript
initI18n({ locale: 'ar', pluralizationStrategy: 'cldr' })
addTranslations('ar', 'common', {
  apple_zero: 'لا توجد تفاحات',
  apple_one: 'تفاحة واحدة',
  apple_two: 'تفاحتان',
  apple_few: '{{count}} تفاحات',
  apple_many: '{{count}} تفاحة',
  apple_other: '{{count}} تفاحة',
})

t('common:apple', { count: 2 }) // Uses the 'two' category
```

### 3. ICU MessageFormat (The Artisan Touch)

Set `messageFormat: 'icu'` to use the built-in formatter's `plural`, `select`, `selectordinal`, and simple variable patterns:

```typescript
initI18n({ locale: 'en', messageFormat: 'icu' })

t('cart:items', '{count, plural, =0 {no items} one {# item} other {# items}}', {
  count: 3,
}) // → '3 items'
```

The formatter implements a supported subset of ICU patterns, not the complete ICU MessageFormat specification. Ordinal selection uses simplified English rules and falls back to cardinal rules for other locales.

```typescript
t('notification:body', '{gender, select, male {He} female {She} other {They}} liked your post', {
  gender: 'female',
}) // → 'She liked your post'

t('ranking:place', 'You finished {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}', {
  place: 1,
}) // → 'You finished 1st' in English
```

### 4. Plugin System (Custom Recipes)

Register plugins in `I18nConfig.plugins`:

```typescript
import {
  CapitalizePlugin,
  initI18n,
  NumberFormatPlugin,
} from '@i18n-bakery/core'

initI18n({
  locale: 'en-US',
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
})
```

`NumberFormatPlugin` supports currency, number, percent, and compact formatting. Percent inputs are whole percentages (`25` formats as `25%`). `CapitalizePlugin` recognizes `_upper`, `_lower`, `_capitalize`, and `_title` key suffixes.

```typescript
t('price', 'Total: {amount|currency:USD}', { amount: 1234.56 })
t('views', '{count|compact} views', { count: 1500000 })
t('discount', 'Save {percent|percent}!', { percent: 25 })
```

```typescript
addTranslations('en', 'common', { greeting: 'hello world' })
t('common:greeting_upper') // → 'HELLO WORLD'
t('common:greeting_title') // → 'Hello World'
```

### 5. Advanced Key Parsing (The Filing System)

Without a colon, a key uses `defaultNamespace`; if none is configured, the current locale is the namespace. The last colon separates namespace from key:

```typescript
t('home:title') // namespace 'home', key 'title'
t('app:features:orders:meal.title')
// namespace 'app/features/orders', key 'meal.title'
t('orders:meal.title') // namespace 'orders', key 'meal.title'
```

### 6. Translation Variants (Multiple Recipes)

Runtime translation lookup does not create variant records. The `TranslationFileManager` in Baker manages entries with variable-signature variants; see [`@i18n-bakery/baker`](../baker).

Those variant records are file-management metadata; Core's `t()` API performs ordinary translation lookup and interpolation.

### 7. File Structure Options (Nested or Flat)

Core keeps loaded translations in memory and does not provide `JSONFileSaver`. JSON/TOML file writing, nested/flat output, and extraction are handled by Baker.

```typescript
import { JSONFileSaver } from '@i18n-bakery/baker'

const nestedSaver = new JSONFileSaver('./locales', 'nested')
const flatSaver = new JSONFileSaver('./locales', 'flat')
await nestedSaver.save('en', 'common', 'home.title', 'Welcome')
```
---

## 🏗️ Architecture (Kitchen Layout)

Core has no third-party runtime dependencies and focuses on the translation runtime.

### Domain Layer (Interfaces/Ports)

Exports the configuration and contracts for loaders, savers, formatters, stores, plugins, and plural resolvers.

The loader contract is `load(locale, namespace): Promise<TranslationMap | null>`. A saver implements `save(locale, namespace, key, value)`.

### Adapters Layer (Implementations)

- `MemoryStore` — in-memory translation storage.
- `MustacheFormatter` and `ICUMessageFormatter` — interpolation.
- `SuffixPluralResolver` and `CLDRPluralResolver` — plural selection.
- `ConsoleSaver` and `TOMLLoader` — built-in saver and loader adapters.
- `HttpBackend` — fetch-based loader with optional manifest and decryption support.
- `Aes256GcmCipher` — AES-GCM encryption/decryption adapter.
- `NumberFormatPlugin` and `CapitalizePlugin` — built-in plugins.
- Core does not export a JSON file saver or source extractor; those adapters belong to Baker.

### Use Cases Layer (Business Logic)

- `I18nService` — lookup, locale changes, loading, interpolation, and plugin hooks.

---

## 📚 API Reference (Recipe Cards)

### Initialization

#### `initI18n(config: I18nConfig): I18nService`

Important configuration fields include:

- `locale` (required), `fallbackLocale`, and `defaultNamespace`.
- `loader` with a `load(locale, namespace)` method returning a translation map or `null`.
- `saver` and `saveMissing` to handle missing keys.
- `pluralizationStrategy: 'suffix' | 'cldr'`.
- `messageFormat: 'mustache' | 'icu'`.
- `plugins` for plugin instances.

```typescript
import { ConsoleSaver } from '@i18n-bakery/core'
import type { I18nConfig } from '@i18n-bakery/core'

const config: I18nConfig = {
  locale: 'en',
  fallbackLocale: 'en',
  defaultNamespace: 'common',
  loader: {
    async load(locale, namespace) {
      if (locale === 'en' && namespace === 'common') {
        return { greeting: 'Hello!' }
      }
      return null
    },
  },
  saver: new ConsoleSaver(),
  saveMissing: true,
  pluralizationStrategy: 'suffix',
  messageFormat: 'mustache',
}
```

### Translation

#### `t(key, defaultTextOrVars?, options?): string`

The second argument can be a default string or a variables object; an optional third argument supplies variables when the second argument is a string.

```typescript
t('common:greeting', 'Hello, {{name}}!', { name: 'Baker' })
t('common:apple', { count: 2 })
```

### Locale Management

#### `setLocale(locale: string): Promise<void>`

Changes the active locale and notifies subscribers.

```typescript
await setLocale('es')
const currentLocale = getI18n().getCurrentLocale()
```

#### `getI18n(): I18nService`

Returns the initialized service instance.

### Manual Translation Management

#### `addTranslations(locale, namespace, data)`

Adds a translation map to the in-memory store and notifies subscribers.

```typescript
addTranslations('en', 'common', {
  hello: 'Hello',
  goodbye: 'Goodbye',
})
```

---

## 🔌 Built-in Plugins (Special Ingredients)

### NumberFormatPlugin

Uses `Intl.NumberFormat` for currency, number, percent, and compact values. A percent input of `25` is formatted as 25%, while `0.25` is formatted as 0.25%.

```typescript
t('price', 'Price: {amount|currency:USD}', { amount: 1234.56 })
t('views', '{count|compact} views', { count: 1500000 })
t('discount', 'Save {percent|percent}', { percent: 25 })
```

### CapitalizePlugin

Transforms a base key when requested with `_upper`, `_lower`, `_capitalize`, or `_title`.

```typescript
addTranslations('en', 'common', { greeting: 'hello world' })
t('common:greeting_upper') // → 'HELLO WORLD'
t('common:greeting_title') // → 'Hello World'
```

---

## 🔧 Creating Custom Plugins (Your Own Recipes)

Implement the exported `Plugin` interface and register the instance through `I18nConfig.plugins`. Synchronous `beforeTranslate` and `afterTranslate` hooks can modify the key or result.

---

## 🧪 Testing (Quality Control)

From the workspace root:

```bash
pnpm --filter @i18n-bakery/core test
pnpm test
```

The full workspace currently has 316 tests across 33 test files. Coverage is not maintained as an aggregate metric.

---

## 📖 Examples (Sample Recipes)

### Node.js Backend

The loader is an object implementing `load`, not a callback:

```typescript
initI18n({
  locale: 'en',
  loader: {
    async load(locale, namespace) {
      if (locale === 'en' && namespace === 'common') {
        return { greeting: 'Hello from the API!' }
      }
      return null
    },
  },
})
```

### With TypeScript

```typescript
import { initI18n } from '@i18n-bakery/core'
import type { I18nConfig } from '@i18n-bakery/core'

const config: I18nConfig = {
  locale: 'en',
  fallbackLocale: 'en',
  pluralizationStrategy: 'cldr',
}

initI18n(config)
```

---

## 🔗 Related Packages (Kitchen Staff)

- **[@i18n-bakery/react](../react)** — React bindings with hooks and a provider.
- **[@i18n-bakery/baker](../baker)** — extraction, locale files, and compilation.
- **[@i18n-bakery/cli](../cli)** — command-line tools.

---

## 📜 License

MIT © Arturo Sáenz

---

## 🙏 Support

- 📖 [Main Documentation](../../README.md)
- 🐛 [Issue Tracker](https://github.com/artur0sky/i18n-bakery/issues)
- 💬 [Discussions](https://github.com/artur0sky/i18n-bakery/discussions)

---

<div align="center">

**🥖 The foundation of your internationalization bakery**

_Made with 🍩 and Clean Architecture_

</div>
