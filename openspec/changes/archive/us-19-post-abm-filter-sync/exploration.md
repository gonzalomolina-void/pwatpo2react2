# Reporte de Exploración: us-19-post-abm-filter-sync

**Cambio**: us-19-post-abm-filter-sync  
**Estado**: Completado  

---

## 1. Contexto y Objetivos

El objetivo de la **US19** es garantizar una sincronización inteligente del estado de búsqueda y filtrado en el catálogo de cartas cuando se realicen con éxito acciones administrativas (ABM - Alta, Modificación, Baja).

Específicamente:
- **Creación (Alta)** o **Eliminación (Baja)**: El catálogo debe restablecerse por completo. Todos los filtros activos y términos de búsqueda deben limpiarse, y la lista debe volver a cargarse desde la página 1.
- **Edición (Modificación)**: Se deben conservar los filtros activos y términos de búsqueda del usuario. La lista debe recargarse desde la página 1 para reflejar los cambios, pero la interfaz local de usuario debe actualizar de forma *optimista* la carta editada para evitar transiciones molestas o parpadeos de carga.
- **SearchBar**: Debe ser capaz de responder a eventos de reinicio de estado iniciados por el componente padre [Home.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.jsx).

---

## 2. Investigación de la Base de Código

Analizamos los archivos involucrados en este flujo:

### A. [SearchBar.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/SearchBar.jsx)
- Maneja tres estados locales: `searchTerm` (string), `selectedTypes` (array) y `selectedRarities` (array).
- Emite búsquedas utilizando un manejador de entrada con debounce y llamadas directas para los cambios de checkbox.
- Actualmente no tiene ningún mecanismo para recibir nuevos valores o reinicios desde las props (estado no controlado).

### B. [Home.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.jsx)
- Utiliza el hook `useInfiniteCards` para gestionar el estado del catálogo.
- Controla la apertura y cierre de [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx).
- Implementa `handleCreateSuccess` que reinicia todos los filtros al tener éxito:
  ```javascript
  const handleCreateSuccess = () => {
    handleSearch({ searchTerm: '', selectedTypes: [], selectedRarities: [] });
  };
  ```
- *Limitación*: Este manejador se invoca para *todas* las operaciones (crear, editar, eliminar), y actualmente reinicia los filtros incondicionalmente, violando el requisito de mantenerlos al editar.

### C. [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx)
- Implementa la creación, edición y eliminación de cartas.
- En caso de éxito, ejecuta `onSuccess()` sin parámetros.
- *Limitación*: El callback no comunica *qué* operación tuvo éxito, lo que hace imposible que `Home.jsx` decida si debe reiniciar o conservar los filtros.

### D. [useInfiniteCards.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useInfiniteCards.js)
- Gestiona los estados locales: `cards`, `activeFilters`, `page`, `hasMore`.
- Guarda los estados en una caché en memoria (`homeCache`) para la persistencia entre navegaciones.
- No expone un actualizador directo para la lista de cartas, por lo que no podemos realizar actualizaciones optimistas en la UI sin volver a consultar al servidor.

---

## 3. Alternativas de Arquitectura e Implementación

### 1. Reinicio de Filtros en SearchBar

Evaluamos tres opciones para permitir que [Home.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.jsx) limpie los filtros internos del buscador:

| Estrategia | Detalles de Implementación | Pros | Contras |
| :--- | :--- | :--- | :--- |
| **Opción A: Componente Controlado Completo** | Elevar todos los estados de búsqueda/filtrado a `Home.jsx` y pasarlos como props con manejadores de cambio. | Fuente única de verdad. Declarativo. | Alto costo de re-renderizado en `Home` con cada pulsación de tecla, a menos que se optimice con referencias o debounce complejo. |
| **Opción B: Reinicio mediante Key de React** | Añadir una prop `key` a `<SearchBar key={searchKey} />` en `Home.jsx`. Incrementar `searchKey` cuando se requiera un reinicio. | Extremadamente simple. Utiliza el comportamiento nativo de React para desmontar y reiniciar el estado. Sin código extra en `SearchBar`. | Destruye y recrea los elementos del DOM, reiniciando el foco y las animaciones. |
| **Opción C: Estado Local Sincronizado por Props** | Añadir una prop `filters` a `SearchBar` y usar un `useEffect` interno para sincronizar los estados locales cuando la prop cambie. | Experiencia de usuario fluida. Preserva nodos del DOM y el foco. Flexible para futuros enlaces profundos o filtros precargados. | Requiere gestionar los efectos secundarios con cuidado para evitar bucles infinitos de eventos. |

> [!TIP]
> **Enfoque Recomendado**: **Opción C** (Estado Local Sincronizado). Mantiene el rendimiento de la entrada de texto de forma local y fluida, pero proporciona una vía limpia para que el padre envíe nuevos estados (como el reinicio) sin el costo de rendimiento de un componente completamente controlado.

---

## 4. Diseño de la Solución Propuesta

1. **Firma enriquecida de Callback en `CardFormModal`**:
   Modificar `onSuccess` para enviar detalles de la operación:
   - Crear: `onSuccess({ action: 'create', card: createdCard })`
   - Editar: `onSuccess({ action: 'edit', card: updatedCard })`
   - Eliminar: `onSuccess({ action: 'delete', cardId })`

2. **Manejo Unificado de Acciones en `Home`**:
   Reemplazar `handleCreateSuccess` por `handleFormSuccess`:
   - Si `action === 'create'` o `action === 'delete'`, reiniciar el estado a `{ searchTerm: '', selectedTypes: [], selectedRarities: [] }`.
   - Si `action === 'edit'`, mantener los filtros activos, pero invocar la actualización optimista y forzar la recarga de la página 1.

3. **Integración de Actualizaciones Optimistas en el Hook**:
   Modificar [useInfiniteCards.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useInfiniteCards.js) para exponer un método `updateCardOptimistic(updatedCard)`:
   - Actualiza el elemento correspondiente dentro del array de estado `cards`.
   - Actualiza la caché en memoria `homeCache` para mantenerla sincronizada.
   - Esto asegura que la UI se actualice de inmediato mientras se resuelve la consulta de red.

---

## 5. Próximos Pasos

1. Crear una Especificación detallada definiendo los escenarios de reinicio vs conservación de filtros.
2. Esbozar el Diseño Técnico mostrando ejemplos de código para las props de `SearchBar` y los cambios en el hook.
3. Formular la Lista de Tareas cumpliendo estrictamente el ciclo TDD.
