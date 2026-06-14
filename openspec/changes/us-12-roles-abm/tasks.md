# Lista de Tareas: us-12-roles-abm (Roles de Administrador y ABM de Cartas)

## 1. Infraestructura y Autenticación con Roles
- [x] **Task 1.1**: Implementar la función `parseJwt(token)` en `src/utils/jwt.js` para decodificar de forma nativa el payload del JWT de manera segura.
- [x] **Task 1.2**: Modificar `src/context/AuthContext.jsx` para decodificar el token usando `parseJwt(token)` al loguearse (`login`) y restaurar la sesión (`restoreSession`), sincronizando el campo `role` del usuario en el estado.
- [x] **Task 1.3**: Extender el componente de ruta protegida `src/components/ProtectedRoute.jsx` para soportar la validación por `allowedRoles`.

## 2. Servicios de API (cardService)
- [x] **Task 2.1**: Implementar el método `getCardForEdit(id)` en `src/services/cardService.js` para invocar el endpoint `GET /api/cards/:id/edit` enviando la cabecera `Authorization: Bearer <token>`.
- [x] **Task 2.2**: Implementar los métodos `createCard(cardData)` (POST) y `updateCard(id, cardData)` (PUT) en `src/services/cardService.js` enviando el token en la cabecera.
- [x] **Task 2.3**: Implementar el método `deleteCard(id)` (DELETE) en `src/services/cardService.js` enviando el token en la cabecera.

## 3. Parametrización e Internacionalización (i18n)
- [x] **Task 3.1**: Crear el archivo de constantes `src/constants/cardConstants.js` definiendo los mapeos globales de `CARD_TYPES` y `CARD_RARITIES` con sus label keys correspondientes.
- [x] **Task 3.2**: Agregar las traducciones i18n para los labels del formulario administrativo, tipos de cartas, rarezas, botones de confirmación y toasts en `src/i18n/locales/es.json` y `src/i18n/locales/en.json`.

## 4. Desarrollo de Interfaz de Usuario (ABM)
- [x] **Task 4.1**: Crear el componente modal `src/components/CardFormModal.jsx` que implemente:
  - Formulario vertical para datos globales (`cost`, `atk`, `def`, `image`, `typeId`, `rarityId`).
  - Tabla de traducciones para Nombre y Descripción (Español e Inglés).
  - En modo Edición, llamada a `getCardForEdit(id)` al montar para precargar todos los campos.
  - Llamadas a la API correspondientes (`createCard`/`updateCard`/`deleteCard`) con manejo de estados de carga.
  - Segundo diálogo modal de confirmación antes de la eliminación.
  - Feedback visual por toasts traducidos i18n y ejecución del callback `onSuccess` para refrescar el Home tras una operación exitosa.
- [x] **Task 4.2**: Modificar `src/pages/Home.jsx` para:
  - Integrar el botón de "Nueva Carta" sobre el catálogo, visible únicamente si `user?.role === 'admin'`.
  - Vincularlo para abrir el `CardFormModal` en modo Alta.
  - Proveer el callback `onSuccess` que reinicie el catálogo a la página 1.
- [x] **Task 4.3**: Modificar `src/components/Card.jsx` para:
  - Integrar el botón flotante absoluto de edición (tres puntitos o lápiz) en las tarjetas de cartas, visible únicamente si `user?.role === 'admin'`.
  - Vincularlo para abrir el `CardFormModal` en modo Edición.

## 5. Pruebas y Validación (TDD)
- [ ] **Task 5.1**: Escribir y ejecutar pruebas unitarias para:
  - Validar el parser nativo de JWT en `tests/jwt.test.js`.
  - Validar las restricciones de `ProtectedRoute` en `tests/ProtectedRoute.test.jsx`.
  - Validar la visibilidad de los botones administrativos en `Card.test.jsx` y `Home.test.jsx`.
  - Validar la renderización y comportamiento del modal en `CardFormModal.test.jsx`.
- [ ] **Task 5.2**: Correr linter (`pnpm lint`) y verificar que todos los tests unitarios pasen con éxito sin regresiones.
