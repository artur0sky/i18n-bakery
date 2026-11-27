# ⚛️ @i18n-bakery/react

> **"The React Waiter"** — delivers translations from `@i18n-bakery/core` to React components through a provider and hooks.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/react.svg)](https://www.npmjs.com/package/@i18n-bakery/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation (Gathering Ingredients)

```bash
pnpm add @i18n-bakery/core @i18n-bakery/react
```

React `16.8` or newer is required.

---

## 🚀 Quick Start (Preheating the Oven)

### 1. Initialize i18n (Preheat the Oven)

`I18nProvider` accepts the Core configuration in its `config` prop. Keep the object stable so a rerender does not reinitialize the shared service.

```tsx
import { I18nProvider, useTranslation } from '@i18n-bakery/react'

const i18nConfig = {
  locale: 'en',
  fallbackLocale: 'en',
  defaultNamespace: 'common',
}
```

### 2. Wrap Your App (The Provider)

```tsx
function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <HomePage />
    </I18nProvider>
  )
}
```

### 3. Use Translations (Serve Fresh)

`useTranslation()` returns a tuple and named properties; destructure `t` from the returned object:

```tsx
function HomePage() {
  const { t } = useTranslation()
  return <h1>{t('title', 'Welcome to our bakery!')}</h1>
}
```

---

## 🎯 Core Features (The Menu)

### 1. useTranslation Hook (The Main Ingredient)

```tsx
function Greeting({ name }: { name: string }) {
  const { t } = useTranslation()
  return <p>{t('greeting', 'Hello, {{name}}!', { name })}</p>
}
```

The hook subscribes to Core updates. Its return value is `[t, i18n, ready]` and also exposes `.t`, `.i18n`, and `.ready` properties; the value itself is not a callable function.

### 2. Namespace Prefix (Organized Ingredients)

```tsx
function AuthTitle() {
  const { t } = useTranslation('auth')
  return <h1>{t('login.title', 'Sign in')}</h1>
}
```

The hook prefixes keys with `auth:` unless the key already contains a colon.

### 3. useI18n Hook (The Full Toolkit)

```tsx
function LanguageSwitcher() {
  const { i18n, locale, setLocale, isLoading } = useI18n()

  return (
    <button disabled={isLoading} onClick={() => void setLocale('es')}>
      {locale}
    </button>
  )
}
```

`useI18n()` returns the Core instance, current locale, `setLocale`, and `isLoading`.

### 4. Reactive Updates (Fresh from the Oven)

Components using the hooks rerender when the locale changes or translations are added to the Core service.

```tsx
function Header() {
  const { t } = useTranslation()
  const { setLocale } = useI18n()

  return (
    <header>
      <h1>{t('app:title', 'My App')}</h1>
      <button onClick={() => void setLocale('es')}>Español</button>
    </header>
  )
}
```

---

## 📚 API Reference (Recipe Cards)

### Components

#### `<I18nProvider config={config}>`

Provides the Core instance to the React tree. `config` is an `I18nConfig`; it is not a `locale` string prop.

```tsx
<I18nProvider config={i18nConfig}>
  <App />
</I18nProvider>
```

### Hooks

#### `useTranslation(namespace?: string)`

Returns `[t, i18n, ready]` with equivalent `.t`, `.i18n`, and `.ready` properties. `ready` currently starts as `true`; it does not track completion of asynchronous namespace loading.

```tsx
const { t, i18n, ready } = useTranslation()
```

Or use the tuple form:

```tsx
const [translate, service, isReady] = useTranslation()
```

#### `useI18n()`

Returns `{ i18n, locale, setLocale, isLoading }`.

```typescript
import type { I18nService } from '@i18n-bakery/core'

interface I18nContext {
  i18n: I18nService
  locale: string
  setLocale(locale: string): Promise<void>
  isLoading: boolean
}
```

---

## 🎨 Usage Patterns (Sample Recipes)

### Pattern 1: Simple Component

```tsx
function WelcomeMessage() {
  const { t } = useTranslation()
  return <h1>{t('welcome.title', 'Welcome!')}</h1>
}
```

### Pattern 2: With Variables

```tsx
function UserGreeting({ name }: { name: string }) {
  const { t } = useTranslation()
  return <p>{t('user.greeting', 'Hello, {{name}}!', { name })}</p>
}
```

### Pattern 3: With Pluralization

```tsx
function Cart({ count }: { count: number }) {
  const { t } = useTranslation()
  // Configure pluralization and add the matching forms in Core.
  return <p>{t('cart:items', { count })}</p>
}
```

### Pattern 4: Namespaced Component

```tsx
function LoginForm() {
  const { t } = useTranslation('auth')

  return (
    <form>
      <h2>{t('login.title', 'Sign in')}</h2>
      <label>
        {t('login.email', 'Email')}
        <input type="email" />
      </label>
      <label>
        {t('login.password', 'Password')}
        <input type="password" />
      </label>
      <button type="submit'>{t('login.submit', 'Log in')}</button>
      <a href="/register">{t('register.link', 'Create an account')}</a>
    </form>
  )
}
```

### Pattern 5: Language Switcher

```tsx
function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  return (
    <select value={locale} onChange={(event) => void setLocale(event.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  )
}
```

### Pattern 6: With ICU MessageFormat

Configure Core with `messageFormat: 'icu'` before using ICU patterns:

```tsx
function Notification({ count }: { count: number }) {
  const { t } = useTranslation()
  return (
    <p>
      {t(
        'notification:message',
        '{count, plural, one {# new message} other {# new messages}}',
        { count }
      )}
    </p>
  )
}
```

### Pattern 7: With Number Formatting Plugin

Register `new NumberFormatPlugin()` in the Core config passed to `I18nProvider`; the React package does not enable it automatically.

```tsx
import { useTranslation } from '@i18n-bakery/react'
import { NumberFormatPlugin } from '@i18n-bakery/core'

const i18nConfig = {
  locale: 'en-US',
  plugins: [new NumberFormatPlugin()],
}

function ProductCard({
  amount,
  views,
  discount,
}: {
  amount: number
  views: number
  discount: number
}) {
  const { t } = useTranslation()
  return (
    <article>
      <p>{t('product:price', 'Price: {amount|currency:USD}', { amount })}</p>
      <p>{t('product:views', '{count|compact} views', { count: views })}</p>
      <p>{t('product:discount', 'Save {percent|percent}!', { percent: discount })}</p>
    </article>
  )
}
```

---

## 🏗️ Advanced Usage (The Kitchen)

### Custom Provider Setup

Create the Core loader and other runtime options in an `I18nConfig`, then pass that config to the provider. `loader` is an object with a `load(locale, namespace)` method:

```tsx
const i18nConfig = {
  locale: 'en',
  defaultNamespace: 'common',
  loader: {
    async load(locale: string, namespace: string) {
      if (locale === 'en' && namespace === 'common') {
        return { title: 'Welcome' }
      }
      return null
    },
  },
}
```

See [`@i18n-bakery/core`](../core) for the complete loader contract.

### With TypeScript

```tsx
import { useTranslation, useI18n } from '@i18n-bakery/react'

interface UserProps {
  name: string
}

function UserProfile({ name }: UserProps) {
  const { t } = useTranslation('profile')
  const { locale } = useI18n()
  return <p>{t('greeting', 'Hello, {{name}}!', { name })} ({locale})</p>
}
```

### With React Router

Wrap the router with `I18nProvider` and pass a Core config:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from '@i18n-bakery/react'

function App() {
  return (
    <I18nProvider config={i18nConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}
```

---

## 🧪 Testing (Quality Control)

Render components under the provider with a Core config:

```tsx
import { render, screen } from '@testing-library/react'
import { I18nProvider, useTranslation } from '@i18n-bakery/react'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('title', 'Test Title')}</h1>
}

render(
  <I18nProvider config={{ locale: 'en' }}>
    <MyComponent />
  </I18nProvider>
)

expect(screen.getByText('Test Title')).toBeTruthy()
```

---

## 🔗 Related Packages (Kitchen Staff)

- **[@i18n-bakery/core](../core)** — Core translation engine and configuration.
- **[@i18n-bakery/cli](../cli)** — command-line tools.

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

**⚛️ React bindings for your internationalization bakery**

_Made with 🍩 and React Hooks_

</div>
