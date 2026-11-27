# 🥯 i18n-bakery

> _"In the art of translation, as in baking, the secret ingredient is always love... and a pinch of automation."_

**Bake your translations like a pro.** Fresh, type-safe internationalization that rises to the occasion. Because life's too short for stale i18n solutions.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/core.svg)](https://www.npmjs.com/package/@i18n-bakery/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-316%20passing-brightgreen.svg)](https://github.com/artur0sky/i18n-bakery)

---

## 🌟 Why i18n-bakery?

Like a master baker who knows that **the best bread comes from the finest ingredients and the right technique**, i18n-bakery combines:

- 🥖 **Lean Core** - The framework-independent runtime has no third-party runtime dependencies.
- 🍞 **Key Extraction** - The Baker scans source code and adds missing keys to locale files.
- 🥐 **Type-Safe** - TypeScript support baked right in
- 🥨 **Plugin System** - Extend your bakery with custom recipes
- 🧁 **React Ready** - Hooks and providers, fresh from the oven
- 🥯 **i18next Compatible** - Supports common i18next patterns; see the [compatibility matrix](./docs/I18NEXT_COMPARISON.md)

> _"A translation without context is like bread without salt - technically edible, but missing something essential."_

---

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add @i18n-bakery/core @i18n-bakery/react
pnpm add -D @i18n-bakery/cli
```

---

## 🚀 Quick Start (Preheating the Oven)

### 1. Initialize Your Bakery

```typescript
import { addTranslations, initI18n } from '@i18n-bakery/core'

initI18n({
  locale: 'en',
  fallbackLocale: 'en',
  defaultNamespace: 'common',
})

addTranslations('en', 'common', {
  welcome: 'Welcome to our bakery!',
  total: 'Total: {{amount}}',
  items: '{{count}} items',
})
```

### 2. Start Translating (The First Batch)

```typescript
import { t } from '@i18n-bakery/core'

// Simple translation
t('welcome')

// With variables (adding flavor)
t('total', { amount: '$42.00' })

// With pluralization (counting loaves)
t('items', { count: 5 }) // → '5 items'
```

### 3. React Integration (Serving Fresh)

```tsx
import { I18nProvider, useTranslation } from '@i18n-bakery/react'

const i18nConfig = {
  locale: 'en',
  defaultNamespace: 'common',
}

function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <HomePage />
    </I18nProvider>
  )
}

function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('home.title', 'Welcome!')}</h1>
      <p>{t('home.subtitle', 'Fresh translations daily')}</p>
    </div>
  )
}
```

---

## 🎯 Core Features (The Menu)

### 🥖 Key Extraction (The Baker's Work)

> _"Good mise en place starts with knowing which ingredients the recipe needs."_

At development or build time, Baker scans source files for statically written translation calls. The CLI can then:

1. Group discovered keys by namespace
2. Create new locale entries using literal defaults when available
3. Preserve existing translations while adding absent keys

```bash
pnpm exec i18n-bakery batter src --locale en
```

Extraction is an explicit Baker/CLI workflow; it does not happen automatically at runtime.

### 🍞 Pluralization (Counting Loaves)

Support for both i18next-style and CLDR pluralization:

```typescript
initI18n({ locale: 'en', defaultNamespace: 'common' })
addTranslations('en', 'common', {
  apple: 'apple',
  apple_plural: 'apples',
  apple_0: 'no apples',
})

// Suffix style
t('common:apple', { count: 0 }) // → 'no apples' (from apple_0)
t('common:apple', { count: 1 }) // → 'apple'
t('common:apple', { count: 5 }) // → 'apples' (from apple_plural)

// CLDR style (categories come from the current locale)
initI18n({ locale: 'ar', defaultNamespace: 'common', pluralizationStrategy: 'cldr' })
addTranslations('ar', 'common', {
  apple_zero: 'لا توجد تفاحات',
  apple_one: 'تفاحة واحدة',
  apple_two: 'تفاحتان',
  apple_few: '{{count}} تفاحات',
  apple_many: '{{count}} تفاحة',
  apple_other: '{{count}} تفاحة',
})
t('common:apple', { count: 2 }) // → 'تفاحتان'
```

### 🥐 ICU MessageFormat (The Artisan Touch)

For complex translations that need finesse:

```typescript
initI18n({ locale: 'en', messageFormat: 'icu' })

// Plural with exact matches
t("cart.items", "{count, plural, =0 {no items} one {# item} other {# items}}", {
  count: 3,
});

// Gender selection
t(
  "notification",
  "{gender, select, male {He} female {She} other {They}} liked your post",
  { gender: "female" }
);

// Ordinal numbers
t(
  "ranking",
  "You finished {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}",
  { place: 1 }
);
```

### 🥨 Plugin System (Custom Recipes)

Extend your bakery with plugins:

```typescript
import {
  addTranslations,
  initI18n,
  t,
  NumberFormatPlugin,
  CapitalizePlugin,
} from '@i18n-bakery/core'

initI18n({
  locale: 'en-US',
  defaultNamespace: 'common',
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
})
addTranslations('en-US', 'common', { greeting: 'hello world' })

// Number formatting
t('price', 'Total: {amount|currency:USD}', { amount: 1234.56 })
// → 'Total: $1,234.56'

// Text transformations
t('greeting_upper') // → 'HELLO WORLD'
t('greeting_title') // → 'Hello World'
```

### 🧁 File Structure Flexibility (Nested or Flat)

> _"Some prefer their bread sliced, others whole. We serve both."_

#### Nested dough (the default)

```typescript
import { JSONFileSaver } from '@i18n-bakery/baker'

const nestedSaver = new JSONFileSaver('./locales', 'nested')
await nestedSaver.save('en', 'common', 'home.title', 'Welcome')
```

`locales/en/common.json`:

```json
{
  "home": {
    "title": "Welcome"
  }
}
```

#### Flatbread

```typescript
import { JSONFileSaver } from '@i18n-bakery/baker'

const flatSaver = new JSONFileSaver('./locales', 'flat')
await flatSaver.save('en', 'common', 'home.title', 'Welcome')
```

`locales/en/common.json`:

```json
{
  "home.title": "Welcome"
}
```

---

## 🛠️ CLI Tools (The Baker's Toolkit)

### Batter (Extract & Mix)

Scan your codebase and extract translation keys:

```bash
pnpm exec i18n-bakery batter src --locale en
```

**What it does:**

- 🔍 Finds statically written `t()` calls and `useTranslation()` namespaces
- 📝 Extracts keys and literal default values when present
- 📁 Organizes by namespace
- ✨ Creates/updates JSON files
- 🚫 Never overwrites existing translations

### Bake (Compile & Optimize)

Prepare translations for production:

```bash
pnpm exec i18n-bakery bake
```

**What it does:**

- ✅ Reads JSON or TOML locale files and writes JSON bundles
- 🗜️ Can minify bundles and split them by namespace
- 🔐 Supports optional AES-256-GCM encryption
- 📊 Can add content hashes to filenames and generate a manifest

---

## 🏗️ Architecture (The Kitchen Layout)

i18n-bakery follows **Clean Architecture** principles - each layer has its purpose, like stations in a professional kitchen:

### Domain Layer (The Recipe Book)

Core interfaces and contracts define the runtime ingredients:

- `Loader` and `TranslationSaver` - Loading namespaces and saving missing keys
- `Formatter` and `Store` - Interpolation and in-memory translations
- `PluralResolver` - Handling counts
- `Plugin` - Extending functionality

### Adapters Layer (The Tools)

Core adapters provide runtime behavior; file and source tools live in Baker:

- `MustacheFormatter` and `ICUMessageFormatter` - Handle message interpolation
- `CLDRPluralResolver` - Uses `Intl.PluralRules`
- `HttpBackend` - Loads translations through `fetch`
- `JSONFileSaver` and `TOMLFileSaver` - Write locale files in Baker

### Use Cases Layer (The Chef)

Orchestrates everything:

- `I18nService` - Main translation engine
- Baker's `ExtractionUseCase`, `BakingManager`, and `TranslationFileManager` - Build-time file operations

> _"Good architecture, like good bread, has structure but remains flexible."_

---

## 📚 Advanced Features

### Hierarchical Keys (The Filing System)

Organize translations with colons and dots:

```typescript
// Simple: namespace:key
t('home:title', 'Welcome')
// → namespace 'home', key 'title'

// Dotted keys address nested properties within a namespace
t('shop:bread.title', 'Sourdough')
// → namespace 'shop', key 'bread.title'

// Deep nesting: app:features:shop:bread.component.title
t('app:features:shop:bread.component.title', 'Order Sourdough')
// → namespace 'app/features/shop', key 'bread.component.title'
```

### Translation Variants (Multiple Recipes)

The Baker's `TranslationFileManager` can manage file entries with different variable signatures. Runtime `t()` performs normal lookup and interpolation; it does not create variant records.

```typescript
// Runtime translation with interpolation
t('bread:title', '{{bread}}', { bread: 'Croissant' })
```

### Custom Plugins (Your Secret Ingredient)

Create your own plugins:

```typescript
import { Plugin, PluginMetadata, PluginContext } from "@i18n-bakery/core";

class MyPlugin implements Plugin {
  readonly metadata: PluginMetadata = {
    name: "my-custom-plugin",
    version: "1.0.0",
    type: "processor",
  };

  config = { enabled: true };

  afterTranslate(context: PluginContext): string | void {
    // Add your custom logic
    return context.result?.toUpperCase();
  }
}
```

---

## 🌍 i18next Compatibility

> _"We honor the classics while baking something new."_

Compatibility is partial and is tracked feature-by-feature in the [comparison matrix](./docs/I18NEXT_COMPARISON.md).

### ✅ What Works Today

- ✅ Core translation API (`t()`)
- ✅ Namespaces (`ns:key`)
- ✅ Variable interpolation (`{{var}}`)
- ✅ Pluralization (suffix & CLDR)
- ✅ ICU MessageFormat
- ✅ React hooks (`useTranslation`)
- ✅ Fallback locales
- ✅ Plugin system
- ✅ Number formatting

### 🔄 Planned (No Release Dates Promised)

- 🔜 Context support (`{ context: 'male' }`)
- 🔜 Language detection
- 🔜 Nesting translations
- 🔜 Return objects

See [WORKPLAN.md](./WORKPLAN.md) for planned capabilities. The built-in HTTP backend is already available in Core.

See [I18NEXT_COMPARISON.md](./docs/I18NEXT_COMPARISON.md) for detailed comparison.

---

## 📖 Examples (Sample Recipes)

### Basic React App

```tsx
import { I18nProvider, useTranslation } from '@i18n-bakery/react'

const i18nConfig = {
  locale: 'en',
  fallbackLocale: 'en',
}

function ShoppingCart() {
  const { t } = useTranslation('basket')
  const itemCount = 5

  return (
    <div>
      <h2>{t('title', 'Order Basket')}</h2>
      <p>{t('items', '{{count}} items', { count: itemCount })}</p>
      <button>{t('checkout', 'Checkout')}</button>
    </div>
  )
}

function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <ShoppingCart />
    </I18nProvider>
  )
}
```

### With Plugins

```typescript
import {
  initI18n,
  NumberFormatPlugin,
  CapitalizePlugin,
  t,
} from '@i18n-bakery/core'

initI18n({
  locale: 'en-US',
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
})

// Use number formatting
t('total', 'Total: {amount|currency:USD}', { amount: 1234.56 })
// → '$1,234.56'

// Use text transformations
t('title_upper') // → 'WELCOME TO OUR BAKERY'
```

---

---

## 👨‍🍳 The Kitchen Staff (Packages)

Meet the specialized team working behind the scenes to serve fresh translations:

### 🧑‍🍳 [Core (@i18n-bakery/core)](./packages/core/README.md)
**The Head Chef.** The mastermind managing logic, recipes (keys), and ensuring consistency across every dish. Framework-agnostic excellence.

### 🥐 [Baker (@i18n-bakery/baker)](./packages/baker/README.md)
**The Pastry Chef.** Precision-obsessed expert dealing with delicate file structures, compiling assets, and optimizing ingredients for the final bake.

### 🍽️ [React (@i18n-bakery/react)](./packages/react/README.md)
**The React Waiter.** Delivers freshly baked translations right to your React components' table. Impeccable service with hooks and context.

### 🔪 [CLI (@i18n-bakery/cli)](./packages/cli/README.md)
**The Sous-Chef.** Runs the kitchen floor, automating repetitive tasks, organizing extraction pipelines, and ensuring commands are executed flawlessly.

### 🥚 [Poacher (@i18n-bakery/poacher)](./packages/poacher/README.md)
**The Forager.** Ventures into the wild (legacy code) to recover valuable ingredients (keys) and bring them back to the safety of the bakery. Use this to migrate from i18next!

### 🍽️ [Tray (@i18n-bakery/tray)](./packages/tray/README.md)
**The Silver Tray.** Serves selected extraction, pantry, recipe-update, and baking workflows to MCP-compatible AI clients.

---

## 🗂️ Project Structure (The Pantry)

```
i18n-bakery/
├── packages/
│   ├── core/              # 🥖 Runtime and translation recipes
│   ├── baker/             # 🥯 Extraction, locale files, and baking
│   ├── react/             # ⚛️ React service
│   ├── cli/               # 🔧 The sous-chef's toolkit
│   ├── poacher/           # 🥚 Legacy migration and CSV export
│   └── tray/              # 🍽️ MCP tools for AI clients
├── examples/               # 🍰 Tasting recipes
├── docs/                   # 📖 The cookbook
└── pnpm-workspace.yaml     # 🧺 Shared kitchen setup
```

---

## 🧪 Testing (Quality Control)

We take testing as seriously as a baker takes proofing:

```bash
pnpm test
pnpm build
```

**Current Stats:** 316 tests pass across 33 test files in the six workspace packages. Coverage is not currently measured as an aggregate.

## 🧰 Development Toolchain

- Node.js `>=24.11.0 <25`
- pnpm `10.20.0` with exact dependency versions
- `@types/node` is pinned to the Node 24 major supported by this workspace
- React example: React `19.3.1`, Vite `8.4.0`, TypeScript `7.0.2`
- Library packages: TypeScript `6.0.3` for declaration builds with tsup `9.0.0`; TypeScript `7.0.2` currently fails in that build path.

---

## 🤝 Contributing (Join the Bakery)

> _"Many hands make light work, and better bread."_

We welcome contributions! Whether you're fixing a typo or adding a major feature, every contribution makes the bakery better.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (follow [COMMITS.md](./COMMITS.md))
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [WORKPLAN.md](./WORKPLAN.md) for our roadmap and planned features.

---

## 📜 License

MIT © Arturo Sáenz

> _"Like a good recipe, this code is meant to be shared."_

---

## 🙏 Acknowledgments

Inspired by the great work of:

- **i18next** - The industry standard
- **Django's i18n** - Simple and powerful
- **ICU MessageFormat** - Universal standard

Built with love, TypeScript, and a passion for clean architecture.

---

## 📞 Support & Community

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/artur0sky/i18n-bakery/issues)
- 💬 [Discussions](https://github.com/artur0sky/i18n-bakery/discussions)
- 📧 Email: [contacto@artur0sky.com]

---

## 🗺️ Roadmap

Planned capabilities and target versions are listed in [WORKPLAN.md](./WORKPLAN.md). Release dates are not committed.

---

<div align="center">

### 🥯 _"Baking the world a better place, one translation at a time."_

**Made with 🍩 and a lot of ☕**

[⭐ Star us on GitHub](https://github.com/artur0sky/i18n-bakery) | [📦 View on NPM](https://www.npmjs.com/package/@i18n-bakery/core)

</div>
