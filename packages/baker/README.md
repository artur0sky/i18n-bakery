# 🥯 @i18n-bakery/baker

**The Master Baker for i18n-bakery.**

This package contains the heavy-lifting machinery for the i18n-bakery ecosystem. It handles all build-time operations, file system interactions, and complex logic that shouldn't be in the lightweight runtime core.

## 🎯 Purpose

- **Build-Time Logic**: Keeps the `@i18n-bakery/core` package lightweight (0 dependencies).
- **File System Operations**: Handles reading, writing, and managing translation files.
- **Extraction**: Parses source code to find translation keys (`t()` calls).
- **Compilation ("Baking")**: Optimizes translation files for production (minification, hashing, splitting).
- **Encryption**: Secures translation files using AES-256-GCM.

## 📦 Features

### 1. Key Extraction (`KeyExtractor`)

Uses Babel to parse TypeScript/JavaScript files and extract translation keys, default values, and namespaces.

```typescript
import { BabelKeyExtractor } from "@i18n-bakery/baker";

const extractor = new BabelKeyExtractor();
const keys = await extractor.extractFromFile("src/components/Button.tsx");
```

### 2. Baking & Compilation (`BakingManager`)

Compiles translation files into production-ready assets.

- **Minification**: Reduces file size.
- **Hashing**: Adds content hashes for cache busting (`common.a1b2c3.json`).
- **Splitting**: Splits bundles by namespace for lazy loading.
- **Encryption**: Encrypts content with a secret key.

```typescript
import { BakingManager } from "@i18n-bakery/baker";

const baker = new BakingManager();
await baker.bake("src/locales", {
  out: "dist/locales",
  minify: true,
  hash: true,
  split: true,
  encrypt: true,
  key: process.env.I18N_SECRET,
});
```

### 3. File Management (`TranslationFileManager`)

Manages the creation and updating of translation files, preserving existing values and structure.

- **Auto-creation**: Automatically creates missing files and keys.
- **Merging**: Smart merging of new keys without overwriting existing translations.
- **Variable Detection**: Detects variables in translation strings.
- **Multiple Formats**: Support for JSON and TOML file formats.

### 4. TOML Format Support

Full support for TOML (Tom's Obvious, Minimal Language) format with zero external dependencies.

- **Zero Dependencies**: Pure TypeScript TOML parser and serializer.
- **TOML v1.0.0 Compliant**: Follows the official specification.
- **Security First**: Built-in prototype pollution prevention.
- **Nested & Flat Structures**: Support for both file organization styles.

See [TOML_SUPPORT.md](./TOML_SUPPORT.md) for detailed documentation.

```typescript
import { TOMLFileWriter, TOMLFileSaver } from "@i18n-bakery/baker";

// Use TOML writer
const writer = new TOMLFileWriter(fsManager);
await writer.write("./locales/en/common.toml", content);

// Or use simple saver
const saver = new TOMLFileSaver("./locales", "nested");
await saver.save("en", "common", "title", "Welcome");
```

## 🛠️ Architecture

This package follows **Clean Architecture** principles:

- **Domain**: Core interfaces and business logic rules.
- **Use Cases**: Application-specific business rules (`BakingManager`, `TranslationFileManager`).
- **Adapters**: Concrete implementations (`BabelKeyExtractor`, `JSONFileSaver`, `TOMLFileSaver`, `TOMLFileWriter`, `NodeFileSystemManager`).

## 📦 Installation

```bash
npm install @i18n-bakery/baker
# or
pnpm add @i18n-bakery/baker
```

## 🤝 Dependencies

- `@i18n-bakery/core`: Shared types and logic.
- `fs-extra`: Enhanced file system operations.
- `glob`: File pattern matching.
- `@babel/parser`, `@babel/traverse`: AST parsing for extraction.
