# Proposal: us-17-types-and-rarities-front

## Intent
Desacoplar los tipos y rarezas de cartas del frontend (actualmente estáticos) mediante su consulta dinámica desde la API del backend, permitiendo flexibilidad en el catálogo y retrocompatibilidad del i18n.

## Scope

### In Scope
- Crear `src/services/lookupService.js` para consumir `GET /api/types` y `GET /api/rarities`.
- Integrar la caché en memoria del servicio indexada por idioma (`i18n.language`).
- Modificar `src/hooks/useCardForm.js` para mapear tipos y rarezas dinámicamente y extender el flag `fetching`.
- Modificar `src/pages/Home.jsx` para poblar los filtros dinámicamente.
- Actualizar y adaptar pruebas unitarias en `useCardForm.test.js` y `Home.test.jsx`.

### Out of Scope
- Gestión o forja de cartas por IA (US8).
- Nuevas pantallas de administración de catálogos paramétricos.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `catalog`: Los filtros de búsqueda y la parametrización de tipos y rarezas en los formularios ahora dependen de metadatos dinámicos provistos por la API en lugar de constantes internas.

## Approach
Consumir de forma local y asíncrona la API de tipos y rarezas a través de un nuevo servicio `lookupService.js`. El servicio mantendrá una caché interna de las promesas de carga indexadas por el idioma actual de i18next (`i18n.language`). Los componentes `Home.jsx` y `useCardForm.js` invocarán el servicio al montarse y usarán sus flags de carga local (`fetching` / `isLoading`) para evitar renderizados inconsistentes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/services/lookupService.js` | New | Carga y caché de tipos y rarezas desde el backend. |
| `src/hooks/useCardForm.js` | Modified | Inicialización y mapeo dinámico de lookups asíncronos. |
| `src/pages/Home.jsx` | Modified | Filtros del catálogo dinámicos. |
| `src/constants/cardConstants.js` | Removed/Deprecated | Constantes de tipos y rarezas. |
| `src/hooks/useCardForm.test.js` | Modified | Mocks de lookups en el hook del formulario. |
| `src/pages/Home.test.jsx` | Modified | Mocks de lookups en pruebas de Home. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Carrera de carga en edición | Med | Extender el estado `fetching` de `useCardForm` para esperar a que la carta y los lookups paramétricos estén cargados antes de activar el formulario. |
| Desincronización de idioma | Low | Indexar la caché de `lookupService` usando `i18n.language` como clave para forzar la actualización al cambiar el idioma. |

## Rollback Plan
Revertir los cambios locales en Git ejecutando `git checkout -- .` y restaurando las constantes de `cardConstants.js` y `game.js`.

## Dependencies
- Backend Express corriendo en `http://localhost:3000` con endpoints `/api/types` y `/api/rarities` expuestos y funcionales.

## Success Criteria
- [ ] `Home.jsx` pobla los filtros consumiendo `/api/types` y `/api/rarities`.
- [ ] `CardFormModal.jsx` y `useCardForm.js` permiten la creación/edición usando opciones traídas del backend.
- [ ] La caché del servicio previene llamadas repetitivas.
- [ ] Todos los tests de la suite (`pnpm test:run`) pasan con éxito.
