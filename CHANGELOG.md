# 🥯 Bakery Log (Changelog)

All notable changes to the **i18n-bakery** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2025-12-06 (The Variable Vault)

### 🚀 Fresh from the Oven
- **Variable Detection System (The Signature Maker):**
  - Introduced automatic detection of variables from translation calls.
  - Creates unique signatures for different variable combinations.
  - Alphabetically sorted signatures ensure consistent identification.
  - Example: `{ meal: "Pizza", price: 120 }` → signature `["meal", "price"]` → key `"meal_price"`
- **Translation Variants (The Recipe Variations):**
  - Support for multiple variants of the same translation key based on variable signatures.
  - Each variant stores its own value, variables list, and metadata.
  - Automatic timestamp tracking for entry creation/updates.
  - Example: Same key `"meal.title"` can have variants for `["meal"]` and `["meal", "price"]`
- **Auto-generation Templates (The Placeholder Baker):**
  - Configurable default value generation for missing translations.
  - Two template styles: `variables-only` (e.g., `"{{meal}} {{price}}"`) and `empty` (e.g., `""`)
  - Smart placeholder insertion based on detected variables.
- **In-Memory Variant Management (The Organized Pantry):**
  - Efficient storage structure for translation variants.
  - Multi-locale and multi-namespace support.
  - Fast retrieval by signature for optimal runtime performance.

### 🔧 Ingredients (Technical Details)
- **Architecture:** Continues Clean Architecture pattern with new domain interfaces and adapters.
- **New Interfaces (Ports):**
  - `VariableDetector`: Port for detecting variables and creating signatures.
  - `TranslationEntryManager`: Port for managing translation entries with variant support.
  - `VariableSignature`: Type for unique variable combinations.
  - `TranslationEntry`: Interface for translation entries with metadata.
  - `TranslationVariants`: Interface for managing multiple variants per key.
  - `VariableDetectorConfig`: Configuration for variable detection behavior.
- **New Adapters (Implementations):**
  - `DefaultVariableDetector`: Detects variables, creates signatures, generates default values.
  - `MemoryTranslationEntryManager`: In-memory storage for translation variants with full CRUD operations.
- **Testing:** Added 41 comprehensive tests with 100% coverage.
  - 20 tests for `DefaultVariableDetector` covering detection, signatures, templates, and workflows.
  - 21 tests for `MemoryTranslationEntryManager` covering storage, retrieval, variants, multi-locale, and real-world scenarios.
- **Exports:** Updated `index.ts` and `types.ts` to export new variable detection interfaces and adapters.
- **Breaking Changes:** None. This is a new feature that extends existing functionality.

## [0.7.0] - 2025-12-06 (The Structured Pantry)

### 🚀 Fresh from the Oven
- **Advanced Key Engine (The Filing System):**
  - Introduced hierarchical key parsing with support for directory structures.
  - Keys now support `:` (colon) for directory levels and `.` (dot) for file and property separation.
  - Intelligent parsing rules based on colon count:
    - **NO colons**: All dots are nested properties in `global` file (e.g., `user.profile.name` → `global.json`)
    - **ONE colon**: First dot-part is file, rest are nested properties (e.g., `orders:meal.user.name` → `/orders/meal.json`)
    - **MULTIPLE colons**: Dots become directories (e.g., `app:features:orders:meal.component.title` → `/app/features/orders/meal/component.json`)
- **Path Resolution (The Map):**
  - Added `FileSystemPathResolver` to translate parsed keys into actual file system paths.
  - Configurable base directory and file extension support.
  - Automatic directory structure generation based on key hierarchy.
  - Zero external dependencies - custom path joining implementation.
- **Key Normalization (The Quality Check):**
  - Automatic cleanup of malformed keys (duplicate separators, whitespace, etc.).
  - Ensures consistent key representation across the application.

### 🔧 Ingredients (Technical Details)
- **Architecture:** Implemented using Clean Architecture principles with clear separation between domain (interfaces) and adapters (implementations).
- **New Interfaces (Ports):**
  - `KeyParser`: Port for parsing translation keys into structured components.
  - `PathResolver`: Port for resolving parsed keys to file system paths.
  - `ParsedKey`: Structured representation of a parsed key.
  - `PathResolverConfig`: Configuration for path resolution.
- **New Adapters (Implementations):**
  - `DefaultKeyParser`: Default implementation of key parsing logic with intelligent colon/dot handling.
  - `FileSystemPathResolver`: File system-based path resolution without external dependencies.
- **Testing:** Added 33 comprehensive tests with 100% coverage of parsing scenarios and edge cases.
  - 21 tests for `DefaultKeyParser` covering normalization, simple keys, directories, nested properties, and i18next compatibility.
  - 12 tests for `FileSystemPathResolver` covering path resolution, configurations, and real-world scenarios.
- **Exports:** Updated `index.ts` and `types.ts` to export new interfaces and adapters.
- **Breaking Changes:** None. This is a new feature that doesn't affect existing functionality.

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
