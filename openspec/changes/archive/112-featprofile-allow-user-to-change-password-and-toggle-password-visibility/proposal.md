# Proposal: us-112-change-password-and-visibility

Esta propuesta define la implementación del formulario de cambio de contraseña para el usuario autenticado y la funcionalidad para alternar la visibilidad de las contraseñas escritas, integrando el endpoint existente del backend `/api/auth/change-password` de forma segura.

---

## 1. Context & Intent

Actualmente el usuario en HEXA puede iniciar sesión y registrarse, pero carece de un espacio personal (perfil de usuario) para administrar la seguridad de su cuenta. Para resolver esto, implementaremos la vista de Perfil y permitiremos al usuario cambiar su contraseña actual por una nueva. Para mejorar la experiencia de usuario (UX) y evitar errores tipográficos al escribir contraseñas complejas, daremos soporte para alternar la visibilidad de los caracteres escritos (texto plano / enmascarado) en los inputs del formulario.

---

## 2. Technical Scope

### 2.1 New Files
*   `src/pages/Profile.jsx`: Página de perfil que contiene la información básica del usuario (nombre, email, rol) y el formulario bilingüe de cambio de contraseña.
*   `src/pages/Profile.test.jsx`: Pruebas de integración de la vista, validación en el cliente, alternancia de visibilidad y envío asíncrono exitoso/fallido.

### 2.2 Modified Files
*   `src/services/authService.js`: Se incorporará el método `changePassword(currentPassword, newPassword)` para llamar a `PUT /auth/change-password`.
*   `src/services/authService.test.js`: Pruebas unitarias para validar las peticiones exitosas y el manejo de errores del nuevo método.
*   `src/App.jsx`: Definición de la ruta `/perfil` protegida con `ProtectedRoute`.
*   `src/components/Header.jsx`: Enlace directo a `/perfil` en los layouts de Desktop (tarjeta de usuario) y Mobile (enlace en el menú desplegable).
*   `src/components/Header.test.jsx`: Adaptaciones de mocks y tests para cubrir la presencia y navegabilidad al perfil.
*   `src/i18n/locales/es.json` y `src/i18n/locales/en.json`: Textos de traducción para toda la interfaz de perfil, errores y confirmaciones.

---

## 3. Implementation Approach

1.  **Formulario y Lógica de validación (Client-side)**:
    *   Campos: Contraseña Actual, Nueva Contraseña, Confirmar Nueva Contraseña.
    *   Validaciones:
        *   Todos los campos son obligatorios.
        *   La nueva contraseña debe tener al menos 6 caracteres.
        *   La nueva contraseña y la confirmación deben coincidir exactamente.
    *   Si las validaciones fallan en el cliente, se muestran los errores sin realizar ninguna petición HTTP.
2.  **Alternancia de Visibilidad (Toggle visibility)**:
    *   Cada campo tendrá su propio botón con un icono interactivo (ej. ojo / ojo tachado) que alterne el atributo `type` del input entre `"password"` y `"text"`.
3.  **Integración con el Backend**:
    *   Llamada a `authService.changePassword` enviando `{ currentPassword, newPassword }`.
    *   En caso de éxito (HTTP 200), se limpiará el formulario y se mostrará una notificación temporal de éxito.
    *   En caso de error (HTTP 400 / 401), se interpretarán los mensajes de error bilingües retornados por la API y se mostrarán en la UI.
4.  **UI Premium**:
    *   Diseño limpio y responsivo, usando sombras suaves, transiciones fluidas de color, botones dinámicos con estados de carga (disabled + spinner) y consistencia total con el Dark Mode.

---

## 4. Rollback & Risk Plan

*   **Riesgos de sesión expirada**: Si el token expira mientras el usuario está en el perfil, la llamada fallará con 401 y el interceptor de `apiClient` manejará automáticamente la redirección al login.
*   **Plan de Rollback**: Si surgen problemas mayores, se puede desvincular la ruta `/perfil` del enrutador de `App.jsx`, volviendo al flujo de layouts previo sin afectar el catálogo.
