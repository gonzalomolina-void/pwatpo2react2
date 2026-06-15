# Propuesta de Cambio: us-19-post-abm-filter-sync

**Cambio**: us-19-post-abm-filter-sync  
**Fase**: Propuesta (sdd-propose)  
**Estado**: Listo para revisión  

---

## 1. Introducción y Motivación

El catálogo interactivo de la enciclopedia de cartas **HEXA** cuenta con un buscador y filtros por tipo y rareza. Sin embargo, cuando un usuario administrador realiza operaciones de creación, edición o eliminación de cartas a través del modal, la interfaz no maneja de forma inteligente el estado de los filtros del catálogo:
- Si se crea o borra una carta, los filtros deben limpiarse completamente para mostrar la nueva lista o reflejar la desaparición del elemento.
- Si se edita una carta, el usuario no debe perder el contexto de su búsqueda actual (filtros conservados), pero la carta editada debe actualizarse inmediatamente en pantalla (optimista) y refrescarse desde el backend.

Esta propuesta técnica aborda el diseño para lograr este comportamiento reactivo y eficiente.

---

## 2. Alcance del Cambio

Los siguientes componentes y módulos del frontend serán modificados:
1. [SearchBar.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/SearchBar.jsx): Se adaptará para recibir y responder a filtros externos por props, permitiendo su reinicio limpio.
2. [CardFormModal.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/CardFormModal.jsx): Se enriquecerá el callback `onSuccess` para enviar detalles precisos del tipo de acción realizada (`create`, `edit`, `delete`) y los objetos afectados.
3. [useInfiniteCards.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/hooks/useInfiniteCards.js): Se expondrá un actualizador de estado optimista (`updateCardOptimistic`) para modificar localmente una carta editada sin parpadeos de carga.
4. [Home.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/pages/Home.jsx): Se orquestará el flujo unificando el éxito del modal y la actualización del catálogo según el tipo de acción.

---

## 3. Enfoque Técnico Detallado

### A. Sincronización del Buscador (Props Controladas Reactivas)
En lugar de rehacer el componente para hacerlo 100% controlado (lo cual afectaría el rendimiento por re-renders continuos al tipear), se añadirá la prop `filters` a `SearchBar`:
```javascript
export default function SearchBar({
  onSearch,
  typeOptions = [],
  rarityOptions = [],
  debounceMs = 300,
  filters, // Nueva prop
})
```
Dentro de `SearchBar.jsx`, un `useEffect` observará cambios en `filters`. Si las props difieren de los estados locales internos (por ejemplo, cuando el padre manda un reset con valores vacíos), el buscador actualizará sus estados locales correspondientes:
- `setSearchTerm(filters.searchTerm)`
- `setSelectedTypes(filters.selectedTypes)`
- `setSelectedRarities(filters.selectedRarities)`

### B. Notificación Enriquecida desde el Modal
En `CardFormModal.jsx`, se modificará el evento `onSuccess`:
- Al **Crear**: `onSuccess({ action: 'create', card: createdCard })`
- Al **Editar**: `onSuccess({ action: 'edit', card: updatedCard })`
- Al **Eliminar**: `onSuccess({ action: 'delete', cardId })`

### C. Actualización Optimista en el Hook
En `useInfiniteCards.js`, se añadirá la función:
```javascript
const updateCardOptimistic = useCallback((updatedCard) => {
  setCards(prevCards => 
    prevCards.map(card => card.id === updatedCard.id ? { ...card, ...updatedCard } : card)
  );
}, []);
```
Esta función también actualizará la caché global `homeCache` para mantener la persistencia íntegra.

---

## 4. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| **Bucle de renderizado por `useEffect`** | Alto | En `SearchBar.jsx`, el `useEffect` solo actualizará el estado local si los valores de `filters` difieren de los estados locales actuales (`searchTerm !== filters.searchTerm`, etc.). No se emitirá `onSearch` desde este efecto. |
| **Pérdida de la carta editada en caché** | Medio | Al actualizar la carta optimistamente en el hook, se modificará tanto el estado local de React (`cards`) como la variable global de caché `homeCache`. |
| **Fallo en red al refrescar tras la edición** | Bajo | La actualización optimista ocurrirá de forma inmediata en el cliente. Si el refresco asíncrono posterior falla por problemas de red, la interfaz mantendrá la carta actualizada en memoria localmente y el estado de error del catálogo se manejará mediante la UI de error estándar de `Home`. |

---

## 5. Criterios de Aceptación Técnicos

1. **Creación**: El modal de creación se cierra con éxito -> `SearchBar` limpia su texto y dropdowns -> El catálogo recarga desde la página 1 sin filtros.
2. **Borrado**: El modal de confirmación elimina la carta -> `SearchBar` limpia su texto y dropdowns -> El catálogo recarga desde la página 1 sin filtros.
3. **Edición**: Se edita una carta y se guarda con éxito -> Los inputs de `SearchBar` mantienen sus valores actuales -> El hook actualiza la carta localmente (optimista) -> Se ejecuta la recarga de la página 1 con los filtros actuales conservados.
