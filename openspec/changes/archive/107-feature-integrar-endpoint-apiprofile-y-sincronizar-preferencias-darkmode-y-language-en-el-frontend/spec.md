# Specification: us-107-profile-integration

Esta especificación detalla las capacidades y escenarios requeridos para integrar el endpoint `/api/profile` en el frontend y sincronizar las preferencias de tema y lenguaje del usuario.

---

## 1. Capabilities

*   **`fetch-remote-profile`**: El cliente debe recuperar el perfil del usuario autenticado desde `/api/profile` tras iniciar o restaurar la sesión.
*   **`apply-profile-preferences`**: El cliente debe aplicar las preferencias del perfil (`darkMode`, `language`) tanto en el almacenamiento local como en la interfaz gráfica (clase `dark` en el DOM y lenguaje activo de `i18next`).
*   **`reconcile-preferences-on-login`**: Si las preferencias devueltas por el servidor difieren de las configuradas en el cliente al momento de loguearse (por ejemplo, si el usuario las cambió antes de entrar), el cliente debe sincronizar el servidor enviando un `PUT` con las preferencias actuales del cliente.
*   **`hot-sync-preferences`**: Al cambiar el tema o el idioma en caliente, el cliente debe persistir localmente y enviar de forma asíncrona un `PUT /api/profile` al backend (solo si está autenticado).
*   **`resilient-offline-fallback`**: Las fallas en la API de perfil no deben interrumpir la experiencia de usuario local; el cliente mantendrá las configuraciones locales y reportará el error silenciosamente.

---

## 2. Scenarios

### Scenario 1: Sincronización al iniciar sesión (Perfil Remoto Existente)
*   **Given** Un usuario no autenticado en el cliente que posee las preferencias locales por defecto (`language: 'es'`, `darkMode: false`).
*   **When** El usuario inicia sesión de forma exitosa y el backend retorna en `/api/profile` un perfil existente con `{ language: 'en', darkMode: true }`.
*   **Then** El cliente MUST actualizar sus preferencias locales (`preferencesService` y estado de la app) a `{ language: 'en', darkMode: true }`.
*   **And** El cliente MUST cambiar el idioma activo de `i18next` a `"en"`.
*   **And** El cliente MUST aplicar la clase `dark` en el tag `html` del DOM.

### Scenario 2: Sincronización al iniciar sesión (Sin Perfil Remoto - Reconciliación del Cliente)
*   **Given** Un usuario no autenticado que cambió manualmente las preferencias locales a `{ language: 'en', darkMode: true }` en la pantalla de login.
*   **When** El usuario inicia sesión y la llamada a `GET /api/profile` retorna los valores por defecto del servidor `{ language: 'es', darkMode: false }` (perfil no inicializado o default).
*   **Then** El cliente MUST detectar la discrepancia y realizar un `PUT /api/profile` con las preferencias del cliente `{ language: 'en', darkMode: true }` para persistirlas en el backend.
*   **And** El cliente SHALL mantener sus preferencias locales en `{ language: 'en', darkMode: true }`.

### Scenario 3: Restaurar sesión (Sincronización de Perfil)
*   **Given** Un usuario que recarga la página y posee un token de sesión válido guardado en localStorage.
*   **When** Se ejecuta el flujo `restoreSession` y se obtiene exitosamente el perfil del usuario desde `GET /api/profile`.
*   **Then** El cliente MUST aplicar las preferencias obtenidas (`language` y `darkMode`) en el almacenamiento local y la interfaz.

### Scenario 4: Actualización en caliente de preferencias (Usuario Autenticado)
*   **Given** Un usuario autenticado en la aplicación.
*   **When** El usuario hace clic en `ThemeToggle` (cambiando a dark/light) o en `LanguageSelector` (cambiando a es/en).
*   **Then** El cliente MUST guardar el valor localmente en `preferencesService`.
*   **And** El cliente MUST actualizar visualmente la interfaz (clase `dark` o idioma de `i18n`).
*   **And** El cliente MUST enviar asíncronamente una petición `PUT /api/profile` con `{ darkMode, language }` actualizada.

### Scenario 5: Resiliencia ante fallas de API remota
*   **Given** Un usuario autenticado en la aplicación.
*   **When** El usuario cambia una preferencia y la petición `PUT /api/profile` falla con un código de error de red o HTTP 500.
*   **Then** El cliente MUST mantener el cambio local intacto en la UI y en `preferencesService`.
*   **And** El cliente SHALL registrar el error en la consola sin interrumpir la navegación o flujo del usuario.
