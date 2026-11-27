# 🥯 i18n-bakery

> _"In the art of translation, as in baking, the secret ingredient is always love... and a pinch of automation."_

**Bake your translations like a pro.** Fresh, type-safe internationalization that rises to the occasion. Because life's too short for stale i18n solutions.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/core.svg)](https://www.npmjs.com/package/@i18n-bakery/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-316%20passing-brightgreen.svg)](https://github.com/artur0sky/i18n-bakery)

---

## 🌟 Why i18n-bakery?

Like a master baker who knows that **the best bread comes from the finest ingredients and the right technique**, i18n-bakery combines:

- 🥖 **Zero Dependencies** - Pure, artisanal code (no preservatives!)
- 🍞 **Auto-Baking** - Translations rise automatically as you code
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
import { initI18n } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  fallbackLocale: "en",
  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});
```

### 2. Start Translating (The First Batch)

```typescript
import { t } from "@i18n-bakery/core";

// Simple translation
t("home.welcome", "Welcome to our bakery!");

// With variables (adding flavor)
t("order.total", "Total: {{amount}}", { amount: "$42.00" });

// With pluralization (counting loaves)
t("cart.items", { count: 5 }); // → "5 items"
```

### 3. React Integration (Serving Fresh)

```tsx
import { I18nProvider, useTranslation } from "@i18n-bakery/react";

function App() {
  return (
    <I18nProvider locale="en">
      <HomePage />
    </I18nProvider>
  );
}

function HomePage() {
  const t = useTranslation();

  return (
    <div>
      <h1>{t("home.title", "Welcome!")}</h1>
      <p>{t("home.subtitle", "Fresh translations daily")}</p>
    </div>
  );
}
```

---

## 🎯 Core Features (The Menu)

### 🥖 Auto-Baking (Self-Rising Translations)

> _"The dough that kneads itself is the baker's dream."_

When you use a translation key that doesn't exist, i18n-bakery automatically:

1. Creates the translation file
2. Adds the key with your default text
3. Formats it beautifully (nested or flat structure)

```typescript
// First time using this key
t('profile.greeting', 'Hello, {{name}}!', { name: 'Baker' });

// Automatically creates: locales/en/profile.json
{
  "greeting": "Hello, {{name}}!"
}
```

### 🍞 Pluralization (Counting Loaves)

Support for both i18next-style and CLDR pluralization:

```typescript
// i18next style (suffix)
t("apple", { count: 0 }); // → "no apples" (from apple_0)
t("apple", { count: 1 }); // → "apple"
t("apple", { count: 5 }); // → "apples" (from apple_plural)

// CLDR style (100+ languages)
initI18n({ pluralizationStrategy: "cldr" });
t("apple", { count: 2 }); // → Uses CLDR rules for your locale
```

### 🥐 ICU MessageFormat (The Artisan Touch)

For complex translations that need finesse:

```typescript
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
import { NumberFormatPlugin, CapitalizePlugin } from "@i18n-bakery/core";

initI18n({
  locale: "en-US",
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
});

// Number formatting
t("price", "Total: {amount|currency:USD}", { amount: 1234.56 });
// → "Total: $1,234.56"

// Text transformations
t("greeting_upper"); // → "HELLO WORLD"
t("greeting_title"); // → "Hello World"
```

### 🧁 File Structure Flexibility (Nested or Flat)

> _"Some prefer their bread sliced, others whole. We serve both."_

```typescript
// Nested structure (default) - like a layered pastry
{
  "home": {
    "title": "Welcome",
    "subtitle": "Fresh daily"
  }
}

// Flat structure - like flatbread
new JSONFileSaver('./locales', 'flat');
{
  "home.title": "Welcome",
  "home.subtitle": "Fresh daily"
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

- 🔍 Finds all `t()` calls in your code
- 📝 Extracts keys and default values
- 📁 Organizes by namespace
- ✨ Creates/updates JSON files
- 🚫 Never overwrites existing translations

### Bake (Compile & Optimize)

Prepare translations for production:

```bash
pnpm exec i18n-bakery bake
```

**What it does:**

- ✅ Validates all translation files
- 🗜️ Minifies for production
- 🧹 Removes orphaned keys
- 📊 Generates reports

---

## 🏗️ Architecture (The Kitchen Layout)

i18n-bakery follows **Clean Architecture** principles - each layer has its purpose, like stations in a professional kitchen:

### Domain Layer (The Recipe Book)

Pure interfaces that define what we can do:

- `KeyParser` - Understanding translation keys
- `VariableDetector` - Finding placeholders
- `PluralResolver` - Handling counts
- `Plugin` - Extending functionality

### Adapters Layer (The Tools)

Concrete implementations:

- `DefaultKeyParser` - Parses `namespace:file.property` syntax
- `ICUMessageFormatter` - Handles ICU syntax
- `CLDRPluralResolver` - Uses `Intl.PluralRules`
- `JSONFileWriter` - Manages translation files

### Use Cases Layer (The Chef)

Orchestrates everything:

- `I18nService` - Main translation engine
- `TranslationFileManager` - File operations

> _"Good architecture, like good bread, has structure but remains flexible."_

---

## 📚 Advanced Features

### Hierarchical Keys (The Filing System)

Organize translations with colons and dots:

```typescript
// Simple: namespace.key
t("home.title", "Welcome");
// → locales/en/home.json → { "title": "Welcome" }

// Nested: namespace:directory.key
t("shop:bread.title", "Sourdough");
// → locales/en/shop/bread.json → { "title": "Sourdough" }

// Deep nesting: app:features:shop:bread.component.title
t("app:features:shop:bread.component.title", "Order Sourdough");
// → locales/en/app/features/shop/bread/component.json
```

### Translation Variants (Multiple Recipes)

Same key, different variable combinations:

```typescript
// Variant 1: Just the bread
t('bread.title', '{{bread}}', { bread: 'Croissant' });

// Variant 2: Bread with price
t('bread.title', '{{bread}} - ${{price}}', { bread: 'Croissant', price: 4.50 });

// Stored as:
{
  "title": {
    "variants": {
      "bread": { "value": "{{bread}}", "variables": ["bread"] },
      "bread_price": { "value": "{{bread}} - ${{price}}", "variables": ["bread", "price"] }
    }
  }
}
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

### 🔄 Coming Soon (v1.1.0 - v1.5.0)

- 🔜 Context support (`{ context: 'male' }`)
- 🔜 Language detection
- 🔜 HTTP backend
- 🔜 Event system
- 🔜 Nesting translations
- 🔜 Return objects

See [WORKPLAN.md](./WORKPLAN.md) for planned capabilities. No release dates are committed.

See [I18NEXT_COMPARISON.md](./docs/I18NEXT_COMPARISON.md) for detailed comparison.

---

## 📖 Examples (Sample Recipes)

### Basic React App

```tsx
import { initI18n, t } from "@i18n-bakery/core";
import { I18nProvider, useTranslation } from "@i18n-bakery/react";

// Initialize
initI18n({
  locale: "en",
  fallbackLocale: "en",
  saveMissing: true, // Auto-bake missing translations
  fileStructure: "nested", // or 'flat'
});

// Component
function ShoppingCart() {
  const t = useTranslation();
  const itemCount = 5;

  return (
    <div>
      <h2>{t("basket.title", "Order Basket")}</h2>
      <p>{t("basket.items", { count: itemCount })}</p>
      <button>{t("basket.checkout", "Checkout")}</button>
    </div>
  );
}
```

### With Plugins

```typescript
import {
  initI18n,
  NumberFormatPlugin,
  CapitalizePlugin,
} from "@i18n-bakery/core";

initI18n({
  locale: "en-US",
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
});

// Use number formatting
t("total", "Total: {amount|currency:USD}", { amount: 1234.56 });
// → "Total: $1,234.56"

// Use text transformations
t("title_upper"); // → "WELCOME TO OUR BAKERY"
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

---

## 🗂️ Project Structure (The Pantry)

```
i18n-bakery/
├── packages/
│   ├── core/              # 🥖 The main bakery
│   │   ├── src/
│   │   │   ├── domain/    # Interfaces (recipes)
│   │   │   ├── adapters/  # Implementations (tools)
│   │   │   ├── use-cases/ # Business logic (chef)
│   │   │   └── plugins/   # Extensions (special ingredients)
│   │   └── test/          # Quality control
│   ├── react/             # ⚛️ React bindings
│   └── cli/               # 🔧 Command-line tools
├── examples/
│   └── react-basic/       # 📚 Sample recipes
├── docs/                  # 📖 The cookbook
└── locales/               # 🌍 Translation storage
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
