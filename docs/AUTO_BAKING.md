# 🥯 Auto-Baking: Self-Rising Translations

> _"The dough that kneads itself is the baker's dream."_

## 📖 Tabla de Contenidos

- [¿Qué es Auto-Baking?](#-qué-es-auto-baking)
- [¿Por qué Auto-Baking?](#-por-qué-auto-baking)
- [Cómo Funciona](#-cómo-funciona)
- [Arquitectura Interna](#-arquitectura-interna)
- [Configuración](#-configuración)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Casos de Uso Avanzados](#-casos-de-uso-avanzados)
- [Comparación con i18next](#-comparación-con-i18next)
- [Mejores Prácticas](#-mejores-prácticas)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 ¿Qué es Auto-Baking?

**Auto-Baking** (Auto-Horneado) es la característica distintiva de **i18n-bakery** que automáticamente crea y actualiza archivos de traducción cuando detecta claves faltantes en tu código.

### El Problema Tradicional

En bibliotecas tradicionales como i18next, el flujo de trabajo es:

```typescript
// 1. Escribes código con una nueva clave
t('profile.settings.title', 'Account Settings');

// 2. Manualmente creas el archivo: locales/en/profile.json
// 3. Manualmente añades la estructura:
{
  "settings": {
    "title": "Account Settings"
  }
}

// 4. Repites para cada idioma
// 5. Si cambias variables, actualizas manualmente todos los archivos
```

**Resultado**: Mucho trabajo manual, propenso a errores, y lento.

### La Solución Auto-Baking

Con i18n-bakery:

```typescript
// 1. Escribes código
t("profile.settings.title", "Account Settings");

// 2. ¡Listo! El archivo se crea automáticamente
// ✅ locales/en/profile.json creado
// ✅ Estructura nested generada
// ✅ Valor guardado
// ✅ Metadata añadida (timestamp, variables, etc.)
```

**Resultado**: Desarrollo más rápido, menos errores, más productividad.

---

## 💡 ¿Por qué Auto-Baking?

### Ventajas

#### 1. **Velocidad de Desarrollo** ⚡

- No necesitas cambiar de contexto entre código y archivos JSON
- Escribe traducciones directamente en tu código
- Los archivos se crean automáticamente

#### 2. **Menos Errores Humanos** 🎯

- No olvidas crear archivos
- No cometes typos en las rutas de archivos
- La estructura JSON siempre es válida

#### 3. **Mejor DX (Developer Experience)** 🚀

- Flujo de trabajo más natural
- Menos fricción al añadir nuevas traducciones
- Ideal para prototipado rápido

#### 4. **Gestión de Variantes Automática** 🔄

- Detecta diferentes firmas de variables
- Almacena múltiples variantes de la misma clave
- Mantiene historial con timestamps

#### 5. **Metadata Rica** 📊

- Cada entrada incluye timestamp
- Variables detectadas automáticamente
- Flag de auto-generación para auditoría

### Casos de Uso Ideales

✅ **Perfecto para:**

- Desarrollo rápido de prototipos
- Startups y equipos pequeños
- Proyectos nuevos desde cero
- Desarrollo iterativo
- Equipos que valoran DX

⚠️ **Considera desactivarlo para:**

- Proyectos con traducciones profesionales externas
- Flujos de trabajo con TMS (Translation Management Systems)
- Equipos con traductores no-técnicos

---

## 🔧 Cómo Funciona

### Flujo de Ejecución

```
┌─────────────────────────────────────────────────────────────┐
│  1. Desarrollador escribe código                            │
│     t('orders:meal.title', 'Pizza Menu', { meal: 'Pizza' }) │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. I18nService.t() busca la traducción                     │
│     - Busca en MemoryStore (cache)                          │
│     - Busca en locale actual                                │
│     - Busca en fallback locale                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                    ¿Encontrada?
                          │
        ┌─────────────────┴─────────────────┐
        │ NO                                 │ SÍ
        ▼                                    ▼
┌───────────────────┐              ┌─────────────────┐
│ 3. Missing Key    │              │ 4. Retorna      │
│    Detectada      │              │    traducción   │
└────────┬──────────┘              └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. handleMissingKey()                                      │
│     - Guarda en MemoryStore (para uso inmediato)           │
│     - Llama a TranslationSaver.save()                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. JSONFileSaver.save() / TOMLFileSaver.save()             │
│     - Parsea la clave: 'orders:meal.title'                  │
│       → namespace: 'orders/meal'                            │
│       → property: 'title'                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. TranslationFileManager.createOrUpdateEntry()            │
│     - Detecta variables: { meal: 'Pizza' }                  │
│     - Crea signature: 'meal'                                │
│     - Resuelve path: 'locales/en/orders/meal.json'          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  7. FileWriter.merge()                                      │
│     - Lee archivo existente (si existe)                     │
│     - Merge con nueva entrada                               │
│     - Preserva traducciones existentes                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  8. Archivo JSON/TOML creado/actualizado                    │
│     {                                                        │
│       "title": {                                             │
│         "variants": {                                        │
│           "meal": {                                          │
│             "value": "Pizza Menu",                           │
│             "variables": ["meal"],                           │
│             "autoGenerated": true,                           │
│             "timestamp": 1733687234567                       │
│           }                                                  │
│         }                                                    │
│       }                                                      │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Clave

#### 1. **I18nService** (Orquestador)

- Detecta claves faltantes durante `t()` calls
- Llama a `handleMissingKey()` cuando no encuentra traducción
- Gestiona cache de pendingSaves para evitar duplicados

```typescript
// packages/core/src/use-cases/I18nService.ts
private handleMissingKey(locale: Locale, namespace: Namespace, key: Key, value: string) {
  if (!this.saveMissing || !this.saver) return;

  const cacheKey = `${locale}:${namespace}:${key}`;
  if (this.pendingSaves.has(cacheKey)) return; // Evita duplicados

  this.store.set(locale, namespace, key, value); // Cache inmediato

  this.pendingSaves.add(cacheKey);
  this.logger.debug(`Missing key detected: ${cacheKey}. Saving...`);

  this.saver.save(locale, namespace, key, value)
    .catch(err => {
      this.logger.error(`Failed to save missing key ${cacheKey}`, err);
    })
    .finally(() => {
      this.pendingSaves.delete(cacheKey);
    });
}
```

#### 2. **TranslationSaver** (Interface)

- Define el contrato para guardar traducciones
- Implementaciones: `JSONFileSaver`, `TOMLFileSaver`, `ConsoleSaver`

```typescript
// packages/core/src/domain/types.ts
export interface TranslationSaver {
  save(
    locale: Locale,
    namespace: Namespace,
    key: Key,
    value: string
  ): Promise<void>;
}
```

#### 3. **JSONFileSaver** (Adapter)

- Implementación para archivos JSON
- Soporta estructura nested y flat
- Ordena claves alfabéticamente
- Preserva contenido existente

```typescript
// packages/baker/src/adapters/JSONFileSaver.ts
async save(locale: Locale, namespace: Namespace, key: Key, value: string): Promise<void> {
  const filePath = path.join(this.localesPath, locale, `${namespace}.json`);

  let content: Record<string, any> = {};

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const fileContent = await fs.readFile(filePath, 'utf-8');
    content = JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }

  if (this.fileStructure === 'flat') {
    content[key] = value;
  } else {
    this.setDeep(content, key, value); // Crea estructura nested
  }

  const sortedContent = this.sortObject(content);
  await fs.writeFile(filePath, JSON.stringify(sortedContent, null, 2) + '\n', 'utf-8');
}
```

#### 4. **TranslationFileManager** (Use Case)

- Orquesta la creación de archivos con metadata completa
- Detecta variables y crea signatures
- Gestiona variantes de traducción
- Resuelve paths jerárquicos

```typescript
// packages/baker/src/use-cases/TranslationFileManager.ts
async createOrUpdateEntry(
  locale: Locale,
  key: Key,
  value: string,
  vars?: Record<string, any>,
  autoGenerated: boolean = true
): Promise<void> {
  // 1. Parse key: 'orders:meal.title' → { namespace: 'orders/meal', property: 'title' }
  const parsedKey = this.keyParser.parse(key);

  // 2. Detect variables: { meal: 'Pizza', price: 12 } → ['meal', 'price']
  const signature = this.variableDetector.detectVariables(vars);
  const signatureKey = this.variableDetector.createSignatureKey(signature);

  // 3. Resolve path: 'locales/en/orders/meal.json'
  const filePath = this.pathResolver.resolve(locale, parsedKey);

  // 4. Create content with metadata
  const content = this.createTranslationContent(
    propertyKey,
    signatureKey,
    value,
    signature,
    autoGenerated
  );

  // 5. Write/merge file
  await this.fileWriter.merge(filePath, content, this.mergeMode);
}
```

#### 5. **VariableDetector** (Domain)

- Detecta variables en objetos
- Crea signatures únicas
- Genera valores por defecto

```typescript
// Detecta: { meal: 'Pizza', price: 12 } → ['meal', 'price']
detectVariables(vars?: Record<string, any>): string[]

// Crea: ['meal', 'price'] → 'meal_price'
createSignatureKey(signature: string[]): string

// Genera: ['meal', 'price'] → '{{meal}} {{price}}'
generateDefaultValue(signature: string[]): string
```

---

## 🏗️ Arquitectura Interna

### Clean Architecture

El Auto-Baking sigue estrictamente **Clean Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│  (Interfaces puras - Sin dependencias externas)             │
├─────────────────────────────────────────────────────────────┤
│  • TranslationSaver (interface)                             │
│  • KeyParser (interface)                                    │
│  • VariableDetector (interface)                             │
│  • FileWriter (interface)                                   │
│  • PathResolver (interface)                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     ADAPTERS LAYER                           │
│  (Implementaciones concretas)                               │
├─────────────────────────────────────────────────────────────┤
│  • JSONFileSaver (implements TranslationSaver)              │
│  • TOMLFileSaver (implements TranslationSaver)              │
│  • ConsoleSaver (implements TranslationSaver)               │
│  • DefaultKeyParser (implements KeyParser)                  │
│  • DefaultVariableDetector (implements VariableDetector)    │
│  • JSONFileWriter (implements FileWriter)                   │
│  • TOMLFileWriter (implements FileWriter)                   │
│  • FileSystemPathResolver (implements PathResolver)         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    USE CASES LAYER                           │
│  (Lógica de negocio - Orquestación)                         │
├─────────────────────────────────────────────────────────────┤
│  • I18nService                                              │
│  • TranslationFileManager                                   │
└─────────────────────────────────────────────────────────────┘
```

### Ventajas de esta Arquitectura

1. **Testeable**: Cada capa se puede testear independientemente
2. **Extensible**: Fácil añadir nuevos formatos (XML, YAML, etc.)
3. **Mantenible**: Cambios en una capa no afectan otras
4. **Zero Dependencies**: Domain layer no depende de nada externo

---

## ⚙️ Configuración

### Configuración Básica

```typescript
import { initI18n, JSONFileSaver } from "@i18n-bakery/core";

initI18n({
  locale: "en",
  fallbackLocale: "en",
  saveMissing: true, // ✅ Habilita Auto-Baking
  saver: new JSONFileSaver("./locales"), // Dónde guardar
  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});
```

### Configuración Avanzada

```typescript
import { initI18n, JSONFileSaver, TOMLFileSaver } from "@i18n-bakery/core";

initI18n({
  locale: "en-US",
  fallbackLocale: "en",
  saveMissing: true,

  // Opción 1: JSON con estructura nested (default)
  saver: new JSONFileSaver("./locales", "nested"),

  // Opción 2: JSON con estructura flat
  // saver: new JSONFileSaver('./locales', 'flat'),

  // Opción 3: TOML (mejor para archivos grandes)
  // saver: new TOMLFileSaver('./locales', 'nested'),

  // Opción 4: Console (solo logging, para desarrollo)
  // saver: new ConsoleSaver(),

  debug: true, // Ver logs de auto-baking

  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});
```

### Configuración por Entorno

```typescript
// config/i18n.ts
import { initI18n, JSONFileSaver, ConsoleSaver } from "@i18n-bakery/core";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

initI18n({
  locale: "en",
  fallbackLocale: "en",

  // Solo auto-baking en desarrollo
  saveMissing: isDevelopment,

  // En desarrollo: guarda archivos
  // En producción: solo console (para detectar claves faltantes)
  saver: isDevelopment ? new JSONFileSaver("./locales") : new ConsoleSaver(),

  debug: isDevelopment,

  loader: async (locale, namespace) => {
    return import(`./locales/${locale}/${namespace}.json`);
  },
});
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Traducción Simple

```typescript
// Código
t('home.welcome', 'Welcome to our bakery!');

// Resultado: locales/en/home.json
{
  "welcome": {
    "variants": {
      "default": {
        "value": "Welcome to our bakery!",
        "variables": [],
        "autoGenerated": true,
        "timestamp": 1733687234567
      }
    }
  }
}
```

### Ejemplo 2: Con Variables

```typescript
// Código
t('greeting', 'Hello, {{name}}!', { name: 'John' });

// Resultado: locales/en/en-US.json (o defaultNamespace)
{
  "greeting": {
    "variants": {
      "name": {
        "value": "Hello, {{name}}!",
        "variables": ["name"],
        "autoGenerated": true,
        "timestamp": 1733687234567
      }
    }
  }
}
```

### Ejemplo 3: Namespaces Jerárquicos

```typescript
// Código
t('orders:meal.title', 'Pizza Menu');

// Resultado: locales/en/orders/meal.json
{
  "title": {
    "variants": {
      "default": {
        "value": "Pizza Menu",
        "variables": [],
        "autoGenerated": true,
        "timestamp": 1733687234567
      }
    }
  }
}
```

### Ejemplo 4: Variantes Múltiples

```typescript
// Primera llamada
t('product.title', '{{name}}', { name: 'Pizza' });

// Segunda llamada (diferentes variables)
t('product.title', '{{name}} - ${{price}}', { name: 'Pizza', price: 12 });

// Resultado: locales/en/product.json
{
  "title": {
    "variants": {
      "name": {
        "value": "{{name}}",
        "variables": ["name"],
        "autoGenerated": true,
        "timestamp": 1733687234567
      },
      "name_price": {
        "value": "{{name}} - ${{price}}",
        "variables": ["name", "price"],
        "autoGenerated": true,
        "timestamp": 1733687234890
      }
    }
  }
}
```

### Ejemplo 5: Estructura Nested vs Flat

```typescript
// Código
t('home.hero.title', 'Welcome');
t('home.hero.subtitle', 'Fresh translations daily');

// Nested (default)
{
  "hero": {
    "title": {
      "variants": {
        "default": { "value": "Welcome", ... }
      }
    },
    "subtitle": {
      "variants": {
        "default": { "value": "Fresh translations daily", ... }
      }
    }
  }
}

// Flat
{
  "hero.title": {
    "variants": {
      "default": { "value": "Welcome", ... }
    }
  },
  "hero.subtitle": {
    "variants": {
      "default": { "value": "Fresh translations daily", ... }
    }
  }
}
```

---

## 🚀 Casos de Uso Avanzados

### Caso 1: Desarrollo de Prototipo Rápido

```typescript
// Escenario: Startup desarrollando MVP rápidamente

// 1. Configuración inicial (1 minuto)
initI18n({
  locale: "en",
  saveMissing: true,
  saver: new JSONFileSaver("./public/locales"),
});

// 2. Desarrollo sin preocuparse por archivos
function LoginPage() {
  return (
    <div>
      <h1>{t("auth:login.title", "Sign In")}</h1>
      <p>{t("auth:login.subtitle", "Welcome back!")}</p>
      <button>{t("auth:login.submit", "Login")}</button>
    </div>
  );
}

// 3. ¡Archivos creados automáticamente!
// ✅ locales/en/auth/login.json con todas las claves
```

### Caso 2: Migración Gradual

```typescript
// Escenario: Migrar proyecto existente a i18n-bakery

// Fase 1: Habilitar auto-baking solo para nuevas features
initI18n({
  locale: "en",
  saveMissing: true,
  saver: new JSONFileSaver("./locales/new"),
  loader: async (locale, namespace) => {
    // Intenta cargar desde archivos nuevos primero
    try {
      return await import(`./locales/new/${locale}/${namespace}.json`);
    } catch {
      // Fallback a archivos legacy
      return await import(`./locales/legacy/${locale}/${namespace}.json`);
    }
  },
});

// Fase 2: Gradualmente mover archivos legacy a nueva estructura
```

### Caso 3: Testing y QA

```typescript
// Escenario: Detectar claves faltantes en tests

// test/i18n.test.ts
import { initI18n, ConsoleSaver } from "@i18n-bakery/core";

beforeEach(() => {
  const missingKeys: string[] = [];

  initI18n({
    locale: "en",
    saveMissing: true,
    saver: {
      async save(locale, namespace, key, value) {
        missingKeys.push(`${locale}:${namespace}:${key}`);
      },
    },
  });
});

test("should not have missing keys", () => {
  render(<App />);
  expect(missingKeys).toHaveLength(0);
});
```

### Caso 4: Multi-Tenant con Auto-Baking

```typescript
// Escenario: SaaS con múltiples clientes

class TenantI18nService {
  private instances = new Map();

  getI18n(tenantId: string) {
    if (!this.instances.has(tenantId)) {
      const instance = initI18n({
        locale: "en",
        saveMissing: true,
        saver: new JSONFileSaver(`./locales/${tenantId}`),
      });
      this.instances.set(tenantId, instance);
    }
    return this.instances.get(tenantId);
  }
}

// Cada tenant tiene sus propias traducciones auto-generadas
```

---

## 🆚 Comparación con i18next

### i18next (Flujo Manual)

```typescript
// 1. Código
t('profile.settings.title');

// 2. Crear manualmente: locales/en/profile.json
{
  "settings": {
    "title": "Account Settings"
  }
}

// 3. Crear manualmente: locales/es/profile.json
{
  "settings": {
    "title": "Configuración de Cuenta"
  }
}

// 4. Si añades variable, actualizar todos los archivos manualmente
```

**Tiempo estimado**: 5-10 minutos por nueva clave (con múltiples idiomas)

### i18n-bakery (Auto-Baking)

```typescript
// 1. Código
t("profile.settings.title", "Account Settings");

// 2. ¡Listo! Archivo creado automáticamente
```

**Tiempo estimado**: 10 segundos

### Tabla Comparativa

| Aspecto                    | i18next           | i18n-bakery                 |
| -------------------------- | ----------------- | --------------------------- |
| **Creación de archivos**   | Manual            | Automática ✅               |
| **Estructura JSON**        | Manual            | Automática ✅               |
| **Detección de variables** | Manual            | Automática ✅               |
| **Variantes**              | No soportado      | Automático ✅               |
| **Metadata**               | No incluida       | Timestamp, autoGenerated ✅ |
| **Tiempo por clave**       | 5-10 min          | 10 seg ✅                   |
| **Errores de typo**        | Frecuentes        | Eliminados ✅               |
| **Ideal para**             | Proyectos maduros | Desarrollo rápido ✅        |

---

## 💎 Mejores Prácticas

### ✅ DO: Buenas Prácticas

#### 1. **Usa Default Text Descriptivo**

```typescript
// ✅ BIEN: Default text claro
t("cart.empty", "Your shopping cart is empty");

// ❌ MAL: Sin default text
t("cart.empty");

// ❌ MAL: Default text genérico
t("cart.empty", "Empty");
```

#### 2. **Organiza con Namespaces Jerárquicos**

```typescript
// ✅ BIEN: Estructura clara
t("features:orders:meal.title", "Pizza Menu");
// → locales/en/features/orders/meal.json

// ❌ MAL: Todo en un archivo
t("meal_title", "Pizza Menu");
// → locales/en/en-US.json (archivo gigante)
```

#### 3. **Usa Variables Consistentemente**

```typescript
// ✅ BIEN: Nombres de variables claros
t("greeting", "Hello, {{userName}}!", { userName: "John" });

// ❌ MAL: Variables genéricas
t("greeting", "Hello, {{x}}!", { x: "John" });
```

#### 4. **Desactiva en Producción (Opcional)**

```typescript
// ✅ BIEN: Solo auto-baking en desarrollo
initI18n({
  saveMissing: process.env.NODE_ENV === "development",
  saver:
    process.env.NODE_ENV === "development"
      ? new JSONFileSaver("./locales")
      : new ConsoleSaver(), // Solo logs en producción
});
```

#### 5. **Revisa Archivos Auto-Generados**

```bash
# Después de desarrollo, revisa cambios
git diff locales/

# Edita traducciones auto-generadas si es necesario
# El flag autoGenerated: true te ayuda a identificarlas
```

### ❌ DON'T: Malas Prácticas

#### 1. **No Uses Auto-Baking para Traducciones Profesionales**

```typescript
// ❌ MAL: Auto-baking con traductores profesionales
// Los traductores necesitan archivos estables, no auto-generados
initI18n({
  saveMissing: true, // ❌ Conflictos con workflow de traducción
});

// ✅ BIEN: Usa CLI para extraer claves
// pnpm exec i18n-bakery batter src --locale en
// Luego envía archivos a traductores
```

#### 2. **No Ignores Archivos Auto-Generados en Git**

```gitignore
# ❌ MAL: Ignorar traducciones
locales/**/*.json

# ✅ BIEN: Commitea traducciones
# (Son parte del código fuente)
```

#### 3. **No Mezcles Estructura Nested y Flat**

```typescript
// ❌ MAL: Cambiar estructura a mitad de proyecto
new JSONFileSaver("./locales", "nested"); // Antes
new JSONFileSaver("./locales", "flat"); // Después → Conflictos

// ✅ BIEN: Decide al inicio y mantén consistencia
```

---

## 🔍 Troubleshooting

### Problema 1: Archivos No Se Crean

**Síntomas:**

```typescript
t("home.title", "Welcome");
// ❌ Archivo no creado
```

**Soluciones:**

```typescript
// 1. Verifica que saveMissing esté habilitado
initI18n({
  saveMissing: true, // ✅ Debe ser true
});

// 2. Verifica que saver esté configurado
initI18n({
  saver: new JSONFileSaver("./locales"), // ✅ Debe existir
});

// 3. Verifica permisos de escritura
// El directorio './locales' debe ser escribible

// 4. Activa debug para ver logs
initI18n({
  debug: true, // ✅ Ver logs de auto-baking
});
```

### Problema 2: Duplicados en Archivos

**Síntomas:**

```json
{
  "title": "Welcome",
  "title": "Welcome" // ❌ Duplicado
}
```

**Causa:** Múltiples llamadas simultáneas a `t()` con la misma clave.

**Solución:** i18n-bakery ya previene esto con `pendingSaves` cache.

```typescript
// Interno: I18nService.ts
if (this.pendingSaves.has(cacheKey)) return; // ✅ Previene duplicados
```

### Problema 3: Estructura Incorrecta

**Síntomas:**

```json
// Esperado (nested)
{
  "home": {
    "title": "Welcome"
  }
}

// Obtenido (flat)
{
  "home.title": "Welcome"
}
```

**Solución:**

```typescript
// Verifica fileStructure en JSONFileSaver
new JSONFileSaver("./locales", "nested"); // ✅ Para estructura nested
new JSONFileSaver("./locales", "flat"); // ✅ Para estructura flat
```

### Problema 4: Performance con Muchas Claves

**Síntomas:**

- Aplicación lenta al iniciar
- Muchas escrituras de archivos

**Soluciones:**

```typescript
// 1. Usa ConsoleSaver en desarrollo para evitar I/O
initI18n({
  saver: new ConsoleSaver(), // Solo logs, sin archivos
});

// 2. Usa CLI para extraer claves en batch
// pnpm exec i18n-bakery batter src --locale en

// 3. Desactiva auto-baking después de fase inicial
initI18n({
  saveMissing: false, // Desactivar después de setup inicial
});
```

### Problema 5: Conflictos en Git

**Síntomas:**

- Merge conflicts en archivos JSON
- Timestamps diferentes

**Soluciones:**

```bash
# 1. Usa .gitattributes para merge strategy
echo "locales/**/*.json merge=union" >> .gitattributes

# 2. O usa herramienta de merge específica
git config merge.ours.driver true

# 3. Revisa manualmente después de merge
git diff locales/
```

---

## 🎓 Conclusión

**Auto-Baking** es la característica distintiva de i18n-bakery que:

✅ **Acelera el desarrollo** eliminando trabajo manual  
✅ **Reduce errores** con generación automática  
✅ **Mejora DX** con flujo de trabajo natural  
✅ **Gestiona variantes** automáticamente  
✅ **Incluye metadata** rica para auditoría

### Cuándo Usar Auto-Baking

| Escenario                         | Recomendación                 |
| --------------------------------- | ----------------------------- |
| **Prototipo/MVP**                 | ✅ Sí, absolutamente          |
| **Desarrollo rápido**             | ✅ Sí, ideal                  |
| **Proyecto nuevo**                | ✅ Sí, recomendado            |
| **Equipo pequeño**                | ✅ Sí, ahorra tiempo          |
| **Con traductores profesionales** | ⚠️ Usa CLI en su lugar        |
| **Producción enterprise**         | ⚠️ Desactiva después de setup |

### Próximos Pasos

1. **Prueba Auto-Baking** en un proyecto de prueba
2. **Lee** [TOML_SUPPORT.md](./TOML_SUPPORT.md) para formato alternativo
3. **Explora** [I18NEXT_COMPARISON.md](./I18NEXT_COMPARISON.md) para migración
4. **Contribuye** con feedback y mejoras

---

<div align="center">

**🥯 "The dough that kneads itself is the baker's dream."**

_Made with 🍩 and Clean Architecture_

[⭐ Star on GitHub](https://github.com/artur0sky/i18n-bakery) | [📦 View on NPM](https://www.npmjs.com/package/@i18n-bakery/core)

</div>
