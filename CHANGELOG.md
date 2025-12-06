# 🥯 Bakery Log (Changelog)

All notable changes to the **i18n-bakery** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-12-06 (The React Glaze)

### 🚀 Fresh from the Oven
- **React Bindings (The Glaze):** Introduced `@i18n-bakery/react` for seamless integration.
  - `I18nProvider`: The warm wrapper that keeps your app connected to the bakery.
  - `useT()`: A hook to fetch fresh translations directly in your components.
  - `useI18n()`: Access the full power of the bakery (change locale, etc.).
- **Reactive Updates:**
  - Changing the locale via `setLocale` automatically re-renders all components using translations.
  - Supports namespace prefixes for cleaner component code (e.g., `useT('auth')`).

### 🔧 Ingredients (Technical Details)
- **Core Refinement:** Renamed `getLocale()` to `getCurrentLocale()` in Core for better clarity.
- **Testing:** Added comprehensive unit tests for React hooks using `@testing-library/react-hooks` and `jsdom`.
- **Architecture:** Clean separation of concerns; React package depends on Core interfaces.

## [0.3.0] - 2025-12-06 (The Automatic Mixer)

### 🚀 Fresh from the Oven
- **CLI (The Mixer):** Introduced `@i18n-bakery/cli` to automate the baking process.
  - `batter`: New command to scan source code (`.ts`, `.tsx`, `.js`, `.jsx`) and extract translation keys automatically.
  - `bake`: New command to compile scattered JSON files into a single, production-ready bundle.
- **Smart Extraction:**
  - Uses AST parsing (via Babel) to accurately find `t()` calls.
  - Infers namespaces from keys (e.g., `auth.login` -> `auth.json`).
  - Preserves existing translations while adding new ones.

### 🔧 Ingredients (Technical Details)
- **Infrastructure:** Set up a new package structure for the CLI.
- **Testing:** Added integration tests to verify the full extraction and compilation pipeline.
- **Dependencies:** Powered by `cac` for CLI commands and `fs-extra` for file operations.

## [0.2.0] - 2025-12-06 (The Self-Rising Dough)

### 🚀 Fresh from the Oven
- **Auto-Save (Self-Rising):**
  - Implemented automatic detection and saving of missing translation keys.
  - Added `TranslationSaver` port to handle persistence strategies.
- **New Adapters:**
  - `JSONFileSaver`: Automatically writes missing keys to JSON files (Node.js).
  - `ConsoleSaver`: Logs missing translations to the console for quick debugging.
- **Core Updates:**
  - Enhanced `I18nService` to coordinate the saving process.
  - `t()` function now triggers the saver when a translation is missing.

### 🔧 Ingredients (Technical Details)
- **Testing:** Added `autosave.test.ts` ensuring the auto-save logic works perfectly.
- **Architecture:** Seamless integration of the `TranslationSaver` port.

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
