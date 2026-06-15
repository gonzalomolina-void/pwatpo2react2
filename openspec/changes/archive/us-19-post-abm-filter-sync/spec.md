# Especificación de Requerimientos: us-19-post-abm-filter-sync

**Cambio**: us-19-post-abm-filter-sync  
**Fase**: Especificación (sdd-spec)  
**Estado**: Listo para revisión  

---

## 1. Requerimientos Funcionales y Técnicos

### REQ-1: Reinicio de Filtros en Creación y Eliminación
- **Descripción**: Cuando un usuario administrador crea una nueva carta o elimina una carta existente con éxito, el catálogo debe restablecer todas sus condiciones de búsqueda a su estado inicial vacío.
- **Detalle Técnico**:
  - Se debe vaciar el término de búsqueda de texto (`searchTerm` = `""`).
  - Se deben limpiar los filtros de tipo y rareza seleccionados (`selectedTypes` = `[]`, `selectedRarities` = `[]`).
  - El catálogo de cartas debe recargar desde la página 1.

### REQ-2: Conservación de Filtros en Edición
- **Descripción**: Cuando un usuario administrador edita una carta existente con éxito, el catálogo debe conservar la búsqueda y los filtros seleccionados por el usuario.
- **Detalle Técnico**:
  - El valor del término de búsqueda y los dropdowns de filtros deben permanecer inalterados en la UI.
  - La visualización de la carta editada en el listado debe reflejar los nuevos datos inmediatamente (actualización optimista en el cliente).
  - Se debe disparar un refresco de la página 1 del catálogo en segundo plano o de forma síncrona para sincronizarse con el backend.

### REQ-3: Control Reactivo de SearchBar mediante Props
- **Descripción**: El componente `SearchBar` debe ser capaz de reaccionar de forma declarativa a los reinicios de estado forzados por el padre `Home`.
- **Detalle Técnico**:
  - Debe recibir una prop `filters` estructurada como: `{ searchTerm: string, selectedTypes: string[], selectedRarities: string[] }`.
  - Cuando la prop `filters` cambie externamente y sea distinta al estado local del buscador, el componente debe actualizar sus estados internos.
  - La sincronización no debe gatillar llamadas redundantes al callback de búsqueda `onSearch` para evitar loops de renderizado.

---

## 2. Escenarios de Aceptación (Gherkin)

### Escenario 1: Limpieza de filtros al crear una carta con éxito
- **Dado** que el usuario está en el catálogo con los filtros activos `searchTerm: "Dragon"`, `selectedTypes: ["fuego"]` y `selectedRarities: ["rare"]`
- **Y** el usuario es un administrador
- **Cuando** abre el modal de administración, completa los datos de una nueva carta y hace clic en "Guardar"
- **Entonces** el modal se cierra con éxito
- **Y** se gatilla el evento de éxito indicando la acción `create`
- **Y** el estado de los filtros en `Home` se restablece a vacío
- **Y** el componente `SearchBar` actualiza sus inputs y selectores visualmente a vacío
- **Y** el catálogo vuelve a consultar al backend desde la página 1 con filtros vacíos.

### Escenario 2: Limpieza de filtros al eliminar una carta con éxito
- **Dado** que el usuario está en el catálogo con los filtros activos `searchTerm: "Dragon"`, `selectedTypes: ["fuego"]` y `selectedRarities: ["rare"]`
- **Y** el usuario es un administrador
- **Cuando** abre el modal de edición de una carta existente, hace clic en "Eliminar" y confirma la acción en el diálogo secundario
- **Entonces** el modal se cierra con éxito
- **Y** se gatilla el evento de éxito indicando la acción `delete`
- **Y** el estado de los filtros en `Home` se restablece a vacío
- **Y** el componente `SearchBar` actualiza sus inputs y selectores visualmente a vacío
- **Y** el catálogo vuelve a consultar al backend desde la página 1 con filtros vacíos.

### Escenario 3: Conservación de filtros y actualización optimista al editar una carta
- **Dado** que el usuario está en el catálogo con los filtros activos `searchTerm: "Dragon"`, `selectedTypes: ["fuego"]` y `selectedRarities: ["rare"]`
- **Y** la carta con ID `"123"` llamada `"Red Dragon"` se visualiza en la lista
- **Cuando** el usuario administrador abre el modal de edición para esa carta, cambia su nombre a `"Crimson Dragon"` y hace clic en "Guardar"
- **Entonces** el modal se cierra con éxito
- **Y** se gatilla el evento de éxito indicando la acción `edit` con los nuevos datos de la carta
- **Y** el buscador mantiene intacto el texto `"Dragon"` y los dropdowns seleccionados
- **Y** la carta `"123"` en el catálogo local pasa a mostrarse inmediatamente con el nombre `"Crimson Dragon"` (actualización optimista)
- **Y** el catálogo recarga la página 1 desde la API preservando la búsqueda activa `"Dragon"`.

### Escenario 4: Sincronización reactiva de SearchBar sin bucles de renderizado
- **Dado** que el componente `SearchBar` está renderizado
- **Cuando** recibe una prop `filters` modificada desde el padre
- **Entonces** actualiza su estado local interno (`searchTerm`, `selectedTypes`, `selectedRarities`) para reflejar los nuevos valores de la prop
- **Y** no emite el callback `onSearch` en respuesta a esa actualización de props para evitar bucles infinitos de eventos.
