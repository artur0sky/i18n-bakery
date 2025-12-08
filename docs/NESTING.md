# 🥯 Nesting Guide (The Layer Cake)

> *"Like a multi-layered cake, good translations have structure and depth."*

i18n-bakery supports **Nesting** in two powerful ways:
1.  **Nested Keys** (Objects within files) - Like ingredients inside a layer.
2.  **Hierarchical Namespaces** (Folders within folders) - Like stacking cake layers.

---

## 1. Nested Keys (The Filling)

You can organize translations within a single JSON file using nested objects. Access them using **dot notation**.

### 📝 The Recipe (Code)

```typescript
// Accessing a nested property
t('common:errors.not_found');

// Accessing deeper nesting
t('common:menu.items.dessert.cake');
```

### 📂 The Oven (JSON File)

`locales/en-US/common.json`:
```json
{
  "errors": {
    "not_found": "Page not found"
  },
  "menu": {
    "items": {
      "dessert": {
        "cake": "Chocolate Cake"
      }
    }
  }
}
```

### ⚡ Why use it?
- Groups related translations together (e.g., all errors, all menu items).
- Keeps files organized and readable.
- Reduces key duplication (DRY).

---

## 2. Hierarchical Namespaces (The Tiers)

For larger applications, you can organize translation files into **nested directories**. Access them using **multiple colons**.

### 📝 The Recipe (Code)

```typescript
// home/hero.json -> title
t('home:hero:title');

// features/auth/login.json -> submit
t('features:auth:login:submit');
```

### 📂 The Pantry (File Structure)

```
locales/
├── en-US/
│   ├── home/
│   │   └── hero.json       // { "title": "Hero Title" }
│   ├── features/
│   │   └── auth/
│   │       └── login.json  // { "submit": "Login" }
│   └── common.json
```

### ⚡ Why use it?
- Splits large translation files into smaller, manageable chunks.
- Mirrors your component/feature structure.
- Lazy loads only what you need (with `HttpBackend`).

---

## 3. Deep Nesting (The Wedding Cake)

You can combine both techniques for ultimate organization!

### 📝 The Recipe (Code)

```typescript
// Namespace: home/hero (folder/file)
// Key: buttons.primary.label (nested object)
t('home:hero:buttons.primary.label');
```

### 📂 The Result

`locales/en-US/home/hero.json`:
```json
{
  "buttons": {
    "primary": {
      "label": "Get Started"
    }
  }
}
```

---

## 🛠️ How it Works (The Science)

i18n-bakery uses a smart parsing logic to determine where to look:

1.  **Split by Colon (`:`)**: The string is split into parts.
    - The **last part** is treated as the **Key**.
    - **All previous parts** are joined with slashes (`/`) to form the **Namespace**.
2.  **Split Key by Dot (`.`)**: The Key is traversed to find the value in the JSON object.

**Example:** `t('app:features:settings:profile.form.email')`

1.  **Namespace:** `app/features/settings` (File: `locales/en/app/features/settings.json`)
2.  **Key:** `profile.form.email` (Object path)

```json
// locales/en/app/features/settings.json
{
  "profile": {
    "form": {
      "email": "Email Address"
    }
  }
}
```

---

## 🍪 CLI Support (The Tools)

Our CLI tools (`batter` and `bake`) fully support nesting!

### Extraction (`batter`)
When you run `pnpm i18n:extract`, the CLI automatically:
- Detects nested namespaces (e.g., `home:hero:title`).
- Creates the necessary directory structure (`locales/en/home/hero.json`).
- Writes nested keys as objects (unless configured otherwise).

### Compilation (`bake`)
When you run `pnpm i18n:bake`, the CLI:
- Recursively finds all JSON files (`**/*.json`).
- Preserves the directory structure in the output.
- Generates a manifest mapping nested paths to hashed filenames (if hashing is enabled).

---

## ⚛️ React Integration

The `useTranslation` hook is smart enough to handle nesting too!

```tsx
// Load a nested namespace
const { t } = useTranslation('home:hero');

// Use keys relative to that namespace
<h1>{t('title')}</h1>           // -> home:hero:title
<button>{t('cta.label')}</button> // -> home:hero:cta.label
```

---

*Happy Baking!* 🥯
