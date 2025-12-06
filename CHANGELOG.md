# 🥯 Bakery Log (Changelog)

All notable changes to the **i18n-bakery** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-06 (The Sourdough Starter)

### 🚀 Fresh from the Oven
- **Core Runtime (The Kitchen):** Initial release of `@i18n-bakery/core`.
  - Implemented `I18nService` following Clean Architecture principles.
  - Added `MemoryStore` adapter for managing translations in memory.
  - Added `MustacheFormatter` for `{{variable}}` interpolation.
- **Public API (The Menu):**
  - `initI18n()`: Preheat the oven with your config.
  - `t()`: The main ingredient for translating text.
  - `setLocale()`: Switch flavors on the fly.
  - `addTranslations()`: Stock the pantry manually.
- **Testing (Taste Tests):**
  - Added comprehensive unit tests using `vitest`.
  - Verified fallback logic, missing key handling, and nested interpolation.
- **Build System:**
  - Configured `tsup` for bundling CJS, ESM, and DTS formats.

### 🔧 Ingredients (Technical Details)
- **Architecture:** Organized into Domain, Ports, Adapters, and Use Cases.
- **Workspace:** Set up `pnpm` workspace structure.
- **Dependencies:** Zero runtime dependencies for the core package.

---

*“Baking the world a better place, one translation at a time.”*
