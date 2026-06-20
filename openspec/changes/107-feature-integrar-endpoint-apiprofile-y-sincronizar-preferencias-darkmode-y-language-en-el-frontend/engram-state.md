# Engram Persistent Memory State

## Context Entry: Implemented /api/profile sync and upsert backend validation
*   **Topic Key:** `sdd/107-profile-sync`
*   **Type:** `architecture` | `bugfix`
*   **Scope:** `project`
*   **Timestamp:** 2026-06-20T13:58:00-03:00

### What was done
Se integró el endpoint `/api/profile` en el frontend, refactorizando `AuthContext.jsx` para gestionar el estado de tema e idioma de forma reactiva global. Se actualizaron `ThemeToggle.jsx` y `LanguageSelector.jsx` para sincronizarse con el contexto en lugar de usar localStorage de forma aislada. En el backend, se modificó el servicio de perfiles para utilizar `prisma.profile.upsert` asegurando resiliencia para usuarios legacy sin perfil.

### Why
Motivado por el Issue #107 para unificar la persistencia de preferencias de usuario entre navegadores/dispositivos y evitar fallas críticas al actualizar perfiles inexistentes en base de datos.

### Affected Files
*   [profile.service.js](file:///C:/Work/Uncoma/PWA/tpexpress/src/services/profile.service.js)
*   [prismaClient.js](file:///C:/Work/Uncoma/PWA/tpexpress/src/prisma/__mocks__/prismaClient.js)
*   [profile.service.test.js](file:///C:/Work/Uncoma/PWA/tpexpress/tests/profile.service.test.js)
*   [profileService.js](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/services/profileService.js)
*   [AuthContext.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/context/AuthContext.jsx)
*   [ThemeToggle.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/ThemeToggle.jsx)
*   [LanguageSelector.jsx](file:///C:/Work/Uncoma/PWA/pwatpo2react2/src/components/LanguageSelector.jsx)

### Technical Learnings & Gotchas
1.  **Vitest Mock Consumption:** Los mocks creados con `mockReturnValueOnce` para `preferencesService.getTheme` son consumidos por el renderizado inicial y el `useState` del proveedor, dejando vacíos los mocks para efectos secundarios asíncronos como `syncProfile`. Usar `mockReturnValue` normal previene esto.
2.  **i18n Testing Collision:** Importar el inicializador local de i18n (`src/i18n/index.js`) inyecta librerías reales de inicialización que rompen tests unitarios si el mock de `react-i18next` de componentes no define `initReactI18next`. La solución es importar `i18n` directamente de la librería `'i18next'`.
