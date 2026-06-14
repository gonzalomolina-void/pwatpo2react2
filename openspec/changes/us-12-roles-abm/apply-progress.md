# Implementation Progress: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

**Change**: us-12-roles-abm
**Mode**: Strict TDD

### Completed Tasks
- [x] **Task 1.1**: Implementar la función `parseJwt(token)` en `src/utils/jwt.js` para decodificar de forma nativa el payload del JWT de manera segura.
- [x] **Task 1.2**: Modificar `src/context/AuthContext.jsx` para decodificar el token usando `parseJwt(token)` al loguearse (`login`) y restaurar la sesión (`restoreSession`), sincronizando el campo `role` del usuario en el estado.
- [x] **Task 1.3**: Extender el componente de ruta protegida `src/components/ProtectedRoute.jsx` para soportar la validación por `allowedRoles`.
- [x] **Task 2.1**: Implementar el método `getCardForEdit(id)` en `src/services/cardService.js` para invocar el endpoint `GET /api/cards/:id/edit` enviando la cabecera `Authorization: Bearer <token>`.
- [x] **Task 2.2**: Implementar los métodos `createCard(cardData)` (POST) y `updateCard(id, cardData)` (PUT) en `src/services/cardService.js` enviando el token en la cabecera.
- [x] **Task 2.3**: Implementar el método `deleteCard(id)` (DELETE) en `src/services/cardService.js` enviando el token en la cabecera.
- [x] **Task 3.1**: Crear el archivo de constantes `src/constants/cardConstants.js` definiendo los mapeos globales de `CARD_TYPES` y `CARD_RARITIES` con sus label keys correspondientes.
- [x] **Task 3.2**: Agregar las traducciones i18n para los labels del formulario administrativo, tipos de cartas, rarezas, botones de confirmación y toasts en `src/i18n/locales/es.json` y `src/i18n/locales/en.json`.
- [x] **Task 4.1**: Crear el componente modal `src/components/CardFormModal.jsx` que implemente la edición, alta, confirmación, y callbacks.
- [x] **Task 4.2**: Modificar `src/pages/Home.jsx` para integrar el botón "Nueva Carta".
- [x] **Task 4.3**: Modificar `src/components/Card.jsx` para integrar el botón de edición en admin.
- [x] **Task 5.1**: Escribir y ejecutar pruebas unitarias de los nuevos flujos.
- [x] **Task 5.2**: Correr linter (`pnpm lint`) y verificar que todos los tests unitarios pasen con éxito sin regresiones.

### Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/utils/jwt.js` | Created | Native light utility to decode JWT tokens safely using `atob`. |
| `src/utils/jwt.test.js` | Created | Unit tests for native JWT parser. |
| `src/context/AuthContext.jsx` | Modified | Parse JWT on login/restore and sync user role. |
| `src/context/AuthContext.test.jsx` | Modified | Tests verifying role sync in session context. |
| `src/components/ProtectedRoute.jsx` | Modified | Add `allowedRoles` array validation. |
| `src/components/ProtectedRoute.test.jsx` | Modified | Tests for role protection redirection. |
| `src/services/cardService.js` | Modified | Swapped endpoint functions to use auth tokens. Added `getCardForEdit`, `createCard`, `updateCard`, `deleteCard`. |
| `src/services/cardService.test.js` | Modified | Mocked tests for edit, write, and delete card API requests. |
| `src/constants/cardConstants.js` | Created | Definitions for `CARD_TYPES` and `CARD_RARITIES` keys. |
| `src/components/CardFormModal.jsx` | Created | Unified form modal for card high/edit operations. Displays translated bilingual tables. |
| `src/components/CardFormModal.test.jsx` | Created | Render, callback, validation, and deletion confirmation tests. |
| `src/components/Card.jsx` | Modified | Added absolute floating edit button visible for admin roles. |
| `src/components/Card.test.jsx` | Modified | Added test coverage for edit button rendering and clicking. |
| `src/pages/Home.jsx` | Modified | Added "New Card" button visible for admin roles. |
| `src/pages/Home.test.jsx` | Modified | Added test coverage for the catalog creation modal triggers. |
| `src/pages/Favorites.test.jsx` | Modified | Fixed mock dependencies for Card and AuthContext. |

### Test Summary
- **Total tests in project**: 276 passed (all scenarios running successfully)
- **Status**: 13/13 tasks complete. Ready for verification (`sdd-verify`).
