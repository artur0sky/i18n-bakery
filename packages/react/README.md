# ⚛️ @i18n-bakery/react

> *"Fresh React bindings, straight from the oven. Serve your translations with hooks and providers."*

React integration for **i18n-bakery** - bringing the power of type-safe, auto-baking translations to your React applications. Built with modern React patterns (hooks, context) and designed for both simplicity and performance.

[![npm version](https://img.shields.io/npm/v/@i18n-bakery/react.svg)](https://www.npmjs.com/package/@i18n-bakery/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Installation

```bash
npm install @i18n-bakery/core @i18n-bakery/react
# or
pnpm add @i18n-bakery/core @i18n-bakery/react
# or
yarn add @i18n-bakery/core @i18n-bakery/react
```

> **Note:** You need both `@i18n-bakery/core` and `@i18n-bakery/react` installed.

---

## 🚀 Quick Start

### 1. Initialize i18n (Preheat the Oven)

```typescript
// src/i18n.ts
import { initI18n } from '@i18n-bakery/core';

export const i18n = initI18n({
  locale: 'en',
  fallbackLocale: 'en',
  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  }
});
```

### 2. Wrap Your App (The Provider)

```tsx
// src/App.tsx
import { I18nProvider } from '@i18n-bakery/react';
import { i18n } from './i18n';

function App() {
  return (
    <I18nProvider locale="en">
      <YourComponents />
    </I18nProvider>
  );
}

export default App;
```

### 3. Use Translations (Serve Fresh)

```tsx
// src/components/HomePage.tsx
import { useTranslation } from '@i18n-bakery/react';

function HomePage() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title', 'Welcome to our bakery!')}</h1>
      <p>{t('home.subtitle', 'Fresh translations daily')}</p>
    </div>
  );
}
```

---

## 🎯 Core Features

### 1. useTranslation Hook (The Main Ingredient)

The primary hook for translating content in your components:

```tsx
import { useTranslation } from '@i18n-bakery/react';

function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      {/* Simple translation */}
      <h1>{t('title', 'Hello World')}</h1>
      
      {/* With variables */}
      <p>{t('greeting', 'Hello, {{name}}!', { name: 'Baker' })}</p>
      
      {/* With pluralization */}
      <span>{t('items', { count: 5 })}</span>
      
      {/* With namespace */}
      <button>{t('auth:login.button', 'Sign In')}</button>
    </div>
  );
}
```

### 2. Namespace Prefix (Organized Ingredients)

Scope translations to a specific namespace:

```tsx
import { useTranslation } from '@i18n-bakery/react';

function AuthPage() {
  // All translations will be prefixed with 'auth:'
  const t = useTranslation('auth');
  
  return (
    <div>
      {/* Translates 'auth:login.title' */}
      <h1>{t('login.title', 'Sign In')}</h1>
      
      {/* Translates 'auth:login.button' */}
      <button>{t('login.button', 'Login')}</button>
      
      {/* Translates 'auth:register.link' */}
      <a href="/register">{t('register.link', 'Create account')}</a>
    </div>
  );
}
```

### 3. useI18n Hook (The Full Toolkit)

Access the complete i18n instance:

```tsx
import { useI18n } from '@i18n-bakery/react';

function LanguageSwitcher() {
  const { i18n, locale } = useI18n();
  
  const changeLanguage = async (newLocale: string) => {
    await i18n.setLocale(newLocale);
  };
  
  return (
    <div>
      <p>Current language: {locale}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
    </div>
  );
}
```

### 4. Reactive Updates (Fresh from the Oven)

Components automatically re-render when the locale changes:

```tsx
import { useTranslation, useI18n } from '@i18n-bakery/react';

function Header() {
  const t = useTranslation();
  const { i18n } = useI18n();
  
  return (
    <header>
      {/* This updates automatically when locale changes */}
      <h1>{t('app.title', 'My App')}</h1>
      
      <button onClick={() => i18n.setLocale('es')}>
        Español
      </button>
    </header>
  );
}
```

---

## 📚 API Reference

### Components

#### `<I18nProvider>`

Provides i18n context to your React tree.

```tsx
interface I18nProviderProps {
  locale: string;           // Initial locale
  children: React.ReactNode; // Your app components
}

<I18nProvider locale="en">
  <App />
</I18nProvider>
```

### Hooks

#### `useTranslation(namespace?: string): TranslationFunction`

Returns a translation function.

```tsx
// Without namespace
const t = useTranslation();
t('home.title', 'Welcome');

// With namespace
const t = useTranslation('auth');
t('login.title', 'Sign In'); // → Translates 'auth:login.title'
```

**Translation Function Signature:**
```typescript
type TranslationFunction = (
  key: string,
  defaultText?: string,
  vars?: Record<string, any>
) => string;
```

#### `useI18n(): I18nContext`

Returns the i18n context.

```tsx
const { i18n, locale } = useI18n();

// Access i18n instance
i18n.setLocale('es');
i18n.getCurrentLocale();
i18n.addTranslations('en', 'common', { ... });

// Current locale
console.log(locale); // → "en"
```

**Context Interface:**
```typescript
interface I18nContext {
  i18n: I18nService;  // The i18n instance
  locale: string;     // Current locale
}
```

---

## 🎨 Usage Patterns

### Pattern 1: Simple Component

```tsx
import { useTranslation } from '@i18n-bakery/react';

function WelcomeMessage() {
  const t = useTranslation();
  
  return (
    <div className="welcome">
      <h1>{t('welcome.title', 'Welcome!')}</h1>
      <p>{t('welcome.message', 'Thank you for visiting our bakery.')}</p>
    </div>
  );
}
```

### Pattern 2: With Variables

```tsx
import { useTranslation } from '@i18n-bakery/react';

function UserGreeting({ user }: { user: { name: string; email: string } }) {
  const t = useTranslation();
  
  return (
    <div>
      <h2>{t('user.greeting', 'Hello, {{name}}!', { name: user.name })}</h2>
      <p>{t('user.email', 'Email: {{email}}', { email: user.email })}</p>
    </div>
  );
}
```

### Pattern 3: With Pluralization

```tsx
import { useTranslation } from '@i18n-bakery/react';

function ShoppingCart({ items }: { items: any[] }) {
  const t = useTranslation();
  const itemCount = items.length;
  
  return (
    <div>
      <h2>{t('cart.title', 'Shopping Cart')}</h2>
      <p>{t('cart.items', { count: itemCount })}</p>
      {/* → "0 items" | "1 item" | "5 items" */}
    </div>
  );
}
```

### Pattern 4: Namespaced Component

```tsx
import { useTranslation } from '@i18n-bakery/react';

function LoginForm() {
  // All translations scoped to 'auth' namespace
  const t = useTranslation('auth');
  
  return (
    <form>
      <h2>{t('login.title', 'Sign In')}</h2>
      
      <label>
        {t('login.email', 'Email')}
        <input type="email" />
      </label>
      
      <label>
        {t('login.password', 'Password')}
        <input type="password" />
      </label>
      
      <button type="submit">
        {t('login.submit', 'Login')}
      </button>
      
      <a href="/register">
        {t('register.link', 'Create an account')}
      </a>
    </form>
  );
}
```

### Pattern 5: Language Switcher

```tsx
import { useI18n, useTranslation } from '@i18n-bakery/react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

function LanguageSwitcher() {
  const { i18n, locale } = useI18n();
  const t = useTranslation();
  
  const handleLanguageChange = async (newLocale: string) => {
    await i18n.setLocale(newLocale);
  };
  
  return (
    <div className="language-switcher">
      <label>{t('settings.language', 'Language')}</label>
      <select 
        value={locale} 
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Pattern 6: With ICU MessageFormat

```tsx
import { useTranslation } from '@i18n-bakery/react';

function NotificationList({ notifications }: { notifications: any[] }) {
  const t = useTranslation();
  
  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>
          {/* ICU plural syntax */}
          {t('notification.message',
            '{count, plural, =0 {No new messages} one {# new message} other {# new messages}}',
            { count: notif.count }
          )}
          
          {/* ICU select syntax */}
          {t('notification.action',
            '{gender, select, male {He} female {She} other {They}} {action}',
            { gender: notif.user.gender, action: notif.action }
          )}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 7: With Number Formatting Plugin

```tsx
import { useTranslation } from '@i18n-bakery/react';

function ProductCard({ product }: { product: any }) {
  const t = useTranslation();
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      
      {/* Currency formatting */}
      <p className="price">
        {t('product.price', 'Price: {amount|currency:USD}', 
          { amount: product.price }
        )}
      </p>
      
      {/* Compact number formatting */}
      <p className="views">
        {t('product.views', '{count|compact} views', 
          { count: product.views }
        )}
      </p>
      
      {/* Percentage formatting */}
      <p className="discount">
        {t('product.discount', 'Save {amount|percent}!', 
          { amount: product.discount }
        )}
      </p>
    </div>
  );
}
```

---

## 🏗️ Advanced Usage

### Custom Provider Setup

```tsx
import { I18nProvider } from '@i18n-bakery/react';
import { initI18n } from '@i18n-bakery/core';
import { useState, useEffect } from 'react';

function App() {
  const [locale, setLocale] = useState('en');
  
  useEffect(() => {
    // Initialize i18n
    initI18n({
      locale,
      fallbackLocale: 'en',
      saveMissing: true,
      loader: async (locale, namespace) => {
        const response = await fetch(`/api/translations/${locale}/${namespace}`);
        return response.json();
      }
    });
  }, [locale]);
  
  return (
    <I18nProvider locale={locale}>
      <YourApp onLocaleChange={setLocale} />
    </I18nProvider>
  );
}
```

### With TypeScript

```tsx
import { useTranslation, useI18n } from '@i18n-bakery/react';
import type { FC } from 'react';

interface UserProps {
  name: string;
  email: string;
}

const UserProfile: FC<UserProps> = ({ name, email }) => {
  const t = useTranslation('profile');
  const { locale } = useI18n();
  
  return (
    <div>
      <h2>{t('title', 'User Profile')}</h2>
      <p>{t('name', 'Name: {{name}}', { name })}</p>
      <p>{t('email', 'Email: {{email}}', { email })}</p>
      <p>Current locale: {locale}</p>
    </div>
  );
};
```

### With React Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from '@i18n-bakery/react';

function App() {
  return (
    <I18nProvider locale="en">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
```

---

## 🧪 Testing

### Testing Components with Translations

```tsx
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '@i18n-bakery/react';
import { initI18n, addTranslations } from '@i18n-bakery/core';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    initI18n({ locale: 'en' });
    addTranslations('en', 'common', {
      'title': 'Test Title',
      'button': 'Click Me'
    });
  });
  
  it('renders translated content', () => {
    render(
      <I18nProvider locale="en">
        <MyComponent />
      </I18nProvider>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Packages

- **[@i18n-bakery/core](../core)** - Core translation engine
- **[@i18n-bakery/cli](../cli)** - Command-line tools

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

*Made with ❤️ and React Hooks*

</div>
