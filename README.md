# i18n-bakery
Bake your translation files like a pro. Helping you save time, so you can make yourself more sandwiches.

# 🥖 The Bakery for your Internationalization needs

This system provides an API equivalent to `i18next` (`t(key, defaultText, vars)`) but with fresh ingredients:

*   **Batter (Extraction):** Automatic extraction of texts from code (`batter` command).
*   **Bake (Compilation):** Automatic creation and update of translation files (`bake` command).
*   **Simple Recipe:** Direct and simple API.
*   **Zero-dependencies:** In the core.
*   **Namespaces:** Based on keys (like different types of bread).
*   **Lightweight:** Light integration with React.
*   **Ready to eat:** Immediate use without heavy configuration.

## 1. Installation

```bash
npm install @i18n-bakery/core
npm install @i18n-bakery/react
npm install -D @i18n-bakery/cli
```

## 2. Recommended Pantry Structure

```
locales/
  es-mx/
    common.json
    home.json
  en/
    common.json
    home.json
src/
  App.tsx
  pages/
    Home.tsx
```

Keys are automatically organized by namespace (the first segment of the key).

**Example:**

`t("home.title", "Bienvenido")`
→ creates/updates `locales/es-mx/home.json`

## 3. Main API (The Recipe)

### 3.1. Initialize (Preheat the Oven)

```typescript
import { initI18n } from "@i18n-bakery/core";

initI18n({
  locale: "es-mx",
  fallbackLocale: "en",
  loader: async (locale, ns) => {
    return import(`/locales/${locale}/${ns}.json`);
  }
});
```

### 3.2. Traducir texto (Taste Test)

```typescript
t("home.hello", "Hola mundo");
```

**Behavior:**

*   If `locales/es-mx/home.json` exists → returns translation.
*   If it doesn't exist, it automatically creates the file and adds:

    ```json
    {
      "hello": "Hola mundo"
    }
    ```

Supports interpolation:

`t("home.welcome", "Bienvenido {{name}}", { name: "Arturo" });`

## 4. Usage in React

### 4.1. Provider

```typescript
import { I18nProvider } from "@i18n-bakery/react";

<I18nProvider locale="es-mx">
  <App />
</I18nProvider>
```

### 4.2. Hook

```typescript
import { useTranslation } from "@i18n-bakery/react";

const Home = () => {
  const t = useT();
  return <h1>{t("home.title", "Inicio")}</h1>;
};
```

## 5. CLI: The Bakery

The CLI scans your `src/` looking for `t(key, default)` and prepares your translation files.

### 5.1. Batter (Mix Ingredients / Extract)

Equivalent to `makemessages` in Django or `extract` in other tools.

```bash
npx i18n-bakery batter src --locale es-mx
```

**Actions:**

*   Detects all keys used in the code.
*   Extracts the default text.
*   Generates JSONs organized by namespace.
*   Marks orphan keys.
*   Does not overwrite existing translations.

### 5.2. Bake (Cook / Compile)

Equivalent to `compilemessages` in Django. Prepares files for production (minification, validation, etc.).

```bash
npx i18n-bakery bake
```

### 5.3. Example Output

```
✓ Mixing ingredients...
✓ New key found: home.hello → "Hola"
✓ New key found: orders.total → "Total: {{amount}}"
✓ Batter ready! 🥯
```

## 6. Recommended Conventions

### 6.1. Semantic Keys

*   `orders.total`
*   `home.title`
*   `nav.profile`

**Pros:**

*   Readable.
*   Simple debugging.
*   Easy maintenance.

### 6.2. Files per Namespace

*   `locales/es-mx/home.json`
*   `locales/es-mx/orders.json`

**Reasons:**

*   Lazy-loading.
*   Better scalability.
*   Similar to i18next.

## 7. Intelligent Fallback

If the key is missing:

*   Searches in `fallbackLocale`.
*   If not found, returns `defaultText`.
*   And automatically adds it to the current language JSON file.

## 8. Interpolation

**Format:**

`"Bienvenido {{user.name}}, tienes {{count}} mensajes"`

**Replacement:**

```typescript
t("msg.welcome", "...", {
  user: { name: "Arturo" },
  count: 5
});
```

## 9. Development Mode: Automatic Baking

When the runtime detects an unregistered key:

*   Creates the namespace file if it doesn't exist.
*   Adds the key using the default text.
*   Automatically reorders and formats with Prettier if available.

This allows working without running the CLI constantly.

## 10. Compatibility with i18next (Drop-in)

This system is equivalent in behavior to:

`i18n.t("ns:key", defaultValue, vars);`

**Supports:**

*   Automatic namespacing.
*   Fallback.
*   Loaders.
*   Interpolation.
*   React Hooks.
*   JSON per language.

**And eliminates:**

*   Heavy configuration.
*   Large dependencies.
*   Complex detection plugins.

## 11. Migration from i18next

**Steps:**

1.  Copy your current files to `locales/<locale>/`.
2.  Rename files according to namespace.
3.  Replace usage:

    ```typescript
    import { t } from "i18next";
    ```

    with:

    ```typescript
    import { t } from "@i18n-bakery/core";
    ```

4.  Run once:

    ```bash
    npx i18n-bakery batter src --locale es-mx
    ```

5.  Check missing keys.

## 12. Repository Structure

```
/packages
  /core
    index.ts
    runtime.ts
    loader.ts
    store.ts
  /react
    provider.tsx
    hook.ts
  /cli
    index.ts
    batter.ts  <-- Extractor
    bake.ts    <-- Compiler
/locales
/examples
/docs
```

## 13. Future Extensions

*   ICU style Plurals.
*   RTL Support.
*   Automatic browser language detection.
*   Integration with frameworks (Next.js, Remix, Expo).
*   Orphan key validation.
*   Web panel for translating (The Bakery Shop).