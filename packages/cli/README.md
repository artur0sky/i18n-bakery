# Kitchen Tools (CLI) 🥣

The `@i18n-bakery/cli` package provides professional tools to automate your baking workflow. No more kneading dough by hand!

## 📋 Tools

- **batter**: Scans your source code (`.ts`, `.tsx`, `.js`, `.jsx`) and extracts translation keys automatically.
- **bake**: Compiles scattered JSON files into single, production-ready bundles.

## 👩‍🍳 Usage

### Mixing the Batter (Extraction)

```bash
i18n-bakery batter src --out locales --locale en
```

### Baking (Compilation)

```bash
i18n-bakery bake locales --out dist/locales
```

## 📦 Installation

```bash
pnpm add -D @i18n-bakery/cli
```
