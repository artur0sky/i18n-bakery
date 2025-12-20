# 🥚 @i18n-bakery/poacher

> **"The Forager"** - _Ventures into the wild (legacy code) to recover valuable ingredients (keys) and bring them back to the safety of the bakery._

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/poacher.svg)](https://www.npmjs.com/package/@i18n-bakery/poacher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 The Story

Transitioning from an old kitchen (like i18next) to a modern bakery can be daunting. You have thousands of "recipes" (keys) scattered across mismatched containers (JSON files).

Meet **The Forager**. This tool specializes in hunting down existing translations, understanding their structure (flat, nested, chaotic), and carefully transporting them into the pristine, standardized containers of **i18n-bakery**.

## 🚀 Features (Foraging Skills)

- **🕵️‍♀️ Recipe Scout:** Scans your source code using AST parsing (`BabelKeyExtractor`) to find every usage of `t('key')` and identifying default values.
- **🔄 Universal Converter:** Reads legacy JSON structures (flat, nested, namespaced, mixed) and normalizes them into Bakery standards.
- **🛡️ Safety First:** Always creates a full backup of your `locales` folder before touching diverse ingredients.
- **📊 Export for Review:** Can export your translation spread to CSV (`serve` command) so you can audit what you have.

## 📦 Installation

This tool belongs in your dev-dependencies belt:

```bash
pnpm add -D @i18n-bakery/poacher
# or
npm install -D @i18n-bakery/poacher
```

## 🛠️ Usage (Hunting Techniques)

Poacher provides a CLI interface under the command `poacher`.

### 1. Poach (The Migration)

Migrate from a legacy folder to a Bakery-compatible structure.

```bash
npx poacher poach ./src/legacy-locales ./src/locales
```

**Options:**
- `--dry-run`: Simulate the hunt without gathering anything. Logs what would happen.
- `--verbose`: Detailed accounts of every key found.

**Behavior:**
- Automatically detects if source files are flat (`key.subkey`) or nested objects.
- Promotes top-level objects in flat files to Namespaces (files) in Bakery.
    - _Example:_ `legacy/en.json` contains `{ "auth": { "login": "..." } }`.
    - _Result:_ `locales/en/auth.json` is created.

### 2. Scout (The Analysis)

Analyze your source code to see what keys are currently being requested by the chefs.

```bash
npx poacher scout ./src
```

**What it does:**
- Parses `.js`, `.ts`, `.jsx`, `.tsx` files.
- Identifies `t('namespace:key')` patterns.
- Reports missing keys or discrepancies vs your JSON files.

### 3. Serve (The Export)

Serve your gathered ingredients in a format easy for humans to digest (CSV).

```bash
npx poacher serve ./src/locales --format csv --out ./review.csv
```

## 📖 Examples (Field Notes)

### Scenario 1: The "Spaghetti" Migration (Nested to Bakery)
You have a legacy `locales` folder where every file is a mix of deep nesting.

**Legacy Structure:**
```
locales/en/translation.json  -> { "auth": { "errors": { "generic": "Error" } } }
```

**Command:**
```bash
npx poacher poach ./legacy-locales ./src/new-locales
```

**Result (Bakery Style):**
Poacher intelligently splits this into namespaced files for better organization:
```
locales/en/auth.json -> { "errors": { "generic": "Error" } }
```

### Scenario 2: The "Missing Keys" Hunt
Your chefs (developers) added `t('new.feature')` in the code but forgot to add it to the JSONs.

**Command:**
```bash
npx poacher scout ./src
```

**Output:**
```
MISSING KEYS FOUND:
[en] new.feature (in src/components/Feature.tsx)
```

### Scenario 3: Exporting for the Content Team
The content team wants to review all translations in Excel.

**Command:**
```bash
npx poacher serve ./src/locales --format csv > translations.csv
```
**Output (`translations.csv`):**
```csv
key,en,es
auth.login,Login,Iniciar Sesión
auth.logout,Logout,Cerrar Sesión
```

## ⚠️ Warnings (Kitchen Safety)

- **Backup:** While Poacher creates backups, always commit your code to Git before running valid migrations.
- **Pluralization:** Poacher copies values _as-is_. If you use `{{count}}` syntax from i18next, it works in Bakery! But if you use complex `v1`, `v2` nesting typical of older i18n libs, verify them manually.
- **Overwrite:** By default, Poacher overwrites keys in the target logic if they collide, but preserve old files in a backup folder.

## 🤝 Integration

Poacher is designed to be run once (or fully) during migration. Once you are migrated, you typically hand over duties to **The Sous-Chef (@i18n-bakery/cli)** for daily operations.

---
_Part of the [i18n-bakery](https://github.com/artur0sky/i18n-bakery) suite._
