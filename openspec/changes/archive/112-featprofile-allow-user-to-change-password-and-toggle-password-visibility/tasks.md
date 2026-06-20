# Tasks: us-112-change-password-and-visibility

Checklist de tareas de desarrollo y validación para el formulario de perfil, cambio de contraseña y alternancia de visibilidad.

---

## Phase 1: Infrastructure & Configuration

- [x] **1.1 extend-auth-service**: Modificar `src/services/authService.js` para añadir la llamada `changePassword`.
- [x] **1.2 add-i18n-translations**: Agregar todas las claves de traducción requeridas bajo `profile.*` y `nav.profile` en `src/i18n/locales/es.json` y `en.json`.

---

## Phase 2: Implementation

- [x] **2.1 route-profile-page**: Configurar la ruta `/perfil` protegida en `src/App.jsx`.
- [x] **2.2 header-profile-navigation**: Modificar `src/components/Header.jsx` para inyectar enlaces dinámicos al perfil en Desktop y Mobile.
- [x] **2.3 build-profile-page**: Implementar la vista `src/pages/Profile.jsx` con formulario bilingüe, validaciones locales del cliente, visibilidad alternable independiente y estados dinámicos de carga/éxito/error.

---

## Phase 3: Testing & Verification

- [x] **3.1 test-auth-service-password**: Agregar tests unitarios para `authService.changePassword` en `src/services/authService.test.js`.
- [x] **3.2 test-header-profile-link**: Adaptar `src/components/Header.test.jsx` para comprobar los enlaces de navegación al perfil.
- [x] **3.3 test-profile-page-flows**: Crear `src/pages/Profile.test.jsx` cubriendo la suite completa de escenarios Given/When/Then.
- [x] **3.4 run-all-client-tests**: Correr la suite completa de pruebas locales (`pnpm test:run`) garantizando regresión cero.
