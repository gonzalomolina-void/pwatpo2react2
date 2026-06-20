# Tasks: us-107-profile-integration

Checklist de tareas de implementación y pruebas para integrar el endpoint `/api/profile` y sincronizar las preferencias de usuario.

---

## Phase 1: Infrastructure

- [ ] **1.1 backend-upsert-service**: Modificar `updateProfile` en `tpexpress/src/services/profile.service.js` utilizando `prisma.profile.upsert` para dar soporte resiliente a usuarios legacy sin perfil.
- [ ] **1.2 backend-tests-validation**: Ejecutar tests del backend para asegurar el correcto funcionamiento del servicio de perfil.
- [ ] **1.3 frontend-profile-service**: Crear `src/services/profileService.js` en el frontend con soporte para `getProfile` y `updateProfile` usando el cliente `apiClient`.

---

## Phase 2: Implementation

- [ ] **2.1 auth-context-sync-on-login**: Refactorizar `src/context/AuthContext.jsx` para inyectar la llamada a `getProfile` y su lógica de reconciliación en los flujos de inicio de sesión (`login`) y restauración de sesión (`restoreSession`).
- [ ] **2.2 auth-context-update-preferences**: Proveer el método unificado `updatePreferences` en `AuthContext.jsx` que guarde localmente y mande `PUT` al backend asíncronamente si el usuario está autenticado.
- [ ] **2.3 refactor-theme-toggle**: Modificar `src/components/ThemeToggle.jsx` para utilizar `updatePreferences` desde el contexto en lugar de manipular directamente `preferencesService` si el usuario está logueado.
- [ ] **2.4 refactor-language-selector**: Modificar `src/components/LanguageSelector.jsx` para consumir `updatePreferences` del contexto cuando haya una sesión activa.

---

## Phase 3: Testing & Verification

- [ ] **3.1 test-profile-service**: Crear `src/services/profileService.test.js` y verificar el correcto mockeo y respuestas del servicio API de perfil.
- [ ] **3.2 test-auth-context-sync**: Escribir pruebas unitarias en `src/context/AuthContext.test.jsx` para validar el comportamiento de sincronización inicial y reconciliación de datos servidor-cliente.
- [ ] **3.3 test-components-refactor**: Adaptar `src/components/ThemeToggle.test.jsx` y `src/components/LanguageSelector.test.jsx` mockeando el `useAuth` y validando que llamen correctamente a `updatePreferences`.
- [ ] **3.4 run-all-tests**: Ejecutar toda la suite de tests en frontend (`pnpm test:run`) y backend para garantizar regresión cero.
