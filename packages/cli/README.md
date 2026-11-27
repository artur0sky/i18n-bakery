# 🔧 @i18n-bakery/cli

> **The Sous-Chef** — extract, compile, inspect, and migrate translation files from the command line.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/cli.svg)](https://www.npmjs.com/package/@i18n-bakery/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

Install the CLI as a development dependency:

```bash
pnpm add -D @i18n-bakery/cli
```

Run it from the project with `pnpm exec`:

```bash
pnpm exec i18n-bakery --help
```

## Commands

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

Scans the provided path; when omitted, it scans the current working directory.

For the complete, version-specific option list, run `pnpm exec i18n-bakery <command> --help`.
