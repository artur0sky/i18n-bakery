# Kitchen Tools (CLI)

The `@i18n-bakery/cli` package helps you automate your baking workflow, ensuring no ingredient is left behind.

## Commands

### `batter` (Mix / Extract)

Scans your source code for `t()` calls and extracts keys to JSON files. It's like mixing the batter before baking.

```bash
i18n-bakery batter src --out locales --locale en
```

**Options:**
- `--out <dir>`: Output pantry for JSON files (default: `locales`).
- `--locale <locale>`: Target flavor (default: `en`).

### `bake` (Cook / Compile)

Compiles multiple namespace JSON files into a single bundle for production. This is the final step before serving.

```bash
i18n-bakery bake locales --out dist/locales
```

**Options:**
- `--out <dir>`: Output display case for compiled bundles.
