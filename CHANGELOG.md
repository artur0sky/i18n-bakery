# 🥯 Bakery Log (Changelog)

All notable changes to the **i18n-bakery** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.7.0] - 2025-12-06 (The Structured Pantry)

### 🚀 Fresh from the Oven
- **Advanced Key Engine (The Filing System):**
  - Introduced hierarchical key parsing with support for directory structures.
  - Keys now support `:` (colon) for directory levels and `.` (dot) for file and property separation.
  - Example: `orders:meal.orderComponent.title` → `/orders/meal/orderComponent.json` with property `title`.
- **Path Resolution (The Map):**
  - Added `FileSystemPathResolver` to translate parsed keys into actual file system paths.
  - Configurable base directory and file extension support.
  - Automatic directory structure generation based on key hierarchy.
- **Key Normalization (The Quality Check):**
  - Automatic cleanup of malformed keys (duplicate separators, whitespace, etc.).
  - Ensures consistent key representation across the application.

### 🔧 Ingredients (Technical Details)
- **Architecture:** Implemented using Clean Architecture principles with clear separation between domain (interfaces) and adapters (implementations).
- **New Interfaces:**
  - `KeyParser`: Port for parsing translation keys into structured components.
  - `PathResolver`: Port for resolving parsed keys to file system paths.
- **New Adapters:**
  - `DefaultKeyParser`: Default implementation of key parsing logic.
  - `FileSystemPathResolver`: File system-based path resolution.
- **Testing:** Added 29 comprehensive tests with 100% coverage of parsing scenarios and edge cases.
- **TypeScript Configuration:** Fixed `tsconfig.json` to properly include test files and recognize Node.js types.
- **Breaking Changes:** None. This is a new feature that doesn't affect existing functionality.

## [0.6.4] - 2025-12-06 (The Refined Taste)

### 🚀 Fresh from the Oven
- **React Bindings (The Glaze):**
  - Renamed `useT` to `useTranslation` to better align with industry standards (like `i18next`) and make migration easier.
  - The API remains the same, just a more familiar name for the hook.

## [0.6.3] - 2025-12-06 (The Recipe Book)

### 🚀 Fresh from the Oven
- **Documentation (The Cookbook):**
  - Added comprehensive `README.md` files for all packages (`core`, `react`, `cli`) and the example application.
  - Each README is written with our signature "Bakery" theme, providing clear instructions on ingredients (API) and baking (usage).

## [0.6.2] - 2025-12-06 (The Shop Window)

### 🚀 Fresh from the Oven
- **Public Visibility (The Signboard):**
  - Configured all packages (`core`, `react`, `cli`) for public access on NPM (`publishConfig.access: "public"`).
  - Added rich metadata (keywords, author, repository, license) to `package.json` files to improve discoverability in the NPM registry.

### 🔧 Ingredients (Technical Details)
- **Root Configuration:** Updated the root `package.json` with project-wide metadata and marked it as `private: true`.
- **License:** Standardized on the MIT license across all packages.

## [0.6.1] - 2025-12-06 (The Universal Batch)

### 🚀 Fresh from the Oven
- **Universal Compatibility (Gluten-Free?):**
  - Enhanced package definitions to ensure seamless usage in both TypeScript and JavaScript environments (CJS & ESM).
  - Your bakery now serves everyone, regardless of their module system preference!

### 🔧 Ingredients (Technical Details)
- **Packaging:** Added `exports` field to `@i18n-bakery/react` and `@i18n-bakery/cli` `package.json` files for modern module resolution.
- **Build System:** Refined `tsconfig.json` configurations across packages to resolve build conflicts with `tsup`.

## [0.6.0] - 2025-12-06 (The Grand Opening)

### 🚀 Fresh from the Oven
- **Monorepo Structure (The Bakery Shop):**
  - Reorganized the project into a robust `pnpm` workspace.
  - Added `examples/react-basic` to demonstrate usage in a real React application.
- **Documentation (The Cookbook):**
  - Added comprehensive documentation in `docs/` covering installation, runtime API, React integration, and CLI usage.
  - Rewrote all documentation to align with the "Bakery" metaphor (Ingredients, Recipes, Mixing, Baking).

### 🔧 Ingredients (Technical Details)
- **Build System:**
  - Configured `tsconfig.json` files for composite project references, enabling faster and more accurate builds.
  - Added `files` field to `package.json` in all packages to ensure clean NPM publishing.
  - Updated `pnpm-workspace.yaml` to include the `examples` directory.

## [0.5.2] - 2025-12-06 (The Measured Ingredients)

### 🔧 Ingredients (Technical Details)
- **Build System:** Pinned all dependencies to static versions (removed `^`) in `package.json` files to ensure deterministic and reproducible builds.

## [0.5.1] - 2025-12-06 (The Quality Control)

### 🔧 Ingredients (Technical Details)
- **Testing:** Fixed a TypeScript error in `react.test.ts` where `children` prop was missing in the wrapper component.
- **CI:** Verified all tests pass across Core, CLI, and React packages.

## [0.5.0] - 2025-12-06 (The Universal Recipe)

### 🚀 Fresh from the Oven
- **i18next Compatibility (Universal Recipe):**
  - Added support for `ns:key` notation (e.g., `t('auth:login')`), making migration from i18next smoother.
  - Verified support for deep nested variable interpolation (e.g., `{{user.profile.name}}`).
- **Enhanced Parsing:**
  - `I18nService` now intelligently handles both dot notation (`auth.login`) and colon notation (`auth:login`) for namespaces.

### 🔧 Ingredients (Technical Details)
- **Testing:** Added `compatibility.test.ts` to ensure 98% API compatibility with standard i18next usage patterns.
- **Core Logic:** Refined key parsing logic to prioritize colon separators when present.

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
