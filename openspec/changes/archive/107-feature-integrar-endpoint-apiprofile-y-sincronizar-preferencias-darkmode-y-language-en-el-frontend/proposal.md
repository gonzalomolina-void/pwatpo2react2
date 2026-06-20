# Proposal: us-107-profile-integration

Esta propuesta define la integración del endpoint `/api/profile` en el frontend de HEXA para recuperar y actualizar las preferencias de perfil de usuario (`darkMode` y `language`), sincronizándolas entre el cliente local y la base de datos remota del usuario autenticado.

---

## 1. Context & Intent

Actualmente, las preferencias de idioma (`language`) y tema (`darkMode`) se guardan y leen exclusivamente en el cliente mediante `preferencesService` (encapsulado sobre localStorage/sessionStorage). Esto provoca que si un usuario cambia de navegador, borra el almacenamiento local, o inicia sesión desde otro dispositivo, pierda sus preferencias de visualización.

El backend ahora ofrece el endpoint `/api/profile` para persistir estas preferencias asociadas al usuario autenticado. Nuestro objetivo es:
1. Sincronizar las preferencias del backend al iniciar sesión (`login`) o restaurarla (`restoreSession`).
2. Actualizar las preferencias en el backend cuando el usuario realice un cambio en la interfaz (`ThemeToggle`, `LanguageSelector`).
3. Mantener el comportamiento del cliente para usuarios anónimos en páginas públicas (como el Login).

---

## 2. Technical Scope

### 2.1 New Files
*   `src/services/profileService.js`: Servicio API cliente para interactuar con `/api/profile` (GET y PUT).
*   `src/services/profileService.test.js`: Pruebas unitarias para el nuevo servicio de perfil.

### 2.2 Modified Files
*   `src/context/AuthContext.jsx`: Integrará la sincronización en el ciclo de vida de la sesión (restore y login) y ofrecerá un método para propagar cambios de preferencias.
*   `src/context/AuthContext.test.jsx`: Adaptaciones de pruebas para cubrir la sincronización del perfil.
*   `src/components/ThemeToggle.jsx`: Refactorizado para usar el flujo del contexto de autenticación si está logueado.
*   `src/components/ThemeToggle.test.jsx`: Mock del flujo sincronizado de preferencias.
*   `src/components/LanguageSelector.jsx`: Refactorizado para utilizar la sincronización del idioma si está autenticado.
*   `src/components/LanguageSelector.test.jsx`: Pruebas adaptadas al comportamiento sincronizado.

---

## 3. Implementation Approach

1.  **Sincronización en la carga inicial / login**:
    *   Al restaurar sesión o iniciar sesión exitosamente en `AuthContext`:
        *   Obtener el perfil del usuario mediante `profileService.getProfile()`.
        *   Si el perfil devuelto por la API tiene valores definidos para `language` o `darkMode`, sincronizarlos localmente (`preferencesService.setTheme`, `preferencesService.setLanguage`, y llamar a `i18n.changeLanguage`).
        *   Si el perfil no está inicializado en la base de datos (o la API devuelve valores por defecto y no coinciden con los que ya tiene el cliente), propagar los valores locales actuales del cliente al backend llamando a `profileService.updateProfile()`.
2.  **Propagación de cambios en caliente**:
    *   Ofrecer una función en `AuthContext` llamada `updatePreferences({ darkMode, language })`.
    *   Esta función actualizará el estado local (`preferencesService`, `i18n` y clases del DOM) y, si el usuario está autenticado, realizará la llamada `PUT /api/profile` de forma asíncrona (sin bloquear la interfaz del usuario).

---

## 4. Rollback & Risk Plan

*   **Riesgo de falla de red en la actualización**: Si la petición `PUT` al backend falla, mostraremos un log de error pero mantendremos la experiencia local del usuario intacta. No bloquearemos la navegación ni revertiremos el cambio local a menos que sea un fallo crítico del token, en cuyo caso el interceptor de `apiClient` manejará la expiración de sesión de forma nativa.
*   **Plan de Rollback**: En caso de regresiones mayores, podemos deshabilitar la sincronización remota mediante un flag en `AuthContext.jsx` o volviendo a los componentes originales que interactúan exclusivamente con `preferencesService`.
