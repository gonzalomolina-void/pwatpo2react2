# Desglose de Tareas: us-19-post-abm-filter-sync

**Cambio**: us-19-post-abm-filter-sync  
**Fase**: Tareas (sdd-tasks)  
**Estado**: Completado  

Este documento detalla la secuencia cronológica de tareas requeridas para implementar la US19 siguiendo un enfoque de desarrollo guiado por pruebas (TDD).

---

## 📋 Lista de Tareas Cronológicas

### 📦 Bloque 1: SearchBar Reactivo

- [x] **1.1 (Test Unitario - Rojo):** Agregar pruebas unitarias en [SearchBar.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/SearchBar.test.jsx) en un nuevo bloque `describe('Reactive Props Sync')`:
  - Validar que al cambiar la prop `filters` externamente a `{ searchTerm: 'Test', selectedTypes: ['spell'], selectedRarities: ['epic'] }`, el valor de los estados internos (input text y estados de dropdowns) se sincronice.
  - Validar que al cambiar la prop `filters` **NO** se invoque la función `onSearch` recibida en las props (evitando bucles infinitos).
- [x] **1.2 (Implementación - Verde):** Modificar [SearchBar.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/SearchBar.jsx) para recibir la prop `filters`. Implementar el hook `useEffect` con la lógica de comparación superficial explicada en el diseño para actualizar los estados locales.
- [x] **1.3 (Verificación y Refactor):** Ejecutar `pnpm.cmd test:run` para comprobar que las nuevas pruebas unitarias pasen a verde (GREEN) y que no se rompan las pruebas preexistentes de SearchBar.

---

### 📦 Bloque 2: Actualización Optimista en useInfiniteCards

- [x] **2.1 (Test Unitario - Rojo):** Crear/modificar pruebas para el hook `useInfiniteCards`. Dado que el hook se testea integrado en `Home.test.jsx` (al no tener un archivo `useInfiniteCards.test.jsx` directo de fábrica), podemos:
  - Crear un archivo de test específico [useInfiniteCards.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useInfiniteCards.test.jsx) si se requiere, o escribir un test aislado usando `@testing-library/react` (método `renderHook`).
  - Escribir un test de `renderHook` que verifique que al llamar a `updateCardOptimistic(card)`, el estado `cards` se actualice optimistamente reemplazando la carta indicada y manteniendo las demás iguales.
- [x] **2.2 (Implementación - Verde):** Modificar [useInfiniteCards.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useInfiniteCards.js) agregando `updateCardOptimistic` con `useCallback`. Integrar el actualizador en el retorno del hook y hacer que actualice también la caché en memoria `homeCache.cards`.
- [x] **2.3 (Verificación y Refactor):** Ejecutar las pruebas del hook para certificar que la actualización optimista del catálogo funciona correctamente y que la caché se mantiene consistente.

---

### 📦 Bloque 3: Sincronización en CardFormModal

- [x] **3.1 (Test Unitario/Integración - Rojo):** Modificar las pruebas de `CardFormModal` (si tiene tests dedicados) o preparar mocks para verificar que las funciones de guardado (`handleSubmit` para alta/edición, y `handleDelete` para borrado) invoquen `onSuccess` pasando el payload enriquecido `{ action: 'create'|'edit'|'delete', card, cardId }`.
- [x] **3.2 (Implementación - Verde):** Modificar [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx). Asegurar que los endpoints asíncronos devuelvan los objetos actualizados/creados (`cardService.createCard` y `cardService.updateCard`), y pasar el payload de acción correspondiente al llamar a `onSuccess`.
- [x] **3.3 (Verificación):** Confirmar que el flujo interno del modal no genera inconsistencias o errores al invocar las llamadas enriquecidas de éxito.

---

### 📦 Bloque 4: Orquestación en Home

- [x] **4.1 (Test de Integración - Rojo):** Modificar [Home.test.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.test.jsx) para re-mockear `SearchBar` de manera que dibuje sus props en un atributo de datos (ej. `data-filters`) y simular las siguientes aserciones post-ABM:
  - Al recibir `onSuccess({ action: 'create' })` del modal -> Aserción: El buscador recibe props vacías (`{ searchTerm: '', selectedTypes: [], selectedRarities: [] }`) y se gatilla la recarga inicial.
  - Al recibir `onSuccess({ action: 'delete' })` del modal -> Aserción: El buscador recibe props vacías y se gatilla la recarga inicial.
  - Al recibir `onSuccess({ action: 'edit', card })` del modal -> Aserción: El buscador mantiene los filtros activos anteriores y se invoca la actualización optimista del hook.
- [x] **4.2 (Implementación - Verde):** Modificar [Home.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.jsx):
  - Añadir el estado local `searchFilters` para controlar la prop de `<SearchBar>`.
  - Reemplazar `handleCreateSuccess` por `handleFormSuccess`.
  - Orquestar las derivaciones de filtros y llamadas optimistas basadas en el payload de `onSuccess`.
- [x] **4.3 (Verificación Final):** Correr toda la suite de pruebas del proyecto (`pnpm.cmd test:run`) y asegurar cobertura completa en verde sin regresiones.
