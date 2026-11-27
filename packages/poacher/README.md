# 🥚 @i18n-bakery/poacher

> **"The Forager"** — ventures into legacy JSON locale files to recover translations and bring them into the bakery.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/poacher.svg)](https://www.npmjs.com/package/@i18n-bakery/poacher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 The Story (A Forager's Tale)

Migration can be daunting when translations are scattered across files and formats. Poacher reads JSON locale files, copies their values into the i18n-bakery layout, and provides commands to inspect source keys or export translations for review.

## 🚀 Features (Foraging Skills)

- **🕵️‍♀️ Recipe Scout:** Uses the Baker AST scanner to list statically written translation calls and literal defaults.
- **🔄 JSON Migration:** Reads locale JSON files and writes nested JSON locale files through Baker.
- **📊 CSV Export:** Exports flattened JSON translation keys to CSV.
- **🛡️ Target Backup:** Copies an existing target directory before a migration writes to it.

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add -D @i18n-bakery/poacher
```

## 🛠️ Usage (Foraging Techniques)

### 1. Poach (The Migration)

```bash
pnpm exec poacher poach ./legacy-locales --target ./src/i18n/locales
```

The source can contain locale files such as `en.json`, or locale directories with immediate namespace files such as `en/common.json`. Input files are JSON; nested JSON objects are retained as nested translation data.

**Options:**

- `--target <path>`: Output directory (default: `./src/i18n/locales`).
- `--dry-run`: Read the source without creating a backup or writing translations.

If the target exists, Poacher creates a timestamped backup before writing. Existing target values are preserved when keys collide.

### 2. Scout (The Analysis)

```bash
pnpm exec poacher scout ./src
```

Scans `.js`, `.jsx`, `.ts`, and `.tsx` files for statically written `t('key')` calls. It prints unique keys and literal defaults; it does not compare the results with locale files or report missing translations. The path defaults to the current working directory.

### 3. Serve (The Export)

```bash
pnpm exec poacher serve --source ./src/i18n/locales --out ./exports/translations.csv --format csv
```

`serve` reads JSON locale files and exports flattened keys to CSV. CSV is the only supported output format. Defaults are `./src/i18n/locales` and `./exports/translations.csv`.

## 📖 Examples (Field Notes)

### Scenario 1: The "Spaghetti" Migration (Nested to Bakery)

Given `legacy-locales/en/common.json`:

```json
{
  "auth": {
    "errors": {
      "generic": "Error"
    }
  }
}
```

Poacher writes the nested values under the matching locale and namespace: `locales/en/common.json`.

### Scenario 2: The Key Inventory

```bash
pnpm exec poacher scout ./src
```

The output lists keys discovered in source. It is an inventory, not a missing-key report; use the CLI `pantry` command for completeness checks.

### Scenario 3: Exporting for the Content Team

```bash
pnpm exec poacher serve --source ./src/i18n/locales --out ./exports/translations.csv
```

The CSV contains a `key` column and one column per locale.

## ⚠️ Warnings (Kitchen Safety)

- Commit your work before migration. A backup is created only when the target directory already exists.
- Poacher copies values as-is; it does not convert pluralization or interpolation syntax between libraries.
- Existing keys in the target are preserved. Use `--dry-run` to check the source before writing.

## 🤝 Integration (The Kitchen Crew)

Poacher is useful for migrations and exports. For everyday extraction and locale maintenance, use **The Sous-Chef (`@i18n-bakery/cli`)**.

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

**🥚 Recover your legacy translations with care**

_Made with 🍩 and AST Magic_

</div>
