# Tasks: us-17-types-and-rarities-front

## Phase 1: Servicio de Lookups (lookupService)

- [x] 1.1 (TDD - Rojo): Crear `src/services/lookupService.test.js` para validar que `getTypes` y `getRarities` realicen fetch a la API, almacenen la promesa en caché por idioma y manejen fallas.
- [x] 1.2 (TDD - Verde): Crear `src/services/lookupService.js` con las llamadas a `apiClient` e in-memory cache.

## Phase 2: Filtros de Catálogo (Home & SearchBar)

- [x] 2.1 (TDD - Rojo): Modificar `src/pages/Home.test.jsx` mockeando `lookupService` para verificar la carga dinámica de tipos y rarezas en los filtros e invalidación reactiva por i18n.
- [x] 2.2 (TDD - Verde): Modificar `src/pages/Home.jsx` inyectando llamadas a `lookupService` mediante `useEffect` dependiente de `i18n.language`.

## Phase 3: Formulario de Cartas (useCardForm & CardFormModal)

- [ ] 3.1 (TDD - Rojo): Modificar `src/hooks/useCardForm.test.js` para mockear `lookupService` y validar el mapeo de IDs numéricos asíncronos en modo alta y edición.
- [ ] 3.2 (TDD - Verde): Modificar `src/hooks/useCardForm.js` integrando lookups dinámicos y coordinando el flag `fetching` para retrasar el renderizado del formulario.
- [ ] 3.3 Modificar `src/components/CardFormModal.jsx` y `src/components/CardStatsGrid.jsx` para recibir props dinámicas.

## Phase 4: Limpieza y Verificación

- [ ] 4.1 Eliminar el archivo de constantes estáticas `src/constants/cardConstants.js` y limpiar constantes obsoletas en `src/constants/game.js`.
- [ ] 4.2 Ejecutar `pnpm lint` y correr toda la suite de pruebas unitarias (`pnpm test:run`) en verde.
