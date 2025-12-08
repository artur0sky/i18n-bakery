# 🥯 i18n-bakery vs i18next — A Baker's Comparison

> _"In the art of translation, as in baking, we honor the masters who came before us while adding our own secret ingredients."_

This document compares **i18n-bakery** with **i18next**, the industry-standard internationalization framework. Like comparing a modern artisan bakery with a traditional factory, both produce bread, but with different philosophies and techniques.

---

## 📖 Table of Contents

- [Philosophy & Approach](#-philosophy--approach)
- [The Recipe Book (Features Implemented)](#-the-recipe-book-features-implemented)
- [The Missing Ingredients (Gaps)](#-the-missing-ingredients-gaps)
- [The Bakery's Unique Offerings](#-the-bakerys-unique-offerings)
- [API Compatibility Matrix](#-api-compatibility-matrix)
- [Migration Path (From Factory to Artisan)](#-migration-path-from-factory-to-artisan)
- [The Roadmap (Rising to Perfection)](#-the-roadmap-rising-to-perfection)

---

## 🎭 Philosophy & Approach

### i18next: The Industrial Bakery

> _"Established, reliable, with a recipe book refined over a decade."_

**i18next** is the industry standard, like a large bakery that's been perfecting its recipes for years:

- ✅ **Mature Ecosystem**: 50+ plugins, integrations with every framework
- ✅ **Battle-Tested**: Used by thousands of companies worldwide
- ✅ **Commercial Support**: Backed by Locize (TMS service)
- ✅ **Extensive Documentation**: Years of community knowledge
- ⚠️ **Dependencies**: Requires multiple packages for full functionality
- ⚠️ **Manual Setup**: Translations must be created manually
- ⚠️ **Monolithic Architecture**: Harder to customize internals

### i18n-bakery: The Artisan Bakery

> _"Fresh, handcrafted, with ingredients you can see and understand."_

**i18n-bakery** is the modern alternative, like an artisan bakery that values quality and craftsmanship:

- ✅ **Clean Architecture**: SOLID principles, DRY, testable
- ✅ **Zero Dependencies**: Pure TypeScript, no external packages in core
- ✅ **Auto-Baking**: Translations create themselves as you code
- ✅ **Type-Safe**: Full TypeScript support from the ground up
- ✅ **Built-in Features**: ICU, CLDR, plugins included
- ⚠️ **Young Ecosystem**: Fewer plugins and integrations (growing)
- ⚠️ **Smaller Community**: Less Stack Overflow content
- ⚠️ **Feature Parity**: ~70% compatible (rising to 98%)

---

## 🥖 The Recipe Book (Features Implemented)

> _"Like a master baker who's learned the classic techniques."_

### ✅ Core Features (The Foundation)

| Feature                     | i18next           | i18n-bakery                           | Status        |
| --------------------------- | ----------------- | ------------------------------------- | ------------- |
| **Core Translation**        | `t(key, options)` | `t(key, defaultText, vars)`           | ✅ Compatible |
| **Namespaces**              | `t('ns:key')`     | `t('ns:key')`                         | ✅ Identical  |
| **Hierarchical Namespaces** | Limited           | `t('app:features:orders:meal.title')` | ✅ Enhanced   |
| **Fallback Locale**         | `fallbackLng`     | `fallbackLocale`                      | ✅ Compatible |
| **Variable Interpolation**  | `{{variable}}`    | `{{variable}}`                        | ✅ Identical  |
| **Nested Variables**        | `{{user.name}}`   | `{{user.name}}`                       | ✅ Identical  |

### ✅ Pluralization (Counting Loaves)

| Feature                  | i18next          | i18n-bakery               | Status        |
| ------------------------ | ---------------- | ------------------------- | ------------- |
| **Suffix Pluralization** | `key_plural`     | `key_plural`              | ✅ Identical  |
| **Exact Count**          | `key_0`, `key_1` | `key_0`, `key_1`          | ✅ Identical  |
| **CLDR Pluralization**   | Via plugin       | Built-in                  | ✅ **Better** |
| **100+ Languages**       | Via plugin       | Native `Intl.PluralRules` | ✅ **Better** |

### ✅ Advanced Formatting (The Artisan Touch)

| Feature                  | i18next                  | i18n-bakery                   | Status        |
| ------------------------ | ------------------------ | ----------------------------- | ------------- |
| **ICU MessageFormat**    | Via `i18next-icu` plugin | Built-in                      | ✅ **Better** |
| **Number Formatting**    | Via plugin               | Built-in `NumberFormatPlugin` | ✅ **Better** |
| **Text Transformations** | Via plugin               | Built-in `CapitalizePlugin`   | ✅ **Better** |
| **Date/Time Formatting** | Via plugin               | 🔜 Coming in v1.4.0           | 🟡 Planned    |

### ✅ React Integration (Fresh from the Oven)

| Feature              | i18next            | i18n-bakery        | Status        |
| -------------------- | ------------------ | ------------------ | ------------- |
| **React Hooks**      | `useTranslation()` | `useTranslation()` | ✅ Compatible |
| **Provider**         | `I18nextProvider`  | `I18nProvider`     | ✅ Compatible |
| **Reactive Updates** | ✅                 | ✅ Enhanced        | ✅ **Better** |
| **Namespace Prefix** | ✅                 | ✅                 | ✅ Identical  |

### ✅ Plugin System (Custom Recipes)

| Feature                   | i18next | i18n-bakery                                        | Status        |
| ------------------------- | ------- | -------------------------------------------------- | ------------- |
| **Plugin Architecture**   | ✅      | ✅ Clean Architecture                              | ✅ Compatible |
| **Lifecycle Hooks**       | Limited | Full (init, beforeTranslate, afterTranslate, etc.) | ✅ **Better** |
| **Dependency Management** | ❌      | ✅                                                 | ✅ **Better** |
| **Type Safety**           | Partial | Full TypeScript                                    | ✅ **Better** |

### ✅ CLI Tools (The Baker's Toolkit)

| Feature            | i18next                     | i18n-bakery                    | Status        |
| ------------------ | --------------------------- | ------------------------------ | ------------- |
| **Key Extraction** | `i18next-parser` (separate) | `i18n-bakery batter`           | ✅ Compatible |
| **Compilation**    | ❌                          | `i18n-bakery bake`             | ✅ **Unique** |
| **Minification**   | ❌                          | `--minify` flag                | ✅ **Unique** |
| **Hashing**        | ❌                          | `--hash` flag                  | ✅ **Unique** |
| **Encryption**     | ❌                          | `--encrypt` flag (AES-256-GCM) | ✅ **Unique** |
| **TOML Support**   | ❌                          | `--format toml`                | ✅ **Unique** |

---

## 🍞 The Missing Ingredients (Gaps)

> _"Even the finest bakery has recipes yet to perfect."_

### 🔴 High Priority (Critical for Production)

#### 1. **Context Support** (The Gender Baker)

**Status**: ❌ Not Implemented | **Planned**: v1.1.0 (Q1 2025)

```typescript
// i18next
t("friend", { context: "male" }); // → friend_male
t("friend", { context: "female" }); // → friend_female

// i18n-bakery - COMING SOON
// Will support same syntax in v1.1.0
```

**Impact**: Critical for gendered languages (Spanish, French, German, Arabic, etc.)

**Workaround**: Use separate keys for now (`friend_male`, `friend_female`)

---

#### 2. **Language Detection** (The Polyglot Nose)

**Status**: ❌ Not Implemented | **Planned**: v1.1.0 (Q1 2025)

```typescript
// i18next
import LanguageDetector from "i18next-browser-languagedetector";
i18next.use(LanguageDetector);

// i18n-bakery - COMING SOON
import { BrowserLanguageDetector } from "@i18n-bakery/core";
initI18n({
  plugins: [new BrowserLanguageDetector()],
});
```

**Impact**: Users must manually set language

**Workaround**: Detect manually using `navigator.language`

---

#### 3. **HTTP Backend** (The Network Loader)

**Status**: ✅ **Implemented** in v1.0.3

```typescript
// i18next
import Backend from "i18next-http-backend";
i18next.use(Backend);

// i18n-bakery - AVAILABLE NOW ✅
import { HttpBackend } from "@i18n-bakery/core";
initI18n({
  loader: new HttpBackend({
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  }),
});
```

**Status**: ✅ Feature complete with manifest support and encryption

---

#### 4. **Event System** (The Observer)

**Status**: 🟡 Partial | **Planned**: v1.2.0 (Q1 2025)

```typescript
// i18next
i18next.on("languageChanged", (lng) => {
  console.log("Language changed to", lng);
});

// i18n-bakery - PARTIAL
// Has subscribe() for React, but not full event system
const i18n = getI18n();
i18n.subscribe(() => {
  console.log("Locale changed");
});
```

**Impact**: Harder to integrate with frameworks and debugging

**Workaround**: Use `subscribe()` method for basic reactivity

---

### 🟡 Medium Priority (Nice to Have)

#### 5. **Nesting Translations** (The Reference Baker)

**Status**: ❌ Not Implemented | **Planned**: v1.3.0 (Q2 2025)

```typescript
// i18next
{
  "hello": "Hello",
  "greeting": "$t(hello) World!" // → "Hello World!"
}

// i18n-bakery - COMING SOON
// Will support same syntax
```

**Impact**: Reduces duplication in translation files

**Workaround**: Repeat text or use variables

---

#### 6. **Return Objects** (The Batch Baker)

**Status**: ❌ Not Implemented | **Planned**: v1.3.0 (Q2 2025)

```typescript
// i18next
t("menu", { returnObjects: true });
// Returns: { home: "Home", about: "About", contact: "Contact" }

// i18n-bakery - COMING SOON
```

**Impact**: Useful for loading entire sections at once

**Workaround**: Call `t()` for each key individually

---

#### 7. **Return Details** (The Metadata Baker)

**Status**: ❌ Not Implemented | **Planned**: v1.3.0 (Q2 2025)

```typescript
// i18next
t("key", { returnDetails: true });
// Returns: { res: "translation", usedKey: "key", usedLng: "en", usedNS: "common" }

// i18n-bakery - COMING SOON
```

**Impact**: Useful for debugging and analytics

**Workaround**: Track manually using `getI18n().getCurrentLocale()`

---

### 🟢 Low Priority (Future Enhancements)

#### 8. **Multiple Instances** (The Multi-Baker)

**Status**: ❌ Not Implemented | **Planned**: v1.4.0 (Q2 2025)

```typescript
// i18next
const instance1 = i18next.createInstance();
const instance2 = i18next.createInstance();

// i18n-bakery - SINGLETON ONLY
// Will support in v1.4.0
```

**Impact**: Needed for micro-frontends or multi-tenant apps

**Workaround**: Use single global instance

---

#### 9. **Custom Missing Key Handler** (The Error Baker)

**Status**: 🟡 Partial | **Planned**: v1.5.0 (Q3 2025)

```typescript
// i18next
i18next.init({
  missingKeyHandler: (lngs, ns, key, fallbackValue) => {
    // Custom handling
  },
});

// i18n-bakery - PARTIAL
// Has saveMissing but not custom handler
initI18n({
  saveMissing: true, // Auto-saves missing keys
  saver: new JSONFileSaver("./locales"),
});
```

**Impact**: Limited customization of missing key behavior

**Workaround**: Use `saveMissing` for auto-baking

---

## 🥐 The Bakery's Unique Offerings

> _"Every bakery has its signature bread."_

These are features that **i18n-bakery has** but **i18next doesn't**:

### 🏆 1. Auto-Baking (Self-Rising Translations)

**The Killer Feature**

```typescript
// i18n-bakery - UNIQUE ✨
initI18n({
  saveMissing: true,
  saver: new JSONFileSaver("./locales"),
});

t("new.feature.title", "Amazing Feature!");
// ✅ Automatically creates: locales/en/new/feature.json
// ✅ Adds key with default value
// ✅ Includes metadata (timestamp, variables, autoGenerated flag)
```

**i18next**: ❌ No equivalent. Must create files manually.

**Impact**: 10x faster development, zero manual file management

---

### 🏆 2. Zero Dependencies (Pure Ingredients)

```typescript
// i18n-bakery core package
"dependencies": {} // ✅ ZERO

// i18next core package
"dependencies": {
  "@babel/runtime": "^7.x",
  // ... more dependencies
}
```

**Impact**: Smaller bundle, fewer security vulnerabilities, faster installs

---

### 🏆 3. Clean Architecture (The Master Recipe)

```
i18n-bakery:
┌─────────────────────────────────┐
│  Domain (Interfaces)            │
├─────────────────────────────────┤
│  Adapters (Implementations)     │
├─────────────────────────────────┤
│  Use Cases (Business Logic)     │
└─────────────────────────────────┘
```

**Impact**: Easier to test, extend, and maintain

---

### 🏆 4. Translation Variants (The Variable Vault)

```typescript
// i18n-bakery - UNIQUE ✨
t('product.title', '{{name}}', { name: 'Pizza' });
t('product.title', '{{name}} - ${{price}}', { name: 'Pizza', price: 12 });

// Stored as:
{
  "title": {
    "variants": {
      "name": { "value": "{{name}}", "variables": ["name"], ... },
      "name_price": { "value": "{{name}} - ${{price}}", "variables": ["name", "price"], ... }
    }
  }
}
```

**i18next**: ❌ No variant tracking. Overwrites previous value.

**Impact**: Better tracking of different usage patterns

---

### 🏆 5. TOML Support (Alternative Format)

```typescript
// i18n-bakery - UNIQUE ✨
initI18n({
  outputFormat: "toml",
  loader: new TOMLLoader("/locales"),
});

// TOML file: locales/en/common.toml
// welcome = "Welcome"
// [actions]
// save = "Save"
// cancel = "Cancel"
```

**i18next**: ❌ JSON only

**Impact**: Better for large files, supports comments

---

### 🏆 6. Built-in Compilation (The Optimizer)

```bash
# i18n-bakery - UNIQUE ✨
i18n-bakery bake locales --minify --hash --encrypt --key secret

# Creates:
# dist/locales/en.a7f3b9.json (minified, hashed, encrypted)
# dist/locales/manifest.json (mapping file)
```

**i18next**: ❌ No build tools

**Impact**: Production-ready optimization out of the box

---

### 🏆 7. Hierarchical Namespaces (Deep Organization)

```typescript
// i18n-bakery - ENHANCED ✨
t("app:features:orders:meal.component.title", "Order Pizza");
// → locales/en/app/features/orders/meal/component.json

// i18next - LIMITED
t("orders:meal.title", "Pizza Menu");
// → locales/en/orders.json (flat namespace)
```

**Impact**: Better organization for large projects

---

## 📝 API Compatibility Matrix

> _"Speaking the same language, with our own accent."_

| i18next API                                | i18n-bakery Equivalent              | Compatible? | Notes                            |
| ------------------------------------------ | ----------------------------------- | ----------- | -------------------------------- |
| `i18next.init(config)`                     | `initI18n(config)`                  | ✅ Yes      | Different config keys            |
| `i18next.t(key, options)`                  | `t(key, defaultText, vars)`         | ✅ Yes      | Signature differs but compatible |
| `i18next.changeLanguage(lng)`              | `setLocale(locale)`                 | ✅ Yes      | Different name                   |
| `i18next.language`                         | `getI18n().getCurrentLocale()`      | ✅ Yes      | Different access                 |
| `i18next.addResourceBundle(lng, ns, data)` | `addTranslations(locale, ns, data)` | ✅ Yes      | Different name                   |
| `i18next.use(plugin)`                      | `initI18n({ plugins: [...] })`      | ✅ Yes      | Different registration           |
| `useTranslation(ns)`                       | `useTranslation(ns)`                | ✅ Yes      | Identical                        |
| `i18next.on(event, callback)`              | ❌ Missing                          | ❌ No       | Coming in v1.2.0                 |
| `i18next.createInstance()`                 | ❌ Missing                          | ❌ No       | Coming in v1.4.0                 |
| `i18next.getFixedT(lng, ns)`               | ❌ Missing                          | ❌ No       | Coming in v1.5.0                 |

---

## 🚶 Migration Path (From Factory to Artisan)

> _"Every journey begins with a single step."_

### Step 1: Install i18n-bakery

```bash
npm install @i18n-bakery/core @i18n-bakery/react
# or
pnpm add @i18n-bakery/core @i18n-bakery/react
```

### Step 2: Update Initialization

```typescript
// Before (i18next)
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: require("./locales/en/translation.json"),
    },
  },
});

// After (i18n-bakery)
import { initI18n } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  fallbackLocale: "en",
  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});
```

### Step 3: Update React Components

```typescript
// Before (i18next)
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("title")}</h1>;
}

// After (i18n-bakery)
import { useTranslation } from "@i18n-bakery/react";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("title", "Default Title")}</h1>;
}
```

### Step 4: Enable Auto-Baking (Optional)

```typescript
import { initI18n, JSONFileSaver } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  saveMissing: true, // ✨ Enable auto-baking
  saver: new JSONFileSaver("./public/locales"),
  loader: async (locale, namespace) => {
    return import(`./public/locales/${locale}/${namespace}.json`);
  },
});
```

### Step 5: Extract Existing Keys (Optional)

```bash
# Extract all translation keys from your codebase
npx i18n-bakery batter src --locale en --out public/locales
```

---

## 🗺️ The Roadmap (Rising to Perfection)

> _"Like dough, we rise with time and care."_

### Current State: v1.0.6 (December 2025)

**Feature Parity**: ~70%  
**Production Ready**: ✅ Yes  
**Tests**: 197 passing

---

### v1.1.0 — The Context & Detection Release (Q1 2025)

**Target Parity**: 80%

#### Features:

- ✅ **Context Support** (2-3 days)

  - `t('friend', { context: 'male' })` → `friend_male`
  - Configurable separator
  - Works with pluralization

- ✅ **Language Detection Plugin** (2 days)
  - Browser detection (`navigator.language`)
  - localStorage persistence
  - Cookie support
  - Query string (`?lng=es`)
  - HTML lang attribute

---

### v1.2.0 — The Network Release (Q1 2025)

**Target Parity**: 85%

#### Features:

- ✅ **HTTP Backend** (Already implemented in v1.0.3)

  - Manifest support
  - Lazy loading
  - Encryption support

- ✅ **Event System** (2 days)
  - `on('languageChanged')`
  - `on('loaded')`
  - `on('failedLoading')`
  - `on('missingKey')`

---

### v1.3.0 — The Advanced Features Release (Q2 2025)

**Target Parity**: 90%

#### Features:

- ✅ **Nesting Translations** (3-4 days)

  - `$t(key)` syntax
  - Circular reference detection
  - Works with variables

- ✅ **Return Objects** (2 days)

  - `t('menu', { returnObjects: true })`
  - Array support
  - Deep object return

- ✅ **Return Details** (1 day)
  - `t('key', { returnDetails: true })`
  - Metadata: usedKey, usedLng, usedNS

---

### v1.4.0 — The Enterprise Release (Q2 2025)

**Target Parity**: 95%

#### Features:

- ✅ **Multiple Instances** (3 days)

  - `createI18nInstance()`
  - Instance isolation
  - React context per instance

- ✅ **Date/Time Formatting Plugin** (4 days)
  - Using `Intl.DateTimeFormat`
  - Relative time
  - Custom formats

---

### v1.5.0 — The Complete Release (Q3 2025) 🎯

**Target Parity**: 98% (Seamless Integration Achieved)

#### Features:

- ✅ **Custom Missing Key Handler** (1 day)

  - Configurable callback
  - Analytics integration
  - Error tracking

- ✅ **Advanced Formatting** (2 days)

  - List formatting (`Intl.ListFormat`)
  - Additional number formats

- ✅ **getFixedT()** (1 day)
  - Pre-bound translation function
  - Namespace locking

---

## 🎯 Conclusion

> _"In the end, both bakeries make bread. The question is: which bread suits your taste?"_

### Choose **i18next** if you need:

- ✅ Mature ecosystem with 50+ plugins
- ✅ Commercial support (Locize)
- ✅ Extensive community resources
- ✅ Proven track record in production
- ✅ Integration with translation services

### Choose **i18n-bakery** if you value:

- ✅ **Auto-Baking** (10x faster development)
- ✅ **Clean Architecture** (maintainable code)
- ✅ **Zero Dependencies** (smaller bundle)
- ✅ **Type Safety** (TypeScript-first)
- ✅ **Built-in Features** (ICU, CLDR, plugins)
- ✅ **Modern Tooling** (CLI, compilation, encryption)

### The Sweet Spot: Use Both

For existing projects, **i18next** is the safe choice.  
For new projects, **i18n-bakery** offers a fresh, modern approach.  
By v1.5.0 (Q3 2025), migration will be seamless with 98% parity.

---

## 📚 Further Reading

- [Auto-Baking Documentation](./AUTO_BAKING.md) - Deep dive into the killer feature
- [TOML Support](./TOML_SUPPORT.md) - Alternative file format
- [Roadmap](../WORKPLAN.md) - Detailed implementation plan
- [Changelog](../CHANGELOG.md) - Version history

---

<div align="center">

### 🥯 _"Honoring tradition while baking the future."_

**Made with 🍩 and Clean Architecture**

[⭐ Star on GitHub](https://github.com/artur0sky/i18n-bakery) | [📦 View on NPM](https://www.npmjs.com/package/@i18n-bakery/core)

</div>
