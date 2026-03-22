# I18n Bakery - Refactoring & Consistency Audit

## Descripción del Problema
Se identificaron múltiples inconsistencias y falta de estandarización en el proyecto `i18n-bakery` debido a su rápido crecimiento y a la dispersión de la lógica entre múltiples paquetes (`cli`, `tray`, `poacher`). Las principales inconsistencias abordadas fueron:

1.  **Lógica Fragmentada de Extracción (DRY/SRP):** El CLI (`batter.ts`), el servidor MCP Tray (`BatterUseCase.ts`) y la herramienta de migración Poacher (`ScoutRecipes.ts`) tenían cada uno su propia implementación de escaneo y extracción utilizando la herramienta base `BabelKeyExtractor`, repitiendo código de búsqueda de archivos a través de `glob`.
2.  **Inconsistencia en el Guardado y Formato (SOLID):** Funciones similares dentro de Tray (`RecipeUseCase.ts`) y CLI poseían lógicas de aplanamiento (flatten) y desaplanamiento (unflatten) manuales que podían divergir, en lugar de aprovechar el `JSONFileSaver` central que asegura ordenamiento alfabético y estructuración consistente.
3.  **Migración Poacher vs Estructura Central:** La herramienta de migración asignaba ciegamente las variables de un sólo archivo a la raíz (`translation.json`) en lugar de interpretar los prefijos de espacios de nombres.
4.  **Funciones MCP Ocultas del CLI:** Herramientas útiles como añadir llaves estáticas (`recipe`) o comprobar estadísticas y avance de idiomas faltantes (`pantry`) estaban limitadas únicamente al contexto de LLM de Tray MCP Server y ausentes para usuarios de terminal (CLI). 

## Acciones Realizadas

### 1. Centralización de Casos de Uso (SOLID / DRY)
Se introdujeron y movieron UseCases principales con responsabilidades únicas (SRP) hacia el paquete central `@i18n-bakery/baker`.

- **`ProjectScanner`:** Creado en `baker` para tomar el control de la búsqueda recursiva a través del sistema de ficheros de todas las llaves (t) usando `BabelKeyExtractor` emitiendo no sólo la métrica de llaves sino ficheros analizados.
- **`ExtractionUseCase`:** Creado para sustituir la compleja y repetitiva ensalada de código del CLI (`batter`) y de MCP (`BatterUseCase`). Toma `ProjectScanner` y empuja inmediatamente lo extraído a `JSONFileSaver` o `TOMLFileSaver`.
- **`PantryUseCase` y `RecipeUseCase`:** Mudados desde el paquete *tray* a dependencias puras del paquete *baker* para que sean abstractos y reutilizables en cualquier interfaz.

### 2. Estandarización del Parser / Serializer
- **`RecipeUseCase` (Baker):** Modificado para deshacerse de su lógica manual de modificación atómica y usar `JSONFileSaver` para inyectar una nueva llave. De esta manera, sin importar si una llave entra por CLI, por MCP, o por extracción automática (batter), usará el mismo algoritmo exacto de recursión y ordenamiento.
- **`BakeryTarget` (Poacher):** Refactorizado para que la clase encargada de exportar archivos migrados utilice el motor `JSONFileSaver`, resolviendo la escritura inconsistente y el mapeo incorrecto a `translation.json`.

### 3. CLI Paridad con MCP
El CLI (`packages/cli/src/index.ts`) fue expandido para contar con todas las características de la librería. Se incluyeron los comandos:
- `i18n-bakery pantry` - Permite ver por CLI qué variables faltan de traducir contra los códigos base o contra `en.json`.
- `i18n-bakery recipe` - Permite insertar directamente por comando una llave particular (Útil durante CI/CD).
- `i18n-bakery poach` y `scout` - Ahora visibles en CLI evitando necesitar comandos binarios aislados. 

### 4. Correcciones Estructurales TypeScript
- Se corrigieron los imports rotos.
- Se repararon sentencias Regex que no cumplían reglas del TypeScript linter.
- El paquete CLI integró `@i18n-bakery/poacher` como dependencia Workspace.

## Requisitos de Segundo Nivel Cumplidos
- **Atomicidad (Atomic Design en Backend):** Pequeñas clases para manipulación singular, por ejemplo `ProjectScanner` delega a extractores aislados. 
- **Inversión de Dependencias (DIP):** Los archivos CLI y Tray ahora son simplemente *controladores/presentadores* inofensivos, construyendo e inyectando lógica hacia las clases nucleares de *Baker*.
- **Compatibilidad con Windows / Posix:** Rutas estandarizadas `path.join`, validación de directorios para evitar Path Traversal Vulnerabilities durante creación de Namespaces y `__proto__` pollution check fortalecido en el módulo central de inyección.

## Recomendaciones a futuro
- Actualizar `baker` para usar paralelismo con `Promise.all` cuando los repositorios superen los 10,000 archivos para mejorar la velocidad extrayendo.
- Ampliar las comprobaciones (tests) en CI/CD que cubran que los outputs de `pantry` y `recipe` regresen los estados de sistema correctos tanto para MCP (Response) como para CLI (Logger outputs).
