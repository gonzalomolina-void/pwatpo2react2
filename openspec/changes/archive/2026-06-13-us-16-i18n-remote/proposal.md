# Proposal: us-16-i18n-remote

## Intent
Resolver el bug por el cual la página de detalles de la carta no actualiza su lore y estadísticas traducidas al cambiar de idioma desde el encabezado, debido a que el fetch a la API no se re-ejecuta al cambiar la propiedad `i18n.language`.

## Scope

### In Scope
- Actualizar el arreglo de dependencias del hook `useEffect` en la página de detalles para que reaccione a los cambios de `i18n.language`.
- Mostrar el spinner de carga temático durante el refetch del cambio de idioma.
- Modificar los tests unitarios en la vista de detalle para mockear el cambio de locale de forma dinámica y verificar el comportamiento reactivo (TDD).

### Out of Scope
- Modificaciones a otros servicios de traducción estática.
- Cambios en el backend.

## Capabilities

### New Capabilities
- `remote-i18n-reload`: Recarga reactiva de datos de carta en el idioma correspondiente cuando el usuario cambia el idioma general de la aplicación.

### Modified Capabilities
None.

## Approach
Agregar `i18n.language` a las dependencias de `useEffect` en `Detail.jsx`. Esto asegura que cuando cambie el idioma, el hook se reactive, aborte la petición asíncrona anterior (evitando race conditions) y realice una nueva petición a `cardService.getCardById` con el nuevo locale.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/Detail.jsx` | Modified | Agregar `i18n.language` a las dependencias del `useEffect` de carga. |
| `src/pages/Detail.test.jsx` | Modified | Añadir test para verificar la reactividad ante cambios de idioma. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Multiples peticiones innecesarias | Low | El `AbortController` cancela automáticamente peticiones anteriores si hay cambios ultra rápidos. |

## Rollback Plan
Revertir el commit usando git: `git revert HEAD` o restaurar las dependencias anteriores del `useEffect` en `Detail.jsx` `[id, navigate]`.

## Dependencies
None.

## Success Criteria
- [ ] Al cambiar el idioma de la aplicación en la vista de detalles de una carta, se dispara un nuevo fetch a la API.
- [ ] Se muestra el `LoadingSpinner` durante la recarga de los datos.
- [ ] Todos los tests de la suite de pruebas unitarias pasan exitosamente en verde.
