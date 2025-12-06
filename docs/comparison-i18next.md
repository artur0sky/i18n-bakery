# Taste Test: Bakery vs. i18next

`i18n-bakery` is designed to be a lightweight, modern alternative to `i18next`, focusing on a simpler recipe and better developer experience.

| Feature | i18n-bakery 🥯 | i18next 🌐 |
| :--- | :--- | :--- |
| **Size** | Tiny (~2kb core) | Medium (~10kb core) |
| **Architecture** | Clean Architecture (Ports & Adapters) | Plugin-based |
| **Auto-save** | Built-in (Self-rising) | Requires backend plugin |
| **CLI** | Built-in `batter` & `bake` | Separate ecosystem |
| **React** | Simple hooks (`useT`) | `react-i18next` (HOCs, hooks, etc.) |
| **Syntax** | `t('ns.key')` or `t('ns:key')` | `t('ns:key')` |

## Migration Guide (Changing Recipes)

1. **Replace Ingredients**: Change `i18next` imports to `@i18n-bakery/core` or `@i18n-bakery/react`.
2. **Preheat**: Use `initI18n` instead of `i18n.init`.
3. **Wrap**: Wrap your app with `I18nProvider`.
4. **Enjoy**: Most `t()` calls will work without changes due to our compatibility layer.
