## Exploration: us-17-types-and-rarities-front

### Current State
Actualmente, el catálogo de tipos y rarezas de cartas está completamente acoplado en el frontend de forma estática en dos archivos de constantes:
1. `src/constants/game.js`: Contiene `TYPE_OPTIONS` y `RARITY_OPTIONS` como arrays de strings, los cuales son mapeados en `src/pages/Home.jsx` e inyectados en el componente `<SearchBar />` para los filtros de búsqueda.
2. `src/constants/cardConstants.js`: Contiene `CARD_TYPES` y `CARD_RARITIES` como arrays de objetos con `id`, `code`, y `labelKey`. Son consumidos por `src/components/CardFormModal.jsx` y `src/hooks/useCardForm.js` para precargar las opciones del formulario y mapear el par `typeCode` / `rarityCode` que retorna el backend de cartas a sus IDs correspondientes.

Este esquema estático no permite cambios dinámicos desde la base de datos sin redesplegar la aplicación web y acopla la lógica i18n al archivo de traducciones locales en el cliente.

### Affected Areas
- `src/services/lookupService.js` (Nuevo) — Servicio para consumir `GET /api/types` y `GET /api/rarities` desde el backend.
- `src/hooks/useCardForm.js` — Modificado para inicializar y buscar los IDs correspondientes utilizando datos dinámicos asíncronos en lugar de constantes estáticas locales.
- `src/pages/Home.jsx` — Modificado para cargar dinámicamente las opciones de tipo y rareza mediante llamados al backend y poblar el buscador.
- `src/constants/cardConstants.js` — Deprecar o eliminar para evitar código muerto y asegurar acoplamiento cero.
- `src/constants/game.js` — Deprecar o eliminar sus arrays de opciones.

### Approaches
1. **Carga Dinámica con Contexto Global (LookupContext)**
   - Exponer un context provider (`LookupProvider`) que resuelva los tipos y rarezas al iniciar la app y los exponga a cualquier componente del árbol.
   - Pros: Evita llamadas HTTP redundantes y facilita el acceso mediante `useLookup()`.
   - Cons: Introduce sobrecarga de inicialización global y hooks innecesarios en componentes que no los usan.
   - Effort: Medium

2. **Carga Local con Caché a Nivel de Servicio (lookupService + useState/useEffect)**
   - Crear un servicio API simple que guarde en memoria (in-memory cache) las promesas resueltas de tipos y rarezas según el idioma. Los componentes que las requieran (`Home` y `CardFormModal`) las cargan localmente al montarse.
   - Pros: Sigue la arquitectura de estado local/hooks existente, es más modular, fácil de testear aisladamente y evita peticiones HTTP repetitivas mediante la caché del servicio.
   - Cons: Requiere propagar la carga asíncrona localmente en los componentes visuales.
   - Effort: Low/Medium

### Recommendation
Recomendamos el **Enfoque 2 (Carga Local con Caché a nivel de Servicio)**. Mantiene la modularidad y arquitectura del frontend actual sin forzar wrappers globales, resolviendo la optimización de red a nivel de capa de datos (`lookupService`) mediante una caché indexada por idioma.

### Risks
- **Desincronización de Idioma (i18n)**: Si el usuario cambia el idioma dinámicamente, la caché del servicio debe invalidarse o resolverse según el nuevo `i18n.language` para retornar los nombres localizados correspondientes.
- **Carreras de Carga (Race Conditions) en Edición**: El formulario de edición no puede emparejar el ID de la carta con el código hasta que los tipos/rarezas terminen de cargarse. Debemos asegurar que el estado de carga (`fetching`) del formulario espere a ambos llamados asíncronos antes de habilitar el render del contenido.

### Ready for Proposal
Yes — Estamos listos para proceder a la fase de proposal. Debemos presentarle el análisis al usuario para avanzar a la propuesta formal.
