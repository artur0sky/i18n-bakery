# 🥯 @i18n-bakery/baker

> **"The Pastry Chef"** — precision-obsessed expert dealing with delicate file structures, compiling assets, and managing translation files.

This package handles the Node.js and build-time work around i18n-bakery: scanning source code, extracting keys, updating locale files, checking JSON locale coverage, and compiling production bundles.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/baker.svg)](https://www.npmjs.com/package/@i18n-bakery/baker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Purpose (The Baker's Role)

- Keep runtime translation lookup in `@i18n-bakery/core`.
- Scan JavaScript and TypeScript source for statically written translation calls.
- Create and update JSON or TOML locale files.
- Inspect JSON locale completeness and compile locale files to JSON bundles.

## 📦 Features (The Baker's Menu)

### 1. Key Extraction (`KeyExtractor`)

`BabelKeyExtractor` parses `.js`, `.jsx`, `.ts`, and `.tsx` files for static string calls to `t()` and static `useTranslation()` namespaces. Declaration files and `node_modules` are excluded by `ProjectScanner`.

```typescript
import { BabelKeyExtractor } from '@i18n-bakery/baker'

const keys = await new BabelKeyExtractor().extractFromFile('src/components/Button.tsx')
```

`ExtractionUseCase` writes keys grouped by namespace. New entries use literal defaults when available, otherwise an empty string; existing translations are preserved. `clean` empties a validated output directory before extraction. `purge` removes locale files for namespaces no longer found.

```typescript
import { ExtractionUseCase } from '@i18n-bakery/baker'

const result = await new ExtractionUseCase().execute({
  source: 'src',
  out: 'public/locales',
  locales: ['en-US', 'es-MX'],
  format: 'json',
  cwd: process.cwd(),
})
```

### 2. Baking & Compilation (`BakingManager`)

`BakingManager` reads locale directories containing JSON or TOML and writes JSON output. Use one format per locale; if both JSON and TOML files are found, JSON takes precedence.

```typescript
import { BakingManager } from '@i18n-bakery/baker'

await new BakingManager().bake('public/locales', {
  out: 'dist/locales',
  minify: true,
  hash: true,
  split: true,
  manifest: 'manifest.json',
})
```

- **Minification:** Compact JSON output.
- **Hashing:** Adds an eight-character MD5 content hash to filenames for cache busting; it is not a security checksum.
- **Splitting:** Writes one file per namespace instead of one bundle per locale.
- **Encryption:** AES-256-GCM encryption; `encrypt: true` requires `key`.
- **Manifest:** Writes a JSON map of locale or namespace paths to output files.

### 3. File Management (`TranslationFileManager`)

`JSONFileSaver` and `TOMLFileSaver` write individual translations and preserve existing values by default. `RecipeUseCase` updates one key in a JSON locale file. `PantryUseCase` compares JSON locale files and can include keys found in an optional source scan.

`TranslationFileManager` manages file entries and variable-signature variants using configured parsers, path resolvers, variable detectors, and writers.

### 4. TOML Format Support

The package provides TOML saver and writer adapters for its translation-file structures. These custom adapters are not general-purpose TOML parsers or a guarantee of full TOML v1.0.0 compliance.

```typescript
import { TOMLFileSaver } from '@i18n-bakery/baker'

const saver = new TOMLFileSaver('./public/locales', 'nested')
await saver.save('en', 'common', 'title', 'Welcome')
```

## 🛠️ Architecture (Kitchen Layout)

- **Domain:** File writer, key extractor, key parser, and variable-detection contracts.
- **Use Cases:** `ExtractionUseCase`, `BakingManager`, `PantryUseCase`, `RecipeUseCase`, and `TranslationFileManager`.
- **Adapters:** Babel extraction, JSON/TOML file handling, path resolution, and Node.js filesystem access.

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add @i18n-bakery/baker
```

## 🤝 Dependencies (Kitchen Ingredients)

The package uses `@i18n-bakery/core`, Babel parser/traverse/types, `fs-extra`, and `glob`. Runtime file and source scanning operations are intended for Node.js/build tooling, not browser execution.

## 🔗 Related Packages (Kitchen Staff)

- **[@i18n-bakery/core](../core)** — runtime translation engine and shared contracts.
- **[@i18n-bakery/cli](../cli)** — command-line access to Baker workflows.
- **[@i18n-bakery/tray](../tray)** — selected Baker workflows for MCP clients.

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

**🥐 Heavy-lifting tools for your i18n build pipeline**

_Made with 🍩 and File System Magic_

</div>
