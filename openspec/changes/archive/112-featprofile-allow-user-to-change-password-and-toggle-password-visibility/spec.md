# Specification: us-112-change-password-and-visibility

Esta especificación detalla las capacidades y escenarios requeridos para permitir a los usuarios ver su perfil, cambiar su contraseña y alternar la visibilidad de las contraseñas escritas.

---

## 1. Capabilities

*   **`render-user-profile`**: La aplicación debe mostrar la información básica del usuario logueado (nombre, email, rol) de forma clara y legible.
*   **`independent-password-visibility-toggle`**: La interfaz debe proveer botones interactivos bilingües al lado de cada campo de contraseña para enmascarar/desenmascarar de manera individual e independiente los caracteres escritos.
*   **`client-side-password-validation`**: La aplicación debe validar que todos los campos del formulario estén rellenados, que la nueva contraseña tenga una longitud mínima de 6 caracteres y que coincida exactamente con la confirmación, antes de realizar peticiones al servidor.
*   **`change-password-api-integration`**: La aplicación debe interactuar con el endpoint `PUT /auth/change-password` enviando la contraseña actual y la nueva contraseña en caso de validación exitosa.
*   **`form-state-reset-on-success`**: Al confirmarse el cambio de contraseña de forma exitosa, el formulario debe limpiarse por completo y mostrarse una confirmación visual.
*   **`error-feedback-handling`**: Los errores de validación de la API (como contraseña actual incorrecta) deben mostrarse claramente al usuario, manteniendo el estado de los campos del formulario intactos para su corrección.

---

## 2. Scenarios

### Scenario 1: Renderizar información del perfil de usuario
*   **Given** Un usuario autenticado con nombre `"Gonzalo"`, email `"gonzalo@example.com"` y rol `"usuario"`.
*   **When** El usuario ingresa a la ruta `/perfil`.
*   **Then** La aplicación MUST renderizar la página de Perfil.
*   **And** La aplicación MUST mostrar de solo lectura el nombre `"Gonzalo"`, el email `"gonzalo@example.com"` y el rol del usuario.

### Scenario 2: Alternar visibilidad de las contraseñas
*   **Given** Un usuario en la página `/perfil` con texto ingresado en el campo "Contraseña Actual".
*   **When** El usuario hace click en el botón de visibilidad (icono de ojo) al lado de este campo.
*   **Then** La aplicación MUST cambiar el tipo de input del campo de `"password"` a `"text"`.
*   **And** Al hacer click de nuevo, MUST revertir el tipo de input a `"password"`.
*   **And** La visibilidad de cada uno de los tres campos de contraseña MUST controlarse de manera independiente.

### Scenario 3: Validación de contraseñas no coincidentes
*   **Given** Un usuario en la página `/perfil` que ingresó una contraseña actual, e ingresó `"Nueva123"` en nueva contraseña y `"Diferente123"` en la confirmación.
*   **When** El usuario presiona el botón "Actualizar Contraseña".
*   **Then** La aplicación MUST cancelar el envío del formulario.
*   **And** La aplicación MUST mostrar un mensaje de error indicando que las contraseñas no coinciden.
*   **And** La aplicación MUST NOT realizar ninguna llamada a la API.

### Scenario 4: Validación de longitud de nueva contraseña
*   **Given** Un usuario en la página `/perfil` que ingresó `"123"` en el campo de nueva contraseña.
*   **When** El usuario presiona el botón "Actualizar Contraseña".
*   **Then** La aplicación MUST cancelar el envío del formulario.
*   **And** La aplicación MUST mostrar un mensaje de error indicando que la contraseña debe tener al menos 6 caracteres.
*   **And** La aplicación MUST NOT realizar ninguna llamada a la API.

### Scenario 5: Cambio de contraseña exitoso
*   **Given** Un usuario autenticado en la página `/perfil`.
*   **When** El usuario ingresa su contraseña actual correcta, una nueva contraseña válida (6+ caracteres), confirma correctamente la nueva contraseña y presiona "Actualizar Contraseña".
*   **Then** La aplicación MUST realizar una petición `PUT /auth/change-password` enviando la contraseña actual y la nueva contraseña.
*   **And** Ante una respuesta exitosa (HTTP 200), la aplicación MUST limpiar todos los campos del formulario.
*   **And** La aplicación MUST mostrar un mensaje temporal de confirmación exitosa.

### Scenario 6: Falla por contraseña actual incorrecta
*   **Given** Un usuario autenticado en la página `/perfil`.
*   **When** El usuario ingresa una contraseña actual incorrecta, contraseñas nuevas válidas y presiona "Actualizar Contraseña".
*   **Then** La aplicación MUST realizar la llamada a la API.
*   **And** Al recibir un error de credenciales incorrectas (HTTP 401), la aplicación MUST mostrar el mensaje de error correspondiente.
*   **And** La aplicación MUST mantener los datos ingresados en el formulario para permitir la corrección.
