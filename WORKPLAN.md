# 🥯 i18n-bakery — Plan de Trabajo

Este documento describe el plan de implementación completo de **i18n-bakery**, actualizado según los cambios implementados en cada versión.

---

## Estado de Implementación

### ✅ FASE 1 — Runtime básico (Core v1) — **COMPLETADA** (v0.1.0)
- ✅ I18nService con Clean Architecture
- ✅ MemoryStore adapter
- ✅ MustacheFormatter para interpolación `{{variable}}`
- ✅ API pública: `initI18n()`, `t()`, `setLocale()`, `addTranslations()`
- ✅ Testing con vitest (100% coverage)

### ✅ FASE 2 — Auto-guardado (Self-Rising) — **COMPLETADA** (v0.2.0)
- ✅ TranslationSaver port
- ✅ JSONFileSaver adapter (Node.js)
- ✅ ConsoleSaver adapter
- ✅ Detección automática de claves faltantes
- ✅ Testing de auto-save

### ✅ FASE 3 — CLI (The Mixer) — **COMPLETADA** (v0.3.0)
- ✅ Comando `batter`: extracción de claves desde código
- ✅ Comando `bake`: compilación de archivos JSON
- ✅ Parsing AST con Babel
- ✅ Inferencia de namespaces
- ✅ Testing de integración

### ✅ FASE 4 — React Bindings (The Glaze) — **COMPLETADA** (v0.4.0)
- ✅ I18nProvider component
- ✅ useTranslation() hook (antes useT)
- ✅ useI18n() hook
- ✅ Actualizaciones reactivas
- ✅ Soporte de namespace prefixes
- ✅ Testing con @testing-library/react-hooks

### ✅ FASE 5 — Compatibilidad i18next — **COMPLETADA** (v0.5.0)
- ✅ Soporte de notación `ns:key`
- ✅ Interpolación anidada profunda `{{user.profile.name}}`
- ✅ Testing de compatibilidad (98% compatible)

### ✅ FASE 6 — Monorepo y Documentación — **COMPLETADA** (v0.6.0)
- ✅ Estructura pnpm workspace
- ✅ Ejemplo react-basic
- ✅ Documentación completa en docs/
- ✅ READMEs con tema "Bakery"
- ✅ Configuración NPM pública
- ✅ Compatibilidad CJS/ESM

### ✅ FASE 7 — Advanced Key Engine (The Filing System) — **COMPLETADA** (v0.7.0)
- ✅ Parsing jerárquico con `:` y `.`
- ✅ KeyParser port + DefaultKeyParser adapter
- ✅ PathResolver port + FileSystemPathResolver adapter
- ✅ Normalización automática de claves
- ✅ Testing completo (29 tests, 100% coverage)
- ✅ Ejemplo: `orders:meal.orderComponent.title` → `/orders/meal/orderComponent.json` con propiedad `title`

### ✅ FASE 8 — Variable Detection (The Variable Vault) — **COMPLETADA** (v0.8.0)
- ✅ VariableDetector port + DefaultVariableDetector adapter
- ✅ TranslationEntryManager port + MemoryTranslationEntryManager adapter
- ✅ Sistema de firmas de variables (variable signatures)
- ✅ Soporte para múltiples variantes de la misma clave
- ✅ Auto-generación de templates (variables-only, empty)
- ✅ Testing completo (41 tests, 100% coverage)

### ✅ FASE 9 — File Auto-creation (The Auto-Baker) — **COMPLETADA** (v0.9.0)
- ✅ FileWriter port + JSONFileWriter adapter
- ✅ FileSystemManager port + NodeFileSystemManager adapter
- ✅ TranslationFileManager use case
- ✅ Auto-creación de archivos y directorios
- ✅ Soporte para variantes de traducción
- ✅ Merge modes: append y replace
- ✅ Pretty-printing configurable
- ✅ Testing completo (12 tests, 100% coverage)

### ✅ FASE 10 — Pluralization (The Plural Baker) — **COMPLETADA** (v0.9.1)
- ✅ PluralResolver port + SuffixPluralResolver adapter
- ✅ Soporte i18next-style (`key`, `key_plural`, `key_0`, `key_1`)
- ✅ Resolución inteligente por prioridad
- ✅ Integración con variable interpolation
- ✅ Testing completo (21 tests, 100% coverage)

### ✅ FASE 11 — CLDR Pluralization (The World Baker) — **COMPLETADA** (v0.9.2)
- ✅ CLDRPluralResolver usando Intl.PluralRules
- ✅ Soporte para 100+ idiomas
- ✅ Estrategia configurable (suffix vs cldr)
- ✅ Categorías CLDR: zero, one, two, few, many, other
- ✅ Testing multi-idioma (18 tests, 100% coverage)

### ✅ FASE 12 — ICU MessageFormat (The ICU Baker) — **COMPLETADA** (v0.9.3)
- ✅ ICUMessageFormatter adapter
- ✅ Plural syntax: `{count, plural, one {# item} other {# items}}`
- ✅ Select syntax: `{gender, select, male {He} female {She}}`
- ✅ Selectordinal syntax: `{place, selectordinal, one {#st} two {#nd}}`
- ✅ Nested patterns support
- ✅ Testing completo (15 tests, 100% coverage)

### ✅ FASE 13 — Plugin System (The Plugin Baker) — **COMPLETADA** (v1.0.0) 🎉
- ✅ Plugin port + DefaultPluginManager adapter
- ✅ Lifecycle hooks (init, beforeTranslate, afterTranslate, etc.)
- ✅ Plugin types (formatter, backend, detector, processor, middleware)
- ✅ Dependency management
- ✅ NumberFormatPlugin (currency, number, percent, compact)
- ✅ CapitalizePlugin (upper, lower, capitalize, title)
- ✅ Testing completo (21 tests, 100% coverage)
- ✅ **PRIMERA VERSIÓN ESTABLE - PRODUCTION READY**

### ✅ FASE 14 — File Structure Configuration (The Flexible Baker) — **COMPLETADA** (v1.0.1)
- ✅ Soporte para estructura nested (default)
- ✅ Soporte para estructura flat (configurable)
- ✅ Parámetro `fileStructure` en JSONFileSaver
- ✅ Propiedad `fileStructure` en I18nConfig
- ✅ Testing completo (7 tests, 100% coverage)
- ✅ Documentación de uso y migración

### ✅ FASE 15 — MCP & CLI Standardization (The Master Baker) — **COMPLETADA** (v1.0.9)
- ✅ Centralización de lógica en `@i18n-bakery/baker`
- ✅ Implementación de `ProjectScanner` y `ExtractionUseCase`
- ✅ Paridad total entre herramientas MCP Tray y comandos CLI
- ✅ Comandos `pantry` y `recipe` añadidos a CLI
- ✅ Integración de `poacher` en el binario principal de `i18n-bakery`
- ✅ Unificación de `JSONFileSaver` para ordenamiento consistente
- ✅ Auditoría de consistencia de 2do grado completada

---

## 📊 Estado Actual: v1.0.9

**Características Implementadas:** 15/15 fases core completadas
**Paridad con i18next:** ~75% (core features)
**Tests Totales:** 214 tests pasando (estimados)
**Cobertura:** 100% en componentes críticos

---

## Fases Pendientes (Roadmap hacia Seamless i18next Integration)

# FASE 16 — Context Support (The Context Baker) — **PRIORIDAD ALTA** (v1.1.0)

## 15.1 Context Parameter
Implementar soporte para traducciones contextuales (género, formalidad, etc.)

**API:**
```typescript
t('friend', { context: 'male' })   // → friend_male
t('friend', { context: 'female' }) // → friend_female
t('friend', { context: 'formal' }) // → friend_formal
```

**Implementación:**
- Extender `I18nConfig` con `contextSeparator?: string` (default: `'_'`)
- Actualizar firma de `t()` para aceptar `options.context`
- Modificar `I18nService` para resolver claves con contexto
- Prioridad de resolución:
  1. `key_context` (si context presente)
  2. `key` (fallback)

**Testing:**
- Context con pluralization
- Context con namespaces
- Context con fallback locale
- Context con ICU MessageFormat

**Estimación:** 2-3 días

---

# FASE 16 — Language Detection (The Detector Baker) — **PRIORIDAD ALTA** (v1.1.0)

## 16.1 Browser Language Detector Plugin
Auto-detectar idioma del navegador/sistema

**Implementación:**
```typescript
class BrowserLanguageDetector implements Plugin {
  metadata = {
    name: 'browser-language-detector',
    type: 'detector',
    version: '1.0.0'
  };
  
  detect(): string {
    // 1. Query string (?lng=es)
    // 2. localStorage
    // 3. Cookie
    // 4. navigator.language
    // 5. HTML lang attribute
    return detectedLanguage;
  }
}
```

## 16.2 Detection Options
```typescript
interface DetectorOptions {
  order?: ('querystring' | 'localStorage' | 'cookie' | 'navigator' | 'htmlTag')[];
  lookupQuerystring?: string;
  lookupCookie?: string;
  lookupLocalStorage?: string;
  caches?: ('localStorage' | 'cookie')[];
}
```

**Testing:**
- Detection order
- Fallback behavior
- Cache persistence
- Multi-source detection

**Estimación:** 2 días

---

# FASE 17 — HTTP Backend (The Network Baker) — **PRIORIDAD ALTA** (v1.2.0)

## 17.1 HTTP Backend Plugin
Cargar traducciones desde servidor HTTP

**Implementación:**
```typescript
class HttpBackend implements Plugin {
  metadata = {
    name: 'http-backend',
    type: 'backend',
    version: '1.0.0'
  };
  
  async load(locale: string, namespace: string): Promise<TranslationMap> {
    const url = this.getUrl(locale, namespace);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.json();
  }
}
```

## 17.2 Backend Options
```typescript
interface HttpBackendOptions {
  loadPath?: string; // '/locales/{{lng}}/{{ns}}.json'
  addPath?: string;  // '/locales/add/{{lng}}/{{ns}}'
  allowMultiLoading?: boolean;
  crossDomain?: boolean;
  withCredentials?: boolean;
  requestOptions?: RequestInit;
}
```

**Testing:**
- Successful loading
- Error handling
- Retry logic
- Cache strategy
- Multi-namespace loading

**Estimación:** 3 días

---

# FASE 18 — Event System (The Observer Baker) — **PRIORIDAD ALTA** (v1.2.0)

## 18.1 Event Emitter
Sistema de eventos para cambios de idioma, carga de traducciones, etc.

**API:**
```typescript
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to', lng);
});

i18n.on('loaded', (loaded) => {
  console.log('Translations loaded', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('Failed loading', lng, ns, msg);
});

i18n.on('missingKey', (lngs, namespace, key, res) => {
  console.warn('Missing key', key);
});
```

## 18.2 Event Types
- `initialized`
- `loaded`
- `failedLoading`
- `languageChanged`
- `missingKey`
- `added`
- `removed`

**Implementación:**
- EventEmitter port
- DefaultEventEmitter adapter
- Integración con I18nService
- React hooks para eventos

**Testing:**
- Event emission
- Event listeners
- Unsubscribe
- Multiple listeners
- Error handling

**Estimación:** 2 días

---

# FASE 19 — Nesting Translations (The Nesting Baker) — **PRIORIDAD MEDIA** (v1.3.0)

## 19.1 Translation Nesting
Referenciar otras traducciones dentro de traducciones

**API:**
```json
{
  "hello": "Hello",
  "user": {
    "name": "John"
  },
  "greeting": "$t(hello) $t(user.name)!"
}
```

```typescript
t('greeting') // → "Hello John!"
```

## 19.2 Nesting Options
```typescript
interface NestingOptions {
  prefix?: string;     // default: '$t('
  suffix?: string;     // default: ')'
  nestingOptionsSeparator?: string; // default: ','
}
```

**Testing:**
- Simple nesting
- Deep nesting
- Nesting with variables
- Nesting with plurals
- Circular reference detection

**Estimación:** 3-4 días

---

# FASE 20 — Return Objects (The Object Baker) — **PRIORIDAD MEDIA** (v1.3.0)

## 20.1 Object Return
Retornar objetos completos de traducción

**API:**
```typescript
// Translation file
{
  "menu": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}

// Usage
const menu = t('menu', { returnObjects: true });
// → { home: "Home", about: "About", contact: "Contact" }
```

## 20.2 Return Details
```typescript
const details = t('key', { returnDetails: true });
// → {
//   res: "translation",
//   usedKey: "key",
//   exactUsedKey: "key",
//   usedLng: "en",
//   usedNS: "common"
// }
```

**Testing:**
- Object return
- Array return
- Details return
- Nested objects
- With interpolation

**Estimación:** 2 días

---

# FASE 21 — Multiple Instances (The Multi-Baker) — **PRIORIDAD BAJA** (v1.4.0)

## 21.1 Instance Creation
Soporte para múltiples instancias de i18n

**API:**
```typescript
const instance1 = createI18nInstance({
  locale: 'en',
  // ...
});

const instance2 = createI18nInstance({
  locale: 'es',
  // ...
});
```

**Implementación:**
- Remover singleton pattern
- Factory function para instancias
- Instance isolation
- React context per instance

**Testing:**
- Multiple instances
- Instance isolation
- Concurrent usage
- Memory cleanup

**Estimación:** 3 días

---

# FASE 22 — Advanced Formatting (The Format Baker) — **PRIORIDAD BAJA** (v1.4.0)

## 22.1 Date/Time Formatting Plugin
```typescript
class DateTimeFormatPlugin implements Plugin {
  // Using Intl.DateTimeFormat
}

// Usage
t('lastSeen', { 
  date: new Date(),
  formatParams: {
    date: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  }
})
```

## 22.2 List Formatting Plugin
```typescript
class ListFormatPlugin implements Plugin {
  // Using Intl.ListFormat
}

// Usage
t('items', { 
  items: ['apple', 'banana', 'orange'],
  formatParams: {
    items: { style: 'long', type: 'conjunction' }
  }
})
```

**Estimación:** 4 días

---

# FASE 23 — Missing Key Handler (The Handler Baker) — **PRIORIDAD BAJA** (v1.5.0)

## 23.1 Custom Missing Key Handler
```typescript
initI18n({
  missingKeyHandler: (lngs, ns, key, fallbackValue) => {
    // Send to error tracking
    // Log to analytics
    // Custom behavior
  }
});
```

**Estimación:** 1 día

---

## Notas de Arquitectura (v1.0.1)

### Clean Architecture

El proyecto sigue estrictamente Clean Architecture:

**Domain (Interfaces/Ports):**
- `TranslationLoader`
- `TranslationSaver`
- `VariableFormatter`
- `KeyParser`
- `PathResolver`
- `VariableDetector`
- `TranslationEntryManager`
- `FileWriter`
- `FileSystemManager`
- `PluralResolver`
- `Plugin`
- `PluginManager`

**Adapters (Implementaciones):**
- `MemoryStore`
- `JSONFileSaver`
- `ConsoleSaver`
- `MustacheFormatter`
- `ICUMessageFormatter`
- `DefaultKeyParser`
- `FileSystemPathResolver`
- `DefaultVariableDetector`
- `MemoryTranslationEntryManager`
- `JSONFileWriter`
- `NodeFileSystemManager`
- `SuffixPluralResolver`
- `CLDRPluralResolver`
- `DefaultPluginManager`
- `NumberFormatPlugin`
- `CapitalizePlugin`

**Use Cases:**
- `I18nService` (orquesta todos los ports)
- `TranslationFileManager`

### Estructura de Claves (v0.7.0+)

**Formato:** `[directory:]...[directory:][file.]property`

**Ejemplos:**
- `orders:meal.title` → `/orders/meal.json` → propiedad `title`
- `auth:login.button` → `/auth/login.json` → propiedad `button`
- `common.greeting` → `/common.json` → propiedad `greeting`

**Normalización automática:**
- Elimina separadores duplicados
- Limpia espacios en blanco
- Valida caracteres permitidos

### File Structure (v1.0.1+)

**Nested (default):**
```json
{
  "home": {
    "title": "Welcome Home"
  }
}
```

**Flat (configurable):**
```json
{
  "home.title": "Welcome Home"
}
```

---

## 📈 Roadmap Summary

### v1.1.0 (Q1 2025) - The Context & Detection Release
- Context Support
- Language Detection Plugin
- **Target:** 80% i18next parity

### v1.2.0 (Q1 2025) - The Network Release
- HTTP Backend Plugin
- Event System
- **Target:** 85% i18next parity

### v1.3.0 (Q2 2025) - The Advanced Features Release
- Nesting Translations
- Return Objects
- **Target:** 90% i18next parity

### v1.4.0 (Q2 2025) - The Enterprise Release
- Multiple Instances
- Advanced Formatting
- **Target:** 95% i18next parity

### v1.5.0 (Q3 2025) - The Complete Release
- Missing Key Handler
- Additional Plugins
- **Target:** 98% i18next parity (Seamless Integration Achieved)

---

*Última actualización: 2025-12-07 (v1.0.1 — The Flexible Baker)*
*Próxima versión planeada: v1.1.0 — The Context & Detection Release*