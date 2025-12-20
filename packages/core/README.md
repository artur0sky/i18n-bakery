# 🥖 @i18n-bakery/core

> **"The Head Chef"** - _The mastermind managing logic, recipes (keys), and ensuring consistency across every dish. Framework-agnostic excellence._

The **Core Package** is the kitchen line. It orchestrates the entire translation process, handles pluralization logic (counting loaves), processes message formats, and manages the menu (keys). Zero dependencies, pure TypeScript, and built with Clean Architecture principles.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/core.svg)](https://www.npmjs.com/package/@i18n-bakery/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation

```bash
npm install @i18n-bakery/core
# or
pnpm add @i18n-bakery/core
# or
yarn add @i18n-bakery/core
```

---

## 🚀 Quick Start

### Basic Setup (The Starter Recipe)

```typescript
import { initI18n, t } from "@i18n-bakery/core";

// Initialize the bakery
initI18n({
  locale: "en",
  fallbackLocale: "en",
  loader: async (locale, namespace) => {
    // Load your translation files
    return import(`./locales/${locale}/${namespace}.json`);
  },
});

// Start translating!
const greeting = t("home.welcome", "Welcome to our bakery!");
console.log(greeting); // → "Welcome to our bakery!"
```

### With Auto-Save (Self-Rising Dough)

```typescript
import { initI18n, t, JSONFileSaver } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  fallbackLocale: "en",
  saveMissing: true, // Enable auto-save
  saver: new JSONFileSaver("./locales"), // Where to save
  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});

// This will automatically create the file if it doesn't exist
t("profile.greeting", "Hello, {{name}}!", { name: "Baker" });
// → Creates: ./locales/en/profile.json
```

---

## 🎯 Core Features

### 1. Translation Engine (The Oven)

The heart of i18n-bakery - handles all translation logic:

```typescript
import { t } from "@i18n-bakery/core";

// Simple translation
t("home.title", "Welcome");

// With variables
t("greeting", "Hello, {{name}}!", { name: "World" });

// With nested variables
t("user.info", "User: {{user.name}} ({{user.email}})", {
  user: { name: "John", email: "john@example.com" },
});

// With namespace
t("auth:login.button", "Sign In");
```

### 2. Pluralization (Counting Loaves)

Support for multiple pluralization strategies:

#### i18next-Style (Suffix)

```typescript
import { initI18n, t, addTranslations } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  pluralizationStrategy: "suffix", // default
});

addTranslations("en", "common", {
  apple: "apple",
  apple_plural: "apples",
  apple_0: "no apples",
});

t("apple", { count: 0 }); // → "no apples"
t("apple", { count: 1 }); // → "apple"
t("apple", { count: 5 }); // → "apples"
```

#### CLDR-Style (100+ Languages)

```typescript
initI18n({
  locale: "ar", // Arabic
  pluralizationStrategy: "cldr",
});

addTranslations("ar", "common", {
  apple_zero: "لا توجد تفاحات",
  apple_one: "تفاحة واحدة",
  apple_two: "تفاحتان",
  apple_few: "{{count}} تفاحات",
  apple_many: "{{count}} تفاحة",
  apple_other: "{{count}} تفاحة",
});

t("apple", { count: 0 }); // → "لا توجد تفاحات"
t("apple", { count: 1 }); // → "تفاحة واحدة"
t("apple", { count: 2 }); // → "تفاحتان"
t("apple", { count: 5 }); // → "5 تفاحات"
```

### 3. ICU MessageFormat (The Artisan Touch)

Industry-standard message formatting:

```typescript
initI18n({
  locale: "en",
  messageFormat: "icu", // Enable ICU
});

// Plural
t("cart.items", "{count, plural, =0 {no items} one {# item} other {# items}}", {
  count: 3,
}); // → "3 items"

// Select (gender)
t(
  "notification",
  "{gender, select, male {He} female {She} other {They}} liked your post",
  { gender: "female" }
); // → "She liked your post"

// Selectordinal (1st, 2nd, 3rd)
t(
  "ranking",
  "You finished {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}",
  { place: 1 }
); // → "You finished 1st"

// Nested patterns
t(
  "complex",
  "{gender, select, male {He has {count, plural, one {# item} other {# items}}} female {She has {count, plural, one {# item} other {# items}}}}",
  { gender: "male", count: 5 }
); // → "He has 5 items"
```

### 4. Plugin System (Custom Recipes)

Extend functionality with plugins:

```typescript
import {
  initI18n,
  t,
  NumberFormatPlugin,
  CapitalizePlugin,
} from "@i18n-bakery/core";

initI18n({
  locale: "en-US",
  plugins: [new NumberFormatPlugin(), new CapitalizePlugin()],
});

// Number formatting
t("price", "Total: {amount|currency:USD}", { amount: 1234.56 });
// → "Total: $1,234.56"

t("views", "{count|compact} views", { count: 1500000 });
// → "1.5M views"

t("discount", "Save {percent|percent}!", { percent: 25 });
// → "Save 25.00%!"

// Text transformations
addTranslations("en", "common", {
  greeting: "hello world",
});

t("greeting_upper"); // → "HELLO WORLD"
t("greeting_capitalize"); // → "Hello world"
t("greeting_title"); // → "Hello World"
t("greeting_lower"); // → "hello world"
```

### 5. Advanced Key Parsing (The Filing System)

Hierarchical key organization:

```typescript
// Simple: namespace.key
t("home.title", "Welcome");
// → File: locales/en/home.json
// → Property: title

// With directory: namespace:directory.key
t("orders:meal.title", "Pizza Menu");
// → File: locales/en/orders/meal.json
// → Property: title

// Deep nesting: app:features:orders:meal.component.title
t("app:features:orders:meal.component.title", "Order Pizza");
// → File: locales/en/app/features/orders/meal/component.json
// → Property: title
```

### 6. Translation Variants (Multiple Recipes)

Same key, different variable signatures:

```typescript
// Variant 1: Just the bread
t('bread.title', '{{bread}}', { bread: 'Croissant' });

// Variant 2: Bread with price
t('bread.title', '{{bread}} - ${{price}}', { bread: 'Croissant', price: 4.50 });

// Both stored in the same file:
{
  "title": {
    "variants": {
      "bread": {
        "value": "{{bread}}",
        "variables": ["bread"],
        "autoGenerated": true,
        "timestamp": 1733532610000
      },
      "bread_price": {
        "value": "{{bread}} - ${{price}}",
        "variables": ["bread", "price"],
        "autoGenerated": true,
        "timestamp": 1733532615000
      }
    }
  }
}
```

### 7. File Structure Options (Nested or Flat)

Choose your preferred JSON structure:

```typescript
import { JSONFileSaver } from "@i18n-bakery/core";

// Nested structure (default) - hierarchical objects
const nestedSaver = new JSONFileSaver("./locales", "nested");
// Result: { "home": { "title": "Welcome" } }

// Flat structure - dot notation keys
const flatSaver = new JSONFileSaver("./locales", "flat");
// Result: { "home.title": "Welcome" }
```

---

## 🏗️ Architecture

Built with **Clean Architecture** principles:

### Domain Layer (Interfaces/Ports)

Pure TypeScript interfaces that define contracts:

```typescript
// Translation loading
interface Loader {
  load(locale: Locale, namespace: Namespace): Promise<TranslationMap | null>;
}

// Translation saving
interface TranslationSaver {
  save(
    locale: Locale,
    namespace: Namespace,
    key: Key,
    value: string
  ): Promise<void>;
}

// Variable formatting
interface Formatter {
  interpolate(text: string, vars?: Record<string, any>): string;
}

// And many more...
```

### Adapters Layer (Implementations)

Concrete implementations of the interfaces:

- `MemoryStore` - In-memory translation storage
- `JSONFileSaver` - Save translations to JSON files
- `ConsoleSaver` - Log missing translations to console
- `MustacheFormatter` - Simple `{{variable}}` interpolation
- `ICUMessageFormatter` - Full ICU MessageFormat support
- `DefaultKeyParser` - Parse hierarchical keys
- `CLDRPluralResolver` - CLDR pluralization rules
- `NumberFormatPlugin` - Number/currency formatting
- `CapitalizePlugin` - Text transformations

### Use Cases Layer (Business Logic)

Orchestrates the adapters:

- `I18nService` - Main translation engine
- `TranslationFileManager` - File operations and auto-creation

---

## 📚 API Reference

### Initialization

#### `initI18n(config: I18nConfig): I18nService`

Initialize the i18n system.

```typescript
interface I18nConfig {
  locale: Locale; // Current locale
  fallbackLocale?: Locale; // Fallback locale
  loader?: Loader; // Translation loader
  saver?: TranslationSaver; // Translation saver
  saveMissing?: boolean; // Auto-save missing keys
  debug?: boolean; // Debug mode
  outputFormat?: OutputFormat; // 'json' | 'yml' | 'yaml' | 'toml'
  pluralizationStrategy?: "suffix" | "cldr"; // Pluralization strategy
  messageFormat?: "mustache" | "icu"; // Message format syntax
  fileStructure?: "nested" | "flat"; // File structure
  plugins?: Plugin[]; // Plugins to register
}
```

### Translation

#### `t(key: string, defaultText?: string, vars?: Record<string, any>): string`

Translate a key.

```typescript
// Simple
t("home.title", "Welcome");

// With variables
t("greeting", "Hello, {{name}}!", { name: "World" });

// With count (pluralization)
t("apple", { count: 5 });

// With namespace
t("auth:login.button", "Sign In");
```

### Locale Management

#### `setLocale(locale: string): Promise<void>`

Change the current locale.

```typescript
await setLocale("es");
```

#### `getI18n(): I18nService`

Get the i18n instance.

```typescript
const i18n = getI18n();
const currentLocale = i18n.getCurrentLocale();
```

### Manual Translation Management

#### `addTranslations(locale: string, namespace: string, data: Record<string, string>): void`

Manually add translations.

```typescript
addTranslations("en", "common", {
  hello: "Hello",
  goodbye: "Goodbye",
});
```

---

## 🔌 Built-in Plugins

### NumberFormatPlugin

Format numbers, currencies, percentages, and compact numbers:

```typescript
import { NumberFormatPlugin } from "@i18n-bakery/core";

new NumberFormatPlugin();

// Usage in translations:
t("price", "{amount|currency:USD}", { amount: 1234.56 });
// → "$1,234.56"

t("count", "{value|number}", { value: 1234567.89 });
// → "1,234,567.89"

t("discount", "{value|percent}", { value: 0.25 });
// → "25%"

t("views", "{count|compact}", { count: 1500000 });
// → "1.5M"
```

### CapitalizePlugin

Transform text case:

```typescript
import { CapitalizePlugin } from "@i18n-bakery/core";

new CapitalizePlugin();

// Add base translation
addTranslations("en", "common", {
  greeting: "hello world",
});

// Use suffixes:
t("greeting_upper"); // → "HELLO WORLD"
t("greeting_lower"); // → "hello world"
t("greeting_capitalize"); // → "Hello world"
t("greeting_title"); // → "Hello World"
```

---

## 🔧 Creating Custom Plugins

```typescript
import { Plugin, PluginMetadata, PluginContext } from "@i18n-bakery/core";

class MyCustomPlugin implements Plugin {
  readonly metadata: PluginMetadata = {
    name: "my-custom-plugin",
    version: "1.0.0",
    type: "processor",
    description: "My custom plugin",
    author: "Your Name",
  };

  config = {
    enabled: true,
    options: {},
  };

  // Lifecycle hooks
  init?(context: PluginContext): void {
    console.log("Plugin initialized");
  }

  beforeTranslate?(context: PluginContext): void {
    console.log("Before translate:", context.key);
  }

  afterTranslate?(context: PluginContext): string | void {
    // Modify the result
    if (context.result) {
      return context.result + " [processed]";
    }
  }

  onMissing?(context: PluginContext): string | void {
    console.log("Missing key:", context.key);
  }
}

// Register the plugin
initI18n({
  locale: "en",
  plugins: [new MyCustomPlugin()],
});
```

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

**Current Stats:**

- ✅ 197 tests passing
- ✅ 100% coverage on critical paths
- ✅ 14 test suites

---

## 📖 Examples

### Node.js Backend

```typescript
import { initI18n, t, JSONFileSaver } from "@i18n-bakery/core";
import path from "path";

initI18n({
  locale: "en",
  fallbackLocale: "en",
  saveMissing: true,
  saver: new JSONFileSaver(path.join(__dirname, "locales")),
  loader: async (locale, namespace) => {
    const filePath = path.join(
      __dirname,
      "locales",
      locale,
      `${namespace}.json`
    );
    return require(filePath);
  },
});

// Use in your API
app.get("/api/greeting", (req, res) => {
  const locale = req.headers["accept-language"] || "en";
  await setLocale(locale);

  res.json({
    message: t("api.greeting", "Hello from the API!"),
  });
});
```

### With TypeScript

```typescript
import { initI18n, t } from "@i18n-bakery/core";
import type { I18nConfig } from "@i18n-bakery/core";

const config: I18nConfig = {
  locale: "en",
  fallbackLocale: "en",
  messageFormat: "icu",
  pluralizationStrategy: "cldr",
};

initI18n(config);

// Type-safe translation
const greeting: string = t("home.welcome", "Welcome!");
```

---

## 🔗 Related Packages

- **[@i18n-bakery/react](../react)** - React bindings with hooks and providers
- **[@i18n-bakery/cli](../cli)** - Command-line tools for extraction and compilation

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
