# Tasks: us-13-refresh-token

Este documento detalla el desglose de tareas cronológicas para implementar la US13 siguiendo estrictamente el ciclo TDD.

## Phase 1: Test-First Setup (RED)
- [x] **Task 1.1**: Crear el archivo de pruebas `src/services/apiClient.test.js` y mockear globalmente `window.fetch` para interceptar llamadas de red.
- [x] **Task 1.2**: Escribir un test unitario en `apiClient.test.js` que verifique que `apiClient.get` inyecte la cabecera `Authorization: Bearer <token>` recuperada de `localStorage` y la cabecera `Accept-Language` con el idioma de i18next (RED).
- [x] **Task 1.3**: Escribir un test unitario en `apiClient.test.js` que simule una llamada que retorna `401 Unauthorized`, gatille una llamada silenciosa a `/auth/refresh` y reintente con éxito la llamada original resolviendo la respuesta correcta (RED).
- [x] **Task 1.4**: Escribir un test unitario en `apiClient.test.js` que verifique la cola de peticiones concurrentes: dispare múltiples llamadas simultáneas que retornen `401`, compruebe que se realice una única solicitud de refresh y que todas las llamadas concurrentes sean reintentadas con éxito (RED).
- [x] **Task 1.5**: Escribir un test unitario en `apiClient.test.js` que compruebe el flujo de expiración total: si la llamada a `/auth/refresh` responde con `401`, debe limpiar el almacenamiento local y despachar el evento global `auth:expired` (RED).

## Phase 2: Core Implementation (GREEN)
- [x] **Task 2.1**: Crear `src/services/apiClient.js` con el wrapper de fetch, inyección automática de headers de sesión e idioma, y la configuración de `credentials: 'include'` por defecto.
- [x] **Task 2.2**: Implementar el semáforo `isRefreshing`, la cola de peticiones concurrentes `failedQueue`, y la lógica para procesar la cola resolviendo o rechazando las promesas pendientes tras el refresh.
- [x] **Task 2.3**: Implementar la intercepción de códigos de error `401`, el fetch silencioso a `/auth/refresh` y la emisión del evento `auth:expired` en la ventana global (`window`).
- [x] **Task 2.4**: Ejecutar `pnpm.cmd test:run` para comprobar que la suite de `apiClient.test.js` pase a verde (GREEN).

## Phase 3: Integration & Global Auth Setup
- [x] **Task 3.1**: Modificar `src/context/AuthContext.jsx` para registrar un event listener del evento `auth:expired` que limpie el token de `localStorage`, resetee el estado del usuario logueado en React y navegue a `/login` pasando la variable de estado `expired: true`.
- [x] **Task 3.2**: Refactorizar `src/services/authService.js` para reemplazar los fetch directos por llamadas al `apiClient`, garantizando que login y logout propaguen `credentials: 'include'`.
- [x] **Task 3.3**: Refactorizar `src/services/cardService.js` para que consuma sus endpoints a través del `apiClient`.
- [x] **Task 3.4**: Ejecutar la suite completa de tests unitarios de la aplicación y el linter para asegurar que el comportamiento del catálogo no tenga regresiones.
