# Spec: us-15-auth-flow-corrections

Esta especificación define el comportamiento detallado del flujo de navegación y protección de rutas en el cliente web de HEXA para la User Story 15.

---

## 1. Requirement: Flujo de Login tras Splash Screen
La aplicación web MUST redirigir al usuario al Login al cargarse inicialmente si no existe una sesión válida, una vez que el Splash Screen haya terminado.

### Scenario: Redirección automática de usuario anónimo tras Splash
*   **GIVEN** un usuario no autenticado que abre la aplicación web.
*   **WHEN** finaliza la transición del Splash Screen (`showSplash` pasa de `true` a `false`).
*   **THEN** el sistema MUST comprobar el estado de sesión activa.
*   **AND** redirigir inmediatamente al usuario a la página de `/login`.

---

## 2. Requirement: Protección de Rutas (ProtectedRoute)
Las rutas principales de la aplicación (catálogo `/`, detalle de cartas `/detalles/:id` y favoritos `/favoritos`) MUST requerir autenticación obligatoria.

### Scenario: Intento de acceso manual a ruta protegida por usuario anónimo
*   **GIVEN** un usuario no autenticado.
*   **WHEN** ingresa directamente por barra de direcciones a la ruta `/`, `/favoritos` o `/detalles/123`.
*   **THEN** el componente `ProtectedRoute` MUST interceptar la navegación.
*   **AND** redirigir de forma automática al usuario a `/login`, reemplazando el historial de navegación para evitar bucles.

### Scenario: Acceso permitido a ruta protegida por usuario autenticado
*   **GIVEN** un usuario autenticado (`isAuthenticated === true`).
*   **WHEN** navega a cualquier ruta protegida (Home, Favoritos o Detalle).
*   **THEN** el sistema MUST renderizar el contenido correspondiente normalmente sin redirecciones.

---

## 3. Requirement: Redirección post-Logout
Al cerrar la sesión del usuario, la interfaz de usuario MUST limpiar el estado y enviar al usuario a la pantalla de Login de forma explícita.

### Scenario: Cierre de sesión y redirección exitosa
*   **GIVEN** un usuario autenticado en cualquier página de la aplicación.
*   **WHEN** hace clic en el botón o enlace de "Cerrar Sesión" del Header.
*   **THEN** el sistema procesa el método `logout` limpiando los datos de sesión local.
*   **AND** redirige inmediatamente al usuario a la ruta `/login`.
