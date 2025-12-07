# 🔧 @i18n-bakery/cli

> *"Professional kitchen tools for your translation bakery. Automate extraction, compilation, and maintenance."*

Command-line tools for **i18n-bakery** - your automated baker's assistant. Extract translation keys from your codebase, compile translation files, validate consistency, and maintain your translation pantry with ease.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/cli.svg)](https://www.npmjs.com/package/@i18n-bakery/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation

```bash
npm install -D @i18n-bakery/cli
# or
pnpm add -D @i18n-bakery/cli
# or
yarn add -D @i18n-bakery/cli
```

> **Note:** Install as a dev dependency since it's a build tool.

---

## 🚀 Quick Start

### 1. Extract Keys (Batter)

Scan your codebase and extract all translation keys:

```bash
npx i18n-bakery batter src --locale en
```

This will:
- 🔍 Find all `t()` calls in your code
- 📝 Extract keys and default values
- 📁 Create/update JSON files organized by namespace
- ✨ Never overwrite existing translations

### 2. Compile for Production (Bake)

Prepare your translations for production:

```bash
npx i18n-bakery bake
```

This will:
- ✅ Validate all translation files
- 🗜️ Minify JSON for production
- 🧹 Remove orphaned keys (optional)
- 📊 Generate reports

---

## 🎯 Commands

### `batter` - Extract & Mix Ingredients

> *"Like a mixer that knows exactly what ingredients you need."*

Scans your source code and extracts translation keys.

#### Basic Usage

```bash
npx i18n-bakery batter <source-dir> --locale <locale>
```

#### Options

```bash
npx i18n-bakery batter src --locale en [options]

Options:
  --locale, -l <locale>     Target locale (required)
  --output, -o <dir>        Output directory (default: ./locales)
  --extensions, -e <exts>   File extensions to scan (default: ts,tsx,js,jsx)
  --pattern, -p <pattern>   Glob pattern for files to scan
  --namespace, -n <ns>      Default namespace (default: common)
  --format, -f <format>     Output format (default: json)
  --structure, -s <type>    File structure: nested or flat (default: nested)
  --dry-run                 Show what would be extracted without writing files
  --verbose, -v             Verbose output
  --help, -h                Show help
```

#### Examples

**Basic extraction:**
```bash
npx i18n-bakery batter src --locale en
```

**Custom output directory:**
```bash
npx i18n-bakery batter src --locale en --output ./public/locales
```

**Specific file extensions:**
```bash
npx i18n-bakery batter src --locale en --extensions ts,tsx
```

**Custom glob pattern:**
```bash
npx i18n-bakery batter src --locale en --pattern "**/*.{ts,tsx}"
```

**Flat file structure:**
```bash
npx i18n-bakery batter src --locale en --structure flat
```

**Dry run (preview):**
```bash
npx i18n-bakery batter src --locale en --dry-run
```

#### What It Detects

The `batter` command finds all `t()` function calls:

```typescript
// Simple translation
t('home.title', 'Welcome');
// ✓ Extracts: { key: 'home.title', default: 'Welcome' }

// With variables
t('greeting', 'Hello, {{name}}!', { name: 'World' });
// ✓ Extracts: { key: 'greeting', default: 'Hello, {{name}}!' }

// With namespace
t('auth:login.button', 'Sign In');
// ✓ Extracts: { key: 'auth:login.button', default: 'Sign In' }

// With pluralization
t('items', { count: 5 });
// ✓ Extracts: { key: 'items', requiresPlural: true }

// ICU MessageFormat
t('cart', '{count, plural, one {# item} other {# items}}', { count: 1 });
// ✓ Extracts: { key: 'cart', default: '{count, plural, one {# item} other {# items}}' }
```

#### Output Example

```bash
$ npx i18n-bakery batter src --locale en

🥯 i18n-bakery - Mixing ingredients...

📁 Scanning: src/
🔍 Found 127 translation keys

📝 Creating/updating files:
  ✓ locales/en/common.json (45 keys)
  ✓ locales/en/auth.json (12 keys)
  ✓ locales/en/home.json (23 keys)
  ✓ locales/en/cart.json (18 keys)
  ✓ locales/en/profile.json (29 keys)

✨ Batter ready! 🥯
```

---

### `bake` - Compile & Optimize

> *"Transform raw ingredients into perfectly baked translations."*

Compiles and optimizes translation files for production.

#### Basic Usage

```bash
npx i18n-bakery bake
```

#### Options

```bash
npx i18n-bakery bake [options]

Options:
  --input, -i <dir>         Input directory (default: ./locales)
  --output, -o <dir>        Output directory (default: ./dist/locales)
  --minify, -m              Minify JSON output (default: true)
  --validate, -v            Validate translations (default: true)
  --remove-orphans          Remove unused keys (default: false)
  --report, -r              Generate report (default: true)
  --format, -f <format>     Output format (default: json)
  --help, -h                Show help
```

#### Examples

**Basic compilation:**
```bash
npx i18n-bakery bake
```

**Custom directories:**
```bash
npx i18n-bakery bake --input ./public/locales --output ./build/locales
```

**With orphan removal:**
```bash
npx i18n-bakery bake --remove-orphans
```

**Skip minification:**
```bash
npx i18n-bakery bake --no-minify
```

**Generate detailed report:**
```bash
npx i18n-bakery bake --report
```

#### What It Does

1. **Validates** all translation files
   - Checks JSON syntax
   - Validates key structure
   - Detects missing variables
   - Finds duplicate keys

2. **Optimizes** for production
   - Minifies JSON (removes whitespace)
   - Sorts keys alphabetically
   - Removes comments
   - Validates ICU syntax

3. **Cleans** (if enabled)
   - Removes orphaned keys
   - Removes empty namespaces
   - Consolidates duplicates

4. **Reports** translation status
   - Total keys per locale
   - Missing translations
   - Orphaned keys
   - Coverage percentage

#### Output Example

```bash
$ npx i18n-bakery bake

🥯 i18n-bakery - Baking translations...

📁 Input: ./locales
📁 Output: ./dist/locales

✅ Validating translations...
  ✓ en: 127 keys (100% complete)
  ✓ es: 115 keys (90.6% complete)
  ✓ fr: 98 keys (77.2% complete)

🗜️ Minifying JSON...
  ✓ Reduced size by 42%

📊 Generating report...
  ✓ Report saved to: ./dist/i18n-report.json

✨ Baking complete! 🥯

Summary:
  Locales: 3 (en, es, fr)
  Total keys: 127
  Output size: 45.2 KB
  Time: 1.2s
```

---

## 📊 Reports

The CLI can generate detailed reports about your translations:

### Report Structure

```json
{
  "timestamp": "2025-12-07T06:30:00.000Z",
  "locales": ["en", "es", "fr"],
  "totalKeys": 127,
  "summary": {
    "en": {
      "keys": 127,
      "coverage": 100,
      "namespaces": ["common", "auth", "home", "cart", "profile"],
      "size": "18.5 KB"
    },
    "es": {
      "keys": 115,
      "coverage": 90.6,
      "missing": 12,
      "namespaces": ["common", "auth", "home", "cart", "profile"],
      "size": "17.2 KB"
    },
    "fr": {
      "keys": 98,
      "coverage": 77.2,
      "missing": 29,
      "namespaces": ["common", "auth", "home", "cart"],
      "size": "15.8 KB"
    }
  },
  "missingKeys": {
    "es": [
      "profile.settings.title",
      "profile.settings.description",
      // ...
    ],
    "fr": [
      "profile.settings.title",
      "profile.bio.placeholder",
      // ...
    ]
  },
  "orphanedKeys": [
    "old.unused.key",
    "deprecated.feature.title"
  ]
}
```

---

## 🔧 Configuration File

Create a configuration file for consistent builds:

### `i18n-bakery.config.js`

```javascript
module.exports = {
  // Batter (extraction) config
  batter: {
    sourceDir: 'src',
    outputDir: './locales',
    defaultLocale: 'en',
    extensions: ['ts', 'tsx', 'js', 'jsx'],
    pattern: '**/*.{ts,tsx,js,jsx}',
    structure: 'nested', // or 'flat'
    exclude: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**']
  },
  
  // Bake (compilation) config
  bake: {
    inputDir: './locales',
    outputDir: './dist/locales',
    minify: true,
    validate: true,
    removeOrphans: false,
    generateReport: true,
    reportPath: './dist/i18n-report.json'
  },
  
  // Validation rules
  validation: {
    checkVariables: true,
    checkPlurals: true,
    checkICU: true,
    allowEmptyValues: false
  }
};
```

### Using the Config File

```bash
# Automatically uses i18n-bakery.config.js
npx i18n-bakery batter
npx i18n-bakery bake
```

---

## 🎨 Integration Examples

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "i18n:extract": "i18n-bakery batter src --locale en",
    "i18n:extract:all": "i18n-bakery batter src --locale en && i18n-bakery batter src --locale es && i18n-bakery batter src --locale fr",
    "i18n:build": "i18n-bakery bake",
    "i18n:validate": "i18n-bakery bake --no-minify --validate",
    "i18n:clean": "i18n-bakery bake --remove-orphans",
    "prebuild": "npm run i18n:build"
  }
}
```

### CI/CD Pipeline

#### GitHub Actions

```yaml
name: i18n Validation

on: [push, pull_request]

jobs:
  validate-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Extract translations
        run: npm run i18n:extract
      
      - name: Validate translations
        run: npm run i18n:validate
      
      - name: Check for missing translations
        run: |
          if [ -f dist/i18n-report.json ]; then
            node scripts/check-translation-coverage.js
          fi
```

### Pre-commit Hook

Using `husky`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run i18n:extract && git add locales/"
    }
  }
}
```

---

## 🛠️ Advanced Usage

### Custom Extraction Script

```javascript
// scripts/extract-i18n.js
const { exec } = require('child_process');
const fs = require('fs');

const locales = ['en', 'es', 'fr', 'de', 'ja'];

async function extractAll() {
  console.log('🥯 Extracting translations for all locales...\n');
  
  for (const locale of locales) {
    console.log(`📝 Extracting ${locale}...`);
    
    await new Promise((resolve, reject) => {
      exec(
        `npx i18n-bakery batter src --locale ${locale}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error extracting ${locale}:`, error);
            reject(error);
          } else {
            console.log(stdout);
            resolve();
          }
        }
      );
    });
  }
  
  console.log('\n✨ All translations extracted!');
}

extractAll().catch(console.error);
```

### Translation Coverage Check

```javascript
// scripts/check-translation-coverage.js
const fs = require('fs');
const path = require('path');

const REQUIRED_COVERAGE = 90; // 90%

const report = JSON.parse(
  fs.readFileSync('./dist/i18n-report.json', 'utf-8')
);

let failed = false;

for (const [locale, data] of Object.entries(report.summary)) {
  if (locale === 'en') continue; // Skip base locale
  
  if (data.coverage < REQUIRED_COVERAGE) {
    console.error(
      `❌ ${locale}: ${data.coverage}% coverage (required: ${REQUIRED_COVERAGE}%)`
    );
    console.error(`   Missing ${data.missing} keys`);
    failed = true;
  } else {
    console.log(
      `✅ ${locale}: ${data.coverage}% coverage`
    );
  }
}

if (failed) {
  process.exit(1);
}
```

---

## 🧪 Testing

The CLI includes comprehensive tests:

```bash
# Run CLI tests
cd packages/cli
pnpm test

# Test extraction
pnpm test -- extraction.test.ts

# Test compilation
pnpm test -- compilation.test.ts
```

---

## 🔗 Related Packages

- **[@i18n-bakery/core](../core)** - Core translation engine
- **[@i18n-bakery/react](../react)** - React bindings

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

**🔧 Professional tools for your internationalization bakery**

*Made with ❤️ and AST parsing*

</div>
