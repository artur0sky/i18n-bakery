# 🔧 @i18n-bakery/cli

> **"The Sous-Chef"** — extracts, compiles, inspects, and migrates translation files from the command line.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/cli.svg)](https://www.npmjs.com/package/@i18n-bakery/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation (Gathering Ingredients)

Install the CLI as a development dependency:

```bash
pnpm add -D @i18n-bakery/cli
```

Run it from the project with `pnpm exec`:

```bash
pnpm exec i18n-bakery --help
```

## 🛠️ Commands (The Sous-Chef's Toolkit)

Each command handles a different station in the translation kitchen.

### `batter` — extract translation keys

```bash
pnpm exec i18n-bakery batter [source] --locale <locale>
```

The default source is `src`; the default locale is `en`. The locale option accepts comma-separated locales.

| Option | Description |
| --- | --- |
| `--locale <locale>` | Target locale or comma-separated locales. |
| `--out <dir>` | Locale output directory (default: `public/locales`). |
| `--format <format>` | Output format: `json` or `toml` (default: `json`). |
| `--clean` | Clean the output directory before extraction. |
| `--purge` | Remove orphaned translation files not found in source. |
| `--verbose` | Enable verbose logging. |

Example:

```bash
pnpm exec i18n-bakery batter src --locale en-US,es-MX --out public/locales
```

### `bake` — compile translation files

```bash
pnpm exec i18n-bakery bake [source]
```

The default source is `public/locales`; the default output directory is `dist/locales`.
Input locale directories may contain JSON or TOML files; output is JSON. If both formats are present for a locale, JSON files take precedence. Baking writes one bundle per locale unless `--split` is used.

| Option | Description |
| --- | --- |
| `--out <dir>` | Output directory for compiled bundles. |
| `--minify` | Minify JSON output. |
| `--hash` | Add a content hash to output filenames. |
| `--manifest <file>` | Generate a manifest file. |
| `--split` | Split output into files per namespace. |
| `--encrypt` | Encrypt output files. |
| `--key <secret>` | Encryption key used with `--encrypt`. |
| `--verbose` | Enable verbose logging. |

Example:

```bash
pnpm exec i18n-bakery bake public/locales --out dist/locales --split --manifest manifest.json
```

### `pantry` — inspect translation completeness

```bash
pnpm exec i18n-bakery pantry
```

| Option | Description |
| --- | --- |
| `--localesDir <dir>` | Locales directory (default: `public/locales`). |
| `--sourceDir <dir>` | Optional source directory to compare against. |
| `--referenceLocale <locale>` | Locale used as the reference. |
| `--verbose` | Enable verbose logging. |

`pantry` reads JSON locale files. If `--sourceDir` is provided, it also scans static translation calls in source files; the reference locale defaults to the first locale starting with `en`, or the first locale found.

### `recipe` — update one translation

```bash
pnpm exec i18n-bakery recipe <locale> <namespace> <key> <value>
```

| Option | Description |
| --- | --- |
| `--localesDir <dir>` | Locales directory (default: `public/locales`). |
| `--verbose` | Enable verbose logging. |

Example:

```bash
pnpm exec i18n-bakery recipe es-MX common greeting 'Hola'
```

`recipe` writes to `<localesDir>/<locale>/<namespace>.json` and replaces an existing value for the key.

### `poach` — migrate legacy translations

```bash
pnpm exec i18n-bakery poach <source>
```

| Option | Description |
| --- | --- |
| `--target <path>` | Output directory (default: `./src/i18n/locales`). |
| `--dry-run` | Simulate the migration without writing files. |

### `scout` — identify translation keys

```bash
pnpm exec i18n-bakery scout [path]
```

Scans `.js`, `.jsx`, `.ts`, and `.tsx` files for static `t('key')` calls; when omitted, the path defaults to the current working directory. It lists discovered keys and does not compare them with locale files.

For the complete, version-specific option list, run `pnpm exec i18n-bakery <command> --help`.

---

## 🔗 Related Packages (Kitchen Staff)

- **[@i18n-bakery/core](../core)** — runtime translation engine.
- **[@i18n-bakery/baker](../baker)** — extraction, locale files, and compilation.
- **[@i18n-bakery/poacher](../poacher)** — legacy migration and CSV export.

## 📜 License

MIT © Arturo Sáenz

## 🙏 Support

- 📖 [Main Documentation](../../README.md)
- 🐛 [Issue Tracker](https://github.com/artur0sky/i18n-bakery/issues)
- 💬 [Discussions](https://github.com/artur0sky/i18n-bakery/discussions)

---

<div align="center">

**🔧 The sous-chef's toolkit for a well-run translation kitchen**

_Made with 🍩 and command-line care_

</div>
