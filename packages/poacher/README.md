# @i18n-bakery/poacher

> "Cooking gently your legacy translations while borrowing them from foreign lands."

The **Poacher** is a specialized tool in the **i18n-bakery** suite designed to migrate, convert, and recover translations from other internationalization libraries (starting with `i18next`) into the robust `i18n-bakery` ecosystem.

## Features

- 🕵️ **Translation Discovery**: Identifies `t()` declarations across your codebase.
- 🔄 **Format Conversion**: Transforms `i18next` JSON structures (flat or nested) into Bakery's optimized structure.
- 💉 **Default Injection**: Populates translation files with default values extracted from code.
- 📤 **Export Capabilities**: Exports translations to JSON and CSV.
- 🛡️ **Safety**: Automatic backups before any operation. 

## Philosophy

Like a skilled chef poaching an egg, this tool gently handles your fragile legacy data, preserving its integrity while preparing it for a modern presentation.

## Installation

```bash
pnpm add @i18n-bakery/poacher
```

## Usage

```bash
# Analyze and logging existing translations
npx poacher scout

# Migrate from i18next to i18n-bakery
npx poacher poach --source ./locales --target ./src/i18n

# Export to CSV
npx poacher serve --format csv --out ./exports
```
